# Chapter 6.8: Master Plugin Catalog & Cheatsheet

> *"Your Neovim installation is powered by over 40 meticulously curated, high-performance plugins. Here is the definitive field guide to every single plugin installed on your machine."*

---

## 📑 Quick Navigation Index

1. [Framework & Package Management](#1-framework--package-management)
2. [Search, Picker & Navigation](#2-search-picker--navigation)
3. [Language Intelligence & Autocomplete (LSP)](#3-language-intelligence--autocomplete-lsp)
4. [Formatting, Linting & Diagnostics](#4-formatting-linting--diagnostics)
5. [Syntax Highlighting & Treesitter](#5-syntax-highlighting--treesitter)
6. [Micro-Editing & Text Objects](#6-micro-editing--text-objects)
7. [UI, Statusline & Discovery](#7-ui-statusline--discovery)
8. [Git Integration & Workspace Sessions](#8-git-integration--workspace-sessions)
9. [Language-Specific Powerhouses](#9-language-specific-powerhouses)

---

## 1. Framework & Package Management

### [LazyVim](https://github.com/LazyVim/LazyVim)
- **Purpose**: The foundational IDE framework providing battle-tested defaults, options, and plugin integrations.
- **Config**: `lua/config/lazy.lua`
- **Key Commands**: `:LazyExtras` (toggle optional language & AI features).

### [lazy.nvim](https://github.com/folke/lazy.nvim)
- **Purpose**: Next-generation plugin manager supporting microsecond lazy-loading, dependency trees, and version locking.
- **Key Commands**:
  - `:Lazy`: Open the interactive manager dashboard.
  - `:Lazy update`: Update all plugins to latest commits.
  - `:Lazy restore`: Roll back all plugins to commit hashes in `lazy-lock.json`.
  - `:Lazy clean`: Remove uninstalled plugins from disk.

### [mason.nvim](https://github.com/williamboman/mason.nvim) & [mason-lspconfig.nvim](https://github.com/williamboman/mason-lspconfig.nvim)
- **Purpose**: Portable package manager for installing LSPs, DAPs, linters, and formatters directly inside Neovim.
- **Key Command**: `<leader>cm` (Code → Mason) or `:Mason`.
- **Config**: `lua/plugins/mason.lua` (see `ensure_installed`).
- **Pro-Tip**: Press `i` on any tool in the Mason menu to install it immediately.

---

## 2. Search, Picker & Navigation

### [snacks.nvim](https://github.com/folke/snacks.nvim)
- **Purpose**: All-in-one suite powering pickers, floating terminals, scratchpads, reference hopping, and git browsing.
- **Key Shortcuts**:
  - `<leader><space>`: Find files.
  - `<leader>/`: Live grep repository.
  - `<leader>,`: Switch open buffers.
  - `<C-/>` or `<leader>ft`: Toggle floating terminal.
  - `<leader>.`: Instant persistent scratchpad.
  - `]]` / `[[`: Jump to next / previous occurrence of symbol under cursor.
  - `<leader>bd`: Delete buffer without closing window split.
  - `<leader>gB`: Open file/line in GitHub browser.
  - `<leader>uC`: Switch colorschemes with live preview.

### [flash.nvim](https://github.com/folke/flash.nvim)
- **Purpose**: 2-character visual teleportation across the entire screen and remote operators.
- **Key Shortcuts**:
  - `s`: Flash jump forward & backward.
  - `S`: Treesitter Flash jump (selects AST code nodes).
  - `yr`: Remote Yank (copy a word anywhere on screen without moving cursor!).
  - `dr`: Remote Delete.

### [neo-tree.nvim](https://github.com/nvim-neo-tree/neo-tree.nvim)
- **Purpose**: File system explorer sidebar with git status and file icons.
- **Key Shortcut**: `<leader>e` to toggle tree.
- **In-Tree Keys**: `a` (add file/folder), `d` (delete), `r` (rename), `y` (copy path), `H` (toggle hidden).

### [grug-far.nvim](https://github.com/MagicDuck/grug-far.nvim)
- **Purpose**: Project-wide search and replace in an interactive, editable buffer with live diffs.
- **Key Shortcuts**:
  - `<leader>sr`: Open search and replace buffer.
  - `<localleader>s`: Sync/apply all replacements across disk.

### [fzf-lua](https://github.com/ibhagwan/fzf-lua)
- **Purpose**: High-speed fallback fuzzy finder integration backed by C/Rust binaries.

---

## 3. Language Intelligence & Autocomplete (LSP)

### [nvim-lspconfig](https://github.com/neovim/nvim-lspconfig)
- **Purpose**: Native Language Server Protocol client configuration for 100+ languages.
- **Key Shortcuts**:
  - `gd`: Go to definition.
  - `gr`: Go to references.
  - `gI`: Go to implementation.
  - `K`: Hover documentation / signature help.
  - `<leader>ca`: Code action / quick-fix.
  - `<leader>cr`: Rename symbol across project.

### [blink.cmp](https://github.com/Saghen/blink.cmp)
- **Purpose**: Blazing fast autocompletion engine engineered in Rust and Lua.
- **Key Shortcuts**:
  - `<C-space>`: Manually invoke autocomplete popup.
  - `<Tab>` / `<S-Tab>`: Navigate candidate list.
  - `<CR>`: Accept selected completion.
  - `<C-k>`: Toggle documentation preview.

### [friendly-snippets](https://github.com/rafamadriz/friendly-snippets)
- **Purpose**: Massive collection of curated snippets for all major languages (`fn`, `for`, `try/catch`, `class`).

### [lazydev.nvim](https://github.com/folke/lazydev.nvim)
- **Purpose**: Configures Lua language server (`lua_ls`) for editing Neovim configs with full type signatures for `vim.*` APIs and plugins.

### [SchemaStore.nvim](https://github.com/b0o/SchemaStore.nvim)
- **Purpose**: Automatic JSON & YAML schema validation for `package.json`, `tsconfig.json`, GitHub Workflows, and Docker Compose.

---

## 4. Formatting, Linting & Diagnostics

### [conform.nvim](https://github.com/stevearc/conform.nvim)
- **Purpose**: Ultra-fast code formatting engine with automatic format-on-save.
- **Key Shortcuts**:
  - `<leader>cf`: Manually format current buffer.
  - `<leader>uf`: Toggle format-on-save for current buffer.
  - `<leader>uF`: Toggle format-on-save globally.

### [nvim-lint](https://github.com/mfussenegger/nvim-lint)
- **Purpose**: Asynchronous linter integration (ESLint, Ruff, ShellCheck).
- **Behavior**: Runs automatically on buffer save without blocking typing.

### [trouble.nvim](https://github.com/folke/trouble.nvim)
- **Purpose**: Interactive diagnostic command center showing all project errors, warnings, and LSP symbols.
- **Key Shortcuts**:
  - `<leader>xx`: Toggle Trouble diagnostics panel.
  - `<leader>xX`: Buffer-only diagnostics.
  - `<leader>cs`: Buffer symbols.
  - `<leader>cl`: LSP definitions / references.
  - `<leader>xL`: Location list.
  - `<leader>xQ`: Quickfix list.

---

## 5. Syntax Highlighting & Treesitter

### [nvim-treesitter](https://github.com/nvim-treesitter/nvim-treesitter)
- **Purpose**: Concrete syntax tree parser providing accurate highlighting and indentation.
- **Config**: `lua/plugins/treesitter.lua` (see `ensure_installed`).
- **Key Commands**: `:TSUpdate`, `:TSInstall <lang>`.

### [nvim-treesitter-textobjects](https://github.com/nvim-treesitter/nvim-treesitter-textobjects)
- **Purpose**: AST-aware motions and selections (`]m` next method, `[m` prev method).

### [nvim-ts-autotag](https://github.com/windwp/nvim-ts-autotag)
- **Purpose**: Automatically closes and renames matching HTML/JSX tags.

---

## 6. Micro-Editing & Text Objects

### [mini.ai](https://github.com/echasnovski/mini.ai)
- **Purpose**: Extended text objects for functions, classes, arguments, and quotes.
- **Key Shortcuts**:
  - `daf` / `cif`: Around / inside function.
  - `dac` / `cic`: Around / inside class.
  - `daa` / `cia`: Around / inside argument (removes comma!).
  - `ciq`: Change inside quotes.
  - `cib`: Change inside brackets.

### [mini.pairs](https://github.com/echasnovski/mini.pairs)
- **Purpose**: Frictionless auto-closing brackets `()`, `[]`, `{}`, `""`.

### [todo-comments.nvim](https://github.com/folke/todo-comments.nvim)
- **Purpose**: Highlights and searches `TODO:`, `FIXME:`, `BUG:`, `HACK:`, `PERF:`.
- **Key Shortcuts**:
  - `]t` / `[t`: Next / previous TODO.
  - `<leader>st`: Search all project TODOs with Snacks.
  - `<leader>xt`: View all project TODOs in Trouble.

### [ts-comments.nvim](https://github.com/folke/ts-comments.nvim)
- **Purpose**: Context-aware commenting for embedded languages.
- **Key Shortcuts**: `gcc` (line comment), `gc` (visual selection comment).

---

## 7. UI, Statusline & Discovery

### [tokyonight.nvim](https://github.com/folke/tokyonight.nvim)
- **Purpose**: Primary theme (`tokyonight-night`) with dark floats and italic comments.
- **Config**: `lua/plugins/colorscheme.lua`.

### [catppuccin](https://github.com/catppuccin/nvim), [gruvbox.nvim](https://github.com/ellisonleao/gruvbox.nvim), [onedark.nvim](https://github.com/navarasu/onedark.nvim)
- **Purpose**: Alternate installed themes ready to switch with `<leader>uC`.

### [lualine.nvim](https://github.com/nvim-lualine/lualine.nvim)
- **Purpose**: Fast statusline showing mode, file name, git branch, diffs, diagnostics, and filetype.

### [bufferline.nvim](https://github.com/akinsho/bufferline.nvim)
- **Purpose**: Top tab bar showing open buffers.
- **Key Shortcuts**: `<Shift>h` (prev buffer), `<Shift>l` (next buffer), `<leader>bp` (pin buffer), `<leader>bo` (close other buffers).

### [noice.nvim](https://github.com/folke/noice.nvim)
- **Purpose**: Floating command palette, search count popup, and message history (`<leader>sn`).

### [which-key.nvim](https://github.com/folke/which-key.nvim)
- **Purpose**: Interactive popup cheatsheet appearing whenever you press `<Space>`, `<C-w>`, `g`, `]`, `[`.

### [dressing.nvim](https://github.com/stevearc/dressing.nvim) & [nui.nvim](https://github.com/MunifTanjim/nui.nvim)
- **Purpose**: Rounded floating UI dialogs for inputs, selects, and components.

### [mini.icons](https://github.com/echasnovski/mini.icons)
- **Purpose**: High-speed Nerd Font icon provider for filetypes, folders, and LSP kinds.

---

## 8. Git Integration & Workspace Sessions

### [gitsigns.nvim](https://github.com/lewis6991/gitsigns.nvim)
- **Purpose**: In-buffer git diff markers in gutter, hunk staging, and blame.
- **Key Shortcuts**:
  - `]h` / `[h`: Next / previous git change.
  - `<leader>ghs`: Stage hunk.
  - `<leader>ghr`: Reset hunk.
  - `<leader>ghp`: Preview hunk diff float.
  - `<leader>ghb`: Toggle line blame.

### [persistence.nvim](https://github.com/folke/persistence.nvim)
- **Purpose**: Automated workspace session saving and restoring.
- **Key Shortcuts**:
  - `<leader>qs`: Restore session for current project directory.
  - `<leader>ql`: Restore last session.
  - `<leader>qd`: Quit without saving session.

### [plenary.nvim](https://github.com/nvim-lua/plenary.nvim)
- **Purpose**: Universal Lua utility library required by many plugins (async, path, testing).

---

## 9. Language-Specific Powerhouses

### [rustaceanvim](https://github.com/mrcjkb/rustaceanvim) & [crates.nvim](https://github.com/saecki/crates.nvim)
- **Purpose**: Rust superpower tooling: inlay hints, runnable tests, cargo commands, inline `Cargo.toml` dependency versions and upgrade hints.
- **Key Shortcuts**: `<leader>cR` (Cargo commands), `<leader>dr` (debug Rust target).

### [flutter-tools.nvim](https://github.com/akinsho/flutter-tools.nvim)
- **Purpose**: Flutter & Dart mobile suite: hot reload, device selector, widget outline.
- **Config**: `lua/plugins/flutter.lua`.
- **Key Shortcuts**:
  - `<leader>fs`: Select target device / emulator.
  - `<leader>fr`: Run app.
  - `<leader>fl`: Hot reload.
  - `<leader>fR`: Hot restart.
  - `<leader>fo`: Toggle widget outline tree.

### [venv-selector.nvim](https://github.com/linux-cultist/venv-selector.nvim)
- **Purpose**: Discovers and activates Python virtual environments (uv, poetry, conda, pipenv, venv).
- **Key Shortcut**: `<leader>cv` (Select Virtualenv).

---

## 💡 Master Keystroke Quick Reference Card

Keep this card handy while coding:

```
┌─────────────────────────────────────────────────────────────┐
│ 🚀 NEOVIM POWER SHORTCUTS CHEATSHEET                        │
├─────────────────────────────────────────────────────────────┤
│ NAVIGATION & TELEPORTATION                                  │
│   s                 Teleport anywhere on screen (Flash)     │
│   S                 Select Treesitter code block (Flash)    │
│   yr                Remote Yank without moving cursor       │
│   <leader><space>   Fuzzy find file                         │
│   <leader>/         Live grep codebase                      │
│   <leader>,         Switch open buffer                      │
│   ]] / [[           Jump next / previous word reference     │
│   <leader>e         Toggle Neo-Tree explorer                │
├─────────────────────────────────────────────────────────────┤
│ EDITING & REFACTORING                                       │
│   <leader>sr        Interactive Global Search & Replace     │
│   <leader>cr        Rename symbol across project            │
│   <leader>ca        Code action / quick-fix                 │
│   <leader>cf        Format file (Conform)                   │
│   daa / cia         Delete / change function argument       │
│   daf / cif         Delete / change entire function         │
│   ]t / [t           Next / previous TODO comment            │
├─────────────────────────────────────────────────────────────┤
│ TERMINAL, SESSIONS & TOOLS                                  │
│   <C-/>             Toggle floating terminal (Snacks)       │
│   <leader>.         Open persistent scratchpad              │
│   <leader>bd        Close buffer (keep window splits)       │
│   <leader>xx        Toggle Trouble diagnostic panel         │
│   <leader>qs        Restore workspace session               │
│   <leader>gg        Floating LazyGit                        │
│   :Lazy             Open plugin manager                     │
│   :Mason            Open LSP / tools installer              │
└─────────────────────────────────────────────────────────────┘
```
