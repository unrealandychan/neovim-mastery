/**
 * Which-Key Visual Helper Drawer
 */

export const WHICH_KEY_ENTRIES = [
  { key: 'h/j/k/l', desc: 'Left / Down / Up / Right' },
  { key: 'w / b / e', desc: 'Next / Prev / End of Word' },
  { key: '0 / ^ / $', desc: 'Col 0 / First Non-blank / End of Line' },
  { key: 'gg / G', desc: 'Top / Bottom of File' },
  { key: 'f{c} / t{c}', desc: 'Find / Till Char on Line' },
  { key: '; / ,', desc: 'Repeat Seek / Reverse' },
  { key: 'ci" / di"', desc: 'Change / Delete Inside Quotes' },
  { key: 'ci( / di(', desc: 'Change / Delete Inside Parens' },
  { key: 'ci{ / di{', desc: 'Change / Delete Inside Braces' },
  { key: 'dd / cc / yy', desc: 'Delete / Change / Yank Line' },
  { key: 'p / P', desc: 'Paste After / Before' },
  { key: 'u / <C-r>', desc: 'Undo / Redo' },
  { key: '.', desc: 'Repeat Last Change' },
  { key: 's', desc: 'Flash 2-char Teleport' },
  { key: ']m / [m', desc: 'Treesitter AST Hop' },
  { key: ']d / [d', desc: 'Next / Prev Diagnostic' },
  { key: ':w / :q', desc: 'Write / Quit' },
  { key: ':%s/a/b/g', desc: 'Global Substitute' },
];

/**
 * @param {HTMLElement} drawerEl
 * @param {boolean} [show]
 */
export function toggleWhichKey(drawerEl, show) {
  if (!drawerEl) return;
  const isVisible = show !== undefined ? show : !drawerEl.classList.contains('visible');

  if (isVisible) {
    let items = WHICH_KEY_ENTRIES.map(
      e => `<div class="which-key-item">
        <span class="which-key-key">${escapeHtml(e.key)}</span>
        <span class="which-key-desc">${escapeHtml(e.desc)}</span>
      </div>`
    ).join('');
    drawerEl.innerHTML = items;
    drawerEl.classList.add('visible');
  } else {
    drawerEl.classList.remove('visible');
  }
}

function escapeHtml(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
