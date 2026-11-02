"""부의비상사태 911 대표 캐릭터 (벡터 퍼펫).

원본 이미지(assets/brand/mascot_original.jpg)를 기준으로 비율을 맞춘 벡터 캐릭터입니다.
모든 부위를 코드로 그리기 때문에 입 모양(립싱크), 눈 깜빡임, 팔 동작, 걷기,
표정 변화를 프레임마다 다르게 줄 수 있습니다.

좌표계: 발바닥 중앙이 (0, 0), 위쪽이 음수. 캐릭터 전체 높이는 약 660 단위입니다.
"""
from __future__ import annotations

import math
from dataclasses import dataclass, field

import cairo

INK = (0.07, 0.07, 0.08)
WHITE = (1.0, 1.0, 1.0)
SHADE = (0.86, 0.87, 0.89)
HAT = (0.12, 0.12, 0.13)
HAT_HI = (0.26, 0.26, 0.28)
BAND = (0.36, 0.36, 0.38)
CASE = (0.50, 0.24, 0.10)
CASE_DARK = (0.36, 0.16, 0.06)
CASE_HI = (0.62, 0.32, 0.14)
BRASS = (0.86, 0.66, 0.24)
SCREEN = (0.32, 0.90, 0.48)
SCREEN_DARK = (0.18, 0.62, 0.30)

OW = 6.0  # 외곽선 두께(로컬 단위)

# 기본 팔 각도 (0 = 아래로 늘어뜨림, +90 = 화면 오른쪽, 180 = 위)
ARM_L_LEN = (108.0, 90.0)
ARM_R_LEN = (92.0, 90.0)

ARM_POSES = {
    # 오른팔(화면 오른쪽) : 태블릿을 든 팔
    "hold": (24.0, 92.0),       # 가슴 앞에 태블릿
    "present": (95.0, 128.0),   # 태블릿을 오른쪽 콘텐츠 쪽으로 내밂
    "up": (150.0, 172.0),       # 태블릿 번쩍
    "look": (18.0, 150.0),      # 태블릿을 얼굴 가까이
    "down": (12.0, 20.0),       # 늘어뜨림
    # 왼팔(화면 왼쪽) : 서류가방을 든 팔
    "carry": (-20.0, -14.0),
    "lift": (-60.0, -10.0),
    "panic": (-150.0, -170.0),
    "swing_f": (12.0, 4.0),
    "swing_b": (-36.0, -40.0),
}

SCREEN_ICONS = ("logo", "up", "down", "won", "alert", "percent", "none")


@dataclass
class Pose:
    talk: float = 0.0          # 0~1 입 벌림
    blink: float = 0.0         # 0~1 눈 감김
    emotion: str = "neutral"   # neutral, happy, surprised, worried, angry, smug, shock
    arm_r: tuple = ARM_POSES["hold"]
    arm_l: tuple = ARM_POSES["carry"]
    head_tilt: float = 0.0     # 도(degree)
    lean: float = 0.0          # 몸 전체 기울기(도)
    bob: float = 0.0           # 위아래 출렁임(로컬 단위)
    walk: float = -1.0         # <0 이면 서 있음, 0~1 걷기 위상
    hat_lift: float = 0.0      # 0~1 모자 들어 인사
    look: tuple = (0.0, 0.0)   # 눈동자 이동
    screen: str = "logo"       # 태블릿 화면 아이콘
    glow: float = 1.0          # 태블릿 발광 세기
    squash: float = 0.0        # +면 납작, -면 길쭉 (착지/점프 연출)
    extras: dict = field(default_factory=dict)


# ---------------------------------------------------------------- helpers

def _dir(angle_deg: float):
    a = math.radians(angle_deg)
    return math.sin(a), math.cos(a)


def arm_points(shoulder, angles, lengths):
    a1, a2 = angles
    d1 = _dir(a1)
    elbow = (shoulder[0] + d1[0] * lengths[0], shoulder[1] + d1[1] * lengths[0])
    d2 = _dir(a2)
    hand = (elbow[0] + d2[0] * lengths[1], elbow[1] + d2[1] * lengths[1])
    return shoulder, elbow, hand


