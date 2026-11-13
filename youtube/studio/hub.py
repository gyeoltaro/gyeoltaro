"""업로드 센터 생성기 — 모든 편의 제목 A/B/C·썸네일·설명·태그·고정 댓글을 한 페이지에 모은다.

  python -m studio.hub      → dashboard/upload_hub.html + dashboard/th/*.jpg (미리보기용으로 줄인 썸네일)

만든 페이지는 Claude 아티팩트로 게시해서 사용자가 Claude 안에서 바로 엽니다(주소는 HUB_URL).
게시 방법(Artifact 도구): 다른 대화에서 처음 고칠 때는 먼저 action "read" 로 HUB_URL 을 읽고,
그다음 url=HUB_URL, file_path=dashboard/upload_hub.html, files={"th/<파일>": "<경로>"} (새로 생긴 썸네일만) 로 게시합니다.
"""
from __future__ import annotations

import glob
import json
import os

from PIL import Image

from .uploadpage import _warnings

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HUB_URL = "https://claude.ai/artifact/2K5x4iWc7yodwfevhhTwJq"
TEMPLATE = os.path.join(ROOT, "dashboard", "upload_hub_template.html")
OUT = os.path.join(ROOT, "dashboard", "upload_hub.html")
TH = os.path.join(ROOT, "dashboard", "th")


def collect():
    eps, thumbs = [], []
    os.makedirs(TH, exist_ok=True)
    for d in sorted(glob.glob(os.path.join(ROOT, "episodes", "ep*"))):
        up, sc = os.path.join(d, "out", "upload.json"), os.path.join(d, "02_script.json")
        if not (os.path.exists(up) and os.path.exists(sc)):
            continue
        meta = json.load(open(sc, encoding="utf-8"))["meta"]
        u = json.load(open(up, encoding="utf-8"))
        key = os.path.basename(d)
        titles = [u["title"]] + list(meta.get("upload", {}).get("alt_titles", []))
        ths = []
        for k in "ABC":
            p = os.path.join(d, "out", f"thumbnail_{k}.png")
            if os.path.exists(p):
                rel = f"th/{key}_{k}.jpg"
                dst = os.path.join(ROOT, "dashboard", rel)
                if not os.path.exists(dst) or os.path.getmtime(dst) < os.path.getmtime(p):
                    Image.open(p).convert("RGB").resize((640, 360)).save(dst, quality=82)
                    thumbs.append((rel, dst))
                ths.append(rel)
            else:
                ths.append(None)
        eps.append({"key": key, "ep": meta.get("episode", ""), "title": titles, "thumbs": ths, "desc": u["description"],
                    "tags": u["tags"], "pinned": u.get("pinned_comment", ""), "warn": _warnings(d)})
    return eps, thumbs


def build():
    eps, new_thumbs = collect()
    html = open(TEMPLATE, encoding="utf-8").read().replace("__DATA__", json.dumps(eps, ensure_ascii=False).replace("</", "<\\/"))
    with open(OUT, "w", encoding="utf-8") as f:
        f.write(html)
    return eps, new_thumbs


def main():
    eps, new_thumbs = build()
    print(f"업로드 센터: {OUT} (에피소드 {len(eps)}편)")
    print(f"아티팩트 주소: {HUB_URL}")
    if new_thumbs:
        print("새로 만들었거나 바뀐 미리보기 썸네일 (게시할 때 files 에 넣기):")
        print(json.dumps({rel: path for rel, path in new_thumbs}, ensure_ascii=False, indent=1))
    else:
        print("바뀐 썸네일 없음 (페이지만 다시 게시하면 됩니다)")


if __name__ == "__main__":
    main()
