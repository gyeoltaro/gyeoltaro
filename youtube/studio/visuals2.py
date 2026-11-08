"""모션 그래픽 장면 2.0 (설명형 시각화).

글자 목록 대신 '보면서 이해되는' 장면을 만든다:
타임라인, 시세판, 폭포(워터폴) 차트, 미국→한국 시차, 서킷브레이커, 도넛, 저울(근거 vs 반론),
도장(정보 등급), 거품, 도미노, 달력, 데이터센터, 큰 숫자 충격(kinetic), 아이콘 그리드.

모든 요소는 대본 문장(line)의 시작 시점(at)에 맞춰 등장한다. (visuals.py 의 SceneCtx.at 규칙과 동일)
"""
from __future__ import annotations

import math
import random

import cairo

from .core import (PAL, W, H, arrow, card, clamp, draw_coin, draw_person, ease_in_out, ease_out_back,
                   ease_out_cubic, ease_out_elastic, fmt_num, hexc, pop, prog, round_rect, set_col, text)
from .visuals import SceneCtx, _header


def _c(name):
    return hexc(PAL.get(name, name))


def _glow_circle(ctx, x, y, r, col, a):
    g = cairo.RadialGradient(x, y, 0, x, y, r)
    rr, gg, bb = _c(col)
    g.add_color_stop_rgba(0, rr, gg, bb, 0.55 * a)
    g.add_color_stop_rgba(1, rr, gg, bb, 0)
    ctx.set_source(g)
    ctx.new_path()
    ctx.arc(x, y, r, 0, math.tau)
    ctx.fill()


def _burst(ctx, x, y, k, col="yellow", n=12, r0=30, r1=150, seed=1):
    """터지는 파편(0<k<1)"""
    if not (0 < k < 1):
        return
    rnd = random.Random(seed)
    a = 1 - k
    set_col(ctx, col, a)
    ctx.set_line_width(6)
    ctx.set_line_cap(cairo.LINE_CAP_ROUND)
    for i in range(n):
        ang = math.tau * i / n + rnd.uniform(-0.2, 0.2)
        ra = r0 + (r1 - r0) * ease_out_cubic(k)
        rb = ra + 28 * (1 - k)
        ctx.new_path()
        ctx.move_to(x + math.cos(ang) * ra, y + math.sin(ang) * ra)
        ctx.line_to(x + math.cos(ang) * rb, y + math.sin(ang) * rb)
        ctx.stroke()


def _shockwave(ctx, x, y, k, col="white", rmax=420):
    if not (0 < k < 1):
        return
    ctx.new_path()
    ctx.arc(x, y, 40 + rmax * ease_out_cubic(k), 0, math.tau)
    set_col(ctx, col, 0.5 * (1 - k))
    ctx.set_line_width(10 * (1 - k) + 2)
    ctx.stroke()


# ---------------------------------------------------------------- icons

