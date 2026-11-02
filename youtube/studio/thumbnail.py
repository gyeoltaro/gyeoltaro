"""썸네일 생성 (1280x720).

레퍼런스 채널(경제 해설 롱폼)에서 반복적으로 성과가 좋았던 구조를 따릅니다.
- 하단 2줄 큰 텍스트: 윗줄 흰색 / 아랫줄 노란색, 두꺼운 검은 외곽선
- 상단 좌측 작은 '속마음' 문구(초록/노랑) + 빨간 화살표
- 감정이 큰 캐릭터(놀람/충격) + 핵심 사물(그래프, 가격표, 지폐)
- 실존 인물 사진·타사 로고는 쓰지 않음 (초상권/상표 리스크 제거)
"""
from __future__ import annotations

import math
import re
import random

import cairo

from .core import arrow, draw_bill, draw_coin, hexc, round_rect, set_col, text
from .mascot import ARM_POSES, Pose, draw_mascot

TW, TH = 1280, 720


def _bg(ctx, c1="#3B0F22", c2="#07091C"):
    g = cairo.RadialGradient(TW * 0.62, TH * 0.35, 40, TW * 0.5, TH * 0.5, TW * 0.8)
    g.add_color_stop_rgb(0, *hexc(c1))
    g.add_color_stop_rgb(1, *hexc(c2))
    ctx.set_source(g)
    ctx.paint()
    # 격자
    ctx.set_source_rgba(1, 1, 1, 0.05)
    ctx.set_line_width(1.5)
    for x in range(0, TW, 64):
        ctx.move_to(x, 0)
        ctx.line_to(x, TH)
    for y in range(0, TH, 64):
        ctx.move_to(0, y)
        ctx.line_to(TW, y)
    ctx.stroke()


def _rising_chart(ctx, x0, y0, x1, y1, color="#FF3B3B"):
    rnd = random.Random(3)
    pts = []
    n = 14
    for i in range(n + 1):
        k = i / n
        x = x0 + (x1 - x0) * k
        y = y0 + (y1 - y0) * (k ** 1.6) + rnd.uniform(-22, 22) * (1 - k)
        pts.append((x, y))
    # 글로우
    for w, a in ((40, 0.10), (26, 0.18), (16, 0.35)):
        ctx.new_path()
        ctx.move_to(*pts[0])
        for p in pts[1:]:
            ctx.line_to(*p)
        ctx.set_source_rgba(*hexc(color), a)
        ctx.set_line_width(w)
        ctx.set_line_join(cairo.LINE_JOIN_ROUND)
        ctx.stroke()
    ctx.new_path()
    ctx.move_to(*pts[0])
    for p in pts[1:]:
        ctx.line_to(*p)
    ctx.set_source_rgb(*hexc(color))
    ctx.set_line_width(10)
    ctx.stroke()
    ex, ey = pts[-1]
    px, py = pts[-2]
    arrow(ctx, px, py, ex + (ex - px) * 0.6, ey + (ey - py) * 0.6, color=color, width=10, head=46)
    # 캔들 막대
    for i in range(0, n, 2):
        x, y = pts[i]
        h = 30 + i * 6
        ctx.new_path()
        ctx.rectangle(x - 9, y - h / 2, 18, h)
        ctx.set_source_rgba(*hexc("#FF3B3B" if i % 4 else "#2ECC71"), 0.55)
        ctx.fill()


def _price_tag(ctx, x, y, label, rot=-10, scale=1.0):
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(math.radians(rot))
    ctx.scale(scale, scale)
    ctx.new_path()
    ctx.move_to(-70, -50)
    ctx.line_to(110, -50)
    ctx.line_to(110, 50)
    ctx.line_to(-70, 50)
    ctx.line_to(-110, 0)
    ctx.close_path()
    ctx.set_source_rgb(*hexc("#FFF1C9"))
    ctx.fill_preserve()
    ctx.set_source_rgb(0.07, 0.07, 0.07)
    ctx.set_line_width(6)
    ctx.stroke()
    ctx.new_path()
    ctx.arc(-72, 0, 11, 0, math.tau)
    ctx.fill()
    ctx.restore()
    text(ctx, label, x + 18 * scale, y, size=int(50 * scale), fname="title", color="#D7261E",
         rot=rot)


