return {
  -- Tokyo Night (Primary Theme)
  {
    "folke/tokyonight.nvim",
    lazy = false,
    priority = 1000,
    opts = {
      style = "night", -- "storm", "moon", "night", or "day"
      transparent = false,
      terminal_colors = true,
      styles = {
        comments = { italic = true },
        keywords = { italic = true },
        functions = {},
        variables = {},
        sidebars = "dark",
        floats = "dark",
      },
    },
  },

  -- Additional popular themes available to switch with :colorscheme
  { "catppuccin/nvim", lazy = true, name = "catppuccin" },
  { "ellisonleao/gruvbox.nvim", lazy = true },
  { "navarasu/onedark.nvim", lazy = true },

  -- Configure LazyVim to load tokyonight-night
  {
    "LazyVim/LazyVim",
    opts = {
      colorscheme = "tokyonight-night",
    },
  },
}
