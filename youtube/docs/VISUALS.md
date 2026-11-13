# 그림 종류 설명서 (VISUALS)

> 대본(`script.py`)의 장면마다 그림 종류 하나를 고릅니다. 이 문서는 종류별 쓰임·옵션·예시입니다.
> **생김새**는 [`visuals/gallery_1.jpg`](visuals/gallery_1.jpg) · [`gallery_2.jpg`](visuals/gallery_2.jpg) · [`gallery_3.jpg`](visuals/gallery_3.jpg) 에 종류 이름표와 함께 모아 두었습니다(먼저 열어 보세요).
> **실제로 쓴 예시**는 `python -m studio.ep example <종류>` 로 볼 수 있고, 표준 예시는 `episodes/ep13_qe_qt/script.py` 입니다.
> 그림을 새로 추가하거나 바꾸면 `python -m studio.ep gallery` 로 모아보기를 다시 만듭니다.

## 1. 장면 하나의 모양

```python
add({"type": "flow", "title": "제목", "nodes": [{"text": "첫 단계", "at": "@0:먼저"}, {"text": "결과", "at": "@1:결과"}]},   # 그림
    ["먼저 이런 일이 생깁니다.", "그 결과는 이렇습니다."],                                                              # 내레이션 (줄 0, 줄 1)
    M("left", "present", "neutral", "percent"))                                                                      # 캐릭터
```

- **등장 시점 `at`**: `"@줄번호:낱말"` — 그 줄에서 그 낱말이 나오는 순간. 줄 번호는 0부터. `-1` 은 처음부터 보임.
- **색**: `white` `grey` `yellow` `red` `green` `blue` `orange` `purple` (보드 색 `card` `card2`).
- **글자 안 색 표시**: `*노랑*` `^빨강^` `~초록~` `` `파랑` ``. 그래서 화면 글자에 물결표를 쓰면 안 됩니다(`add()` 가 `–` 로 바꿔 줌).
- **`shake_at`**: 그림 설정에 `"shake_at": ["@0:9조"]` 를 넣으면 그 순간 화면이 한 번 흔들립니다(큰 숫자에만).
- 대부분의 종류에 `title`(위 제목)과 `title_color` 가 있습니다. 긴 제목은 자동으로 작아집니다.

### 도우미 함수 (`studio/epkit.py`)

| 함수 | 쓰임 |
|---|---|
| `add(그림, 문장들, M(...), chapter=None, env=None)` | 장면 추가. `chapter` 를 주면 거기서 새 파트 시작 |
| `chap("PART 1", "제목", "한 문장")` | 파트 시작 카드(노란 테이프) |
| `stage(문장들, props=[P(...)], bubble=, label=, label_at=, emo=, env=)` | 이야기 장면 |
| `P(아이콘, at, 글자)` | 이야기 장면의 소품 |
| `kin([K(...), ...], title=)` · `K(글자, 크기, at, color=, slam=True, box="card2")` | 큰 글자 장면 |
| `grid(제목, [G(...), ...], cols=)` · `G(아이콘, 글자, at, 작은글자, 색)` | 아이콘 카드 |
| `M(layout, pose, emotion, screen, hop=[줄], hat=True)` | 캐릭터 |
| `finish(__file__, META)` | 맨 끝에서 저장 |

## 2. 캐릭터 `M(...)`

| 항목 | 값 |
|---|---|
| `layout` (자리) | `left`(왼쪽, 그림은 오른쪽) · `right` · `corner`(오른쪽 아래 작게, 넓은 그림용) · `center` · `chapter` · `stage` · `none` |
| `pose` (태블릿 든 팔) | `hold` · `present`(가리키기) · `up` · `look` · `down` |
| `emotion` (표정) | `neutral` · `happy` · `surprised` · `worried` · `angry` · `smug` · `shock` |
| `screen` (태블릿 화면) | `logo` · `up` · `down` · `won` · `alert` · `percent` · `none` |
| `hop` | `[1]` → 줄 1이 시작될 때 폴짝 |
| `hat` | `True` → 모자 인사 (제목 장면·아웃트로) |
| `at` | `{"1": {"emotion": "surprised"}}` → 줄 1부터 표정 바꾸기 |

