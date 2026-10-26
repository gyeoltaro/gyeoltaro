# 에이전트 오피스

AI 에이전트의 작업 기록을 3D 사무실로 보여 주는 페이지예요. 에이전트마다 책상이 하나씩 있어요. 도구를 쓰면 모니터와 말풍선에 내용이 뜨고, 서브에이전트를 부르면 입구로 새 동료가 들어왔다가 결과를 넘기고 나가요. 작업이 끝나면 색종이가 터지고, 벽 화이트보드에는 세션 상태가 정리돼요.

`index.html` 파일 하나로 돌아가고, 3D는 three.js(CDN)로 그려요.

## 데이터 소스

패널 위쪽의 **데이터 소스**에서 고를 수 있어요.

| 소스 | 언제 쓰나요 | 어떻게 연결되나요 |
|---|---|---|
| 실시간 | claude.ai에서 페이지를 열었을 때 | Claude Code Remote 커넥터로 내 Claude Code 세션 목록과 기록을 읽어요 |
| 실시간 | 내 컴퓨터에서 `bridge.mjs`를 실행했을 때 | 로컬 Claude Code 기록과 다른 에이전트가 보낸 로그를 받아요 |
| 로그 파일 | 지난 기록을 다시 보고 싶을 때 | `.jsonl` 파일을 골라 시간 순서대로 재생해요 |
| 시뮬레이션 | 연결할 게 없을 때 | 가상의 에이전트 여섯 명이 일하는 데모예요 |

### 1. claude.ai에서 실시간으로 보기

claude.ai 아티팩트로 열면 처음에 Claude Code Remote 커넥터를 써도 되는지 물어봐요. 허용하면 이렇게 동작해요.

- 최근 세션 중 일곱 개가 책상에 앉아요. 작업 중인 세션이 먼저 앉아요.
- 세션 목록은 20초마다 새로 가져와요. 작업 중인 세션의 새 기록은 4초마다 가져와요.
- **새 세션에 작업 맡기기**에 할 일을 적고 확인을 누르면 Claude Code 세션이 새로 만들어져요. 실제로 실행되고 사용량이 들어요. 저장소를 고르면 그 저장소를 받아서 일해요.
- 세션 카드의 **세션 열기**를 누르면 claude.ai에서 그 세션으로 가요.

### 2. 내 컴퓨터에서 실시간으로 보기 (로컬 브리지)

Node 18 이상만 있으면 되고, 따로 설치할 건 없어요.

```bash
node agent-office/bridge.mjs
# 브라우저에서 http://localhost:4545 열기
```

- `~/.claude/projects/**/*.jsonl`(Claude Code 대화 기록)을 1초마다 확인해서 새 줄을 사무실로 보내요. 시작할 때는 최근 30분 안에 바뀐 기록만 거슬러 읽어요.
- 도구 결과 본문처럼 큰 내용은 보내지 않고, 화면에 필요한 것만 추려서 보내요.
- 기본으로 `127.0.0.1`에만 열려서 같은 컴퓨터에서만 접속할 수 있어요. 대화 기록에는 민감한 내용이 있을 수 있으니 `HOST=0.0.0.0`으로 바꿀 때는 조심하세요.

| 환경 변수 | 기본값 | 뜻 |
|---|---|---|
| `PORT` | `4545` | 페이지와 이벤트를 여는 포트 |
| `HOST` | `127.0.0.1` | 접속을 받을 주소 |
| `CLAUDE_PROJECTS_DIR` | `~/.claude/projects` | 읽을 Claude Code 기록 폴더 |

### 3. 다른 에이전트의 로그 보내기

어떤 에이전트든 `POST /events`로 JSON을 보내면 사무실에 나타나요. 한 번에 하나를 보내도 되고, 배열로 여러 개를 보내도 돼요.

```bash
curl -X POST http://localhost:4545/events \
  -H 'content-type: application/json' \
  -d '{"agent":"리서처","role":"조사 담당","type":"tool","tool":"web_search","text":"경쟁사 요금제 검색"}'
```

```python
import json, urllib.request

def office(**event):
    req = urllib.request.Request("http://localhost:4545/events", data=json.dumps(event).encode(),
                                 headers={"content-type": "application/json"})
    urllib.request.urlopen(req)

office(agent="리서처", type="prompt", text="경쟁사 요금제 비교표 만들기")
office(agent="리서처", type="handoff", to="작성자", text="조사 결과 넘겨요")
```

| 필드 | 필수 | 뜻 |
|---|---|---|
| `agent` | 예 | 에이전트 이름. 이름마다 책상이 하나씩 생겨요 |
| `type` | 예 | 아래 표의 이벤트 종류 |
| `text` | | 내용. 말풍선과 활동 기록에 보여요 |
| `tool` | | `type`이 `tool`일 때 도구 이름 |
| `input` | | 도구 입력. `file_path`, `command`, `query` 같은 값을 알아서 요약해요 |
| `to` | | `type`이 `handoff`일 때 받는 에이전트 이름 |
| `role` | | 역할 이름. 명단에 보여요 |
| `ts` | | 시각. ISO 문자열이나 밀리초. 없으면 받은 시각을 써요 |

| `type` | 사무실에서 일어나는 일 |
|---|---|
| `prompt` | 새 작업을 받고 자리에 앉아요 |
| `think` | 모니터에 "생각하는 중"이 떠요 |
| `tool` | 모니터와 말풍선에 도구 이름과 내용이 떠요 |
| `message` | 말풍선으로 말해요 |
| `handoff` | 서류를 들고 받는 에이전트 책상까지 걸어가서 넘겨요 |
| `done` | 작업을 끝내고 색종이가 터져요 |
| `error` | 실패로 표시하고 작업을 멈춰요 |

### 4. 로그 파일 재생

**로그 파일**을 고르고 파일을 선택하거나, 3D 화면에 파일을 끌어다 놓으면 돼요. 긴 공백은 짧게 줄여서 재생하고, 속도는 1×, 2×, 4×로 바꿀 수 있어요.

읽을 수 있는 형식은 세 가지예요.

- Claude Code 대화 기록: `~/.claude/projects/프로젝트/세션.jsonl`
- 위 3번의 이벤트 형식으로 한 줄에 하나씩 쓴 JSON Lines. 예시는 [`examples/sample-log.jsonl`](examples/sample-log.jsonl)에 있어요.
- claude.ai Claude Code 세션의 `list_events` 응답을 저장한 JSON

## 조작

- 드래그로 회전, 오른쪽 드래그로 이동, 휠로 확대해요.
- 에이전트나 명단을 누르면 카메라가 그 자리로 가고 상세 정보가 떠요. **카메라로 따라가기**를 켜면 계속 따라가요.
- **회의 소집**을 누르면 모두 회의 테이블에 모여 한 명씩 진행 상황을 말해요.
- 낮과 밤은 시스템 다크 모드를 따라가고, **밤으로/낮으로** 버튼으로 바꿀 수도 있어요.
