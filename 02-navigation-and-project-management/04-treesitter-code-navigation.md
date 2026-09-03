# Chapter 2.4: Treesitter Code Navigation (Thinking in Syntax Trees)

> *"Traditional editors see code as lines of text. Neovim with Treesitter sees code as an **Abstract Syntax Tree (AST)**."*

Treesitter parses your source code in real time using the official language grammars we compiled (TypeScript, Python, Go, Rust, Dart, etc.). It powers three massive capabilities:
1. **Flawless Syntax Highlighting** (distinguishes local variables, parameters, types, keywords, and function calls).
2. **AST-Aware Text Objects** (select, delete, or change entire functions or parameters).
3. **AST Jumping** (hop between functions, classes, and loops).

---

## 🌳 1. AST Code Text Objects

Remember `ci"` (change inside quotes) and `ciw` (change inside word)?  
Treesitter adds **code-level nouns**:

| Text Object | Target | Example |
| :--- | :--- | :--- |
| `af` | **A Function** (includes signature + body) | `daf` deletes the entire function |
| `if` | **Inner Function** (only the body of the function) | `cif` wipes the function body, ready for rewrite |
| `ac` | **A Class** (entire class definition) | `yac` copies the whole class |
| `ic` | **Inner Class** (class body only) | `cic` wipes the methods inside the class |
| `aa` | **An Argument / Parameter** | `daa` deletes the parameter AND the comma! |
| `ia` | **Inner Argument / Parameter** | `cia` changes just the parameter name |
| `ai` / `ii` | **An Indent / Condition** | `dii` deletes the current `if/else` block body |

### The Parameter Magic (`daa`):
Suppose you have:
```typescript
function fetchUser(userId: string, token: string, retryCount: number)
```
Place your cursor anywhere on `token: string` and press **`daa`**:
- Neovim deletes `token: string, ` and automatically fixes the commas and spacing!
- No manual backspacing or fixing trailing commas!

---

## 🐇 2. Jumping Between Code Structures

Forget scrolling through hundreds of lines looking for the next method:

| Key | Motion |
| :--- | :--- |
| **`]m`** | Jump to the **start of the next function/method** |
| **`[m`** | Jump to the **start of the previous function/method** |
| **`]M`** | Jump to the **end of the next function/method** |
| **`[M`** | Jump to the **end of the previous function/method** |
| **`]]`** | Jump to the **start of the next class** |
| **`[[`** | Jump to the **start of the previous class** |
| **`]c`** | Jump to the **next git hunk** or diagnostic |

---

## 📈 3. Incremental Selection (`<C-space>`)

Have you ever wanted to highlight an expression, then the statement containing it, then the whole function, then the whole file?

In Normal Mode:
1. Press **`<C-space>`** (Ctrl + Space): highlights the current symbol.
2. Press **`<C-space>`** again: expands highlight to the enclosing expression.
3. Press **`<C-space>`** again: expands highlight to the enclosing function block.
4. Press **`<BS>`** (Backspace): shrinks the selection back one level!

This allows you to select exactly the syntax boundary you want without counting lines or matching brackets.

---

## 🏃 Day 13 Drill: AST Surfing

Open any TypeScript or Python file:
1. Jump through functions using `]m` and `[m`.
2. Place cursor inside a function and press `cif` (change inner function). Notice how the entire body vanishes while the function signature is preserved! Press `u` to undo.
3. Move cursor to a function parameter and press `daa`. Watch it cleanly remove the parameter. Press `u` to undo.
4. Place cursor inside an expression and tap `<C-space>` 4 times to watch the selection expand up the syntax tree.