def icon(ctx, name, x, y, s=1.0, a=1.0, col=None):
    """간단한 벡터 아이콘. (x, y) 중심, s=1 이면 약 100px."""
    if a <= 0:
        return
    ctx.save()
    ctx.translate(x, y)
    ctx.scale(max(s, 1e-3), max(s, 1e-3))
    ink = (0.07, 0.07, 0.07, a)

    def stroke(w=6):
        ctx.set_source_rgba(*ink)
        ctx.set_line_width(w)
        ctx.stroke()

    if name == "vote":  # 투표함
        ctx.new_path()
        round_rect(ctx, -46, -10, 92, 60, 8)
        set_col(ctx, col or "blue", a)
        ctx.fill_preserve()
        stroke()
        ctx.new_path()
        ctx.rectangle(-26, -8, 52, 8)
        ctx.set_source_rgba(*ink)
        ctx.fill()
        ctx.new_path()
        ctx.rectangle(-18, -52, 36, 46)
        ctx.set_source_rgba(1, 1, 1, a)
        ctx.fill_preserve()
        stroke(5)
        ctx.new_path()
        ctx.move_to(-8, -32)
        ctx.line_to(-1, -22)
        ctx.line_to(12, -42)
        ctx.set_source_rgba(0.2, 0.75, 0.4, a)
        ctx.set_line_width(5)
        ctx.stroke()
    elif name == "chip":  # 반도체 칩
        ctx.set_source_rgba(*ink)
        for i in range(-2, 3):
            for sx, sy, w_, h_ in ((i * 16 - 3, -58, 6, 16), (i * 16 - 3, 42, 6, 16), (-58, i * 16 - 3, 16, 6), (42, i * 16 - 3, 16, 6)):
                ctx.rectangle(sx, sy, w_, h_)
        ctx.fill()
        ctx.new_path()
        round_rect(ctx, -44, -44, 88, 88, 10)
        set_col(ctx, col or "#2B2F3A", a)
        ctx.fill_preserve()
        stroke(5)
        ctx.new_path()
        round_rect(ctx, -26, -26, 52, 52, 6)
        set_col(ctx, "green", a)
        ctx.fill()
        text(ctx, "AI", 0, 2, size=30, fname="black", color="ink", alpha=a)
    elif name in ("chart_down", "chart_up"):
        ctx.new_path()
        round_rect(ctx, -50, -46, 100, 92, 12)
        ctx.set_source_rgba(1, 1, 1, 0.95 * a)
        ctx.fill_preserve()
        stroke(5)
        pts = [(-36, -24), (-14, -6), (4, -16), (34, 28)] if name == "chart_down" else [(-36, 26), (-14, 6), (4, 16), (34, -28)]
        ctx.new_path()
        ctx.move_to(*pts[0])
        for p in pts[1:]:
            ctx.line_to(*p)
        set_col(ctx, col or ("red" if name == "chart_down" else "green"), a)
        ctx.set_line_width(8)
        ctx.set_line_join(cairo.LINE_JOIN_ROUND)
        ctx.stroke()
    elif name == "clock":
        ctx.new_path()
        ctx.arc(0, 0, 48, 0, math.tau)
        ctx.set_source_rgba(1, 1, 1, a)
        ctx.fill_preserve()
        stroke(6)
        ctx.new_path()
        ctx.move_to(0, 0)
        ctx.line_to(0, -32)
        ctx.move_to(0, 0)
        ctx.line_to(22, 8)
        stroke(6)
    elif name == "bolt":
        ctx.new_path()
        for px, py in ((10, -55), (-30, 6), (-4, 6), (-14, 55), (32, -10), (6, -10), (18, -55)):
            ctx.line_to(px, py)
        ctx.close_path()
        set_col(ctx, col or "yellow", a)
        ctx.fill_preserve()
        stroke(5)
    elif name == "water":
        ctx.new_path()
        ctx.move_to(0, -52)
        ctx.curve_to(30, -12, 40, 8, 40, 20)
        ctx.curve_to(40, 44, 22, 56, 0, 56)
        ctx.curve_to(-22, 56, -40, 44, -40, 20)
        ctx.curve_to(-40, 8, -30, -12, 0, -52)
        set_col(ctx, col or "blue", a)
        ctx.fill_preserve()
        stroke(5)
    elif name == "server":
        for i in range(3):
            ctx.new_path()
            round_rect(ctx, -44, -52 + i * 36, 88, 30, 6)
            set_col(ctx, col or "#3B4A5E", a)
            ctx.fill_preserve()
            stroke(4)
            ctx.new_path()
            ctx.arc(28, -37 + i * 36, 5, 0, math.tau)
            set_col(ctx, "green", a)
            ctx.fill()
    elif name == "house":
        ctx.new_path()
        ctx.move_to(-46, -4)
        ctx.line_to(0, -48)
        ctx.line_to(46, -4)
        ctx.close_path()
        set_col(ctx, col or "red", a)
        ctx.fill_preserve()
        stroke(5)
        ctx.new_path()
        ctx.rectangle(-34, -4, 68, 50)
        ctx.set_source_rgba(1, 1, 1, a)
        ctx.fill_preserve()
        stroke(5)
        ctx.new_path()
        ctx.rectangle(-10, 16, 20, 30)
        set_col(ctx, "orange", a)
        ctx.fill()
    elif name == "news":
        ctx.new_path()
        round_rect(ctx, -48, -40, 96, 80, 8)
        ctx.set_source_rgba(1, 1, 1, a)
        ctx.fill_preserve()
        stroke(5)
        ctx.set_source_rgba(*ink)
        ctx.rectangle(-36, -28, 72, 14)
        ctx.fill()
        for i in range(3):
            ctx.rectangle(-36, -4 + i * 14, 72 if i < 2 else 44, 6)
        ctx.fill()
    elif name in ("check", "x", "q", "warn"):
        colr = {"check": "green", "x": "red", "q": "grey", "warn": "orange"}[name]
        ctx.new_path()
        if name == "warn":
            ctx.move_to(0, -50)
            ctx.line_to(52, 42)
            ctx.line_to(-52, 42)
            ctx.close_path()
        else:
            ctx.arc(0, 0, 48, 0, math.tau)
        set_col(ctx, col or colr, a)
        ctx.fill_preserve()
        stroke(5)
        lab = {"check": "✓", "x": "✕", "q": "?", "warn": "!"}[name]
        text(ctx, lab, 0, 6 if name == "warn" else 2, size=58, fname="black", color="ink", alpha=a)
    elif name == "flag_us":
        ctx.new_path()
        ctx.rectangle(-54, -36, 108, 72)
        ctx.set_source_rgba(1, 1, 1, a)
        ctx.fill()
        set_col(ctx, "red", a)
        for i in range(0, 7, 2):
            ctx.rectangle(-54, -36 + i * 10.3, 108, 10.3)
        ctx.fill()
        ctx.rectangle(-54, -36, 46, 36)
        set_col(ctx, "#2C4CA8", a)
        ctx.fill()
        ctx.new_path()
        ctx.rectangle(-54, -36, 108, 72)
        stroke(5)
    elif name == "flag_kr":
        ctx.new_path()
        ctx.rectangle(-54, -36, 108, 72)
        ctx.set_source_rgba(1, 1, 1, a)
        ctx.fill_preserve()
        stroke(5)
        ctx.new_path()
        ctx.arc(0, 0, 20, math.pi, 0)
        set_col(ctx, "#D8283A", a)
        ctx.fill()
        ctx.new_path()
        ctx.arc(0, 0, 20, 0, math.pi)
        set_col(ctx, "#2C4CA8", a)
        ctx.fill()
        ctx.set_source_rgba(*ink)
        for sx in (-40, 34):
            for sy in (-26, 16):
                ctx.rectangle(sx, sy, 8, 10)
        ctx.fill()
    elif name == "rate":
        ctx.new_path()
        ctx.arc(0, 0, 48, 0, math.tau)
        set_col(ctx, col or "purple", a)
        ctx.fill_preserve()
        stroke(5)
        text(ctx, "%", 0, 2, size=60, fname="black", color="ink", alpha=a)
    elif name == "won":
        draw_coin(ctx, 0, 0, 48, 0.0, a)
    elif name == "person":
        draw_person(ctx, 0, 40, 0.9, a=a)
    elif name == "bubble":
        ctx.new_path()
        ctx.arc(0, 0, 48, 0, math.tau)
        set_col(ctx, col or "blue", 0.35 * a)
        ctx.fill_preserve()
        ctx.set_source_rgba(1, 1, 1, 0.9 * a)
        ctx.set_line_width(5)
        ctx.stroke()
        ctx.new_path()
        ctx.arc(-16, -18, 10, 0, math.tau)
        ctx.set_source_rgba(1, 1, 1, 0.8 * a)
        ctx.fill()
    elif name == "pause":
        ctx.new_path()
        ctx.arc(0, 0, 48, 0, math.tau)
        set_col(ctx, col or "red", a)
        ctx.fill_preserve()
        stroke(5)
        ctx.set_source_rgba(1, 1, 1, a)
        ctx.rectangle(-18, -22, 12, 44)
        ctx.rectangle(6, -22, 12, 44)
        ctx.fill()
    elif name == "factory":
        ctx.new_path()
        ctx.move_to(-50, 44)
        ctx.line_to(-50, -6)
        ctx.line_to(-20, 10)
        ctx.line_to(-20, -6)
        ctx.line_to(10, 10)
        ctx.line_to(10, -40)
        ctx.line_to(30, -40)
        ctx.line_to(30, 10)
        ctx.line_to(50, 10)
        ctx.line_to(50, 44)
        ctx.close_path()
        set_col(ctx, col or "grey", a)
        ctx.fill_preserve()
        stroke(5)
    elif name == "calendar":
        ctx.new_path()
        round_rect(ctx, -46, -40, 92, 88, 10)
        ctx.set_source_rgba(1, 1, 1, a)
        ctx.fill_preserve()
        stroke(5)
        ctx.new_path()
        round_rect(ctx, -46, -40, 92, 26, 10)
        set_col(ctx, col or "red", a)
        ctx.fill()
        ctx.set_source_rgba(*ink)
        for r_ in range(2):
            for c_ in range(3):
                ctx.rectangle(-30 + c_ * 22, -2 + r_ * 22, 14, 12)
        ctx.fill()
        for sx in (-24, 24):
            ctx.rectangle(sx - 3, -52, 6, 20)
        ctx.fill()
    else:  # 알 수 없는 이름 → 동그라미 + 글자
        ctx.new_path()
        ctx.arc(0, 0, 48, 0, math.tau)
        set_col(ctx, col or "yellow", a)
        ctx.fill_preserve()
        stroke(5)
        text(ctx, str(name)[:2], 0, 2, size=40, fname="black", color="ink", alpha=a)
    ctx.restore()


# ---------------------------------------------------------------- kinetic (큰 숫자 충격)

def v_kinetic(ctx, S: SceneCtx):
    """큰 숫자/문구가 '쾅' 하고 찍히는 장면. lines: [{text, size, color, at, slam}]"""
    v = S.v
    top = S.area[1] + _header(ctx, S, v.get("title"), v.get("title_color", "grey"), size=44)
    lines = v["lines"]
    sizes = [ln.get("size", 120) for ln in lines]
    total = sum(sz * 1.18 for sz in sizes) + 30 * (len(lines) - 1)
    y = top + (S.area[3] - top - total) / 2
    for ln, sz in zip(lines, sizes):
        st = S.at(ln.get("at", 0))
        d = S.lt - st
        yy = y + sz * 0.6
        if d >= 0:
            if ln.get("slam"):
                k = clamp(d / 0.28)
                sc = 2.2 - 1.2 * ease_out_cubic(k)
                al = clamp(d / 0.12)
                if k >= 1:
                    sc = 1 + 0.03 * math.exp(-(d - 0.28) * 6) * math.sin((d - 0.28) * 30)
                _shockwave(ctx, S.cx, yy, clamp((d - 0.25) / 0.7), ln.get("color", "yellow"), 520)
                _burst(ctx, S.cx, yy, clamp((d - 0.22) / 0.6), ln.get("color", "yellow"), 16, 120, 380, seed=int(sz))
            else:
                sc, al = pop(S.lt, st, 0.45)
            if ln.get("box"):
                p = ease_out_cubic(prog(S.lt, st, 0.35))
                bw = min(S.aw - 20, ln.get("box_w", S.aw - 80))
                card(ctx, S.cx - bw / 2 * p, yy - sz * 0.72, bw * p, sz * 1.44, fill=ln["box"], line=None, r=18, alpha=al * 0.9)
            text(ctx, ln["text"], S.cx, yy + math.sin(S.t * 1.7) * 3, size=sz, fname=ln.get("font", "title"),
                 color=ln.get("color", "white"), stroke=ln.get("stroke", 8), scale=sc, alpha=al, max_w=S.aw - 30)
        y += sz * 1.18 + 30


