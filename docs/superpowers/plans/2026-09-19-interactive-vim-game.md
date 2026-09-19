# Interactive Neovim Mastery Game Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete, highly polished, zero-dependency browser-based modal Vim game with 30 progressive daily stages matching the Neovim Mastery 1-month curriculum, featuring a Tokyo Night aesthetic, Web Audio sound effects, real-time diff preview, keystroke golf scoring, and offline playability.

**Architecture:** Pure vanilla ES6 Modules and CSS with zero external runtime dependencies. A decoupled core editor engine manages lines, cursor coordinates, modal states (Normal, Insert, Visual, Visual Line, Command, Flash), counts, operators, and text objects. An evaluator validates stage completion conditions against buffer state or cursor targets, while UI layers handle the Tokyo Night terminal, Lualine statusline, Which-Key popups, diff viewing, and Web Audio synthesis.

**Tech Stack:** Vanilla JavaScript (ES2022 Modules), HTML5 Canvas/DOM, Modern CSS3 (CSS Variables for Tokyo Night palette), Web Audio API, Node.js built-in `node:test` runner for unit testing.

**Spec:** `docs/superpowers/specs/2026-09-19-interactive-vim-game-design.md`

## Global Constraints

- Zero external runtime npm dependencies for the client (100% portable HTML/CSS/JS, runs directly by opening `index.html` or via any static web server).
- Test suite uses Node.js standard library test runner: `node --test tests/*.test.js`.
- Color scheme strictly adheres to Tokyo Night palette (`#1a1b26`, `#24283b`, `#7aa2f7`, `#bb9af7`, `#7dcfff`, `#9ece6a`, `#e0af68`, `#f7768e`).
- All 30 days of the Neovim Mastery blueprint must be represented with playable, pedagogical challenges, recommended keystroke solutions, and links to repo chapters.
- Stage progress and settings must persist across reloads via `localStorage`.

---

### Task 1: Core Text Buffer & Cursor State Model

**Files:**
- Create: `game/js/editor/buffer.js`
- Create: `tests/buffer.test.js`

**Interfaces:**
- Produces: `TextBuffer` class with methods:
  - `constructor(initialText = '')`
  - `getText(): string`
  - `setText(text: string): void`
  - `getLines(): string[]`
  - `getLine(row: number): string`
  - `getCursor(): { row: number, col: number }`
  - `setCursor(row: number, col: number): void`
  - `clampCursor(): void`
  - `insertText(text: string): void`
  - `deleteChar(backspace?: boolean): string`
  - `deleteRange(start: { row: number, col: number }, end: { row: number, col: number }): string`
  - `insertLine(row: number, text: string): void`
  - `deleteLine(row: number): string`
  - `replaceChar(char: string): void`
  - `clone(): TextBuffer`

- [ ] **Step 1: Write the failing test**

```javascript
// tests/buffer.test.js
import test from 'node:test';
import assert from 'node:assert/strict';
import { TextBuffer } from '../game/js/editor/buffer.js';

test('TextBuffer initialization and cursor boundary clamping', () => {
  const buf = new TextBuffer('hello\nworld');
  assert.equal(buf.getLines().length, 2);
  assert.equal(buf.getLine(0), 'hello');
  buf.setCursor(0, 10);
  buf.clampCursor();
  assert.equal(buf.getCursor().col, 4); // Normal mode last char index is length-1
});

test('TextBuffer line deletions and insertions', () => {
  const buf = new TextBuffer('line 1\nline 2\nline 3');
  const removed = buf.deleteLine(1);
  assert.equal(removed, 'line 2');
  assert.equal(buf.getText(), 'line 1\nline 3');
  buf.insertLine(1, 'new line 2');
  assert.equal(buf.getText(), 'line 1\nnew line 2\nline 3');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/buffer.test.js`
Expected: FAIL (Cannot find module '../game/js/editor/buffer.js')

- [ ] **Step 3: Write minimal implementation**

