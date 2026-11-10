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
LAYOUTS = ("classic", "bignum", "split", "zoom", "banner", "duo", "hero", "split2", "scene")
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


# ---------------------------------------------------------------- 한눈에 들어오는 구도 (메시지 1개 + 그림 1개)
# 휴대폰 목록에서 썸네일은 손가락 한 마디 크기입니다. 글자 덩어리는 1~2개, 그림은 크게, 대비는 강하게.

def _glow_disc(ctx, x, y, r, col, a=0.55):
    g = cairo.RadialGradient(x, y, r * 0.2, x, y, r * 1.6)
    rr, gg, bb = hexc(col)
    g.add_color_stop_rgba(0, rr, gg, bb, a)
    g.add_color_stop_rgba(1, rr, gg, bb, 0)
    ctx.set_source(g)
    ctx.new_path()
    ctx.arc(x, y, r * 1.6, 0, math.tau)
    ctx.fill()


def _icon_badge(ctx, name, x, y, r, col):
    from . import visuals  # noqa: F401 (순환 import 방지: visuals 먼저)
    from .visuals2 import icon
    _glow_disc(ctx, x, y, r, col, 0.45)
    ctx.new_path()
    ctx.arc(x, y, r, 0, math.tau)
    ctx.set_source_rgb(1, 1, 1)
    ctx.fill_preserve()
    ctx.set_source_rgb(0.07, 0.07, 0.07)
    ctx.set_line_width(12)
    ctx.stroke()
    icon(ctx, name, x, y, r / 62)


def _layout_duo(ctx, v, pal):
    """그림 A  →  ?  →  그림 B, 아래에 큰 질문 한 줄."""
    _bg(ctx, *pal["bg"])
    ics = v.get("icons") or ["vote", "chip"]
    labels = v.get("labels") or ["", ""]
    xs = (270, 1010)
    for i, (nm, x) in enumerate(zip(ics, xs)):
        _icon_badge(ctx, nm, x, 255, 175, pal["a"] if i == 0 else pal["b"])
        if labels[i]:
            text(ctx, labels[i], x, 485, size=76, fname="title", color="white", stroke=12, max_w=480)
    ctx.set_dash([34, 22])
    arrow(ctx, 470, 255, 820, 255, color="#FFE81A", width=16, head=52)
    ctx.set_dash([])
    text(ctx, v.get("mark", "?"), 640, 215, size=230, fname="title", color="#FFE81A", stroke=18)
    text(ctx, v["main"], TW / 2, 625, size=v.get("main_size", 132), fname="title", color="#FFE81A", stroke=16, max_w=TW - 50)


def _layout_hero(ctx, v, pal):
    """큰 사물(거품 등) 하나 + 큰 단어 하나."""
    _bg(ctx, *pal["bg"])
    x, y, r = 360, 375, 290
    _glow_disc(ctx, x, y, r, pal["a"], 0.5)
    g = cairo.RadialGradient(x - r * 0.35, y - r * 0.35, r * 0.1, x, y, r)
    g.add_color_stop_rgba(0, 1, 1, 1, 0.55)
    g.add_color_stop_rgba(0.7, 0.55, 0.75, 1, 0.22)
    g.add_color_stop_rgba(1, 0.55, 0.75, 1, 0.6)
    ctx.new_path()
    ctx.arc(x, y, r, 0, math.tau)
    ctx.set_source(g)
    ctx.fill_preserve()
    ctx.set_source_rgba(1, 1, 1, 0.95)
    ctx.set_line_width(12)
    ctx.stroke()
    ctx.new_path()
    ctx.arc(x - r * 0.42, y - r * 0.42, r * 0.13, 0, math.tau)
    ctx.set_source_rgba(1, 1, 1, 0.85)
    ctx.fill()
    from . import visuals  # noqa: F401 (순환 import 방지: visuals 먼저)
    from .visuals2 import icon
    icon(ctx, v.get("hero_icon", "chip"), x, y + 10, 2.6)
    num = v.get("num", "?")
    text(ctx, num, 960, 300, size=v.get("num_size", 250), fname="title", color="#FFE81A", stroke=20, max_w=600)
    text(ctx, v["main"], 960, 545, size=v.get("main_size", 96), fname="title", color="white", stroke=14, max_w=600)