# ---------------------------------------------------------------- timeline

def v_timeline(ctx, S: SceneCtx):
    """events: [{date, label, icon, color, at, sub}] 가로 타임라인 + 움직이는 진행점."""
    v = S.v
    top = S.area[1] + _header(ctx, S, v.get("title"), v.get("title_color", "yellow"))
    ev = v["events"]
    n = len(ev)
    x0, x1 = S.area[0] + 90, S.area[2] - 90
    ly = (top + S.area[3]) / 2 + 20
    times = [S.at(e.get("at", i)) for i, e in enumerate(ev)]
    # 축 그리기 (처음 0.6초 동안 그려짐)
    k = ease_out_cubic(prog(S.lt, 0.0, 0.8))
    ctx.new_path()
    ctx.move_to(x0 - 40, ly)
    ctx.line_to(x0 - 40 + (x1 - x0 + 80) * k, ly)
    set_col(ctx, "line")
    ctx.set_line_width(10)
    ctx.set_line_cap(cairo.LINE_CAP_ROUND)
    ctx.stroke()
    xs = [x0 + (x1 - x0) * (i / max(1, n - 1)) for i in range(n)]
    # 진행선 (현재 사건까지 노랗게)
    cur = -1
    for i, tt in enumerate(times):
        if S.lt >= tt:
            cur = i
    if cur >= 0:
        nxt = min(cur + 1, n - 1)
        frac = 0.0
        if nxt > cur:
            frac = clamp((S.lt - times[cur]) / max(0.6, times[nxt] - times[cur])) * 0.0
        px = xs[cur] + (xs[nxt] - xs[cur]) * frac
        p0 = ease_out_cubic(prog(S.lt, times[cur], 0.5))
        prevx = xs[cur - 1] if cur > 0 else x0 - 40
        px = prevx + (xs[cur] - prevx) * p0
        ctx.new_path()
        ctx.move_to(x0 - 40, ly)
        ctx.line_to(px, ly)
        set_col(ctx, v.get("color", "yellow"))
        ctx.set_line_width(10)
        ctx.stroke()
        _glow_circle(ctx, px, ly, 46, v.get("color", "yellow"), 1.0)
        ctx.new_path()
        ctx.arc(px, ly, 14, 0, math.tau)
        set_col(ctx, "white")
        ctx.fill()
    for i, e in enumerate(ev):
        st = times[i]
        sc, al = pop(S.lt, st, 0.5)
        col = e.get("color", "yellow")
        active = (i == cur)
        # 점
        ctx.new_path()
        ctx.arc(xs[i], ly, 18 if active else 12, 0, math.tau)
        set_col(ctx, col if S.lt >= st else "line")
        ctx.fill()
        if al <= 0:
            text(ctx, e["date"], xs[i], ly + 52, size=34, fname="xbold", color="dim")
            continue
        up = (i % 2 == 0)
        cw = min(330, (x1 - x0) / max(1, n - 1) * 1.7)
        ch = 210 if e.get("sub") else 170
        cy = ly - 70 - ch / 2 if up else ly + 70 + ch / 2
        # 연결선
        ctx.new_path()
        ctx.move_to(xs[i], ly + (-18 if up else 18))
        ctx.line_to(xs[i], cy + (ch / 2 if up else -ch / 2))
        set_col(ctx, col, al)
        ctx.set_line_width(4)
        ctx.stroke()
        ctx.save()
        ctx.translate(xs[i], cy)
        ctx.scale(max(sc, 1e-3), max(sc, 1e-3))
        card(ctx, -cw / 2, -ch / 2, cw, ch, fill="card2" if active else "card", line=col, r=20, alpha=al,
             lw=5 if active else 3, glow=col if active else None)
        icon(ctx, e.get("icon", "news"), -cw / 2 + 58, -ch / 2 + 58, 0.62, al)
        text(ctx, e["date"], -cw / 2 + 110, -ch / 2 + 46, size=34, fname="title", color=col, alpha=al,
             anchor=(0, 0.5), align="left")
        text(ctx, e["label"], 0, -ch / 2 + 118, size=34, fname="xbold", color="white", alpha=al,
             max_w=int(cw - 26))
        if e.get("sub"):
            text(ctx, e["sub"], 0, -ch / 2 + 176, size=28, fname="xbold", color="grey", alpha=al,
                 max_w=int(cw - 26))
        ctx.restore()


# ---------------------------------------------------------------- ticker (시세판)

def v_ticker(ctx, S: SceneCtx):
    """rows: [{name, value, unit, decimals, chg (퍼센트), at, icon}] 전광판처럼 숫자가 굴러간다."""
    v = S.v
    top = S.area[1] + _header(ctx, S, v.get("title"), v.get("title_color", "yellow"))
    rows = v["rows"]
    n = len(rows)
    rh = min(132, (S.area[3] - top - 20 - (n - 1) * 16) / n)
    y = top + 10
    x0 = S.area[0] + 20
    wd = S.aw - 40
    for i, r in enumerate(rows):
        st = S.at(r.get("at", i))
        d = S.lt - st
        if d < 0:
            ctx.new_path()
            round_rect(ctx, x0, y, wd, rh, 18)
            set_col(ctx, "card", 0.35)
            ctx.fill()
            y += rh + 16
            continue
        p = ease_out_back(clamp(d / 0.45), 1.3)
        al = clamp(d / 0.2)
        chg = r.get("chg", 0.0)
        col = r.get("color") or ("red" if chg < 0 else ("green" if chg > 0 else "grey"))
        xx = x0 + (1 - p) * 300
        flash = 0.5 + 0.5 * math.sin(S.t * 8) if d < 1.5 else 0.0
        card(ctx, xx, y, wd, rh, fill="card2", line=col, r=18, alpha=al, lw=3 + 3 * flash,
             glow=col if d < 1.5 else None)
        # 왼쪽 색 띠
        ctx.new_path()
        round_rect(ctx, xx, y, 16, rh, 8)
        set_col(ctx, col, al)
        ctx.fill()
        ix = xx + 70
        if r.get("icon"):
            icon(ctx, r["icon"], ix, y + rh / 2, rh / 150, al)
            tx = xx + 140
        else:
            tx = xx + 44
        text(ctx, r["name"], tx, y + rh / 2, size=int(rh * 0.36), fname="xbold", color="white", alpha=al,
             anchor=(0, 0.5), align="left", max_w=int(wd * 0.42))
        # 굴러가는 숫자
        kk = ease_out_cubic(clamp(d / 1.1))
        val = r.get("from", r["value"] * (1 - chg / 100) if chg else r["value"]) + (r["value"] - r.get("from", r["value"] * (1 - chg / 100) if chg else r["value"])) * kk
        dec = r.get("decimals", 2 if isinstance(r["value"], float) and r["value"] % 1 else 0)
        text(ctx, fmt_num(val, dec) + r.get("unit", ""), xx + wd * 0.66, y + rh / 2, size=int(rh * 0.42),
             fname="title", color="white", alpha=al, anchor=(1, 0.5), align="right")
        # 등락 배지
        bw = wd * 0.26
        bx = xx + wd - bw - 18
        ctx.new_path()
        round_rect(ctx, bx, y + rh * 0.18, bw, rh * 0.64, 14)
        set_col(ctx, col, al)
        ctx.fill()
        arrow_ch = "▼" if chg < 0 else ("▲" if chg > 0 else "■")
        lab = r.get("chg_label") or f"{arrow_ch} {abs(chg) * kk:.2f}%"
        text(ctx, lab, bx + bw / 2, y + rh / 2, size=int(rh * 0.34), fname="black", color="ink", alpha=al)
        y += rh + 16


