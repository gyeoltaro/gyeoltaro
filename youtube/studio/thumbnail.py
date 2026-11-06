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


# ---------------------------------------------------------------- 레이아웃·팔레트
# 같은 틀을 매번 반복하면 시청자에게도, 유튜브 A/B 테스트에서도 구분이 안 됩니다.
# 마스코트·글꼴·노랑/흰 글자 스타일(브랜드)은 고정하고, 구도와 배경색, 소품은 영상마다·안마다 바꿉니다.
PALETTES = {
    "wine":   {"bg": ("#3B0F22", "#07091C"), "a": "#7A1020", "b": "#0F5A3A"},
    "teal":   {"bg": ("#0F3B3A", "#04100F"), "a": "#0B5A55", "b": "#6A2A10"},
    "plum":   {"bg": ("#33174D", "#0B0614"), "a": "#5B2A86", "b": "#7A4A06"},
    "amber":  {"bg": ("#4A2A06", "#140A02"), "a": "#7A4306", "b": "#0F4A3A"},
    "forest": {"bg": ("#0F3B22", "#04120A"), "a": "#146B3A", "b": "#6A1020"},
    "slate":  {"bg": ("#2B3440", "#0B0E12"), "a": "#3B4A5E", "b": "#7A2A10"},
}
LAYOUTS = ("classic", "bignum", "split", "zoom", "banner")
DEFAULT_LAYOUT = {"A": "classic", "B": "split", "C": "zoom"}


def _pick(v, variant):
    h = sum(ord(c) for c in (v.get("main", "") + v.get("top", ""))) + ord(variant)
    pal = v.get("palette") or list(PALETTES)[h % len(PALETTES)]
    lay = v.get("layout") or DEFAULT_LAYOUT.get(variant, "classic")
    return PALETTES.get(pal, PALETTES["wine"]), lay


def _props(ctx, v, rect_safe=True):
    """소품: 영상 주제에 맞게 고른다. props 로 직접 지정 가능."""
    props = v.get("props") or ["chart", "bills", "coins"]
    if "chart" in props:
        if v.get("trend") == "down":
            _falling_chart(ctx, 60, 90, 700, 470)
        else:
            _rising_chart(ctx, 60, 470, 700, 70)
    if "bills" in props:
        draw_bill(ctx, 160, 300, 220, 104, "10,000", rot=-18)
        draw_bill(ctx, 1180, 190, 190, 90, "10,000", rot=22)
    if "pie" in props:
        _pie(ctx, 215, 520, 150, [0.34, 0.26, 0.2, 0.12, 0.08])
    if "coins" in props:
        draw_coin(ctx, 1060, 90, 34, rot=0.4)
        draw_coin(ctx, 640, 420, 28, rot=0.9)


def _pie(ctx, cx, cy, r, parts):
    """분산투자를 상징하는 파이 차트."""
    cols = ["#FFE81A", "#59FF6E", "#FF5A5A", "#4DA3FF", "#C58BFF"]
    a0 = -math.pi / 2
    for i, f in enumerate(parts):
        a1 = a0 + math.tau * f
        ctx.new_path()
        ctx.move_to(cx, cy)
        ctx.arc(cx, cy, r, a0, a1)
        ctx.close_path()
        ctx.set_source_rgb(*hexc(cols[i % len(cols)]))
        ctx.fill_preserve()
        ctx.set_source_rgb(0.07, 0.07, 0.07)
        ctx.set_line_width(7)
        ctx.stroke()
        a0 = a1


def _falling_chart(ctx, x0, y0, x1, y1, color="#4DA3FF"):
    rnd = random.Random(5)
    pts = []
    n = 14
    for i in range(n + 1):
        k = i / n
        x = x0 + (x1 - x0) * k
        y = y0 + (y1 - y0) * (k ** 1.4) + rnd.uniform(-26, 26) * (1 - k * 0.5)
        pts.append((x, y))
    for w, a in ((40, 0.10), (26, 0.18), (16, 0.35)):
        ctx.new_path()
        ctx.move_to(*pts[0])
        for q in pts[1:]:
            ctx.line_to(*q)
        ctx.set_source_rgba(*hexc(color), a)
        ctx.set_line_width(w)
        ctx.set_line_join(cairo.LINE_JOIN_ROUND)
        ctx.stroke()
    ctx.new_path()
    ctx.move_to(*pts[0])
    for q in pts[1:]:
        ctx.line_to(*q)
    ctx.set_source_rgb(*hexc(color))
    ctx.set_line_width(10)
    ctx.stroke()
    ex, ey = pts[-1]
    px, py = pts[-2]
    arrow(ctx, px, py, ex + (ex - px) * 0.6, ey + (ey - py) * 0.6, color=color, width=10, head=46)


