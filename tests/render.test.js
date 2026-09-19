import test from 'node:test';
import assert from 'node:assert/strict';
import { TextBuffer } from '../game/js/editor/buffer.js';
import { VimEngine } from '../game/js/editor/vim-engine.js';
import { renderBuffer, renderCmdline, highlightCode } from '../game/js/ui/renderer.js';
import { renderStatusline } from '../game/js/ui/statusline.js';

test('Renderer generates markup with hybrid line numbers and cursor', () => {
  const buf = new TextBuffer('hello\nworld');
  const engine = new VimEngine(buf);

  const mockContainer = { innerHTML: '' };
  renderBuffer(mockContainer, engine, buf);

  assert.ok(mockContainer.innerHTML.includes('buffer-line active-line'));
  assert.ok(mockContainer.innerHTML.includes('vim-cursor cursor-normal'));
  assert.ok(mockContainer.innerHTML.includes('line-num'));
});

test('Statusline renderer formats mode and position correctly', () => {
  const buf = new TextBuffer('line 1\nline 2');
  const engine = new VimEngine(buf);

  const mockStatusContainer = { innerHTML: '' };
  renderStatusline(mockStatusContainer, engine, { day: 1, title: 'Mental Model' });

  assert.ok(mockStatusContainer.innerHTML.includes('status-mode NORMAL'));
  assert.ok(mockStatusContainer.innerHTML.includes('Day 1: Mental Model'));
  assert.ok(mockStatusContainer.innerHTML.includes('1:1'));
});

test('Cmdline renderer displays active command line and feedback', () => {
  const buf = new TextBuffer('demo');
  const engine = new VimEngine(buf);

  const mockCmdContainer = { innerHTML: '', className: '' };

  // Normal mode with feedback
  renderCmdline(mockCmdContainer, engine, '1 line deleted.');
  assert.ok(mockCmdContainer.innerHTML.includes('cmd-feedback'));
  assert.ok(mockCmdContainer.innerHTML.includes('1 line deleted.'));

  // Switch to command mode
  engine.handleKey(':');
  engine.handleKey('w');
  renderCmdline(mockCmdContainer, engine, '');
  assert.ok(mockCmdContainer.innerHTML.includes('cmd-prompt'));
  assert.ok(mockCmdContainer.innerHTML.includes(':'));
  assert.ok(mockCmdContainer.innerHTML.includes('w'));
  assert.equal(mockCmdContainer.className, 'cmdline-bar active');
});

test('highlightCode handles quotes and keywords without mangling HTML', () => {
  const highlighted = highlightCode('const title = "hello world"; // greeting');
  assert.ok(highlighted.includes('class="syn-keyword"'));
  assert.ok(highlighted.includes('class="syn-string"'));
  assert.ok(highlighted.includes('class="syn-comment"'));
  // Ensure no broken nested tags like <span style=<span
  assert.ok(!highlighted.includes('<span style='));
});

