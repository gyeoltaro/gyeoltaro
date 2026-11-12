"""벤치마크 — 잘 되는 경제 해설 채널·영상을 조사해 우리 채널과 비교한다.

누가(어떤 모델이든, 사람이든) 다시 돌려도 같은 방식으로 최신 숫자를 얻도록 만든 도구입니다.

  python -m studio.benchmark profile              # 벤치마크 채널 10곳 + 우리 채널 다시 조사
                                                  #   → learning/benchmark.json, docs/04_benchmark_data.md
  python -m studio.benchmark discover             # 키워드 검색으로 후보 영상·채널 풀 갱신 (검색 1회 = 할당량 100)
                                                  #   → learning/benchmark_pool.json
  python -m studio.benchmark candidates           # 풀에서 후보 채널을 점수순으로 조사해 표로 출력 (채널 고를 때)
  python -m studio.benchmark topic "스태그플레이션"   # 주제별 상위 영상 (새 편 제목·훅을 정하기 전에)
                                                  #   → learning/topic_refs.json

API 키: 환경변수 B911_YT_API_KEY 또는 youtube/.secrets/youtube_api_key.txt (learn.py 와 같음). 키는 절대 출력·커밋하지 않습니다.
조사 대상 채널 목록은 learning/benchmark_channels.json 에서 관리합니다(사람이 고른 목록 — 형식이 우리와 같은 '얼굴 없는 해설' 채널).
남의 영상·썸네일·대본은 내려받아 쓰지 않고, 공개 숫자와 제목만 봅니다.
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import re
import statistics as st
import sys

from .learn import Api, KST, LDIR, ROOT, api_key, iso_secs, jload, jsave

CH_FILE = os.path.join(LDIR, "benchmark_channels.json")
OUT = os.path.join(LDIR, "benchmark.json")
POOL = os.path.join(LDIR, "benchmark_pool.json")
TOPICS = os.path.join(LDIR, "topic_refs.json")
DATA_MD = os.path.join(ROOT, "docs", "04_benchmark_data.md")
MY_CHANNEL = "UCm879ZUxkV6mqZFqNVUcwZg"

DISCOVER_QUERIES = ["경제 기초", "경제 공부", "금리", "환율", "물가 인플레이션", "주식 초보", "코스피", "반도체 주식",
                    "재테크", "경기침체", "미국 금리 연준", "부자 되는 법 돈 공부"]
EXCLUDE_TITLE = re.compile(r"라이브|LIVE|live|생방송|실시간")


def _now():
    return dt.datetime.now(KST)


def _api():
    k = api_key()
    if not k:
        raise SystemExit("API 키가 없습니다 (환경변수 B911_YT_API_KEY 또는 .secrets/youtube_api_key.txt)")
    return Api(k)


def _med(xs, default=0):
    xs = [x for x in xs if x is not None]
    return st.median(xs) if xs else default


def _videos(api, ids):
    out = []
    for i in range(0, len(ids), 50):
        res = api.get("videos", part="snippet,statistics,contentDetails", id=",".join(ids[i:i + 50]))
        for v in res.get("items", []):
            s, sn = v.get("statistics", {}), v["snippet"]
            desc = sn.get("description", "") or ""
            out.append({
                "id": v["id"], "title": sn["title"], "cid": sn["channelId"], "channel": sn.get("channelTitle", ""),
                "published": sn.get("publishedAt"), "sec": iso_secs(v.get("contentDetails", {}).get("duration")),
                "views": int(s.get("viewCount", 0)),
                "likes": int(s["likeCount"]) if "likeCount" in s else None,
                "comments": int(s["commentCount"]) if "commentCount" in s else None,
                "desc_len": len(desc),
                "chapters": len(re.findall(r"(?m)^\s*\(?\d{1,2}:\d{2}(?::\d{2})?\)?\s", desc)),
                "ai_note": bool(re.search(r"AI|인공지능|TTS|합성", desc)),
                "src_note": bool(re.search(r"출처|참고|자료", desc)),
                "tags": len(sn.get("tags", []) or []),
            })
    return out


def _channels(api, cids):
    out = {}
    for i in range(0, len(cids), 50):
        res = api.get("channels", part="snippet,statistics,contentDetails", id=",".join(cids[i:i + 50]))
        for c in res.get("items", []):
            s = c.get("statistics", {})
            out[c["id"]] = {
                "id": c["id"], "name": c["snippet"]["title"], "created": c["snippet"].get("publishedAt"),
                "subs": int(s.get("subscriberCount", 0) or 0), "views": int(s.get("viewCount", 0) or 0),
                "videos": int(s.get("videoCount", 0) or 0),
                "uploads": c["contentDetails"]["relatedPlaylists"]["uploads"],
            }
    return out


def _uploads(api, playlist, limit=300):
    ids, token = [], None
    while len(ids) < limit:
        p = {"part": "contentDetails", "playlistId": playlist, "maxResults": 50}
        if token:
            p["pageToken"] = token
        try:
            r = api.get("playlistItems", **p)
        except RuntimeError:
            break
        ids += [it["contentDetails"]["videoId"] for it in r.get("items", [])]
        token = r.get("nextPageToken")
        if not token:
            break
    return ids[:limit]


def _days(iso, now=None):
    now = now or _now()
    t = dt.datetime.fromisoformat(iso.replace("Z", "+00:00"))
    return max(0.0, (now - t).total_seconds() / 86400)


def title_stats(titles):
    n = max(1, len(titles))
    f = lambda pat: round(sum(bool(re.search(pat, t)) for t in titles) / n, 2)
    return {
        "len_med": _med([len(t) for t in titles]),
        "digit": f(r"\d"), "list": f(r"\d+\s*가지|TOP ?\d|Top ?\d|\d+\s*개"), "question": f(r"\?"),
        "quote": f(r"[\"“”'‘’]"), "bar": f(r"[|ㅣ│]"), "bracket": f(r"[\[\(【]"), "hashtag": f(r"#"),
        "why": f(r"이유|왜"), "truth": f(r"진짜|진실|비밀|숨기"), "money": f(r"부자|돈|억|월급"),
        "crisis": f(r"위기|몰락|폭락|붕괴|망|무너|끝났|충격|처참|경고"),
    }


def profile(api, ch, limit=300):
    """채널 한 곳의 최근 업로드(최대 limit개)로 지표를 계산한다."""
    vids = _videos(api, _uploads(api, ch["uploads"], limit))
    now = _now()
    for v in vids:
        v["age"] = round(_days(v["published"], now), 1)
    longs = [v for v in vids if v["sec"] > 180 and not EXCLUDE_TITLE.search(v["title"])]
    shorts = [v for v in vids if v["sec"] <= 180]
    longs.sort(key=lambda v: v["age"])
    lv = [v["views"] for v in longs]
    recent = [v for v in longs if v["age"] <= 90]
    settled = [v for v in longs if 7 <= v["age"] <= 365] or longs   # 일주일 이상 지난 영상만(조회수가 자리를 잡은 것)
    med = _med([v["views"] for v in settled])
    first_age = max([v["age"] for v in vids], default=0)
    hours = {}
    wd = {}
    for v in longs[:60]:
        t = dt.datetime.fromisoformat(v["published"].replace("Z", "+00:00")).astimezone(KST)
        hours[t.hour] = hours.get(t.hour, 0) + 1
        wd[t.weekday()] = wd.get(t.weekday(), 0) + 1
    top = sorted(longs, key=lambda v: -v["views"])[:8]
    monthly = {}
    for v in longs:
        monthly.setdefault(v["published"][:7], []).append(v["views"])
    return {
        "id": ch["id"], "name": ch["name"], "subs": ch["subs"], "total_views": ch["views"], "video_count": ch["videos"],
        "created": (ch.get("created") or "")[:10], "fetched": len(vids), "complete": len(vids) >= ch["videos"] - 2,
        "first_upload_days_ago": round(first_age), "long_n": len(longs), "short_n": len(shorts),
        "long_med_views": round(med), "long_p75_views": round(st.quantiles([v["views"] for v in settled], n=4)[2]) if len(settled) >= 4 else round(med),
        "long_max_views": max(lv, default=0),
        "med_per_sub": round(med / max(ch["subs"], 1), 2),
        "hit_100k": sum(v >= 100000 for v in lv), "hit_rate_3x": round(sum(v >= 3 * med for v in lv) / max(1, len(lv)), 2) if med else 0,
        "long_med_min": round(_med([v["sec"] for v in longs]) / 60, 1),
        "per_week_90d": round(len(recent) / (90 / 7), 1),
        "recent10_med": round(_med([v["views"] for v in longs if v["age"] >= 5][:10])),
        "views_30d_uploads": sum(v["views"] for v in longs if v["age"] <= 30),
        "short_med_views": round(_med([v["views"] for v in shorts])),
        "like_rate": round(_med([v["likes"] / v["views"] for v in settled if v["likes"] is not None and v["views"] > 0]) * 100, 2),
        "comment_rate": round(_med([v["comments"] / v["views"] for v in settled if v["comments"] is not None and v["views"] > 0]) * 100, 3),
        "chapters_share": round(sum(v["chapters"] >= 3 for v in longs) / max(1, len(longs)), 2),
        "ai_note_share": round(sum(v["ai_note"] for v in longs) / max(1, len(longs)), 2),
        "src_note_share": round(sum(v["src_note"] for v in longs) / max(1, len(longs)), 2),
        "desc_len_med": round(_med([v["desc_len"] for v in longs])),
        "top_hours_kst": sorted(hours, key=lambda h: -hours[h])[:3], "weekdays": wd,
        "titles": title_stats([v["title"] for v in longs]),
        "monthly": [{"ym": k, "n": len(x), "med": round(_med(x))} for k, x in sorted(monthly.items())][-7:],
        "top": [{"id": v["id"], "title": v["title"], "views": v["views"], "min": round(v["sec"] / 60), "date": v["published"][:10]} for v in top],
        "latest": [{"id": v["id"], "title": v["title"], "views": v["views"], "min": round(v["sec"] / 60), "date": v["published"][:10]} for v in longs[:12]],
    }


# ---------------------------------------------------------------- 명령

def cmd_discover(args):
    api = _api()
    after = (_now() - dt.timedelta(days=args.days)).astimezone(dt.timezone.utc).strftime("%Y-%m-%dT00:00:00Z")
    pool = jload(POOL, {"videos": {}})
    found = {}
    for q in (args.q or DISCOVER_QUERIES):
        r = api.get("search", cost=100, part="snippet", q=q, type="video", order="viewCount", regionCode="KR",
                    relevanceLanguage="ko", publishedAfter=after, videoDuration="long", maxResults=50)
        for it in r.get("items", []):
            found.setdefault(it["id"]["videoId"], q)
        print(f"  검색 '{q}': {len(r.get('items', []))}개")
    vids = _videos(api, list(found))
    chs = _channels(api, sorted({v["cid"] for v in vids}))
    for v in vids:
        if not re.search("[가-힣]", v["title"]):
            continue
        v["subs"] = chs.get(v["cid"], {}).get("subs", 0)
        v["ratio"] = round(v["views"] / max(v["subs"], 1000), 2)
        v["query"] = found[v["id"]]
        pool["videos"][v["id"]] = v
    pool["updated"] = _now().strftime("%Y-%m-%d")
    jsave(POOL, pool, indent=1)
    print(f"풀: 영상 {len(pool['videos'])}개 (API 사용량 {api.units})")


def _pool_channels(pool, min_ratio=3.0, min_views=50000):
    agg = {}
    for v in pool["videos"].values():
        if EXCLUDE_TITLE.search(v["title"]):
            continue
        a = agg.setdefault(v["cid"], {"cid": v["cid"], "name": v["channel"], "subs": v.get("subs", 0), "n": 0, "hits": 0, "best": 0})
        a["n"] += 1
        a["best"] = max(a["best"], v["ratio"])
        if v["ratio"] >= min_ratio and v["views"] >= min_views:
            a["hits"] += 1
    return sorted(agg.values(), key=lambda a: (-a["hits"], -a["best"]))


def cmd_candidates(args):
    api = _api()
    pool = jload(POOL, {"videos": {}})
    cands = [a for a in _pool_channels(pool) if a["hits"] >= 1 or a["cid"] in (args.include or [])][:args.n]
    chs = _channels(api, [a["cid"] for a in cands] + list(args.include or []))
    rows = []
    for cid, ch in chs.items():
        try:
            rows.append(profile(api, ch, limit=args.limit))
        except Exception as e:  # 채널 하나가 실패해도 계속
            print("  실패:", ch["name"], type(e).__name__)
    rows.sort(key=lambda p: -p["med_per_sub"])
    jsave(os.path.join(LDIR, "benchmark_candidates.json"), {"date": _now().strftime("%Y-%m-%d"), "channels": rows}, indent=1)
    print(f"{'채널':<18}{'구독':>8}{'롱폼':>5}{'중앙조회':>9}{'배수':>6}{'10만+':>6}{'주당':>5}{'분':>5}{'첫업로드(일전)':>10}")
    for p in rows:
        print(f"{p['name'][:16]:<18}{p['subs']:>8,}{p['long_n']:>5}{p['long_med_views']:>9,}{p['med_per_sub']:>6}{p['hit_100k']:>6}"
              f"{p['per_week_90d']:>5}{p['long_med_min']:>5}{p['first_upload_days_ago']:>8}{'' if p['complete'] else '+'}")
    print(f"(API 사용량 {api.units})")


def cmd_profile(args):
    api = _api()
    cfg = jload(CH_FILE, {"channels": []})
    ids = [c["id"] for c in cfg["channels"]]
    chs = _channels(api, ids + [MY_CHANNEL])
    out = {"date": _now().strftime("%Y-%m-%d"), "channels": []}
    for c in cfg["channels"]:
        if c["id"] not in chs:
            print("  채널을 찾지 못함:", c.get("name"))
            continue
        p = profile(api, chs[c["id"]])
        p["why"] = c.get("why", "")
        p["format"] = c.get("format", "")
        out["channels"].append(p)
        print(f"  {p['name']}: 구독 {p['subs']:,} · 롱폼 중앙 {p['long_med_views']:,}회")
    if MY_CHANNEL in chs:
        out["mine"] = profile(api, chs[MY_CHANNEL])
    jsave(OUT, out, indent=1)
    write_data_md(out)
    print(f"저장: {OUT}, {DATA_MD} (API 사용량 {api.units})")


def cmd_topic(args):
    api = _api()
    after = (_now() - dt.timedelta(days=args.days)).astimezone(dt.timezone.utc).strftime("%Y-%m-%dT00:00:00Z")
    refs = jload(TOPICS, {})
    for q in args.q:
        ids = []
        for dur in ("long", "medium"):
            r = api.get("search", cost=100, part="snippet", q=q, type="video", order="viewCount", regionCode="KR",
                        relevanceLanguage="ko", publishedAfter=after, videoDuration=dur, maxResults=25)
            ids += [it["id"]["videoId"] for it in r.get("items", [])]
        vids = [v for v in _videos(api, list(dict.fromkeys(ids))) if re.search("[가-힣]", v["title"]) and not EXCLUDE_TITLE.search(v["title"])]
        chs = _channels(api, sorted({v["cid"] for v in vids}))
        for v in vids:
            v["subs"] = chs.get(v["cid"], {}).get("subs", 0)
            v["ratio"] = round(v["views"] / max(v["subs"], 1000), 2)
        vids.sort(key=lambda v: -v["views"])
        refs[q] = {"date": _now().strftime("%Y-%m-%d"), "days": args.days,
                   "videos": [{k: v[k] for k in ("id", "title", "channel", "views", "subs", "ratio", "sec", "published")} for v in vids[:25]]}
        print(f"\n■ {q} — 최근 {args.days}일 조회수 상위 (조회수 / 구독자 대비 배수 / 길이 / 채널)")
        for v in vids[:args.n]:
            print(f"  {v['views']:>9,}  x{v['ratio']:<6} {round(v['sec'] / 60):>3}분  {v['channel'][:10]:<10} | {v['title'][:58]}")
    jsave(TOPICS, refs, indent=1)
    print(f"\n저장: {TOPICS} (API 사용량 {api.units})")


def write_data_md(out):
    """숫자 표만 자동으로 만든다. 해석과 결론은 docs/04_benchmark.md 에 사람이(모델이) 쓴다."""
    L = [f"# 벤치마크 숫자 (자동 생성 · {out['date']})", "",
         "> `python -m studio.benchmark profile` 이 만든 표입니다. 직접 고치지 마세요. 해석은 `04_benchmark.md` 에 있습니다.",
         "> 롱폼 = 3분 초과 영상. 중앙 조회수는 올린 지 7일~1년 된 롱폼 기준. '배수' = 중앙 조회수 ÷ 구독자 수.", "",
         "| 채널 | 구독자 | 롱폼 수 | 중앙 조회수 | 배수 | 10만↑ 영상 | 주당 업로드(90일) | 길이 중앙(분) | 최근 10편 중앙 | 첫 업로드 |",
         "|---|---:|---:|---:|---:|---:|---:|---:|---:|---|"]
    rows = list(out["channels"]) + ([dict(out["mine"], name="**우리 채널**")] if out.get("mine") else [])
    for p in rows:
        L.append(f"| {p['name']} | {p['subs']:,} | {p['long_n']} | {p['long_med_views']:,} | {p['med_per_sub']} | {p['hit_100k']} | "
                 f"{p['per_week_90d']} | {p['long_med_min']} | {p['recent10_med']:,} | {p['first_upload_days_ago']}일 전{'' if p['complete'] else ' 이상'} |")
    L += ["", "## 제목 습관 (롱폼 제목 중 해당 비율)", "",
          "| 채널 | 글자 수(중앙) | 숫자 | N가지·TOP | 물음표 | 따옴표 | 세로줄 | 이유·왜 | 진짜·비밀 | 부자·돈 | 위기·몰락 |", "|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|"]
    for p in rows:
        t = p["titles"]
        L.append(f"| {p['name']} | {t['len_med']:.0f} | {t['digit']:.0%} | {t['list']:.0%} | {t['question']:.0%} | {t['quote']:.0%} | {t['bar']:.0%} | "
                 f"{t['why']:.0%} | {t['truth']:.0%} | {t['money']:.0%} | {t['crisis']:.0%} |")
    L += ["", "## 설명란·운영 습관", "", "| 채널 | 챕터 넣는 비율 | AI 사용 언급 | 출처 언급 | 설명 길이(중앙) | 좋아요율 | 댓글율 | 주로 올리는 시각(KST) | 쇼츠 수 |", "|---|---:|---:|---:|---:|---:|---:|---|---:|"]
    for p in rows:
        L.append(f"| {p['name']} | {p['chapters_share']:.0%} | {p['ai_note_share']:.0%} | {p['src_note_share']:.0%} | {p['desc_len_med']:,} | "
                 f"{p['like_rate']}% | {p['comment_rate']}% | {', '.join(str(h) + '시' for h in p['top_hours_kst'])} | {p['short_n']} |")
    L += ["", "## 올린 달별 흐름 (그달에 올린 롱폼 수 / 그 영상들의 중앙 조회수)", "",
          "> 최근 달일수록 조회수가 덜 쌓였다는 점을 감안해서 보세요. 그래도 몇십 배 차이는 '꺾였다'는 신호입니다.", ""]
    months = sorted({m["ym"] for p in rows for m in p.get("monthly", [])})[-6:]
    L += ["| 채널 | " + " | ".join(months) + " |", "|---|" + "---:|" * len(months)]
    for p in rows:
        mm = {m["ym"]: m for m in p.get("monthly", [])}
        L.append(f"| {p['name']} | " + " | ".join(f"{mm[k]['n']}편 / {mm[k]['med']:,}" if k in mm else "–" for k in months) + " |")
    L += ["", "## 채널별 조회수 상위 영상", ""]
    for p in out["channels"]:
        L.append(f"### {p['name']} (구독 {p['subs']:,})")
        for v in p["top"][:6]:
            L.append(f"- {v['views']:,}회 · {v['min']}분 · {v['date']} · [{v['title']}](https://youtu.be/{v['id']})")
        L.append("")
    os.makedirs(os.path.dirname(DATA_MD), exist_ok=True)
    with open(DATA_MD, "w", encoding="utf-8") as f:
        f.write("\n".join(L) + "\n")


def main(argv=None):
    ap = argparse.ArgumentParser(description="벤치마크 조사")
    sub = ap.add_subparsers(dest="cmd", required=True)
    a = sub.add_parser("discover"); a.add_argument("--q", nargs="*"); a.add_argument("--days", type=int, default=365); a.set_defaults(fn=cmd_discover)
    a = sub.add_parser("candidates"); a.add_argument("--n", type=int, default=30); a.add_argument("--limit", type=int, default=150)
    a.add_argument("--include", nargs="*"); a.set_defaults(fn=cmd_candidates)
    a = sub.add_parser("profile"); a.set_defaults(fn=cmd_profile)
    a = sub.add_parser("topic"); a.add_argument("q", nargs="+"); a.add_argument("--days", type=int, default=365); a.add_argument("--n", type=int, default=15)
    a.set_defaults(fn=cmd_topic)
    args = ap.parse_args(argv)
    args.fn(args)


if __name__ == "__main__":
    main(sys.argv[1:])
