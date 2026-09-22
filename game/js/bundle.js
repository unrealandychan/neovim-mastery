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
  if (/^<c-v>$/i.test(key)) return '<C-v>';
  if (/^<c-o>$/i.test(key)) return '<C-o>';
  if (/^<c-w>$/i.test(key)) return '<C-w>';
  if (/^<c-j>$/i.test(key)) return '<C-j>';
  if (/^<c-k>$/i.test(key)) return '<C-k>';
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

  // 6. Tag text object: it, at (<tag>...</tag>)
  if (type === 't') {
    const openTagRegex = /<([a-zA-Z0-9_-]+)[^>]*>/g;
    let match;
    while ((match = openTagRegex.exec(line)) !== null) {
      const tagName = match[1];
      const openStart = match.index;
      const openEnd = match.index + match[0].length;
      const closeTagStr = `</${tagName}>`;
      const closeStart = line.indexOf(closeTagStr, openEnd);
      if (closeStart !== -1) {
        const closeEnd = closeStart + closeTagStr.length;
        if (cursor.col >= openStart && cursor.col <= closeEnd) {
          if (isInner) {
            return {
              start: { row, col: openEnd },
              end: { row, col: closeStart },
            };
          } else {
            return {
              start: { row, col: openStart },
              end: { row, col: closeEnd },
            };
          }
        }
      }
    }
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

    // Window split & layout commands
    if (trimmed === ':sp' || trimmed === ':split') {
      this.engine.actionsExecuted.add('split');
      this.engine.actionsExecuted.add('window_cmd');
      return { handled: true, feedback: 'Horizontal split created (:sp)', action: 'split' };
    }
    if (trimmed === ':vs' || trimmed === ':vsplit') {
      this.engine.actionsExecuted.add('vsplit');
      this.engine.actionsExecuted.add('window_cmd');
      return { handled: true, feedback: 'Vertical split created (:vs)', action: 'vsplit' };
    }
    if (trimmed === ':on' || trimmed === ':only') {
      this.engine.actionsExecuted.add('zen');
      this.engine.actionsExecuted.add('window_cmd');
      return { handled: true, feedback: 'Zen mode: Only editor buffer (:only)', action: 'zen' };
    }
    if (trimmed === ':zen') {
      this.engine.actionsExecuted.add('zen');
      return { handled: true, feedback: 'Toggled Zen mode (:zen)', action: 'zen' };
    }
    if (trimmed === ':q' || trimmed === ':close' || trimmed === ':clo') {
      this.engine.actionsExecuted.add('close_window');
      this.engine.actionsExecuted.add('window_cmd');
      return { handled: true, feedback: 'Closed split window (:q)', action: 'close_window' };
    }
    if (trimmed === ':h' || trimmed === ':help' || trimmed === ':mission') {
      this.engine.actionsExecuted.add('mission_modal');
      return { handled: true, feedback: 'Opened Mission floating window (:help)', action: 'mission_modal' };
    }
    if (/^:wincmd\s+/i.test(trimmed)) {
      const arg = trimmed.split(/\s+/)[1];
      if (arg === 'v') {
        this.engine.actionsExecuted.add('vsplit');
        return { handled: true, feedback: 'Vertical split (:wincmd v)', action: 'vsplit' };
      }
      if (arg === 's') {
        this.engine.actionsExecuted.add('split');
        return { handled: true, feedback: 'Horizontal split (:wincmd s)', action: 'split' };
      }
      if (arg === 'o') {
        this.engine.actionsExecuted.add('zen');
        return { handled: true, feedback: 'Zen mode (:wincmd o)', action: 'zen' };
      }
      if (arg === 'q' || arg === 'c') {
        this.engine.actionsExecuted.add('close_window');
        return { handled: true, feedback: 'Closed window (:wincmd q)', action: 'close_window' };
      }
      if (arg === '=') {
        this.engine.actionsExecuted.add('equalize_split');
        return { handled: true, feedback: 'Windows equalized (:wincmd =)', action: 'equalize_split' };
      }
      if (arg === '>') {
        this.engine.actionsExecuted.add('resize_width_plus');
        return { handled: true, feedback: 'Expanded width (:wincmd >)', action: 'resize_width_plus' };
      }
      if (arg === '<') {
        this.engine.actionsExecuted.add('resize_width_minus');
        return { handled: true, feedback: 'Shrunk width (:wincmd <)', action: 'resize_width_minus' };
      }
      if (arg === '+') {
        this.engine.actionsExecuted.add('resize_height_plus');
        return { handled: true, feedback: 'Expanded height (:wincmd +)', action: 'resize_height_plus' };
      }
      if (arg === '-') {
        this.engine.actionsExecuted.add('resize_height_minus');
        return { handled: true, feedback: 'Shrunk height (:wincmd -)', action: 'resize_height_minus' };
      }
      if (arg === 'r' || arg === 'x') {
        this.engine.actionsExecuted.add('swap_splits');
        return { handled: true, feedback: 'Swapped windows (:wincmd r)', action: 'swap_splits' };
      }
      if (arg === 'w') {
        this.engine.actionsExecuted.add('switch_window');
        return { handled: true, feedback: 'Switched window (:wincmd w)', action: 'switch_window' };
      }
    }

    // Plugin triggers
    if (/^:Lazy$/i.test(trimmed)) {
      return { handled: true, feedback: 'Opened Lazy.nvim Dashboard', action: 'lazy' };
    }
    if (/^:Trouble/i.test(trimmed)) {
      return { handled: true, feedback: 'Toggled Trouble Diagnostics', action: 'trouble' };
    }
    if (/^:(FzfLua|Telescope)/i.test(trimmed)) {
      return { handled: true, feedback: 'Opened Fzf File Picker', action: 'fzf' };
    }
    if (/^:Neo-?tree/i.test(trimmed)) {
      return { handled: true, feedback: 'Toggled Neo-tree Explorer', action: 'neotree' };
    }

    // Global line delete: :g/pattern/d or :v/pattern/d
    const gDelete = trimmed.match(/^:([gv])\/(.*?)\/d$/);
    if (gDelete) {
      this.engine.saveSnapshot();
      const [, mode, pattern] = gDelete;
      try {
        const regex = new RegExp(pattern);
        const lines = this.buffer.getLines();
        const filtered = lines.filter(l => (mode === 'g' ? !regex.test(l) : regex.test(l)));
        this.buffer.setText(filtered.join('\n'));
        this.buffer.clampCursor('NORMAL');
        return {
          handled: true,
          feedback: `${mode === 'g' ? 'Filtered out' : 'Retained'} lines matching /${pattern}/`,
          action: 'global_delete',
        };
      } catch (e) {
        return { handled: false, feedback: `Invalid regex: ${e.message}` };
      }
    }

    // Range substitution: :1,3s/old/new/g
    const rangeSub = trimmed.match(/^:(\d+),(\d+)s\/(.*?)\/(.*?)\/?([gI]*)$/);
    if (rangeSub) {
      this.engine.saveSnapshot();
      const [, startStr, endStr, pattern, replacement, flags] = rangeSub;
      const startLine = Math.max(0, parseInt(startStr, 10) - 1);
      const endLine = Math.min(this.buffer.getLines().length - 1, parseInt(endStr, 10) - 1);
      try {
        const regex = new RegExp(pattern, flags.includes('g') ? 'g' : '');
        const lines = this.buffer.getLines();
        for (let r = startLine; r <= endLine; r++) {
          lines[r] = lines[r].replace(regex, replacement);
        }
        this.buffer.setText(lines.join('\n'));
        return {
          handled: true,
          feedback: `Replaced in lines ${startStr}-${endStr}: "${pattern}" -> "${replacement}"`,
          action: 'substitute',
        };
      } catch (e) {
        return { handled: false, feedback: `Invalid regex: ${e.message}` };
      }
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

    // Normal command execution: :%norm <keys> or :norm <keys>
    const normCmd = cmd.trimStart().match(/^:(%|\d+,\d+)?norm\s+(.*)$/);
    if (normCmd) {
      this.engine.saveSnapshot();
      const [, range, normKeys] = normCmd;
      let startLine = 0;
      let endLine = this.buffer.getLines().length - 1;
      if (range && range.includes(',')) {
        const [s, e] = range.split(',');
        startLine = Math.max(0, parseInt(s, 10) - 1);
        endLine = Math.min(this.buffer.getLines().length - 1, parseInt(e, 10) - 1);
      } else if (!range) {
        startLine = this.buffer.getCursor().row;
        endLine = startLine;
      }
      for (let r = startLine; r <= endLine; r++) {
        this.buffer.setCursor(r, 0);
        if (normKeys.startsWith('I')) {
          const insertText = normKeys.slice(1);
          const line = this.buffer.getLine(r);
          const firstNonBlank = line.search(/\S|$/);
          this.buffer.setLine(r, line.slice(0, firstNonBlank) + insertText + line.slice(firstNonBlank));
        } else if (normKeys.startsWith('A')) {
          const appendText = normKeys.slice(1);
          const line = this.buffer.getLine(r);
          this.buffer.setLine(r, line + appendText);
        } else {
          for (const ch of normKeys) {
            this.engine.handleKey(ch);
          }
          if (this.engine.getMode() === 'INSERT') {
            this.engine.handleKey('Escape');
          }
        }
      }
      this.buffer.clampCursor('NORMAL');
      return { handled: true, feedback: 'Executed normal command across range', action: 'norm' };
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
    this.pendingLeader = false;
    this.leaderKeys = '';
    this.recordingMacro = null;
    this.macros = {};
    this.lastMacro = null;
    this.marks = {};
    this.isBlockInsert = false;
    this.blockInsertCol = 0;
    this.blockInsertRows = [0, 0];
    this.blockInsertedText = '';
    this.onLeaderState = null;
    this.onPluginAction = null;
    this.lspHover = null;
    this.jumpList = [];
    this.onStateChange = null;
    this.pendingWindowCmd = false;
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

    // Record keystrokes if macro recording is active
    if (this.recordingMacro) {
      if (this.mode === 'NORMAL' && (rawKey === 'q' || key === 'q')) {
        const reg = this.recordingMacro;
        this.recordingMacro = null;
        this.actionsExecuted.add('macro_record');
        return { handled: true, feedback: `Recorded macro @${reg}` };
      }
      this.macros[this.recordingMacro] = this.macros[this.recordingMacro] || [];
      this.macros[this.recordingMacro].push(rawKey);
    }

    if (this.mode === 'INSERT') {
      return this.handleInsertKey(key);
    }
    if (this.mode === 'COMMAND') {
      return this.handleCommandKey(key);
    }
    if (this.mode === 'FLASH') {
      return this.handleFlashKey(key);
    }
    if (this.mode === 'VISUAL' || this.mode === 'VISUAL_LINE' || this.mode === 'VISUAL_BLOCK') {
      return this.handleVisualKey(key);
    }

    return this.handleNormalKey(key);
  }

  /**
   * Handle keystrokes in INSERT mode
   */
  handleInsertKey(key) {
    // Visual block multi-line column insertion completion
    if (this.isBlockInsert) {
      if (key === 'Escape') {
        const textToInsert = this.blockInsertedText;
        const col = this.blockInsertCol;
        const [startRow, endRow] = this.blockInsertRows;
        for (let r = startRow + 1; r <= endRow; r++) {
          const line = this.buffer.getLine(r);
          const safeCol = Math.min(line.length, col);
          const newLine = line.slice(0, safeCol) + textToInsert + line.slice(safeCol);
          this.buffer.setLine(r, newLine);
        }
        this.isBlockInsert = false;
        this.blockInsertedText = '';
        this.setMode('NORMAL');
        this.actionsExecuted.add('visual_block');
        return { handled: true };
      }
      if (key === 'Backspace') {
        this.saveSnapshot();
        this.blockInsertedText = this.blockInsertedText.slice(0, -1);
        this.buffer.deleteChar(true);
        return { handled: true };
      }
      if (key === 'Enter') {
        this.saveSnapshot();
        this.buffer.insertText('\n');
        return { handled: true };
      }
      if (key.length === 1) {
        this.saveSnapshot();
        this.blockInsertedText += key;
        this.buffer.insertText(key);
        return { handled: true };
      }
    }

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
    // Pending <C-w> Window Commands (Neovim Window Splits & Management)
    if (this.pendingWindowCmd) {
      this.pendingWindowCmd = false;
      const sub = key.toLowerCase();
      if (sub === 'v' || key === '|') {
        this.actionsExecuted.add('vsplit');
        this.actionsExecuted.add('window_cmd');
        if (this.onPluginAction) this.onPluginAction('vsplit');
        return { handled: true, feedback: 'Vertical split (<C-w>v)', action: 'vsplit' };
      }
      if (sub === 's' || key === '-') {
        this.actionsExecuted.add('split');
        this.actionsExecuted.add('window_cmd');
        if (this.onPluginAction) this.onPluginAction('split');
        return { handled: true, feedback: 'Horizontal split (<C-w>s)', action: 'split' };
      }
      if (sub === 'o') {
        this.actionsExecuted.add('zen');
        this.actionsExecuted.add('window_cmd');
        if (this.onPluginAction) this.onPluginAction('zen');
        return { handled: true, feedback: 'Zen mode: Only editor buffer (<C-w>o)', action: 'zen' };
      }
      if (sub === 'q' || sub === 'c') {
        this.actionsExecuted.add('close_window');
        this.actionsExecuted.add('window_cmd');
        if (this.onPluginAction) this.onPluginAction('close_window');
        return { handled: true, feedback: 'Closed split window (<C-w>q)', action: 'close_window' };
      }
      if (key === '=') {
        this.actionsExecuted.add('equalize_split');
        this.actionsExecuted.add('window_cmd');
        if (this.onPluginAction) this.onPluginAction('equalize_split');
        return { handled: true, feedback: 'Windows equalized (<C-w>=)', action: 'equalize_split' };
      }
      if (key === '>') {
        this.actionsExecuted.add('resize_width_plus');
        this.actionsExecuted.add('window_cmd');
        if (this.onPluginAction) this.onPluginAction('resize_width_plus');
        return { handled: true, feedback: 'Expanded split width (<C-w>>)', action: 'resize_width_plus' };
      }
      if (key === '<') {
        this.actionsExecuted.add('resize_width_minus');
        this.actionsExecuted.add('window_cmd');
        if (this.onPluginAction) this.onPluginAction('resize_width_minus');
        return { handled: true, feedback: 'Shrunk split width (<C-w><)', action: 'resize_width_minus' };
      }
      if (key === '+') {
        this.actionsExecuted.add('resize_height_plus');
        this.actionsExecuted.add('window_cmd');
        if (this.onPluginAction) this.onPluginAction('resize_height_plus');
        return { handled: true, feedback: 'Expanded split height (<C-w>+)', action: 'resize_height_plus' };
      }
      if (key === '-') {
        this.actionsExecuted.add('resize_height_minus');
        this.actionsExecuted.add('window_cmd');
        if (this.onPluginAction) this.onPluginAction('resize_height_minus');
        return { handled: true, feedback: 'Shrunk split height (<C-w>-)', action: 'resize_height_minus' };
      }
      if (sub === 'r' || sub === 'x') {
        this.actionsExecuted.add('swap_splits');
        this.actionsExecuted.add('window_cmd');
        if (this.onPluginAction) this.onPluginAction('swap_splits');
        return { handled: true, feedback: 'Swapped window positions (<C-w>r)', action: 'swap_splits' };
      }
      if (sub === 'w' || sub === 'p' || key === '<C-w>') {
        this.actionsExecuted.add('switch_window');
        this.actionsExecuted.add('window_cmd');
        if (this.onPluginAction) this.onPluginAction('switch_window');
        return { handled: true, feedback: 'Switched window focus (<C-w>w)', action: 'switch_window' };
      }
      if (sub === 'h') {
        this.actionsExecuted.add('focus_left');
        this.actionsExecuted.add('window_cmd');
        if (this.onPluginAction) this.onPluginAction('focus_left');
        return { handled: true, feedback: 'Focus left window (<C-w>h)', action: 'focus_left' };
      }
      if (sub === 'l') {
        this.actionsExecuted.add('focus_right');
        this.actionsExecuted.add('window_cmd');
        if (this.onPluginAction) this.onPluginAction('focus_right');
        return { handled: true, feedback: 'Focus right window (<C-w>l)', action: 'focus_right' };
      }
      if (sub === 'j') {
        this.actionsExecuted.add('focus_bottom');
        this.actionsExecuted.add('window_cmd');
        if (this.onPluginAction) this.onPluginAction('focus_bottom');
        return { handled: true, feedback: 'Focus bottom window (<C-w>j)', action: 'focus_bottom' };
      }
      if (sub === 'k') {
        this.actionsExecuted.add('focus_top');
        this.actionsExecuted.add('window_cmd');
        if (this.onPluginAction) this.onPluginAction('focus_top');
        return { handled: true, feedback: 'Focus top window (<C-w>k)', action: 'focus_top' };
      }
      if (key === 'Escape') {
        return { handled: true, feedback: 'Window command cancelled' };
      }
      return { handled: false, feedback: `Unknown window command: <C-w>${key}` };
    }

    // Leader Key (<Space>) Handling in LazyVim
    if (this.pendingLeader) {
      if (key === 'Escape') {
        this.pendingLeader = false;
        this.leaderKeys = '';
        if (this.onLeaderState) this.onLeaderState('', false);
        return { handled: true, feedback: 'Leader cancelled' };
      }
      if (key === ' ') {
        return { handled: true };
      }

      this.leaderKeys += key;
      const lk = this.leaderKeys;

      // Direct LazyVim leader key actions
      if (lk === 'ff') {
        this.pendingLeader = false;
        this.leaderKeys = '';
        if (this.onLeaderState) this.onLeaderState('', false);
        this.actionsExecuted.add('fzf');
        this.actionsExecuted.add('leader_ff');
        if (this.onPluginAction) this.onPluginAction('fzf_files');
        return { handled: true, feedback: 'LazyVim: Find Files (Fzf/Telescope)', action: 'fzf_files' };
      }
      if (lk === 'sg' || lk === '/') {
        this.pendingLeader = false;
        this.leaderKeys = '';
        if (this.onLeaderState) this.onLeaderState('', false);
        this.actionsExecuted.add('grep');
        this.actionsExecuted.add('fzf');
        this.actionsExecuted.add('leader_sg');
        if (this.onPluginAction) this.onPluginAction('fzf_grep');
        return { handled: true, feedback: 'LazyVim: Live Grep (Fzf/Snacks)', action: 'fzf_grep' };
      }
      if (lk === 'fb') {
        this.pendingLeader = false;
        this.leaderKeys = '';
        if (this.onLeaderState) this.onLeaderState('', false);
        this.actionsExecuted.add('buffers');
        this.actionsExecuted.add('fzf');
        this.actionsExecuted.add('leader_fb');
        if (this.onPluginAction) this.onPluginAction('fzf_buffers');
        return { handled: true, feedback: 'LazyVim: Buffers (Fzf)', action: 'fzf_buffers' };
      }
      if (lk === 'e') {
        this.pendingLeader = false;
        this.leaderKeys = '';
        if (this.onLeaderState) this.onLeaderState('', false);
        this.actionsExecuted.add('neotree');
        this.actionsExecuted.add('leader_e');
        if (this.onPluginAction) this.onPluginAction('neotree');
        return { handled: true, feedback: 'LazyVim: Toggle Neo-tree Explorer', action: 'neotree' };
      }
      if (lk === 'xx') {
        this.pendingLeader = false;
        this.leaderKeys = '';
        if (this.onLeaderState) this.onLeaderState('', false);
        this.actionsExecuted.add('trouble');
        this.actionsExecuted.add('leader_xx');
        if (this.onPluginAction) this.onPluginAction('trouble');
        return { handled: true, feedback: 'LazyVim: Trouble Diagnostics', action: 'trouble' };
      }
      if (lk === 'ca') {
        this.pendingLeader = false;
        this.leaderKeys = '';
        if (this.onLeaderState) this.onLeaderState('', false);
        this.actionsExecuted.add('lsp_code_action');
        this.actionsExecuted.add('leader_ca');
        if (this.onPluginAction) this.onPluginAction('lsp_code_action');
        return { handled: true, feedback: 'LSP: Code Actions', action: 'lsp_code_action' };
      }
      if (lk === 'cr') {
        this.pendingLeader = false;
        this.leaderKeys = '';
        if (this.onLeaderState) this.onLeaderState('', false);
        this.actionsExecuted.add('lsp_rename');
        this.actionsExecuted.add('leader_cr');
        if (this.onPluginAction) this.onPluginAction('lsp_rename');
        return { handled: true, feedback: 'LSP: Symbol Rename', action: 'lsp_rename' };
      }
      if (lk === 'cf') {
        this.pendingLeader = false;
        this.leaderKeys = '';
        if (this.onLeaderState) this.onLeaderState('', false);
        this.actionsExecuted.add('format');
        this.formatBuffer();
        return { handled: true, feedback: 'LSP: Formatted Document', action: 'format' };
      }
      if (lk === 'gg') {
        this.pendingLeader = false;
        this.leaderKeys = '';
        if (this.onLeaderState) this.onLeaderState('', false);
        this.actionsExecuted.add('lazygit');
        this.actionsExecuted.add('leader_gg');
        if (this.onPluginAction) this.onPluginAction('lazygit');
        return { handled: true, feedback: 'LazyVim: LazyGit Dashboard', action: 'lazygit' };
      }
      if (lk === 'sr') {
        this.pendingLeader = false;
        this.leaderKeys = '';
        if (this.onLeaderState) this.onLeaderState('', false);
        this.actionsExecuted.add('grug_far');
        this.actionsExecuted.add('leader_sr');
        if (this.onPluginAction) this.onPluginAction('grug_far');
        return { handled: true, feedback: 'LazyVim: Grug-Far Search & Replace', action: 'grug_far' };
      }
      if (lk === 'l') {
        this.pendingLeader = false;
        this.leaderKeys = '';
        if (this.onLeaderState) this.onLeaderState('', false);
        this.actionsExecuted.add('lazy');
        this.actionsExecuted.add('lazy_home');
        this.actionsExecuted.add('leader_l');
        if (this.onPluginAction) this.onPluginAction('lazy');
        return { handled: true, feedback: 'LazyVim: Plugin Dashboard', action: 'lazy' };
      }
      // LazyVim Windows / Splits (<Space>W... or <Space>w...)
      if (lk === 'wv' || lk === 'Wv' || lk === 'w|' || lk === 'W|') {
        this.pendingLeader = false;
        this.leaderKeys = '';
        if (this.onLeaderState) this.onLeaderState('', false);
        this.actionsExecuted.add('vsplit');
        this.actionsExecuted.add('leader_wv');
        if (this.onPluginAction) this.onPluginAction('vsplit');
        return { handled: true, feedback: 'LazyVim: Vertical split (<Space>Wv)', action: 'vsplit' };
      }
      if (lk === 'ws' || lk === 'Ws' || lk === 'w-' || lk === 'W-') {
        this.pendingLeader = false;
        this.leaderKeys = '';
        if (this.onLeaderState) this.onLeaderState('', false);
        this.actionsExecuted.add('split');
        this.actionsExecuted.add('leader_ws');
        if (this.onPluginAction) this.onPluginAction('split');
        return { handled: true, feedback: 'LazyVim: Horizontal split (<Space>Ws)', action: 'split' };
      }
      if (lk === 'wd' || lk === 'Wd' || lk === 'wq' || lk === 'Wq' || lk === 'wc' || lk === 'Wc') {
        this.pendingLeader = false;
        this.leaderKeys = '';
        if (this.onLeaderState) this.onLeaderState('', false);
        this.actionsExecuted.add('close_window');
        this.actionsExecuted.add('leader_wd');
        if (this.onPluginAction) this.onPluginAction('close_window');
        return { handled: true, feedback: 'LazyVim: Close window (<Space>Wd)', action: 'close_window' };
      }
      if (lk === 'we' || lk === 'We' || lk === 'w=' || lk === 'W=') {
        this.pendingLeader = false;
        this.leaderKeys = '';
        if (this.onLeaderState) this.onLeaderState('', false);
        this.actionsExecuted.add('equalize_split');
        this.actionsExecuted.add('leader_we');
        if (this.onPluginAction) this.onPluginAction('equalize_split');
        return { handled: true, feedback: 'LazyVim: Equalize windows (<Space>We)', action: 'equalize_split' };
      }
      if (lk === 'wm' || lk === 'Wm' || lk === 'wz' || lk === 'Wz') {
        this.pendingLeader = false;
        this.leaderKeys = '';
        if (this.onLeaderState) this.onLeaderState('', false);
        this.actionsExecuted.add('zen');
        this.actionsExecuted.add('leader_wm');
        if (this.onPluginAction) this.onPluginAction('zen');
        return { handled: true, feedback: 'LazyVim: Maximize / Zen mode (<Space>Wm)', action: 'zen' };
      }
      if (lk === 'ww' || lk === 'Ww') {
        this.pendingLeader = false;
        this.leaderKeys = '';
        if (this.onLeaderState) this.onLeaderState('', false);
        this.actionsExecuted.add('switch_window');
        this.actionsExecuted.add('leader_ww');
        if (this.onPluginAction) this.onPluginAction('switch_window');
        return { handled: true, feedback: 'LazyVim: Switch active window (<Space>Ww)', action: 'switch_window' };
      }
      if (lk === 'wr' || lk === 'Wr' || lk === 'wx' || lk === 'Wx') {
        this.pendingLeader = false;
        this.leaderKeys = '';
        if (this.onLeaderState) this.onLeaderState('', false);
        this.actionsExecuted.add('swap_splits');
        this.actionsExecuted.add('leader_wr');
        if (this.onPluginAction) this.onPluginAction('swap_splits');
        return { handled: true, feedback: 'LazyVim: Swap window positions (<Space>Wr)', action: 'swap_splits' };
      }
      if (lk === 'wh' || lk === 'Wh') {
        this.pendingLeader = false;
        this.leaderKeys = '';
        if (this.onLeaderState) this.onLeaderState('', false);
        this.actionsExecuted.add('focus_left');
        if (this.onPluginAction) this.onPluginAction('focus_left');
        return { handled: true, feedback: 'LazyVim: Focus left window (<Space>Wh)', action: 'focus_left' };
      }
      if (lk === 'wl') {
        this.pendingLeader = false;
        this.leaderKeys = '';
        if (this.onLeaderState) this.onLeaderState('', false);
        this.actionsExecuted.add('focus_right');
        if (this.onPluginAction) this.onPluginAction('focus_right');
        return { handled: true, feedback: 'LazyVim: Focus right window (<Space>wl)', action: 'focus_right' };
      }
      if (lk === 'wj') {
        this.pendingLeader = false;
        this.leaderKeys = '';
        if (this.onLeaderState) this.onLeaderState('', false);
        this.actionsExecuted.add('focus_bottom');
        if (this.onPluginAction) this.onPluginAction('focus_bottom');
        return { handled: true, feedback: 'LazyVim: Focus bottom window (<Space>wj)', action: 'focus_bottom' };
      }
      if (lk === 'wk') {
        this.pendingLeader = false;
        this.leaderKeys = '';
        if (this.onLeaderState) this.onLeaderState('', false);
        this.actionsExecuted.add('focus_top');
        if (this.onPluginAction) this.onPluginAction('focus_top');
        return { handled: true, feedback: 'LazyVim: Focus top window (<Space>wk)', action: 'focus_top' };
      }

      // LazyVim UI Toggles (<Space>u...)
      if (lk === 'uz') {
        this.pendingLeader = false;
        this.leaderKeys = '';
        if (this.onLeaderState) this.onLeaderState('', false);
        this.actionsExecuted.add('zen');
        this.actionsExecuted.add('leader_uz');
        if (this.onPluginAction) this.onPluginAction('zen');
        return { handled: true, feedback: 'LazyVim: Toggle Zen Mode (<Space>uz)', action: 'zen' };
      }
      if (lk === 'um') {
        this.pendingLeader = false;
        this.leaderKeys = '';
        if (this.onLeaderState) this.onLeaderState('', false);
        this.actionsExecuted.add('toggle_mission');
        this.actionsExecuted.add('leader_um');
        if (this.onPluginAction) this.onPluginAction('toggle_mission');
        return { handled: true, feedback: 'LazyVim: Toggle Mission Pane (<Space>um)', action: 'toggle_mission' };
      }
      if (lk === 'ud') {
        this.pendingLeader = false;
        this.leaderKeys = '';
        if (this.onLeaderState) this.onLeaderState('', false);
        this.actionsExecuted.add('toggle_diff');
        this.actionsExecuted.add('leader_ud');
        if (this.onPluginAction) this.onPluginAction('toggle_diff');
        return { handled: true, feedback: 'LazyVim: Toggle Live Diff (<Space>ud)', action: 'toggle_diff' };
      }
      if (lk === 'us') {
        this.pendingLeader = false;
        this.leaderKeys = '';
        if (this.onLeaderState) this.onLeaderState('', false);
        this.actionsExecuted.add('toggle_split_orientation');
        this.actionsExecuted.add('leader_us');
        if (this.onPluginAction) this.onPluginAction('toggle_split_orientation');
        return { handled: true, feedback: 'LazyVim: Toggle Split Orientation (<Space>us)', action: 'toggle_split_orientation' };
      }
      if (lk === 'ur') {
        this.pendingLeader = false;
        this.leaderKeys = '';
        if (this.onLeaderState) this.onLeaderState('', false);
        this.actionsExecuted.add('swap_splits');
        this.actionsExecuted.add('leader_ur');
        if (this.onPluginAction) this.onPluginAction('swap_splits');
        return { handled: true, feedback: 'LazyVim: Swapped Split Positions (<Space>ur)', action: 'swap_splits' };
      }

      // Mission / Curriculum Shortcuts (<Space>m...)
      if (lk === 'mm' || lk === 'm') {
        this.pendingLeader = false;
        this.leaderKeys = '';
        if (this.onLeaderState) this.onLeaderState('', false);
        this.actionsExecuted.add('mission_modal');
        this.actionsExecuted.add('leader_m');
        if (this.onPluginAction) this.onPluginAction('mission_modal');
        return { handled: true, feedback: 'LazyVim: Mission Floating Window (<Space>m)', action: 'mission_modal' };
      }
      if (lk === 'mh') {
        this.pendingLeader = false;
        this.leaderKeys = '';
        if (this.onLeaderState) this.onLeaderState('', false);
        this.actionsExecuted.add('hint');
        if (this.onPluginAction) this.onPluginAction('hint');
        return { handled: true, feedback: 'Stage Hint (<Space>mh)', action: 'hint' };
      }
      if (lk === 'mr') {
        this.pendingLeader = false;
        this.leaderKeys = '';
        if (this.onLeaderState) this.onLeaderState('', false);
        this.actionsExecuted.add('reset');
        if (this.onPluginAction) this.onPluginAction('reset');
        return { handled: true, feedback: 'Reset Stage (<Space>mr)', action: 'reset' };
      }
      if (lk === 'mn') {
        this.pendingLeader = false;
        this.leaderKeys = '';
        if (this.onLeaderState) this.onLeaderState('', false);
        this.actionsExecuted.add('next_stage');
        if (this.onPluginAction) this.onPluginAction('next_stage');
        return { handled: true, feedback: 'Next Stage (<Space>mn)', action: 'next_stage' };
      }
      if (lk === 'mp') {
        this.pendingLeader = false;
        this.leaderKeys = '';
        if (this.onLeaderState) this.onLeaderState('', false);
        this.actionsExecuted.add('prev_stage');
        if (this.onPluginAction) this.onPluginAction('prev_stage');
        return { handled: true, feedback: 'Previous Stage (<Space>mp)', action: 'prev_stage' };
      }
      if (lk === 'ms') {
        this.pendingLeader = false;
        this.leaderKeys = '';
        if (this.onLeaderState) this.onLeaderState('', false);
        this.actionsExecuted.add('stage_map');
        if (this.onPluginAction) this.onPluginAction('stage_map');
        return { handled: true, feedback: 'Stage Map (<Space>ms)', action: 'stage_map' };
      }

      if (lk === 'w') {
        this.pendingLeader = false;
        this.leaderKeys = '';
        if (this.onLeaderState) this.onLeaderState('', false);
        this.saveSnapshot();
        this.actionsExecuted.add('save');
        return { handled: true, feedback: 'Saved buffer to disk (<Space>w).', action: 'save' };
      }
      if (lk === 'W') {
        if (this.onLeaderState) this.onLeaderState('W', true);
        return { handled: true, feedback: 'Leader <Space>W... (+windows/splits)' };
      }
      if (lk === 'bd') {
        this.pendingLeader = false;
        this.leaderKeys = '';
        if (this.onLeaderState) this.onLeaderState('', false);
        this.actionsExecuted.add('bdelete');
        return { handled: true, feedback: 'Closed buffer.', action: 'bdelete' };
      }
      if (lk === '.') {
        this.pendingLeader = false;
        this.leaderKeys = '';
        if (this.onLeaderState) this.onLeaderState('', false);
        this.actionsExecuted.add('scratchpad');
        if (this.onPluginAction) this.onPluginAction('scratchpad');
        return { handled: true, feedback: 'Snacks: Floating Scratchpad', action: 'scratchpad' };
      }
      if (lk === 'ft') {
        this.pendingLeader = false;
        this.leaderKeys = '';
        if (this.onLeaderState) this.onLeaderState('', false);
        this.actionsExecuted.add('terminal');
        if (this.onPluginAction) this.onPluginAction('terminal');
        return { handled: true, feedback: 'Snacks: Floating Terminal', action: 'terminal' };
      }

      // Prefix drill-down
      if (['f', 's', 'x', 'c', 'g', 'b', 'w', 'u', 'm'].includes(lk)) {
        if (this.onLeaderState) this.onLeaderState(lk, true);
        return { handled: true, feedback: `Leader <Space>${lk}...` };
      }

      // Unrecognized sequence
      this.pendingLeader = false;
      this.leaderKeys = '';
      if (this.onLeaderState) this.onLeaderState('', false);
      return { handled: false, feedback: 'Leader cancelled' };
    }

    // Trigger Leader mode with <Space> or <leader>
    if (key === ' ' && !this.pendingKeys && !this.activeOperator) {
      this.pendingLeader = true;
      this.leaderKeys = '';
      if (this.onLeaderState) this.onLeaderState('', true);
      return { handled: true, feedback: 'Leader <Space> active (Which-Key)' };
    }

    // Escape clears pending sequence and hlsearch
    if (key === 'Escape') {
      this.pendingKeys = '';
      this.countPrefix = '';
      this.activeOperator = null;
      this.searchMatches = [];
      return { handled: true, feedback: 'Cleared' };
    }

    // Neovim Window Management Prefix (<C-w>)
    if (key === '<C-w>') {
      this.pendingWindowCmd = true;
      return { handled: true, feedback: '<C-w>... (v: vs, s: sp, o: zen, q: close, =: eq, w: switch, r: swap)' };
    }

    // Visual Block Mode (<C-v>)
    if (key === '<C-v>') {
      this.visualStart = this.buffer.getCursor();
      this.setMode('VISUAL_BLOCK');
      this.actionsExecuted.add('visual_block');
      return { handled: true, feedback: '-- VISUAL BLOCK --' };
    }

    // Jumplist (<C-o>)
    if (key === '<C-o>') {
      if (this.jumpList.length > 0) {
        const last = this.jumpList.pop();
        this.buffer.setCursor(last.row, last.col);
        this.actionsExecuted.add('jumplist');
        return { handled: true, feedback: 'Jumped back in jumplist (<C-o>)' };
      }
      return { handled: true, feedback: 'Jumplist empty' };
    }

    // LSP Hover Documentation (K)
    if (key === 'K' && !this.pendingKeys && !this.activeOperator) {
      const word = this.getWordUnderCursor();
      this.actionsExecuted.add('lsp_hover');
      if (this.onPluginAction) this.onPluginAction('lsp_hover');
      return { handled: true, feedback: `LSP: Hover Documentation for '${word || 'symbol'}' (K)`, action: 'lsp_hover' };
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

    // Macro recording: q{reg} to start, q to stop
    if (this.pendingKeys === 'q') {
      this.pendingKeys = '';
      if (/^[a-zA-Z]$/.test(key)) {
        const reg = key.toLowerCase();
        this.recordingMacro = reg;
        this.macros[reg] = [];
        return { handled: true, feedback: `Recording @${reg} (press q to finish)` };
      }
      return { handled: false };
    }
    if (key === 'q' && !this.activeOperator && !this.recordingMacro && !this.pendingKeys) {
      this.pendingKeys = 'q';
      return { handled: true, feedback: 'Record macro to register (a-z)' };
    }

    // Macro replay: @{reg} or @@
    if (this.pendingKeys === '@') {
      this.pendingKeys = '';
      const reg = key === '@' ? this.lastMacro : key.toLowerCase();
      if (reg && this.macros[reg] && this.macros[reg].length > 0) {
        this.lastMacro = reg;
        this.actionsExecuted.add('macro');
        const macroSeq = [...this.macros[reg]];
        for (let i = 0; i < count; i++) {
          for (const k of macroSeq) {
            this.handleKey(k);
          }
        }
        return { handled: true, feedback: `Replayed macro @${reg}` };
      }
      return { handled: false, feedback: `Macro @${reg || key} is empty` };
    }
    if (key === '@' && !this.activeOperator && !this.pendingKeys) {
      this.pendingKeys = '@';
      return { handled: true, feedback: 'Replay macro (a-z or @)' };
    }

    // Mark setting: m{char}
    if (this.pendingKeys === 'm') {
      this.pendingKeys = '';
      if (/^[a-zA-Z]$/.test(key)) {
        this.marks[key] = { ...this.buffer.getCursor() };
        this.actionsExecuted.add('mark');
        return { handled: true, feedback: `Mark '${key}' set` };
      }
      return { handled: false };
    }
    if (key === 'm' && !this.activeOperator && !this.pendingKeys) {
      this.pendingKeys = 'm';
      return { handled: true, feedback: 'Set mark (a-z)' };
    }

    // Mark jump: '{char} or `{char}
    if (this.pendingKeys === "'" || this.pendingKeys === '`') {
      const isExact = this.pendingKeys === '`';
      this.pendingKeys = '';
      if (this.marks[key]) {
        const pos = this.marks[key];
        this.buffer.setCursor(pos.row, isExact ? pos.col : 0);
        this.actionsExecuted.add('mark_jump');
        return { handled: true, feedback: `Jumped to mark '${key}'` };
      }
      return { handled: false, feedback: `Mark '${key}' not set` };
    }
    if ((key === "'" || key === '`') && !this.activeOperator && !this.pendingKeys) {
      this.pendingKeys = key;
      return { handled: true, feedback: 'Jump to mark (a-z)' };
    }

    // Mini.surround / surround operators:
    if (this.pendingKeys === 'gs') {
      if (key === 'a') {
        this.pendingKeys = 'gsa';
        return { handled: true, feedback: 'Surround add (target motion/object)' };
      }
      if (key === 'd') {
        this.pendingKeys = 'gsd';
        return { handled: true, feedback: 'Surround delete (delimiter)' };
      }
      if (key === 'r') {
        this.pendingKeys = 'gsr';
        return { handled: true, feedback: 'Surround replace (old delimiter)' };
      }
      this.pendingKeys = '';
      return { handled: false };
    }

    if (this.pendingKeys.startsWith('gsa') || this.pendingKeys.startsWith('ys')) {
      this.pendingKeys += key;
      const isGsa = this.pendingKeys.startsWith('gsa');
      const targetLen = isGsa ? 5 : 4; // e.g. gsaw" or ysw"
      if (this.pendingKeys.length >= targetLen) {
        const delim = key;
        this.pendingKeys = '';
        const success = this.executeSurroundAdd('w', delim);
        return { handled: success, feedback: `Surrounded with ${delim}` };
      }
      return { handled: true, feedback: `Surround: enter delimiter` };
    }
    if (this.pendingKeys === 'gsd' || this.pendingKeys === 'ds') {
      this.pendingKeys = '';
      const success = this.executeSurroundDelete(key);
      return { handled: success, feedback: `Deleted surrounding ${key}` };
    }
    if (this.pendingKeys === 'gsr' || this.pendingKeys === 'cs') {
      this.pendingKeys += key;
      return { handled: true, feedback: `Replace ${key} with delimiter...` };
    }
    if (this.pendingKeys.startsWith('gsr') || this.pendingKeys.startsWith('cs')) {
      const isGsr = this.pendingKeys.startsWith('gsr');
      const oldChar = isGsr ? this.pendingKeys[3] : this.pendingKeys[2];
      const newChar = key;
      this.pendingKeys = '';
      const success = this.executeSurroundReplace(oldChar, newChar);
      return { handled: success, feedback: `Replaced surrounding ${oldChar} with ${newChar}` };
    }

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
    if (/^[fFtT]$/.test(key) && !this.pendingKeys) {
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
    if (key === 'r' && !this.pendingKeys) {
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
        const word = this.getWordUnderCursor();
        if (word) {
          this.jumpList.push({ ...this.buffer.getCursor() });
          const lines = this.buffer.getLines();
          const defRegex = new RegExp(`\\b(function|const|let|var|type|interface|class|def)\\s+${word}\\b`);
          for (let r = 0; r < lines.length; r++) {
            if (defRegex.test(lines[r])) {
              this.buffer.setCursor(r, lines[r].indexOf(word));
              break;
            }
          }
        }
        this.actionsExecuted.add('lsp_definition');
        return { handled: true, feedback: 'Jump to definition (LSP)', action: 'lsp_definition' };
      }
      if (key === 'r') {
        this.actionsExecuted.add('lsp_references');
        return { handled: true, feedback: 'Jump to references (LSP)', action: 'lsp_references' };
      }
      if (key === 's') {
        this.pendingKeys = 'gs';
        return { handled: true, feedback: 'mini.surround (a: add, d: delete, r: replace)' };
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

    // Surround aliases (ys, ds, cs)
    if (seq === 'ys' || seq === 'ds' || seq === 'cs') {
      this.activeOperator = null;
      this.pendingKeys = seq;
      return { handled: true, feedback: `Surround: ${seq}` };
    }

    // Line doubling: dd, cc, yy, >>, <<
    if (seq === op + op) {
      this.operatorHandler.executeLineOp(op, count);
      this.activeOperator = null;
      this.pendingKeys = '';
      if (op === 'd') {
        this.lastChange = () => {
          this.operatorHandler.executeLineOp('d', 1);
        };
      }
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

    // Seeking motion prefix: df, dt, dF, dT, cf, ct...
    if (/^[dcy][fFtT]$/.test(seq)) {
      this.pendingKeys = seq;
      return { handled: true };
    }
    // Seeking motion with char: df), dt), etc.
    if (/^[dcy][fFtT].$/.test(seq)) {
      const seekType = seq[1];
      const targetChar = seq[2];
      this.saveSnapshot();
      const start = { ...this.buffer.getCursor() };
      this.executeSeek(seekType, targetChar, count);
      const end = { ...this.buffer.getCursor() };
      end.col += 1;
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
    if (key === 'Escape' || key === 'v' || key === 'V' || key === '<C-v>') {
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

    // Visual Block Mode operations (<C-v>)
    if (this.mode === 'VISUAL_BLOCK') {
      const cur = this.buffer.getCursor();
      const start = this.visualStart || cur;
      const minRow = Math.min(start.row, cur.row);
      const maxRow = Math.max(start.row, cur.row);
      const minCol = Math.min(start.col, cur.col);
      const maxCol = Math.max(start.col, cur.col);

      if (key === 'I') {
        this.isBlockInsert = true;
        this.blockInsertCol = minCol;
        this.blockInsertRows = [minRow, maxRow];
        this.blockInsertedText = '';
        this.buffer.setCursor(minRow, minCol);
        this.setMode('INSERT');
        return { handled: true };
      }
      if (key === 'A') {
        this.isBlockInsert = true;
        this.blockInsertCol = maxCol + 1;
        this.blockInsertRows = [minRow, maxRow];
        this.blockInsertedText = '';
        this.buffer.setCursor(minRow, maxCol + 1);
        this.setMode('INSERT');
        return { handled: true };
      }
      if (key === 'd' || key === 'x' || key === 'c') {
        this.saveSnapshot();
        for (let r = minRow; r <= maxRow; r++) {
          const l = this.buffer.getLine(r);
          if (l.length >= minCol) {
            this.buffer.setLine(r, l.slice(0, minCol) + l.slice(maxCol + 1));
          }
        }
        this.visualStart = null;
        this.buffer.setCursor(minRow, minCol);
        this.actionsExecuted.add('visual_block');
        if (key === 'c') {
          this.isBlockInsert = true;
          this.blockInsertCol = minCol;
          this.blockInsertRows = [minRow, maxRow];
          this.blockInsertedText = '';
          this.setMode('INSERT');
        } else {
          this.setMode('NORMAL');
        }
        return { handled: true };
      }
    }

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
    if (key === 'o' && this.visualStart) {
      const cur = this.buffer.getCursor();
      const temp = { ...cur };
      this.buffer.setCursor(this.visualStart.row, this.visualStart.col);
      this.visualStart = temp;
      return { handled: true };
    }
    if (/^[fFtT]$/.test(this.pendingKeys)) {
      const type = this.pendingKeys;
      this.pendingKeys = '';
      this.executeSeek(type, key, count);
      return { handled: true };
    }
    if (/^[fFtT]$/.test(key)) {
      this.pendingKeys = key;
      return { handled: true };
    }
    if (key === 'h') this.moveLeft(count);
    if (key === 'l') this.moveRight(count);
    if (key === 'j') this.moveDown(count);
    if (key === 'k') this.moveUp(count);
    if (key === 'w') this.moveW(count);
    if (key === 'b') this.moveB(count);
    if (key === 'e') this.moveE(count);
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
      this.lastFlashQuery = '';
      this.setMode('NORMAL');
      return { handled: true, feedback: 'Flash cancelled' };
    }
    if (this.flashTargets.length > 0) {
      const targetQuery = this.lastFlashQuery || '';
      const jumped = this.flashHandler.jumpToLabel(key, this.flashTargets);
      this.flashTargets = [];
      this.lastFlashQuery = '';
      this.setMode('NORMAL');
      return { handled: jumped, feedback: jumped ? `Flash: teleported to "${targetQuery}"!` : 'Invalid flash label' };
    }

    this.pendingKeys += key;
    if (this.pendingKeys.length === 2) {
      this.lastFlashQuery = this.pendingKeys;
      this.flashTargets = this.flashHandler.findTargets(this.pendingKeys);
      this.pendingKeys = '';
      if (this.flashTargets.length === 0) {
        this.setMode('NORMAL');
        return { handled: true, feedback: `No flash targets found for "${this.lastFlashQuery}"` };
      }
      const firstLabel = this.flashTargets[0]?.label?.toUpperCase() || 'A';
      return { handled: true, feedback: `Flash targets active: press [${firstLabel}] to teleport` };
    }
    return { handled: true, feedback: `Flash query: ${this.pendingKeys}_ (type 1 more character)` };
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
    this.actionsExecuted.add('diagnostic_jump');
  }

  getWordUnderCursor() {
    const cur = this.buffer.getCursor();
    const line = this.buffer.getLine(cur.row);
    if (!line) return '';
    let start = cur.col;
    let end = cur.col;
    while (start > 0 && /\w/.test(line[start - 1])) start--;
    while (end < line.length && /\w/.test(line[end])) end++;
    return line.slice(start, end);
  }

  formatBuffer() {
    this.saveSnapshot();
    const lines = this.buffer.getLines();
    let indentLevel = 0;
    const formatted = lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('}') || trimmed.startsWith(']') || trimmed.startsWith(')')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      const indentedLine = '  '.repeat(indentLevel) + trimmed;
      if (trimmed.endsWith('{') || trimmed.endsWith('[') || trimmed.endsWith('(')) {
        indentLevel++;
      }
      return indentedLine;
    });
    this.buffer.setText(formatted.join('\n'));
    this.actionsExecuted.add('format');
  }

  executeSurroundAdd(target, delim) {
    this.saveSnapshot();
    const cur = this.buffer.getCursor();
    const line = this.buffer.getLine(cur.row);
    const pairs = {
      '(': ['(', ')'], ')': ['(', ')'],
      '[': ['[', ']'], ']': ['[', ']'],
      '{': ['{', '}'], '}': ['{', '}'],
      '"': ['"', '"'], "'": ["'", "'"], '`': ['`', '`'],
    };
    const [open, close] = pairs[delim] || [delim, delim];

    let start = cur.col;
    let end = cur.col;
    while (start > 0 && /\w/.test(line[start - 1])) start--;
    while (end < line.length && /\w/.test(line[end])) end++;
    if (start === end && line.length > 0) {
      const match = line.match(/\w+/);
      if (match) {
        start = match.index;
        end = start + match[0].length;
      }
    }
    const word = line.slice(start, end);
    const newLine = line.slice(0, start) + open + word + close + line.slice(end);
    this.buffer.setLine(cur.row, newLine);
    this.actionsExecuted.add('surround');
    return true;
  }

  executeSurroundDelete(delim) {
    this.saveSnapshot();
    const cur = this.buffer.getCursor();
    const line = this.buffer.getLine(cur.row);
    const pairs = {
      '(': ['(', ')'], ')': ['(', ')'],
      '[': ['[', ']'], ']': ['[', ']'],
      '{': ['{', '}'], '}': ['{', '}'],
      '"': ['"', '"'], "'": ["'", "'"], '`': ['`', '`'],
    };
    const [open, close] = pairs[delim] || [delim, delim];

    let openIdx = line.lastIndexOf(open, cur.col);
    if (openIdx === -1) openIdx = line.indexOf(open);
    const closeIdx = openIdx !== -1 ? line.indexOf(close, openIdx + 1) : -1;
    if (openIdx !== -1 && closeIdx !== -1) {
      const newLine = line.slice(0, openIdx) + line.slice(openIdx + 1, closeIdx) + line.slice(closeIdx + 1);
      this.buffer.setLine(cur.row, newLine);
      this.actionsExecuted.add('surround');
      return true;
    }
    return false;
  }

  executeSurroundReplace(oldDelim, newDelim) {
    this.saveSnapshot();
    const cur = this.buffer.getCursor();
    const line = this.buffer.getLine(cur.row);
    const pairs = {
      '(': ['(', ')'], ')': ['(', ')'],
      '[': ['[', ']'], ']': ['[', ']'],
      '{': ['{', '}'], '}': ['{', '}'],
      '"': ['"', '"'], "'": ["'", "'"], '`': ['`', '`'],
    };
    const [oldOpen, oldClose] = pairs[oldDelim] || [oldDelim, oldDelim];
    const [newOpen, newClose] = pairs[newDelim] || [newDelim, newDelim];

    let openIdx = line.lastIndexOf(oldOpen, cur.col);
    if (openIdx === -1) openIdx = line.indexOf(oldOpen);
    const closeIdx = openIdx !== -1 ? line.indexOf(oldClose, openIdx + 1) : -1;
    if (openIdx !== -1 && closeIdx !== -1) {
      const inner = line.slice(openIdx + 1, closeIdx);
      const newLine = line.slice(0, openIdx) + newOpen + inner + newClose + line.slice(closeIdx + 1);
      this.buffer.setLine(cur.row, newLine);
      this.actionsExecuted.add('surround');
      return true;
    }
    return false;
  }
}

  try { exports.VimEngine = VimEngine; } catch(e) {}
});

/* Module: stages/curriculum.js */
defineModule('stages/curriculum.js', function(exports, require, module) {
/**
 * Complete 60-Stage Neovim Mastery & LazyVim IDE Dojo Curriculum.
 * Mapped to repository markdown chapters and modern LazyVim workflow.
 */

const STAGES = [
  // =========================================================================
  // WEEK 1: Precision Motions & The Grammar of Code (Days 1–7)
  // =========================================================================
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
    title: 'Counted Motions & Word Navigation',
    concept: '2j, f, and ciw',
    chapterRef: '01-vim-grammar-and-motions/03-movement-mastery.md',
    mission: 'Navigate the config file! Drop down 2 lines with "2j", seek to 3000 with "f3", and replace with 8080 using "cw8080<Esc>".',
    initialText: 'const config = {\n  host: "localhost",\n  port: 3000,\n  retries: 3,\n};',
    cursorStart: { row: 0, col: 0 },
    targetText: 'const config = {\n  host: "localhost",\n  port: 8080,\n  retries: 3,\n};',
    parKeystrokes: 11,
    optimalKeys: ['2', 'j', 'f', '3', 'c', 'w', '8', '0', '8', '0', 'Escape'],
    hints: [
      'Press "2j" to jump directly to line 3.',
      'Type "f3" to seek to the port number.',
      'Type "cw8080<Esc>" to change the port.'
    ],
  },
  {
    day: 3,
    week: 1,
    title: 'Inline Seeking Precision: f, t, F, T & ;',
    concept: 'Horizontal line snipers with repeat (;)',
    chapterRef: '01-vim-grammar-and-motions/03-movement-mastery.md',
    mission: 'Seek inside the SQL query using "f\'", then change inside single quotes with "ci\'active<Esc>".',
    initialText: 'const query = "SELECT id FROM users WHERE status = \'pending\';";',
    cursorStart: { row: 0, col: 0 },
    targetText: 'const query = "SELECT id FROM users WHERE status = \'active\';";',
    parKeystrokes: 12,
    optimalKeys: ['f', '\'', 'c', 'i', '\'', 'a', 'c', 't', 'i', 'v', 'e', 'Escape'],
    hints: [
      'Type "f\'" to jump cursor directly to the first single quote.',
      'Type "ci\'" to wipe inside the quotes and enter Insert mode.',
      'Type "active" and press <Esc>.'
    ],
  },
  {
    day: 4,
    week: 1,
    title: 'Line Boundaries & Whitespace Navigation: 0, ^, $',
    concept: 'Inline boundary seeking and line-end deletion (d$)',
    chapterRef: '01-vim-grammar-and-motions/03-movement-mastery.md',
    mission: 'Seek to the semicolon with "f;", step right with "l", and delete the trailing comment with "d$".',
    initialText: '    const endpoint = "/api/v2/auth"; // REMOVE_DEPRECATED_COMMENT',
    cursorStart: { row: 0, col: 0 },
    targetText: '    const endpoint = "/api/v2/auth";',
    parKeystrokes: 5,
    optimalKeys: ['f', ';', 'l', 'd', '$'],
    hints: [
      'Type "f;" to seek to the semicolon.',
      'Type "l" to step onto the trailing space.',
      'Type "d$" to delete to the end of the line.'
    ],
  },
  {
    day: 5,
    week: 1,
    title: 'Buffer Topology Jumps & Traversal: gg, G, {, }',
    concept: 'File boundaries and line deletion',
    chapterRef: '02-navigation-and-project-management/01-buffers-windows-tabs.md',
    mission: 'Teleport to the end of the file with "G", and delete the obsolete debug line with "dd".',
    initialText: 'import { createApp } from "./app";\n\nconst app = createApp();\napp.listen(3000);\n\nconsole.log(process.env);',
    cursorStart: { row: 0, col: 0 },
    targetText: 'import { createApp } from "./app";\n\nconst app = createApp();\napp.listen(3000);\n',
    parKeystrokes: 3,
    optimalKeys: ['G', 'd', 'd'],
    hints: [
      'Press "G" to jump straight to the last line.',
      'Press "dd" to delete the debug line.'
    ],
  },
  {
    day: 6,
    week: 1,
    title: 'Search As A Motion: /pattern & ciw',
    concept: 'Surgical search seeking and word replacement',
    chapterRef: '01-vim-grammar-and-motions/03-movement-mastery.md',
    mission: 'Search forward for "userOld" with "/userOld<Enter>", then replace with "ciwclient<Esc>".',
    initialText: 'const userOld = fetchUser();\nconst info = format(userOld);',
    cursorStart: { row: 0, col: 0 },
    targetText: 'const client = fetchUser();\nconst info = format(userOld);',
    parKeystrokes: 19,
    optimalKeys: ['/', 'u', 's', 'e', 'r', 'O', 'l', 'd', 'Enter', 'c', 'i', 'w', 'c', 'l', 'i', 'e', 'n', 't', 'Escape'],
    hints: [
      'Type "/userOld" and press Enter to search.',
      'Type "ciwclient<Esc>" to rename the variable.'
    ],
  },
  {
    day: 7,
    week: 1,
    title: 'Flash.nvim 2-Character Teleportation',
    concept: 's{c1}{c2} + label',
    chapterRef: '06-plugin-mastery-and-ecosystem/03-flash-nvim-teleportation-motions.md',
    mission: 'Teleport across the screen with Flash! Press "s", type "ta", jump with label "a", and change word to "finalVar" with "ciwfinalVar<Esc>".',
    initialText: 'const alpha = 1;\nconst count = 2;\nconst sum = 3;\nconst targetVar = 999;',
    cursorStart: { row: 0, col: 0 },
    targetText: 'const alpha = 1;\nconst count = 2;\nconst sum = 3;\nconst finalVar = 999;',
    parKeystrokes: 16,
    optimalKeys: ['s', 't', 'a', 'a', 'c', 'i', 'w', 'f', 'i', 'n', 'a', 'l', 'V', 'a', 'r', 'Escape'],
    hints: [
      'Type "s" then "ta" to engage Flash search on "targetVar".',
      'Press the target label "a" to jump.',
      'Type "ciwfinalVar<Esc>" to rename the variable.'
    ],
  },

  // =========================================================================
  // WEEK 2: Operators & Deep Text Objects (Days 8–14)
  // =========================================================================
  {
    day: 8,
    week: 2,
    title: 'String Literal Surgical Strikes: ci", da"',
    concept: 'Inner and around quote text objects',
    chapterRef: '01-vim-grammar-and-motions/02-the-grammar-of-vim.md',
    mission: 'Wipe inside double quotes from anywhere on the line with "ci"" and enter "https://api.v2.io".',
    initialText: 'export const API_BASE = "https://legacy.internal.staging/api/v1";',
    cursorStart: { row: 0, col: 0 },
    targetText: 'export const API_BASE = "https://api.v2.io";',
    parKeystrokes: 22,
    optimalKeys: ['c', 'i', '"', 'h', 't', 't', 'p', 's', ':', '/', '/', 'a', 'p', 'i', '.', 'v', '2', '.', 'i', 'o', 'Escape'],
    hints: [
      'Type "ci\"" to instantly clear inside quotes.',
      'Type "https://api.v2.io" and press <Esc>.'
    ],
  },
  {
    day: 9,
    week: 2,
    title: 'Parameter & Argument Extraction: ci(, da(',
    concept: 'Function argument text objects',
    chapterRef: '01-vim-grammar-and-motions/02-the-grammar-of-vim.md',
    mission: 'Refactor the signature: replace the 3 cluttered parameters using "ci(opts: UserOptions<Esc>".',
    initialText: 'export function createUser(name: string, age: number, role: string) {\n  return db.save();\n}',
    cursorStart: { row: 0, col: 0 },
    targetText: 'export function createUser(opts: UserOptions) {\n  return db.save();\n}',
    parKeystrokes: 22,
    optimalKeys: ['c', 'i', '(', 'o', 'p', 't', 's', ':', ' ', 'U', 's', 'e', 'r', 'O', 'p', 't', 'i', 'o', 'n', 's', 'Escape'],
    hints: [
      'Type "ci(" to wipe inside the parentheses.',
      'Type "opts: UserOptions" and press <Esc>.'
    ],
  },
  {
    day: 10,
    week: 2,
    title: 'Code Block Demolition: ci{, da{',
    concept: 'Block braces text objects',
    chapterRef: '01-vim-grammar-and-motions/02-the-grammar-of-vim.md',
    mission: 'Drop down into the catch block with "3j" and replace its body with "ci{throw err;<Esc>".',
    initialText: 'try {\n  runTask();\n} catch (err) {\n  console.warn("Retrying...");\n  retry();\n}',
    cursorStart: { row: 0, col: 0 },
    targetText: 'try {\n  runTask();\n} catch (err) {throw err;}',
    parKeystrokes: 16,
    optimalKeys: ['3', 'j', 'c', 'i', '{', 't', 'h', 'r', 'o', 'w', ' ', 'e', 'r', 'r', ';', 'Escape'],
    hints: [
      'Press "3j" to navigate inside the catch block.',
      'Type "ci{" to replace inside braces.',
      'Type "throw err;" and press <Esc>.'
    ],
  },
  {
    day: 11,
    week: 2,
    title: 'Tagged Template & JSX Objects: cit, dat',
    concept: 'HTML and JSX tag text objects',
    chapterRef: '04-language-specific-playbooks/01-typescript-javascript-web.md',
    mission: 'Change inside the badge element using "citActive Status<Esc>".',
    initialText: 'export const Badge = () => (\n  <span className="badge">Draft</span>\n);',
    cursorStart: { row: 1, col: 10 },
    targetText: 'export const Badge = () => (\n  <span className="badge">Active Status</span>\n);',
    parKeystrokes: 17,
    optimalKeys: ['c', 'i', 't', 'A', 'c', 't', 'i', 'v', 'e', ' ', 'S', 't', 'a', 't', 'u', 's', 'Escape'],
    hints: [
      'Positioned inside the span tag, type "cit" to change inner content.',
      'Type "Active Status" and press <Esc>.'
    ],
  },
  {
    day: 12,
    week: 2,
    title: 'Buffer Navigation & Persistence: :w & :bnext',
    concept: 'Saving and switching buffers',
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
    title: 'Linewise Swapping & Transposition: ddp',
    concept: 'Cutting a line and pasting below',
    chapterRef: '01-vim-grammar-and-motions/05-registers-and-clipboard.md',
    mission: 'Swap the two declaration lines in 3 keystrokes using "ddp"!',
    initialText: 'const SECOND = 2;\nconst FIRST = 1;',
    cursorStart: { row: 0, col: 0 },
    targetText: 'const FIRST = 1;\nconst SECOND = 2;',
    parKeystrokes: 3,
    optimalKeys: ['d', 'd', 'p'],
    hints: [
      'Type "dd" to delete and yank line 1.',
      'Type "p" to paste it right below line 2.'
    ],
  },
  {
    day: 14,
    week: 2,
    title: 'The Dot Command (.): Repetitive Automation',
    concept: 'Replaying linewise deletion across lines',
    chapterRef: '01-vim-grammar-and-motions/02-the-grammar-of-vim.md',
    mission: 'Delete obsolete line 1 with "dd", then use "." twice to repeat and delete obsolete lines 2 and 3.',
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

  // =========================================================================
  // WEEK 3: Visual Modes & Column Editing (Days 15–21)
  // =========================================================================
  {
    day: 15,
    week: 3,
    title: 'Visual Character Mode & Till Motions: vt;c',
    concept: 'Visual selection till character and change',
    chapterRef: '01-vim-grammar-and-motions/04-visual-and-block-editing.md',
    mission: 'Select through the boolean expression with "vt;" and replace with "true<Esc>".',
    initialText: 'const canAccess = false && isGuest;',
    cursorStart: { row: 0, col: 18 },
    targetText: 'const canAccess = true;',
    parKeystrokes: 9,
    optimalKeys: ['v', 't', ';', 'c', 't', 'r', 'u', 'e', 'Escape'],
    hints: [
      'Cursor starts on "false". Press "v" for Visual mode.',
      'Type "t;" to select up to the semicolon.',
      'Type "c" to change selection to "true" and press <Esc>.'
    ],
  },
  {
    day: 16,
    week: 3,
    title: 'Visual Line Mode: Indentation & Joining',
    concept: 'V, j, >, and J',
    chapterRef: '01-vim-grammar-and-motions/04-visual-and-block-editing.md',
    mission: 'Select both function lines in Visual Line mode ("Vj") and indent them right with ">".',
    initialText: 'const a = 100;\nconst b = 200;',
    cursorStart: { row: 0, col: 0 },
    targetText: '  const a = 100;\n  const b = 200;',
    parKeystrokes: 3,
    optimalKeys: ['V', 'j', '>'],
    hints: [
      'Press "V" to enter Visual Line mode.',
      'Press "j" to select both lines.',
      'Press ">" to indent.'
    ],
  },
  {
    day: 17,
    week: 3,
    title: 'Visual Block Mode: Multi-Line Prefix Insertion',
    concept: '<C-v>, j, and I (Column insertion)',
    chapterRef: '01-vim-grammar-and-motions/04-visual-and-block-editing.md',
    mission: 'Batch comment 3 lines at once: enter Visual Block mode with "<C-v>", select 2 lines down with "2j", insert "// " with "I// <Esc>".',
    initialText: 'host: "0.0.0.0"\nport: 8080\nssl: true',
    cursorStart: { row: 0, col: 0 },
    targetText: '// host: "0.0.0.0"\n// port: 8080\n// ssl: true',
    parKeystrokes: 8,
    optimalKeys: ['<C-v>', '2', 'j', 'I', '/', '/', ' ', 'Escape'],
    hints: [
      'Press "<C-v>" to enter VISUAL BLOCK mode.',
      'Press "2j" to extend down 2 lines.',
      'Press "I", type "// ", and press <Esc> to apply to all selected lines!'
    ],
  },
  {
    day: 18,
    week: 3,
    title: 'Visual Block Mode: Column Deletion',
    concept: '<C-v>, 2j, 3l, and d',
    chapterRef: '01-vim-grammar-and-motions/04-visual-and-block-editing.md',
    mission: 'Strip the line prefix markers: block select 3 lines and 3 columns ("<C-v>2j3l"), then press "d" to slice them off.',
    initialText: '01: auth\n02: user\n03: cart',
    cursorStart: { row: 0, col: 0 },
    targetText: 'auth\nuser\ncart',
    parKeystrokes: 6,
    optimalKeys: ['<C-v>', '2', 'j', '3', 'l', 'd'],
    hints: [
      'Press "<C-v>" to enter Visual Block mode.',
      'Type "2j3l" to cover the "01: " column width.',
      'Press "d" to delete the column block.'
    ],
  },
  {
    day: 19,
    week: 3,
    title: 'Surround Manipulation: mini.surround',
    concept: 'gsaw" (surround word)',
    chapterRef: '06-plugin-mastery-and-ecosystem/06-micro-productivity-and-editing-plugins.md',
    mission: 'Surround the bare identifier with quotes: type "gsaw"" to wrap "development" in double quotes.',
    initialText: 'const env = development;',
    cursorStart: { row: 0, col: 15 },
    targetText: 'const env = "development";',
    parKeystrokes: 5,
    optimalKeys: ['g', 's', 'a', 'w', '"'],
    hints: [
      'Position cursor on "development".',
      'Type "gsaw\"" to surround inner word with double quotes.'
    ],
  },
  {
    day: 20,
    week: 3,
    title: 'Marks & Spatial Anchors: ma, \'a',
    concept: 'Setting and leaping between bookmarked lines',
    chapterRef: '01-vim-grammar-and-motions/03-movement-mastery.md',
    mission: 'Set mark "a" with "ma", leap to the bottom with "G", then jump back to mark "a" with "\'a", and delete line with "dd".',
    initialText: 'const TOP_SECRET = "xyz";\n// ... lots of lines ...\nconst FOOTER = "end";',
    cursorStart: { row: 0, col: 0 },
    targetText: '// ... lots of lines ...\nconst FOOTER = "end";',
    parKeystrokes: 7,
    optimalKeys: ['m', 'a', 'G', '\'', 'a', 'd', 'd'],
    hints: [
      'Type "ma" to store mark a.',
      'Type "G" to teleport to footer.',
      'Type "\'a" to leap back to mark a, then "dd" to delete.'
    ],
  },
  {
    day: 21,
    week: 3,
    title: 'Jumplist Time Travel: gd & Symbol Navigation',
    concept: 'Code symbol navigation with gd',
    chapterRef: '03-modern-ide-power-tools/02-code-navigation-and-inspection.md',
    mission: 'Dive to the definition of "userConfig" with "gd", then change word to "appConfig" with "ciwappConfig<Esc>".',
    initialText: 'const userConfig = { active: true };\n\nfunction start() {\n  return userConfig;\n}',
    cursorStart: { row: 3, col: 10 },
    targetText: 'const appConfig = { active: true };\n\nfunction start() {\n  return userConfig;\n}',
    parKeystrokes: 15,
    optimalKeys: ['g', 'd', 'c', 'i', 'w', 'a', 'p', 'p', 'C', 'o', 'n', 'f', 'i', 'g', 'Escape'],
    hints: [
      'Cursor is on "userConfig". Type "gd" to jump to its declaration line.',
      'Type "ciwappConfig<Esc>" to rename it.'
    ],
  },

  // =========================================================================
  // WEEK 4: Ex Commands & Global Stream Editing (Days 22–28)
  // =========================================================================
  {
    day: 22,
    week: 4,
    title: 'Global Regex Substitution: :%s/old/new/g',
    concept: 'Modernizing legacy ES5 var to const across buffer',
    chapterRef: '06-plugin-mastery-and-ecosystem/04-grug-far-project-search-and-replace.md',
    mission: 'Modernize all "var " to "const " using ":%s/var /const /g<Enter>".',
    initialText: 'var a = 1;\nvar b = 2;\nvar c = 3;',
    cursorStart: { row: 0, col: 0 },
    targetText: 'const a = 1;\nconst b = 2;\nconst c = 3;',
    parKeystrokes: 19,
    optimalKeys: [':', '%', 's', '/', 'v', 'a', 'r', ' ', '/', 'c', 'o', 'n', 's', 't', ' ', '/', 'g', 'Enter'],
    hints: [
      'Type ":%s/var /const /g" and press Enter.'
    ],
  },
  {
    day: 23,
    week: 4,
    title: 'Line Range Substitution: :2,3s/find/replace/g',
    concept: 'Precision scoped range replacements',
    chapterRef: '01-vim-grammar-and-motions/02-the-grammar-of-vim.md',
    mission: 'Replace "DEBUG" with "PROD" only on lines 2 through 3 using ":2,3s/DEBUG/PROD/g<Enter>".',
    initialText: 'const env1 = "DEBUG";\nconst env2 = "DEBUG";\nconst env3 = "DEBUG";',
    cursorStart: { row: 0, col: 0 },
    targetText: 'const env1 = "DEBUG";\nconst env2 = "PROD";\nconst env3 = "PROD";',
    parKeystrokes: 20,
    optimalKeys: [':', '2', ',', '3', 's', '/', 'D', 'E', 'B', 'U', 'G', '/', 'P', 'R', 'O', 'D', '/', 'g', 'Enter'],
    hints: [
      'Type ":2,3s/DEBUG/PROD/g" and press Enter.'
    ],
  },
  {
    day: 24,
    week: 4,
    title: 'Global Line Deletion: :g/pattern/d',
    concept: 'Cleaning debug logs with ex command',
    chapterRef: '01-vim-grammar-and-motions/02-the-grammar-of-vim.md',
    mission: 'Strip all console.log statements instantly using ":g/console.log/d<Enter>".',
    initialText: 'function calculate() {\n  console.log("start");\n  const val = 42;\n  console.log("end");\n  return val;\n}',
    cursorStart: { row: 0, col: 0 },
    targetText: 'function calculate() {\n  const val = 42;\n  return val;\n}',
    parKeystrokes: 18,
    optimalKeys: [':', 'g', '/', 'c', 'o', 'n', 's', 'o', 'l', 'e', '.', 'l', 'o', 'g', '/', 'd', 'Enter'],
    hints: [
      'Type ":g/console.log/d" and press Enter.'
    ],
  },
  {
    day: 25,
    week: 4,
    title: 'Inverted Global Filter: :v/pattern/d',
    concept: 'Isolating public exports with :v',
    chapterRef: '01-vim-grammar-and-motions/02-the-grammar-of-vim.md',
    mission: 'Delete all lines that DO NOT contain "export" using ":v/export/d<Enter>".',
    initialText: 'const internalHelper = 1;\nexport const API_URL = "https://api.com";\nconst cache = {};\nexport const PORT = 8080;',
    cursorStart: { row: 0, col: 0 },
    targetText: 'export const API_URL = "https://api.com";\nexport const PORT = 8080;',
    parKeystrokes: 13,
    optimalKeys: [':', 'v', '/', 'e', 'x', 'p', 'o', 'r', 't', '/', 'd', 'Enter'],
    hints: [
      'Type ":v/export/d" and press Enter to keep only exported lines.'
    ],
  },
  {
    day: 26,
    week: 4,
    title: 'Normal Command Execution: :%norm',
    concept: 'Batch executing normal mode keystrokes via Ex',
    chapterRef: '01-vim-grammar-and-motions/02-the-grammar-of-vim.md',
    mission: 'Prepend "// " to every line in the buffer using ":%norm I// <Enter>".',
    initialText: 'alpha: 1\nbeta: 2\ngamma: 3',
    cursorStart: { row: 0, col: 0 },
    targetText: '// alpha: 1\n// beta: 2\n// gamma: 3',
    parKeystrokes: 12,
    optimalKeys: [':', '%', 'n', 'o', 'r', 'm', ' ', 'I', '/', '/', ' ', 'Enter'],
    hints: [
      'Type ":%norm I// " and press Enter.'
    ],
  },
  {
    day: 27,
    week: 4,
    title: 'Command Mode Save & Write Verification: :w',
    concept: 'Validating written disk state',
    chapterRef: '00-getting-started/03-first-day-survival-guide.md',
    mission: 'Save the configuration buffer with ":w<Enter>".',
    initialText: 'export const SERVER_CONFIG = { mode: "production" };',
    cursorStart: { row: 0, col: 0 },
    targetText: 'export const SERVER_CONFIG = { mode: "production" };',
    requiredAction: 'save',
    parKeystrokes: 3,
    optimalKeys: [':', 'w', 'Enter'],
    hints: [
      'Type ":w" and press Enter.'
    ],
  },
  {
    day: 28,
    week: 4,
    title: 'Macro Recording: The Automation Loop (qa...q, @a)',
    concept: 'Recording and replaying keyboard macros',
    chapterRef: '05-advanced-and-customization/04-30-day-practice-drills.md',
    mission: 'Record macro "a" with "qaA;<Esc>jq" on line 1, then replay it on lines 2 and 3 with "2@a".',
    initialText: 'const a = 1\nconst b = 2\nconst c = 3',
    cursorStart: { row: 0, col: 0 },
    targetText: 'const a = 1;\nconst b = 2;\nconst c = 3;',
    parKeystrokes: 10,
    optimalKeys: ['q', 'a', 'A', ';', 'Escape', 'j', 'q', '2', '@', 'a'],
    hints: [
      'Type "qa" to start recording to register a.',
      'Type "A;<Esc>j" then "q" to stop recording.',
      'Type "2@a" to replay the macro across the remaining 2 lines.'
    ],
  },

  // =========================================================================
  // WEEK 5: LazyVim Discovery & File Navigation (Days 29–35)
  // =========================================================================
  {
    day: 29,
    week: 5,
    title: 'LazyVim Fzf: Find Files (<leader>ff)',
    concept: '<Space>ff Fuzzy finder modal',
    chapterRef: '02-navigation-and-project-management/02-file-finding-telescope-fzf.md',
    mission: 'Launch the Fzf file finder modal using "<Space>ff".',
    initialText: '// Press <Space>ff to find files across the project\nconsole.log("Ready");',
    cursorStart: { row: 0, col: 0 },
    targetText: '// Press <Space>ff to find files across the project\nconsole.log("Ready");',
    requiredAction: 'fzf',
    parKeystrokes: 3,
    optimalKeys: [' ', 'f', 'f'],
    hints: [
      'Press Space, then "f", then "f" to trigger Fzf Find Files.'
    ],
  },
  {
    day: 30,
    week: 5,
    title: 'LazyVim Fzf: Live Grep (<leader>sg)',
    concept: '<Space>sg Codebase ripgrep search',
    chapterRef: '02-navigation-and-project-management/02-file-finding-telescope-fzf.md',
    mission: 'Launch the live grep search modal using "<Space>sg".',
    initialText: '// Press <Space>sg to search strings across project files',
    cursorStart: { row: 0, col: 0 },
    targetText: '// Press <Space>sg to search strings across project files',
    requiredAction: 'grep',
    parKeystrokes: 3,
    optimalKeys: [' ', 's', 'g'],
    hints: [
      'Press Space, then "s", then "g" to open Live Grep.'
    ],
  },
  {
    day: 31,
    week: 5,
    title: 'LazyVim Fzf: Buffer Picker (<leader>fb)',
    concept: '<Space>fb Active buffer navigation',
    chapterRef: '02-navigation-and-project-management/01-buffers-windows-tabs.md',
    mission: 'Open the buffer selector modal with "<Space>fb".',
    initialText: '// Press <Space>fb to switch between open buffers',
    cursorStart: { row: 0, col: 0 },
    targetText: '// Press <Space>fb to switch between open buffers',
    requiredAction: 'buffers',
    parKeystrokes: 3,
    optimalKeys: [' ', 'f', 'b'],
    hints: [
      'Press Space, then "f", then "b" to list active buffers.'
    ],
  },
  {
    day: 32,
    week: 5,
    title: 'LazyVim Neo-tree: File Explorer (<leader>e)',
    concept: '<Space>e Collapsible file sidebar',
    chapterRef: '02-navigation-and-project-management/03-file-explorers-neotree-oil.md',
    mission: 'Toggle the Neo-tree sidebar explorer using "<Space>e".',
    initialText: '// Press <Space>e to toggle Neo-tree sidebar explorer',
    cursorStart: { row: 0, col: 0 },
    targetText: '// Press <Space>e to toggle Neo-tree sidebar explorer',
    requiredAction: 'neotree',
    parKeystrokes: 2,
    optimalKeys: [' ', 'e'],
    hints: [
      'Press Space, then "e" to toggle Neo-tree.'
    ],
  },
  {
    day: 33,
    week: 5,
    title: 'LazyVim Trouble: Diagnostics Drawer (<leader>xx)',
    concept: '<Space>xx Workspace type and lint errors',
    chapterRef: '03-modern-ide-power-tools/06-diagnostics-and-trouble.md',
    mission: 'Toggle the Trouble diagnostics drawer with "<Space>xx".',
    initialText: '// Press <Space>xx to toggle Trouble diagnostics panel',
    cursorStart: { row: 0, col: 0 },
    targetText: '// Press <Space>xx to toggle Trouble diagnostics panel',
    requiredAction: 'trouble',
    parKeystrokes: 3,
    optimalKeys: [' ', 'x', 'x'],
    hints: [
      'Press Space, then "x", then "x" to open Trouble.'
    ],
  },
  {
    day: 34,
    week: 5,
    title: 'Diagnostic Hopping: ]d & Line Removal',
    concept: ']d Jump to next diagnostic error',
    chapterRef: '03-modern-ide-power-tools/06-diagnostics-and-trouble.md',
    mission: 'Jump to the diagnostic error line with "]d" and delete it with "dd".',
    initialText: 'const valid = true;\n// ERROR: Type mismatch at runtime\nconst port = 3000;',
    cursorStart: { row: 0, col: 0 },
    targetText: 'const valid = true;\nconst port = 3000;',
    parKeystrokes: 4,
    optimalKeys: [']', 'd', 'd', 'd'],
    hints: [
      'Type "]d" to jump directly to the diagnostic error.',
      'Type "dd" to remove the error line.'
    ],
  },
  {
    day: 35,
    week: 5,
    title: 'LazyVim Which-Key Intuition (<Space>)',
    concept: '<Space> Leader discovery and fast saving (<Space>w)',
    chapterRef: '01-vim-grammar-and-motions/01-why-neovim-mental-model.md',
    mission: 'Use the LazyVim leader key to save the buffer: press "<Space>w".',
    initialText: 'export const status = "saved_with_leader";',
    cursorStart: { row: 0, col: 0 },
    targetText: 'export const status = "saved_with_leader";',
    requiredAction: 'save',
    parKeystrokes: 2,
    optimalKeys: [' ', 'w'],
    hints: [
      'Press Space, then "w" to trigger the LazyVim quick save.'
    ],
  },

  // =========================================================================
  // WEEK 6: LSP Code Intelligence & Productivity (Days 36–42)
  // =========================================================================
  {
    day: 36,
    week: 6,
    title: 'LSP Hover Documentation (K)',
    concept: 'K symbol documentation and type inspection',
    chapterRef: '03-modern-ide-power-tools/02-code-navigation-and-inspection.md',
    mission: 'Inspect the type signature under cursor by pressing "K".',
    initialText: 'export interface UserSession {\n  id: string;\n  token: string;\n}',
    cursorStart: { row: 0, col: 20 },
    targetText: 'export interface UserSession {\n  id: string;\n  token: string;\n}',
    requiredAction: 'lsp_hover',
    parKeystrokes: 1,
    optimalKeys: ['K'],
    hints: [
      'Press uppercase "K" to request LSP hover docs.'
    ],
  },
  {
    day: 37,
    week: 6,
    title: 'LSP Goto Definition (gd)',
    concept: 'gd jump to declaration',
    chapterRef: '03-modern-ide-power-tools/02-code-navigation-and-inspection.md',
    mission: 'Jump to the definition of "createAuthService" using "gd".',
    initialText: 'function createAuthService() {}\n\nconst auth = createAuthService();',
    cursorStart: { row: 2, col: 15 },
    targetText: 'function createAuthService() {}\n\nconst auth = createAuthService();',
    requiredAction: 'lsp_definition',
    parKeystrokes: 2,
    optimalKeys: ['g', 'd'],
    hints: [
      'Type "gd" to jump to definition.'
    ],
  },
  {
    day: 38,
    week: 6,
    title: 'LSP References Inspection (gr)',
    concept: 'gr list all usages across codebase',
    chapterRef: '03-modern-ide-power-tools/02-code-navigation-and-inspection.md',
    mission: 'Query all references of the identifier under cursor using "gr".',
    initialText: 'export const APP_ID = "org.app.v1";',
    cursorStart: { row: 0, col: 15 },
    targetText: 'export const APP_ID = "org.app.v1";',
    requiredAction: 'lsp_references',
    parKeystrokes: 2,
    optimalKeys: ['g', 'r'],
    hints: [
      'Type "gr" to list references.'
    ],
  },
  {
    day: 39,
    week: 6,
    title: 'LSP Code Actions (<leader>ca)',
    concept: '<Space>ca quickfix and auto-import menu',
    chapterRef: '03-modern-ide-power-tools/03-refactoring-and-code-actions.md',
    mission: 'Trigger the LSP code actions menu using "<Space>ca".',
    initialText: 'const element = React.createElement("div");',
    cursorStart: { row: 0, col: 18 },
    targetText: 'const element = React.createElement("div");',
    requiredAction: 'lsp_code_action',
    parKeystrokes: 3,
    optimalKeys: [' ', 'c', 'a'],
    hints: [
      'Press Space, then "c", then "a" to show code actions.'
    ],
  },
  {
    day: 40,
    week: 6,
    title: 'LSP Symbol Rename (<leader>cr)',
    concept: '<Space>cr safe symbol refactor',
    chapterRef: '03-modern-ide-power-tools/03-refactoring-and-code-actions.md',
    mission: 'Open the LSP symbol rename dialog using "<Space>cr".',
    initialText: 'function oldProcessUser(id: string) {}',
    cursorStart: { row: 0, col: 12 },
    targetText: 'function oldProcessUser(id: string) {}',
    requiredAction: 'lsp_rename',
    parKeystrokes: 3,
    optimalKeys: [' ', 'c', 'r'],
    hints: [
      'Press Space, then "c", then "r" to trigger LSP rename.'
    ],
  },
  {
    day: 41,
    week: 6,
    title: 'LSP Document Formatting (<leader>cf)',
    concept: '<Space>cf auto-format document',
    chapterRef: '03-modern-ide-power-tools/04-formatting-and-linting.md',
    mission: 'Format this unindented buffer to clean Prettier standards using "<Space>cf".',
    initialText: 'function calc() {\nconst a = 1;\nreturn a;\n}',
    cursorStart: { row: 0, col: 0 },
    targetText: 'function calc() {\n  const a = 1;\n  return a;\n}',
    requiredAction: 'format',
    parKeystrokes: 3,
    optimalKeys: [' ', 'c', 'f'],
    hints: [
      'Press Space, then "c", then "f" to format the document.'
    ],
  },
  {
    day: 42,
    week: 6,
    title: 'Treesitter Method Hopping: ]m & [m',
    concept: 'AST function jump and change inside braces',
    chapterRef: '02-navigation-and-project-management/04-treesitter-code-navigation.md',
    mission: 'Jump to the second function with "]m", and wipe its inner contents with "ci{".',
    initialText: 'function first() {\n  return 1;\n}\n\nfunction target() {\n  OBSOLETE\n}',
    cursorStart: { row: 0, col: 0 },
    targetText: 'function first() {\n  return 1;\n}\n\nfunction target() {}',
    parKeystrokes: 6,
    optimalKeys: [']', 'm', 'c', 'i', '{', 'Escape'],
    hints: [
      'Type "]m" to leap cursor to function target.',
      'Type "ci{" to clear inside braces and press <Esc>.'
    ],
  },

  // =========================================================================
  // WEEK 7: Git, Search & Plugin Productivity (Days 43–49)
  // =========================================================================
  {
    day: 43,
    week: 7,
    title: 'LazyGit Dashboard (<leader>gg)',
    concept: '<Space>gg Floating terminal git management',
    chapterRef: '02-navigation-and-project-management/05-git-workflow-and-lazygit.md',
    mission: 'Open the LazyGit dashboard modal using "<Space>gg".',
    initialText: '// Press <Space>gg to open LazyGit dashboard',
    cursorStart: { row: 0, col: 0 },
    targetText: '// Press <Space>gg to open LazyGit dashboard',
    requiredAction: 'lazygit',
    parKeystrokes: 3,
    optimalKeys: [' ', 'g', 'g'],
    hints: [
      'Press Space, then "g", then "g" to open LazyGit.'
    ],
  },
  {
    day: 44,
    week: 7,
    title: 'Grug-Far: Project Search & Replace (<leader>sr)',
    concept: '<Space>sr Multi-file find and replace',
    chapterRef: '06-plugin-mastery-and-ecosystem/04-grug-far-project-search-and-replace.md',
    mission: 'Open Grug-Far project find and replace using "<Space>sr".',
    initialText: '// Press <Space>sr to trigger project search and replace',
    cursorStart: { row: 0, col: 0 },
    targetText: '// Press <Space>sr to trigger project search and replace',
    requiredAction: 'grug_far',
    parKeystrokes: 3,
    optimalKeys: [' ', 's', 'r'],
    hints: [
      'Press Space, then "s", then "r" to invoke Grug-Far.'
    ],
  },
  {
    day: 45,
    week: 7,
    title: 'Lazy.nvim Plugin Ecosystem (<leader>l)',
    concept: '<Space>l Plugin manager status',
    chapterRef: '06-plugin-mastery-and-ecosystem/01-lazy-nvim-plugin-manager.md',
    mission: 'Open the Lazy.nvim manager dashboard with "<Space>l".',
    initialText: '// Press <Space>l to inspect installed Lazy plugins',
    cursorStart: { row: 0, col: 0 },
    targetText: '// Press <Space>l to inspect installed Lazy plugins',
    requiredAction: 'lazy_home',
    parKeystrokes: 2,
    optimalKeys: [' ', 'l'],
    hints: [
      'Press Space, then "l" to inspect Lazy.nvim.'
    ],
  },
  {
    day: 46,
    week: 7,
    title: 'Snacks Scratchpad Prototyping (<leader>.)',
    concept: '<Space>. Floating scratchpad',
    chapterRef: '06-plugin-mastery-and-ecosystem/06-micro-productivity-and-editing-plugins.md',
    mission: 'Open the Snacks floating scratchpad buffer using "<Space>.".',
    initialText: '// Press <Space>. to toggle scratchpad',
    cursorStart: { row: 0, col: 0 },
    targetText: '// Press <Space>. to toggle scratchpad',
    requiredAction: 'scratchpad',
    parKeystrokes: 2,
    optimalKeys: [' ', '.'],
    hints: [
      'Press Space, then "." to open scratchpad.'
    ],
  },
  {
    day: 47,
    week: 7,
    title: 'Floating Terminal Multiplexing (<leader>ft)',
    concept: '<Space>ft Embedded floating terminal',
    chapterRef: '02-navigation-and-project-management/01-buffers-windows-tabs.md',
    mission: 'Toggle the floating terminal with "<Space>ft".',
    initialText: '// Press <Space>ft to toggle floating terminal',
    cursorStart: { row: 0, col: 0 },
    targetText: '// Press <Space>ft to toggle floating terminal',
    requiredAction: 'terminal',
    parKeystrokes: 3,
    optimalKeys: [' ', 'f', 't'],
    hints: [
      'Press Space, then "f", then "t" to open the floating terminal.'
    ],
  },
  {
    day: 48,
    week: 7,
    title: 'Vim-Surround Delimiter Replacement: cs"\' & ds"',
    concept: 'cs"\' replace and ds" delete surround',
    chapterRef: '06-plugin-mastery-and-ecosystem/06-micro-productivity-and-editing-plugins.md',
    mission: 'Replace double quotes around "production" with single quotes using "cs"\'".',
    initialText: 'const env = "production";',
    cursorStart: { row: 0, col: 15 },
    targetText: 'const env = \'production\';',
    parKeystrokes: 4,
    optimalKeys: ['c', 's', '"', '\''],
    hints: [
      'Positioned inside quotes, type "cs\"\'" to replace double quotes with single quotes.'
    ],
  },
  {
    day: 49,
    week: 7,
    title: 'Multi-Count Macro Orchestration: qaIexport <Esc>jq, 2@a',
    concept: 'Batch exporting private variables with macro',
    chapterRef: '05-advanced-and-customization/04-30-day-practice-drills.md',
    mission: 'Record macro "a" on line 1 ("qaIexport <Esc>jq"), then replay across lines 2 and 3 with "2@a".',
    initialText: 'const USER = "eddie";\nconst ROLE = "admin";\nconst ACCESS = true;',
    cursorStart: { row: 0, col: 0 },
    targetText: 'export const USER = "eddie";\nexport const ROLE = "admin";\nexport const ACCESS = true;',
    parKeystrokes: 16,
    optimalKeys: ['q', 'a', 'I', 'e', 'x', 'p', 'o', 'r', 't', ' ', 'Escape', 'j', 'q', '2', '@', 'a'],
    hints: [
      'Type "qa" to start macro a.',
      'Type "Iexport <Esc>j" and "q" to stop.',
      'Type "2@a" to run across remaining lines.'
    ],
  },

  // =========================================================================
  // WEEK 8: The Grandmaster Trials & Polyglot Refactoring (Days 50–60)
  // =========================================================================
  {
    day: 50,
    week: 8,
    title: 'TypeScript Refactor: Parameter Pruning (f, dt))',
    concept: 'Precision seeking and forward slice deletion',
    chapterRef: '04-language-specific-playbooks/01-typescript-javascript-web.md',
    mission: 'Prune the deprecated callback parameter: seek to comma with "f,", and delete through closing paren with "dt)".',
    initialText: 'function getData(url: string, callback: any) {\n  return fetch(url);\n}',
    cursorStart: { row: 0, col: 0 },
    targetText: 'function getData(url: string) {\n  return fetch(url);\n}',
    parKeystrokes: 5,
    optimalKeys: ['f', ',', 'd', 't', ')'],
    hints: [
      'Type "f," to seek to the comma.',
      'Type "dt)" to delete right up to the closing parenthesis.'
    ],
  },
  {
    day: 51,
    week: 8,
    title: 'React Refactor: Component Name Modernization (ciw)',
    concept: 'Modern React component identifier renaming',
    chapterRef: '04-language-specific-playbooks/01-typescript-javascript-web.md',
    mission: 'Modernize the component name: change "OldHeader" to "AppHeader" using "ciwAppHeader<Esc>".',
    initialText: 'export const OldHeader = () => {\n  return <h1>Welcome</h1>;\n};',
    cursorStart: { row: 0, col: 13 },
    targetText: 'export const AppHeader = () => {\n  return <h1>Welcome</h1>;\n};',
    parKeystrokes: 13,
    optimalKeys: ['c', 'i', 'w', 'A', 'p', 'p', 'H', 'e', 'a', 'd', 'e', 'r', 'Escape'],
    hints: [
      'Cursor on "OldHeader". Type "ciwAppHeader<Esc>".'
    ],
  },
  {
    day: 52,
    week: 8,
    title: 'SQL Schema to TypeScript Interface Mapping',
    concept: 'Surround conversions on record fields',
    chapterRef: '04-language-specific-playbooks/01-typescript-javascript-web.md',
    mission: 'Enclose the raw column names in double quotes using "gsaw"" on line 1, then "j0gsaw"" on line 2.',
    initialText: 'email: string;\nstatus: string;',
    cursorStart: { row: 0, col: 0 },
    targetText: '"email": string;\n"status": string;',
    parKeystrokes: 12,
    optimalKeys: ['g', 's', 'a', 'w', '"', 'j', '0', 'g', 's', 'a', 'w', '"'],
    hints: [
      'Type "gsaw\"" to quote email.',
      'Type "j0gsaw\"" to quote status.'
    ],
  },
  {
    day: 53,
    week: 8,
    title: 'Go Struct Refactor: Updating Struct Tags (ci`)',
    concept: 'Backtick text object modification',
    chapterRef: '04-language-specific-playbooks/03-go-development-powerhouse.md',
    mission: 'Change the struct tag inside backticks to json:"user_id" with "ci`json:"user_id"<Esc>".',
    initialText: 'type User struct {\n  ID string `json:"old_id"`\n}',
    cursorStart: { row: 1, col: 14 },
    targetText: 'type User struct {\n  ID string `json:"user_id"`\n}',
    parKeystrokes: 19,
    optimalKeys: ['c', 'i', '`', 'j', 's', 'o', 'n', ':', '"', 'u', 's', 'e', 'r', '_', 'i', 'd', '"', 'Escape'],
    hints: [
      'Type "ci`" to clear inside backticks.',
      'Type json:"user_id" and exit with <Esc>.'
    ],
  },
  {
    day: 54,
    week: 8,
    title: 'Python Workflow: Indentation & Docstrings',
    concept: 'Visual line indentation and docstring edits',
    chapterRef: '04-language-specific-playbooks/02-python-environment-workflow.md',
    mission: 'Indent the function body right using "V" then ">".',
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
    day: 55,
    week: 8,
    title: 'Rust Craftsmanship: Match Arms & Option Unwrap',
    concept: 'Safe error message strings in Rust',
    chapterRef: '04-language-specific-playbooks/04-rust-craftsmanship.md',
    mission: 'Change the expect message inside quotes with "ci"" -> "connection timeout".',
    initialText: 'let conn = pool.get().expect("PANIC_HERE");',
    cursorStart: { row: 0, col: 32 },
    targetText: 'let conn = pool.get().expect("connection timeout");',
    parKeystrokes: 22,
    optimalKeys: ['c', 'i', '"', 'c', 'o', 'n', 'n', 'e', 'c', 't', 'i', 'o', 'n', ' ', 't', 'i', 'm', 'e', 'o', 'u', 't', 'Escape'],
    hints: [
      'Type "ci\"" to wipe inside quotes.',
      'Type "connection timeout" and press <Esc>.'
    ],
  },
  {
    day: 56,
    week: 8,
    title: 'Production Incident: Hotfixing JWT Secret Under Pressure',
    concept: 'Search, replace inside quotes, and instant save',
    chapterRef: '05-advanced-and-customization/04-30-day-practice-drills.md',
    mission: 'Production bug! Seek to the compromised secret with "/secret<Enter>", replace with "ci"STRONG_PROD_SECRET<Esc>", and save with ":w<Enter>".',
    initialText: 'export const JWT_SECRET = "default_dev_secret";\nexport const PORT = 4000;',
    cursorStart: { row: 0, col: 0 },
    targetText: 'export const JWT_SECRET = "STRONG_PROD_SECRET";\nexport const PORT = 4000;',
    requiredAction: 'save',
    parKeystrokes: 33,
    optimalKeys: ['/', 's', 'e', 'c', 'r', 'e', 't', 'Enter', 'c', 'i', '"', 'S', 'T', 'R', 'O', 'N', 'G', '_', 'P', 'R', 'O', 'D', '_', 'S', 'E', 'C', 'R', 'E', 'T', 'Escape', ':', 'w', 'Enter'],
    hints: [
      'Search for "/secret" <Enter>.',
      'Type "ci\"" -> "STRONG_PROD_SECRET" -> <Esc>.',
      'Type ":w" <Enter> to save.'
    ],
  },
  {
    day: 57,
    week: 8,
    title: 'Speedrun Golf: Monolith Cleanup in Ex Commands',
    concept: ':%s and :g compound execution',
    chapterRef: '05-advanced-and-customization/04-30-day-practice-drills.md',
    mission: 'Strip all "console.log" lines with ":g/console.log/d<Enter>".',
    initialText: 'const a = 1;\nconsole.log(a);\nconst b = 2;\nconsole.log(b);',
    cursorStart: { row: 0, col: 0 },
    targetText: 'const a = 1;\nconst b = 2;',
    parKeystrokes: 18,
    optimalKeys: [':', 'g', '/', 'c', 'o', 'n', 's', 'o', 'l', 'e', '.', 'l', 'o', 'g', '/', 'd', 'Enter'],
    hints: [
      'Type ":g/console.log/d" and press Enter.'
    ],
  },
  {
    day: 58,
    week: 8,
    title: 'Full LazyVim Integration: Format & Save',
    concept: '<Space>cf format and <Space>w save pipeline',
    chapterRef: '06-plugin-mastery-and-ecosystem/01-lazy-nvim-plugin-manager.md',
    mission: 'Format the messy indentation with "<Space>cf" and save with "<Space>w".',
    initialText: 'function run() {\nconst ready = true;\nreturn ready;\n}',
    cursorStart: { row: 0, col: 0 },
    targetText: 'function run() {\n  const ready = true;\n  return ready;\n}',
    requiredAction: 'save',
    parKeystrokes: 5,
    optimalKeys: [' ', 'c', 'f', ' ', 'w'],
    hints: [
      'Press "<Space>cf" to format.',
      'Press "<Space>w" to write buffer.'
    ],
  },
  {
    day: 59,
    week: 8,
    title: 'Vim Golf Gauntlet: The 5-Keystroke Code Surgery',
    concept: 'V2jcclean<Esc>',
    chapterRef: '05-advanced-and-customization/04-30-day-practice-drills.md',
    mission: 'Golf Challenge! Transform the 3 legacy lines into "clean" in under 10 keystrokes using "V2jcclean<Esc>".',
    initialText: 'broken_1\nbroken_2\nbroken_3',
    cursorStart: { row: 0, col: 0 },
    targetText: 'clean',
    parKeystrokes: 10,
    optimalKeys: ['V', '2', 'j', 'c', 'c', 'l', 'e', 'a', 'n', 'Escape'],
    hints: [
      'Press "V" for Visual Line.',
      'Press "2j" to select all 3 lines.',
      'Press "c" to change them into "clean" and press <Esc>.'
    ],
  },
  {
    day: 60,
    week: 8,
    title: 'The Neovim Grandmaster Crown: Full-Stack Graduation',
    concept: 'Ultimate Full-Stack Refactor & Certification',
    chapterRef: '05-advanced-and-customization/04-30-day-practice-drills.md',
    mission: 'Final Trial: Wipe "IN_PROGRESS" with "ci"", insert "NEOVIM_GRANDMASTER", and save with ":w".',
    initialText: 'export const CERTIFICATION_STATUS = "IN_PROGRESS";',
    cursorStart: { row: 0, col: 40 },
    targetText: 'export const CERTIFICATION_STATUS = "NEOVIM_GRANDMASTER";',
    requiredAction: 'save',
    parKeystrokes: 26,
    optimalKeys: ['c', 'i', '"', 'N', 'E', 'O', 'V', 'I', 'M', '_', 'G', 'R', 'A', 'N', 'D', 'M', 'A', 'S', 'T', 'E', 'R', 'Escape', ':', 'w', 'Enter'],
    hints: [
      'Type "ci\"" to clear inside quotes.',
      'Type "NEOVIM_GRANDMASTER" and press <Esc>.',
      'Type ":w" <Enter> to save and claim the Grandmaster Crown!'
    ],
  },
];

  try { exports.STAGES = STAGES; } catch(e) {}
  try { exports.createUser = createUser; } catch(e) {}
  try { exports.start = start; } catch(e) {}
  try { exports.calculate = calculate; } catch(e) {}
  try { exports.createAuthService = createAuthService; } catch(e) {}
  try { exports.oldProcessUser = oldProcessUser; } catch(e) {}
  try { exports.calc = calc; } catch(e) {}
  try { exports.first = first; } catch(e) {}
  try { exports.target = target; } catch(e) {}
  try { exports.getData = getData; } catch(e) {}
  try { exports.run = run; } catch(e) {}
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
  const isFlashMode = mode === 'FLASH';
  const hasFlashTargets = (engine.flashTargets || []).length > 0;

  for (let r = 0; r < lines.length; r++) {
    const isCurrentLine = r === cur.row;
    const lineFlashTargets = (engine.flashTargets || []).filter(t => t.row === r);
    const hasTargetsOnThisLine = lineFlashTargets.length > 0;

    let lineClass = isCurrentLine ? 'buffer-line active-line' : 'buffer-line';
    if (isFlashMode && hasFlashTargets) {
      lineClass += hasTargetsOnThisLine ? ' flash-target-line' : ' flash-dimmed-line';
    }

    // Hybrid line numbers (relative + absolute on current)
    const lineNum = isCurrentLine ? `${r + 1}` : `${Math.abs(r - cur.row)}`;

    const rawLine = lines[r];
    let lineRendered = '';

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
      // Render line with non-destructive flash beacon badges and highlighted target text
      let lastIdx = 0;
      for (const t of lineFlashTargets) {
        lineRendered += escapeHtml(rawLine.slice(lastIdx, t.col));
        const matchLen = 2;
        const matchedChars = escapeHtml(rawLine.slice(t.col, t.col + matchLen));
        lineRendered += `<span class="flash-match-wrapper"><span class="flash-label" data-label="${escapeHtml(t.label)}">${escapeHtml(t.label.toUpperCase())}</span><span class="flash-matched-text">${matchedChars}</span></span>`;
        lastIdx = t.col + matchLen;
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
      if (mode === 'FLASH') cursorClass = 'vim-cursor cursor-flash';

      lineRendered = `${before}<span class="${cursorClass}">${escapeHtml(cursorChar)}</span>${after}`;
    } else {
      lineRendered = highlightCode(rawLine) || ' ';
    }

    html += `<div class="${lineClass}">
      <span class="line-num">${lineNum}</span>
      <span class="line-content">${lineRendered}</span>
    </div>`;
  }

  // Floating Flash Prompt Bar inside viewport when in FLASH mode
  if (isFlashMode) {
    let flashStatusHtml = '';
    if (hasFlashTargets) {
      const q = engine.lastFlashQuery || '';
      const beaconKey = (engine.flashTargets[0]?.label || 'a').toUpperCase();
      flashStatusHtml = `<span class="flash-bar-query">Target: <strong>${escapeHtml(q)}</strong></span> <span class="flash-bar-action">▸ Press beacon <kbd class="flash-beacon-key">${beaconKey}</kbd> to jump</span>`;
    } else if (engine.pendingKeys && engine.pendingKeys.length > 0) {
      flashStatusHtml = `<span class="flash-bar-query">Query: <strong>${escapeHtml(engine.pendingKeys)}</strong>_</span> <span class="flash-bar-hint">(type 1 more character)</span>`;
    } else {
      flashStatusHtml = `<span class="flash-bar-hint">Type 2 search characters to jump · &lt;Esc&gt; to cancel</span>`;
    }

    html += `<div class="flash-prompt-bar">
      <div class="flash-prompt-badge">⚡ FLASH</div>
      <div class="flash-prompt-content">${flashStatusHtml}</div>
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

  const splitMode = stageInfo.splitMode || 'vertical';
  const splitIcon = splitMode === 'horizontal' ? '⬓ horiz' : (splitMode === 'zen' ? '▢ zen' : '◫ vert');

  container.innerHTML = `
    <div class="status-left">
      <div class="status-mode ${mode}">${mode === 'FLASH' ? '⚡ FLASH' : mode}</div>
      <div class="status-item status-branch">
        <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
          <path fill-rule="evenodd" d="M11.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122V6A2.5 2.5 0 0110 8.5H6a1 1 0 00-1 1v1.128a2.251 2.251 0 11-1.5 0V5.372a2.25 2.25 0 111.5 0v1.836A2.492 2.492 0 016 7h4a1 1 0 001-1v-.628A2.25 2.25 0 019.5 3.25zM4.25 12a.75.75 0 100 1.5.75.75 0 000-1.5zM3.5 3.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0z"/>
        </svg>
        main
      </div>
      <div class="status-item">${stageLabel}</div>
    </div>
    <div class="status-right">
      <div class="status-item" style="color: var(--tn-teal);" title="Screen Split Layout">${splitIcon}</div>
      <div class="status-item" style="color: var(--tn-green);">● 0</div>
      <div class="status-item">utf-8</div>
      <div class="status-position"> ${rowDisplay}:${colDisplay} [${posPercent}]</div>
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
 * @param {import('../editor/vim-engine.js').VimEngine} [engine]
 */
function renderHUD(hudEl, keystrokes = [], par = 10, lastActionMsg = '', engine = null) {
  if (!hudEl) return;

  const count = keystrokes.length;
  const recent = keystrokes.slice(-4).join(' ');
  const fullSeq = keystrokes.slice(-3).join('');
  const mode = engine ? engine.getMode() : 'NORMAL';

  let explanation = '';
  if (mode === 'FLASH') {
    if (engine.flashTargets && engine.flashTargets.length > 0) {
      const label = engine.flashTargets[0]?.label?.toUpperCase() || 'A';
      explanation = `⚡ Flash: Press glowing beacon [${label}] to jump`;
    } else if (engine.pendingKeys && engine.pendingKeys.length > 0) {
      explanation = `⚡ Flash search: "${engine.pendingKeys}_" (type 1 more char)`;
    } else {
      explanation = '⚡ Flash: Type 2 characters to locate jump targets';
    }
  } else if (lastActionMsg && lastActionMsg.startsWith('Flash: teleported')) {
    explanation = `⚡ Flash Teleported!`;
  } else {
    explanation = KEY_EXPLANATIONS[fullSeq] || KEY_EXPLANATIONS[keystrokes[keystrokes.length - 1]] || '';
  }

  hudEl.innerHTML = `
    <div class="hud-keys">
      <span class="hud-label">KEYS:</span>
      <span class="key-badge">${recent ? escapeHtml(recent) : 'Ready'}</span>
      ${explanation ? `<span class="hud-message">${escapeHtml(explanation)}</span>` : ''}
    </div>
    <div class="hud-stats">
      <span class="hud-action-msg">${lastActionMsg ? escapeHtml(lastActionMsg) : ''}</span>
      <span class="hud-golf-stat ${count <= par ? 'stat-under-par' : 'stat-over-par'}">
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
      html += `<div class="diff-line diff-match"><span class="diff-indicator diff-indicator-match">✓</span> <span class="diff-code">${escapeHtml(l.target)}</span></div>`;
    } else if (l.type === 'missing') {
      html += `<div class="diff-line diff-missing"><span class="diff-indicator diff-indicator-add">+</span> <span class="diff-code">${escapeHtml(l.target)}</span> <span class="diff-badge diff-badge-missing">missing</span></div>`;
    } else if (l.type === 'extra') {
      html += `<div class="diff-line diff-unwanted"><span class="diff-indicator diff-indicator-del">-</span> <span class="diff-code">${escapeHtml(l.current)}</span> <span class="diff-badge diff-badge-extra">extra</span></div>`;
    } else {
      html += `<div class="diff-line diff-diff">
        <div class="diff-subline diff-unwanted"><span class="diff-indicator diff-indicator-del">-</span> <span class="diff-code">${escapeHtml(l.current)}</span></div>
        <div class="diff-subline diff-match"><span class="diff-indicator diff-indicator-add">+</span> <span class="diff-code">${escapeHtml(l.target)}</span></div>
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
 * Which-Key Visual Helper Drawer (LazyVim Dynamic + Static Cheat Sheet)
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
  { key: '<C-v>', desc: 'Visual Block Column Mode' },
  { key: '<C-w>v / s', desc: 'Split Window Vert / Horiz' },
  { key: '<C-w>w / o', desc: 'Switch Window / Zen Mode' },
  { key: '<C-w>= / q', desc: 'Equalize Splits / Close Window' },
  { key: 'qa ... q / @a', desc: 'Record / Replay Macro' },
  { key: 'gsaw" / gsd"', desc: 'Mini.surround Add / Delete' },
  { key: 'K / gd', desc: 'LSP Hover / Definition' },
  { key: '<leader>w...', desc: 'Windows & Splits Menu' },
  { key: '<leader>u...', desc: 'UI Toggles (Zen, Diff, Split)' },
  { key: '<leader>ff / sg', desc: 'Fzf Find Files / Live Grep' },
];

const LEADER_GROUPS = {
  '': [
    { key: 'w', desc: 'Save Buffer (:w)' },
    { key: 'W', desc: '+windows/splits (v: vsplit, s: split, d: close, e: eq, m: zen)' },
    { key: 'u', desc: '+ui toggles (z: zen, m: mission, d: diff, s: split dir)' },
    { key: 'm', desc: '+mission/dojo (m: popup, h: hint, r: reset, n: next, p: prev)' },
    { key: 'f', desc: '+find/file (ff: Files, fb: Buffers)' },
    { key: 's', desc: '+search (sg: Grep, sr: Grug-far)' },
    { key: 'c', desc: '+code (ca: Action, cr: Rename, cf: Format)' },
    { key: 'x', desc: '+diagnostics (xx: Trouble)' },
    { key: 'g', desc: '+git (gg: LazyGit)' },
    { key: 'e', desc: 'Neo-tree Explorer' },
    { key: 'l', desc: 'Lazy.nvim Dashboard' },
    { key: 'bd', desc: 'Delete Buffer' },
    { key: '.', desc: 'Snacks Scratchpad' },
    { key: 'ft', desc: 'Floating Terminal' },
  ],
  'W': [
    { key: 'v / |', desc: 'Split Window Vertically (:vsplit, <C-w>v)' },
    { key: 's / -', desc: 'Split Window Horizontally (:split, <C-w>s)' },
    { key: 'd / q', desc: 'Close Split Window (:q, <C-w>q)' },
    { key: 'e / =', desc: 'Equalize Splits (<C-w>=)' },
    { key: 'm / z', desc: 'Maximize / Toggle Zen (<C-w>o)' },
    { key: 'w', desc: 'Switch Active Window (<C-w>w)' },
    { key: 'h/j/k/l', desc: 'Focus Left / Down / Up / Right' },
  ],
  'w': [
    { key: 'v / |', desc: 'Split Window Vertically (:vsplit, <C-w>v)' },
    { key: 's / -', desc: 'Split Window Horizontally (:split, <C-w>s)' },
    { key: 'd / q', desc: 'Close Split Window (:q, <C-w>q)' },
    { key: 'e / =', desc: 'Equalize Splits (<C-w>=)' },
    { key: 'm / z', desc: 'Maximize / Toggle Zen (<C-w>o)' },
    { key: 'w', desc: 'Switch Active Window (<C-w>w)' },
    { key: 'h/j/k/l', desc: 'Focus Left / Down / Up / Right' },
  ],
  'u': [
    { key: 'z', desc: 'Toggle Zen Mode (100% Editor Buffer)' },
    { key: 'm', desc: 'Toggle Mission / Target Pane' },
    { key: 'd', desc: 'Toggle Live Diff View' },
    { key: 's', desc: 'Switch Split Orientation (Vert / Horiz)' },
    { key: 'r', desc: 'Swap Split Positions (<C-w>r)' },
    { key: 'l', desc: 'Toggle Line Numbers' },
  ],
  'm': [
    { key: 'm', desc: 'Open Mission Floating Window (:help)' },
    { key: 'h', desc: 'Stage Hint (:hint)' },
    { key: 'r', desc: 'Reset Stage (:reset)' },
    { key: 'n', desc: 'Next Stage' },
    { key: 'p', desc: 'Previous Stage' },
    { key: 's', desc: 'Stage Select Map' },
  ],
  'f': [
    { key: 'f', desc: 'Find Files (Fzf / Telescope)' },
    { key: 'b', desc: 'Find Buffers' },
    { key: 't', desc: 'Floating Terminal' },
  ],
  's': [
    { key: 'g', desc: 'Live Grep (ripgrep / snacks)' },
    { key: 'r', desc: 'Grug-far Search & Replace' },
  ],
  'c': [
    { key: 'a', desc: 'LSP Code Actions' },
    { key: 'r', desc: 'LSP Rename Symbol' },
    { key: 'f', desc: 'Format Document' },
  ],
  'x': [
    { key: 'x', desc: 'Trouble Project Diagnostics' },
  ],
  'g': [
    { key: 'g', desc: 'LazyGit Floating Window' },
  ],
};

/**
 * Render Which-Key drawer in static or leader mode
 * @param {HTMLElement} drawerEl
 * @param {boolean} [show]
 * @param {string} [prefix]
 */
function toggleWhichKey(drawerEl, show, prefix = '') {
  if (!drawerEl) return;
  const isVisible = show !== undefined ? show : !drawerEl.classList.contains('visible');

  if (isVisible) {
    const isLeader = prefix !== undefined && prefix !== null && LEADER_GROUPS[prefix] !== undefined;
    const entries = isLeader ? LEADER_GROUPS[prefix] : WHICH_KEY_ENTRIES;
    const title = isLeader
      ? `<div class="which-key-header"><span>Leader &lt;Space&gt;${prefix ? prefix : ''}</span><span class="which-key-sub">Which-Key</span></div>`
      : '';

    const items = entries.map(
      e => `<div class="which-key-item">
        <span class="which-key-key">${escapeHtml(e.key)}</span>
        <span class="which-key-desc">${escapeHtml(e.desc)}</span>
      </div>`
    ).join('');

    drawerEl.innerHTML = title + `<div class="which-key-grid">${items}</div>`;
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
  try { exports.LEADER_GROUPS = LEADER_GROUPS; } catch(e) {}
  try { exports.toggleWhichKey = toggleWhichKey; } catch(e) {}
  try { exports.escapeHtml = escapeHtml; } catch(e) {}
});

/* Module: ui/fzf-modal.js */
defineModule('ui/fzf-modal.js', function(exports, require, module) {
/**
 * Fzf-Lua / Snacks / Telescope Fuzzy Finder Modal Simulation
 */

const MOCK_PROJECT_FILES = [
  { path: 'src/auth/jwt.ts', desc: 'JWT token verification and signing', content: 'export function verifyToken(t: string): boolean {\n  return t.startsWith("Bearer ");\n}' },
  { path: 'src/models/user.model.ts', desc: 'User entity and schema definition', content: 'export interface User {\n  id: string;\n  name: string;\n  role: "admin" | "member";\n}' },
  { path: 'src/controllers/api.controller.ts', desc: 'REST API routing and handler dispatch', content: 'export class ApiController {\n  async handleLogin(req: Request) {\n    return { status: 200 };\n  }\n}' },
  { path: 'src/services/database.service.ts', desc: 'PostgreSQL connection pool & queries', content: 'export const db = new DatabaseClient({\n  host: "localhost",\n  port: 5432\n});' },
  { path: 'config/app.config.json', desc: 'Application runtime configurations', content: '{\n  "port": 3000,\n  "env": "production"\n}' },
  { path: 'package.json', desc: 'Project dependencies and build scripts', content: '{\n  "name": "neovim-mastery",\n  "version": "2.0.0"\n}' },
  { path: 'README.md', desc: 'Documentation & onboarding guide', content: '# NeoVim Mastery\nInteractive game for mastering Neovim & LazyVim.' },
];

class FzfModal {
  /**
   * @param {Object} options
   * @param {HTMLElement} options.containerEl
   * @param {Function} options.onSelectFile
   * @param {Function} options.onClose
   */
  constructor({ containerEl, onSelectFile, onClose }) {
    this.containerEl = containerEl;
    this.onSelectFile = onSelectFile;
    this.onClose = onClose;
    this.isOpen = false;
    this.mode = 'files'; // 'files' | 'grep' | 'buffers'
    this.query = '';
    this.selectedIndex = 0;
    this.filteredItems = [...MOCK_PROJECT_FILES];

    this.render();
    this.bindEvents();
  }

  render() {
    this.modalEl = document.createElement('div');
    this.modalEl.className = 'fzf-overlay hidden';
    this.modalEl.innerHTML = `
      <div class="fzf-window" role="dialog" aria-modal="true" aria-label="Fzf Fuzzy Finder">
        <div class="fzf-header">
          <span class="fzf-prompt-icon">🔍</span>
          <input type="text" class="fzf-input" placeholder="Type to filter..." spellcheck="false" autocomplete="off" />
          <span class="fzf-mode-badge">Files</span>
        </div>
        <div class="fzf-body">
          <div class="fzf-results" role="listbox"></div>
          <div class="fzf-preview">
            <div class="fzf-preview-title">Preview</div>
            <pre class="fzf-preview-code"></pre>
          </div>
        </div>
        <div class="fzf-footer">
          <span><kbd>&lt;C-j&gt;</kbd>/<kbd>&lt;C-k&gt;</kbd> Navigate</span>
          <span><kbd>&lt;Enter&gt;</kbd> Open</span>
          <span><kbd>&lt;Esc&gt;</kbd> Close</span>
        </div>
      </div>
    `;
    this.containerEl.appendChild(this.modalEl);

    this.inputEl = this.modalEl.querySelector('.fzf-input');
    this.resultsEl = this.modalEl.querySelector('.fzf-results');
    this.previewCodeEl = this.modalEl.querySelector('.fzf-preview-code');
    this.previewTitleEl = this.modalEl.querySelector('.fzf-preview-title');
    this.badgeEl = this.modalEl.querySelector('.fzf-mode-badge');
  }

  bindEvents() {
    this.inputEl.addEventListener('input', (e) => {
      this.query = e.target.value.toLowerCase();
      this.filterItems();
    });

    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl) {
        this.close();
      }
    });

    this.inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || (e.ctrlKey && e.key === 'c')) {
        e.preventDefault();
        this.close();
      } else if (e.key === 'ArrowDown' || (e.ctrlKey && e.key === 'j')) {
        e.preventDefault();
        this.moveSelection(1);
      } else if (e.key === 'ArrowUp' || (e.ctrlKey && e.key === 'k')) {
        e.preventDefault();
        this.moveSelection(-1);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        this.confirmSelection();
      }
    });
  }

  open(mode = 'files') {
    this.mode = mode;
    this.isOpen = true;
    this.query = '';
    this.inputEl.value = '';
    this.badgeEl.textContent = mode === 'grep' ? 'Live Grep' : mode === 'buffers' ? 'Buffers' : 'Find Files';
    this.inputEl.placeholder = mode === 'grep' ? 'Live grep text in project...' : 'Find file by name...';
    this.filterItems();
    this.modalEl.classList.remove('hidden');
    setTimeout(() => this.inputEl.focus(), 30);
  }

  close() {
    this.isOpen = false;
    this.modalEl.classList.add('hidden');
    if (this.onClose) this.onClose();
  }

  filterItems() {
    if (!this.query) {
      this.filteredItems = [...MOCK_PROJECT_FILES];
    } else {
      this.filteredItems = MOCK_PROJECT_FILES.filter(item => {
        if (this.mode === 'grep') {
          return item.content.toLowerCase().includes(this.query) || item.path.toLowerCase().includes(this.query);
        }
        return item.path.toLowerCase().includes(this.query) || item.desc.toLowerCase().includes(this.query);
      });
    }
    this.selectedIndex = 0;
    this.renderResults();
  }

  renderResults() {
    if (this.filteredItems.length === 0) {
      this.resultsEl.innerHTML = `<div class="fzf-empty">No matching ${this.mode} found</div>`;
      this.previewTitleEl.textContent = 'Preview';
      this.previewCodeEl.textContent = '';
      return;
    }

    this.resultsEl.innerHTML = this.filteredItems.map((item, idx) => `
      <div class="fzf-item ${idx === this.selectedIndex ? 'selected' : ''}" data-index="${idx}">
        <span class="fzf-item-icon">${item.path.endsWith('.ts') ? '📄' : item.path.endsWith('.json') ? '⚙️' : '📝'}</span>
        <span class="fzf-item-path">${escapeHtml(item.path)}</span>
        <span class="fzf-item-desc">${escapeHtml(item.desc)}</span>
      </div>
    `).join('');

    // Update preview
    const active = this.filteredItems[this.selectedIndex];
    if (active) {
      this.previewTitleEl.textContent = active.path;
      this.previewCodeEl.textContent = active.content;
    }

    // Bind click
    this.resultsEl.querySelectorAll('.fzf-item').forEach(el => {
      el.addEventListener('click', () => {
        this.selectedIndex = parseInt(el.getAttribute('data-index'), 10);
        this.confirmSelection();
      });
    });
  }

  moveSelection(delta) {
    if (this.filteredItems.length === 0) return;
    this.selectedIndex = (this.selectedIndex + delta + this.filteredItems.length) % this.filteredItems.length;
    this.renderResults();
  }

  confirmSelection() {
    const chosen = this.filteredItems[this.selectedIndex];
    if (chosen) {
      if (this.onSelectFile) this.onSelectFile(chosen);
    }
    this.close();
  }
}

function escapeHtml(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

  try { exports.MOCK_PROJECT_FILES = MOCK_PROJECT_FILES; } catch(e) {}
  try { exports.verifyToken = verifyToken; } catch(e) {}
  try { exports.escapeHtml = escapeHtml; } catch(e) {}
  try { exports.ApiController = ApiController; } catch(e) {}
  try { exports.FzfModal = FzfModal; } catch(e) {}
});

