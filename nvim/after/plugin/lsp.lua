local lsp = require('lsp-zero')

lsp.preset('recommended')

lsp_to_install = {
	'bashls',
	'eslint',
	'graphql',
	'marksman',
	'rust_analyzer',
	'solargraph',
	'sorbet',
	'lua_ls',
  'pyright',
	'texlab',
	'tsserver',
	'yamlls',
  'ltex',
}

lsp.ensure_installed(lsp_to_install)

lsp.on_attach(function(client, bufnr)
    local opts = {buffer = bufnr, remap = false}

    vim.keymap.set("n", "vd", function() vim.lsp.buf.definition() end, opts)
    vim.keymap.set("n", "vD", function() vim.lsp.buf.type_definition() end, opts)
    vim.keymap.set("n", "K", function() vim.lsp.buf.hover() end, opts)
    vim.keymap.set("n", "vrr", function() vim.lsp.buf.references() end, opts)
    vim.keymap.set("n", "vrn", function() vim.lsp.buf.rename() end, opts)
    vim.keymap.set("i", "<C-h>", function() vim.lsp.buf.signature_help() end, opts)
end)

lsp.setup()

vim.diagnostic.config({
  virtual_text = true,
  signs = true,
  update_in_insert = false,
  underline = true,
  severity_sort = true,
  float = {
    focusable = false,
    style = 'minimal',
    border = 'rounded',
    source = 'always',
    header = '',
    prefix = '',
  },
})
