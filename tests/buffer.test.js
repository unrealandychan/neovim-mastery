import test from 'node:test';
import assert from 'node:assert/strict';
import { TextBuffer } from '../game/js/editor/buffer.js';

test('TextBuffer initialization and cursor boundary clamping', () => {
  const buf = new TextBuffer('hello\nworld');
  assert.equal(buf.getLines().length, 2);
  assert.equal(buf.getLine(0), 'hello');
  buf.setCursor(0, 10);
  buf.clampCursor('NORMAL');
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

test('TextBuffer insert and delete text at cursor', () => {
  const buf = new TextBuffer('const x = 10;');
  buf.setCursor(0, 6);
  buf.insertText('myVar');
  assert.equal(buf.getText(), 'const myVarx = 10;');
  assert.equal(buf.getCursor().col, 11);

  // Backspace at cursor
  buf.deleteChar(true);
  assert.equal(buf.getText(), 'const myVax = 10;');
});

test('TextBuffer range deletion', () => {
  const buf = new TextBuffer('function test() {\n  return 42;\n}');
  // Delete "  return 42;\n"
  buf.deleteRange({ row: 1, col: 0 }, { row: 1, col: 12 });
  assert.equal(buf.getText(), 'function test() {\n\n}');
});

test('TextBuffer clone produces independent deep copy', () => {
  const buf1 = new TextBuffer('hello\nworld');
  buf1.setCursor(1, 2);
  const buf2 = buf1.clone();
  buf2.setLine(0, 'changed');
  assert.equal(buf1.getLine(0), 'hello');
  assert.equal(buf2.getLine(0), 'changed');
  assert.deepEqual(buf2.getCursor(), { row: 1, col: 2 });
});
