"""자동 품질 점검 — 대본(02_script.json)이 이 채널의 기준을 지키는지 기계적으로 확인한다.

  python -m studio.check episodes/ep14_xxx            # 점검 (오류가 있으면 종료 코드 1)
  python -m studio.check episodes/ep14_xxx --quick    # 음성 합성 없이 글자·구조만

누가 대본을 쓰든 같은 기준을 통과하게 하려는 도구입니다. 지금까지 실제로 겪은 실수를 하나씩 규칙으로 옮겼습니다.
'오류'는 반드시 고친 뒤 다음 단계로 가고, '경고'는 하나씩 읽고 고칠지 판단합니다(판단 이유를 보고에 적기).
기준 숫자를 바꾸려면 아래 상수를 고치고, 왜 바꿨는지 docs/PLAYBOOK.md '바뀐 기록'에 적으세요.
"""
from __future__ import annotations

import argparse
import copy
import glob
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ---------------------------------------------------------------- 기준
TARGET_MIN = 30                 # 기본 목표 길이(분). META 의 target_min 으로 편마다 바꿀 수 있음
SCENE_WARN, SCENE_ERR = 55, 90  # 장면 하나의 길이(초)
STAGE_SHARE = 0.12              # 스토리 룩에서 이야기 장면(stage) 최소 비율
RUN_MAX = 7                     # 이야기 장면 없이 정보 장면만 이어지는 최대 개수
TITLE_WARN = 60                 # 제목 글자 수 (잘 된 영상 중앙값 44자)

# 제목·썸네일에 쓰지 않는 말: 감정 조작·낚시로 보일 수 있고(정책), 벤치마크에서도 성과가 낮았음
BANNED_TITLE = ["충격", "소름", "경악", "대참사", "떡상", "대박", "긴급", "속보", "무조건", "보장", "100%", "ㄷㄷ",
                "지금 사야", "사세요", "파세요", "추천주", "필수템"]
# 과거 사건을 사실대로 말할 때만 허용 (앞날을 예고하는 뜻으로는 금지)
CAUTION_TITLE = ["폭락", "붕괴", "몰락", "파산", "망한", "망했", "위기 온다", "온다"]
# 내레이션에 있으면 안 되는 말: 매수·매도 권유, 앞날 단정
ADVICE = re.compile(r"사세요|파세요|매수하세요|매도하세요|담으세요|추천합니다|추천드립니다|추천드려요|오를 겁니다|오를 것입니다|"
                    r"내릴 겁니다|내릴 것입니다|폭등할 것|폭락할 것|반드시 오릅니다|무조건 오릅니다|지금이 기회입니다|지금 사야")
POLITICS = ["민주당", "국민의힘", "공화당", "좌파", "우파"]
MODEL_NAMES = re.compile(r"\b(Opus|Sonnet|Haiku|Fable)\b|claude-[a-z]+-\d", re.I)
KEY_RX = re.compile(r"AIza[0-9A-Za-z_\-]{30,}")

LAYOUTS = {"left", "right", "corner", "center", "chapter", "stage", "none", "hidden"}
# 글자 수 권장 한도 (넘으면 줄 바꿈·겹침 가능 → 경고)
LIMITS = {
    ("chapter", "title"): 16, ("stage", "bubble"): 18, ("stage", "label"): 18,
    ("stamps", "stamp"): 8, ("ticker", "name"): 18, ("ticker", "chg_label"): 12,
    ("timeline", "label"): 15, ("timeline", "sub"): 18, ("timeline", "date"): 12,
    ("icongrid", "text"): 20, ("icongrid", "sub"): 24, ("bars", "label"): 22,
    ("donut", "label"): 20, ("dominoes", "text"): 20, ("calendar", "note"): 14,
}


class Report:
    def __init__(self):
        self.items = []

    def err(self, code, msg, where=""):
        self.items.append(("E", code, msg, where))

    def warn(self, code, msg, where=""):
        self.items.append(("W", code, msg, where))

    def info(self, msg):
        self.items.append(("I", "", msg, ""))

    @property
    def n_err(self):
        return sum(1 for i in self.items if i[0] == "E")

    @property
    def n_warn(self):
        return sum(1 for i in self.items if i[0] == "W")


def _say(ln):
    if isinstance(ln, dict):
        return ln.get("say") or ln.get("text") or ""
    return ln


