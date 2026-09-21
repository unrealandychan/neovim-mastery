return {
  -- ==========================================================================
  -- 1. In-buffer Rendered Markdown (Headings, Checkboxes, Tables, Callouts)
  -- ==========================================================================
  {
    "MeanderingProgrammer/render-markdown.nvim",
    dependencies = { "nvim-treesitter/nvim-treesitter", "nvim-mini/mini.icons" },
    ft = { "markdown", "markdown.mdx", "norg", "rmd", "org" },
    opts = {
      code = {
        sign = false,
        width = "block",
        right_pad = 2,
      },
      heading = {
        sign = false,
        icons = { "󰲡 ", "󰲣 ", "󰲥 ", "󰲧 ", "󰲩 ", "󰲫 " },
      },
      checkbox = {
        enabled = true,
      },
      bullet = {
        icons = { "●", "○", "◆", "◇" },
      },
    },
    keys = {
      { "<leader>um", "<cmd>RenderMarkdown toggle<cr>", desc = "Toggle Markdown Render (Buffer)" },
    },
  },

  -- ==========================================================================
  -- 2. Live Synchronized Browser Preview (GitHub styling, Mermaid, KaTeX)
  -- ==========================================================================
  {
    "iamcco/markdown-preview.nvim",
    cmd = { "MarkdownPreviewToggle", "MarkdownPreview", "MarkdownPreviewStop" },
    ft = { "markdown" },
    build = function()
      require("lazy").load({ plugins = { "markdown-preview.nvim" } })
      vim.fn["mkdp#util#install"]()
    end,
    keys = {
      { "<leader>mp", "<cmd>MarkdownPreviewToggle<cr>", ft = "markdown", desc = "Markdown Preview (Browser)" },
      { "<leader>cp", "<cmd>MarkdownPreviewToggle<cr>", ft = "markdown", desc = "Markdown Preview (Browser)" },
    },
    config = function()
      vim.cmd([[do FileType]])
    end,
  },

  -- ==========================================================================
  -- 3. In-Terminal Floating Window Preview via Glow CLI
  -- ==========================================================================
  {
    "ellisonleao/glow.nvim",
    cmd = "Glow",
    ft = { "markdown" },
    opts = {
      border = "rounded",
      style = "dark",
      pager = false,
      width = 120,
      height = 100,
      width_ratio = 0.85,
      height_ratio = 0.85,
    },
    keys = {
      { "<leader>mg", "<cmd>Glow<cr>", ft = "markdown", desc = "Markdown Preview (Glow Floating Window)" },
    },
  },
}