/* Module: ui/neo-tree.js */
defineModule('ui/neo-tree.js', function(exports, require, module) {
/**
 * Neo-tree Explorer Sidebar Simulation
 */

const FILE_TREE = [
  {
    name: 'src',
    type: 'dir',
    expanded: true,
    children: [
      {
        name: 'auth',
        type: 'dir',
        expanded: true,
        children: [
          { name: 'jwt.ts', type: 'file', path: 'src/auth/jwt.ts', content: 'export function verifyToken(t: string): boolean {\n  return t.startsWith("Bearer ");\n}' },
        ],
      },
      {
        name: 'controllers',
        type: 'dir',
        expanded: false,
        children: [
          { name: 'api.controller.ts', type: 'file', path: 'src/controllers/api.controller.ts', content: 'export class ApiController {\n  async handleLogin() {\n    return { status: 200 };\n  }\n}' },
        ],
      },
      {
        name: 'models',
        type: 'dir',
        expanded: true,
        children: [
          { name: 'user.model.ts', type: 'file', path: 'src/models/user.model.ts', content: 'export interface User {\n  id: string;\n  name: string;\n}' },
        ],
      },
      {
        name: 'services',
        type: 'dir',
        expanded: false,
        children: [
          { name: 'database.service.ts', type: 'file', path: 'src/services/database.service.ts', content: 'export const db = new DatabaseClient();' },
        ],
      },
    ],
  },
  {
    name: 'config',
    type: 'dir',
    expanded: false,
    children: [
      { name: 'app.config.json', type: 'file', path: 'config/app.config.json', content: '{\n  "port": 3000\n}' },
    ],
  },
  { name: 'package.json', type: 'file', path: 'package.json', content: '{\n  "name": "neovim-mastery"\n}' },
  { name: 'README.md', type: 'file', path: 'README.md', content: '# NeoVim Mastery\nInteractive game for mastering Neovim & LazyVim.' },
];

class NeoTreeSidebar {
  /**
   * @param {Object} options
   * @param {HTMLElement} options.containerEl
   * @param {Function} options.onSelectFile
   * @param {Function} options.onToggle
   */
  constructor({ containerEl, onSelectFile, onToggle }) {
    this.containerEl = containerEl;
    this.onSelectFile = onSelectFile;
    this.onToggle = onToggle;
    this.isOpen = false;
    this.tree = JSON.parse(JSON.stringify(FILE_TREE));
    this.render();
  }

  render() {
    this.sidebarEl = document.createElement('aside');
    this.sidebarEl.className = 'neo-tree-sidebar hidden';
    this.sidebarEl.innerHTML = `
      <div class="neo-tree-header">
        <span class="neo-tree-title">📁 NEO-TREE (FILES)</span>
        <button class="neo-tree-close" title="Close (&lt;leader&gt;e or q)">✕</button>
      </div>
      <div class="neo-tree-content" role="tree"></div>
      <div class="neo-tree-footer">
        <span><kbd>Enter</kbd> Open/Expand</span>
        <span><kbd>q</kbd> Close</span>
      </div>
    `;
    this.containerEl.appendChild(this.sidebarEl);

    this.contentEl = this.sidebarEl.querySelector('.neo-tree-content');
    this.sidebarEl.querySelector('.neo-tree-close').addEventListener('click', () => this.toggle(false));

    this.renderNodes();
  }

  toggle(forceState) {
    this.isOpen = forceState !== undefined ? forceState : !this.isOpen;
    if (this.isOpen) {
      this.sidebarEl.classList.remove('hidden');
      this.renderNodes();
    } else {
      this.sidebarEl.classList.add('hidden');
    }
    if (this.onToggle) this.onToggle(this.isOpen);
  }

  renderNodes() {
    const buildHtml = (nodes, depth = 0) => {
      let html = '';
      for (const node of nodes) {
        const indent = depth * 14;
        if (node.type === 'dir') {
          html += `
            <div class="neo-tree-node dir ${node.expanded ? 'expanded' : ''}" style="padding-left: ${indent + 8}px" data-path="${node.name}">
              <span class="neo-tree-icon">${node.expanded ? '📂' : '📁'}</span>
              <span class="neo-tree-label">${escapeHtml(node.name)}</span>
            </div>
          `;
          if (node.expanded && node.children) {
            html += buildHtml(node.children, depth + 1);
          }
        } else {
          html += `
            <div class="neo-tree-node file" style="padding-left: ${indent + 8}px" data-path="${node.path}">
              <span class="neo-tree-icon">${node.name.endsWith('.ts') ? '📄' : node.name.endsWith('.json') ? '⚙️' : '📝'}</span>
              <span class="neo-tree-label">${escapeHtml(node.name)}</span>
            </div>
          `;
        }
      }
      return html;
    };

    this.contentEl.innerHTML = buildHtml(this.tree);

    // Bind clicks to nodes
    this.contentEl.querySelectorAll('.neo-tree-node.dir').forEach(el => {
      el.addEventListener('click', () => {
        const name = el.getAttribute('data-path');
        const dir = this.findDir(this.tree, name);
        if (dir) {
          dir.expanded = !dir.expanded;
          this.renderNodes();
        }
      });
    });

    this.contentEl.querySelectorAll('.neo-tree-node.file').forEach(el => {
      el.addEventListener('click', () => {
        const p = el.getAttribute('data-path');
        const f = this.findFile(this.tree, p);
        if (f && this.onSelectFile) {
          this.onSelectFile(f);
        }
      });
    });
  }

  findDir(nodes, name) {
    for (const n of nodes) {
      if (n.type === 'dir') {
        if (n.name === name) return n;
        if (n.children) {
          const res = this.findDir(n.children, name);
          if (res) return res;
        }
      }
    }
    return null;
  }

  findFile(nodes, path) {
    for (const n of nodes) {
      if (n.type === 'file' && n.path === path) return n;
      if (n.type === 'dir' && n.children) {
        const res = this.findFile(n.children, path);
        if (res) return res;
      }
    }
    return null;
  }
}

function escapeHtml(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

  try { exports.FILE_TREE = FILE_TREE; } catch(e) {}
  try { exports.verifyToken = verifyToken; } catch(e) {}
  try { exports.escapeHtml = escapeHtml; } catch(e) {}
  try { exports.ApiController = ApiController; } catch(e) {}
  try { exports.NeoTreeSidebar = NeoTreeSidebar; } catch(e) {}
});

/* Module: ui/trouble.js */
defineModule('ui/trouble.js', function(exports, require, module) {
/**
 * Trouble Diagnostics Drawer Simulation (<leader>xx / :Trouble)
 */

const MOCK_DIAGNOSTICS = [
  { severity: 'error', icon: '', file: 'src/auth/jwt.ts', line: 2, col: 10, msg: "Type 'string' is not assignable to type 'boolean'." },
  { severity: 'warning', icon: '', file: 'src/controllers/api.controller.ts', line: 14, col: 5, msg: 'Missing await on asynchronous database query call.' },
  { severity: 'hint', icon: '', file: 'src/models/user.model.ts', line: 1, col: 18, msg: 'Interface property name is unused in current scope.' },
  { severity: 'info', icon: '', file: 'src/services/database.service.ts', line: 8, col: 2, msg: 'TODO: Add connection pool reconnect retry logic.' },
];

class TroubleDrawer {
  /**
   * @param {Object} options
   * @param {HTMLElement} options.containerEl
   * @param {Function} options.onSelectDiagnostic
   * @param {Function} options.onToggle
   */
  constructor({ containerEl, onSelectDiagnostic, onToggle }) {
    this.containerEl = containerEl;
    this.onSelectDiagnostic = onSelectDiagnostic;
    this.onToggle = onToggle;
    this.isOpen = false;
    this.items = [...MOCK_DIAGNOSTICS];
    this.render();
  }

  render() {
    this.drawerEl = document.createElement('div');
    this.drawerEl.className = 'trouble-drawer hidden';
    this.drawerEl.innerHTML = `
      <div class="trouble-header">
        <div class="trouble-title">
          <span class="trouble-icon">💥</span>
          <span>TROUBLE (PROJECT DIAGNOSTICS)</span>
          <span class="trouble-counts">1 Error, 1 Warning, 2 Infos</span>
        </div>
        <button class="trouble-close" title="Close (&lt;leader&gt;xx or q)">✕</button>
      </div>
      <div class="trouble-list" role="listbox"></div>
      <div class="trouble-footer">
        <span><kbd>Enter</kbd> Jump to issue</span>
        <span><kbd>q</kbd> / <kbd>&lt;leader&gt;xx</kbd> Close</span>
      </div>
    `;
    this.containerEl.appendChild(this.drawerEl);

    this.listEl = this.drawerEl.querySelector('.trouble-list');
    this.drawerEl.querySelector('.trouble-close').addEventListener('click', () => this.toggle(false));

    this.renderItems();
  }

  toggle(forceState) {
    this.isOpen = forceState !== undefined ? forceState : !this.isOpen;
    if (this.isOpen) {
      this.drawerEl.classList.remove('hidden');
    } else {
      this.drawerEl.classList.add('hidden');
    }
    if (this.onToggle) this.onToggle(this.isOpen);
  }

  renderItems() {
    this.listEl.innerHTML = this.items.map((item, idx) => `
      <div class="trouble-item ${item.severity}" data-index="${idx}">
        <span class="trouble-item-icon">${item.icon}</span>
        <span class="trouble-item-msg">${escapeHtml(item.msg)}</span>
        <span class="trouble-item-loc">${escapeHtml(item.file)}:${item.line}:${item.col}</span>
      </div>
    `).join('');

    this.listEl.querySelectorAll('.trouble-item').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.getAttribute('data-index'), 10);
        const item = this.items[idx];
        if (item && this.onSelectDiagnostic) {
          this.onSelectDiagnostic(item);
        }
      });
    });
  }
}

