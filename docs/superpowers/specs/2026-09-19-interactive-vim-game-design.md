# Interactive Neovim Mastery Game Specification

## 1. Overview & Objective
Transform the repository's 30-day Neovim curriculum into a playable, highly polished HTML5/CSS/JavaScript web game titled **"Neovim Mastery: The 30-Day Dojo"**. The game simulates a real modal editor inside a Tokyo Night-themed terminal, taking players through a 30-stage progression from basic motions to expert refactoring, macros, AST navigation, and speed golf challenges.

## 2. Core Requirements

### 2.1 Engine Requirements
1. **Modal State Machine**: Support `NORMAL`, `INSERT`, `VISUAL`, `VISUAL_LINE`, `COMMAND`, and `FLASH` modes.
2. **Motions & Navigation**:
   - Single-character motions: `h`, `j`, `k`, `l`
   - Word motions: `w`, `b`, `e`, `ge`, `W`, `B`, `E`
   - Line boundaries: `0`, `^`, `$`, `g_`
   - Inline target seeking: `f{char}`, `F{char}`, `t{char}`, `T{char}`, `;`, `,`
   - Vertical & paragraph jumping: `gg`, `G`, `{`, `}`, `H`, `M`, `L`, count + `G` (or count + `gg`)
   - Scroll & screen helpers: `zt`, `zz`, `zb`
3. **Operators & Text Objects**:
   - Operators: `d` (delete), `c` (change), `y` (yank), `>` (indent), `<` (outdent), `gu` (lowercase), `gU` (uppercase)
   - Linewise shortcuts: `dd`, `cc`, `yy`, `>>`, `<<`, `D`, `C`, `Y`, `S`, `s`, `x`, `X`
   - Text objects: `iw`, `aw`, `i"`, `a"`, `i'`, `a'`, `i(`, `a(`, `i[`, `a[`, `i{`, `a{`, `i<`, `a<`, `it`, `at`, `ip`, `ap`
   - Numeric counts on all motions and operators: e.g. `3w`, `2dd`, `5j`, `c2w`, `d$`
4. **Editing & History Operations**:
   - Insert entries: `i`, `I`, `a`, `A`, `o`, `O`
   - Undo/Redo: `u`, `<C-r>`
   - Repeat last change: `.` (dot repeat)
   - Joining lines: `J`
   - Replace single character: `r{char}`
   - Put / Paste: `p`, `P`
   - Registers: Default unnamed register `""`, named registers `"a`, `"b`, and system register `"+`
5. **Command-Line (`:`) Mode**:
   - Line substitutions: `:s/find/replace/g`, `:%s/find/replace/g`
   - Saving / quitting triggers: `:w`, `:q`, `:wq`, `:q!`
   - Clear highlight: `:noh`
6. **Neovim Modern Superpowers**:
   - Flash.nvim teleportation simulation: pressing `s` activates 2-keystroke jump targets with labels across the screen
   - Which-Key prompt on `<leader>` (Space) and command hints
   - Relative + hybrid line numbering

### 2.2 Pedagogical 30-Day Stage Progression
Meticulously mapped to the 30-day course in `README.md` and repository chapters:
- **Week 1: The Grammar of Vim Motions**
  - Day 1: Mental Model & Survival (`i`, `Esc`, `:w`, `:q`)
  - Day 2: Basic Arrowless Navigation (`h`, `j`, `k`, `l`, count motions)
  - Day 3: Word Motions & Boundaries (`w`, `b`, `e`, `ge`, `0`, `^`, `$`)
  - Day 4: Vim Grammar Formula: Verb + Count + Noun (`d`, `c`, `y` with `w`, `e`, `$`, `0`, `dd`, `cc`)
  - Day 5: Inline Seeking Speed (`f`, `F`, `t`, `T`, `;`, `,`)
  - Day 6: The Superpower of Text Objects (`ciw`, `di"`, `ca(`, `da{`, `cip`)
  - Day 7: Visual Blocks & Registers (`v`, `V`, `y`, `p`, `"ay`, `"ap`, `.`)
- **Week 2: Navigation, Buffers, Git & Plugins**
  - Day 8: Paragraphs & File-Wide Jumps (`{`, `}`, `gg`, `G`, `50%`)
  - Day 9: Visual Block Multi-Line Editing (`<C-v>I`, `<C-v>c`, `r`)
  - Day 10: Undo Trees & Joining Lines (`u`, `<C-r>`, `J`, `~`)
  - Day 11: Pattern Search & Replace (`/word`, `n`, `N`, `:%s/foo/bar/g`)
  - Day 12: Buffers & Split Navigation (`<C-w>v`, `<C-w>h/l`, `:bnext`, `:bprev`)
  - Day 13: Flash 2-Keystroke Teleportation (`s` jump tags)
  - Day 14: Keyboard Macros (`qa`, `@a`, `@@`, `3@a`)
- **Week 3: Modern IDE Power Tools**
  - Day 15: Treesitter AST Hopping (`]m`, `[m`, `]f`, `[f`)
  - Day 16: Definition & Reference Navigation (`gd`, `gr`, `K`)
  - Day 17: Diagnostic Hopping (`]d`, `[d`, Trouble preview)
  - Day 18: Code Actions & Quick Fixes (`<leader>ca`, `<leader>cr`)
  - Day 19: Mini.ai Enhanced Text Objects (`daa`, `dia`, `daf`)
  - Day 20: Surround Operations (Quotes & Brackets manipulation)
  - Day 21: Snacks Grep & Project Search (`<leader>/`, `<leader><space>`)
- **Week 4: Language-Specific Refactoring Playbooks**
  - Day 22: TypeScript / React Refactoring (Transforming messy props & hooks)
  - Day 23: Python Indentation & Block Gymnastics (def, return, loops)
  - Day 24: Go Struct & Error Handling (`if err != nil`, struct tags)
  - Day 25: Rust Pattern Matching & Enums (`match`, `Option`, unwraps)
  - Day 26: Flutter / Dart Widget Tree Nesting (Widget refactoring)
  - Day 27: Markdown & Documentation Speedrun (Tables, lists, headings)
  - Day 28: Git Hunk Review & Resolution (Gitsigns hunks stage/reset)
- **Capstones: Grandmaster Trials**
  - Day 29: Vim Golf Par Challenge (Solve target refactor under strict keystroke budget)
  - Day 30: Neovim Grandmaster Boss Gauntlet (Rapid-fire randomized tasks, APM tracking, zero mouse)

### 2.3 UX & Audio-Visual Design
1. **Tokyo Night Theme**: Authentic color styling (`#1a1b26`, `#24283b`, `#7aa2f7`, `#bb9af7`, `#7dcfff`, `#9ece6a`, `#e0af68`, `#f7768e`).
2. **Terminal Statusline**: Lualine-inspired with mode badges, branch icon, file path, line:col, stage number.
3. **Live Diff Viewer**: Real-time side-by-side or split diff showing current buffer vs target goal.
4. **HUD & Golf Scoring**:
   - Par keystroke threshold (Gold: $\le$ Par, Silver: Par+3, Bronze: Passed).
   - Keystroke counter & typed sequence HUD (e.g. `c i " -> Change inside quotes`).
   - Sound synthesizer using Web Audio API (mechanical click, error tone, stage clear chime, fanfares, toggleable mute).
5. **Storage & Portability**:
   - 100% static HTML/CSS/ES Modules.
   - Zero build tools required to play: just open `game/index.html` or repo root `index.html`.
   - Progress saved automatically in `localStorage`.
   - Sandbox / Free Play mode to test any Vim command freely.