def _mascot(ctx, v, x, y, h, flip=False):
    pose = Pose(emotion=v["emotion"], arm_r=(120.0, 160.0), arm_l=ARM_POSES["lift"],
                screen=v["screen"], talk=0.75, head_tilt=-5)
    draw_mascot(ctx, x, y, h, pose, t=0.2, flip=flip, sticker=12, shadow=False)


def _note(ctx, v, x=60, y=40, rot=-4):
    text(ctx, v["note"], x, y, size=54, fname="title", color="#59FF6E", stroke=9, align="left",
         anchor=(0, 0), rot=rot)


def _layout_classic(ctx, v, pal):
    _bg(ctx, *pal["bg"])
    _props(ctx, v)
    _price_tag(ctx, 520, 230, v["tags"][0], rot=-12, scale=1.0)
    _price_tag(ctx, 1178, 392, v["tags"][1], rot=10, scale=1.0)
    _price_tag(ctx, 470, 400, v["tags"][2], rot=8, scale=0.8)
    _mascot(ctx, v, 930, 930, 860)
    _bottom_band(ctx)
    _note(ctx, v)
    arrow(ctx, 330, 120, 470, 175, color="#FF3B3B", width=9, head=30)
    text(ctx, v["top"], TW / 2, 505, size=88, fname="title", color="white", stroke=13, max_w=TW - 60)
    text(ctx, v["main"], TW / 2, 628, size=126, fname="title", color="#FFE81A", stroke=15, max_w=TW - 40)


def _layout_bignum(ctx, v, pal):
    """큰 숫자 한 개가 주인공. 숫자 = v['num'] 또는 첫 번째 tag."""
    _bg(ctx, *pal["bg"])
    ctx.set_source_rgba(1, 1, 1, 0.05)
    text(ctx, v.get("mark", "?"), 380, 330, size=700, fname="title", color="#FFFFFF", alpha=0.07, stroke=0)
    _mascot(ctx, v, 1070, 940, 880)
    num = v.get("num") or v["tags"][0]
    text(ctx, v["top"], 400, 95, size=70, fname="title", color="white", stroke=11, max_w=760)
    nsize = 300 if len(num) <= 4 else 215 if len(num) <= 6 else 165 if len(num) <= 9 else 125
    text(ctx, num, 400, 330, size=nsize, fname="title", color="#FFE81A", stroke=20, max_w=780)
    round_rect(ctx, 40, 505, 740, 150, 30)
    ctx.set_source_rgba(0, 0, 0, 0.62)
    ctx.fill()
    text(ctx, v["main"], 410, 580, size=96 if len(v["main"]) <= 8 else 72, fname="title", color="white", stroke=12, max_w=700)
    _note(ctx, v, x=40, y=170, rot=-3) if False else None
    text(ctx, v["note"], 1090, 70, size=44, fname="title", color="#59FF6E", stroke=8, rot=3, max_w=330)


def _layout_split(ctx, v, pal):
    """왼쪽 숫자 vs 오른쪽 숫자 (전/후, 이전/지금)."""
    _bg(ctx, *pal["bg"])
    ctx.new_path()
    ctx.move_to(0, 0); ctx.line_to(700, 0); ctx.line_to(560, 720); ctx.line_to(0, 720); ctx.close_path()
    ctx.set_source_rgba(*hexc(pal["a"]), 0.92)
    ctx.fill()
    ctx.new_path()
    ctx.move_to(700, 0); ctx.line_to(1280, 0); ctx.line_to(1280, 720); ctx.line_to(560, 720); ctx.close_path()
    ctx.set_source_rgba(*hexc(pal["b"]), 0.92)
    ctx.fill()
    ctx.new_path()
    ctx.move_to(700, 0); ctx.line_to(560, 720)
    ctx.set_source_rgb(1, 1, 1)
    ctx.set_line_width(10)
    ctx.stroke()
    labels = v.get("labels") or ["", ""]
    if labels[0]:
        text(ctx, labels[0], 290, 60, size=60, fname="title", color="white", stroke=9)
    if labels[1]:
        text(ctx, labels[1], 940, 60, size=60, fname="title", color="white", stroke=9)
    left, right = v["tags"][0], v["tags"][1]
    text(ctx, left, 290, 230, size=150 if len(left) <= 6 else 110, fname="title", color="white", stroke=15, max_w=520)
    text(ctx, right, 930, 230, size=150 if len(right) <= 6 else 110, fname="title", color="#FFE81A", stroke=15, max_w=520)
    arrow(ctx, 480, 380, 780, 380, color="#FFE81A", width=18, head=56)
    _bottom_band(ctx)
    _mascot(ctx, v, 1150, 1000, 640)
    text(ctx, v["top"], 450, 548, size=74, fname="title", color="white", stroke=12, max_w=880)
    text(ctx, v["main"], 450, 650, size=104, fname="title", color="#FFE81A", stroke=14, max_w=880)


