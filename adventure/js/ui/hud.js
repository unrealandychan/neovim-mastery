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

    this.abilityElements = {};
    document.querySelectorAll('.ability-key').forEach(el => {
      const key = el.getAttribute('data-key');
      if (key) {
        this.abilityElements[key] = el;
      }
    });

    this.helpModal = document.getElementById('modal-help');
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
  }

  updateAbilities(unlockedAbilities, newUnlock = null) {
    for (const [key, el] of Object.entries(this.abilityElements)) {
      if (unlockedAbilities.has(key)) {
        el.classList.add('unlocked');
        if (newUnlock === key) {
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
