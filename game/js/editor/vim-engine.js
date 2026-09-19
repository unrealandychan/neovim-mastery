import { normalizeKey, getCharType } from './key-parser.js';
import { OperatorHandler } from './operators.js';
import { CommandModeHandler } from './command-mode.js';
import { FlashModeHandler } from './flash-mode.js';

export class VimEngine {
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
    const textObjMatch = seq.match(/^[dcy](i|a)(["'()\[\]{}wbptaf])$/);
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

    // Motion with operator: dw, cw, d$, d0, etc.
    const motionChar = seq.slice(1);
    if (['w', 'b', 'e', '$', '0', '^', 'j', 'k', 'h', 'l'].includes(motionChar)) {
      this.saveSnapshot();
      const start = this.buffer.getCursor();
      // Execute motion temporarily to find end
      if (motionChar === 'w') this.moveW(count);
      else if (motionChar === 'b') this.moveB(count);
      else if (motionChar === 'e') this.moveE(count);
      else if (motionChar === '$') this.moveDollar();
      else if (motionChar === '0') this.move0();
      else if (motionChar === '^') this.moveHat();
      const end = this.buffer.getCursor();

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

    return { handled: false };
  }

  handleVisualKey(key) {
    if (key === 'Escape' || key === 'v' || key === 'V') {
      this.visualStart = null;
      this.setMode('NORMAL');
      return { handled: true };
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
        for (let r = maxRow; r >= minRow; r--) {
          lines.unshift(this.buffer.deleteLine(r));
        }
        deleted = lines.join('\n') + '\n';
        this.registers[this.activeRegister] = { text: deleted, linewise: true };
        this.buffer.setCursor(minRow, 0);
        if (key === 'c') {
          this.buffer.insertLine(minRow, '');
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
    if (key === 'h') this.moveLeft(1);
    if (key === 'l') this.moveRight(1);
    if (key === 'j') this.moveDown(1);
    if (key === 'k') this.moveUp(1);
    if (key === 'w') this.moveW(1);
    if (key === 'b') this.moveB(1);
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
    return this.commandHandler.execute(cmd);
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
