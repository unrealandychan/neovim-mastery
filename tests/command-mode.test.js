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

test('Flash.nvim 2-keystroke teleportation (s)', () => {
  const buf = new TextBuffer('function processData() {\n  return sanitizePayload();\n}');
  const engine = new VimEngine(buf);

  // Press 's' to activate flash mode
  engine.handleKey('s');
  assert.equal(engine.getMode(), 'FLASH');

  // Type search target "sa" (matches "sanitizePayload")
  engine.handleKey('s');
  engine.handleKey('a');

  // Flash targets should be generated
  assert.ok(engine.flashTargets.length > 0);
  const targetLabel = engine.flashTargets[0].label;

  // Pressing target label teleports cursor directly to "sanitizePayload"
  engine.handleKey(targetLabel);
  assert.equal(engine.getMode(), 'NORMAL');
  assert.equal(buf.getCursor().row, 1);
  assert.equal(buf.getCursor().col, 9);
});
