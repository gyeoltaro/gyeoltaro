"""썸네일 점검기 — 잘 된 경제 썸네일 레퍼런스와 밝기·디테일·색감을 비교한다.

  python -m studio.thumbcheck episodes/ep11_employment/out/thumbnail_A.png [...]

기준값(learning/thumbnail_study.json)은 2026-11-10 레퍼런스 연구에서 나왔습니다:
최근 1년 한국 경제 롱폼 중 '구독자 대비 조회수' 상위 60개 썸네일의 중앙값.
숫자는 참고용입니다. 클릭률은 결국 우리 채널의 A/B 테스트 결과로 판단합니다.
"""
from __future__ import annotations

import json
import os
import sys

import numpy as np
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STUDY = os.path.join(ROOT, "learning", "thumbnail_study.json")


def features(path):
    im = Image.open(path).convert("RGB").resize((320, 180))
    a = np.asarray(im).astype(float)
    R, G, B = a[..., 0], a[..., 1], a[..., 2]
    rg, yb = R - G, 0.5 * (R + G) - B
    L = 0.299 * R + 0.587 * G + 0.114 * B
    e = np.asarray(im.convert("L").filter(ImageFilter.FIND_EDGES)).astype(float)
    return {
        "bright": float(L.mean() / 255),
        "dark": float((L < 50).mean()),
        "edge": float((e > 40).mean()),
        "colorful": float(np.sqrt(rg.std() ** 2 + yb.std() ** 2) + 0.3 * np.sqrt(rg.mean() ** 2 + yb.mean() ** 2)),
    }


LABEL = {"bright": "밝기", "dark": "어두운 영역", "edge": "디테일(화면 채움)", "colorful": "색감"}


def check(path, ref):
    f = features(path)
    out = []
    for k, lab in LABEL.items():
        lo, hi = ref["range"][k]
        st = "OK" if lo <= f[k] <= hi else ("낮음" if f[k] < lo else "높음")
        out.append(f"  {lab:12} {f[k]:7.3f}  (잘 된 썸네일 중간 50%: {lo:.3f}~{hi:.3f})  {st}")
    return "\n".join(out)


def main(argv):
    ref = json.load(open(STUDY, encoding="utf-8"))
    for p in argv:
        print(os.path.basename(p))
        print(check(p, ref))


if __name__ == "__main__":
    main(sys.argv[1:])