넓은 그림(compare·timeline·bars·line·ticker·balance·waterfall)은 `corner`, 나머지는 `left`·`right` 를 번갈아 씁니다.

## 3. 장소 배경과 전환 (스토리 룩)

- `META["look"] = "story"` (기본값). 장소: `office` `city` `bank` `home` `study` `market` `night`.
- `META["envs"] = [...]` 에 적은 순서대로 **파트가 바뀔 때마다** 장소가 바뀝니다. 한 장면만 다르게 하려면 `add(..., env="bank")` 또는 `stage(..., env="bank")`.
- 정보 그림은 자동으로 어두운 보드 위에 올라갑니다. `stage`·`chapter` 는 보드 없이 장소 위에 바로 그려집니다.
- 장면 전환은 자동으로 돌아가며 바뀝니다(밀기·확대·닦기·원형·위로). 한 장면만 정하려면 `add(..., trans="iris")` (`slide` `zoom` `wipe` `iris` `slideup`).
- 장면 길이 조절(드물게): `add(..., tail=1.0)` 끝 여백(초), `min_dur=5` 최소 길이.

## 4. 아이콘 이름

`won` `rate` `chart_up` `chart_down` `check` `x` `q` `warn` `news` `calendar` `clock` `pause` `person` `house` `factory` `cart` `bowl` `phone` `bus` `chip` `server` `bolt` `water` `bubble` `vote` `flag_kr` `flag_us`

이 목록에 없는 이름은 점검이 오류로 잡습니다. (`list`·`compare` 의 `icon` 은 아이콘이 아니라 `"•"` `"+"` `"-"` 같은 글자입니다.)

## 5. 그림 종류

### 5-1. 뼈대 장면

**`title`** — 제목 장면. 인트로에서 한 번.
```python
{"type": "title", "badge": "EP.13", "top": "초등학생도 이해하는", "main": "양적완화와 긴축의 모든 것", "main_at": 1, "main_size": 84, "sub": "기초 경제 시리즈", "sub_at": 2}
```
`main` 이 12자를 넘으면 `main_size` 를 84~100으로 줄입니다(기본 130).

**`chapter`** — 파트 시작 카드. `chap("PART 1", "제목(16자 이내)", "한 문장")` 으로 씁니다.

**`outro`** — 마지막 장면(다음 편·구독 화면). `{"type": "outro", "next": "다음 편 · 스태그플레이션의 모든 것"}`

**`stage`** — 이야기 장면. 캐릭터가 크게 서서 말풍선 한마디, 소품 2~3개, 아래 큰 한마디.
```python
stage(["첫 문장 … 돈을 풀었다면 …", "둘째 문장 … 크게 올랐 …"],
      props=[P("won", "@0:돈을 풀었다면", "돈 풀기"), P("chart_up", "@1:크게 올랐", "2020년대 물가")],
      bubble="돈을 풀었는데 왜?", label="같은 돈 풀기, 다른 결과", label_at="@1:같은", emo="surprised", env="office")
```
말풍선·큰 한마디 18자 이내, 소품 3개까지·글자 10자 이내. 소품 위치를 바꾸려면 `P(..., x=, y=, s=)`.

### 5-2. 글자 중심

**`kinetic`** — 큰 글자가 차례로 찍힘. 정의·이름 풀이·오해 바로잡기.
```python
kin([K("양적", 120, "@0:양적", color="yellow", slam=True), K("= 돈의 '양'을", 64, "@0:양을", color="white"),
     K("그래서 비유일 뿐", 52, "@1:비유", color="green", box="card2")], title="이름 풀이")
```
3~4줄까지. 크기 합이 너무 크면 넘칩니다(120+64+120+64 정도가 한계).

**`keytext`** — 조용한 글 몇 줄(인용·수치 나열). `{"type": "keytext", "title": "연준 성명 (날짜)", "lines": [{"text": "물가는 여전히 *높은 수준*", "size": 64, "at": "@0:물가"}]}`

**`list`** — 번호 목록(요약·체크리스트). 5줄까지.
```python
{"type": "list", "title": "5줄 요약", "items": [{"text": "요약 1", "at": "@1:하나"}, {"text": "내 몫: 점검", "at": "@3:내 몫", "color": "green"}]}
```

