import test from 'node:test';
import assert from 'node:assert/strict';
import { TextBuffer } from '../game/js/editor/buffer.js';
import { VimEngine } from '../game/js/editor/vim-engine.js';

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
