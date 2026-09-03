# Chapter 3.2: Code Navigation & Symbol Inspection

> *"Never wonder where a function was defined or what types it expects. Jump directly there with zero latency."*

In this chapter, you will master the core keystrokes used dozens of times an hour to inspect types, read docstrings, and traverse complex codebases.

---

## 🧭 The Core LSP Navigation Keys

Place your cursor on any variable, type, class, or function name in Normal Mode:

| Shortcut | Action | What It Does |
| :--- | :--- | :--- |
| **`gd`** | **Go to Definition** | Jumps directly to where the symbol is defined (even if in another file or `node_modules`!). |
| **`gr`** | **Find References** | Opens a floating fuzzy list of every single place this symbol is used across your entire project. |
| **`gI`** | **Go to Implementation** | In interfaces/protocols, jumps to the concrete struct or class implementing it. |
| **`gy`** | **Go to Type Definition** | Jumps to the TypeScript type or Rust/Go struct definition of the object. |
| **`gD`** | **Go to Declaration** | Jumps to the header or declaration. |

---

## 📖 Symbol Inspection: Hover Docs & Signatures

### 1. Hover Documentation (`K`)
Place your cursor on any symbol and press **`K`** (Capital K):
- A clean, markdown-rendered floating window pops up.
- Shows the full TypeScript/Go/Rust type signature and JSDoc/docstring comments.
- **Tip**: Press `K` a **second time** to move your cursor *inside* the documentation window so you can scroll through long docs with `j` and `k`! Press `<Esc>` to dismiss it.

### 2. Signature Help (`<C-k>`)
While in **Insert Mode** typing the arguments of a function:
- Press **`<C-k>`**
- A tooltip appears showing which argument you are currently filling in and what types are expected.

---

## ⏳ The Time Machine: Jump List (`<C-o>` and `<C-i>`)

When you press `gd` to jump to a definition 5 files away, how do you get back to where you came from?

Neovim maintains a **Jump List**:
* **`<C-o>`** : Jump **backward** in time (to where you were before `gd`!).
* **`<C-i>`** : Jump **forward** in time.

> [!TIP]
> Think of `<C-o>` as the "Back" button in your web browser. You can press `gd` to inspect a library function 6 layers deep, and then press `<C-o>` six times to return right back to your exact code line!

---

## 🏃 Day 16 Drill: Code Exploration Sprint

1. Open any project with TypeScript, Go, or Python.
2. Put cursor on a function call and press `K` to view documentation.
3. Press `gd` to jump to the definition.
4. Press `gr` to view all references across the repo. Navigate with `<C-j>`/`<C-k>` and hit `<Enter>` to jump to one.
5. Press `<C-o>` to return back to your starting position!
