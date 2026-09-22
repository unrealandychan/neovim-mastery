import test from 'node:test';
import assert from 'node:assert/strict';
import { STAGES } from '../game/js/stages/curriculum.js';
import { evaluateStage } from '../game/js/stages/evaluator.js';
import { TextBuffer } from '../game/js/editor/buffer.js';
import { VimEngine } from '../game/js/editor/vim-engine.js';

test('Curriculum has 60 complete days with required metadata', () => {
  assert.equal(STAGES.length, 60);
  STAGES.forEach((stage, idx) => {
    assert.equal(stage.day, idx + 1, `Stage ${idx + 1} day mismatch`);
    assert.ok(stage.title, `Day ${stage.day} missing title`);
    assert.ok(stage.week, `Day ${stage.day} missing week`);
    assert.ok(stage.concept, `Day ${stage.day} missing concept`);
    assert.ok(stage.mission, `Day ${stage.day} missing mission`);
    assert.ok(stage.initialText !== undefined, `Day ${stage.day} missing initialText`);
    assert.ok(stage.targetText !== undefined, `Day ${stage.day} missing targetText`);
    assert.ok(stage.parKeystrokes > 0, `Day ${stage.day} invalid par`);
    assert.ok(stage.hints && stage.hints.length > 0, `Day ${stage.day} missing hints`);
    assert.ok(stage.chapterRef, `Day ${stage.day} missing chapterRef`);
    assert.ok(Array.isArray(stage.optimalKeys), `Day ${stage.day} missing optimalKeys`);
  });
});

test('Stage evaluator checks text match and awards 3 stars for par', () => {
  const stage = STAGES[0]; // Day 1
  const buf = new TextBuffer(stage.initialText);
  const engine = new VimEngine(buf);
  buf.setCursor(stage.cursorStart.row, stage.cursorStart.col);

  for (const k of stage.optimalKeys) {
    engine.handleKey(k);
  }

  const result = evaluateStage(stage, engine, stage.optimalKeys);
  assert.equal(result.completed, true);
  assert.equal(result.stars, 3);
});

test('Day 1 does not complete mid-typing in INSERT mode before saving', () => {
  const stage = STAGES[0]; // Day 1
  const buf = new TextBuffer(stage.initialText);
  const engine = new VimEngine(buf);
  buf.setCursor(stage.cursorStart.row, stage.cursorStart.col);

  // Type: iWelcome Eddie (without Escape or :w)
  const typingKeys = ['i', 'W', 'e', 'l', 'c', 'o', 'm', 'e', ' ', 'E', 'd', 'd', 'i', 'e'];
  for (const k of typingKeys) {
    engine.handleKey(k);
  }

  assert.equal(engine.getMode(), 'INSERT');
  assert.equal(engine.getText(), stage.targetText);

  // Even though text matches, stage must NOT be completed in INSERT mode or without :w
  const resultMidTyping = evaluateStage(stage, engine, typingKeys);
  assert.equal(resultMidTyping.completed, false);

  // Press Escape: now in NORMAL mode, but :w not executed yet
  engine.handleKey('Escape');
  assert.equal(engine.getMode(), 'NORMAL');
  const resultEscaped = evaluateStage(stage, engine, [...typingKeys, 'Escape']);
  assert.equal(resultEscaped.completed, false);

  // Execute :w
  engine.handleKey(':');
  engine.handleKey('w');
  engine.handleKey('Enter');
  const resultSaved = evaluateStage(stage, engine, [...typingKeys, 'Escape', ':', 'w', 'Enter']);
  assert.equal(resultSaved.completed, true);
});

test('Day 12 requires both :w and :bnext actions to complete', () => {
  const stage = STAGES[11]; // Day 12
  const buf = new TextBuffer(stage.initialText);
  const engine = new VimEngine(buf);

  // Initial state should not be completed
  let res = evaluateStage(stage, engine, []);
  assert.equal(res.completed, false);

  // Only saving :w is not enough
  engine.handleKey(':');
  engine.handleKey('w');
  engine.handleKey('Enter');
  res = evaluateStage(stage, engine, [':', 'w', 'Enter']);
  assert.equal(res.completed, false);

  // Now run :bnext
  engine.handleKey(':');
  engine.handleKey('b');
  engine.handleKey('n');
  engine.handleKey('e');
  engine.handleKey('x');
  engine.handleKey('t');
  engine.handleKey('Enter');
  res = evaluateStage(stage, engine, stage.optimalKeys);
  assert.equal(res.completed, true);
});