function escapeHtml(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

  try { exports.MOCK_DIAGNOSTICS = MOCK_DIAGNOSTICS; } catch(e) {}
  try { exports.escapeHtml = escapeHtml; } catch(e) {}
  try { exports.TroubleDrawer = TroubleDrawer; } catch(e) {}
});

/* Module: ui/lsp-popups.js */
defineModule('ui/lsp-popups.js', function(exports, require, module) {
/**
 * LSP Popups: Hover Documentation (K), Code Actions (<leader>ca), Symbol Rename (<leader>cr)
 */

class LspPopups {
  /**
   * @param {Object} options
   * @param {HTMLElement} options.containerEl
   * @param {Function} options.onApplyCodeAction
   * @param {Function} options.onApplyRename
   */
  constructor({ containerEl, onApplyCodeAction, onApplyRename }) {
    this.containerEl = containerEl;
    this.onApplyCodeAction = onApplyCodeAction;
    this.onApplyRename = onApplyRename;
    this.hoverEl = null;
    this.actionEl = null;
    this.renameEl = null;
    this.render();
  }

  render() {
    // Hover Popup
    this.hoverEl = document.createElement('div');
    this.hoverEl.className = 'lsp-hover-popup hidden';
    this.containerEl.appendChild(this.hoverEl);

    // Code Action Modal
    this.actionEl = document.createElement('div');
    this.actionEl.className = 'lsp-action-modal hidden';
    this.actionEl.innerHTML = `
      <div class="lsp-action-window">
        <div class="lsp-action-header">
          <span>💡 LSP Code Actions</span>
          <button class="lsp-action-close">✕</button>
        </div>
        <div class="lsp-action-list"></div>
      </div>
    `;
    this.containerEl.appendChild(this.actionEl);
    this.actionEl.querySelector('.lsp-action-close').addEventListener('click', () => this.hideAction());

    // Rename Modal
    this.renameEl = document.createElement('div');
    this.renameEl.className = 'lsp-rename-modal hidden';
    this.renameEl.innerHTML = `
      <div class="lsp-rename-window">
        <div class="lsp-rename-header">
          <span>✎ LSP Rename Symbol</span>
        </div>
        <div class="lsp-rename-body">
          <label>New Name:</label>
          <input type="text" class="lsp-rename-input" spellcheck="false" />
        </div>
        <div class="lsp-rename-footer">
          <span><kbd>Enter</kbd> Confirm</span>
          <span><kbd>Esc</kbd> Cancel</span>
        </div>
      </div>
    `;
    this.containerEl.appendChild(this.renameEl);

    const renameInput = this.renameEl.querySelector('.lsp-rename-input');
    renameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = renameInput.value.trim();
        if (val && this.onApplyRename) {
          this.onApplyRename(val);
        }
        this.hideRename();
      } else if (e.key === 'Escape') {
        this.hideRename();
      }
    });
  }

  showHover(word, signature, doc) {
    this.hoverEl.innerHTML = `
      <div class="lsp-hover-header">
        <span class="lsp-hover-type">${escapeHtml(signature || `function ${word}(): void`)}</span>
        <button class="lsp-hover-close">✕</button>
      </div>
      <div class="lsp-hover-doc">${escapeHtml(doc || `Documentation and type definitions for symbol '${word}'.`)}</div>
    `;
    this.hoverEl.classList.remove('hidden');
    this.hoverEl.querySelector('.lsp-hover-close').addEventListener('click', () => this.hideHover());
  }

  hideHover() {
    this.hoverEl.classList.add('hidden');
  }

  showAction(actions = []) {
    const list = actions.length > 0 ? actions : [
      { id: 'import', title: '1. Add missing import declaration' },
      { id: 'extract', title: '2. Extract into reusable helper function' },
      { id: 'async', title: '3. Convert enclosing function to async' },
      { id: 'fix', title: '4. Fix linter warning: explicit return type' },
    ];

    const listEl = this.actionEl.querySelector('.lsp-action-list');
    listEl.innerHTML = list.map((a, idx) => `
      <div class="lsp-action-item" data-id="${a.id}">
        <span class="lsp-action-num">${idx + 1}</span>
        <span class="lsp-action-label">${escapeHtml(a.title)}</span>
      </div>
    `).join('');

    this.actionEl.classList.remove('hidden');

    listEl.querySelectorAll('.lsp-action-item').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.getAttribute('data-id');
        if (this.onApplyCodeAction) this.onApplyCodeAction(id);
        this.hideAction();
      });
    });
  }

  hideAction() {
    this.actionEl.classList.add('hidden');
  }

  showRename(currentName = '') {
    const input = this.renameEl.querySelector('.lsp-rename-input');
    input.value = currentName;
    this.renameEl.classList.remove('hidden');
    setTimeout(() => {
      input.focus();
      input.select();
    }, 30);
  }

  hideRename() {
    this.renameEl.classList.add('hidden');
  }
}

