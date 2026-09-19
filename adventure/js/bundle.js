/**
 * Vim Adventures: Realm of the Modal Hero - Standalone Offline Bundle
 * Generated automatically. Works seamlessly on both http:// and file:// protocols.
 */
(function() {
  'use strict';
  const modules = {};
  const cache = {};

  function defineModule(name, fn) {
    modules[name] = fn;
  }

  function requireModule(currentPath, relativePath) {
    let resolved = relativePath;
    if (relativePath.startsWith('.')) {
      const dir = pathDirname(currentPath);
      resolved = normalizePath(dir ? dir + '/' + relativePath : relativePath);
    }
    if (!resolved.endsWith('.js')) {
      resolved += '.js';
    }

    if (cache[resolved]) {
      return cache[resolved].exports;
    }
    if (!modules[resolved]) {
      throw new Error('Cannot find module "' + relativePath + '" from "' + currentPath + '" (resolved: "' + resolved + '")');
    }

    const mod = { exports: {} };
    cache[resolved] = mod;
    modules[resolved](mod.exports, function(dep) {
      return requireModule(resolved, dep);
    }, mod);
    return mod.exports;
  }

  function pathDirname(p) {
    const idx = p.lastIndexOf('/');
    return idx === -1 ? '' : p.slice(0, idx);
  }

  function normalizePath(p) {
    const parts = p.split('/');
    const res = [];
    for (const part of parts) {
      if (!part || part === '.') continue;
      if (part === '..') {
        res.pop();
      } else {
        res.push(part);
      }
    }
    return res.join('/');
  }

/* Module: engine/audio.js */
defineModule('engine/audio.js', function(exports, require, module) {
/**
 * 8-Bit Retro Synthesizer using Web Audio API
 * Zero external audio files required. Works 100% offline.
 */
class SoundFX {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return;
    }
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        if (this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {});
        }
      }
    } catch {
      this.ctx = null;
    }
  }

  isMuted() {
    return this.muted;
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  setMuted(m) {
    this.muted = m;
  }

  playStep() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(70, t + 0.05);

    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  playJump() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(440, t + 0.08);

    gain.gain.setValueAtTime(0.06, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.08);
  }

  playBump() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(90, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.06);

    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.06);
  }

  playKeyPickup() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = t + idx * 0.05;

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.08, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(start);
      osc.stop(start + 0.08);
    });
  }

  playChestOpen() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // Fanfare: G4, C5, E5, G5, C6, G6
    const notes = [392.0, 523.25, 659.25, 783.99, 1046.5, 1567.98];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = t + idx * 0.08;
      const dur = idx === notes.length - 1 ? 0.35 : 0.07;

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.12, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(start);
      osc.stop(start + dur);
    });
  }

  playDoorOpen() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.linearRampToValueAtTime(320, t + 0.18);

    gain.gain.setValueAtTime(0.09, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.18);
  }

  playSlash() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.1);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.1);
  }

  playWarp() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, t);
    osc.frequency.exponentialRampToValueAtTime(1200, t + 0.35);

    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.35);
  }

  playDialogueBeep() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(420 + Math.random() * 80, t);

    gain.gain.setValueAtTime(0.04, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.03);
  }

  playError() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(130, t);

    gain.gain.setValueAtTime(0.1, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.12);
  }
}

  try { exports.SoundFX = SoundFX; } catch(e) {}
});

/* Module: engine/tilemap.js */
defineModule('engine/tilemap.js', function(exports, require, module) {
/**
 * Tilemap & Grid Physics Engine
 * Handles 2D text-world tiles, collision, and word-boundary spatial queries.
 */

const TileType = {
  VOID: ' ',
  GRASS: '.',
  PATH: '=',
  WALL: '#',
  WATER: '~',
  TREE: 'T',
  PORTAL: '@',
};

class Tilemap {
  constructor(width, height, rawLines = []) {
    this.width = width;
    this.height = height;
    this.grid = []; // 2D array [y][x]

    this.initFromLines(rawLines);
  }

  initFromLines(lines) {
    this.grid = [];
    for (let y = 0; y < this.height; y++) {
      const row = [];
      const line = lines[y] || '';
      for (let x = 0; x < this.width; x++) {
        row.push(line[x] || ' ');
      }
      this.grid.push(row);
    }
  }

  inBounds(x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  getTile(x, y) {
    if (!this.inBounds(x, y)) return ' ';
    return this.grid[y][x];
  }

  setTile(x, y, val) {
    if (this.inBounds(x, y)) {
      this.grid[y][x] = val;
    }
  }

  isWalkable(x, y) {
    if (!this.inBounds(x, y)) return false;
    const t = this.grid[y][x];
    if (t === '#' || t === '~') {
      return false;
    }
    // Any letter, symbol, space, path, grass, portal is walkable
    return true;
  }

  isWordChar(x, y) {
    if (!this.inBounds(x, y)) return false;
    const t = this.grid[y][x];
    return /[a-zA-Z0-9_]/.test(t);
  }

  isPunctuation(x, y) {
    if (!this.inBounds(x, y)) return false;
    const t = this.grid[y][x];
    return !/[a-zA-Z0-9_\s]/.test(t) && t !== '#' && t !== '~' && t !== 'T' && t !== '.' && t !== '=';
  }

  /**
   * Vim 'w' motion: Jump forward to start of next word or punctuation sequence
   */
  findNextWord(startX, startY) {
    let x = startX;
    let y = startY;

    const startIsWord = this.isWordChar(x, y);
    const startIsPunct = this.isPunctuation(x, y);

    // Step 1: Scan past the current token if on one
    if (startIsWord) {
      while (this.inBounds(x + 1, y) && this.isWordChar(x + 1, y)) {
        x++;
      }
    } else if (startIsPunct) {
      while (this.inBounds(x + 1, y) && this.isPunctuation(x + 1, y)) {
        x++;
      }
    }

    // Step 2: Scan past spaces, grass, voids, or move to next line
    while (true) {
      x++;
      if (x >= this.width) {
        x = 0;
        y++;
        if (y >= this.height) {
          // Wrapped past end of map, keep at original
          return { x: startX, y: startY };
        }
      }

      // Check if we hit a new word or punctuation token
      if (this.isWordChar(x, y) || this.isPunctuation(x, y)) {
        if (this.isWalkable(x, y)) {
          return { x, y };
        }
      }
    }
  }

  /**
   * Vim 'b' motion: Jump backward to start of previous word
   */
  findPrevWord(startX, startY) {
    let x = startX;
    let y = startY;

    // Move backward at least 1 tile
    x--;
    if (x < 0) {
      y--;
      if (y < 0) return { x: startX, y: startY };
      x = this.width - 1;
    }

    // Skip trailing whitespace or non-words
    while (y >= 0) {
      while (x >= 0) {
        if (this.isWordChar(x, y) || this.isPunctuation(x, y)) {
          // Found token end, now rewind to token start
          const isWord = this.isWordChar(x, y);
          while (x > 0 && (isWord ? this.isWordChar(x - 1, y) : this.isPunctuation(x - 1, y))) {
            x--;
          }
          if (this.isWalkable(x, y)) {
            return { x, y };
          }
        }
        x--;
      }
      y--;
      x = this.width - 1;
    }

    return { x: startX, y: startY };
  }

  /**
   * Vim 'e' motion: Jump forward to end of current or next word
   */
  findWordEnd(startX, startY) {
    let x = startX;
    let y = startY;

    x++;
    if (x >= this.width) {
      x = 0;
      y++;
      if (y >= this.height) return { x: startX, y: startY };
    }

    while (y < this.height) {
      while (x < this.width) {
        if (this.isWordChar(x, y) || this.isPunctuation(x, y)) {
          const isWord = this.isWordChar(x, y);
          while (x + 1 < this.width && (isWord ? this.isWordChar(x + 1, y) : this.isPunctuation(x + 1, y))) {
            x++;
          }
          if (this.isWalkable(x, y)) {
            return { x, y };
          }
        }
        x++;
      }
      y++;
      x = 0;
    }

    return { x: startX, y: startY };
  }

  /**
   * Vim 'ge' motion: Jump backward to end of previous word
   */
  findPrevWordEnd(startX, startY) {
    let x = startX;
    let y = startY;

    const startIsWord = this.isWordChar(x, y);
    const startIsPunct = this.isPunctuation(x, y);

    // If starting on a token, rewind to before this token first
    if (startIsWord) {
      while (x >= 0 && this.isWordChar(x, y)) {
        x--;
      }
    } else if (startIsPunct) {
      while (x >= 0 && this.isPunctuation(x, y)) {
        x--;
      }
    } else {
      x--;
    }

    if (x < 0) {
      y--;
      if (y < 0) return { x: startX, y: startY };
      x = this.width - 1;
    }

    // Now rewind past whitespace/water until we find the end of the previous word/punctuation
    while (y >= 0) {
      while (x >= 0) {
        if (this.isWordChar(x, y) || this.isPunctuation(x, y)) {
          if (this.isWalkable(x, y)) {
            return { x, y };
          }
        }
        x--;
      }
      y--;
      x = this.width - 1;
    }

    return { x: startX, y: startY };
  }

  /**
   * Vim '0' and '^': Beginning of line / first non-blank
   */
  getLineStart(y, firstNonBlank = false) {
    if (y < 0 || y >= this.height) return 0;
    if (!firstNonBlank) {
      // Find the first walkable tile or 0
      for (let x = 0; x < this.width; x++) {
        if (this.isWalkable(x, y)) return x;
      }
      return 0;
    } else {
      for (let x = 0; x < this.width; x++) {
        const t = this.grid[y][x];
        if (t !== ' ' && this.isWalkable(x, y)) return x;
      }
      return 0;
    }
  }

  /**
   * Vim '$': End of line (last walkable tile on row)
   */
  getLineEnd(y) {
    if (y < 0 || y >= this.height) return this.width - 1;
    for (let x = this.width - 1; x >= 0; x--) {
      const t = this.grid[y][x];
      if (t !== ' ' && this.isWalkable(x, y)) {
        return x;
      }
    }
    return this.width - 1;
  }

  /**
   * Vim 'f' and 't': Find character in row
   */
  findCharInRow(startY, startX, targetChar, forward = true, till = false) {
    const step = forward ? 1 : -1;
    let x = startX + step;

    while (x >= 0 && x < this.width) {
      if (this.grid[startY][x] === targetChar) {
        const destX = till ? x - step : x;
        if (this.isWalkable(destX, startY)) {
          return { found: true, x: destX, y: startY };
        }
      }
      x += step;
    }
    return { found: false, x: startX, y: startY };
  }
}

  try { exports.TileType = TileType; } catch(e) {}
  try { exports.Tilemap = Tilemap; } catch(e) {}
});

/* Module: entities/player.js */
defineModule('entities/player.js', function(exports, require, module) {
/**
 * Player Entity (The Modal Hero)
 * Follows Vim cursor semantics with smooth sprite interpolation and column stickiness.
 */
class Player {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
    this.renderX = x;
    this.renderY = y;
    this.targetCol = x; // Sticky column for j/k
    this.direction = 'down'; // 'up', 'down', 'left', 'right'
    this.animFrame = 0;
    this.animTimer = 0;

    // Inventory
    this.inventory = {
      bronzeKey: 0,
      silverKey: 0,
      goldKey: 0,
      skullKey: 0,
      gems: 0,
    };

    // Unlocked Vim Keystrokes
    this.unlockedAbilities = new Set(['h', 'j', 'k', 'l']);
  }

  hasAbility(key) {
    return this.unlockedAbilities.has(key);
  }

  unlockAbility(key) {
    this.unlockedAbilities.add(key);
    if (key === 'b') {
      this.unlockedAbilities.add('ge');
    }
    if (key === '$') {
      this.unlockedAbilities.add('0');
      this.unlockedAbilities.add('^');
    }
    if (key === 'f') {
      this.unlockedAbilities.add('F');
      this.unlockedAbilities.add('t');
      this.unlockedAbilities.add('T');
      this.unlockedAbilities.add(';');
      this.unlockedAbilities.add(',');
    }
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
    this.renderX = x;
    this.renderY = y;
    this.targetCol = x;
  }

  moveTo(newX, newY, updateTargetCol = true) {
    if (newX > this.x) this.direction = 'right';
    else if (newX < this.x) this.direction = 'left';
    else if (newY > this.y) this.direction = 'down';
    else if (newY < this.y) this.direction = 'up';

    this.x = newX;
    this.y = newY;
    if (updateTargetCol) {
      this.targetCol = newX;
    }
  }

  update(deltaTime) {
    // Smooth visual interpolation towards logical grid tile
    const speed = 18; // interpolation rate
    this.renderX += (this.x - this.renderX) * Math.min(1, speed * deltaTime);
    this.renderY += (this.y - this.renderY) * Math.min(1, speed * deltaTime);

    // Idle breathing / walk animation
    this.animTimer += deltaTime;
    if (this.animTimer > 0.15) {
      this.animTimer = 0;
      this.animFrame = (this.animFrame + 1) % 4;
    }
  }
}

  try { exports.Player = Player; } catch(e) {}
});

