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

  const completed = textMatches && cursorMatches;
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
