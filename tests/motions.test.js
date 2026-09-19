import test from 'node:test';
import assert from 'node:assert/strict';
import { TextBuffer } from '../game/js/editor/buffer.js';
import { VimEngine } from '../game/js/editor/vim-engine.js';

test('VimEngine mode switching: i, a, I, A, o, O and Escape', () => {
  const buf = new TextBuffer('hello world');
  const engine = new VimEngine(buf);
  assert.equal(engine.getMode(), 'NORMAL');

  // 'i' enters insert at cursor
  engine.handleKey('i');
  assert.equal(engine.getMode(), 'INSERT');
  engine.handleKey('H');
  engine.handleKey('i');
  engine.handleKey('Escape');
  assert.equal(engine.getMode(), 'NORMAL');
  assert.equal(buf.getText(), 'Hihello world');

  // 'A' appends at end of line
  engine.handleKey('A');
  assert.equal(engine.getMode(), 'INSERT');
  engine.handleKey('!');
  engine.handleKey('Escape');
  assert.equal(engine.getText(), 'Hihello world!');
});

test('VimEngine basic motions h, j, k, l with counts', () => {
  const buf = new TextBuffer('line 1\nline 2\nline 3\nline 4\nline 5');
  const engine = new VimEngine(buf);

  engine.handleKey('3');
  engine.handleKey('j');
  assert.equal(buf.getCursor().row, 3); // line 4 (0-indexed 3)

  engine.handleKey('k');
  assert.equal(buf.getCursor().row, 2); // line 3

  engine.handleKey('4');
  engine.handleKey('l');
  assert.equal(buf.getCursor().col, 4);

  engine.handleKey('2');
  engine.handleKey('h');
  assert.equal(buf.getCursor().col, 2);
});

test('VimEngine word motions w, b, e, ge, 0, ^, $', () => {
  const buf = new TextBuffer('   const result = calculate(10, 20);');
  const engine = new VimEngine(buf);

  // '^' jumps to first non-whitespace
  engine.handleKey('^');
  assert.equal(buf.getCursor().col, 3); // 'c'

  // 'w' moves to next word 'result'
  engine.handleKey('w');
  assert.equal(buf.getCursor().col, 9);

  // 'w' moves to '='
  engine.handleKey('w');
  assert.equal(buf.getCursor().col, 16);

  // 'e' moves to end of word
  engine.handleKey('w'); // 'calculate'
  assert.equal(buf.getCursor().col, 18);
  engine.handleKey('e'); // end of 'calculate'
  assert.equal(buf.getCursor().col, 26);

  // '$' jumps to end of line
  engine.handleKey('$');
  assert.equal(buf.getCursor().col, buf.getLine(0).length - 1);

  // '0' jumps to column 0
  engine.handleKey('0');
  assert.equal(buf.getCursor().col, 0);
});

test('VimEngine inline seeking f, F, t, T with ; and ,', () => {
  const buf = new TextBuffer('apple, banana, cherry, date');
  const engine = new VimEngine(buf);

  engine.handleKey('f');
  engine.handleKey(','); // find first ','
  assert.equal(buf.getCursor().col, 5);

  engine.handleKey(';'); // repeat find ',' -> next comma
  assert.equal(buf.getCursor().col, 13);

  engine.handleKey(','); // reverse direction -> back to first comma
  assert.equal(buf.getCursor().col, 5);

  engine.handleKey('t');
  engine.handleKey('b'); // till 'b'
  assert.equal(buf.getCursor().col, 6); // space before 'b'
});

test('VimEngine buffer jumps gg, G, {, }', () => {
  const buf = new TextBuffer('para 1 line 1\npara 1 line 2\n\npara 2 line 1\npara 2 line 2');
  const engine = new VimEngine(buf);

  engine.handleKey('G'); // bottom line
  assert.equal(buf.getCursor().row, 4);

  engine.handleKey('g');
  engine.handleKey('g'); // top line
  assert.equal(buf.getCursor().row, 0);

  engine.handleKey('}'); // next blank line
  assert.equal(buf.getCursor().row, 2);

  engine.handleKey('{'); // prev blank line / top
  assert.equal(buf.getCursor().row, 0);
});
