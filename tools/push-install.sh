#!/usr/bin/env bash
# 태권도 통합 관리 · 앱 푸시 서버 프로그램 설치
# Google Cloud Shell(https://shell.cloud.google.com) 검은 창에 아래 한 줄을 붙여 넣으면 돼요:
#   curl -fsSL https://awoolimtkd.github.io/push-server/install.sh | bash
# Cloud Shell은 관장님 구글 계정으로 이미 로그인되어 있고 Firebase 도구도 깔려 있어요.
# 프로젝트 ID를 직접 주려면: ... | bash -s -- 프로젝트ID
# (tools/deploy.mjs 가 이 파일을 앱 주소의 push-server/install.sh 로 올려요)
set -uo pipefail

SITE="${TKD_SITE:-https://awoolimtkd.github.io}"
DIR="${TKD_DIR:-$HOME/tkd-push}"
WAIT="${TKD_RETRY_WAIT:-180}"
TRIES=5

say() { printf '\n\033[1m%s\033[0m\n' "$*"; }
fail() { printf '\n\033[31m✗ %s\033[0m\n\n' "$*"; exit 1; }
ask() { local a; read -r -p "$1" a < /dev/tty || true; printf '%s' "$a"; }

say "▶ 태권도 통합 관리 · 앱 푸시 서버 프로그램 설치를 시작해요"
command -v node >/dev/null && command -v npm >/dev/null || fail "Node.js가 없어요. Google Cloud Shell에서 실행해 주세요."

# 1. 도장 Firebase 프로젝트 고르기 (구글 계정에 프로젝트가 하나뿐이면 묻지 않아요)
PROJECT="${1:-}"
if [ -z "$PROJECT" ]; then
  mapfile -t LIST < <(gcloud projects list --format='value(projectId)' 2>/dev/null)
  if [ "${#LIST[@]}" -eq 1 ]; then
    PROJECT="${LIST[0]}"
  else
    if [ "${#LIST[@]}" -gt 1 ]; then echo "이 구글 계정의 프로젝트:"; printf '   %s\n' "${LIST[@]}"; fi
    PROJECT="$(ask '도장 Firebase 프로젝트 ID를 입력하고 Enter: ')"
  fi
fi
PROJECT="$(printf '%s' "$PROJECT" | tr -d '[:space:]')"
[ -n "$PROJECT" ] || fail "프로젝트 ID가 없어요. Firebase 콘솔 → 프로젝트 설정 → 일반의 \"프로젝트 ID\"를 확인해 주세요."
say "▶ 프로젝트: $PROJECT"

# 2. Blaze 요금제인지 확인 (확인할 수 없으면 그냥 진행해요)
BILL="$(gcloud billing projects describe "$PROJECT" --format='value(billingEnabled)' 2>/dev/null || true)"
[ "$BILL" = "False" ] && fail "이 프로젝트는 아직 Blaze 요금제가 아니에요. Firebase 콘솔 → 업그레이드에서 Blaze로 바꾸고 예산 알림을 건 뒤 다시 실행해 주세요."

# 3. 프로그램 받기
rm -rf "$DIR" && mkdir -p "$DIR/functions" || fail "작업 폴더를 만들지 못했어요."
for f in firebase.json functions/index.js functions/package.json functions/package-lock.json; do
  curl -fsSL "$SITE/push-server/$f" -o "$DIR/$f" || fail "$f 파일을 받지 못했어요. 인터넷 연결을 확인해 주세요."
done
cd "$DIR" || fail "작업 폴더로 가지 못했어요."
say "▶ 필요한 부품을 받는 중이에요 (1~2분)"
npm --prefix functions ci --no-audit --no-fund --loglevel=error || fail "부품을 받지 못했어요. 잠시 뒤 다시 실행해 주세요."

# 4. Firebase 도구와 로그인 확인
if command -v firebase >/dev/null; then FB=(firebase); else FB=(npx --yes firebase-tools@15.32.1); fi
if ! "${FB[@]}" projects:list >/dev/null 2>&1; then
  say "▶ 구글 로그인을 한 번 해 주세요. 아래 링크를 열어 허용하고, 나오는 코드를 붙여 넣으면 돼요."
  gcloud auth application-default login --no-launch-browser < /dev/tty || fail "로그인하지 못했어요."
fi

# 5. 서버에 올리기 (처음에는 구글 쪽 권한 준비 때문에 실패할 수 있어서 몇 번 다시 시도해요)
for i in $(seq 1 "$TRIES"); do
  say "▶ 서버에 올리는 중이에요 ($i/$TRIES) · 3~5분 걸려요"
  if "${FB[@]}" deploy --only functions --project "$PROJECT" --non-interactive --force; then
    say "✔ 설치 완료!"
    echo "   앱의 설정 → 앱 푸시 알림 → \"앱 푸시 사용\"을 켜 주세요. 이 창은 닫아도 돼요."
    echo
    exit 0
  fi
  if [ "$i" -lt "$TRIES" ]; then
    echo "… 처음 설치할 때는 구글 쪽 준비에 몇 분 걸려요. $((WAIT / 60))분 뒤 다시 시도해요. 창을 닫지 마세요."
    sleep "$WAIT"
  fi
done
fail "설치하지 못했어요. 위쪽 빨간 글씨 부분을 캡처해서 이 앱을 전해 준 분께 보내 주세요."
