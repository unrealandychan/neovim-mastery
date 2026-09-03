# Chapter 3.6: Diagnostics & The Trouble Command Center

> *"Errors and warnings are inevitable. Finding and eliminating them quickly is what separates amateurs from professionals."*

Neovim handles diagnostics with two complementary tools:
1. **In-Buffer Diagnostic Jumps** (`]d`, `[d`, `<leader>cd`)
2. **Trouble.nvim** (`<leader>xx`): A project-wide interactive diagnostic workspace.

---

## 🚦 1. Diagnostic Indicators in Your Gutter

Whenever your code has an issue, Neovim displays symbols in the left gutter and subtle colored squiggles beneath the code:
-  **Error** (Red) — Code will not compile or run.
-  **Warning** (Yellow) — Potential bug, unused import, or deprecated API.
-  **Info** (Blue) — Informational tip.
-  **Hint** (Cyan) — Style suggestion or available refactor.

---

## 🏃 2. Fast In-Buffer Navigation

Instead of visually scanning for red squiggles:

| Shortcut | Action |
| :--- | :--- |
| **`]d`** | Jump directly to the **next diagnostic** (error or warning) |
| **`[d`** | Jump directly to the **previous diagnostic** |
| **`]e`** | Jump specifically to the **next ERROR** (ignoring warnings) |
| **`[e`** | Jump specifically to the **previous ERROR** |
| **`<leader>cd`** | Open **Line Diagnostic Float** (view full error stack trace in a floating box) |

---

## 🎛️ 3. Trouble.nvim: Project-Wide Command Center

When you are compiling a large project or performing a major refactor, you often have 20 errors scattered across 8 different files.

Press **`<leader>xx`**:
- An interactive panel opens at the bottom of your screen.
- Lists all errors grouped hierarchically by filename and line number.

```
┌─ Trouble (Workspace Diagnostics) ──────────────────────────────────────┐
│ ▼ src/auth/login.ts (2 errors)                                         │
│   Ln 14, Col 5    Property 'token' does not exist on type 'User'     │
│   Ln 28, Col 12   'navigate' is declared but its value is never read │
│ ▼ src/api/client.ts (1 error)                                          │
│   Ln 52, Col 3    Cannot find name 'axios'                           │
└────────────────────────────────────────────────────────────────────────┘
```

### Trouble Controls:
- **`j` / `k`** : Move up and down through errors.
- **`<CR>`** : Jump directly to that file and line in your main editor window!
- **`P`** : Toggle live code preview without leaving the Trouble list.
- **`q`** : Close the Trouble panel.

### Trouble Variants:
- **`<leader>xX`** : Show diagnostics for the **current buffer only**.
- **`<leader>cs`** : Open a **Symbols Outline** showing all functions and classes in the current file.
- **`<leader>xt`** : Open all **TODO / FIXME comments** across your entire project (`todo-comments.nvim`)!

---

## 🏃 Day 21 Drill: Squashing Bugs with Trouble

1. Open a test file and introduce two syntax errors on lines 5 and 15.
2. Tap `]d` and `[d` to leap between them.
3. Place cursor on an error and press `<leader>cd` to inspect the full compiler message.
4. Press `<leader>xx` to open the Trouble panel.
5. Hit `<CR>` on a diagnostic to navigate straight to it.
6. Fix the error, save with `<leader>w`, and watch the diagnostic disappear from Trouble in real time!
