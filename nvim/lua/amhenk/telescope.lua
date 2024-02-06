local function load_fzf()
  require('telescope').load_extension('fzf')
end

-- Sometimes fzf doesn't work 🤔
local _ = pcall(load_fzf)

require('telescope').load_extension('luasnip')
