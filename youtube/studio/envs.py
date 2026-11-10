"""밝은 '장면' 배경 (스토리 룩, meta.look = "story").

2026-11-10 영상 레퍼런스 연구(learning/video_study.md): 잘 된 얼굴 없는 경제 채널은
  - 화면 전체가 밝고 따뜻한 '장소 그림'(사무실·도시·은행·거실·시장)으로 채워져 있고
  - 막대 인간 캐릭터가 그 장소 '안에서' 연기하며
  - 문장마다 그림이 바뀌고, 글자는 적고, 자막은 아래 한 줄.
우리 영상은 어두운 단색 배경 위에 글자 카드 → 장소 배경을 깔고, 정보 카드는 그 장소 안의 '보드(모니터)'로 보이게 바꾼다.
모든 그림은 코드로 그린 벡터(외부 이미지·남의 그림 없음).
"""
from __future__ import annotations

import math
import random

import cairo

from .core import H, W, hexc, round_rect

ENVS = ("office", "city", "bank", "home", "study", "market", "night")


def _sky(ctx, top, bottom, y1=H):
    g = cairo.LinearGradient(0, 0, 0, y1)
    g.add_color_stop_rgb(0, *hexc(top))
    g.add_color_stop_rgb(1, *hexc(bottom))
    ctx.set_source(g)
    ctx.rectangle(0, 0, W, y1)
    ctx.fill()


def _sun(ctx, x, y, r, col="#FFF2B3"):
    g = cairo.RadialGradient(x, y, r * 0.2, x, y, r * 4)
    rr, gg, bb = hexc(col)
    g.add_color_stop_rgba(0, rr, gg, bb, 0.95)
    g.add_color_stop_rgba(0.25, rr, gg, bb, 0.35)
    g.add_color_stop_rgba(1, rr, gg, bb, 0)
    ctx.set_source(g)
    ctx.arc(x, y, r * 4, 0, math.tau)
    ctx.fill()
    ctx.set_source_rgb(rr, gg, bb)
    ctx.arc(x, y, r, 0, math.tau)
    ctx.fill()


def _cloud(ctx, x, y, s, a=0.9):
    ctx.set_source_rgba(1, 1, 1, a)
    for dx, dy, r in ((0, 0, 40), (45, -18, 52), (100, 0, 42), (50, 12, 46)):
        ctx.new_path()
        ctx.arc(x + dx * s, y + dy * s, r * s, 0, math.tau)
        ctx.fill()


def _skyline(ctx, rnd, base, hmin, hmax, col, win, a=1.0, x0=-20, x1=W + 40):
    x = x0
    while x < x1:
        w = rnd.randint(70, 150)
        h = rnd.randint(hmin, hmax)
        ctx.new_path()
        ctx.rectangle(x, base - h, w, h + 400)
        ctx.set_source_rgba(*hexc(col), a)
        ctx.fill()
        ctx.set_source_rgba(*hexc(win), 0.55 * a)
        for wy in range(int(base - h + 16), int(base) - 12, 30):
            for wx in range(int(x + 12), int(x + w - 16), 26):
                if rnd.random() < 0.6:
                    ctx.rectangle(wx, wy, 13, 16)
        ctx.fill()
        x += w + rnd.randint(6, 22)


def _plant(ctx, x, y, s=1.0):
    ctx.new_path()
    ctx.move_to(x - 40 * s, y)
    ctx.line_to(x + 40 * s, y)
    ctx.line_to(x + 30 * s, y + 70 * s)
    ctx.line_to(x - 30 * s, y + 70 * s)
    ctx.close_path()
    ctx.set_source_rgb(*hexc("#C9714A"))
    ctx.fill()
    for ang, ln in ((-1.9, 120), (-1.4, 150), (-1.0, 125), (-2.3, 100), (-0.6, 95)):
        ctx.new_path()
        ex, ey = x + math.cos(ang) * ln * s, y + math.sin(ang) * ln * s
        ctx.move_to(x, y)
        ctx.curve_to(x, y - 40 * s, ex - 20 * s, ey + 20 * s, ex, ey)
        ctx.curve_to(ex + 25 * s, ey + 25 * s, x + 10 * s, y - 30 * s, x, y)
        ctx.set_source_rgb(*hexc("#3FA36B"))
        ctx.fill()


