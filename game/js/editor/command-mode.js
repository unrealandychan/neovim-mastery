/**
 * Handles Vim command-line mode execution (":", "/")
 */
export class CommandModeHandler {
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
