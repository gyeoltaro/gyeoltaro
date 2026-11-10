"""프레임 렌더러: 배경 + 장면 비주얼 + 캐릭터 + 자막 + 오버레이 → ffmpeg 인코딩.

여러 프로세스가 구간을 나눠 렌더링한 뒤 이어 붙입니다.
"""
from __future__ import annotations

import bisect
import math
import multiprocessing as mp
import os
import random
import subprocess
import time

import cairo

from . import core as K
from .core import (C, FPS, H, PAL, W, apply_theme, card, clamp, ease_in_out, ease_out_cubic, hexc,
                   prog, round_rect, set_col, text)
from .mascot import ARM_POSES, Pose, draw_mascot, lerp_pose
from .visuals import VISUALS, SceneCtx

LAYOUT_POS = {
    "left": (400, 935, 650, False),
    "right": (1520, 935, 650, True),
    "corner": (1700, 955, 400, True),
    "center": (960, 1000, 430, False),
    "chapter": (330, 965, 520, False),
    "hidden": (-320, 935, 650, False),
    "stage": (700, 1010, 780, False),
}

SYMBOLS = ["₩", "%", "$", "↑", "↓", "€", "¥", "₩", "%"]


class Renderer:
    def __init__(self, tl: dict):
        self.tl = tl
        self.theme = apply_theme(tl["meta"].get("theme"))
        self.scenes = tl["scenes"]
        self.starts = [s["f0"] for s in self.scenes]
        self.cap_starts = [c["start"] for c in tl["captions"]]
        self.blinks = tl["blinks"]
        self.surface = cairo.ImageSurface(cairo.FORMAT_ARGB32, W, H)
        self._bg_cache = {}
        self._bottom = self._make_bottom()
        rnd = random.Random(5)
        self.particles = [(rnd.uniform(0, W), rnd.uniform(0, H), rnd.choice(SYMBOLS),
                           rnd.randint(40, 96), rnd.uniform(8, 22), rnd.uniform(0, 6.28),
                           rnd.uniform(0.05, 0.11)) for _ in range(16)]
        # 장면별 캐릭터 스펙 미리 계산
        self.specs = [self._scene_spec(s) for s in self.scenes]
        # 모션 2.0: 장면 전환·카메라·배경 빛 (meta.motion >= 2 일 때)
        self.motion = int(tl["meta"].get("motion", 1))
        # 스토리 룩: 밝은 장소 배경 + 보드 위 정보 카드 (envs.py)
        self.look = tl["meta"].get("look", "")
        self._env_cache = {}
        self._env_of = []
        if self.look == "story":
            seq = tl["meta"].get("envs") or ["office", "city", "home", "bank", "study", "market"]
            ci = 0
            for i, sc in enumerate(self.scenes):
                if sc.get("chapter") and i > 0:
                    ci += 1
                self._env_of.append(sc.get("env") or seq[ci % len(seq)])
        self._blob = self._make_blob()
        self._vignette = self._make_vignette()
        self._tape = None

    # ------------------------------------------------------------ motion 2.0 helpers
    @staticmethod
    def _make_blob(r=520):
        surf = cairo.ImageSurface(cairo.FORMAT_ARGB32, r * 2, r * 2)
        ctx = cairo.Context(surf)
        g = cairo.RadialGradient(r, r, 0, r, r, r)
        g.add_color_stop_rgba(0, 1, 1, 1, 1)
        g.add_color_stop_rgba(0.5, 1, 1, 1, 0.35)
        g.add_color_stop_rgba(1, 1, 1, 1, 0)
        ctx.set_source(g)
        ctx.paint()
        return surf

    @staticmethod
    def _make_vignette():
        surf = cairo.ImageSurface(cairo.FORMAT_ARGB32, W, H)
        ctx = cairo.Context(surf)
        g = cairo.RadialGradient(W / 2, H / 2, H * 0.45, W / 2, H / 2, W * 0.72)
        g.add_color_stop_rgba(0, 0, 0, 0, 0)
        g.add_color_stop_rgba(1, 0, 0, 0, 0.55)
        ctx.set_source(g)
        ctx.paint()
        return surf

    def _draw_motion_bg(self, ctx, t):
        # 천천히 떠도는 빛 덩어리 3개 (테마 위에 은은하게)
        cols = [(1.0, 0.83, 0.23), (0.30, 0.64, 1.0), (0.23, 0.88, 0.48)]
        for i, (r_, g_, b_) in enumerate(cols):
            x = W * (0.5 + 0.42 * math.sin(t * (0.07 + 0.02 * i) + i * 2.1)) - 520
            y = H * (0.5 + 0.38 * math.cos(t * (0.05 + 0.015 * i) + i * 1.3)) - 520
            ctx.set_source_rgba(r_, g_, b_, 0.07)
            ctx.mask_surface(self._blob, x, y)
        # 대각선으로 지나가는 빛줄기 (약 14초 주기)
        ph = (t % 14.0) / 14.0
        bx = -600 + (W + 1200) * ph
        ctx.save()
        ctx.new_path()
        ctx.move_to(bx, 0)
        ctx.line_to(bx + 260, 0)
        ctx.line_to(bx - 140, H)
        ctx.line_to(bx - 400, H)
        ctx.close_path()
        g = cairo.LinearGradient(bx - 400, 0, bx + 260, 0)
        g.add_color_stop_rgba(0, 1, 1, 1, 0)
        g.add_color_stop_rgba(0.5, 1, 1, 1, 0.045)
        g.add_color_stop_rgba(1, 1, 1, 1, 0)
        ctx.set_source(g)
        ctx.fill()
        ctx.restore()

    # 장면 전환 종류: 대본의 scene.trans 로 지정하거나, 없으면 순서대로 돌아가며 사용
    TRANS_CYCLE = ("slide", "zoom", "wipe", "iris", "slideup", "wipe")
    TRANS_DUR = 0.6

    def _trans_type(self, si):
        s = self.scenes[si]
        if s.get("trans"):
            return s["trans"]
        if s["visual"]["type"] == "chapter":
            return "tape"
        return self.TRANS_CYCLE[si % len(self.TRANS_CYCLE)]

    def _camera(self, s, lt, t):
        """장면 카메라: 느린 줌 + 문장 시작마다 살짝 '펀치 인' + 미세한 흔들림"""
        dur = max(1.0, s["dur"])
        z = 1.0 + 0.03 * clamp(lt / dur)
        if "_beats" not in s:
            from .visuals import visual_events
            bt = sorted({round(ln["start"] - s["start"], 2) for ln in s["lines"]} |
                        {round(tt - s["start"], 2) for tt, _k in visual_events(s)})
            s["_beats"] = bt
        for b in s["_beats"]:
            d = lt - b
            if 0 <= d < 1.2:
                z += 0.016 * (1 - math.exp(-d * 16)) * math.exp(-d * 3.2)
        dx = 7 * math.sin(t * 0.23)
        dy = 5 * math.cos(t * 0.19)
        # 강조 흔들림 (visual.shake_at: 문장 번호 목록)
        sh = s["visual"].get("shake_at") or []
        S = SceneCtx(s, lt, t)
        for a in sh:
            d = lt - S.at(a)
            if 0 <= d < 0.45:
                amp = 14 * (1 - d / 0.45)
                dx += amp * math.sin(d * 90)
                dy += amp * math.cos(d * 77)
        return z, dx, dy

    def _draw_visual(self, ctx, si, lt, t):
        s = self.scenes[si]
        vis = s["visual"]
        S = SceneCtx(s, lt, t)
        z, dx, dy = self._camera(s, lt, t) if self.motion >= 2 else (1.0 + 0.018 * clamp(lt / max(1.0, s["dur"])), 0, 0)
        ctx.save()
        ctx.translate(W / 2 + dx, H / 2 + dy)
        ctx.scale(z, z)
        ctx.translate(-W / 2, -H / 2)
        if self.look == "story" and vis["type"] not in ("chapter", "stage", "outro"):
            from .envs import board
            board(ctx, S.area, a=clamp(lt / 0.25) if si == 0 else 1.0)
        VISUALS[vis["type"]](ctx, S)
        ctx.restore()

    def _hazard(self, ctx, y0, h, shift, a=1.0):
        ctx.save()
        ctx.new_path()
        ctx.rectangle(-400, y0, W + 800, h)
        ctx.set_source_rgba(1.0, 0.83, 0.23, a)
        ctx.fill()
        ctx.rectangle(-400, y0, W + 800, h)
        ctx.clip()
        ctx.set_source_rgba(0.07, 0.07, 0.07, a)
        for k in range(-12, 40):
            x = k * 90 + shift % 90
            ctx.new_path()
            ctx.move_to(x, y0)
            ctx.line_to(x + 45, y0)
            ctx.line_to(x + 45 - h, y0 + h)
            ctx.line_to(x - h, y0 + h)
            ctx.close_path()
            ctx.fill()
        ctx.restore()

    def _composite(self, ctx, A, B, k, kind):
        e = ease_in_out(k)
        if kind == "slide" or kind == "slideup":
            horiz = kind == "slide"
            ctx.save()
            ctx.translate(-W * 0.55 * e if horiz else 0, 0 if horiz else -H * 0.55 * e)
            ctx.set_source(A)
            ctx.paint_with_alpha(1 - e)
            ctx.restore()
            ctx.save()
            ctx.translate(W * (1 - e) if horiz else 0, 0 if horiz else H * (1 - e))
            ctx.set_source(B)
            ctx.paint()
            ctx.restore()
            # 속도선
            a = 0.35 * math.sin(math.pi * e)
            ctx.set_source_rgba(1, 1, 1, a)
            rnd = random.Random(7)
            for _ in range(14):
                if horiz:
                    y = rnd.uniform(120, H - 160)
                    x = rnd.uniform(0, W)
                    ctx.rectangle(x, y, rnd.uniform(160, 520), 3)
                else:
                    x = rnd.uniform(120, W - 120)
                    y = rnd.uniform(0, H)
                    ctx.rectangle(x, y, 3, rnd.uniform(120, 360))
            ctx.fill()
        elif kind == "zoom":
            ctx.save()
            ctx.translate(W / 2, H / 2)
            ctx.scale(1 + 0.35 * e, 1 + 0.35 * e)
            ctx.translate(-W / 2, -H / 2)
            ctx.set_source(A)
            ctx.paint_with_alpha(1 - e)
            ctx.restore()
            ctx.save()
            sc = 0.82 + 0.18 * e
            ctx.translate(W / 2, H / 2)
            ctx.scale(sc, sc)
            ctx.translate(-W / 2, -H / 2)
            ctx.set_source(B)
            ctx.paint_with_alpha(e)
            ctx.restore()
        elif kind == "wipe":
            bx = -500 + (W + 1000) * e
            ctx.save()
            ctx.new_path()
            ctx.move_to(bx + 300, 0)
            ctx.line_to(W + 600, 0)
            ctx.line_to(W + 600, H)
            ctx.line_to(bx - 300, H)
            ctx.close_path()
            ctx.clip()
            ctx.set_source(A)
            ctx.paint()
            ctx.restore()
            ctx.save()
            ctx.new_path()
            ctx.move_to(-600, 0)
            ctx.line_to(bx + 300, 0)
            ctx.line_to(bx - 300, H)
            ctx.line_to(-600, H)
            ctx.close_path()
            ctx.clip()
            ctx.set_source(B)
            ctx.paint()
            ctx.restore()
            # 노란 띠
            ctx.save()
            ctx.new_path()
            ctx.move_to(bx + 300, 0)
            ctx.line_to(bx + 360, 0)
            ctx.line_to(bx - 240, H)
            ctx.line_to(bx - 300, H)
            ctx.close_path()
            ctx.set_source_rgba(1.0, 0.83, 0.23, 0.95)
            ctx.fill()
            ctx.restore()
        elif kind == "iris":
            ctx.set_source(A)
            ctx.paint_with_alpha(1 - 0.6 * e)
            r = math.hypot(W, H) * 0.55 * e
            ctx.save()
            ctx.new_path()
            ctx.arc(W / 2, H / 2, max(r, 1), 0, math.tau)
            ctx.clip()
            ctx.set_source(B)
            ctx.paint()
            ctx.restore()
            ctx.new_path()
            ctx.arc(W / 2, H / 2, max(r, 1), 0, math.tau)
            ctx.set_source_rgba(1.0, 0.83, 0.23, 0.9 * (1 - e))
            ctx.set_line_width(14)
            ctx.stroke()
        elif kind == "tape":
            # 노랑·검정 경고 테이프가 화면을 덮었다가 걷히며 장면 교체
            cover = math.sin(math.pi * e)
            ctx.set_source(A if e < 0.5 else B)
            ctx.paint()
            ctx.save()
            ctx.translate(W / 2, H / 2)
            ctx.rotate(-0.12)
            ctx.translate(-W / 2, -H / 2)
            h = 220
            for i in range(-1, 7):
                y = -260 + i * h * 0.98
                off = (W + 600) * (1 - cover) * (1 if i % 2 else -1)
                ctx.save()
                ctx.translate(off, 0)
                self._hazard(ctx, y, h * 0.92, e * 900 * (1 if i % 2 else -1))
                ctx.restore()
            ctx.restore()
        else:
            ctx.set_source(B)
            ctx.paint_with_alpha(e)

    # ------------------------------------------------------------ backgrounds
    def _bg(self, theme):
        if theme not in self._bg_cache:
            th = self.theme
            c1, c2 = th["tints"].get(theme, th["base"]) if theme not in (None, "base", "navy") else th["base"]
            surf = cairo.ImageSurface(cairo.FORMAT_ARGB32, W, H)
            ctx = cairo.Context(surf)
            g = cairo.RadialGradient(W * 0.5, H * 0.38, 80, W * 0.5, H * 0.5, W * 0.75)
            g.add_color_stop_rgb(0, *hexc(c1))
            g.add_color_stop_rgb(1, *hexc(c2))
            ctx.set_source(g)
            ctx.paint()
            self._bg_cache[theme] = surf
        return self._bg_cache[theme]

    def _make_bottom(self):
        surf = cairo.ImageSurface(cairo.FORMAT_ARGB32, W, 240)
        ctx = cairo.Context(surf)
        g = cairo.LinearGradient(0, 0, 0, 240)
        g.add_color_stop_rgba(0, 0, 0, 0, 0)
        g.add_color_stop_rgba(1, 0, 0, 0, 0.62)
        ctx.set_source(g)
        ctx.paint()
        return surf

    def _env(self, name):
        if name not in self._env_cache:
            from .envs import make_env
            self._env_cache[name] = make_env(name, seed=len(name) * 7 + 3)
        return self._env_cache[name]

    def _draw_env(self, ctx, si, lt, alpha=1.0):
        s = self.scenes[si]
        dur = max(1.0, s["dur"])
        k = clamp(lt / dur)
        z = 1.04 + 0.05 * k                      # 느린 줌(켄 번즈)
        dx = (-1 if si % 2 else 1) * 30 * (k - 0.5)
        ctx.save()
        ctx.translate(W / 2 + dx, H / 2)
        ctx.scale(z, z)
        ctx.translate(-W / 2, -H / 2)
        ctx.set_source_surface(self._env(self._env_of[si]), 0, 0)
        ctx.paint_with_alpha(alpha)
        ctx.restore()

    def draw_background(self, ctx, t, scene_i, lt):
        if self.look == "story":
            self._draw_env(ctx, scene_i, lt)
            if scene_i > 0 and lt < 0.6 and self._env_of[scene_i - 1] != self._env_of[scene_i]:
                ps = self.scenes[scene_i - 1]
                self._draw_env(ctx, scene_i - 1, ps["dur"], 1 - lt / 0.6)
            return
        s = self.scenes[scene_i]
        theme = s.get("bg", "navy")
        ctx.set_source_surface(self._bg(theme), 0, 0)
        ctx.paint()
        if scene_i > 0:
            prev = self.scenes[scene_i - 1].get("bg", "navy")
            if prev != theme and lt < 0.6:
                ctx.set_source_surface(self._bg(prev), 0, 0)
                ctx.paint_with_alpha(1 - lt / 0.6)
        # 움직이는 격자
        off = (t * 14) % 80
        ctx.set_line_width(1.5)
        ctx.set_source_rgba(1, 1, 1, self.theme["grid"])
        for x in range(-80, W + 80, 80):
            ctx.move_to(x + off, 0)
            ctx.line_to(x + off, H)
        for y in range(-80, H + 80, 80):
            ctx.move_to(0, y + off * 0.5)
            ctx.line_to(W, y + off * 0.5)
        ctx.stroke()
        if self.motion >= 2:
            self._draw_motion_bg(ctx, t)
        # 떠다니는 기호
        for (x0, y0, sym, size, spd, ph, a) in self.particles:
            y = (y0 - t * spd) % (H + 200) - 100
            x = x0 + math.sin(t * 0.4 + ph) * 30
            text(ctx, sym, x, y, size=size, fname="black", color="white", alpha=a * self.theme["symbols"],
                 rot=math.sin(t * 0.3 + ph) * 12)

    # ------------------------------------------------------------ mascot
    def _scene_spec(self, s):
        m = dict(s.get("mascot", {}))
        m.setdefault("layout", "left")
        if s["visual"]["type"] == "chapter":
            m.setdefault("layout", "chapter")
        return m

    def _spec_at(self, si, lt):
        """현재 시점의 캐릭터 스펙과, 직전 스펙/전환 시작 시각"""
        s = self.scenes[si]
        base = self.specs[si]
        overrides = base.get("at", {})
        starts = [ln["start"] - s["start"] for ln in s["lines"]]
        cur = dict(base)
        prev = dict(self.specs[si - 1]) if si > 0 else dict(base)
        if si > 0:
            # 직전 장면의 마지막 오버라이드까지 반영
            ps = self.scenes[si - 1]
            pst = [ln["start"] - ps["start"] for ln in ps["lines"]]
            for k in sorted(self.specs[si - 1].get("at", {}), key=lambda x: int(x)):
                if int(k) < len(pst):
                    prev.update(self.specs[si - 1]["at"][k])
        since = lt
        for k in sorted(overrides, key=lambda x: int(x)):
            ki = int(k)
            if ki < len(starts) and starts[ki] <= lt:
                prev = dict(cur)
                cur.update(overrides[k])
                since = lt - starts[ki]
        return cur, prev, since

    @staticmethod
    def _pose_from(spec, t):
        p = Pose()
        p.emotion = spec.get("emotion", "neutral")
        p.arm_r = ARM_POSES[spec.get("pose", "hold")]
        p.arm_l = ARM_POSES[spec.get("arm_l", "carry")]
        p.screen = spec.get("screen", "logo")
        p.glow = spec.get("glow", 1.0)
        return p

    def draw_character(self, ctx, fi, t, si, lt):
        s = self.scenes[si]
        spec, prev, since = self._spec_at(si, lt)
        if spec.get("layout") == "none":
            return
        k = ease_in_out(since / 0.35)
        pose = lerp_pose(self._pose_from(prev, t), self._pose_from(spec, t), k)
        # 위치 이동(걷기)
        tgt = LAYOUT_POS.get(spec["layout"], LAYOUT_POS["left"])
        src = tgt
        if si > 0:
            src = LAYOUT_POS.get(prev.get("layout", "left"), LAYOUT_POS["left"])
        dist = abs(tgt[0] - src[0])
        walk_dur = min(1.3, 0.35 + dist / 900) if dist > 30 else 0.0
        x, y, h, flip = tgt
        if walk_dur and lt < walk_dur and since >= lt - 1e-6:
            kk = ease_in_out(lt / walk_dur)
            x = src[0] + (tgt[0] - src[0]) * kk
            y = src[1] + (tgt[1] - src[1]) * kk
            h = src[2] + (tgt[2] - src[2]) * kk
            flip = tgt[0] < src[0]
            travelled = abs(x - src[0])
            pose.walk = (travelled / (h * 0.55)) % 1.0
            pose.lean = 3.0
        # 숨쉬기/말하기 움직임
        talk = float(self.tl["mouth"][min(fi, len(self.tl["mouth"]) - 1)])
        pose.talk = talk
        pose.head_tilt = 2.5 * math.sin(t * 1.3) + talk * 3.0 * math.sin(t * 7.0)
        pose.bob = 3.0 * math.sin(t * 2.4) + talk * 4.0
        pose.look = (0.5, 0.0)
        # 눈 깜빡임
        j = bisect.bisect_right(self.blinks, t) - 1
        if j >= 0 and t - self.blinks[j] < 0.13:
            pose.blink = 1.0
        # 모자 인사
        if spec.get("hat"):
            hp = prog(lt, 0.3, 1.6)
            pose.hat_lift = math.sin(hp * math.pi) if 0 < hp < 1 else 0.0
        # 점프(놀람/강조)
        starts = [ln["start"] - s["start"] for ln in s["lines"]]
        for hi in spec.get("hop", []):
            if hi < len(starts):
                ht = lt - starts[hi]
                if 0 <= ht < 0.55:
                    q = ht / 0.55
                    pose.bob += 60 * math.sin(q * math.pi)
                    pose.squash = -0.06 * math.sin(q * math.pi) + (0.08 * math.sin((q - 0.8) / 0.2 * math.pi) if q > 0.8 else 0)
        draw_mascot(ctx, x, y, h, pose, t=t, flip=flip, sticker=7.0,
                    shadow_rgba=(0, 0, 0, 0.35))

    # ------------------------------------------------------------ overlay
    def draw_overlay(self, ctx, t, si):
        # 로고
        pulse = 0.5 + 0.5 * math.sin(t * 5)
        g = cairo.RadialGradient(58, 52, 2, 58, 52, 34)
        g.add_color_stop_rgba(0, 1, 0.3, 0.3, 0.9)
        g.add_color_stop_rgba(1, 1, 0.2, 0.2, 0)
        ctx.set_source(g)
        ctx.new_path()
        ctx.arc(58, 52, 34 * (0.7 + 0.3 * pulse), 0, math.tau)
        ctx.fill()
        ctx.new_path()
        ctx.arc(58, 52, 13, 0, math.tau)
        set_col(ctx, "red")
        ctx.fill()
        text(ctx, self.tl["meta"].get("channel", "부의비상사태 911"), 88, 52, size=32, fname="black",
             color="white", anchor=(0, 0.5), align="left", alpha=0.92, stroke=4)
        # 챕터 표시
        chs = self.tl["chapters"]
        cur = None
        for c in chs:
            if c["t"] <= t + 1e-6:
                cur = c
        if cur and si > 0:
            lab = cur["title"]
            surf_w = len(lab) * 30 + 70
            x1 = W - 40
            card(ctx, x1 - surf_w, 26, surf_w, 54, fill="card", line="yellow", r=27, lw=2,
                 alpha=0.9)
            text(ctx, lab, x1 - surf_w / 2, 53, size=30, fname="xbold", color="yellow")
        # 진행 바
        p = t / self.tl["total"]
        ctx.new_path()
        ctx.rectangle(0, 0, W, 7)
        ctx.set_source_rgba(1, 1, 1, 0.12)
        ctx.fill()
        ctx.new_path()
        ctx.rectangle(0, 0, W * p, 7)
        set_col(ctx, "yellow")
        ctx.fill()
        for c in chs[1:]:
            ctx.new_path()
            ctx.rectangle(W * c["t"] / self.tl["total"] - 2, 0, 4, 7)
            set_col(ctx, "ink")
            ctx.fill()

    def draw_caption(self, ctx, t):
        i = bisect.bisect_right(self.cap_starts, t) - 1
        if i < 0:
            return
        c = self.tl["captions"][i]
        if t > c["end"]:
            return
        a = clamp((t - c["start"]) / 0.08) * clamp((c["end"] - t) / 0.08)
        text(ctx, c["display"], W / 2, 1002, size=54, fname="xbold", color="white", stroke=8,
             alpha=a, max_w=1600)

    # ------------------------------------------------------------ frame
    def scene_index(self, fi):
        return max(0, bisect.bisect_right(self.starts, fi) - 1)

    def render(self, fi: int) -> bytes:
        t = fi / FPS
        si = self.scene_index(fi)
        s = self.scenes[si]
        lt = t - s["start"]
        ctx = cairo.Context(self.surface)
        ctx.set_antialias(cairo.ANTIALIAS_GOOD)
        self.draw_background(ctx, t, si, lt)
        vis = s["visual"]
        if vis["type"] == "chapter":
            # 챕터 카드 뒤 이전 장면 대신 어두운 막
            ctx.set_source_rgba(0, 0, 0, 0.25)
            ctx.paint()
        if self.motion >= 2:
            TD = self.TRANS_DUR
            if si > 0 and lt < TD:
                ps = self.scenes[si - 1]
                ctx.push_group()
                self._draw_visual(ctx, si - 1, ps["dur"] - 1e-3, t)
                A = ctx.pop_group()
                ctx.push_group()
                self._draw_visual(ctx, si, lt, t)
                B = ctx.pop_group()
                self._composite(ctx, A, B, lt / TD, self._trans_type(si))
            else:
                self._draw_visual(ctx, si, lt, t)
        else:
            S = SceneCtx(s, lt, t)
            exit_k = prog(lt, s["dur"] - 0.22, 0.22) if vis["type"] != "chapter" else 0.0
            zoom = 1.0 + 0.018 * clamp(lt / max(1.0, s["dur"]))
            ctx.save()
            ctx.translate(W / 2, H / 2)
            ctx.scale(zoom * (1 - 0.04 * exit_k), zoom * (1 - 0.04 * exit_k))
            ctx.translate(-W / 2, -H / 2)
            if exit_k > 0:
                ctx.push_group()
            VISUALS[vis["type"]](ctx, S)
            if exit_k > 0:
                ctx.pop_group_to_source()
                ctx.paint_with_alpha(1 - exit_k)
            ctx.restore()
        self.draw_character(ctx, fi, t, si, lt)
        if self.motion >= 2:
            ctx.set_source_surface(self._vignette, 0, 0)
            ctx.paint()
        ctx.set_source_surface(self._bottom, 0, H - 240)
        ctx.paint()
        self.draw_overlay(ctx, t, si)
        self.draw_caption(ctx, t)
        self.surface.flush()
        return bytes(self.surface.get_data())


