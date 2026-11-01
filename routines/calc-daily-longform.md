# 비밀의 계산기 — 롱폼 매일 제작 (자동 작업 지시문)

대표님 결정(2026.11.1): 롱폼 **하루 한 편, 8~10분**. 이 지시문은 새 작업 세션이 처음부터 끝까지 따른다. 질문하지 않는다(사용자가 없다). 막히면 아래 '못 만들 때'를 따른다. API 키 값은 절대 출력·저장하지 않는다.

작업 저장소는 `gyeoltaro/gyeoltaro`, 브랜치 `claude/clever-cray-tfw7qn` 하나만 쓴다. 다른 브랜치에 푸시하지 않고 PR 도 만들지 않는다. 다른 예약 작업(05:49 공부)이 같은 브랜치에 푸시하므로 **커밋 전 `git fetch` + `git rebase`** 필수.

## 0. 준비
1. `cd` 로 저장소 루트에서 `git fetch -q origin claude/clever-cray-tfw7qn && git checkout claude/clever-cray-tfw7qn && git pull -q --rebase origin claude/clever-cray-tfw7qn`.
2. 읽는다: `CLAUDE.md`(롱폼·사실 확인 원칙·교훈 전부), `docs/longform-queue.md`, `docs/longform-plan.md`, `docs/longform-ep04.md`(가장 최근 완성본 = 문서·업로드 문구의 틀), `longform/build-ep04.py`, `longform/ep04-scenes.js`, `longform/ep04-thumbs.js`.
3. 도구 확인: `echo ${GOOGLE_TTS_API_KEY:+있음}` (값은 출력하지 않는다), `node -v`, `ffmpeg -version | head -1`, `python3 -c "import PIL"`, `NODE_PATH=$(npm root -g) node -e "require('playwright')"`. 키가 없으면 '못 만들 때'.
4. 오늘 날짜 `TZ=Asia/Seoul date +%F`. 다음 편 번호 = `docs/longform-queue.md` 의 '다음 번호'.

## 1. 성과 확인 (5분 이내)
공개 피드로 최근 영상 조회수를 본다(스튜디오는 못 연다):
```
curl -sS -m 30 "https://www.youtube.com/feeds/videos.xml?channel_id=UC179zQKEWyyi8F-SOkOFmkg" -o /tmp/feed.xml
```
`media:statistics views`·제목·`published`(UTC)를 파싱해 롱폼(제목에 ` | ` 또는 길이가 긴 것)과 쇼츠를 나눠 `docs/episodes.md` 에 '공개 피드 확인 (날짜)' 줄을 한 단락 더한다. 반응이 있는 업종·제목 꼴이 보이면 큐 순서를 바꿔도 된다(이유를 큐 문서에 적는다).

## 2. 주제 고르기와 근거 확인 (가장 중요)
1. `docs/longform-queue.md` 의 '대기' 중 위에서부터 하나를 고른다. 어제 쓴 반전·업종과 겹치지 않게.
2. **원문을 직접 연다.** 검색 요약만 믿지 않는다. WebSearch 로 후보 기사를 찾고 WebFetch 로 원문을 열어 숫자·날짜·출처를 확인한다. 공정위·통계청 등 사이트는 이 환경에서 접속이 막힐 수 있다 → 언론이 인용한 수치를 쓰고 설명란에 밝힌다.
3. 쓸 수 있는 근거: 원문에서 확인한 숫자가 **3개 이상**이고 서로 모순이 없을 것. 기준 연도·집계 기준이 다른 숫자는 비교하지 않는다(CLAUDE.md '회계 집계 기준' 교훈). 모자라면 이 주제를 큐에서 '보류(이유)'로 바꾸고 다음 주제로 넘어간다. 3개까지 시도해 안 되면 '못 만들 때'.
4. 가게 운영 숫자(매출·월세·알바 등)는 '예시 가정'으로 두고 근거 있는 평균(최저임금 10,320원, 업계 평균 보도)에 맞춘다. 모든 계산식을 `python3` 로 다시 계산해 표를 만든다(손으로 한 계산 금지).
5. 영상·설명에는 브랜드 이름 대신 '한 본사'·'한 브랜드'를 쓴다. 소송·위법 단정은 하지 않고 '보도에 따르면'으로 쓴다.

