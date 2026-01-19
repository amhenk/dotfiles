local builtin = require("telescope.builtin")
vim.keymap.set("n", "<C-f>", function()
  builtin.live_grep({
    search_dirs = { vim.fn.expand("%:p") },
  })
end)

vim.keymap.set("n", "<leader>fg", function()
  local p = io.popen("git diff --name-only main...; git diff --name-only; git ls-files --others --exclude-standard")
  local files = {}
  for file in p:lines() do
    table.insert(files, file)
  end
  p:close()

  require("telescope.builtin").live_grep({ search_dirs = files })
end, {})

vim.keymap.set("n", ";s", builtin.treesitter, {})
vim.keymap.set("n", ";;", builtin.resume, {})
vim.keymap.set("n", ";tr", builtin.diagnostics, {})
return {
  "nvim-telescope/telescope.nvim",
  pickers = {
    find_files = {
      prompt_title = "🤔",
      results_title = "",
      hidden = true,
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
  opts = {
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
      file_ignore_patterns = {
        "node_modules",
        "dist",
      },
    },
  },
}
