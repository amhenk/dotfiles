local on_attach = require'completion'.on_attach

require'lspconfig'.clangd.setup {
    on_attach = on_attach,
    root_dir = function() return vim.loop.cwd() end
}

require'lspconfig'.pyls.setup{ on_attach=on_attach }
require'lspconfig'.gopls.setup{ on_attach=on_attach }
require'lspconfig'.tsserver.setup{ on_attach=on_attach }
require'lspconfig'.solargraph.setup{ on_attach=on_attach }
require'lspconfig'.sorbet.setup{
    on_attach=on_attach,
    cmd = {"bin/bundle", "exec", "srb", "tc", "--lsp"};
}

require('lspkind').init({
    -- with_text = true,
    symbol_map = {
    --   Text = '',
        Method = '',
        Function = 'ƒ',
    --   Constructor = '',
    --   Variable = '',
        Class = '',
    --   Interface = 'ﰮ',
    --   Module = '',
    --   Property = '',
    --   Unit = '',
    --   Value = '',
    --   Enum = '了',
    --   Keyword = '',
    --   Snippet = '﬌',
    --   Color = '',
    --   File = '',
    --   Folder = '',
    --   EnumMember = '',
    --   Constant = '',
    --   Struct = ''
    },
})
