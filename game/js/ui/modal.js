/**
 * Game Modals: Stage Select & Victory Celebration
 */

/**
 * Renders the 30-Day Stage Map Modal
 */
export function renderStageSelectModal(container, stages, gameState, onSelectStage) {
  if (!container) return;

  const cardHtml = stages.map(s => {
    const isUnlocked = gameState.isDayUnlocked(s.day);
    const stars = gameState.getStageStars(s.day);
    const isActive = gameState.currentDay === s.day;

    let starIcons = '';
    if (isUnlocked) {
      if (stars === 3) starIcons = '⭐⭐⭐';
      else if (stars === 2) starIcons = '⭐⭐';
      else if (stars === 1) starIcons = '⭐';
      else starIcons = '<span style="color: var(--tn-dark3)">☆☆☆</span>';
    } else {
      starIcons = '🔒 Locked';
    }

    const itemClass = `stage-btn ${isActive ? 'active' : ''} ${!isUnlocked ? 'locked' : ''}`;

    return `
      <div class="${itemClass}" data-day="${s.day}">
        <div class="day-label">Day ${s.day}</div>
        <div style="font-size: 10px; color: var(--tn-comment); margin: 2px 0;">${escapeHtml(s.title)}</div>
        <div class="stars">${starIcons}</div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="modal-card" style="max-width: 860px; max-height: 85vh; display: flex; flex-direction: column;">
      <div class="modal-header">
        <div class="modal-title">🗺️ The 60-Stage Neovim & LazyVim Dojo Map</div>
        <button class="btn btn-close" id="modal-close-btn">✕</button>
      </div>
      <div class="modal-body">
        <div style="color: var(--tn-fg-dark); font-size: 13px; margin-bottom: 12px;">
          Select any unlocked stage to deliberate practice. Earn 3 Gold Stars by completing challenges at or under Par!
        </div>
        <div class="stage-grid">${cardHtml}</div>
      </div>
      <div class="modal-footer">
        <button class="btn" id="modal-cancel-btn">Close</button>
      </div>
    </div>
  `;

  container.classList.add('open');

  // Bind clicks
  container.querySelectorAll('.stage-btn:not(.locked)').forEach(btn => {
    btn.addEventListener('click', () => {
      const day = parseInt(btn.getAttribute('data-day'), 10);
      container.classList.remove('open');
      if (onSelectStage) onSelectStage(day);
    });
  });

  const closeHandler = () => container.classList.remove('open');
  container.querySelector('#modal-close-btn')?.addEventListener('click', closeHandler);
  container.querySelector('#modal-cancel-btn')?.addEventListener('click', closeHandler);
}

/**
 * Renders the Stage Victory Modal
 */
export function renderVictoryModal(container, stage, evaluation, onNext, onReplay) {
  if (!container) return;

  const starsDisplay = '⭐'.repeat(evaluation.stars) + '☆'.repeat(3 - evaluation.stars);
  const chapterLink = `../${stage.chapterRef}`;

  container.innerHTML = `
    <div class="modal-card" style="max-width: 480px; text-align: center;">
      <div class="modal-header" style="justify-content: center; background: transparent;">
        <div class="modal-title" style="font-size: 20px;">🎉 Day ${stage.day} Mastered!</div>
      </div>
      <div class="modal-body" style="padding: 10px 24px;">
        <div style="font-size: 38px; margin: 12px 0; letter-spacing: 4px;">${starsDisplay}</div>
        <div style="font-size: 15px; color: var(--tn-cyan); font-weight: 600; margin-bottom: 8px;">
          ${escapeHtml(evaluation.feedback)}
        </div>
        <div style="font-size: 13px; color: var(--tn-fg-dark); margin-bottom: 16px;">
          Keystrokes: <b>${evaluation.strokes}</b> | Target Par: <b>${stage.parKeystrokes}</b>
        </div>
        <div style="background-color: var(--tn-bg-dark); padding: 12px; border-radius: 6px; font-size: 12px; text-align: left; margin-bottom: 16px;">
          <div style="color: var(--tn-purple); font-weight: 600; margin-bottom: 4px;">📖 Companion Chapter:</div>
          <a href="${chapterLink}" target="_blank" style="color: var(--tn-blue); text-decoration: none;">
            ${escapeHtml(stage.chapterRef)} ↗
          </a>
        </div>
      </div>
        <div style="display: flex; gap: 8px; justify-content: center; width: 100%;">
          <button class="btn" id="victory-replay-btn">🔄 Replay (r)</button>
          ${stage.day < 30 ? '<button class="btn btn-primary" id="victory-next-btn">Next Day ➔ (Enter)</button>' : '<button class="btn btn-primary" id="victory-next-btn">🏆 View Map (Enter)</button>'}
        </div>
        <div style="font-size: 11px; color: var(--tn-fg-dark); margin-top: 8px; width: 100%;">
          Press <kbd style="background: var(--tn-bg-highlight); padding: 2px 5px; border-radius: 3px; color: var(--tn-fg);">Enter</kbd> to proceed, <kbd style="background: var(--tn-bg-highlight); padding: 2px 5px; border-radius: 3px; color: var(--tn-fg);">r</kbd> to replay, <kbd style="background: var(--tn-bg-highlight); padding: 2px 5px; border-radius: 3px; color: var(--tn-fg);">Esc</kbd> to close
        </div>
      </div>
    </div>
  `;

  container.classList.add('open');

  container.querySelector('#victory-replay-btn')?.addEventListener('click', (e) => {
    e.currentTarget?.blur();
    container.classList.remove('open');
    if (onReplay) onReplay();
  });

  container.querySelector('#victory-next-btn')?.addEventListener('click', (e) => {
    e.currentTarget?.blur();
    container.classList.remove('open');
    if (onNext) onNext();
  });

  container.onclick = (e) => {
    if (e.target === container) {
      container.classList.remove('open');
    }
  };
}

function escapeHtml(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