def _shown(ln):
    return ln.get("text", "") if isinstance(ln, dict) else ln


def _walk_text(o, path=""):
    """그림 설정 안의 모든 글자 (경로, 값)."""
    if isinstance(o, dict):
        for k, v in o.items():
            yield from _walk_text(v, f"{path}.{k}" if path else k)
    elif isinstance(o, list):
        for i, v in enumerate(o):
            yield from _walk_text(v, f"{path}[{i}]")
    elif isinstance(o, str):
        yield path, o


def _walk_at(o, key=""):
    if isinstance(o, dict):
        for k, v in o.items():
            yield from _walk_at(v, k)
    elif isinstance(o, list):
        for v in o:
            yield from _walk_at(v, key)
    elif key.endswith("at") and key != "shake_at" and isinstance(o, (int, float)) and not isinstance(o, bool):
        yield o


def check_script(script, R: Report, ep_dir=None):
    meta, scenes = script.get("meta", {}), script.get("scenes", [])
    from .visuals import VISUALS
    raw = json.dumps(script, ensure_ascii=False)

    # ---- 필수 항목
    for k in ("episode", "title", "thumbnails", "upload"):
        if not meta.get(k):
            R.err("meta", f"META 에 '{k}' 가 없습니다")
    up = meta.get("upload", {}) or {}
    titles = [meta.get("title", "")] + list(up.get("alt_titles", []) or [])
    if len(titles) != 3:
        R.err("titles", f"제목은 A/B/C 세 개여야 합니다 (지금 {len(titles)}개: title + upload.alt_titles 2개)")
    if "{MIN}" in raw:
        R.err("min", "'{MIN}' 이 아직 채워지지 않았습니다 → `python -m studio.ep script <폴더>` 를 먼저 실행")
    if not scenes:
        R.err("scenes", "장면이 없습니다")
        return

    # ---- 구조
    if scenes[0].get("chapter") != "인트로":
        R.err("intro", "첫 장면의 chapter 는 '인트로' 여야 합니다")
    types = [s["visual"].get("type") for s in scenes]
    if "title" not in types[:9]:
        R.err("title-scene", "처음 9장면 안에 제목 장면(type: title)이 있어야 합니다")
    elif types.index("title") < 3:
        R.warn("triple", "제목 장면 앞에 질문 장면이 3개보다 적습니다 (삼중 약속 인트로: A·B·C 제목의 질문을 한 장면씩)")
    if types[-1] != "outro":
        R.err("outro", "마지막 장면은 type: outro 여야 합니다")
    n_ch = sum(1 for s in scenes if s.get("chapter"))
    if not 5 <= n_ch <= 11:
        R.warn("chapters", f"파트(chapter) 수가 {n_ch}개입니다 (권장 6~10개)")

    # ---- 장면별
    for i, s in enumerate(scenes):
        sid = s.get("id", f"#{i + 1}")
        v = s.get("visual", {})
        ty = v.get("type")
        lines = s.get("lines", [])
        if ty not in VISUALS:
            R.err("visual", f"없는 그림 종류 '{ty}' (docs/VISUALS.md 참고)", sid)
            continue
        if not lines:
            R.err("lines", "내레이션이 없습니다", sid)
        if s.get("mascot", {}).get("layout", "left") not in LAYOUTS:
            R.err("mascot", f"없는 캐릭터 배치 '{s['mascot'].get('layout')}'", sid)
        for p, t in _walk_text(v):
            if t.startswith("@"):
                R.err("at", f"등장 시점이 풀리지 않았습니다: {t}", sid)
            if "~" in t:
                R.err("tilde", f"화면 글자에 '~' (색 기호로 먹힘) → '–' 로: {t[:30]}", sid)
        n = len(lines)
        over = [a for a in _walk_at(v) if a >= n]
        if over:
            R.err("at-range", f"등장 시점 {over[:3]} 이(가) 줄 수({n})보다 큽니다 → '@줄:키워드' 로 다시 지정", sid)
        for ln in lines:
            if "~" in _shown(ln):
                R.err("tilde", f"자막에 '~' → {{'text': '–로 바꾼 글', 'say': '원문'}} (epkit 의 add 를 쓰면 자동)", sid)
            if ADVICE.search(_say(ln)):
                R.err("advice", f"권유·단정 표현: \"{ADVICE.search(_say(ln)).group(0)}\" — 전망·권유 금지", sid)
            if len(_say(ln)) > 230:
                R.warn("long-line", f"한 문장이 {len(_say(ln))}자입니다 (두 문장으로 나누면 화면과 말이 더 잘 맞습니다)", sid)
            for w in POLITICS:
                if w in _say(ln):
                    R.warn("politics", f"정치 관련 낱말 '{w}' — 사실 전달만 하는지, 어느 쪽도 평가하지 않는지 확인", sid)
        # 글자 수 한도
        if ty == "chapter" and len(v.get("title", "")) > LIMITS[("chapter", "title")]:
            R.warn("len", f"파트 제목 {len(v['title'])}자 (16자 이내 권장, 자동으로 작아지긴 함)", sid)
        for p, t in _walk_text(v):
            leaf = re.sub(r"\[\d+\]", "", p).split(".")[-1]
            lim = LIMITS.get((ty, leaf))
            if lim and len(t) > lim:
                R.warn("len", f"{ty}.{leaf} {len(t)}자 > 권장 {lim}자: \"{t[:24]}…\"", sid)
        if ty == "stage":
            if len(v.get("props", [])) > 3:
                R.warn("stage", "이야기 장면의 소품이 3개를 넘습니다 (글자가 겹칠 수 있음)", sid)
            for pr in v.get("props", []):
                if len(pr.get("text", "")) > 10:
                    R.warn("len", f"소품 글자 {len(pr['text'])}자 > 10자: \"{pr['text']}\"", sid)

    # ---- 고지·규정
    said = " ".join(_say(ln) for s in scenes for ln in s.get("lines", []))
    n_disc = len(re.findall(r"전망하지 않|전망이 아닙니다|전망하지는 않", said))
    if n_disc == 0:
        R.err("disclaimer", "'전망하지 않습니다' 라는 말이 영상에 한 번도 없습니다 (인트로와 아웃트로에 넣기)")
    elif n_disc < 2:
        R.warn("disclaimer", "'전망하지 않습니다' 가 1번뿐입니다 (인트로·아웃트로 2번 이상 권장)")
    outro = " ".join(_say(ln) for ln in scenes[-1].get("lines", []))
    if "투자 권유" not in outro:
        R.err("outro-note", "아웃트로에 '투자 권유가 아닙니다' 고지가 없습니다")
    if "기준" not in outro:
        R.warn("outro-date", "아웃트로에 숫자의 기준일(○월 ○일 기준) 안내가 없습니다")

    # ---- 제목
    for j, t in enumerate(titles):
        lab = "ABC"[j] if j < 3 else str(j)
        for w in BANNED_TITLE:
            if w in t:
                R.err("title-word", f"제목 {lab}에 쓰지 않는 말 '{w}'")
        for w in CAUTION_TITLE:
            if w in t:
                R.warn("title-word", f"제목 {lab}의 '{w}' — 과거 사실 묘사일 때만 허용(앞날 예고 금지)")
        if len(t) > TITLE_WARN:
            R.warn("title-len", f"제목 {lab} {len(t)}자 (잘 된 영상 중앙값 44자, {TITLE_WARN}자 이내 권장)")
        if len(t) > 100:
            R.err("title-len", f"제목 {lab} {len(t)}자 — 유튜브 한도 100자 초과")
    heads = [re.sub(r"\s", "", t)[:10] for t in titles]
    if len(set(heads)) < len(heads):
        R.err("titles", "제목 A/B/C 의 앞부분이 같습니다 — 서로 다른 각도의 질문이어야 합니다")

    # ---- 썸네일 글자
    th = meta.get("thumbnails", {}) or {}
    if sorted(th) != ["A", "B", "C"]:
        R.err("thumbs", "썸네일 설정은 A, B, C 세 개여야 합니다")
    for k, t in th.items():
        txt = " ".join(str(t.get(f, "")) for f in ("top", "main", "note", "num", "quote")) + " " + " ".join(t.get("tags", []) or [])
        for w in BANNED_TITLE:
            if w in txt:
                R.err("thumb-word", f"썸네일 {k}에 쓰지 않는 말 '{w}'")
        if "~" in txt:
            R.warn("tilde", f"썸네일 {k} 글자에 '~' (자동으로 '–' 로 바뀜)")

    # ---- 업로드 정보
    if len(up.get("sources", []) or []) < 3:
        R.err("sources", "출처(upload.sources)가 3개보다 적습니다")
    if not up.get("pinned"):
        R.err("pinned", "고정 댓글(upload.pinned)이 없습니다")
    if not up.get("intro"):
        R.err("intro-text", "설명란 첫 문단(upload.intro)이 없습니다")
    elif "※" not in up["intro"] and "기준" not in up["intro"]:
        R.warn("intro-text", "설명란 첫 문단에 기준일 안내(※ ○월 ○일 기준)가 없습니다")
    nt = len(up.get("tags", []) or [])
    if not 8 <= nt <= 20:
        R.warn("tags", f"태그 {nt}개 (8~20개 권장)")

    # ---- 리듬 (스토리 룩)
    if meta.get("look") == "story":
        n_stage = types.count("stage")
        if n_stage / len(scenes) < STAGE_SHARE:
            R.warn("stage-share", f"이야기 장면이 {n_stage}/{len(scenes)}개 ({n_stage / len(scenes):.0%}) — {STAGE_SHARE:.0%} 이상 권장")
        run = best = 0
        for t in types:
            run = 0 if t in ("stage", "chapter", "title", "outro") else run + 1
            best = max(best, run)
        if best > RUN_MAX:
            R.warn("run", f"정보 장면이 {best}개 연속입니다 — 사이에 이야기 장면(stage)을 넣어 리듬을 바꾸세요 (최대 {RUN_MAX}개 권장)")

    if MODEL_NAMES.search(raw):
        R.warn("model-name", "대본에 AI 모델 이름이 들어 있습니다 — 저장소 파일에는 모델 이름을 쓰지 않습니다 ('AI(Claude)의 도움' 정도만)")

    # ---- 기획서·사실 확인
    if ep_dir:
        plan = os.path.join(ep_dir, "01_plan.md")
        if not os.path.exists(plan):
            R.err("plan", "01_plan.md (기획서·사실 확인표)가 없습니다")
        else:
            ptxt = open(plan, encoding="utf-8").read()
            if "사실 확인" not in ptxt:
                R.err("plan", "01_plan.md 에 '사실 확인표'가 없습니다")
            nw = sum(1 for ln in ptxt.splitlines() if "⚠️" in ln and not ln.lstrip().startswith(">"))
            R.info(f"사실 확인표: 원문 대조 못 한 항목(⚠️) {nw}줄 — 영상에서 '보도·대략값'으로 완충했는지 확인")
        for f in glob.glob(os.path.join(ep_dir, "*.*")) + glob.glob(os.path.join(ep_dir, "out", "*.json")) + glob.glob(os.path.join(ep_dir, "out", "*.html")):
            try:
                if KEY_RX.search(open(f, encoding="utf-8", errors="ignore").read()):
                    R.err("key", f"API 키로 보이는 문자열이 파일에 있습니다: {os.path.basename(f)} — 절대 커밋 금지")
            except OSError:
                pass


