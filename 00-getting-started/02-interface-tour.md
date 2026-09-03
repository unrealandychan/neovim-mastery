# Chapter 0.2: Interface Tour & Visual Anatomy

When you type `nvim` into your terminal, you are greeted by your Tokyo Night environment. Let's break down each visual component of your screen so you feel completely at home.

---

## 🖥️ Screen Layout Anatomy

```
┌────────────────────────────────────────────────────────────────────────┐
│ [Bufferline: Tabs of open files at the very top]                      │
│ 1: options.lua  2: keymaps.lua  3: main.ts                            │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│                                                                        │
│                         [Main Editor Area]                             │
│                      Line numbers on the left:                         │
│                    1  import { useState } from 'react';                │
│                    2                                                   │
│                    3  export function App() {                          │
│                                                                        │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│ [Lualine Status Bar at the bottom]                                     │
│  NORMAL  main.ts [+]   utf-8   typescript   Ln 3, Col 18   100%       │
├────────────────────────────────────────────────────────────────────────┤
│ [Command / Notification Line]                                          │
│ :                                                                      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🌟 The 5 Key Interface Elements

### 1. The Welcome Dashboard (Snacks Dashboard)
When you run `nvim` without specifying a file, you see the startup dashboard:
- Fast shortcuts to:
  - Find file (`f`)
  - New file (`n`)
  - Recent files (`r`)
  - Grep text (`g`)
  - Restore session (`s`)
  - Quit (`q`)
- Tip: Press any of the underlined shortcut letters to immediately jump into that action.

### 2. The Bufferline (Top Bar)
- Shows all currently open files (buffers) like tabs in Chrome or VS Code.
- Notice numbers next to them (`1`, `2`, `3`).
- **To switch buffers**:
  - `<Shift>h` : Jump to the previous buffer tab
  - `<Shift>l` : Jump to the next buffer tab
  - `<leader>bd` : Close (delete) the current buffer

### 3. The Statusline (Lualine, Bottom Bar)
Provides real-time feedback:
- **Current Mode**: `NORMAL` (blue/purple), `INSERT` (green), `VISUAL` (orange), `COMMAND` (yellow).
- **Git Branch & Status**: Shows current git branch and uncommitted additions (`+`), modifications (`~`), and removals (`-`).
- **LSP Diagnostics**: Counters for Errors (), Warnings (), and Hints ().
- **Filetype & Encoding**: E.g., `typescript`, `python`, `go`, `dart`.
- **Cursor Position**: Line and column number.

### 4. Which-Key: Your Built-In Interactive Cheatsheet
Never worry about forgetting a keymap. In Normal Mode:
- Press **`<Space>`** (the Leader key) and **pause for 300ms**.
- A slick popup menu will instantly appear at the bottom showing every single available category:
  - `b` → Buffers
  - `c` → Code (LSP actions, rename, format)
  - `f` → Find (files, grep, git, config)
  - `g` → Git (lazygit, hunks, blame)
  - `q` → Quit / Session
  - `s` → Search
  - `u` → UI Toggles
  - `w` → Windows & splits
- If you press `c`, it opens the sub-menu for Code (`ca` code action, `cr` rename, `cf` format, etc.).
- **Which-Key ensures you can never get lost.**

### 5. Floating Windows & Notifications (Noice.nvim)
- System messages, search feedback, and LSP documentation pop up in clean floating boxes with rounded borders, without messing up your buffer layout.
- Dismiss any popup with `<Esc>` or `:noh`.
