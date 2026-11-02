"""장면(비주얼) 렌더러 모음.

모든 장면은 시간에 따라 움직입니다. 대본의 각 문장(line)이 시작되는 시점에 맞춰
요소가 등장하도록 `at` 값(문장 번호, 소수점은 그 문장 안에서의 진행 비율)을 씁니다.
예) at: 2 → 3번째 문장 시작 시, at: 1.5 → 2번째 문장의 절반 지점.
"""
from __future__ import annotations

import math
import random

import cairo

from .core import (C, PAL, W, H, arrow, card, clamp, draw_apple, draw_bill, draw_box, draw_coin,
                   draw_house, draw_person, ease_in_out, ease_out_back, ease_out_cubic,
                   ease_out_elastic, fmt_num, hexc, lerp, outline_fill, pop, prog, round_rect,
                   set_col, text)

LAYOUT_AREA = {
    "left": (700, 150, 1850, 870),
    "right": (70, 150, 1220, 870),
    "corner": (90, 150, 1520, 880),
    "center": (160, 140, 1760, 600),
    "none": (90, 150, 1830, 880),
}


class SceneCtx:
    def __init__(self, scene: dict, lt: float, t: float):
        self.s = scene
        self.v = scene["visual"]
        self.lt = lt
        self.t = t
        self.dur = scene["dur"]
        self.line_starts = [ln["start"] - scene["start"] for ln in scene["lines"]]
        self.line_ends = [ln["end"] - scene["start"] for ln in scene["lines"]]
        self.layout = scene.get("mascot", {}).get("layout", "left")
        self.area = LAYOUT_AREA.get(self.layout, LAYOUT_AREA["left"])

    def at(self, a, default=0.0):
        """at 값을 장면 내부 시간(초)으로 변환. 음수면 처음부터 보임."""
        if a is None:
            return default
        if isinstance(a, (int, float)) and a < 0:
            return -1.0
        n = len(self.line_starts)
        if n == 0:
            return float(a)
        i = int(math.floor(a))
        frac = a - i
        if i >= n:
            return self.dur + 1.0  # 이 장면에서는 등장하지 않음
        st, en = self.line_starts[i], self.line_ends[i]
        return st + (en - st) * frac

    @property
    def cx(self):
        return (self.area[0] + self.area[2]) / 2

    @property
    def cy(self):
        return (self.area[1] + self.area[3]) / 2

    @property
    def aw(self):
        return self.area[2] - self.area[0]

    @property
    def ah(self):
        return self.area[3] - self.area[1]


def _header(ctx, S, title, color="yellow", y=None, size=54):
    if not title:
        return 0
    sc, al = pop(S.lt, 0.0, 0.5)
    yy = S.area[1] + 30 if y is None else y
    text(ctx, title, S.cx, yy, size=size, fname="title", color=color, stroke=6,
         scale=sc, alpha=al)
    return 80


# ---------------------------------------------------------------- keytext

def v_keytext(ctx, S: SceneCtx):
    v = S.v
    lines = v["lines"]
    top = S.area[1] + _header(ctx, S, v.get("title"), v.get("title_color", "grey"), size=44)
    sizes = [ln.get("size", 84) for ln in lines]
    gaps = 34
    total = sum(s * 1.25 for s in sizes) + gaps * (len(lines) - 1)
    y = top + (S.area[3] - top - total) / 2
    for ln, sz in zip(lines, sizes):
        st = S.at(ln.get("at", 0))
        sc, al = pop(S.lt, st, 0.5)
        floaty = math.sin(S.t * 1.6 + y * 0.01) * 4
        yy = y + sz * 0.62 + floaty
        if ln.get("box"):
            p = ease_out_cubic(prog(S.lt, st, 0.4))
            bw = min(S.aw - 20, ln.get("box_w", S.aw - 80))
            card(ctx, S.cx - bw / 2 * p, yy - sz * 0.75, bw * p, sz * 1.5, fill=ln.get("box"),
                 line=None, r=18, alpha=al * 0.9)
        text(ctx, ln["text"], S.cx, yy, size=sz, fname=ln.get("font", "title"),
             color=ln.get("color", "white"), stroke=ln.get("stroke", 7), scale=sc, alpha=al,
             max_w=S.aw - 40)
        y += sz * 1.25 + gaps


# ---------------------------------------------------------------- title

def v_title(ctx, S: SceneCtx):
    v = S.v
    cx, cy = S.cx, S.cy
    # 회전하는 광선
    ctx.save()
    ctx.translate(cx, cy + 20)
    ctx.rotate(S.t * 0.15)
    for i in range(16):
        ctx.new_path()
        ctx.move_to(0, 0)
        ctx.arc(0, 0, 900, i * math.pi / 8, i * math.pi / 8 + math.pi / 16)
        ctx.close_path()
        set_col(ctx, "yellow", 0.035)
        ctx.fill()
    ctx.restore()
    if v.get("badge"):
        sc, al = pop(S.lt, 0.1, 0.5)
        bw = 220
        ctx.new_path()
        round_rect(ctx, cx - bw / 2 * sc, cy - 262, bw * sc, 64, 32)
        set_col(ctx, "yellow", al)
        ctx.fill()
        text(ctx, v["badge"], cx, cy - 230, size=40, fname="black", color="ink", scale=sc,
             alpha=al)
    p = ease_out_cubic(prog(S.lt, 0.25, 0.6))
    text(ctx, v.get("top", ""), cx, cy - 130 - (1 - p) * 60, size=v.get("top_size", 82), fname="title",
         color="white", stroke=8, alpha=p)
    sc, al = pop(S.lt, S.at(v.get("main_at", 0), 0.6), 0.6)
    wob = 1 + math.sin(S.t * 3) * 0.012
    text(ctx, v.get("main", ""), cx, cy + 30, size=v.get("main_size", 130), fname="title",
         color="yellow", stroke=11, scale=sc * wob, alpha=al, max_w=S.aw)
    if v.get("sub"):
        sc2, al2 = pop(S.lt, S.at(v.get("sub_at", 1), 1.2), 0.5)
        text(ctx, v["sub"], cx, cy + 190, size=48, fname="xbold", color="grey", stroke=5,
             scale=sc2, alpha=al2, max_w=S.aw)
    # 반짝이
    rnd = random.Random(7)
    for i in range(14):
        a = rnd.random() * math.tau
        r = 380 + rnd.random() * 260
        ph = (S.t * 0.9 + rnd.random()) % 1.0
        s = math.sin(ph * math.pi)
        x = cx + math.cos(a) * r
        y = cy + math.sin(a) * r * 0.55
        _sparkle(ctx, x, y, 14 * s + 2, "yellow", 0.8 * s * al)


def _sparkle(ctx, x, y, r, color, a):
    if a <= 0:
        return
    ctx.new_path()
    for k in range(4):
        ang = k * math.pi / 2
        ctx.line_to(x + math.cos(ang) * r, y + math.sin(ang) * r)
        ang2 = ang + math.pi / 4
        ctx.line_to(x + math.cos(ang2) * r * 0.3, y + math.sin(ang2) * r * 0.3)
    ctx.close_path()
    set_col(ctx, color, a)
    ctx.fill()


# ---------------------------------------------------------------- chapter