def _layout_split2(ctx, v, pal):
    """전/후 숫자 두 개를 아주 크게. 위 날짜, 가운데 변화율 배지, 아래 질문 한 줄."""
    _bg(ctx, *pal["bg"])
    ctx.new_path()
    ctx.move_to(0, 0); ctx.line_to(690, 0); ctx.line_to(590, 720); ctx.line_to(0, 720); ctx.close_path()
    ctx.set_source_rgba(*hexc(pal["a"]), 0.95)
    ctx.fill()
    ctx.new_path()
    ctx.move_to(690, 0); ctx.line_to(1280, 0); ctx.line_to(1280, 720); ctx.line_to(590, 720); ctx.close_path()
    ctx.set_source_rgba(*hexc(pal["b"]), 0.95)
    ctx.fill()
    labels = v.get("labels") or ["", ""]
    left, right = v["tags"][0], v["tags"][1]
    text(ctx, labels[0], 315, 75, size=66, fname="title", color="white", stroke=10)
    text(ctx, labels[1], 965, 75, size=66, fname="title", color="white", stroke=10)
    text(ctx, left, 315, 255, size=200, fname="title", color="white", stroke=18, max_w=560)
    text(ctx, right, 965, 255, size=200, fname="title", color="#FFE81A", stroke=18, max_w=560)
    _bottom_band(ctx)
    if v.get("badge"):
        ctx.new_path()
        round_rect(ctx, 640 - 175, 375, 350, 120, 60)
        ctx.set_source_rgb(*hexc("#E8262E"))
        ctx.fill_preserve()
        ctx.set_source_rgb(1, 1, 1)
        ctx.set_line_width(8)
        ctx.stroke()
        text(ctx, v["badge"], 640, 437, size=84, fname="title", color="white", stroke=8)
    text(ctx, v["main"], TW / 2, 625, size=v.get("main_size", 128), fname="title", color="#FFE81A", stroke=16, max_w=TW - 50)


# ---------------------------------------------------------------- 장면형 (레퍼런스 학습 반영, 2026-11-10)
# 잘 된 경제 썸네일(구독자 대비 조회수 상위 60개)과 우리 썸네일을 비교한 결과:
#  - 밝기 0.40 vs 우리 0.30, 어두운 픽셀 37% vs 우리 64% → 더 밝고 따뜻하게
#  - 디테일(가장자리 밀도) 0.25 vs 우리 0.16 → 빈 배경 대신 화면을 채우는 '장면'
#  - 아래 2줄 큰 글자(흰 + 노랑), 감정이 큰 캐릭터, 핵심 숫자·화살표 하나는 우리와 같음
SCENES = {
    "city":   {"sky": ("#FFB347", "#FF7A3D"), "far": "#7A3B2E", "near": "#3A1E1A"},
    "dawn":   {"sky": ("#7FD3FF", "#3E7BE0"), "far": "#2C4A7A", "near": "#16253F"},
    "gold":   {"sky": ("#FFE08A", "#E59A2A"), "far": "#8A5A1E", "near": "#4A2E10"},
    "mint":   {"sky": ("#B8F2D0", "#3FBF8A"), "far": "#1F6B52", "near": "#0E3A2C"},
    "rose":   {"sky": ("#FFB3C1", "#E0557A"), "far": "#7A2A44", "near": "#3D1424"},
}


def _scene_bg(ctx, sc, seed=7):
    g = cairo.LinearGradient(0, 0, 0, TH)
    g.add_color_stop_rgb(0, *hexc(sc["sky"][0]))
    g.add_color_stop_rgb(1, *hexc(sc["sky"][1]))
    ctx.set_source(g)
    ctx.paint()
    # 햇빛
    rg = cairo.RadialGradient(900, 260, 20, 900, 260, 520)
    rg.add_color_stop_rgba(0, 1, 1, 0.9, 0.85)
    rg.add_color_stop_rgba(1, 1, 1, 0.9, 0)
    ctx.set_source(rg)
    ctx.paint()
    rnd = random.Random(seed)
    # 먼 건물 / 가까운 건물 실루엣
    for layer, col, base, hmin, hmax in ((0, sc["far"], 520, 120, 300), (1, sc["near"], 600, 80, 220)):
        x = -20
        while x < TW + 40:
            w = rnd.randint(50, 120)
            h = rnd.randint(hmin, hmax)
            ctx.new_path()
            ctx.rectangle(x, base - h, w, TH)
            ctx.set_source_rgba(*hexc(col), 0.55 if layer == 0 else 0.85)
            ctx.fill()
            # 창문
            ctx.set_source_rgba(1, 0.92, 0.6, 0.35 if layer == 0 else 0.5)
            for wy in range(int(base - h + 14), int(base) - 10, 26):
                for wx in range(int(x + 10), int(x + w - 12), 22):
                    if rnd.random() < 0.55:
                        ctx.rectangle(wx, wy, 10, 12)
            ctx.fill()
            x += w + rnd.randint(4, 18)


