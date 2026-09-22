import test from 'node:test';
import assert from 'node:assert/strict';
import { TextBuffer } from '../game/js/editor/buffer.js';
import { VimEngine } from '../game/js/editor/vim-engine.js';
import { GameState } from '../game/js/state.js';
import { SplitManager } from '../game/js/ui/split-manager.js';

test('LazyVim Leader Key (<Space>): Triggering plugin actions', () => {
  const buf = new TextBuffer('const x = 10;');
  const engine = new VimEngine(buf);

  let leaderStateCalled = false;
  let pluginActionCalled = '';
  engine.onLeaderState = (keys, active) => {
    leaderStateCalled = active;
  };
  engine.onPluginAction = (action) => {
    pluginActionCalled = action;
  };

  // Press Space (Leader)
  engine.handleKey(' ');
  assert.equal(engine.pendingLeader, true);
  assert.equal(leaderStateCalled, true);

  // Press f then f (Find Files)
  engine.handleKey('f');
  assert.equal(engine.pendingLeader, true);
  engine.handleKey('f');
  assert.equal(engine.pendingLeader, false);
  assert.equal(engine.actionsExecuted.has('fzf'), true);
  assert.equal(pluginActionCalled, 'fzf_files');

  // Trigger Neo-tree: <Space>e
  engine.handleKey(' ');
  engine.handleKey('e');
  assert.equal(engine.actionsExecuted.has('neotree'), true);
  assert.equal(pluginActionCalled, 'neotree');

  // Trigger Trouble: <Space>xx
  engine.handleKey(' ');
  engine.handleKey('x');
  engine.handleKey('x');
  assert.equal(engine.actionsExecuted.has('trouble'), true);
  assert.equal(pluginActionCalled, 'trouble');

  // Trigger LSP Code Action: <Space>ca
  engine.handleKey(' ');
  engine.handleKey('c');
  engine.handleKey('a');
  assert.equal(engine.actionsExecuted.has('lsp_code_action'), true);

  // Trigger LazyGit: <Space>gg
  engine.handleKey(' ');
  engine.handleKey('g');
  engine.handleKey('g');
  assert.equal(engine.actionsExecuted.has('lazygit'), true);

  // Trigger Grug-Far: <Space>sr
  engine.handleKey(' ');
  engine.handleKey('s');
  engine.handleKey('r');
  assert.equal(engine.actionsExecuted.has('grug_far'), true);
});

test('Visual Block Mode (<C-v>): Column insertion with I and Escape', () => {
  const buf = new TextBuffer('line1\nline2\nline3\nline4');
  const engine = new VimEngine(buf);
  buf.setCursor(0, 0);

  // Enter Visual Block Mode
  engine.handleKey('<C-v>');
  assert.equal(engine.getMode(), 'VISUAL_BLOCK');

  // Move down 3 lines to select column 0 across lines 0-3
  engine.handleKey('j');
  engine.handleKey('j');
  engine.handleKey('j');

  // Block insert '// '
  engine.handleKey('I');
  assert.equal(engine.getMode(), 'INSERT');
  assert.equal(engine.isBlockInsert, true);

  '// '.split('').forEach(ch => engine.handleKey(ch));
  engine.handleKey('Escape');

  assert.equal(engine.getMode(), 'NORMAL');
  assert.equal(buf.getText(), '// line1\n// line2\n// line3\n// line4');
  assert.equal(engine.actionsExecuted.has('visual_block'), true);
});

test('Visual Block Mode (<C-v>): Column deletion with d', () => {
  const buf = new TextBuffer('1. apple\n2. banana\n3. cherry');
  const engine = new VimEngine(buf);
  buf.setCursor(0, 0);

  // Select '1. ', '2. ', '3. ' columns
  engine.handleKey('<C-v>');
  engine.handleKey('j');
  engine.handleKey('j');
  engine.handleKey('l');
  engine.handleKey('l');
  engine.handleKey('d');

  assert.equal(engine.getMode(), 'NORMAL');
  assert.equal(buf.getText(), 'apple\nbanana\ncherry');
  assert.equal(engine.actionsExecuted.has('visual_block'), true);
});

test('Macro Recording and Replay (qa ... q, @a)', () => {
  const buf = new TextBuffer('item\nitem\nitem');
  const engine = new VimEngine(buf);
  buf.setCursor(0, 0);

  // Start recording macro into register 'a'
  engine.handleKey('q');
  engine.handleKey('a');
  assert.equal(engine.recordingMacro, 'a');

  // Append '!;' to current line, then move down
  engine.handleKey('A');
  '!'.split('').forEach(ch => engine.handleKey(ch));
  engine.handleKey('Escape');
  engine.handleKey('j');

  // Stop recording
  engine.handleKey('q');
  assert.equal(engine.recordingMacro, null);
  assert.equal(buf.getText(), 'item!\nitem\nitem');

  // Replay macro twice with 2@a
  engine.handleKey('2');
  engine.handleKey('@');
  engine.handleKey('a');

  assert.equal(buf.getText(), 'item!\nitem!\nitem!');
  assert.equal(engine.actionsExecuted.has('macro'), true);
});

