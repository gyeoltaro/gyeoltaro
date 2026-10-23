#!/usr/bin/env bash
# 태권도 통합 관리 · 앱 푸시 서버 프로그램 설치
# Google Cloud Shell(https://shell.cloud.google.com) 검은 창에 아래 한 줄을 붙여 넣으면 돼요:
#   curl -fsSL https://awoolimtkd.github.io/push-server/install.sh | bash
# Cloud Shell은 관장님 구글 계정으로 이미 로그인되어 있고 Firebase 도구도 깔려 있어요.
# 프로젝트 ID를 직접 주려면: ... | bash -s -- 프로젝트ID
# 이미 설치된 도장에서 다시 실행해도 같은 프로그램으로 덮어쓸 뿐이에요.
# (tools/deploy.mjs 가 이 파일을 앱 주소의 push-server/install.sh 로 올려요)
set -uo pipefail

SITE="${TKD_SITE:-https://awoolimtkd.github.io}"
DIR="${TKD_DIR:-$HOME/tkd-push}"
WAIT="${TKD_RETRY_WAIT:-180}"
TRIES=5
REGION=asia-northeast3
FUNCS="noticePush attendancePush applicationPush replyPush"
FB_PIN=15.32.1   # 이 버전으로 시험했어요

say() { printf '\n\033[1m%s\033[0m\n' "$*"; }
ok() { printf '   \033[32m✔\033[0m %s\n' "$*"; }
bad() { printf '   \033[31m✗\033[0m %s\n' "$*"; }
fail() { printf '\n\033[31m✗ %s\033[0m\n\n' "$*"; exit 1; }
ask() { local a; read -r -p "$1" a < /dev/tty || true; printf '%s' "$a"; }

say "▶ 태권도 통합 관리 · 앱 푸시 서버 프로그램 설치를 시작해요"
command -v node >/dev/null && command -v npm >/dev/null || fail "Node.js가 없어요. Google Cloud Shell에서 실행해 주세요."

# 1. Firebase 도구 (Cloud Shell에 깔린 것이 오래됐으면 시험한 버전을 받아 써요)
FBV="$(firebase --version 2>/dev/null || true)"
if [ -n "$FBV" ] && [ "${FBV%%.*}" -ge 14 ] 2>/dev/null; then FB=(firebase); else FB=(npx --yes "firebase-tools@$FB_PIN"); FBV="$FB_PIN (받아서 사용)"; fi
ok "Node.js $(node --version), Firebase 도구 $FBV"

# 2. 구글 로그인 확인 (Cloud Shell은 보통 이미 되어 있어요. "승인" 창이 뜨면 승인을 눌러 주세요)
if ! PROJECTS_JSON="$("${FB[@]}" projects:list --json 2>/dev/null)"; then
  say "▶ 구글 로그인을 한 번 해 주세요. 아래 링크를 열어 허용하고, 나오는 코드를 붙여 넣으면 돼요."
  gcloud auth application-default login --no-launch-browser < /dev/tty || fail "로그인하지 못했어요."
  PROJECTS_JSON="$("${FB[@]}" projects:list --json 2>/dev/null)" || fail "Firebase 프로젝트 목록을 읽지 못했어요."
fi
ok "구글 로그인 확인"

# 3. 도장 Firebase 프로젝트 고르기 (Firebase 프로젝트가 하나뿐이면 묻지 않아요)
PROJECT="${1:-}"
if [ -z "$PROJECT" ]; then
  mapfile -t LIST < <(printf '%s' "$PROJECTS_JSON" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{for(const p of JSON.parse(s).result||[])console.log(p.projectId+"\t"+(p.displayName||""))}catch(e){}})')
  if [ "${#LIST[@]}" -eq 1 ]; then
    PROJECT="${LIST[0]%%$'\t'*}"
  else
    if [ "${#LIST[@]}" -gt 1 ]; then echo "   이 구글 계정의 Firebase 프로젝트:"; for l in "${LIST[@]}"; do printf '     %s  (%s)\n' "${l%%$'\t'*}" "${l#*$'\t'}"; done; fi
    PROJECT="$(ask '   도장 Firebase 프로젝트 ID를 입력하고 Enter: ')"
  fi
