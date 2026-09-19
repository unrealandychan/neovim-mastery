/**
 * Keystroke HUD and Explanation Dictionary
 */

export const KEY_EXPLANATIONS = {
  'h': 'Move Left',
  'j': 'Move Down',
  'k': 'Move Up',
  'l': 'Move Right',
  'w': 'Next word start',
  'b': 'Previous word start',
  'e': 'Next word end',
  'ge': 'Previous word end',
  '0': 'Beginning of line (col 0)',
  '^': 'First non-blank character',
  '$': 'End of line',
  'i': 'Enter Insert mode (before cursor)',
  'I': 'Enter Insert mode (at line start)',
  'a': 'Enter Insert mode (after cursor)',
  'A': 'Enter Insert mode (at line end)',
  'o': 'Open line below and insert',
  'O': 'Open line above and insert',
  'x': 'Delete character under cursor',
  'X': 'Delete character before cursor',
  'dd': 'Delete (cut) line',
  'cc': 'Change line (delete & insert)',
  'yy': 'Yank (copy) line',
  'p': 'Put (paste) after cursor / line below',
  'P': 'Put (paste) before cursor / line above',
  'u': 'Undo last change',
  '<C-r>': 'Redo change',
  '.': 'Repeat last change',
  'J': 'Join lines',
  'v': 'Enter Visual character mode',
  'V': 'Enter Visual line mode',
  's': 'Flash: 2-keystroke jump',
  ':w': 'Save / write file',
  ':q': 'Quit editor',
  'ciw': 'Change inner word',
  'caw': 'Change around word',
  'diw': 'Delete inner word',
  'daw': 'Delete around word',
  'ci"': 'Change inside double quotes',
  'di"': 'Delete inside double quotes',
  'ci\'': 'Change inside single quotes',
  'di\'': 'Delete inside single quotes',
  'ci(': 'Change inside parentheses',
  'di(': 'Delete inside parentheses',
  'ci{': 'Change inside braces',
  'di{': 'Delete inside braces',
  'dia': 'Mini.ai: Delete inner argument',
  ']m': 'Treesitter: Next function start',
  '[m': 'Treesitter: Previous function start',
  ']d': 'Next diagnostic error',
  '[d': 'Previous diagnostic error',
  'gd': 'LSP: Go to definition',
  'gr': 'LSP: Go to references',
  'K': 'LSP: Hover documentation',
};

/**
 * Updates the HUD elements
 * @param {HTMLElement} hudEl
 * @param {string[]} keystrokes
 * @param {number} par
 * @param {string} lastActionMsg
 */
export function renderHUD(hudEl, keystrokes = [], par = 10, lastActionMsg = '') {
  if (!hudEl) return;

  const count = keystrokes.length;
  const recent = keystrokes.slice(-4).join(' ');
  const fullSeq = keystrokes.slice(-3).join('');
  const explanation = KEY_EXPLANATIONS[fullSeq] || KEY_EXPLANATIONS[keystrokes[keystrokes.length - 1]] || '';

  hudEl.innerHTML = `
    <div class="hud-keys">
      <span style="color: var(--tn-comment); font-size: 11px;">KEYS:</span>
      <span class="key-badge">${recent ? escapeHtml(recent) : 'Ready'}</span>
      ${explanation ? `<span class="hud-message">${escapeHtml(explanation)}</span>` : ''}
    </div>
    <div class="hud-stats" style="display: flex; gap: 14px; font-size: 12px;">
      <span style="color: var(--tn-fg-dark);">${lastActionMsg ? escapeHtml(lastActionMsg) : ''}</span>
      <span style="color: ${count <= par ? 'var(--tn-green)' : 'var(--tn-yellow)'}; font-weight: 700;">
        Strokes: ${count} / Par: ${par}
      </span>
    </div>
  `;
}

function escapeHtml(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
