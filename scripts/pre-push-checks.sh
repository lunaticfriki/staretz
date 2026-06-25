#!/usr/bin/env bash
set -uo pipefail

ROOT="$(git rev-parse --show-toplevel)"
FLUTTER="${HOME}/development/flutter/bin/flutter"
DART="${HOME}/development/flutter/bin/dart"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
NC='\033[0m'

stashed=false

echo ""
echo -e "${BOLD}${YELLOW}── Pre-push checks ──────────────────────────${NC}"

cleanup() {
  if $stashed; then
    echo -e "${YELLOW}  Restoring stashed changes...${NC}"
    git stash pop
  fi
}
trap cleanup EXIT

if [[ -n "$(git status --porcelain)" ]]; then
  git stash --include-untracked
  stashed=true
  echo -e "${YELLOW}  Stashed local changes${NC}"
fi

failed=false

echo -e "  Running ${BOLD}dart test (domain)${NC}..."
echo ""
if ! (cd "$ROOT/packages/domain" && "$DART" test); then
  failed=true
fi

echo ""
echo -e "  Running ${BOLD}flutter test (front)${NC}..."
echo ""
if ! (cd "$ROOT/front" && "$FLUTTER" test); then
  failed=true
fi

echo ""
echo -e "  Running ${BOLD}dart test (back)${NC}..."
echo ""
if ! (cd "$ROOT/back" && "$DART" test); then
  failed=true
fi

echo ""
if $failed; then
  echo -e "${RED}${BOLD}✘ Tests failed — push aborted${NC}"
  echo ""
  exit 1
else
  echo -e "${GREEN}${BOLD}✔ All tests passed — proceeding with push${NC}"
  echo ""
fi
