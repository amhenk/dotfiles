# 3024 Night tmux theme

set -g status-interval 1
set -g status-justify left
set -g status-position bottom
set -g status-style "bg=#3a3432,fg=#a5a2a2"

# Left side
set -g status-left-length 100
set -g status-left " #[fg=#01a252,bold]󰒓 #S #[fg=#5c5855]| "

# Right side
set -g status-right-length 100
set -g status-right "#[fg=#5c5855] %Y-%m-%d #[fg=#a16a94]󰥔 %H:%M #[fg=#01a0e4]󰇄 #H "

# Window status
setw -g window-status-format " #[fg=#807d7c]#I:#W "
setw -g window-status-current-format " #[fg=#fded02,bold]#[bg=#090300] #I:#W "
setw -g window-status-separator ""

# Pane borders
set -g pane-border-style "fg=#3a3432"
set -g pane-active-border-style "fg=#01a0e4"

# Message text
set -g message-style "bg=#3a3432,fg=#fded02"

# Command prompt
set -g message-command-style "bg=#3a3432,fg=#fded02"

# Mode (copy mode etc)
setw -g mode-style "bg=#db2d20,fg=#f7f7f7"
