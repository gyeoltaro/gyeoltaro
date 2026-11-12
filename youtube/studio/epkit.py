"""대본 작성 도구 — 에피소드의 script.py 가 쓰는 함수 모음.

한 편의 대본은 `episodes/epNN_이름/script.py` 한 파일로 씁니다. 그 파일을 실행하면 같은 폴더에
`02_script.json`(렌더러가 읽는 대본)이 만들어집니다. 쓰는 법은 `episodes/_template/script.py` 와 `docs/PLAYBOOK.md` 참고.

    from studio.epkit import *
    add({...그림...}, ["내레이션 1", "내레이션 2"], M("left"))      # 장면 하나
    stage([...내레이션...], props=[P("won", "@0:돈", "돈 풀기")], bubble="한마디")   # 이야기 장면
    finish(__file__, META)

등장 시점(at)은 `"@줄번호:키워드"` 로 씁니다. 그 줄의 내레이션에서 키워드가 나오는 순간에 요소가 등장합니다.
(예: "@1:금리" = 두 번째 줄에서 '금리'라는 말이 나올 때. 줄 번호는 0부터.)
키워드가 그 줄에 없으면 finish() 가 어느 장면의 어느 키워드인지 모두 알려 주고 멈춥니다.

화면 글자에 물결표(~)를 쓰면 색 표시 기호로 먹히므로, 여기서 자동으로 '–'로 바꿉니다(읽기는 원문 그대로).
"""
from __future__ import annotations

import json
import os
import re

SC: list = []        # 지금까지 추가한 장면
_MISS: list = []     # 못 찾은 키워드 (finish 에서 한꺼번에 보고)

__all__ = ["SC", "M", "add", "chap", "K", "kin", "G", "grid", "P", "stage", "resolve", "finish"]


def M(layout="left", pose="present", emotion="neutral", screen="percent", at=None, hop=None, hat=False):
    """캐릭터(마스코트) 설정.
    layout : left / right / corner / center / chapter / stage / none   (그림이 들어갈 자리가 달라짐)
    pose   : hold / present / up / look
    emotion: neutral / happy / worried / shock / surprised / smug
    screen : logo / up / down / won / alert / percent / none          (손에 든 태블릿 화면)
    hop    : [줄 번호...]  그 줄이 시작될 때 폴짝 뜀      hat: True 면 모자 인사
    """
    d = {"layout": layout, "pose": pose, "emotion": emotion, "screen": screen}
    if at:
        d["at"] = at
    if hop:
        d["hop"] = hop
    if hat:
        d["hat"] = True
    return d


def _t(ln):
    return ln["text"] if isinstance(ln, dict) else ln


def resolve(obj, lines):
    """그림 설정 안의 '@줄:키워드' 를 숫자 시점으로 바꾸고, 화면 글자의 '~' 를 '–' 로 바꾼다."""
    if isinstance(obj, dict):
        return {k: resolve(v, lines) for k, v in obj.items()}
    if isinstance(obj, list):
        return [resolve(v, lines) for v in obj]
    if isinstance(obj, str):
        m = re.match(r"^@(\d+):(.+)$", obj)
        if m:
            i, kw = int(m.group(1)), m.group(2)
            if i >= len(lines):
                _MISS.append(f"장면 {len(SC) + 1}: '@{i}:{kw}' — 줄 번호 {i}이(가) 없음 (이 장면은 {len(lines)}줄)")
                return 0
            t = _t(lines[i])
            p = t.find(kw)
            if p < 0:
                _MISS.append(f"장면 {len(SC) + 1}: 키워드 '{kw}' 가 {i}번 줄에 없음 → \"{t[:46]}…\"")
                return 0
            return round(i + p / max(1, len(t)), 3)
        return obj.replace("~", "–")
    return obj


def add(visual, lines, mascot=None, chapter=None, bg=None, **extra):
    """장면 하나를 추가한다. visual = 그림 설정(dict), lines = 내레이션 문장 목록.
    문장은 문자열이거나 {"text": 화면 자막, "say": 읽는 글}. chapter 를 주면 여기서 새 파트가 시작된다."""
    lines = [{"text": ln.replace("~", "–"), "say": ln} if isinstance(ln, str) and "~" in ln else ln for ln in lines]
    s = {"id": f"s{len(SC) + 1:02d}"}
    if chapter:
        s["chapter"] = chapter
    if bg:
        s["bg"] = bg
    s["mascot"] = mascot or M()
    s["visual"] = resolve(visual, lines)
    s["lines"] = lines
    s.update(extra)
    SC.append(s)
    return s