def _ellipse(ctx, cx, cy, rx, ry, angle=0.0):
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(math.radians(angle))
    ctx.scale(rx, ry)
    ctx.arc(0, 0, 1, 0, 2 * math.pi)
    ctx.restore()


def _circle(ctx, cx, cy, r):
    ctx.new_sub_path()
    ctx.arc(cx, cy, r, 0, 2 * math.pi)


def _round_rect(ctx, x, y, w, h, r):
    r = min(r, w / 2, h / 2)
    ctx.new_sub_path()
    ctx.arc(x + w - r, y + r, r, -math.pi / 2, 0)
    ctx.arc(x + w - r, y + h - r, r, 0, math.pi / 2)
    ctx.arc(x + r, y + h - r, r, math.pi / 2, math.pi)
    ctx.arc(x + r, y + r, r, math.pi, 1.5 * math.pi)
    ctx.close_path()


class Pen:
    """normal 패스와 sticker(흰 테두리) 패스를 같은 코드로 그리기 위한 도우미."""

    def __init__(self, ctx, sticker: float = 0.0, sticker_rgb=WHITE):
        self.ctx = ctx
        self.sticker = sticker
        self.sticker_rgb = sticker_rgb

    def shape(self, build, fill=WHITE, stroke=INK, width=OW, fill_alpha=1.0):
        ctx = self.ctx
        ctx.new_path()
        build(ctx)
        if self.sticker:
            ctx.set_source_rgb(*self.sticker_rgb)
            ctx.set_line_width(width + 2 * self.sticker)
            ctx.set_line_join(cairo.LINE_JOIN_ROUND)
            ctx.stroke_preserve()
            ctx.fill()
            return
        if fill is not None:
            ctx.set_source_rgba(*fill, fill_alpha)
            ctx.fill_preserve()
        if stroke is not None and width > 0:
            ctx.set_source_rgb(*stroke)
            ctx.set_line_width(width)
            ctx.set_line_join(cairo.LINE_JOIN_ROUND)
            ctx.set_line_cap(cairo.LINE_CAP_ROUND)
            ctx.stroke()
        else:
            ctx.new_path()

    def tube(self, pts, width, fill=WHITE, stroke=INK, ow=OW):
        ctx = self.ctx

        def build():
            ctx.new_path()
            ctx.move_to(*pts[0])
            if len(pts) == 3:
                ctx.curve_to(*pts[1], *pts[1], *pts[2])
            else:
                for p in pts[1:]:
                    ctx.line_to(*p)

        ctx.set_line_cap(cairo.LINE_CAP_ROUND)
        ctx.set_line_join(cairo.LINE_JOIN_ROUND)
        if self.sticker:
            build()
            ctx.set_source_rgb(*self.sticker_rgb)
            ctx.set_line_width(width + 2 * ow + 2 * self.sticker)
            ctx.stroke()
            return
        build()
        ctx.set_source_rgb(*stroke)
        ctx.set_line_width(width + 2 * ow)
        ctx.stroke()
        build()
        ctx.set_source_rgb(*fill)
        ctx.set_line_width(width)
        ctx.stroke()

    def detail(self, fn):
        if not self.sticker:
            fn(self.ctx)


# ---------------------------------------------------------------- parts

def _legs(pen: Pen, pose: Pose):
    ctx = pen.ctx
    if pose.walk >= 0:
        ph = pose.walk * 2 * math.pi
        swing = math.sin(ph) * 20
    else:
        swing = 0.0
    hipL, hipR = (-16.0, -212.0), (26.0, -212.0)
    L = 200.0
    dl = _dir(-6 + swing)
    dr = _dir(-2 - swing)
    footL = (hipL[0] + dl[0] * L, hipL[1] + dl[1] * L)
    footR = (hipR[0] + dr[0] * L, hipR[1] + dr[1] * L)
    lift_l = max(0.0, math.sin(pose.walk * 2 * math.pi)) * 14 if pose.walk >= 0 else 0
    lift_r = max(0.0, -math.sin(pose.walk * 2 * math.pi)) * 14 if pose.walk >= 0 else 0
    footL = (footL[0], footL[1] - lift_l)
    footR = (footR[0], footR[1] - lift_r)
    return (hipL, footL), (hipR, footR)


