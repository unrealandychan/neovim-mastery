/**
 * Heads-Up Display (HUD) and Modal Windows Manager
 */

export class HUD {
  constructor() {
    this.levelTitleEl = document.getElementById('level-title');
    this.levelObjectiveEl = document.getElementById('level-objective');
    this.commandDisplayEl = document.getElementById('command-display');
    this.gemsCountEl = document.getElementById('gems-count');
    this.goldKeysCountEl = document.getElementById('gold-keys-count');
    this.silverKeysCountEl = document.getElementById('silver-keys-count');
    this.skullKeysCountEl = document.getElementById('skull-keys-count');
    this.bronzeKeysCountEl = document.getElementById('bronze-keys-count');
    this.rubyKeysCountEl = document.getElementById('ruby-keys-count');
    this.emeraldKeysCountEl = document.getElementById('emerald-keys-count');
    this.diamondKeysCountEl = document.getElementById('diamond-keys-count');

    this.abilityElements = {};
    document.querySelectorAll('.ability-key').forEach(el => {
      const key = el.getAttribute('data-key');
      if (key) {
        this.abilityElements[key] = el;
      }
    });

    this.helpModal = document.getElementById('modal-help');
    this.hintsModal = document.getElementById('modal-hints');
    this.hintModalTitle = document.getElementById('hint-modal-title');
    this.hintModalBody = document.getElementById('hint-modal-body');
    this.victoryModal = document.getElementById('modal-victory');
  }

  setLevelInfo(name, objective) {
    if (this.levelTitleEl) this.levelTitleEl.textContent = name;
    if (this.levelObjectiveEl) this.levelObjectiveEl.textContent = objective;
  }

  setCommandPending(cmdText) {
    if (this.commandDisplayEl) {
      this.commandDisplayEl.textContent = cmdText;
    }
  }

  updateInventory(inventory) {
    if (this.gemsCountEl) this.gemsCountEl.textContent = inventory.gems || 0;
    if (this.goldKeysCountEl) this.goldKeysCountEl.textContent = inventory.goldKey || 0;
    if (this.silverKeysCountEl) this.silverKeysCountEl.textContent = inventory.silverKey || 0;
    if (this.skullKeysCountEl) this.skullKeysCountEl.textContent = inventory.skullKey || 0;
    if (this.bronzeKeysCountEl) this.bronzeKeysCountEl.textContent = inventory.bronzeKey || 0;
    if (this.rubyKeysCountEl) this.rubyKeysCountEl.textContent = inventory.rubyKey || 0;
    if (this.emeraldKeysCountEl) this.emeraldKeysCountEl.textContent = inventory.emeraldKey || 0;
    if (this.diamondKeysCountEl) this.diamondKeysCountEl.textContent = inventory.diamondKey || 0;
  }

  updateAbilities(unlockedAbilities, newUnlock = null) {
    const pulseKeys = new Set(newUnlock ? [newUnlock] : []);
    if (newUnlock === 'gg') pulseKeys.add('G');
    if (newUnlock === 'G') pulseKeys.add('gg');
    if (newUnlock === 'b') pulseKeys.add('ge');
    if (newUnlock === '$') { pulseKeys.add('0'); pulseKeys.add('^'); }
    if (newUnlock === '{') pulseKeys.add('}');

    for (const [key, el] of Object.entries(this.abilityElements)) {
      if (unlockedAbilities.has(key)) {
        el.classList.add('unlocked');
        if (pulseKeys.has(key)) {
          el.classList.add('pulse');
          setTimeout(() => el.classList.remove('pulse'), 700);
        }
      } else {
        el.classList.remove('unlocked');
      }
    }
  }

  openHelp() {
    if (this.helpModal) {
      this.helpModal.classList.add('open');
    }
  }

  closeHelp() {
    if (this.helpModal) {
      this.helpModal.classList.remove('open');
    }
  }

  openHints(data = {}) {
    if (!this.hintsModal) return;

    if (this.hintModalTitle && data.title) {
      this.hintModalTitle.textContent = `${data.title} - Guide & Hints`;
    }

    if (this.hintModalBody) {
      let html = '';

      // Section 1: Immediate Action / Right Now
      if (data.immediateHint) {
        html += `
          <div class="hint-section">
            <div class="hint-section-title">📍 Immediate Action / What To Do Now</div>
            <div class="hint-callout">
              <strong>${data.immediateHint}</strong>
            </div>
          </div>
        `;
      }

      // Section 2: Step-by-Step Path to Next Stage
      if (data.walkthrough && data.walkthrough.length > 0) {
        html += `
          <div class="hint-section">
            <div class="hint-section-title">🗺️ Path to Next Stage</div>
            <ul class="hint-step-list">
              ${data.walkthrough.map((step, idx) => `
                <li class="hint-step-item">
                  <span class="hint-step-num">${idx + 1}</span>
                  <span>${step}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        `;
      }

      // Section 3: Essential Vim Keys for This Room
      if (data.commands && data.commands.length > 0) {
        html += `
          <div class="hint-section">
            <div class="hint-section-title">⌨️ Essential Vim Keys for This Room</div>
            <table class="hint-key-table">
              ${data.commands.map(cmd => `
                <tr>
                  <td><kbd>${cmd.key}</kbd></td>
                  <td style="color:var(--fg-dark);">${cmd.desc}</td>
                </tr>
              `).join('')}
            </table>
          </div>
        `;
      }

      // Section 4: Pro Tip
      if (data.tip) {
        html += `
          <div class="hint-section" style="margin-top:12px;">
            <div style="font-size:12px; color:var(--tn-cyan); background:rgba(122, 162, 247, 0.08); border-left:3px solid var(--tn-cyan); padding:8px 12px; border-radius:4px;">
              💡 <strong>Pro Tip:</strong> ${data.tip}
            </div>
          </div>
        `;
      }

      this.hintModalBody.innerHTML = html;
    }

    this.hintsModal.classList.add('open');
  }

  closeHints() {
    if (this.hintsModal) {
      this.hintsModal.classList.remove('open');
    }
  }

  toggleHints(data = {}) {
    if (this.hintsModal && this.hintsModal.classList.contains('open')) {
      this.closeHints();
    } else {
      this.openHints(data);
    }
  }

  openVictory(stats = {}) {
    if (this.victoryModal) {
      const movesEl = document.getElementById('stat-moves');
      const gemsEl = document.getElementById('stat-gems');
      const timeEl = document.getElementById('stat-time');

      if (movesEl) movesEl.textContent = stats.moves || 0;
      if (gemsEl) gemsEl.textContent = stats.gems || 0;
      if (timeEl) timeEl.textContent = stats.time || '0:00';

      this.victoryModal.classList.add('open');
    }
  }

  closeVictory() {
    if (this.victoryModal) {
      this.victoryModal.classList.remove('open');
    }
  }
}
