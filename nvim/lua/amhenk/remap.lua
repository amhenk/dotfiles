vim.keymap.set("n", "<leader>e", vim.cmd.Ex)
vim.keymap.set("n", "<leader>w", vim.cmd.w)
vim.keymap.set("n", "<leader>x", vim.cmd.wq)

vim.keymap.set("i", "jk", "<Esc>")
vim.keymap.set("i", "<C-c>", "<Esc>")

-- Move current selection up or down
vim.keymap.set("v", "J", ":m '>+1<CR>gv=gv")
vim.keymap.set("v", "K", ":m '<-2<CR>gv=gv")

-- delete line below
vim.keymap.set("n", "J", "mzJ`z")

vim.keymap.set("n", "<C-d>", "<C-d>zz")
vim.keymap.set("n", "<C-u>", "<C-u>zz")
vim.keymap.set("n", "n", "nzzzv")
vim.keymap.set("n", "N", "Nzzzv")

-- Copy/Paste Commands
vim.keymap.set("x", "<leader>p", "\"_dP")

vim.keymap.set("n", "<leader>y", "\"+y")
vim.keymap.set("v", "<leader>y", "\"+y")
vim.keymap.set("n", "<leader>Y", "\"+Y")

-- Delete under cursor
vim.keymap.set("n", "<leader>d", "\"_d")
vim.keymap.set("v", "<leader>d", "\"_d")

vim.keymap.set("n", "Q", "<nop>")


vim.keymap.set("n", "<leader>c", ':let @* = expand("%")<CR>', { silent = true })
vim.keymap.set("n", "<leader>cc", ':let @+ = expand("%")<CR>', { silent = true })

vim.keymap.set("n", "<M-Tab>", ":cn<CR>")
vim.keymap.set("n", "<M-S-Tab>", ":cp<CR>")

if(os.getenv('$TMUX'))
then
    vim.keymap.set("n", "<M-h>", ":wincmd h<CR>")
    vim.keymap.set("n", "<M-j>", ":wincmd j<CR>")
    vim.keymap.set("n", "<M-k>", ":wincmd k<CR>")
    vim.keymap.set("n", "<M-l>", ":wincmd l<CR>")
end

-- Simple Session Management
vim.keymap.set("n", "<leader>sv", ":mksession! ~/.vim/vim_session<CR>")
vim.keymap.set("n", "<leader>op", ":source ~/.vim/vim_session<CR>")

-- buffer navigation
vim.keymap.set("n", "<leader>h", ":bprevious<CR>", { silent = true })
vim.keymap.set("n", "<leader>l", ":bnext<CR>", { silent = true })
vim.keymap.set("n", "<leader>bd", ":bd<CR>", { silent = true })

-- pane controls
vim.keymap.set("n", "<M-p>", ":vertical resize +5<CR>", { silent = true })
vim.keymap.set("n", "<M-m>", ":vertical resize -5<CR>", { silent = true })

-- Github Commands
vim.keymap.set({"n", "v"}, "gh", function() CopyGithubURL() end)
vim.keymap.set({"n", "v"}, "<leader>gh", function() CopyGithubURL(true) end)

-- TestIt
vim.keymap.set({"n", "v"}, "<leader>ti", function() TestIt() end)

-- nvim-tree
vim.api.nvim_set_keymap("n", "<leader>H", ":NvimTreeToggle<CR>", { silent = true, noremap = true })
vim.api.nvim_set_keymap("n", ";H", ":NvimTreeFindFile<CR>", { silent = true, noremap = true })
vim.api.nvim_set_keymap("n", "<C-H>", ":NvimTreeFocus<CR>", { silent = true, noremap = true })

-- Diffview
vim.api.nvim_set_keymap("n", "<leader>dvo", ":DiffviewOpen<CR>", { silent = true, noremap = true })
vim.api.nvim_set_keymap("n", "<leader>dvc", ":DiffviewClose<CR>", { silent = true, noremap = true })

---------
--- Diagnostic mappings
---------
vim.keymap.set("n", ";tt", function()
  vim.diagnostic.open_float()
end,
  {silent = true, noremap = true}
)
-- Next Issue
vim.keymap.set("n", "<leader>ni", function()
  local diagnostic =vim.diagnostic.jump({ count=1, float=true })
  vim.lsp.buf.code_action({ context = { diagnostic = diagnostic } })
end,
  {silent = true, noremap = true}
)
-- Previous Issue
vim.keymap.set("n", "<leader>pi", function()
  local diagnostic = vim.diagnostic.jump({ count=-1, float=true })
  vim.lsp.buf.code_action({ context = { diagnostic = diagnostic } })
end,
  {silent = true, noremap = true}
)
