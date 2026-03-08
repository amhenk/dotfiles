# Corporate Brutalist tmux theme

set -g status-interval 1
set -g status-justify left
set -g status-position bottom
set -g status-style "bg=#000000,fg=#ffffff"

# Left side
set -g status-left-length 100
set -g status-left "#[fg=#ff5f00,bg=default]#[fg=#000000,bg=#ff5f00,bold]󰒓 #S#[fg=#ff5f00,bg=default]  "

# Right side
set -g status-right-length 100
set -g status-right "#[fg=#333333,bg=default]#[fg=#ffffff,bg=#333333] %Y-%m-%d #[fg=#ffffff,bg=#333333]#[fg=#000000,bg=#ffffff]󰥔 %H:%M #[fg=#ff5f00,bg=#ffffff]#[fg=#000000,bg=#ff5f00,bold]󰇄 #H#[fg=#ff5f00,bg=default]"

# Window status
setw -g window-status-format "#[fg=#333333,bg=default]#[fg=#ffffff,bg=#333333]#I:#W#[fg=#333333,bg=default]"
setw -g window-status-current-format "#[fg=#ff5f00,bg=default]#[fg=#000000,bg=#ff5f00,bold]#I:#W#[fg=#ff5f00,bg=default]"
setw -g window-status-separator " "

# Pane borders
set -g pane-border-style "fg=#333333"
set -g pane-active-border-style "fg=#ff5f00"

# Message text
set -g message-style "bg=#ff5f00,fg=#000000,bold"

# Command prompt
set -g message-command-style "bg=#333333,fg=#ffffff"

# Mode (copy mode etc)
setw -g mode-style "bg=#ff5f00,fg=#000000,bold"
