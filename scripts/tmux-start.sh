#!/bin/bash

SESSION="staretz-dev"

cleanup() {
  echo "Stopping tmux session and cleaning up..."
  tmux kill-session -t $SESSION 2>/dev/null

  echo "Ensuring port 5173 is free..."
  fuser -k 5173/tcp 2>/dev/null || true
}

trap cleanup EXIT INT TERM
tmux kill-session -t $SESSION 2>/dev/null
tmux new-session -d -s $SESSION
tmux split-window -v -t $SESSION:0
tmux select-pane -t $SESSION:0.0
tmux split-window -h -t $SESSION:0.0
tmux send-keys -t $SESSION:0.0 'pnpm dev' C-m
tmux send-keys -t $SESSION:0.1 'pnpm test' C-m
tmux select-pane -t $SESSION:0.2
tmux attach-session -t $SESSION
