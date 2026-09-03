# Chapter 3.3: Refactoring & Code Actions

> *"Refactoring isn't just about editing text; it's about changing the structure of your code safely with language intelligence."*

In this chapter, you will learn how to rename identifiers across hundreds of files, auto-import missing packages, and apply language server quick-fixes in seconds.

---

## ⚡ 1. Code Actions (`<leader>ca`)

Code Actions are the equivalent of the "Yellow Lightbulb" in VS Code. Whenever an LSP server detects an opportunity to fix or transform code, it provides actions:
- Quick-fix syntax or type errors
- Auto-import missing modules or classes
- Extract variable / Extract function
- Add missing interface methods or switch cases
- Wrap Flutter widgets in `Container`, `Padding`, or `Column`

### How to Trigger:
1. Place cursor on the warning, error, or identifier.
2. Press **`<leader>ca`** (Code → Action).
3. A floating menu appears showing all available actions (e.g. `1: Import 'useState' from 'react'`).
4. Type the number or use `<C-j>`/`<C-k>` and press `<Enter>` to apply.

---

## ✏️ 2. Project-Wide Symbol Rename (`<leader>cr`)

Never use regex search-and-replace to rename a variable—you risk accidentally renaming substrings in comments or unrelated variables with similar names.

Use LSP rename instead:
1. Place cursor on the function, class, or variable name.
2. Press **`<leader>cr`** (Code → Rename).
3. A floating input box appears with the current name.
4. Type the new name and press `<Enter>`.
5. Neovim automatically updates the definition AND every single reference across all files in your project in memory!
6. Press `<leader>w` or `:wa` to save all modified buffers.

---

## 🚚 3. File Rename with Auto-Import Updates (`<leader>cR`)

What happens when you rename `src/services/userService.ts` to `src/services/authService.ts`?  
Every file that imported `userService` will break unless imports are updated.

- In your setup: Press **`<leader>cR`** (Capital R).
- Neovim prompts for the new filename, renames the file on disk, and automatically updates all `import` statements across your entire codebase!

---

## 🏃 Day 17 Drill: Refactoring Workout

1. Open a TypeScript or Python file with an exported function.
2. Place cursor on the function name and press `<leader>cr`.
3. Type a new name and press `<Enter>`. Watch all occurrences in the file update simultaneously.
4. Intentionally misspell an import or leave an unused variable.
5. Place cursor on the diagnostic underline, press `<leader>ca`, and select the automatic fix!
