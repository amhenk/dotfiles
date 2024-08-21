local octo = require("octo")

octo.setup({
  mappings = {
    submit_win = {
      approve_review = { lhs = "<C-y>", desc = "approve review" },
    },
  },
})