# ---------------------------------------------------------------- waterfall (폭포 차트)

def v_waterfall(ctx, S: SceneCtx):
    """start, steps:[{label, delta, at}], end_label. 변화량이 계단처럼 쌓인다."""
    v = S.v
    top = S.area[1] + _header(ctx, S, v.get("title"), v.get("title_color", "yellow"))
    steps = v["steps"]
    vals = [v["start"]]
    for st_ in steps:
        vals.append(vals[-1] + st_["delta"])
    lo = min(vals) - (max(vals) - min(vals)) * 0.25
    hi = max(vals) + (max(vals) - min(vals)) * 0.12
    base_y = S.area[3] - 80
    ch = base_y - top - (170 if v.get("note") else 90)
    n = len(steps) + 2
    slot = S.aw / n
    bw = min(170, slot * 0.6)

    def Y(val):
        return base_y - ch * (val - lo) / (hi - lo)

    ctx.new_path()
    ctx.move_to(S.area[0] + 10, base_y)
    ctx.line_to(S.area[2] - 10, base_y)
    set_col(ctx, "line")
    ctx.set_line_width(4)
    ctx.stroke()
    dec = v.get("decimals", 2)
    # 시작 막대
    st0 = S.at(v.get("start_at", 0))
    k0 = ease_out_cubic(prog(S.lt, st0, 0.7))
    x = S.area[0] + slot * 0.5
    if k0 > 0:
        h = (base_y - Y(vals[0])) * k0
        ctx.new_path()
        round_rect(ctx, x - bw / 2, base_y - h, bw, h, 12)
        set_col(ctx, "grey")
        ctx.fill()
        text(ctx, fmt_num(vals[0], dec), x, base_y - h - 40, size=46, fname="title", color="white", stroke=6, alpha=k0)
    text(ctx, v.get("start_label", "시작"), x, base_y + 40, size=32, fname="xbold", color="grey")
    for i, stp in enumerate(steps):
        x = S.area[0] + slot * (i + 1.5)
        st = S.at(stp.get("at", i + 1))
        k = ease_out_cubic(prog(S.lt, st, 0.8))
        a, b = vals[i], vals[i + 1]
        col = "red" if stp["delta"] < 0 else "green"
        # 연결선
        if S.lt >= st:
            ctx.new_path()
            ctx.move_to(x - slot + bw / 2, Y(a))
            ctx.line_to(x - bw / 2, Y(a))
            set_col(ctx, "dim")
            ctx.set_line_width(3)
            ctx.set_dash([10, 8])
            ctx.stroke()
            ctx.set_dash([])
        if k > 0:
            y_a = Y(a)
            y_b = y_a + (Y(b) - y_a) * k
            ctx.new_path()
            round_rect(ctx, x - bw / 2, min(y_a, y_b), bw, max(4, abs(y_b - y_a)), 10)
            set_col(ctx, col)
            ctx.fill()
            lab = ("+" if stp["delta"] > 0 else "") + fmt_num(stp["delta"] * k, dec)
            ly_ = (min(y_a, y_b) - 40) if stp["delta"] > 0 else (max(y_a, y_b) + 44)
            text(ctx, lab, x, ly_, size=46, fname="title", color=col, stroke=6, alpha=clamp(k * 2))
            if stp.get("pct"):
                text(ctx, stp["pct"], x, ly_ + (40 if stp["delta"] < 0 else -40), size=34, fname="black",
                     color="white", stroke=5, alpha=clamp(k * 2))
            if stp["delta"] < 0 and k < 1:
                _burst(ctx, x, y_b, k, "red", 8, 20, 90, seed=i)
        text(ctx, stp["label"], x, base_y + 40, size=32, fname="xbold", color="grey" if S.lt < st else "white")
    # 끝 막대
    x = S.area[0] + slot * (n - 0.5)
    ste = S.at(v.get("end_at", len(steps) + 1))
    ke = ease_out_cubic(prog(S.lt, ste, 0.7))
    if ke > 0:
        h = (base_y - Y(vals[-1])) * ke
        ctx.new_path()
        round_rect(ctx, x - bw / 2, base_y - h, bw, h, 12)
        set_col(ctx, v.get("end_color", "yellow"))
        ctx.fill()
        text(ctx, fmt_num(vals[-1], dec), x, base_y - h - 40, size=46, fname="title", color="yellow", stroke=6, alpha=ke)
    text(ctx, v.get("end_label", "끝"), x, base_y + 40, size=32, fname="xbold", color="grey")
    if v.get("note"):
        sc, al = pop(S.lt, S.at(v.get("note_at", len(steps) + 1)), 0.5)
        text(ctx, v["note"], S.cx, top + 30, size=50, fname="title", color="white", stroke=7, scale=sc, alpha=al,
             max_w=S.aw - 60)


# ---------------------------------------------------------------- worldflow (미국 → 한국)

def v_worldflow(ctx, S: SceneCtx):
    """left/right: {label, flag, time, note}, 아크 화살표 위로 신호가 이동한다."""
    v = S.v
    top = S.area[1] + _header(ctx, S, v.get("title"), v.get("title_color", "yellow"))
    L, R = v["left"], v["right"]
    cy = (top + S.area[3]) / 2 + 30
    lx, rx = S.area[0] + S.aw * 0.2, S.area[0] + S.aw * 0.8
    for side, x in ((L, lx), (R, rx)):
        st = S.at(side.get("at", 0))
        sc, al = pop(S.lt, st, 0.5)
        if al <= 0:
            continue
        cw, ch = S.aw * 0.32, 400
        ctx.save()
        ctx.translate(x, cy)
        ctx.scale(max(sc, 1e-3), max(sc, 1e-3))
        card(ctx, -cw / 2, -ch / 2, cw, ch, fill="card", line=side.get("color", "blue"), r=26, alpha=al, lw=4)
        icon(ctx, side.get("flag", "flag_us"), 0, -ch / 2 + 80, 1.0, al)
        text(ctx, side["label"], 0, -ch / 2 + 168, size=52, fname="title", color="white", alpha=al)
        # 시계
        icon(ctx, "clock", -cw / 2 + 80, 50, 0.7, al)
        text(ctx, side.get("time", ""), -cw / 2 + 140, 50, size=40, fname="title", color="yellow", alpha=al,
             anchor=(0, 0.5), align="left")
        if side.get("note"):
            text(ctx, side["note"], 0, ch / 2 - 64, size=32, fname="xbold", color="grey", alpha=al, max_w=int(cw - 30))
        ctx.restore()
    # 아크와 이동하는 신호
    st = S.at(v.get("flow_at", 1))
    k = ease_in_out(prog(S.lt, st, 1.2))
    if k > 0:
        x1, x2 = lx + S.aw * 0.17, rx - S.aw * 0.17
        hgt = 110
        ctx.new_path()
        steps = 40
        for j in range(int(steps * k) + 1):
            u = j / steps
            px = x1 + (x2 - x1) * u
            py = cy - 120 - hgt * math.sin(math.pi * u)
            (ctx.move_to if j == 0 else ctx.line_to)(px, py)
        set_col(ctx, v.get("color", "red"))
        ctx.set_line_width(9)
        ctx.set_dash([18, 12], -S.t * 60)
        ctx.stroke()
        ctx.set_dash([])
        u = k
        px = x1 + (x2 - x1) * u
        py = cy - 120 - hgt * math.sin(math.pi * u)
        _glow_circle(ctx, px, py, 60, v.get("color", "red"), 1)
        icon(ctx, v.get("signal_icon", "chart_down"), px, py, 0.55, 1)
        if v.get("flow_label"):
            text(ctx, v["flow_label"], (x1 + x2) / 2, cy - 120 - hgt - 40, size=36, fname="title",
                 color="white", stroke=6, alpha=clamp(k * 2), max_w=int(x2 - x1))
    if v.get("result"):
        sc, al = pop(S.lt, S.at(v.get("result_at", 2)), 0.5)
        text(ctx, v["result"], S.cx, S.area[3] - 30, size=46, fname="title", color="yellow", stroke=6,
             scale=sc, alpha=al, max_w=S.aw - 40)


