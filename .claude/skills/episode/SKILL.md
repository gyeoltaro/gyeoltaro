---
name: episode
description: 유튜브 채널 「부의비상사태 911」의 영상을 한 편 만든다. "다음 편 만들어줘", "EP.14 만들어줘", 대본·썸네일·업로드 자료 제작 요청에 사용한다.
---

# 부의비상사태 911 — 한 편 만들기

이 저장소에는 누가 만들어도 같은 수준이 나오도록 순서와 점검 도구가 준비되어 있습니다. 새로 방법을 만들지 말고 그대로 따릅니다.

1. `youtube/docs/STATUS.md` 를 읽어 다음 편이 무엇인지, 채널 주인의 답을 기다리는 일이 무엇인지 확인합니다.
2. `youtube/docs/PLAYBOOK.md` 를 처음부터 끝까지 읽고 0장 표의 순서대로 진행합니다.
   - 주제와 각도 → `python -m studio.ep new <번호> <영어이름>` → 사실 확인(`01_plan.md`) → 대본(`script.py`)
   - `ep script` → `ep check`(오류 0개) → `ep stills`(모아보기를 눈으로 검수) → `ep render` → `ep verify` → `ep package`
3. 대본을 쓸 때는 `youtube/episodes/ep13_qe_qt/script.py`(표준 예시)와 `youtube/docs/VISUALS.md` 를 참고합니다.
4. 커밋 전에 `python -m studio.ep precommit` 을 통과시키고, 끝나면 `youtube/docs/STATUS.md` 를 고칩니다.
5. 채널 주인에게 파일(영상·자막·썸네일 A/B/C)을 보내고 쉬운 한국어로 짧게 보고합니다: 길이, 제목 A/B/C, 원문 확인을 못 한 숫자(⚠️), 한계, 다음 편.

지킬 것: 확인된 사실만 · 전망과 투자 권유 금지 · 자극적인 말 금지 · API 키를 출력하거나 커밋하지 않기 · 요청 없이 풀 리퀘스트를 만들지 않기.
