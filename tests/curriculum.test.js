import test from 'node:test';
import assert from 'node:assert/strict';
import { STAGES } from '../game/js/stages/curriculum.js';
import { evaluateStage } from '../game/js/stages/evaluator.js';
import { TextBuffer } from '../game/js/editor/buffer.js';
import { VimEngine } from '../game/js/editor/vim-engine.js';

test('Curriculum has 30 complete days with required metadata', () => {
  assert.equal(STAGES.length, 30);
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
