# 🥋 The 30-Day Neovim Mastery Blueprint
> **From Absolute Beginner to Keyboard-Driven Coding Wizard**  
> Custom-tailored for your **LazyVim v16**, **Neovim v0.12**, **Tokyo Night**, and full multi-language IDE setup.

---

## 🎯 Welcome to Your Neovim Journey

You have installed one of the most powerful, blazing-fast, and extensible development environments ever created. But unlike traditional graphical IDEs (like VS Code or Xcode), Neovim is not just a tool—it is a **modal language for text editing**.

Once this language becomes muscle memory:
1. You will edit code at the **speed of thought**.
2. You will never need to reach for a mouse or trackpad while editing.
3. Your editor will open in **< 40ms** and use a fraction of your computer's RAM.
4. You will have full modern IDE capabilities: LSP, Diagnostics, Fuzzy Finding, Treesitter syntax highlighting, Git integration, and language tooling for **TypeScript, Python, Go, Rust, and Flutter**.

---

## 📦 Bundled Neovim Configuration (`nvim/`)

This repository contains both the complete 30-Day tutorial curriculum **and** Eddie's pre-configured, production-ready Neovim setup located in [`nvim/`](nvim/).

### Features Included:
- 🎨 **Aesthetics**: Tokyo Night (`tokyonight-night`) theme with Catppuccin, Gruvbox, and OneDark pre-installed.
- ⚡ **Multi-Language IDE**: Pre-configured LSP, Treesitter, formatting, and linting for TypeScript/JavaScript, Python, Go, Rust, and Flutter/Dart.
- 🛠️ **Modern Tooling**: Snacks.nvim picker & grep, Neo-Tree file explorer, LazyGit floating terminal, Blink.cmp autocomplete, Conform format-on-save, and Trouble diagnostic panel.
- 🍎 **macOS Integration**: System clipboard sync (`unnamedplus`), ergonomic buffer & window navigation keymaps.

### 🚀 Quick Start / Setup

To install or sync the bundled configuration to your local machine:

```bash
git clone https://github.com/unrealandychan/neovim-mastery.git
cd neovim-mastery
chmod +x install.sh
./install.sh
```

`install.sh` will:
1. Verify Neovim and Git prerequisites.
2. Automatically back up any existing `~/.config/nvim` to `~/.config/nvim.backup.<timestamp>`.
3. Provide an option to **Symlink** (recommended for ongoing git sync) or **Copy** the configuration to `~/.config/nvim`.

To test the config without modifying your existing `~/.config/nvim`:
```bash
NVIM_APPNAME=neovim-mastery/nvim nvim
```

---

## 📅 The 30-Day Mastery Roadmap

This course is engineered as a **4-Week Progressive Curriculum** (plus Capstones) designed for **15–30 minutes of daily deliberate practice**.

```
  Week 1: The Grammar of Vim Motions
  ├── Day 1–2: Mental Model & First Day Survival Guide
  ├── Day 3–4: The Grammar: Verbs + Counts + Adverbs/Objects + Nouns
  ├── Day 5–6: Movement Mastery & In-line Seeking
  └── Day 7:   Visual Block & Register Secrets (macOS Clipboard & Macros)

  Week 2: Navigation, Buffers, Windows & Git
  ├── Day 8–9:   Buffers vs Windows vs Tabs
  ├── Day 10–11: Fuzzy Finding & Grep with Snacks Picker
  ├── Day 12–13: File Tree (Neo-Tree) & Treesitter Code Hopping
  └── Day 14:    Git Flow with Gitsigns & Floating LazyGit

  Week 3: Modern IDE Power Tools
  ├── Day 15–16: LSP Architecture & Code Intelligence (gd, gr, K)
  ├── Day 17–18: Refactoring, Renaming & Code Actions (<leader>ca, <leader>cr)
  ├── Day 19–20: Autocompletion & Snippets with Blink.cmp
  └── Day 21:    Format on Save (Conform) & Diagnostic Center (Trouble)

  Week 4: Language-Specific Playbooks
  ├── Day 22–23: TypeScript, JavaScript & Tailwind CSS
  ├── Day 24:    Python Development (Pyright + Ruff + Virtualenvs)
  ├── Day 25:    Go Development (Gopls, Gofumpt, Struct Tags)
  ├── Day 26:    Rust Craftsmanship (Rustaceanvim, Crates.nvim, CodeLLDB)
  └── Day 27–28: Flutter & Dart Mobile Powerhouse (Hot Reload, Widget Outlines)

  Capstones: Customization & Lifelong Mastery
  ├── Day 29:    Customizing Plugins, Options, Keymaps & LazyExtras
  └── Day 30:    Daily Muscle Memory Drills & Graduation
```

