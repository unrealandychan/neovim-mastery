# Chapter 3.4: Intelligent Autocompletion & Snippets with Blink.cmp

> *"In LazyVim v16, completion is powered by **Blink.cmp**, a blazing-fast completion engine engineered in Rust and Lua with sub-millisecond response times."*

---

## ⚡ 1. The Completion Popup

As you type in Insert Mode, Blink.cmp automatically displays intelligent completion candidates derived from:
- **LSP**: Methods, properties, interfaces, and variables.
- **Snippets**: Pre-built boilerplate blocks (`fn`, `for`, `try/catch`, `rfc`).
- **Path**: File system paths when typing inside quotes (`./components/...`).
- **Buffer**: Words appearing elsewhere in your open buffers.

```
┌──────────────────────────────────────────────┐ ┌── Documentation ──────┐
│ user.                                        │ │ (property) User.name: │
│ ├─ name             [LSP] Property           │ │ string                │
│ ├─ email            [LSP] Property           │ │                       │
│ ├─ getPermissions   [LSP] Method             │ │ Returns permissions  │
│ └─ toJSON           [LSP] Method             │ │ for active session.   │
└──────────────────────────────────────────────┘ └───────────────────────┘
```

---

## ⌨️ 2. Completion Navigation Controls

While the completion menu is visible:

| Keybinding | Action |
| :--- | :--- |
| **`<C-n>`** or `<Down>` | Move to **next** suggestion |
| **`<C-p>`** or `<Up>` | Move to **previous** suggestion |
| **`<CR>`** (`Enter`) or **`<Tab>`** | **Accept / Confirm** the highlighted suggestion |
| **`<C-e>`** | **Cancel / Close** the completion menu without selecting |
| **`<C-b>`** / **`<C-f>`** | Scroll documentation window up / down |

---

## ✂️ 3. Snippets: Boilerplate on Demand

Snippets let you expand common code structures instantly and jump through tab-stop placeholders.

### Example in TypeScript/React:
1. In Insert Mode, type `rfc` (React Functional Component) or `clg` (`console.log`).
2. Notice the `[Snippet]` indicator in the completion menu.
3. Press `<Tab>` or `<CR>` to expand it:
   ```typescript
   console.log(|);
   ```
4. For multi-variable snippets (like a `for` loop):
   - Type `for`, press `<Tab>` to expand.
   - Type the variable name (e.g. `idx`).
   - Press **`<Tab>`** to jump straight to the array limit placeholder!
   - Press **`<S-Tab>`** to jump backward to the previous placeholder!

---

## 🏃 Day 19 Drill: Completion & Snippet Sprint

1. Create a temporary file: `nvim /tmp/complete_test.ts`
2. Enter Insert Mode and type `interface Person { id: number; name: string; }`
3. Below it, type `const p: Person = { ` and watch completion immediately offer `id` and `name`.
4. Navigate with `<C-n>` and accept with `<Tab>`.
5. Type `p.` and see documentation and properties pop up instantly!