def v_chapter(ctx, S: SceneCtx):
    v = S.v
    p = ease_out_cubic(prog(S.lt, 0.0, 0.55))
    out = ease_in_out(prog(S.lt, S.dur - 0.35, 0.35))
    # 사선 띠 와이프
    ctx.save()
    ctx.translate(W / 2, H / 2 - 40)
    ctx.rotate(math.radians(-6))
    bw = W * 1.4
    x0 = -bw / 2 + (1 - p) * -bw + out * bw * 1.2
    ctx.new_path()
    ctx.rectangle(x0, -150, bw, 300)
    set_col(ctx, "yellow", 1.0)
    ctx.fill()
    # 경고 테이프 줄무늬
    for i in range(-30, 30):
        ctx.new_path()
        xx = x0 + bw / 2 + i * 90 + (S.t * 60) % 90
        ctx.move_to(xx, -150)
        ctx.line_to(xx + 40, -150)
        ctx.line_to(xx - 20, -130)
        ctx.line_to(xx - 60, -130)
        ctx.close_path()
        set_col(ctx, "ink", 0.9)
        ctx.fill()
        ctx.new_path()
        ctx.move_to(xx, 130)
        ctx.line_to(xx + 40, 130)
        ctx.line_to(xx - 20, 150)
        ctx.line_to(xx - 60, 150)
        ctx.close_path()
        ctx.fill()
    ctx.restore()
    sc, al = pop(S.lt, 0.35, 0.5)
    al *= 1 - out
    text(ctx, v.get("part", ""), W / 2 + 120, H / 2 - 130, size=58, fname="black", color="ink",
         scale=sc, alpha=al, rot=-6)
    sc2, al2 = pop(S.lt, 0.55, 0.55)
    al2 *= 1 - out
    text(ctx, v.get("title", ""), W / 2 + 120, H / 2 - 30, size=118, fname="title", color="ink",
         scale=sc2, alpha=al2, rot=-6)


# ---------------------------------------------------------------- counter

def v_counter(ctx, S: SceneCtx):
    v = S.v
    cx = S.cx
    top = S.area[1]
    sc, al = pop(S.lt, S.at(v.get("label_at", 0)), 0.5)
    text(ctx, v.get("label", ""), cx, top + 70, size=v.get("label_size", 50), fname="xbold",
         color="grey", stroke=5, scale=sc, alpha=al, max_w=S.aw)
    st = S.at(v.get("at", 1))
    d = v.get("dur", 2.4)
    k = ease_in_out(prog(S.lt, st, d))
    a, b = v["from"], v["to"]
    val = lerp(a, b, k)
    color = v.get("color_from", "white") if k < 1 else v.get("color_to", "yellow")
    s_num = v.get("prefix", "") + fmt_num(val, v.get("decimals", 0)) + v.get("unit", "")
    shake = 0
    if 0 < k < 1:
        shake = math.sin(S.t * 60) * 2.5
    sc2, al2 = pop(S.lt, S.at(v.get("num_at", 0)), 0.5)
    end_pop = 1 + 0.12 * math.sin(clamp((S.lt - st - d) / 0.35) * math.pi) if S.lt > st + d else 1
    text(ctx, s_num, cx + shake, S.cy - 20, size=v.get("size", 190), fname="title", color=color,
         stroke=10, scale=sc2 * end_pop, alpha=al2)
    if v.get("bar", True):
        bw, bh = min(900, S.aw - 120), 46
        bx, by = cx - bw / 2, S.cy + 120
        ctx.new_path()
        round_rect(ctx, bx, by, bw, bh, bh / 2)
        set_col(ctx, "card2", al2)
        ctx.fill()
        frac = clamp(val / max(a, b))
        ctx.new_path()
        round_rect(ctx, bx, by, bw * frac, bh, bh / 2)
        set_col(ctx, "green" if b >= a else ("red" if k >= 1 else "yellow"), al2)
        ctx.fill()
        if b < a and k > 0:
            lost = 1 - b / a
            gx = bx + bw * (1 - lost * k)
            ctx.new_path()
            round_rect(ctx, gx, by, bw * lost * k, bh, bh / 2)
            ctx.set_source_rgba(1, 0.3, 0.3, 0.25 * al2)
            ctx.fill()
    if v.get("sub"):
        sc3, al3 = pop(S.lt, S.at(v.get("sub_at", 3)), 0.5)
        text(ctx, v["sub"], cx, S.cy + 250, size=v.get("sub_size", 70), fname="title",
             color=v.get("sub_color", "red"), stroke=7, scale=sc3, alpha=al3, max_w=S.aw)


# ---------------------------------------------------------------- list

def v_list(ctx, S: SceneCtx):
    v = S.v
    items = v["items"]
    top = S.area[1] + _header(ctx, S, v.get("title"), v.get("title_color", "yellow"))
    n = len(items)
    avail = S.area[3] - top - 10
    ih = min(118, (avail - (n - 1) * 18) / n)
    total = n * ih + (n - 1) * 18
    y = top + (avail - total) / 2
    color = v.get("color", "yellow")
    for i, it in enumerate(items):
        st = S.at(it.get("at", i))
        p = ease_out_back(prog(S.lt, st, 0.5), 1.4)
        al = clamp(prog(S.lt, st, 0.2))
        if al <= 0:
            y += ih + 18
            continue
        x0 = S.area[0] + 30 + (1 - p) * 220
        wdt = S.aw - 60
        hl = it.get("color", color)
        active = (S.lt >= st) and (i == n - 1 or S.lt < S.at(items[i + 1].get("at", i + 1)))
        card(ctx, x0, y, wdt, ih, fill="card2" if active else "card", line=hl if active else "line",
             r=20, alpha=al, lw=4 if active else 2)
        # 번호 원
        ctx.new_path()
        ctx.arc(x0 + ih * 0.55, y + ih / 2, ih * 0.34, 0, math.tau)
        set_col(ctx, hl, al)
        ctx.fill()
        label = it.get("icon") or (str(i + 1) if v.get("numbered", True) else "✓")
        text(ctx, label, x0 + ih * 0.55, y + ih / 2 + 2, size=int(ih * 0.42), fname="black",
             color="ink", alpha=al)
        text(ctx, it["text"], x0 + ih * 1.1, y + ih / 2, size=int(min(56, ih * 0.44)),
             fname="xbold", color="white", alpha=al, anchor=(0, 0.5), align="left",
             max_w=int(wdt - ih * 1.3))
        y += ih + 18


# ---------------------------------------------------------------- compare

def v_compare(ctx, S: SceneCtx):
    v = S.v
    gap = 40
    colw = (S.aw - gap - 40) / 2
    for side_i, key in enumerate(("left", "right")):
        side = v[key]
        x0 = S.area[0] + 20 + side_i * (colw + gap)
        st = S.at(side.get("at", 0))
        p = ease_out_back(prog(S.lt, st, 0.5))
        al = clamp(prog(S.lt, st, 0.25))
        if al <= 0:
            continue
        col = side.get("color", "red")
        y0 = S.area[1] + 10
        hh = S.ah - 20
        card(ctx, x0, y0 + (1 - p) * 60, colw, hh, fill="card", line=col, r=26, alpha=al, lw=4)
        ctx.new_path()
        round_rect(ctx, x0, y0 + (1 - p) * 60, colw, 110, 26)
        set_col(ctx, col, al)
        ctx.fill()
        text(ctx, side["title"], x0 + colw / 2, y0 + 56 + (1 - p) * 60, size=56, fname="title",
             color="ink", alpha=al)
        items = side.get("items", [])
        iy = y0 + 150
        for j, it in enumerate(items):
            ist = S.at(it.get("at", j))
            sc, ial = pop(S.lt, ist, 0.45)
            if ial <= 0:
                iy += 112
                continue
            ctx.new_path()
            round_rect(ctx, x0 + 22, iy, colw - 44, 94, 18)
            set_col(ctx, "card2", ial)
            ctx.fill()
            text(ctx, it.get("icon", "•"), x0 + 64, iy + 47, size=46, fname="black", color=col,
                 alpha=ial, scale=sc)
            text(ctx, it["text"], x0 + 104, iy + 47, size=44, fname="xbold", color="white",
                 alpha=ial, anchor=(0, 0.5), align="left", max_w=int(colw - 140), scale=1)
            iy += 112


