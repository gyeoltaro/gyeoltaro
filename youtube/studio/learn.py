"""매일 학습 엔진 — '어떤 영상이 떡상했는지' 수집·분석해서 백로그와 뇌구조에 쌓는다.

하는 일 (하루 한 번)
  1) 수집: 내 채널 + 벤치마크 채널의 전체 영상 조회수, 관심 키워드의 최근 2주 인기 영상
     - YouTube Data API 키가 있으면 API(정확한 날짜·좋아요·구독자 수)
     - 없으면 yt-dlp(공개 목록의 조회수)로 대체
  2) 분석: 채널 평균 대비 배수(아웃라이어), 하루 증가량, 구독자 대비 조회수로 '떡상' 판정
  3) 학습: 누적된 모든 영상으로 제목 패턴·길이·키워드별 효과(배수)를 다시 계산 → learning/model.json
  4) 기록: learning/backlog.json·backlog.md(매일 한 항목), brain_feed.json(뇌구조에 넣을 노드),
     latest.json(대시보드가 읽는 묶음)

사용법
  python -m studio.learn --daily            # 수집 + 분석 + 기록
  python -m studio.learn --analyze          # 이미 모은 데이터로 분석만 다시
  python -m studio.learn --daily --source ytdlp

API 키 위치: 환경변수 B911_YT_API_KEY 또는 youtube/.secrets/youtube_api_key.txt (저장소에 올라가지 않음)
"""
from __future__ import annotations

import argparse
import datetime as dt
import glob
import hashlib
import json
import os
import re
import shutil
import statistics
import subprocess
import time
import urllib.error
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LDIR = os.path.join(ROOT, "learning")
SECRET = os.path.join(ROOT, ".secrets", "youtube_api_key.txt")
KST = dt.timezone(dt.timedelta(hours=9))
API = "https://www.googleapis.com/youtube/v3/"

FEATURES = [
    ("all_about", "'~의 모든 것'", r"모든\s?것"),
    ("minutes", "'N분 만에'", r"\d+\s?분"),
    ("hours", "'N시간' 몰아보기", r"\d+\s?시간"),
    ("summary", "'총정리'", r"총정리|몰아보기"),
    ("quote", "따옴표 훅(“..”)", r"^\s*[“\"‘']"),
    ("why", "'~하는 이유'", r"이유"),
    ("how", "'~하는 방법'", r"방법"),
    ("shock", "'충격·소름·ㄷㄷ'", r"충격|소름|ㄷㄷ|경악"),
    ("crisis", "'위기·폭락·붕괴'", r"위기|폭락|붕괴|파산|몰락|IMF|대공황"),
    ("money", "금액 숫자(만·억·조 원)", r"\d[\d,\.]*\s?(만|억|조)\s?원?"),
    ("percent", "퍼센트 숫자", r"\d+\s?%"),
    ("easy", "'초등학생도 이해'", r"초등학생|쉽게|누구나"),
    ("question", "물음표", r"\?"),
    ("urgent", "'[긴급]/[속보]'", r"\[\s*(긴급|속보)\s*\]"),
]
DUR_BUCKETS = [(0, 900, "15분 미만"), (900, 1500, "15~25분"), (1500, 2400, "25~40분"),
               (2400, 3600, "40~60분"), (3600, 10 ** 7, "1시간 이상")]
JOSA = ["에서는", "으로는", "에서", "으로", "까지", "부터", "에게", "이란", "이라", "의", "이", "가", "은", "는",
        "을", "를", "에", "로", "과", "와", "도", "만", "들"]
STOP = set("""이유 방법 모든것 모든 진짜 충격적인 충격 소름 지금 이렇게 정말 무조건 절대 당신 우리 그리고 하는 있는 없는
되는 알아보는 알아보기 총정리 분만에 만에 시간 초등학생도 이해하는 영상 shorts 하나 이것 이거 것 ㄷㄷ 끝내는 알려주는
진짜이유 이것들만 사람들 사람 하면 해야 하나요 됩니다 합니다 입니다 없다 있다 했다 된다 한다 결국 바로 가장 모두 다시
가지 몰아보기 기초 the and 최고 최악 역대급 엄청난 미친듯이 급속도로 순식간에 그냥 사실 생각 부자들이 초등학생 쉽게
누구나 이해 분만 시간만 오늘 내일 어떻게 왜 뭐 무엇 이제 계속 모르면 알면 안되는 돈을 버는 만원""".split())
VERBISH = ("하", "하는", "되는", "보", "보는", "주", "주는", "내는", "하기", "되", "된", "한", "했", "하면", "해야", "려주",
           "아보", "끝내", "버는", "드는", "는데", "지는", "니다")


