[매일 아침 일일 조사] 사용자는 휴대폰으로 보니 한국어로 짧게 보고하세요. 영상은 만들지 말고, 사용자 확인을 받은 뒤에만 제작합니다. 이 세션은 예약 작업 실행기가 오늘 새로 만든 세션이라 이전 대화 기억이 없어요. 영상 제작은 '유튜브 만화 영상 - 잠실이 (이어서)' 세션에서 하고, 스튜디오 페이지에서 후보를 고르면 그 세션으로 전달돼요.

1) 작업 저장소는 gyeoltaro/gyeoltaro.github.io 다. 브랜치 ccr-8dbdba93-q9kqwv 최신화(git fetch/pull). pip 패키지(pillow edge-tts numpy) 없으면 설치. API 키 값은 절대 출력하지 말 것.
2) python3 studio/tools/research.py channel @jamsili --n 50 → 어제 보고서(studio/research/daily/ 최신 파일)와 비교해 구독자·조회·영상별 변화(특히 최근 쇼츠의 완결형 vs 예고형 성과, 좋아요·댓글율, 쇼츠→롱폼 전환)를 정리.
3) python3 studio/tools/research.py topic "감동사연" --days 7 --n 50 --shorts (요일마다 "시니어사연", "사연툰", "가족사연" 등 키워드를 바꿔 가며) → 하루 조회 상위 2~3개는 research.py video 로 왜 터졌는지(길이·제목·주제·댓글) 분석.
4) studio/research/daily/YYYY-MM-DD.md 에 보고서 작성(우리 채널 변화 / 터진 영상과 공통점 / 우리가 바꿀 것 / 다음 영상 후보 2~3개: 제목·한 줄 줄거리·타깃). data.json·report.md 는 커밋하지 않음(gitignore). 보고서만 커밋·푸시.
5) 스튜디오 페이지(https://claude.ai/artifact/G41NizqsrBJA2FUtFrUZsw) DB에 ArtifactData batch 로 기록: reports/YYYY-MM-DD (date,title,headline,channel{subs,views,shortsMedian,likeRate,benchLike},summary[],ours[],viral[{title,url,subs,views,ratio,dur,why}],commons[],changes[]), stats/YYYY-MM-DD {subs,views}, videos/<slug> 의 views·status 갱신. 아직 아무도 고르지 않은(status open) 후보가 있으면 그대로 두고, 없으면 새 후보를 candidates/ep<N>-<A|B|C> {ep,key,title,plot,target,recommended,status:"open",report} 로 추가. 기존 문서는 먼저 읽고 if_version 으로 수정.
6) 채팅에 핵심만 5~8줄로 요약하고 "스튜디오 페이지에서 후보를 골라 주세요"라고 안내하세요. 사용자가 고르기 전에는 제작하지 마세요.
