/**
 * Tilemap & Grid Physics Engine
 * Handles 2D text-world tiles, collision, and word-boundary spatial queries.
 */

export const TileType = {
  VOID: ' ',
  GRASS: '.',
  PATH: '=',
  WALL: '#',
  WATER: '~',
  TREE: 'T',
  PORTAL: '@',
};

export class Tilemap {
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