def _torso_path(ctx):
    ctx.move_to(-26, -438)
    ctx.curve_to(-44, -420, -50, -398, -50, -370)
    ctx.curve_to(-50, -320, -46, -260, -42, -215)
    ctx.curve_to(-40, -200, -36, -190, -30, -186)
    ctx.line_to(46, -186)
    ctx.curve_to(52, -200, 54, -230, 55, -260)
    ctx.curve_to(57, -320, 58, -380, 52, -405)
    ctx.curve_to(46, -425, 36, -436, 26, -440)
    ctx.close_path()


def _body_group(pen: Pen, pose: Pose):
    """다리 + 몸통을 하나의 실루엣처럼(내부 이음선 없이) 그린다."""
    ctx = pen.ctx
    (hipL, footL), (hipR, footR) = _legs(pen, pose)
    leg_w = 40.0

    def legs_path(width, rgb):
        ctx.set_line_cap(cairo.LINE_CAP_ROUND)
        for hip, foot in ((hipL, footL), (hipR, footR)):
            ctx.new_path()
            ctx.move_to(*hip)
            ctx.line_to(*foot)
            ctx.set_source_rgb(*rgb)
            ctx.set_line_width(width)
            ctx.stroke()
        # 발(신발 느낌의 타원)
        for foot, sgn in ((footL, -1), (footR, 1)):
            ctx.new_path()
            _ellipse(ctx, foot[0] + sgn * 10, foot[1] + 4, 30 + (width - leg_w) / 2,
                     17 + (width - leg_w) / 2)
            ctx.set_source_rgb(*rgb)
            ctx.fill()

    if pen.sticker:
        legs_path(leg_w + 2 * OW + 2 * pen.sticker, pen.sticker_rgb)
        ctx.new_path()
        _torso_path(ctx)
        ctx.set_source_rgb(*pen.sticker_rgb)
        ctx.set_line_width(2 * OW + 2 * pen.sticker)
        ctx.set_line_join(cairo.LINE_JOIN_ROUND)
        ctx.stroke_preserve()
        ctx.fill()
        return

    # 1) 외곽선 패스
    legs_path(leg_w + 2 * OW, INK)
    ctx.new_path()
    _torso_path(ctx)
    ctx.set_source_rgb(*INK)
    ctx.set_line_width(2 * OW)
    ctx.set_line_join(cairo.LINE_JOIN_ROUND)
    ctx.stroke_preserve()
    ctx.fill()
    # 2) 채움 패스
    legs_path(leg_w, WHITE)
    ctx.new_path()
    _torso_path(ctx)
    ctx.set_source_rgb(*WHITE)
    ctx.fill()
    # 3) 음영 (왼쪽 가장자리)
    ctx.save()
    ctx.new_path()
    _torso_path(ctx)
    ctx.clip()
    ctx.new_path()
    ctx.move_to(-60, -440)
    ctx.curve_to(-30, -380, -30, -260, -24, -180)
    ctx.line_to(-70, -180)
    ctx.close_path()
    ctx.set_source_rgb(*SHADE)
    ctx.fill()
    ctx.restore()
    # 다리 음영
    ctx.set_line_cap(cairo.LINE_CAP_ROUND)
    for hip, foot in ((hipL, footL), (hipR, footR)):
        ctx.new_path()
        ctx.move_to(hip[0] - 13, hip[1] + 30)
        ctx.line_to(foot[0] - 13, foot[1] - 14)
        ctx.set_source_rgba(*SHADE, 0.9)
        ctx.set_line_width(7)
        ctx.stroke()


