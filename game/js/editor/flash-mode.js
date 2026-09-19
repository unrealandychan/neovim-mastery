/**
 * Implements Flash.nvim 2-keystroke teleportation motions.
 */
export class FlashModeHandler {
  /**
   * @param {import('./vim-engine.js').VimEngine} engine
   * @param {import('./buffer.js').TextBuffer} buffer
   */
  constructor(engine, buffer) {
    this.engine = engine;
    this.buffer = buffer;
    this.labels = 'abcdefghijklmnopqrstuvwxyz1234567890';
  }

  /**
   * Scans buffer lines for 2-character query and generates jump targets.
   * @param {string} twoChars
   * @returns {Array<{ row: number, col: number, label: string }>}
   */
  findTargets(twoChars) {
    const targets = [];
    if (!twoChars || twoChars.length < 2) return targets;

    const lines = this.buffer.getLines();
    const query = twoChars.toLowerCase();
    let labelIndex = 0;

    for (let r = 0; r < lines.length; r++) {
      const lineLower = lines[r].toLowerCase();
      let pos = 0;
      while ((pos = lineLower.indexOf(query, pos)) !== -1) {
        if (labelIndex < this.labels.length) {
          targets.push({
            row: r,
            col: pos,
            label: this.labels[labelIndex++],
          });
        }
        pos += 2;
      }
    }
    return targets;
  }

  /**
   * Teleports cursor to selected target label.
   * @param {string} label
   * @param {Array<{ row: number, col: number, label: string }>} targets
   * @returns {boolean}
   */
  jumpToLabel(label, targets) {
    const match = targets.find(t => t.label === label);
    if (match) {
      this.buffer.setCursor(match.row, match.col);
      return true;
    }
    return false;
  }
}
