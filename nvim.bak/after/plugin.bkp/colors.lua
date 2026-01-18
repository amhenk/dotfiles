function ColorMyPencils(color)
	color = color or 'tokyonight'
	vim.cmd.colorscheme(color)
end

ColorMyPencils()

vim.api.nvim_set_hl(0, "LineNr", { bg = "#f56942", fg = "#cfcfcf" })
vim.api.nvim_set_hl(0, "LineNrAbove", {fg = "#ebb734" })
vim.api.nvim_set_hl(0, "LineNrBelow", {fg = "#ebb734" })

