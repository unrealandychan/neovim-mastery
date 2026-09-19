import test from 'node:test';
import assert from 'node:assert/strict';
import { computeTextDiff } from '../game/js/ui/diff-viewer.js';

test('computeTextDiff identifies matches and differences', () => {
  const current = 'const a = 1;\nconst b = 2;';
  const target = 'const a = 1;\nconst b = 3;';

  const diff = computeTextDiff(current, target);
  assert.equal(diff.matches, false);
  assert.equal(diff.lines.length, 2);
  assert.equal(diff.lines[0].type, 'match');
  assert.equal(diff.lines[1].type, 'diff');
  assert.equal(diff.lines[1].current, 'const b = 2;');
  assert.equal(diff.lines[1].target, 'const b = 3;');
});

test('computeTextDiff detects exact match', () => {
  const current = 'hello world';
  const target = 'hello world';

  const diff = computeTextDiff(current, target);
  assert.equal(diff.matches, true);
  assert.equal(diff.lines[0].type, 'match');
});