/* Module: entities/world-objects.js */
defineModule('entities/world-objects.js', function(exports, require, module) {
/**
 * Interactive World Entities: NPCs, Chests, Keys, Doors, Gems, and Portals
 */

class NPC {
  constructor({ id, name, x, y, sprite = 'sage', dialogue = [], avatar = '🧙‍♂️', quest = null }) {
    this.id = id;
    this.name = name;
    this.x = x;
    this.y = y;
    this.sprite = sprite; // 'sage', 'sailor', 'monk', 'master'
    this.dialogue = dialogue; // Array of strings
    this.avatar = avatar;
    this.quest = quest;
    this.hasTalked = false;
    this.animTimer = 0;
    this.animFrame = 0;
  }

  update(deltaTime) {
    this.animTimer += deltaTime;
    if (this.animTimer > 0.3) {
      this.animTimer = 0;
      this.animFrame = (this.animFrame + 1) % 2;
    }
  }

  getDialogue(gameState) {
    if (this.quest && this.quest.check(gameState)) {
      return this.quest.completedDialogue;
    }
    return this.dialogue;
  }
}

class Chest {
  constructor({ id, x, y, rewardType, rewardValue, label = '' }) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.rewardType = rewardType; // 'ability' | 'key' | 'gem'
    this.rewardValue = rewardValue; // e.g. 'w', 'goldKey', 100
    this.label = label;
    this.isOpen = false;
    this.openAnim = 0; // 0 to 1
  }

  open() {
    if (this.isOpen) return null;
    this.isOpen = true;
    return {
      type: this.rewardType,
      value: this.rewardValue,
      label: this.label,
    };
  }

  update(deltaTime) {
    if (this.isOpen && this.openAnim < 1) {
      this.openAnim = Math.min(1, this.openAnim + deltaTime * 3);
    }
  }
}

class KeyItem {
  constructor({ id, x, y, keyType, name }) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.keyType = keyType; // 'bronzeKey', 'silverKey', 'goldKey', 'skullKey'
    this.name = name || 'Key';
    this.isCollected = false;
    this.bobTimer = Math.random() * Math.PI * 2;
  }

  collect() {
    if (this.isCollected) return false;
    this.isCollected = true;
    return true;
  }

  update(deltaTime) {
    this.bobTimer += deltaTime * 3;
  }
}

class Door {
  constructor({ id, x, y, keyRequired, orientation = 'horizontal', label = '' }) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.keyRequired = keyRequired; // 'bronzeKey', 'silverKey', 'goldKey', 'skullKey'
    this.orientation = orientation;
    this.label = label;
    this.isOpen = false;
    this.openAnim = 0;
  }

  canUnlock(inventory) {
    return (inventory[this.keyRequired] || 0) > 0;
  }

  unlock(inventory) {
    if (this.isOpen) return false;
    if (this.canUnlock(inventory)) {
      inventory[this.keyRequired]--;
      this.isOpen = true;
      return true;
    }
    return false;
  }

  update(deltaTime) {
    if (this.isOpen && this.openAnim < 1) {
      this.openAnim = Math.min(1, this.openAnim + deltaTime * 3);
    }
  }
}

class Gem {
  constructor({ id, x, y, value = 10, color = '#7dcfff' }) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.value = value;
    this.color = color;
    this.isCollected = false;
    this.bobTimer = Math.random() * Math.PI * 2;
  }

  collect() {
    if (this.isCollected) return 0;
    this.isCollected = true;
    return this.value;
  }

  update(deltaTime) {
    this.bobTimer += deltaTime * 4;
  }
}

class BracketPortal {
  constructor({ id, x, y, char, targetX, targetY, pairId }) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.char = char; // '(', ')', '[', ']', '{', '}'
    this.targetX = targetX;
    this.targetY = targetY;
    this.pairId = pairId;
    this.pulseTimer = 0;
  }

  update(deltaTime) {
    this.pulseTimer += deltaTime * 4;
  }
}

class Obstacle {
  constructor({ id, x, y, char = 'x', type = 'weed', hint = 'Cut with x' }) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.char = char;
    this.type = type; // 'weed', 'bug', 'glitch'
    this.hint = hint;
    this.isCleared = false;
  }

  clear() {
    if (this.isCleared) return false;
    this.isCleared = true;
    return true;
  }
}

class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  emit(x, y, count = 10, color = '#7aa2f7', speed = 60, size = 3) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = (Math.random() * 0.7 + 0.3) * speed;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        color,
        size: Math.random() * size + 1.5,
        life: 0,
        maxLife: Math.random() * 0.4 + 0.3,
      });
    }
  }

  update(deltaTime) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += deltaTime;
      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
        continue;
      }
      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;
      p.vy += 40 * deltaTime; // gravity
    }
  }

  render(ctx, tileSize) {
    for (const p of this.particles) {
      const alpha = Math.max(0, 1 - p.life / p.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x * tileSize, p.y * tileSize, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
}

  try { exports.NPC = NPC; } catch(e) {}
  try { exports.Chest = Chest; } catch(e) {}
  try { exports.KeyItem = KeyItem; } catch(e) {}
  try { exports.Door = Door; } catch(e) {}
  try { exports.Gem = Gem; } catch(e) {}
  try { exports.BracketPortal = BracketPortal; } catch(e) {}
  try { exports.Obstacle = Obstacle; } catch(e) {}
  try { exports.ParticleSystem = ParticleSystem; } catch(e) {}
});