function escapeHtml(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

  try { exports.escapeHtml = escapeHtml; } catch(e) {}
  try { exports.LspPopups = LspPopups; } catch(e) {}
});

/* Module: ui/lazygit-modal.js */
defineModule('ui/lazygit-modal.js', function(exports, require, module) {
/**
 * LazyGit Floating Terminal Simulation (<leader>gg)
 */

class LazyGitModal {
  /**
   * @param {Object} options
   * @param {HTMLElement} options.containerEl
   * @param {Function} options.onClose
   */
  constructor({ containerEl, onClose }) {
    this.containerEl = containerEl;
    this.onClose = onClose;
    this.isOpen = false;
    this.render();
  }

  render() {
    this.modalEl = document.createElement('div');
    this.modalEl.className = 'lazygit-overlay hidden';
    this.modalEl.innerHTML = `
      <div class="lazygit-window">
        <div class="lazygit-header">
          <span class="lazygit-title">📦 LazyGit — Git Terminal Dashboard</span>
          <button class="lazygit-close" title="Close (q or Esc)">✕</button>
        </div>
        <div class="lazygit-grid">
          <div class="lazygit-col-left">
            <div class="lazygit-panel files">
              <div class="lazygit-panel-header">1. Files (Status)</div>
              <div class="lazygit-panel-body">
                <div class="lazygit-file-item staged">● M  game/js/editor/vim-engine.js</div>
                <div class="lazygit-file-item modified">○ M  game/js/stages/curriculum.js</div>
                <div class="lazygit-file-item untracked">○ ?  game/js/ui/fzf-modal.js</div>
              </div>
            </div>
            <div class="lazygit-panel branches">
              <div class="lazygit-panel-header">2. Branches</div>
              <div class="lazygit-panel-body">
                <div class="lazygit-branch-item active">* main (origin/main)</div>
                <div class="lazygit-branch-item">  feature/lazyvim-curriculum</div>
              </div>
            </div>
            <div class="lazygit-panel commits">
              <div class="lazygit-panel-header">3. Commits</div>
              <div class="lazygit-panel-body">
                <div class="lazygit-commit-item">8f92a1d feat: add 60-stage LazyVim curriculum</div>
                <div class="lazygit-commit-item">3c11e04 fix: add visual block column parsing</div>
              </div>
            </div>
          </div>
          <div class="lazygit-col-right">
            <div class="lazygit-panel diff">
              <div class="lazygit-panel-header">Diff Preview</div>
              <pre class="lazygit-diff-code">
<span class="diff-hunk">@@ -40,7 +40,9 @@</span>
- const maxDays = 30;
+ const maxDays = 60;
+ export const STAGES = [
+   // 60 Master-Tier Stages
+ ];
              </pre>
            </div>
          </div>
        </div>
        <div class="lazygit-footer">
          <span><kbd>Space</kbd> Stage file</span>
          <span><kbd>c</kbd> Commit</span>
          <span><kbd>P</kbd> Push</span>
          <span><kbd>q</kbd> / <kbd>Esc</kbd> Return to NeoVim</span>
        </div>
      </div>
    `;
    this.containerEl.appendChild(this.modalEl);

    this.modalEl.querySelector('.lazygit-close').addEventListener('click', () => this.close());
    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl) this.close();
    });

    window.addEventListener('keydown', (e) => {
      if (this.isOpen && (e.key === 'q' || e.key === 'Escape')) {
        this.close();
      }
    });
  }

  open() {
    this.isOpen = true;
    this.modalEl.classList.remove('hidden');
  }

  close() {
    this.isOpen = false;
    this.modalEl.classList.add('hidden');
    if (this.onClose) this.onClose();
  }
}

  try { exports.LazyGitModal = LazyGitModal; } catch(e) {}
});