**`stamps`** — 줄마다 오른쪽에 도장이 찍힘. 파트 요약·퀴즈·뉴스 읽는 법. 5줄까지, 도장 글자 8자 이내.
```python
{"type": "stamps", "title": "PART 1 요약", "rows": [{"text": "정의 한 줄", "stamp": "정의", "color": "blue", "at": "@0:정리하면"}]}
```

**`icongrid`** — 아이콘 카드 2~6개. 질문 정리·순서·용어 사전·점검 질문.
```python
grid("오늘의 세 가지 질문", [G("won", "① 9조 달러는 어디서?", "@0:첫째", "양적완화의 원리", "yellow"), G("q", "② 왜 물가가 늦게?", "@0:둘째", None, "blue")], cols=3)
```
카드 글자 20자, 작은 글자 24자 이내.

### 5-3. 비교·관계

**`compare`** — 왼쪽·오른쪽 두 칸 비교. 칸마다 3줄까지.
```python
{"type": "compare", "left": {"title": "기준금리 인하", "color": "blue", "at": "@0:기준금리", "items": [{"text": "'가격'을 낮춤", "icon": "•", "at": "@0:가격"}]},
 "right": {"title": "양적완화", "color": "green", "at": "@1:양적완화는", "items": [{"text": "'양'을 늘림", "icon": "+", "at": "@1:양을"}]}}
```

**`balance`** — 저울. 양쪽 주장(논쟁)을 같은 무게로 보여 줄 때. `level_at` 을 주면 수평으로 돌아옵니다.
```python
{"type": "balance", "title": "평가 (양쪽 주장)", "left": {"title": "도움이 됐다", "color": "green", "items": [{"text": "금융시장 붕괴를 막음", "at": "@0:막"}]},
 "right": {"title": "부작용이 컸다", "color": "red", "items": [{"text": "자산 가격을 크게 올림", "at": "@1:자산"}]}, "verdict": "효과와 부작용이 함께 있다", "verdict_at": "@2:함께"}
```
칸마다 3줄까지. 글자가 길면 넘칩니다(한 줄 14자 안팎).

**`seesaw`** — 시소가 기울어짐(수요·공급, 물가·경기). `{"type": "seesaw", "title": "…", "left": "사려는 돈", "right": "물건", "left_kind": "coin", "left_from": 3, "left_to": 12, "right_from": 3, "right_to": 3, "tilt_to": -14, "at": "@1:늘어", "result": "수요 > 공급 → 가격 상승", "result_at": "@2:가격"}` — `left`·`right` 글자에 줄 바꿈을 넣지 않습니다.

**`worldflow`** — 두 나라 사이로 신호가 건너감(미국 발표 → 한국 시장).
```python
{"type": "worldflow", "title": "미국 고용 → 한국 시장", "left": {"label": "미국", "flag": "flag_us", "time": "고용보고서", "note": "금리 전망 변화", "color": "blue", "at": "@0:미국"},
 "right": {"label": "한국", "flag": "flag_kr", "time": "다음 거래일", "note": "환율·주가", "color": "red", "at": "@1:한국"}, "flow_at": "@0:건너", "flow_label": "달러 금리", "signal_icon": "won", "result": "그래서 지켜본다", "result_at": "@2:그래서"}
```

### 5-4. 순서·흐름·시간

**`flow`** — 화살표로 이어지는 단계(4~5개). `{"type": "flow", "title": "…", "color": "blue", "nodes": [{"text": "첫 단계", "at": "@0:먼저"}, {"text": "결과", "at": "@1:결과", "color": "yellow"}]}` — 칸 글자는 18자 안팎.

**`cycle`** — 돌고 도는 순환(악순환·선순환). `{"type": "cycle", "title": "…", "color": "blue", "center": "디플레이션", "nodes": [{"text": "소비 미루기", "at": "@1:미루"}]}` — 4칸.

**`dominoes`** — 도미노가 차례로 넘어짐(연쇄 효과). 4~5개, 글자 20자 이내. `{"type": "dominoes", "title": "…", "items": [{"text": "은행 준비금 ↓", "at": "@0:준비금"}, {"text": "그래서 멈춤", "color": "yellow", "at": "@1:멈"}]}`

