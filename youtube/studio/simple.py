"""쉬운 대본(그냥 글) → 영상 대본(02_script.json) 변환기.

JSON을 몰라도 아래 규칙대로 글만 쓰면 장면·캐릭터 표정·챕터·인트로·마무리가 자동으로 만들어집니다.

  // 로 시작하는 줄      메모 (무시됨)
  # 제목               새 챕터 (챕터 카드가 나오고, 유튜브 목차에도 들어갑니다)
  ## 소제목             화면 위쪽에 작게 나오는 제목
  (빈 줄)              새 장면
  그냥 쓴 줄            캐릭터가 읽는 문장 (한 줄에 한 문장이 아니어도 마침표 기준으로 나눕니다)
  > 화면 글            화면에 크게 보일 핵심 문구  (*노랑*  ^빨강^  ~초록~ 강조)
  - 항목               목록 (문장 흐름에 맞춰 차례로 나타남)
  [숫자 1000 → 744 만 원 | 라벨 | 부제]   숫자가 바뀌는 장면
  @다음편 금리의 모든 것   마지막 화면의 다음 편 안내

  python -m studio.simple episodes/ep02_xxx   # 01_script.txt → 02_script.json
"""
from __future__ import annotations

import json
import os
import re
import sys

CPS = 5.8            # 완성 영상 기준 초당 글자 수(공백 제외, 문장 사이 쉼 포함)
SCREEN_MAX = 26      # 화면 글 한 줄 권장 최대 글자 수
SPECIAL = re.compile(r"^(인트로|오프닝|intro|정리|마무리|요약|결론|엔딩)$", re.I)
NEG = re.compile(r"위기|폭락|손해|위험|붕괴|파산|몰락|잃|빚|하락|무서|문제|실패|사기|부담|걱정")
POS = re.compile(r"이득|성공|수익|늘어|좋은|기회|절약|해결|도움|안전|든든")
SHOCK = re.compile(r"폭등|급등|\d+\s?배|충격|무려|사상 최|역대|소름")
EMO = ["neutral", "happy", "neutral", "smug"]
POSE = ["present", "hold", "present", "look"]
SCR = ["percent", "logo", "up", "won"]
MARK = re.compile(r"[*^~`]")


def strip_marks(s: str) -> str:
    return MARK.sub("", s)


def josa_eul(word: str) -> str:
    """을/를"""
    for ch in reversed(word.strip()):
        if "가" <= ch <= "힣":
            return "을" if (ord(ch) - 0xAC00) % 28 else "를"
        if ch.isalnum():
            return "를" if ch in "0136" or ch.lower() in "aeiouhlmnr" else "을"
    return "을"


def split_sentences(line: str):
    parts = re.split(r"(?<=[.!?…])\s+", line.strip())
    return [p.strip() for p in parts if p.strip()]


def size_for(text: str, many: bool) -> int:
    n = len(strip_marks(text))
    s = 96 if n <= 10 else 84 if n <= 16 else 72 if n <= 22 else 60 if n <= 28 else 48
    return int(s * 0.88) if many else s


def parse_counter(line: str):
    m = re.match(r"^\[숫자\s+([\d,\.]+)\s*(?:→|->|~|to)\s*([\d,\.]+)\s*([^|\]]*)(?:\|([^|\]]*))?(?:\|([^|\]]*))?\]\s*$", line)
    if not m:
        return None
    a, b = (float(x.replace(",", "")) for x in m.group(1, 2))
    dec = 1 if ("." in m.group(1) or "." in m.group(2)) else 0
    return {"from": a if dec else int(a), "to": b if dec else int(b), "decimals": dec,
            "unit": (m.group(3) or "").strip(), "label": (m.group(4) or "").strip(), "sub": (m.group(5) or "").strip()}


def parse_blocks(text: str):
    blocks, cur, nxt = [], [], ""
    for raw in text.splitlines():
        line = raw.strip()
        if line.startswith("//"):
            continue
        if line.startswith("@다음편"):
            nxt = line[len("@다음편"):].strip()
            continue
        if not line:
            if cur:
                blocks.append(cur)
                cur = []
            continue
        cur.append(line)
    if cur:
        blocks.append(cur)
    return blocks, nxt


