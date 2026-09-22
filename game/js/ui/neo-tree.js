/**
 * Neo-tree Explorer Sidebar Simulation
 */

export const FILE_TREE = [
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

export class NeoTreeSidebar {
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
