#!/usr/bin/env bash
set -euo pipefail

FLUTTER="${HOME}/development/flutter/bin/flutter"

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

echo -e "  Running ${BOLD}flutter test${NC}..."
echo ""

if "$FLUTTER" test; then
  echo ""
  echo -e "${GREEN}${BOLD}✔ All tests passed — proceeding with push${NC}"
  echo ""
else
  echo ""
  echo -e "${RED}${BOLD}✘ Tests failed — push aborted${NC}"
  echo ""
  exit 1
fi