/* Module: levels/level-data.js */
defineModule('levels/level-data.js', function(exports, require, module) {
/**
 * Vim Adventures Level Definitions & Curriculum
 * 5 Rich Handcrafted Chapters with Word Paths, NPCs, Keys, Doors, and Chests.
 */

const LEVELS = [
  // =========================================================================
  // CHAPTER 1: The Shoreline of Motion
  // Mechanics: h, j, k, l orthogonal navigation on character paths
  // =========================================================================
  {
    id: 1,
    name: "Chapter 1: Shoreline of Motion",
    subtitle: "Master the Sacred Cardinal Motions: h, j, k, l",
    width: 28,
    height: 16,
    playerStart: { x: 3, y: 3 },
    initialAbilities: ['h', 'j', 'k', 'l'],
    map: [
      "############################",
      "#.~~~~~~~~~~~~~~~~~~~~~~~~.#",
      "#.###~~~~~~~~~~~~~~~~~~###.#",
      "#.#Welcome to Vim Realm#.#.#",
      "#.#..........j.........#.#.#",
      "#.#..........j.........#.#.#",
      "#.###........j.......###.#.#",
      "#.~~#........j.......#~~~#.#",
      "#.~~#..hhhh..j.......#~~~#.#",
      "#.~~#..h.....j.......#~~~#.#",
      "#.~~#..h..lllllllll..=====.#",
      "#.~~#..h..........l..#~~~#.#",
      "#.###..h..........l..###.#.#",
      "#.#....hhhhhhhhhhhh....#.#.#",
      "#.#....................#.#.#",
      "############################"
    ],
    npcs: [
      {
        id: 'bram',
        name: 'Master Bram',
        x: 4,
        y: 3,
        avatar: '🧙‍♂️',
        dialogue: [
          "Greetings, brave traveler! Welcome to the Realm of Vim Adventures.",
          "In this realm, the cursor is your body and keystrokes are your power.",
          "Use 'h' (left), 'j' (down), 'k' (up), and 'l' (right) to walk the paths.",
          "Head down the trail and speak with Sailor Jack near the lighthouse!"
        ]
      },
      {
        id: 'jack',
        name: 'Sailor Jack',
        x: 18,
        y: 10,
        avatar: '⚓',
        dialogue: [
          "Ahoy! Beyond this gate lies the Word Archipelago, where normal walking fails.",
          "You will need a special leap power to cross the great sea.",
          "I dropped the Bronze Key by the southern trail. Grab it to open my gate!"
        ]
      }
    ],
    keys: [
      { id: 'k1', x: 7, y: 13, keyType: 'bronzeKey', name: 'Bronze Key' }
    ],
    doors: [
      { id: 'd1', x: 21, y: 10, keyRequired: 'bronzeKey', orientation: 'vertical', label: 'Shore Gate' }
    ],
    chests: [
      {
        id: 'c1',
        x: 24,
        y: 10,
        rewardType: 'ability',
        rewardValue: 'w',
        label: "Unlocked 'w' (Word Forward Leap)!"
      }
    ],
    gems: [
      { id: 'g1', x: 13, y: 4, value: 10 },
      { id: 'g2', x: 13, y: 7, value: 10 },
      { id: 'g3', x: 18, y: 13, value: 10 }
    ],
    portals: [],
    obstacles: [],
    exit: { x: 25, y: 10, targetLevel: 2 },
    objective: "Follow the path, find the Bronze Key, unlock the gate, and open the chest!"
  },

  // =========================================================================
  // CHAPTER 2: The Word Archipelago
  // Mechanics: w, b, e, ge jumping across water between word islands
  // =========================================================================
  {
    id: 2,
    name: "Chapter 2: The Word Archipelago",
    subtitle: "Leap Across Chasms with w, b, e, ge",
    width: 32,
    height: 18,
    playerStart: { x: 2, y: 2 },
    initialAbilities: ['h', 'j', 'k', 'l', 'w'],
    map: [
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~START~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~Jump~~~Across~~~The~~~Water~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~Never~~~Fall~~~Into~~~Ocean~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~Use~~~Word~~~Leap~~~To~~~Win~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~Backtrack~~~With~~~Key~~~b~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~End~~~Of~~~Word~~~Is~~~e~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~Silver~~~Key~~~Lies~~~Ahead~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~Sanctuary~~~Gate~~~Awaits~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~Exit~~~Portal~~~Ready~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
    ],
    npcs: [
      {
        id: 'islander',
        name: 'Island Castaway',
        x: 9,
        y: 2,
        avatar: '🏝️',
        dialogue: [
          "Look at the water! Walking with 'l' or 'j' into the ocean will stop you in your tracks.",
          "Press 'w' to jump across the water straight to the start of the next word!",
          "And when you find 'b' and 'e', you can jump backward or land on the end of words!"
        ]
      },
      {
        id: 'guardian',
        name: 'Archipelago Spirit',
        x: 13,
        y: 10,
        avatar: '🧞',
        dialogue: [
          "The 'e' key lands on the END of words, while 'w' lands on the START.",
          "Use both to reach the secluded treasure islands!"
        ]
      }
    ],
    keys: [
      { id: 'k2', x: 25, y: 12, keyType: 'silverKey', name: 'Silver Key' }
    ],
    doors: [
      { id: 'd2', x: 14, y: 14, keyRequired: 'silverKey', orientation: 'horizontal', label: 'Archipelago Gate' }
    ],
    chests: [
      {
        id: 'c2',
        x: 22,
        y: 6,
        rewardType: 'ability',
        rewardValue: 'e',
        label: "Unlocked 'e' (Forward to End of Word)!"
      },
      {
        id: 'c3',
        x: 21,
        y: 8,
        rewardType: 'ability',
        rewardValue: 'b',
        label: "Unlocked 'b' (Backward Word Jump)!"
      }
    ],
    gems: [
      { id: 'g4', x: 18, y: 2, value: 20 },
      { id: 'g5', x: 24, y: 2, value: 20 },
      { id: 'g6', x: 10, y: 4, value: 20 },
      { id: 'g7', x: 17, y: 4, value: 20 },
      { id: 'g8', x: 7, y: 8, value: 20 }
    ],
    portals: [],
    obstacles: [],
    exit: { x: 10, y: 16, targetLevel: 3 },
    objective: "Use 'w' and 'e' to leap across words, collect the Silver Key, and open the gate!"
  },

  // =========================================================================
  // CHAPTER 3: The Line Canyon & The Temple of Find
  // Mechanics: 0, $, ^ and f, F, t, T, ; (inline find search)
  // =========================================================================
  {
    id: 3,
    name: "Chapter 3: The Temple of Find",
    subtitle: "Command the Line with 0, $, and inline search f/t",
    width: 36,
    height: 18,
    playerStart: { x: 2, y: 2 },
    initialAbilities: ['h', 'j', 'k', 'l', 'w', 'b', 'e', 'ge'],
    map: [
      "####################################",
      "#..................................#",
      "# const start = explore_canyon();  #",
      "#..................................#",
      "# let speed = instant_line_jump;   #",
      "#..................................#",
      "# find_treasure_with_f_target;     #",
      "#..................................#",
      "# type_f_then_z_to_reach_z_portal; #",
      "#..................................#",
      "# press_dollar_to_hit_line_end;    #",
      "#..................................#",
      "# press_zero_to_snap_back_home;    #",
      "#..................................#",
      "# unlock_gate_with_golden_key;     #",
      "#..................................#",
      "# enter_crypt_portal_below;        #",
      "####################################"
    ],
    npcs: [
      {
        id: 'findley',
        name: 'Master Findley',
        x: 28,
        y: 2,
        avatar: '🧙‍♂️',
        dialogue: [
          "Greetings! Why crawl character by character when you can fly?",
          "Press '$' to zip directly to the end of a line!",
          "Press '0' or '^' to snap to the beginning!",
          "And best of all: press 'f' followed by any letter to instantly teleport to it on the line!"
        ]
      }
    ],
    keys: [
      { id: 'k3', x: 28, y: 14, keyType: 'goldKey', name: 'Gold Key' }
    ],
    doors: [
      { id: 'd3', x: 18, y: 16, keyRequired: 'goldKey', orientation: 'vertical', label: 'Temple Gate' }
    ],
    chests: [
      {
        id: 'c4',
        x: 31,
        y: 4,
        rewardType: 'ability',
        rewardValue: '$',
        label: "Unlocked '$' & '0' (Line Boundaries)!"
      },
      {
        id: 'c5',
        x: 27,
        y: 6,
        rewardType: 'ability',
        rewardValue: 'f',
        label: "Unlocked 'f' & ';' (Find Character Forward)!"
      }
    ],
    gems: [
      { id: 'g9', x: 12, y: 4, value: 30 },
      { id: 'g10', x: 25, y: 8, value: 30 },
      { id: 'g11', x: 16, y: 10, value: 30 },
      { id: 'g12', x: 10, y: 12, value: 30 }
    ],
    portals: [],
    obstacles: [],
    exit: { x: 26, y: 16, targetLevel: 4 },
    objective: "Master 'f<char>', '$', and '0' to navigate the canyon and seize the Gold Key!"
  },

  // =========================================================================
  // CHAPTER 4: The Crypt of Matching Brackets
  // Mechanics: % bracket matching jumps between (, ), [, ], {, }
  // =========================================================================
  {
    id: 4,
    name: "Chapter 4: Crypt of Matching Brackets",
    subtitle: "Warp Between Code Chasms with %",
    width: 32,
    height: 18,
    playerStart: { x: 3, y: 3 },
    initialAbilities: ['h', 'j', 'k', 'l', 'w', 'b', 'e', 'ge', '0', '$', '^', 'f', 'F', 't', 'T', ';', '%'],
    map: [
      "################################",
      "# ( Chamber Alpha ) ~~~~~~~~~~ #",
      "# ................. ~~~~~~~~~~ #",
      "# ( ............. ) ~~~~~~~~~~ #",
      "################### ~~~~~~~~~~ #",
      "~~~~~~~~~~~~~~~~~~~ ~~~~~~~~~~ #",
      "# [ Chamber Beta  ] ~~~~~~~~~~ #",
      "# ................. ~~~~~~~~~~ #",
      "# [ ............. ] ~~~~~~~~~~ #",
      "################### ~~~~~~~~~~ #",
      "~~~~~~~~~~~~~~~~~~~ ~~~~~~~~~~ #",
      "# { Chamber Gamma } ~~~~~~~~~~ #",
      "# ................. ~~~~~~~~~~ #",
      "# { ............. } ~~~~~~~~~~ #",
      "###################. ~~~~~~~~~ #",
      "# Skull Key Altar Awaits Exit  #",
      "# ............................ #",
      "################################"
    ],
    npcs: [
      {
        id: 'monk',
        name: 'Bracket Monk',
        x: 10,
        y: 3,
        avatar: '📿',
        dialogue: [
          "The walls here are impenetrable to normal footsteps.",
          "Stand upon any bracket '(', ')', '[', ']', '{', or '}' and press '%'!",
          "The power of '%' will instantly transport your spirit to its matching partner!"
        ]
      }
    ],
    keys: [
      { id: 'k4', x: 16, y: 15, keyType: 'skullKey', name: 'Skull Key' }
    ],
    doors: [
      { id: 'd4', x: 24, y: 15, keyRequired: 'skullKey', orientation: 'vertical', label: 'Crypt Seal' }
    ],
    chests: [
      {
        id: 'c6',
        x: 17,
        y: 8,
        rewardType: 'gem',
        rewardValue: 100,
        label: "Crypt Treasury: 100 Gems!"
      }
    ],
    gems: [
      { id: 'g13', x: 6, y: 1, value: 50 },
      { id: 'g14', x: 15, y: 1, value: 50 },
      { id: 'g15', x: 10, y: 7, value: 50 }
    ],
    portals: [
      // Bracket teleporters: step on one, press %, warp to the other!
      { id: 'bp1', x: 2, y: 3, char: '(', targetX: 18, targetY: 3, pairId: 'p1' },
      { id: 'bp2', x: 18, y: 3, char: ')', targetX: 2, targetY: 3, pairId: 'p1' },
      { id: 'bp3', x: 2, y: 8, char: '[', targetX: 18, targetY: 8, pairId: 'p2' },
      { id: 'bp4', x: 18, y: 8, char: ']', targetX: 2, targetY: 8, pairId: 'p2' },
      { id: 'bp5', x: 2, y: 13, char: '{', targetX: 18, targetY: 13, pairId: 'p3' },
      { id: 'bp6', x: 18, y: 13, char: '}', targetX: 2, targetY: 13, pairId: 'p3' },
    ],
    obstacles: [],
    exit: { x: 29, y: 15, targetLevel: 5 },
    objective: "Navigate the nested chambers using '%' bracket matching to retrieve the Skull Key!"
  },

  // =========================================================================
  // CHAPTER 5: The Grand Citadel of the Vim Master
  // Mechanics: x (delete bug/weed), r (replace character), counts (3w, 2j)
  // =========================================================================
  {
    id: 5,
    name: "Chapter 5: Citadel of Enlightenment",
    subtitle: "Manipulate the World with x, r, Counts, and Claim the Trophy!",
    width: 32,
    height: 18,
    playerStart: { x: 3, y: 3 },
    initialAbilities: ['h', 'j', 'k', 'l', 'w', 'b', 'e', 'ge', '0', '$', '^', 'f', 'F', 't', 'T', ';', '%', 'x', 'r'],
    map: [
      "################################",
      "# Sanctuary of Neovim Mastery  #",
      "# ............................ #",
      "# Clear weeds with x keystroke #",
      "# ............................ #",
      "# Path: ==x==x==x==x==x==.==== #",
      "# ............................ #",
      "# = ~~~ Repair gap with r= ~~~ #",
      "# ====================~======= #",
      "# ~~~~~~~~~~~~~~~~~~~~~~~~~~ = #",
      "# ............................ #",
      "# ............................ #",
      "# Dais of Bram Moolenaar Ahead #",
      "# ............................ #",
      "# ............................ #",
      "################################",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
      "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
    ],
    npcs: [
      {
        id: 'zen_master',
        name: 'Grandmaster Bram',
        x: 14,
        y: 13,
        avatar: '🏆',
        dialogue: [
          "Congratulations, disciple of the modal arts!",
          "You have traversed the Shorelines of motion, leapt the Word Archipelago,",
          "commanded the Lines with '0' and '$', danced across Brackets with '%',",
          "and reshaped reality with 'x' and 'r'!",
          "You are now a true Vim Grandmaster! The Golden Cup of Mastery is yours!"
        ]
      }
    ],
    keys: [],
    doors: [],
    chests: [
      {
        id: 'c7',
        x: 27,
        y: 8,
        rewardType: 'gem',
        rewardValue: 250,
        label: "Master's Bounty: 250 Gems!"
      }
    ],
    gems: [
      { id: 'g16', x: 5, y: 5, value: 50 },
      { id: 'g17', x: 10, y: 5, value: 50 },
      { id: 'g18', x: 15, y: 5, value: 50 },
      { id: 'g19', x: 20, y: 5, value: 50 }
    ],
    portals: [],
    obstacles: [
      { id: 'obs1', x: 10, y: 5, char: 'x', type: 'weed', hint: 'Cut with x' },
      { id: 'obs2', x: 13, y: 5, char: 'x', type: 'weed', hint: 'Cut with x' },
      { id: 'obs3', x: 16, y: 5, char: 'x', type: 'weed', hint: 'Cut with x' },
      { id: 'obs4', x: 19, y: 5, char: 'x', type: 'weed', hint: 'Cut with x' },
      { id: 'obs5', x: 22, y: 5, char: 'x', type: 'weed', hint: 'Cut with x' }
    ],
    exit: { x: 14, y: 13, isVictory: true },
    objective: "Clear the obstacles with 'x', repair the bridge with 'r=', reach Grandmaster Bram and win!"
  }
];

  try { exports.LEVELS = LEVELS; } catch(e) {}
});