test('Mini.surround and surround operators: add, delete, replace', () => {
  const buf = new TextBuffer('hello world');
  const engine = new VimEngine(buf);
  buf.setCursor(0, 0); // on 'hello'

  // Surround word with double quotes: gsaw"
  'gsaw"'.split('').forEach(ch => engine.handleKey(ch));
  assert.equal(buf.getText(), '"hello" world');
  assert.equal(engine.actionsExecuted.has('surround'), true);

  // Replace surrounding quotes with single quotes: gsr"'
  'gsr"\''.split('').forEach(ch => engine.handleKey(ch));
  assert.equal(buf.getText(), "'hello' world");

  // Delete surrounding quotes: gsd'
  'gsd\''.split('').forEach(ch => engine.handleKey(ch));
  assert.equal(buf.getText(), 'hello world');

  // Also test vim-surround aliases: ysw(
  'ysw('.split('').forEach(ch => engine.handleKey(ch));
  assert.equal(buf.getText(), '(hello) world');

  // Delete parens with ds(
  'ds('.split('').forEach(ch => engine.handleKey(ch));
  assert.equal(buf.getText(), 'hello world');
});

test('LSP Capabilities: Hover (K), Goto Definition (gd), and Jumplist (<C-o>)', () => {
  const code = [
    'function authenticate(token: string) {',
    '  return token.length > 5;',
    '}',
    '',
    'const result = authenticate("secret");',
  ].join('\n');

  const buf = new TextBuffer(code);
  const engine = new VimEngine(buf);

  // Place cursor on authenticate call at row 4
  buf.setCursor(4, 18);

  // Press K for LSP hover
  const hoverRes = engine.handleKey('K');
  assert.equal(hoverRes.handled, true);
  assert.equal(engine.actionsExecuted.has('lsp_hover'), true);

  // Press gd to jump to definition
  engine.handleKey('g');
  engine.handleKey('d');
  assert.equal(engine.actionsExecuted.has('lsp_definition'), true);
  assert.equal(buf.getCursor().row, 0); // Jumped to function declaration on row 0!

  // Press <C-o> to jump back in jumplist
  engine.handleKey('<C-o>');
  assert.equal(buf.getCursor().row, 4);
});

test('Marks navigation: ma and jump with \'a', () => {
  const buf = new TextBuffer('first\nsecond\nthird');
  const engine = new VimEngine(buf);

  buf.setCursor(2, 3); // on 'third'
  engine.handleKey('m');
  engine.handleKey('a');
  assert.equal(engine.actionsExecuted.has('mark'), true);

  buf.setCursor(0, 0); // move to top
  assert.equal(buf.getCursor().row, 0);

  // Jump to mark 'a' line
  engine.handleKey("'");
  engine.handleKey('a');
  assert.equal(buf.getCursor().row, 2);
  assert.equal(engine.actionsExecuted.has('mark_jump'), true);
});

test('Neovim Window Splits (<C-w>): Vertical, Horizontal, Zen, Resize, Equalize, Swap', () => {
  const buf = new TextBuffer('console.log("split test");');
  const engine = new VimEngine(buf);

  let executedAction = '';
  engine.onPluginAction = (action) => {
    executedAction = action;
  };

  // <C-w>v: Vertical split
  engine.handleKey('<C-w>');
  assert.equal(engine.pendingWindowCmd, true);
  const r1 = engine.handleKey('v');
  assert.equal(r1.handled, true);
  assert.equal(r1.action, 'vsplit');
  assert.equal(executedAction, 'vsplit');
  assert.equal(engine.pendingWindowCmd, false);

  // <C-w>s: Horizontal split
  engine.handleKey('<C-w>');
  const r2 = engine.handleKey('s');
  assert.equal(r2.action, 'split');
  assert.equal(executedAction, 'split');

  // <C-w>o: Zen / Only mode
  engine.handleKey('<C-w>');
  const r3 = engine.handleKey('o');
  assert.equal(r3.action, 'zen');

  // <C-w>q: Close window
  engine.handleKey('<C-w>');
  const r4 = engine.handleKey('q');
  assert.equal(r4.action, 'close_window');

  // <C-w>=: Equalize splits
  engine.handleKey('<C-w>');
  const r5 = engine.handleKey('=');
  assert.equal(r5.action, 'equalize_split');

  // <C-w>> and <C-w><: Resize width
  engine.handleKey('<C-w>');
  const r6 = engine.handleKey('>');
  assert.equal(r6.action, 'resize_width_plus');

  engine.handleKey('<C-w>');
  const r7 = engine.handleKey('<');
  assert.equal(r7.action, 'resize_width_minus');

  // <C-w>r: Swap windows
  engine.handleKey('<C-w>');
  const r8 = engine.handleKey('r');
  assert.equal(r8.action, 'swap_splits');

  // <C-w>w: Switch window
  engine.handleKey('<C-w>');
  const r9 = engine.handleKey('w');
  assert.equal(r9.action, 'switch_window');
});