# ---------------------------------------------------------------- bars

def v_bars(ctx, S: SceneCtx):
    v = S.v
    top = S.area[1] + _header(ctx, S, v.get("title"), v.get("title_color", "yellow"))
    items = v["items"]
    n = len(items)
    vmax = v.get("max") or max(it["value"] for it in items) * 1.15
    base_y = S.area[3] - 70
    chart_h = base_y - top - 90
    slot = S.aw / n
    bw = min(200, slot * 0.55)
    # 축
    ctx.new_path()
    ctx.move_to(S.area[0] + 20, base_y)
    ctx.line_to(S.area[2] - 20, base_y)
    set_col(ctx, "line")
    ctx.set_line_width(4)
    ctx.stroke()
    for i, it in enumerate(items):
        st = S.at(it.get("at", i))
        k = ease_out_cubic(prog(S.lt, st, 1.1))
        al = clamp(prog(S.lt, st, 0.2))
        x = S.area[0] + slot * (i + 0.5)
        h = chart_h * (it["value"] / vmax) * k
        col = it.get("color", "blue")
        if al > 0:
            ctx.new_path()
            round_rect(ctx, x - bw / 2, base_y - h, bw, h + 2, 14)
            set_col(ctx, col, al)
            ctx.fill_preserve()
            set_col(ctx, "ink", al * 0.6)
            ctx.set_line_width(3)
            ctx.stroke()
            val = it["value"] * k
            dec = v.get("decimals", 1 if any(isinstance(x_["value"], float) and x_["value"] % 1 for x_ in items) else 0)
            text(ctx, fmt_num(val, dec) + v.get("unit", ""), x, base_y - h - 46, size=64,
                 fname="title", color=col if col != "blue" else "white", stroke=6, alpha=al)
        text(ctx, it["label"], x, base_y + 42, size=36, fname="xbold", color="grey",
             alpha=max(al, 0.25), max_w=int(slot - 10))


# ---------------------------------------------------------------- line chart

def v_line(ctx, S: SceneCtx):
    v = S.v
    top = S.area[1] + _header(ctx, S, v.get("title"), v.get("title_color", "yellow"))
    x0, x1 = S.area[0] + 110, S.area[2] - v.get("right_pad", 230)
    y0, y1 = top + 40, S.area[3] - 80
    ymin, ymax = v.get("ymin", 0), v.get("ymax", 100)
    for s_ in v["series"]:
        if s_.get("decay") and not s_.get("points"):
            d = s_["decay"]
            s_["points"] = [[n, round(d.get("start", 100) / (1 + d["rate"]) ** n, 2)]
                            for n in range(0, d.get("years", 40) + 1)]
    xs_all = [p[0] for s in v["series"] for p in s["points"]]
    xmin, xmax = v.get("xmin", min(xs_all)), v.get("xmax", max(xs_all))

    def X(x):
        return x0 + (x - xmin) / (xmax - xmin) * (x1 - x0)

    def Y(y):
        return y1 - (y - ymin) / (ymax - ymin) * (y1 - y0)

    gal = clamp(prog(S.lt, 0, 0.4))
    # 그리드
    for gy in v.get("yticks", []):
        ctx.new_path()
        ctx.move_to(x0, Y(gy))
        ctx.line_to(x1, Y(gy))
        set_col(ctx, "line", 0.5 * gal)
        ctx.set_line_width(2)
        ctx.stroke()
        text(ctx, f"{gy:g}{v.get('yunit', '')}", x0 - 18, Y(gy), size=30, fname="bold",
             color="grey", anchor=(1, 0.5), alpha=gal, align="right")
    for xv, lab in v.get("xticks", []):
        text(ctx, lab, X(xv), y1 + 34, size=30, fname="bold", color="grey", alpha=gal)
    ctx.new_path()
    ctx.move_to(x0, y0 - 10)
    ctx.line_to(x0, y1)
    ctx.line_to(x1 + 10, y1)
    set_col(ctx, "dim", gal)
    ctx.set_line_width(3)
    ctx.stroke()
    if v.get("hline"):
        hl = v["hline"]
        hk = ease_out_cubic(prog(S.lt, S.at(hl.get("at", 0)), 0.8))
        if hk > 0:
            ctx.new_path()
            ctx.set_dash([14, 10])
            ctx.move_to(x0, Y(hl["y"]))
            ctx.line_to(x0 + (x1 - x0) * hk, Y(hl["y"]))
            set_col(ctx, hl.get("color", "red"), 0.9)
            ctx.set_line_width(4)
            ctx.stroke()
            ctx.set_dash([])
            text(ctx, hl.get("label", ""), x1 - 10, Y(hl["y"]) - 30, size=36, fname="xbold",
                 color=hl.get("color", "red"), anchor=(1, 0.5), alpha=hk, align="right")
    for si, s in enumerate(v["series"]):
        st = S.at(s.get("at", si))
        k = ease_in_out(prog(S.lt, st, s.get("dur", 2.5)))
        if k <= 0:
            continue
        pts = s["points"]
        xcut = pts[0][0] + (pts[-1][0] - pts[0][0]) * k
        ctx.new_path()
        last = None
        drawn = []
        for i, (px, py) in enumerate(pts):
            if px > xcut:
                if i > 0 and not s.get("step"):
                    ppx, ppy = pts[i - 1]
                    f = (xcut - ppx) / (px - ppx) if px != ppx else 0
                    drawn.append((xcut, ppy + (py - ppy) * f))
                elif i > 0:
                    drawn.append((xcut, pts[i - 1][1]))
                break
            if s.get("step") and drawn:
                drawn.append((px, drawn[-1][1]))
            drawn.append((px, py))
        for i, (px, py) in enumerate(drawn):
            (ctx.move_to if i == 0 else ctx.line_to)(X(px), Y(py))
        col = s.get("color", "yellow")
        set_col(ctx, col)
        ctx.set_line_width(s.get("width", 9))
        ctx.set_line_join(cairo.LINE_JOIN_ROUND)
        ctx.set_line_cap(cairo.LINE_CAP_ROUND)
        ctx.stroke()
        if drawn:
            lx, ly = drawn[-1]
            ctx.new_path()
            ctx.arc(X(lx), Y(ly), 12 + 3 * math.sin(S.t * 6), 0, math.tau)
            set_col(ctx, col)
            ctx.fill()
            lab = s.get("name", "")
            if s.get("show_value", True):
                lab = f"{lab} {ly:g}{v.get('yunit', '')}" if lab else f"{ly:g}{v.get('yunit', '')}"
            if lab:
                text(ctx, lab, X(lx) + s.get("label_dx", 18), Y(ly) + s.get("label_dy", -38), size=38,
                     fname="xbold", color=col, stroke=5, anchor=(s.get("label_ax", 0), 0.5),
                     align="left")
        last = drawn


# ---------------------------------------------------------------- apples (돈의 가치)

