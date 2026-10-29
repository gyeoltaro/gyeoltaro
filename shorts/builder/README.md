# 쇼츠 묶음 빌더

한 묶음(3편)을 한 파일로 짠다. `build_batch2.py` 의 공용 함수(계산기 장면·커버·`build()`)를 `build_batch3.py` 가 넓히고(제목 띠 `apply_ref`, 비용 칩), 각 묶음 파일이 그 위에 편별 대본·장면을 얹는다.

| 파일 | 편 |
|---|---|
| `build_batch2.py` | EP.04~06 + 공용 함수 (`calc_scene`, `cover`, `build`) |
| `build_batch3.py` | EP.07~09 + 포맷 v2 (`apply_ref`, `chips_grid`, `cashBar`, `dark`) |
| `build_batch4.py` | EP.10~12 |
| `build_batch5.py` | EP.13~15 + 두 숫자 커버 `cover2()`, 비용 장면 `cost_scene()`, 답 숫자 `amount_pop()` |

## 새 묶음 만드는 순서
1. `build_batch5.py` 를 `build_batch6.py` 로 복사하고 편별 대본(CUES·COSTS)·장면·커버를 바꾼다. **이미 만든 묶음 파일은 다시 돌리지 않는다** — `build()` 가 그 편 html 의 `bundledTTS` 를 비운다.
2. `python3 build_batch6.py` → `shorts/새편.html`
3. 음성: `TTS_KEY="$GOOGLE_TTS_API_KEY" node gen_short.js 새편` → `새편_tts.json` (키는 환경변수로만)
4. 내장: `embed5.py` 의 slug 목록을 바꿔 실행 → html 의 `bundledTTS` 에 들어간다
5. 점검: `node shootany.js 새편 출력폴더 1 3 6 …` (커버 + 시점별 프레임)
6. 렌더: 저장소 루트에서 `node shorts/render-mp4.js shorts/새편.html 결과.mp4`