def _briefcase(pen: Pen, hand):
    ctx = pen.ctx
    hx, hy = hand
    x0, y0 = hx - 70, hy + 22
    w, h = 136, 150

    # 손잡이
    def handle(c):
        c.move_to(hx - 22, y0 + 2)
        c.curve_to(hx - 22, hy - 16, hx + 22, hy - 16, hx + 22, y0 + 2)

    if pen.sticker:
        ctx.new_path()
        handle(ctx)
        ctx.set_source_rgb(*pen.sticker_rgb)
        ctx.set_line_width(10 + 2 * OW + 2 * pen.sticker)
        ctx.stroke()
    else:
        ctx.new_path()
        handle(ctx)
        ctx.set_source_rgb(*INK)
        ctx.set_line_width(10 + 2 * 3.5)
        ctx.stroke()
        ctx.new_path()
        handle(ctx)
        ctx.set_source_rgb(*CASE_DARK)
        ctx.set_line_width(10)
        ctx.stroke()
    # 옆면(두께감)
    pen.shape(lambda c: _round_rect(c, x0 + 12, y0 + 4, w, h - 4, 14), fill=CASE_DARK)
    # 본체
    pen.shape(lambda c: _round_rect(c, x0, y0, w, h, 14), fill=CASE)

    def deco(c):
        # 하이라이트
        c.new_path()
        _round_rect(c, x0 + 10, y0 + 10, 16, h - 24, 7)
        c.set_source_rgba(*CASE_HI, 0.9)
        c.fill()
        # 덮개
        c.new_path()
        c.move_to(x0 + 4, y0 + 52)
        c.curve_to(x0 + w * 0.3, y0 + 62, x0 + w * 0.7, y0 + 62, x0 + w - 4, y0 + 52)
        c.set_source_rgb(*INK)
        c.set_line_width(4)
        c.stroke()
        # 잠금쇠 2개
        for cx in (x0 + 36, x0 + w - 36):
            c.new_path()
            _round_rect(c, cx - 9, y0 + 50, 18, 30, 5)
            c.set_source_rgb(*BRASS)
            c.fill_preserve()
            c.set_source_rgb(*INK)
            c.set_line_width(3.5)
            c.stroke()
        # 스티치
        c.new_path()
        c.set_dash([8, 7])
        _round_rect(c, x0 + 9, y0 + 9, w - 18, h - 18, 9)
        c.set_source_rgba(0.25, 0.1, 0.03, 0.6)
        c.set_line_width(2.5)
        c.stroke()
        c.set_dash([])

    pen.detail(deco)


def _screen_icon(ctx, icon, w, h, t):
    ctx.set_line_cap(cairo.LINE_CAP_ROUND)
    ctx.set_line_join(cairo.LINE_JOIN_ROUND)
    dark = (0.06, 0.35, 0.16)
    if icon == "logo":
        ctx.new_path()
        ctx.arc(0, 0, w * 0.18, math.radians(-60), math.radians(240))
        ctx.set_source_rgb(*dark)
        ctx.set_line_width(5)
        ctx.stroke()
        _circle(ctx, w * 0.02, -h * 0.17, 4)
        ctx.fill()
    elif icon in ("up", "down"):
        pts = [(-0.32, 0.22), (-0.12, 0.05), (0.04, 0.14), (0.3, -0.22)]
        if icon == "down":
            pts = [(x, -y) for x, y in pts]
        col = (0.85, 0.12, 0.12) if icon == "up" else (0.12, 0.25, 0.85)
        ctx.new_path()
        ctx.move_to(pts[0][0] * w, pts[0][1] * h)
        for x, y in pts[1:]:
            ctx.line_to(x * w, y * h)
        ctx.set_source_rgb(*col)
        ctx.set_line_width(7)
        ctx.stroke()
        ex, ey = pts[-1][0] * w, pts[-1][1] * h
        sgn = -1 if icon == "up" else 1
        ctx.new_path()
        ctx.move_to(ex, ey)
        ctx.line_to(ex - 16, ey - sgn * -2 + (6 if icon == "up" else -6))
        ctx.move_to(ex, ey)
        ctx.line_to(ex - 2, ey + (16 if icon == "up" else -16))
        ctx.stroke()
    elif icon == "won":
        ctx.set_source_rgb(*dark)
        ctx.set_line_width(5.5)
        ctx.new_path()
        ctx.move_to(-w * 0.2, -h * 0.2)
        ctx.line_to(-w * 0.1, h * 0.2)
        ctx.line_to(0, -h * 0.05)
        ctx.line_to(w * 0.1, h * 0.2)
        ctx.line_to(w * 0.2, -h * 0.2)
        ctx.move_to(-w * 0.27, -h * 0.02)
        ctx.line_to(w * 0.27, -h * 0.02)
        ctx.move_to(-w * 0.27, h * 0.07)
        ctx.line_to(w * 0.27, h * 0.07)
        ctx.stroke()
    elif icon == "alert":
        on = (math.sin(t * 8) > -0.3)
        ctx.set_source_rgb(0.85, 0.1, 0.1) if on else ctx.set_source_rgb(*dark)
        ctx.new_path()
        ctx.move_to(0, -h * 0.25)
        ctx.line_to(w * 0.26, h * 0.2)
        ctx.line_to(-w * 0.26, h * 0.2)
        ctx.close_path()
        ctx.fill()
        ctx.set_source_rgb(1, 1, 1)
        ctx.set_line_width(5)
        ctx.new_path()
        ctx.move_to(0, -h * 0.1)
        ctx.line_to(0, h * 0.06)
        ctx.stroke()
        _circle(ctx, 0, h * 0.13, 3)
        ctx.fill()
    elif icon == "percent":
        ctx.set_source_rgb(*dark)
        ctx.set_line_width(5)
        ctx.new_path()
        ctx.move_to(w * 0.2, -h * 0.2)
        ctx.line_to(-w * 0.2, h * 0.2)
        ctx.stroke()
        _circle(ctx, -w * 0.14, -h * 0.13, 8)
        ctx.stroke()
        _circle(ctx, w * 0.14, h * 0.13, 8)
        ctx.stroke()


