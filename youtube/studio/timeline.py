"""대본(JSON) + 음성 → 타임라인(장면 시작/끝, 문장 타이밍, 자막, 효과음, 립싱크 곡선)."""
from __future__ import annotations

import glob
import json
import os
import random
import re

import numpy as np

from . import audio as A
from .core import FPS, strip_marks
from .tts import synthesize
from .visuals import visual_events

GAP_LINE = 0.22      # 문장 사이 쉼
LEAD = 0.15          # 장면 시작 후 첫 문장까지
LEAD_CHAPTER = 1.0   # 챕터 카드: 애니메이션을 먼저 보여주고 말하기
TAIL = 0.35          # 장면 마지막 문장 후 여유
CAP_MAX = 24         # 자막 한 줄 최대 글자 수

NUM_RE = re.compile(r"(\d[\d,\.]*\s?(?:%p|%|조|억|만|천|원|년|월|배|개|마르크|달러|분|세기|그램|시간)*"
                    r"(?:\s?(?:원|마르크|달러))?)")


def _line_obj(ln):
    if isinstance(ln, str):
        return {"text": ln, "say": ln}
    d = dict(ln)
    d.setdefault("say", d["text"])
    return d


def _norm(s: str) -> str:
    return re.sub(r"[\s\.,!?…·‘’“”\"'()\-~*^`]", "", s)


def chunk_caption(text: str, max_len: int = CAP_MAX):
    toks = text.split()
    chunks, cur = [], []
    for tok in toks:
        cand = " ".join(cur + [tok])
        glued = bool(cur) and ((re.search(r"[\d만억조천]$", cur[-1]) and re.match(r"^(원|달러|마르크|%|년|배)", tok))
                               or cur[-1] in ("약", "단", "무려", "바로", "연"))
        if cur and len(cand) > max_len and not (glued and len(cand) <= max_len + 8):
            chunks.append(" ".join(cur))
            cur = [tok]
        else:
            cur.append(tok)
        if re.search(r"[,.?!]$", tok) and len(" ".join(cur)) >= max_len * 0.5:
            chunks.append(" ".join(cur))
            cur = []
    if cur:
        chunks.append(" ".join(cur))
    if len(chunks) > 1 and len(chunks[-1]) < 7 and len(chunks[-2]) + len(chunks[-1]) <= max_len + 6:
        last = chunks.pop()
        chunks[-1] = chunks[-1] + " " + last
    return chunks


def _time_map(say: str, words, dur: float):
    """정규화된 문자 위치 → 시간 보간표"""
    norm = _norm(say)
    pts = [(0, 0.0)]
    cur = 0
    for w in words:
        wn = _norm(w["text"])
        if not wn:
            continue
        idx = norm.find(wn, cur)
        if idx < 0 or idx - cur > 6:
            continue
        pts.append((idx, max(0.0, w["offset"])))
        cur = idx + len(wn)
    pts.append((len(norm), dur))
    xs = np.array([p[0] for p in pts], dtype=float)
    ts = np.maximum.accumulate(np.array([p[1] for p in pts], dtype=float))
    return xs, ts, len(norm)


def highlight_numbers(s: str) -> str:
    if any(m in s for m in "*^~`"):
        return s
    return NUM_RE.sub(lambda m: f"*{m.group(1).strip()}*" if m.group(1).strip() else m.group(0), s)


