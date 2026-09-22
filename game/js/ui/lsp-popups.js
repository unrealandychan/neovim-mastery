/**
 * LSP Popups: Hover Documentation (K), Code Actions (<leader>ca), Symbol Rename (<leader>cr)
 */

export class LspPopups {
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
