/**
 * Evaluates whether a stage's goal condition has been met.
 * @param {object} stage
 * @param {import('../editor/vim-engine.js').VimEngine} engine
 * @param {string[]} keystrokes
 * @returns {{ completed: boolean, stars: number, feedback: string, strokes: number, par: number }}
 */
export function evaluateStage(stage, engine, keystrokes = []) {
  const currentText = engine.getText().trimEnd();
  const targetText = stage.targetText.trimEnd();

  const textMatches = currentText === targetText;
  let cursorMatches = true;

  if (stage.targetCursor) {
    const cur = engine.buffer.getCursor();
    cursorMatches =
      cur.row === stage.targetCursor.row &&
      (stage.targetCursor.col === undefined || cur.col === stage.targetCursor.col);
  }

  // Stages must be completed in NORMAL mode (or stage.targetMode) so typing in INSERT mode doesn't prematurely trigger victory
  const targetMode = stage.targetMode || 'NORMAL';
  const modeMatches = engine.getMode() === targetMode;

  // Stages with required commands/actions (e.g., :w save, :bnext)
  let actionMatches = true;
  if (stage.requiredAction) {
    actionMatches = engine.actionsExecuted ? engine.actionsExecuted.has(stage.requiredAction) : true;
  }

  const completed = textMatches && cursorMatches && modeMatches && actionMatches;
  const strokes = keystrokes.length;
  const par = stage.parKeystrokes || 10;

  let stars = 0;
  let feedback = 'Target not reached yet.';

  if (completed) {
    if (strokes <= par) {
      stars = 3;
      feedback = `🌟🌟🌟 Flawless! Completed in ${strokes} strokes (Par: ${par})!`;
    } else if (strokes <= par + 4) {
      stars = 2;
      feedback = `🌟🌟 Great job! Completed in ${strokes} strokes (Par: ${par}).`;
    } else {
      stars = 1;
      feedback = `🌟 Cleared! Completed in ${strokes} strokes. Try to reach Par (${par})!`;
    }
  } else if (textMatches && !modeMatches) {
    feedback = `Text matches! Press <Esc> to return to ${targetMode} mode.`;
  } else if (textMatches && modeMatches && !actionMatches && stage.requiredAction) {
    if (stage.requiredAction === 'save') {
      feedback = 'Text matches! Now type ":w" and press Enter to save.';
    } else {
      feedback = `Text matches! Perform required action: :${stage.requiredAction}`;
    }
  } else if (textMatches && modeMatches && actionMatches && !cursorMatches && stage.targetCursor) {
    feedback = `Text matches! Move cursor to line ${stage.targetCursor.row + 1}, col ${stage.targetCursor.col + 1}.`;
  }

  return {
    completed,
    stars,
    feedback,
    strokes,
    par,
    currentText,
    targetText,
  };
}