def _tablet(pen: Pen, hand, angle_deg, pose: Pose, t: float):
    ctx = pen.ctx
    w, h = 92.0, 118.0
    cx = hand[0] - 22
    cy = hand[1] - 22
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(math.radians(angle_deg))
    if not pen.sticker and pose.glow > 0:
        g = pose.glow * (0.85 + 0.15 * math.sin(t * 3.0))
        pat = cairo.RadialGradient(0, 0, 10, 0, 0, 120)
        pat.add_color_stop_rgba(0, 0.4, 1.0, 0.5, 0.55 * g)
        pat.add_color_stop_rgba(0.5, 0.35, 1.0, 0.45, 0.22 * g)
        pat.add_color_stop_rgba(1, 0.3, 1.0, 0.4, 0.0)
        ctx.set_source(pat)
        ctx.new_path()
        _circle(ctx, 0, 0, 120)
        ctx.fill()
    pen.shape(lambda c: _round_rect(c, -w / 2, -h / 2, w, h, 10), fill=(0.16, 0.16, 0.17), width=4.5)

    def scr(c):
        c.new_path()
        _round_rect(c, -w / 2 + 7, -h / 2 + 7, w - 14, h - 14, 6)
        c.set_source_rgb(*SCREEN)
        c.fill()
        c.save()
        _screen_icon(c, pose.screen, w - 14, h - 14, t)
        c.restore()
        # 반사광
        c.new_path()
        c.move_to(-w / 2 + 12, -h / 2 + 30)
        c.line_to(-w / 2 + 30, -h / 2 + 12)
        c.set_source_rgba(1, 1, 1, 0.45)
        c.set_line_width(5)
        c.stroke()

    pen.detail(scr)
    ctx.restore()


def _head(pen: Pose, pose: Pose, t: float):
    ctx = pen.ctx
    hx, hy, r = 0.0, -507.0, 88.0
    ctx.save()
    ctx.translate(hx, hy + 80)
    ctx.rotate(math.radians(pose.head_tilt))
    ctx.translate(-hx, -(hy + 80))

    # 머리
    if pen.sticker:
        pen.shape(lambda c: _circle(c, hx, hy, r))
    else:
        ctx.new_path()
        _circle(ctx, hx, hy, r)
        ctx.set_source_rgb(*SHADE)
        ctx.fill()
        ctx.save()
        ctx.new_path()
        _circle(ctx, hx, hy, r)
        ctx.clip()
        ctx.new_path()
        _circle(ctx, hx + 14, hy - 6, r - 4)
        ctx.set_source_rgb(*WHITE)
        ctx.fill()
        ctx.restore()
        ctx.new_path()
        _circle(ctx, hx, hy, r)
        ctx.set_source_rgb(*INK)
        ctx.set_line_width(OW)
        ctx.stroke()

    pen.detail(lambda c: _face(c, pose, t))
    _hat(pen, pose, t)
    ctx.restore()