def classify(lines):
    b = {"heading": None, "subtitle": None, "screen": [], "items": [], "counter": None, "narr": []}
    for ln in lines:
        if re.match(r"^##\s*\S", ln):
            b["subtitle"] = re.sub(r"^##\s*", "", ln)
        elif re.match(r"^#\s*\S", ln):
            b["heading"] = re.sub(r"^#\s*", "", ln)
        elif ln.startswith(">"):
            t = ln[1:].strip()
            if t:
                b["screen"].append(t)
        elif re.match(r"^[-•]\s+\S", ln):
            b["items"].append(re.sub(r"^[-•]\s+", "", ln))
        elif ln.startswith("[숫자"):
            b["counter"] = parse_counter(ln) or b["counter"]
        else:
            b["narr"] += split_sentences(ln)
    return b


def spread(k: int, n: int):
    """k개 항목을 n개 문장 위에 고르게 배치 (문장 번호 + 소수점)"""
    if k <= 0:
        return []
    if n <= 0:
        return [round(i * 0.5, 2) for i in range(k)]
    return [round(i * n / k, 2) for i in range(k)]


def mascot_for(idx: int, narr, visual_kind: str, first: bool):
    text = " ".join(narr)
    n = len(narr)
    emo, pose, scr = EMO[idx % 4], POSE[idx % 4], SCR[idx % 4]
    if first:
        emo, pose, scr = "surprised", "present", "up"
    elif SHOCK.search(text):
        emo, pose, scr = "shock", "up", "up"
    elif "?" in text:
        emo, pose, scr = "surprised", "present", "percent"
    elif NEG.search(text):
        emo, pose, scr = "worried", "hold", "alert"
    elif POS.search(text):
        emo, pose, scr = "happy", "present", "up"
    m = {"layout": "center" if visual_kind == "talk" else ("left" if idx % 2 == 0 else "right"),
         "pose": pose, "emotion": emo, "screen": scr}
    if n >= 4:
        m["at"] = {str(n // 2): {"emotion": EMO[(idx + 1) % 4]}}
    if first or SHOCK.search(text):
        m["hop"] = [min(1, max(0, n - 1))]
    return m


def build_scene(b, idx, first, warns, label):
    narr = b["narr"]
    n = len(narr)
    if b["counter"]:
        c = b["counter"]
        vis = {"type": "counter", "label": c["label"] or "", "label_size": 44, "from": c["from"], "to": c["to"],
               "decimals": c["decimals"], "unit": c["unit"],
               "at": min(1, max(0, n - 1)) + 0.2, "dur": 1.8}
        if c["to"] < c["from"]:
            vis["color_to"] = "red"
        if c["sub"]:
            vis["sub"] = c["sub"]
            vis["sub_at"] = min(n - 1, 2) if n > 1 else 0.6
        kind = "counter"
    elif b["items"]:
        ats = spread(len(b["items"]), n)
        vis = {"type": "list", "title": b["subtitle"] or "", "items": [{"text": t, "at": ats[i]} for i, t in enumerate(b["items"])]}
        kind = "list"
        for t in b["items"]:
            if len(strip_marks(t)) > 24:
                warns.append(f"[{label}] 목록 항목이 깁니다(24자 이내 권장): {t[:18]}…")
    elif b["screen"]:
        k = len(b["screen"])
        ats = spread(k, n)
        lines = []
        for i, t in enumerate(b["screen"]):
            d = {"text": t, "size": size_for(t, k >= 3), "at": ats[i]}
            if k == 1:
                d["box"] = "card2"
            lines.append(d)
            if len(strip_marks(t)) > SCREEN_MAX:
                warns.append(f"[{label}] 화면 글이 깁니다({SCREEN_MAX}자 이내 권장): {strip_marks(t)[:18]}…")
        vis = {"type": "keytext", "title": b["subtitle"] or "", "lines": lines}
        kind = "keytext"
    else:
        vis = {"type": "keytext", "title": b["subtitle"] or "", "lines": []}
        kind = "talk"
        if n:
            warns.append(f"[{label}] 화면에 보일 글(>)이 없어 캐릭터만 말합니다")
    if not vis.get("title"):
        vis.pop("title", None)
    return {"visual": vis, "mascot": mascot_for(idx, narr, kind, first), "lines": list(narr)}


def title_parts(title: str):
    t = re.sub(r"^\s*[“\"‘'].*?[”\"’']\s*", "", title or "").strip()
    m = re.match(r"^(\d+\s*분)\s*만에\s*(?:끝내는|알아보는|정리하는)?\s*(.*)$", t)
    if m:
        return f"{m.group(1).replace(' ', '')} 만에 끝내는", (m.group(2) or t).strip()
    return "오늘의 주제", t or "새 영상"


def convert(text: str, base: dict | None = None):
    """(대본 dict, info dict) 반환"""
    base = base or {}
    meta = dict(base.get("meta") or {})
    meta.setdefault("episode", "EP.00")
    meta.setdefault("series", "기초 경제 시리즈")
    meta.setdefault("channel", "부의비상사태 911")
    meta.setdefault("theme", "charcoal")
    meta.setdefault("voice", "ko-KR-InJoonNeural")
    meta.setdefault("rate", "+8%")
    blocks, nxt = parse_blocks(text)
    warns, scenes, part_no, idx = [], [], 0, 0
    pending_label = None
    for bi, lines in enumerate(blocks):
        b = classify(lines)
        has_visual = bool(b["screen"] or b["items"] or b["counter"])
        label_prefix = f"장면 {len(scenes) + 1}"
        if b["heading"] and not SPECIAL.match(b["heading"]):
            part_no += 1
            h = b["heading"]
            m = re.match(r"^(PART\s*\d+)\s*[.:)\-]?\s*(.*)$", h, re.I)
            if m:
                part, title = m.group(1).upper().replace("  ", " "), (m.group(2) or h)
            else:
                part, title = f"PART {part_no}", h
            card = {"chapter": f"{part}. {title}", "mascot": {"layout": "chapter", "pose": "present",
                    "emotion": EMO[idx % 4], "screen": SCR[idx % 4]},
                    "visual": {"type": "chapter", "part": part, "title": title}, "lines": []}
            idx += 1
            if has_visual:
                scenes.append(card)
                sc = build_scene(b, idx, False, warns, label_prefix)
                idx += 1
                scenes.append(sc)
            else:
                card["lines"] = b["narr"]
                scenes.append(card)
            continue
        if b["heading"]:
            pending_label = b["heading"]
        if not (has_visual or b["narr"]):
            continue
        first = not scenes
        sc = build_scene(b, idx, first, warns, label_prefix)
        idx += 1
        if pending_label:
            sc["chapter"] = pending_label
            pending_label = None
        scenes.append(sc)
        # 인사 + 제목 장면 자동 삽입 (첫 장면=후킹 다음)
        if first and not any("안녕하세요" in " ".join(classify(x)["narr"]) for x in blocks[:3]):
            top, main = title_parts(meta.get("title", ""))
            msize = 130 if len(main) <= 9 else 110 if len(main) <= 12 else 90 if len(main) <= 16 else 76
            scenes.append({"mascot": {"layout": "left", "pose": "hold", "emotion": "happy", "screen": "logo", "hat": True},
                           "visual": {"type": "title", "badge": meta["episode"], "top": top, "main": main, "main_at": 1,
                                      "main_size": msize, "sub": meta["series"], "sub_at": 1.5},
                           "lines": [{"text": "안녕하세요, 부의비상사태 911입니다.", "say": "안녕하세요, 부의 비상사태 구일일입니다."},
                                     f"오늘은 {main}{josa_eul(main)} 정리해 드릴게요."]})
    if not scenes:
        raise ValueError("대본이 비어 있습니다. 글을 쓰고 다시 눌러 주세요.")
    if not scenes[0].get("chapter"):
        scenes[0]["chapter"] = "인트로"
    done = any("구독" in " ".join(s["lines"] if all(isinstance(x, str) for x in s["lines"]) else
                               [x if isinstance(x, str) else x.get("text", "") for x in s["lines"]]) for s in scenes[-2:])
    if not done:
        olines = []
        if nxt:
            olines.append(f"다음 영상에서는 {nxt}{josa_eul(nxt)} 정리해 드릴게요.")
        olines += ["도움이 되셨다면 구독과 좋아요 부탁드립니다.",
                   {"text": "지금까지 부의비상사태 911이었습니다. 감사합니다.",
                    "say": "지금까지 부의 비상사태 구일일이었습니다. 감사합니다."}]
        scenes.append({"mascot": {"layout": "corner", "pose": "hold", "emotion": "happy", "screen": "logo", "hat": True},
                       "visual": {"type": "outro", **({"next": f"다음 편 · {nxt}"} if nxt else {})}, "lines": olines})
    if len(scenes) >= 2 and not any(s.get("chapter") and s["visual"]["type"] == "chapter" for s in scenes):
        warns.append("챕터(# 제목)가 없습니다. 유튜브 목차(챕터)를 위해 3개 이상 권장합니다")
    n_ch = sum(1 for s in scenes if s.get("chapter"))
    if n_ch < 3:
        warns.append(f"유튜브 목차(챕터)가 {n_ch}개입니다. 3개 이상이면 시청자가 건너뛰어 보기 좋습니다")
    for i, s in enumerate(scenes, 1):
        s["id"] = f"s{i:02d}"
    ordered = []
    for s in scenes:
        d = {"id": s["id"]}
        if s.get("chapter"):
            d["chapter"] = s["chapter"]
        d.update({"mascot": s["mascot"], "visual": s["visual"], "lines": s["lines"]})
        ordered.append(d)
    chars = sum(len(re.sub(r"\s", "", strip_marks(x if isinstance(x, str) else x["text"]))) for s in ordered for x in s["lines"])
    n_lines = sum(len(s["lines"]) for s in ordered)
    est = chars / CPS + len(ordered) * 0.6 + sum(1 for s in ordered if s["visual"]["type"] == "chapter") * 1.5
    if est < 480:
        warns.append(f"예상 길이가 약 {est / 60:.0f}분으로 짧습니다. 학습 결과상 15분 이상이 조회수에 유리했습니다")
    seen = set()
    warns = [w for w in warns if not (w in seen or seen.add(w))]
    script = {"meta": meta, "scenes": ordered}
    info = {"scenes": len(ordered), "sentences": n_lines, "est_min": round(est / 60, 1), "chapters": n_ch,
            "warnings": warns[:12]}
    return script, info


def convert_episode(ep_dir: str, text: str | None = None):
    sj = os.path.join(ep_dir, "02_script.json")
    base = json.load(open(sj, encoding="utf-8")) if os.path.exists(sj) else {}
    txt_path = os.path.join(ep_dir, "01_script.txt")
    if text is None:
        text = open(txt_path, encoding="utf-8").read()
    script, info = convert(text, base)
    with open(txt_path, "w", encoding="utf-8") as f:
        f.write(text)
    if os.path.exists(sj):
        with open(sj, encoding="utf-8") as f, open(sj + ".bak", "w", encoding="utf-8") as g:
            g.write(f.read())
    with open(sj, "w", encoding="utf-8") as f:
        json.dump(script, f, ensure_ascii=False, indent=2)
    return script, info


if __name__ == "__main__":
    if len(sys.argv) < 2:
        raise SystemExit("사용법: python -m studio.simple episodes/ep02_xxx")
    _, inf = convert_episode(os.path.abspath(sys.argv[1]))
    print(f"변환 완료: 장면 {inf['scenes']}개, 문장 {inf['sentences']}개, 예상 {inf['est_min']}분, 챕터 {inf['chapters']}개")
    for w in inf["warnings"]:
        print("  주의:", w)
