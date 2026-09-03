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

### Week 2: Navigation & Project Structure (Target: Never touch the mouse)
* **Day 8**: Open 3 files. Practice switching between them with `<Shift>l` and `<Shift>h`, and closing with `<leader>bd`.
* **Day 9**: Split windows vertically (`<leader>|`) and horizontally (`<leader>-`). Move between them using `<C-h>`, `<C-j>`, `<C-k>`, `<C-l>`.
* **Day 10**: Fuzzy finding: search files with `<leader><space>` and open in splits using `<C-v>`.
* **Day 11**: Project-wide search: use `<leader>/` to grep text, and `<leader>sw` to find the word under the cursor.
* **Day 12**: Neo-Tree file manager (`<leader>e`): Practice adding files (`a`), deleting (`d`), and renaming (`r`).
* **Day 13**: Treesitter navigation: Jump through functions using `]m` and `[m`. Delete entire function bodies with `cif`.
* **Day 14**: Git mastery: Jump through changes with `]h`, preview diffs with `<leader>ghp`, and launch LazyGit with `<leader>gg`.

---

### Week 3: Modern IDE Power Tools (Target: Effortless Code Intelligence)
* **Day 15**: Explore Mason (`<leader>cm`). Verify all installed language servers and formatters.
* **Day 16**: LSP navigation: Jump to definitions with `gd`, view docs with `K`, and inspect references with `gr`. Return using `<C-o>`.
* **Day 17**: Refactoring: Practice project-wide rename with `<leader>cr` and file rename with `<leader>cR`.
* **Day 18**: Code actions: Trigger quick fixes and auto-imports with `<leader>ca`.
* **Day 19**: Autocompletion: Navigate Blink.cmp popup suggestions with `<C-n>` and `<C-p>`, accept with `<Tab>`.
* **Day 20**: Snippets: Expand loops and components with `<Tab>`, and jump between tabstops.
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

### Capstone: Days 29–30 (The Speed Benchmark)
* **Day 29**: Review customization in [options.lua](../nvim/lua/config/options.lua) and [keymaps.lua](../nvim/lua/config/keymaps.lua). Explore `:LazyExtras`.
* **Day 30**: Take the **Graduation Speed Test** in `practice/practice_grammar.txt`!

---

## 🏆 The Graduation Checklist

You are officially a Neovim Master when you can check off all of the following:

- [ ] I edit code for an entire day without once touching my mouse or trackpad.
- [ ] I instinctively press `<Esc>` the moment I finish typing a line of code.
- [ ] When I want to change a word, I press `ciw` instead of holding Backspace.
- [ ] When I want to find a file, I press `<Space><Space>` and find it in < 1 second.
- [ ] When I want to inspect a function, I press `K` or `gd`, and return with `<C-o>`.
- [ ] When I want to stage and commit code, I press `<Space>gg` and commit in LazyGit.
- [ ] My editor opens in less than 50 milliseconds.