def _money_rain(ctx, seed=3, n=14):
    rnd = random.Random(seed)
    for i in range(n):
        x, y = rnd.uniform(40, TW - 40), rnd.uniform(40, 420)
        if rnd.random() < 0.5:
            draw_bill(ctx, x, y, 120, 58, "10,000", rot=rnd.uniform(-30, 30))
        else:
            draw_coin(ctx, x, y, rnd.uniform(18, 30), rot=rnd.uniform(0, 3))


def _big_arrow_chart(ctx, down=True, color=None):
    col = color or ("#FF2E2E" if down else "#21D16B")
    pts = [(80, 120), (260, 200), (380, 160), (560, 300), (700, 260), (860, 430)] if down else \
          [(80, 430), (260, 340), (380, 380), (560, 230), (700, 270), (860, 110)]
    for w, a in ((46, 0.18), (30, 0.3)):
        ctx.new_path()
        ctx.move_to(*pts[0])
        for q in pts[1:]:
            ctx.line_to(*q)
        ctx.set_source_rgba(*hexc(col), a)
        ctx.set_line_width(w)
        ctx.set_line_join(cairo.LINE_JOIN_ROUND)
        ctx.stroke()
    ctx.new_path()
    ctx.move_to(*pts[0])
    for q in pts[1:-1]:
        ctx.line_to(*q)
    ctx.set_source_rgb(*hexc(col))
    ctx.set_line_width(18)
    ctx.stroke()
    arrow(ctx, pts[-2][0], pts[-2][1], pts[-1][0], pts[-1][1], color=col, width=18, head=64)


def _fit(ctx, s, x, y, size, max_w, **kw):
    """한 줄로 유지하면서 폭에 맞게 글자 크기를 줄인다."""
    from .core import text_surface
    sz = size
    while sz > 40:
        w = text_surface(s, kw.get("fname", "title"), int(sz), kw.get("color", "white"), int(kw.get("stroke", 0)),
                         "ink", "center", 0, 0.18, 0).get_width()
        if w <= max_w:
            break
        sz -= 4
    text(ctx, s, x, y, size=sz, **kw)


def _layout_scene(ctx, v, pal):
    """밝은 장면 배경 + 큰 캐릭터 + 핵심 숫자 하나 + 아래 2줄."""
    sc = SCENES.get(v.get("scene"), SCENES["city"])
    _scene_bg(ctx, sc, seed=len(v.get("main", "")) + 3)
    if v.get("chart") in ("down", "up"):
        _big_arrow_chart(ctx, down=v["chart"] == "down")
    if v.get("money", True):
        _money_rain(ctx, seed=len(v.get("top", "")) + 1, n=7)
    # 캐릭터 뒤 빛
    rg = cairo.RadialGradient(1010, 430, 30, 1010, 430, 380)
    rg.add_color_stop_rgba(0, 1, 1, 1, 0.55)
    rg.add_color_stop_rgba(1, 1, 1, 1, 0)
    ctx.set_source(rg)
    ctx.paint()
    _mascot(ctx, v, 1010, 1010, 930)
    if v.get("num"):
        nb = v["num"]
        _fit(ctx, nb, 380, 220, v.get("num_size", 170), 660, fname="title", color=v.get("num_color", "#FFE81A"), stroke=20, rot=-3)
    if v.get("quote"):
        text(ctx, v["quote"], 40, 34, size=48, fname="title", color="white", stroke=10, align="left", anchor=(0, 0), max_w=760)
    _bottom_band(ctx)
    _fit(ctx, v["top"], 470, 528, 84, 880, fname="title", color="white", stroke=14)
    _fit(ctx, v["main"], 470, 640, v.get("main_size", 118), 900, fname="title", color="#FFE81A", stroke=16)


def make_thumbnail(path: str, variant: str = "A", overrides: dict | None = None):
    v = dict(VARIANTS.get(variant, VARIANTS["A"]))
    if overrides:
        v.update(overrides)
    # '~'는 글자 꾸밈 기호(초록)로 쓰이므로 썸네일 글자에서는 '–'로 바꾼다
    v = {k: (x.replace("~", "–") if isinstance(x, str) else x) for k, x in v.items()}
    pal, lay = _pick(v, variant)
    surf = cairo.ImageSurface(cairo.FORMAT_ARGB32, TW, TH)
    ctx = cairo.Context(surf)
    {"classic": _layout_classic, "bignum": _layout_bignum, "split": _layout_split, "zoom": _layout_zoom, "banner": _layout_banner,
     "duo": _layout_duo, "hero": _layout_hero, "split2": _layout_split2,
     "scene": _layout_scene}.get(lay, _layout_classic)(ctx, v, pal)
    surf.write_to_png(path)
    return path
