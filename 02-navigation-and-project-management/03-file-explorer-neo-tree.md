# Chapter 2.3: Mastering the File Explorer (Neo-Tree)

> *"Fuzzy finding is best for jumping to known files. The File Explorer is best for exploring project structure, creating new folders, and file management."*

In your setup, the file explorer is powered by **Neo-Tree** and integrated with **mini.icons** for beautiful filetype glyphs.

---

## 🌲 Opening and Closing the Explorer

* **`<leader>e`** : Toggle the File Tree on/off on the left side of your screen.
* Focus behavior:
  - If the tree is closed, `<leader>e` opens it and highlights your current active file.
  - If your cursor is in an editor window, `<leader>e` focuses the tree.
  - If your cursor is inside the tree, pressing `q` or `<leader>e` closes it.

---

## ⌨️ Essential File Tree Operations

When your cursor is inside the Neo-Tree window:

| Key | Operation | What It Does |
| :--- | :--- | :--- |
| **`a`** | **Add File or Directory** | Prompts for name at bottom. End with `/` (e.g. `components/`) to create a folder! To create nested files: `utils/auth/token.ts`. |
| **`d`** | **Delete** | Moves file or directory to macOS Trash (safe, not unrecoverable `rm`). |
| **`r`** | **Rename** | Prompts to rename the current file or folder. |
| **`c`** | **Copy** | Copies file to clipboard buffer. |
| **`x`** | **Cut** | Marks file to be moved. |
| **`p`** | **Paste** | Pastes copied/cut file into the highlighted directory. |
| **`H`** | **Toggle Hidden Files** | Shows or hides dotfiles like `.gitignore`, `.env`, `.github`. |
| **`R`** | **Refresh** | Refreshes the tree if external files were created. |
| **`<CR>`** | **Open** | Opens the file in the main window. |
| **`P`** | **Preview** | Toggles a floating preview of the file without switching focus! |
| **`?`** | **Help** | Displays an on-screen popup showing all Neo-Tree keybindings. |

---

## 💡 Pro-Tips for Neo-Tree

### 1. Creating Nested Directories in One Step
In VS Code, creating `src/controllers/api/v1/auth.ts` requires 4 clicks and "New Folder" steps.  
In Neo-Tree:
1. Press `a`
2. Type: `src/controllers/api/v1/auth.ts`
3. Hit `<Enter>`  
*Neo-Tree automatically creates all 4 parent folders and the file in one keystroke!*

### 2. Searching Within the Tree
Inside the tree, simply type letters (e.g. `test`):
- Neo-Tree filters the visible nodes in real-time.
- Press `<Esc>` to clear the filter.

---

## 🏃 Day 12 Drill: File Management Workout

1. Open Neovim in a temporary directory: `nvim /tmp`
2. Press `<leader>e` to open the tree.
3. Press `a` and create `my_project/src/index.ts`.
4. Press `a` again and create `my_project/src/utils.ts`.
5. Focus `utils.ts` in the tree and press `r` to rename it to `helpers.ts`.
6. Press `d` on `helpers.ts` and confirm deletion with `y`.
7. Press `H` to see hidden files. Press `H` again to hide them.
8. Press `q` to close the tree.
