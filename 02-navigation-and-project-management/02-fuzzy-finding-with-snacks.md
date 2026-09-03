# Chapter 2.2: Blazing Fast Fuzzy Finding & Project Search

> *"Never browse through directory trees looking for a file. Fuzzy find it in 3 keystrokes."*

In traditional IDEs, you often click through folders like `src/ -> components/ -> auth/ -> LoginForm.tsx`.  
In Neovim, you press `<Space><Space>`, type `loginf`, hit `<Enter>`, and you are there in 200 milliseconds.

Your setup is powered by **Snacks.nvim Picker** and backed by the Rust-based CLI tools **`ripgrep`** and **`fd`** we installed via Homebrew.

---

## 🚀 The Essential Search Shortcuts

The Leader key is **`<Space>`**.

### 1. Finding Files (`<leader><space>`)
- Shortcut: **`<leader><space>`**
- Action: Opens the fast fuzzy file finder from your current working directory.
- Features:
  - Powered by `fd` (ignores `.git`, respects `.gitignore`, searches submodules).
  - Type fuzzy patterns: e.g., `cfglz` matches `config/lazy.lua`!
  - Real-time syntax-highlighted preview of the file on the right side.

### 2. Live Grep Across Entire Codebase (`<leader>/`)
- Shortcut: **`<leader>/`**
- Action: Searches file contents across every single file in the project.
- Powered by `ripgrep` (`rg`), the fastest search engine on earth.
- As you type, results update at 60 frames per second.
- Regex searching is supported out of the box!

### 3. Finding Open Buffers (`<leader>fb` or `,<space>`)
- Shortcut: **`<leader>fb`**
- Action: Filters only currently open files. Perfect when you are working on 5 related files and want to switch between them instantly.

### 4. Recent Files (`<leader>fr`)
- Shortcut: **`<leader>fr`**
- Action: Shows files you recently edited or opened, ordered chronologically.

### 5. Find Neovim Config Files (`<leader>fc`)
- Shortcut: **`<leader>fc`**
- Action: Immediately opens a picker inside `~/.config/nvim/` so you can view or edit your config from anywhere on your system!

---

## 🕹️ Controls Inside the Fuzzy Picker

When the floating search window pops up:

| Keybinding | Action |
| :--- | :--- |
| `<C-j>` or `<Down>` | Move down the results list |
| `<C-k>` or `<Up>` | Move up the results list |
| `<CR>` (`Enter`) | Open the selected file in the active window |
| `<C-v>` | Open the selected file in a **Vertical Split**! |
| `<C-s>` | Open the selected file in a **Horizontal Split**! |
| `<C-t>` | Open the selected file in a **New Tab** |
| `<C-u>` / `<C-d>` | Scroll the preview pane up / down |
| `<Esc>` | Close the picker without opening anything |

---

## ⚡ Super Search: Word Under Cursor (`<leader>sw`)

Have you ever wondered: *"Where else is this variable or function used across the entire repository?"*

1. Place your cursor on the word in Normal Mode.
2. Press **`<leader>sw`** (Search Word).
3. Neovim instantly performs a project-wide ripgrep for that exact symbol and shows all occurrences with syntax-highlighted context!

---

## 🏃 Day 10 Drill: Project Search Sprint

1. Launch Neovim from your home directory or a project root: `nvim`
2. Press `<leader><space>` and type `lazy` to open `lazy.lua`.
3. Press `<leader>/` and search for the word `tokyonight`.
4. Navigate through results with `<C-j>` and `<C-k>`, observing the live preview pane.
5. Press `<C-v>` on a result to open it in a vertical split.
6. Press `<leader>fr` to see your recently opened files list.