def now_kst():
    return dt.datetime.now(KST)


def today():
    return now_kst().date().isoformat()


def jload(path, default):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return default


def jsave(path, obj, indent=None):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, indent=indent)
    os.replace(tmp, path)


def api_key():
    k = os.environ.get("B911_YT_API_KEY", "").strip()
    if not k and os.path.exists(SECRET):
        k = open(SECRET, encoding="utf-8").read().strip()
    return k


def iso_secs(d):
    m = re.match(r"P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", d or "")
    if not m:
        return 0
    dd, h, mi, s = (int(x or 0) for x in m.groups())
    return dd * 86400 + h * 3600 + mi * 60 + s


# ======================================================================= 수집

class Api:
    def __init__(self, key):
        self.key = key
        self.units = 0

    def get(self, path, cost=1, **params):
        params["key"] = self.key
        url = API + path + "?" + urllib.parse.urlencode(params)
        for attempt in range(3):
            try:
                with urllib.request.urlopen(url, timeout=30) as r:
                    self.units += cost
                    return json.load(r)
            except urllib.error.HTTPError as e:
                body = e.read().decode("utf-8", "ignore")
                if e.code in (400, 403):
                    raise RuntimeError(f"YouTube API 오류 {e.code}: {body[:200]}")
                time.sleep(2 ** attempt)
            except urllib.error.URLError:
                time.sleep(2 ** attempt)
        raise RuntimeError(f"YouTube API 연결 실패: {path}")


def _videos_api(api, ids):
    out = {}
    for i in range(0, len(ids), 50):
        res = api.get("videos", part="snippet,statistics,contentDetails", id=",".join(ids[i:i + 50]))
        for v in res.get("items", []):
            s, sn = v.get("statistics", {}), v["snippet"]
            dur = iso_secs(v.get("contentDetails", {}).get("duration"))
            out[v["id"]] = {
                "title": sn["title"], "cid": sn["channelId"], "channel": sn.get("channelTitle", ""),
                "published": sn.get("publishedAt"), "duration": dur, "type": "short" if dur <= 180 else "long",
                "views": int(s.get("viewCount", 0)),
                "likes": int(s["likeCount"]) if "likeCount" in s else None,
                "comments": int(s["commentCount"]) if "commentCount" in s else None,
            }
    return out


def fetch_api(watch, key):
    api = Api(key)
    snap = {"source": "api", "channels": {}, "videos": {}, "search": {}, "channel_subs": {}}
    cids = [c["id"] for c in watch["channels"]]
    res = api.get("channels", part="snippet,statistics,contentDetails", id=",".join(cids))
    uploads = {}
    for c in res.get("items", []):
        st = c["statistics"]
        snap["channels"][c["id"]] = {"name": c["snippet"]["title"],
                                     "subs": None if st.get("hiddenSubscriberCount") else int(st.get("subscriberCount", 0)),
                                     "views": int(st.get("viewCount", 0)), "videos": int(st.get("videoCount", 0))}
        snap["channel_subs"][c["id"]] = snap["channels"][c["id"]]["subs"]
        uploads[c["id"]] = c["contentDetails"]["relatedPlaylists"]["uploads"]
    ids = []
    for cid, pl in uploads.items():
        tok, n = None, 0
        while n < watch.get("max_videos_per_channel", 200):
            kw = {"part": "contentDetails", "playlistId": pl, "maxResults": 50}
            if tok:
                kw["pageToken"] = tok
            page = api.get("playlistItems", **kw)
            ids += [it["contentDetails"]["videoId"] for it in page.get("items", [])]
            n += len(page.get("items", []))
            tok = page.get("nextPageToken")
            if not tok:
                break
    snap["videos"].update({k: dict(v, via="channel") for k, v in _videos_api(api, ids).items()})
    after = (now_kst() - dt.timedelta(days=watch.get("search_days", 14))).astimezone(dt.timezone.utc)
    sids = []
    for kw in watch.get("keywords", []):
        res = api.get("search", cost=100, part="snippet", q=kw, type="video", order="viewCount", regionCode="KR",
                      relevanceLanguage="ko", maxResults=watch.get("search_results", 15),
                      publishedAfter=after.strftime("%Y-%m-%dT%H:%M:%SZ"))
        found = [it["id"]["videoId"] for it in res.get("items", []) if it.get("id", {}).get("videoId")]
        snap["search"][kw] = found
        sids += found
    sids = [s for s in dict.fromkeys(sids) if s not in snap["videos"]]
    for k, v in _videos_api(api, sids).items():
        snap["videos"][k] = dict(v, via="search")
    other = list({v["cid"] for v in snap["videos"].values() if v["cid"] not in snap["channel_subs"]})
    for i in range(0, len(other), 50):
        res = api.get("channels", part="statistics", id=",".join(other[i:i + 50]))
        for c in res.get("items", []):
            st = c["statistics"]
            snap["channel_subs"][c["id"]] = None if st.get("hiddenSubscriberCount") else int(st.get("subscriberCount", 0))
    snap["units"] = api.units
    return snap