/* Module: ui/split-manager.js */
defineModule('ui/split-manager.js', function(exports, require, module) {
/**
 * SplitManager: Manages Neovim / LazyVim multi-window layouts.
 * Supports Vertical Split (:vs, <C-w>v), Horizontal Split (:sp, <C-w>s),
 * Zen Mode (:only, <C-w>o), Flipped Layout (<C-w>r),
 * Draggable Split Dividers, Split Winbars, and Floating Mission Help (:help, <Space>m).
 */

class SplitManager {
  /**
   * @param {object} options
   * @param {import('../state.js').GameState} options.state
   * @param {HTMLElement} options.workspaceEl
   * @param {HTMLElement} options.dividerEl
   * @param {HTMLElement} options.sidepaneEl
   * @param {Function} [options.onLayoutChange]
   * @param {Function} [options.onAction]
   */
  constructor(options = {}) {
    const isState = options && typeof options.getStageStars === 'function';
    const opts = isState ? { state: options } : (options || {});

    this.state = opts.state || {
      splitMode: 'vertical',
      splitRatio: 55,
      splitReversed: false,
      splitTab: 'diff',
      activeWindow: 'editor',
      setSplitMode() {},
      setSplitRatio() {},
      toggleSplitReverse() {},
      setSplitTab() {},
      toggleZen() {},
    };
    this.workspaceEl = opts.workspaceEl || (typeof document !== 'undefined' ? document.getElementById('main-workspace') : null);
    this.dividerEl = opts.dividerEl || (typeof document !== 'undefined' ? document.getElementById('split-divider') : null);
    this.sidepaneEl = opts.sidepaneEl || (typeof document !== 'undefined' ? document.getElementById('split-pane') : null);
    this.onLayoutChange = opts.onLayoutChange;
    this.onAction = opts.onAction;

    this.isDragging = false;
    this.activeWindow = 'editor'; // 'editor' | 'split'
    this.floatingModalEl = null;

    const getEl = id => (typeof document !== 'undefined' ? document.getElementById(id) : null);
    this.dom = {
      btnVert: getEl('btn-split-vert'),
      btnHoriz: getEl('btn-split-horiz'),
      btnZen: getEl('btn-split-zen'),
      btnSwap: getEl('btn-split-swap'),
      btnWinHoriz: getEl('btn-win-horiz'),
      btnWinVert: getEl('btn-win-vert'),
      btnWinClose: getEl('btn-split-close'),
      tabDiff: getEl('split-tab-diff'),
      tabMission: getEl('split-tab-mission'),
      tabCheat: getEl('split-tab-cheat'),
      paneDiff: getEl('diff-view-pane'),
      paneMission: getEl('mission-view-pane'),
      paneCheat: getEl('cheat-view-pane'),
      floatingModal: getEl('mission-floating-modal'),
    };
  }

  init() {
    this.bindEvents();
    this.applyLayout(this.state.splitMode, this.state.splitRatio, this.state.splitReversed);
    this.applyTab(this.state.splitTab || 'diff');
  }

  bindEvents() {
    // Top Bar Split Layout Buttons
    this.dom.btnVert?.addEventListener('click', (e) => {
      e.currentTarget?.blur();
      this.setMode('vertical');
    });
    this.dom.btnHoriz?.addEventListener('click', (e) => {
      e.currentTarget?.blur();
      this.setMode('horizontal');
    });
    this.dom.btnZen?.addEventListener('click', (e) => {
      e.currentTarget?.blur();
      this.setMode('zen');
    });
    this.dom.btnSwap?.addEventListener('click', (e) => {
      e.currentTarget?.blur();
      this.toggleReverse();
    });

    // Split Window Winbar Buttons
    this.dom.btnWinHoriz?.addEventListener('click', (e) => {
      e.currentTarget?.blur();
      this.setMode('horizontal');
    });
    this.dom.btnWinVert?.addEventListener('click', (e) => {
      e.currentTarget?.blur();
      this.setMode('vertical');
    });
    this.dom.btnWinClose?.addEventListener('click', (e) => {
      e.currentTarget?.blur();
      this.setMode('zen');
    });

    // Split Window Tabs
    this.dom.tabDiff?.addEventListener('click', (e) => {
      e.currentTarget?.blur();
      this.setTab('diff');
    });
    this.dom.tabMission?.addEventListener('click', (e) => {
      e.currentTarget?.blur();
      this.setTab('mission');
    });
    this.dom.tabCheat?.addEventListener('click', (e) => {
      e.currentTarget?.blur();
      this.setTab('cheatsheet');
    });

    // Draggable Split Divider
    if (this.dividerEl) {
      this.dividerEl.addEventListener('mousedown', (e) => this.startDragging(e));
    }
    window.addEventListener('mousemove', (e) => this.onDrag(e));
    window.addEventListener('mouseup', () => this.stopDragging());

    // Window click focus
    this.sidepaneEl?.addEventListener('click', () => {
      this.setActiveWindow('split');
    });
    const editorViewport = document.getElementById('editor-viewport');
    editorViewport?.addEventListener('click', () => {
      this.setActiveWindow('editor');
    });
  }

  startDragging(e) {
    if (this.state.splitMode === 'zen') return;
    this.isDragging = true;
    document.body.classList.add('resizing-split');
    e.preventDefault();
  }

  onDrag(e) {
    if (!this.isDragging || !this.workspaceEl) return;
    const rect = this.workspaceEl.getBoundingClientRect();

    let ratio;
    if (this.state.splitMode === 'vertical') {
      const x = e.clientX - rect.left;
      ratio = (x / rect.width) * 100;
      if (this.state.splitReversed) {
        ratio = 100 - ratio;
      }
    } else if (this.state.splitMode === 'horizontal') {
      const y = e.clientY - rect.top;
      ratio = (y / rect.height) * 100;
      if (this.state.splitReversed) {
        ratio = 100 - ratio;
      }
    }

    if (ratio !== undefined) {
      this.setRatio(ratio);
    }
  }

  stopDragging() {
    if (this.isDragging) {
      this.isDragging = false;
      document.body.classList.remove('resizing-split');
    }
  }

  setMode(mode) {
    if (!['vertical', 'horizontal', 'zen'].includes(mode)) return;
    this.state.setSplitMode(mode);
    this.applyLayout(mode, this.state.splitRatio, this.state.splitReversed);
    if (this.onLayoutChange) this.onLayoutChange(mode);
  }

  setRatio(ratio) {
    this.state.setSplitRatio(ratio);
    this.applyLayout(this.state.splitMode, this.state.splitRatio, this.state.splitReversed);
  }

  adjustRatio(delta) {
    const cur = this.state.splitRatio || 55;
    this.setRatio(cur + delta);
  }

  equalize() {
    this.setRatio(50);
  }

  toggleReverse() {
    const rev = this.state.toggleSplitReverse();
    this.applyLayout(this.state.splitMode, this.state.splitRatio, rev);
    if (this.onLayoutChange) this.onLayoutChange(this.state.splitMode);
    return rev;
  }

  toggleZen() {
    const newMode = this.state.toggleZen();
    this.applyLayout(newMode, this.state.splitRatio, this.state.splitReversed);
    if (this.onLayoutChange) this.onLayoutChange(newMode);
    return newMode;
  }

  setTab(tab) {
    this.state.setSplitTab(tab);
    this.applyTab(tab);
  }

  applyLayout(mode, ratio = 55, reversed = false) {
    if (!this.workspaceEl) return;

    // Remove old classes
    this.workspaceEl.classList.remove('layout-vertical', 'layout-horizontal', 'layout-zen', 'split-reversed');

    // Update active button indicators
    this.dom.btnVert?.classList.toggle('active', mode === 'vertical');
    this.dom.btnHoriz?.classList.toggle('active', mode === 'horizontal');
    this.dom.btnZen?.classList.toggle('active', mode === 'zen');
    this.dom.btnSwap?.classList.toggle('active', reversed);

    if (mode === 'zen') {
      this.workspaceEl.classList.add('layout-zen');
      this.workspaceEl.style.removeProperty('--editor-split-ratio');
      if (this.dividerEl) this.dividerEl.style.display = 'none';
      if (this.sidepaneEl) this.sidepaneEl.style.display = 'none';
    } else {
      if (this.dividerEl) this.dividerEl.style.display = '';
      if (this.sidepaneEl) this.sidepaneEl.style.display = '';

      const modeClass = mode === 'horizontal' ? 'layout-horizontal' : 'layout-vertical';
      this.workspaceEl.classList.add(modeClass);
      if (reversed) {
        this.workspaceEl.classList.add('split-reversed');
      }

      this.workspaceEl.style.setProperty('--editor-split-ratio', `${ratio}%`);

      if (this.dividerEl) {
        this.dividerEl.className = `split-divider ${mode === 'horizontal' ? 'horizontal' : 'vertical'}`;
      }
    }
  }

  applyTab(tab) {
    this.dom.tabDiff?.classList.toggle('active', tab === 'diff');
    this.dom.tabMission?.classList.toggle('active', tab === 'mission');
    this.dom.tabCheat?.classList.toggle('active', tab === 'cheatsheet');

    if (this.dom.paneDiff) this.dom.paneDiff.style.display = tab === 'diff' ? 'flex' : 'none';
    if (this.dom.paneMission) this.dom.paneMission.style.display = tab === 'mission' ? 'block' : 'none';
    if (this.dom.paneCheat) this.dom.paneCheat.style.display = tab === 'cheatsheet' ? 'block' : 'none';
  }

  setActiveWindow(target) {
    this.activeWindow = target;
    this.workspaceEl?.classList.toggle('active-win-editor', target === 'editor');
    this.workspaceEl?.classList.toggle('active-win-split', target === 'split');
    this.sidepaneEl?.classList.toggle('focused-window', target === 'split');

    if (target === 'editor') {
      document.getElementById('editor-viewport')?.focus();
    }
  }

  switchActiveWindow() {
    const next = this.activeWindow === 'editor' ? 'split' : 'editor';
    this.setActiveWindow(next);
    return next;
  }

  /**
   * Opens a Snacks.nvim / LazyVim style floating window with mission details
   */
  openFloatingMission(stage, onNext, onHint) {
    if (!stage) return;
    const modalOverlay = document.getElementById('modal-overlay');
    if (!modalOverlay) return;

    const stars = this.state.getStageStars(stage.day);
    const starStr = stars > 0 ? '⭐'.repeat(stars) : '☆☆☆';
    const hintsList = (stage.hints || []).map((h, i) => `<li><strong>Hint ${i + 1}:</strong> ${escapeHtml(h)}</li>`).join('');

    modalOverlay.innerHTML = `
      <div class="modal-card floating-mission-window">
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="stage-badge">${stage.day ? `Day ${stage.day} • Week ${stage.week}` : 'Sandbox'}</span>
            <span class="modal-title">${escapeHtml(stage.title)}</span>
          </div>
          <button class="modal-close-btn" id="floating-mission-close" title="Close (:q, <Esc>)">✕</button>
        </div>
        <div class="modal-body">
          <div class="mission-concept" style="font-size: 14px; margin-bottom: 12px; font-weight: 600;">
            🎯 ${escapeHtml(stage.concept)}
          </div>
          <p class="mission-desc" style="font-size: 13px; line-height: 1.6; margin-bottom: 16px;">
            ${escapeHtml(stage.mission)}
          </p>

          <div class="stats-card" style="margin-bottom: 16px;">
            <div>
              <div class="stat-val">${stage.parKeystrokes || '-'}</div>
              <div class="stat-lbl">Golf Par</div>
            </div>
            <div>
              <div class="stat-val">${this.state.getBestStrokes(stage.day) || '-'}</div>
              <div class="stat-lbl">Personal Best</div>
            </div>
            <div>
              <div class="stat-val">${starStr}</div>
              <div class="stat-lbl">Rating</div>
            </div>
          </div>

          ${stage.hints?.length ? `
            <div class="mission-hints-box" style="background: var(--tn-bg-dark); border: 1px solid var(--tn-bg-highlight); border-radius: 6px; padding: 12px; margin-top: 12px;">
              <div style="font-size: 11px; font-weight: 700; color: var(--tn-yellow); margin-bottom: 6px;">💡 TACTICAL HINTS</div>
              <ul style="padding-left: 18px; font-size: 12px; color: var(--tn-fg); line-height: 1.6;">
                ${hintsList}
              </ul>
            </div>
          ` : ''}

          <div style="margin-top: 16px; font-size: 11px; color: var(--tn-comment); display: flex; gap: 16px; justify-content: space-between;">
            <span>⌨️ Press <kbd class="key-badge">Esc</kbd> or <kbd class="key-badge">Enter</kbd> to return to editor</span>
            <span>◫ <kbd class="key-badge">:vs</kbd> vertical | <kbd class="key-badge">:sp</kbd> horizontal</span>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn" id="floating-btn-vert">◫ Vertical Split</button>
          <button class="btn" id="floating-btn-horiz">⬓ Horizontal Split</button>
          <button class="btn btn-primary" id="floating-mission-ok">Back to Editor (Esc)</button>
        </div>
      </div>
    `;

    modalOverlay.classList.add('open');

    // Bind modal actions
    document.getElementById('floating-mission-close')?.addEventListener('click', () => {
      modalOverlay.classList.remove('open');
    });
    document.getElementById('floating-mission-ok')?.addEventListener('click', () => {
      modalOverlay.classList.remove('open');
    });
    document.getElementById('floating-btn-vert')?.addEventListener('click', () => {
      modalOverlay.classList.remove('open');
      this.setMode('vertical');
    });
    document.getElementById('floating-btn-horiz')?.addEventListener('click', () => {
      modalOverlay.classList.remove('open');
      this.setMode('horizontal');
    });
  }
}

function escapeHtml(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

  try { exports.escapeHtml = escapeHtml; } catch(e) {}
  try { exports.SplitManager = SplitManager; } catch(e) {}
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
    <div class="modal-card" style="max-width: 860px; max-height: 85vh; display: flex; flex-direction: column;">
      <div class="modal-header">
        <div class="modal-title">🗺️ The 60-Stage Neovim & LazyVim Dojo Map</div>
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
    this.splitMode = 'vertical'; // 'vertical' | 'horizontal' | 'zen'
    this.splitRatio = 55; // Editor size percentage (20..80)
    this.splitReversed = false;
    this.splitTab = 'diff'; // 'diff' | 'mission' | 'cheatsheet'
    this.activeWindow = 'editor'; // 'editor' | 'split'
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
          if (data.splitMode) this.splitMode = data.splitMode;
          if (typeof data.splitRatio === 'number') this.splitRatio = data.splitRatio;
          if (typeof data.splitReversed === 'boolean') this.splitReversed = data.splitReversed;
          if (data.splitTab) this.splitTab = data.splitTab;
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
          splitMode: this.splitMode,
          splitRatio: this.splitRatio,
          splitReversed: this.splitReversed,
          splitTab: this.splitTab,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
    } catch {}
  }

  setSplitMode(mode) {
    if (['vertical', 'horizontal', 'zen'].includes(mode)) {
      this.splitMode = mode;
      this.save();
    }
  }

  setSplitRatio(ratio) {
    const clamped = Math.max(20, Math.min(80, Math.round(ratio)));
    this.splitRatio = clamped;
    this.save();
  }

  toggleSplitReverse() {
    this.splitReversed = !this.splitReversed;
    this.save();
    return this.splitReversed;
  }

  setSplitTab(tab) {
    const normalized = tab === 'cheat' ? 'cheatsheet' : tab;
    if (['diff', 'mission', 'cheatsheet'].includes(normalized)) {
      this.splitTab = normalized;
      this.save();
    }
  }

  toggleZen() {
    if (this.splitMode === 'zen') {
      this.splitMode = this._lastSplitMode || 'vertical';
    } else {
      this._lastSplitMode = this.splitMode;
      this.splitMode = 'zen';
    }
    this.save();
    return this.splitMode;
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
    if (day < 60) {
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
const { FzfModal } = require('./ui/fzf-modal.js');
const { NeoTreeSidebar } = require('./ui/neo-tree.js');
const { TroubleDrawer } = require('./ui/trouble.js');
const { LspPopups } = require('./ui/lsp-popups.js');
const { LazyGitModal } = require('./ui/lazygit-modal.js');
const { SplitManager } = require('./ui/split-manager.js');

class App {
  constructor() {
    this.state = new GameState();
    this.sound = new SoundFX();
    this.sound.setMuted(this.state.isMuted);
    this.splitManager = null;

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

    this.fzfModal = null;
    this.neoTree = null;
    this.troubleDrawer = null;
    this.lspPopups = null;
    this.lazygitModal = null;
  }

  init() {
    this.initPlugins();
    this.initSplitManager();
    this.bindEvents();
    this.loadStage(this.state.currentDay);
    this.updateAudioButton();
  }

  initSplitManager() {
    if (typeof document === 'undefined') return;
    this.splitManager = new SplitManager(this.state);
    this.splitManager.init();
  }

  initPlugins() {
    if (typeof document === 'undefined') return;

    this.fzfModal = new FzfModal({
      containerEl: document.body,
      onSelectFile: (file) => {
        if (this.buffer && this.engine) {
          this.buffer.setText(file.content);
          this.buffer.setCursor(0, 0);
          this.engine.actionsExecuted.add('fzf');
          this.lastFeedback = `Fzf: Opened ${file.path}`;
          const tabEl = document.getElementById('tab-filename');
          if (tabEl) tabEl.textContent = file.path.split('/').pop();
          this.render();
        }
      },
      onClose: () => {
        this.render();
      },
    });

    this.neoTree = new NeoTreeSidebar({
      containerEl: document.querySelector('.main-workspace') || document.body,
      onSelectFile: (file) => {
        if (this.buffer && this.engine) {
          this.buffer.setText(file.content);
          this.buffer.setCursor(0, 0);
          this.engine.actionsExecuted.add('neotree');
          this.lastFeedback = `Neo-tree: Opened ${file.path}`;
          const tabEl = document.getElementById('tab-filename');
          if (tabEl) tabEl.textContent = file.name;
          this.render();
        }
      },
      onToggle: () => {
        this.render();
      },
    });

    this.troubleDrawer = new TroubleDrawer({
      containerEl: document.querySelector('.editor-pane') || document.body,
      onSelectDiagnostic: (diag) => {
        if (this.buffer && this.engine) {
          this.engine.actionsExecuted.add('trouble');
          this.buffer.setCursor(Math.max(0, diag.line - 1), diag.col);
          this.lastFeedback = `Trouble: Jumped to ${diag.file}:${diag.line}`;
          this.render();
        }
      },
      onToggle: () => {
        this.render();
      },
    });

    this.lspPopups = new LspPopups({
      containerEl: document.body,
      onApplyCodeAction: (actionId) => {
        if (this.engine) {
          this.engine.actionsExecuted.add('lsp_code_action');
          this.lastFeedback = `LSP: Applied code action (${actionId})`;
          this.render();
        }
      },
      onApplyRename: (newName) => {
        if (this.buffer && this.engine) {
          const curWord = this.engine.getWordUnderCursor();
          if (curWord) {
            const lines = this.buffer.getLines();
            const regex = new RegExp(`\\b${curWord}\\b`, 'g');
            const newLines = lines.map(l => l.replace(regex, newName));
            this.buffer.setText(newLines.join('\n'));
          }
          this.engine.actionsExecuted.add('lsp_rename');
          this.lastFeedback = `LSP: Renamed to '${newName}'`;
          this.render();
        }
      },
    });

    this.lazygitModal = new LazyGitModal({
      containerEl: document.body,
      onClose: () => {
        this.render();
      },
    });
  }

  setupEngineHooks() {
    if (!this.engine) return;

    this.engine.onLeaderState = (prefix, active) => {
      toggleWhichKey(this.dom.whichKeyDrawer, active, prefix);
    };

    this.engine.onPluginAction = (action) => {
      this.handleAction(action);
    };
  }

  handleAction(action) {
    if (!action) return;

    if (action === 'vsplit') {
      this.splitManager?.setMode('vertical');
    } else if (action === 'split') {
      this.splitManager?.setMode('horizontal');
    } else if (action === 'zen') {
      this.splitManager?.toggleZen();
    } else if (action === 'close_window') {
      this.splitManager?.setMode('zen');
    } else if (action === 'equalize_split') {
      this.splitManager?.equalize();
    } else if (action === 'resize_width_plus') {
      this.splitManager?.adjustRatio(5);
    } else if (action === 'resize_width_minus') {
      this.splitManager?.adjustRatio(-5);
    } else if (action === 'resize_height_plus') {
      this.splitManager?.adjustRatio(5);
    } else if (action === 'resize_height_minus') {
      this.splitManager?.adjustRatio(-5);
    } else if (action === 'swap_splits') {
      this.splitManager?.toggleReverse();
    } else if (action === 'switch_window') {
      this.splitManager?.switchActiveWindow();
    } else if (action === 'toggle_mission') {
      this.splitManager?.setTab('mission');
      if (this.state.splitMode === 'zen') this.splitManager?.setMode('vertical');
    } else if (action === 'toggle_diff') {
      this.splitManager?.setTab('diff');
      if (this.state.splitMode === 'zen') this.splitManager?.setMode('vertical');
    } else if (action === 'toggle_split_orientation') {
      const next = this.state.splitMode === 'horizontal' ? 'vertical' : 'horizontal';
      this.splitManager?.setMode(next);
    } else if (action === 'mission_modal') {
      this.splitManager?.openFloatingMission(this.currentStage);
    } else if (action === 'hint') {
      this.showHint();
    } else if (action === 'reset') {
      this.loadStage(this.currentStage.day || 1);
    } else if (action === 'next_stage') {
      if (this.currentStage?.day && this.currentStage.day < STAGES.length) {
        this.loadStage(this.currentStage.day + 1);
      }
    } else if (action === 'prev_stage') {
      if (this.currentStage?.day && this.currentStage.day > 1) {
        this.loadStage(this.currentStage.day - 1);
      }
    } else if (action === 'stage_map') {
      renderStageSelectModal(
        this.dom.modalOverlay,
        STAGES,
        this.state,
        day => this.loadStage(day)
      );
    } else if (action === 'fzf_files' || action === 'fzf') {
      this.fzfModal?.open('files');
    } else if (action === 'fzf_grep') {
      this.fzfModal?.open('grep');
    } else if (action === 'fzf_buffers') {
      this.fzfModal?.open('buffers');
    } else if (action === 'neotree') {
      this.neoTree?.toggle();
    } else if (action === 'trouble') {
      this.troubleDrawer?.toggle();
    } else if (action === 'lsp_hover') {
      const word = this.engine?.getWordUnderCursor();
      this.lspPopups?.showHover(word, `(symbol) ${word || 'element'}: unknown`, `LSP documentation for '${word || 'symbol'}'.`);
    } else if (action === 'lsp_code_action') {
      this.lspPopups?.showAction();
    } else if (action === 'lsp_rename') {
      const word = this.engine?.getWordUnderCursor();
      this.lspPopups?.showRename(word);
    } else if (action === 'lazygit') {
      this.lazygitModal?.open();
    }
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
    this.setupEngineHooks();

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
    this.setupEngineHooks();
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

    const diffMini = document.getElementById('diff-mini-title');
    if (diffMini) {
      diffMini.textContent = s.day ? `Day ${s.day}: ${s.title}` : s.title;
    }

    if (this.dom.tabFilename) {
      this.dom.tabFilename.textContent = s.day ? `day_${s.day}_exercise.ts` : 'sandbox.ts';
    }

    const navPillDay = document.getElementById('nav-pill-day');
    const navPillTitle = document.getElementById('nav-pill-title');
    if (navPillDay) navPillDay.textContent = s.day ? `Day ${s.day}` : 'Sandbox';
    if (navPillTitle) navPillTitle.textContent = s.title || 'Practice Session';
    const missionChap = document.getElementById('mission-chapter');
    if (missionChap) {
      missionChap.textContent = s.chapterRef
        ? '📖 ' + s.chapterRef.split('/')[0].replace(/^\d+-/, '').replace(/-/g, ' ')
        : '🥋 Neovim Dojo';
    }
  }

  bindEvents() {
    window.addEventListener('keydown', e => this.handleKeydown(e));

    document.getElementById('btn-prev-stage')?.addEventListener('click', (e) => {
      e.currentTarget?.blur();
      this.handleAction('prev_stage');
    });
    document.getElementById('btn-next-stage')?.addEventListener('click', (e) => {
      e.currentTarget?.blur();
      this.handleAction('next_stage');
    });
    document.getElementById('nav-stage-pill')?.addEventListener('click', (e) => {
      e.currentTarget?.blur();
      this.handleAction('stage_map');
    });

    document.getElementById('tab-quick-diff')?.addEventListener('click', () => {
      this.splitManager?.setTab('diff');
      if (this.state.splitMode === 'zen') this.splitManager?.setMode('vertical');
    });
    document.getElementById('tab-quick-mission')?.addEventListener('click', () => {
      this.splitManager?.setTab('mission');
      if (this.state.splitMode === 'zen') this.splitManager?.setMode('vertical');
    });

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
      if (this.currentStage.day && this.currentStage.day < STAGES.length) {
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
      if (result.action) {
        this.handleAction(result.action);
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
              if (this.currentStage.day < STAGES.length) {
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
    renderStatusline(this.dom.statusline, this.engine, { ...this.currentStage, splitMode: this.state.splitMode });
    renderCmdline(this.dom.cmdlineBar, this.engine, this.lastFeedback);
    renderHUD(this.dom.hud, this.keystrokes, this.currentStage.parKeystrokes, this.lastFeedback, this.engine);

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