test('Command Mode Splits (:vsplit, :split, :only, :zen, :close, :wincmd)', () => {
  const buf = new TextBuffer('code block');
  const engine = new VimEngine(buf);

  // :vsplit / :vs
  engine.handleKey(':');
  for (const ch of 'vsplit') engine.handleKey(ch);
  const r1 = engine.handleKey('Enter');
  assert.equal(r1.action, 'vsplit');

  // :split / :sp
  engine.handleKey(':');
  for (const ch of 'sp') engine.handleKey(ch);
  const r2 = engine.handleKey('Enter');
  assert.equal(r2.action, 'split');

  // :only / :on
  engine.handleKey(':');
  for (const ch of 'only') engine.handleKey(ch);
  const r3 = engine.handleKey('Enter');
  assert.equal(r3.action, 'zen');

  // :zen
  engine.handleKey(':');
  for (const ch of 'zen') engine.handleKey(ch);
  const r4 = engine.handleKey('Enter');
  assert.equal(r4.action, 'zen');

  // :wincmd v
  engine.handleKey(':');
  for (const ch of 'wincmd v') engine.handleKey(ch);
  const r5 = engine.handleKey('Enter');
  assert.equal(r5.action, 'vsplit');

  // :wincmd =
  engine.handleKey(':');
  for (const ch of 'wincmd =') engine.handleKey(ch);
  const r6 = engine.handleKey('Enter');
  assert.equal(r6.action, 'equalize_split');
});

test('LazyVim UI Toggles (<Space>uz, <Space>us, <Space>ur, <Space>um, <Space>ud)', () => {
  const buf = new TextBuffer('leader toggles');
  const engine = new VimEngine(buf);

  // <Space>uz: Zen Mode
  engine.handleKey(' ');
  const r1 = engine.handleKey('u');
  assert.equal(r1.handled, true);
  const r2 = engine.handleKey('z');
  assert.equal(r2.action, 'zen');

  // <Space>us: Split orientation toggle
  engine.handleKey(' ');
  engine.handleKey('u');
  const r3 = engine.handleKey('s');
  assert.equal(r3.action, 'toggle_split_orientation');

  // <Space>ur: Swap window reverse
  engine.handleKey(' ');
  engine.handleKey('u');
  const r4 = engine.handleKey('r');
  assert.equal(r4.action, 'swap_splits');

  // <Space>um: Mission Pane toggle
  engine.handleKey(' ');
  engine.handleKey('u');
  const r5 = engine.handleKey('m');
  assert.equal(r5.action, 'toggle_mission');

  // <Space>ud: Diff View toggle
  engine.handleKey(' ');
  engine.handleKey('u');
  const r6 = engine.handleKey('d');
  assert.equal(r6.action, 'toggle_diff');
});

test('SplitManager and GameState Split Persistence', () => {
  const state = new GameState();

  // Test state defaults
  assert.equal(state.splitMode, 'vertical');
  assert.equal(state.splitRatio, 55);
  assert.equal(state.splitReversed, false);
  assert.equal(state.splitTab, 'diff');

  // Test setSplitMode
  state.setSplitMode('horizontal');
  assert.equal(state.splitMode, 'horizontal');

  // Test toggleZen
  state.toggleZen();
  assert.equal(state.splitMode, 'zen');
  state.toggleZen();
  assert.equal(state.splitMode, 'horizontal'); // restores previous

  // Test setSplitRatio clamping
  state.setSplitRatio(10); // below min 20
  assert.equal(state.splitRatio, 20);
  state.setSplitRatio(95); // above max 80
  assert.equal(state.splitRatio, 80);
  state.setSplitRatio(60);
  assert.equal(state.splitRatio, 60);

  // Test reverse
  state.toggleSplitReverse();
  assert.equal(state.splitReversed, true);

  // Test splitTab
  state.setSplitTab('mission');
  assert.equal(state.splitTab, 'mission');

  // Test SplitManager
  const mgr = new SplitManager(state);
  mgr.setMode('vertical');
  assert.equal(state.splitMode, 'vertical');

  mgr.adjustRatio(10);
  assert.equal(state.splitRatio, 70);

  mgr.equalize();
  assert.equal(state.splitRatio, 50);

  mgr.setTab('cheatsheet');
  assert.equal(state.splitTab, 'cheatsheet');
});