---

## 📚 Course Directory & Chapter Index

All chapters and labs are organized in this repository:

| Folder | Chapter Title & Description | Focus Area |
| :--- | :--- | :--- |
| **[`00-getting-started/`](00-getting-started/)** | | |
| ├─ [`01-mindset-and-mental-model.md`](00-getting-started/01-mindset-and-mental-model.md) | The Modal Paradigm: Why Vim feels weird at first and how to think in states. | Foundations |
| ├─ [`02-interface-tour.md`](00-getting-started/02-interface-tour.md) | Tour of your Tokyo Night IDE: Dashboard, Statusline, Which-Key, Bufferline. | UI & Discovery |
| └─ [`03-first-day-survival-guide.md`](00-getting-started/03-first-day-survival-guide.md) | Never panic: entering, saving, undoing, quitting, and recovery mode. | Survival |
| **[`01-vim-grammar-and-motions/`](01-vim-grammar-and-motions/)** | | |
| ├─ [`01-the-four-modes.md`](01-vim-grammar-and-motions/01-the-four-modes.md) | Normal, Insert, Visual, and Command-Line modes explained in depth. | Core Modes |
| ├─ [`02-the-grammar-of-vim.md`](01-vim-grammar-and-motions/02-the-grammar-of-vim.md) | Treat editing like spoken language: `ciw`, `dap`, `y3w`, `c2f"`. | Vim Grammar |
| ├─ [`03-movement-mastery.md`](01-vim-grammar-and-motions/03-movement-mastery.md) | Navigating without arrow keys: `w`/`b`, `f`/`t`/`;`, `H`/`M`/`L`, `{`/`}`. | Speed Navigation |
| ├─ [`04-visual-and-block-editing.md`](01-vim-grammar-and-motions/04-visual-and-block-editing.md) | Character visual, line visual, and visual block multi-cursor editing. | Block Edits |
| └─ [`05-registers-and-clipboard.md`](01-vim-grammar-and-motions/05-registers-and-clipboard.md) | macOS clipboard sync, registers, the black-hole register, and macros `q`. | Memory & Macros |
| **[`02-navigation-and-project-management/`](02-navigation-and-project-management/)** | | |
| ├─ [`01-buffers-windows-tabs.md`](02-navigation-and-project-management/01-buffers-windows-tabs.md) | Taming multiple files: Bufferline tabs, splits (`<leader>\|`, `<leader>-`), navigation. | Window Layouts |
| ├─ [`02-fuzzy-finding-with-snacks.md`](02-navigation-and-project-management/02-fuzzy-finding-with-snacks.md) | Blazing fast search: `<leader><space>` files, `<leader>/` project grep, `<leader>fb`. | Search |
| ├─ [`03-file-explorer-neo-tree.md`](02-navigation-and-project-management/03-file-explorer-neo-tree.md) | Neo-Tree: Adding, deleting, moving, renaming files and folders inside Neovim. | File Explorer |
| ├─ [`04-treesitter-code-navigation.md`](02-navigation-and-project-management/04-treesitter-code-navigation.md) | Jumping between functions `]m`/`[m`, classes `]]`/`[[`, parameters `]a`/`[a`. | AST Navigation |
| └─ [`05-git-workflow-and-lazygit.md`](02-navigation-and-project-management/05-git-workflow-and-lazygit.md) | Hunk staging with Gitsigns, blame, and floating LazyGit `<leader>gg`. | Version Control |
| **[`03-modern-ide-power-tools/`](03-modern-ide-power-tools/)** | | |
| ├─ [`01-lsp-core-concepts.md`](03-modern-ide-power-tools/01-lsp-core-concepts.md) | Language Server Protocol architecture and Mason package manager (`<leader>cm`). | Architecture |
| ├─ [`02-code-navigation-and-inspection.md`](03-modern-ide-power-tools/02-code-navigation-and-inspection.md) | Jump to definition `gd`, references `gr`, implementation `gI`, hover doc `K`. | Code Intel |
| ├─ [`03-refactoring-and-code-actions.md`](03-modern-ide-power-tools/03-refactoring-and-code-actions.md) | Code actions `<leader>ca`, renaming symbol `<leader>cr`, file rename `<leader>cR`. | Refactoring |
| ├─ [`04-completion-and-snippets.md`](03-modern-ide-power-tools/04-completion-and-snippets.md) | Blink.cmp autocompletion, navigating suggestions, snippet expansion. | Autocomplete |
| ├─ [`05-formatting-and-linting.md`](03-modern-ide-power-tools/05-formatting-and-linting.md) | Automatic format on save with Conform.nvim, manual `<leader>cf`, ESLint & Ruff. | Formatting |
| └─ [`06-diagnostics-and-trouble.md`](03-modern-ide-power-tools/06-diagnostics-and-trouble.md) | Error jumps `]d`/`[d`, line diagnostic floats, Trouble panel `<leader>xx`. | Diagnostics |
| **[`04-language-specific-playbooks/`](04-language-specific-playbooks/)** | | |
| ├─ [`01-typescript-javascript-web.md`](04-language-specific-playbooks/01-typescript-javascript-web.md) | Vtsls, Prettier, ESLint, Tailwind CSS intellisense, JSON schema store. | Web & TS |
| ├─ [`02-python-environment-workflow.md`](04-language-specific-playbooks/02-python-environment-workflow.md) | Pyright + Ruff, `<leader>cv` Virtualenv selector (uv, poetry, conda), formatting. | Python |
| ├─ [`03-go-development-powerhouse.md`](04-language-specific-playbooks/03-go-development-powerhouse.md) | Gopls, Gofumpt, auto-imports on save, struct tag editing, tests. | Go |
| ├─ [`04-rust-craftsmanship.md`](04-language-specific-playbooks/04-rust-craftsmanship.md) | Rustaceanvim, Crates.nvim inline dependency versions, Cargo commands. | Rust |
| └─ [`05-flutter-and-dart-mobile.md`](04-language-specific-playbooks/05-flutter-and-dart-mobile.md) | Flutter-tools, hot reload `<leader>fl`, restart `<leader>fR`, outline `<leader>fo`. | Flutter & Dart |
| **[`05-advanced-and-customization/`](05-advanced-and-customization/)** | | |
| ├─ [`01-customizing-your-lazyvim.md`](05-advanced-and-customization/01-customizing-your-lazyvim.md) | How LazyVim options, keymaps, and plugins connect without breaking updates. | Customization |
| ├─ [`02-lazy-extras-and-ai-assistants.md`](05-advanced-and-customization/02-lazy-extras-and-ai-assistants.md) | Using `:LazyExtras` to toggle Copilot, Avante, Codeium, or extra languages. | AI & Extras |
| ├─ [`03-debugging-with-dap.md`](05-advanced-and-customization/03-debugging-with-dap.md) | Setting breakpoints `<leader>db`, step over `<leader>do`, variable inspection. | Debugging |
| └─ [`04-30-day-practice-drills.md`](05-advanced-and-customization/04-30-day-practice-drills.md) | Daily 15-minute speed drills, flashcards, and speed challenges. | Muscle Memory |
| **[`practice/`](practice/)** | Hands-on code files to edit directly inside Neovim with built-in exercises. | Practice Lab |

---

## 🏃 How to Use This Course

1. **Keep Neovim open next to the chapters**: You can read these markdown files directly inside Neovim (`nvim README.md`)!
2. **Follow the 1-month plan**: Don't try to memorize all 200 keybindings on Day 1. Master Week 1 first; the rest builds naturally upon it.
3. **Use the `practice/` directory**: Every concept has an accompanying test lab where you can practice until it becomes second nature.
4. **Whenever in doubt, press `<Space>`**: Which-Key will pop up and remind you of every available shortcut on your machine.