/* Module: ui/dialogue.js */
defineModule('ui/dialogue.js', function(exports, require, module) {
/**
 * Retro RPG Dialogue System with Typewriter Effect and Audio Blips
 */

class DialogueSystem {
  constructor(audio) {
    this.audio = audio;
    this.container = document.getElementById('dialog-box');
    this.avatarEl = document.getElementById('dialog-avatar');
    this.speakerEl = document.getElementById('dialog-speaker');
    this.textEl = document.getElementById('dialog-text');

    this.isOpen = false;
    this.lines = [];
    this.currentLineIdx = 0;
    this.currentSpeaker = '';
    this.currentAvatar = '🧙‍♂️';
    this.onCompleteCallback = null;

    this.typewriterTimer = null;
    this.isTyping = false;
    this.targetText = '';
  }

  start(speaker, avatar, lines, onComplete = null) {
    if (!this.container) return;
    this.isOpen = true;
    this.speaker = speaker;
    this.avatar = avatar;
    this.lines = Array.isArray(lines) ? lines : [lines];
    this.currentLineIdx = 0;
    this.onCompleteCallback = onComplete;

    this.speakerEl.textContent = speaker;
    this.avatarEl.textContent = avatar;
    this.container.classList.add('active');

    this.showCurrentLine();
  }

  showCurrentLine() {
    if (this.currentLineIdx >= this.lines.length) {
      this.close();
      return;
    }

    this.targetText = this.lines[this.currentLineIdx];
    this.textEl.textContent = '';
    this.isTyping = true;
    let charIdx = 0;

    if (this.typewriterTimer) clearInterval(this.typewriterTimer);

    this.typewriterTimer = setInterval(() => {
      if (charIdx < this.targetText.length) {
        this.textEl.textContent += this.targetText[charIdx];
        if (charIdx % 2 === 0 && this.audio) {
          this.audio.playDialogueBeep();
        }
        charIdx++;
      } else {
        clearInterval(this.typewriterTimer);
        this.typewriterTimer = null;
        this.isTyping = false;
      }
    }, 22);
  }

  advance() {
    if (!this.isOpen) return;

    if (this.isTyping) {
      // Instantly finish typing current line
      if (this.typewriterTimer) {
        clearInterval(this.typewriterTimer);
        this.typewriterTimer = null;
      }
      this.textEl.textContent = this.targetText;
      this.isTyping = false;
    } else {
      // Advance to next line
      this.currentLineIdx++;
      if (this.currentLineIdx < this.lines.length) {
        this.showCurrentLine();
      } else {
        this.close();
      }
    }
  }

  close() {
    if (!this.isOpen) return;
    if (this.typewriterTimer) {
      clearInterval(this.typewriterTimer);
      this.typewriterTimer = null;
    }
    this.isOpen = false;
    if (this.container) {
      this.container.classList.remove('active');
    }
    if (this.onCompleteCallback) {
      const cb = this.onCompleteCallback;
      this.onCompleteCallback = null;
      cb();
    }
  }
}

  try { exports.DialogueSystem = DialogueSystem; } catch(e) {}
});

