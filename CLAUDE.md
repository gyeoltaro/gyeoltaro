# 이 저장소에서 일하는 법

주된 작업은 `youtube/` 폴더의 유튜브 채널 **「부의비상사태 911」** 영상 제작입니다.
기획 → 사실 확인 → 대본 → 음성 → 영상 → 자막 → 썸네일 → 업로드 자료까지 만들고, 채널 주인이 직접 유튜브에 올립니다.
(루트의 `index.html` 은 이 작업과 상관없는 페이지입니다. 건드리지 않습니다.)

## 먼저 읽기

1. `youtube/docs/STATUS.md` — 지금 어디까지 했고 다음이 무엇인지, 채널 주인의 답을 기다리는 일
2. `youtube/docs/PLAYBOOK.md` — 한 편을 만드는 순서·규칙·실수 모음. **이 순서대로 합니다**
3. `youtube/docs/VISUALS.md` — 그림 종류와 옵션 (생김새는 `youtube/docs/visuals/*.jpg`)
4. `youtube/docs/04_benchmark.md` — 잘 되는 채널 10곳 조사와 적용할 점

표준 예시는 `youtube/episodes/ep13_qe_qt/script.py` 입니다.

## 명령 (`youtube/` 폴더에서)

```bash
python -m studio.ep status                       # 전체 편과 다음 번호
python -m studio.ep new 14 stagflation           # 새 편 폴더 (대본 틀·기획서 틀)
python -m studio.ep script  episodes/ep14_…      # 대본 만들기 + 음성 합성 + 길이 계산
python -m studio.ep check   episodes/ep14_…      # 자동 점검 — 오류 0개가 될 때까지
python -m studio.ep stills  episodes/ep14_…      # 장면 미리보기 → 모아보기 그림을 눈으로 검수
python -m studio.ep render  episodes/ep14_…      # 전체 렌더링 (15~25분, 백그라운드)
python -m studio.ep verify  episodes/ep14_…      # 완성본 검사 + 보내기용 파일
python -m studio.ep package episodes/ep14_…      # 업로드 페이지·업로드 센터
python -m studio.ep precommit                    # 커밋 직전 검사 (API 키·큰 파일)
python -m studio.ep example timeline             # 그림 종류의 실제 사용 예시
python -m studio.benchmark topic "키워드"         # 주제 조회 (API 키 필요)
```

## 반드시 지킬 것

- **사실**: 영상의 모든 숫자·날짜는 `01_plan.md` 사실 확인표에 출처와 함께 적습니다. 지금 값은 기억으로 쓰지 않고 검색해서 원문을 확인합니다. 확인 못 한 것은 ⚠️ 표시를 하고 영상에서 "약·보도에 따르면"으로 완충하거나 뺍니다.
- **전망·권유 금지**: 시장·정책의 앞날을 말하지 않고, 사라/팔라고 하지 않습니다. 영상 안에 "전망하지 않습니다"가 들어갑니다.
- **자극 금지**: 충격·소름·긴급·무조건 같은 말, 공포 예고, 과장을 쓰지 않습니다.
- **편마다 새로**: 같은 틀에 낱말만 바꾼 영상을 만들지 않습니다. 남의 영상·그림·대본을 쓰지 않습니다.
- **비밀**: API 키를 출력하거나 대화에 적거나 커밋하지 않습니다. 커밋 전에 `python -m studio.ep precommit`. 채널 주인의 개인 정보를 바깥 서비스에 보내지 않습니다.
- **저장소 글**: 코드·문서·주석에 특정 AI 모델의 이름을 적지 않습니다.
- **먼저 묻기**: 풀 리퀘스트, 이미 공개된 편 다시 만들기, 예약 작업 켜기, 바깥 게시는 채널 주인이 요청할 때만.
- `check` 의 오류가 남아 있으면 렌더링하지 않습니다. 미리보기를 눈으로 보지 않고 렌더링하지 않습니다.

## 채널 주인과 일하는 법

- 보고는 **쉬운 한국어**로 짧게. 개발 용어·영어 약자를 쓰지 않습니다.
- 진행 중에 긴 설명을 여러 번 보내지 않고, 끝났을 때 파일(영상·자막·썸네일)과 함께 한 번에 보고합니다.
- 잘 안 된 것, 확인 못 한 것, 한계를 숨기지 않습니다. 수익이나 조회수를 장담하지 않습니다.
- 사용량에 민감합니다. 불필요한 재렌더링이나 보조 작업자 띄우기를 하지 않습니다.
- 영상은 30분 안팎(길수록 좋음, 단 진짜 내용으로), 제목·썸네일은 A/B/C 세 가지를 서로 다른 각도로.
- 일을 끝내면 `youtube/docs/STATUS.md` 를 고치고 커밋·푸시합니다.
