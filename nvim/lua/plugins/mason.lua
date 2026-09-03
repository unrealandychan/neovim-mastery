return {
  {
    "mason-org/mason.nvim",
    opts = {
      ensure_installed = {
        -- Lua
        "lua-language-server",
        "stylua",

        -- TypeScript / JavaScript / Web
        "vtsls",
        "tailwindcss-language-server",
        "prettier",
        "eslint-lsp",
        "html-lsp",
        "css-lsp",

        -- Python
        "pyright",
        "ruff",

        -- Go
        "gopls",
        "gofumpt",
        "goimports",

        -- Rust
        "rust-analyzer",
        "codelldb",

        -- Config & Docs
        "json-lsp",
        "yaml-language-server",
        "shfmt",
      },
    },
  },
}