**`timeline`** — 연표. 사건 5개까지(위아래로 번갈아 놓임).
```python
{"type": "timeline", "title": "…", "events": [{"date": "2022년 6월", "label": "양적긴축 시작", "sub": "자산 줄이기", "icon": "chart_down", "color": "red", "at": "@0:2022년 6월"}]}
```
`date` 12자, `label` 15자, `sub` 18자 이내.

**`calendar`** — 날짜 카드(발표 일정). `{"type": "calendar", "title": "…", "days": [{"d": "18", "wd": "12월", "note": "개편 결과 공표", "color": "yellow", "mark": True, "at": "@0:18일"}], "note": "아래 한 줄", "note_at": "@1:기준"}` — 4장까지.

### 5-5. 숫자

**`counter`** — 큰 숫자가 올라감. 인트로의 첫 장면에 자주 씁니다.
```python
{"type": "counter", "label": "미국 연준이 가진 자산 (2022년 정점)", "label_size": 42, "from": 0, "to": 8.9, "unit": "조 달러", "decimals": 1,
 "at": 0.15, "dur": 1.8, "bar": False, "sub": "약 1경 2천조 원 (환율 1,350원 가정)", "sub_at": "@1:1경", "shake_at": ["@0:8조 9천억"]}
```

**`bars`** — 막대 비교(5개까지). `{"type": "bars", "title": "… (단위·기준)", "unit": "조$", "decimals": 1, "items": [{"label": "2007년", "value": 0.9, "color": "grey", "at": "@0:2007"}]}` — 막대 이름 22자 이내.

**`line`** — 꺾은선. `{"type": "line", "title": "…", "ymin": 0, "ymax": 5000, "yticks": [1000, 2000], "xticks": [[0, "지금"], [10, "10년"]], "series": [{"name": "복리", "color": "green", "points": [[0, 1000], [30, 4322]], "at": "@0:복리"}]}` — `right_pad` 로 오른쪽 이름표 자리를 넓힙니다.

**`waterfall`** — 시작값에서 더하고 빼며 끝값까지(계산 과정). `{"type": "waterfall", "title": "…", "start": 2926.6, "start_label": "취업자", "start_at": "@0:취업자", "decimals": 1, "steps": [{"label": "+ 실업자", "delta": 60.0, "at": "@0:실업자"}], "end_label": "경제활동인구", "end_at": "@1:합치면", "note": "실업률 = 60 ÷ 2,986.6 ≈ 2.0%", "note_at": "@1:실업률"}`

**`ticker`** — 시세판(4줄까지). `chg`(퍼센트)를 주면 오름 초록·내림 빨강 표시, `chg_label` 로 글자를 직접 쓸 수 있습니다.
```python
{"type": "ticker", "title": "11월 6일 마감", "rows": [{"name": "코스피", "value": 5059.69, "decimals": 2, "chg": -6.02, "icon": "flag_kr", "at": "@0:코스피"}]}
```

**`donut`** — 도넛 그래프(구성 비율, 3조각까지). `{"type": "donut", "title": "…", "segments": [{"label": "미국 국채", "value": 65, "color": "blue", "at": "@0:국채"}], "center": "QE", "center_sub": "비율은 예시", "center_at": "@1:예시"}` — 조각 이름은 짧게(작은 글자 `sub` 를 함께 쓰면 겹칠 수 있음).

**`gauge`** — 계기판 바늘. `{"type": "gauge", "label": "물가안정 목표", "value": 2, "max": 10, "at": "@1:2%", "sub": "0%가 아니라 *2%*", "sub_at": "@2:아니라"}`

### 5-6. 소품 장면 (주제가 맞을 때만)

