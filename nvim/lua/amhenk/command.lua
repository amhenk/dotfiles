vim.api.nvim_create_autocmd({ "BufWritePre" }, {
  pattern = { "*" },
  command = [[%s/\s\+$//e]],
})

-- Command for opening keybindings
vim.api.nvim_create_user_command('EditBindings',
  function(opts)
    vim.cmd('vs ~/.config/nvim/lua/amhenk/remap.lua')
  end,
  { nargs = 0 }
)
