"""제작실 업데이트 — GitHub의 최신 코드로 제작 도구만 교체한다.

  python -m studio.update                 # 기본 브랜치
  python -m studio.update --branch main   # 다른 브랜치

교체하는 것: studio/ (제작 엔진), dashboard/index.html (화면), assets/ (폰트·이미지), docs/, README.md,
              requirements.txt, episodes/_template/ (새 에피소드 시작 양식)
절대 건드리지 않는 것: episodes/ep*/ (내 에피소드), voice/ (내 녹음), learning/ (학습 기록),
              cache/ , .secrets/ (API 키), .venv/ , dashboard/dist/ , launch/ (실행 중인 .bat 보호)
"""
from __future__ import annotations

import argparse
import hashlib
import io
import os
import shutil
import subprocess
import sys
import tempfile
import urllib.request
import zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPO = "gyeoltaro/gyeoltaro"
DEFAULT_BRANCH = "claude/optimistic-heisenberg-kpftc4"

# (상대 경로, 폴더 여부)
MANAGED = [("studio", True), ("assets", True), ("docs", True), ("episodes/_template", True),
           ("dashboard/index.html", False), ("README.md", False), ("requirements.txt", False)]
SKIP_NAMES = {"__pycache__", ".DS_Store"}


def branch_name(arg):
    if arg:
        return arg
    if os.environ.get("B911_BRANCH"):
        return os.environ["B911_BRANCH"].strip()
    f = os.path.join(ROOT, ".update_branch")
    if os.path.exists(f):
        return open(f, encoding="utf-8").read().strip() or DEFAULT_BRANCH
    return DEFAULT_BRANCH


def download(url):
    req = urllib.request.Request(url, headers={"User-Agent": "b911-updater"})
    with urllib.request.urlopen(req, timeout=120) as r:
        return r.read()


def file_hash(path):
    h = hashlib.sha1()
    with open(path, "rb") as f:
        h.update(f.read())
    return h.hexdigest()


def sync_dir(src, dst, changed):
    """src 폴더 내용으로 dst 를 맞춘다 (src에 없는 파일은 지운다 — 관리 폴더 한정)."""
    os.makedirs(dst, exist_ok=True)
    want = set()
    for base, dirs, files in os.walk(src):
        dirs[:] = [d for d in dirs if d not in SKIP_NAMES]
        rel = os.path.relpath(base, src)
        for fn in files:
            if fn in SKIP_NAMES or fn.endswith(".pyc"):
                continue
            s = os.path.join(base, fn)
            r = os.path.normpath(os.path.join(rel, fn))
            d = os.path.join(dst, r)
            want.add(r)
            if not os.path.exists(d) or file_hash(s) != file_hash(d):
                os.makedirs(os.path.dirname(d), exist_ok=True)
                shutil.copyfile(s, d)
                changed.append(os.path.relpath(d, ROOT))
    for base, dirs, files in os.walk(dst):
        dirs[:] = [d for d in dirs if d not in SKIP_NAMES]
        for fn in files:
            if fn.endswith(".pyc") or fn in SKIP_NAMES:
                continue
            r = os.path.normpath(os.path.join(os.path.relpath(base, dst), fn))
            if r not in want:
                os.remove(os.path.join(base, fn))
                changed.append("삭제: " + os.path.relpath(os.path.join(base, fn), ROOT))


def main():
    ap = argparse.ArgumentParser(description="제작실 업데이트")
    ap.add_argument("--branch")
    ap.add_argument("--url", help="(시험용) ZIP 주소를 직접 지정")
    args = ap.parse_args()
    branch = branch_name(args.branch)
    url = args.url or f"https://github.com/{REPO}/archive/refs/heads/{branch}.zip"
    print(f"최신 버전을 내려받는 중… ({branch})")
    try:
        data = download(url)
    except Exception as e:
        print(f"내려받기 실패: {e}\n인터넷 연결을 확인하고 다시 시도하세요.")
        sys.exit(1)
    with tempfile.TemporaryDirectory() as tmp:
        try:
            zipfile.ZipFile(io.BytesIO(data)).extractall(tmp)
        except zipfile.BadZipFile:
            print("내려받은 파일이 올바른 ZIP이 아닙니다. 잠시 후 다시 시도하세요.")
            sys.exit(1)
        top = [d for d in os.listdir(tmp) if os.path.isdir(os.path.join(tmp, d))]
        src_root = None
        for d in top:
            cand = os.path.join(tmp, d, "youtube")
            if os.path.isdir(os.path.join(cand, "studio")):
                src_root = cand
        if not src_root:
            print("업데이트 파일에서 제작실(youtube/studio)을 찾지 못했습니다.")
            sys.exit(1)
        changed = []
        old_req = os.path.join(ROOT, "requirements.txt")
        req_before = file_hash(old_req) if os.path.exists(old_req) else ""
        for rel, is_dir in MANAGED:
            s, d = os.path.join(src_root, rel), os.path.join(ROOT, rel)
            if not os.path.exists(s):
                continue
            if is_dir:
                sync_dir(s, d, changed)
            elif not os.path.exists(d) or file_hash(s) != file_hash(d):
                os.makedirs(os.path.dirname(d), exist_ok=True)
                shutil.copyfile(s, d)
                changed.append(rel)
        wl = os.path.join(ROOT, "learning", "watchlist.json")
        if not os.path.exists(wl) and os.path.exists(os.path.join(src_root, "learning", "watchlist.json")):
            os.makedirs(os.path.dirname(wl), exist_ok=True)
            shutil.copyfile(os.path.join(src_root, "learning", "watchlist.json"), wl)
            changed.append("learning/watchlist.json")
    py_changed = any(c.startswith("studio") for c in changed)
    if os.path.exists(old_req) and file_hash(old_req) != req_before:
        print("필요한 부품을 새로 설치하는 중…")
        subprocess.run([sys.executable, "-m", "pip", "install", "-q", "-r", old_req], check=False)
    if not changed:
        print("이미 최신 버전입니다.")
        return
    print(f"업데이트 완료: 파일 {len(changed)}개가 바뀌었습니다.")
    for c in changed[:15]:
        print("  -", c)
    if len(changed) > 15:
        print(f"  … 외 {len(changed) - 15}개")
    if py_changed:
        print("※ 제작 엔진이 바뀌었습니다. 검은 창을 닫고 '제작실_시작'을 다시 실행해 주세요.")
    else:
        print("화면(브라우저)을 새로고침하면 적용됩니다.")


if __name__ == "__main__":
    main()
