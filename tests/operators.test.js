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

test('Operator + text object: di( wipes parameters', () => {
  const buf = new TextBuffer('function calculate(a: number, b: number) {');
  const engine = new VimEngine(buf);
  buf.setCursor(0, 22); // inside ( ... )

  engine.handleKey('d');
  engine.handleKey('i');
  engine.handleKey('(');
  assert.equal(buf.getText(), 'function calculate() {');
  assert.equal(engine.getMode(), 'NORMAL');
});

test('Undo and dot repeat on line deletions', () => {
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

test('Yank and Paste registers', () => {
  const buf = new TextBuffer('first line\nsecond line');
  const engine = new VimEngine(buf);
  // yy copies current line
  engine.handleKey('y');
  engine.handleKey('y');
  // move to next line and paste
  engine.handleKey('j');
  engine.handleKey('p');
  assert.equal(buf.getText(), 'first line\nsecond line\nfirst line');
});

test('Visual block indentation > and <', () => {
  const buf = new TextBuffer('line 1\nline 2');
  const engine = new VimEngine(buf);
  engine.handleKey('V'); // visual line
  engine.handleKey('j'); // select both lines
  engine.handleKey('>'); // indent
  assert.equal(buf.getText(), '  line 1\n  line 2');
});

test('Linewise operator motions dj and dk', () => {
  const buf = new TextBuffer('line 1\nline 2\nline 3\nline 4');
  const engine = new VimEngine(buf);
  buf.setCursor(1, 0); // on line 2

  // dj deletes line 2 and line 3
  engine.handleKey('d');
  engine.handleKey('j');
  assert.equal(buf.getText(), 'line 1\nline 4');

  // Undo
  engine.handleKey('u');
  assert.equal(buf.getText(), 'line 1\nline 2\nline 3\nline 4');

  // dk on line 2 deletes line 1 and line 2
  buf.setCursor(1, 0);
  engine.handleKey('d');
  engine.handleKey('k');
  assert.equal(buf.getText(), 'line 3\nline 4');
});

test('Invalid operator sequence does not deadlock keyboard', () => {
  const buf = new TextBuffer('alpha beta');
  const engine = new VimEngine(buf);
  buf.setCursor(0, 0);

  // Press 'd' followed by unrecognized 'z'
  engine.handleKey('d');
  const res = engine.handleKey('z');
  assert.equal(res.handled, false);
  assert.equal(engine.activeOperator, null);

  // Subsequent motions work normally without requiring Escape
  engine.handleKey('w');
  assert.equal(buf.getCursor().col, 6); // jumped to 'beta'
});

test('Redo <C-r> and Save <C-s>', () => {
  const buf = new TextBuffer('start');
  const engine = new VimEngine(buf);

  engine.handleKey('d');
  engine.handleKey('d');
  assert.equal(buf.getText(), '');

  engine.handleKey('u');
  assert.equal(buf.getText(), 'start');

  engine.handleKey('<C-r>');
  assert.equal(buf.getText(), '');

  const saveRes = engine.handleKey('<C-s>');
  assert.equal(saveRes.handled, true);
  assert.equal(engine.actionsExecuted.has('save'), true);
});

