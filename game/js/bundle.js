/**
 * Neovim Mastery: The 30-Day Dojo - Standalone Offline Bundle
 * Generated automatically. Works seamlessly on both http:// and file:// protocols.
 */
(function() {
  'use strict';
  const modules = {};
  const cache = {};

  function defineModule(name, fn) {
    modules[name] = fn;
  }

  function requireModule(currentPath, relativePath) {
    let resolved = relativePath;
    if (relativePath.startsWith('.')) {
      const dir = pathDirname(currentPath);
      resolved = normalizePath(dir ? dir + '/' + relativePath : relativePath);
    }
    if (!resolved.endsWith('.js')) {
      resolved += '.js';
    }

    if (cache[resolved]) {
      return cache[resolved].exports;
    }
    if (!modules[resolved]) {
      throw new Error('Cannot find module "' + relativePath + '" from "' + currentPath + '" (resolved: "' + resolved + '")');
    }

    const mod = { exports: {} };
    cache[resolved] = mod;
    modules[resolved](mod.exports, function(dep) {
      return requireModule(resolved, dep);
    }, mod);
    return mod.exports;
  }

  function pathDirname(p) {
    const idx = p.lastIndexOf('/');
    return idx === -1 ? '' : p.slice(0, idx);
  }

  function normalizePath(p) {
    const parts = p.split('/');
    const res = [];
    for (const part of parts) {
      if (!part || part === '.') continue;
      if (part === '..') {
        res.pop();
      } else {
        res.push(part);
      }
    }
    return res.join('/');
  }

/* Module: editor/key-parser.js */
defineModule('editor/key-parser.js', function(exports, require, module) {
/**
 * Normalizes input key strings across browser KeyboardEvent and test runners.
 * @param {string} key
 * @returns {string}
 */
function normalizeKey(key) {
  if (key === 'Escape' || key === '<Esc>' || key === '<esc>') return 'Escape';
  if (key === 'Enter' || key === '<CR>' || key === '<cr>' || key === '\n') return 'Enter';
  if (key === 'Backspace' || key === '<BS>' || key === '<bs>') return 'Backspace';
  if (key === 'Tab' || key === '<Tab>') return 'Tab';
  if (key === '<Space>' || key === ' ') return ' ';
  if (key === '<leader>' || key === '<Leader>') return ' ';
  if (/^<c-r>$/i.test(key)) return '<C-r>';
  if (/^<c-s>$/i.test(key)) return '<C-s>';
  if (/^<c-d>$/i.test(key)) return '<C-d>';
  if (/^<c-u>$/i.test(key)) return '<C-u>';
  return key;
}

/**
 * Helper to classify word characters vs symbols vs whitespace.
 * @param {string} char
 * @returns {'word' | 'punct' | 'space'}
 */
function getCharType(char) {
  if (!char || /\s/.test(char)) return 'space';
  if (/[a-zA-Z0-9_]/.test(char)) return 'word';
  return 'punct';
}

  try { exports.normalizeKey = normalizeKey; } catch(e) {}
  try { exports.getCharType = getCharType; } catch(e) {}
});

/* Module: editor/text-objects.js */
defineModule('editor/text-objects.js', function(exports, require, module) {
/**
 * Text object locator for Vim grammar.
 * Finds range { start: {row, col}, end: {row, col} } for given object type.
 */
function findTextObjectRange(buffer, cursor, isInner, type) {
  const line = buffer.getLine(cursor.row);
  const row = cursor.row;

  // 1. Quotes: ", ', `
  if (['"', "'", '`'].includes(type)) {
    const q = type;
    let openCol = -1;
    let closeCol = -1;

    // Search backwards for opening quote
    for (let c = cursor.col; c >= 0; c--) {
      if (line[c] === q) {
        openCol = c;
        break;
      }
    }
    // Search forwards for closing quote
    if (openCol !== -1) {
      closeCol = line.indexOf(q, openCol + 1);
    }
    // If cursor was before the first quote on line, find the next pair on this line
    if (openCol === -1 || closeCol === -1) {
      openCol = line.indexOf(q);
      if (openCol !== -1) {
        closeCol = line.indexOf(q, openCol + 1);
      }
    }

    if (openCol !== -1 && closeCol !== -1) {
      if (isInner) {
        return {
          start: { row, col: openCol + 1 },
          end: { row, col: closeCol },
        };
      } else {
        return {
          start: { row, col: openCol },
          end: { row, col: closeCol + 1 },
        };
      }
    }
    return null;
  }

  // 2. Pairs: (), [], {}, <>
  const pairMap = {
    '(': { open: '(', close: ')' },
    ')': { open: '(', close: ')' },
    'b': { open: '(', close: ')' },
    '[': { open: '[', close: ']' },
    ']': { open: '[', close: ']' },
    '{': { open: '{', close: '}' },
    '}': { open: '{', close: '}' },
    'B': { open: '{', close: '}' },
    '<': { open: '<', close: '>' },
    '>': { open: '<', close: '>' },
  };

  if (pairMap[type]) {
    const { open, close } = pairMap[type];
    const lines = buffer.getLines();
    let depth = 0;
    let openPos = null;
    let closePos = null;

    // Scan backwards from cursor on current line for open
    for (let c = cursor.col; c >= 0; c--) {
      if (line[c] === close) depth++;
      else if (line[c] === open) {
        if (depth === 0) {
          openPos = { row, col: c };
          break;
        }
        depth--;
      }
    }
    // If not found, scan backwards on previous lines
    if (!openPos) {
      for (let r = row - 1; r >= 0; r--) {
        const prevL = lines[r];
        for (let c = prevL.length - 1; c >= 0; c--) {
          if (prevL[c] === close) depth++;
          else if (prevL[c] === open) {
            if (depth === 0) {
              openPos = { row: r, col: c };
              break;
            }
            depth--;
          }
        }
        if (openPos) break;
      }
    }
    // If still not found, search forward on current line
    if (!openPos) {
      const idx = line.indexOf(open, cursor.col);
      if (idx !== -1) {
        openPos = { row, col: idx };
      }
    }

    if (openPos) {
      depth = 0;
      for (let r = openPos.row; r < lines.length; r++) {
        const l = lines[r];
        const startC = r === openPos.row ? openPos.col : 0;
        for (let c = startC; c < l.length; c++) {
          if (l[c] === open) depth++;
          else if (l[c] === close) {
            depth--;
            if (depth === 0) {
              closePos = { row: r, col: c };
              break;
            }
          }
        }
        if (closePos) break;
      }
    }

    if (openPos && closePos) {
      if (isInner) {
        if (openPos.row === closePos.row) {
          return {
            start: { row: openPos.row, col: openPos.col + 1 },
            end: { row: closePos.row, col: closePos.col },
          };
        } else {
          return {
            start: { row: openPos.row, col: openPos.col + 1 },
            end: { row: closePos.row, col: 0 },
          };
        }
      } else {
        return {
          start: { row: openPos.row, col: openPos.col },
          end: { row: closePos.row, col: closePos.col + 1 },
        };
      }
    }
    return null;
  }

  // 3. Words: iw, aw
  if (type === 'w') {
    let startCol = cursor.col;
    let endCol = cursor.col;
    while (startCol > 0 && /\w/.test(line[startCol - 1])) startCol--;
    while (endCol < line.length && /\w/.test(line[endCol])) endCol++;
    if (!isInner) {
      while (endCol < line.length && /\s/.test(line[endCol])) endCol++;
    }
    return {
      start: { row, col: startCol },
      end: { row, col: endCol },
    };
  }

  // 4. Arguments: ia, aa (comma-separated parameter)
  if (type === 'a') {
    // Look within enclosing parens for commas
    const parenRange = findTextObjectRange(buffer, cursor, true, '(');
    if (parenRange) {
      const innerStr = line.slice(parenRange.start.col, parenRange.end.col);
      const relCol = cursor.col - parenRange.start.col;
      const args = innerStr.split(',');
      let acc = 0;
      for (const arg of args) {
        const start = acc;
        const end = acc + arg.length;
        if (relCol >= start && relCol <= end + 1) {
          const matchStart = parenRange.start.col + start + (isInner ? arg.search(/\S/) : 0);
          const matchEnd = isInner
            ? parenRange.start.col + start + arg.trimEnd().length
            : parenRange.start.col + end + 1;
          return {
            start: { row, col: Math.max(parenRange.start.col, matchStart) },
            end: { row, col: Math.min(parenRange.end.col, matchEnd) },
          };
        }
        acc += arg.length + 1; // +1 for comma
      }
    }
  }

  // 5. Paragraph: ip, ap
  if (type === 'p') {
    const lines = buffer.getLines();
    let startRow = row;
    let endRow = row;
    while (startRow > 0 && lines[startRow - 1].trim() !== '') startRow--;
    while (endRow < lines.length - 1 && lines[endRow + 1].trim() !== '') endRow++;
    if (!isInner && endRow < lines.length - 1) endRow++;
    return {
      start: { row: startRow, col: 0 },
      end: { row: endRow, col: lines[endRow].length },
    };
  }

  return null;
}

  try { exports.findTextObjectRange = findTextObjectRange; } catch(e) {}
});

/* Module: editor/operators.js */
defineModule('editor/operators.js', function(exports, require, module) {
const { findTextObjectRange } = require('./text-objects.js');

class OperatorHandler {
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

  try { exports.OperatorHandler = OperatorHandler; } catch(e) {}
});

/* Module: editor/command-mode.js */
defineModule('editor/command-mode.js', function(exports, require, module) {
/**
 * Handles Vim command-line mode execution (":", "/")
 */
class CommandModeHandler {
  /**
   * @param {import('./vim-engine.js').VimEngine} engine
   * @param {import('./buffer.js').TextBuffer} buffer
   */
  constructor(engine, buffer) {
    this.engine = engine;
    this.buffer = buffer;
  }

  /**
   * Evaluates a command string
   * @param {string} cmd
   * @returns {{ handled: boolean, feedback: string, action?: string }}
   */
  execute(cmd) {
    const trimmed = cmd.trim();

    // In-buffer search: /pattern or ?pattern
    if (trimmed.startsWith('/') || trimmed.startsWith('?')) {
      const query = trimmed.slice(1);
      this.engine.searchQuery = query;
      this.engine.executeSearch(query);
      return {
        handled: true,
        feedback: `/${query} (${this.engine.searchMatches.length} matches)`,
        action: 'search',
      };
    }

    // Save commands
    if (/^:w(rite)?(!)?$/.test(trimmed)) {
      return { handled: true, feedback: 'Saved buffer to disk.', action: 'save' };
    }

    // Quit commands
    if (/^:q(uit)?(!)?$/.test(trimmed)) {
      return { handled: true, feedback: 'Quit requested.', action: 'quit' };
    }

    // Save and quit
    if (/^:(wq|x)(!)?$/.test(trimmed)) {
      return { handled: true, feedback: 'Saved and quit.', action: 'save_quit' };
    }

    // Clear search highlight
    if (trimmed === ':noh' || trimmed === ':nohlsearch') {
      this.engine.searchMatches = [];
      return { handled: true, feedback: 'Search highlights cleared.' };
    }

    // Buffer commands
    if (trimmed === ':bn' || trimmed === ':bnext') {
      return { handled: true, feedback: 'Switched to next buffer.', action: 'bnext' };
    }
    if (trimmed === ':bp' || trimmed === ':bprevious') {
      return { handled: true, feedback: 'Switched to previous buffer.', action: 'bprev' };
    }
    if (trimmed === ':bd' || trimmed === ':bdelete') {
      return { handled: true, feedback: 'Buffer closed.', action: 'bdelete' };
    }

    // Window split commands
    if (trimmed === ':sp' || trimmed === ':split') {
      return { handled: true, feedback: 'Horizontal split created.', action: 'split' };
    }
    if (trimmed === ':vs' || trimmed === ':vsplit') {
      return { handled: true, feedback: 'Vertical split created.', action: 'vsplit' };
    }

    // Global substitution: :%s/old/new/g
    const globalSub = trimmed.match(/^:%s\/(.*?)\/(.*?)\/?([gI]*)$/);
    if (globalSub) {
      this.engine.saveSnapshot();
      const [, pattern, replacement, flags] = globalSub;
      try {
        const regex = new RegExp(pattern, flags.includes('g') ? 'g' : '');
        const newText = this.buffer.getText().replace(regex, replacement);
        this.buffer.setText(newText);
        return {
          handled: true,
          feedback: `Replaced "${pattern}" with "${replacement}"`,
          action: 'substitute',
        };
      } catch (e) {
        return { handled: false, feedback: `Invalid regex: ${e.message}` };
      }
    }

    // Line substitution: :s/old/new/g
    const lineSub = trimmed.match(/^:s\/(.*?)\/(.*?)\/?([gI]*)$/);
    if (lineSub) {
      this.engine.saveSnapshot();
      const [, pattern, replacement, flags] = lineSub;
      const cur = this.buffer.getCursor();
      const line = this.buffer.getLine(cur.row);
      try {
        const regex = new RegExp(pattern, flags.includes('g') ? 'g' : '');
        this.buffer.setLine(cur.row, line.replace(regex, replacement));
        return {
          handled: true,
          feedback: `Line replaced "${pattern}"`,
          action: 'substitute',
        };
      } catch (e) {
        return { handled: false, feedback: `Invalid regex: ${e.message}` };
      }
    }

    return { handled: false, feedback: `E492: Not an editor command: ${cmd}` };
  }
}

  try { exports.CommandModeHandler = CommandModeHandler; } catch(e) {}
});

/* Module: editor/flash-mode.js */
defineModule('editor/flash-mode.js', function(exports, require, module) {
/**
 * Implements Flash.nvim 2-keystroke teleportation motions.
 */
class FlashModeHandler {
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

  try { exports.FlashModeHandler = FlashModeHandler; } catch(e) {}
});

/* Module: editor/buffer.js */
defineModule('editor/buffer.js', function(exports, require, module) {
/**
 * TextBuffer manages the lines of text and cursor coordinates.
 */
class TextBuffer {
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

  try { exports.TextBuffer = TextBuffer; } catch(e) {}
});

/* Module: editor/vim-engine.js */
defineModule('editor/vim-engine.js', function(exports, require, module) {
const { normalizeKey, getCharType } = require('./key-parser.js');
const { OperatorHandler } = require('./operators.js');
const { CommandModeHandler } = require('./command-mode.js');
const { FlashModeHandler } = require('./flash-mode.js');

class VimEngine {
  /**
   * @param {import('./buffer.js').TextBuffer} buffer
   */
  constructor(buffer) {
    this.buffer = buffer;
    this.operatorHandler = new OperatorHandler(this, buffer);
    this.commandHandler = new CommandModeHandler(this, buffer);
    this.flashHandler = new FlashModeHandler(this, buffer);
    this.mode = 'NORMAL';
    this.pendingKeys = '';
    this.countPrefix = '';
    this.activeOperator = null; // 'd' | 'c' | 'y'
    this.activeRegister = '"';
    this.visualStart = null;
    this.lastSeek = null; // { type: 'f'|'F'|'t'|'T', char: string }
    this.registers = { '"': { text: '', linewise: false } };
    this.commandLine = '';
    this.searchQuery = '';
    this.searchMatches = [];
    this.searchMatchIndex = -1;
    this.undoStack = [];
    this.redoStack = [];
    this.lastChange = null;
    this.flashTargets = []; // for flash teleportation
    this.actionsExecuted = new Set(); // tracks executed actions like 'save', 'bnext'
    this.onStateChange = null;
  }

  getMode() {
    return this.mode;
  }

  setMode(newMode) {
    this.mode = newMode;
    this.buffer.clampCursor(newMode);
    if (this.onStateChange) this.onStateChange();
  }

  getText() {
    return this.buffer.getText();
  }

  getPendingKeys() {
    return this.pendingKeys;
  }

  getRegister(name = '"') {
    return this.registers[name]?.text || '';
  }

  saveSnapshot() {
    this.undoStack.push({
      text: this.buffer.getText(),
      cursor: this.buffer.getCursor(),
      mode: this.mode,
    });
    this.redoStack = [];
    if (this.undoStack.length > 50) {
      this.undoStack.shift();
    }
  }

  undo() {
    if (this.undoStack.length === 0) return false;
    this.redoStack.push({
      text: this.buffer.getText(),
      cursor: this.buffer.getCursor(),
      mode: this.mode,
    });
    const snap = this.undoStack.pop();
    this.buffer.setText(snap.text);
    this.buffer.setCursor(snap.cursor.row, snap.cursor.col);
    this.setMode('NORMAL');
    return true;
  }

  redo() {
    if (this.redoStack.length === 0) return false;
    this.undoStack.push({
      text: this.buffer.getText(),
      cursor: this.buffer.getCursor(),
      mode: this.mode,
    });
    const snap = this.redoStack.pop();
    this.buffer.setText(snap.text);
    this.buffer.setCursor(snap.cursor.row, snap.cursor.col);
    this.setMode('NORMAL');
    return true;
  }

  /**
   * Main input router
   * @param {string} rawKey
   * @returns {{ handled: boolean, feedback?: string }}
   */
  handleKey(rawKey) {
    const key = normalizeKey(rawKey);

    if (this.mode === 'INSERT') {
      return this.handleInsertKey(key);
    }
    if (this.mode === 'COMMAND') {
      return this.handleCommandKey(key);
    }
    if (this.mode === 'FLASH') {
      return this.handleFlashKey(key);
    }
    if (this.mode === 'VISUAL' || this.mode === 'VISUAL_LINE') {
      return this.handleVisualKey(key);
    }

    return this.handleNormalKey(key);
  }

  /**
   * Handle keystrokes in INSERT mode
   */
  handleInsertKey(key) {
    if (key === 'Escape') {
      this.setMode('NORMAL');
      const cur = this.buffer.getCursor();
      if (cur.col > 0) {
        this.buffer.setCursor(cur.row, cur.col - 1);
      }
      this.buffer.clampCursor('NORMAL');
      return { handled: true };
    }

    if (key === '<C-s>') {
      this.saveSnapshot();
      this.actionsExecuted.add('save');
      return { handled: true, feedback: 'Saved buffer to disk.', action: 'save' };
    }

    if (key === 'ArrowLeft') {
      this.moveLeft(1);
      return { handled: true };
    }
    if (key === 'ArrowRight') {
      this.moveRight(1);
      return { handled: true };
    }
    if (key === 'ArrowUp') {
      this.moveUp(1);
      return { handled: true };
    }
    if (key === 'ArrowDown') {
      this.moveDown(1);
      return { handled: true };
    }

    if (key === 'Backspace') {
      this.saveSnapshot();
      this.buffer.deleteChar(true);
      return { handled: true };
    }

    if (key === 'Enter') {
      this.saveSnapshot();
      this.buffer.insertText('\n');
      return { handled: true };
    }

    if (key === 'Tab') {
      this.saveSnapshot();
      this.buffer.insertText('  ');
      return { handled: true };
    }

    if (key.length === 1) {
      this.buffer.insertText(key);
      return { handled: true };
    }

    return { handled: false };
  }

  /**
   * Handle keystrokes in NORMAL mode
   */
  handleNormalKey(key) {
    // Escape clears pending sequence and hlsearch
    if (key === 'Escape') {
      this.pendingKeys = '';
      this.countPrefix = '';
      this.activeOperator = null;
      this.searchMatches = [];
      return { handled: true, feedback: 'Cleared' };
    }

    // Number prefixes for counts (e.g., 3w, 5j)
    if (/^[1-9]$/.test(key) && (this.countPrefix !== '' || !this.pendingKeys)) {
      this.countPrefix += key;
      return { handled: true };
    }
    if (key === '0' && this.countPrefix !== '') {
      this.countPrefix += '0';
      return { handled: true };
    }

    const count = this.countPrefix ? parseInt(this.countPrefix, 10) : 1;

    // Buffer pending keys (for multi-key commands like gg, ciw, da", f{ch}, etc.)
    const seq = this.pendingKeys + key;

    // Register selection: "a, "+, etc.
    if (this.pendingKeys.startsWith('"')) {
      if (this.pendingKeys.length === 1) {
        this.activeRegister = key;
        this.pendingKeys = '';
        return { handled: true };
      }
    }
    if (key === '"' && !this.pendingKeys) {
      this.pendingKeys = '"';
      return { handled: true };
    }

    // Inline seeking: f{char}, F{char}, t{char}, T{char}
    if (/^[fFtT]$/.test(this.pendingKeys)) {
      const type = this.pendingKeys;
      this.pendingKeys = '';
      this.countPrefix = '';
      this.executeSeek(type, key, count);
      return { handled: true };
    }
    if (/^[fFtT]$/.test(key)) {
      this.pendingKeys = key;
      return { handled: true };
    }

    // Replace character: r{char}
    if (this.pendingKeys === 'r') {
      this.pendingKeys = '';
      this.countPrefix = '';
      this.saveSnapshot();
      for (let i = 0; i < count; i++) {
        this.buffer.replaceChar(key);
        if (i < count - 1) this.moveRight(1);
      }
      return { handled: true };
    }
    if (key === 'r') {
      this.pendingKeys = 'r';
      return { handled: true };
    }

    // Multi-key motion prefix 'g'
    if (this.pendingKeys === 'g') {
      this.pendingKeys = '';
      this.countPrefix = '';
      if (key === 'g') {
        this.moveTop();
        return { handled: true };
      }
      if (key === 'e') {
        this.moveGE(count);
        return { handled: true };
      }
      if (key === '_') {
        this.moveLastNonBlank();
        return { handled: true };
      }
      if (key === 'd') {
        return { handled: true, feedback: 'Jump to definition (LSP)' };
      }
      if (key === 'r') {
        return { handled: true, feedback: 'Jump to references (LSP)' };
      }
      return { handled: false };
    }
    if (key === 'g' && !this.activeOperator) {
      this.pendingKeys = 'g';
      return { handled: true };
    }

    // Treesitter & Diagnostic motions: ], [
    if (this.pendingKeys === ']' || this.pendingKeys === '[') {
      const prefix = this.pendingKeys;
      this.pendingKeys = '';
      this.countPrefix = '';
      if (key === 'm' || key === 'f') {
        this.jumpTreesitterFunction(prefix === ']');
        return { handled: true, feedback: 'AST function hop' };
      }
      if (key === 'd') {
        this.jumpDiagnostic(prefix === ']');
        return { handled: true, feedback: 'Diagnostic jump' };
      }
      return { handled: false };
    }
    if (key === ']' || key === '[') {
      this.pendingKeys = key;
      return { handled: true };
    }

    // Operator pending: c, d, y
    if (this.activeOperator) {
      return this.handleOperatorPending(seq, count);
    }

    if (key === 'd' || key === 'c' || key === 'y') {
      this.activeOperator = key;
      this.pendingKeys = key;
      return { handled: true };
    }

    // Clear count for standalone commands
    this.countPrefix = '';

    // Insert mode entries
    if (key === 'i') {
      this.saveSnapshot();
      this.setMode('INSERT');
      return { handled: true };
    }
    if (key === 'I') {
      this.saveSnapshot();
      this.moveHat();
      this.setMode('INSERT');
      return { handled: true };
    }
    if (key === 'a') {
      this.saveSnapshot();
      const line = this.buffer.getLine(this.buffer.getCursor().row);
      if (line.length > 0) {
        this.buffer.setCursor(this.buffer.getCursor().row, this.buffer.getCursor().col + 1);
      }
      this.setMode('INSERT');
      return { handled: true };
    }
    if (key === 'A') {
      this.saveSnapshot();
      const line = this.buffer.getLine(this.buffer.getCursor().row);
      this.buffer.setCursor(this.buffer.getCursor().row, line.length);
      this.setMode('INSERT');
      return { handled: true };
    }
    if (key === 'o') {
      this.saveSnapshot();
      const cur = this.buffer.getCursor();
      this.buffer.insertLine(cur.row + 1, '');
      this.buffer.setCursor(cur.row + 1, 0);
      this.setMode('INSERT');
      return { handled: true };
    }
    if (key === 'O') {
      this.saveSnapshot();
      const cur = this.buffer.getCursor();
      this.buffer.insertLine(cur.row, '');
      this.buffer.setCursor(cur.row, 0);
      this.setMode('INSERT');
      return { handled: true };
    }

    // Visual mode entries
    if (key === 'v') {
      this.visualStart = this.buffer.getCursor();
      this.setMode('VISUAL');
      return { handled: true };
    }
    if (key === 'V') {
      this.visualStart = this.buffer.getCursor();
      this.setMode('VISUAL_LINE');
      return { handled: true };
    }

    // Command-line mode entry
    if (key === ':') {
      this.commandLine = ':';
      this.setMode('COMMAND');
      return { handled: true };
    }
    if (key === '/') {
      this.commandLine = '/';
      this.setMode('COMMAND');
      return { handled: true };
    }

    // Flash teleportation entry
    if (key === 's') {
      this.setMode('FLASH');
      this.pendingKeys = '';
      return { handled: true, feedback: 'Flash: enter 2 characters' };
    }

    // Standalone single-character edit commands
    if (key === 'x') {
      this.saveSnapshot();
      for (let i = 0; i < count; i++) {
        this.buffer.deleteChar(false);
      }
      this.buffer.clampCursor('NORMAL');
      return { handled: true };
    }
    if (key === 'X') {
      this.saveSnapshot();
      for (let i = 0; i < count; i++) {
        this.buffer.deleteChar(true);
      }
      this.buffer.clampCursor('NORMAL');
      return { handled: true };
    }
    if (key === 'D') {
      this.saveSnapshot();
      const cur = this.buffer.getCursor();
      const line = this.buffer.getLine(cur.row);
      this.buffer.deleteRange(cur, { row: cur.row, col: line.length });
      this.buffer.clampCursor('NORMAL');
      return { handled: true };
    }
    if (key === 'C') {
      this.saveSnapshot();
      const cur = this.buffer.getCursor();
      const line = this.buffer.getLine(cur.row);
      this.buffer.deleteRange(cur, { row: cur.row, col: line.length });
      this.setMode('INSERT');
      return { handled: true };
    }
    if (key === 'J') {
      this.saveSnapshot();
      this.joinLines(count);
      return { handled: true };
    }
    if (key === 'u') {
      this.undo();
      return { handled: true };
    }
    if (key === '<C-r>') {
      const redone = this.redo();
      return { handled: true, feedback: redone ? '1 change redone.' : 'Already at newest change.' };
    }
    if (key === '<C-s>') {
      this.saveSnapshot();
      this.actionsExecuted.add('save');
      return { handled: true, feedback: 'Saved buffer to disk.', action: 'save' };
    }
    if (key === '<C-d>') {
      this.moveDown(count * 5);
      return { handled: true };
    }
    if (key === '<C-u>') {
      this.moveUp(count * 5);
      return { handled: true };
    }
    if (key === 'p') {
      this.saveSnapshot();
      this.paste(false);
      return { handled: true };
    }
    if (key === 'P') {
      this.saveSnapshot();
      this.paste(true);
      return { handled: true };
    }
    if (key === '.') {
      this.executeDotRepeat();
      return { handled: true };
    }

    // Navigation keys
    if (key === 'h' || key === 'ArrowLeft') {
      this.moveLeft(count);
      return { handled: true };
    }
    if (key === 'l' || key === 'ArrowRight') {
      this.moveRight(count);
      return { handled: true };
    }
    if (key === 'j' || key === 'ArrowDown') {
      this.moveDown(count);
      return { handled: true };
    }
    if (key === 'k' || key === 'ArrowUp') {
      this.moveUp(count);
      return { handled: true };
    }
    if (key === 'w') {
      this.moveW(count);
      return { handled: true };
    }
    if (key === 'b') {
      this.moveB(count);
      return { handled: true };
    }
    if (key === 'e') {
      this.moveE(count);
      return { handled: true };
    }
    if (key === '0') {
      this.move0();
      return { handled: true };
    }
    if (key === '^') {
      this.moveHat();
      return { handled: true };
    }
    if (key === '$') {
      this.moveDollar();
      return { handled: true };
    }
    if (key === 'G') {
      if (this.countPrefix) {
        this.buffer.setCursor(count - 1, 0);
      } else {
        this.moveBottom();
      }
      return { handled: true };
    }
    if (key === '{') {
      this.movePrevBlank();
      return { handled: true };
    }
    if (key === '}') {
      this.moveNextBlank();
      return { handled: true };
    }
    if (key === ';') {
      this.repeatSeek(false);
      return { handled: true };
    }
    if (key === ',') {
      this.repeatSeek(true);
      return { handled: true };
    }
    if (key === 'n') {
      this.jumpSearchMatch(true);
      return { handled: true };
    }
    if (key === 'N') {
      this.jumpSearchMatch(false);
      return { handled: true };
    }

    return { handled: false };
  }

  /**
   * Handlers for operator + motion / text-object combinations
   */
  handleOperatorPending(seq, count) {
    const op = this.activeOperator;

    // Line doubling: dd, cc, yy, >>, <<
    if (seq === op + op) {
      this.operatorHandler.executeLineOp(op, count);
      this.activeOperator = null;
      this.pendingKeys = '';
      return { handled: true };
    }

    // Text objects: iw, aw, i", a", i(, a(, i{, a{, etc.
    const textObjMatch = seq.match(/^[dcy](i|a)(["'`()\[\]{}wbptaf])$/);
    if (textObjMatch) {
      const [, inner, type] = textObjMatch;
      this.operatorHandler.executeTextObjectOp(op, inner === 'i', type);
      this.activeOperator = null;
      this.pendingKeys = '';
      return { handled: true };
    }

    // Text object prefix: di, ca, yi...
    if (/^[dcy][ia]$/.test(seq)) {
      this.pendingKeys = seq;
      return { handled: true };
    }

    // Motion with operator: dw, cw, d$, d0, dj, dk, etc.
    const motionChar = seq.slice(1);
    if (['w', 'b', 'e', '$', '0', '^', 'j', 'k', 'h', 'l'].includes(motionChar)) {
      if (motionChar === 'j' || motionChar === 'k') {
        this.saveSnapshot();
        if (motionChar === 'k') {
          this.moveUp(count);
        }
        this.operatorHandler.executeLineOp(op, count + 1);
        this.activeOperator = null;
        this.pendingKeys = '';
        return { handled: true };
      }

      this.saveSnapshot();
      const start = this.buffer.getCursor();
      // Execute motion temporarily to find end
      if (motionChar === 'w') this.moveW(count);
      else if (motionChar === 'b') this.moveB(count);
      else if (motionChar === 'e') this.moveE(count);
      else if (motionChar === '$') this.moveDollar();
      else if (motionChar === '0') this.move0();
      else if (motionChar === '^') this.moveHat();
      else if (motionChar === 'h') this.moveLeft(count);
      else if (motionChar === 'l') this.moveRight(count);
      const end = this.buffer.getCursor();
      if (motionChar === '$') {
        end.col = this.buffer.getLine(end.row).length;
      } else if (motionChar === 'e' || motionChar === 'l') {
        end.col = end.col + 1;
      }

      const deleted = this.buffer.deleteRange(start, end);
      this.registers[this.activeRegister] = { text: deleted, linewise: false };

      if (op === 'c') {
        this.setMode('INSERT');
      } else {
        this.buffer.clampCursor('NORMAL');
      }
      this.activeOperator = null;
      this.pendingKeys = '';
      return { handled: true };
    }

    // Sequence did not match any known operator combination: reset operator pending to prevent deadlocks
    this.activeOperator = null;
    this.pendingKeys = '';
    return { handled: false };
  }

  handleVisualKey(key) {
    if (key === 'Escape' || key === 'v' || key === 'V') {
      this.visualStart = null;
      this.countPrefix = '';
      this.setMode('NORMAL');
      return { handled: true };
    }

    // Number prefixes for visual counts (e.g. 2j)
    if (/^[1-9]$/.test(key) && this.countPrefix === '') {
      this.countPrefix = key;
      return { handled: true };
    }
    if (/^[0-9]$/.test(key) && this.countPrefix !== '') {
      this.countPrefix += key;
      return { handled: true };
    }

    const count = this.countPrefix ? parseInt(this.countPrefix, 10) : 1;
    this.countPrefix = '';

    // Indent in visual mode: > or <
    if (key === '>') {
      this.operatorHandler.indentVisual(true);
      return { handled: true };
    }
    if (key === '<') {
      this.operatorHandler.indentVisual(false);
      return { handled: true };
    }

    // Yank in Visual mode
    if (key === 'y') {
      const cur = this.buffer.getCursor();
      const start = this.visualStart || cur;
      let yanked = '';
      if (this.mode === 'VISUAL_LINE') {
        const minRow = Math.min(start.row, cur.row);
        const maxRow = Math.max(start.row, cur.row);
        const lines = [];
        for (let r = minRow; r <= maxRow; r++) {
          lines.push(this.buffer.getLine(r));
        }
        yanked = lines.join('\n') + '\n';
        this.registers[this.activeRegister] = { text: yanked, linewise: true };
      } else {
        const minPos = start.row < cur.row || (start.row === cur.row && start.col <= cur.col) ? start : cur;
        const maxPos = minPos === start ? cur : start;
        const line = this.buffer.getLine(minPos.row);
        yanked = line.slice(minPos.col, maxPos.col + 1);
        this.registers[this.activeRegister] = { text: yanked, linewise: false };
      }
      this.visualStart = null;
      this.setMode('NORMAL');
      return { handled: true };
    }

    // Delete or Change in Visual mode
    if (key === 'd' || key === 'x' || key === 'c') {
      this.saveSnapshot();
      const cur = this.buffer.getCursor();
      const start = this.visualStart || cur;
      let deleted = '';

      if (this.mode === 'VISUAL_LINE') {
        const minRow = Math.min(start.row, cur.row);
        const maxRow = Math.max(start.row, cur.row);
        const lines = [];
        const wasAllLines = minRow === 0 && maxRow >= this.buffer.getLines().length - 1;

        for (let r = maxRow; r >= minRow; r--) {
          lines.unshift(this.buffer.deleteLine(r));
        }
        deleted = lines.join('\n') + '\n';
        this.registers[this.activeRegister] = { text: deleted, linewise: true };
        this.buffer.setCursor(minRow, 0);

        if (key === 'c') {
          if (!wasAllLines) {
            this.buffer.insertLine(minRow, '');
          }
          this.buffer.setCursor(minRow, 0);
          this.setMode('INSERT');
        } else {
          this.setMode('NORMAL');
        }
      } else {
        deleted = this.buffer.deleteRange(start, {
          row: cur.row,
          col: cur.col + 1,
        });
        this.registers[this.activeRegister] = { text: deleted, linewise: false };
        if (key === 'c') {
          this.setMode('INSERT');
        } else {
          this.setMode('NORMAL');
        }
      }
      this.visualStart = null;
      return { handled: true };
    }

    // Navigation while in visual mode
    if (key === 'h') this.moveLeft(count);
    if (key === 'l') this.moveRight(count);
    if (key === 'j') this.moveDown(count);
    if (key === 'k') this.moveUp(count);
    if (key === 'w') this.moveW(count);
    if (key === 'b') this.moveB(count);
    if (key === '$') this.moveDollar();
    if (key === '0') this.move0();
    return { handled: true };
  }

  handleCommandKey(key) {
    if (key === 'Escape') {
      this.commandLine = '';
      this.setMode('NORMAL');
      return { handled: true };
    }
    if (key === 'Backspace') {
      this.commandLine = this.commandLine.slice(0, -1);
      if (this.commandLine === '') {
        this.setMode('NORMAL');
      }
      return { handled: true };
    }
    if (key === 'Enter') {
      const cmd = this.commandLine;
      this.commandLine = '';
      this.setMode('NORMAL');
      return this.executeCommand(cmd);
    }
    if (key.length === 1) {
      this.commandLine += key;
      return { handled: true };
    }
    return { handled: false };
  }

  executeCommand(cmd) {
    const res = this.commandHandler.execute(cmd);
    if (res && res.action) {
      this.actionsExecuted.add(res.action);
    }
    return res;
  }

  handleFlashKey(key) {
    if (key === 'Escape') {
      this.pendingKeys = '';
      this.flashTargets = [];
      this.setMode('NORMAL');
      return { handled: true };
    }
    if (this.flashTargets.length > 0) {
      const jumped = this.flashHandler.jumpToLabel(key, this.flashTargets);
      this.flashTargets = [];
      this.setMode('NORMAL');
      return { handled: jumped };
    }

    this.pendingKeys += key;
    if (this.pendingKeys.length === 2) {
      this.flashTargets = this.flashHandler.findTargets(this.pendingKeys);
      this.pendingKeys = '';
      if (this.flashTargets.length === 0) {
        this.setMode('NORMAL');
        return { handled: true, feedback: 'No flash targets found' };
      }
      return { handled: true, feedback: 'Select flash label' };
    }
    return { handled: true };
  }

  generateFlashTargets(twoChars) {
    this.flashTargets = this.flashHandler.findTargets(twoChars);
    if (this.flashTargets.length === 0) {
      this.setMode('NORMAL');
    }
  }

  executeSearch(query) {
    this.searchMatches = [];
    if (!query) return;
    const lines = this.buffer.getLines();
    for (let r = 0; r < lines.length; r++) {
      let idx = 0;
      while ((idx = lines[r].indexOf(query, idx)) !== -1) {
        this.searchMatches.push({ row: r, col: idx });
        idx += query.length;
      }
    }
    if (this.searchMatches.length > 0) {
      this.searchMatchIndex = 0;
      const m = this.searchMatches[0];
      this.buffer.setCursor(m.row, m.col);
    }
  }

  jumpSearchMatch(forward = true) {
    if (this.searchMatches.length === 0) return;
    if (forward) {
      this.searchMatchIndex = (this.searchMatchIndex + 1) % this.searchMatches.length;
    } else {
      this.searchMatchIndex =
        (this.searchMatchIndex - 1 + this.searchMatches.length) % this.searchMatches.length;
    }
    const m = this.searchMatches[this.searchMatchIndex];
    this.buffer.setCursor(m.row, m.col);
  }

  // Text object execution
  executeTextObject(op, isInner, type) {
    const cur = this.buffer.getCursor();
    const line = this.buffer.getLine(cur.row);

    // Quotes: " or '
    if (type === '"' || type === "'") {
      const quote = type;
      let first = line.indexOf(quote);
      let second = line.indexOf(quote, first + 1);
      if (first !== -1 && second !== -1) {
        const startCol = isInner ? first + 1 : first;
        const endCol = isInner ? second : second + 1;
        const deleted = this.buffer.deleteRange(
          { row: cur.row, col: startCol },
          { row: cur.row, col: endCol }
        );
        this.registers[this.activeRegister] = { text: deleted, linewise: false };
        if (op === 'c') {
          this.buffer.setCursor(cur.row, startCol);
          this.setMode('INSERT');
        }
      }
      return;
    }

    // Delimiters: (, [, {
    const pairs = { '(': ')', '[': ']', '{': '}' };
    if (pairs[type]) {
      const openCh = type;
      const closeCh = pairs[type];
      const openIdx = line.lastIndexOf(openCh, cur.col);
      const closeIdx = line.indexOf(closeCh, cur.col);
      if (openIdx !== -1 && closeIdx !== -1 && openIdx < closeIdx) {
        const startCol = isInner ? openIdx + 1 : openIdx;
        const endCol = isInner ? closeIdx : closeIdx + 1;
        const deleted = this.buffer.deleteRange(
          { row: cur.row, col: startCol },
          { row: cur.row, col: endCol }
        );
        this.registers[this.activeRegister] = { text: deleted, linewise: false };
        if (op === 'c') {
          this.buffer.setCursor(cur.row, startCol);
          this.setMode('INSERT');
        }
      }
      return;
    }

    // Word object: iw / aw
    if (type === 'w') {
      let startCol = cur.col;
      let endCol = cur.col;
      while (startCol > 0 && /\w/.test(line[startCol - 1])) startCol--;
      while (endCol < line.length && /\w/.test(line[endCol])) endCol++;
      if (!isInner) {
        while (endCol < line.length && /\s/.test(line[endCol])) endCol++;
      }
      const deleted = this.buffer.deleteRange(
        { row: cur.row, col: startCol },
        { row: cur.row, col: endCol }
      );
      this.registers[this.activeRegister] = { text: deleted, linewise: false };
      if (op === 'c') {
        this.buffer.setCursor(cur.row, startCol);
        this.setMode('INSERT');
      }
      return;
    }
  }

  paste(before = false) {
    const reg = this.registers[this.activeRegister] || this.registers['"'];
    if (!reg || !reg.text) return;
    const cur = this.buffer.getCursor();
    if (reg.linewise) {
      const targetRow = before ? cur.row : cur.row + 1;
      const lines = reg.text.replace(/\n$/, '').split('\n');
      lines.forEach((l, idx) => {
        this.buffer.insertLine(targetRow + idx, l);
      });
      this.buffer.setCursor(targetRow, 0);
    } else {
      const insertCol = before ? cur.col : cur.col + 1;
      this.buffer.setCursor(cur.row, insertCol);
      this.buffer.insertText(reg.text);
    }
  }

  joinLines(count = 1) {
    const cur = this.buffer.getCursor();
    if (cur.row >= this.buffer.getLines().length - 1) return;
    const line1 = this.buffer.getLine(cur.row);
    const line2 = this.buffer.getLine(cur.row + 1).trimStart();
    this.buffer.setLine(cur.row, line1 + ' ' + line2);
    this.buffer.deleteLine(cur.row + 1);
    this.buffer.setCursor(cur.row, line1.length);
  }

  executeDotRepeat() {
    // Repeats last change if available
    if (this.lastChange) {
      this.lastChange();
    }
  }

  // --- MOTIONS ---

  moveLeft(count = 1) {
    const cur = this.buffer.getCursor();
    this.buffer.setCursor(cur.row, Math.max(0, cur.col - count));
    this.buffer.clampCursor(this.mode);
  }

  moveRight(count = 1) {
    const cur = this.buffer.getCursor();
    this.buffer.setCursor(cur.row, cur.col + count);
    this.buffer.clampCursor(this.mode);
  }

  moveDown(count = 1) {
    const cur = this.buffer.getCursor();
    this.buffer.setCursor(cur.row + count, cur.col);
    this.buffer.clampCursor(this.mode);
  }

  moveUp(count = 1) {
    const cur = this.buffer.getCursor();
    this.buffer.setCursor(cur.row - count, cur.col);
    this.buffer.clampCursor(this.mode);
  }

  move0() {
    this.buffer.setCursor(this.buffer.getCursor().row, 0);
  }

  moveHat() {
    const cur = this.buffer.getCursor();
    const line = this.buffer.getLine(cur.row);
    const match = line.search(/\S/);
    this.buffer.setCursor(cur.row, match === -1 ? 0 : match);
  }

  moveDollar() {
    const cur = this.buffer.getCursor();
    const line = this.buffer.getLine(cur.row);
    this.buffer.setCursor(cur.row, Math.max(0, line.length - 1));
  }

  moveLastNonBlank() {
    const cur = this.buffer.getCursor();
    const line = this.buffer.getLine(cur.row);
    const trimmed = line.trimEnd();
    this.buffer.setCursor(cur.row, Math.max(0, trimmed.length - 1));
  }

  moveTop() {
    this.buffer.setCursor(0, 0);
    this.moveHat();
  }

  moveBottom() {
    const lastRow = Math.max(0, this.buffer.getLines().length - 1);
    this.buffer.setCursor(lastRow, 0);
    this.moveHat();
  }

  movePrevBlank() {
    let r = this.buffer.getCursor().row - 1;
    while (r > 0 && this.buffer.getLine(r).trim() !== '') r--;
    this.buffer.setCursor(Math.max(0, r), 0);
  }

  moveNextBlank() {
    const lines = this.buffer.getLines();
    let r = this.buffer.getCursor().row + 1;
    while (r < lines.length && this.buffer.getLine(r).trim() !== '') r++;
    this.buffer.setCursor(Math.min(lines.length - 1, r), 0);
  }

  moveW(count = 1) {
    for (let i = 0; i < count; i++) {
      let { row, col } = this.buffer.getCursor();
      const lines = this.buffer.getLines();
      let line = lines[row];

      if (col >= line.length) {
        if (row < lines.length - 1) {
          row++;
          col = 0;
          this.buffer.setCursor(row, col);
          continue;
        } else {
          break;
        }
      }

      const initialType = getCharType(line[col]);
      while (col < line.length && getCharType(line[col]) === initialType) col++;
      while (col < line.length && getCharType(line[col]) === 'space') col++;

      if (col >= line.length && row < lines.length - 1) {
        row++;
        col = 0;
        line = lines[row];
        while (col < line.length && getCharType(line[col]) === 'space') col++;
      }

      this.buffer.setCursor(row, col);
    }
    this.buffer.clampCursor(this.mode);
  }

  moveB(count = 1) {
    for (let i = 0; i < count; i++) {
      let { row, col } = this.buffer.getCursor();
      const lines = this.buffer.getLines();

      if (col === 0) {
        if (row > 0) {
          row--;
          col = lines[row].length - 1;
          this.buffer.setCursor(row, Math.max(0, col));
          continue;
        } else {
          break;
        }
      }

      col--;
      let line = lines[row];
      while (col > 0 && getCharType(line[col]) === 'space') col--;
      const targetType = getCharType(line[col]);
      while (col > 0 && getCharType(line[col - 1]) === targetType) col--;

      this.buffer.setCursor(row, col);
    }
    this.buffer.clampCursor(this.mode);
  }

  moveE(count = 1) {
    for (let i = 0; i < count; i++) {
      let { row, col } = this.buffer.getCursor();
      const lines = this.buffer.getLines();
      let line = lines[row];

      col++;
      while (col < line.length && getCharType(line[col]) === 'space') col++;
      if (col >= line.length && row < lines.length - 1) {
        row++;
        col = 0;
        line = lines[row];
        while (col < line.length && getCharType(line[col]) === 'space') col++;
      }

      const targetType = getCharType(line[col]);
      while (col < line.length - 1 && getCharType(line[col + 1]) === targetType) col++;

      this.buffer.setCursor(row, col);
    }
    this.buffer.clampCursor(this.mode);
  }

  moveGE(count = 1) {
    for (let i = 0; i < count; i++) {
      let { row, col } = this.buffer.getCursor();
      const lines = this.buffer.getLines();

      col--;
      if (col < 0 && row > 0) {
        row--;
        col = lines[row].length - 1;
      }
      let line = lines[row];
      while (col > 0 && getCharType(line[col]) === 'space') col--;

      this.buffer.setCursor(row, Math.max(0, col));
    }
    this.buffer.clampCursor(this.mode);
  }

  executeSeek(type, char, count = 1) {
    this.lastSeek = { type, char };
    const cur = this.buffer.getCursor();
    const line = this.buffer.getLine(cur.row);

    let foundCol = cur.col;
    for (let i = 0; i < count; i++) {
      if (type === 'f') {
        foundCol = line.indexOf(char, foundCol + 1);
      } else if (type === 'F') {
        foundCol = line.lastIndexOf(char, foundCol - 1);
      } else if (type === 't') {
        const next = line.indexOf(char, foundCol + 1);
        foundCol = next !== -1 ? next - 1 : -1;
      } else if (type === 'T') {
        const prev = line.lastIndexOf(char, foundCol - 1);
        foundCol = prev !== -1 ? prev + 1 : -1;
      }
      if (foundCol === -1) break;
    }

    if (foundCol !== -1) {
      this.buffer.setCursor(cur.row, foundCol);
    }
  }

  repeatSeek(reverse = false) {
    if (!this.lastSeek) return;
    let { type, char } = this.lastSeek;
    if (reverse) {
      const opposites = { f: 'F', F: 'f', t: 'T', T: 't' };
      type = opposites[type];
    }
    this.executeSeek(type, char, 1);
  }

  jumpTreesitterFunction(forward = true) {
    const lines = this.buffer.getLines();
    const cur = this.buffer.getCursor();
    const fnRegex = /^\s*(export\s+)?(async\s+)?(function|def|func|fn)\s+/;
    if (forward) {
      for (let r = cur.row + 1; r < lines.length; r++) {
        if (fnRegex.test(lines[r])) {
          this.buffer.setCursor(r, 0);
          this.moveHat();
          return;
        }
      }
    } else {
      for (let r = cur.row - 1; r >= 0; r--) {
        if (fnRegex.test(lines[r])) {
          this.buffer.setCursor(r, 0);
          this.moveHat();
          return;
        }
      }
    }
  }

  jumpDiagnostic(forward = true) {
    // Diagnostic simulator (looks for lines with error comments or markers)
    const lines = this.buffer.getLines();
    const cur = this.buffer.getCursor();
    const diagRegex = /(ERROR|WARN|TODO|FIXME|syntax error)/i;
    if (forward) {
      for (let r = cur.row + 1; r < lines.length; r++) {
        if (diagRegex.test(lines[r])) {
          this.buffer.setCursor(r, 0);
          this.moveHat();
          return;
        }
      }
    } else {
      for (let r = cur.row - 1; r >= 0; r--) {
        if (diagRegex.test(lines[r])) {
          this.buffer.setCursor(r, 0);
          this.moveHat();
          return;
        }
      }
    }
  }
}

  try { exports.VimEngine = VimEngine; } catch(e) {}
});

/* Module: stages/curriculum.js */
defineModule('stages/curriculum.js', function(exports, require, module) {
/**
 * Complete 30-Day Neovim Mastery Game Curriculum.
 * Mapped to repository markdown chapters and pre-configured lazyvim settings.
 */

const STAGES = [
  // ==========================================
  // WEEK 1: The Grammar of Vim Motions
  // ==========================================
  {
    day: 1,
    week: 1,
    title: 'Mental Model & First Day Survival',
    concept: 'Normal Mode vs Insert Mode & Saving',
    chapterRef: '00-getting-started/03-first-day-survival-guide.md',
    mission: 'Enter Insert mode with "i", type "Welcome Eddie", return to Normal mode with <Esc>, and save with ":w".',
    initialText: '// Neovim Mastery\nconsole.log("");',
    cursorStart: { row: 1, col: 13 },
    targetText: '// Neovim Mastery\nconsole.log("Welcome Eddie");',
    requiredAction: 'save',
    parKeystrokes: 18,
    optimalKeys: ['i', 'W', 'e', 'l', 'c', 'o', 'm', 'e', ' ', 'E', 'd', 'd', 'i', 'e', 'Escape', ':', 'w', 'Enter'],
    hints: [
      'Your cursor starts between the double quotes.',
      'Press "i" to enter Insert mode.',
      'Type "Welcome Eddie", then press <Esc> to return to Normal mode.',
      'Type ":w" and press Enter to save.'
    ],
  },
  {
    day: 2,
    week: 1,
    title: 'Arrowless Navigation',
    concept: 'h, j, k, l with Counts',
    chapterRef: '01-vim-grammar-and-motions/03-movement-mastery.md',
    mission: 'Navigate without arrow keys! Use count motions (3j, 2l) to land on BUG and delete it with "x" 3 times.',
    initialText: 'line 1: safe\nline 2: safe\nline 3: safe\nline 4: BUGclean',
    cursorStart: { row: 0, col: 0 },
    targetText: 'line 1: safe\nline 2: safe\nline 3: safe\nline 4: clean',
    parKeystrokes: 9,
    optimalKeys: ['3', 'j', '8', 'l', 'x', 'x', 'x'],
    hints: [
      'Press "3j" to jump directly down to line 4.',
      'Press "8l" (or "w") to navigate to "BUG".',
      'Press "x" three times to delete "B", "U", "G".'
    ],
  },
  {
    day: 3,
    week: 1,
    title: 'Word Motions & Line Boundaries',
    concept: 'w, b, e, ge, 0, ^, $',
    chapterRef: '01-vim-grammar-and-motions/03-movement-mastery.md',
    mission: 'Jump by words! Use "w" to reach WRONG and replace it using "cw" -> "correct" <Esc>.',
    initialText: 'const status = WRONG;',
    cursorStart: { row: 0, col: 0 },
    targetText: 'const status = correct;',
    parKeystrokes: 13,
    optimalKeys: ['3', 'w', 'c', 'w', 'c', 'o', 'r', 'r', 'e', 'c', 't', 'Escape'],
    hints: [
      'Type "3w" to jump to the start of "WRONG".',
      'Type "cw" to change the word into Insert mode.',
      'Type "correct" and press <Esc>.'
    ],
  },
  {
    day: 4,
    week: 1,
    title: 'The Grammar of Vim: Verb + Noun',
    concept: 'Operators (d, c, y) + Motions (w, $, 0)',
    chapterRef: '01-vim-grammar-and-motions/02-the-grammar-of-vim.md',
    mission: 'Delete to the end of the line using "d$" to clean up the trailing comment.',
    initialText: 'const port = 8080; // DELETE_THIS_OBSOLETE_COMMENT',
    cursorStart: { row: 0, col: 19 },
    targetText: 'const port = 8080; ',
    parKeystrokes: 2,
    optimalKeys: ['d', '$'],
    hints: [
      'Position cursor at the start of "//".',
      'Type "d$" to delete from cursor to end of line.'
    ],
  },
  {
    day: 5,
    week: 1,
    title: 'Inline Seeking Precision',
    concept: 'f, F, t, T with ; and ,',
    chapterRef: '01-vim-grammar-and-motions/03-movement-mastery.md',
    mission: 'Find target characters fast! Use "f(" to jump to paren, then "ci(" to replace parameters with "id: string".',
    initialText: 'function fetchUser(old_a, old_b, old_c) {',
    cursorStart: { row: 0, col: 0 },
    targetText: 'function fetchUser(id: string) {',
    parKeystrokes: 16,
    optimalKeys: ['f', '(', 'c', 'i', '(', 'i', 'd', ':', ' ', 's', 't', 'r', 'i', 'n', 'g', 'Escape'],
    hints: [
      'Type "f(" to seek directly to the opening parenthesis.',
      'Type "ci(" to change inside parentheses.',
      'Type "id: string" and exit with <Esc>.'
    ],
  },
  {
    day: 6,
    week: 1,
    title: 'The Superpower of Text Objects',
    concept: 'ci", di", ca(, da{',
    chapterRef: '01-vim-grammar-and-motions/02-the-grammar-of-vim.md',
    mission: 'Change inside quotes without manually seeking! From anywhere inside the line, type "ci"" and enter "Tokyo Night".',
    initialText: 'const theme = "OLD_THEME_NAME";',
    cursorStart: { row: 0, col: 17 },
    targetText: 'const theme = "Tokyo Night";',
    parKeystrokes: 15,
    optimalKeys: ['c', 'i', '"', 'T', 'o', 'k', 'y', 'o', ' ', 'N', 'i', 'g', 'h', 't', 'Escape'],
    hints: [
      'No need to position cursor on the first quote.',
      'Type "ci\"" to instantly wipe inside quotes.',
      'Type "Tokyo Night" and press <Esc>.'
    ],
  },
  {
    day: 7,
    week: 1,
    title: 'Registers & Clipboard Secrets',
    concept: 'Yanking, Pasting & Repeat (.)',
    chapterRef: '01-vim-grammar-and-motions/05-registers-and-clipboard.md',
    mission: 'Duplicate the header line using "yy" then paste below with "p".',
    initialText: 'const API_URL = "https://api.domain.com";',
    cursorStart: { row: 0, col: 0 },
    targetText: 'const API_URL = "https://api.domain.com";\nconst API_URL = "https://api.domain.com";',
    parKeystrokes: 3,
    optimalKeys: ['y', 'y', 'p'],
    hints: [
      'Type "yy" to yank the entire line.',
      'Type "p" to paste it right below.'
    ],
  },

  // ==========================================
  // WEEK 2: Navigation, Buffers, Windows & Git
  // ==========================================
  {
    day: 8,
    week: 2,
    title: 'Paragraph & File-Wide Jumps',
    concept: 'gg, G, {, } Navigation',
    chapterRef: '02-navigation-and-project-management/01-buffers-windows-tabs.md',
    mission: 'Jump to the bottom of the file with "G", then delete the deprecated footer line with "dd".',
    initialText: 'header line\ncontent line 1\ncontent line 2\nDEPRECATED_FOOTER',
    cursorStart: { row: 0, col: 0 },
    targetText: 'header line\ncontent line 1\ncontent line 2',
    parKeystrokes: 3,
    optimalKeys: ['G', 'd', 'd'],
    hints: [
      'Press "G" to teleport to the last line.',
      'Press "dd" to delete the current line.'
    ],
  },
  {
    day: 9,
    week: 2,
    title: 'Visual Block & Multi-Line Edits',
    concept: 'V line visual and indentation',
    chapterRef: '01-vim-grammar-and-motions/04-visual-and-block-editing.md',
    mission: 'Select both lines in Visual Line mode ("V", "j") and indent them right with ">".',
    initialText: 'const a = 1;\nconst b = 2;',
    cursorStart: { row: 0, col: 0 },
    targetText: '  const a = 1;\n  const b = 2;',
    parKeystrokes: 3,
    optimalKeys: ['V', 'j', '>'],
    hints: [
      'Press "V" to enter Visual Line mode.',
      'Press "j" to extend selection to the second line.',
      'Press ">" to indent the selection by 2 spaces.'
    ],
  },
  {
    day: 10,
    week: 2,
    title: 'Undo Trees & Line Joining',
    concept: 'u, <C-r>, and J',
    chapterRef: '00-getting-started/03-first-day-survival-guide.md',
    mission: 'Accidental delete happened! Press "u" to undo, then press "J" to join the two lines into one.',
    initialText: 'const welcome = ',
    cursorStart: { row: 0, col: 0 },
    targetText: 'const welcome = "Hello World";',
    parKeystrokes: 2,
    // Note: starts after an accidental delete was snapshot
    optimalKeys: ['u', 'J'],
    hints: [
      'Press "u" to undo the accidental deletion.',
      'Press "J" to join line 1 and line 2 with a clean space.'
    ],
    setup(engine) {
      engine.buffer.setText('const welcome =\n"Hello World";');
      engine.saveSnapshot();
      engine.buffer.deleteLine(1);
    }
  },
  {
    day: 11,
    week: 2,
    title: 'Pattern Search & Global Replace',
    concept: ':%s/find/replace/g in Command Mode',
    chapterRef: '06-plugin-mastery-and-ecosystem/04-grug-far-project-search-and-replace.md',
    mission: 'Rename all occurrences of "badVar" to "goodVar" using ":%s/badVar/goodVar/g".',
    initialText: 'let badVar = 10;\nfunction test() { return badVar * 2; }',
    cursorStart: { row: 0, col: 0 },
    targetText: 'let goodVar = 10;\nfunction test() { return goodVar * 2; }',
    parKeystrokes: 23,
    optimalKeys: [':', '%', 's', '/', 'b', 'a', 'd', 'V', 'a', 'r', '/', 'g', 'o', 'o', 'd', 'V', 'a', 'r', '/', 'g', 'Enter'],
    hints: [
      'Press ":" to enter Command mode.',
      'Type "%s/badVar/goodVar/g" and press Enter.'
    ],
  },
  {
    day: 12,
    week: 2,
    title: 'Buffer Navigation & Save Keys',
    concept: '<C-s>, <leader>w, and :bnext',
    chapterRef: '02-navigation-and-project-management/01-buffers-windows-tabs.md',
    mission: 'Save this modified buffer using ":w", then switch to the next buffer using ":bnext".',
    initialText: '// Buffer 1: Ready to save\nconst appConfig = { port: 3000 };',
    cursorStart: { row: 0, col: 0 },
    targetText: '// Buffer 1: Ready to save\nconst appConfig = { port: 3000 };',
    requiredAction: 'bnext',
    parKeystrokes: 10,
    optimalKeys: [':', 'w', 'Enter', ':', 'b', 'n', 'e', 'x', 't', 'Enter'],
    hints: [
      'Type ":w" <Enter> to write buffer.',
      'Type ":bnext" <Enter> to move to next buffer.'
    ],
  },
  {
    day: 13,
    week: 2,
    title: 'Flash.nvim 2-Keystroke Teleportation',
    concept: 's{char1}{char2} + label',
    chapterRef: '06-plugin-mastery-and-ecosystem/03-flash-nvim-teleportation-motions.md',
    mission: 'Teleport across the screen with Flash! Press "s", type "re", then press the label ("a") and delete word with "dw".',
    initialText: 'const alpha = 1;\nconst beta = 2;\nconst removeMe = 3;',
    cursorStart: { row: 0, col: 0 },
    targetText: 'const alpha = 1;\nconst beta = 2;\nconst = 3;',
    parKeystrokes: 6,
    optimalKeys: ['s', 'r', 'e', 'a', 'd', 'w'],
    hints: [
      'Press "s" to trigger Flash teleportation.',
      'Type "re" to find "removeMe".',
      'Press the target label "a" to jump instantly, then type "dw".'
    ],
  },
  {
    day: 14,
    week: 2,
    title: 'Dot Repeat Mastery',
    concept: 'The mighty . key',
    chapterRef: '01-vim-grammar-and-motions/02-the-grammar-of-vim.md',
    mission: 'Delete the first obsolete line with "dd", then use "." twice to repeat and delete the other two obsolete lines.',
    initialText: 'obsolete 1\nobsolete 2\nobsolete 3\nKEEP_ME',
    cursorStart: { row: 0, col: 0 },
    targetText: 'KEEP_ME',
    parKeystrokes: 4,
    optimalKeys: ['d', 'd', '.', '.'],
    hints: [
      'Type "dd" to delete obsolete 1.',
      'Press "." once to repeat deletion for obsolete 2.',
      'Press "." again for obsolete 3.'
    ],
  },

  // ==========================================
  // WEEK 3: Modern IDE Power Tools
  // ==========================================
  {
    day: 15,
    week: 3,
    title: 'Treesitter AST Hopping',
    concept: ']m and [m Function Hopping',
    chapterRef: '02-navigation-and-project-management/04-treesitter-code-navigation.md',
    mission: 'Jump to the next function definition using "]m", then wipe its contents with "ci{".',
    initialText: 'function first() {\n  return 1;\n}\n\nfunction target() {\n  OBSOLETE_BODY\n}',
    cursorStart: { row: 0, col: 0 },
    targetText: 'function first() {\n  return 1;\n}\n\nfunction target() {}',
    parKeystrokes: 6,
    optimalKeys: [']', 'm', 'c', 'i', '{', 'Escape'],
    hints: [
      'Type "]m" to jump cursor to the next function definition.',
      'Type "ci{" to change inside the function braces.',
      'Press <Esc> to finish.'
    ],
  },
  {
    day: 16,
    week: 3,
    title: 'Code Intelligence & Definition Jumps',
    concept: 'gd, gr, and K',
    chapterRef: '03-modern-ide-power-tools/02-code-navigation-and-inspection.md',
    mission: 'Jump to definition using "gd", then change the variable name with "ciw" -> "adminUser".',
    initialText: 'let user = "Eddie";\n// ... miles away ...\nconsole.log(user);',
    cursorStart: { row: 2, col: 13 },
    targetText: 'let adminUser = "Eddie";\n// ... miles away ...\nconsole.log(user);',
    parKeystrokes: 16,
    optimalKeys: ['g', 'g', 'w', 'c', 'i', 'w', 'a', 'd', 'm', 'i', 'n', 'U', 's', 'e', 'r', 'Escape'],
    hints: [
      'Jump to the top definition using "ggw" (or "gd").',
      'Type "ciw" to change inner word.',
      'Type "adminUser" and exit with <Esc>.'
    ],
  },
  {
    day: 17,
    week: 3,
    title: 'Diagnostic Hopping & Trouble',
    concept: ']d and [d Error Navigation',
    chapterRef: '03-modern-ide-power-tools/06-diagnostics-and-trouble.md',
    mission: 'Jump to the syntax error with "]d", delete the error marker with "dd".',
    initialText: 'const valid = true;\n// ERROR: missing semicolon\nconst port = 3000;',
    cursorStart: { row: 0, col: 0 },
    targetText: 'const valid = true;\nconst port = 3000;',
    parKeystrokes: 4,
    optimalKeys: [']', 'd', 'd', 'd'],
    hints: [
      'Type "]d" to jump directly to the diagnostic error line.',
      'Type "dd" to delete the erroneous line.'
    ],
  },
  {
    day: 18,
    week: 3,
    title: 'Code Actions & Quick Refactoring',
    concept: '<leader>ca and ciw',
    chapterRef: '03-modern-ide-power-tools/03-refactoring-and-code-actions.md',
    mission: 'Refactor identifier: use "ciw" on "oldHandler" to rename it to "handleAuth".',
    initialText: 'function oldHandler(req, res) {}',
    cursorStart: { row: 0, col: 18 },
    targetText: 'function handleAuth(req, res) {}',
    parKeystrokes: 14,
    optimalKeys: ['c', 'i', 'w', 'h', 'a', 'n', 'd', 'l', 'e', 'A', 'u', 't', 'h', 'Escape'],
    hints: [
      'Type "ciw" to replace the word under cursor.',
      'Type "handleAuth" and press <Esc>.'
    ],
  },
  {
    day: 19,
    week: 3,
    title: 'Mini.ai Text Objects',
    concept: 'dia / daa (Argument Text Objects)',
    chapterRef: '06-plugin-mastery-and-ecosystem/06-micro-productivity-and-editing-plugins.md',
    mission: 'Delete the second parameter "b: number" with "dia" (delete inside argument).',
    initialText: 'function sum(a: number, b: number, c: number) {}',
    cursorStart: { row: 0, col: 25 },
    targetText: 'function sum(a: number, , c: number) {}',
    parKeystrokes: 3,
    optimalKeys: ['d', 'i', 'a'],
    hints: [
      'With cursor on "b: number", type "dia" to delete inside argument.'
    ],
  },
  {
    day: 20,
    week: 3,
    title: 'Enclosure & Surround Operations',
    concept: 'Transforming quotes and delimiters',
    chapterRef: '06-plugin-mastery-and-ecosystem/06-micro-productivity-and-editing-plugins.md',
    mission: 'Change inside single quotes with "ci\'" and enter "production".',
    initialText: 'const env = \'development\';',
    cursorStart: { row: 0, col: 15 },
    targetText: 'const env = \'production\';',
    parKeystrokes: 14,
    optimalKeys: ['c', 'i', '\'', 'p', 'r', 'o', 'd', 'u', 'c', 't', 'i', 'o', 'n', 'Escape'],
    hints: [
      'Type "ci\'" to change inside single quotes.',
      'Type "production" and press <Esc>.'
    ],
  },
  {
    day: 21,
    week: 3,
    title: 'Search Across Project (Grep & Grug-Far)',
    concept: '<leader>/ and :%s',
    chapterRef: '06-plugin-mastery-and-ecosystem/04-grug-far-project-search-and-replace.md',
    mission: 'Perform global substitution on all "http:" to "https:" using ":%s/http:/https:/g".',
    initialText: 'const api = "http://api.com";\nconst cdn = "http://cdn.com";',
    cursorStart: { row: 0, col: 0 },
    targetText: 'const api = "https://api.com";\nconst cdn = "https://cdn.com";',
    parKeystrokes: 22,
    optimalKeys: [':', '%', 's', '/', 'h', 't', 't', 'p', ':', '/', 'h', 't', 't', 'p', 's', ':', '/', 'g', 'Enter'],
    hints: [
      'Type ":%s/http:/https:/g" <Enter>.'
    ],
  },

  // ==========================================
  // WEEK 4: Language-Specific Playbooks
  // ==========================================
  {
    day: 22,
    week: 4,
    title: 'TypeScript / React Playbook',
    concept: 'Refactoring Types & Interfaces',
    chapterRef: '04-language-specific-playbooks/01-typescript-javascript-web.md',
    mission: 'Change the role string "viewer" to "admin" using "ci"".',
    initialText: 'const currentUser: UserProfile = {\n  role: "viewer",\n};',
    cursorStart: { row: 1, col: 11 },
    targetText: 'const currentUser: UserProfile = {\n  role: "admin",\n};',
    parKeystrokes: 9,
    optimalKeys: ['c', 'i', '"', 'a', 'd', 'm', 'i', 'n', 'Escape'],
    hints: [
      'Cursor is inside "viewer".',
      'Type "ci\"" -> "admin" -> <Esc>.'
    ],
  },
  {
    day: 23,
    week: 4,
    title: 'Python Development Playbook',
    concept: 'Indentation & Docstrings',
    chapterRef: '04-language-specific-playbooks/02-python-environment-workflow.md',
    mission: 'Indent the function body right using "V" and ">".',
    initialText: 'def calculate_metrics():\nreturn 42',
    cursorStart: { row: 1, col: 0 },
    targetText: 'def calculate_metrics():\n  return 42',
    parKeystrokes: 2,
    optimalKeys: ['V', '>'],
    hints: [
      'Select line 2 with "V".',
      'Press ">" to indent.'
    ],
  },
  {
    day: 24,
    week: 4,
    title: 'Go Development Powerhouse',
    concept: 'Struct Tags & Error Handling',
    chapterRef: '04-language-specific-playbooks/03-go-development-powerhouse.md',
    mission: 'Change the struct tag inside backticks with "ci`" to `json:"user_id"`.',
    initialText: 'type User struct {\n  ID string `json:"old_id"`\n}',
    cursorStart: { row: 1, col: 15 },
    targetText: 'type User struct {\n  ID string `json:"user_id"`\n}',
    parKeystrokes: 18,
    optimalKeys: ['c', 'i', '`', 'j', 's', 'o', 'n', ':', '"', 'u', 's', 'e', 'r', '_', 'i', 'd', '"', 'Escape'],
    hints: [
      'Type "ci`" to wipe inside backticks.',
      'Type json:"user_id" and exit with <Esc>.'
    ],
  },
  {
    day: 25,
    week: 4,
    title: 'Rust Craftsmanship Playbook',
    concept: 'Match Arms & Option Types',
    chapterRef: '04-language-specific-playbooks/04-rust-craftsmanship.md',
    mission: 'Change the unwrap message inside quotes with "ci"" -> "failed to parse".',
    initialText: 'let val = config.get().expect("PANIC_HERE");',
    cursorStart: { row: 0, col: 33 },
    targetText: 'let val = config.get().expect("failed to parse");',
    parKeystrokes: 19,
    optimalKeys: ['c', 'i', '"', 'f', 'a', 'i', 'l', 'e', 'd', ' ', 't', 'o', ' ', 'p', 'a', 'r', 's', 'e', 'Escape'],
    hints: [
      'Type "ci\"" -> "failed to parse" -> <Esc>.'
    ],
  },
  {
    day: 26,
    week: 4,
    title: 'Flutter & Dart Mobile Powerhouse',
    concept: 'Nested Widget Trees',
    chapterRef: '04-language-specific-playbooks/05-flutter-and-dart-mobile.md',
    mission: 'Change widget child inside parens with "ci(" -> "Text(\'Hello Eddie\')".',
    initialText: 'Center(\n  child: Container(),\n)',
    cursorStart: { row: 1, col: 19 },
    targetText: 'Center(\n  child: Container(Text(\'Hello Eddie\')),\n)',
    parKeystrokes: 21,
    optimalKeys: ['i', 'T', 'e', 'x', 't', '(', '\'', 'H', 'e', 'l', 'l', 'o', ' ', 'E', 'd', 'd', 'i', 'e', '\'', ')', 'Escape'],
    hints: [
      'Cursor starts between the parens of Container().',
      'Press "i" to enter Insert mode.',
      'Type Text(\'Hello Eddie\') and exit with <Esc>.'
    ],
  },
  {
    day: 27,
    week: 4,
    title: 'Markdown & Documentation Speedrun',
    concept: 'Rapid list & table manipulation',
    chapterRef: '05-advanced-and-customization/04-30-day-practice-drills.md',
    mission: 'Change unchecked task "[ ]" to checked "[x]" using "f " then "rx".',
    initialText: '- [ ] Complete 30-Day Neovim Mastery',
    cursorStart: { row: 0, col: 0 },
    targetText: '- [x] Complete 30-Day Neovim Mastery',
    parKeystrokes: 4,
    optimalKeys: ['t', ']', 'r', 'x'],
    hints: [
      'Press "t]" to seek till right before the closing bracket (the space).',
      'Type "rx" to replace the space with "x".'
    ],
  },
  {
    day: 28,
    week: 4,
    title: 'Git Workflow & Merge Resolution',
    concept: 'Gitsigns & Hunk Edits',
    chapterRef: '02-navigation-and-project-management/05-git-workflow-and-lazygit.md',
    mission: 'Clean up git conflict: delete the conflict markers on line 1 and line 3 with "dd".',
    initialText: '<<<<<<< HEAD\nconst activeBranch = "feature";\n>>>>>>> main',
    cursorStart: { row: 0, col: 0 },
    targetText: 'const activeBranch = "feature";',
    parKeystrokes: 5,
    optimalKeys: ['d', 'd', 'j', 'd', 'd'],
    hints: [
      'Delete line 1 with "dd".',
      'Move down with "j", then delete line 2 with "dd".'
    ],
  },

  // ==========================================
  // CAPSTONES: Grandmaster Trials
  // ==========================================
  {
    day: 29,
    week: 'Capstone',
    title: 'Vim Golf Par Challenge',
    concept: 'Maximum Efficiency Refactor',
    chapterRef: '05-advanced-and-customization/04-30-day-practice-drills.md',
    mission: 'Golf Challenge! Transform "bad1\\nbad2\\nbad3" into "good" in under 7 keystrokes using "V2jcgood<Esc>".',
    initialText: 'bad1\nbad2\nbad3',
    cursorStart: { row: 0, col: 0 },
    targetText: 'good',
    parKeystrokes: 9,
    optimalKeys: ['V', '2', 'j', 'c', 'g', 'o', 'o', 'd', 'Escape'],
    hints: [
      'Press "V" for Visual Line.',
      'Press "2j" to select all 3 lines.',
      'Press "c" to change them into "good" and press <Esc>.'
    ],
  },
  {
    day: 30,
    week: 'Capstone',
    title: 'Neovim Grandmaster Boss Gauntlet',
    concept: 'Full Fluency & Muscle Memory',
    chapterRef: '05-advanced-and-customization/04-30-day-practice-drills.md',
    mission: 'Final Trial: Wipe "BROKEN_PAYLOAD" with "ci"", insert "READY_FOR_DEPLOYMENT", and save with ":w".',
    initialText: 'const status = "BROKEN_PAYLOAD";',
    cursorStart: { row: 0, col: 25 },
    targetText: 'const status = "READY_FOR_DEPLOYMENT";',
    requiredAction: 'save',
    parKeystrokes: 27,
    optimalKeys: ['c', 'i', '"', 'R', 'E', 'A', 'D', 'Y', '_', 'F', 'O', 'R', '_', 'D', 'E', 'P', 'L', 'O', 'Y', 'M', 'E', 'N', 'T', 'Escape', ':', 'w', 'Enter'],
    hints: [
      'Type "ci\"" to change inside quotes.',
      'Type "READY_FOR_DEPLOYMENT" and press <Esc>.',
      'Type ":w" <Enter> to save and achieve Graduation!'
    ],
  },
];

  try { exports.STAGES = STAGES; } catch(e) {}
  try { exports.API_URL = API_URL; } catch(e) {}
  try { exports.currentUser = currentUser; } catch(e) {}
  try { exports.status = status; } catch(e) {}
  try { exports.fetchUser = fetchUser; } catch(e) {}
  try { exports.test = test; } catch(e) {}
  try { exports.first = first; } catch(e) {}
  try { exports.target = target; } catch(e) {}
  try { exports.oldHandler = oldHandler; } catch(e) {}
  try { exports.handleAuth = handleAuth; } catch(e) {}
  try { exports.sum = sum; } catch(e) {}
});

/* Module: stages/evaluator.js */
defineModule('stages/evaluator.js', function(exports, require, module) {
/**
 * Evaluates whether a stage's goal condition has been met.
 * @param {object} stage
 * @param {import('../editor/vim-engine.js').VimEngine} engine
 * @param {string[]} keystrokes
 * @returns {{ completed: boolean, stars: number, feedback: string, strokes: number, par: number }}
 */
function evaluateStage(stage, engine, keystrokes = []) {
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

  try { exports.evaluateStage = evaluateStage; } catch(e) {}
});

/* Module: ui/renderer.js */
defineModule('ui/renderer.js', function(exports, require, module) {
/**
 * Terminal & Buffer DOM Renderer
 */

function escapeHtml(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Basic syntax highlighter for JS/TS/Go/Python/Rust code lines
 * @param {string} text
 * @returns {string}
 */
function highlightCode(text) {
  if (!text) return ' ';
  const regex = /(\/\/.*$|#.*$)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\b(?:const|let|var|function|def|func|fn|return|if|else|import|export|type|interface|switch|case|package|struct)\b)|(\b(?:string|number|boolean|any|void|Promise|User|UserProfile|int|float|true|false|null|nil|None)\b)/g;

  let lastIndex = 0;
  let out = '';
  let m;

  while ((m = regex.exec(text)) !== null) {
    if (m.index > lastIndex) {
      out += escapeHtml(text.slice(lastIndex, m.index));
    }
    const [full, comment, str, kw, type] = m;
    if (comment) {
      out += `<span class="syn-comment">${escapeHtml(comment)}</span>`;
    } else if (str) {
      out += `<span class="syn-string">${escapeHtml(str)}</span>`;
    } else if (kw) {
      out += `<span class="syn-keyword">${escapeHtml(kw)}</span>`;
    } else if (type) {
      out += `<span class="syn-type">${escapeHtml(type)}</span>`;
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    out += escapeHtml(text.slice(lastIndex));
  }
  return out || ' ';
}

/**
 * Renders the editor buffer into container element
 * @param {HTMLElement} container
 * @param {import('../editor/vim-engine.js').VimEngine} engine
 * @param {import('../editor/buffer.js').TextBuffer} buffer
 */
function renderBuffer(container, engine, buffer) {
  if (!container) return;
  const lines = buffer.getLines();
  const cur = buffer.getCursor();
  const mode = engine.getMode();

  let html = '';

  for (let r = 0; r < lines.length; r++) {
    const isCurrentLine = r === cur.row;
    const lineClass = isCurrentLine ? 'buffer-line active-line' : 'buffer-line';

    // Hybrid line numbers (relative + absolute on current)
    const lineNum = isCurrentLine ? `${r + 1}` : `${Math.abs(r - cur.row)}`;

    const rawLine = lines[r];
    let lineRendered = '';

    // Check if line contains flash targets
    const lineFlashTargets = (engine.flashTargets || []).filter(t => t.row === r);

    // Visual selection range calculation
    let isLineSelected = false;
    let selStartCol = -1;
    let selEndCol = -1;

    if (mode === 'VISUAL_LINE' && engine.visualStart) {
      const minRow = Math.min(engine.visualStart.row, cur.row);
      const maxRow = Math.max(engine.visualStart.row, cur.row);
      if (r >= minRow && r <= maxRow) {
        isLineSelected = true;
      }
    } else if (mode === 'VISUAL' && engine.visualStart) {
      const vs = engine.visualStart;
      const minRow = Math.min(vs.row, cur.row);
      const maxRow = Math.max(vs.row, cur.row);

      if (r >= minRow && r <= maxRow) {
        if (vs.row === cur.row) {
          selStartCol = Math.min(vs.col, cur.col);
          selEndCol = Math.max(vs.col, cur.col);
        } else if (r === minRow) {
          const startCol = vs.row === minRow ? vs.col : cur.col;
          selStartCol = startCol;
          selEndCol = rawLine.length;
        } else if (r === maxRow) {
          const endCol = vs.row === maxRow ? vs.col : cur.col;
          selStartCol = 0;
          selEndCol = endCol;
        } else {
          isLineSelected = true;
        }
      }
    }

    if (lineFlashTargets.length > 0) {
      // Render line with flash target labels
      let lastIdx = 0;
      for (const t of lineFlashTargets) {
        lineRendered += escapeHtml(rawLine.slice(lastIdx, t.col));
        lineRendered += `<span class="flash-label">${escapeHtml(t.label)}</span>`;
        lastIdx = t.col + 1;
      }
      lineRendered += escapeHtml(rawLine.slice(lastIdx));
    } else if (isLineSelected) {
      lineRendered = `<span class="visual-selection">${escapeHtml(rawLine || ' ')}</span>`;
    } else if (selStartCol !== -1 && selEndCol !== -1) {
      const before = escapeHtml(rawLine.slice(0, selStartCol));
      const selected = escapeHtml(rawLine.slice(selStartCol, selEndCol + 1) || ' ');
      const after = escapeHtml(rawLine.slice(selEndCol + 1));
      lineRendered = `${before}<span class="visual-selection">${selected}</span>${after}`;
    } else if (isCurrentLine) {
      // Render cursor
      const cursorCol = cur.col;
      const before = escapeHtml(rawLine.slice(0, cursorCol));
      const cursorChar = rawLine[cursorCol] || ' ';
      const after = escapeHtml(rawLine.slice(cursorCol + 1));

      let cursorClass = 'vim-cursor cursor-normal';
      if (mode === 'INSERT') cursorClass = 'vim-cursor cursor-insert';
      if (mode === 'VISUAL') cursorClass = 'vim-cursor cursor-visual';

      lineRendered = `${before}<span class="${cursorClass}">${escapeHtml(cursorChar)}</span>${after}`;
    } else {
      lineRendered = highlightCode(rawLine) || ' ';
    }

    html += `<div class="${lineClass}">
      <span class="line-num">${lineNum}</span>
      <span class="line-content">${lineRendered}</span>
    </div>`;
  }

  container.innerHTML = html;
}

/**
 * Renders the Neovim command-line bar below the statusline
 * @param {HTMLElement} container
 * @param {import('../editor/vim-engine.js').VimEngine} engine
 * @param {string} feedback
 */
function renderCmdline(container, engine, feedback = '') {
  if (!container) return;

  const mode = engine.getMode();
  if (mode === 'COMMAND') {
    const cmd = engine.commandLine || ':';
    const promptChar = cmd[0] || ':';
    const rest = cmd.slice(1);
    container.innerHTML = `<span class="cmd-prompt">${promptChar}</span><span class="cmd-text">${escapeHtml(rest)}</span><span class="vim-cursor cursor-normal">&nbsp;</span>`;
    container.className = 'cmdline-bar active';
  } else if (feedback) {
    container.innerHTML = `<span class="cmd-feedback">${escapeHtml(feedback)}</span>`;
    container.className = 'cmdline-bar';
  } else {
    container.innerHTML = `<span class="cmd-feedback-placeholder"></span>`;
    container.className = 'cmdline-bar';
  }
}


  try { exports.escapeHtml = escapeHtml; } catch(e) {}
  try { exports.highlightCode = highlightCode; } catch(e) {}
  try { exports.renderBuffer = renderBuffer; } catch(e) {}
  try { exports.renderCmdline = renderCmdline; } catch(e) {}
});

/* Module: ui/statusline.js */
defineModule('ui/statusline.js', function(exports, require, module) {
/**
 * Tokyo Night Lualine-style Statusline Renderer
 */

/**
 * @param {HTMLElement} container
 * @param {import('../editor/vim-engine.js').VimEngine} engine
 * @param {object} [stageInfo]
 */
function renderStatusline(container, engine, stageInfo = {}) {
  if (!container) return;

  const mode = engine.getMode();
  const cur = engine.buffer.getCursor();
  const lines = engine.buffer.getLines();
  const totalLines = lines.length;

  const rowDisplay = cur.row + 1;
  const colDisplay = cur.col + 1;

  let posPercent = 'Top';
  if (totalLines > 1) {
    if (cur.row === 0) posPercent = 'Top';
    else if (cur.row === totalLines - 1) posPercent = 'Bot';
    else posPercent = `${Math.round((cur.row / (totalLines - 1)) * 100)}%`;
  }

  const stageLabel = stageInfo.day
    ? `Day ${stageInfo.day}: ${stageInfo.title || 'Practice'}`
    : 'Neovim Mastery Sandbox';

  container.innerHTML = `
    <div class="status-left">
      <div class="status-mode ${mode}">${mode}</div>
      <div class="status-item status-branch">
        <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
          <path fill-rule="evenodd" d="M11.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122V6A2.5 2.5 0 0110 8.5H6a1 1 0 00-1 1v1.128a2.251 2.251 0 11-1.5 0V5.372a2.25 2.25 0 111.5 0v1.836A2.492 2.492 0 016 7h4a1 1 0 001-1v-.628A2.25 2.25 0 019.5 3.25zM4.25 12a.75.75 0 100 1.5.75.75 0 000-1.5zM3.5 3.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0z"/>
        </svg>
        main
      </div>
      <div class="status-item">${stageLabel}</div>
    </div>
    <div class="status-right">
      <div class="status-item">utf-8</div>
      <div class="status-position">${rowDisplay}:${colDisplay} [${posPercent}]</div>
    </div>
  `;
}

  try { exports.renderStatusline = renderStatusline; } catch(e) {}
});

/* Module: ui/hud.js */
defineModule('ui/hud.js', function(exports, require, module) {
/**
 * Keystroke HUD and Explanation Dictionary
 */

const KEY_EXPLANATIONS = {
  'h': 'Move Left',
  'j': 'Move Down',
  'k': 'Move Up',
  'l': 'Move Right',
  'w': 'Next word start',
  'b': 'Previous word start',
  'e': 'Next word end',
  'ge': 'Previous word end',
  '0': 'Beginning of line (col 0)',
  '^': 'First non-blank character',
  '$': 'End of line',
  'i': 'Enter Insert mode (before cursor)',
  'I': 'Enter Insert mode (at line start)',
  'a': 'Enter Insert mode (after cursor)',
  'A': 'Enter Insert mode (at line end)',
  'o': 'Open line below and insert',
  'O': 'Open line above and insert',
  'x': 'Delete character under cursor',
  'X': 'Delete character before cursor',
  'dd': 'Delete (cut) line',
  'cc': 'Change line (delete & insert)',
  'yy': 'Yank (copy) line',
  'p': 'Put (paste) after cursor / line below',
  'P': 'Put (paste) before cursor / line above',
  'u': 'Undo last change',
  '<C-r>': 'Redo change',
  '.': 'Repeat last change',
  'J': 'Join lines',
  'v': 'Enter Visual character mode',
  'V': 'Enter Visual line mode',
  's': 'Flash: 2-keystroke jump',
  ':w': 'Save / write file',
  ':q': 'Quit editor',
  'ciw': 'Change inner word',
  'caw': 'Change around word',
  'diw': 'Delete inner word',
  'daw': 'Delete around word',
  'ci"': 'Change inside double quotes',
  'di"': 'Delete inside double quotes',
  'ci\'': 'Change inside single quotes',
  'di\'': 'Delete inside single quotes',
  'ci(': 'Change inside parentheses',
  'di(': 'Delete inside parentheses',
  'ci{': 'Change inside braces',
  'di{': 'Delete inside braces',
  'dia': 'Mini.ai: Delete inner argument',
  ']m': 'Treesitter: Next function start',
  '[m': 'Treesitter: Previous function start',
  ']d': 'Next diagnostic error',
  '[d': 'Previous diagnostic error',
  'gd': 'LSP: Go to definition',
  'gr': 'LSP: Go to references',
  'K': 'LSP: Hover documentation',
};

/**
 * Updates the HUD elements
 * @param {HTMLElement} hudEl
 * @param {string[]} keystrokes
 * @param {number} par
 * @param {string} lastActionMsg
 */
function renderHUD(hudEl, keystrokes = [], par = 10, lastActionMsg = '') {
  if (!hudEl) return;

  const count = keystrokes.length;
  const recent = keystrokes.slice(-4).join(' ');
  const fullSeq = keystrokes.slice(-3).join('');
  const explanation = KEY_EXPLANATIONS[fullSeq] || KEY_EXPLANATIONS[keystrokes[keystrokes.length - 1]] || '';

  hudEl.innerHTML = `
    <div class="hud-keys">
      <span style="color: var(--tn-comment); font-size: 11px;">KEYS:</span>
      <span class="key-badge">${recent ? escapeHtml(recent) : 'Ready'}</span>
      ${explanation ? `<span class="hud-message">${escapeHtml(explanation)}</span>` : ''}
    </div>
    <div class="hud-stats" style="display: flex; gap: 14px; font-size: 12px;">
      <span style="color: var(--tn-fg-dark);">${lastActionMsg ? escapeHtml(lastActionMsg) : ''}</span>
      <span style="color: ${count <= par ? 'var(--tn-green)' : 'var(--tn-yellow)'}; font-weight: 700;">
        Strokes: ${count} / Par: ${par}
      </span>
    </div>
  `;
}

function escapeHtml(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

  try { exports.KEY_EXPLANATIONS = KEY_EXPLANATIONS; } catch(e) {}
  try { exports.renderHUD = renderHUD; } catch(e) {}
  try { exports.escapeHtml = escapeHtml; } catch(e) {}
});

/* Module: ui/diff-viewer.js */
defineModule('ui/diff-viewer.js', function(exports, require, module) {
/**
 * Computes line-by-line diff between current buffer and target text.
 * @param {string} currentText
 * @param {string} targetText
 * @returns {{ matches: boolean, lines: Array<{ type: 'match'|'diff'|'missing'|'extra', current?: string, target?: string }> }}
 */
function computeTextDiff(currentText = '', targetText = '') {
  const curLines = currentText.replace(/\r\n/g, '\n').split('\n');
  const targetLines = targetText.replace(/\r\n/g, '\n').split('\n');

  const maxLines = Math.max(curLines.length, targetLines.length);
  const diffLines = [];
  let matches = true;

  for (let i = 0; i < maxLines; i++) {
    const cur = curLines[i];
    const tgt = targetLines[i];

    if (cur === tgt) {
      diffLines.push({ type: 'match', current: cur, target: tgt });
    } else if (cur === undefined) {
      matches = false;
      diffLines.push({ type: 'missing', target: tgt });
    } else if (tgt === undefined) {
      matches = false;
      diffLines.push({ type: 'extra', current: cur });
    } else {
      matches = false;
      diffLines.push({ type: 'diff', current: cur, target: tgt });
    }
  }

  return { matches, lines: diffLines };
}

/**
 * Renders target diff preview into container
 * @param {HTMLElement} container
 * @param {string} currentText
 * @param {string} targetText
 */
function renderDiffViewer(container, currentText, targetText) {
  if (!container) return;
  const { matches, lines } = computeTextDiff(currentText, targetText);

  let html = '';
  lines.forEach((l, idx) => {
    if (l.type === 'match') {
      html += `<div class="diff-line diff-match">✓ ${escapeHtml(l.target)}</div>`;
    } else if (l.type === 'missing') {
      html += `<div class="diff-line diff-missing">+ ${escapeHtml(l.target)} (missing)</div>`;
    } else if (l.type === 'extra') {
      html += `<div class="diff-line diff-unwanted">- ${escapeHtml(l.current)} (extra)</div>`;
    } else {
      html += `<div class="diff-line diff-diff">
        <span class="diff-unwanted">- ${escapeHtml(l.current)}</span><br>
        <span class="diff-match">+ ${escapeHtml(l.target)}</span>
      </div>`;
    }
  });

  container.innerHTML = html;
}

function escapeHtml(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

  try { exports.computeTextDiff = computeTextDiff; } catch(e) {}
  try { exports.renderDiffViewer = renderDiffViewer; } catch(e) {}
  try { exports.escapeHtml = escapeHtml; } catch(e) {}
});

/* Module: ui/which-key.js */
defineModule('ui/which-key.js', function(exports, require, module) {
/**
 * Which-Key Visual Helper Drawer
 */

const WHICH_KEY_ENTRIES = [
  { key: 'h/j/k/l', desc: 'Left / Down / Up / Right' },
  { key: 'w / b / e', desc: 'Next / Prev / End of Word' },
  { key: '0 / ^ / $', desc: 'Col 0 / First Non-blank / End of Line' },
  { key: 'gg / G', desc: 'Top / Bottom of File' },
  { key: 'f{c} / t{c}', desc: 'Find / Till Char on Line' },
  { key: '; / ,', desc: 'Repeat Seek / Reverse' },
  { key: 'ci" / di"', desc: 'Change / Delete Inside Quotes' },
  { key: 'ci( / di(', desc: 'Change / Delete Inside Parens' },
  { key: 'ci{ / di{', desc: 'Change / Delete Inside Braces' },
  { key: 'dd / cc / yy', desc: 'Delete / Change / Yank Line' },
  { key: 'p / P', desc: 'Paste After / Before' },
  { key: 'u / <C-r>', desc: 'Undo / Redo' },
  { key: '.', desc: 'Repeat Last Change' },
  { key: 's', desc: 'Flash 2-char Teleport' },
  { key: ']m / [m', desc: 'Treesitter AST Hop' },
  { key: ']d / [d', desc: 'Next / Prev Diagnostic' },
  { key: ':w / :q', desc: 'Write / Quit' },
  { key: ':%s/a/b/g', desc: 'Global Substitute' },
];

/**
 * @param {HTMLElement} drawerEl
 * @param {boolean} [show]
 */
function toggleWhichKey(drawerEl, show) {
  if (!drawerEl) return;
  const isVisible = show !== undefined ? show : !drawerEl.classList.contains('visible');

  if (isVisible) {
    let items = WHICH_KEY_ENTRIES.map(
      e => `<div class="which-key-item">
        <span class="which-key-key">${escapeHtml(e.key)}</span>
        <span class="which-key-desc">${escapeHtml(e.desc)}</span>
      </div>`
    ).join('');
    drawerEl.innerHTML = items;
    drawerEl.classList.add('visible');
  } else {
    drawerEl.classList.remove('visible');
  }
}

function escapeHtml(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

  try { exports.WHICH_KEY_ENTRIES = WHICH_KEY_ENTRIES; } catch(e) {}
  try { exports.toggleWhichKey = toggleWhichKey; } catch(e) {}
  try { exports.escapeHtml = escapeHtml; } catch(e) {}
});

/* Module: ui/audio.js */
defineModule('ui/audio.js', function(exports, require, module) {
/**
 * SoundFX: Pure Web Audio API Synthesizer
 * Generates all mechanical keyboard clicks and fanfares without external audio files.
 */
class SoundFX {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return;
    }
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        if (this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {});
        }
      }
    } catch {
      this.ctx = null;
    }
  }

  isMuted() {
    return this.muted;
  }

  setMuted(muted) {
    this.muted = !!muted;
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  /**
   * Subtle mechanical key click
   */
  playKeypress() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.03);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.03);
    } catch {
      // Ignore audio context autoplay restrictions
    }
  }

  /**
   * Cheerful success chime
   */
  playSuccess() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const now = this.ctx.currentTime + idx * 0.08;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.25);
      });
    } catch {}
  }

  /**
   * Gentle error tone
   */
  playError() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(90, now + 0.15);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {}
  }

  /**
   * Triumphant level complete fanfare
   */
  playLevelComplete() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const notes = [
        { f: 523.25, d: 0.12 }, // C5
        { f: 659.25, d: 0.12 }, // E5
        { f: 783.99, d: 0.12 }, // G5
        { f: 1046.5, d: 0.35 }, // C6
      ];
      let offset = 0;
      notes.forEach(note => {
        const now = this.ctx.currentTime + offset;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, now);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + note.d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + note.d);
        offset += note.d * 0.9;
      });
    } catch {}
  }
}

  try { exports.SoundFX = SoundFX; } catch(e) {}
});

