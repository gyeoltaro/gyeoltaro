"""학습 → 기획 → 성적 → 보정 순환.

  1) recommend : 학습 결과로 '다음 영상'을 추천한다 (주제 수요, 제목 패턴 점수, 권장 길이)
  2) own_results: 내가 올린 영상의 조회수 궤적을 날짜별로 추적하고, 기획 때의 예측과 비교한다
  3) playbook  : 벤치마크 채널에서 배운 규칙(제목 패턴·길이 효과)에 '내 영상의 실제 성적'을 섞어 보정한다.
                 내 표본이 늘수록 내 데이터의 비중이 커지고, 규칙이 바뀐 이력(changelog)을 남긴다.

사람의 판단이 필요한 부분(제목 문구, 대본)은 만들지 않고, '무엇을 하면 잘 되는지' 근거와 점수를 줍니다.
이 모듈은 학습 엔진(studio.learn)이 매일 호출합니다.
"""
from __future__ import annotations

import datetime as dt
import glob
import json
import math
import os
import re
import statistics

from . import learn as L

OWN_PRIOR_K = 10      # 패턴 유/무 중 '적은 쪽' 그룹이 이만큼일 때 내 데이터와 벤치마크를 50:50으로 섞는다
MIN_OWN_GROUP = 3     # 패턴 유/무 각 그룹에 필요한 최소 내 영상 수
OWN_CLIP = (0.33, 3.0)  # 내 표본이 작아도 규칙이 한 번에 과하게 튀지 않도록 내 효과값의 범위를 제한
OWN_W_MAX = 0.7       # 내 데이터의 최대 반영 비중(나머지는 항상 벤치마크가 잡아 준다)
SKELETONS = [
    ("question_all", "“{hook}?” 초등학생도 이해하는 {topic}의 모든 것 ({n}분 총정리)"),
    ("quote_minutes_all", "“{hook}..” {n}분 만에 끝내는 {topic}의 모든 것"),
    ("all_summary", "{topic}의 모든 것 {n}분 총정리 (초등학생도 이해)"),
    ("quote_summary", "“{hook}..” {topic} {n}분 총정리"),
    ("minutes_all", "{n}분 만에 끝내는 {topic}의 모든 것"),
    ("why_question", "{topic}, 왜 {hook}? {n}분 만에 알아보기"),
]
HOOK_SAMPLE = "이거 모르면 손해 아닌가요"


def _hist_files():
    return sorted(glob.glob(os.path.join(L.LDIR, "history", "*.json")))


def _my_id(watch):
    for c in watch["channels"]:
        if c.get("role") == "mine":
            return c["id"]
    return None


def _episodes():
    out = []
    for sj in glob.glob(os.path.join(L.ROOT, "episodes", "*", "02_script.json")):
        d = os.path.basename(os.path.dirname(sj))
        if d.startswith("_"):
            continue
        meta = L.jload(sj, {}).get("meta", {})
        title = meta.get("title", "")
        core = re.sub(r"^\s*[“\"‘'].*?[”\"’']\s*", "", title).strip()
        out.append({"id": d, "episode": meta.get("episode", ""), "title": title, "core": core,
                    "plan": meta.get("plan") or {}})
    return sorted(out, key=lambda e: e["id"])


# ----------------------------------------------------------------- 1) 내 영상 성적 추적

def own_results(index, watch, date):
    mine = _my_id(watch)
    if not mine:
        return {"videos": [], "baseline": {}, "episodes": []}
    traj = {}
    for f in _hist_files():
        h = L.jload(f, {})
        for vid, row in h.get("videos", {}).items():
            if vid in index and index[vid]["cid"] == mine and row and row[0] is not None:
                traj.setdefault(vid, []).append((h["date"], row[0], row[1]))
    vids = []
    for vid, rows in traj.items():
        m = index[vid]
        age = L.age_days(m, date)
        views = rows[-1][1]
        vids.append({"id": vid, "title": m["title"], "type": m["type"], "published": m.get("published"),
                     "age": age, "views": views, "likes": rows[-1][2], "vpd": round(views / age, 1),
                     "traj": [[L.age_days(m, r[0]), r[1]] for r in rows][-30:]})
    base = {}
    for typ in ("long", "short"):
        ref = [v["views"] for v in vids if v["type"] == typ and v["age"] >= 14]
        base[typ] = statistics.median(ref) if ref else None
    for v in vids:
        b = base.get(v["type"])
        v["rel"] = round(v["views"] / b, 2) if (b and v["age"] >= 3) else None
    eps = []
    for e in _episodes():
        hit = next((v for v in vids if v["type"] == "long" and e["core"] and e["core"][:12] in v["title"]), None)
        pred = (e["plan"] or {}).get("predicted")
        row = {"id": e["id"], "episode": e["episode"], "title": e["title"], "predicted": pred,
               "predicted_at": (e["plan"] or {}).get("created"), "video": hit["id"] if hit else None}
        if hit:
            row.update({"age": hit["age"], "views": hit["views"], "vpd": hit["vpd"], "rel": hit["rel"], "traj": hit["traj"]})
            if pred and hit["rel"] is not None and hit["age"] >= 7:
                actual = "높음" if hit["rel"] >= 1.2 else "낮음" if hit["rel"] <= 0.8 else "비슷"
                expect = "높음" if pred >= 1.2 else "낮음" if pred <= 0.8 else "비슷"
                row["verdict"] = "적중" if actual == expect else "빗나감"
        eps.append(row)
    vids.sort(key=lambda v: v["published"] or "", reverse=True)
    return {"videos": vids, "baseline": base, "episodes": eps}


