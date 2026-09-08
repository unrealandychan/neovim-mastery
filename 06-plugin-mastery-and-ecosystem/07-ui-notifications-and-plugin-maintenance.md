# Chapter 6.7: UI Overhaul, Notifications & Plugin Maintenance

> *"A rock-solid development environment is one that never breaks unexpectedly. Learn how modern UI plugins elevate the visual experience and how version locking keeps your editor completely stable."*

---

## 🎨 1. The Modern Floating UI Stack

Traditional Vim displayed all commands, status messages, and input prompts on a single cramped line at the very bottom of your terminal (`cmdline`).

Your Tokyo Night setup replaces this legacy interface with a **modern floating window architecture**:
- **`noice.nvim`**: Beautiful floating command palette, search count overlays, and toast message routing.
- **`which-key.nvim`**: Instant popup cheatsheet mapping every available shortcut.
- **`dressing.nvim`**: High-resolution rounded modals for selection menus and input dialogs.

---

## 🚀 2. `noice.nvim`: Next-Gen Command Palette & Alerts

When you press `:` in your setup, notice how the command line opens as a **glowing floating window in the center of your screen**:

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│             ┌────────────────────────────┐             │
│             │ :w                         │             │
│             └────────────────────────────┘             │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### Key Capabilities of Noice:
1. **Floating Cmdline**: Auto-completes commands, options, and file paths with syntax highlighting.
2. **Search Count**: Shows instant matches (e.g., `[4/28] matches`) while typing `/search`.
3. **Message Redirection**: Silences annoying background terminal flushes and turns warnings/errors into clean toast cards.

### Managing Notifications:

| Keystroke | Command | Action |
| :--- | :--- | :--- |
| **`<leader>sn`** | `:Noice` | Open the full searchable Noice message history. |
| **`<leader>snh`** | `:Noice history` | View recent notifications. |
| **`<leader>snd`** | `:Noice dismiss` | Dismiss all active toast popups immediately. |
| **`<leader>snt`** | `:Noice telescope` | Search past messages using fuzzy picker. |

---

## 🗺️ 3. `which-key.nvim`: Interactive Cheatsheet

Whenever you hesitate or forget a keybinding, **Which-Key** has your back:
- Press **`<Space>`** and wait 200ms: an organized menu slides up showing every available submenu (`<leader>f` for file, `<leader>c` for code, `<leader>g` for git, `<leader>s` for search).
- Press **`<C-w>`**: shows all window management commands (splits, moves, resizing).
- Press **`g`**: shows all jump motions (`gd` for definition, `gr` for references, `gI` for implementation).
- Press **`]`** or **`[`**: shows all bracket navigations (`]d` for diagnostics, `]h` for git hunks, `]t` for TODOs).

### Registering Your Own Which-Key Labels:
In `lua/config/keymaps.lua`, you can add human-readable descriptions to your own shortcuts:

```lua
local wk = require("which-key")

wk.add({
  { "<leader>m", group = "My Custom Scripts" },
  { "<leader>mt", "<cmd>terminal<cr>", desc = "Open Terminal" },
  { "<leader>mb", "<cmd>!npm run build<cr>", desc = "Run Build Script" },
})
```

---

## 🔒 4. The Lockfile: Why Your Setup Never Breaks

Have you ever updated an editor or extensions and had everything suddenly break on a Monday morning?

LazyVim prevents this with **`lazy-lock.json`**:
- Every time you install or update a plugin, `lazy.nvim` records the **exact git commit SHA** in `lazy-lock.json`.
- When you clone this repository onto another Mac, Linux box, or server, `lazy.nvim` installs the **exact identical commit hashes**.
- You achieve 100% reproducible, deterministic configurations across machines.

```json
{
  "blink.cmp": { "branch": "main", "commit": "ae9e6236b283d168" },
  "tokyonight.nvim": { "branch": "main", "commit": "45d22cf0e1b93476" },
  "snacks.nvim": { "branch": "main", "commit": "882c996cf28183f4d" }
}
```

> [!IMPORTANT]
> **Always commit `lazy-lock.json` to git!**  
> It is the safety net that guarantees your setup can always be restored to a known working state.

---

## 🔄 5. Safe Plugin Updates & Rollbacks

### How to Update Plugins Safely:
1. Open Neovim and run:
   ```vim
   :Lazy
   ```
2. Press **`C`** (Check): This checks GitHub for updates without installing them.
3. Review the changelogs.
4. Press **`U`** (Update): Lazy downloads and compiles the updates and updates `lazy-lock.json`.

### How to Roll Back if an Update Breaks:
If a plugin author pushes a broken update to GitHub:

**Method 1: Inside Neovim**
```vim
:Lazy restore
```
This instantly rolls back all plugins on disk to match the exact commit hashes saved in `lazy-lock.json`!

**Method 2: Via Git**
```bash
git checkout lazy-lock.json
nvim +":Lazy restore" +qa
```

---

## 🏥 6. Health Checks & Diagnostic Logging

When something feels wrong or an external tool isn't responding:

### 1. Neovim System Health Check
```vim
:checkhealth
```
Neovim performs a comprehensive diagnostic audit of:
- Neovim executable and clipboard providers (`pbcopy`)
- Treesitter parsers and compilers
- Mason packages and LSP servers
- Lazy.nvim and LazyVim core health

### 2. Inspecting Log Files
If a plugin or LSP server throws a background error:
- Neovim log file: `~/.local/state/nvim/log`
- LSP log file: `~/.local/state/nvim/lsp.log`

You can view them directly inside Neovim:
```vim
:edit $NVIM_LOG_FILE
```

---

## 💡 Key Takeaways

1. **`noice.nvim`** turns Neovim into a modern floating IDE with searchable notification history (`:Noice`).
2. **`which-key.nvim`** eliminates the need to memorize shortcuts by displaying interactive menus whenever you pause.
3. **`lazy-lock.json`** locks plugin commits to prevent breaking updates.
4. If an update causes an issue, immediately run **`:Lazy restore`** to revert.
5. Use **`:checkhealth`** whenever you need to audit your environment's dependencies.
