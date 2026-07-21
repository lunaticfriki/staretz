#!/usr/bin/env bash
set -eu

SESSION="staretz-dev"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

if ! command -v tmux >/dev/null 2>&1; then
  echo "tmux is not installed. Install it (e.g. brew install tmux) and try again." >&2
  exit 1
fi

if tmux has-session -t "$SESSION" 2>/dev/null; then
  exec tmux attach-session -t "$SESSION"
fi

tmux new-session -d -s "$SESSION" -c "$ROOT" -n dev

tmux send-keys -t "$SESSION:dev.0" "pnpm dev" C-m

tmux split-window -h -p 35 -t "$SESSION:dev.0" -c "$ROOT"
tmux send-keys -t "$SESSION:dev.1" "pnpm test:watch" C-m

tmux split-window -v -p 50 -t "$SESSION:dev.1" -c "$ROOT"

tmux select-pane -t "$SESSION:dev.0"

exec tmux attach-session -t "$SESSION"