def v_apples(ctx, S: SceneCtx):
    v = S.v
    cx, cy = S.cx, S.cy + 10
    sc, al = pop(S.lt, 0.0, 0.5)
    bx = S.area[0] + 220
    draw_bill(ctx, bx, cy, 330 * sc, 160 * sc, v.get("bill", "10,000"), rot=-6 + math.sin(S.t * 2) * 2,
              a=al)
    text(ctx, v.get("bill_label", "1만 원"), bx, cy + 140, size=52, fname="title", color="white",
         stroke=6, alpha=al)
    text(ctx, "=", bx + 250, cy, size=120, fname="title", color="yellow", stroke=6, alpha=al)
    n0, n1 = v.get("from", 5), v.get("to", 4)
    st = S.at(v.get("at", 2))
    lost = prog(S.lt, st, 0.6)
    ax0 = bx + 360
    span = S.area[2] - ax0 - 40
    r = min(52, span / (n0 * 2.6))
    for i in range(n0):
        x = ax0 + r * 1.3 + i * r * 2.5
        y = cy + math.sin(S.t * 3 + i) * 5
        a_i = al * clamp(prog(S.lt, 0.15 * i, 0.3) * 3)
        if i >= n1 and lost > 0:
            y -= ease_out_cubic(lost) * 140
            a_i *= 1 - lost
            if lost < 1:
                text(ctx, "-1", x, y - 70, size=60, fname="title", color="red", stroke=6,
                     alpha=1 - lost)
        draw_apple(ctx, x, y, r, a=a_i)
    lab = v.get("label_before", "")
    if lost > 0.3:
        lab = v.get("label_after", lab)
    if lab:
        text(ctx, lab, ax0 + span / 2, cy + 140, size=48, fname="xbold", color="grey", stroke=4,
             alpha=al)
    if v.get("caption"):
        sc2, al2 = pop(S.lt, S.at(v.get("caption_at", 3)), 0.5)
        text(ctx, v["caption"], S.cx, S.area[1] + 70, size=70, fname="title", color="yellow",
             stroke=7, scale=sc2, alpha=al2, max_w=S.aw)


# ---------------------------------------------------------------- cart (물가지수)