def _ytdlp_raw(url, limit, ko=False):
    exe = shutil.which("yt-dlp")
    if not exe:
        raise RuntimeError("yt-dlp가 없습니다 (pip install yt-dlp)")
    extra = ["--extractor-args", "youtube:lang=ko", "--extractor-args", "youtubetab:lang=ko"] if ko else []
    out = subprocess.run([exe, "--flat-playlist", "--dump-json", "--playlist-end", str(limit)] + extra + [url],
                         capture_output=True, text=True, timeout=300).stdout
    return [json.loads(l) for l in out.splitlines() if l.strip()]


def _ytdlp(url, limit):
    """조회수는 기본 응답에서, 제목은 한국어 응답에서 (한국어 응답에는 조회수가 빠지는 경우가 있음)"""
    rows = _ytdlp_raw(url, limit)
    try:
        ko = {r["id"]: r.get("title") for r in _ytdlp_raw(url, limit, ko=True)}
    except Exception:
        ko = {}
    for r in rows:
        if ko.get(r["id"]):
            r["title"] = ko[r["id"]]
    return rows


def fetch_ytdlp(watch):
    snap = {"source": "ytdlp", "channels": {}, "videos": {}, "search": {}, "channel_subs": {}}
    lim = watch.get("max_videos_per_channel", 200)
    for c in watch["channels"]:
        total, n = 0, 0
        for tab, typ in (("videos", "long"), ("shorts", "short")):
            try:
                rows = _ytdlp(f"https://www.youtube.com/channel/{c['id']}/{tab}", lim)
            except Exception as e:
                print(f"  [{c['name']}/{tab}] 수집 실패: {e}")
                rows = []
            for r in rows:
                dur = r.get("duration") or 0
                snap["videos"][r["id"]] = {
                    "title": r.get("title") or "", "cid": c["id"], "channel": c["name"], "published": None,
                    "duration": dur, "type": typ if typ == "short" else ("short" if 0 < dur <= 180 else "long"),
                    "views": r.get("view_count") or 0, "likes": None, "comments": None, "via": "channel"}
                total += r.get("view_count") or 0
                n += 1
        snap["channels"][c["id"]] = {"name": c["name"], "subs": None, "views": total, "videos": n}
    for kw in watch.get("keywords", []):
        try:
            rows = _ytdlp(f"ytsearch{watch.get('search_results', 15)}:{kw}", watch.get("search_results", 15))
        except Exception as e:
            print(f"  [검색 {kw}] 실패: {e}")
            rows = []
        snap["search"][kw] = [r["id"] for r in rows]
        for r in rows:
            if r["id"] in snap["videos"]:
                continue
            dur = r.get("duration") or 0
            snap["videos"][r["id"]] = {
                "title": r.get("title") or "", "cid": r.get("channel_id") or "", "channel": r.get("channel") or "",
                "published": None, "duration": dur, "type": "short" if 0 < dur <= 180 else "long",
                "views": r.get("view_count") or 0, "likes": None, "comments": None, "via": "search"}
    return snap


