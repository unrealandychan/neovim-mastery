import test from 'node:test';
import assert from 'node:assert/strict';
import { TextBuffer } from '../game/js/editor/buffer.js';
import { VimEngine } from '../game/js/editor/vim-engine.js';
import { renderBuffer } from '../game/js/ui/renderer.js';
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
