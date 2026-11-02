# 부의비상사태 911 — 롱폼 영상 제작 파이프라인

**기획 → 대본 → TTS → 영상(움직이는 캐릭터 애니메이션) → 자막 → 썸네일 → 업로드 정보**를
명령 한 번으로 만드는 도구입니다.

```
youtube/
├─ docs/
│  ├─ 01_channel_analysis.md     벤치마크(유치한경제학) vs 내 채널 분석, 성장 전략
│  └─ 02_youtube_policy_2026.md  2025~2026 바뀐 유튜브 규정 + 대응 + 업로드 체크리스트
├─ episodes/
│  └─ ep01_inflation/
│     ├─ 01_plan.md        기획서 (구성표, 사실 확인표)
│     ├─ 02_script.json    대본 + 연출 (장면·캐릭터 표정·애니메이션 타이밍)
│     ├─ 02_script.md      사람이 읽기 좋은 대본 (빌드 시 자동 생성, 타임코드 포함)
│     ├─ 03_upload.md      제목·설명란·챕터·태그·고정댓글·스튜디오 체크리스트 (자동 생성)
│     ├─ voice/            (선택) 본인 녹음 파일: s01_01.wav 처럼 문장 ID로 저장하면 TTS 대신 사용
│     └─ out/              video.mp4, subtitles.srt, thumbnail_A/B/C.png, upload.json, stills/
├─ studio/                 제작 엔진 (Python)
│  ├─ mascot.py            대표 캐릭터 벡터 퍼펫 (립싱크·눈깜빡임·표정 7종·팔 동작·걷기·점프·모자 인사)
│  ├─ visuals.py           장면 애니메이션 20종 (카운터, 그래프, 시소, 순환도, 가격표, 돈 찍는 기계 …)
│  ├─ tts.py               음성 합성 (edge-tts, 캐시 / 본인 녹음 대체)
│  ├─ timeline.py          대본+음성 → 장면 타이밍, 단어 단위 자막 싱크, 효과음 이벤트
│  ├─ audio.py             립싱크 곡선, 효과음·배경음 직접 합성(저작권 걱정 없음), 믹싱
│  ├─ render.py            프레임 렌더링 + 병렬 인코딩 (1080p 30fps, -14 LUFS)
│  ├─ thumbnail.py         썸네일 3종 (A/B 테스트용)
│  └─ build.py             전체 실행
└─ assets/
   ├─ brand/mascot_original.jpg   대표 이미지 원본
   └─ fonts/                       Black Han Sans, Gothic A1 등 (OFL, 상업 이용 가능)
```

## 설치

```bash
sudo apt install ffmpeg libcairo2-dev pkg-config   # macOS: brew install ffmpeg cairo pkg-config
```

```bash
pip install -r youtube/requirements.txt
```

## 사용법

```bash
cd youtube
```

```bash
python -m studio.build episodes/ep01_inflation --stills
```
장면마다 미리보기 PNG 한 장씩 `out/stills/`에 만듭니다(약 15초). 대본을 고칠 때마다 먼저 이걸로 확인하세요.

```bash
python -m studio.build episodes/ep01_inflation --range 0 60
```
0~60초 구간만 `out/preview.mp4`로 만듭니다(소리·움직임 검수용).

```bash
python -m studio.build episodes/ep01_inflation
```
전체 영상을 `out/video.mp4`로 만듭니다(4코어 기준 15분 영상에 약 7~8분).

## 새 에피소드 만들기

1. `episodes/ep01_inflation`을 복사해 `episodes/ep02_interest`로 이름을 바꿉니다.
2. `01_plan.md`에 기획을 씁니다(주제, 타깃, 구성표, 사실 확인표).
3. `02_script.json`의 `scenes`를 새로 씁니다. 장면 하나는 아래처럼 구성합니다.

```json
{
  "id": "s05", "chapter": "PART 1. 금리란?",
  "mascot": {"layout": "left", "pose": "present", "emotion": "happy", "screen": "percent",
             "at": {"2": {"emotion": "surprised"}}, "hop": [2]},
  "visual": {"type": "counter", "label": "대출 1억, 금리 1%p 오르면", "from": 0, "to": 100,
             "unit": "만 원", "at": 1, "sub": "1년 이자 +100만 원", "sub_at": 2},
  "lines": ["문장 1", "문장 2", {"text": "자막에 보일 글자 911", "say": "읽을 발음 구일일"}]
}
```

- `at`: 몇 번째 문장(0부터)에서 등장할지 정합니다. `1.5`면 두 번째 문장의 절반 지점입니다. `-1`이면 처음부터 보입니다.
- `layout`: `left` · `right` · `corner`(작게, 그래프용) · `chapter`. 장면이 바뀌면 캐릭터가 걸어서 이동합니다.
- `emotion`: `neutral` · `happy` · `surprised` · `worried` · `angry` · `smug` · `shock`
- `pose`(태블릿 든 팔): `hold` · `present` · `up` · `look` · `down` / `arm_l`(가방 든 팔): `carry` · `lift` · `panic`
- `screen`(태블릿 화면): `logo` · `up` · `down` · `won` · `alert` · `percent`
- 텍스트 강조: `*노랑*`, `^빨강^`, `~초록~`, `` `파랑` ``
- 장면 종류(`visual.type`): `title` `chapter` `keytext` `list` `compare` `counter` `bars` `line` `apples`
  `cart` `gauge` `seesaw` `flow` `cycle` `printer` `pricetag` `banknote` `ripple` `shrink` `outro`

## 내 목소리로 바꾸기 (권장)

수익화를 생각한다면 본인 녹음이 가장 안전합니다. 정책 위험(AI 페르소나)과 라이선스 위험이 모두 사라집니다.

1. `02_script.md`를 보고 문장별로 녹음합니다.
2. `episodes/ep01_inflation/voice/s01_01.wav`, `s01_02.wav` … 처럼 문장 ID로 저장합니다.
3. 다시 빌드하면 녹음 파일이 있는 문장은 TTS 대신 녹음을 쓰고, 입 모양도 그 목소리에 맞춰 움직입니다.

TTS 음성과 속도는 `02_script.json`의 `meta.voice`, `meta.rate`에서 바꿀 수 있습니다.
기본값은 `ko-KR-InJoonNeural`, `+8%`입니다.