def check_timeline(script, ep_dir, R: Report):
    """음성 합성 결과(길이)가 필요한 점검."""
    from .timeline import build
    from .visuals import visual_events
    sc = copy.deepcopy(script)
    tl = build(sc, ep_dir, os.path.join(ROOT, "cache"))
    total = tl["total"]
    meta = script["meta"]
    target = float(meta.get("target_min", TARGET_MIN))
    R.info(f"길이 {int(total // 60)}분 {int(total % 60):02d}초 · 장면 {len(tl['scenes'])}개")
    if total / 60 < target - 3:
        R.warn("length", f"길이 {total / 60:.1f}분 — 목표 {target:.0f}분보다 3분 넘게 짧습니다 (실제 내용 장면을 더하기)")
    up = meta.get("upload", {}) or {}
    for j, t in enumerate([meta.get("title", "")] + list(up.get("alt_titles", []) or [])):
        m = re.search(r"(\d+)\s*분", t)
        if m and abs(int(m.group(1)) - round(total / 60)) >= 1:
            R.err("title-min", f"제목 {'ABC'[j]}의 '{m.group(1)}분' 이 실제 길이({total / 60:.1f}분 → {round(total / 60)}분)와 다릅니다")
    for s in tl["scenes"]:
        d = s["dur"]
        if d > SCENE_ERR:
            R.err("scene-long", f"장면 길이 {d:.0f}초 — 둘 이상으로 나누세요", s["id"])
        elif d > SCENE_WARN:
            R.warn("scene-long", f"장면 길이 {d:.0f}초 (55초 넘음) — 나누면 화면 전환이 늘어납니다", s["id"])
        if s["visual"]["type"] not in ("chapter", "title", "outro"):
            beats = len(visual_events(s))
            if d >= 18 and beats < 2:
                R.warn("static", f"{d:.0f}초 동안 화면 변화가 {beats}번뿐입니다 — 요소를 키워드 시점에 나눠 등장시키세요", s["id"])
    ch = tl["chapters"]
    if len(ch) < 3 or ch[0]["t"] > 0.5 or any(ch[i + 1]["t"] - ch[i]["t"] < 10 for i in range(len(ch) - 1)):
        R.err("yt-chapters", "유튜브 챕터 조건(0:00 시작, 3개 이상, 각 10초 이상)을 못 채웁니다")
    return tl


