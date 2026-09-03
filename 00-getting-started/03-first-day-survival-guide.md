# Chapter 0.3: First-Day Survival Guide

> *"How do I exit Vim?"* is the most searched programming question on Stack Overflow.  
> After reading this chapter, you will never get stuck again.

---

## 🚪 Entering and Exiting Neovim

### How to Open a File
From your terminal:
```bash
# Open an empty Neovim instance
nvim

# Open a specific file
nvim main.ts

# Open a folder / project root
nvim .
```

### How to Save & Exit (The Golden Commands)

| Action | Normal Mode Command | Command-Line Mode (`:`) |
| :--- | :--- | :--- |
| **Save current file** | `<C-s>` or `<leader>w` | `:w<Enter>` |
| **Save and Exit** | `ZZ` (Shift+Z twice) | `:wq<Enter>` or `:x<Enter>` |
| **Quit (if no unsaved changes)** | `<leader>q` | `:q<Enter>` |
| **Force Quit (discard unsaved changes)** | `ZQ` | `:q!<Enter>` |
| **Save all files and quit** | — | `:wa<Enter>` then `:qa<Enter>` |
| **Emergency Force Quit Everything** | — | `:qa!<Enter>` |

> [!TIP]
> If you ever find yourself stuck, typing gibberish into a file by accident:
> 1. Hit `<Esc>` three times rapidly.
> 2. Type `:q!` and press `<Enter>`.
> This safely aborts without saving unwanted mistakes.

---

## 🔄 The Safety Net: Undo and Redo

In Neovim, undo history is **persistent** across restarts (saved in `~/.local/state/nvim/undo`). Even if you close your terminal or reboot your computer, you can re-open the file tomorrow and undo previous edits!

* `u` : **Undo** the last edit.
* `<C-r>` (Ctrl + r) : **Redo** the last undone edit.

> [!NOTE]
> Every time you enter Insert mode, type something, and press `<Esc>`, that entire insertion is treated as **one single undoable unit**.  
> If you stay in Insert Mode for 20 minutes and write 100 lines, pressing `u` will delete all 100 lines at once!  
> **Moral**: Press `<Esc>` frequently so your undo units are fine-grained.

---

## 🏃 Day 2 Practice Exercise

1. Open a test file:
   ```bash
   nvim /tmp/test_survival.txt
   ```
2. Press `i` to enter Insert Mode.
3. Type: `Hello, Neovim world! This is my first file.`
4. Press `<Esc>` to return to Normal Mode.
5. Press `<C-s>` or `<leader>w` to save. Look at the bottom statusline—it will confirm `"/tmp/test_survival.txt" written`.
6. Press `u` to undo. The text vanishes.
7. Press `<C-r>` to redo. The text reappears.
8. Type `:wq` and press `<Enter>` to exit.