def _bottom_band(ctx):
    g = cairo.LinearGradient(0, TH * 0.48, 0, TH)
    g.add_color_stop_rgba(0, 0, 0, 0, 0)
    g.add_color_stop_rgba(0.45, 0, 0, 0, 0.72)
    g.add_color_stop_rgba(1, 0, 0, 0, 0.92)
    ctx.set_source(g)
    ctx.rectangle(0, TH * 0.48, TW, TH * 0.52)
    ctx.fill()


VARIANTS = {
    "A": {"top": "15분 만에 끝내는", "main": "인플레이션의 모든 것", "note": "월급 빼고\n다 오른다 ㄷㄷ",
          "tags": ["↑15%", "↑32%", "↑8%"], "screen": "up", "emotion": "shock"},
    "B": {"top": "내 월급만 제자리인", "main": "진짜 이유", "note": "범인은\n인플레이션",
          "tags": ["↑20%", "↑35%", "↑12%"], "screen": "alert", "emotion": "angry"},
    "C": {"top": "통장 속 1,000만 원이", "main": "744만 원 된다?", "note": "가만히 있어도\n돈이 녹는다",
          "tags": ["-256만", "↑3%", "↑3%"], "screen": "down", "emotion": "shock"},
}


def auto_variants(title: str, minutes: int) -> dict:
    """대본 meta.thumbnails 가 없을 때 제목에서 A/B/C 문구를 만든다."""
    m = re.match(r"^\s*[“\"](.*?)[”\"]\s*(.*)$", title or "")
    hook = (m.group(1) if m else "").strip(" .…")
    core = (m.group(2) if m else title).strip()
    core = re.sub(r"^\d+\s*분\s*만에\s*(끝내는|알아보는)?\s*", "", core) or core
    note = hook.replace(" ", "\n", 1) if hook else "모르면\n손해 봅니다"
    return {
        "A": {"top": f"{minutes}분 만에 끝내는", "main": core, "note": note, "tags": ["↑", "₩", "%"],
              "screen": "up", "emotion": "shock"},
        "B": {"top": hook or "모르면 손해 보는", "main": core, "note": f"{minutes}분\n총정리", "tags": ["₩", "↑", "%"],
              "screen": "alert", "emotion": "angry"},
        "C": {"top": "초등학생도 이해하는", "main": core, "note": note, "tags": ["%", "₩", "↑"],
              "screen": "won", "emotion": "surprised"},
    }


def make_thumbnail(path: str, variant: str = "A", overrides: dict | None = None):
    v = dict(VARIANTS.get(variant, VARIANTS["A"]))
    if overrides:
        v.update(overrides)
    surf = cairo.ImageSurface(cairo.FORMAT_ARGB32, TW, TH)
    ctx = cairo.Context(surf)
    _bg(ctx)
    _rising_chart(ctx, 60, 470, 700, 70)
    # 떠다니는 지폐/동전
    draw_bill(ctx, 160, 300, 220, 104, "10,000", rot=-18)
    draw_bill(ctx, 1180, 190, 190, 90, "10,000", rot=22)
    draw_coin(ctx, 1060, 90, 34, rot=0.4)
    draw_coin(ctx, 640, 420, 28, rot=0.9)
    # 가격표
    _price_tag(ctx, 520, 230, v["tags"][0], rot=-12, scale=1.0)
    _price_tag(ctx, 1150, 380, v["tags"][1], rot=10, scale=1.05)
    _price_tag(ctx, 470, 400, v["tags"][2], rot=8, scale=0.8)
    # 캐릭터
    pose = Pose(emotion=v["emotion"], arm_r=(120.0, 160.0), arm_l=ARM_POSES["lift"],
                screen=v["screen"], talk=0.75, head_tilt=-5)
    draw_mascot(ctx, 930, 930, 860, pose, t=0.2, sticker=12, shadow=False)
    _bottom_band(ctx)
    # 상단 메모
    text(ctx, v["note"], 60, 40, size=54, fname="title", color="#59FF6E", stroke=9, align="left",
         anchor=(0, 0), rot=-4)
    arrow(ctx, 330, 120, 470, 175, color="#FF3B3B", width=9, head=30)
    # 하단 2줄
    text(ctx, v["top"], TW / 2, 505, size=88, fname="title", color="white", stroke=13,
         max_w=TW - 60)
    text(ctx, v["main"], TW / 2, 628, size=126, fname="title", color="#FFE81A", stroke=15,
         max_w=TW - 40)
    surf.write_to_png(path)
    return path