def build(script: dict, ep_dir: str, cache_dir: str, voice=None, rate=None):
    meta = script.get("meta", {})
    voice = voice or meta.get("voice", "ko-KR-InJoonNeural")
    rate = rate or meta.get("rate", "+8%")
    sr = A.SR

    # 1) 문장 목록 + 본인 녹음 파일 확인
    all_lines = []
    for sc in script["scenes"]:
        sc["_lines"] = [_line_obj(l) for l in sc.get("lines", [])]
        for i, ln in enumerate(sc["_lines"]):
            ln["id"] = f"{sc['id']}_{i + 1:02d}"
            ln["say"] = strip_marks(ln["say"])
            all_lines.append(ln)
    own = {}
    vdir = os.path.join(ep_dir, "voice")
    for ln in all_lines:
        hits = glob.glob(os.path.join(vdir, ln["id"] + ".*"))
        if hits:
            own[ln["id"]] = hits[0]
    need = [(ln["id"], ln["say"]) for ln in all_lines if ln["id"] not in own]
    if own:
        print(f"  본인 녹음 사용: {len(own)}문장")
    tts_files = synthesize(need, os.path.join(cache_dir, "tts"), voice=voice, rate=rate) if need else {}

    # 2) 오디오 로드/트리밍
    for ln in all_lines:
        if ln["id"] in own:
            x = A.load_audio(own[ln["id"]], sr)
            words = []
        else:
            mp3, mj = tts_files[ln["id"]]
            x = A.load_audio(mp3, sr)
            words = json.load(open(mj, encoding="utf-8"))["words"]
        clip, cut = A.trim_silence(x, sr)
        ln["audio"] = clip
        ln["dur"] = len(clip) / sr
        ln["words"] = [{**w, "offset": w["offset"] - cut} for w in words]

    # 3) 장면 배치
    scenes, t = [], 0.0
    for si, sc in enumerate(script["scenes"]):
        vis = sc["visual"]
        lead = sc.get("lead", LEAD_CHAPTER if vis["type"] == "chapter" else LEAD)
        start = t
        lt = lead
        lines = []
        for ln in sc["_lines"]:
            lines.append({"id": ln["id"], "text": ln["text"], "say": ln["say"],
                          "start": start + lt, "end": start + lt + ln["dur"],
                          "words": ln["words"], "audio": ln["audio"]})
            lt += ln["dur"] + sc.get("gap", GAP_LINE)
        tail = sc.get("tail", TAIL)
        if si == len(script["scenes"]) - 1:
            tail = max(tail, 3.0)
        body = (lt - sc.get("gap", GAP_LINE) if lines else lt) + tail
        dur = max(body, sc.get("min_dur", 2.5 if vis["type"] == "chapter" else 0.0))
        f0 = int(round(start * FPS))
        nf = max(1, int(round(dur * FPS)))
        start = f0 / FPS
        dur = nf / FPS
        scenes.append({"id": sc["id"], "start": start, "dur": dur, "f0": f0, "nf": nf,
                       "visual": vis, "mascot": sc.get("mascot", {}), "bg": sc.get("bg", "navy"),
                       "chapter": sc.get("chapter"), "lines": lines})
        t = start + dur
    total = t
    n_frames = int(round(total * FPS))

    # 4) 음성 트랙
    voice_track = np.zeros(int(total * sr) + sr, dtype=np.float32)
    for s in scenes:
        for ln in s["lines"]:
            a = int(ln["start"] * sr)
            voice_track[a:a + len(ln["audio"])] += ln["audio"]

    # 5) 자막
    captions = []
    for s in scenes:
        for ln in s["lines"]:
            dur = ln["end"] - ln["start"]
            xs, ts, nlen = _time_map(ln["say"], ln["words"], dur)
            chunks = chunk_caption(ln["text"])
            pos = 0
            norm_disp = _norm(strip_marks(ln["text"]))
            scale = nlen / max(1, len(norm_disp))
            for ci, ch in enumerate(chunks):
                a_pos = pos * scale
                pos += len(_norm(strip_marks(ch)))
                b_pos = pos * scale
                ta = float(np.interp(a_pos, xs, ts))
                tb = float(np.interp(b_pos, xs, ts)) if ci < len(chunks) - 1 else dur
                captions.append({"start": ln["start"] + ta, "end": ln["start"] + max(tb, ta + 0.4),
                                 "text": ch, "display": highlight_numbers(ch)})
    for i in range(len(captions) - 1):  # 겹침 방지 + 짧은 공백 메우기
        nxt = captions[i + 1]["start"]
        if captions[i]["end"] > nxt or nxt - captions[i]["end"] < 0.3:
            captions[i]["end"] = nxt

    # 6) 효과음 이벤트
    events = []
    for s in scenes:
        events += visual_events(s)

    # 7) 립싱크, 눈 깜빡임
    mouth = A.mouth_envelope(voice_track, n_frames, FPS, sr)
    rnd = random.Random(42)
    blinks, tt = [], 1.2
    while tt < total:
        blinks.append(tt)
        tt += rnd.uniform(2.2, 5.0)

    for s in scenes:
        for ln in s["lines"]:
            ln.pop("audio", None)

    chapters = []
    for s in scenes:
        if s.get("chapter"):
            chapters.append({"t": s["start"], "title": s["chapter"]})
    return {
        "meta": meta, "scenes": scenes, "captions": captions, "events": events,
        "total": total, "n_frames": n_frames, "mouth": mouth, "blinks": blinks,
        "chapters": chapters, "voice_track": voice_track,
    }


def fmt_ts(t: float) -> str:
    t = int(t)
    h, m, s = t // 3600, (t % 3600) // 60, t % 60
    return f"{h}:{m:02d}:{s:02d}" if h else f"{m}:{s:02d}"


def write_srt(captions, path):
    def ts(x):
        ms = int(round(x * 1000))
        h, ms = divmod(ms, 3600000)
        m, ms = divmod(ms, 60000)
        s, ms = divmod(ms, 1000)
        return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"

    with open(path, "w", encoding="utf-8") as f:
        for i, c in enumerate(captions, 1):
            f.write(f"{i}\n{ts(c['start'])} --> {ts(c['end'])}\n{strip_marks(c['text'])}\n\n")