def store(snap, date):
    """index.json(영상 메타, 처음 본 날짜) + history/날짜.json(조회수)로 나눠 저장"""
    index = jload(os.path.join(LDIR, "index.json"), {})
    for vid, v in snap["videos"].items():
        old = index.get(vid, {})
        meta = {k: v[k] for k in ("title", "cid", "channel", "published", "duration", "type", "via")}
        if old.get("published") and not meta["published"]:
            meta["published"] = old["published"]
        if old.get("via") == "channel":
            meta["via"] = "channel"
        meta["first_seen"] = old.get("first_seen", date)
        index[vid] = meta
    jsave(os.path.join(LDIR, "index.json"), index)
    hist = {"date": date, "source": snap["source"], "channels": snap["channels"],
            "channel_subs": snap.get("channel_subs", {}), "search": snap.get("search", {}),
            "videos": {vid: [v["views"], v["likes"], v["comments"]] for vid, v in snap["videos"].items()}}
    jsave(os.path.join(LDIR, "history", f"{date}.json"), hist)
    return index, hist


# ======================================================================= 분석

def _median(xs, default=0.0):
    xs = [x for x in xs if x is not None]
    return statistics.median(xs) if xs else default


def age_days(meta, date):
    ref = dt.date.fromisoformat(date)
    if meta.get("published"):
        d = dt.datetime.fromisoformat(meta["published"].replace("Z", "+00:00")).astimezone(KST).date()
    else:
        d = dt.date.fromisoformat(meta.get("first_seen", date))
    return max(1, (ref - d).days + 1)


def features_of(title):
    return [k for k, _, rx in FEATURES if re.search(rx, title or "")]


def tokens(title):
    out = set()
    for w in re.findall(r"[가-힣A-Za-z]{2,}", title or ""):
        for j in JOSA:
            if w.endswith(j) and len(w) > len(j) + 1:
                w = w[: -len(j)]
                break
        if len(w) > 2 and w.endswith(VERBISH):
            continue
        if len(w) >= 2 and w not in STOP and w.lower() not in STOP:
            out.add(w)
    return out


def dur_bucket(sec):
    for a, b, lab in DUR_BUCKETS:
        if a <= sec < b:
            return lab
    return DUR_BUCKETS[-1][2]


def build_model(index, hist, watch):
    """감시 채널 롱폼 전체(채널별 중앙값으로 정규화)로 제목·길이·키워드 효과 계산"""
    watched = {c["id"] for c in watch["channels"]}
    views = hist["videos"]
    by_ch = {}
    for vid, m in index.items():
        if m["cid"] in watched and m["type"] == "long" and vid in views and views[vid][0]:
            by_ch.setdefault(m["cid"], []).append((vid, m, views[vid][0]))
    rows = []
    for cid, lst in by_ch.items():
        med = _median([v for *_, v in lst], 0)
        if med <= 0:
            continue
        for vid, m, v in lst:
            rows.append({"vid": vid, "m": m, "score": v / med})
    model = {"n_long": len(rows), "features": [], "durations": [], "keywords": []}
    if len(rows) < 8:
        return model
    base = _median([r["score"] for r in rows], 1) or 1
    for key, label, rx in FEATURES:
        w = [r["score"] for r in rows if re.search(rx, r["m"]["title"])]
        wo = [r["score"] for r in rows if not re.search(rx, r["m"]["title"])]
        if len(w) >= 4 and len(wo) >= 4:
            model["features"].append({"key": key, "label": label, "n": len(w),
                                      "lift": round(_median(w) / (_median(wo) or 1e-9), 2)})
    for a, b, lab in DUR_BUCKETS:
        w = [r["score"] for r in rows if a <= r["m"]["duration"] < b]
        if len(w) >= 3:
            model["durations"].append({"label": lab, "n": len(w), "lift": round(_median(w) / base, 2)})
    cnt = {}
    for r in rows:
        for t in tokens(r["m"]["title"]):
            cnt.setdefault(t, []).append(r["score"])
    for t, sc in cnt.items():
        if len(sc) >= 3:
            model["keywords"].append({"word": t, "n": len(sc), "lift": round(_median(sc) / base, 2)})
    model["features"].sort(key=lambda x: -x["lift"])
    model["durations"].sort(key=lambda x: -x["lift"])
    model["keywords"].sort(key=lambda x: (-x["lift"], -x["n"]))
    model["keywords"] = model["keywords"][:20]
    return model