# ---------------------------------------------------------------- encoding

_R = None


def _init_worker(tl):
    global _R
    _R = Renderer(tl)


def _render_chunk(args):
    a, b, path, crf, preset = args
    cmd = ["ffmpeg", "-y", "-v", "error", "-f", "rawvideo", "-pix_fmt", "bgra", "-s", f"{W}x{H}",
           "-r", str(FPS), "-i", "-", "-vf", "scale=out_color_matrix=bt709:flags=bicubic",
           "-c:v", "libx264", "-preset", preset, "-crf", str(crf), "-pix_fmt", "yuv420p",
           "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709",
           "-threads", "2", "-g", str(FPS * 2), path]
    p = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    for fi in range(a, b):
        try:
            p.stdin.write(_R.render(fi))
        except Exception as e:
            p.stdin.close()
            p.wait()
            raise RuntimeError(f"프레임 {fi} 렌더링 실패: {e}") from e
    p.stdin.close()
    p.wait()
    if p.returncode != 0:
        raise RuntimeError(f"ffmpeg 실패: {path}")
    return b - a


def render_video(tl, video_path, workdir, workers=None, crf=20, preset="veryfast",
                 frame_range=None):
    os.makedirs(workdir, exist_ok=True)
    workers = workers or max(1, (os.cpu_count() or 2))
    a0, b0 = frame_range or (0, tl["n_frames"])
    n = b0 - a0
    seg = max(FPS * 10, n // (workers * 3) + 1)
    jobs = []
    for i, a in enumerate(range(a0, b0, seg)):
        jobs.append((a, min(b0, a + seg), os.path.join(workdir, f"chunk_{i:04d}.mp4"), crf, preset))
    t0 = time.time()
    done = 0
    # Windows에는 fork가 없어 spawn을 쓴다 (B911_MP_START 로 강제 지정 가능 — 시험용)
    method = os.environ.get("B911_MP_START") or ("fork" if "fork" in mp.get_all_start_methods() else "spawn")
    ctx = mp.get_context(method)
    with ctx.Pool(workers, initializer=_init_worker, initargs=(tl,)) as pool:
        for k in pool.imap_unordered(_render_chunk, jobs):
            done += k
            el = time.time() - t0
            print(f"\r  렌더링 {done}/{n} 프레임 ({done / n * 100:.0f}%, {done / max(el, 1e-3):.1f} fps)",
                  end="", flush=True)
    print()
    lst = os.path.join(workdir, "chunks.txt")
    with open(lst, "w") as f:
        for j in jobs:
            f.write("file '" + os.path.abspath(j[2]).replace("\\", "/") + "'\n")
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy",
                    video_path], check=True)
    for j in jobs:
        os.remove(j[2])
    return video_path


def mux(video_path, audio_wav, out_path):
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", video_path, "-i", audio_wav, "-map", "0:v",
                    "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
                    "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", "48000",
                    "-movflags", "+faststart", "-shortest", out_path], check=True)
    return out_path


def still(tl, fi, path):
    r = Renderer(tl)
    r.render(fi)
    r.surface.write_to_png(path)