Implement `TextBuffer` in `game/js/editor/buffer.js` handling lines array, row/col cursor with bounds checking, text insertion, range deletion, line insertion/deletion, and cloning.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/buffer.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add game/js/editor/buffer.js tests/buffer.test.js
git commit -m "feat(game): add TextBuffer data model and unit tests"
```

---

### Task 2: Modal Vim Parser & Motion Engine

**Files:**
- Create: `game/js/editor/key-parser.js`
- Create: `game/js/editor/vim-engine.js`
- Create: `tests/motions.test.js`

**Interfaces:**
- Consumes: `TextBuffer` from `game/js/editor/buffer.js`
- Produces: `VimEngine` class and `KeyParser`:
  - `enum Mode { NORMAL, INSERT, VISUAL, VISUAL_LINE, COMMAND, FLASH }`
  - `engine.handleKey(key: string, eventDetails?: object): { handled: boolean, feedback?: string }`
  - `engine.getMode(): Mode`
  - `engine.getPendingKeys(): string`
  - `engine.getRegister(name: string): string`
  - Motions: `h`, `j`, `k`, `l`, `w`, `b`, `e`, `ge`, `0`, `^`, `$`, `gg`, `G`, `f{c}`, `F{c}`, `t{c}`, `T{c}`, `;`, `,`, `{`, `}`
  - Counts: parsing numeric prefixes like `3w`, `5j`, `2G`

- [ ] **Step 1: Write the failing test**

```javascript
// tests/motions.test.js
import test from 'node:test';
import assert from 'node:assert/strict';
import { TextBuffer } from '../game/js/editor/buffer.js';
import { VimEngine } from '../game/js/editor/vim-engine.js';

test('VimEngine word motions with counts (w, b, e)', () => {
  const buf = new TextBuffer('const total = calculateSum(price, tax);');
  const engine = new VimEngine(buf);
  assert.equal(engine.getMode(), 'NORMAL');

  engine.handleKey('w'); // moves to 'total'
  assert.equal(buf.getCursor().col, 6);

  engine.handleKey('2');
  engine.handleKey('w'); // moves 2 words forward to 'calculateSum'
  assert.equal(buf.getCursor().col, 14);

  engine.handleKey('b'); // moves backward
  assert.equal(buf.getCursor().col, 12); // '='
});