def v_cart(ctx, S: SceneCtx):
    v = S.v
    sc, al = pop(S.lt, 0.0, 0.5)
    cx = S.area[0] + 320
    cy = S.cy + 60
    wob = math.sin(S.t * 2.2) * 3
    ctx.save()
    ctx.translate(cx, cy + wob)
    ctx.scale(max(sc, 1e-3), max(sc, 1e-3))
    # 상품
    rnd = random.Random(3)
    cols = ["#FF6B6B", "#FFD43B", "#4DA3FF", "#3BE07A", "#FF9F43", "#B07CFF"]
    for i in range(7):
        bx = -150 + (i % 4) * 75 + rnd.uniform(-8, 8)
        by = -150 - (i // 4) * 62 + rnd.uniform(-6, 6)
        draw_box(ctx, bx, by, 66, color=cols[i % len(cols)], a=al)
    # 카트 바구니
    ctx.new_path()
    ctx.move_to(-230, -120)
    ctx.line_to(200, -120)
    ctx.line_to(160, 40)
    ctx.line_to(-190, 40)
    ctx.close_path()
    outline_fill(ctx, "#C8D3F0", lw=7, a=al)
    set_col(ctx, "ink", al * 0.5)
    ctx.set_line_width(4)
    for gx in range(-180, 180, 50):
        ctx.new_path()
        ctx.move_to(gx, -112)
        ctx.line_to(gx + 8 * (gx / 180), 34)
        ctx.stroke()
    ctx.new_path()
    ctx.move_to(-230, -120)
    ctx.line_to(-280, -200)
    ctx.line_to(-330, -200)
    set_col(ctx, "ink", al)
    ctx.set_line_width(9)
    ctx.set_line_cap(cairo.LINE_CAP_ROUND)
    ctx.stroke()
    for wx in (-150, 120):
        ctx.new_path()
        ctx.arc(wx, 80, 26, 0, math.tau)
        outline_fill(ctx, "#2B2B2B", lw=5, a=al)
    ctx.restore()
    # 물가지수 패널
    px = S.area[0] + 640 + (S.aw - 640) / 2
    py = S.cy - 40
    sc2, al2 = pop(S.lt, S.at(v.get("panel_at", 0.5)), 0.5)
    card(ctx, px - 250, py - 170, 500, 340, fill="card", line="yellow", r=26, alpha=al2, lw=4)
    text(ctx, v.get("label", "소비자물가지수"), px, py - 115, size=42, fname="xbold",
         color="grey", alpha=al2)
    k = ease_in_out(prog(S.lt, S.at(v.get("at", 1)), 2.0))
    val = lerp(v.get("from", 100), v.get("to", 103), k)
    text(ctx, fmt_num(val, v.get("decimals", 0)), px, py + 10, size=150, fname="title",
         color="yellow" if k >= 1 else "white", stroke=8, alpha=al2, scale=sc2)
    if k >= 1:
        sc3, al3 = pop(S.lt, S.at(v.get("at", 1)) + 2.0, 0.4)
        ctx.new_path()
        round_rect(ctx, px - 110 * sc3, py + 95, 220 * sc3, 66, 33)
        set_col(ctx, "red", al3)
        ctx.fill()
        text(ctx, v.get("badge", "+3%"), px, py + 128, size=46, fname="black", color="white",
             alpha=al3, scale=sc3)
    if v.get("caption"):
        sc4, al4 = pop(S.lt, S.at(v.get("caption_at", 2)), 0.5)
        text(ctx, v["caption"], S.cx, S.area[3] - 30, size=50, fname="xbold", color="white",
             stroke=5, scale=sc4, alpha=al4, max_w=S.aw)


# ---------------------------------------------------------------- gauge

def v_gauge(ctx, S: SceneCtx):
    v = S.v
    cx, cy = S.cx, S.cy + 150
    R = min(330, S.aw / 2 - 60)
    sc, al = pop(S.lt, 0.0, 0.6)
    vmax = v.get("max", 10)
    zones = v.get("zones", [(0, 1, "blue"), (1, 3, "green"), (3, 5, "yellow"), (5, 10, "red")])
    ctx.save()
    ctx.translate(cx, cy)
    ctx.scale(max(sc, 1e-3), max(sc, 1e-3))
    for a, b, col in zones:
        ctx.new_path()
        ctx.arc(0, 0, R, math.pi + math.pi * a / vmax, math.pi + math.pi * b / vmax)
        set_col(ctx, col, al)
        ctx.set_line_width(64)
        ctx.stroke()
    for i in range(0, int(vmax) + 1):
        ang = math.pi + math.pi * i / vmax
        text(ctx, f"{i}", math.cos(ang) * (R + 70), math.sin(ang) * (R + 70), size=34,
             fname="bold", color="grey", alpha=al)
    st = S.at(v.get("at", 1))
    k = ease_out_elastic(prog(S.lt, st, 1.6)) if S.lt >= st else 0
    val = lerp(v.get("from", 0), v["value"], k) + (math.sin(S.t * 4) * 0.05 if k > 0.99 else 0)
    ang = math.pi + math.pi * val / vmax
    ctx.new_path()
    ctx.move_to(math.cos(ang + math.pi / 2) * 18, math.sin(ang + math.pi / 2) * 18)
    ctx.line_to(math.cos(ang) * (R - 20), math.sin(ang) * (R - 20))
    ctx.line_to(math.cos(ang - math.pi / 2) * 18, math.sin(ang - math.pi / 2) * 18)
    ctx.close_path()
    outline_fill(ctx, "white", lw=4, a=al)
    ctx.new_path()
    ctx.arc(0, 0, 34, 0, math.tau)
    outline_fill(ctx, "yellow", lw=5, a=al)
    ctx.restore()
    text(ctx, v.get("label", ""), cx, S.area[1] + 60, size=60, fname="title", color="white",
         stroke=6, alpha=al, max_w=S.aw)
    sc2, al2 = pop(S.lt, st + 0.8, 0.5)
    text(ctx, f"{v['value']:g}{v.get('unit', '%')}", cx, cy - 120, size=120, fname="title",
         color="yellow", stroke=8, scale=sc2, alpha=al2)
    if v.get("sub"):
        sc3, al3 = pop(S.lt, S.at(v.get("sub_at", 2)), 0.5)
        text(ctx, v["sub"], cx, cy + 90, size=48, fname="xbold", color="white", stroke=5,
             scale=sc3, alpha=al3, max_w=S.aw)


# ---------------------------------------------------------------- seesaw

def v_seesaw(ctx, S: SceneCtx):
    v = S.v
    top = S.area[1] + _header(ctx, S, v.get("title"), v.get("title_color", "yellow"))
    cx, cy = S.cx, S.area[3] - 190
    L = min(430, S.aw / 2 - 80)
    st = S.at(v.get("at", 1))
    k = ease_out_back(prog(S.lt, st, 1.4), 1.2)
    tilt = lerp(v.get("tilt_from", 0), v.get("tilt_to", -12), k)
    if v.get("wobble"):
        tilt += math.sin(S.t * 1.7) * v["wobble"]
    al = clamp(prog(S.lt, 0, 0.4))
    # 받침
    ctx.new_path()
    ctx.move_to(cx, cy)
    ctx.line_to(cx - 70, cy + 150)
    ctx.line_to(cx + 70, cy + 150)
    ctx.close_path()
    outline_fill(ctx, "#8C9BC7", lw=6, a=al)
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(math.radians(tilt))
    ctx.new_path()
    round_rect(ctx, -L, -16, 2 * L, 32, 12)
    outline_fill(ctx, "#E2B26E", lw=6, a=al)
    # 왼쪽 물체
    nl = int(lerp(v.get("left_from", 3), v.get("left_to", 9), clamp(prog(S.lt, st, 1.6))))
    for i in range(nl):
        x = -L + 60 + (i % 4) * 52
        y = -40 - (i // 4) * 44
        if v.get("left_kind", "coin") == "coin":
            draw_coin(ctx, x, y, 26, rot=0, a=al)
        else:
            draw_box(ctx, x, y + 6, 48, a=al)
    nr = int(lerp(v.get("right_from", 3), v.get("right_to", 3), clamp(prog(S.lt, st, 1.6))))
    for i in range(nr):
        x = L - 60 - (i % 4) * 56
        y = -42 - (i // 4) * 54
        if v.get("right_kind", "box") == "box":
            draw_box(ctx, x, y, 52, a=al)
        else:
            draw_coin(ctx, x, y + 4, 26, a=al)
    ctx.restore()
    lx = cx - L * math.cos(math.radians(tilt)) + 120
    ly = cy - L * math.sin(math.radians(tilt))
    rx = cx + L * math.cos(math.radians(tilt)) - 120
    ry = cy + L * math.sin(math.radians(tilt))
    text(ctx, v.get("left", ""), lx, ly + 90, size=48, fname="title",
         color=v.get("left_color", "yellow"), stroke=6, alpha=al)
    text(ctx, v.get("right", ""), rx, ry + 90, size=48, fname="title",
         color=v.get("right_color", "white"), stroke=6, alpha=al)
    if v.get("result"):
        sc, al2 = pop(S.lt, S.at(v.get("result_at", 2)), 0.5)
        text(ctx, v["result"], cx, top + 70, size=64, fname="title", color="red", stroke=7,
             scale=sc, alpha=al2, max_w=S.aw)


# ---------------------------------------------------------------- flow (인과 사슬)

def _node(ctx, x, y, w, h, label, col, sc, al, active=False):
    if al <= 0:
        return
    ctx.save()
    ctx.translate(x, y)
    ctx.scale(max(sc, 1e-3), max(sc, 1e-3))
    card(ctx, -w / 2, -h / 2, w, h, fill="card2" if active else "card", line=col, r=22, alpha=al,
         lw=5 if active else 3, glow=col if active else None)
    ctx.restore()
    text(ctx, label, x, y, size=46, fname="xbold", color="white", alpha=al, scale=sc,
         max_w=int(w - 30))


def v_flow(ctx, S: SceneCtx):
    v = S.v
    top = S.area[1] + _header(ctx, S, v.get("title"), v.get("title_color", "yellow"))
    nodes = v["nodes"]
    n = len(nodes)
    rows = 1 if n <= 3 else 2
    per = math.ceil(n / rows)
    nw = min(380, (S.aw - 60 - (per - 1) * 90) / per)
    nh = 150
    pos = []
    for i in range(n):
        r = i // per
        c = i % per
        if r % 2 == 1:
            c = per - 1 - c
        x = S.area[0] + 30 + nw / 2 + c * (nw + 90)
        x += (S.aw - 60 - (per * nw + (per - 1) * 90)) / 2
        if rows == 1:
            y = (top + S.area[3]) / 2
        else:
            y = top + 60 + nh / 2 + r * (nh + 150) + ((S.area[3] - top) - (2 * nh + 150) - 60) / 2
        pos.append((x, y))
    times = [S.at(nd.get("at", i)) for i, nd in enumerate(nodes)]
    for i in range(n - 1):
        x1, y1 = pos[i]
        x2, y2 = pos[i + 1]
        p = ease_out_cubic(prog(S.lt, times[i + 1] - 0.25, 0.4))
        if abs(y1 - y2) < 1:
            sgn = 1 if x2 > x1 else -1
            arrow(ctx, x1 + sgn * nw / 2 + sgn * 8, y1, x2 - sgn * nw / 2 - sgn * 8, y2,
                  color=v.get("arrow_color", "yellow"), width=10, head=28, progress=p)
        else:
            arrow(ctx, x1, y1 + nh / 2 + 8, x2, y2 - nh / 2 - 8, color=v.get("arrow_color", "yellow"),
                  width=10, head=28, progress=p)
    for i, nd in enumerate(nodes):
        sc, al = pop(S.lt, times[i], 0.45)
        active = S.lt >= times[i] and (i == n - 1 or S.lt < times[i + 1])
        _node(ctx, pos[i][0], pos[i][1], nw, nh, nd["text"], nd.get("color", v.get("color", "blue")),
              sc, al, active)


# ---------------------------------------------------------------- cycle (악순환)

def v_cycle(ctx, S: SceneCtx):
    v = S.v
    top = S.area[1] + _header(ctx, S, v.get("title"), v.get("title_color", "yellow"))
    nodes = v["nodes"]
    n = len(nodes)
    cx, cy = S.cx, (top + S.area[3]) / 2 + 10
    R = min(250, (S.area[3] - top) / 2 - 70)
    rx = R * 1.55
    times = [S.at(nd.get("at", i)) for i, nd in enumerate(nodes)]
    allin = S.lt >= times[-1] + 0.5
    rot = (S.lt - times[-1]) * 0.9 if allin else 0
    # 원형 화살표
    ctx.new_path()
    ctx.save()
    ctx.translate(cx, cy)
    ctx.scale(rx / R, 1)
    ctx.arc(0, 0, R, 0, math.tau)
    ctx.restore()
    set_col(ctx, v.get("color", "red"), 0.35 * clamp(prog(S.lt, 0, 0.5)))
    ctx.set_line_width(10)
    ctx.set_dash([26, 18], -S.t * 60)
    ctx.stroke()
    ctx.set_dash([])
    if v.get("center"):
        sc, al = pop(S.lt, times[-1] + 0.3, 0.6)
        pulse = 1 + 0.05 * math.sin(S.t * 5)
        text(ctx, v["center"], cx, cy, size=74, fname="title", color=v.get("color", "red"),
             stroke=7, scale=sc * pulse, alpha=al)
    for i, nd in enumerate(nodes):
        ang = -math.pi / 2 + i * math.tau / n
        x, y = cx + math.cos(ang) * rx, cy + math.sin(ang) * R
        sc, al = pop(S.lt, times[i], 0.45)
        hot = allin and int(rot) % n == i
        _node(ctx, x, y, 330, 118, nd["text"], v.get("color", "red"), sc * (1.06 if hot else 1), al, hot)


# ---------------------------------------------------------------- printer (돈 찍기)

def v_printer(ctx, S: SceneCtx):
    v = S.v
    _header(ctx, S, v.get("title"), v.get("title_color", "yellow"))
    cx = S.area[0] + 270
    cy = S.cy + 150
    al = clamp(prog(S.lt, 0, 0.4))
    shake = math.sin(S.t * 40) * 3
    ctx.save()
    ctx.translate(cx + shake, cy)
    ctx.new_path()
    round_rect(ctx, -200, -150, 400, 260, 26)
    outline_fill(ctx, "#C9D2EA", lw=7, a=al)
    ctx.new_path()
    round_rect(ctx, -160, -230, 320, 100, 18)
    outline_fill(ctx, "#AEB8D6", lw=7, a=al)
    ctx.new_path()
    round_rect(ctx, -170, 40, 340, 30, 10)
    outline_fill(ctx, "#2B2F45", lw=5, a=al)
    for i, col in enumerate(("red", "yellow", "green")):
        ctx.new_path()
        ctx.arc(-130 + i * 50, -70, 16, 0, math.tau)
        on = (int(S.t * 4) + i) % 3 == 0
        set_col(ctx, col, al if on else al * 0.35)
        ctx.fill()
    text(ctx, "₩ PRINT", 60, -70, size=44, fname="black", color="#2B2F45", alpha=al)
    ctx.restore()
    # 날아가는 지폐 (위로 뿜어져 나옴)
    rnd = random.Random(11)
    for i in range(16):
        ph = ((S.t * 0.5) + i / 16) % 1.0
        sx = cx + rnd.uniform(-60, 60)
        ex = cx + rnd.uniform(-260, 260)
        ey = S.area[1] + rnd.uniform(100, 240)
        x = lerp(sx, ex, ease_out_cubic(ph))
        y = lerp(cy - 160, ey, ease_out_cubic(ph)) + ph * ph * 120
        rot = rnd.uniform(-40, 40) + ph * rnd.uniform(-220, 220)
        draw_bill(ctx, x, y, 150, 72, "10,000", rot=rot, a=al * (1 - ph ** 3))
    if v.get("label"):
        sc, al2 = pop(S.lt, S.at(v.get("at", 1)), 0.5)
        px = S.area[2] - 300
        py = S.cy + 60
        card(ctx, px - 290, py - 170, 580, 300, fill="card", line="red", r=26, alpha=al2, lw=5)
        text(ctx, v["label"], px, py - 105, size=40, fname="xbold", color="grey", alpha=al2,
             max_w=540)
        text(ctx, v.get("value", ""), px, py + 15, size=130, fname="title", color="red",
             stroke=8, alpha=al2, scale=sc)
        if v.get("sub"):
            text(ctx, v["sub"], px, py + 100, size=34, fname="bold", color="grey", alpha=al2)


# ---------------------------------------------------------------- price tag (초인플레이션)

def v_pricetag(ctx, S: SceneCtx):
    v = S.v
    st = S.at(v.get("at", 2))
    d = v.get("dur", 4.0)
    k = clamp(prog(S.lt, st, d))
    a, b = v["from"], v["to"]
    val = a * (b / a) ** ease_in_out(k)
    al = clamp(prog(S.lt, 0, 0.4))
    tx = S.cx
    ty = S.area[1] + 170
    swing = math.sin(S.t * 2.2) * 6 + (math.sin(S.t * 30) * 4 if 0 < k < 1 else 0)
    ctx.save()
    ctx.translate(tx, ty - 120)
    ctx.rotate(math.radians(swing))
    ctx.new_path()
    ctx.move_to(0, 0)
    ctx.line_to(0, 90)
    set_col(ctx, "grey", al)
    ctx.set_line_width(4)
    ctx.stroke()
    tw, th = min(1000, S.aw - 60), 300
    ctx.new_path()
    ctx.move_to(-tw / 2 + 60, 90)
    ctx.line_to(tw / 2, 90)
    ctx.line_to(tw / 2, 90 + th)
    ctx.line_to(-tw / 2 + 60, 90 + th)
    ctx.line_to(-tw / 2, 90 + th / 2)
    ctx.close_path()
    outline_fill(ctx, "#FFF1C9", lw=7, a=al)
    ctx.new_path()
    ctx.arc(-tw / 2 + 60, 90 + th / 2, 16, 0, math.tau)
    set_col(ctx, "ink", al)
    ctx.fill()
    ctx.restore()
    num = fmt_num(val) + v.get("unit", "")
    size = 130 if len(num) < 10 else int(130 * 10 / len(num) * 1.1)
    text(ctx, num, tx + 30, ty + 120, size=max(60, size), fname="title",
         color="#C0392B" if k > 0.5 else "#1E2A4A", alpha=al)
    text(ctx, v.get("item", ""), tx + 30, ty + 20, size=46, fname="xbold", color="#5A4A2A", alpha=al)
    year = v.get("y1", "") if k < 0.5 else v.get("y2", "")
    sc, al2 = pop(S.lt, st + (d / 2 if k >= 0.5 else 0), 0.4)
    ctx.new_path()
    round_rect(ctx, tx - 200, S.area[3] - 190, 400, 100, 50)
    set_col(ctx, "red" if k >= 0.5 else "card2", al)
    ctx.fill()
    text(ctx, year, tx, S.area[3] - 140, size=56, fname="title", color="white", alpha=al, scale=sc)
    if v.get("caption"):
        sc3, al3 = pop(S.lt, S.at(v.get("caption_at", 3)), 0.5)
        text(ctx, v["caption"], tx, S.area[3] - 30, size=46, fname="xbold", color="yellow",
             stroke=5, scale=sc3, alpha=al3, max_w=S.aw)


# ---------------------------------------------------------------- giant banknote

def v_banknote(ctx, S: SceneCtx):
    v = S.v
    al = clamp(prog(S.lt, 0, 0.4))
    st = S.at(v.get("at", 1))
    digits = v.get("value", "100,000,000,000,000")
    shown = int(len(digits) * clamp(prog(S.lt, st, v.get("dur", 3.0))))
    bw, bh = min(1060, S.aw - 40), 440
    x, y = S.cx, S.cy - 10
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(math.radians(-3 + math.sin(S.t * 1.5) * 1.5))
    ctx.new_path()
    round_rect(ctx, -bw / 2, -bh / 2, bw, bh, 24)
    outline_fill(ctx, "#E6D9A8", lw=8, a=al)
    ctx.new_path()
    round_rect(ctx, -bw / 2 + 24, -bh / 2 + 24, bw - 48, bh - 48, 16)
    set_col(ctx, "#8A7A3E", al)
    ctx.set_line_width(4)
    ctx.stroke()
    ctx.new_path()
    ctx.arc(bw / 2 - 110, bh / 2 - 100, 60, 0, math.tau)
    set_col(ctx, "#D4C487", al)
    ctx.fill()
    ctx.restore()
    text(ctx, v.get("country", ""), x, y - 140, size=44, fname="black", color="#5B4D1E",
         alpha=al)
    dsize = int(min(80, (bw - 120) / max(1, len(digits)) * 1.65))
    text(ctx, digits[:shown] if shown else " ", x, y - 10, size=dsize, fname="title",
         color="#3A2F10", alpha=al)
    text(ctx, v.get("unit", "DOLLARS"), x, y + 110, size=54, fname="black", color="#5B4D1E",
         alpha=al)
    if v.get("caption"):
        sc, al2 = pop(S.lt, S.at(v.get("caption_at", 2)), 0.5)
        text(ctx, v["caption"], S.cx, S.area[3] - 30, size=60, fname="title", color="yellow",
             stroke=7, scale=sc, alpha=al2, max_w=S.aw)
    if v.get("badge"):
        sc, al3 = pop(S.lt, S.at(v.get("badge_at", 2)), 0.5)
        ctx.save()
        ctx.translate(x + bw / 2 - 120, y - bh / 2 + 10)
        ctx.rotate(math.radians(12))
        ctx.scale(max(sc, 1e-3), max(sc, 1e-3))
        ctx.new_path()
        round_rect(ctx, -170, -50, 340, 100, 20)
        set_col(ctx, "red", al3)
        ctx.fill()
        ctx.restore()
        text(ctx, v["badge"], x + bw / 2 - 120, y - bh / 2 + 10, size=50, fname="title",
             color="white", alpha=al3, rot=12, scale=sc)


# ---------------------------------------------------------------- ripple (칸티용 효과)

def v_ripple(ctx, S: SceneCtx):
    v = S.v
    top = S.area[1] + _header(ctx, S, v.get("title"), v.get("title_color", "yellow"))
    rings = v["rings"]
    n = len(rings)
    cx, cy = S.cx, (top + S.area[3]) / 2 + 20
    r0 = 78
    rmax = min((S.area[3] - top) / 2 - 10, 330)
    asp = 1.75
    al0 = clamp(prog(S.lt, 0, 0.4))
    radii = [r0 + (i + 1) * (rmax - r0) / n for i in range(n)]
    # 퍼지는 파동
    for i in range(3):
        ph = (S.t * 0.35 + i / 3) % 1.0
        ctx.new_path()
        ctx.save()
        ctx.translate(cx, cy)
        ctx.scale(asp, 1)
        ctx.arc(0, 0, r0 + ph * (rmax - r0), 0, math.tau)
        ctx.restore()
        set_col(ctx, "blue", 0.3 * (1 - ph) * al0)
        ctx.set_line_width(5)
        ctx.stroke()
    for i in reversed(range(n)):
        rg = rings[i]
        st = S.at(rg.get("at", i + 1))
        p = ease_out_back(prog(S.lt, st, 0.6))
        al = clamp(prog(S.lt, st, 0.2))
        if al <= 0:
            continue
        r = r0 + (radii[i] - r0) * p
        ctx.new_path()
        ctx.save()
        ctx.translate(cx, cy)
        ctx.scale(asp, 1)
        ctx.arc(0, 0, max(1, r), 0, math.tau)
        ctx.restore()
        shade = ["#22357A", "#1B2B66", "#152253"][i % 3]
        set_col(ctx, rg.get("color", shade), 0.95 * al)
        ctx.fill_preserve()
        set_col(ctx, "line", al)
        ctx.set_line_width(3)
        ctx.stroke()
    for i, rg in enumerate(rings):
        st = S.at(rg.get("at", i + 1))
        sc, al = pop(S.lt, st + 0.2, 0.45)
        rin = r0 if i == 0 else radii[i - 1]
        mid = (rin + radii[i]) / 2
        text(ctx, rg["text"], cx, cy - mid, size=40, fname="xbold", color="white", stroke=5,
             scale=sc, alpha=al)
        if rg.get("tag"):
            text(ctx, rg["tag"], cx + mid * asp, cy, size=38, fname="title",
                 color=rg.get("tag_color", "yellow"), stroke=6, scale=sc, alpha=al)
    sc, al = pop(S.lt, 0.1, 0.5)
    pulse = 1 + 0.04 * math.sin(S.t * 4)
    ctx.new_path()
    ctx.save()
    ctx.translate(cx, cy)
    ctx.scale(asp, 1)
    ctx.arc(0, 0, r0 * sc * pulse, 0, math.tau)
    ctx.restore()
    set_col(ctx, "yellow", al)
    ctx.fill()
    text(ctx, v.get("center", "새 돈"), cx, cy, size=38, fname="black", color="ink", alpha=al,
         scale=sc)


# ---------------------------------------------------------------- shrinkflation

def v_shrink(ctx, S: SceneCtx):
    v = S.v
    _header(ctx, S, v.get("title"), v.get("title_color", "yellow"))
    st = S.at(v.get("at", 1))
    k = ease_in_out(prog(S.lt, st, 1.6))
    g0, g1 = v.get("from_g", 100), v.get("to_g", 80)
    s = lerp(1.0, (g1 / g0) ** 0.5, k)
    al = clamp(prog(S.lt, 0, 0.4))
    bx, by = S.area[0] + 330, S.cy + 40
    ctx.save()
    ctx.translate(bx, by + math.sin(S.t * 2) * 5)
    ctx.scale(max(s, 1e-3), max(s, 1e-3))
    ctx.new_path()
    ctx.move_to(-170, -220)
    for i in range(9):
        ctx.line_to(-170 + i * 42.5, -235 if i % 2 == 0 else -215)
    ctx.line_to(170, -220)
    ctx.curve_to(195, -80, 195, 80, 170, 220)
    for i in range(9):
        ctx.line_to(170 - i * 42.5, 235 if i % 2 == 0 else 215)
    ctx.line_to(-170, 220)
    ctx.curve_to(-195, 80, -195, -80, -170, -220)
    ctx.close_path()
    outline_fill(ctx, "#FF7A45", lw=8, a=al)
    ctx.new_path()
    ctx.arc(0, -20, 110, 0, math.tau)
    set_col(ctx, "#FFE08A", al)
    ctx.fill()
    ctx.restore()
    text(ctx, v.get("name", "과자"), bx, by - 20 * s, size=int(70 * s), fname="title",
         color="#B23A0E", alpha=al)
    grams = lerp(g0, g1, k)
    text(ctx, f"{grams:.0f}g", bx, by + 140 * s, size=int(64 * s), fname="title", color="white",
         stroke=6, alpha=al)
    # 가격표 고정
    px = S.area[0] + 760 + (S.aw - 760) / 2
    card(ctx, px - 230, S.cy - 220, 460, 170, fill="card", line="yellow", r=24, alpha=al, lw=4)
    text(ctx, "가격", px, S.cy - 180, size=36, fname="xbold", color="grey", alpha=al)
    text(ctx, v.get("price", "1,500원"), px, S.cy - 110, size=86, fname="title", color="yellow",
         stroke=6, alpha=al)
    if S.lt > st:
        sc, al2 = pop(S.lt, S.at(v.get("unit_at", 2)), 0.5)
        card(ctx, px - 300, S.cy + 10, 600, 230, fill="card", line="red", r=24, alpha=al2, lw=4)
        text(ctx, "100g당 실제 가격", px, S.cy + 55, size=36, fname="xbold", color="grey", alpha=al2)
        text(ctx, v.get("unit_from", ""), px - 140, S.cy + 140, size=58, fname="title",
             color="white", stroke=5, alpha=al2, scale=sc)
        arrow(ctx, px - 30, S.cy + 140, px + 40, S.cy + 140, color="red", width=8, head=22,
              alpha=al2)
        text(ctx, v.get("unit_to", ""), px + 150, S.cy + 140, size=58, fname="title", color="red",
             stroke=5, alpha=al2, scale=sc)


# ---------------------------------------------------------------- outro / end screen

def v_outro(ctx, S: SceneCtx):
    v = S.v
    al = clamp(prog(S.lt, 0, 0.5))
    mx = 795
    text(ctx, v.get("next_label", "다음 영상"), mx, 190, size=42, fname="xbold", color="grey",
         alpha=al)
    text(ctx, v.get("next", ""), mx, 258, size=66, fname="title", color="yellow", stroke=6,
         alpha=al, max_w=1300)
    # 엔드스크린 자리(영상 2개 + 구독) — 업로드 후 YouTube 스튜디오에서 요소를 이 위치에 배치
    fw, fh = 650, 366
    for i, x in enumerate((110, 830)):
        y = 330
        p = ease_out_back(prog(S.lt, 0.3 + i * 0.2, 0.6))
        ctx.save()
        ctx.translate(x + fw / 2, y + fh / 2)
        ctx.scale(max(p, 1e-3), max(p, 1e-3))
        ctx.new_path()
        round_rect(ctx, -fw / 2, -fh / 2, fw, fh, 22)
        set_col(ctx, "card", 0.85 * al)
        ctx.fill_preserve()
        ctx.set_dash([18, 12], S.t * 30)
        set_col(ctx, "yellow" if i == 0 else "grey", al)
        ctx.set_line_width(5)
        ctx.stroke()
        ctx.set_dash([])
        ctx.restore()
        text(ctx, ("다음 편 보기" if i == 0 else "추천 영상"), x + fw / 2, y + fh / 2, size=46,
             fname="xbold", color="grey", alpha=al * p)
    # 구독 버튼 애니메이션
    bx, by = mx, 845
    cyc = (S.lt % 4.0)
    press = 1 - 0.08 * math.sin(clamp((cyc - 1.0) / 0.3) * math.pi)
    subbed = cyc > 1.15
    ctx.save()
    ctx.translate(bx, by)
    ctx.scale(max(press, 1e-3), max(press, 1e-3))
    ctx.new_path()
    round_rect(ctx, -170, -48, 340, 96, 48)
    set_col(ctx, "#3A3F55" if subbed else "red", al)
    ctx.fill()
    ctx.restore()
    text(ctx, "구독중" if subbed else "구독", bx, by, size=46, fname="black", color="white",
         alpha=al, scale=press)
    # 커서
    cxp = bx + 120 - 60 * ease_in_out(clamp(cyc / 1.0)) + 40 * clamp((cyc - 2.5) / 1)
    cyp = by + 90 - 70 * ease_in_out(clamp(cyc / 1.0)) + 60 * clamp((cyc - 2.5) / 1)
    ctx.new_path()
    ctx.move_to(cxp, cyp)
    ctx.line_to(cxp, cyp + 44)
    ctx.line_to(cxp + 12, cyp + 33)
    ctx.line_to(cxp + 24, cyp + 56)
    ctx.line_to(cxp + 32, cyp + 52)
    ctx.line_to(cxp + 21, cyp + 30)
    ctx.line_to(cxp + 36, cyp + 30)
    ctx.close_path()
    outline_fill(ctx, "white", lw=3, a=al)
    # 종 아이콘
    ring = math.sin(S.t * 18) * 14 if subbed and cyc < 2.2 else 0
    ctx.save()
    ctx.translate(bx + 250, by)
    ctx.rotate(math.radians(ring))
    ctx.new_path()
    ctx.move_to(-26, 18)
    ctx.curve_to(-26, -30, 26, -30, 26, 18)
    ctx.line_to(32, 24)
    ctx.line_to(-32, 24)
    ctx.close_path()
    outline_fill(ctx, "yellow", lw=4, a=al)
    ctx.new_path()
    ctx.arc(0, 30, 8, 0, math.tau)
    set_col(ctx, "yellow", al)
    ctx.fill()
    ctx.restore()


VISUALS = {
    "keytext": v_keytext, "title": v_title, "chapter": v_chapter, "counter": v_counter,
    "list": v_list, "compare": v_compare, "bars": v_bars, "line": v_line, "apples": v_apples,
    "cart": v_cart, "gauge": v_gauge, "seesaw": v_seesaw, "flow": v_flow, "cycle": v_cycle,
    "printer": v_printer, "pricetag": v_pricetag, "banknote": v_banknote, "ripple": v_ripple,
    "shrink": v_shrink, "outro": v_outro,
}


def visual_events(scene: dict):
    """효과음 이벤트 (장면 내부 시간, 종류) 목록."""
    S = SceneCtx(scene, 0.0, scene["start"])
    v = scene["visual"]
    ty = v["type"]
    ev = []

    def add(a, kind="pop"):
        tt = S.at(a)
        if tt >= 0:
            ev.append((tt, kind))

    if ty == "chapter":
        ev.append((0.0, "whoosh"))
        ev.append((0.55, "boom"))
    elif ty == "title":
        ev.append((0.2, "whoosh"))
        ev.append((S.at(v.get("main_at", 0), 0.6), "boom"))
    elif ty in ("keytext",):
        for ln in v["lines"]:
            add(ln.get("at", 0))
    elif ty in ("list", "bars", "flow", "cycle"):
        for i, it in enumerate(v.get("items", v.get("nodes", []))):
            add(it.get("at", i))
    elif ty == "compare":
        for key in ("left", "right"):
            add(v[key].get("at", 0), "whoosh")
            for j, it in enumerate(v[key].get("items", [])):
                add(it.get("at", j))
    elif ty in ("counter", "cart"):
        st = S.at(v.get("at", 1))
        d = v.get("dur", 2.4 if ty == "counter" else 2.0)
        ev.append((st, "tick"))
        ev.append((st + d, "ding"))
        if v.get("sub"):
            add(v.get("sub_at", 3))
    elif ty == "pricetag":
        st = S.at(v.get("at", 2))
        ev.append((st, "tick"))
        ev.append((st + v.get("dur", 4.0), "ding"))
    elif ty == "banknote":
        add(v.get("at", 1), "tick")
        if v.get("badge"):
            add(v.get("badge_at", 2), "boom")
    elif ty == "apples":
        add(v.get("at", 2), "pop")
    elif ty == "gauge":
        add(v.get("at", 1), "whoosh")
    elif ty in ("seesaw", "shrink", "printer"):
        add(v.get("at", 1), "whoosh")
    elif ty == "ripple":
        for i, rg in enumerate(v["rings"]):
            add(rg.get("at", i + 1))
    elif ty == "line":
        for i, s in enumerate(v["series"]):
            add(s.get("at", i), "whoosh")
    return [(scene["start"] + max(0.0, tt), k) for tt, k in ev]