def _face(ctx, pose: Pose, t: float):
    emo = pose.emotion
    lx, rx_, ey = -1.0, 65.0, -512.0
    ctx.set_line_cap(cairo.LINE_CAP_ROUND)
    ctx.set_line_join(cairo.LINE_JOIN_ROUND)

    # 볼터치
    if emo in ("happy", "smug"):
        for bx in (-6, 74):
            ctx.new_path()
            _ellipse(ctx, bx, -478, 14, 7)
            ctx.set_source_rgba(1.0, 0.55, 0.6, 0.45)
            ctx.fill()

    # 쇼크 세로줄
    if emo == "shock":
        ctx.set_source_rgba(0.35, 0.45, 0.95, 0.75)
        ctx.set_line_width(4)
        for i, x in enumerate(range(-40, 90, 18)):
            ctx.new_path()
            ctx.move_to(x, -560)
            ctx.line_to(x, -536 + (i % 2) * 6)
            ctx.stroke()

    # 눈
    look_x, look_y = pose.look
    eye_r = {"surprised": 7.5, "shock": 3.5}.get(emo, 5.5)
    for ex, rr in ((lx + 3, 24.0), (rx_ + 2, 22.0)):
        cx, cy = ex + look_x * 6, ey + 3 + look_y * 5
        ctx.set_source_rgb(*INK)
        if pose.blink > 0.5:
            ctx.new_path()
            ctx.move_to(cx - 8, cy)
            ctx.line_to(cx + 8, cy)
            ctx.set_line_width(4)
            ctx.stroke()
        elif emo == "smug":
            ctx.new_path()
            ctx.move_to(cx - 9, cy - 1)
            ctx.line_to(cx + 9, cy - 1)
            ctx.set_line_width(4)
            ctx.stroke()
            ctx.new_path()
            ctx.arc(cx, cy - 1, 6, 0, math.pi)
            ctx.fill()
        elif emo == "happy" and pose.talk < 0.05:
            ctx.new_path()
            ctx.arc(cx, cy + 4, 8, math.pi * 1.15, math.pi * 1.85)
            ctx.set_line_width(4)
            ctx.stroke()
        else:
            ctx.new_path()
            _circle(ctx, cx, cy, eye_r)
            ctx.fill()
            if emo == "surprised":
                ctx.new_path()
                _circle(ctx, cx - 2.5, cy - 2.5, 2.2)
                ctx.set_source_rgb(1, 1, 1)
                ctx.fill()

    # 안경
    ctx.set_source_rgb(*INK)
    ctx.set_line_width(4.5)
    for ex, rr in ((lx, 24.0), (rx_, 22.0)):
        ctx.new_path()
        _circle(ctx, ex, ey, rr)
        ctx.stroke()
        ctx.new_path()
        ctx.arc(ex, ey, rr - 6, math.radians(200), math.radians(250))
        ctx.set_source_rgba(0.7, 0.85, 1.0, 0.6)
        ctx.set_line_width(3)
        ctx.stroke()
        ctx.set_source_rgb(*INK)
        ctx.set_line_width(4.5)
    ctx.new_path()
    ctx.move_to(lx + 23, ey - 4)
    ctx.curve_to(lx + 30, ey - 12, rx_ - 28, ey - 12, rx_ - 21, ey - 4)
    ctx.stroke()
    ctx.new_path()
    ctx.move_to(lx - 23, ey - 6)
    ctx.line_to(-84, ey - 14)
    ctx.stroke()

    # 눈썹
    brows = {
        "surprised": ((-14, -552, 14, -556), (52, -556, 80, -552)),
        "worried": ((-14, -540, 14, -550), (50, -550, 78, -540)),
        "angry": ((-14, -552, 16, -541), (50, -541, 80, -552)),
        "shock": ((-14, -552, 14, -558), (52, -558, 80, -552)),
        "smug": ((-12, -545, 14, -547), (52, -550, 78, -544)),
    }.get(emo)
    if brows:
        ctx.set_line_width(5)
        for x1, y1, x2, y2 in brows:
            ctx.new_path()
            ctx.move_to(x1, y1)
            ctx.line_to(x2, y2)
            ctx.stroke()

    # 입
    mx, my = 30.0, -474.0
    talk = max(0.0, min(1.0, pose.talk))
    if emo in ("surprised", "shock") and talk < 0.15:
        talk = 0.35 if emo == "surprised" else 0.25
    if talk > 0.06:
        mw = 14 + 6 * talk if emo not in ("surprised", "shock") else 9 + 4 * talk
        mh = 3 + 15 * talk
        ctx.new_path()
        _ellipse(ctx, mx, my + 2, mw, mh)
        ctx.set_source_rgb(0.22, 0.05, 0.06)
        ctx.fill_preserve()
        ctx.save()
        ctx.clip()
        ctx.new_path()
        _ellipse(ctx, mx, my + 2 + mh * 0.8, mw * 0.7, mh * 0.6)
        ctx.set_source_rgb(0.92, 0.38, 0.42)
        ctx.fill()
        ctx.restore()
        ctx.new_path()
        _ellipse(ctx, mx, my + 2, mw, mh)
        ctx.set_source_rgb(*INK)
        ctx.set_line_width(3.5)
        ctx.stroke()
    else:
        ctx.set_source_rgb(*INK)
        ctx.set_line_width(4)
        ctx.new_path()
        if emo in ("worried", "angry"):
            ctx.arc(mx, my + 14, 12, math.radians(220), math.radians(320))
        elif emo == "smug":
            ctx.move_to(mx - 12, my)
            ctx.curve_to(mx - 2, my + 6, mx + 8, my + 4, mx + 14, my - 6)
        elif emo == "happy":
            ctx.arc(mx, my - 6, 15, math.radians(25), math.radians(155))
        else:
            ctx.arc(mx, my - 8, 13, math.radians(35), math.radians(145))
        ctx.stroke()

    # 땀방울
    if emo in ("worried", "shock"):
        s = (t * 0.8) % 1.0
        dx, dy = 96.0, -548.0 + s * 26
        ctx.new_path()
        ctx.move_to(dx, dy - 16)
        ctx.curve_to(dx + 11, dy, dx + 9, dy + 10, dx, dy + 10)
        ctx.curve_to(dx - 9, dy + 10, dx - 11, dy, dx, dy - 16)
        ctx.set_source_rgba(0.55, 0.8, 1.0, 1 - s * 0.6)
        ctx.fill_preserve()
        ctx.set_source_rgba(*INK, 1 - s * 0.6)
        ctx.set_line_width(3)
        ctx.stroke()


