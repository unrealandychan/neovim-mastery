/**
 * Computes line-by-line diff between current buffer and target text.
 * @param {string} currentText
 * @param {string} targetText
 * @returns {{ matches: boolean, lines: Array<{ type: 'match'|'diff'|'missing'|'extra', current?: string, target?: string }> }}
 */
export function computeTextDiff(currentText = '', targetText = '') {
  const curLines = currentText.replace(/\r\n/g, '\n').split('\n');
  const targetLines = targetText.replace(/\r\n/g, '\n').split('\n');

  const maxLines = Math.max(curLines.length, targetLines.length);
  const diffLines = [];
  let matches = true;

  for (let i = 0; i < maxLines; i++) {
    const cur = curLines[i];
    const tgt = targetLines[i];

    if (cur === tgt) {
      diffLines.push({ type: 'match', current: cur, target: tgt });
    } else if (cur === undefined) {
      matches = false;
      diffLines.push({ type: 'missing', target: tgt });
    } else if (tgt === undefined) {
      matches = false;
      diffLines.push({ type: 'extra', current: cur });
    } else {
      matches = false;
      diffLines.push({ type: 'diff', current: cur, target: tgt });
    }
  }

  return { matches, lines: diffLines };
}

/**
 * Renders target diff preview into container
 * @param {HTMLElement} container
 * @param {string} currentText
 * @param {string} targetText
 */
export function renderDiffViewer(container, currentText, targetText) {
  if (!container) return;
  const { matches, lines } = computeTextDiff(currentText, targetText);

  let html = '';
  lines.forEach((l, idx) => {
    if (l.type === 'match') {
      html += `<div class="diff-line diff-match">✓ ${escapeHtml(l.target)}</div>`;
    } else if (l.type === 'missing') {
      html += `<div class="diff-line diff-missing">+ ${escapeHtml(l.target)} (missing)</div>`;
    } else if (l.type === 'extra') {
      html += `<div class="diff-line diff-unwanted">- ${escapeHtml(l.current)} (extra)</div>`;
    } else {
      html += `<div class="diff-line diff-diff">
        <span class="diff-unwanted">- ${escapeHtml(l.current)}</span><br>
        <span class="diff-match">+ ${escapeHtml(l.target)}</span>
      </div>`;
    }
  });

  container.innerHTML = html;
}

function escapeHtml(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
