/**
 * SplitManager: Manages Neovim / LazyVim multi-window layouts.
 * Supports Vertical Split (:vs, <C-w>v), Horizontal Split (:sp, <C-w>s),
 * Zen Mode (:only, <C-w>o), Flipped Layout (<C-w>r),
 * Draggable Split Dividers, Split Winbars, and Floating Mission Help (:help, <Space>m).
 */

export class SplitManager {
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
