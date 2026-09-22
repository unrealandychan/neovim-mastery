/**
 * GameState: Manages user progress, scores, unlocked stages, and preferences.
 */
const STORAGE_KEY = 'neovim_mastery_dojo_state';

export class GameState {
  constructor() {
    this.currentDay = 1;
    this.unlockedDays = [1];
    this.starsByDay = {};
    this.bestStrokesByDay = {};
    this.isMuted = false;
    this.sandboxMode = false;
    this.splitMode = 'vertical'; // 'vertical' | 'horizontal' | 'zen'
    this.splitRatio = 55; // Editor size percentage (20..80)
    this.splitReversed = false;
    this.splitTab = 'diff'; // 'diff' | 'mission' | 'cheatsheet'
    this.activeWindow = 'editor'; // 'editor' | 'split'
    this.load();
  }

  load() {
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const data = JSON.parse(raw);
          this.currentDay = data.currentDay || 1;
          this.unlockedDays = Array.isArray(data.unlockedDays) ? data.unlockedDays : [1];
          this.starsByDay = data.starsByDay || {};
          this.bestStrokesByDay = data.bestStrokesByDay || {};
          this.isMuted = !!data.isMuted;
          if (data.splitMode) this.splitMode = data.splitMode;
          if (typeof data.splitRatio === 'number') this.splitRatio = data.splitRatio;
          if (typeof data.splitReversed === 'boolean') this.splitReversed = data.splitReversed;
          if (data.splitTab) this.splitTab = data.splitTab;
        }
      }
    } catch {}
  }

  save() {
    try {
      if (typeof localStorage !== 'undefined') {
        const data = {
          currentDay: this.currentDay,
          unlockedDays: this.unlockedDays,
          starsByDay: this.starsByDay,
          bestStrokesByDay: this.bestStrokesByDay,
          isMuted: this.isMuted,
          splitMode: this.splitMode,
          splitRatio: this.splitRatio,
          splitReversed: this.splitReversed,
          splitTab: this.splitTab,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
    } catch {}
  }

  setSplitMode(mode) {
    if (['vertical', 'horizontal', 'zen'].includes(mode)) {
      this.splitMode = mode;
      this.save();
    }
  }

  setSplitRatio(ratio) {
    const clamped = Math.max(20, Math.min(80, Math.round(ratio)));
    this.splitRatio = clamped;
    this.save();
  }

  toggleSplitReverse() {
    this.splitReversed = !this.splitReversed;
    this.save();
    return this.splitReversed;
  }

  setSplitTab(tab) {
    const normalized = tab === 'cheat' ? 'cheatsheet' : tab;
    if (['diff', 'mission', 'cheatsheet'].includes(normalized)) {
      this.splitTab = normalized;
      this.save();
    }
  }

  toggleZen() {
    if (this.splitMode === 'zen') {
      this.splitMode = this._lastSplitMode || 'vertical';
    } else {
      this._lastSplitMode = this.splitMode;
      this.splitMode = 'zen';
    }
    this.save();
    return this.splitMode;
  }

  isDayUnlocked(day) {
    return this.unlockedDays.includes(day);
  }

  unlockDay(day) {
    if (!this.unlockedDays.includes(day)) {
      this.unlockedDays.push(day);
      this.save();
    }
  }

  getStageStars(day) {
    return this.starsByDay[day] || 0;
  }

  getBestStrokes(day) {
    return this.bestStrokesByDay[day] || null;
  }

  recordStageResult(day, stars, strokes) {
    const prevStars = this.starsByDay[day] || 0;
    if (stars > prevStars) {
      this.starsByDay[day] = stars;
    }

    const prevBest = this.bestStrokesByDay[day];
    if (prevBest === undefined || strokes < prevBest) {
      this.bestStrokesByDay[day] = strokes;
    }

    // Unlock next day
    if (day < 60) {
      this.unlockDay(day + 1);
    }

    this.save();
  }

  resetProgress() {
    this.currentDay = 1;
    this.unlockedDays = [1];
    this.starsByDay = {};
    this.bestStrokesByDay = {};
    this.save();
  }
}
