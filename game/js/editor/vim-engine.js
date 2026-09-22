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
      if (lk === 'cp') {
        this.pendingLeader = false;
        this.leaderKeys = '';
        if (this.onLeaderState) this.onLeaderState('', false);
        this.actionsExecuted.add('markdown_preview');
        this.actionsExecuted.add('leader_cp');
        if (this.onPluginAction) this.onPluginAction('markdown_preview');
        return { handled: true, feedback: 'Markdown: Browser Preview (:MarkdownPreviewToggle)', action: 'markdown_preview' };
      }
      if (lk === 'cg') {
        this.pendingLeader = false;
        this.leaderKeys = '';
        if (this.onLeaderState) this.onLeaderState('', false);
        this.actionsExecuted.add('markdown_glow');
        this.actionsExecuted.add('leader_cg');
        if (this.onPluginAction) this.onPluginAction('markdown_glow');
        return { handled: true, feedback: 'Markdown: Glow Floating Window (:Glow)', action: 'markdown_glow' };
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

      // Google Stack & AI Agents (<Space>a...)
      if (lk === 'aa') {
        this.pendingLeader = false;
        this.leaderKeys = '';
        if (this.onLeaderState) this.onLeaderState('', false);
        this.actionsExecuted.add('ai_antigravity');
        this.actionsExecuted.add('leader_aa');
        if (this.onPluginAction) this.onPluginAction('ai_antigravity');
        return { handled: true, feedback: 'Google Stack: Antigravity Agent (agy)', action: 'ai_antigravity' };
      }
      if (lk === 'ac') {
        this.pendingLeader = false;
        this.leaderKeys = '';
        if (this.onLeaderState) this.onLeaderState('', false);
        this.actionsExecuted.add('ai_antigravity_continue');
        this.actionsExecuted.add('leader_ac');
        if (this.onPluginAction) this.onPluginAction('ai_antigravity_continue');
        return { handled: true, feedback: 'Google Stack: Antigravity (Resume Last Session)', action: 'ai_antigravity_continue' };
      }
      if (lk === 'ap') {
        this.pendingLeader = false;
        this.leaderKeys = '';
        if (this.onLeaderState) this.onLeaderState('', false);
        this.actionsExecuted.add('ai_pi');
        this.actionsExecuted.add('leader_ap');
        if (this.onPluginAction) this.onPluginAction('ai_pi');
        return { handled: true, feedback: 'Coding Agent: Pi Terminal', action: 'ai_pi' };
      }
      if (lk === 'aP') {
        this.pendingLeader = false;
        this.leaderKeys = '';
        if (this.onLeaderState) this.onLeaderState('', false);
        this.actionsExecuted.add('ai_pi_continue');
        this.actionsExecuted.add('leader_aP');
        if (this.onPluginAction) this.onPluginAction('ai_pi_continue');
        return { handled: true, feedback: 'Coding Agent: Pi (Resume Last Session)', action: 'ai_pi_continue' };
      }
      if (lk === 'ag') {
        this.pendingLeader = false;
        this.leaderKeys = '';
        if (this.onLeaderState) this.onLeaderState('', false);
        this.actionsExecuted.add('ai_gemini');
        this.actionsExecuted.add('leader_ag');
        if (this.onPluginAction) this.onPluginAction('ai_gemini');
        return { handled: true, feedback: 'Google Stack: Gemini CLI', action: 'ai_gemini' };
      }
      if (lk === 'ae') {
        this.pendingLeader = false;
        this.leaderKeys = '';
        if (this.onLeaderState) this.onLeaderState('', false);
        this.actionsExecuted.add('ai_explain');
        this.actionsExecuted.add('leader_ae');
        if (this.onPluginAction) this.onPluginAction('ai_explain');
        return { handled: true, feedback: 'Gemini: Explain Selected Code', action: 'ai_explain' };
      }
      if (lk === 'af') {
        this.pendingLeader = false;
        this.leaderKeys = '';
        if (this.onLeaderState) this.onLeaderState('', false);
        this.actionsExecuted.add('ai_fix');
        this.actionsExecuted.add('leader_af');
        if (this.onPluginAction) this.onPluginAction('ai_fix');
        return { handled: true, feedback: 'Gemini: Fix / Refactor Code', action: 'ai_fix' };
      }
      if (lk === 'as') {
        this.pendingLeader = false;
        this.leaderKeys = '';
        if (this.onLeaderState) this.onLeaderState('', false);
        this.actionsExecuted.add('ai_ask');
        this.actionsExecuted.add('leader_as');
        if (this.onPluginAction) this.onPluginAction('ai_ask');
        return { handled: true, feedback: 'Ask Google AI (with selection)', action: 'ai_ask' };
      }

      // Markdown Tools (<Space>m...)
      if (lk === 'mp') {
        this.pendingLeader = false;
        this.leaderKeys = '';
        if (this.onLeaderState) this.onLeaderState('', false);
        this.actionsExecuted.add('markdown_preview');
        this.actionsExecuted.add('leader_mp');
        if (this.onPluginAction) this.onPluginAction('markdown_preview');
        return { handled: true, feedback: 'Markdown: Browser Preview (:MarkdownPreviewToggle)', action: 'markdown_preview' };
      }
      if (lk === 'mg') {
        this.pendingLeader = false;
        this.leaderKeys = '';
        if (this.onLeaderState) this.onLeaderState('', false);
        this.actionsExecuted.add('markdown_glow');
        this.actionsExecuted.add('leader_mg');
        if (this.onPluginAction) this.onPluginAction('markdown_glow');
        return { handled: true, feedback: 'Markdown: Glow Floating Window (:Glow)', action: 'markdown_glow' };
      }

      // Prefix drill-down
      if (['f', 's', 'x', 'c', 'g', 'b', 'w', 'u', 'm', 'a'].includes(lk)) {
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