# ----------------------------------------------------------------- 2) 플레이북(규칙 보정)

def _own_lifts(own, watch):
    """내 롱폼(14일 이상 경과) 중 패턴이 있는/없는 영상의 중앙값 비교. 표본이 모자라면 None."""
    pool = [v for v in own["videos"] if v["type"] == "long" and v["age"] >= 14 and v["views"] > 0]
    out = {}
    if len(pool) < 2 * MIN_OWN_GROUP:
        return out
    for key, _label, rx in L.FEATURES:
        w = [v["views"] for v in pool if re.search(rx, v["title"])]
        wo = [v["views"] for v in pool if not re.search(rx, v["title"])]
        if len(w) >= MIN_OWN_GROUP and len(wo) >= MIN_OWN_GROUP:
            raw = statistics.median(w) / (statistics.median(wo) or 1e-9)
            out[key] = (min(OWN_CLIP[1], max(OWN_CLIP[0], raw)), len(w) + len(wo), min(len(w), len(wo)))
    return out


def build_playbook(model, own, watch, prev, date):
    prev_rules = {r["key"]: r for r in (prev or {}).get("rules", [])}
    own_l = _own_lifts(own, watch)
    rules, changelog = [], list((prev or {}).get("changelog", []))
    for f in model.get("features", []):
        b, bn = f["lift"], f["n"]
        o, on, mg = own_l.get(f["key"], (None, 0, 0))
        w = min(OWN_W_MAX, mg / (mg + OWN_PRIOR_K)) if o else 0.0
        blend = math.exp((1 - w) * math.log(max(b, 0.05)) + w * math.log(max(o, 0.05))) if o else b
        rule = {"key": f["key"], "label": f["label"], "bench_lift": b, "bench_n": bn,
                "own_lift": round(o, 2) if o else None, "own_n": on, "own_min_group": mg, "weight_own": round(w, 2),
                "lift": round(blend, 2), "status": "내 데이터 반영" if w > 0 else "벤치마크 기준"}
        old = prev_rules.get(f["key"])
        if old and abs(rule["lift"] - old["lift"]) / max(old["lift"], 0.01) >= 0.15:
            why = "내 영상 결과를 반영" if w > 0 else "벤치마크 표본이 늘면서 값이 바뀜"
            changelog.append({"date": date, "key": f["key"], "label": f["label"], "old": old["lift"], "new": rule["lift"], "why": why})
        if not old:
            changelog.append({"date": date, "key": f["key"], "label": f["label"], "old": None, "new": rule["lift"], "why": "새 규칙 추가"})
        rules.append(rule)
    changed = len(changelog) != len((prev or {}).get("changelog", []))
    version = (prev or {}).get("version", 0) + (1 if changed or not prev else 0)
    return {"version": version, "updated": date, "rules": rules, "changelog": changelog[-40:],
            "own_videos": len([v for v in own["videos"] if v["type"] == "long"]),
            "own_ready": len(own_l) > 0}


DAMP = [1.0, 0.6, 0.4, 0.25, 0.15, 0.1]   # 같은 영상에 겹쳐 나타나는 패턴의 효과를 이중으로 세지 않도록 줄여서 합친다


def score_title(title, playbook, minutes=None, model=None):
    """제목 점수(채널 평균 대비 예상 배수). 규칙의 lift를 로그로 바꿔 큰 것부터 감쇠 가중해 합친다."""
    contrib, hits = [], []
    for r in playbook["rules"]:
        rx = next((x for k, _l, x in L.FEATURES if k == r["key"]), None)
        if rx and re.search(rx, title or ""):
            sh = min(1.0, (r["bench_n"] + r["own_n"]) / 12)
            contrib.append(math.log(max(r["lift"], 0.05)) * sh)
            hits.append({"label": r["label"], "lift": r["lift"], "n": r["bench_n"] + r["own_n"]})
    dur = None
    if minutes and (model or {}).get("durations"):
        sec = minutes * 60
        for a, b, lab in L.DUR_BUCKETS:
            if a <= sec < b:
                dur = next((d for d in model["durations"] if d["label"] == lab), None)
        if dur:
            contrib.append(math.log(max(dur["lift"], 0.05)) * min(1.0, dur["n"] / 12))
    contrib.sort(key=lambda c: -abs(c))
    s = sum(c * (DAMP[i] if i < len(DAMP) else 0.05) for i, c in enumerate(contrib))
    return {"score": round(min(12.0, max(0.2, math.exp(s))), 2), "hits": hits, "duration": dur}


