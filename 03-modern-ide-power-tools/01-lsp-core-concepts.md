# Chapter 3.1: Language Server Protocol (LSP) Architecture & Mason

> *"How does Neovim know variable types, function signatures, and compilation errors? Through the Language Server Protocol (LSP)."*

Before LSP was invented by Microsoft in 2016, every code editor had to build separate plugins for every programming language. With LSP, a single **Language Server** (e.g. `gopls` for Go, `rust-analyzer` for Rust, `pyright` for Python) communicates with any editor using a standardized JSON-RPC protocol.

---

## 🏛️ The Architecture in Your Setup

```
┌────────────────────────────────────────────────────────┐
│ Neovim Client (v0.12.5)                                │
│  ├── Built-in LSP Client                               │
│  ├── Mason.nvim (Package Manager for LSPs & Tools)     │
│  ├── Blink.cmp (Fast Autocompletion Engine)            │
│  └── Conform.nvim (Formatting Engine)                  │
└──────────────────────────┬─────────────────────────────┘
                           │ Standardized JSON-RPC
         ┌─────────────────┼─────────────────┐
         ▼                 ▼                 ▼
   ┌───────────┐     ┌───────────┐     ┌───────────┐
   │   vtsls   │     │  pyright  │     │   gopls   │
   │ (TS/JS)   │     │ (Python)  │     │   (Go)    │
   └───────────┘     └───────────┘     └───────────┘
```

---

## 📦 1. Mason: The Tool & Server Manager

In your setup, **Mason** ([lua/plugins/mason.lua](../nvim/lua/plugins/mason.lua)) manages all backend language servers, linters, and formatters.

### How to Open Mason:
* Shortcut: **`<leader>cm`** (Code → Mason) or run `:Mason`

Inside the Mason interactive dashboard:
- All installed servers are listed under `Installed`.
- Available servers are listed below with category tags (`LSP`, `DAP`, `LINTER`, `FORMATTER`).

### Essential Mason Controls:
- **`i`** : Install the server or tool currently highlighted under your cursor.
- **`u`** : Update the highlighted tool.
- **`X`** (Shift+X) : Uninstall the highlighted tool.
- **`U`** : Update **all** installed packages at once!
- **`/`** : Search for a package (e.g. `csharp`, `elixir`, `clangd`).
- **`q`** : Close the Mason window.

---

## 🔍 2. Checking LSP Health & Status

When you open any source code file (e.g. `main.go` or `App.tsx`):
- Look at the bottom statusline: it displays the active LSP name (e.g. `[gopls]` or `[vtsls]`).
- To inspect attached servers and their capabilities:
  ```vim
  :checkhealth vim.lsp
  ```
  or run:
  ```vim
  :LspInfo
  ```
- This confirms which language servers are currently running and watching your open file.

---

## 🏃 Day 15 Drill: Exploring Your Tooling

1. Open Neovim: `nvim`
2. Press `<leader>cm` to open Mason.
3. Observe all the tools we installed for you (`vtsls`, `pyright`, `ruff`, `gopls`, `rust-analyzer`, `prettier`, `tailwindcss-language-server`, `codelldb`, `stylua`).
4. Press `/` and search for a tool like `markdownlint`.
5. Press `q` to exit Mason.
6. Open any file and type `:LspInfo` to confirm LSP attachment.