## 3. 제작 (LF.04 와 같은 틀)
파일 이름: 번호 `NN` 과 짧은 영문 slug (예: `ep05-unmanned-store`).
1. `longform/build-ep04.py`, `ep04-scenes.js`, `ep04-thumbs.js` 를 `build-epNN.py`, `epNN-scenes.js`, `epNN-thumbs.js` 로 복사한다. 빌드 파일 안의 파일 이름·제목·`CUES`·`CHLABEL`·`MODE`·`DARK`·출력 이름을 새 편에 맞게 바꾼다. 장면은 새로 짠다(템플릿만 바꾼 영상은 오리지널로 안 친다). 공통 도우미(`sub`, `srcLine`, `hbar`, `popText`, `vCash`, `stampBox`, `pill`, `panel`, 마스코트)는 그대로 쓴다.
2. 구조: 오프닝(답 먼저·떡밥 2~3개·숫자 5개 예고) → 예시 가게 → **한 번에 쪼개기**(동전 N개 또는 막대) → 시그니처 `[계산기를 두드려보면] 머리가 ^{띵해지는} 순간이죠.` + 계산기 장면 → 장 4~5개(손익분기·편차·본사/플랫폼 몫·상권·손잡이 중 이 주제에 맞는 것) → 계약/창업 전 숫자 5가지 + 직접 해 보기 → 마무리 한 줄 "○○은 □□가 아니라 △△였던 거죠." → 댓글 질문 → 최종 화면. 장 첫 문장에 `pre:3000` 과 `ch`.
3. **길이:** 나레이션 공백 뺀 3,000~3,500자(약 370자 = 1분). 빌더가 글자 수를 출력한다. 렌더 길이는 나레이션 + 장 제목 3초 × 장 수 + 최종 화면 20초 → 총 8~10분 30초.
4. 단어 마크: 괄호는 단어 끝에서 닫는다(`[3만 원짜리]`). `^` 는 문장 첫 단어 앞에 넣지 않는다. 숫자는 말하는 단어 시점에 뜨게 `KT(id, j)` 를 쓰고 그 전에는 `?`(0으로 세어 올리지 않는다). 빌더 안 `SEQ` 는 계산기 키 시퀀스이고 0 개수를 센다.
5. 빌드: `python3 longform/build-epNN.py` → `longform/epNN-*.html`(음성 없음). 음성: `node longform/gen-tts.js longform/epNN-*.html --dry` 로 묶음 크기를 보고, 키가 있으면 `node longform/gen-tts.js longform/epNN-*.html`(환경변수 `GOOGLE_TTS_API_KEY` 만 사용). 내장된 음성을 `/tmp/tts.json` 으로 따로 저장해 두면 장면만 고칠 때 `python3 longform/build-epNN.py /tmp/tts.json` 으로 다시 내장한다(API 를 또 부르지 않는다).
6. **장면 점검은 필수:**
   `NODE_PATH=$(npm root -g) node longform/tools/shoot.js $PWD/longform/epNN-*.html /tmp/f1 <문장id+초> …` 로 모든 장면의 프레임을 뽑고 `python3 -I longform/tools/sheet.py /tmp/f1 6` 로 모음 이미지를 만들어 Read 로 본다. 겹침·잘림·빈 화면·`0만 원` 같은 숫자 오류를 고치고 다시 본다. 막대 오른쪽 라벨이 1880px 를 넘지 않게, 출처 줄 y=872, 자막 아래 1050. 썸네일은 `longform/tools/thumbs.js` 로 3안을 뽑아 360px 로 줄여 본다(핵심 그림은 위 55%).
7. 렌더: `NODE_PATH=$(npm root -g) node longform/render-longform.js longform/epNN-*.html /tmp/out/secret-calculator_LFNN_<slug>.mp4 3 > /tmp/out/render.log 2>&1` (약 10분, 백그라운드로 돌리고 로그를 본다). 끝나면 `ffprobe` 로 해상도·길이, `ffmpeg … ebur128` 로 −14.0 LUFS 근처인지 확인. 로그 끝에 `done` 이 없거나 길이가 짧으면(EPIPE) 다시 돌린다.
8. 자막: `node longform/make-srt.js longform/epNN-*.html longform/epNN-*.ko.srt`.