def _hat(pen: Pen, pose: Pose, t: float):
    ctx = pen.ctx
    lift = pose.hat_lift
    ctx.save()
    ctx.translate(0, -lift * 70)
    ctx.translate(30, -575)
    ctx.rotate(math.radians(-4 - lift * 14))
    ctx.translate(-30, 575)

    def brim(c):
        _ellipse(c, 2, -572, 126, 21, -3)

    def crown(c):
        c.move_to(-82, -578)
        c.curve_to(-84, -610, -78, -632, -70, -646)
        c.curve_to(-48, -664, -18, -660, 2, -650)
        c.curve_to(24, -662, 54, -664, 72, -648)
        c.curve_to(82, -630, 88, -608, 88, -580)
        c.curve_to(40, -568, -40, -568, -82, -578)
        c.close_path()

    pen.shape(brim, fill=HAT)
    pen.shape(crown, fill=HAT)

    def deco(c):
        # 띠
        c.save()
        c.new_path()
        crown(c)
        c.clip()
        c.new_path()
        c.move_to(-95, -604)
        c.curve_to(-40, -596, 40, -596, 95, -606)
        c.line_to(95, -584)
        c.curve_to(40, -574, -40, -574, -95, -584)
        c.close_path()
        c.set_source_rgb(*BAND)
        c.fill()
        # 하이라이트
        c.new_path()
        c.move_to(-58, -640)
        c.curve_to(-66, -625, -68, -615, -68, -606)
        c.set_source_rgb(*HAT_HI)
        c.set_line_width(9)
        c.set_line_cap(cairo.LINE_CAP_ROUND)
        c.stroke()
        c.new_path()
        c.move_to(-10, -652)
        c.curve_to(-6, -640, 0, -628, 4, -620)
        c.set_source_rgba(*HAT_HI, 0.8)
        c.set_line_width(5)
        c.stroke()
        c.restore()
        # 챙 아래쪽 하이라이트
        c.new_path()
        c.save()
        c.translate(2, -572)
        c.rotate(math.radians(-3))
        c.scale(118, 14)
        c.arc(0, 0, 1, math.radians(20), math.radians(160))
        c.restore()
        c.set_source_rgb(*HAT_HI)
        c.set_line_width(4)
        c.stroke()

    pen.detail(deco)
    ctx.restore()