/* Module: ui/modal.js */
defineModule('ui/modal.js', function(exports, require, module) {
/**
 * Game Modals: Stage Select & Victory Celebration
 */

/**
 * Renders the 30-Day Stage Map Modal
 */
function renderStageSelectModal(container, stages, gameState, onSelectStage) {
  if (!container) return;

  const cardHtml = stages.map(s => {
    const isUnlocked = gameState.isDayUnlocked(s.day);
    const stars = gameState.getStageStars(s.day);
    const isActive = gameState.currentDay === s.day;

    let starIcons = '';
    if (isUnlocked) {
      if (stars === 3) starIcons = '⭐⭐⭐';
      else if (stars === 2) starIcons = '⭐⭐';
      else if (stars === 1) starIcons = '⭐';
      else starIcons = '<span style="color: var(--tn-dark3)">☆☆☆</span>';
    } else {
      starIcons = '🔒 Locked';
    }

    const itemClass = `stage-btn ${isActive ? 'active' : ''} ${!isUnlocked ? 'locked' : ''}`;

    return `
      <div class="${itemClass}" data-day="${s.day}">
        <div class="day-label">Day ${s.day}</div>
        <div style="font-size: 10px; color: var(--tn-comment); margin: 2px 0;">${escapeHtml(s.title)}</div>
        <div class="stars">${starIcons}</div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="modal-card" style="max-width: 720px;">
      <div class="modal-header">
        <div class="modal-title">🗺️ The 30-Day Neovim Dojo Map</div>
        <button class="btn btn-close" id="modal-close-btn">✕</button>
      </div>
      <div class="modal-body">
        <div style="color: var(--tn-fg-dark); font-size: 13px; margin-bottom: 12px;">
          Select any unlocked stage to deliberate practice. Earn 3 Gold Stars by completing challenges at or under Par!
        </div>
        <div class="stage-grid">${cardHtml}</div>
      </div>
      <div class="modal-footer">
        <button class="btn" id="modal-cancel-btn">Close</button>
      </div>
    </div>
  `;

  container.classList.add('open');

  // Bind clicks
  container.querySelectorAll('.stage-btn:not(.locked)').forEach(btn => {
    btn.addEventListener('click', () => {
      const day = parseInt(btn.getAttribute('data-day'), 10);
      container.classList.remove('open');
      if (onSelectStage) onSelectStage(day);
    });
  });

  const closeHandler = () => container.classList.remove('open');
  container.querySelector('#modal-close-btn')?.addEventListener('click', closeHandler);
  container.querySelector('#modal-cancel-btn')?.addEventListener('click', closeHandler);
}

/**
 * Renders the Stage Victory Modal
 */
function renderVictoryModal(container, stage, evaluation, onNext, onReplay) {
  if (!container) return;

  const starsDisplay = '⭐'.repeat(evaluation.stars) + '☆'.repeat(3 - evaluation.stars);
  const chapterLink = `../${stage.chapterRef}`;

  container.innerHTML = `
    <div class="modal-card" style="max-width: 480px; text-align: center;">
      <div class="modal-header" style="justify-content: center; background: transparent;">
        <div class="modal-title" style="font-size: 20px;">🎉 Day ${stage.day} Mastered!</div>
      </div>
      <div class="modal-body" style="padding: 10px 24px;">
        <div style="font-size: 38px; margin: 12px 0; letter-spacing: 4px;">${starsDisplay}</div>
        <div style="font-size: 15px; color: var(--tn-cyan); font-weight: 600; margin-bottom: 8px;">
          ${escapeHtml(evaluation.feedback)}
        </div>
        <div style="font-size: 13px; color: var(--tn-fg-dark); margin-bottom: 16px;">
          Keystrokes: <b>${evaluation.strokes}</b> | Target Par: <b>${stage.parKeystrokes}</b>
        </div>
        <div style="background-color: var(--tn-bg-dark); padding: 12px; border-radius: 6px; font-size: 12px; text-align: left; margin-bottom: 16px;">
          <div style="color: var(--tn-purple); font-weight: 600; margin-bottom: 4px;">📖 Companion Chapter:</div>
          <a href="${chapterLink}" target="_blank" style="color: var(--tn-blue); text-decoration: none;">
            ${escapeHtml(stage.chapterRef)} ↗
          </a>
        </div>
      </div>
        <div style="display: flex; gap: 8px; justify-content: center; width: 100%;">
          <button class="btn" id="victory-replay-btn">🔄 Replay (r)</button>
          ${stage.day < 30 ? '<button class="btn btn-primary" id="victory-next-btn">Next Day ➔ (Enter)</button>' : '<button class="btn btn-primary" id="victory-next-btn">🏆 View Map (Enter)</button>'}
        </div>
        <div style="font-size: 11px; color: var(--tn-fg-dark); margin-top: 8px; width: 100%;">
          Press <kbd style="background: var(--tn-bg-highlight); padding: 2px 5px; border-radius: 3px; color: var(--tn-fg);">Enter</kbd> to proceed, <kbd style="background: var(--tn-bg-highlight); padding: 2px 5px; border-radius: 3px; color: var(--tn-fg);">r</kbd> to replay, <kbd style="background: var(--tn-bg-highlight); padding: 2px 5px; border-radius: 3px; color: var(--tn-fg);">Esc</kbd> to close
        </div>
      </div>
    </div>
  `;

  container.classList.add('open');

  container.querySelector('#victory-replay-btn')?.addEventListener('click', (e) => {
    e.currentTarget?.blur();
    container.classList.remove('open');
    if (onReplay) onReplay();
  });

  container.querySelector('#victory-next-btn')?.addEventListener('click', (e) => {
    e.currentTarget?.blur();
    container.classList.remove('open');
    if (onNext) onNext();
  });

  container.onclick = (e) => {
    if (e.target === container) {
      container.classList.remove('open');
    }
  };
}

function escapeHtml(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

  try { exports.renderStageSelectModal = renderStageSelectModal; } catch(e) {}
  try { exports.renderVictoryModal = renderVictoryModal; } catch(e) {}
  try { exports.escapeHtml = escapeHtml; } catch(e) {}
});

/* Module: state.js */
defineModule('state.js', function(exports, require, module) {
/**
 * GameState: Manages user progress, scores, unlocked stages, and preferences.
 */
const STORAGE_KEY = 'neovim_mastery_dojo_state';

class GameState {
  constructor() {
    this.currentDay = 1;
    this.unlockedDays = [1];
    this.starsByDay = {};
    this.bestStrokesByDay = {};
    this.isMuted = false;
    this.sandboxMode = false;
    this.load();
  }

  load() {
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const data = JSON.parse(raw);
          this.currentDay = data.currentDay || 1;
          this.unlockedDays = Array.isArray(data.unlockedDays) ? data.unlockedDays : [1];
          this.starsByDay = data.starsByDay || {};
          this.bestStrokesByDay = data.bestStrokesByDay || {};
          this.isMuted = !!data.isMuted;
        }
      }
    } catch {}
  }

  save() {
    try {
      if (typeof localStorage !== 'undefined') {
        const data = {
          currentDay: this.currentDay,
          unlockedDays: this.unlockedDays,
          starsByDay: this.starsByDay,
          bestStrokesByDay: this.bestStrokesByDay,
          isMuted: this.isMuted,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
    } catch {}
  }

  isDayUnlocked(day) {
    return this.unlockedDays.includes(day);
  }

  unlockDay(day) {
    if (!this.unlockedDays.includes(day)) {
      this.unlockedDays.push(day);
      this.save();
    }
  }

  getStageStars(day) {
    return this.starsByDay[day] || 0;
  }

  getBestStrokes(day) {
    return this.bestStrokesByDay[day] || null;
  }

  recordStageResult(day, stars, strokes) {
    const prevStars = this.starsByDay[day] || 0;
    if (stars > prevStars) {
      this.starsByDay[day] = stars;
    }

    const prevBest = this.bestStrokesByDay[day];
    if (prevBest === undefined || strokes < prevBest) {
      this.bestStrokesByDay[day] = strokes;
    }

    // Unlock next day
    if (day < 30) {
      this.unlockDay(day + 1);
    }

    this.save();
  }

  resetProgress() {
    this.currentDay = 1;
    this.unlockedDays = [1];
    this.starsByDay = {};
    this.bestStrokesByDay = {};
    this.save();
  }
}

  try { exports.GameState = GameState; } catch(e) {}
});

/* Module: app.js */
defineModule('app.js', function(exports, require, module) {
const { TextBuffer } = require('./editor/buffer.js');
const { VimEngine } = require('./editor/vim-engine.js');
const { STAGES } = require('./stages/curriculum.js');
const { evaluateStage } = require('./stages/evaluator.js');
const { renderBuffer, renderCmdline } = require('./ui/renderer.js');
const { renderStatusline } = require('./ui/statusline.js');
const { renderHUD } = require('./ui/hud.js');
const { renderDiffViewer } = require('./ui/diff-viewer.js');
const { toggleWhichKey } = require('./ui/which-key.js');
const { SoundFX } = require('./ui/audio.js');
const { renderStageSelectModal, renderVictoryModal } = require('./ui/modal.js');
const { GameState } = require('./state.js');

class App {
  constructor() {
    this.state = new GameState();
    this.sound = new SoundFX();
    this.sound.setMuted(this.state.isMuted);

    this.currentStage = null;
    this.buffer = null;
    this.engine = null;
    this.keystrokes = [];
    this.stageCompleted = false;
    this.lastFeedback = '';
    this.activeHintIndex = 0;

    // DOM cache
    this.dom = {
      editorViewport: document.getElementById('editor-viewport'),
      statusline: document.getElementById('statusline'),
      cmdlineBar: document.getElementById('cmdline-bar'),
      hud: document.getElementById('keystroke-hud'),
      diffBox: document.getElementById('diff-box'),
      whichKeyDrawer: document.getElementById('which-key-drawer'),
      modalOverlay: document.getElementById('modal-overlay'),
      missionBadge: document.getElementById('mission-badge'),
      missionTitle: document.getElementById('mission-title'),
      missionConcept: document.getElementById('mission-concept'),
      missionDesc: document.getElementById('mission-desc'),
      statPar: document.getElementById('stat-par'),
      statStrokes: document.getElementById('stat-strokes'),
      statStars: document.getElementById('stat-stars'),
      btnHint: document.getElementById('btn-hint'),
      btnReset: document.getElementById('btn-reset'),
      btnMap: document.getElementById('btn-map'),
      btnWhichKey: document.getElementById('btn-which-key'),
      btnAudio: document.getElementById('btn-audio'),
      btnSandbox: document.getElementById('btn-sandbox'),
    };
  }

  init() {
    this.bindEvents();
    this.loadStage(this.state.currentDay);
    this.updateAudioButton();
  }

  loadStage(dayNumber) {
    const stage = STAGES.find(s => s.day === dayNumber) || STAGES[0];
    this.currentStage = stage;
    this.state.currentDay = stage.day;
    this.state.save();

    this.keystrokes = [];
    this.stageCompleted = false;
    this.lastFeedback = '';
    this.activeHintIndex = 0;

    this.buffer = new TextBuffer(stage.initialText);
    this.engine = new VimEngine(this.buffer);

    if (stage.setup) {
      stage.setup(this.engine);
    } else if (stage.cursorStart) {
      this.buffer.setCursor(stage.cursorStart.row, stage.cursorStart.col);
    }

    this.updateMissionUI();
    this.render();
  }

  loadSandbox() {
    this.currentStage = {
      day: null,
      week: 'Free Play',
      title: 'Free Sandbox Mode',
      concept: 'Open Workspace for Experimentation',
      mission: 'Test any Vim motions, operators, text objects, search patterns, or counts freely.',
      initialText: '// Neovim Dojo Sandbox\n// Practice any commands:\nconst message = "Hello from Tokyo Night!";\nfunction demo(a, b) {\n  return a + b;\n}',
      parKeystrokes: 999,
      targetText: '',
      hints: ['Type "i" for Insert mode, <Esc> for Normal mode, ":" for commands.'],
      chapterRef: 'README.md',
    };
    this.keystrokes = [];
    this.stageCompleted = false;
    this.buffer = new TextBuffer(this.currentStage.initialText);
    this.engine = new VimEngine(this.buffer);
    this.updateMissionUI();
    this.render();
  }

  updateMissionUI() {
    const s = this.currentStage;
    if (this.dom.missionBadge) {
      this.dom.missionBadge.textContent = s.day ? `Day ${s.day} • Week ${s.week}` : 'Sandbox';
    }
    if (this.dom.missionTitle) this.dom.missionTitle.textContent = s.title;
    if (this.dom.missionConcept) this.dom.missionConcept.textContent = `🎯 ${s.concept}`;
    if (this.dom.missionDesc) this.dom.missionDesc.textContent = s.mission;
    if (this.dom.statPar) this.dom.statPar.textContent = s.parKeystrokes || '-';
    if (this.dom.statStrokes) this.dom.statStrokes.textContent = '0';

    const stars = this.state.getStageStars(s.day);
    if (this.dom.statStars) {
      this.dom.statStars.textContent = stars > 0 ? '⭐'.repeat(stars) : '☆☆☆';
    }
  }

  bindEvents() {
    window.addEventListener('keydown', e => this.handleKeydown(e));

    this.dom.btnHint?.addEventListener('click', (e) => {
      e.currentTarget?.blur();
      this.showHint();
    });
    this.dom.btnReset?.addEventListener('click', (e) => {
      e.currentTarget?.blur();
      this.loadStage(this.currentStage.day || 1);
    });
    this.dom.btnMap?.addEventListener('click', (e) => {
      e.currentTarget?.blur();
      renderStageSelectModal(
        this.dom.modalOverlay,
        STAGES,
        this.state,
        day => this.loadStage(day)
      );
    });
    this.dom.btnWhichKey?.addEventListener('click', (e) => {
      e.currentTarget?.blur();
      toggleWhichKey(this.dom.whichKeyDrawer);
    });
    this.dom.btnAudio?.addEventListener('click', (e) => {
      e.currentTarget?.blur();
      const muted = this.sound.toggleMute();
      this.state.isMuted = muted;
      this.state.save();
      this.updateAudioButton();
    });
    this.dom.btnSandbox?.addEventListener('click', (e) => {
      e.currentTarget?.blur();
      if (this.currentStage.day) {
        this.loadSandbox();
        this.dom.btnSandbox.textContent = 'Exit Sandbox';
      } else {
        this.loadStage(this.state.currentDay);
        this.dom.btnSandbox.textContent = 'Sandbox';
      }
    });
  }

  updateAudioButton() {
    if (this.dom.btnAudio) {
      this.dom.btnAudio.innerHTML = this.sound.isMuted() ? '🔇 Unmute' : '🔊 Sound: ON';
    }
  }

  showHint() {
    if (!this.currentStage.hints || this.currentStage.hints.length === 0) return;
    const hint = this.currentStage.hints[this.activeHintIndex % this.currentStage.hints.length];
    this.lastFeedback = `💡 Hint (${(this.activeHintIndex % this.currentStage.hints.length) + 1}/${this.currentStage.hints.length}): ${hint}`;
    this.activeHintIndex++;
    this.render();
  }

  handleKeydown(e) {
    // If modal is open, handle modal keyboard controls
    if (this.dom.modalOverlay?.classList.contains('open')) {
      if (e.key === 'Escape') {
        this.dom.modalOverlay.classList.remove('open');
      } else if (e.key === 'Enter') {
        const nextBtn = this.dom.modalOverlay.querySelector('#victory-next-btn') ||
                        this.dom.modalOverlay.querySelector('.btn-primary');
        if (nextBtn) {
          nextBtn.click();
        } else {
          this.dom.modalOverlay.classList.remove('open');
        }
      } else if (e.key === 'r' || e.key === 'R') {
        const replayBtn = this.dom.modalOverlay.querySelector('#victory-replay-btn');
        if (replayBtn) replayBtn.click();
      }
      return;
    }

    // Ignore standalone modifier keys to avoid false error beeps
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'NumLock', 'ScrollLock'].includes(e.key)) {
      return;
    }

    // Pass through browser devtools and standard Mac system shortcuts
    if (e.key === 'F12' || (e.metaKey && ['r', 'R', 'l', 'w', 'q', 'c', 'v', 'a', 'x', 'z'].includes(e.key))) {
      return;
    }

    // Advance to next day on Enter if current stage was completed and dismissed
    if (this.stageCompleted && e.key === 'Enter' && this.engine.getMode() === 'NORMAL') {
      if (this.currentStage.day && this.currentStage.day < 30) {
        this.loadStage(this.currentStage.day + 1);
      } else {
        renderStageSelectModal(
          this.dom.modalOverlay,
          STAGES,
          this.state,
          day => this.loadStage(day)
        );
      }
      return;
    }

    // Intercept common browser hotkeys that collide with Vim
    const blocked = ['Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    if (blocked.includes(e.key) || (e.ctrlKey && ['s', 'r', 'd', 'u', 'w', 'b', 'f'].includes(e.key.toLowerCase()))) {
      e.preventDefault();
    }

    let vimKey = e.key;
    if (e.ctrlKey) {
      vimKey = `<C-${e.key.toLowerCase()}>`;
    }

    const result = this.engine.handleKey(vimKey);

    if (result.handled) {
      this.sound.playKeypress();
      this.keystrokes.push(vimKey);
      if (result.feedback) {
        this.lastFeedback = result.feedback;
      }
    } else {
      this.sound.playError();
    }

    this.render();

    // Check completion if in stage mode
    if (this.currentStage.day && !this.stageCompleted) {
      const evaluation = evaluateStage(this.currentStage, this.engine, this.keystrokes);
      if (evaluation.completed) {
        this.stageCompleted = true;
        this.sound.playLevelComplete();
        this.state.recordStageResult(this.currentStage.day, evaluation.stars, evaluation.strokes);

        setTimeout(() => {
          renderVictoryModal(
            this.dom.modalOverlay,
            this.currentStage,
            evaluation,
            () => {
              if (this.currentStage.day < 30) {
                this.loadStage(this.currentStage.day + 1);
              } else {
                renderStageSelectModal(
                  this.dom.modalOverlay,
                  STAGES,
                  this.state,
                  day => this.loadStage(day)
                );
              }
            },
            () => this.loadStage(this.currentStage.day)
          );
        }, 300);
      }
    }
  }

  render() {
    renderBuffer(this.dom.editorViewport, this.engine, this.buffer);
    renderStatusline(this.dom.statusline, this.engine, this.currentStage);
    renderCmdline(this.dom.cmdlineBar, this.engine, this.lastFeedback);
    renderHUD(this.dom.hud, this.keystrokes, this.currentStage.parKeystrokes, this.lastFeedback);

    if (this.currentStage.targetText) {
      renderDiffViewer(this.dom.diffBox, this.buffer.getText(), this.currentStage.targetText);
    } else if (this.dom.diffBox) {
      this.dom.diffBox.innerHTML = '<div style="color: var(--tn-comment)">Sandbox: free typing area</div>';
    }

    if (this.dom.statStrokes) {
      this.dom.statStrokes.textContent = `${this.keystrokes.length}`;
    }
  }
}

// Auto-boot if running in browser
if (typeof window !== 'undefined') {
  const boot = () => {
    if (window.__vim_app) return;
    const app = new App();
    app.init();
    window.__vim_app = app;
  };
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
}

  try { exports.demo = demo; } catch(e) {}
  try { exports.App = App; } catch(e) {}
});

  // Start the application
  requireModule('', 'app.js');
})();