def find_hot(index, hist, prev, watch, date):
    watched = {c["id"]: c for c in watch["channels"]}
    views = hist["videos"]
    pv = (prev or {}).get("videos", {})
    hot = []
    # 1) 감시 채널: 최근 영상 중 채널 평균 대비 배수 / 하루 증가량
    for cid in watched:
        for typ in ("long", "short"):
            vids = [(vid, m) for vid, m in index.items() if m["cid"] == cid and m["type"] == typ and vid in views
                    and views[vid][0] is not None]
            med = _median([views[v][0] for v, _ in vids if views[v][0]], 0)
            if not vids or med <= 0:
                continue
            gains = [(views[v][0] or 0) - (pv[v][0] or 0) for v, _ in vids if v in pv]
            gmed = _median([g for g in gains if g > 0], 0)
            for vid, m in vids:
                age = age_days(m, date)
                cur = views[vid][0] or 0
                score = cur / med
                gain = cur - (pv[vid][0] or 0) if vid in pv else None
                reasons = []
                if age <= watch.get("hot_days", 30) and score >= 1.5:
                    reasons.append(f"채널 평균의 {score:.1f}배")
                if gain and gmed and gain >= 3 * gmed and gain >= 100:
                    reasons.append(f"하루 +{gain:,}회")
                    score = max(score, gain / gmed)
                if reasons:
                    hot.append({"id": vid, "title": m["title"], "channel": m["channel"], "cid": cid, "type": typ,
                                "views": cur, "score": round(score, 1), "reason": " · ".join(reasons),
                                "age": age, "mine": watched[cid].get("role") == "mine", "via": "channel",
                                "tags": features_of(m["title"])})
    # 2) 키워드 검색: 구독자 대비 조회수(API) 또는 하루 평균 조회수(풀 중앙값 대비)
    subs = hist.get("channel_subs", {})
    pool = [(vid, index[vid]) for vid in {v for lst in hist.get("search", {}).values() for v in lst}
            if vid in index and vid in views and index[vid]["cid"] not in watched
            and re.search(r"[가-힣]", index[vid]["title"])]
    vpd_med = _median([(views[v][0] or 0) / age_days(m, date) for v, m in pool], 1) or 1
    for vid, m in pool:
        cur = views[vid][0] or 0
        age = age_days(m, date)
        sub = subs.get(m["cid"])
        if sub:
            ratio = cur / max(sub, 300)
            if ratio >= 1.0 and cur >= 3000:
                hot.append({"id": vid, "title": m["title"], "channel": m["channel"], "cid": m["cid"], "type": m["type"],
                            "views": cur, "score": round(ratio, 1), "reason": f"구독자 대비 조회수 {ratio:.1f}배",
                            "age": age, "mine": False, "via": "search", "tags": features_of(m["title"])})
        else:
            sc = (cur / age) / vpd_med
            if sc >= 2 and cur >= 3000:
                hot.append({"id": vid, "title": m["title"], "channel": m["channel"], "cid": m["cid"], "type": m["type"],
                            "views": cur, "score": round(sc, 1), "reason": f"검색 결과 평균 대비 {sc:.1f}배 빠름",
                            "age": age, "mine": False, "via": "search", "tags": features_of(m["title"])})
    hot.sort(key=lambda h: (-h["score"], -h["views"]))
    seen, out = set(), []
    for h in hot:
        if h["id"] not in seen:
            seen.add(h["id"])
            out.append(h)
    return out[: watch.get("hot_limit", 8)]


