-- Options are automatically loaded before lazy.nvim startup
-- Default options that are always set: https://github.com/LazyVim/LazyVim/blob/main/lua/lazyvim/config/options.lua

local opt = vim.opt

-- Appearance & Line Numbers
opt.relativenumber = true
opt.number = true
opt.cursorline = true
opt.termguicolors = true
opt.signcolumn = "yes"

-- Scrolling & Padding
opt.scrolloff = 8
opt.sidescrolloff = 8

-- Indentation defaults (2 spaces, smart tab)
opt.tabstop = 2
opt.shiftwidth = 2
opt.expandtab = true
opt.smartindent = true

-- Search behavior
opt.ignorecase = true
opt.smartcase = true
opt.incsearch = true
opt.hlsearch = true

-- Clipboard integration with macOS
opt.clipboard = "unnamedplus"

-- Undo & Backup
opt.undofile = true
opt.swapfile = false
opt.backup = false

-- Windows splits
opt.splitbelow = true
opt.splitright = true

-- Faster completion & response
opt.updatetime = 200
opt.timeoutlen = 300
