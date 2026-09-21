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

  /**
   * Check if a row has any walkable tiles
   */
  hasWalkableTile(y) {
    if (y < 0 || y >= this.height) return false;
    for (let x = 0; x < this.width; x++) {
      if (this.isWalkable(x, y)) return true;
    }
    return false;
  }

  /**
   * Check if a row has primary path tiles ('=')
   */
  hasPathTile(y) {
    if (y < 0 || y >= this.height) return false;
    for (let x = 0; x < this.width; x++) {
      if (this.grid[y][x] === '=') return true;
    }
    return false;
  }

  /**
   * Top walkable row (for 'gg' default)
   */
  getTopWalkableRow() {
    let firstWalkable = -1;
    for (let y = 0; y < this.height; y++) {
      if (this.hasWalkableTile(y)) {
        if (firstWalkable === -1) firstWalkable = y;
        if (this.hasPathTile(y)) {
          return y;
        }
      } else if (firstWalkable !== -1) {
        return firstWalkable;
      }
    }
    return firstWalkable !== -1 ? firstWalkable : 0;
  }

  /**
   * Bottom walkable row (for 'G' default)
   */
  getBottomWalkableRow() {
    let lastWalkable = -1;
    for (let y = this.height - 1; y >= 0; y--) {
      if (this.hasWalkableTile(y)) {
        if (lastWalkable === -1) lastWalkable = y;
        if (this.hasPathTile(y)) {
          return y;
        }
      } else if (lastWalkable !== -1) {
        return lastWalkable;
      }
    }
    return lastWalkable !== -1 ? lastWalkable : this.height - 1;
  }

  /**
   * Find nearest row with walkable tiles
   */
  findNearestWalkableRow(startY) {
    if (startY <= 0) return this.getTopWalkableRow();
    if (startY >= this.height - 1) return this.getBottomWalkableRow();

    for (let d = 1; d < this.height; d++) {
      const up = startY - d;
      const down = startY + d;
      if (down < this.height && this.hasWalkableTile(down)) return down;
      if (up >= 0 && this.hasWalkableTile(up)) return up;
    }
    return Math.max(0, Math.min(this.height - 1, startY));
  }

  /**
   * Vim 'gg' and 'G': Jump to line number
   */
  jumpToLine(targetY, preferredX = 0, defaultDirection = 'top') {
    let y;
    if (targetY === null || targetY === undefined) {
      y = defaultDirection === 'top' ? this.getTopWalkableRow() : this.getBottomWalkableRow();
    } else {
      let candidate = Math.max(0, Math.min(this.height - 1, targetY));
      if (!this.hasWalkableTile(candidate)) {
        candidate = candidate <= 0
          ? this.getTopWalkableRow()
          : (candidate >= this.height - 1 ? this.getBottomWalkableRow() : this.findNearestWalkableRow(candidate));
      }
      y = candidate;
    }

    if (this.isWalkable(preferredX, y)) {
      return { x: preferredX, y };
    }
    for (let offset = 1; offset < this.width; offset++) {
      if (preferredX + offset < this.width && this.isWalkable(preferredX + offset, y)) {
        return { x: preferredX + offset, y };
      }
      if (preferredX - offset >= 0 && this.isWalkable(preferredX - offset, y)) {
        return { x: preferredX - offset, y };
      }
    }
    for (let x = 0; x < this.width; x++) {
      if (this.isWalkable(x, y)) return { x, y };
    }
    return { x: preferredX, y };
  }

  /**
   * Vim '{' and '}': Paragraph leaps across empty/separator rows
   */
  findParagraphJump(startX, startY, forward = true) {
    const hasCode = (r) => {
      if (r < 0 || r >= this.height) return false;
      return this.grid[r].some((ch, c) => this.isWalkable(c, r) && /[a-zA-Z0-9_=]/.test(ch));
    };

    let y = startY;
    const step = forward ? 1 : -1;
    let sawSeparator = false;

    while (y + step >= 0 && y + step < this.height) {
      y += step;
      const codeRow = hasCode(y);
      if (!codeRow) {
        sawSeparator = true;
      } else if (sawSeparator && codeRow) {
        // Landed on next block!
        return this.jumpToLine(y, startX);
      }
    }

    // Hit map boundary
    return this.jumpToLine(y, startX);
  }

  /**
   * Get word token at (x, y)
   */
  getWordAt(x, y) {
    if (!this.inBounds(x, y) || !this.isWordChar(x, y)) return '';
    let sx = x;
    while (sx > 0 && this.isWordChar(sx - 1, y)) sx--;
    let ex = x;
    while (ex + 1 < this.width && this.isWordChar(ex + 1, y)) ex++;
    let word = '';
    for (let i = sx; i <= ex; i++) word += this.grid[y][i];
    return word;
  }

  /**
   * Vim '*': Search forward for next occurrence of word under cursor
   */
  findMatchingToken(startX, startY) {
    let token = this.getWordAt(startX, startY);
    let tokenOriginX = startX;
    if (!token) {
      // Check adjacent tiles for token
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const t = this.getWordAt(startX + dx, startY + dy);
        if (t && t.length >= 2) {
          token = t;
          tokenOriginX = startX + dx;
          break;
        }
      }
    }

    if (!token || token.length < 2) {
      return { found: false, x: startX, y: startY, token: null };
    }

    // Scan forward from after current token
    let y = startY;
    let x = startX + 1;

    for (let loop = 0; loop < 2; loop++) {
      while (y < this.height) {
        const rowStr = this.grid[y].join('');
        let searchIndex = x;
        while (searchIndex < this.width) {
          const matchIdx = rowStr.indexOf(token, searchIndex);
          if (matchIdx === -1) break;

          // Found match! Check if it's a distinct location
          if (y !== startY || matchIdx !== tokenOriginX) {
            if (this.isWalkable(matchIdx, y)) {
              return { found: true, x: matchIdx, y, token };
            }
          }
          searchIndex = matchIdx + token.length;
        }
        y++;
        x = 0;
      }
      // Wrap to start of grid
      y = 0;
      x = 0;
    }

    return { found: false, x: startX, y: startY, token };
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
      rubyKey: 0,
      emeraldKey: 0,
      diamondKey: 0,
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
      this.unlockedAbilities.add(';');
    }
    if (key === 't') {
      this.unlockedAbilities.add('T');
      this.unlockedAbilities.add(';');
    }
    if (key === 'F') {
      this.unlockedAbilities.add('T');
      this.unlockedAbilities.add(',');
    }
    if (key === '0') {
      this.unlockedAbilities.add('^');
    }
    if (key === 'gg') {
      this.unlockedAbilities.add('G');
    }
    if (key === 'G') {
      this.unlockedAbilities.add('gg');
    }
    if (key === '{') {
      this.unlockedAbilities.add('}');
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
  constructor({ id, name, x, y, sprite = 'sage', dialogue = [], avatar = '🧙‍♂️', quest = null, dialogueFn = null }) {
    this.id = id;
    this.name = name;
    this.x = x;
    this.y = y;
    this.sprite = sprite; // 'sage', 'sailor', 'monk', 'master'
    this.dialogue = dialogue; // Array of strings
    this.dialogueFn = dialogueFn;
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
    if (typeof this.dialogueFn === 'function') {
      const res = this.dialogueFn(gameState);
      if (res) return res;
    }
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
 * 15 Grand Handcrafted Chapters mapped to the 30-Day Dojo Curriculum.
 * Users play both the 2D Adventure RPG and the 30-Day Buffer Dojo to achieve complete Neovim mastery!
 */

const LEVELS = [
  // =========================================================================
  // CHAPTER 1: Shoreline of Motion [Dojo Days 1-2]
  // Mechanics: h, j, k, l orthogonal navigation on character paths
  // =========================================================================
  {
    id: 1,
    name: "Chapter 1: Shoreline of Motion",
    subtitle: "Master the Sacred Cardinal Motions: h, j, k, l [Dojo Days 1-2]",
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
  // CHAPTER 2: The Word Archipelago [Dojo Day 3]
  // Mechanics: w, b, e, ge jumping across water between word islands
  // =========================================================================
  {
    id: 2,
    name: "Chapter 2: The Word Archipelago",
    subtitle: "Leap Across Chasms with w, b, e, ge [Dojo Day 3]",
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
      { id: 'k2', x: 2, y: 8, keyType: 'silverKey', name: 'Silver Key' }
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
        label: "Unlocked 'b' & 'ge' (Backward Word Jumps)!"
      }
    ],
    gems: [
      { id: 'g4', x: 18, y: 2, value: 20 },
      { id: 'g5', x: 24, y: 2, value: 20 },
      { id: 'g6', x: 10, y: 4, value: 20 },
      { id: 'g7', x: 17, y: 4, value: 20 },
      { id: 'g8', x: 14, y: 8, value: 20 }
    ],
    portals: [],
    obstacles: [],
    exit: { x: 10, y: 16, targetLevel: 3 },
    objective: "Leap forward to unlock 'e' and 'b', backtrack with 'b' to seize the Silver Key, then unlock the gate!"
  },

  // =========================================================================
  // CHAPTER 3: The Line Canyon [Dojo Day 3]
  // Mechanics: 0, $, ^ instant line boundary jumps across canyon ledges
  // =========================================================================
  {
    id: 3,
    name: "Chapter 3: The Line Canyon",
    subtitle: "Command Line Boundaries with 0, $, and ^ [Dojo Day 3]",
    width: 36,
    height: 12,
    playerStart: { x: 2, y: 2 },
    initialAbilities: ['h', 'j', 'k', 'l', 'w', 'b', 'e', 'ge'],
    map: [
      "####################################",
      "# Cliff Base: Warden's Perch ~~~~~ #",
      "# ..Cliff_Warden~~~~~~~~~~~~~~~~~~ #",
      "#.##################################",
      "#...Ledge_Alpha:==================$#",
      "#.##################################",
      "#...Ledge_Beta:=================Key#",
      "#.##################################",
      "#...Cliff_Sanctuary:====Gate====Exit",
      "#.##################################",
      "#..................................#",
      "####################################"
    ],
    npcs: [
      {
        id: 'warden',
        name: 'Cliff Warden',
        x: 6,
        y: 2,
        avatar: '🧗',
        dialogue: [
          "Greetings, traveler! These suspension bridges span bottomless chasms.",
          "Never crawl 30 steps with 'l' or 'h' across a long ledge!",
          "Press '$' to zip straight to the far end of the line in one instant.",
          "Press '0' or '^' to snap back to the cliff base stairway instantly!"
        ]
      }
    ],
    keys: [
      { id: 'k3', x: 34, y: 6, keyType: 'goldKey', name: 'Gold Key' }
    ],
    doors: [
      { id: 'd3', x: 24, y: 8, keyRequired: 'goldKey', orientation: 'vertical', label: 'Cliff Gate' }
    ],
    chests: [
      {
        id: 'c4',
        x: 34,
        y: 4,
        rewardType: 'ability',
        rewardValue: '$',
        label: "Unlocked '$' & '0' (Line Boundaries)!"
      }
    ],
    gems: [
      { id: 'g9', x: 18, y: 4, value: 30 },
      { id: 'g10', x: 18, y: 6, value: 30 },
      { id: 'g11', x: 18, y: 8, value: 30 }
    ],
    portals: [],
    obstacles: [],
    exit: { x: 35, y: 8, targetLevel: 4 },
    objective: "Use '$' to zip across ledges for the chest and Gold Key, snap back with '0', and unlock the gate!"
  },

  // =========================================================================
  // CHAPTER 4: The Caverns of Till & Reverse Seek [Dojo Day 5]
  // Mechanics: Inline seeking with f, t, F, T, ;, and ,
  // =========================================================================
  {
    id: 4,
    name: "Chapter 4: Caverns of Till & Reverse Seek",
    subtitle: "Precision Inline Seeking with f, t, F, T, ;, and , [Dojo Day 5]",
    width: 34,
    height: 12,
    playerStart: { x: 2, y: 2 },
    initialAbilities: ['h', 'j', 'k', 'l', 'w', 'b', 'e', 'ge', '0', '$', '^'],
    map: [
      "##################################",
      "# Magma Caverns: Seekers Vault   #",
      "# ..Hermit........c1.............#",
      "#.################################",
      "#...a~~~b~~~c~~~d~~~e~~~c2.......#",
      "#.################################",
      "#...bridge===c3~~~~~~magma_pit~~~#",
      "#.################################",
      "#...s~~~t~~~o~~~n~~~e~~~Key......#",
      "#.################################",
      "#...Cavern_Gate=============Exit.#",
      "##################################"
    ],
    npcs: [
      {
        id: 'hermit',
        name: 'Cavern Hermit',
        x: 4,
        y: 2,
        avatar: '🧔',
        dialogue: [
          "Beware the magma pits! Walking with normal steps will burn your feet.",
          "Use 'f{char}' to leap forward across stepping stones over the lava.",
          "Use 't~' (Till) to stop safely 1 tile before a hazard pit!",
          "Use 'F{char}' and ',' to reverse your search and leap backward to safety."
        ]
      }
    ],
    keys: [
      { id: 'k4_bronze', x: 24, y: 8, keyType: 'bronzeKey', name: 'Bronze Key' }
    ],
    doors: [
      { id: 'd4_cavern', x: 15, y: 10, keyRequired: 'bronzeKey', orientation: 'vertical', label: 'Cavern Gate' }
    ],
    chests: [
      {
        id: 'c4_find',
        x: 18,
        y: 2,
        rewardType: 'ability',
        rewardValue: 'f',
        label: "Unlocked 'f' & ';' (Find Character Forward)!"
      },
      {
        id: 'c4_till',
        x: 24,
        y: 4,
        rewardType: 'ability',
        rewardValue: 't',
        label: "Unlocked 't' & 'T' (Till Before Target)!"
      },
      {
        id: 'c4_rev',
        x: 12,
        y: 6,
        rewardType: 'ability',
        rewardValue: 'F',
        label: "Unlocked 'F' & ',' (Reverse Inline Find)!"
      }
    ],
    gems: [
      { id: 'g4_1', x: 12, y: 4, value: 30 },
      { id: 'g4_2', x: 12, y: 8, value: 30 },
      { id: 'g4_3', x: 20, y: 8, value: 30 }
    ],
    portals: [],
    obstacles: [],
    exit: { x: 28, y: 10, targetLevel: 5 },
    objective: "Master 'f' across magma stepping stones, use 't' before hazards, grab the Bronze Key, and advance!"
  },

  // =========================================================================
  // CHAPTER 5: The Tower of Vertical Ascents [Dojo Day 6]
  // Mechanics: gg (top of buffer), G (bottom of buffer), and line counts
  // =========================================================================
  {
    id: 5,
    name: "Chapter 5: Tower of Vertical Ascents",
    subtitle: "Command Buffer Boundaries with gg, G, and Line Jumps [Dojo Day 6]",
    width: 32,
    height: 20,
    playerStart: { x: 3, y: 17 },
    initialAbilities: ['h', 'j', 'k', 'l', 'w', 'b', 'e', 'ge', '0', '$', '^', 'f', 'F', 't', 'T', ';', ','],
    map: [
      "################################",
      "# Spire Battlement Top Floor   #",
      "# ============================ #",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "# Balcony 4: Air currents blow #",
      "# ============================ #",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "# Balcony 3: High observatory  #",
      "# ============================ #",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "# Balcony 2: Library archives  #",
      "# ============================ #",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "# Balcony 1: Armory chambers   #",
      "# ============================ #",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "# Dungeon Vault: Ground Floor  #",
      "# ============================ #",
      "# Golden Key lies in dungeon   #",
      "################################"
    ],
    npcs: [
      {
        id: 'abbot',
        name: 'High Abbot',
        x: 5,
        y: 17,
        avatar: '🧙‍♂️',
        dialogue: [
          "Welcome to the Tower of Vertical Ascents! 🗼",
          "Climbing twenty flights of stairs one by one is for mortals.",
          "Vim monks press 'gg' to fly directly to the top spire in a single instant! And 'G' plunges you back to the dungeon floor.",
          "PATH TO NEXT STAGE (CHAPTER 6):",
          "1. Open the ability chest ahead at (15, 17) to unlock 'gg' and 'G'.",
          "2. Retrieve the Tower Gold Key at the far right of this dungeon floor (26, 17).",
          "3. Type 'gg' to fly directly up to the Spire Battlement at the top of the tower!",
          "4. Unlock the Spire Gate at (24, 2) with your Gold Key to reach the Chapter 6 exit stairs at (28, 2)!",
          "Tip: You can also use line counts like '8G' to land on balconies and claim bonus gems!"
        ],
        dialogueFn(state) {
          const hasGG = state.player?.hasAbility('gg');
          const hasKey = (state.inventory?.goldKey || 0) > 0;
          const door = state.entities?.doors?.find(d => d.id === 'd5_spire');
          const isDoorOpen = door?.isOpen;

          if (isDoorOpen) {
            return [
              "The Spire Gate is unlocked! 🌟",
              "Walk right to (28, 2) and step through the glowing staircase portal to enter Chapter 6!"
            ];
          }
          if (hasKey && hasGG) {
            return [
              "You have both 'gg' and the Tower Gold Key! 🗝️",
              "Press 'gg' now to fly straight up to the Spire Battlement (row 2).",
              "Then walk right to unlock the Spire Gate at (24, 2) and exit to Chapter 6!"
            ];
          }
          if (hasGG && !hasKey) {
            return [
              "You have unlocked 'gg' and 'G'!",
              "Next step: Head to the far right of this dungeon floor to grab the Tower Gold Key at (26, 17)!",
              "Once you have the key, press 'gg' to soar to the Spire Battlement."
            ];
          }
          if (!hasGG && hasKey) {
            return [
              "You found the Tower Gold Key! 🗝️",
              "Now open the chest at (15, 17) to unlock 'gg' & 'G' so you can fly up to the top spire!"
            ];
          }
          return [
            "Welcome to the Tower of Vertical Ascents! 🗼",
            "Climbing twenty flights of stairs one by one is for mortals.",
            "Vim monks press 'gg' to fly directly to the top spire in a single instant! And 'G' plunges you back to the dungeon floor.",
            "PATH TO NEXT STAGE (CHAPTER 6):",
            "1. Open the ability chest ahead at (15, 17) to unlock 'gg' and 'G'.",
            "2. Retrieve the Tower Gold Key at the far right of this dungeon floor (26, 17).",
            "3. Type 'gg' to fly directly up to the Spire Battlement at the top of the tower!",
            "4. Unlock the Spire Gate at (24, 2) with your Gold Key to reach the Chapter 6 exit stairs at (28, 2)!",
            "Tip: You can also use line counts like '8G' to land on balconies and claim bonus gems!"
          ];
        }
      }
    ],
    keys: [
      { id: 'k5_gold', x: 26, y: 17, keyType: 'goldKey', name: 'Tower Gold Key' }
    ],
    doors: [
      { id: 'd5_spire', x: 24, y: 2, keyRequired: 'goldKey', orientation: 'vertical', label: 'Spire Gate' }
    ],
    chests: [
      {
        id: 'c5_vert',
        x: 15,
        y: 17,
        rewardType: 'ability',
        rewardValue: 'gg',
        label: "Unlocked 'gg' & 'G' (Vertical Buffer Jumps)!"
      }
    ],
    gems: [
      { id: 'g5_1', x: 20, y: 5, value: 40 },
      { id: 'g5_2', x: 20, y: 8, value: 40 },
      { id: 'g5_3', x: 20, y: 11, value: 40 }
    ],
    portals: [],
    obstacles: [],
    exit: { x: 28, y: 2, targetLevel: 6 },
    objective: "1. Open chest (15, 17) for 'gg'/'G' ➜ 2. Grab Gold Key (26, 17) ➜ 3. Press 'gg' to fly to Spire Gate (24, 2) for Chapter 6 exit!"
  },

  // =========================================================================
  // CHAPTER 6: The Forest of Empty Paragraphs [Dojo Day 6]
  // Mechanics: { and } jumping across empty lines / forest clearings
  // =========================================================================
  {
    id: 6,
    name: "Chapter 6: Forest of Empty Paragraphs",
    subtitle: "Leap Across Forest Glades with { and } [Dojo Day 6]",
    width: 34,
    height: 20,
    playerStart: { x: 2, y: 2 },
    initialAbilities: ['h', 'j', 'k', 'l', 'w', 'b', 'e', 'ge', '0', '$', '^', 'f', 'F', 't', 'T', ';', ',', 'gg', 'G'],
    map: [
      "##################################",
      "# Glade 1: Sunlit canopy glade   #",
      "# ============================== #",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "# Glade 2: Ancient oak grove     #",
      "# ============================== #",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "# Glade 3: Whispering pines      #",
      "# ============================== #",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "# Glade 4: Silver Key shrine     #",
      "# ============================== #",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "# Glade 5: Sacred forest exit    #",
      "# ============================== #",
      "##################################"
    ],
    npcs: [
      {
        id: 'robin',
        name: 'Ranger Robin',
        x: 10,
        y: 2,
        avatar: '🏹',
        dialogue: [
          "The undergrowth between glades is too thick for normal walking.",
          "In Vim, code functions are separated by empty blank lines.",
          "Press '}' to leap downward across the clearing to the next glade, and '{' to leap back!"
        ]
      }
    ],
    keys: [
      { id: 'k6_silver', x: 28, y: 13, keyType: 'silverKey', name: 'Silver Key' }
    ],
    doors: [
      { id: 'd6_forest', x: 22, y: 18, keyRequired: 'silverKey', orientation: 'vertical', label: 'Forest Gate' }
    ],
    chests: [
      {
        id: 'c6_para',
        x: 25,
        y: 2,
        rewardType: 'ability',
        rewardValue: '{',
        label: "Unlocked '{' & '}' (Paragraph Leaps)!"
      }
    ],
    gems: [
      { id: 'g6_1', x: 16, y: 5, value: 40 },
      { id: 'g6_2', x: 16, y: 9, value: 40 },
      { id: 'g6_3', x: 16, y: 13, value: 40 }
    ],
    portals: [],
    obstacles: [],
    exit: { x: 28, y: 18, targetLevel: 7 },
    objective: "Unlock '{' and '}', leap down to Glade 4 for the Silver Key, then unlock the Forest Gate!"
  },

  // =========================================================================
  // CHAPTER 7: Crypt of Matching Brackets [Dojo Day 10]
  // Mechanics: % bracket matching jumps between (, ), [, ], {, }
  // =========================================================================
  {
    id: 7,
    name: "Chapter 7: Crypt of Matching Brackets",
    subtitle: "Warp Between Code Chasms with % [Dojo Day 10]",
    width: 32,
    height: 18,
    playerStart: { x: 3, y: 3 },
    initialAbilities: ['h', 'j', 'k', 'l', 'w', 'b', 'e', 'ge', '0', '$', '^', 'f', 'F', 't', 'T', ';', ',', 'gg', 'G', '{', '}'],
    map: [
      "################################",
      "# ( Chamber Alpha ) ~~~~~~~~~~ #",
      "# ................. ~~~~~~~~~~ #",
      "# ( ............. ) ~~~~~~~~~~ #",
      "################################",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "# [ Chamber Beta  ] ~~~~~~~~~~ #",
      "# ................. ~~~~~~~~~~ #",
      "# [ ............. ] ~~~~~~~~~~ #",
      "################################",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "# { Chamber Gamma } ~~~~~~~~~~ #",
      "# ................. ~~~~~~~~~~ #",
      "# { ............. } ~~~~~~~~~~ #",
      "################################",
      "#..Skull Key Altar Awaits Exit.#",
      "#..............................#",
      "################################"
    ],
    npcs: [
      {
        id: 'monk',
        name: 'Bracket Monk',
        x: 8,
        y: 3,
        avatar: '📿',
        dialogue: [
          "The chambers are sealed by solid granite and chasms. Walking cannot cross.",
          "Open the chest here in Chamber Alpha to unlock the power of '%'!",
          "Stand upon any bracket '(', ')', '[', ']', '{', or '}' and press '%'!",
          "The power of '%' will instantly transport you to its matching partner across the void!"
        ]
      }
    ],
    keys: [
      { id: 'k7_skull', x: 16, y: 16, keyType: 'skullKey', name: 'Skull Key' }
    ],
    doors: [
      { id: 'd7_crypt', x: 24, y: 16, keyRequired: 'skullKey', orientation: 'vertical', label: 'Crypt Seal' }
    ],
    chests: [
      {
        id: 'c7_bracket',
        x: 14,
        y: 3,
        rewardType: 'ability',
        rewardValue: '%',
        label: "Unlocked '%' (Matching Bracket Warp)!"
      }
    ],
    gems: [
      { id: 'g7_1', x: 5, y: 7, value: 50 },
      { id: 'g7_2', x: 14, y: 7, value: 50 },
      { id: 'g7_3', x: 5, y: 12, value: 50 }
    ],
    portals: [
      { id: 'p1', x: 2, y: 3, targetX: 18, targetY: 3, char: '(' },
      { id: 'p2', x: 18, y: 3, targetX: 2, targetY: 8, char: ')' },
      { id: 'p3', x: 2, y: 8, targetX: 18, targetY: 8, char: '[' },
      { id: 'p4', x: 18, y: 8, targetX: 2, targetY: 13, char: ']' },
      { id: 'p5', x: 2, y: 13, targetX: 18, targetY: 13, char: '{' },
      { id: 'p6', x: 18, y: 13, targetX: 4, targetY: 16, char: '}' }
    ],
    obstacles: [],
    exit: { x: 28, y: 16, targetLevel: 8 },
    objective: "Unlock '%' in Chamber Alpha, warp through Beta and Gamma to the Altar, and claim the Skull Key!"
  },

  // =========================================================================
  // CHAPTER 8: The Labyrinth of Precision Counts [Dojo Day 2]
  // Mechanics: Count grammar (3w, 5j, 18h, 4j, 10h) across water bridges
  // =========================================================================
  {
    id: 8,
    name: "Chapter 8: Labyrinth of Precision Counts",
    subtitle: "Precision Leaps with Counts: 3w, 5j, 18h [Dojo Day 2]",
    width: 34,
    height: 13,
    playerStart: { x: 2, y: 1 },
    initialAbilities: ['h', 'j', 'k', 'l', 'w', 'b', 'e', 'ge', '0', '$', '^', 'f', 'F', 't', 'T', ';', ',', 'gg', 'G', '{', '}', '%'],
    map: [
      "##################################",
      "# START~~~~Island1~~~~Island2~~~.#",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~..#",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~..#",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~..#",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~..#",
      "#~~~~~~~~~~~~Key===============..#",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~..#",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~..#",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~..#",
      "#~~~~~~~~~~~~Exit====Gate======..#",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "##################################"
    ],
    npcs: [
      {
        id: 'mathius',
        name: 'Count Mathius',
        x: 4,
        y: 1,
        avatar: '🧮',
        dialogue: [
          "In Vim, numbers give commands their true multiplied power!",
          "Type '3w' to leap across the three islands to the far tower.",
          "Use '5j' to descend the vertical bridge, then '18h' to reach the Key!",
          "Precision counts save time and protect you from falling into the sea."
        ]
      }
    ],
    keys: [
      { id: 'k8_bronze', x: 13, y: 6, keyType: 'bronzeKey', name: 'Bronze Key' }
    ],
    doors: [
      { id: 'd8_gate', x: 21, y: 10, keyRequired: 'bronzeKey', orientation: 'vertical', label: 'Labyrinth Gate' }
    ],
    chests: [
      {
        id: 'c8_gems',
        x: 28,
        y: 6,
        rewardType: 'gems',
        rewardValue: 100,
        label: "Found 100 Bonus Gems for Precision!"
      }
    ],
    gems: [
      { id: 'g8_1', x: 11, y: 1, value: 50 },
      { id: 'g8_2', x: 22, y: 1, value: 50 },
      { id: 'g8_3', x: 31, y: 3, value: 50 }
    ],
    portals: [],
    obstacles: [],
    exit: { x: 13, y: 10, targetLevel: 9 },
    objective: "Use counts like '3w', '5j', '18h' to navigate bridges, claim the Bronze Key, and advance!"
  },

  // =========================================================================
  // CHAPTER 9: The Pruning Grounds of 'x' [Dojo Days 2 & 4]
  // Mechanics: Character deletion / weed clearing with x and counts (3x)
  // =========================================================================
  {
    id: 9,
    name: "Chapter 9: The Pruning Grounds of 'x'",
    subtitle: "Slice Glitches, Bugs, and Weeds with x and 3x [Dojo Days 2 & 4]",
    width: 32,
    height: 14,
    playerStart: { x: 2, y: 2 },
    initialAbilities: ['h', 'j', 'k', 'l', 'w', 'b', 'e', 'ge', '0', '$', '^', 'f', 'F', 't', 'T', ';', ',', 'gg', 'G', '{', '}', '%'],
    map: [
      "################################",
      "# Gardener Pete's Hedge Maze   #",
      "# .Pete.........Chest..........#",
      "#.##############################",
      "#...Corridor_A....x............#",
      "##############################.#",
      "#...Corridor_B....xxx..........#",
      "#.##############################",
      "#...Key...x...Corridor_C.......#",
      "##############################.#",
      "#...Pruning_Gate==========Exit.#",
      "# ============================ #",
      "#..............................#",
      "################################"
    ],
    npcs: [
      {
        id: 'pete',
        name: 'Gardener Pete',
        x: 4,
        y: 2,
        avatar: '🧑‍🌾',
        dialogue: [
          "Glitch weeds 'x' have choked my entire hedgerow maze!",
          "Stand facing a weed and press 'x' to slice it away into a walkable path.",
          "For clusters of weeds like 'xxx', type '3x' to prune them all at once!",
          "Prune the corridors, claim my Ruby Key, and unlock the garden gate."
        ]
      }
    ],
    keys: [
      { id: 'k9_ruby', x: 5, y: 8, keyType: 'rubyKey', name: 'Ruby Key' }
    ],
    doors: [
      { id: 'd9_gate', x: 20, y: 10, keyRequired: 'rubyKey', orientation: 'vertical', label: 'Pruning Gate' }
    ],
    chests: [
      {
        id: 'c9_x',
        x: 18,
        y: 2,
        rewardType: 'ability',
        rewardValue: 'x',
        label: "Unlocked 'x' (Cut Character / Obstacle)!"
      }
    ],
    gems: [
      { id: 'g9_1', x: 10, y: 4, value: 50 },
      { id: 'g9_2', x: 10, y: 6, value: 50 },
      { id: 'g9_3', x: 20, y: 8, value: 50 }
    ],
    portals: [],
    obstacles: [
      { id: 'obs9_1', x: 18, y: 4, char: 'x', type: 'weed' },
      { id: 'obs9_2', x: 18, y: 6, char: 'x', type: 'weed' },
      { id: 'obs9_3', x: 19, y: 6, char: 'x', type: 'weed' },
      { id: 'obs9_4', x: 20, y: 6, char: 'x', type: 'weed' },
      { id: 'obs9_5', x: 10, y: 8, char: 'x', type: 'weed' }
    ],
    exit: { x: 26, y: 10, targetLevel: 10 },
    objective: "Unlock 'x', prune single and clustered weeds with 'x' and '3x', grab Ruby Key, and exit!"
  },

  // =========================================================================
  // CHAPTER 10: The Masons of Replacement ('r') [Dojo Days 4 & 14]
  // Mechanics: Character replacement with r{char} to repair bridge tiles
  // =========================================================================
  {
    id: 10,
    name: "Chapter 10: Masons of Replacement ('r')",
    subtitle: "Restore Broken Bridges with r= [Dojo Days 4 & 14]",
    width: 34,
    height: 12,
    playerStart: { x: 2, y: 2 },
    initialAbilities: ['h', 'j', 'k', 'l', 'w', 'b', 'e', 'ge', '0', '$', '^', 'f', 'F', 't', 'T', ';', ',', 'gg', 'G', '{', '}', '%', 'x'],
    map: [
      "##################################",
      "# West Bank      ~~~   East Bank #",
      "# .Bob..Chest... ~~~ ........... #",
      "# .............. ~~~ ........... #",
      "# .............. ~~~ ........... #",
      "# .............. ~~~ ........... #",
      "# ===Bridge=====~~======Key===== #",
      "# .............. ~~~ ........... #",
      "# .............. ~~~ ........... #",
      "# .............. ~~~ Mason_GateE #",
      "# ============== ~~~ =========== #",
      "##################################"
    ],
    npcs: [
      {
        id: 'bob',
        name: 'Mason Bob',
        x: 4,
        y: 2,
        avatar: '👷',
        dialogue: [
          "A raging river cuts our workshop in two! The bridge collapsed into water '~'!",
          "Open the chest at (10, 2) to unlock the mason's tool 'r'.",
          "Face each water gap and type 'r=' to replace the rushing water with solid bridge '=}.",
          "Cross the repaired bridge, seize the Emerald Key, and open the Mason Gate!"
        ]
      }
    ],
    keys: [
      { id: 'k10_emerald', x: 25, y: 6, keyType: 'emeraldKey', name: 'Emerald Key' }
    ],
    doors: [
      { id: 'd10_mason', x: 28, y: 9, keyRequired: 'emeraldKey', orientation: 'vertical', label: 'Mason Gate' }
    ],
    chests: [
      {
        id: 'c10_r',
        x: 10,
        y: 2,
        rewardType: 'ability',
        rewardValue: 'r',
        label: "Unlocked 'r' (Replace Character)!"
      }
    ],
    gems: [
      { id: 'g10_1', x: 8, y: 6, value: 60 },
      { id: 'g10_2', x: 20, y: 6, value: 60 },
      { id: 'g10_3', x: 28, y: 6, value: 60 }
    ],
    portals: [],
    obstacles: [],
    exit: { x: 31, y: 9, targetLevel: 11 },
    objective: "Unlock 'r', use 'r=' to repair both bridge gaps, grab the Emerald Key, and open the gate!"
  },

  // =========================================================================
  // CHAPTER 11: The Halls of Undo & Reversal ('u') [Dojo Day 12]
  // Mechanics: Undo tree, rewinding moves and state with 'u'
  // =========================================================================
  {
    id: 11,
    name: "Chapter 11: Halls of Undo & Reversal",
    subtitle: "Manipulate Time and Reverse Traps with u [Dojo Day 12]",
    width: 32,
    height: 15,
    playerStart: { x: 2, y: 2 },
    initialAbilities: ['h', 'j', 'k', 'l', 'w', 'b', 'e', 'ge', '0', '$', '^', 'f', 'F', 't', 'T', ';', ',', 'gg', 'G', '{', '}', '%', 'x', 'r', 'u'],
    map: [
      "################################",
      "# Chrono Chamber of Time Loops #",
      "# .Chronos.....................#",
      "#.##############################",
      "#...Trap_Pit: Dead_End_Fault...#",
      "#.##############################",
      "#..............................#",
      "#.##############################",
      "#...Silver_Key_Altar_Vault:==K.#",
      "#.##############################",
      "#..............................#",
      "#.##############################",
      "#...Chrono_Gate===========Exit.#",
      "# ============================ #",
      "################################"
    ],
    npcs: [
      {
        id: 'chronos',
        name: 'Chronos the Sage',
        x: 4,
        y: 2,
        avatar: '⏳',
        dialogue: [
          "Beware the temporal pitfalls! The upper vault is a deceptive dead-end trap.",
          "In Vim, the 'u' key is your eternal undo spell!",
          "Make a misstep into a dead end? Press 'u' repeatedly to rewind your path and time itself.",
          "Retrieve the Silver Key from the middle vault and unlock the Chrono Gate!"
        ]
      }
    ],
    keys: [
      { id: 'k11_silver', x: 29, y: 8, keyType: 'silverKey', name: 'Silver Key' }
    ],
    doors: [
      { id: 'd11_chrono', x: 20, y: 12, keyRequired: 'silverKey', orientation: 'vertical', label: 'Chrono Gate' }
    ],
    chests: [
      {
        id: 'c11_gems',
        x: 22,
        y: 8,
        rewardType: 'gems',
        rewardValue: 120,
        label: "Discovered 120 Timeless Gems!"
      }
    ],
    gems: [
      { id: 'g11_1', x: 12, y: 4, value: 60 },
      { id: 'g11_2', x: 20, y: 4, value: 60 },
      { id: 'g11_3', x: 12, y: 8, value: 60 }
    ],
    portals: [],
    obstacles: [],
    exit: { x: 29, y: 12, targetLevel: 12 },
    objective: "Navigate the corridors, use 'u' to rewind trap steps, claim the Silver Key, and unlock the Chrono Gate!"
  },

  // =========================================================================
  // CHAPTER 12: Chamber of Case Inversion ('~') [Dojo Days 13 & 27]
  // Mechanics: Toggle switch polarity with ~ (invert lower to UPPER)
  // =========================================================================
  {
    id: 12,
    name: "Chapter 12: Chamber of Case Inversion ('~')",
    subtitle: "Toggle Binary Switches and Gates with ~ [Dojo Days 13 & 27]",
    width: 34,
    height: 14,
    playerStart: { x: 2, y: 2 },
    initialAbilities: ['h', 'j', 'k', 'l', 'w', 'b', 'e', 'ge', '0', '$', '^', 'f', 'F', 't', 'T', ';', ',', 'gg', 'G', '{', '}', '%', 'x', 'r', 'u'],
    map: [
      "##################################",
      "# Sanctuary of Polarity Crystals #",
      "# .Switcher.....Chest............#",
      "#.################################",
      "#...Switch_Alpha: [o] =====Gate1.#",
      "################################.#",
      "#...Switch_Beta:  [s] =====Gate2.#",
      "################################.#",
      "#...Gold_Key_Vault:==============#",
      "################################.#",
      "#...Polarity_Gate===========Exit.#",
      "# ============================== #",
      "#................................#",
      "##################################"
    ],
    npcs: [
      {
        id: 'switcher',
        name: 'Mystic Switcher',
        x: 4,
        y: 2,
        avatar: '🔮',
        dialogue: [
          "Behold the ancient polarity mechanisms! Lowercase letters like 'o' and 's' are dormant.",
          "Open the chest at (18, 2) to unlock the '~' (tilde) case inversion power.",
          "Stand facing switch 'o' and press '~' to flip it to uppercase 'O' and open Gate 1!",
          "Next, face switch 's' and press '~' to flip it to 'S' to lower Gate 2 and claim the Gold Key!"
        ]
      }
    ],
    keys: [
      { id: 'k12_gold', x: 20, y: 8, keyType: 'goldKey', name: 'Gold Key' }
    ],
    doors: [
      { id: 'd12_switch', x: 28, y: 4, keyRequired: 'switch', orientation: 'vertical', label: 'Switch Gate 1' },
      { id: 'd12_drawbridge', x: 28, y: 6, keyRequired: 'switch', orientation: 'vertical', label: 'Switch Gate 2' },
      { id: 'd12_polarity', x: 20, y: 10, keyRequired: 'goldKey', orientation: 'vertical', label: 'Polarity Gate' }
    ],
    chests: [
      {
        id: 'c12_tilde',
        x: 18,
        y: 2,
        rewardType: 'ability',
        rewardValue: '~',
        label: "Unlocked '~' (Toggle Case)!"
      }
    ],
    gems: [
      { id: 'g12_1', x: 10, y: 4, value: 70 },
      { id: 'g12_2', x: 10, y: 6, value: 70 },
      { id: 'g12_3', x: 10, y: 8, value: 70 }
    ],
    portals: [],
    obstacles: [],
    exit: { x: 28, y: 10, targetLevel: 13 },
    objective: "Unlock '~', flip switch 'o'->'O' and 's'->'S' to unlock both gates, grab Gold Key, and exit!"
  },

  // =========================================================================
  // CHAPTER 13: Valley of Golden Beacons ('*') [Dojo Days 18 & 23]
  // Mechanics: Search word under cursor with * to warp across beacons
  // =========================================================================
  {
    id: 13,
    name: "Chapter 13: Valley of Golden Beacons ('*')",
    subtitle: "Search and Warp to Matching Tokens with * [Dojo Days 18 & 23]",
    width: 34,
    height: 17,
    playerStart: { x: 2, y: 1 },
    initialAbilities: ['h', 'j', 'k', 'l', 'w', 'b', 'e', 'ge', '0', '$', '^', 'f', 'F', 't', 'T', ';', ',', 'gg', 'G', '{', '}', '%', 'x', 'r', 'u', '~'],
    map: [
      "##################################",
      "# Island_One:...Chest...SOLAR... #",
      "# ============================== #",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "#...SOLAR=========ASTRAL.........#",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "#...ASTRAL========LUNAR..........#",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "#...ZENITH====LUNAR======Key.....#",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "#...ZENITH====Gate==========Exit.#",
      "# ============================== #",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "##################################"
    ],
    npcs: [
      {
        id: 'stella',
        name: 'Stargazer Stella',
        x: 4,
        y: 1,
        avatar: '🔭',
        dialogue: [
          "The sky islands are isolated by miles of bottomless void.",
          "Open the chest at (16, 1) to unlock the '*' token search warp.",
          "Stand upon a beacon word like 'SOLAR', 'ASTRAL', or 'LUNAR' and press '*'!",
          "In Vim, '*' searches forward for the word under your cursor, warping you across the chasm!"
        ]
      }
    ],
    keys: [
      { id: 'k13_ruby', x: 26, y: 10, keyType: 'rubyKey', name: 'Ruby Key' }
    ],
    doors: [
      { id: 'd13_star', x: 14, y: 13, keyRequired: 'rubyKey', orientation: 'vertical', label: 'Starlight Gate' }
    ],
    chests: [
      {
        id: 'c13_star',
        x: 16,
        y: 1,
        rewardType: 'ability',
        rewardValue: '*',
        label: "Unlocked '*' (Search Word Under Cursor)!"
      }
    ],
    gems: [
      { id: 'g13_1', x: 10, y: 4, value: 75 },
      { id: 'g13_2', x: 10, y: 7, value: 75 },
      { id: 'g13_3', x: 20, y: 10, value: 75 }
    ],
    portals: [],
    obstacles: [],
    exit: { x: 28, y: 13, targetLevel: 14 },
    objective: "Unlock '*', warp across beacon islands using '*', retrieve Ruby Key, and exit!"
  },

  // =========================================================================
  // CHAPTER 14: The Line Demolition Vaults ('D') [Dojo Day 4]
  // Mechanics: Delete to line end (D / d$) clearing barrier rows
  // =========================================================================
  {
    id: 14,
    name: "Chapter 14: Line Demolition Vaults ('D')",
    subtitle: "Obliterate Barriers to Line End with D [Dojo Day 4]",
    width: 34,
    height: 15,
    playerStart: { x: 2, y: 2 },
    initialAbilities: ['h', 'j', 'k', 'l', 'w', 'b', 'e', 'ge', '0', '$', '^', 'f', 'F', 't', 'T', ';', ',', 'gg', 'G', '{', '}', '%', 'x', 'r', 'u', '~', '*'],
    map: [
      "##################################",
      "# Demolition Training Arena      #",
      "# .Dan..Chest....................#",
      "#.################################",
      "#...# Barrier_1: xxxxxxxxxxxxxxx.#",
      "#.################################",
      "#...#............................#",
      "#.################################",
      "#...# Barrier_2: xxxxxxxxxxxxxxx.#",
      "#.################################",
      "#...# Barrier_3: xxxxxxxxxxxxxxK.#",
      "#.################################",
      "#...Vault_Gate==============Exit.#",
      "# ============================== #",
      "##################################"
    ],
    npcs: [
      {
        id: 'dan',
        name: 'Demolition Dan',
        x: 4,
        y: 2,
        avatar: '💣',
        dialogue: [
          "Single 'x' cuts one tile at a time. Too slow for a master!",
          "Open the chest at (10, 2) to unlock 'D' (delete to end of line)!",
          "Stand facing each laser barrier row and hit 'D' to blast the entire path open in one strike!",
          "Vaporize Barrier 3 to seize the Diamond Key, then open the Vault Gate!"
        ]
      }
    ],
    keys: [
      { id: 'k14_diamond', x: 31, y: 10, keyType: 'diamondKey', name: 'Diamond Key' }
    ],
    doors: [
      { id: 'd14_vault', x: 15, y: 12, keyRequired: 'diamondKey', orientation: 'vertical', label: 'Vault Gate' }
    ],
    chests: [
      {
        id: 'c14_d',
        x: 10,
        y: 2,
        rewardType: 'ability',
        rewardValue: 'D',
        label: "Unlocked 'D' (Delete to Line End)!"
      }
    ],
    gems: [
      { id: 'g14_1', x: 31, y: 4, value: 80 },
      { id: 'g14_2', x: 31, y: 8, value: 80 },
      { id: 'g14_3', x: 20, y: 6, value: 80 }
    ],
    portals: [],
    obstacles: [
      { id: 'obs14_1', x: 17, y: 4, char: 'x', type: 'barrier' },
      { id: 'obs14_2', x: 17, y: 8, char: 'x', type: 'barrier' },
      { id: 'obs14_3', x: 17, y: 10, char: 'x', type: 'barrier' }
    ],
    exit: { x: 28, y: 12, targetLevel: 15 },
    objective: "Unlock 'D', vaporize barrier rows, claim the Diamond Key, and enter the Grand Citadel!"
  },

  // =========================================================================
  // CHAPTER 15: Grand Citadel of the Neovim Grandmaster [Dojo Days 29-30]
  // Mechanics: Climax synthesizing ALL motions, objects, operators, and Bram
  // =========================================================================
  {
    id: 15,
    name: "Chapter 15: Grand Citadel of the Neovim Grandmaster",
    subtitle: "The Ultimate Modal Trial - Bram Moolenaar's Blessing [Dojo Days 29-30]",
    width: 34,
    height: 22,
    playerStart: { x: 31, y: 20 },
    initialAbilities: ['h', 'j', 'k', 'l', 'w', 'b', 'e', 'ge', '0', '$', '^', 'f', 'F', 't', 'T', ';', ',', 'gg', 'G', '{', '}', '%', 'x', 'r', 'u', '~', '*', 'D'],
    map: [
      "##################################",
      "# Bram's Golden Throne of Glory  #",
      "# ...............Exit........... #",
      "# ...........Grandmaster........ #",
      "# ==============Gate============ #",
      "# .............CROWN............ #",
      "##################################",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#",
      "#.################################",
      "#...Switch: [o] ==Gate===Key CROWN#",
      "#.################################",
      "#................................#",
      "################################.#",
      "#...Barrier:..xxxxxxxxxxxxxxxxx..#",
      "#.################################",
      "#................................#",
      "################################.#",
      "#...Bridge====~~================.#",
      "#.################################",
      "# Foyer: Begin the Grand Trial . #",
      "##################################"
    ],
    npcs: [
      {
        id: 'grandmaster',
        name: 'Grandmaster Bram',
        x: 16,
        y: 3,
        avatar: '👑',
        dialogue: [
          "Welcome to the pinnacle of the Modal Arts, Hero!",
          "You repaired broken bridges with 'r', vaporized barrier rows with 'D',",
          "inverted polarities with '~', and leaped across the stars with '*'.",
          "Step upon my Golden Throne, claim your Grandmaster Crown, and ascend to Vim immortality!"
        ]
      }
    ],
    keys: [
      { id: 'k15_gold', x: 25, y: 10, keyType: 'goldKey', name: 'Grandmaster Gold Key' }
    ],
    doors: [
      { id: 'd15_switch', x: 18, y: 10, keyRequired: 'switch', orientation: 'vertical', label: 'Citadel Switch Gate' },
      { id: 'd15_master', x: 16, y: 4, keyRequired: 'goldKey', orientation: 'vertical', label: 'Grandmaster Gate' }
    ],
    chests: [
      {
        id: 'c15_trophy',
        x: 13,
        y: 3,
        rewardType: 'gems',
        rewardValue: 500,
        label: "Crowned with the 500 Gem Grandmaster Treasure!"
      }
    ],
    gems: [
      { id: 'g15_1', x: 8, y: 10, value: 100 },
      { id: 'g15_2', x: 10, y: 14, value: 100 },
      { id: 'g15_3', x: 10, y: 18, value: 100 }
    ],
    portals: [],
    obstacles: [
      { id: 'obs15_1', x: 14, y: 14, char: 'x', type: 'barrier' }
    ],
    exit: { x: 16, y: 2, isVictory: true },
    objective: "Repair bridges ('r='), vaporize barriers ('D'), toggle switch ('~'), warp with '*', and reach Bram's Throne!"
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

    // Render Level Exit / Staircase Portal
    if (entities.exit) {
      this.renderExit(ctx, entities.exit);
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

  renderExit(ctx, exit) {
    if (!exit) return;
    const ts = this.tileSize;
    const px = exit.x * ts;
    const py = exit.y * ts;
    const centerX = px + ts / 2;
    const centerY = py + ts / 2;

    const pulse = (Math.sin(this.time * 4) + 1) / 2; // 0 to 1

    ctx.save();

    // 1. Glowing mystic ring under portal
    const radius = ts * 0.42 + pulse * 3;
    const grad = ctx.createRadialGradient(centerX, centerY, 4, centerX, centerY, radius + 8);
    grad.addColorStop(0, exit.isVictory ? 'rgba(255, 215, 0, 0.8)' : 'rgba(125, 207, 255, 0.8)');
    grad.addColorStop(0.5, exit.isVictory ? 'rgba(255, 158, 100, 0.4)' : 'rgba(187, 154, 247, 0.4)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 8, 0, Math.PI * 2);
    ctx.fill();

    // 2. Rotating energy ring
    ctx.strokeStyle = exit.isVictory ? '#ffd700' : '#7dcfff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    // 3. Center portal icon / stairs
    ctx.font = '22px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(exit.isVictory ? '🏆' : '🪜', centerX, centerY);

    // 4. Floating badge above portal
    const badgeText = exit.isVictory ? 'VICTORY' : `CH ${exit.targetLevel} ➜`;
    ctx.font = 'bold 10px monospace';
    const textWidth = ctx.measureText(badgeText).width;
    const badgeW = textWidth + 12;
    const badgeH = 16;
    const badgeX = centerX - badgeW / 2;
    const badgeY = py - 12 - pulse * 3;

    ctx.fillStyle = 'rgba(26, 27, 38, 0.9)';
    ctx.strokeStyle = exit.isVictory ? '#ff9e64' : '#7aa2f7';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = exit.isVictory ? '#ffd700' : '#7dcfff';
    ctx.fillText(badgeText, centerX, badgeY + badgeH / 2 + 1);

    ctx.restore();
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
    const keyStyles = {
      bronzeKey: { icon: '🗝️', color: 'rgba(224, 175, 104, 0.5)' },
      silverKey: { icon: '🥈', color: 'rgba(192, 202, 245, 0.5)' },
      goldKey: { icon: '🥇', color: 'rgba(255, 215, 0, 0.6)' },
      skullKey: { icon: '💀', color: 'rgba(187, 154, 247, 0.6)' },
      rubyKey: { icon: '♦️', color: 'rgba(247, 118, 142, 0.6)' },
      emeraldKey: { icon: '❇️', color: 'rgba(115, 218, 202, 0.6)' },
      diamondKey: { icon: '💎', color: 'rgba(125, 207, 255, 0.7)' },
    };

    for (const k of keys) {
      if (k.isCollected) continue;
      const px = k.x * ts;
      const py = k.y * ts + Math.sin(k.bobTimer) * 4;
      const style = keyStyles[k.keyType] || { icon: '🗝️', color: 'rgba(255, 199, 119, 0.4)' };

      ctx.save();
      // Glow aura
      ctx.fillStyle = style.color;
      ctx.beginPath();
      ctx.arc(px + ts / 2, py + ts / 2, 16, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '22px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(style.icon, px + ts / 2, py + ts / 2);
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
      this.game.hud.closeHints();
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

    if (e.key === 'H' && !this.pendingPrefix) {
      this.game.openHintsModal();
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
        } else if (key === 'g') {
          this.executeMotion('gg');
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
      if (!this.game.player.hasAbility(';')) {
        this.game.audio.playError();
        this.game.renderer.addFloatingText("Key ';' is locked!", this.game.player.x, this.game.player.y, '#f7768e');
        this.resetBuffer();
        return;
      }
      if (this.lastFind) {
        this.executeFind(this.lastFind.type, this.lastFind.target);
      } else {
        this.game.audio.playError();
      }
      this.resetBuffer();
      return;
    }

    if (key === ',') {
      if (!this.game.player.hasAbility(',')) {
        this.game.audio.playError();
        this.game.renderer.addFloatingText("Key ',' is locked!", this.game.player.x, this.game.player.y, '#f7768e');
        this.resetBuffer();
        return;
      }
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
    if (key === 'G') {
      this.executeMotion('G');
      this.resetBuffer();
      return;
    }

    if (key === '{' || key === '}') {
      this.executeMotion(key);
      this.resetBuffer();
      return;
    }

    if (key === '~') {
      this.game.handleToggleCase();
      this.resetBuffer();
      return;
    }

    if (key === '*') {
      this.game.handleStarSearch();
      this.resetBuffer();
      return;
    }

    if (key === 'x') {
      const count = this.getCount();
      this.game.handleCutObstacle(count);
      this.resetBuffer();
      return;
    }

    this.executeMotion(key);
    this.resetBuffer();
  }

  getCount() {
    const c = parseInt(this.countBuffer, 10);
    return isNaN(c) || c <= 0 ? 1 : Math.min(c, 99);
  }

  executeMotion(motionKey) {
    const hasCount = this.countBuffer.length > 0;
    const count = this.getCount();
    this.game.handleMotion(motionKey, count, hasCount);
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

    const btnHints = document.getElementById('btn-hints');
    if (btnHints) {
      btnHints.addEventListener('click', () => this.openHintsModal());
    }

    const btnCloseHints = document.getElementById('btn-close-hints');
    if (btnCloseHints) {
      btnCloseHints.addEventListener('click', () => this.hud.closeHints());
    }

    const btnDismissHints = document.getElementById('btn-dismiss-hints');
    if (btnDismissHints) {
      btnDismissHints.addEventListener('click', () => this.hud.closeHints());
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
    this.entities.exit = data.exit || null;

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
    const lines = npc.getDialogue({
      inventory: this.player.inventory,
      player: this.player,
      level: this.currentLevel,
      entities: this.entities
    });
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

  handleMotion(motionKey, count = 1, hasExplicitCount = false) {
    // Check if hero has ability unlocked
    if (!this.player.hasAbility(motionKey)) {
      this.audio.playError();
      this.renderer.screenShake(4);
      this.renderer.addFloatingText(`Key '${motionKey}' is locked!`, this.player.x, this.player.y, '#f7768e');
      return;
    }

    this.recordHistory();

    const isJumpMotion = motionKey === 'gg' || motionKey === 'G';
    const iterations = isJumpMotion ? 1 : count;

    for (let c = 0; c < iterations; c++) {
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
        case 'gg': {
          const target = hasExplicitCount ? count : null;
          const pt = this.tilemap.jumpToLine(target, this.player.x, 'top');
          destX = pt.x;
          destY = pt.y;
          motionSound = 'jump';
          break;
        }
        case 'G': {
          const target = hasExplicitCount ? count : null;
          const pt = this.tilemap.jumpToLine(target, this.player.x, 'bottom');
          destX = pt.x;
          destY = pt.y;
          motionSound = 'jump';
          break;
        }
        case '{': {
          const pt = this.tilemap.findParagraphJump(this.player.x, this.player.y, false);
          destX = pt.x;
          destY = pt.y;
          motionSound = 'jump';
          break;
        }
        case '}': {
          const pt = this.tilemap.findParagraphJump(this.player.x, this.player.y, true);
          destX = pt.x;
          destY = pt.y;
          motionSound = 'jump';
          break;
        }
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
    if (!this.player.hasAbility(type)) {
      this.audio.playError();
      this.renderer.addFloatingText(`Key '${type}' is locked!`, this.player.x, this.player.y, '#f7768e');
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

  handleCutObstacle(count = 1) {
    if (!this.player.hasAbility('x')) {
      this.audio.playError();
      this.renderer.addFloatingText("Key 'x' is locked!", this.player.x, this.player.y, '#f7768e');
      return;
    }

    let cutAny = false;
    for (let c = 0; c < count; c++) {
      let targetX = this.player.x;
      let targetY = this.player.y;
      if (this.player.direction === 'right') targetX += (c + 1);
      else if (this.player.direction === 'left') targetX -= (c + 1);
      else if (this.player.direction === 'down') targetY += (c + 1);
      else if (this.player.direction === 'up') targetY -= (c + 1);

      let obstacle = null;
      if (c === 0) {
        obstacle = this.entities.obstacles.find(o => !o.isCleared && o.x === this.player.x && o.y === this.player.y);
      }
      if (!obstacle) {
        obstacle = this.entities.obstacles.find(o => !o.isCleared && o.x === targetX && o.y === targetY);
      }

      if (obstacle) {
        if (!cutAny) this.recordHistory();
        obstacle.clear();
        this.tilemap.setTile(obstacle.x, obstacle.y, '='); // turn into path
        this.audio.playSlash();
        this.particles.emit(obstacle.x, obstacle.y, 14, '#9ece6a', 70, 3);
        cutAny = true;
      } else {
        break;
      }
    }

    if (cutAny) {
      this.renderer.addFloatingText('Cut with x!', this.player.x, this.player.y, '#9ece6a');
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

  handleToggleCase() {
    if (!this.player.hasAbility('~')) {
      this.audio.playError();
      this.renderer.addFloatingText("Key '~' is locked!", this.player.x, this.player.y, '#f7768e');
      return;
    }

    let targetX = this.player.x;
    let targetY = this.player.y;

    // Check if facing a letter tile in front
    let frontX = targetX;
    let frontY = targetY;
    if (this.player.direction === 'right') frontX++;
    else if (this.player.direction === 'left') frontX--;
    else if (this.player.direction === 'down') frontY++;
    else if (this.player.direction === 'up') frontY--;

    const frontTile = this.tilemap.getTile(frontX, frontY);
    if (/[a-zA-Z]/.test(frontTile) && frontTile !== '#') {
      targetX = frontX;
      targetY = frontY;
    }

    const curTile = this.tilemap.getTile(targetX, targetY);
    if (/[a-zA-Z]/.test(curTile) && curTile !== '#') {
      this.recordHistory();
      const flipped = curTile === curTile.toUpperCase() ? curTile.toLowerCase() : curTile.toUpperCase();
      this.tilemap.setTile(targetX, targetY, flipped);
      this.audio.playRepair();
      this.particles.emit(targetX, targetY, 15, '#ff9e64', 60, 3);
      this.renderer.addFloatingText(`Toggled '${curTile}' ➔ '${flipped}' (~)`, targetX, targetY, '#ff9e64');

      // Check if toggling switch triggers door or path
      if (flipped === 'O' || flipped === 'S') {
        const switchDoor = this.entities.doors.find(d => !d.isOpen && (d.keyRequired === 'switch' || d.keyRequired === 'lever'));
        if (switchDoor) {
          switchDoor.isOpen = true;
          this.tilemap.setTile(switchDoor.x, switchDoor.y, '=');
          this.audio.playDoorOpen();
          this.particles.emit(switchDoor.x, switchDoor.y, 20, '#9ece6a', 80, 4);
          this.renderer.addFloatingText(`${switchDoor.label} Opened!`, switchDoor.x, switchDoor.y, '#9ece6a');
        }
      }
      this.checkInteractions();
    } else {
      this.audio.playError();
      this.renderer.addFloatingText("No letter to toggle with ~", this.player.x, this.player.y, '#f7768e');
    }
  }

  handleStarSearch() {
    if (!this.player.hasAbility('*')) {
      this.audio.playError();
      this.renderer.addFloatingText("Key '*' is locked!", this.player.x, this.player.y, '#f7768e');
      return;
    }

    const res = this.tilemap.findMatchingToken(this.player.x, this.player.y);
    if (res.found && this.canMoveTo(res.x, res.y)) {
      this.recordHistory();
      this.player.moveTo(res.x, res.y);
      this.totalMoves++;
      this.audio.playWarp();
      this.particles.emit(res.x, res.y, 20, '#e0af68', 90, 4);
      this.renderer.addFloatingText(`Warped to matching '${res.token}' (*)!`, res.x, res.y, '#e0af68');
      this.checkInteractions();
    } else {
      this.audio.playError();
      this.renderer.addFloatingText(res.token ? `No other '${res.token}' found (*)` : "Stand on a rune word (*)", this.player.x, this.player.y, '#f7768e');
    }
  }

  handleDeleteLineEnd() {
    if (!this.player.hasAbility('D')) {
      this.audio.playError();
      this.renderer.addFloatingText("Key 'D' is locked!", this.player.x, this.player.y, '#f7768e');
      return;
    }

    this.recordHistory();
    let clearedCount = 0;
    const y = this.player.y;

    for (const obs of this.entities.obstacles) {
      if (!obs.isCleared && obs.y === y && obs.x >= this.player.x) {
        obs.clear();
        this.tilemap.setTile(obs.x, obs.y, '=');
        clearedCount++;
      }
    }

    for (let x = this.player.x; x < this.tilemap.width; x++) {
      const tile = this.tilemap.getTile(x, y);
      if (tile === 'x' || tile === 'X') {
        this.tilemap.setTile(x, y, '=');
        clearedCount++;
      }
    }

    if (clearedCount > 0) {
      this.audio.playSlash();
      this.particles.emit(this.player.x, y, 20, '#f7768e', 80, 4);
      this.renderer.addFloatingText(`Demolished line to end (D)!`, this.player.x, y, '#f7768e');
      this.checkInteractions();
    } else {
      this.audio.playError();
      this.renderer.addFloatingText("No obstacles to delete with D", this.player.x, y, '#f7768e');
    }
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
        if (this.currentLevel?.id === 5) {
          this.renderer.addFloatingText("Walk right to (28, 2) to enter Chapter 6! ➜", x + 1, y, '#9ece6a');
          this.updateLevelObjective();
        }
        return true;
      } else {
        this.audio.playError();
        this.renderer.screenShake(3);
        const keyName = door.keyRequired === 'goldKey' ? 'Gold Key' :
                        door.keyRequired === 'silverKey' ? 'Silver Key' :
                        door.keyRequired === 'bronzeKey' ? 'Bronze Key' :
                        door.keyRequired === 'skullKey' ? 'Skull Key' :
                        door.keyRequired === 'rubyKey' ? 'Ruby Key' :
                        door.keyRequired === 'emeraldKey' ? 'Emerald Key' :
                        door.keyRequired === 'diamondKey' ? 'Diamond Key' : door.keyRequired;
        if (this.currentLevel?.id === 5 && door.id === 'd5_spire') {
          this.renderer.addFloatingText("Locked! Need Tower Gold Key from dungeon floor (press 'G' to plunge down)!", x, y, '#f7768e');
        } else {
          this.renderer.addFloatingText(`Need ${keyName}!`, x, y, '#f7768e');
        }
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

  updateLevelObjective() {
    if (!this.currentLevel) return;
    if (this.currentLevel.id === 5) {
      const hasGG = this.player.hasAbility('gg');
      const hasKey = (this.player.inventory.goldKey || 0) > 0;
      const door = this.entities.doors.find(d => d.id === 'd5_spire');
      const isDoorOpen = door?.isOpen;

      let objText = this.currentLevel.objective;
      if (isDoorOpen) {
        objText = "Walk right to (28, 2) to enter the staircase to Chapter 6!";
      } else if (hasKey && hasGG) {
        objText = "Press 'gg' to fly to top Spire (row 2) and unlock Spire Gate at (24, 2)!";
      } else if (hasGG && !hasKey) {
        objText = "Grab Tower Gold Key at dungeon end (26, 17), then press 'gg' to fly to Spire Gate!";
      } else if (!hasGG && hasKey) {
        objText = "Open ability chest at (15, 17) for 'gg' & 'G', then fly to Spire Gate!";
      }
      this.hud.setLevelInfo(this.currentLevel.name, objText);
    }
  }

  openHintsModal() {
    const hints = this.getCurrentHints();
    this.hud.openHints(hints);
  }

  getCurrentHints() {
    if (!this.currentLevel) return {};

    const lvl = this.currentLevel;
    const inv = this.player.inventory;
    const doors = this.entities.doors || [];
    const chests = this.entities.chests || [];
    const keys = this.entities.keys || [];

    // Compute immediate dynamic hint based on game progress
    let immediateHint = "";
    if (lvl.id === 5) {
      const hasGG = this.player.hasAbility('gg');
      const hasKey = (inv.goldKey || 0) > 0;
      const door = doors.find(d => d.id === 'd5_spire');
      const isDoorOpen = door?.isOpen;

      if (isDoorOpen) {
        immediateHint = "Spire Gate is unlocked! Walk right to (28, 2) and step onto the glowing staircase portal to enter Chapter 6! 🪜";
      } else if (hasKey && hasGG) {
        immediateHint = "You have both the Gold Key and 'gg'! Press 'gg' now to fly straight up to the Spire Battlement (row 2), then walk right to unlock the Spire Gate at (24, 2)!";
      } else if (hasGG && !hasKey) {
        immediateHint = "You have 'gg'! Now walk right along the dungeon floor to grab the Tower Gold Key at (26, 17)!";
      } else if (!hasGG && hasKey) {
        immediateHint = "You have the Gold Key! Now open the ancient chest at (15, 17) to unlock 'gg' and 'G' so you can soar to the Spire Gate!";
      } else {
        immediateHint = "Walk right along the dungeon floor to open the ancient chest at (15, 17) and unlock 'gg' and 'G'!";
      }
    } else {
      // General dynamic hint solver for any chapter
      const unopenedChest = chests.find(c => !c.isOpen);
      if (unopenedChest) {
        immediateHint = `Open the chest at (${unopenedChest.x}, ${unopenedChest.y}) to unlock essential Vim ability [${unopenedChest.reward.value}]!`;
      } else {
        const uncollectedKey = keys.find(k => !k.isCollected);
        if (uncollectedKey) {
          immediateHint = `Collect the ${uncollectedKey.name || uncollectedKey.keyType || 'key'} at (${uncollectedKey.x}, ${uncollectedKey.y})!`;
        } else {
          const lockedDoor = doors.find(d => !d.isOpen);
          if (lockedDoor) {
            if (lockedDoor.canUnlock(inv)) {
              immediateHint = `You have the key! Step into the locked gate at (${lockedDoor.x}, ${lockedDoor.y}) to open it.`;
            } else {
              immediateHint = `The gate at (${lockedDoor.x}, ${lockedDoor.y}) requires a ${lockedDoor.keyRequired}. Explore the room to find it!`;
            }
          } else if (this.entities.exit) {
            immediateHint = `Gate is unlocked! Walk to the glowing exit portal at (${this.entities.exit.x}, ${this.entities.exit.y}) to enter Chapter ${this.entities.exit.targetLevel}!`;
          } else {
            immediateHint = lvl.objective;
          }
        }
      }
    }

    const staticHints = lvl.hints || this.getDefaultLevelHints(lvl);

    return {
      title: lvl.name,
      subtitle: lvl.subtitle,
      objective: lvl.objective,
      immediateHint: immediateHint,
      walkthrough: staticHints.walkthrough || [lvl.objective],
      commands: staticHints.commands || [],
      tip: staticHints.tip || "Use Vim motions to navigate. Press '?' for the full cheatsheet."
    };
  }

  getDefaultLevelHints(lvl) {
    const defaultGuides = {
      1: {
        walkthrough: [
          "Follow the sandy path using h (left), j (down), k (up), and l (right).",
          "Talk to Sailor Jack near the pier at (18, 10) for nautical wisdom.",
          "Collect the Bronze Key resting in the cove at (18, 14).",
          "Unlock the Shore Gate at (21, 10) and walk to (26, 10) to advance to Chapter 2!"
        ],
        commands: [
          { key: "h / j / k / l", desc: "Move left / down / up / right along walkable path tiles" }
        ],
        tip: "Keep your right hand on home row: index finger on 'h', middle on 'j', ring on 'k', pinky on 'l'!"
      },
      2: {
        walkthrough: [
          "Talk to Island Hermit at (4, 3) to learn word leaping secrets.",
          "Open the chest at (7, 4) to unlock word leap abilities: w, b, e, and ge.",
          "Leap across water voids between islands using 'w' (word start) or 'e' (word end).",
          "Grab the Silver Key on the eastern atoll at (24, 7).",
          "Unlock the Reef Gate at (23, 10) and step to (24, 10) to enter Chapter 3!"
        ],
        commands: [
          { key: "w", desc: "Leap forward to the beginning of next word/island" },
          { key: "b", desc: "Leap backward to beginning of previous word/island" },
          { key: "e", desc: "Leap forward to the end of current/next word/island" },
          { key: "ge", desc: "Leap backward to the end of previous word/island" }
        ],
        tip: "'w' and 'b' land on the start of words, while 'e' and 'ge' land on ends. Use them to jump straight across ocean gaps!"
      },
      3: {
        walkthrough: [
          "Talk to Cliff Warden at (3, 2).",
          "Open the chest at (4, 4) to unlock line boundaries: 0, $, and ^.",
          "Press '$' to zip across the canyon ledge all the way to the right end.",
          "Collect the Gold Key at (25, 4).",
          "Press '0' or '^' to fly back to the cliff base, unlock Cliff Gate at (23, 8), and exit to Chapter 4!"
        ],
        commands: [
          { key: "$", desc: "Zip straight to the end of the current line" },
          { key: "0", desc: "Warp back to the very first character of the line" },
          { key: "^", desc: "Warp to the first non-blank character of the line" }
        ],
        tip: "Never hold 'l' across a long line! A single '$' takes you to the far end instantly."
      },
      4: {
        walkthrough: [
          "Open ability chest at (3, 4) to master inline seeker motions: f, t, F, and T.",
          "Use 'f{char}' to leap forward to specific letters on stepping stones across the river.",
          "Use 't{char}' to stop one tile before a hazard character.",
          "Collect the Canyon Ruby Key at (24, 6).",
          "Unlock the Canyon Gate at (25, 8) and step to the exit at (27, 8)!"
        ],
        commands: [
          { key: "f{char}", desc: "Find and jump forward to target character" },
          { key: "t{char}", desc: "Till: jump forward stopping just before target character" },
          { key: "F / T", desc: "Find / Till backward in the line" },
          { key: "; / ,", desc: "Repeat last inline find forward / backward" }
        ],
        tip: "Pressing ';' repeats your previous search character so you can hop across identical stones rapidly!"
      },
      5: {
        walkthrough: [
          "Open the ancient chest ahead at (15, 17) to unlock 'gg' (fly to top) and 'G' (plunge to bottom).",
          "Collect the Tower Gold Key at the far right of the dungeon floor at (26, 17).",
          "Type 'gg' to fly directly up to the Spire Battlement at the top of the tower (row 2).",
          "Walk right to unlock the Spire Gate at (24, 2) with your Gold Key.",
          "Step onto the glowing staircase portal at (28, 2) to advance to Chapter 6!"
        ],
        commands: [
          { key: "gg", desc: "Fly directly to topmost floor (Spire Battlement walkway at row 2)" },
          { key: "G", desc: "Plunge directly down to bottom dungeon floor (row 17)" },
          { key: "8G", desc: "Count jump: leap directly to row 8 (Balcony 3) to collect bonus gems" }
        ],
        tip: "Jump motions bypass all vertical walls and stairs in a single instant! Once the gate opens, step onto the glowing portal at (28, 2)."
      },
      6: {
        walkthrough: [
          "Talk to Forest Ranger at (3, 2).",
          "Open chest at (3, 4) to unlock paragraph jump motions: { and }.",
          "Press '}' to leap forward across glades divided by empty lines.",
          "Collect the Forest Emerald Key at (23, 14).",
          "Unlock Forest Gate at (24, 8) and enter the Chapter 7 portal at (26, 8)!"
        ],
        commands: [
          { key: "}", desc: "Leap forward to next empty line / paragraph boundary" },
          { key: "{", desc: "Leap backward to previous empty line / paragraph boundary" }
        ],
        tip: "'}' and '{' let you leap over entire blocks of code in Vim!"
      },
      7: {
        walkthrough: [
          "Open chest to unlock bracket matching '%'.",
          "Stand on any bracket '(', '[', or '{' and press '%' to teleport across deep chasms to its matching pair.",
          "Collect the Crypt Skull Key and unlock the Crypt Gate to advance to Chapter 8!"
        ],
        commands: [
          { key: "%", desc: "Teleport to the matching parenthesis, bracket, or curly brace" }
        ],
        tip: "In Vim, '%' instantly navigates between opening and closing tags, if/else blocks, and parentheses!"
      },
      8: {
        walkthrough: [
          "Prepend motion counts: type numbers before a motion like '4w', '3j', '5l'.",
          "Leap accurately across quicksand tiles with exact counts.",
          "Retrieve the Diamond Key and unlock the Oasis Gate to advance to Chapter 9!"
        ],
        commands: [
          { key: "{count}{motion}", desc: "Execute motion count times, e.g. 4w, 3j, 5l" }
        ],
        tip: "Count motions build speed—instead of pressing 'j' four times, hit '4j'!"
      },
      9: {
        walkthrough: [
          "Open chest to unlock 'x' (delete character / cut obstacle).",
          "Use 'x' to slice down overgrown brambles and weeds blocking narrow paths.",
          "Collect the Bronze Key and unlock the Meadow Gate to enter Chapter 10!"
        ],
        commands: [
          { key: "x", desc: "Cut / delete obstacle or weed tile under cursor" }
        ],
        tip: "'x' in Vim deletes the character under the cursor without entering insert mode."
      },
      10: {
        walkthrough: [
          "Open chest to unlock 'r' (replace character).",
          "Stand before broken path gaps and type 'r=' or 'r.' to repair stone bridge segments.",
          "Cross the repaired bridges to claim the Quarry Key and exit to Chapter 11!"
        ],
        commands: [
          { key: "r{char}", desc: "Replace current tile with specified character (e.g. r=)" }
        ],
        tip: "'r' replaces a single character in Vim instantly without leaving normal mode!"
      },
      11: {
        walkthrough: [
          "Talk to Chronos the Sage at (4, 3) to learn temporal undo mechanics.",
          "Beware the collapsing floor traps: stepping onto false runes triggers temporal dead-ends.",
          "Press 'u' to rewind time and undo accidental steps or trap triggers.",
          "Navigate the true chrono path to retrieve the Silver Key at (27, 8).",
          "Unlock the Chrono Gate at (24, 10) and enter Chapter 12!"
        ],
        commands: [
          { key: "u", desc: "Undo last step or action and rewind time" }
        ],
        tip: "In Vim, 'u' is your ultimate safety net—undo mistakes instantly to restore peace of mind!"
      },
      12: {
        walkthrough: [
          "Open chest to unlock '~' (toggle case).",
          "Step onto lower-case runic floor switches and press '~' to toggle uppercase, opening magnetic gates.",
          "Collect the Ruby Key and reach the exit portal to Chapter 13!"
        ],
        commands: [
          { key: "~", desc: "Toggle case of letter under cursor and advance" }
        ],
        tip: "'~' is the fastest way in Vim to switch between UPPERCASE and lowercase!"
      },
      13: {
        walkthrough: [
          "Open chest to unlock '*' (search word under cursor).",
          "Stand on glowing runic beacon words and press '*' to warp to identical beacons across the valley.",
          "Collect the Golden Beacon Key, unlock Valley Gate, and reach Chapter 14!"
        ],
        commands: [
          { key: "*", desc: "Search forward for word under cursor and warp to next match" },
          { key: "#", desc: "Search backward for word under cursor" }
        ],
        tip: "'*' is a super-power in Vim: place cursor on any variable and press '*' to jump to its next occurrence!"
      },
      14: {
        walkthrough: [
          "Open chest to unlock 'D' (delete to end of line).",
          "Press 'D' to demolish entire horizontal laser barriers in one stroke.",
          "Collect the Master Key and unlock the Vault Gate to enter the final Chapter 15!"
        ],
        commands: [
          { key: "D", desc: "Delete all obstacle characters to the end of the line" }
        ],
        tip: "'D' is equivalent to 'd$'—it vaporizes everything from cursor to line end!"
      },
      15: {
        walkthrough: [
          "The Grand Citadel of the Neovim Grandmaster: synthesize all your skills!",
          "Conquer the 4 elemental trials using gg, G, w, b, %, x, r, ~, *, and D.",
          "Collect all 4 Citadel Keys: Diamond, Ruby, Emerald, and Gold.",
          "Unlock the Grand Citadel Gate and ascend the Golden Throne for the Grandmaster Victory!"
        ],
        commands: [
          { key: "All Motions", desc: "Combine h/j/k/l, w/b/e, 0/$, gg/G, %, x, r, ~, *, D" }
        ],
        tip: "You have trained your muscle memory into a reflex. You are ready for true modal mastery in Neovim!"
      }
    };

    return defaultGuides[lvl.id] || {
      walkthrough: [lvl.objective],
      commands: [{ key: "h, j, k, l", desc: "Navigate the grid" }],
      tip: "Explore paths and collect keys to unlock the gate to the next chapter."
    };
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
        if (this.currentLevel?.id === 5) {
          this.renderer.addFloatingText("Press 'gg' to fly to the Spire Gate! ⬆️", px, py - 1, '#7dcfff');
          this.updateLevelObjective();
        }
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
              if (reward.value === 'gg') {
                this.dialogue.start('Treasure Chest', '🎁', [
                  reward.label,
                  "You can now fly vertically across buffer lines!",
                  "• Press 'gg' to fly directly to the top Spire Battlement.",
                  "• Press 'G' to plunge back down to the dungeon floor.",
                  "• Try counts like '8G' to land on Balcony 3!",
                  "NEXT STEP: Grab the Tower Gold Key at the right end of this dungeon floor (26, 17), then press 'gg' to fly to the Spire Gate!"
                ]);
                this.updateLevelObjective();
              } else {
                this.dialogue.start('Treasure Chest', '🎁', [
                  reward.label,
                  `You have mastered a new Vim motion! Check the ribbon below.`
                ]);
              }
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
      if (!Array.isArray(list)) continue;
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

// Auto bootstrap when DOM is ready or immediately if already interactive
if (typeof window !== 'undefined') {
  const boot = () => {
    if (window.adventureGame) return;
    window.adventureGame = new Game();
  };
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
}

  try { exports.Game = Game; } catch(e) {}
});

  // Start the application
  requireModule('', 'engine/game.js');
})();
