# Chapter 2.5: Git Workflow & Floating LazyGit

> *"You never need to leave Neovim to stage hunks, resolve conflicts, inspect git blame, or push commits."*

Your setup provides two levels of Git integration:
1. **Micro-level**: **Gitsigns.nvim** right inside your buffer (hunk-by-hunk diffs, staging, and blame).
2. **Macro-level**: **LazyGit** in a full floating terminal window (`<leader>gg`).

---

## 🎨 1. In-Buffer Git Indicators (Gitsigns)

Look at the left gutter (sign column) next to your line numbers:
- **Green bar (`+`)**: Newly added lines.
- **Blue bar (`~`)**: Modified lines.
- **Red triangle (`_`)**: Deleted lines.

### Navigating Hunks:
- **`]h`** (or `]c`): Jump to the **next git change (hunk)** in the file.
- **`[h`** (or `[c`): Jump to the **previous git change**.

### Acting on Hunks:
Place your cursor on any modified line:

| Keybinding | Action |
| :--- | :--- |
| **`<leader>ghp`** | **Preview Hunk** (pops up a floating diff of what changed) |
| **`<leader>ghs`** | **Stage Hunk** (stages only this specific change for git commit!) |
| **`<leader>ghr`** | **Reset Hunk** (discards changes in this hunk back to HEAD!) |
| **`<leader>ghb`** | **Blame Line** (shows author, commit hash, date, and commit message) |
| **`<leader>ghd`** | **Diff This** (opens side-by-side vertical git diff split) |

---

## 🚀 2. Macro Git Power: Floating LazyGit (`<leader>gg`)

When you want to review all changed files, write a commit message, switch branches, or push to GitHub:
* Press **`<leader>gg`**

A gorgeous, interactive terminal UI pops up centered on your screen without leaving Neovim.

```
┌─ LazyGit (Floating UI) ────────────────────────────────────────────────┐
│ [1] Files    │ [2] Branches   │ [3] Commits   │ [4] Stash              │
│  M app.ts    │ * main         │  a1b2c3 Fix.. │                        │
│  ? test.go   │   feature-auth │  d4e5f6 Add.. │                        │
├──────────────┴────────────────┴───────────────┴────────────────────────┤
│ Diff Preview:                                                          │
│ + import { format } from "date-fns";                                   │
│ - import { format } from "moment";                                     │
└────────────────────────────────────────────────────────────────────────┘
```

### Essential LazyGit Controls:
- **`1` / `2` / `3` / `4`** : Switch between Files, Branches, Commits, Stash panels.
- **`<Space>`** : Stage / unstage the highlighted file or line.
- **`a`** : Stage all files.
- **`c`** : Commit (opens a prompt to type your commit message).
- **`P`** (Shift+P) : Push commits to remote origin (`git push`).
- **`p`** : Pull latest changes (`git pull`).
- **`b`** : View branches or checkout branch.
- **`q`** : Close LazyGit and instantly return to your exact cursor position in Neovim!

---

## 🏃 Day 14 Drill: Complete Git Cycle

1. In any git repository, open a file in Neovim.
2. Edit a line, and add a new function. Notice the gutter indicators change.
3. Hover over the change and press `<leader>ghp` to preview the diff.
4. Press `<leader>gg` to launch LazyGit.
5. Press `<Space>` on the file to stage it.
6. Press `c`, type `test: practice git workflow`, and press `<Enter>`.
7. Press `q` to return to your editor.
8. Look at the gutter—the indicators are clean!
