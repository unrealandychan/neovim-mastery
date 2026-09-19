/**
 * TextBuffer manages the lines of text and cursor coordinates.
 */
export class TextBuffer {
  /**
   * @param {string} initialText
   */
  constructor(initialText = '') {
    this.cursor = { row: 0, col: 0 };
    this.setText(initialText);
  }

  /**
   * @returns {string[]}
   */
  getLines() {
    return this.lines;
  }

  /**
   * @param {number} row
   * @returns {string}
   */
  getLine(row) {
    if (row < 0 || row >= this.lines.length) return '';
    return this.lines[row];
  }

  /**
   * @param {number} row
   * @param {string} text
   */
  setLine(row, text) {
    if (row >= 0 && row < this.lines.length) {
      this.lines[row] = text;
    }
  }

  /**
   * @returns {string}
   */
  getText() {
    return this.lines.join('\n');
  }

  /**
   * @param {string} text
   */
  setText(text) {
    const normalized = (text || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    this.lines = normalized.split('\n');
    if (this.lines.length === 0) {
      this.lines = [''];
    }
    this.clampCursor();
  }

  /**
   * @returns {{ row: number, col: number }}
   */
  getCursor() {
    return { ...this.cursor };
  }

  /**
   * @param {number} row
   * @param {number} col
   */
  setCursor(row, col) {
    this.cursor.row = Math.max(0, Math.min(row, this.lines.length - 1));
    this.cursor.col = Math.max(0, col);
  }

  /**
   * Bounds check cursor depending on mode.
   * In NORMAL mode, cursor cannot be on newline (max col = len - 1).
   * In INSERT mode, cursor can append to line (max col = len).
   * @param {string} [mode='NORMAL']
   */
  clampCursor(mode = 'NORMAL') {
    if (!this.lines || this.lines.length === 0) {
      this.lines = [''];
      this.cursor = { row: 0, col: 0 };
      return;
    }

    this.cursor.row = Math.max(0, Math.min(this.cursor.row, this.lines.length - 1));
    const currentLine = this.lines[this.cursor.row] ?? '';
    const maxCol = mode === 'INSERT' ? currentLine.length : Math.max(0, currentLine.length - 1);
    this.cursor.col = Math.max(0, Math.min(this.cursor.col, maxCol));
  }

  /**
   * Inserts text at the current cursor position.
   * Handles newlines cleanly.
   * @param {string} text
   */
  insertText(text) {
    const line = this.getLine(this.cursor.row);
    const before = line.slice(0, this.cursor.col);
    const after = line.slice(this.cursor.col);

    const parts = text.split('\n');
    if (parts.length === 1) {
      this.lines[this.cursor.row] = before + text + after;
      this.cursor.col += text.length;
    } else {
      this.lines[this.cursor.row] = before + parts[0];
      for (let i = 1; i < parts.length - 1; i++) {
        this.lines.splice(this.cursor.row + i, 0, parts[i]);
      }
      const lastLineIndex = this.cursor.row + parts.length - 1;
      const lastPart = parts[parts.length - 1];
      this.lines.splice(lastLineIndex, 0, lastPart + after);
      this.cursor.row = lastLineIndex;
      this.cursor.col = lastPart.length;
    }
  }

  /**
   * Deletes a character at or before the cursor.
   * @param {boolean} [backspace=false]
   * @returns {string} The deleted character
   */
  deleteChar(backspace = false) {
    const line = this.getLine(this.cursor.row);
    if (backspace) {
      if (this.cursor.col > 0) {
        const deleted = line[this.cursor.col - 1];
        this.lines[this.cursor.row] = line.slice(0, this.cursor.col - 1) + line.slice(this.cursor.col);
        this.cursor.col--;
        return deleted;
      } else if (this.cursor.row > 0) {
        // Merge with previous line
        const prevLine = this.lines[this.cursor.row - 1];
        const newCol = prevLine.length;
        this.lines[this.cursor.row - 1] = prevLine + line;
        this.lines.splice(this.cursor.row, 1);
        this.cursor.row--;
        this.cursor.col = newCol;
        return '\n';
      }
    } else {
      if (this.cursor.col < line.length) {
        const deleted = line[this.cursor.col];
        this.lines[this.cursor.row] = line.slice(0, this.cursor.col) + line.slice(this.cursor.col + 1);
        return deleted;
      } else if (this.cursor.row < this.lines.length - 1) {
        // Merge with next line
        const nextLine = this.lines[this.cursor.row + 1];
        this.lines[this.cursor.row] = line + nextLine;
        this.lines.splice(this.cursor.row + 1, 1);
        return '\n';
      }
    }
    return '';
  }

  /**
   * Replaces the character under cursor with a new character.
   * @param {string} char
   */
  replaceChar(char) {
    const line = this.getLine(this.cursor.row);
    if (line.length === 0) {
      this.lines[this.cursor.row] = char;
      this.cursor.col = 0;
      return;
    }
    this.lines[this.cursor.row] =
      line.slice(0, this.cursor.col) + char + line.slice(this.cursor.col + 1);
  }

  /**
   * Deletes text in the given range.
   * @param {{ row: number, col: number }} start
   * @param {{ row: number, col: number }} end
   * @returns {string} The deleted text
   */
  deleteRange(start, end) {
    // Normalize start and end order
    let s = { ...start };
    let e = { ...end };
    if (s.row > e.row || (s.row === e.row && s.col > e.col)) {
      const tmp = s;
      s = e;
      e = tmp;
    }

    if (s.row === e.row) {
      const line = this.getLine(s.row);
      const deleted = line.slice(s.col, e.col);
      this.lines[s.row] = line.slice(0, s.col) + line.slice(e.col);
      this.setCursor(s.row, s.col);
      return deleted;
    }

    const firstLine = this.getLine(s.row);
    const lastLine = this.getLine(e.row);
    const deletedParts = [];

    deletedParts.push(firstLine.slice(s.col));
    for (let r = s.row + 1; r < e.row; r++) {
      deletedParts.push(this.lines[r]);
    }
    deletedParts.push(lastLine.slice(0, e.col));

    this.lines[s.row] = firstLine.slice(0, s.col) + lastLine.slice(e.col);
    this.lines.splice(s.row + 1, e.row - s.row);
    this.setCursor(s.row, s.col);
    return deletedParts.join('\n');
  }

  /**
   * Inserts an entire line at specified row.
   * @param {number} row
   * @param {string} text
   */
  insertLine(row, text) {
    const targetRow = Math.max(0, Math.min(row, this.lines.length));
    this.lines.splice(targetRow, 0, text);
  }

  /**
   * Deletes an entire line at specified row.
   * @param {number} row
   * @returns {string}
   */
  deleteLine(row) {
    if (this.lines.length === 1) {
      const deleted = this.lines[0];
      this.lines[0] = '';
      this.setCursor(0, 0);
      return deleted;
    }
    const targetRow = Math.max(0, Math.min(row, this.lines.length - 1));
    const [deleted] = this.lines.splice(targetRow, 1);
    this.cursor.row = Math.min(this.cursor.row, this.lines.length - 1);
    this.clampCursor();
    return deleted;
  }

  /**
   * Creates a deep clone of this buffer.
   * @returns {TextBuffer}
   */
  clone() {
    const buf = new TextBuffer(this.getText());
    buf.setCursor(this.cursor.row, this.cursor.col);
    return buf;
  }
}
