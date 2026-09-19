/**
 * Tokyo Night Lualine-style Statusline Renderer
 */

/**
 * @param {HTMLElement} container
 * @param {import('../editor/vim-engine.js').VimEngine} engine
 * @param {object} [stageInfo]
 */
export function renderStatusline(container, engine, stageInfo = {}) {
  if (!container) return;

  const mode = engine.getMode();
  const cur = engine.buffer.getCursor();
  const lines = engine.buffer.getLines();
  const totalLines = lines.length;

  const rowDisplay = cur.row + 1;
  const colDisplay = cur.col + 1;

  let posPercent = 'Top';
  if (totalLines > 1) {
    if (cur.row === 0) posPercent = 'Top';
    else if (cur.row === totalLines - 1) posPercent = 'Bot';
    else posPercent = `${Math.round((cur.row / (totalLines - 1)) * 100)}%`;
  }

  const stageLabel = stageInfo.day
    ? `Day ${stageInfo.day}: ${stageInfo.title || 'Practice'}`
    : 'Neovim Mastery Sandbox';

  container.innerHTML = `
    <div class="status-left">
      <div class="status-mode ${mode}">${mode}</div>
      <div class="status-item status-branch">
        <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
          <path fill-rule="evenodd" d="M11.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122V6A2.5 2.5 0 0110 8.5H6a1 1 0 00-1 1v1.128a2.251 2.251 0 11-1.5 0V5.372a2.25 2.25 0 111.5 0v1.836A2.492 2.492 0 016 7h4a1 1 0 001-1v-.628A2.25 2.25 0 019.5 3.25zM4.25 12a.75.75 0 100 1.5.75.75 0 000-1.5zM3.5 3.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0z"/>
        </svg>
        main
      </div>
      <div class="status-item">${stageLabel}</div>
    </div>
    <div class="status-right">
      <div class="status-item">utf-8</div>
      <div class="status-position">${rowDisplay}:${colDisplay} [${posPercent}]</div>
    </div>
  `;
}
