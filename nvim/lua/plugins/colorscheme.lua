return {
  -- add gruvbox
  {
    "ellisonleao/gruvbox.nvim",
    config = true,
    opts = {
      contrast = "hard",
      overrides = {
        ["@comment"] = { fg = "#000000" },
      },
    },
  },

  -- Configure LazyVim to load gruvbox
  {
    "LazyVim/LazyVim",
    opts = {
      colorscheme = "gruvbox",
    },
  },
}
