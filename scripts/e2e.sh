#!/usr/bin/env bash
set -eu

PORT=4173
BASE_URL="http://localhost:$PORT"

pnpm typecheck:e2e
pnpm build

pnpm exec vite preview --port "$PORT" --strictPort &
SERVER_PID=$!

cleanup() {
  kill "$SERVER_PID" 2>/dev/null || true
}
trap cleanup EXIT

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

BASE_URL="$BASE_URL" NODE_OPTIONS="--import tsx" pnpm exec cucumber-js "$@"
