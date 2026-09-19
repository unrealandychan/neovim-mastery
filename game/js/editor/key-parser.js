/**
 * Normalizes input key strings across browser KeyboardEvent and test runners.
 * @param {string} key
 * @returns {string}
 */
export function normalizeKey(key) {
  if (key === 'Escape' || key === '<Esc>' || key === '<esc>') return 'Escape';
  if (key === 'Enter' || key === '<CR>' || key === '<cr>' || key === '\n') return 'Enter';
  if (key === 'Backspace' || key === '<BS>' || key === '<bs>') return 'Backspace';
  if (key === 'Tab' || key === '<Tab>') return 'Tab';
  if (key === '<Space>' || key === ' ') return ' ';
  if (key === '<leader>' || key === '<Leader>') return ' ';
  if (/^<c-r>$/i.test(key)) return '<C-r>';
  if (/^<c-s>$/i.test(key)) return '<C-s>';
  if (/^<c-d>$/i.test(key)) return '<C-d>';
  if (/^<c-u>$/i.test(key)) return '<C-u>';
  return key;
}

/**
 * Helper to classify word characters vs symbols vs whitespace.
 * @param {string} char
 * @returns {'word' | 'punct' | 'space'}
 */
export function getCharType(char) {
  if (!char || /\s/.test(char)) return 'space';
  if (/[a-zA-Z0-9_]/.test(char)) return 'word';
  return 'punct';
}
