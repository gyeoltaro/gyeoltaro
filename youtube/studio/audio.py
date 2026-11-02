"""오디오 유틸: 디코딩, 무음 트리밍, 립싱크용 음량 곡선, 효과음/배경음 합성, 믹싱.

효과음과 배경음은 모두 코드로 직접 합성하므로 저작권 문제가 없습니다.
"""
from __future__ import annotations

import math
import subprocess
import wave

import numpy as np

SR = 48000


def load_audio(path: str, sr: int = SR) -> np.ndarray:
    out = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", path, "-f", "f32le", "-ac", "1", "-ar", str(sr), "-"],
        check=True, capture_output=True).stdout
    return np.frombuffer(out, dtype=np.float32).copy()


def trim_silence(x: np.ndarray, sr: int = SR, thr: float = 0.012, pad: float = 0.04):
    """앞뒤 무음 제거. (잘린 오디오, 앞에서 잘라낸 초) 반환"""
    if len(x) == 0:
        return x, 0.0
    win = int(sr * 0.01)
    n = len(x) // win
    if n == 0:
        return x, 0.0
    rms = np.sqrt(np.mean(x[: n * win].reshape(n, win) ** 2, axis=1))
    idx = np.where(rms > thr)[0]
    if len(idx) == 0:
        return x, 0.0
    a = max(0, idx[0] * win - int(pad * sr))
    b = min(len(x), (idx[-1] + 1) * win + int(pad * sr))
    return x[a:b], a / sr


def mouth_envelope(voice: np.ndarray, n_frames: int, fps: int, sr: int = SR) -> np.ndarray:
    """프레임별 입 벌림(0~1). 음성 RMS를 정규화 + 스무딩."""
    hop = sr / fps
    env = np.zeros(n_frames, dtype=np.float32)
    for i in range(n_frames):
        a = int(i * hop)
        b = int(a + hop * 1.2)
        seg = voice[a:b]
        if len(seg):
            env[i] = float(np.sqrt(np.mean(seg ** 2)))
    ref = np.percentile(env[env > 0.005], 90) if np.any(env > 0.005) else 1.0
    env = np.clip(env / (ref + 1e-6), 0, 1.2)
    env = np.where(env < 0.08, 0, env)
    # 빠르게 열리고 천천히 닫히도록 + 약간의 떨림(음절감)
    out = np.zeros_like(env)
    prev = 0.0
    for i, e in enumerate(env):
        k = 0.65 if e > prev else 0.45
        prev = prev + (e - prev) * k
        out[i] = prev
    jitter = 0.75 + 0.25 * np.abs(np.sin(np.arange(n_frames) * 1.9))
    return np.clip(out * jitter, 0, 1)


# ---------------------------------------------------------------- 효과음

def _env(n, a=0.005, r=0.2, sr=SR):
    t = np.arange(n) / sr
    e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / max(r, 1e-4))
    return e


def sfx(kind: str, sr: int = SR) -> np.ndarray:
    rng = np.random.default_rng(abs(hash(kind)) % 2 ** 32)
    if kind == "pop":
        n = int(0.12 * sr)
        t = np.arange(n) / sr
        f = 900 * np.exp(-t * 18) + 380
        x = np.sin(2 * np.pi * np.cumsum(f) / sr) * _env(n, 0.002, 0.04)
        return 0.32 * x
    if kind == "whoosh":
        n = int(0.55 * sr)
        noise = rng.standard_normal(n)
        # 대역 이동 느낌: 간단한 1-pole 필터 계수를 시간에 따라 변화
        y = np.zeros(n)
        acc = 0.0
        for i in range(n):
            k = 0.02 + 0.25 * math.sin(math.pi * i / n)
            acc += (noise[i] - acc) * k
            y[i] = acc
        e = np.sin(np.pi * np.arange(n) / n) ** 2
        return 0.5 * y * e / (np.max(np.abs(y)) + 1e-6)
    if kind == "boom":
        n = int(0.6 * sr)
        t = np.arange(n) / sr
        f = 110 * np.exp(-t * 6) + 45
        x = np.sin(2 * np.pi * np.cumsum(f) / sr) * _env(n, 0.003, 0.18)
        return 0.5 * x
    if kind == "ding":
        n = int(0.9 * sr)
        t = np.arange(n) / sr
        x = (np.sin(2 * np.pi * 1318.5 * t) + 0.5 * np.sin(2 * np.pi * 2637 * t)
             + 0.3 * np.sin(2 * np.pi * 1975.5 * t)) * _env(n, 0.002, 0.25)
        return 0.18 * x
    if kind == "tick":
        n = int(1.6 * sr)
        x = np.zeros(n)
        for j, tt in enumerate(np.arange(0, 1.5, 0.075)):
            a = int(tt * sr)
            m = int(0.015 * sr)
            tk = np.sin(2 * np.pi * (2400 + 30 * j) * np.arange(m) / sr) * _env(m, 0.0005, 0.004)
            x[a:a + m] += tk
        return 0.12 * x
    return np.zeros(1)


