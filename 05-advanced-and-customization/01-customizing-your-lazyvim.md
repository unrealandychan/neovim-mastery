# Chapter 5.1: Customizing Your Setup (Without Breaking Upgrades)

> *"The beauty of LazyVim is that core updates and your personal customizations are strictly isolated. You can update plugins every week without fear of breaking your custom keymaps or styles."*

---

## 📂 1. Anatomy of `~/.config/nvim/`

Your configuration directory is structured as follows:

```
~/.config/nvim/
├── init.lua                 # Bootstrap entry point (do not edit)
├── lazyvim.json             # Enabled LazyVim extras list
├── lazy-lock.json           # Pin commit hashes of every installed plugin
├── lua/
│   ├── config/
│   │   ├── lazy.lua         # Plugin manager configuration
│   │   ├── options.lua      # Editor options (tabs, line numbers, clipboard)
│   │   ├── keymaps.lua      # Custom keyboard shortcuts
│   │   └── autocmds.lua     # Automated event triggers
│   └── plugins/             # Your custom plugins & overrides
│       ├── colorscheme.lua  # Theme settings (Tokyo Night, etc.)
│       ├── flutter.lua      # Flutter tools & keybindings
│       ├── mason.lua        # Mason tools list
│       └── treesitter.lua   # Syntax parsers
```

---

## ⚙️ 2. Adding Editor Options (`options.lua`)

To change how Neovim behaves, edit [lua/config/options.lua](../nvim/lua/config/options.lua):

```lua
-- Examples you can add:
vim.opt.wrap = true            -- Enable soft line wrapping
vim.opt.shiftwidth = 4         -- Use 4 spaces for indents instead of 2
vim.opt.relativenumber = true  -- Keep relative line numbers active
```

---

## ⌨️ 3. Adding Custom Keymaps (`keymaps.lua`)

To add your own shortcut, edit [lua/config/keymaps.lua](../nvim/lua/config/keymaps.lua):

```lua
local map = vim.keymap.set

-- Syntax: map(mode, lhs, rhs, options)
-- Example: Make <leader>cp copy current relative file path to macOS clipboard
map("n", "<leader>cp", function()
  local path = vim.fn.expand("%:~:.")
  vim.fn.setreg("+", path)
  vim.notify("Copied: " .. path)
end, { desc = "Copy relative path" })
```

---

## 🧩 4. Adding a New Plugin

Any `.lua` file placed in `lua/plugins/` is automatically discovered by Lazy.nvim!

For example, to install a markdown preview plugin:
Create `~/.config/nvim/lua/plugins/markdown.lua`:
```lua
return {
  {
    "iamcco/markdown-preview.nvim",
    cmd = { "MarkdownPreviewToggle", "MarkdownPreview", "MarkdownPreviewStop" },
    build = "cd app && npm install",
    keys = {
      { "<leader>mp", "<cmd>MarkdownPreviewToggle<cr>", desc = "Markdown Preview" },
    },
  },
}
```
Next time you open Neovim, Lazy.nvim automatically downloads and compiles it!

---

## 🔄 5. Updating Plugins & Safe Rollback

- **Check & Update**: Press `<leader>l` to open Lazy, then press `U` to update all plugins to their latest commits.
- **Rollback**: If an upstream plugin ever pushes a bug, your [lazy-lock.json](../nvim/lazy-lock.json) locks exact Git commits. You can simply run `git checkout lazy-lock.json` and `:Lazy restore` to roll back instantly!

---

## 🚀 6. Next Level: Deep Plugin Mastery

Ready to master every plugin in your environment? Continue to **[Module 6: Modern Neovim Plugins & Ecosystem Deep Dive](../06-plugin-mastery-and-ecosystem/01-understanding-neovim-plugins-and-lazy.md)** for detailed guides on `flash.nvim`, `snacks.nvim`, `grug-far.nvim`, `mini.ai`, `todo-comments`, and the complete plugin cheatsheet!