def check_outputs(ep_dir, R: Report):
    out = os.path.join(ep_dir, "out")
    study = os.path.join(ROOT, "learning", "thumbnail_study.json")
    rng = json.load(open(study, encoding="utf-8"))["range"] if os.path.exists(study) else None
    for k in "ABC":
        p = os.path.join(out, f"thumbnail_{k}.png")
        if not os.path.exists(p):
            R.warn("thumb-file", f"thumbnail_{k}.png 이 아직 없습니다 (stills 또는 render 뒤 생성)")
            continue
        if rng:
            from .thumbcheck import features
            f = features(p)
            bad = [f"{n} {f[key]:.2f}(권장 {rng[key][0]:.2f}~{rng[key][1]:.2f})" for key, n in (("bright", "밝기"), ("dark", "어두운 영역"), ("edge", "화면 채움"))
                   if not rng[key][0] * 0.9 <= f[key] <= rng[key][1] * 1.15]
            if bad:
                R.warn("thumb-look", f"썸네일 {k}: " + ", ".join(bad))


def run(ep_dir, quick=False):
    ep_dir = os.path.abspath(ep_dir)
    R = Report()
    path = os.path.join(ep_dir, "02_script.json")
    if not os.path.exists(path):
        R.err("script", "02_script.json 이 없습니다 → `python -m studio.ep script <폴더>`")
        return R, None
    script = json.load(open(path, encoding="utf-8"))
    check_script(script, R, ep_dir)
    tl = None
    if not quick and R.n_err == 0:
        tl = check_timeline(script, ep_dir, R)
    elif not quick:
        R.info("오류가 있어 길이 점검은 건너뜁니다 (오류를 먼저 고치세요)")
    check_outputs(ep_dir, R)
    return R, tl


