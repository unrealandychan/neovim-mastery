/**
 * Fzf-Lua / Snacks / Telescope Fuzzy Finder Modal Simulation
 */

export const MOCK_PROJECT_FILES = [
  { path: 'src/auth/jwt.ts', desc: 'JWT token verification and signing', content: 'export function verifyToken(t: string): boolean {\n  return t.startsWith("Bearer ");\n}' },
  { path: 'src/models/user.model.ts', desc: 'User entity and schema definition', content: 'export interface User {\n  id: string;\n  name: string;\n  role: "admin" | "member";\n}' },
  { path: 'src/controllers/api.controller.ts', desc: 'REST API routing and handler dispatch', content: 'export class ApiController {\n  async handleLogin(req: Request) {\n    return { status: 200 };\n  }\n}' },
  { path: 'src/services/database.service.ts', desc: 'PostgreSQL connection pool & queries', content: 'export const db = new DatabaseClient({\n  host: "localhost",\n  port: 5432\n});' },
  { path: 'config/app.config.json', desc: 'Application runtime configurations', content: '{\n  "port": 3000,\n  "env": "production"\n}' },
  { path: 'package.json', desc: 'Project dependencies and build scripts', content: '{\n  "name": "neovim-mastery",\n  "version": "2.0.0"\n}' },
  { path: 'README.md', desc: 'Documentation & onboarding guide', content: '# NeoVim Mastery\nInteractive game for mastering Neovim & LazyVim.' },
];

export class FzfModal {
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