/* Module: ui/hud.js */
defineModule('ui/hud.js', function(exports, require, module) {
/**
 * Heads-Up Display (HUD) and Modal Windows Manager
 */

class HUD {
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

  try { exports.HUD = HUD; } catch(e) {}
});

/* Module: engine/renderer.js */
defineModule('engine/renderer.js', function(exports, require, module) {
/**
 * 2D Retro Canvas Renderer for Vim Adventures
 * Handles animated water, pixel-art tiles, word paths, dynamic lighting,
 * smooth camera tracking, particle effects, and floating HUD notifications.
 */

// Safe fallback for browsers or environments without native CanvasRenderingContext2D.roundRect
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h) {
    this.rect(x, y, w, h);
    return this;
  };
}

class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.tileSize = 40; // 40x40 pixel grid for rich detail

    this.camera = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      shake: 0,
    };

    this.floatingTexts = [];
    this.time = 0;

    // Handle high DPI displays
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
    this.displayWidth = rect.width;
    this.displayHeight = rect.height;
  }

  addFloatingText(text, x, y, color = '#ffc777') {
    this.floatingTexts.push({
      text,
      x,
      y,
      color,
      life: 0,
      maxLife: 1.2,
    });
  }

  screenShake(amount = 6) {
    this.camera.shake = amount;
  }

  update(deltaTime) {
    this.time += deltaTime;

    // Camera screen shake decay
    if (this.camera.shake > 0) {
      this.camera.shake = Math.max(0, this.camera.shake - deltaTime * 20);
    }

    // Update floating texts
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.life += deltaTime;
      ft.y -= deltaTime * 0.8; // float upward
      if (ft.life >= ft.maxLife) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  render(tilemap, player, entities = {}, particles = null) {
    const ctx = this.ctx;
    const ts = this.tileSize;

    // Smooth camera tracking player
    const targetCamX = player.renderX * ts + ts / 2 - this.displayWidth / 2;
    const targetCamY = player.renderY * ts + ts / 2 - this.displayHeight / 2;
    this.camera.x += (targetCamX - this.camera.x) * 0.15;
    this.camera.y += (targetCamY - this.camera.y) * 0.15;

    let offsetX = -this.camera.x;
    let offsetY = -this.camera.y;

    if (this.camera.shake > 0) {
      offsetX += (Math.random() - 0.5) * this.camera.shake * 2;
      offsetY += (Math.random() - 0.5) * this.camera.shake * 2;
    }

    // Clear background (Deep ocean void)
    ctx.save();
    ctx.fillStyle = '#0f111a';
    ctx.fillRect(0, 0, this.displayWidth, this.displayHeight);

    ctx.translate(Math.round(offsetX), Math.round(offsetY));

    // Render Tilemap
    this.renderTiles(ctx, tilemap);

    // Render Portals / Brackets
    if (entities.portals) {
      this.renderPortals(ctx, entities.portals);
    }

    // Render Obstacles
    if (entities.obstacles) {
      this.renderObstacles(ctx, entities.obstacles);
    }

    // Render Doors
    if (entities.doors) {
      this.renderDoors(ctx, entities.doors);
    }

    // Render Chests
    if (entities.chests) {
      this.renderChests(ctx, entities.chests);
    }

    // Render Keys & Gems
    if (entities.gems) {
      this.renderGems(ctx, entities.gems);
    }
    if (entities.keys) {
      this.renderKeys(ctx, entities.keys);
    }

    // Render NPCs
    if (entities.npcs) {
      this.renderNPCs(ctx, entities.npcs);
    }

    // Render Particles
    if (particles) {
      particles.render(ctx, ts);
    }

    // Render Player
    this.renderPlayer(ctx, player);

    // Render Floating Texts
    this.renderFloatingTexts(ctx);

    ctx.restore();
  }

  renderTiles(ctx, tilemap) {
    const ts = this.tileSize;
    const t = this.time;

    for (let y = 0; y < tilemap.height; y++) {
      for (let x = 0; x < tilemap.width; x++) {
        const char = tilemap.getTile(x, y);
        const px = x * ts;
        const py = y * ts;

        // Skip void
        if (char === ' ') continue;

        if (char === '~') {
          // Animated Water
          ctx.fillStyle = '#1e3a5f';
          ctx.fillRect(px, py, ts, ts);

          // Shimmer wave
          const wave = Math.sin(t * 3 + x * 0.8 + y * 0.5);
          ctx.fillStyle = wave > 0.3 ? '#255085' : '#1b3456';
          ctx.fillRect(px + 4, py + ts / 2 + wave * 4, ts - 8, 3);
          continue;
        }

        if (char === '#') {
          // Wall / Stone brick
          ctx.fillStyle = '#292e42';
          ctx.fillRect(px, py, ts, ts);
          ctx.fillStyle = '#3b4261';
          ctx.fillRect(px, py, ts, 3); // top highlight
          ctx.fillStyle = '#1a1b26';
          ctx.fillRect(px, py + ts - 3, ts, 3); // shadow
          // Brick seam
          ctx.fillStyle = '#16161e';
          ctx.fillRect(px + ts / 2, py + 3, 2, ts - 6);
          continue;
        }

        if (char === '.') {
          // Lush Grass
          ctx.fillStyle = '#1d3b2c';
          ctx.fillRect(px, py, ts, ts);
          // Tiny grass blades
          ctx.fillStyle = '#2d5a44';
          ctx.fillRect(px + 8, py + 12, 3, 6);
          ctx.fillRect(px + 24, py + 20, 3, 6);
          continue;
        }

        if (char === '=') {
          // Cobblestone Path
          ctx.fillStyle = '#363b54';
          ctx.fillRect(px, py, ts, ts);
          ctx.fillStyle = '#414868';
          ctx.strokeRect(px + 2, py + 2, ts - 4, ts - 4);
          continue;
        }

        // Letter / Word Tile on the ground
        // Character tile backdrop (parchment/stone look)
        ctx.fillStyle = '#24283b';
        ctx.beginPath();
        ctx.roundRect(px + 2, py + 2, ts - 4, ts - 4, 6);
        ctx.fill();

        ctx.strokeStyle = '#414868';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Monospace letter
        ctx.font = 'bold 20px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (/[a-zA-Z0-9]/.test(char)) {
          ctx.fillStyle = '#c0caf5';
        } else {
          // Punctuation / Special
          ctx.fillStyle = '#7dcfff';
        }
        ctx.fillText(char, px + ts / 2, py + ts / 2 + 1);
      }
    }
  }

  renderPortals(ctx, portals) {
    const ts = this.tileSize;
    const t = this.time;

    for (const p of portals) {
      const px = p.x * ts;
      const py = p.y * ts;

      // Glowing aura for matching bracket portals
      const glow = Math.sin(t * 5 + p.pulseTimer) * 0.3 + 0.7;
      ctx.save();
      ctx.fillStyle = `rgba(187, 154, 247, ${glow * 0.35})`;
      ctx.beginPath();
      ctx.arc(px + ts / 2, py + ts / 2, ts * 0.65, 0, Math.PI * 2);
      ctx.fill();

      // Bracket badge
      ctx.fillStyle = '#1a1b26';
      ctx.beginPath();
      ctx.roundRect(px + 4, py + 4, ts - 8, ts - 8, 8);
      ctx.fill();
      ctx.strokeStyle = '#bb9af7';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.font = 'bold 22px monospace';
      ctx.fillStyle = '#bb9af7';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.char, px + ts / 2, py + ts / 2);
      ctx.restore();
    }
  }

  renderObstacles(ctx, obstacles) {
    const ts = this.tileSize;
    for (const obs of obstacles) {
      if (obs.isCleared) continue;
      const px = obs.x * ts;
      const py = obs.y * ts;

      // Weed / glitch tile
      ctx.save();
      ctx.fillStyle = '#742a3a';
      ctx.beginPath();
      ctx.roundRect(px + 4, py + 4, ts - 8, ts - 8, 6);
      ctx.fill();

      ctx.font = '20px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🌿', px + ts / 2, py + ts / 2);
      ctx.restore();
    }
  }

  renderDoors(ctx, doors) {
    const ts = this.tileSize;
    for (const d of doors) {
      const px = d.x * ts;
      const py = d.y * ts;

      if (d.isOpen) {
        // Open door frame
        ctx.fillStyle = '#16161e';
        ctx.fillRect(px + 4, py + 4, ts - 8, ts - 8);
        ctx.strokeStyle = '#7aa2f7';
        ctx.strokeRect(px + 4, py + 4, ts - 8, ts - 8);
      } else {
        // Locked Gate
        ctx.fillStyle = '#414868';
        ctx.fillRect(px + 2, py + 2, ts - 4, ts - 4);

        // Iron bars
        ctx.fillStyle = '#24283b';
        ctx.fillRect(px + 8, py + 4, 4, ts - 8);
        ctx.fillRect(px + 18, py + 4, 4, ts - 8);
        ctx.fillRect(px + 28, py + 4, 4, ts - 8);

        // Padlock icon
        ctx.font = '16px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🔒', px + ts / 2, py + ts / 2);
      }
    }
  }

  renderChests(ctx, chests) {
    const ts = this.tileSize;
    for (const c of chests) {
      const px = c.x * ts;
      const py = c.y * ts;

      ctx.save();
      if (c.isOpen) {
        // Open chest with golden ray
        ctx.fillStyle = 'rgba(255, 199, 119, 0.3)';
        ctx.beginPath();
        ctx.moveTo(px + ts / 2, py + ts / 2);
        ctx.lineTo(px - 10, py - 30);
        ctx.lineTo(px + ts + 10, py - 30);
        ctx.closePath();
        ctx.fill();

        ctx.font = '24px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('📦', px + ts / 2, py + ts / 2);
      } else {
        // Closed treasure chest
        ctx.font = '26px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🎁', px + ts / 2, py + ts / 2);
      }
      ctx.restore();
    }
  }

  renderKeys(ctx, keys) {
    const ts = this.tileSize;
    for (const k of keys) {
      if (k.isCollected) continue;
      const px = k.x * ts;
      const py = k.y * ts + Math.sin(k.bobTimer) * 4;

      ctx.save();
      // Glow aura
      ctx.fillStyle = 'rgba(255, 199, 119, 0.4)';
      ctx.beginPath();
      ctx.arc(px + ts / 2, py + ts / 2, 16, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '22px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🗝️', px + ts / 2, py + ts / 2);
      ctx.restore();
    }
  }

  renderGems(ctx, gems) {
    const ts = this.tileSize;
    for (const g of gems) {
      if (g.isCollected) continue;
      const px = g.x * ts;
      const py = g.y * ts + Math.sin(g.bobTimer) * 3;

      ctx.save();
      ctx.font = '18px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('💎', px + ts / 2, py + ts / 2);
      ctx.restore();
    }
  }

  renderNPCs(ctx, npcs) {
    const ts = this.tileSize;
    for (const npc of npcs) {
      const px = npc.x * ts;
      const py = npc.y * ts;

      ctx.save();
      // NPC sprite
      ctx.font = '26px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(npc.avatar || '🧙‍♂️', px + ts / 2, py + ts / 2);

      // Speech bubble notification if not talked
      if (!npc.hasTalked) {
        ctx.fillStyle = '#ff9e64';
        ctx.beginPath();
        ctx.arc(px + ts - 6, py + 6, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#1a1b26';
        ctx.font = 'bold 9px monospace';
        ctx.fillText('!', px + ts - 6, py + 9);
      }
      ctx.restore();
    }
  }

  renderPlayer(ctx, player) {
    const ts = this.tileSize;
    const px = player.renderX * ts;
    const py = player.renderY * ts;

    ctx.save();

    // Vim Block Cursor Aura underneath
    const auraGlow = Math.sin(this.time * 6) * 0.2 + 0.5;
    ctx.fillStyle = `rgba(122, 162, 247, ${auraGlow * 0.5})`;
    ctx.beginPath();
    ctx.roundRect(px + 4, py + 4, ts - 8, ts - 8, 4);
    ctx.fill();

    // Directional facing character
    const isMoving = Math.abs(player.renderX - player.x) > 0.05 || Math.abs(player.renderY - player.y) > 0.05;
    const bounce = isMoving ? Math.sin(this.time * 16) * 3 : Math.sin(this.time * 3) * 1.5;

    // Knight Sprite Body
    ctx.font = '26px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🧙', px + ts / 2, py + ts / 2 + bounce);

    // Direction indicator eye/arrow
    ctx.fillStyle = '#7dcfff';
    ctx.beginPath();
    if (player.direction === 'right') {
      ctx.arc(px + ts / 2 + 10, py + ts / 2, 3, 0, Math.PI * 2);
    } else if (player.direction === 'left') {
      ctx.arc(px + ts / 2 - 10, py + ts / 2, 3, 0, Math.PI * 2);
    } else if (player.direction === 'up') {
      ctx.arc(px + ts / 2, py + ts / 2 - 10, 3, 0, Math.PI * 2);
    } else {
      ctx.arc(px + ts / 2, py + ts / 2 + 12, 3, 0, Math.PI * 2);
    }
    ctx.fill();

    ctx.restore();
  }

  renderFloatingTexts(ctx) {
    const ts = this.tileSize;
    for (const ft of this.floatingTexts) {
      const alpha = Math.max(0, 1 - ft.life / ft.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.font = 'bold 13px "JetBrains Mono", monospace';
      ctx.fillStyle = ft.color;
      ctx.textAlign = 'center';
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 4;
      ctx.fillText(ft.text, ft.x * ts + ts / 2, ft.y * ts);
      ctx.restore();
    }
  }
}

  try { exports.Renderer = Renderer; } catch(e) {}
});

