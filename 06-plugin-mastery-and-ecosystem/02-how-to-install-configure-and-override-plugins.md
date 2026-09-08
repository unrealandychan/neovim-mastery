# Chapter 6.2: How to Install, Configure & Override Plugins

> *"You never need to edit LazyVim's internal core files to customize behavior. Any file you add in `lua/plugins/` automatically configures, overrides, or extends your setup."*

---

## 📁 1. The `lua/plugins/` Magic

In LazyVim, `lua/config/lazy.lua` contains this line:
```lua
{ import = "plugins" }
```
This tells `lazy.nvim` to automatically scan every `.lua` file inside `~/.config/nvim/lua/plugins/`.

- You do **not** need to register new files in `init.lua`.
- You can create separate files for different plugins (e.g., `lua/plugins/formatting.lua`, `lua/plugins/surround.lua`, `lua/plugins/git.lua`).
- Every file in `lua/plugins/` must return either:
  1. A single plugin spec table: `return { "plugin/name", ... }`
  2. A list of plugin spec tables: `return { { "plugin/one" }, { "plugin/two" } }`

---

## 🍳 Recipe 1: Installing a New Plugin from GitHub

Suppose you want to install **`kylechui/nvim-surround`** (which adds commands to add/change quotes, parentheses, and tags around text).

### Step 1: Create a new file in `lua/plugins/`
Create `~/.config/nvim/lua/plugins/surround.lua`:

```lua
return {
  "kylechui/nvim-surround",
  version = "*", -- Use for stability; omit to use main branch
  event = "VeryLazy",
  opts = {
    -- Custom surround options (leave empty table {} for sensible defaults)
  },
}
```

### Step 2: Restart Neovim or run `:Lazy`
- Neovim detects the new file, clones the plugin from `https://github.com/kylechui/nvim-surround`, and loads it automatically!
- You can verify by opening `:Lazy` and seeing `nvim-surround` installed.

---

## 🍳 Recipe 2: Overriding Options of an Existing Plugin

Suppose you want to customize **`neo-tree.nvim`** (which is already built into LazyVim) so that hidden/dotfiles are visible by default.

You do **not** touch LazyVim's core code. You simply declare `neo-tree.nvim` in your own `lua/plugins/` file:

Create `~/.config/nvim/lua/plugins/neotree.lua`:

```lua
return {
  "nvim-neo-tree/neo-tree.nvim",
  opts = {
    filesystem = {
      filtered_items = {
        visible = true,       -- Show hidden files (.gitignore, .env, etc.)
        hide_dotfiles = false,
        hide_gitignored = false,
      },
    },
  },
}
```

`lazy.nvim` takes your `opts` and deep-merges it with LazyVim's default `neo-tree` settings. Everything else (icons, git status, keymaps) continues to work perfectly!

---

## 🍳 Recipe 3: Disabling a Built-in Plugin

Suppose you prefer not to use **`bufferline.nvim`** (the top tab bar) and want plain Neovim windows.

Create `~/.config/nvim/lua/plugins/disabled.lua`:

```lua
return {
  -- Disable bufferline
  { "akinsho/bufferline.nvim", enabled = false },

  -- Disable another plugin if desired
  -- { "folke/noice.nvim", enabled = false },
}
```

Setting `enabled = false` instructs `lazy.nvim` to completely skip loading the plugin. It will not execute, consume memory, or bind any keys.

---

## 🍳 Recipe 4: Customizing Plugin Keybindings

Suppose you want to change the shortcut for toggling **Neo-Tree** from `<leader>e` to `<leader>fe` (File Explorer), or add a custom shortcut to an existing plugin.

Create `~/.config/nvim/lua/plugins/keymaps_override.lua`:

```lua
return {
  {
    "nvim-neo-tree/neo-tree.nvim",
    keys = {
      -- Disable default <leader>e
      { "<leader>e", false },
      -- Add your new custom keymap
      { "<leader>fe", "<cmd>Neotree toggle<cr>", desc = "NeoTree Explorer" },
    },
  },
}
```

Notice the pattern `{ "<leader>e", false }`: setting a key to `false` disables an existing upstream keybinding.

---

## 🍳 Recipe 5: Running Custom Setup with `config`

When you need to execute custom Lua code before or after a plugin starts, use the `config` function.

```lua
return {
  "lewis6991/gitsigns.nvim",
  opts = {
    current_line_blame = true, -- Turn on inline git blame
  },
  config = function(_, opts)
    -- 1. Run the plugin's default setup with our merged opts
    require("gitsigns").setup(opts)

    -- 2. Run our custom logic or create custom commands
    vim.api.nvim_create_user_command("GitBlameToggle", function()
      require("gitsigns").toggle_current_line_blame()
    end, { desc = "Toggle Git Blame on cursor line" })
  end,
}
```

---

## 🍳 Recipe 6: One File vs Multiple Files

`lazy.nvim` is completely flexible about how you organize files inside `lua/plugins/`:

### Approach A: Grouped by Category (Recommended)
```
lua/plugins/
├── ui.lua          # Colorscheme, bufferline, statusline tweaks
├── coding.lua      # Autocomplete, snippets, surround
├── lsp.lua         # LSP server overrides, mason packages
└── git.lua         # Gitsigns, lazygit customizations
```

### Approach B: One File Per Plugin
```
lua/plugins/
├── colorscheme.lua
├── flutter.lua
├── mason.lua
├── neotree.lua
└── treesitter.lua
```

Both styles work identically. Choose whichever is easiest for your brain to navigate!

---

## 🌐 7. Where to Discover the Best Neovim Plugins

When you want to add new capabilities to your Neovim setup:

1. **[Dotfyle](https://dotfyle.com/plugins)**: The definitive directory of trending Neovim plugins with popularity scores, categories, and LazyVim configs.
2. **[Awesome Neovim](https://github.com/rockerBOO/awesome-neovim)**: Curated list of top-tier Neovim plugins organized by category.
3. **[Neovimcraft](https://neovimcraft.com/)**: Searchable database of community plugins and themes.
4. **[LazyVim Extras](https://www.lazyvim.org/extras)**: Before installing an external plugin, check `:LazyExtras`! High chance LazyVim already has a battle-tested one-click recipe for it.

---

## 💡 Key Takeaways

1. **Never edit core LazyVim files**; make all changes inside `~/.config/nvim/lua/plugins/`.
2. Every `.lua` file inside `lua/plugins/` is automatically discovered and loaded.
3. Use **`opts = { ... }`** to merge settings into existing plugins.
4. Set **`enabled = false`** to completely disable any plugin.
5. Set keybindings to **`false`** to remove unwanted shortcuts.
