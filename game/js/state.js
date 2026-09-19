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
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
    } catch {}
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
    if (day < 30) {
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
