# Chapter 6.5: Snacks.nvim — The Modern Neovim Swiss Army Knife

> *"Why install 15 separate micro-plugins with conflicting configs when one ultra-fast, unified framework can power your pickers, terminals, scratchpads, and git browsing?"*

---

## ⚡ 1. What is Snacks.nvim?

Created by Folke Lemaitre in 2024, **`snacks.nvim`** is the new powerhouse behind LazyVim v16. It replaces dozens of older, fragmented community plugins with a unified, native Lua engine engineered for maximum speed and cohesive UI aesthetics.

Your setup uses Snacks to power:
- **Pickers & Grep** (Fuzzy searching files, buffers, symbols, commands)
- **Floating Terminals** (Integrated command-line overlay)
- **Scratchpads** (Instant notes and sandbox buffers)
- **Word Hopping** (LSP reference navigation)
- **Smart Buffer Deletion** (Closing files without closing window splits)
- **Git Browser Integration** (Opening files directly in GitHub)
- **Toast Notifications** (Sleek floating alerts)
- **Zen Mode** (Distraction-free focus writing)

---

## 🔍 2. Snacks Picker Mastery

Snacks Picker replaces older tools like Telescope and FZF with an engine that opens in under **2 milliseconds**.

### Essential Picker Shortcuts:

| Keystroke | Function | What It Finds |
| :--- | :--- | :--- |
| **`<leader><space>`** | **Find Files** | Fast fuzzy search for files in project root. |
| **`<leader>/`** | **Live Grep** | Search full-text content across all files in repository. |
| **`<leader>,`** | **Switch Buffers** | Search and jump between currently open files. |
| **`<leader>fr`** | **Recent Files** | Search recently opened files (persists across restarts). |
| **`<leader>ss`** | **LSP Symbols** | Search functions, classes, and variables in the current buffer. |
| **`<leader>sS`** | **Workspace Symbols** | Search symbols across the **entire project**. |
| **`<leader>sk`** | **Search Keymaps** | Interactive list of all active Neovim shortcuts. |
| **`<leader>sc`** | **Search Commands** | Search all available `:command` actions. |
| **`<leader>uC`** | **Switch Colorschemes** | Cycle themes (`tokyonight`, `catppuccin`, `gruvbox`) with **instant live preview**! |

### Inside Any Picker Window:
- **`<C-j>` / `<C-k>`**: Navigate candidates up and down.
- **`<Enter>`**: Open selected file in current window.
- **`<C-v>`**: Open file in a **vertical split**.
- **`<C-s>`**: Open file in a **horizontal split**.
- **`<C-q>`**: Send all matching results to Neovim's **Quickfix list** for batch operations.

---

## 💻 3. Snacks Floating Terminal (`<C-/>`)

You never need to switch away from Neovim to a separate terminal window to run Docker, npm, tests, or system commands.

### Toggling the Terminal:
- Press **`<C-/>`** (or **`<leader>ft`**):
  - A beautiful floating terminal window opens over your code.
  - You can run `npm test`, `git status`, `curl`, or any CLI command.
- Press **`<C-/>`** again:
  - The terminal window is hidden, **but your process continues running in the background**!
- Press **`<C-/>`** a third time:
  - The terminal reopens with your running command and output preserved!

```
┌────────────────────────────────────────────────────────┐
│ Editor Buffer: src/server.ts                           │
│ ┌────────────────────────────────────────────────────┐ │
│ │  ⚡ Snacks Terminal (zsh)                           │ │
│ │  $ npm run test                                    │ │
│ │  PASS  tests/auth.test.ts                          │ │
│ │  PASS  tests/user.test.ts                          │ │
│ │  Tests: 12 passed, 12 total                        │ │
│ │                                                    │ │
│ └────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

> [!TIP]
> If your macOS terminal emulator captures `<C-/>` as `<C-_>`, both key combinations are mapped to open the terminal!

---

## 📝 4. Snacks Scratchpad (`<leader>.`)

How often do you need to write a quick note, test a JSON payload, or draft a SQL query, but don't want to create an actual file on disk?

- Press **`<leader>.`**:
  - Instantly opens a floating scratch buffer.
  - Type your notes, snippets, or temporary thoughts.
  - Press `q` or `<leader>.` to close it.
  - Snacks **automatically saves your scratch buffer** so your notes are still there tomorrow!
- Press **`<leader>S`**:
  - Opens a picker to switch between different saved scratchpads.

---

## 🔤 5. Snacks Words: Reference Hopping (`]]` & `[[`)

When your cursor rests on any variable, function, or class, Snacks Words highlights every occurrence of that symbol in the current buffer using LSP intelligence.

- **`]]`**: Jump directly to the **next** occurrence of the symbol.
- **`[[`**: Jump directly to the **previous** occurrence of the symbol.

This is vastly superior to `/search` because it jumps only to actual semantic references, ignoring comments or partial string matches!

---

## 🗑️ 6. Smart Buffer Delete (`<leader>bd`)

In standard Neovim, typing `:bd` (buffer delete) kills the window split, collapsing your carefully arranged side-by-side editing layout.

LazyVim integrates **`Snacks.bufdelete`**:
- Shortcut: **`<leader>bd`**
- Action: Unloads the current file from memory while **preserving your window splits and layout intact**. Another open buffer seamlessly fills the empty viewport.

---

## 🌐 7. Git Web Browser Integration (`<leader>gB`)

Need to send a link of the exact lines you are working on to a teammate in Slack or a GitHub PR?

1. Highlight lines in Visual Mode (or stay on a single line in Normal Mode).
2. Press **`<leader>gB`** (Git → Browse).
3. Snacks detects your repository's remote URL, constructs the exact permanent GitHub / GitLab / Bitbucket commit permalink, and opens it in your default web browser!

Other Git helpers:
- **`<leader>gb`**: Inline Git Blame for the current line.
- **`<leader>gg`**: Floating LazyGit terminal overlay.

---

## 🧘 8. Zen Mode & Distraction-Free Editing (`<leader>uz`)

When you are writing documentation, drafting a blog post, or deep in flow and want zero visual distractions:

- Press **`<leader>uz`** (UI → Zen):
  - Hides line numbers, statusline, and tabline.
  - Centers your text buffer in the middle of the screen like a clean writing pad.
- Press **`<leader>uz`** again to return to full IDE mode.

---

## 💡 Key Takeaways

1. **`<leader><space>`** and **`<leader>/`** are your primary fuzzy file and project grep shortcuts.
2. Toggle a persistent floating terminal anywhere with **`<C-/>`**.
3. Use **`<leader>.`** for instant persistent scratch notes.
4. Hop across semantic variable references with **`]]`** and **`[[`**.
5. Close files safely without collapsing your window layout using **`<leader>bd`**.
6. Share code permalinks instantly using **`<leader>gB`**.