| 종류 | 쓰임 | 핵심 옵션 |
|---|---|---|
| `apples` | 같은 돈으로 살 수 있는 양이 줄어듦 | `bill`, `from`, `to`, `label_before`, `label_after`, `caption` |
| `cart` | 장바구니 물가지수 | `label`, `from`, `to`, `badge`, `caption` |
| `pricetag` | 가격표 숫자가 바뀜 | `item`, `from`, `to`, `unit`, `y1`, `y2`, `caption` |
| `shrink` | 값은 그대로, 양이 줄어듦 | `name`, `from_g`, `to_g`, `price`, `unit_from`, `unit_to` |
| `printer` | 돈 찍는 기계 | `label`, `value`, `sub` |
| `banknote` | 큰 숫자가 적힌 지폐 | `country`, `value`, `unit`, `badge`, `caption` |
| `ripple` | 물결처럼 퍼지는 순서 | `center`, `rings: [{text, at}]` |
| `bubble` | 풍선이 부풀다 터짐 | `bubbles: [{label, sub, color, at, pop_at}]` (3개까지) |
| `breaker` | 차단기가 내려감(거래 중단) | `trip_at`, `minutes`, `stamp`, `sub`, `notes` |
| `datacenter` | 데이터센터 → 전기·물 → 마을 | `steps: [{text, at}]` (EP.09 전용에 가까움) |

정확한 모양은 `python -m studio.ep example <종류>` 로 실제 장면을 보세요.

## 6. 썸네일 (`META["thumbnails"]`)

A·B·C 세 장. 기본 구도는 `scene` 입니다.

```python
"A": {"layout": "scene", "scene": "gold", "quote": "미국 중앙은행이 가진 돈", "num": "9조 달러", "top": "이 엄청난 돈은",
      "main": "다 어디서 왔을까?", "chart": "up", "screen": "won", "emotion": "shock"}
```

| 옵션 | 뜻 |
|---|---|
| `scene` | 배경색: `city`(주황) · `dawn`(파랑) · `gold`(노랑) · `mint`(초록) · `rose`(분홍). 세 장을 서로 다르게 |
| `quote` | 왼쪽 위 작은 한마디 |
| `num` | 큰 숫자·낱말 하나 (6자 안팎). `num_size`, `num_color` 로 조절 |
| `top` / `main` | 아래 두 줄: 흰색 / 노란색 (12자 안팎, 길면 자동으로 작아짐) |
| `chart` | 큰 추세 화살표: `up` · `down` |
| `screen` / `emotion` | 캐릭터의 태블릿 화면과 표정 |
| `money` | `False` 면 지폐·동전을 뺌 |

다른 구도(어두운 배경): `classic` · `bignum` · `split` · `zoom` · `banner` · `duo` · `hero` · `split2`. 연구 결과 밝은 `scene` 이 기준에 가장 가깝습니다(`learning/thumbnail_study.md`). 수치 점검:
```bash
python -m studio.thumbcheck episodes/ep13_qe_qt/out/thumbnail_A.png
```

## 7. 업로드 정보 (`META["upload"]`)

| 항목 | 내용 |
|---|---|
| `intro` | 설명란 첫 문단. 첫 줄 `※ ○월 ○일 기준 …`, 이어서 내용 2~3문장, 끝에 "전망하지 않으며 투자를 권하지 않습니다" |
| `sources` | 출처 3개 이상. 기관·문서·날짜·인용한 숫자. 가정은 `※ … 가정입니다` |
| `tags` | 8~20개 |
| `hashtags` | 3개 |
| `pinned` | 고정 댓글: 기준일 + 질문 하나 + "(투자 권유·시장 전망이 아닌 정보 공유 목적입니다)" |
| `alt_titles` | 제목 B, C (`TITLES[1:]`) |

목차(챕터)·AI 사용 고지·투자 권유 아님 안내는 자동으로 붙습니다.

## 8. 알려진 한계

- 그림은 모두 코드로 그립니다. 사진·AI 이미지는 쓰지 않습니다.
- 이야기 장면의 캐릭터는 서 있는 자세 하나입니다(앉기·걷기 연기는 없음).
- 한 화면에 글자가 많으면 자동으로 작아지긴 하지만 읽기 어려워집니다. 항목 수를 줄이고 장면을 나누는 쪽이 좋습니다.
- 미리보기(`stills`)는 장면 길이의 80% 시점이라 늦게 나오는 요소는 안 보일 수 있습니다. 의심되면 `--range` 로 그 구간을 렌더링해 봅니다.
