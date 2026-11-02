"""공통 설정, 이징 함수, 텍스트 스프라이트(Pillow → cairo), 기본 도형."""
from __future__ import annotations

import math
import os
import re
from functools import lru_cache

import cairo
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONT_DIR = os.path.join(ROOT, "assets", "fonts")

W, H, FPS = 1920, 1080, 30


def hexc(h: str, a: float | None = None):
    h = h.lstrip("#")
    rgb = tuple(int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))
    return rgb if a is None else (*rgb, a)


# 브랜드 팔레트 (부의비상사태 911): 남색 배경 + 노랑 강조 + 태블릿 초록 + 경보 빨강
PAL = {
    "bg1": "#0A1230", "bg2": "#15255A", "card": "#16224D", "card2": "#1E2E63",
    "line": "#33488A", "white": "#FFFFFF", "grey": "#A8B3D1", "dim": "#6C7AA6",
    "yellow": "#FFD43B", "red": "#FF4D4D", "green": "#3BE07A", "blue": "#4DA3FF",
    "orange": "#FF9F43", "purple": "#B07CFF", "ink": "#121212",
}
C = {k: hexc(v) for k, v in PAL.items()}

FONTS = {
    "title": "BlackHanSans-Regular.ttf",
    "black": "GothicA1-Black.ttf",
    "xbold": "GothicA1-ExtraBold.ttf",
    "bold": "GothicA1-Bold.ttf",
    "medium": "GothicA1-Medium.ttf",
}

MARK_COLORS = {"*": "yellow", "^": "red", "~": "green", "`": "blue"}


# ---------------------------------------------------------------- easing

def clamp(x, a=0.0, b=1.0):
    return a if x < a else b if x > b else x


def ease_out_cubic(x):
    x = clamp(x)
    return 1 - (1 - x) ** 3


def ease_in_out(x):
    x = clamp(x)
    return 3 * x * x - 2 * x * x * x


def ease_out_back(x, s=1.70158):
    x = clamp(x)
    x -= 1
    return x * x * ((s + 1) * x + s) + 1


def ease_out_elastic(x):
    x = clamp(x)
    if x in (0, 1):
        return x
    return 2 ** (-10 * x) * math.sin((x * 10 - 0.75) * (2 * math.pi) / 3) + 1


def prog(t, start, dur):
    return clamp((t - start) / dur) if dur > 0 else (1.0 if t >= start else 0.0)


def pop(t, start, dur=0.45):
    """등장 애니메이션: (scale, alpha)"""
    p = prog(t, start, dur)
    return ease_out_back(p, 2.2), clamp(p * 3)


def lerp(a, b, k):
    return a + (b - a) * k


# ---------------------------------------------------------------- text

@lru_cache(maxsize=64)
def font(name: str, size: int):
    return ImageFont.truetype(os.path.join(FONT_DIR, FONTS.get(name, name)), size)


def parse_marks(line: str, base_color: str):
    """'*노랑*', '^빨강^', '~초록~', '`파랑`' 마크업을 (텍스트, 색) 조각으로 분해"""
    segs = []
    color_stack = [base_color]
    buf = ""
    for ch in line:
        if ch in MARK_COLORS:
            if buf:
                segs.append((buf, color_stack[-1]))
                buf = ""
            col = MARK_COLORS[ch]
            if len(color_stack) > 1 and color_stack[-1] == col:
                color_stack.pop()
            else:
                color_stack.append(col)
        else:
            buf += ch
    if buf:
        segs.append((buf, color_stack[-1]))
    return segs


def strip_marks(s: str) -> str:
    return re.sub(r"[*^~`]", "", s)


def _col(c):
    if isinstance(c, str):
        if c.startswith("#"):
            return c
        return PAL.get(c, c)
    return c


