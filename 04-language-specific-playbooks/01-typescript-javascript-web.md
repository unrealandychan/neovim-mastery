# Chapter 4.1: TypeScript, JavaScript & Modern Web Playbook

> *"From React and Next.js to Node.js and Tailwind CSS, your setup provides an uncompromising, instant-feedback web development environment."*

---

## ⚙️ The Web Stack Configured

* **LSP**: `vtsls` (high-performance TypeScript server built on VS Code's TypeScript engine).
* **Formatting**: `prettier` (runs on save for `.ts`, `.tsx`, `.js`, `.jsx`, `.html`, `.css`, `.json`, `.md`).
* **Linting**: `eslint-lsp` (flags syntax errors and runs `eslint --fix`).
* **Tailwind CSS**: `tailwindcss-language-server` (class completion and hex color swatches).
* **Tag Matching**: `nvim-ts-autotag` (automatically closes and renames matching HTML/JSX tags).

---

## 🎨 1. Tailwind CSS Intellisense

When editing React/Next.js/HTML with Tailwind classes (`className="..."`):
- Type `bg-` or `flex-`: Blink.cmp immediately pops up Tailwind utility classes.
- Color classes (e.g. `bg-blue-500`) show their RGB/Hex preview.
- Class sorting is integrated with Prettier's Tailwind plugin.

---

## 🏷️ 2. Auto-Closing & Auto-Renaming JSX Tags (`nvim-ts-autotag`)

When writing JSX/TSX:
1. Type `<div>` → Neovim automatically inserts `</div>` and places your cursor between them.
2. If you change `<div>` to `<section>` using `ciw` on the opening tag, **Treesitter automatically renames the matching closing tag `</div>` to `</section>`!**

---

## 📦 3. TypeScript Source Actions & Organize Imports

In any TypeScript file:

| Keybinding | Action |
| :--- | :--- |
| **`<leader>co`** | **Organize Imports** (removes unused imports and sorts remaining ones alphabetically) |
| **`<leader>cR`** | **File Rename** (renames file on disk and updates all import paths across the codebase) |
| **`<leader>cu`** | **Remove Unused Imports** |
| **`<leader>ca`** | **Code Actions** (generate missing interface properties, extract component, etc.) |

---

## 📋 4. SchemaStore Integration (JSON & YAML)

When you open `package.json`, `tsconfig.json`, or `.eslintrc.json`:
- `jsonls` downloads the official JSON Schema from **SchemaStore.org**.
- You get full autocompletion and hover descriptions for every single valid key (e.g., all `scripts`, `dependencies`, and `compilerOptions`)!

---

## 🏃 Day 22 Drill: React Component Workflow

1. Open a new file: `nvim /tmp/Button.tsx`.
2. Type `interface ButtonProps { title: string; onClick: () => void; }`.
3. Type:
   ```tsx
   export function Button({ title, onClick }: ButtonProps) {
     return (
       <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={onClick}>
         <span>{title}</span>
       </button>
     );
   }
   ```
4. Place cursor on `<button>` and use `ciw` to change it to `<a`. Notice the closing `</button>` automatically changes to `</a>`!
5. Save with `<leader>w` and observe Prettier format it with pixel-perfect alignment.