def _window(ctx, x, y, w, h, rnd, sky=("#8FD3FF", "#DDF3FF")):
    ctx.save()
    ctx.new_path()
    ctx.rectangle(x, y, w, h)
    ctx.clip()
    g = cairo.LinearGradient(0, y, 0, y + h)
    g.add_color_stop_rgb(0, *hexc(sky[0]))
    g.add_color_stop_rgb(1, *hexc(sky[1]))
    ctx.set_source(g)
    ctx.paint()
    _cloud(ctx, x + w * 0.2, y + h * 0.25, 0.7)
    _skyline(ctx, rnd, y + h, 80, int(h * 0.6), "#9DB4CC", "#FFFFFF", 0.9, x - 10, x + w + 10)
    ctx.restore()
    ctx.set_source_rgb(*hexc("#FFFFFF"))
    ctx.set_line_width(16)
    ctx.rectangle(x, y, w, h)
    ctx.stroke()
    ctx.set_line_width(10)
    ctx.move_to(x + w / 2, y)
    ctx.line_to(x + w / 2, y + h)
    ctx.stroke()


def _floor(ctx, y, col1, col2):
    g = cairo.LinearGradient(0, y, 0, H)
    g.add_color_stop_rgb(0, *hexc(col1))
    g.add_color_stop_rgb(1, *hexc(col2))
    ctx.set_source(g)
    ctx.rectangle(0, y, W, H - y)
    ctx.fill()


def _office(ctx, rnd):
    _sky(ctx, "#F6E7D2", "#EED8BC")
    _window(ctx, 120, 110, 760, 520, rnd)
    _window(ctx, 1040, 110, 760, 520, rnd)
    _floor(ctx, 780, "#C79A6B", "#A87A4E")
    # 책상과 모니터
    ctx.set_source_rgb(*hexc("#8A5A36"))
    ctx.rectangle(0, 760, W, 40)
    ctx.fill()
    for mx in (300, 1500):
        ctx.set_source_rgb(*hexc("#2B2F3A"))
        round_rect(ctx, mx - 130, 610, 260, 150, 10)
        ctx.fill()
        ctx.set_source_rgb(*hexc("#1E5B8C"))
        ctx.rectangle(mx - 115, 625, 230, 115)
        ctx.fill()
        ctx.set_source_rgb(*hexc("#5CE08F"))
        ctx.set_line_width(5)
        pts = [(mx - 105, 720), (mx - 60, 690), (mx - 20, 705), (mx + 30, 660), (mx + 100, 640)]
        ctx.move_to(*pts[0])
        for p in pts[1:]:
            ctx.line_to(*p)
        ctx.stroke()
    _plant(ctx, 1820, 690, 0.9)
    _plant(ctx, 80, 690, 0.8)


def _city(ctx, rnd):
    _sky(ctx, "#7CC8FF", "#FFE3B8", 860)
    _sun(ctx, 1500, 230, 70)
    _cloud(ctx, 260, 180, 1.2)
    _cloud(ctx, 900, 120, 0.9)
    _skyline(ctx, rnd, 820, 200, 460, "#9AAFC9", "#FFFFFF", 0.85)
    _skyline(ctx, rnd, 880, 120, 330, "#5F7896", "#FFE9A8", 1.0)
    _floor(ctx, 860, "#7C8794", "#5E6873")
    ctx.set_source_rgb(1, 1, 1)
    for x in range(0, W, 160):
        ctx.rectangle(x, 960, 90, 10)
    ctx.fill()
    for x in (180, 640, 1280, 1760):
        ctx.set_source_rgb(*hexc("#6B4A2E"))
        ctx.rectangle(x - 8, 800, 16, 70)
        ctx.fill()
        ctx.set_source_rgb(*hexc("#4FB06F"))
        ctx.arc(x, 780, 55, 0, math.tau)
        ctx.fill()