## 4. 문서 (CLAUDE.md '롱폼 업로드 문구' 규칙 그대로)
1. `docs/longform-epNN.md`: 원본·렌더·결과(길이·LUFS), 구성 표(시각 표 = `window.__exp.info().chapters` 로 뽑는다), 계산표(식과 결과), **출처(원문 확인 여부 표시)**, 쓰지 않은 것, 업로드 문구(제목 3안·썸네일 3안 설명·설명란(5,000바이트 이하·`<` `>` 없음·첫 두 줄 훅·목차 0:00·결과 한눈에·계산 5가지·가정·출처 전부·해시태그 3개 맨 끝)·태그·고정 댓글·스튜디오 칸·올린 뒤 볼 것). `docs/longform-ep04.md` 를 틀로 쓴다.
2. `docs/episodes.md` 롱폼 표에 한 줄, '수치 근거'에 한 단락. `docs/longform-queue.md` 에서 이 주제를 '완료'로 옮기고 다음 번호를 올린다. 새 교훈은 `CLAUDE.md` 교훈에 한 줄.
3. 업로드 문구 복사 페이지: `python3 longform/tools/make-upload-page.py docs/longform-epNN.md "LF.NN" "<주제 이름>" <mp4 파일명> /tmp/lfNN-upload.html` → Artifact 도구로 게시한다(`icon: clipboard`). 링크를 최종 답변에 넣는다.

## 5. 커밋·푸시·전달
1. 비밀 검사: `git diff --cached | grep -cE '(^|[^A-Za-z0-9_+/=-])AIza[0-9A-Za-z_-]{35}([^A-Za-z0-9_+/=-]|$)'` 가 0 이고 `git diff --cached | grep -F -c "$GOOGLE_TTS_API_KEY"` 도 0 이어야 한다(`AIza` 단순 검색은 음성 base64 에 걸리니 쓰지 않는다). 걸리면 커밋하지 않는다.
2. 커밋 대상: `longform/build-epNN.py`, `epNN-scenes.js`, `epNN-thumbs.js`, `epNN-*.html`(음성 내장, 약 6MB), `.ko.srt`, `docs/*`, `CLAUDE.md`. **MP4·PNG 는 저장소에 넣지 않는다.**
3. `git fetch -q origin claude/clever-cray-tfw7qn && git rebase origin/claude/clever-cray-tfw7qn && git push -u origin claude/clever-cray-tfw7qn`. 실패하면 4번 재시도(2·4·8·16초), 그래도 안 되면 원인을 보고하고 우회하지 않는다.
4. **SendUserFile 로 MP4 + 썸네일 3장 + SRT 를 보낸다**(`status: proactive`, `display: attach`, 캡션에 편 번호·길이). MP4 는 `/tmp/out` 에 두고 보낸다.
5. 최종 답변(한국어, 8줄 이내): 편 번호·제목 3안 중 추천·길이·LUFS, 근거가 약한 숫자(있다면), 업로드 문구 페이지 링크, 대표님이 할 일(업로드·썸네일 테스트 설정).

## 6. 못 만들 때
키가 없거나, 근거 3개를 못 채웠거나, 렌더가 두 번 실패하면: 영상을 억지로 만들지 않는다. `docs/longform-queue.md` 에 그날 날짜와 이유(어떤 주제가 왜 보류인지, 무엇이 필요한지)를 적고 위 5-1~5-3 대로 커밋·푸시한 뒤, 최종 답변에 "오늘 롱폼 못 만듦: 이유 / 대표님이 필요한 것" 을 쓴다. 숫자를 지어내거나 '예시'를 사실처럼 쓰지 않는다.

## 7. 하지 않는 것
- 업로드·예약 공개·댓글 게시는 하지 않는다(대표님이 한다). 영상 다운로드·봇 차단 우회·로그인 우회를 하지 않는다.
- 실존 브랜드 로고·실존 인물 사진을 쓰지 않는다. 투자·창업을 권유하지 않는다(설명란에 "창업 권유 아님" 문구).
- 다른 브랜치 푸시, PR 생성, 기존 편 파일 수정(정정이 꼭 필요한 문구 제외)을 하지 않는다.
