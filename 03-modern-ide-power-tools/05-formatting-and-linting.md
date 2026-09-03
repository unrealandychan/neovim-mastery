# Chapter 3.5: Formatting & Linting (Clean Code by Default)

> *"You should never spend a second manually aligning indents, formatting brackets, or sorting imports. Neovim does it automatically every time you save."*

Your setup uses **Conform.nvim** for high-speed code formatting and **nvim-lint** for asynchronous linting.

---

## 🧼 1. Format on Save

In your setup, **Format on Save is enabled by default**:
* Whenever you save a file (`<C-s>`, `<leader>w`, or `:w`), Conform runs the appropriate formatters in milliseconds.
* If there is a syntax error preventing formatting, it gracefully fails without corrupting your buffer.

### Configured Formatters:

| Language | Primary Formatter | Fallback / Additional |
| :--- | :--- | :--- |
| **TypeScript / JS / Web** | `prettier` | `eslint-lsp` (fix on save) |
| **Python** | `ruff format` | `ruff check --fix` (organizes imports) |
| **Go** | `gofumpt` | `goimports` (auto adds/removes imports) |
| **Rust** | `rustfmt` | via `rust-analyzer` |
| **Flutter / Dart** | `dart_format` | via `dartls` |
| **Lua** | `stylua` | Native stylua |
| **Shell / Bash** | `shfmt` | Homebrew shfmt |
| **JSON / YAML / Markdown** | `prettier` | SchemaStore |

---

## ⌨️ 2. Formatting Controls

| Keybinding | Action |
| :--- | :--- |
| **`<leader>cf`** | **Format Document** (trigger manual format immediately) |
| **`<leader>uf`** | **Toggle Format-on-Save** for the **current buffer** (great when editing legacy files where you don't want a huge git diff!) |
| **`<leader>uF`** | **Toggle Format-on-Save globally** for the entire Neovim session |

---

## 🚨 3. Linting (Catches Bugs Before Runtime)

Linters run in the background as you write code:
- **ESLint**: Catches unhandled promises, React hook rule violations, and unused variables.
- **Ruff**: 100x faster than Flake8/Pylint, catches syntax bugs, security flaws, and type mismatches.
- **Hadolint**: Validates Dockerfiles against best practices.
- **Golangci-lint**: Production-grade Go analysis.

Linter warnings appear directly in your editor as colored squiggles and gutter icons.

---

## 🏃 Day 21 Drill: Formatting Magic

1. Open `/tmp/ugly_code.ts`.
2. Deliberately write messy, un-indented TypeScript:
   ```typescript
   function messy ( a:number,b:number) {
   const result=a+b;
   return result
   }
   ```
3. Press `<leader>w` to save.
4. Watch it instantly transform into clean, beautifully indented, semicolon-aligned code:
   ```typescript
   function messy(a: number, b: number) {
     const result = a + b;
     return result;
   }
   ```
5. Press `<leader>uf` to disable format-on-save for that buffer, make another edit, and save—notice it stays unformatted until you hit `<leader>cf`!
