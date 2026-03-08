local mode_map = {
  ["NORMAL"] = "N",
  ["O-PENDING"] = "N?",
  ["INSERT"] = "I",
  ["VISUAL"] = "V",
  ["V-BLOCK"] = "VB",
  ["V-LINE"] = "VL",
  ["V-REPLACE"] = "VR",
  ["REPLACE"] = "R",
  ["COMMAND"] = "!",
  ["SHELL"] = "SH",
  ["TERMINAL"] = "T",
  ["EX"] = "X",
  ["S-BLOCK"] = "SB",
  ["S-LINE"] = "SL",
  ["SELECT"] = "S",
  ["CONFIRM"] = "Y?",
  ["MORE"] = "M",
}

return {
  {
    "nvim-lualine/lualine.nvim",
    event = "VeryLazy",
    opts = function()
      local colors = {
        bg = "#000000",
        fg = "#ffffff",
        accent = "#ff5f00",
        dim = "#333333",
        muted = "#777777",
        green = "#00ff00",
        yellow = "#ffff00",
        red = "#ff0000",
      }

      local brutalist_theme = {
        normal = {
          a = { bg = colors.accent, fg = colors.bg, gui = "bold" },
          b = { bg = colors.dim, fg = colors.fg },
          c = { bg = colors.bg, fg = colors.fg },
        },
        insert = {
          a = { bg = colors.green, fg = colors.bg, gui = "bold" },
          b = { bg = colors.dim, fg = colors.fg },
          c = { bg = colors.bg, fg = colors.fg },
        },
        visual = {
          a = { bg = colors.yellow, fg = colors.bg, gui = "bold" },
          b = { bg = colors.dim, fg = colors.fg },
          c = { bg = colors.bg, fg = colors.fg },
        },
        replace = {
          a = { bg = colors.red, fg = colors.bg, gui = "bold" },
          b = { bg = colors.dim, fg = colors.fg },
          c = { bg = colors.bg, fg = colors.fg },
        },
        inactive = {
          a = { bg = colors.bg, fg = colors.muted, gui = "bold" },
          b = { bg = colors.bg, fg = colors.muted },
          c = { bg = colors.bg, fg = colors.muted },
        },
      }

      return {
        options = {
          theme = brutalist_theme,
          section_separators = { left = "", right = "" },
          component_separators = { left = "", right = "" },
          globalstatus = true,
          disabled_filetypes = { statusline = { "dashboard", "alpha", "starter" } },
        },
        sections = {
          lualine_a = {
            {
              "mode",
              fmt = function(m)
                return mode_map[m] or m
              end,
              -- separator = { left = "" },
              right_padding = 2,
            },
          },
          lualine_b = { "branch" },
          lualine_c = {
            { "filename", path = 1 },
            { "diff" },
            { "diagnostics" },
          },
          lualine_x = { "encoding", "fileformat", "filetype" },
          lualine_y = { "progress" },
          lualine_z = {
            {
              "location",
              -- separator = { right = "" },
              left_padding = 2,
            },
          },
        },
      }
    end,
  },
}
