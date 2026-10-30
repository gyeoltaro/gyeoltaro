# 인수인계: 무한의 격파

2026-10-30에 이전 세션(session_01KqqRSve3RvhQvcFhcrgo2J)이 쓴 메모예요. 대화가 길어져(약 39만 토큰) 새 세션으로 이어가요.

## 1) 한 줄 요약
"무한의 계단"을 벤치마킹해 좌우 탭으로 송판을 격파하는 2D 태권도 웹게임이에요. HTML 파일 하나에 캔버스 그래픽과 Web Audio 소리가 들어 있고, Firebase로 랭킹전을 운영해요.

## 2) 저장소와 주요 파일
- 저장소: `gyeoltaro/gyeoltaro.github.io`
  - `main`: 실제 사이트(GitHub Pages)
  - `gyeokpa`: 작업 브랜치. 마지막 확인 때 `main`과 같은 커밋 `88bc321`이었고, 그 뒤 변경은 **확인 필요**
- 게임은 `gyeokpa/` 폴더뿐이에요. 루트의 타로 사이트, mirae, trip, studio는 건드리지 마세요.
- 폴더 안 파일: `index.html`(게임 전체), `firebase-config.js`(설정값), `firestore.rules`(보안 규칙), `README.md`(Firebase 설정 순서)
- `index.html` 주요 구역: `POSES`(동작), `BELTS`(띠 기준), `drawBanner`(족자 글씨), BGM 시퀀서, 랭킹 블록(Firebase가 있으면 Firebase, 없으면 claude.ai db)

## 3) 최근 진행
- 격파판: 송판, 겹송판, 기와, 황금 송판 / 기합 타임 / 띠 승급(흰띠~검은띠 9단)
- 소리: 국악풍 배경음악(장구 장단, 점수 따라 템포 상승), 효과음, 음악·소리 끄기 버튼
- 게임 오버 화면: 격파기록증. 족자 글씨: 백절불굴 → 월드 태권도 → 어울림 태권도
- 랭킹전: 자기 기록을 넘으면 닉네임(12자) 등록, 상위 20위, 게임 중 "n위까지 m장" 표시
- GitHub 이전과 `main` 배포를 마쳤어요. Firebase 프로젝트 `infinite-gyeokpa`를 연결했어요(익명 로그인, Firestore 서울, 보안 규칙 게시). 실제 사이트에서 랭킹 읽기와 익명 로그인까지 확인했어요.
- "월드태권도" 제목으로 복사 세션(session_018s4EtDg2Zuitt82aufo9zc)을 만들어 상황 정리를 넘겼어요.

## 4) 남은 일과 답을 기다리는 질문
- 대표님이 실제로 닉네임을 등록해 보고 결과를 알려주기로 했어요(**확인 필요**). 랭킹 화면에 이름이 나오면 완료, 오류가 나면 캡처를 받기로 했어요.
- "월드태권도" 세션을 어디에 쓸지(**확인 필요**).
- claude.ai 아티팩트 버전을 GitHub 버전과 계속 같이 맞출지(**확인 필요**).

## 5) 대표님 규칙과 선호
- 한국어로 대화해요. 개발자가 아니라서 버튼 이름까지 적은 짧은 단계별 안내를 좋아해요.
- 선택지를 여러 개 나열하면 헷갈려하니 하나만 추천하세요.
- 기록증 문구 "백절불굴의 정신으로…"는 바꾸지 마세요.
- PR 병합을 어려워해요. 사이트 반영은 `main`에 push하는 방식을 원해요.
- 커밋 메시지는 한국어로 쓰고 끝에 Co-Authored-By와 Claude-Session 줄을 붙여요.

## 6) 주의할 점
- `main` push는 자동 모드에서 "Production Deploy"로 막혀요. 대표님이 입력창 아래 "자동"을 바꾸고 허용을 눌러야 진행돼요.
- gh CLI 토큰이 무효라서 PR을 만들 수 없어요.
- 저장소를 얕게(single-branch) 받으면 `origin/gyeokpa` 추적 브랜치가 안 생겨요. fetch refspec을 추가하세요.
- JS 정규식에 ` ` 같은 이스케이프를 쓰지 마세요. 편집 도구가 실제 문자로 바꿔 문법 오류가 났어요. `codePointAt`으로 검사하세요.
- Playwright로 확인할 때 Firestore 연결 때문에 `networkidle`이 끝나지 않아요. `load`로 기다리세요.
- 실제 랭킹에 테스트 기록을 쓰지 마세요. Pages 반영은 push 후 1분쯤 걸려요.

## 7) 링크
- 게임: https://gyeoltaro.github.io/gyeokpa/
- 저장소: https://github.com/gyeoltaro/gyeoltaro.github.io
- 아티팩트: https://claude.ai/artifact/NXMvoeEDDN2W8xrprDDxzY
- Firebase 콘솔: https://console.firebase.google.com/project/infinite-gyeokpa
