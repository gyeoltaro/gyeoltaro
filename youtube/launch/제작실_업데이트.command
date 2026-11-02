#!/bin/bash
# 부의비상사태 911 제작실 업데이트 (Mac) — 더블클릭으로 실행
cd "$(dirname "$0")/.." || exit 1
[ -f .venv/bin/activate ] && source .venv/bin/activate
export PYTHONUTF8=1
curl -fsSL -o studio/update.py https://raw.githubusercontent.com/gyeoltaro/gyeoltaro/refs/heads/claude/optimistic-heisenberg-kpftc4/youtube/studio/update.py || { echo "업데이트 파일을 받지 못했습니다"; read -n1; exit 1; }
python3 -m studio.update
echo; echo "끝났습니다. 아무 키나 누르면 닫힙니다."; read -n1
