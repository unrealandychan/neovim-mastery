# Chapter 5.4: The 30-Day Deliberate Practice Drills & Graduation

> *"Knowledge isn't power in Neovim—**muscle memory** is. Fifteen minutes of focused, daily deliberate practice will make you faster than 95% of software engineers in 30 days."*

---

## 📅 The Daily 15-Minute Workout Schedule

### Week 1: The Grammar of Motions (Target: Stop using arrow keys)
* **Day 1**: Practice opening files, entering Insert Mode with `i`, `a`, `o`, `O`, saving with `<leader>w`, and quitting with `:q`.
* **Day 2**: Unbind arrow keys in your mind. Practice moving exclusively with `h`, `j`, `k`, `l` and scrolling with `<C-d>` and `<C-u>`.
* **Day 3**: Practice word motions: `w`, `b`, `e`, `ge`. Learn the difference between small `w` and big `W`.
* **Day 4**: Practice line navigation: `^` (first non-blank), `$` (end of line), `0` (start of line).
* **Day 5**: Practice in-line seeking: `f{char}`, `t{char}`, `;` (repeat), `,` (reverse repeat).
* **Day 6**: Master text objects: `ciw`, `diw`, `ci"`, `da"`, `ci(`, `da(`, `ci{`, `dap`.
* **Day 7**: Visual block mode `<C-v>`: Comment 5 lines at once with `I// <Esc>`, and append commas with `$A,<Esc>`.

---

### Week 2: Navigation, Plugins & Project Structure (Target: Teleportation & Zero Mouse)
* **Day 8**: Open 3 files. Practice switching between them with `<Shift>l` and `<Shift>h`, and closing safely with `<leader>bd` (Snacks bufdelete).
* **Day 9**: Split windows vertically (`<leader>|`) and horizontally (`<leader>-`). Move between them using `<C-h>`, `<C-j>`, `<C-k>`, `<C-l>`.
* **Day 10**: Fuzzy finding: search files with `<leader><space>`, recent files with `<leader>fr`, and open in splits using `<C-v>`.
* **Day 11**: Project-wide search: use `<leader>/` to grep text, and hopping word references with `]]` and `[[`.
* **Day 12**: Flash.nvim Teleportation: Practice jumping anywhere on screen with `s`, Treesitter selection with `S`, and remote yanks with `yr`.
* **Day 13**: Neo-Tree file manager (`<leader>e`): Practice adding files (`a`), deleting (`d`), and renaming (`r`).
* **Day 14**: Git & Terminals: Jump through changes with `]h`, preview diffs with `<leader>ghp`, toggle floating terminal with `<C-/>`, and launch LazyGit with `<leader>gg`.

---

### Week 3: Modern IDE Power Tools & Micro-Plugins (Target: Effortless Intelligence)
* **Day 15**: Explore Mason (`<leader>cm`). Verify all installed language servers, formatters, and linters.
* **Day 16**: LSP navigation: Jump to definitions with `gd`, view docs with `K`, and inspect references with `gr`. Return using `<C-o>`.
* **Day 17**: Refactoring & Global Search-and-Replace: Rename symbol with `<leader>cr`, and perform project-wide find/replace with Grug-Far (`<leader>sr`).
* **Day 18**: Code actions & Scratchpad: Trigger quick fixes with `<leader>ca`. Open persistent notes with `<leader>.`.
* **Day 19**: Autocompletion: Navigate Blink.cmp popup suggestions with `<C-space>`, `<Tab>`, `<S-Tab>`, and `<CR>`.
* **Day 20**: Micro-editing with `mini.ai`: Delete parameters cleanly with `daa`, change function bodies with `cif`, and jump between TODOs with `]t` and `[t`.
* **Day 21**: Formatting & Diagnostics: Format code with `<leader>cf`. Jump between compiler errors with `]d` and inspect Trouble with `<leader>xx`.

---

### Week 4: Language Specialization (Target: Production Fluency)
* **Day 22**: TypeScript/Web: Practice JSX auto-closing tags, Tailwind CSS autocomplete, and organize imports (`<leader>co`).
* **Day 23**: TypeScript Refactoring: Extract variables, inspect hover types, and verify Prettier format-on-save.
* **Day 24**: Python: Practice switching virtual environments with `<leader>cv`, and observe Ruff auto-sorting imports on save.
* **Day 25**: Go: Practice writing structs, auto-generating JSON tags (`<leader>ca`), and automatic `goimports` on save.
* **Day 26**: Rust: Inspect crate updates in `Cargo.toml`, view macro expansions, and navigate borrow-checker errors.
* **Day 27**: Flutter: Practice widget closing labels, hot reload (`<leader>fl`), and hot restart (`<leader>fR`).
* **Day 28**: Flutter UI: Practice widget refactorings (`Wrap with Padding`, `Wrap with Column`) via `<leader>ca`.

---

### Capstone: Days 29–30 (Plugin Mastery & Speed Benchmark)
* **Day 29**: Plugin Mastery: Review `06-plugin-mastery-and-ecosystem/`. Practice adding a community plugin, checking `:Lazy` and `:checkhealth`, and restoring sessions with `<leader>qs`.
* **Day 30**: Complete the hands-on labs in `practice/practice_plugins_lab.md` and take the **Graduation Speed Test** in `practice/practice_grammar.txt`!

---

## 🏆 The Graduation Checklist

You are officially a Neovim Master when you can check off all of the following:

- [ ] I edit code for an entire day without once touching my mouse or trackpad.
- [ ] I instinctively press `<Esc>` the moment I finish typing a line of code.
- [ ] When I want to change a word, I press `ciw` instead of holding Backspace.
- [ ] When I want to teleport to a line or variable, I use `s` (Flash) instead of repeated `j` / `k` strokes.
- [ ] When I want to find a file, I press `<leader><space>` and find it in < 1 second.
- [ ] When I need to replace text across multiple files, I use `<leader>sr` (Grug-Far) with live diff preview.
- [ ] When I need a shell command, I toggle the floating terminal with `<C-/>` instead of leaving Neovim.
- [ ] When I want to inspect a function, I press `K` or `gd`, and return with `<C-o>`.
- [ ] When I want to stage and commit code, I press `<leader>gg` and commit in LazyGit.
- [ ] I know how to install, configure, and maintain any Neovim plugin in `lua/plugins/`.
- [ ] My editor opens in less than 40 milliseconds.
