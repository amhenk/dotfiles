local wezterm = require("wezterm")
local action = wezterm.action

local _M = {}

function _M.apply_to_config(config)
  config.leader = { key = "a", mods = "CTRL", timeout_milliseconds = 1000 }
  config.keys = {
    { key = "a",          mods = "LEADER", action = action.SendKey({ key = "a", mods = "CTRL" }) },
    { key = "c",          mods = "LEADER", action = action.ActivateCopyMode },
    { key = "phys:Space", mods = "LEADER", action = action.ActivateCommandPalette },

    -- Pane things
    { key = "v",          mods = "LEADER", action = action.SplitHorizontal({ domain = "CurrentPaneDomain" }) },
    { key = "b",          mods = "LEADER", action = action.SplitVertical({ domain = "CurrentPaneDomain" }) },
    { key = "h",          mods = "LEADER", action = action.ActivatePaneDirection("Left") },
    { key = "j",          mods = "LEADER", action = action.ActivatePaneDirection("Down") },
    { key = "k",          mods = "LEADER", action = action.ActivatePaneDirection("Up") },
    { key = "l",          mods = "LEADER", action = action.ActivatePaneDirection("Right") },
    { key = "z",          mods = "LEADER", action = action.TogglePaneZoomState },
    { key = "o",          mods = "LEADER", action = action.RotatePanes("Clockwise") },

    -- Fuzzy find workspaces
    { key = "w",          mods = "LEADER", action = action.ShowLauncherArgs({ flags = "FUZZY|WORKSPACES" }) },
    -- We can make separate keybindings for resizing panes
    -- But Wezterm offers custom "mode" in the name of "KeyTable"
    {
      key = "r",
      mods = "LEADER",
      action = action.ActivateKeyTable({ name = "resize_pane", one_shot = false }),
    },

    -- Tab keybindings
    { key = "t", mods = "LEADER", action = action.SpawnTab("CurrentPaneDomain") },
    { key = "[", mods = "LEADER", action = action.ActivateTabRelative(-1) },
    { key = "]", mods = "LEADER", action = action.ActivateTabRelative(1) },
    { key = "n", mods = "LEADER", action = action.ShowTabNavigator },
    { key = ";", mods = "LEADER", action = action.ActivatePaneDirection("Prev") },
    {
      key = "e",
      mods = "LEADER",
      action = action.PromptInputLine({
        description = wezterm.format({
          { Attribute = { Intensity = "Bold" } },
          { Foreground = { AnsiColor = "Fuchsia" } },
          { Text = "Renaming Tab Title...:" },
        }),
        action = wezterm.action_callback(function(window, pane, line)
          if line then
            window:active_tab():set_title(line)
          end
        end),
      }),
    },
    -- Key table for moving tabs around
    { key = "m", mods = "LEADER",       action = action.ActivateKeyTable({ name = "move_tab", one_shot = false }) },
    -- Or shortcuts to move tab w/o move_tab table. SHIFT is for when caps lock is on
    { key = "{", mods = "LEADER|SHIFT", action = action.MoveTabRelative(-1) },
    { key = "}", mods = "LEADER|SHIFT", action = action.MoveTabRelative(1) },

    -- Key table for closing things
    { key = "q", mods = "LEADER",       action = action.ActivateKeyTable({ name = "close_actions" }) },
  }

  -- I can use the tab navigator (LDR t), but I also want to quickly navigate tabs with index
  for i = 1, 9 do
    table.insert(config.keys, {
      key = tostring(i),
      mods = "LEADER",
      action = action.ActivateTab(i - 1),
    })
  end

  config.key_tables = {
    resize_pane = {
      { key = "h",      action = action.AdjustPaneSize({ "Left", 1 }) },
      { key = "j",      action = action.AdjustPaneSize({ "Down", 1 }) },
      { key = "k",      action = action.AdjustPaneSize({ "Up", 1 }) },
      { key = "l",      action = action.AdjustPaneSize({ "Right", 1 }) },
      { key = "Escape", action = "PopKeyTable" },
      { key = "Enter",  action = "PopKeyTable" },
    },
    move_tab = {
      { key = "h",      action = action.MoveTabRelative(-1) },
      { key = "j",      action = action.MoveTabRelative(-1) },
      { key = "k",      action = action.MoveTabRelative(1) },
      { key = "l",      action = action.MoveTabRelative(1) },
      { key = "Escape", action = "PopKeyTable" },
      { key = "Enter",  action = "PopKeyTable" },
    },
    close_actions = {
      { key = "t",      action = action.CloseCurrentTab({ confirm = false }) },
      { key = "p",      action = action.CloseCurrentPane({ confirm = false }) },
    },
  }
end

return _M
