/**
 * LazyGit Floating Terminal Simulation (<leader>gg)
 */

export class LazyGitModal {
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
