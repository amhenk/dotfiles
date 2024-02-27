local function load_fzf()
  require('telescope').load_extension('fzf')
end

require('telescope').setup({
  pickers = {
    find_files = {
      prompt_title = "🤔",
      results_title = "",
    },
    buffers = {
      show_all_buffers = true,
      sort_lastused = true,
      sort_mru = true,
      previewer = true,
      mappings = {
        i = {
          ["<c-d>"] = "delete_buffer",
        },
      },
    },
  },
  defaults = {
    prompt_prefix = "🔎 ",
    dynamic_preview_title = true,
    preview_title = "👀",
    entry_prefix = " ",
    selection_caret = "👉 ",
    layout_config = {
      prompt_position = "top",
      horizontal = {
        mirror = false,
      },
      vertical = {
        mirror = true,
      },
    },
    preview = {
      msg_bg_fillchar = "",
    },
    mappings = {
      i = {
        ["<esc>"] = require("telescope.actions").close,
        ["<c-j>"] = require("telescope.actions").move_selection_next,
        ["<c-k>"] = require("telescope.actions").move_selection_previous,
      },
    },
    selection_strategy = "reset",
    sorting_strategy = "ascending",
    layout_strategy = "horizontal",
    winblend = 20,
    border = {},
    borderchars = { "─", " ", "─", " ", "╭", "╮", "╯", "╰" },
    color_devicons = true,
    use_less = true,
  },
})

-- Sometimes fzf doesn't work 🤔
local _ = pcall(load_fzf)

require('telescope').load_extension('luasnip')