test('Inline seeking f and t with repeater ;', () => {
  const buf = new TextBuffer('foo(alpha, beta, gamma)');
  const engine = new VimEngine(buf);
  engine.handleKey('f');
  engine.handleKey('a'); // jumps to first 'a'
  assert.equal(buf.getCursor().col, 4);

  engine.handleKey(';'); // repeats f -> jumps to next 'a'
  assert.equal(buf.getCursor().col, 8);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/motions.test.js`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

Implement `game/js/editor/key-parser.js` to buffer keystrokes, detect multi-character combinations (`gg`, `f{char}`, counts like `12j`), and execute motions across line and word boundaries in `game/js/editor/vim-engine.js`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/motions.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add game/js/editor/key-parser.js game/js/editor/vim-engine.js tests/motions.test.js
git commit -m "feat(game): implement key parser and basic vim motions"
```

---

### Task 3: Text Objects, Operators & History (Undo/Redo, Repeat)

**Files:**
- Create: `game/js/editor/text-objects.js`
- Create: `game/js/editor/operators.js`
- Create: `tests/operators.test.js`

**Interfaces:**
- Consumes: `TextBuffer` and `VimEngine`
- Produces:
  - Text objects: `iw`, `aw`, `i"`, `a"`, `i'`, `a'`, `i(`, `a(`, `i[`, `a[`, `i{`, `a{`, `ip`, `ap`
  - Operators: `d` (delete), `c` (change -> delete & enter INSERT), `y` (yank), `r` (replace char), `x`, `s`, `J` (join lines)
  - Linewise actions: `dd`, `cc`, `yy`, `D`, `C`, `S`
  - Put: `p`, `P`
  - Undo & Redo: `u`, `<C-r>`
  - Dot repeat: `.` repeats last mutating command

- [ ] **Step 1: Write the failing test**

```javascript
// tests/operators.test.js
import test from 'node:test';
import assert from 'node:assert/strict';
import { TextBuffer } from '../game/js/editor/buffer.js';
import { VimEngine } from '../game/js/editor/vim-engine.js';

test('Operator + text object: ci" replaces inner string', () => {
  const buf = new TextBuffer('const name = "CHANGE_ME";');
  const engine = new VimEngine(buf);
  buf.setCursor(0, 15); // inside "CHANGE_ME"
  
  engine.handleKey('c');
  engine.handleKey('i');
  engine.handleKey('"');
  assert.equal(engine.getMode(), 'INSERT');
  assert.equal(buf.getText(), 'const name = "";');
  
  // Type replacement in insert mode
  'Eddie'.split('').forEach(ch => engine.handleKey(ch));
  engine.handleKey('Escape');
  assert.equal(buf.getText(), 'const name = "Eddie";');
  assert.equal(engine.getMode(), 'NORMAL');
});

test('Undo and dot repeat', () => {
  const buf = new TextBuffer('item1\nitem2\nitem3');
  const engine = new VimEngine(buf);
  engine.handleKey('d');
  engine.handleKey('d'); // delete item1
  assert.equal(buf.getText(), 'item2\nitem3');

  engine.handleKey('u'); // undo
  assert.equal(buf.getText(), 'item1\nitem2\nitem3');

  engine.handleKey('d');
  engine.handleKey('d'); // delete item1
  engine.handleKey('.'); // repeat dd on item2
  assert.equal(buf.getText(), 'item3');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/operators.test.js`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

Implement text object finders in `text-objects.js` (detecting matching delimiters for quotes, parentheses, brackets, whitespace-delimited words). Wire operators (`d`, `c`, `y`) to text objects and motions in `operators.js`. Implement change record stack for `u`, `<C-r>`, and `.` in `vim-engine.js`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/operators.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add game/js/editor/text-objects.js game/js/editor/operators.js tests/operators.test.js
git commit -m "feat(game): add text objects, operators, undo/redo, and dot repeat"
```

---

### Task 4: Command Mode, Search & Flash Teleportation

**Files:**
- Create: `game/js/editor/command-mode.js`
- Create: `game/js/editor/flash-mode.js`
- Create: `tests/command-mode.test.js`

**Interfaces:**
- Consumes: `VimEngine`, `TextBuffer`
- Produces:
  - Command mode parser: `:` prompt executing `:w`, `:q`, `:wq`, `:s/target/replace/g`, `:%s/find/replace/g`, `:noh`
  - In-buffer search: `/pattern` and `?pattern`, next match `n`, prev match `N`
  - Flash teleportation: `s` triggers 2-char jump mode; highlights target labels across buffer; pressing label jumps cursor directly.

- [ ] **Step 1: Write the failing test**

```javascript
// tests/command-mode.test.js
import test from 'node:test';
import assert from 'node:assert/strict';
import { TextBuffer } from '../game/js/editor/buffer.js';
import { VimEngine } from '../game/js/editor/vim-engine.js';

test('Command mode global substitution :%s/old/new/g', () => {
  const buf = new TextBuffer('let oldVal = 1;\nconsole.log(oldVal);');
  const engine = new VimEngine(buf);
  
  engine.handleKey(':');
  assert.equal(engine.getMode(), 'COMMAND');
  
  '%s/oldVal/newVal/g'.split('').forEach(ch => engine.handleKey(ch));
  engine.handleKey('Enter');
  
  assert.equal(buf.getText(), 'let newVal = 1;\nconsole.log(newVal);');
  assert.equal(engine.getMode(), 'NORMAL');
});

test('Search mode /pattern with n and N', () => {
  const buf = new TextBuffer('apple banana apple cherry apple');
  const engine = new VimEngine(buf);
  
  engine.handleKey('/');
  'apple'.split('').forEach(ch => engine.handleKey(ch));
  engine.handleKey('Enter');
  
  assert.equal(buf.getCursor().col, 0);
  engine.handleKey('n');
  assert.equal(buf.getCursor().col, 13);
  engine.handleKey('n');
  assert.equal(buf.getCursor().col, 26);
  engine.handleKey('N');
  assert.equal(buf.getCursor().col, 13);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/command-mode.test.js`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

Implement `command-mode.js` regex substitution and command handlers. Implement `/` pattern search and match navigation. Implement `flash-mode.js` generating jump labels (a-z) for targets matching two typed characters.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/command-mode.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add game/js/editor/command-mode.js game/js/editor/flash-mode.js tests/command-mode.test.js
git commit -m "feat(game): add command mode, in-buffer regex search, and flash teleportation"
```

---

### Task 5: 30-Day Stage Progression Curriculum & Goal Evaluator

**Files:**
- Create: `game/js/stages/curriculum.js`
- Create: `game/js/stages/evaluator.js`
- Create: `tests/curriculum.test.js`

**Interfaces:**
- Produces:
  - `STAGES: StageDefinition[]` (All 30 days detailed: Day, Title, Week, Theme, Mission, InitialText, CursorStart, TargetText, TargetCursor, TargetMode, ParKeystrokes, OptimalSolution, Hints, ChapterRef)
  - `evaluateStage(stage: StageDefinition, engine: VimEngine, keystrokes: string[]): { completed: boolean, stars: number, feedback: string }`

- [ ] **Step 1: Write the failing test**

```javascript
// tests/curriculum.test.js
import test from 'node:test';
import assert from 'node:assert/strict';
import { STAGES } from '../game/js/stages/curriculum.js';
import { evaluateStage } from '../game/js/stages/evaluator.js';
import { TextBuffer } from '../game/js/editor/buffer.js';
import { VimEngine } from '../game/js/editor/vim-engine.js';

test('Curriculum has 30 complete days with required metadata', () => {
  assert.equal(STAGES.length, 30);
  STAGES.forEach((stage, idx) => {
    assert.equal(stage.day, idx + 1);
    assert.ok(stage.title, `Day ${stage.day} missing title`);
    assert.ok(stage.week, `Day ${stage.day} missing week`);
    assert.ok(stage.mission, `Day ${stage.day} missing mission`);
    assert.ok(stage.initialText !== undefined, `Day ${stage.day} missing initialText`);
    assert.ok(stage.parKeystrokes > 0, `Day ${stage.day} invalid par`);
    assert.ok(stage.hints && stage.hints.length > 0, `Day ${stage.day} missing hints`);
    assert.ok(stage.chapterRef, `Day ${stage.day} missing chapterRef`);
  });
});

test('Stage evaluator checks text match and par keystrokes for stars', () => {
  const stage = STAGES[0]; // Day 1
  const buf = new TextBuffer(stage.initialText);
  const engine = new VimEngine(buf);
  buf.setCursor(stage.cursorStart.row, stage.cursorStart.col);
  
  // Simulate executing optimal keys
  for (const k of stage.optimalKeys) {
    engine.handleKey(k);
  }
  
  const result = evaluateStage(stage, engine, stage.optimalKeys);
  assert.equal(result.completed, true);
  assert.equal(result.stars, 3);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/curriculum.test.js`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

Create full 30-day curriculum definitions across:
- Week 1: Days 1–7 (Grammar & Motions, Survival, Seek, Text Objects, Registers)
- Week 2: Days 8–14 (Jumps, Visual Block, Undo/Redo, Search, Splits/Buffers, Flash, Macros)
- Week 3: Days 15–21 (Treesitter, LSP Jump, Diagnostics, Refactor, Mini.ai, Surround, Grep)
- Week 4: Days 22–28 (TypeScript, Python, Go, Rust, Flutter, Markdown, Git hunks)
- Capstones: Days 29–30 (Speed Golf & Grandmaster Boss Battle)
Implement `evaluateStage()` with text diff comparison, cursor placement checks, and 1-3 star rating based on par.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/curriculum.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add game/js/stages/curriculum.js game/js/stages/evaluator.js tests/curriculum.test.js
git commit -m "feat(game): add full 30-day curriculum definitions and stage evaluator"
```

---

### Task 6: Tokyo Night Terminal Renderer & Visual Components

**Files:**
- Create: `game/css/tokyo-night.css`
- Create: `game/css/game.css`
- Create: `game/js/ui/renderer.js`
- Create: `game/js/ui/statusline.js`

**Interfaces:**
- Consumes: `VimEngine`, `TextBuffer`
- Produces:
  - `renderBuffer(containerEl: HTMLElement, engine: VimEngine, buffer: TextBuffer): void`
    - Renders line numbers (hybrid relative + current absolute line number), code lines with syntax coloring classes, cursor element (with mode classes `.cursor-normal`, `.cursor-insert`, `.cursor-visual`), selection highlight spans.
  - `renderStatusline(statuslineEl: HTMLElement, engine: VimEngine, stageInfo: object): void`
    - Renders mode badge, filename, modified indicator, branch name, line/col percentage, day badge.

- [ ] **Step 1: Write the style tokens and DOM renderer layout**

Define CSS variables for Tokyo Night (`--bg: #1a1b26`, `--bg-dark: #16161e`, `--fg: #c0caf5`, `--blue: #7aa2f7`, `--purple: #bb9af7`, `--cyan: #7dcfff`, `--green: #9ece6a`, `--yellow: #e0af68`, `--red: #f7768e`). Implement `renderer.js` and `statusline.js` creating virtual lines, cursor overlay, and Lualine badges.

- [ ] **Step 2: Create a headless DOM test to verify rendering output**

Create a quick test in `tests/render.test.js` verifying that `renderBuffer` generates correct line divs and cursor position coordinates for a sample buffer.

- [ ] **Step 3: Run render test**

Run: `node --test tests/render.test.js`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add game/css/tokyo-night.css game/css/game.css game/js/ui/renderer.js game/js/ui/statusline.js tests/render.test.js
git commit -m "feat(game): create Tokyo Night theme styles, terminal buffer renderer, and statusline"
```

---

### Task 7: Audio Synthesizer, HUD, Diff Viewer, Which-Key & Modals

**Files:**
- Create: `game/js/ui/audio.js`
- Create: `game/js/ui/hud.js`
- Create: `game/js/ui/diff-viewer.js`
- Create: `game/js/ui/which-key.js`
- Create: `game/js/ui/modal.js`

**Interfaces:**
- Produces:
  - `SoundFX`: Web Audio API sound generator (no audio files needed, works instantly offline): `playKeypress()`, `playSuccess()`, `playError()`, `playLevelComplete()`, `toggleMute()`
  - `HUD`: Keystroke sequence badge (e.g. `c i " -> Change inside quotes`), stroke counter vs Par, APM tracker.
  - `DiffViewer`: Side-by-side or collapsible target preview showing real-time diff between current buffer and stage target.
  - `WhichKey`: Floating helper showing available key completions on `<leader>` or idle.
  - `Modal`: Level Complete victory modal (stars, keystrokes, next button), 30-Day Calendar stage select modal, Settings modal.

- [ ] **Step 1: Implement Web Audio synthesizer in audio.js**

Use `AudioContext` with custom oscillators (square/triangle with quick exponential decay for authentic mechanical key click, pleasant major triad arpeggio for stage clear, soft low boop for invalid key).

- [ ] **Step 2: Implement HUD, DiffViewer, WhichKey and Modal dialogs**

Implement real-time diff comparison showing matching text, missing text, and unwanted text. Implement Which-Key panel with keyboard hints. Implement 30-day interactive level select grid.

- [ ] **Step 3: Test audio and diff viewer logic**

Write `tests/diff.test.js` verifying diff calculation produces accurate status for completed, partially completed, and failed stages.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/diff.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add game/js/ui/audio.js game/js/ui/hud.js game/js/ui/diff-viewer.js game/js/ui/which-key.js game/js/ui/modal.js tests/diff.test.js
git commit -m "feat(game): add Web Audio sound effects, HUD, diff viewer, Which-Key popup, and modals"
```

---

### Task 8: App Orchestration, State Persistence & Game Launcher

**Files:**
- Create: `game/js/state.js`
- Create: `game/js/app.js`
- Create: `game/index.html`
- Create: `index.html` (root redirect / direct player for GitHub Pages)
- Create: `play-game.sh` (executable bash script to launch in default browser)

**Interfaces:**
- Consumes: All editor, stage, and UI modules
- Produces:
  - `GameState`: Manages current stage (1-30), unlocked stages, stars per stage, high scores, mute preference, sandbox mode toggle; saved in `localStorage['neovim_mastery_state']`.
  - `App`: Initializes DOM elements, mounts event listeners (`keydown`, button clicks), drives stage transitions, restarts, hints, and sandbox free-play mode.

- [ ] **Step 1: Implement State Persistence in state.js**

Provide `loadState()`, `saveStageScore(day, stars, keystrokes)`, `isDayUnlocked(day)`, `resetProgress()`.

- [ ] **Step 2: Implement Game Controller in app.js**

Bind global `keydown` handler to `engine.handleKey()`. Update renderer, statusline, HUD, diff viewer on every stroke. Check `evaluateStage()` on change; trigger celebration modal and award stars when target is matched.

- [ ] **Step 3: Create game/index.html & root index.html**

Build semantic HTML layout with terminal window title bar (macOS dots: red, yellow, green), mission briefing header with stage info, split layout with editor buffer and target diff viewer, Which-Key drawer, bottom statusline, audio mute button, stage map toggle, sandbox toggle, and hint button.

- [ ] **Step 4: Create play-game.sh script**

Make executable `./play-game.sh` that detects `xdg-open`, `open`, or starts a local python/node http server if opened via CLI.

- [ ] **Step 5: Verify launching and testing game in browser**

Run: `./play-game.sh --test` or verify files load cleanly via Python static server and node tests.

- [ ] **Step 6: Commit**

```bash
git add game/js/state.js game/js/app.js game/index.html index.html play-game.sh
git commit -m "feat(game): assemble main application, state persistence, HTML interface, and launcher"
```

---

### Task 9: Full Curriculum Verification, README Enhancement & Polish

**Files:**
- Create: `tests/full-curriculum-runner.test.js`
- Modify: `README.md`

**Interfaces:**
- Consumes: All 30 stages in `game/js/stages/curriculum.js`
- Produces: Automated simulation executing every single stage's `optimalKeys` and verifying 100% of all 30 stages pass with 3 stars!

- [ ] **Step 1: Write full curriculum verification test**

Run a headless automated pass through all 30 stages: execute `stage.optimalKeys` through `VimEngine` and assert that `evaluateStage(stage, engine, stage.optimalKeys)` passes with 3 stars for all 30 days.

- [ ] **Step 2: Run all unit and curriculum tests**

Run: `node --test tests/*.test.js`
Expected: ALL PASS (100% test coverage for motions, text objects, operators, search, and all 30 stages).

- [ ] **Step 3: Update README.md**

Add an engaging "🎮 Play the Neovim Mastery Interactive Game" section to `README.md` with:
- Quick play instructions (`./play-game.sh` or double-clicking `index.html`)
- GitHub Pages badge / link
- Feature highlights (30-Day interactive dojo, Tokyo Night theme, real-time diff, keystroke golf scoring, mechanical sound synthesizer, free sandbox mode)
- Mapping between game stages and tutorial chapters.

- [ ] **Step 4: Commit**

```bash
git add tests/full-curriculum-runner.test.js README.md
git commit -m "docs(game): add interactive game documentation, 30-day runner tests, and README badge"
```

---

## Execution Handoff

After saving this plan, review the execution choice:

1. **Subagent-Driven (recommended)** - Fresh subagent per task, two-stage review between tasks.
2. **Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints.
