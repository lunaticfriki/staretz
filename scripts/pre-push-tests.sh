#!/usr/bin/env sh
set -u

TEST_CMD="${TEST_CMD:-pnpm test}"
STASHED=0

restore_stash() {
  if [ "$STASHED" -eq 1 ]; then
    git stash pop --quiet
  fi
}
trap restore_stash EXIT INT TERM

if [ -n "$(git status --porcelain)" ]; then
  git stash push --include-untracked --quiet -m "pre-push-guard"
  STASHED=1
fi

echo "Running tests against committed code only: $TEST_CMD"
sh -c "$TEST_CMD"
TEST_EXIT_CODE=$?

if [ "$TEST_EXIT_CODE" -ne 0 ]; then
  echo "Tests failed. Push aborted. Your uncommitted changes have been restored."
  exit "$TEST_EXIT_CODE"
fi

exit 0
