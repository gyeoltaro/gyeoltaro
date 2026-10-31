# 쇼츠 묶음 빌더

한 묶음(3편)을 한 파일로 짠다. `build_batch2.py` 의 공용 함수(계산기 장면·커버·`build()`)를 `build_batch3.py` 가 넓히고(제목 띠 `apply_ref`, 비용 칩), 각 묶음 파일이 그 위에 편별 대본·장면을 얹는다.

| 파일 | 편 |
|---|---|
| `build_batch2.py` | EP.04~06 + 공용 함수 (`calc_scene`, `cover`, `build`) |
| `build_batch3.py` | EP.07~09 + 포맷 v2 (`apply_ref`, `chips_grid`, `cashBar`, `dark`) |
| `build_batch4.py` | EP.10~12 |
| `build_batch5.py` | EP.13~15 + 두 숫자 커버 `cover2()`, 비용 장면 `cost_scene()`, 답 숫자 `amount_pop()` |
| `build_batch6.py` | EP.16~18 (미용실·피자집·필라테스). `build_batch5.py` 의 함수를 불러 쓰고, 1,000만 이상 금액에 쉼표를 붙이는 `cost_scene6()` 를 더했다 |
| `build_batch8.py` | EP.22~24 (당구장·인형뽑기방·공부방). `build_batch5.py` 함수 재사용 + `cost_scene6()` |
| `build_batch7.py` | EP.19~21 (개인택시·무인 세탁점·백반집). `build_batch5.py` 함수 재사용 + `cost_scene6()` |

## 새 묶음 만드는 순서
1. 가장 최근 묶음(`build_batch8.py`)을 `build_batch9.py` 로 복사하고 편별 대본(CUES·COSTS)·장면·커버를 바꾼다. **이미 만든 묶음 파일은 다시 돌리지 않는다** — `build()` 가 그 편 html 의 `bundledTTS` 를 비운다.
2. `python3 build_batch9.py` → `shorts/새편.html`
3. 음성: `TTS_KEY="$GOOGLE_TTS_API_KEY" node gen_short.js 새편` → `새편_tts.json` (키는 환경변수로만)
4. 내장: `*_tts.json` 이 있는 폴더에서 `python3 embed6.py 새편1 새편2 새편3` (slug 를 인자로 받는다) → html 의 `bundledTTS` 에 들어간다. 음성 JSON 은 저장소 밖에 두면 커밋에 섞이지 않는다
5. 점검: `node shootany.js 새편 출력폴더 1 3 6 …` (커버 + 시점별 프레임)
6. 렌더: 저장소 루트에서 `node shorts/render-mp4.js shorts/새편.html 결과.mp4`
