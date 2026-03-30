#!/bin/bash

# Start a new tmux session named 'staretz_blog_dev'
tmux new-session -d -s staretz_blog_dev

# Pane 1 (left): Run the Astro dev server
tmux send-keys -t staretz_blog_dev 'pnpm run dev' C-m

# Split the window horizontally for the other panes
tmux split-window -h -t staretz_blog_dev

# Pane 2 (top right): Ready for testing
tmux send-keys -t staretz_blog_dev '# Ready for test watcher' C-m

# Split Pane 2 vertically
tmux split-window -v -t staretz_blog_dev

# Pane 3 (bottom right): Empty pane for manual commands
tmux send-keys -t staretz_blog_dev 'clear' C-m

# Attach to the tmux session
tmux attach-session -t staretz_blog_dev