/* Module: engine/input.js */
defineModule('engine/input.js', function(exports, require, module) {
/**
 * Vim Input Parser and Keybinding Engine
 * Supports single-key motions, counts (e.g. 3w), multi-key prefixes (f, F, t, T, r, ge),
 * repeat commands (; and ,), and dialogue / UI controls.
 */

class InputHandler {
  constructor(game) {
    this.game = game;
    this.countBuffer = '';
    this.pendingPrefix = null; // 'f', 'F', 't', 'T', 'r', 'g'
    this.lastFind = null; // { type: 'f'|'F'|'t'|'T', target: 'x' }

    this.setupListeners();
  }

  setupListeners() {
    window.addEventListener('keydown', (e) => this.handleKeyDown(e));

    // Support on-screen retro buttons
    document.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const action = btn.getAttribute('data-action');
        this.handleAction(action);
      });
    });
  }

  resetBuffer() {
    this.countBuffer = '';
    this.pendingPrefix = null;
    this.updateHUD();
  }

  updateHUD() {
    let display = '';
    if (this.countBuffer) display += this.countBuffer;
    if (this.pendingPrefix) display += this.pendingPrefix;
    this.game.hud.setCommandPending(display || '-- NORMAL --');
  }

  handleAction(action) {
    if (action.startsWith('key:')) {
      const key = action.replace('key:', '');
      this.processVimKey(key);
    } else if (action === 'dialogue-next') {
      if (this.game.dialogue.isOpen) {
        this.game.dialogue.advance();
      }
    } else if (action === 'restart') {
      this.game.restartLevel();
    } else if (action === 'help') {
      this.game.hud.openHelp();
    } else if (action === 'mute') {
      this.game.audio.toggleMute();
    }
  }

  handleKeyDown(e) {
    // Prevent default scrolling on game keys
    const preventKeys = ['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (preventKeys.includes(e.code)) {
      e.preventDefault();
    }

    // Modal / Dialogue priority handling
    if (this.game.dialogue.isOpen) {
      if (e.key === 'Escape') {
        this.game.dialogue.close();
        return;
      }
      if (e.key === ' ' || e.key === 'Enter') {
        this.game.dialogue.advance();
        return;
      }
      // Ignore other keys while dialogue is active
      return;
    }

    if (e.key === 'Escape') {
      this.resetBuffer();
      this.game.hud.closeHelp();
      this.game.hud.closeVictory();
      return;
    }

    // Interacting with adjacent or current NPC using Space or Enter
    if (e.key === ' ' || e.key === 'Enter') {
      const px = this.game.player.x;
      const py = this.game.player.y;
      const npc = this.game.entities.npcs.find(n => Math.abs(n.x - px) + Math.abs(n.y - py) <= 1);
      if (npc) {
        this.game.triggerNPC(npc);
        return;
      }
    }

    if (e.key === '?') {
      this.game.hud.openHelp();
      return;
    }

    if (e.key === 'm' || e.key === 'M') {
      const isMuted = this.game.audio.toggleMute();
      this.game.renderer.addFloatingText(isMuted ? 'Muted 🔇' : 'Sound On 🔊', this.game.player.x, this.game.player.y);
      return;
    }

    if (e.key === 'R' && !this.pendingPrefix) {
      this.game.restartLevel();
      return;
    }

    if (e.key === 'u' && !this.pendingPrefix) {
      this.game.undo();
      return;
    }

    // Ignore modifier keys like Shift, Control, Alt
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(e.key)) {
      return;
    }

    this.processVimKey(e.key);
  }

  processVimKey(key) {
    // 1. Handling Pending Prefix (e.g., waiting for target character after f, F, t, T, r)
    if (this.pendingPrefix) {
      const prefix = this.pendingPrefix;
      this.pendingPrefix = null;

      if (prefix === 'g') {
        if (key === 'e') {
          this.executeMotion('ge');
        } else {
          this.game.audio.playError();
        }
        this.resetBuffer();
        return;
      }

      if (prefix === 'r') {
        this.executeReplace(key);
        this.resetBuffer();
        return;
      }

      if (['f', 'F', 't', 'T'].includes(prefix)) {
        this.lastFind = { type: prefix, target: key };
        this.executeFind(prefix, key);
        this.resetBuffer();
        return;
      }
    }

    // 2. Handling Counts (1-9, or 0 if countBuffer already has digits)
    if (/[1-9]/.test(key) || (key === '0' && this.countBuffer.length > 0)) {
      this.countBuffer += key;
      this.updateHUD();
      return;
    }

    // 3. Handling '0' (Beginning of line)
    if (key === '0' && this.countBuffer.length === 0) {
      this.executeMotion('0');
      this.resetBuffer();
      return;
    }

    // 4. Handling Multi-key Initiation
    if (['f', 'F', 't', 'T', 'r', 'g'].includes(key)) {
      this.pendingPrefix = key;
      this.updateHUD();
      return;
    }

    // 5. Handling Repeat Find (; and ,)
    if (key === ';') {
      if (this.lastFind) {
        this.executeFind(this.lastFind.type, this.lastFind.target);
      } else {
        this.game.audio.playError();
      }
      this.resetBuffer();
      return;
    }

    if (key === ',') {
      if (this.lastFind) {
        // Reverse direction
        const revMap = { f: 'F', F: 'f', t: 'T', T: 't' };
        this.executeFind(revMap[this.lastFind.type], this.lastFind.target);
      } else {
        this.game.audio.playError();
      }
      this.resetBuffer();
      return;
    }

    // 6. Handling Single-Key Motions & Operators
    this.executeMotion(key);
    this.resetBuffer();
  }

  getCount() {
    const c = parseInt(this.countBuffer, 10);
    return isNaN(c) || c <= 0 ? 1 : Math.min(c, 99);
  }

  executeMotion(motionKey) {
    const count = this.getCount();
    this.game.handleMotion(motionKey, count);
  }

  executeFind(type, targetChar) {
    const count = this.getCount();
    this.game.handleFind(type, targetChar, count);
  }

  executeReplace(char) {
    this.game.handleReplace(char);
  }
}

  try { exports.InputHandler = InputHandler; } catch(e) {}
});