def _bank(ctx, rnd):
    _sky(ctx, "#F3EEE4", "#E3DACB")
    ctx.set_source_rgb(*hexc("#D8CDBA"))
    ctx.rectangle(0, 0, W, 120)
    ctx.fill()
    for x in range(110, W, 300):
        g = cairo.LinearGradient(x - 50, 0, x + 50, 0)
        g.add_color_stop_rgb(0, *hexc("#E9E1D2"))
        g.add_color_stop_rgb(0.5, *hexc("#FFFFFF"))
        g.add_color_stop_rgb(1, *hexc("#D6CAB5"))
        ctx.set_source(g)
        ctx.rectangle(x - 50, 120, 100, 680)
        ctx.fill()
        ctx.set_source_rgb(*hexc("#CBBEA7"))
        ctx.rectangle(x - 70, 110, 140, 30)
        ctx.rectangle(x - 70, 790, 140, 30)
        ctx.fill()
    # 금고 문
    ctx.set_source_rgb(*hexc("#9AA3AE"))
    ctx.arc(W - 260, 520, 170, 0, math.tau)
    ctx.fill()
    ctx.set_source_rgb(*hexc("#6E7884"))
    ctx.set_line_width(14)
    ctx.arc(W - 260, 520, 130, 0, math.tau)
    ctx.stroke()
    for k in range(6):
        a = k * math.pi / 3
        ctx.move_to(W - 260, 520)
        ctx.line_to(W - 260 + math.cos(a) * 80, 520 + math.sin(a) * 80)
    ctx.stroke()
    _floor(ctx, 820, "#B9A27E", "#8C7553")
    ctx.set_source_rgba(1, 1, 1, 0.18)
    for x in range(-200, W + 200, 160):
        ctx.move_to(x, 820)
        ctx.line_to(x - 300, H)
    ctx.set_line_width(3)
    ctx.stroke()


def _home(ctx, rnd):
    _sky(ctx, "#E7F1EA", "#D4E6DA")
    _window(ctx, 1180, 120, 560, 460, rnd, ("#FFC48A", "#FFE9CC"))
    # 책장
    ctx.set_source_rgb(*hexc("#9C6B43"))
    ctx.rectangle(140, 160, 420, 620)
    ctx.fill()
    for i, y in enumerate(range(200, 760, 130)):
        ctx.set_source_rgb(*hexc("#7A4F2F"))
        ctx.rectangle(150, y + 100, 400, 14)
        ctx.fill()
        x = 170
        while x < 520:
            w = rnd.randint(18, 34)
            ctx.set_source_rgb(*hexc(rnd.choice(["#E35D5B", "#3E8ED0", "#F2C14E", "#5BBF8A", "#8E6CC9"])))
            ctx.rectangle(x, y + 100 - rnd.randint(60, 90), w, 90)
            ctx.fill()
            x += w + 4
    _floor(ctx, 800, "#D7B48A", "#B98F63")
    # 소파
    ctx.set_source_rgb(*hexc("#E07A5F"))
    round_rect(ctx, 760, 660, 520, 170, 40)
    ctx.fill()
    round_rect(ctx, 720, 720, 600, 110, 40)
    ctx.fill()
    ctx.set_source_rgb(*hexc("#C9654C"))
    round_rect(ctx, 790, 690, 220, 70, 20)
    ctx.fill()
    round_rect(ctx, 1030, 690, 220, 70, 20)
    ctx.fill()
    _plant(ctx, 1840, 720, 1.0)


def _study(ctx, rnd):
    _sky(ctx, "#E9EEF7", "#D7DFEE")
    # 칠판
    ctx.set_source_rgb(*hexc("#8A5A36"))
    round_rect(ctx, 220, 120, 1480, 640, 18)
    ctx.fill()
    ctx.set_source_rgb(*hexc("#2F5D4A"))
    ctx.rectangle(250, 150, 1420, 580)
    ctx.fill()
    ctx.set_source_rgba(1, 1, 1, 0.18)
    ctx.set_line_width(4)
    for k in range(6):
        x = rnd.randint(300, 1500)
        y = rnd.randint(200, 650)
        ctx.move_to(x, y)
        ctx.line_to(x + rnd.randint(60, 180), y + rnd.randint(-20, 20))
    ctx.stroke()
    _floor(ctx, 800, "#C8A985", "#A88661")
    ctx.set_source_rgb(*hexc("#B88654"))
    ctx.rectangle(0, 790, W, 26)
    ctx.fill()