def wrap_text(text: str, fnt, max_w: int):
    out = []
    for para in text.split("\n"):
        words = para.split(" ")
        cur = ""
        for w_ in words:
            cand = (cur + " " + w_).strip()
            if fnt.getlength(strip_marks(cand)) <= max_w or not cur:
                cur = cand
            else:
                out.append(cur)
                cur = w_
        out.append(cur)
    return out


@lru_cache(maxsize=16)
def _cmap(name: str):
    from fontTools.ttLib import TTFont
    return set(TTFont(os.path.join(FONT_DIR, FONTS.get(name, name))).getBestCmap().keys())


FALLBACK = "black"


def _runs(line: str, base_color: str, fname: str, size: int):
    """마크업 조각을 폰트 지원 여부에 따라 다시 나눔 (없는 기호는 대체 폰트로)"""
    cm = _cmap(fname)
    out = []
    for seg, col in parse_marks(line, base_color):
        cur, cur_f = "", None
        for ch in seg:
            f = fname if (ord(ch) in cm or ch == " ") else FALLBACK
            if f != cur_f and cur:
                out.append((cur, col, font(cur_f, size)))
                cur = ""
            cur_f = f
            cur += ch
        if cur:
            out.append((cur, col, font(cur_f, size)))
    return out


def _run_width(runs):
    return sum(f.getlength(t) for t, _, f in runs)


