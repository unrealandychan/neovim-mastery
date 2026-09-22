/**
 * Which-Key Visual Helper Drawer (LazyVim Dynamic + Static Cheat Sheet)
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
  { key: '<C-v>', desc: 'Visual Block Column Mode' },
  { key: 'qa ... q / @a', desc: 'Record / Replay Macro' },
  { key: 'gsaw" / gsd"', desc: 'Mini.surround Add / Delete' },
  { key: 'K / gd', desc: 'LSP Hover / Definition' },
  { key: '<leader>ff / <leader>sg', desc: 'Fzf Find Files / Live Grep' },
  { key: '<leader>e / <leader>xx', desc: 'Neo-tree / Trouble' },
];

export const LEADER_GROUPS = {
  '': [
    { key: 'f', desc: '+find/file (ff: Files, fb: Buffers)' },
    { key: 's', desc: '+search (sg: Grep, sr: Grug-far)' },
    { key: 'c', desc: '+code (ca: Action, cr: Rename, cf: Format)' },
    { key: 'x', desc: '+diagnostics (xx: Trouble)' },
    { key: 'g', desc: '+git (gg: LazyGit)' },
    { key: 'e', desc: 'Neo-tree Explorer' },
    { key: 'l', desc: 'Lazy.nvim Dashboard' },
    { key: 'w', desc: 'Save Buffer (:w)' },
    { key: 'bd', desc: 'Delete Buffer' },
    { key: '.', desc: 'Snacks Scratchpad' },
    { key: 'ft', desc: 'Floating Terminal' },
  ],
  'f': [
    { key: 'f', desc: 'Find Files (Fzf / Telescope)' },
    { key: 'b', desc: 'Find Buffers' },
    { key: 't', desc: 'Floating Terminal' },
  ],
  's': [
    { key: 'g', desc: 'Live Grep (ripgrep / snacks)' },
    { key: 'r', desc: 'Grug-far Search & Replace' },
  ],
  'c': [
    { key: 'a', desc: 'LSP Code Actions' },
    { key: 'r', desc: 'LSP Rename Symbol' },
    { key: 'f', desc: 'Format Document' },
  ],
  'x': [
    { key: 'x', desc: 'Trouble Project Diagnostics' },
  ],
  'g': [
    { key: 'g', desc: 'LazyGit Floating Window' },
  ],
};

/**
 * Render Which-Key drawer in static or leader mode
 * @param {HTMLElement} drawerEl
 * @param {boolean} [show]
 * @param {string} [prefix]
 */
export function toggleWhichKey(drawerEl, show, prefix = '') {
  if (!drawerEl) return;
  const isVisible = show !== undefined ? show : !drawerEl.classList.contains('visible');

  if (isVisible) {
    const isLeader = prefix !== undefined && prefix !== null && LEADER_GROUPS[prefix] !== undefined;
    const entries = isLeader ? LEADER_GROUPS[prefix] : WHICH_KEY_ENTRIES;
    const title = isLeader
      ? `<div class="which-key-header"><span>Leader &lt;Space&gt;${prefix ? prefix : ''}</span><span class="which-key-sub">Which-Key</span></div>`
      : '';

    const items = entries.map(
      e => `<div class="which-key-item">
        <span class="which-key-key">${escapeHtml(e.key)}</span>
        <span class="which-key-desc">${escapeHtml(e.desc)}</span>
      </div>`
    ).join('');

    drawerEl.innerHTML = title + `<div class="which-key-grid">${items}</div>`;
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