# ---------------------------------------------------------------- 배경음 (앰비언트 패드)

def bgm(duration: float, sr: int = SR, seed: int = 1) -> np.ndarray:
    """가볍고 밝은 로파이 패드 + 부드러운 아르페지오 (모노)."""
    n = int(duration * sr)
    out = np.zeros(n, dtype=np.float32)
    # Fmaj7 - G6 - Em7 - Am7 (도/파 계열의 차분한 진행)
    chords = [[53, 57, 60, 64], [55, 59, 62, 64], [52, 55, 59, 62], [57, 60, 64, 67]]
    bar = 4.0
    t_all = np.arange(int(bar * sr)) / sr

    def hz(m):
        return 440.0 * 2 ** ((m - 69) / 12)

    att = np.minimum(1, t_all / 0.8) * np.minimum(1, (bar - t_all) / 0.8)
    rng = np.random.default_rng(seed)
    blocks = []
    for ch in chords:
        blk = np.zeros_like(t_all)
        for m in ch:
            f = hz(m)
            for det in (-0.6, 0.6):
                blk += np.sin(2 * np.pi * (f + det) * t_all + rng.uniform(0, 6.28))
            blk += 0.25 * np.sin(2 * np.pi * f * 2 * t_all)
        blk *= att / (len(ch) * 2.6)
        # 아르페지오
        for k in range(8):
            m = ch[k % len(ch)] + 12
            st = int(k * bar / 8 * sr)
            ln = int(0.45 * sr)
            tt = np.arange(ln) / sr
            note = np.sin(2 * np.pi * hz(m) * tt) * np.exp(-tt * 7) * 0.22
            blk[st:st + ln] += note[: len(blk[st:st + ln])]
        bass = np.sin(2 * np.pi * hz(ch[0] - 12) * t_all) * att * 0.35
        blocks.append(blk + bass)
    loop = np.concatenate(blocks).astype(np.float32)
    # 부드럽게 (1-pole lowpass) — 루프 단위로 한 번만 계산
    y = np.empty_like(loop)
    acc = 0.0
    a = 0.18
    for i in range(len(loop)):
        acc += (loop[i] - acc) * a
        y[i] = acc
    reps = int(math.ceil(n / len(y)))
    y = np.tile(y, reps)[:n].astype(np.float32)
    fade = int(2.0 * sr)
    y[:fade] *= np.linspace(0, 1, fade)
    y[-fade:] *= np.linspace(1, 0, fade)
    return y / (np.max(np.abs(y)) + 1e-6)


def voice_activity(voice: np.ndarray, sr: int = SR) -> np.ndarray:
    win = int(0.05 * sr)
    n = len(voice) // win + 1
    pad = np.zeros(n * win, dtype=np.float32)
    pad[: len(voice)] = voice
    rms = np.sqrt(np.mean(pad.reshape(n, win) ** 2, axis=1))
    act = (rms > 0.01).astype(np.float32)
    # 부드러운 덕킹 곡선
    sm = np.zeros_like(act)
    acc = 0.0
    for i, a in enumerate(act):
        acc += (a - acc) * (0.5 if a > acc else 0.08)
        sm[i] = acc
    return np.repeat(sm, win)[: len(voice)]


def mix(voice: np.ndarray, events, duration: float, bgm_gain_db: float = -22.0,
        duck_db: float = -9.0, sfx_gain_db: float = -8.0, use_bgm: bool = True,
        sr: int = SR) -> np.ndarray:
    n = int(duration * sr)
    out = np.zeros(n, dtype=np.float32)
    v = voice[:n]
    out[: len(v)] += v
    cache = {}
    g_sfx = 10 ** (sfx_gain_db / 20)
    for t, kind in events:
        if kind not in cache:
            cache[kind] = sfx(kind, sr).astype(np.float32)
        s = cache[kind]
        a = int(t * sr)
        if a >= n:
            continue
        seg = s[: n - a]
        out[a:a + len(seg)] += seg * g_sfx
    if use_bgm:
        b = bgm(duration, sr)
        act = np.zeros(n, dtype=np.float32)
        va = voice_activity(voice, sr)[:n]
        act[: len(va)] = va
        gain = 10 ** (bgm_gain_db / 20) * (10 ** (duck_db / 20)) ** act
        out += b[:n] * gain
    peak = np.max(np.abs(out)) + 1e-6
    if peak > 0.98:
        out *= 0.98 / peak
    return out


def write_wav(path: str, x: np.ndarray, sr: int = SR):
    y = np.clip(x, -1, 1)
    pcm = (y * 32767).astype(np.int16)
    st = np.repeat(pcm[:, None], 2, axis=1)
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes(st.tobytes())
