local ls = require('luasnip')

local s = ls.snippet
local t = ls.text_node
local i = ls.insert_node


ls.setup({})

ls.add_snippets("ruby", {
  -- Add file boiler plate
  s("tf", {
    t({ "# typed: true", "" }),
    t({ "# frozen_string_literal: true", "" }),
    t(""),
    t({ "", "module "}),
    i(1, "ModuleName"), -- module name with placeholder
    t({ "", "\t" }),
    i(0), -- close snippet
    t({ "", "end" })
  })
})
