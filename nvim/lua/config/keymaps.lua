-- Keymaps are automatically loaded on the VeryLazy event
-- Default keymaps that are always set: https://github.com/LazyVim/LazyVim/blob/main/lua/lazyvim/config/keymaps.lua
-- Add any additional keymaps here

-- Restore vanilla vim 's' behavior (substitute character)
vim.keymap.set("n", "s", "cl", { desc = "Substitute character" })
vim.keymap.set("x", "s", "c", { desc = "Substitute selection" })