def _hand(pen: Pen, pos, r=18.0):
    pen.shape(lambda c: _circle(c, pos[0], pos[1], r), fill=WHITE, width=5)

    def sh(c):
        c.new_path()
        c.arc(pos[0], pos[1], r - 5, math.radians(100), math.radians(220))
        c.set_source_rgb(*SHADE)
        c.set_line_width(5)
        c.stroke()

    pen.detail(sh)


def _draw_all(pen: Pen, pose: Pose, t: float):
    ctx = pen.ctx
    # 걷기 시 팔 흔들기
    arm_l = pose.arm_l
    arm_r = pose.arm_r
    if pose.walk >= 0:
        s = math.sin(pose.walk * 2 * math.pi)
        arm_l = (arm_l[0] - s * 14, arm_l[1] - s * 14)

    _body_group(pen, pose)

    shL, elL, haL = arm_points((-36.0, -404.0), arm_l, ARM_L_LEN)
    pen.tube((shL, elL, haL), 34)
    _briefcase(pen, haL)
    _hand(pen, haL)

    _head(pen, pose, t)

    shR, elR, haR = arm_points((40.0, -406.0), arm_r, ARM_R_LEN)
    pen.tube((shR, elR, haR), 34)
    tab_angle = 28 + (arm_r[1] - ARM_POSES["hold"][1]) * 0.35
    _tablet(pen, haR, tab_angle, pose, t)
    _hand(pen, haR, 19)


def draw_mascot(ctx, x: float, y: float, height: float, pose: Pose, t: float = 0.0,
                flip: bool = False, shadow: bool = True, sticker: float = 7.0,
                shadow_rgba=(0, 0, 0, 0.28)):
    """(x, y) = 화면상의 발 위치, height = 화면상 캐릭터 높이(px)."""
    s = height / 660.0
    ctx.save()
    ctx.translate(x, y)
    if shadow:
        ctx.save()
        ctx.scale(s, s)
        ctx.new_path()
        _ellipse(ctx, 10, 6, 165, 20)
        ctx.set_source_rgba(*shadow_rgba)
        ctx.fill()
        ctx.restore()
    sq = pose.squash
    ctx.scale(s * (1 + sq * 0.5) * (-1 if flip else 1), s * (1 - sq))
    ctx.rotate(math.radians(pose.lean))
    ctx.translate(0, -pose.bob)
    if sticker > 0:
        _draw_all(Pen(ctx, sticker=sticker), pose, t)
    _draw_all(Pen(ctx), pose, t)
    ctx.restore()


def lerp_pose(a: Pose, b: Pose, k: float) -> Pose:
    """두 포즈 사이 보간(팔 각도·기울기 등 숫자 값만). 표정/아이콘은 k>=0.5에서 전환."""
    k = max(0.0, min(1.0, k))

    def L(x, y):
        return x + (y - x) * k

    def LT(x, y):
        return tuple(L(i, j) for i, j in zip(x, y))

    return Pose(
        talk=L(a.talk, b.talk), blink=L(a.blink, b.blink),
        emotion=b.emotion if k >= 0.5 else a.emotion,
        arm_r=LT(a.arm_r, b.arm_r), arm_l=LT(a.arm_l, b.arm_l),
        head_tilt=L(a.head_tilt, b.head_tilt), lean=L(a.lean, b.lean), bob=L(a.bob, b.bob),
        walk=b.walk if k >= 0.5 else a.walk, hat_lift=L(a.hat_lift, b.hat_lift),
        look=LT(a.look, b.look), screen=b.screen if k >= 0.5 else a.screen,
        glow=L(a.glow, b.glow), squash=L(a.squash, b.squash),
    )