def my_summary(index, hist, prev, watch):
    mine = [c for c in watch["channels"] if c.get("role") == "mine"]
    if not mine:
        return {}
    cid = mine[0]["id"]
    ch = hist["channels"].get(cid, {})
    pch = (prev or {}).get("channels", {}).get(cid, {})
    pv = (prev or {}).get("videos", {})
    vids = [(vid, m) for vid, m in index.items() if m["cid"] == cid and vid in hist["videos"]]
    gainers = sorted(((hist["videos"][v][0] or 0) - (pv[v][0] or 0), v, m) for v, m in vids if v in pv)[::-1]
    longs = [hist["videos"][v][0] or 0 for v, m in vids if m["type"] == "long"]
    shorts = [hist["videos"][v][0] or 0 for v, m in vids if m["type"] == "short"]

    def d(k):
        return (ch.get(k) - pch.get(k)) if (ch.get(k) is not None and pch.get(k) is not None) else None

    return {"name": ch.get("name", mine[0]["name"]), "subs": ch.get("subs"), "subs_delta": d("subs"),
            "views": ch.get("views"), "views_delta": d("views"), "videos": ch.get("videos"),
            "long_median": _median(longs, 0), "short_median": _median(shorts, 0),
            "top_gainers": [{"id": v, "title": m["title"], "gain": g} for g, v, m in gainers[:3] if g > 0]}


def make_insights(model, mine, hot):
    ins = []
    for f in model["features"]:
        if f["lift"] >= 1.3:
            ins.append({"id": f"L_feat_{f['key']}", "kind": "format", "label": f"{f['label']} ×{f['lift']}",
                        "text": f"제목에 {f['label']} 패턴이 있으면 채널 평균 대비 조회수 {f['lift']}배 (표본 {f['n']}개)",
                        "weight": 3 if f["lift"] >= 2 else 2, "value": f["lift"]})
    for f in [x for x in model["features"] if x["lift"] <= 0.75][-2:]:
        ins.append({"id": f"L_feat_{f['key']}", "kind": "format", "label": f"{f['label']} ×{f['lift']} 주의",
                    "text": f"제목에 {f['label']} 패턴은 오히려 조회수 {f['lift']}배 (표본 {f['n']}개) — 피하는 게 좋음",
                    "weight": 1, "value": f["lift"]})
    if model["durations"]:
        b = model["durations"][0]
        ins.append({"id": "L_duration_best", "kind": "duration", "label": f"{b['label']} 영상 ×{b['lift']}",
                    "text": f"길이는 {b['label']}이(가) 가장 강함: 채널 중앙값 대비 {b['lift']}배 (표본 {b['n']}개)",
                    "weight": 2, "value": b["lift"]})
    kws = [k for k in model["keywords"] if k["lift"] >= 1.5][:3]
    if kws:
        ins.append({"id": "L_keywords", "kind": "keyword", "label": "떡상 키워드: " + ", ".join(k["word"] for k in kws),
                    "text": "조회수가 높게 나오는 키워드: " + ", ".join(f"{k['word']}(×{k['lift']}, {k['n']}개)" for k in kws),
                    "weight": 2, "value": kws[0]["lift"]})
    if mine and mine.get("short_median") and mine.get("long_median") is not None:
        r = mine["short_median"] / max(mine["long_median"], 1)
        if r >= 3:
            ins.append({"id": "L_mine_shorts", "kind": "mine", "label": f"내 쇼츠가 롱폼의 {r:.0f}배",
                        "text": f"내 채널 쇼츠 중앙값 {mine['short_median']:,.0f}회 vs 롱폼 {mine['long_median']:,.0f}회 → 쇼츠에서 롱폼으로 연결하는 장치 필요",
                        "weight": 2, "value": r})
    hot_ext = [h for h in hot if not h["mine"]]
    if hot_ext:
        tags = {}
        for h in hot_ext:
            for t in h["tags"]:
                tags[t] = tags.get(t, 0) + 1
        if tags:
            top = max(tags, key=tags.get)
            lab = dict((k, l) for k, l, _ in FEATURES)[top]
            ins.append({"id": "L_hot_pattern", "kind": "format", "label": f"오늘 떡상 공통점: {lab}",
                        "text": f"오늘 떡상 영상 {len(hot_ext)}개 중 {tags[top]}개가 {lab} 패턴", "weight": 1,
                        "value": tags[top]})
    return ins


