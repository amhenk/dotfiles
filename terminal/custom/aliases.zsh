alias src='source ~/.zshrc'
alias :q='exit'
alias :Q='exit'

alias wget="curl -O"

alias l='ls -lartp'
alias la='ls -la'
alias lg='ls -la | grep'
alias hg='history | grep'

alias ..='cd ..'
alias ...='cd ../..'
alias ....='cd ../../..'

alias dots='cd ~/dotfiles'
alias dotfiles='cd ~/dotfiles'

alias cls='clear'

# Git Specific
# git commit all with message -- no quotes needed
function gcm() { git commit -m "$*"; }
alias gs='git status -sb'
alias ga='git add'
alias gf='git add . && git commit -m "f" && git rebase -i HEAD~3'
alias gb='git branch'
alias gbg='git branch | grep'
alias gd='git diff'
alias glog="git log --graph --pretty=format:'%Cred%h%Creset %an: %s - %Creset %C(yellow)%d%Creset %Cgreen(%cr)%Creset' --abbrev-commit --date=relative"
alias grim="git rebase -i master"
alias gcl="git config --list"
# Add everything and amend the previous commit and push (long hair don't care)
function lhdc() {
  git add -A;
  git commit --amend --no-edit;
  git push --force-with-lease;
}

alias tf='tail -f'

# necessary when using tmux: set -g default-terminal "screen-256color"
# so things like top still work when SSHed to a remote host
alias ssh='TERM=xterm ssh'

alias wtf='ping google.com'

alias quit='kill -s QUIT'
alias duh='du -h'

# Jupyter
alias jn='jupyter notebook'

# Vim
alias vim='nvim'
alias vi='nvim'
alias q=''

# tmux
alias stm='~/dotfiles/tmux'
alias ta="tmux a"

# Spin
if [ "$SPIN" ]; then
    alias sc='systemctl'
    alias jc='journalctl'
fi