# ---------------------------------------------------------------- breaker (서킷브레이커)

def v_breaker(ctx, S: SceneCtx):
    v = S.v
    top = S.area[1] + _header(ctx, S, v.get("title"), v.get("title_color", "yellow"))
    cx, cy = S.area[0] + min(S.aw * 0.22, 230), (top + S.area[3]) / 2 + 10
    st = S.at(v.get("trip_at", 1))
    d = S.lt - st
    # 차단기 몸체
    sc, al = pop(S.lt, S.at(v.get("at", 0)), 0.5)
    ctx.save()
    ctx.translate(cx, cy)
    ctx.scale(max(sc, 1e-3), max(sc, 1e-3))
    card(ctx, -150, -230, 300, 460, fill="#2B2F3A", line="grey", r=28, alpha=al, lw=5)
    ctx.new_path()
    round_rect(ctx, -60, -150, 120, 300, 20)
    set_col(ctx, "ink", al)
    ctx.fill()
    # 레버: 위(ON) → 아래(OFF)
    k = ease_out_back(clamp(d / 0.35), 2.0) if d >= 0 else 0.0
    ang = -0.9 + 1.8 * k
    ctx.save()
    ctx.rotate(ang)
    ctx.new_path()
    round_rect(ctx, -38, -130, 76, 130, 18)
    set_col(ctx, "red" if k > 0.5 else "green", al)
    ctx.fill_preserve()
    ctx.set_source_rgba(0.07, 0.07, 0.07, al)
    ctx.set_line_width(5)
    ctx.stroke()
    ctx.restore()
    text(ctx, "ON", 0, -190, size=40, fname="black", color="green" if k <= 0.5 else "dim", alpha=al)
    text(ctx, "OFF", 0, 196, size=40, fname="black", color="red" if k > 0.5 else "dim", alpha=al)
    ctx.restore()
    if 0 <= d < 0.8:
        _burst(ctx, cx, cy, d / 0.8, "yellow", 14, 60, 260, seed=3)
        _shockwave(ctx, cx, cy, d / 0.8, "yellow", 360)
    # 오른쪽: 타이머와 설명
    rx = (cx + 170 + S.area[2]) / 2
    cwid = S.area[2] - cx - 190
    if d >= 0:
        mins = v.get("minutes", 20)
        kk = clamp((d - 0.3) / v.get("count_dur", 3.0))
        rem = mins * 60 * (1 - kk)
        mm, ss = int(rem // 60), int(rem % 60)
        sc2, al2 = pop(S.lt, st + 0.2, 0.5)
        card(ctx, rx - 240, cy - 250, 480, 170, fill="card2", line="red", r=26, alpha=al2, lw=5, glow="red")
        text(ctx, f"{mm:02d}:{ss:02d}", rx, cy - 165, size=100, fname="title", color="red", stroke=6, scale=sc2, alpha=al2)
        text(ctx, v.get("stamp", "매매 일시 중단"), rx, cy - 20, size=56, fname="title", color="white", stroke=7,
             alpha=al2, rot=-4 * math.exp(-d * 2), max_w=int(cwid))
        if v.get("sub"):
            text(ctx, v["sub"], rx, cy + 50, size=34, fname="xbold", color="grey", alpha=al2, max_w=int(cwid))
    for i, nt in enumerate(v.get("notes", [])):
        sc3, al3 = pop(S.lt, S.at(nt.get("at", 2 + i)), 0.45)
        yy = cy + 130 + i * 100
        card(ctx, rx - cwid / 2, yy - 40, cwid, 80, fill="card", line=nt.get("color", "yellow"), r=16, alpha=al3 * 0.95, lw=3)
        text(ctx, nt["text"], rx, yy, size=32, fname="xbold", color=nt.get("color", "yellow"),
             scale=sc3, alpha=al3, max_w=int(cwid - 30))


# ---------------------------------------------------------------- donut

def v_donut(ctx, S: SceneCtx):
    """segments: [{label, value, color, at}], center, center_sub"""
    v = S.v
    top = S.area[1] + _header(ctx, S, v.get("title"), v.get("title_color", "yellow"))
    segs = v["segments"]
    total = sum(sg["value"] for sg in segs)
    cx, cy = S.area[0] + S.aw * 0.33, (top + S.area[3]) / 2 + 20
    R, r = min(250, (S.area[3] - top) * 0.42), None
    r = R * 0.58
    a0 = -math.pi / 2
    ctx.new_path()
    ctx.arc(cx, cy, R, 0, math.tau)
    ctx.arc_negative(cx, cy, r, math.tau, 0)
    set_col(ctx, "card", 0.9)
    ctx.fill()
    for i, sg in enumerate(segs):
        st = S.at(sg.get("at", i))
        k = ease_out_cubic(prog(S.lt, st, 0.9))
        sweep = math.tau * sg["value"] / total
        if k > 0:
            pop_r = 14 * math.exp(-max(0, S.lt - st) * 3) if S.lt >= st else 0
            mid = a0 + sweep / 2
            ox, oy = math.cos(mid) * pop_r, math.sin(mid) * pop_r
            ctx.new_path()
            ctx.arc(cx + ox, cy + oy, R, a0, a0 + sweep * k)
            ctx.arc_negative(cx + ox, cy + oy, r, a0 + sweep * k, a0)
            ctx.close_path()
            set_col(ctx, sg.get("color", "yellow"))
            ctx.fill_preserve()
            ctx.set_source_rgba(0.07, 0.07, 0.07, 1)
            ctx.set_line_width(4)
            ctx.stroke()
        a0 += sweep
    if v.get("center"):
        sc, al = pop(S.lt, S.at(v.get("center_at", 1)), 0.5)
        text(ctx, v["center"], cx, cy - 10, size=88, fname="title", color="white", stroke=6, scale=sc, alpha=al)
        if v.get("center_sub"):
            text(ctx, v["center_sub"], cx, cy + 62, size=32, fname="xbold", color="grey", alpha=al, max_w=int(r * 1.8))
    # 범례
    lx = S.area[0] + S.aw * 0.64
    ly = cy - len(segs) * 60
    for i, sg in enumerate(segs):
        st = S.at(sg.get("at", i))
        sc, al = pop(S.lt, st, 0.45)
        ctx.new_path()
        round_rect(ctx, lx, ly + i * 120 - 30, 60, 60, 12)
        set_col(ctx, sg.get("color", "yellow"), al)
        ctx.fill()
        text(ctx, sg["label"], lx + 84, ly + i * 120, size=40, fname="xbold", color="white", alpha=al,
             anchor=(0, 0.5), align="left", max_w=int(S.area[2] - lx - 100))
        if sg.get("sub"):
            text(ctx, sg["sub"], lx + 84, ly + i * 120 + 42, size=30, fname="xbold", color="grey", alpha=al,
                 anchor=(0, 0.5), align="left", max_w=int(S.area[2] - lx - 100))


# ---------------------------------------------------------------- balance (근거 vs 반론 저울)

def v_balance(ctx, S: SceneCtx):
    """left/right: {title, color, items:[{text, at}]}. 카드가 접시에 떨어지고 저울이 기운다."""
    v = S.v
    top = S.area[1] + _header(ctx, S, v.get("title"), v.get("title_color", "yellow"))
    L, R = v["left"], v["right"]
    cx = S.cx
    pivot_y = top + 120
    nl = sum(1 for it in L["items"] if S.lt >= S.at(it.get("at", 0)))
    nr = sum(1 for it in R["items"] if S.lt >= S.at(it.get("at", 0)))
    target = clamp((nr - nl) * 0.06, -0.14, 0.14)
    ang = target + 0.02 * math.sin(S.t * 2.2)
    if v.get("level_at") is not None and S.lt >= S.at(v["level_at"]):
        ang = 0.015 * math.sin(S.t * 2.2)
    arm = min(S.aw * 0.27, 420)
    # 기둥
    ctx.new_path()
    ctx.move_to(cx - 60, S.area[3] - 10)
    ctx.line_to(cx + 60, S.area[3] - 10)
    ctx.line_to(cx + 14, pivot_y)
    ctx.line_to(cx - 14, pivot_y)
    ctx.close_path()
    set_col(ctx, "line")
    ctx.fill()
    # 막대
    ctx.save()
    ctx.translate(cx, pivot_y)
    ctx.rotate(ang)
    ctx.new_path()
    round_rect(ctx, -arm, -10, arm * 2, 20, 10)
    set_col(ctx, "yellow")
    ctx.fill()
    ctx.restore()
    ctx.new_path()
    ctx.arc(cx, pivot_y, 22, 0, math.tau)
    set_col(ctx, "white")
    ctx.fill()
    for sgn, side in ((-1, L), (1, R)):
        ex = cx + sgn * arm * math.cos(ang)
        ey = pivot_y + sgn * arm * math.sin(ang)
        py = ey + 70
        # 줄
        ctx.new_path()
        ctx.move_to(ex, ey)
        ctx.line_to(ex - 150, py)
        ctx.move_to(ex, ey)
        ctx.line_to(ex + 150, py)
        set_col(ctx, "grey")
        ctx.set_line_width(3)
        ctx.stroke()
        ctx.new_path()
        round_rect(ctx, ex - 170, py, 340, 18, 9)
        set_col(ctx, side.get("color", "green"))
        ctx.fill()
        text(ctx, side["title"], ex, py + 58, size=44, fname="title", color=side.get("color", "green"), stroke=6)
        # 카드: 접시 아래에 쌓임 (위에서 떨어지는 애니메이션)
        cy0 = py + 110
        for j, it in enumerate(side["items"]):
            st = S.at(it.get("at", j))
            d = S.lt - st
            if d < 0:
                continue
            fall = ease_out_back(clamp(d / 0.45), 1.6)
            yy = cy0 + j * 92 - (1 - fall) * 260
            al = clamp(d / 0.15)
            cw = min(arm * 1.75, S.aw * 0.46, 500)
            card(ctx, ex - cw / 2, yy, cw, 80, fill="card2", line=side.get("color", "green"), r=16, alpha=al, lw=3)
            text(ctx, it["text"], ex, yy + 40, size=32, fname="xbold", color="white", alpha=al, max_w=int(cw - 24))
    if v.get("verdict"):
        sc, al = pop(S.lt, S.at(v.get("verdict_at", 3)), 0.5)
        card(ctx, cx - 300, top - 10, 600, 86, fill="ink", line="yellow", r=43, alpha=al * 0.95, lw=3)
        text(ctx, v["verdict"], cx, top + 33, size=40, fname="title", color="yellow", scale=sc, alpha=al, max_w=580)


# ---------------------------------------------------------------- stamps (정보 등급 도장)

def v_stamps(ctx, S: SceneCtx):
    """rows: [{text, stamp, color, at}] 각 줄 오른쪽에 도장이 쾅 찍힌다."""
    v = S.v
    top = S.area[1] + _header(ctx, S, v.get("title"), v.get("title_color", "yellow"))
    rows = v["rows"]
    n = len(rows)
    rh = min(140, (S.area[3] - top - 20 - (n - 1) * 20) / n)
    y = top + 10
    for i, r in enumerate(rows):
        st = S.at(r.get("at", i))
        d = S.lt - st
        al = clamp(d / 0.25)
        if al <= 0:
            y += rh + 20
            continue
        p = ease_out_cubic(clamp(d / 0.4))
        x0 = S.area[0] + 20 - (1 - p) * 120
        wd = S.aw - 40
        card(ctx, x0, y, wd, rh, fill="card", line="line", r=18, alpha=al, lw=2)
        text(ctx, r["text"], x0 + 36, y + rh / 2, size=int(rh * 0.32), fname="xbold", color="white", alpha=al,
             anchor=(0, 0.5), align="left", max_w=int(wd - 400))
        # 도장
        sd = d - 0.45
        if sd >= 0:
            k = clamp(sd / 0.18)
            sc = 2.4 - 1.4 * ease_out_cubic(k)
            col = r.get("color", "green")
            sx, sy = x0 + wd - 190, y + rh / 2
            ctx.save()
            ctx.translate(sx, sy)
            ctx.rotate(-0.12)
            ctx.scale(sc, sc)
            ctx.new_path()
            round_rect(ctx, -150, -rh * 0.36, 300, rh * 0.72, 14)
            set_col(ctx, col, 0.9 * k)
            ctx.set_line_width(7)
            ctx.stroke()
            ctx.restore()
            text(ctx, r["stamp"], sx, sy, size=int(rh * 0.34), fname="title", color=col, alpha=k, rot=-7, scale=sc)
            if sd < 0.5:
                _burst(ctx, sx, sy, sd / 0.5, col, 10, 80, 170, seed=i)
        y += rh + 20


# ---------------------------------------------------------------- bubble (거품)

def v_bubble(ctx, S: SceneCtx):
    """bubbles: [{label, sub, at, pop_at(선택), color}] 부풀다가(선택) 터진다. pop_at 이 없으면 계속 떠 있음."""
    v = S.v
    top = S.area[1] + _header(ctx, S, v.get("title"), v.get("title_color", "yellow"))
    bs = v["bubbles"]
    n = len(bs)
    cy = (top + S.area[3]) / 2 + 30
    for i, b in enumerate(bs):
        x = S.area[0] + S.aw * (i + 0.5) / n
        st = S.at(b.get("at", i))
        d = S.lt - st
        if d < 0:
            continue
        rmax = min(S.aw / n * 0.42, b.get("r", 190))
        grow = ease_out_elastic(clamp(d / 1.6)) if d < 1.6 else 1.0
        r = rmax * (0.25 + 0.75 * grow) * (1 + 0.04 * math.sin(S.t * 3 + i))
        yy = cy + math.sin(S.t * 1.3 + i) * 12
        pa = b.get("pop_at")
        popped = pa is not None and S.lt >= S.at(pa)
        if popped:
            pd = S.lt - S.at(pa)
            _burst(ctx, x, yy, clamp(pd / 0.6), "white", 18, r * 0.6, r * 1.4, seed=i)
            _shockwave(ctx, x, yy, clamp(pd / 0.7), "white", r * 1.4)
            text(ctx, b["label"], x, yy, size=44, fname="title", color="grey", stroke=6, alpha=clamp(1 - pd / 2) * 0.9 + 0.1)
            if b.get("sub"):
                text(ctx, b["sub"], x, yy + 54, size=30, fname="xbold", color="dim", max_w=int(rmax * 2))
            continue
        col = b.get("color", "blue")
        g = cairo.RadialGradient(x - r * 0.3, yy - r * 0.3, r * 0.1, x, yy, r)
        rr, gg, bb = _c(col)
        g.add_color_stop_rgba(0, 1, 1, 1, 0.35)
        g.add_color_stop_rgba(0.7, rr, gg, bb, 0.18)
        g.add_color_stop_rgba(1, rr, gg, bb, 0.45)
        ctx.new_path()
        ctx.arc(x, yy, r, 0, math.tau)
        ctx.set_source(g)
        ctx.fill_preserve()
        ctx.set_source_rgba(1, 1, 1, 0.85)
        ctx.set_line_width(5)
        ctx.stroke()
        ctx.new_path()
        ctx.arc(x - r * 0.38, yy - r * 0.38, r * 0.12, 0, math.tau)
        ctx.set_source_rgba(1, 1, 1, 0.75)
        ctx.fill()
        text(ctx, b["label"], x, yy - 6, size=int(min(64, r * 0.36)), fname="title", color="white", stroke=6,
             max_w=int(r * 1.7))
        if b.get("sub"):
            text(ctx, b["sub"], x, yy + r * 0.34, size=30, fname="xbold", color="grey", max_w=int(r * 1.7))


# ---------------------------------------------------------------- dominoes

def v_dominoes(ctx, S: SceneCtx):
    """items: [{text, at}] 도미노가 차례로 넘어진다."""
    v = S.v
    top = S.area[1] + _header(ctx, S, v.get("title"), v.get("title_color", "yellow"))
    items = v["items"]
    n = len(items)
    base_y = S.area[3] - 150
    gap = S.aw / (n + 0.5)
    dh, dw = min(300, (base_y - top) * 0.8), 70
    ctx.new_path()
    ctx.rectangle(S.area[0], base_y, S.aw, 8)
    set_col(ctx, "line")
    ctx.fill()
    for i, it in enumerate(items):
        x = S.area[0] + gap * (i + 0.6)
        st = S.at(it.get("at", i))
        d = S.lt - st
        al = clamp((d + 0.8) / 0.4) if d > -0.8 else 0.35
        fall = ease_in_out(clamp(d / 0.55)) if d >= 0 else 0.0
        ang = fall * 1.12
        col = it.get("color", "red" if fall > 0 else "card2")
        ctx.save()
        ctx.translate(x + dw / 2, base_y)
        ctx.rotate(ang)
        ctx.new_path()
        round_rect(ctx, -dw, -dh, dw, dh, 12)
        set_col(ctx, col if fall > 0 else "card2", max(al, 0.35))
        ctx.fill_preserve()
        ctx.set_source_rgba(1, 1, 1, 0.6 * max(al, 0.35))
        ctx.set_line_width(4)
        ctx.stroke()
        ctx.restore()
        if 0 < d < 0.8 and fall >= 0.99:
            pass
        # 설명 라벨 (도미노 위)
        sc, la = pop(S.lt, st, 0.45)
        if la > 0:
            text(ctx, it["text"], x + dw * 0.2, top + 40 + (i % 2) * 90, size=36, fname="xbold", color="white",
                 stroke=5, scale=sc, alpha=la, max_w=int(gap * 1.4))
            ctx.new_path()
            ctx.move_to(x + dw * 0.2, top + 72 + (i % 2) * 90)
            ctx.line_to(x - dw * 0.5, base_y - dh - 10)
            set_col(ctx, "dim", la)
            ctx.set_line_width(2)
            ctx.stroke()
        if 0.45 < d < 1.1:
            _burst(ctx, x + dw + dh * 0.85, base_y - 20, (d - 0.45) / 0.65, "yellow", 6, 10, 60, seed=i)


# ---------------------------------------------------------------- calendar

def v_calendar(ctx, S: SceneCtx):
    """days: [{d, wd, note, color, at, mark}] 날짜 카드가 뒤집히며 등장."""
    v = S.v
    top = S.area[1] + _header(ctx, S, v.get("title"), v.get("title_color", "yellow"))
    days = v["days"]
    n = len(days)
    cw = min(230, (S.aw - 40 - (n - 1) * 20) / n)
    chh = 300
    x = S.area[0] + (S.aw - (n * cw + (n - 1) * 20)) / 2
    y = (top + S.area[3]) / 2 - chh / 2 + 10
    for i, dd in enumerate(days):
        st = S.at(dd.get("at", i * 0.3))
        d = S.lt - st
        if d < 0:
            card(ctx, x, y, cw, chh, fill="card", line="line", r=20, alpha=0.3)
            x += cw + 20
            continue
        flip = clamp(d / 0.4)
        sy = abs(math.cos(math.pi * (1 - flip) / 2)) if flip < 1 else 1.0
        col = dd.get("color", "grey")
        ctx.save()
        ctx.translate(x + cw / 2, y + chh / 2)
        ctx.scale(1, max(sy, 0.02))
        card(ctx, -cw / 2, -chh / 2, cw, chh, fill="card2", line=col, r=20, lw=5 if dd.get("mark") else 3,
             glow=col if dd.get("mark") else None)
        ctx.new_path()
        round_rect(ctx, -cw / 2, -chh / 2, cw, 70, 20)
        set_col(ctx, col)
        ctx.fill()
        text(ctx, dd["wd"], 0, -chh / 2 + 36, size=40, fname="title", color="ink")
        text(ctx, dd["d"], 0, -10, size=96, fname="title", color="white")
        if dd.get("note"):
            text(ctx, dd["note"], 0, chh / 2 - 56, size=30, fname="xbold", color=col if col != "grey" else "white",
                 max_w=int(cw - 16))
        ctx.restore()
        if dd.get("stamp") and d > 0.5:
            k = clamp((d - 0.5) / 0.2)
            text(ctx, dd["stamp"], x + cw / 2, y + chh / 2, size=54, fname="title", color=dd.get("stamp_color", "red"),
                 stroke=6, rot=-14, scale=2.2 - 1.2 * ease_out_cubic(k), alpha=k)
        x += cw + 20
    if v.get("note"):
        sc, al = pop(S.lt, S.at(v.get("note_at", 2)), 0.5)
        text(ctx, v["note"], S.cx, S.area[3] - 40, size=46, fname="title", color="yellow", stroke=6, scale=sc,
             alpha=al, max_w=S.aw - 40)


# ---------------------------------------------------------------- datacenter

def v_datacenter(ctx, S: SceneCtx):
    """steps: [{text, at}] 데이터센터 → 전기·물 → 마을(요금·환경) → 정치 논의"""
    v = S.v
    top = S.area[1] + _header(ctx, S, v.get("title"), v.get("title_color", "yellow"))
    steps = v.get("steps", [])
    times = [S.at(sp.get("at", i)) for i, sp in enumerate(steps)]
    gy = S.area[3] - 190
    # 데이터센터
    dx = S.area[0] + S.aw * 0.2
    sc, al = pop(S.lt, times[0] if times else 0, 0.5)
    for j in range(3):
        icon(ctx, "server", dx - 110 + j * 110, gy - 60, 1.1 * sc, al)
    for j in range(3):  # 깜빡이는 LED 오버레이
        if al > 0 and int(S.t * 6 + j) % 2 == 0:
            ctx.new_path()
            ctx.arc(dx - 110 + j * 110 + 31, gy - 60 - 40, 6, 0, math.tau)
            set_col(ctx, "yellow", al)
            ctx.fill()
    text(ctx, "AI 데이터센터", dx, gy + 40, size=40, fname="title", color="white", stroke=6, alpha=al)
    # 마을
    hx = S.area[0] + S.aw * 0.8
    t2 = times[1] if len(times) > 1 else 1
    sc2, al2 = pop(S.lt, t2, 0.5)
    for j in range(3):
        icon(ctx, "house", hx - 110 + j * 110, gy - 40, 1.0 * sc2, al2)
    text(ctx, "지역 주민", hx, gy + 40, size=40, fname="title", color="white", stroke=6, alpha=al2)
    # 전기·물 흐름
    if S.lt >= t2:
        k = (S.lt - t2)
        for j in range(5):
            u = ((k * 0.6 + j / 5) % 1.0)
            px = hx - 200 - (hx - 200 - dx - 200) * u
            py = gy - 170 - 70 * math.sin(math.pi * u)
            icon(ctx, "bolt" if j % 2 == 0 else "water", px, py, 0.5, clamp(k * 2))
        text(ctx, "전기 · 물 사용", (dx + hx) / 2, gy - 290, size=40, fname="title", color="yellow", stroke=6,
             alpha=clamp(k * 2))
    # 요금·환경 걱정 말풍선
    if len(times) > 2 and S.lt >= times[2]:
        sc3, al3 = pop(S.lt, times[2], 0.5)
        cw3 = min(460, S.aw * 0.42)
        card(ctx, hx - cw3 / 2, gy + 80, cw3, 90, fill="card2", line="orange", r=30, alpha=al3, lw=4)
        text(ctx, steps[2]["text"], hx, gy + 125, size=34, fname="xbold", color="white", scale=sc3, alpha=al3, max_w=int(cw3 - 30))
    if len(times) > 3 and S.lt >= times[3]:
        sc4, al4 = pop(S.lt, times[3], 0.5)
        icon(ctx, "vote", S.cx - 260, top + 70, 0.9 * sc4, al4)
        text(ctx, steps[3]["text"], S.cx + 40, top + 70, size=42, fname="title", color="white", stroke=6, scale=sc4,
             alpha=al4, max_w=int(S.aw * 0.55))
    if len(times) > 4 and S.lt >= times[4]:
        sc5, al5 = pop(S.lt, times[4], 0.5)
        text(ctx, steps[4]["text"], S.cx, top + 170, size=40, fname="title", color="yellow", stroke=6, scale=sc5,
             alpha=al5, max_w=S.aw - 40)


# ---------------------------------------------------------------- icongrid (아이콘 카드 격자)

def v_icongrid(ctx, S: SceneCtx):
    """items: [{icon, text, sub, color, at}] 2~6개 아이콘 카드가 튀어나온다."""
    v = S.v
    top = S.area[1] + _header(ctx, S, v.get("title"), v.get("title_color", "yellow"))
    items = v["items"]
    n = len(items)
    cols = v.get("cols", n if n <= 3 else (2 if n == 4 else 3))
    while cols > 1 and (S.aw - 40) / cols < 300:
        cols -= 1
    if n == 4 and cols == 3:
        cols = 2
    rows = math.ceil(n / cols)
    gx, gy = 26, 26
    cw = (S.aw - 40 - (cols - 1) * gx) / cols
    chh = min(330, (S.area[3] - top - 20 - (rows - 1) * gy) / rows)
    oy = top + ((S.area[3] - top) - (rows * chh + (rows - 1) * gy)) / 2
    times = [S.at(it.get("at", i)) for i, it in enumerate(items)]
    for i, it in enumerate(items):
        r, c = divmod(i, cols)
        x = S.area[0] + 20 + c * (cw + gx)
        y = oy + r * (chh + gy)
        sc, al = pop(S.lt, times[i], 0.5)
        if al <= 0:
            card(ctx, x, y, cw, chh, fill="card", line="line", r=22, alpha=0.25)
            continue
        active = S.lt >= times[i] and (i == n - 1 or S.lt < times[i + 1])
        col = it.get("color", "yellow")
        ctx.save()
        ctx.translate(x + cw / 2, y + chh / 2)
        ctx.scale(max(sc, 1e-3), max(sc, 1e-3))
        card(ctx, -cw / 2, -chh / 2, cw, chh, fill="card2" if active else "card", line=col, r=22, alpha=al,
             lw=5 if active else 3, glow=col if active else None)
        bob = math.sin(S.t * 2.5 + i) * 5 if active else 0
        icon(ctx, it.get("icon", "news"), 0, -chh / 2 + chh * 0.3 + bob, chh / 300, al, it.get("icon_color"))
        text(ctx, it["text"], 0, chh * 0.12, size=int(min(40, chh * 0.14, cw * 0.12)), fname="title", color="white", alpha=al,
             max_w=int(cw - 24))
        if it.get("sub"):
            text(ctx, it["sub"], 0, chh * 0.32, size=int(min(30, chh * 0.1, cw * 0.095)), fname="xbold", color="grey", alpha=al,
                 max_w=int(cw - 24))
        ctx.restore()


VISUALS2 = {
    "kinetic": v_kinetic, "timeline": v_timeline, "ticker": v_ticker, "waterfall": v_waterfall,
    "worldflow": v_worldflow, "breaker": v_breaker, "donut": v_donut, "balance": v_balance,
    "stamps": v_stamps, "bubble": v_bubble, "dominoes": v_dominoes, "calendar": v_calendar,
    "datacenter": v_datacenter, "icongrid": v_icongrid,
}


def events2(scene, S):
    """새 장면들의 효과음 이벤트 (장면 내부 시간, 종류)"""
    v = scene["visual"]
    ty = v["type"]
    ev = []

    def add(a, kind="pop"):
        tt = S.at(a)
        if tt >= 0:
            ev.append((tt, kind))

    if ty == "kinetic":
        for ln in v["lines"]:
            add(ln.get("at", 0), "boom" if ln.get("slam") else "pop")
    elif ty == "timeline":
        for i, e in enumerate(v["events"]):
            add(e.get("at", i), "whoosh" if i == 0 else "pop")
    elif ty in ("ticker", "stamps"):
        for i, r in enumerate(v["rows"]):
            add(r.get("at", i), "tick")
            if ty == "stamps":
                tt = S.at(r.get("at", i)) + 0.45
                ev.append((tt, "boom"))
    elif ty == "waterfall":
        add(v.get("start_at", 0), "pop")
        for i, stp in enumerate(v["steps"]):
            add(stp.get("at", i + 1), "boom" if stp["delta"] < 0 else "ding")
    elif ty == "worldflow":
        add(v["left"].get("at", 0), "pop")
        add(v["right"].get("at", 0), "pop")
        add(v.get("flow_at", 1), "whoosh")
    elif ty == "breaker":
        add(v.get("trip_at", 1), "boom")
    elif ty == "donut":
        for i, sg in enumerate(v["segments"]):
            add(sg.get("at", i), "whoosh")
    elif ty == "balance":
        for side in ("left", "right"):
            for j, it in enumerate(v[side]["items"]):
                add(it.get("at", j), "pop")
    elif ty == "bubble":
        for i, b in enumerate(v["bubbles"]):
            add(b.get("at", i), "pop")
            if b.get("pop_at") is not None:
                add(b["pop_at"], "boom")
    elif ty == "dominoes":
        for i, it in enumerate(v["items"]):
            add(it.get("at", i), "tick")
    elif ty == "calendar":
        for i, dd in enumerate(v["days"]):
            add(dd.get("at", i * 0.3), "tick")
    elif ty == "datacenter":
        for i, sp in enumerate(v.get("steps", [])):
            add(sp.get("at", i), "pop")
    elif ty == "icongrid":
        for i, it in enumerate(v["items"]):
            add(it.get("at", i), "pop")
    return ev
