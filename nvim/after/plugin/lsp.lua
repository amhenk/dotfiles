local lsp = require('lsp-zero')
local nvim_lsp = require('lspconfig')

local lsp_to_install = {
  'bashls',
  'eslint',
  'graphql',
  'marksman',
  'rust_analyzer',
  'ruby_lsp',
  'sorbet',
  'lua_ls',
  'pyright',
  'yamlls',
--  'denols',
}

lsp.on_attach(function(client, bufnr)
  --[[
  if nvim_lsp.util.root_pattern("deno.json", "import_map.json")(vim.fn.getcwd()) then
    if client.name == "tsserver" then
      client.stop()
      return
    end
  end
  ]]--
  local opts = { buffer = bufnr, remap = false }

  vim.keymap.set("n", "vd", function() vim.lsp.buf.definition() end, opts)
  vim.keymap.set("n", "vD", function() vim.lsp.buf.type_definition() end, opts)
  vim.keymap.set("n", "K", function() vim.lsp.buf.hover() end, opts)
  vim.keymap.set("n", "vrr", function() vim.lsp.buf.references() end, opts)
  vim.keymap.set("n", "vrn", function() vim.lsp.buf.rename() end, opts)
  vim.keymap.set("i", "<C-h>", function() vim.lsp.buf.signature_help() end, opts)
  vim.keymap.set("n", ";ca", function() vim.lsp.buf.code_action() end, opts)

  vim.keymap.set("n", "<leader>f", function()
    vim.lsp.buf.format({ async = true })
  end, { noremap = true, silent = true })
end)

vim.g.markdown_fenced_languages = {
  "ts=typescript"
}

lsp.configure('denols', {
  root_dir = nvim_lsp.util.root_pattern("deno.json", "import_map.json")
})

require('mason').setup({})
require('mason-lspconfig').setup({
  ensure_installed = lsp_to_install,
  handlers = {
    lsp.default_setup,
  }
})

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


local cmp = require"cmp"

cmp.setup {
  sources = {
    { name = "nvim_lsp" },
    { name = "path" },
    { name = "buffer" },
  }
}
