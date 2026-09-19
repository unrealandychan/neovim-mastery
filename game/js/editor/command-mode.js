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