def make_ideas(hot, model, covered, past_ideas):
    best_f = next((f for f in model["features"] if f["lift"] >= 1.3), None)
    best_d = model["durations"][0] if model["durations"] else None
    fmt = " + ".join(x for x in [best_f["label"] if best_f else "", best_d["label"] if best_d else ""] if x)
    kw_lift = {k["word"]: k["lift"] for k in model["keywords"]}
    ideas, used = [], set(past_ideas) | set(covered)
    for h in hot:
        if h["mine"]:
            continue
        cands = sorted(tokens(h["title"]), key=lambda t: (-kw_lift.get(t, 1.0), -len(t)))
        topic = next((t for t in cands if t not in used and not any(t in c or c in t for c in covered)), None)
        if not topic:
            continue
        used.add(topic)
        ideas.append({"id": "I_" + hashlib.sha1(topic.encode()).hexdigest()[:8], "topic": topic,
                      "label": f"아이디어: {topic}",
                      "text": f"'{h['title']}' ({h['channel']}) {h['reason']}. 추천 포맷: {fmt or '~의 모든 것 + 25~40분'}",
                      "video": h["id"]})
        if len(ideas) >= 3:
            break
    return ideas


def covered_topics():
    out = set()
    for sj in glob.glob(os.path.join(ROOT, "episodes", "*", "02_script.json")):
        if os.path.basename(os.path.dirname(sj)).startswith("_"):
            continue
        meta = jload(sj, {}).get("meta", {})
        out |= tokens(meta.get("title", ""))
    return out


