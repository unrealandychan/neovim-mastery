import { findTextObjectRange } from './text-objects.js';

export class OperatorHandler {
  /**
   * @param {import('./vim-engine.js').VimEngine} engine
   * @param {import('./buffer.js').TextBuffer} buffer
   */
  constructor(engine, buffer) {
    this.engine = engine;
    this.buffer = buffer;
  }

  /**
   * Executes linewise operation: dd, cc, yy, >>, <<
   */
  executeLineOp(op, count = 1) {
    this.engine.saveSnapshot();
    const cur = this.buffer.getCursor();

    if (op === 'd') {
      const lines = [];
      for (let i = 0; i < count; i++) {
        if (cur.row < this.buffer.getLines().length) {
          lines.push(this.buffer.deleteLine(cur.row));
        }
      }
      this.engine.registers[this.engine.activeRegister] = {
        text: lines.join('\n') + '\n',
        linewise: true,
      };
      this.engine.lastChange = () => this.executeLineOp('d', count);
      this.buffer.clampCursor('NORMAL');
      return;
    }

    if (op === 'c') {
      const lines = [];
      for (let i = 0; i < count; i++) {
        if (cur.row < this.buffer.getLines().length) {
          lines.push(this.buffer.deleteLine(cur.row));
        }
      }
      this.engine.registers[this.engine.activeRegister] = {
        text: lines.join('\n') + '\n',
        linewise: true,
      };
      this.buffer.insertLine(cur.row, '');
      this.buffer.setCursor(cur.row, 0);
      this.engine.setMode('INSERT');
      return;
    }

    if (op === 'y') {
      const lines = [];
      for (let i = 0; i < count; i++) {
        const targetRow = cur.row + i;
        if (targetRow < this.buffer.getLines().length) {
          lines.push(this.buffer.getLine(targetRow));
        }
      }
      this.engine.registers[this.engine.activeRegister] = {
        text: lines.join('\n') + '\n',
        linewise: true,
      };
      return;
    }

    if (op === '>') {
      for (let i = 0; i < count; i++) {
        const targetRow = cur.row + i;
        if (targetRow < this.buffer.getLines().length) {
          this.buffer.setLine(targetRow, '  ' + this.buffer.getLine(targetRow));
        }
      }
      return;
    }

    if (op === '<') {
      for (let i = 0; i < count; i++) {
        const targetRow = cur.row + i;
        if (targetRow < this.buffer.getLines().length) {
          const l = this.buffer.getLine(targetRow);
          this.buffer.setLine(targetRow, l.startsWith('  ') ? l.slice(2) : l.replace(/^\s/, ''));
        }
      }
      return;
    }
  }

  /**
   * Executes operator with text object
   */
  executeTextObjectOp(op, isInner, type) {
    const cur = this.buffer.getCursor();
    const range = findTextObjectRange(this.buffer, cur, isInner, type);
    if (!range) return false;

    this.engine.saveSnapshot();

    if (op === 'y') {
      const text = this.buffer.getLine(range.start.row).slice(range.start.col, range.end.col);
      this.engine.registers[this.engine.activeRegister] = { text, linewise: false };
      return true;
    }

    const deleted = this.buffer.deleteRange(range.start, range.end);
    this.engine.registers[this.engine.activeRegister] = { text: deleted, linewise: false };

    if (op === 'c') {
      this.buffer.setCursor(range.start.row, range.start.col);
      this.engine.setMode('INSERT');
    } else {
      this.buffer.clampCursor('NORMAL');
    }

    this.engine.lastChange = () => this.executeTextObjectOp(op, isInner, type);
    return true;
  }

  /**
   * Indents visual selection
   */
  indentVisual(directionRight = true) {
    this.engine.saveSnapshot();
    const cur = this.buffer.getCursor();
    const start = this.engine.visualStart || cur;
    const minRow = Math.min(start.row, cur.row);
    const maxRow = Math.max(start.row, cur.row);

    for (let r = minRow; r <= maxRow; r++) {
      const l = this.buffer.getLine(r);
      if (directionRight) {
        this.buffer.setLine(r, '  ' + l);
      } else {
        this.buffer.setLine(r, l.startsWith('  ') ? l.slice(2) : l.replace(/^\s/, ''));
      }
    }
    this.engine.visualStart = null;
    this.engine.setMode('NORMAL');
  }
}
