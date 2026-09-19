/**
 * Terminal & Buffer DOM Renderer
 */

function escapeHtml(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Basic syntax highlighter for JS/TS/Go/Python/Rust code lines
 * @param {string} text
 * @returns {string}
 */
function highlightCode(text) {
  let s = escapeHtml(text);

  // Comments
  s = s.replace(/(\/\/.*$|#.*$)/g, '<span style="color: var(--tn-comment); font-style: italic;">$1</span>');

  // Strings
  s = s.replace(/(&quot;.*?&quot;|&#39;.*?&#39;|`.*?`|"[^"]*"|'[^']*')/g, '<span style="color: var(--tn-green);">$1</span>');

  // Keywords
  s = s.replace(/\b(const|let|var|function|def|func|fn|return|if|else|import|export|type|interface|switch|case|package|struct)\b/g, '<span style="color: var(--tn-purple); font-style: italic;">$1</span>');

  // Types & builtins
  s = s.replace(/\b(string|number|boolean|any|void|Promise|User|UserProfile|int|float|true|false|null|nil|None)\b/g, '<span style="color: var(--tn-cyan);">$1</span>');

  return s;
}

/**
 * Renders the editor buffer into container element
 * @param {HTMLElement} container
 * @param {import('../editor/vim-engine.js').VimEngine} engine
 * @param {import('../editor/buffer.js').TextBuffer} buffer
 */
export function renderBuffer(container, engine, buffer) {
  if (!container) return;
  const lines = buffer.getLines();
  const cur = buffer.getCursor();
  const mode = engine.getMode();

  let html = '';

  for (let r = 0; r < lines.length; r++) {
    const isCurrentLine = r === cur.row;
    const lineClass = isCurrentLine ? 'buffer-line active-line' : 'buffer-line';

    // Hybrid line numbers (relative + absolute on current)
    const lineNum = isCurrentLine ? `${r + 1}` : `${Math.abs(r - cur.row)}`;

    const rawLine = lines[r];
    let lineRendered = '';

    // Check if line contains flash targets
    const lineFlashTargets = (engine.flashTargets || []).filter(t => t.row === r);

    // Visual selection range calculation
    let isLineSelected = false;
    let selStartCol = -1;
    let selEndCol = -1;

    if (mode === 'VISUAL_LINE' && engine.visualStart) {
      const minRow = Math.min(engine.visualStart.row, cur.row);
      const maxRow = Math.max(engine.visualStart.row, cur.row);
      if (r >= minRow && r <= maxRow) {
        isLineSelected = true;
      }
    } else if (mode === 'VISUAL' && engine.visualStart) {
      const vs = engine.visualStart;
      const minRow = Math.min(vs.row, cur.row);
      const maxRow = Math.max(vs.row, cur.row);

      if (r >= minRow && r <= maxRow) {
        if (vs.row === cur.row) {
          selStartCol = Math.min(vs.col, cur.col);
          selEndCol = Math.max(vs.col, cur.col);
        } else if (r === minRow) {
          const startCol = vs.row === minRow ? vs.col : cur.col;
          selStartCol = startCol;
          selEndCol = rawLine.length;
        } else if (r === maxRow) {
          const endCol = vs.row === maxRow ? vs.col : cur.col;
          selStartCol = 0;
          selEndCol = endCol;
        } else {
          isLineSelected = true;
        }
      }
    }

    if (lineFlashTargets.length > 0) {
      // Render line with flash target labels
      let lastIdx = 0;
      for (const t of lineFlashTargets) {
        lineRendered += escapeHtml(rawLine.slice(lastIdx, t.col));
        lineRendered += `<span class="flash-label">${escapeHtml(t.label)}</span>`;
        lastIdx = t.col + 1;
      }
      lineRendered += escapeHtml(rawLine.slice(lastIdx));
    } else if (isLineSelected) {
      lineRendered = `<span class="visual-selection">${escapeHtml(rawLine || ' ')}</span>`;
    } else if (selStartCol !== -1 && selEndCol !== -1) {
      const before = escapeHtml(rawLine.slice(0, selStartCol));
      const selected = escapeHtml(rawLine.slice(selStartCol, selEndCol + 1) || ' ');
      const after = escapeHtml(rawLine.slice(selEndCol + 1));
      lineRendered = `${before}<span class="visual-selection">${selected}</span>${after}`;
    } else if (isCurrentLine) {
      // Render cursor
      const cursorCol = cur.col;
      const before = escapeHtml(rawLine.slice(0, cursorCol));
      const cursorChar = rawLine[cursorCol] || ' ';
      const after = escapeHtml(rawLine.slice(cursorCol + 1));

      let cursorClass = 'vim-cursor cursor-normal';
      if (mode === 'INSERT') cursorClass = 'vim-cursor cursor-insert';
      if (mode === 'VISUAL') cursorClass = 'vim-cursor cursor-visual';

      lineRendered = `${before}<span class="${cursorClass}">${escapeHtml(cursorChar)}</span>${after}`;
    } else {
      lineRendered = highlightCode(rawLine) || ' ';
    }

    html += `<div class="${lineClass}">
      <span class="line-num">${lineNum}</span>
      <span class="line-content">${lineRendered}</span>
    </div>`;
  }

  container.innerHTML = html;
}
