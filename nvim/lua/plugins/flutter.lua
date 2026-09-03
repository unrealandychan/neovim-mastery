return {
  {
    "akinsho/flutter-tools.nvim",
    lazy = false,
    dependencies = {
      "nvim-lua/plenary.nvim",
      "stevearc/dressing.nvim",
    },
    opts = {
      ui = {
        border = "rounded",
        notification_style = "native",
      },
      decorations = {
        statusline = {
          app_version = true,
          device = true,
        },
      },
      closing_tags = {
        highlight = "Comment",
        prefix = " // ",
        enabled = true,
      },
      lsp = {
        settings = {
          showTodos = true,
          completeFunctionCalls = true,
          analysisExcludedFolders = {
            vim.fn.expand("$HOME/.pub-cache"),
          },
        },
      },
    },
    keys = {
      { "<leader>fs", "<cmd>FlutterSelectDevices<cr>", desc = "Flutter: Select Device" },
      { "<leader>fr", "<cmd>FlutterRun<cr>", desc = "Flutter: Run" },
      { "<leader>fl", "<cmd>FlutterReload<cr>", desc = "Flutter: Hot Reload" },
      { "<leader>fR", "<cmd>FlutterRestart<cr>", desc = "Flutter: Hot Restart" },
      { "<leader>fq", "<cmd>FlutterQuit<cr>", desc = "Flutter: Quit" },
      { "<leader>fo", "<cmd>FlutterOutlineToggle<cr>", desc = "Flutter: Outline Toggle" },
      { "<leader>fd", "<cmd>FlutterDevTools<cr>", desc = "Flutter: Open DevTools" },
      { "<leader>fe", "<cmd>FlutterEmulators<cr>", desc = "Flutter: Emulators" },
    },
  },
}