# ----------------------------------------------------------------- 3) 다음 영상 추천

def topic_demand(index, hist, watch, date, covered_words):
    views = hist["videos"]
    watched = {c["id"] for c in watch["channels"]}
    rows = []
    for kw, ids in hist.get("search", {}).items():
        vpd = []
        ex = []
        for vid in ids:
            m = index.get(vid)
            if not m or m["cid"] in watched or vid not in views or not re.search(r"[가-힣]", m["title"]):
                continue
            v = views[vid][0] or 0
            vpd.append(v / L.age_days(m, date))
            ex.append((v, m["title"], m["channel"], vid))
        if not vpd:
            continue
        ex.sort(reverse=True)
        rows.append({"keyword": kw, "demand": round(statistics.median(vpd), 1), "n": len(vpd),
                     "covered": any(w in kw or kw in w for w in covered_words),
                     "examples": [{"title": t, "channel": c, "views": v, "id": i} for v, t, c, i in ex[:2]]})
    if rows:
        med = statistics.median([r["demand"] for r in rows]) or 1
        for r in rows:
            r["rel"] = round(r["demand"] / med, 2)
    rows.sort(key=lambda r: -r["demand"])
    return rows


def recommend(index, hist, model, playbook, watch, date, hot):
    covered = set()
    for e in _episodes():
        covered |= L.tokens(e["core"])
    topics = topic_demand(index, hist, watch, date, covered)
    best_dur = None
    for d in model.get("durations", []):
        if d["n"] >= 10 and (not best_dur or d["lift"] > best_dur["lift"]):
            best_dur = d
    thin_dur = next((d for d in model.get("durations", []) if d["n"] < 10 and d["lift"] > (best_dur or {"lift": 1})["lift"]), None)
    solid = [r for r in playbook["rules"] if r["bench_n"] + r["own_n"] >= 8]       # 표본 8개 이상만 '근거 있는 규칙'
    thin = [r for r in playbook["rules"] if r["bench_n"] + r["own_n"] < 8]
    positive = sorted([r for r in solid if r["lift"] >= 1.3], key=lambda r: -r["lift"])[:5]
    negative = sorted([r for r in solid if r["lift"] <= 0.8], key=lambda r: r["lift"])[:3]
    maybe = sorted([r for r in thin if r["lift"] >= 1.3], key=lambda r: -r["lift"])[:3]
    n_min = {"15~25분": 20, "25~40분": 28, "40~60분": 45, "1시간 이상": 65}.get(best_dur["label"] if best_dur else "", 25)
    top_topic = next((t for t in topics if not t["covered"]), topics[0] if topics else None)
    cands = []
    topic_txt = (top_topic or {"keyword": "주제"})["keyword"]
    for key, tpl in SKELETONS:
        t = tpl.format(hook=HOOK_SAMPLE, topic=topic_txt, n=n_min)
        sc = score_title(t, playbook, n_min, model)
        cands.append({"skeleton": key, "template": tpl, "example": t, **sc})
    cands.sort(key=lambda c: -c["score"])
    return {"date": date, "topics": topics[:6], "top_topic": topic_txt, "length": {"best": best_dur, "thin": thin_dur, "target_min": n_min},
            "use": [{"label": r["label"], "lift": r["lift"], "n": r["bench_n"] + r["own_n"]} for r in positive],
            "avoid": [{"label": r["label"], "lift": r["lift"], "n": r["bench_n"] + r["own_n"]} for r in negative],
            "maybe": [{"label": r["label"], "lift": r["lift"], "n": r["bench_n"] + r["own_n"]} for r in maybe],
            "titles": cands[:6],
            "hot_patterns": sorted({t for h in hot for t in h.get("tags", [])})[:6],
            "chapters_min": 8}


def run(index, hist, model, hot, watch, date):
    """learn.analyze 가 호출. (recommend, own, playbook) 반환 + 파일 저장."""
    own = own_results(index, watch, date)
    prev = L.jload(os.path.join(L.LDIR, "playbook.json"), None)
    pb = build_playbook(model, own, watch, prev, date)
    rec = recommend(index, hist, model, pb, watch, date, hot)
    L.jsave(os.path.join(L.LDIR, "playbook.json"), pb, indent=1)
    L.jsave(os.path.join(L.LDIR, "own_results.json"), own, indent=1)
    L.jsave(os.path.join(L.LDIR, "recommend.json"), rec, indent=1)
    return rec, own, pb


def predict_episode(title, minutes):
    """기획 시점의 예측을 에피소드 meta.plan 에 박제하기 위한 도우미."""
    pb = L.jload(os.path.join(L.LDIR, "playbook.json"), None)
    model = L.jload(os.path.join(L.LDIR, "model.json"), {})
    if not pb:
        return None
    r = score_title(title, pb, minutes, model)
    return {"predicted": r["score"], "playbook_version": pb["version"], "created": L.today(),
            "minutes": minutes, "hits": [h["label"] for h in r["hits"]]}
