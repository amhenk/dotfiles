local wezterm = require("wezterm")

local _M = {}

function _M.apply_to_config(config)
  -- config.color_scheme = "Laserwave (Gogh)"
  config.color_scheme = "Tokyo Night"
  -- config.color_scheme = "Rose Pine"
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

  config.window_decorations = "RESIZE"
end

return _M