fi
PROJECT="$(printf '%s' "$PROJECT" | tr -d '[:space:]')"
[ -n "$PROJECT" ] || fail "프로젝트 ID가 없어요. Firebase 콘솔 → 프로젝트 설정 → 일반의 \"프로젝트 ID\"를 확인해 주세요."
ok "프로젝트: $PROJECT"

# 4. Blaze 요금제 확인 (확인할 수 없으면 그냥 진행해요)
BILL="$(gcloud billing projects describe "$PROJECT" --format='value(billingEnabled)' 2>/dev/null || true)"
[ "$BILL" = "False" ] && fail "이 프로젝트는 아직 Blaze 요금제가 아니에요. Firebase 콘솔 → 업그레이드에서 Blaze로 바꾸고 예산 알림을 건 뒤 다시 실행해 주세요."
[ "$BILL" = "True" ] && ok "Blaze 요금제"

# 5. 프로그램 받기
rm -rf "$DIR" && mkdir -p "$DIR/functions" || fail "작업 폴더를 만들지 못했어요."
for f in firebase.json functions/index.js functions/package.json functions/package-lock.json; do
  curl -fsSL "$SITE/push-server/$f" -o "$DIR/$f" || fail "$f 파일을 받지 못했어요. 인터넷 연결을 확인해 주세요."
done
cd "$DIR" || fail "작업 폴더로 가지 못했어요."
say "▶ 필요한 부품을 받는 중이에요 (1~2분)"
npm --prefix functions ci --no-audit --no-fund --loglevel=error || fail "부품을 받지 못했어요. 잠시 뒤 다시 실행해 주세요."
ok "부품 준비"

# 6. 서버에 올리기 (처음에는 구글 쪽 권한 준비 때문에 실패할 수 있어서 몇 번 다시 시도해요)
DONE=""
for i in $(seq 1 "$TRIES"); do
  say "▶ 서버에 올리는 중이에요 ($i/$TRIES) · 3~5분 걸려요"
  if "${FB[@]}" deploy --only functions --project "$PROJECT" --non-interactive --force; then DONE=1; break; fi
  if [ "$i" -lt "$TRIES" ]; then
    echo "… 처음 설치할 때는 구글 쪽 준비에 몇 분 걸려요. $((WAIT / 60))분 뒤 다시 시도해요. 창을 닫지 마세요."
    sleep "$WAIT"
  fi
done
[ -n "$DONE" ] || fail "설치하지 못했어요. 위쪽 빨간 글씨 부분을 캡처해서 이 앱을 전해 준 분께 보내 주세요."

# 7. 제대로 설치됐는지 확인해요
say "▶ 설치 상태를 확인해요"
gcloud services enable fcm.googleapis.com fcmregistrations.googleapis.com --project "$PROJECT" >/dev/null 2>&1 || true
ENABLED="$(gcloud services list --enabled --project "$PROJECT" --format='value(config.name)' 2>/dev/null || true)"
if printf '%s' "$ENABLED" | grep -q '^fcm.googleapis.com$'; then ok "알림 보내기 기능(FCM) 켜짐"; elif [ -n "$ENABLED" ]; then bad "알림 보내기 기능(FCM)이 꺼져 있어요"; fi
STATES="$(gcloud functions list --project "$PROJECT" --regions "$REGION" --format='value(name.basename(),state)' 2>/dev/null || true)"
ALL=1
for fn in $FUNCS; do
  st="$(printf '%s\n' "$STATES" | awk -v f="$fn" '$1==f{print $2}')"
  if [ "$st" = "ACTIVE" ]; then ok "$fn 작동 중"; elif [ -n "$STATES" ]; then bad "$fn ${st:-없음}"; ALL=0; fi
done
[ -z "$STATES" ] && echo "   (함수 상태는 Firebase 콘솔 → Functions 에서도 볼 수 있어요)"
[ "$ALL" = 1 ] || fail "일부 프로그램이 작동하지 않아요. 이 화면을 캡처해서 이 앱을 전해 준 분께 보내 주세요."

say "✔ 설치 완료!"
echo "   앱의 설정 → 앱 푸시 알림 → \"앱 푸시 사용\"을 켜고, \"알림 점검 → 서버에서 시험 알림\"으로 확인해 보세요."
echo "   이 창은 닫아도 돼요."
echo
