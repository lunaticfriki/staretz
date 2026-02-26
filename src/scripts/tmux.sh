#!/bin/bash

# Define the ports your apps use
DEV_PORT=3000
TEST_PORT=3001

# Function to kill processes on exit
cleanup() {
    echo "Cleaning up ports $DEV_PORT and $TEST_PORT..."
    # Find PIDs using the ports and kill them
    fuser -k $DEV_PORT/tcp > /dev/null 2>&1
    fuser -k $TEST_PORT/tcp > /dev/null 2>&1
    echo "Done. Goodbye!"
}

# Execute cleanup if the script is interrupted or exits
trap cleanup EXIT

SESSION="dev-session"

# Start a new tmux session, detached (-d)
tmux new-session -d -s $SESSION

# Pane 1: Launch pnpm dev
tmux send-keys -t $SESSION "pnpm dev" C-m

# Split horizontally and launch pnpm test in Pane 2
tmux split-window -h -t $SESSION
tmux send-keys -t $SESSION "pnpm test" C-m

# Split Pane 2 vertically to create an empty Pane 3
tmux split-window -v -t $SESSION

# Select the empty pane (optional, just to focus it)
tmux select-pane -t 2

# Attach to the session
tmux attach-session -t $SESSION