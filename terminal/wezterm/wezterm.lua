local wezterm = require("wezterm")

-- get the configuration
local config = wezterm.config_builder()

require("remaps").apply_to_config(config)
require("styles").apply_to_config(config)

wezterm.on("update-status", require("status_bar").update_status)

return config
