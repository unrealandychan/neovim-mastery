/**
 * Terminal & Buffer DOM Renderer
 */

export function escapeHtml(str) {
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
export function highlightCode(text) {
  if (!text) return ' ';
  const regex = /(\/\/.*$|#.*$)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\b(?:const|let|var|function|def|func|fn|return|if|else|import|export|type|interface|switch|case|package|struct)\b)|(\b(?:string|number|boolean|any|void|Promise|User|UserProfile|int|float|true|false|null|nil|None)\b)/g;

  let lastIndex = 0;
  let out = '';
  let m;

  while ((m = regex.exec(text)) !== null) {
    if (m.index > lastIndex) {
      out += escapeHtml(text.slice(lastIndex, m.index));
    }
    const [full, comment, str, kw, type] = m;
    if (comment) {
      out += `<span class="syn-comment">${escapeHtml(comment)}</span>`;
    } else if (str) {
      out += `<span class="syn-string">${escapeHtml(str)}</span>`;
    } else if (kw) {
      out += `<span class="syn-keyword">${escapeHtml(kw)}</span>`;
    } else if (type) {
      out += `<span class="syn-type">${escapeHtml(type)}</span>`;
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    out += escapeHtml(text.slice(lastIndex));
  }
  return out || ' ';
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
  const isFlashMode = mode === 'FLASH';
  const hasFlashTargets = (engine.flashTargets || []).length > 0;

  for (let r = 0; r < lines.length; r++) {
    const isCurrentLine = r === cur.row;
    const lineFlashTargets = (engine.flashTargets || []).filter(t => t.row === r);
    const hasTargetsOnThisLine = lineFlashTargets.length > 0;

    let lineClass = isCurrentLine ? 'buffer-line active-line' : 'buffer-line';
    if (isFlashMode && hasFlashTargets) {
      lineClass += hasTargetsOnThisLine ? ' flash-target-line' : ' flash-dimmed-line';
    }

    // Hybrid line numbers (relative + absolute on current)
    const lineNum = isCurrentLine ? `${r + 1}` : `${Math.abs(r - cur.row)}`;

    const rawLine = lines[r];
    let lineRendered = '';

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
      // Render line with non-destructive flash beacon badges and highlighted target text
      let lastIdx = 0;
      for (const t of lineFlashTargets) {
        lineRendered += escapeHtml(rawLine.slice(lastIdx, t.col));
        const matchLen = 2;
        const matchedChars = escapeHtml(rawLine.slice(t.col, t.col + matchLen));
        lineRendered += `<span class="flash-match-wrapper"><span class="flash-label" data-label="${escapeHtml(t.label)}">${escapeHtml(t.label.toUpperCase())}</span><span class="flash-matched-text">${matchedChars}</span></span>`;
        lastIdx = t.col + matchLen;
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
      if (mode === 'FLASH') cursorClass = 'vim-cursor cursor-flash';

      lineRendered = `${before}<span class="${cursorClass}">${escapeHtml(cursorChar)}</span>${after}`;
    } else {
      lineRendered = highlightCode(rawLine) || ' ';
    }

    html += `<div class="${lineClass}">
      <span class="line-num">${lineNum}</span>
      <span class="line-content">${lineRendered}</span>
    </div>`;
  }

  // Floating Flash Prompt Bar inside viewport when in FLASH mode
  if (isFlashMode) {
    let flashStatusHtml = '';
    if (hasFlashTargets) {
      const q = engine.lastFlashQuery || '';
      const beaconKey = (engine.flashTargets[0]?.label || 'a').toUpperCase();
      flashStatusHtml = `<span class="flash-bar-query">Target: <strong>${escapeHtml(q)}</strong></span> <span class="flash-bar-action">▸ Press beacon <kbd class="flash-beacon-key">${beaconKey}</kbd> to jump</span>`;
    } else if (engine.pendingKeys && engine.pendingKeys.length > 0) {
      flashStatusHtml = `<span class="flash-bar-query">Query: <strong>${escapeHtml(engine.pendingKeys)}</strong>_</span> <span class="flash-bar-hint">(type 1 more character)</span>`;
    } else {
      flashStatusHtml = `<span class="flash-bar-hint">Type 2 search characters to jump · &lt;Esc&gt; to cancel</span>`;
    }

    html += `<div class="flash-prompt-bar">
      <div class="flash-prompt-badge">⚡ FLASH</div>
      <div class="flash-prompt-content">${flashStatusHtml}</div>
    </div>`;
  }

  container.innerHTML = html;
}

/**
 * Renders the Neovim command-line bar below the statusline
 * @param {HTMLElement} container
 * @param {import('../editor/vim-engine.js').VimEngine} engine
 * @param {string} feedback
 */
export function renderCmdline(container, engine, feedback = '') {
  if (!container) return;

  const mode = engine.getMode();
  if (mode === 'COMMAND') {
    const cmd = engine.commandLine || ':';
    const promptChar = cmd[0] || ':';
    const rest = cmd.slice(1);
    container.innerHTML = `<span class="cmd-prompt">${promptChar}</span><span class="cmd-text">${escapeHtml(rest)}</span><span class="vim-cursor cursor-normal">&nbsp;</span>`;
    container.className = 'cmdline-bar active';
  } else if (feedback) {
    container.innerHTML = `<span class="cmd-feedback">${escapeHtml(feedback)}</span>`;
    container.className = 'cmdline-bar';
  } else {
    container.innerHTML = `<span class="cmd-feedback-placeholder"></span>`;
    container.className = 'cmdline-bar';
  }
}

