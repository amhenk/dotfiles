function ColorMyPencils(color)
	color = color or 'edge'
	vim.cmd.colorscheme(color)
end

ColorMyPencils()
