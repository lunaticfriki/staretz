#!/bin/bash

# Define the session name
SESSION="staretz-dev"

# Check if the tmux session already exists
tmux has-session -t $SESSION 2>/dev/null

if [ $? != 0 ]; then
    # Start a new detached session
    tmux new-session -d -s $SESSION

    # Pane 0 (Left side): Run the Flutter web server
    tmux send-keys -t $SESSION:0.0 'flutter run -d web-server --web-port 8081' C-m

    # Split the window horizontally (Creates Pane 1 on the right)
    tmux split-window -h -t $SESSION:0

    # Split the right pane vertically (Creates Pane 2 on the bottom right)
    tmux split-window -v -t $SESSION:0.1

    # Pane 1 (Top right): Run the Flutter tests
    tmux send-keys -t $SESSION:0.1 'flutter test' C-m

    # Select Pane 2 (Bottom right) so it's the active empty terminal ready for commands
    tmux select-pane -t $SESSION:0.2
fi

# Attach to the session
tmux attach-session -t $SESSION

# Once the user detaches from the session or all panes are exited, kill the session
tmux kill-session -t $SESSION 2>/dev/null
