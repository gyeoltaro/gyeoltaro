#!/bin/bash
# 부의비상사태 911 영상 제작실 (Linux) — 더블클릭으로 실행
cd "$(dirname "$0")/.." || exit 1
echo "부의비상사태 911 영상 제작실을 준비합니다..."
if ! command -v python3 >/dev/null 2>&1; then
  echo "Python 3가 필요합니다: https://www.python.org/downloads/ 에서 설치한 뒤 다시 실행하세요."; read -n1; exit 1
fi
if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg가 필요합니다. 터미널에서 다음을 실행하세요:  sudo apt install ffmpeg libcairo2-dev pkg-config python3-venv"; read -n1; exit 1
fi
[ -d .venv ] || python3 -m venv .venv
source .venv/bin/activate
pip install -q --upgrade pip >/dev/null 2>&1
if ! pip install -q -r requirements.txt; then
  echo "설치에 실패했습니다. 터미널에서 'sudo apt install libcairo2-dev pkg-config' 후 다시 실행하세요."; read -n1; exit 1
fi
python -m studio.server --open
