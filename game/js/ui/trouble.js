/**
 * Trouble Diagnostics Drawer Simulation (<leader>xx / :Trouble)
 */

export const MOCK_DIAGNOSTICS = [
  { severity: 'error', icon: '', file: 'src/auth/jwt.ts', line: 2, col: 10, msg: "Type 'string' is not assignable to type 'boolean'." },
  { severity: 'warning', icon: '', file: 'src/controllers/api.controller.ts', line: 14, col: 5, msg: 'Missing await on asynchronous database query call.' },
  { severity: 'hint', icon: '', file: 'src/models/user.model.ts', line: 1, col: 18, msg: 'Interface property name is unused in current scope.' },
  { severity: 'info', icon: '', file: 'src/services/database.service.ts', line: 8, col: 2, msg: 'TODO: Add connection pool reconnect retry logic.' },
];

export class TroubleDrawer {
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