def write_backlog_md(backlog):
    lines = ["# 매일 학습 백로그", "", "> `python -m studio.learn --daily` 가 매일 한 항목씩 추가합니다. 최신이 위.", ""]
    for e in reversed(backlog):
        m = e.get("mine") or {}
        lines += [f"## {e['date']} ({'API' if e['source'] == 'api' else 'yt-dlp'})", ""]
        if m:
            dl = lambda x: "" if x is None else f" ({x:+,})"
            lines.append(f"- 내 채널: 구독자 {m.get('subs') if m.get('subs') is not None else '-'}{dl(m.get('subs_delta'))}, "
                         f"총 조회수 {m.get('views') or 0:,}{dl(m.get('views_delta'))}")
        if e["hot"]:
            lines += ["", "**떡상 영상**", ""]
            for h in e["hot"]:
                lines.append(f"- ×{h['score']} [{h['title']}](https://www.youtube.com/watch?v={h['id']}) — {h['channel']} · {h['reason']}")
        if e["insights"]:
            lines += ["", "**오늘 배운 것**", ""] + [f"- {i['text']}" for i in e["insights"]]
        if e["ideas"]:
            lines += ["", "**아이디어**", ""] + [f"- {i['label']}: {i['text']}" for i in e["ideas"]]
        lines.append("")
    with open(os.path.join(LDIR, "backlog.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(lines))


def short_label(ins):
    """뇌구조에 넣을 짧은 이름 (예: '모든 것 ×2.0')"""
    lab = re.sub(r"[‘’'“”\"~]", "", ins["label"])
    lab = re.sub(r"^(제목|떡상 키워드|오늘 떡상 공통점):?\s*", "", lab)
    lab = lab.replace("의 모든 것", "모든 것").replace(" 몰아보기", "").replace("초등학생도 이해", "초등학생도")
    return lab if len(lab) <= 16 else lab[:15] + "…"


def analyze(date=None, quiet=False):
    watch = jload(os.path.join(LDIR, "watchlist.json"), None)
    files = sorted(glob.glob(os.path.join(LDIR, "history", "*.json")))
    if not files:
        raise SystemExit("수집된 데이터가 없습니다. 먼저 --daily 로 실행하세요.")
    if date:
        files = [f for f in files if os.path.basename(f)[:10] <= date]
    hist = jload(files[-1], {})
    prev = jload(files[-2], None) if len(files) >= 2 else None
    date = hist["date"]
    index = jload(os.path.join(LDIR, "index.json"), {})

    model = build_model(index, hist, watch)
    hot = find_hot(index, hist, prev, watch, date)
    mine = my_summary(index, hist, prev, watch)
    insights = make_insights(model, mine, hot)
    backlog = jload(os.path.join(LDIR, "backlog.json"), [])
    past_ideas = [i["topic"] for e in backlog if e["date"] != date for i in e.get("ideas", [])]
    ideas = make_ideas(hot, model, covered_topics(), past_ideas)
    entry = {"date": date, "source": hist["source"], "hot": hot, "mine": mine, "insights": insights, "ideas": ideas,
             "tracked": {"videos": len(hist["videos"]), "channels": len(hist["channels"]),
                         "keywords": list(hist.get("search", {}).keys())}}
    backlog = [e for e in backlog if e["date"] != date] + [entry]
    backlog.sort(key=lambda e: e["date"])
    jsave(os.path.join(LDIR, "backlog.json"), backlog, indent=1)
    jsave(os.path.join(LDIR, "model.json"), dict(model, updated=date), indent=1)
    write_backlog_md(backlog)

    # 뇌구조 피드: 오늘의 학습(해마) + 누적 아이디어(전두엽, 최근 8개)
    all_ideas = []
    for e in reversed(backlog):
        for i in e.get("ideas", []):
            if i["id"] not in {x["id"] for x in all_ideas}:
                all_ideas.append(dict(i, date=e["date"]))
    quota = {"format": 2, "duration": 1, "mine": 1, "keyword": 1}
    top_ins = []
    for i in insights:
        if quota.get(i["kind"], 0) > 0:
            top_ins.append(i)
            quota[i["kind"]] -= 1
    feed = [{"id": i["id"], "label": short_label(i), "region": "hippocampus", "weight": 1, "status": "done",
             "memo": f"[{date} 학습] {i['text']}", "auto": True, "date": date} for i in top_ins]
    feed += [{"id": i["id"], "label": i["topic"] + " 아이디어", "region": "frontal", "weight": 1, "status": "idea",
              "memo": f"[{i['date']} 학습] {i['text']}", "auto": True, "date": i["date"]} for i in all_ideas[:5]]
    jsave(os.path.join(LDIR, "brain_feed.json"), feed, indent=1)
    latest = {"updated": now_kst().isoformat(timespec="minutes"), "date": date, "source": hist["source"],
              "entries": backlog[-30:], "model": model, "feed": feed, "days": len(files)}
    jsave(os.path.join(LDIR, "latest.json"), latest)
    if not quiet:
        print(f"  분석 {date}: 떡상 {len(hot)}개, 배운 것 {len(insights)}개, 아이디어 {len(ideas)}개 (학습 일수 {len(files)}일)")
        for h in hot[:5]:
            print(f"   ×{h['score']:<5} {h['channel'][:10]:<10} {h['title'][:40]} — {h['reason']}")
        for i in insights:
            print("   ·", i["text"])
    return latest


def daily(source="auto", quiet=False):
    watch = jload(os.path.join(LDIR, "watchlist.json"), None)
    if not watch:
        raise SystemExit("learning/watchlist.json 이 없습니다")
    key = api_key()
    date = today()
    if source == "api" or (source == "auto" and key):
        if not key:
            raise SystemExit("API 키가 없습니다 (B911_YT_API_KEY 또는 .secrets/youtube_api_key.txt)")
        snap = fetch_api(watch, key)
        if not quiet:
            print(f"  수집(API): 영상 {len(snap['videos'])}개, 사용량 {snap.get('units')} units")
    else:
        snap = fetch_ytdlp(watch)
        if not quiet:
            print(f"  수집(yt-dlp): 영상 {len(snap['videos'])}개")
    if not snap["videos"]:
        raise SystemExit("수집된 영상이 없습니다 (네트워크/차단 확인)")
    store(snap, date)
    return analyze(date, quiet)


def main():
    ap = argparse.ArgumentParser(description="매일 학습 엔진")
    ap.add_argument("--daily", action="store_true", help="수집 + 분석 + 기록")
    ap.add_argument("--analyze", action="store_true", help="분석만 다시")
    ap.add_argument("--source", choices=["auto", "api", "ytdlp"], default="auto")
    args = ap.parse_args()
    if args.analyze:
        analyze()
    else:
        daily(args.source)


if __name__ == "__main__":
    main()
