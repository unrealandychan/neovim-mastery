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
}