def print_report(R: Report, ep_dir):
    print(f"[점검] {os.path.relpath(ep_dir, ROOT)}")
    for lv, code, msg, where in R.items:
        if lv == "I":
            print(f"  · {msg}")
    for lv, mark in (("E", "✖ 오류"), ("W", "⚠ 경고")):
        for l2, code, msg, where in R.items:
            if l2 == lv:
                print(f"  {mark} [{code}]{' ' + where if where else ''}: {msg}")
    print(f"  → 오류 {R.n_err}개 · 경고 {R.n_warn}개" + ("  (오류를 모두 고친 뒤 다음 단계로)" if R.n_err else "  (통과)"))


def main(argv=None):
    ap = argparse.ArgumentParser(description="대본 품질 점검")
    ap.add_argument("episode")
    ap.add_argument("--quick", action="store_true", help="음성 합성 없이 글자·구조만 점검")
    a = ap.parse_args(argv)
    R, _ = run(a.episode, a.quick)
    print_report(R, os.path.abspath(a.episode))
    json.dump([{"level": lv, "code": c, "msg": m, "where": w} for lv, c, m, w in R.items],
              open(os.path.join(os.path.abspath(a.episode), "out", "check.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1) \
        if os.path.isdir(os.path.join(os.path.abspath(a.episode), "out")) else None
    sys.exit(1 if R.n_err else 0)


if __name__ == "__main__":
    main()