def _split2(main):
    """긴 제목은 단어 경계에서 두 줄로 나눈다."""
    w = main.split()
    if len(main) <= 6 or len(w) < 2:
        return main, ""
    best = min(range(1, len(w)), key=lambda i: max(len(" ".join(w[:i])), len(" ".join(w[i:]))))
    return " ".join(w[:best]), " ".join(w[best:])


def _layout_zoom(ctx, v, pal):
    """캐릭터를 크게(왼쪽), 오른쪽에 글자를 세로로 쌓는 구도."""
    _bg(ctx, *pal["bg"])
    _props(ctx, dict(v, props=v.get("props") or ["coins"]))
    _mascot(ctx, v, 330, 1010, 1060)
    text(ctx, v["note"], 700, 70, size=50, fname="title", color="#59FF6E", stroke=9, align="left", anchor=(0, 0), rot=-3)
    text(ctx, v["top"], 690, 290, size=66, fname="title", color="white", stroke=11, align="left", anchor=(0, 0.5), max_w=560)
    l1, l2 = _split2(v["main"])
    if l2:
        zs = 130 if max(len(l1), len(l2)) <= 5 else 100 if max(len(l1), len(l2)) <= 7 else 82
        text(ctx, l1, 690, 430, size=zs, fname="title", color="#FFE81A", stroke=16, align="left", anchor=(0, 0.5), max_w=580)
        text(ctx, l2, 690, 565, size=zs, fname="title", color="#FFE81A", stroke=16, align="left", anchor=(0, 0.5), max_w=580)
    else:
        text(ctx, l1, 690, 480, size=118, fname="title", color="#FFE81A", stroke=15, align="left", anchor=(0, 0.5), max_w=580)
    _price_tag(ctx, 1110, 90, v["tags"][0], rot=-8, scale=0.8)


def _layout_banner(ctx, v, pal):
    """왼쪽 대각선 띠에 글자를 쌓고, 오른쪽에 캐릭터."""
    _bg(ctx, *pal["bg"])
    _props(ctx, dict(v, props=[x for x in (v.get("props") or ["pie"]) if x != "pie"]))
    ctx.new_path()
    ctx.move_to(0, 70); ctx.line_to(820, 20); ctx.line_to(760, 660); ctx.line_to(0, 700); ctx.close_path()
    ctx.set_source_rgba(*hexc(pal["a"]), 0.94)
    ctx.fill_preserve()
    ctx.set_source_rgb(1, 1, 1)
    ctx.set_line_width(9)
    ctx.stroke()
    if "pie" in (v.get("props") or ["pie"]):
        _pie(ctx, 110, 600, 80, [0.34, 0.26, 0.2, 0.12, 0.08])
    _mascot(ctx, v, 1040, 960, 880)
    text(ctx, v["note"], 40, 100, size=52, fname="title", color="#59FF6E", stroke=9, align="left", anchor=(0, 0), rot=-3, max_w=700)
    text(ctx, v["top"], 380, 330, size=64, fname="title", color="white", stroke=11, max_w=700)
    l1, l2 = _split2(v["main"]) if len(v["main"]) > 6 else (v["main"], "")
    if l2:
        bs = 104 if max(len(l1), len(l2)) <= 6 else 88
        text(ctx, l1, 400, 445, size=bs, fname="title", color="#FFE81A", stroke=15, max_w=700)
        text(ctx, l2, 400, 565, size=bs, fname="title", color="#FFE81A", stroke=15, max_w=700)
    else:
        text(ctx, l1, 380, 500, size=118, fname="title", color="#FFE81A", stroke=15, max_w=700)


def make_thumbnail(path: str, variant: str = "A", overrides: dict | None = None):
    v = dict(VARIANTS.get(variant, VARIANTS["A"]))
    if overrides:
        v.update(overrides)
    pal, lay = _pick(v, variant)
    surf = cairo.ImageSurface(cairo.FORMAT_ARGB32, TW, TH)
    ctx = cairo.Context(surf)
    {"classic": _layout_classic, "bignum": _layout_bignum, "split": _layout_split, "zoom": _layout_zoom, "banner": _layout_banner}.get(lay, _layout_classic)(ctx, v, pal)
    surf.write_to_png(path)
    return path