@lru_cache(maxsize=2048)
def text_image(text: str, fname: str = "xbold", size: int = 60, color: str = "white",
               stroke: int = 0, stroke_color: str = "ink", align: str = "center",
               max_w: int = 0, line_gap: float = 0.18, shadow: int = 0) -> Image.Image:
    fnt = font(fname, size)
    lines = wrap_text(text, fnt, max_w) if max_w else text.split("\n")
    asc, desc = fnt.getmetrics()
    lh = asc + desc
    gap = int(size * line_gap)
    line_runs = [_runs(l, color, fname, size) for l in lines]
    widths = [_run_width(r) for r in line_runs]
    pad = stroke + 4 + shadow * 2
    w = int(max(widths + [1])) + pad * 2
    h = lh * len(lines) + gap * (len(lines) - 1) + pad * 2
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    plans = []
    for i, runs in enumerate(line_runs):
        if align == "center":
            x = pad + (w - 2 * pad - widths[i]) / 2
        elif align == "right":
            x = w - pad - widths[i]
        else:
            x = pad
        base = pad + i * (lh + gap) + asc
        for seg, col, f in runs:
            plans.append((x, base, seg, col, f))
            x += f.getlength(seg)
    if stroke:
        for x, y, seg, col, f in plans:
            d.text((x, y), seg, font=f, fill=_col(stroke_color), stroke_width=stroke,
                   stroke_fill=_col(stroke_color), anchor="ls")
    for x, y, seg, col, f in plans:
        d.text((x, y), seg, font=f, fill=_col(col), anchor="ls")
    if shadow:
        a = img.split()[3]
        sh = Image.new("RGBA", img.size, (0, 0, 0, 0))
        sh.putalpha(a.filter(ImageFilter.GaussianBlur(shadow)).point(lambda v: int(v * 0.6)))
        base_img = Image.new("RGBA", img.size, (0, 0, 0, 0))
        base_img.alpha_composite(sh, (0, shadow // 2 + 2))
        base_img.alpha_composite(img)
        img = base_img
    return img


def pil_to_surface(img: Image.Image) -> cairo.ImageSurface:
    img = img.convert("RGBA")
    arr = np.asarray(img, dtype=np.uint8).astype(np.uint16)
    a = arr[..., 3:4]
    rgb = (arr[..., :3] * a // 255).astype(np.uint8)
    bgra = np.empty(arr.shape, dtype=np.uint8)
    bgra[..., 0] = rgb[..., 2]
    bgra[..., 1] = rgb[..., 1]
    bgra[..., 2] = rgb[..., 0]
    bgra[..., 3] = arr[..., 3]
    h, w = bgra.shape[:2]
    stride = cairo.ImageSurface.format_stride_for_width(cairo.FORMAT_ARGB32, w)
    buf = bytearray(stride * h)
    np.frombuffer(buf, dtype=np.uint8).reshape(h, stride)[:, : w * 4] = bgra.reshape(h, w * 4)
    return cairo.ImageSurface.create_for_data(buf, cairo.FORMAT_ARGB32, w, h, stride)


@lru_cache(maxsize=2048)
def text_surface(*args, **kw):
    return pil_to_surface(text_image(*args, **kw))


def paint(ctx, surf, x, y, scale=1.0, alpha=1.0, rot=0.0, anchor=(0.5, 0.5)):
    if alpha <= 0.003 or scale <= 0.001:
        return
    w, h = surf.get_width(), surf.get_height()
    ctx.save()
    ctx.translate(x, y)
    if rot:
        ctx.rotate(math.radians(rot))
    ctx.scale(scale, scale)
    ctx.translate(-w * anchor[0], -h * anchor[1])
    ctx.set_source_surface(surf, 0, 0)
    ctx.get_source().set_filter(cairo.FILTER_GOOD)
    ctx.paint_with_alpha(alpha)
    ctx.restore()


def text(ctx, s, x, y, size=60, fname="xbold", color="white", stroke=0, stroke_color="ink",
         scale=1.0, alpha=1.0, rot=0.0, anchor=(0.5, 0.5), align="center", max_w=0, shadow=0):
    surf = text_surface(s, fname, int(size), color, int(stroke), stroke_color, align, int(max_w),
                        0.18, int(shadow))
    paint(ctx, surf, x, y, scale, alpha, rot, anchor)
    return surf.get_width() * scale, surf.get_height() * scale


# ---------------------------------------------------------------- shapes

def round_rect(ctx, x, y, w, h, r):
    r = max(0.0, min(r, w / 2, h / 2))
    ctx.new_sub_path()
    ctx.arc(x + w - r, y + r, r, -math.pi / 2, 0)
    ctx.arc(x + w - r, y + h - r, r, 0, math.pi / 2)
    ctx.arc(x + r, y + h - r, r, math.pi / 2, math.pi)
    ctx.arc(x + r, y + r, r, math.pi, 1.5 * math.pi)
    ctx.close_path()


def card(ctx, x, y, w, h, fill="card", line="line", r=22, alpha=1.0, lw=3, glow=None):
    if glow:
        for i in range(4, 0, -1):
            ctx.new_path()
            round_rect(ctx, x - i * 4, y - i * 4, w + i * 8, h + i * 8, r + i * 4)
            ctx.set_source_rgba(*hexc(PAL.get(glow, glow)), 0.05 * alpha)
            ctx.fill()
    ctx.new_path()
    round_rect(ctx, x, y, w, h, r)
    ctx.set_source_rgba(*hexc(PAL.get(fill, fill)), 0.92 * alpha)
    ctx.fill_preserve()
    if line:
        ctx.set_source_rgba(*hexc(PAL.get(line, line)), alpha)
        ctx.set_line_width(lw)
        ctx.stroke()
    else:
        ctx.new_path()


def set_col(ctx, c, a=1.0):
    ctx.set_source_rgba(*hexc(PAL.get(c, c)), a)


def arrow(ctx, x1, y1, x2, y2, color="yellow", width=8, head=24, alpha=1.0, progress=1.0):
    if progress <= 0:
        return
    x2p = x1 + (x2 - x1) * progress
    y2p = y1 + (y2 - y1) * progress
    ang = math.atan2(y2p - y1, x2p - x1)
    ctx.save()
    set_col(ctx, color, alpha)
    ctx.set_line_width(width)
    ctx.set_line_cap(cairo.LINE_CAP_ROUND)
    ctx.new_path()
    ctx.move_to(x1, y1)
    ctx.line_to(x2p - math.cos(ang) * head * 0.6, y2p - math.sin(ang) * head * 0.6)
    ctx.stroke()
    ctx.new_path()
    ctx.move_to(x2p, y2p)
    ctx.line_to(x2p - math.cos(ang - 0.45) * head, y2p - math.sin(ang - 0.45) * head)
    ctx.line_to(x2p - math.cos(ang + 0.45) * head, y2p - math.sin(ang + 0.45) * head)
    ctx.close_path()
    ctx.fill()
    ctx.restore()


def outline_fill(ctx, fill, stroke="ink", lw=5, a=1.0):
    set_col(ctx, fill, a)
    ctx.fill_preserve()
    set_col(ctx, stroke, a)
    ctx.set_line_width(lw)
    ctx.set_line_join(cairo.LINE_JOIN_ROUND)
    ctx.stroke()


# ---------------------------------------------------------------- icons (만화풍 소품)

def draw_coin(ctx, x, y, r, rot=0.0, a=1.0):
    ctx.save()
    ctx.translate(x, y)
    ctx.scale(max(0.15, abs(math.cos(rot))), 1)  # 회전하는 동전
    ctx.new_path()
    ctx.arc(0, 0, r, 0, 2 * math.pi)
    outline_fill(ctx, "#F6C341", lw=max(2, r * 0.12), a=a)
    ctx.new_path()
    ctx.arc(0, 0, r * 0.7, 0, 2 * math.pi)
    set_col(ctx, "#D99A1E", a)
    ctx.set_line_width(max(1.5, r * 0.08))
    ctx.stroke()
    ctx.restore()
    if abs(math.cos(rot)) > 0.5:
        text(ctx, "₩", x, y + r * 0.04, size=int(r * 1.0), fname="black", color="#B07410",
             alpha=a)


def draw_bill(ctx, x, y, w, h, label="10,000", rot=0.0, a=1.0, color="#8FD19E"):
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(math.radians(rot))
    ctx.new_path()
    round_rect(ctx, -w / 2, -h / 2, w, h, h * 0.08)
    outline_fill(ctx, color, lw=max(2, h * 0.05), a=a)
    ctx.new_path()
    round_rect(ctx, -w / 2 + h * 0.1, -h / 2 + h * 0.1, w - h * 0.2, h * 0.8, h * 0.06)
    set_col(ctx, "#4E9A5E", a)
    ctx.set_line_width(max(1.5, h * 0.03))
    ctx.stroke()
    ctx.new_path()
    ctx.arc(w * 0.22, 0, h * 0.26, 0, 2 * math.pi)
    set_col(ctx, "#C9EBD0", a)
    ctx.fill()
    ctx.restore()
    text(ctx, label, x - w * 0.12 * math.cos(math.radians(rot)), y - w * 0.12 * math.sin(math.radians(rot)),
         size=max(10, int(h * 0.34)), fname="black", color="#245C33", alpha=a, rot=rot)


def draw_apple(ctx, x, y, r, a=1.0):
    ctx.new_path()
    ctx.move_to(x, y - r * 0.6)
    ctx.curve_to(x + r * 1.2, y - r * 1.2, x + r * 1.3, y + r * 0.8, x, y + r)
    ctx.curve_to(x - r * 1.3, y + r * 0.8, x - r * 1.2, y - r * 1.2, x, y - r * 0.6)
    ctx.close_path()
    outline_fill(ctx, "#F2554A", lw=max(2, r * 0.12), a=a)
    ctx.new_path()
    ctx.arc(x - r * 0.4, y - r * 0.1, r * 0.22, 0, 2 * math.pi)
    ctx.set_source_rgba(1, 1, 1, 0.55 * a)
    ctx.fill()
    ctx.new_path()
    ctx.move_to(x, y - r * 0.6)
    ctx.line_to(x + r * 0.1, y - r * 1.1)
    set_col(ctx, "ink", a)
    ctx.set_line_width(max(2, r * 0.12))
    ctx.stroke()
    ctx.new_path()
    ctx.move_to(x + r * 0.1, y - r * 0.95)
    ctx.curve_to(x + r * 0.5, y - r * 1.3, x + r * 0.8, y - r * 1.0, x + r * 0.7, y - r * 0.9)
    ctx.curve_to(x + r * 0.5, y - r * 0.75, x + r * 0.25, y - r * 0.85, x + r * 0.1, y - r * 0.95)
    outline_fill(ctx, "#59C25A", lw=max(1.5, r * 0.08), a=a)


def draw_box(ctx, x, y, s, color="#E8B66A", a=1.0):
    ctx.new_path()
    round_rect(ctx, x - s / 2, y - s / 2, s, s, s * 0.1)
    outline_fill(ctx, color, lw=max(2, s * 0.06), a=a)
    ctx.new_path()
    ctx.move_to(x - s / 2, y - s * 0.1)
    ctx.line_to(x + s / 2, y - s * 0.1)
    ctx.move_to(x, y - s / 2)
    ctx.line_to(x, y - s * 0.1)
    set_col(ctx, "ink", a * 0.7)
    ctx.set_line_width(max(1.5, s * 0.04))
    ctx.stroke()


def draw_house(ctx, x, y, s, a=1.0):
    ctx.new_path()
    ctx.move_to(x - s * 0.5, y - s * 0.1)
    ctx.line_to(x, y - s * 0.55)
    ctx.line_to(x + s * 0.5, y - s * 0.1)
    ctx.close_path()
    outline_fill(ctx, "#FF6B6B", lw=max(2, s * 0.05), a=a)
    ctx.new_path()
    ctx.rectangle(x - s * 0.38, y - s * 0.1, s * 0.76, s * 0.55)
    outline_fill(ctx, "#FFF3D6", lw=max(2, s * 0.05), a=a)
    ctx.new_path()
    ctx.rectangle(x - s * 0.1, y + s * 0.12, s * 0.2, s * 0.33)
    outline_fill(ctx, "#8A5A3C", lw=max(2, s * 0.04), a=a)


def draw_person(ctx, x, y, s, color="#FFFFFF", a=1.0, mood=0):
    """간단한 사람 아이콘 (mood: 1 웃음, -1 울상)"""
    ctx.new_path()
    ctx.arc(x, y - s * 0.62, s * 0.22, 0, 2 * math.pi)
    outline_fill(ctx, color, lw=max(2, s * 0.05), a=a)
    ctx.new_path()
    ctx.move_to(x - s * 0.3, y + s * 0.1)
    ctx.curve_to(x - s * 0.3, y - s * 0.35, x + s * 0.3, y - s * 0.35, x + s * 0.3, y + s * 0.1)
    ctx.close_path()
    outline_fill(ctx, color, lw=max(2, s * 0.05), a=a)
    set_col(ctx, "ink", a)
    ctx.set_line_width(max(1.5, s * 0.035))
    for ex in (-0.07, 0.07):
        ctx.new_path()
        ctx.arc(x + ex * s, y - s * 0.66, s * 0.025, 0, 2 * math.pi)
        ctx.fill()
    ctx.new_path()
    if mood > 0:
        ctx.arc(x, y - s * 0.6, s * 0.08, 0.3, math.pi - 0.3)
    elif mood < 0:
        ctx.arc(x, y - s * 0.5, s * 0.08, math.pi + 0.4, 2 * math.pi - 0.4)
    else:
        ctx.move_to(x - s * 0.05, y - s * 0.55)
        ctx.line_to(x + s * 0.05, y - s * 0.55)
    ctx.stroke()


def fmt_num(v: float, decimals: int = 0) -> str:
    if decimals:
        return f"{v:,.{decimals}f}"
    return f"{int(round(v)):,}"
