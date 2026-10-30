# 인수인계: 잠실이 채널 (유튜브 사연 만화)

2026-10-30에 이전 세션(session_011aMZSdc17YfChV7c1rYTMK)이 쓴 메모예요. 대화가 길어져(약 75만 토큰) 새 세션으로 이어가요.

## 1) 한 줄 요약
유튜브 '잠들기 전 이야기 잠실이'(@jamsili)에 올릴 창작 사연 만화(롱폼 8분대와 쇼츠 4개)를 파이썬 도구로 만들고, 매일 아침 조사 보고서를 올리는 작업이에요.

## 2) 저장소와 브랜치, 문서·파일
- 저장소는 gyeoltaro/gyeoltaro.github.io, 브랜치는 `ccr-8dbdba93-q9kqwv` 하나예요. 모든 커밋과 푸시를 여기에 해요.
- 꼭 읽을 문서: `studio/CHANNEL.md`(채널 설정·영상 목록), `studio/KNOWHOW.md`(필수 요소), `studio/README.md`(project.json 형식·배경·소품 목록)
- 도구:
  - `studio/tools/studio.py`: `check`, `lint`, `long`, `shorts`, `thumb`, `kit`, `all` 명령
  - `studio/tools/cartoon.py`: 배경·인물·소품 그림
  - `studio/tools/research.py`: `channel`, `topic`, `video` 조사
- 편마다 `studio/projects/<slug>/build_script.py`를 실행해 project.json을 만들어요. 최신 예시는 `wedding-mic`(13편)이에요.
- 보고서는 `studio/research/daily/YYYY-MM-DD.md`에 있어요.
- 필요한 패키지는 pillow, edge-tts, numpy예요. 음성은 GOOGLE_TTS_API_KEY(Google Cloud TTS, Chirp3-HD 음성)로 쓰고, 키 값은 절대 출력하면 안 돼요.

## 3) 최근 진행 상황
- 9~13편을 만들었어요.
- 업로드된 것은 9편(10/21)과 12편(10/30)이에요. 10편(will-daughter), 11편(holiday-ledger), 13편(wedding-mic)은 완성했고 업로드를 기다려요.
- 12편 쇼츠 4개는 하루 만에 모두 1,100회를 넘었고, 채널 첫 댓글 3개가 달렸어요. 모두 완결형 쇼츠에 달렸어요.
- 구독자는 913명이에요.
- 지금 쇼츠 구성은 완결형 3개(2분 20초~2분 45초, 롱폼 장면을 clips로 잘라 붙임, 보통 속도)와 예고형 1개(25초 안팎)예요.

## 4) 남은 일과 기다리는 질문
- 매일 아침 8:52(한국 시간) 조사 루틴은 2026-10-30에 새 방식으로 옮겼어요(`routines/jamsili-daily-report.md`, 매번 새 작업 세션).
- 대표님 답을 기다리는 질문:
  - 13편 회상 장면의 두 아버지를 젊은 모습으로 다시 만들지
  - 12편 졸업식 장면 칠판의 "2교시 수학" 글씨를 고칠지
- 14편 후보는 아직 없어요. 다음 아침 보고서에서 올리면 돼요.

## 5) 대표님 규칙과 선호
- 휴대폰으로 보세요. 한국어로 짧고 쉽게, 결과 위주로 보고해 주세요.
- 반드시 이 순서를 지켜요: ① 후보 2~3개 제시 → ② 대표님이 고르면 줄거리를 페이지 scripts에 올림 → ③ '승인'을 받음 → ④ 제작. 승인 전에는 영상을 만들면 안 돼요.
- 업로드는 대표님이 직접 해요.
- 창작 사연임을 영상 끝과 설명에 표기해요.

## 6) 제작 순서·점검 방법과 주의할 점
- 제작 순서:
  1. `git pull`
  2. 새 배경·소품을 cartoon.py에 추가하고 미리보기 PNG로 확인
  3. build_script.py 작성 → 실행
  4. `studio.py lint`에서 29개 항목 통과(롱폼 8분 10초 이상 ≈ 3,400자, 장면당 75초 이하, 대사 60자 이하, 연속 장면 배경이 겹치지 않게)
  5. README·index.html·CHANNEL.md 갱신 후 커밋·푸시
  6. `studio.py all`을 백그라운드로 실행(15~20분)
  7. ffprobe로 길이 확인, 프레임을 뽑아 화면 점검
  8. SendUserFile로 롱폼·쇼츠 4개·썸네일 3개·upload.html 보내기
  9. 페이지 DB의 videos 상태를 done으로 바꾸기
- 주의할 점:
  - clips는 장면 번호 대신 `s_xxx` 변수로 써야 해요. 장면을 추가하면 번호가 밀려요.
  - DB 문서를 고칠 때는 먼저 읽고 `if_version`을 넣어야 해요. 다시 시작된 직후에는 읽기부터 다시 하세요.
  - 배경 카드에 원래 그려진 글씨가 장면과 안 맞을 수 있어요.
  - 회상 장면의 인물 나이가 반영되지 않아요.
  - output/과 work/는 커밋하지 않아요.

## 7) 링크
- 스튜디오 페이지(보고서·후보·승인·영상 상태): https://claude.ai/artifact/G41NizqsrBJA2FUtFrUZsw
- 모아랩 관리실(결재 페이지): https://claude.ai/artifact/83apXZcGoiQTeQG6guT69d
- 채널: https://youtube.com/@jamsili
