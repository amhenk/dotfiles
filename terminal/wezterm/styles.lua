local wezterm = require("wezterm")

local _M = {}

function _M.apply_to_config(config)
  -- Corporate Brutalist Theme
  config.colors = {
    foreground = "#ffffff",
    background = "#000000",
    cursor_bg = "#ff5f00",
    cursor_fg = "#000000",
    selection_bg = "#ff5f00",
    selection_fg = "#000000",
    ansi = {
      "#000000", -- black
      "#ff0000", -- red
      "#00ff00", -- green
      "#ffff00", -- yellow
      "#0000ff", -- blue
      "#ff00ff", -- magenta
      "#00ffff", -- cyan
      "#ffffff", -- white
    },
    brights = {
      "#333333", -- grey
      "#ff5f00", -- orange (accent)
      "#00ff00",
      "#ffff00",
      "#0000ff",
      "#ff00ff",
      "#00ffff",
      "#ffffff",
    },
  }

  config.font = wezterm.font_with_fallback({
    -- { family = "MesloLGS NF", font_size = 11.0, },
    { family = "FiraCode Nerd Font Mono", scale = 1.0, },
  })
  -- config.hide_tab_bar_if_only_one_tab = true
  config.use_fancy_tab_bar = false
  config.status_update_interval = 1000
  config.tab_bar_at_bottom = false
  -- Dim inactive panes
  config.inactive_pane_hsb = {
    brightness = 0.8,
  }
  config.window_padding = {
    left = "0.5cell",
    right = "0.5cell",
    top = "0.5cell",
    bottom = "0cell",
  }

  config.window_decorations = "INTEGRATED_BUTTONS|RESIZE"
end

return _M