def chap(part, title, lines, emo="happy", screen="logo"):
    """파트 시작 장면(노란 테이프). part 예: 'PART 1', title 은 16자 이내 권장."""
    if isinstance(lines, str):
        lines = [lines]
    return add({"type": "chapter", "part": part, "title": title}, lines, M("chapter", "present", emo, screen),
               chapter=f"{part}. {title}")


def K(text, size=110, at=0, **kw):
    """kinetic(큰 글자) 한 줄. slam=True 면 '쾅' 찍힘, box='card2' 면 배경 띠."""
    d = {"text": text, "size": size, "at": at}
    d.update(kw)
    return d


def kin(lines, title=None, **kw):
    v = {"type": "kinetic", "lines": lines}
    if title:
        v["title"] = title
    v.update(kw)
    return v


def G(icon, text, at, sub=None, color="yellow"):
    """icongrid(아이콘 카드) 한 칸."""
    d = {"icon": icon, "text": text, "at": at, "color": color}
    if sub:
        d["sub"] = sub
    return d


def grid(title, items, cols=None):
    v = {"type": "icongrid", "title": title, "items": items}
    if cols:
        v["cols"] = cols
    return v


def P(icon, at, text=None, **kw):
    """stage(이야기 장면)의 소품 하나. text 는 8자 이내 권장."""
    d = {"icon": icon, "at": at}
    if text:
        d["text"] = text
    d.update(kw)
    return d


def stage(lines, props=(), bubble=None, bubble_at="@0:", label=None, label_at=None, emo="neutral", screen="percent",
          env=None, **kw):
    """이야기 장면: 캐릭터가 가운데 크게 서서 말풍선으로 한마디 하고, 소품이 튀어나온다.
    bubble 16자 이내, label(아래 큰 한마디) 16자 이내, 소품은 2~3개. env 로 이 장면만 다른 장소를 쓸 수 있다."""
    v = {"type": "stage", "props": list(props)}
    if bubble:
        v["bubble"] = bubble
        v["bubble_at"] = bubble_at if bubble_at != "@0:" else 0.02
    if label:
        v["label"] = label
        v["label_at"] = label_at if label_at is not None else 0.5
    v.update(kw)
    extra = {"env": env} if env else {}
    return add(v, lines, M("stage", "present", emo, screen), **extra)


DEFAULT_META = {"series": "기초 경제 시리즈", "channel": "부의비상사태 911", "theme": "charcoal", "motion": 2, "look": "story",
                "voice": "ko-KR-InJoonNeural", "rate": "+8%"}


def finish(script_file, meta, minutes=None, quiet=False):
    """대본을 02_script.json 으로 저장한다. script.py 의 맨 끝에서 `finish(__file__, META)` 로 부른다.

    제목·설명에 '{MIN}' 을 쓰면 실제 길이(분)로 채워진다: minutes 를 주면 지금 채우고,
    안 주면 `python -m studio.ep script <폴더>` 가 음성 합성 뒤 실제 길이로 채운다.
    """
    if _MISS:
        raise SystemExit("등장 시점 키워드를 찾지 못했습니다. 내레이션에 실제로 나오는 낱말로 고치세요:\n  " + "\n  ".join(_MISS))
    if not SC:
        raise SystemExit("장면이 없습니다.")
    m = dict(DEFAULT_META)
    m.update(meta)
    for need in ("episode", "title"):
        if not m.get(need):
            raise SystemExit(f"META 에 '{need}' 가 없습니다.")
    out = {"meta": m, "scenes": SC}
    if minutes is not None:
        out = json.loads(json.dumps(out, ensure_ascii=False).replace("{MIN}", str(int(minutes))))
    try:  # 학습 엔진의 예상(참고용). 실패해도 대본 저장에는 영향 없음.
        from . import plan as _plan
        title = out["meta"]["title"]
        mins = int(minutes) if minutes is not None else int(m.get("target_min", 30))
        pred = _plan.predict_episode(title.replace("{MIN}", str(mins)), mins)
        if pred:
            out["meta"]["plan"] = dict(pred, **(m.get("plan") or {}))
    except Exception:
        pass
    d = os.path.dirname(os.path.abspath(script_file))
    os.makedirs(os.path.join(d, "out"), exist_ok=True)
    path = os.path.join(d, "02_script.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
    if not quiet:
        n_stage = sum(1 for s in SC if s["visual"]["type"] == "stage")
        print(f"대본 저장: {path}")
        print(f"  장면 {len(SC)}개 (이야기 장면 {n_stage}개), 문장 {sum(len(s['lines']) for s in SC)}개")
    return path
