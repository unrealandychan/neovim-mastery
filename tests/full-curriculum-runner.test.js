import test from 'node:test';
import assert from 'node:assert/strict';
import { STAGES } from '../game/js/stages/curriculum.js';
import { evaluateStage } from '../game/js/stages/evaluator.js';
import { TextBuffer } from '../game/js/editor/buffer.js';
import { VimEngine } from '../game/js/editor/vim-engine.js';

test('Full 30-Day Curriculum Simulation: All stages completed with 3 Stars', () => {
  assert.equal(STAGES.length, 30);

  STAGES.forEach(stage => {
    const buf = new TextBuffer(stage.initialText);
    const engine = new VimEngine(buf);

    if (stage.setup) {
      stage.setup(engine);
    } else if (stage.cursorStart) {
      buf.setCursor(stage.cursorStart.row, stage.cursorStart.col);
    }

    // Execute optimal keystroke sequence
    for (const key of stage.optimalKeys) {
      engine.handleKey(key);
    }

    const result = evaluateStage(stage, engine, stage.optimalKeys);

    assert.equal(
      result.completed,
      true,
      `Day ${stage.day} (${stage.title}) failed to complete.\nExpected:\n"${result.targetText}"\nActual:\n"${result.currentText}"`
    );

    assert.equal(
      result.stars,
      3,
      `Day ${stage.day} (${stage.title}) received ${result.stars} stars instead of 3. Strokes: ${result.strokes}, Par: ${result.par}`
    );
  });
});