def _market(ctx, rnd):
    _sky(ctx, "#9ED8FF", "#FFF1D6", 820)
    _sun(ctx, 300, 200, 60)
    _floor(ctx, 820, "#C9B293", "#A68D6C")
    cols = ["#E85D5D", "#F2C14E", "#4FA3E0", "#5BBF8A"]
    for i, x in enumerate(range(80, W, 460)):
        c = cols[i % 4]
        ctx.set_source_rgb(*hexc("#8A5A36"))
        ctx.rectangle(x, 380, 16, 470)
        ctx.rectangle(x + 380, 380, 16, 470)
        ctx.fill()
        for k in range(6):
            ctx.set_source_rgb(*hexc(c if k % 2 == 0 else "#FFFFFF"))
            ctx.new_path()
            ctx.move_to(x - 20 + k * 70, 330)
            ctx.line_to(x + 50 + k * 70, 330)
            ctx.line_to(x + 50 + k * 70, 420)
            ctx.arc(x + 15 + k * 70, 420, 35, 0, math.pi)
            ctx.close_path()
            ctx.fill()
        ctx.set_source_rgb(*hexc("#B98A57"))
        ctx.rectangle(x - 10, 700, 420, 110)
        ctx.fill()
        for j in range(14):
            ctx.set_source_rgb(*hexc(rnd.choice(["#E84A4A", "#F59E2B", "#7BC043", "#F2D04E"])))
            ctx.arc(x + 20 + j * 28, 690 - (j % 3) * 14, 18, 0, math.tau)
            ctx.fill()


def _night(ctx, rnd):
    _sky(ctx, "#1C2A4A", "#3E3A6B", 860)
    for _ in range(80):
        ctx.set_source_rgba(1, 1, 1, rnd.uniform(0.3, 0.9))
        ctx.arc(rnd.uniform(0, W), rnd.uniform(0, 500), rnd.uniform(1, 3), 0, math.tau)
        ctx.fill()
    _sun(ctx, 1560, 200, 50, "#FFF5D6")
    _skyline(ctx, rnd, 840, 220, 480, "#2A3557", "#FFD36B", 1.0)
    _floor(ctx, 840, "#2A2F45", "#1B1F30")


DRAW = {"office": _office, "city": _city, "bank": _bank, "home": _home, "study": _study, "market": _market,
        "night": _night}


def make_env(name: str, seed: int = 7) -> cairo.ImageSurface:
    """약간 크게 그려서(카메라 이동 여유) 반환."""
    surf = cairo.ImageSurface(cairo.FORMAT_ARGB32, W, H)
    ctx = cairo.Context(surf)
    DRAW.get(name, _office)(ctx, random.Random(seed))
    return surf


def board(ctx, area, a=1.0, fill=(0.09, 0.10, 0.13), frame="#2B2F3A"):
    """정보 카드가 놓이는 '보드(모니터)'. 장소 배경 위에서 글자를 읽기 쉽게 한다."""
    x0, y0, x1, y1 = area
    pad = 26
    x0, y0, x1, y1 = x0 - pad, y0 - pad, x1 + pad, y1 + pad
    ctx.save()
    # 그림자
    ctx.new_path()
    round_rect(ctx, x0 + 10, y0 + 16, x1 - x0, y1 - y0, 28)
    ctx.set_source_rgba(0, 0, 0, 0.28 * a)
    ctx.fill()
    ctx.new_path()
    round_rect(ctx, x0, y0, x1 - x0, y1 - y0, 28)
    ctx.set_source_rgba(*hexc(frame), a)
    ctx.fill()
    ctx.new_path()
    round_rect(ctx, x0 + 12, y0 + 12, x1 - x0 - 24, y1 - y0 - 24, 20)
    ctx.set_source_rgba(*fill, 0.94 * a)
    ctx.fill()
    ctx.restore()
