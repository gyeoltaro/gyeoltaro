# 인수인계: 태권도 통합 관리 시스템

2026-10-30에 이전 세션(session_01RADwghCnAeNuMJiMahQCok)이 쓴 메모예요. 대화가 길어져(약 33만 토큰) 새 세션으로 이어가요.

## 1) 프로젝트 한 줄 요약
- 태권도장 통합 관리 웹앱이에요: 출석 태블릿, 회비, 체력측정, 알림장, 참가신청, 승급심사, 학부모 앱, 앱 푸시.
- 바닐라 JS와 Firebase로 만들었어요. 다른 도장에도 나눠 주고, 도장마다 자기 Firebase를 써요. 아울림이 실제로 쓰고 있어요.

## 2) 저장소와 주요 파일
- **원본:** gyeoltaro/gyeoltaro, 브랜치 `claude/wonderful-turing-qwjqzr`
  - www/: 앱 · functions/: 푸시 서버 · tests/, tools/
- **배포:** awoolimtkd/awoolimtkd.github.io의 main. `node tools/deploy.mjs`로만 올리고 직접 고치지 않아요.
- **먼저 읽을 문서:** README.md, docs/firebase-setup.md
- **주요 파일:**
  - www/js/cloud.js: 서버 연결, 초대, 푸시, 아이폰 옮기기 코드
  - cloud-rules.js: 보안 규칙(VERSION=2)
  - app.js, parent.js, consent.js, settings.js, admin-home.js
  - functions/index.js, tools/push-install.sh, tools/manual-pdf.mjs
  - www/manual.html(관리자), www/parents.html(학부모)
  - tests/rules.test.mjs(77개), tests/cloud.e2e.mjs(33개)

## 3) 최근 진행
- 마지막 커밋 a4aabf8을 배포했어요. 초대 링크 자동 연결, 아이폰 홈 화면 아이콘 자동 연결(t= 코드, 7일, 홈 화면 아이콘에서만), 모두 동의하기, 학부모 홈의 '처음 한 번만 해 주세요' 카드, 보안 규칙 v2와 규칙이 예전 것일 때 관리자 홈 안내.
- 규칙·통합·체험 모드 테스트를 모두 통과했고, 설명서와 PDF도 고쳤어요.
- 그 뒤에는 질문에 답만 했어요(컴퓨터 교체, 개인정보 저장 위치). 바꾼 건 없어요.

## 4) 남은 일
- 대표님이 Firebase 보안 규칙 v2를 다시 붙여 넣었는지 **확인 필요**(아이폰 자동 연결에 필요).
- 개인정보 처리방침의 보호책임자 입력 여부와 구글 2단계 인증은 권유만 했어요. **확인 필요.**
- QR 연결과 APK는 보류 중이에요. 대표님 답을 기다리는 질문은 없어요.

## 5) 대표님 규칙
- 항상 한국어로, 쉬운 말로 답해요. 결과물(사이트 주소와 첨부 파일)은 답변 맨 아래에 둬요.
- 질문만 하시면 설정이나 구현은 하지 말고 답만 해요.
- "무료로 나눠 드리는 프로그램", "무료 배포판" 문구는 쓰지 않아요.
- 실제로 잘 되는지 검증한 뒤에 배포해요.
- 설명서는 관리자용과 학부모용을 따로 둬요(웹과 PDF).
- PR은 만들지 않아요. 커밋에 모델명을 넣지 않아요.

## 6) 주의할 점
- **테스트 환경:** 저장소에 node_modules가 없어요. 예전에는 스크래치에 firebase-tools를 설치하고, NODE_OPTIONS로 honor-no-proxy.cjs(firebase-tools가 NO_PROXY를 무시해서 EnvHttpProxyAgent로 바꿔 주는 파일)를 불러 프록시 문제를 피했어요. 새 세션에서는 다시 만들어야 해요(**확인 필요**). 프록시를 끄거나 TLS 검사를 끄면 안 돼요.
- 알림 테스트는 `chromium.launch({channel:'chromium'})`으로 띄워야 해요.
- **PDF 만들기:** node_modules 심볼릭 링크를 /opt/node22/lib/node_modules로 잠깐 만들어요. 커밋 전에 꼭 지워요.
- **서버 끄기:** `pkill -f`는 자기 셸도 죽여요. PID로 kill해요.
- 샘플 데이터 ID는 기기마다 무작위예요. 체험 모드 스모크 테스트의 SMS 단계는 예전부터 실패해요(이번 변경과 무관).
- 규칙 보기 창에는 #rulesOut이 없어요. Firebase 콘솔의 '게시' 버튼은 내용이 바뀌었을 때만 보여요.
- 관리자 푸시는 계정당 마지막으로 켠 기기 1대로만 가요.
- firebase.json에서 규칙과 호스팅을 뺐어요(실제 규칙을 덮어쓰지 않게).
- **gcloud 로그인:** cloud-platform 범위에 체크해야 해요. 명령마다 CLOUDSDK_AUTH_ACCESS_TOKEN을 해제하고, 다 쓰면 로그인 권한을 회수해요.

## 7) 링크
- 앱: https://awoolimtkd.github.io
- 학부모 안내: https://awoolimtkd.github.io/parents.html (PDF: /parents.pdf)
- 관리자 설명서: https://awoolimtkd.github.io/manual.html (PDF: /manual.pdf)
- 푸시 서버 설치: `curl -fsSL https://awoolimtkd.github.io/push-server/install.sh | bash`
- Firebase 프로젝트 awoolimtkd(서울)
- 아티팩트: https://claude.ai/artifact/TCNd1pDwUrumj9rN4nAGLb
