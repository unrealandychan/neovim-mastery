# Chapter 6.4: Grug-far.nvim — Project-Wide Search & Replace

> *"Replacing a variable across 40 files in classic Vim meant writing cryptic `:cfdo %s/.../g` commands. In modern Neovim, **Grug-Far** gives you an interactive buffer with live diffs and one-key sync."*

---

## 🔍 1. Why Grug-Far is a Game Changer

In traditional IDEs like VS Code, global search-and-replace opens a small side-panel input with tiny preview boxes.

In Neovim, **`MagicDuck/grug-far.nvim`** turns find-and-replace into an **ordinary Neovim buffer**:
- Powered by the blazing speed of **`ripgrep`** (`rg`).
- Shows side-by-side or inline diffs of all replacements in real time as you type.
- Full Vim editing power: you can use `ciw`, visual block mode, or macros directly on the search results!
- Pressing **`<localleader>s`** (or clicking Sync) instantly commits all changes to disk.

---

## ⌨️ 2. Keybindings & Launching Grug-Far

| Shortcut | Context | What It Does |
| :--- | :--- | :--- |
| **`<leader>sr`** | Normal Mode | Opens Grug-Far in a clean vertical split. |
| **`<leader>sr`** | Visual Mode | Opens Grug-Far pre-filled with the highlighted text as search query. |
| **`<leader>sR`** | Normal Mode | Opens Grug-Far pre-filled with the word under cursor across all open buffers. |

---

## 🖥️ 3. Inside the Grug-Far Buffer Interface

When you press `<leader>sr`, a dedicated buffer opens:

```
┌────────────────────────────────────────────────────────┐
│ [Grug Far - Search and Replace]                        │
│                                                        │
│ Search:       getOldUserData                           │
│ Replace:      fetchActiveUserProfile                   │
│ Files filter: src/**/*.ts                              │
│ Flags:        --word-regexp                            │
│                                                        │
│ [Sync (Save to files)] [History] [Toggle Flags]        │
├────────────────────────────────────────────────────────┤
│ RESULTS (4 matches in 2 files):                        │
│                                                        │
│ src/services/user.ts:                                  │
│ 14: -  export function getOldUserData(id: string) {   │
│ 14: +  export function fetchActiveUserProfile(id: string) {
│                                                        │
│ src/controllers/auth.ts:                               │
│ 42: -  const profile = await getOldUserData(req.userId)│
│ 42: +  const profile = await fetchActiveUserProfile(req.userId)
└────────────────────────────────────────────────────────┘
```

### The Top Header Inputs:
1. **`Search`**: Type what you want to find. (Matches update live below).
2. **`Replace`**: Type your replacement string. (The `+` green diff lines update in real time!).
3. **`Files filter`**: Restrict search to specific directories or extensions (e.g. `*.go`, `src/components/**`, `!**/*test*`).
4. **`Flags`**: Add ripgrep flags like `-i` (case-insensitive), `-w` (exact word), or `--fixed-strings`.

---

## ⚡ 4. How to Perform a Global Replace

Here is the exact step-by-step workflow:

1. Press **`<leader>sr`** to open the panel.
2. In the `Search:` line, press `i` (Insert Mode) and type the query (e.g. `UserDTO`). Press `<Esc>`.
3. Move down to `Replace:` line using `j`, enter Insert Mode (`i`), and type the new name (e.g. `UserModel`). Press `<Esc>`.
4. Inspect the live diff in the bottom half of the buffer. Every line showing `-` (old) and `+` (new) shows exactly what will change.
5. To execute and write changes to disk across all matching files:
   - In Normal Mode inside the Grug-Far buffer, press:
     ```vim
     <localleader>s
     ```
     *(In LazyVim, `<localleader>` is mapped to `\` or `<Space>` depending on mode; you can also press `<Enter>` while hovering on `[Sync]`)*.
6. A notification confirms: `[Grug Far] Successfully replaced 18 occurrences across 5 files.`
7. Press **`q`** to close the Grug-Far window and return to your code.

---

## 🎛️ 5. Advanced Powers: Filtering & Regex

### Restricting Search by File Type
Want to replace a function name only inside your TypeScript files, ignoring documentation or JSON files?
In the `Files filter:` input, type:
```
*.ts,*.tsx
```
Or exclude directories:
```
!**/node_modules/**, !**/dist/**
```

### Using Regular Expressions
Grug-Far fully supports Rust/ripgrep regular expressions.
- **Search**: `([a-z]+)Service\.get\((.*)\)`
- **Replace**: `fetchService($1, $2)`

As soon as you type the capture groups, the live preview renders the transformed strings!

---

## 💡 Key Takeaways

1. **`<leader>sr`** opens the interactive Search & Replace panel.
2. Changes are **previewed in real-time** as colorful diffs before anything is written to disk.
3. You can filter by file types (`*.go`, `*.dart`, `src/**`) and toggle regex flags.
4. Apply changes across the entire project with one keystroke (`<localleader>s` or Sync button).
5. Never worry about corrupting files with blind command-line substitutions again.
