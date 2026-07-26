#!/usr/bin/env bash
set -eu

PORT=4173
BASE_URL="http://localhost:$PORT"

AUTH_EMULATOR_HOST="127.0.0.1:9099"
FIREBASE_PROJECT="${VITE_FIREBASE_PROJECT_ID:-staretz-e2e}"
E2E_ADMIN_EMAIL="${E2E_ADMIN_EMAIL:-e2e@staretz.test}"
E2E_ADMIN_PASSWORD="${E2E_ADMIN_PASSWORD:-e2e-test-password}"

pnpm typecheck:e2e

pnpm exec firebase emulators:start --only auth --project "$FIREBASE_PROJECT" &
EMULATOR_PID=$!

cleanup() {
  kill "$SERVER_PID" 2>/dev/null || true
  kill "$EMULATOR_PID" 2>/dev/null || true
}
trap cleanup EXIT

EMULATOR_READY=0
for _ in $(seq 1 60); do
  if curl -sSf "http://$AUTH_EMULATOR_HOST/" > /dev/null 2>&1; then
    EMULATOR_READY=1
    break
  fi
  sleep 0.5
done

if [ "$EMULATOR_READY" -ne 1 ]; then
  echo "Auth emulator did not become ready at $AUTH_EMULATOR_HOST" >&2
  exit 1
fi

# Seed the fixed admin user the "logged in as an admin" step signs in as.
# EMAIL_EXISTS on a rerun against an emulator that kept its state is fine —
# the account just already exists from a previous run.
curl -s -o /dev/null -X POST \
  "http://$AUTH_EMULATOR_HOST/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-api-key" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$E2E_ADMIN_EMAIL\",\"password\":\"$E2E_ADMIN_PASSWORD\",\"returnSecureToken\":true}"

VITE_FIREBASE_AUTH_EMULATOR_HOST="$AUTH_EMULATOR_HOST" VITE_USE_FAKE_REPOSITORIES=true pnpm build

pnpm exec vite preview --port "$PORT" --strictPort &
SERVER_PID=$!

READY=0
for _ in $(seq 1 60); do
  if curl -sSf "$BASE_URL" > /dev/null 2>&1; then
    READY=1
    break
  fi
  sleep 0.5
done

if [ "$READY" -ne 1 ]; then
  echo "Preview server did not become ready at $BASE_URL" >&2
  exit 1
fi

BASE_URL="$BASE_URL" E2E_ADMIN_EMAIL="$E2E_ADMIN_EMAIL" E2E_ADMIN_PASSWORD="$E2E_ADMIN_PASSWORD" \
  NODE_OPTIONS="--import tsx" pnpm exec cucumber-js "$@"