/* Module: engine/game.js */
defineModule('engine/game.js', function(exports, require, module) {
/**
 * Core Vim Adventures Game Controller
 * Manages game loop, levels, entities, physics, audio, and state machine.
 */

const { Tilemap } = require('./tilemap.js');
const { Player } = require('../entities/player.js');
const { SoundFX } = require('./audio.js');
const { Renderer } = require('./renderer.js');
const { InputHandler } = require('./input.js');
const { DialogueSystem } = require('../ui/dialogue.js');
const { HUD } = require('../ui/hud.js');
const { NPC,
  Chest,
  KeyItem,
  Door,
  Gem,
  BracketPortal,
  Obstacle,
  ParticleSystem } = require('../entities/world-objects.js');
const { LEVELS } = require('../levels/level-data.js');

class Game {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.audio = new SoundFX();
    this.renderer = new Renderer(this.canvas);
    this.hud = new HUD();
    this.dialogue = new DialogueSystem(this.audio);
    this.particles = new ParticleSystem();
    this.input = new InputHandler(this);

    this.currentLevelIndex = 0;
    this.currentLevel = null;
    this.tilemap = null;
    this.player = null;

    this.entities = {
      npcs: [],
      chests: [],
      keys: [],
      doors: [],
      gems: [],
      portals: [],
      obstacles: [],
    };

    this.historyStack = [];
    this.totalMoves = 0;
    this.startTime = Date.now();
    this.lastFrameTime = performance.now();

    this.setupUI();
    this.loadLevel(0);
    this.startLoop();
  }

  setupUI() {
    const levelSelect = document.getElementById('level-select');
    if (levelSelect) {
      levelSelect.innerHTML = '';
      LEVELS.forEach((lvl, idx) => {
        const opt = document.createElement('option');
        opt.value = idx;
        opt.textContent = lvl.name;
        levelSelect.appendChild(opt);
      });
      levelSelect.addEventListener('change', (e) => {
        this.loadLevel(parseInt(e.target.value, 10));
      });
    }

    const btnRestart = document.getElementById('btn-restart');
    if (btnRestart) {
      btnRestart.addEventListener('click', () => this.restartLevel());
    }

    const btnHelp = document.getElementById('btn-help');
    if (btnHelp) {
      btnHelp.addEventListener('click', () => this.hud.openHelp());
    }

    const btnCloseHelp = document.getElementById('btn-close-help');
    if (btnCloseHelp) {
      btnCloseHelp.addEventListener('click', () => this.hud.closeHelp());
    }

    const btnCloseVictory = document.getElementById('btn-close-victory');
    if (btnCloseVictory) {
      btnCloseVictory.addEventListener('click', () => {
        this.hud.closeVictory();
        this.loadLevel(0);
      });
    }

    const btnAudio = document.getElementById('btn-audio');
    if (btnAudio) {
      btnAudio.addEventListener('click', () => {
        const muted = this.audio.toggleMute();
        btnAudio.textContent = muted ? '🔇 Sound' : '🔊 Sound';
      });
    }

    // Touch / Click D-Pad bindings
    document.querySelectorAll('[data-key]').forEach(el => {
      el.addEventListener('click', () => {
        const key = el.getAttribute('data-key');
        if (key) {
          this.input.processVimKey(key);
        }
      });
    });
  }

  loadLevel(index) {
    if (index < 0 || index >= LEVELS.length) return;
    this.currentLevelIndex = index;
    const data = LEVELS[index];
    this.currentLevel = data;

    // Build Tilemap
    this.tilemap = new Tilemap(data.width, data.height, data.map);

    // Build Player
    this.player = new Player(data.playerStart.x, data.playerStart.y);
    if (data.initialAbilities) {
      data.initialAbilities.forEach(ab => this.player.unlockAbility(ab));
    }

    // Build World Entities
    this.entities.npcs = (data.npcs || []).map(d => new NPC(d));
    this.entities.chests = (data.chests || []).map(d => new Chest(d));
    this.entities.keys = (data.keys || []).map(d => new KeyItem(d));
    this.entities.doors = (data.doors || []).map(d => new Door(d));
    this.entities.gems = (data.gems || []).map(d => new Gem(d));
    this.entities.portals = (data.portals || []).map(d => new BracketPortal(d));
    this.entities.obstacles = (data.obstacles || []).map(d => new Obstacle(d));

    this.historyStack = [];

    // Sync HUD
    this.hud.setLevelInfo(data.name, data.objective);
    this.hud.updateInventory(this.player.inventory);
    this.hud.updateAbilities(this.player.unlockedAbilities);

    const levelSelect = document.getElementById('level-select');
    if (levelSelect) {
      levelSelect.value = index;
    }

    // Play warp sound on level start
    this.audio.playWarp();
    this.renderer.addFloatingText(`Entered ${data.name}!`, this.player.x, this.player.y, '#7aa2f7');

    // Auto-trigger first NPC if adjacent
    this.checkNPCAutoTrigger();
  }

  restartLevel() {
    this.loadLevel(this.currentLevelIndex);
  }

  checkNPCAutoTrigger() {
    for (const npc of this.entities.npcs) {
      const dist = Math.abs(npc.x - this.player.x) + Math.abs(npc.y - this.player.y);
      if (dist <= 1 && !npc.hasTalked) {
        setTimeout(() => {
          this.triggerNPC(npc);
        }, 300);
        break;
      }
    }
  }

  triggerNPC(npc) {
    npc.hasTalked = true;
    const lines = npc.getDialogue({ inventory: this.player.inventory });
    this.dialogue.start(npc.name, npc.avatar, lines);
  }

  recordHistory() {
    this.historyStack.push({
      player: { x: this.player.x, y: this.player.y, direction: this.player.direction },
      inventory: { ...this.player.inventory },
      abilities: new Set(this.player.unlockedAbilities),
      tilemap: this.tilemap.grid.map(row => [...row]),
      obstacles: this.entities.obstacles.map(o => ({ id: o.id, isCleared: o.isCleared }))
    });
    if (this.historyStack.length > 50) {
      this.historyStack.shift();
    }
  }

  undo() {
    if (this.historyStack.length === 0) {
      this.audio.playError();
      this.renderer.addFloatingText('Already at oldest change', this.player.x, this.player.y);
      return;
    }

    const state = this.historyStack.pop();
    this.player.setPosition(state.player.x, state.player.y);
    this.player.direction = state.player.direction;
    this.player.inventory = { ...state.inventory };
    this.player.unlockedAbilities = new Set(state.abilities);

    if (state.tilemap) {
      this.tilemap.grid = state.tilemap.map(row => [...row]);
    }
    if (state.obstacles) {
      state.obstacles.forEach(saved => {
        const obs = this.entities.obstacles.find(o => o.id === saved.id);
        if (obs) obs.isCleared = saved.isCleared;
      });
    }

    this.hud.updateInventory(this.player.inventory);
    this.hud.updateAbilities(this.player.unlockedAbilities);
    this.audio.playBump();
    this.renderer.addFloatingText('Undo (u)', this.player.x, this.player.y, '#e0af68');
  }

  handleMotion(motionKey, count = 1) {
    // Check if hero has ability unlocked
    if (!this.player.hasAbility(motionKey)) {
      this.audio.playError();
      this.renderer.screenShake(4);
      this.renderer.addFloatingText(`Key '${motionKey}' is locked!`, this.player.x, this.player.y, '#f7768e');
      return;
    }

    this.recordHistory();

    for (let c = 0; c < count; c++) {
      let destX = this.player.x;
      let destY = this.player.y;
      let motionSound = 'step';

      switch (motionKey) {
        case 'h':
          destX -= 1;
          break;
        case 'l':
          destX += 1;
          break;
        case 'k':
          destY -= 1;
          break;
        case 'j':
          destY += 1;
          break;
        case 'w': {
          const pt = this.tilemap.findNextWord(this.player.x, this.player.y);
          destX = pt.x;
          destY = pt.y;
          motionSound = 'jump';
          break;
        }
        case 'b': {
          const pt = this.tilemap.findPrevWord(this.player.x, this.player.y);
          destX = pt.x;
          destY = pt.y;
          motionSound = 'jump';
          break;
        }
        case 'e': {
          const pt = this.tilemap.findWordEnd(this.player.x, this.player.y);
          destX = pt.x;
          destY = pt.y;
          motionSound = 'jump';
          break;
        }
        case 'ge': {
          const pt = this.tilemap.findPrevWordEnd(this.player.x, this.player.y);
          destX = pt.x;
          destY = pt.y;
          motionSound = 'jump';
          break;
        }
        case '0':
          destX = this.tilemap.getLineStart(this.player.y, false);
          motionSound = 'jump';
          break;
        case '^':
          destX = this.tilemap.getLineStart(this.player.y, true);
          motionSound = 'jump';
          break;
        case '$':
          destX = this.tilemap.getLineEnd(this.player.y);
          motionSound = 'jump';
          break;
        case '%':
          this.handleBracketJump();
          return;
        case 'x':
          this.handleCutObstacle();
          return;
        default:
          return;
      }

      // Check collision
      if (!this.canMoveTo(destX, destY)) {
        this.audio.playBump();
        this.renderer.screenShake(4);
        this.renderer.addFloatingText('Bump!', destX, destY, '#f7768e');
        break;
      } else {
        this.player.moveTo(destX, destY);
        this.totalMoves++;

        if (motionSound === 'jump') {
          this.audio.playJump();
          this.particles.emit(this.player.x, this.player.y, 6, '#7dcfff', 40, 2);
        } else {
          this.audio.playStep();
        }

        this.checkInteractions();
      }
    }
  }

  handleFind(type, targetChar, count = 1) {
    if (!this.player.hasAbility('f')) {
      this.audio.playError();
      this.renderer.addFloatingText("Key 'f' is locked!", this.player.x, this.player.y, '#f7768e');
      return;
    }

    this.recordHistory();
    const forward = type === 'f' || type === 't';
    const till = type === 't' || type === 'T';

    let currX = this.player.x;
    let found = false;

    for (let c = 0; c < count; c++) {
      const res = this.tilemap.findCharInRow(this.player.y, currX, targetChar, forward, till);
      if (res.found && this.canMoveTo(res.x, res.y)) {
        currX = res.x;
        found = true;
      } else {
        break;
      }
    }

    if (found) {
      this.player.moveTo(currX, this.player.y);
      this.totalMoves++;
      this.audio.playJump();
      this.particles.emit(this.player.x, this.player.y, 8, '#ff9e64', 50, 3);
      this.renderer.addFloatingText(`Jumped to '${targetChar}'`, this.player.x, this.player.y);
      this.checkInteractions();
    } else {
      this.audio.playError();
      this.renderer.screenShake(3);
      this.renderer.addFloatingText(`'${targetChar}' not found`, this.player.x, this.player.y, '#f7768e');
    }
  }

  handleBracketJump() {
    // Check if player is on a portal bracket
    const portal = this.entities.portals.find(p => p.x === this.player.x && p.y === this.player.y);
    if (portal) {
      this.player.setPosition(portal.targetX, portal.targetY);
      this.audio.playWarp();
      this.particles.emit(this.player.x, this.player.y, 16, '#bb9af7', 80, 4);
      this.renderer.addFloatingText(`Warped to '${portal.char}' pair!`, this.player.x, this.player.y, '#bb9af7');
      this.checkInteractions();
      return;
    }

    // Check if standing on a bracket character on the tilemap
    const char = this.tilemap.getTile(this.player.x, this.player.y);
    const pairs = { '(': ')', ')': '(', '[': ']', ']': '[', '{': '}', '}': '{' };
    const matchingChar = pairs[char];

    if (!matchingChar) {
      this.audio.playError();
      this.renderer.addFloatingText("Stand on a bracket: ( ) [ ] { }", this.player.x, this.player.y, '#f7768e');
      return;
    }

    // Search on current line for matching bracket
    const forward = ['(', '[', '{'].includes(char);
    const res = this.tilemap.findCharInRow(this.player.y, this.player.x, matchingChar, forward, false);

    if (res.found && this.canMoveTo(res.x, res.y)) {
      this.player.moveTo(res.x, res.y);
      this.audio.playWarp();
      this.particles.emit(this.player.x, this.player.y, 16, '#bb9af7', 80, 4);
      this.renderer.addFloatingText(`Matched ${char} ➔ ${matchingChar}`, this.player.x, this.player.y, '#bb9af7');
      this.checkInteractions();
    } else {
      this.audio.playError();
      this.renderer.addFloatingText("No matching bracket in line", this.player.x, this.player.y, '#f7768e');
    }
  }

  handleCutObstacle() {
    if (!this.player.hasAbility('x')) {
      this.audio.playError();
      this.renderer.addFloatingText("Key 'x' is locked!", this.player.x, this.player.y, '#f7768e');
      return;
    }

    // Check if standing on or facing obstacle
    const obstacle = this.entities.obstacles.find(o => !o.isCleared && (
      (o.x === this.player.x && o.y === this.player.y) ||
      (this.player.direction === 'right' && o.x === this.player.x + 1 && o.y === this.player.y) ||
      (this.player.direction === 'left' && o.x === this.player.x - 1 && o.y === this.player.y) ||
      (this.player.direction === 'down' && o.x === this.player.x && o.y === this.player.y + 1) ||
      (this.player.direction === 'up' && o.x === this.player.x && o.y === this.player.y - 1)
    ));

    if (obstacle) {
      this.recordHistory();
      obstacle.clear();
      this.tilemap.setTile(obstacle.x, obstacle.y, '='); // turn into path
      this.audio.playSlash();
      this.particles.emit(obstacle.x, obstacle.y, 14, '#9ece6a', 70, 3);
      this.renderer.addFloatingText('Cut with x!', obstacle.x, obstacle.y, '#9ece6a');
      this.checkInteractions();
    } else {
      this.audio.playError();
      this.renderer.addFloatingText('Nothing to cut with x here', this.player.x, this.player.y, '#f7768e');
    }
  }

  handleReplace(char) {
    if (!this.player.hasAbility('r')) {
      this.audio.playError();
      this.renderer.addFloatingText("Key 'r' is locked!", this.player.x, this.player.y, '#f7768e');
      return;
    }

    let targetX = this.player.x;
    let targetY = this.player.y;

    // Check if player is facing a gap or water in front, or standing on a replaceable tile
    const currentTile = this.tilemap.getTile(targetX, targetY);
    if (currentTile === '=' || currentTile === char) {
      let frontX = targetX;
      let frontY = targetY;
      if (this.player.direction === 'right') frontX++;
      else if (this.player.direction === 'left') frontX--;
      else if (this.player.direction === 'down') frontY++;
      else if (this.player.direction === 'up') frontY--;

      if (this.tilemap.inBounds(frontX, frontY) && this.tilemap.getTile(frontX, frontY) !== '#') {
        targetX = frontX;
        targetY = frontY;
      }
    }

    if (this.tilemap.getTile(targetX, targetY) === '#') {
      this.audio.playError();
      this.renderer.addFloatingText("Stone walls cannot be replaced", targetX, targetY, '#f7768e');
      return;
    }

    this.recordHistory();
    this.tilemap.setTile(targetX, targetY, char);
    this.audio.playRepair();
    this.particles.emit(targetX, targetY, 15, '#7dcfff', 60, 3);
    this.renderer.addFloatingText(`Replaced with '${char}'!`, targetX, targetY, '#7dcfff');
  }

  canMoveTo(x, y) {
    // 1. Check closed doors first
    const door = this.entities.doors.find(d => d.x === x && d.y === y && !d.isOpen);
    if (door) {
      if (door.canUnlock(this.player.inventory)) {
        door.unlock(this.player.inventory);
        this.tilemap.setTile(x, y, '=');
        this.audio.playDoorOpen();
        this.particles.emit(x, y, 16, '#ffc777', 60, 4);
        this.renderer.addFloatingText(`${door.label} Unlocked!`, x, y, '#ffc777');
        this.hud.updateInventory(this.player.inventory);
        return true;
      } else {
        this.audio.playError();
        this.renderer.screenShake(3);
        this.renderer.addFloatingText(`Need ${door.keyRequired}!`, x, y, '#f7768e');
        return false;
      }
    }

    // 2. Check general tile walkability
    if (!this.tilemap.isWalkable(x, y)) {
      return false;
    }

    // 3. Check obstacles
    const obs = this.entities.obstacles.find(o => o.x === x && o.y === y && !o.isCleared);
    if (obs) {
      return false;
    }

    return true;
  }

  checkInteractions() {
    const px = this.player.x;
    const py = this.player.y;

    // 1. Keys Pickup
    for (const key of this.entities.keys) {
      if (!key.isCollected && key.x === px && key.y === py) {
        key.collect();
        this.player.inventory[key.keyType] = (this.player.inventory[key.keyType] || 0) + 1;
        this.audio.playKeyPickup();
        this.particles.emit(px, py, 15, '#ffc777', 60, 4);
        this.renderer.addFloatingText(`Found ${key.name}! 🗝️`, px, py, '#ffc777');
        this.hud.updateInventory(this.player.inventory);
      }
    }

    // 2. Gems Pickup
    for (const gem of this.entities.gems) {
      if (!gem.isCollected && gem.x === px && gem.y === py) {
        const val = gem.collect();
        this.player.inventory.gems += val;
        this.audio.playKeyPickup();
        this.particles.emit(px, py, 10, gem.color, 50, 3);
        this.renderer.addFloatingText(`+${val} Gems 💎`, px, py, gem.color);
        this.hud.updateInventory(this.player.inventory);
      }
    }

    // 3. Chests (Trigger if standing on or adjacent)
    for (const chest of this.entities.chests) {
      if (!chest.isOpen) {
        const dist = Math.abs(chest.x - px) + Math.abs(chest.y - py);
        if (dist === 0 || dist === 1) {
          const reward = chest.open();
          if (reward) {
            this.audio.playChestOpen();
            this.particles.emit(chest.x, chest.y, 25, '#ffc777', 90, 5);
            if (reward.type === 'ability') {
              this.player.unlockAbility(reward.value);
              this.hud.updateAbilities(this.player.unlockedAbilities, reward.value);
              this.renderer.addFloatingText(reward.label, chest.x, chest.y - 1, '#7dcfff');
              this.dialogue.start('Treasure Chest', '🎁', [
                reward.label,
                `You have mastered a new Vim motion! Check the ribbon below.`
              ]);
            } else if (reward.type === 'gem') {
              this.player.inventory.gems += reward.value;
              this.hud.updateInventory(this.player.inventory);
              this.renderer.addFloatingText(reward.label, chest.x, chest.y - 1, '#ffc777');
            }
          }
        }
      }
    }

    // 4. NPCs (Speak if adjacent or on same tile)
    for (const npc of this.entities.npcs) {
      const dist = Math.abs(npc.x - px) + Math.abs(npc.y - py);
      if (dist <= 1 && !npc.hasTalked) {
        this.triggerNPC(npc);
      }
    }

    // 5. Level Exit
    const exit = this.currentLevel.exit;
    if (exit && exit.x === px && exit.y === py) {
      if (exit.isVictory) {
        this.triggerVictory();
      } else if (exit.targetLevel) {
        this.loadLevel(exit.targetLevel - 1);
      }
    }
  }

  triggerVictory() {
    this.audio.playChestOpen();
    this.particles.emit(this.player.x, this.player.y, 40, '#ffd700', 120, 6);

    const elapsedSeconds = Math.floor((Date.now() - this.startTime) / 1000);
    const mins = Math.floor(elapsedSeconds / 60);
    const secs = (elapsedSeconds % 60).toString().padStart(2, '0');

    this.hud.openVictory({
      moves: this.totalMoves,
      gems: this.player.inventory.gems,
      time: `${mins}:${secs}`,
    });
  }

  startLoop() {
    const loop = (now) => {
      const deltaTime = Math.min(0.1, (now - this.lastFrameTime) / 1000);
      this.lastFrameTime = now;

      this.update(deltaTime);
      this.render();

      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  update(deltaTime) {
    if (this.player) {
      this.player.update(deltaTime);
    }
    this.renderer.update(deltaTime);
    this.particles.update(deltaTime);

    // Update entity animations
    for (const list of Object.values(this.entities)) {
      for (const item of list) {
        if (item && typeof item.update === 'function') {
          item.update(deltaTime);
        }
      }
    }
  }

  render() {
    if (!this.tilemap || !this.player) return;
    this.renderer.render(this.tilemap, this.player, this.entities, this.particles);
  }
}

// Auto bootstrap when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  window.adventureGame = new Game();
});

  try { exports.Game = Game; } catch(e) {}
});

  // Start the application
  requireModule('', 'engine/game.js');
})();
