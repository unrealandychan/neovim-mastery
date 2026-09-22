/**
 * Text object locator for Vim grammar.
 * Finds range { start: {row, col}, end: {row, col} } for given object type.
 */
export function findTextObjectRange(buffer, cursor, isInner, type) {
  const line = buffer.getLine(cursor.row);
  const row = cursor.row;

  // 1. Quotes: ", ', `
  if (['"', "'", '`'].includes(type)) {
    const q = type;
    let openCol = -1;
    let closeCol = -1;

    // Search backwards for opening quote
    for (let c = cursor.col; c >= 0; c--) {
      if (line[c] === q) {
        openCol = c;
        break;
      }
    }
    // Search forwards for closing quote
    if (openCol !== -1) {
      closeCol = line.indexOf(q, openCol + 1);
    }
    // If cursor was before the first quote on line, find the next pair on this line
    if (openCol === -1 || closeCol === -1) {
      openCol = line.indexOf(q);
      if (openCol !== -1) {
        closeCol = line.indexOf(q, openCol + 1);
      }
    }

    if (openCol !== -1 && closeCol !== -1) {
      if (isInner) {
        return {
          start: { row, col: openCol + 1 },
          end: { row, col: closeCol },
        };
      } else {
        return {
          start: { row, col: openCol },
          end: { row, col: closeCol + 1 },
        };
      }
    }
    return null;
  }

  // 2. Pairs: (), [], {}, <>
  const pairMap = {
    '(': { open: '(', close: ')' },
    ')': { open: '(', close: ')' },
    'b': { open: '(', close: ')' },
    '[': { open: '[', close: ']' },
    ']': { open: '[', close: ']' },
    '{': { open: '{', close: '}' },
    '}': { open: '{', close: '}' },
    'B': { open: '{', close: '}' },
    '<': { open: '<', close: '>' },
    '>': { open: '<', close: '>' },
  };

  if (pairMap[type]) {
    const { open, close } = pairMap[type];
    const lines = buffer.getLines();
    let depth = 0;
    let openPos = null;
    let closePos = null;

    // Scan backwards from cursor on current line for open
    for (let c = cursor.col; c >= 0; c--) {
      if (line[c] === close) depth++;
      else if (line[c] === open) {
        if (depth === 0) {
          openPos = { row, col: c };
          break;
        }
        depth--;
      }
    }
    // If not found, scan backwards on previous lines
    if (!openPos) {
      for (let r = row - 1; r >= 0; r--) {
        const prevL = lines[r];
        for (let c = prevL.length - 1; c >= 0; c--) {
          if (prevL[c] === close) depth++;
          else if (prevL[c] === open) {
            if (depth === 0) {
              openPos = { row: r, col: c };
              break;
            }
            depth--;
          }
        }
        if (openPos) break;
      }
    }
    // If still not found, search forward on current line
    if (!openPos) {
      const idx = line.indexOf(open, cursor.col);
      if (idx !== -1) {
        openPos = { row, col: idx };
      }
    }

    if (openPos) {
      depth = 0;
      for (let r = openPos.row; r < lines.length; r++) {
        const l = lines[r];
        const startC = r === openPos.row ? openPos.col : 0;
        for (let c = startC; c < l.length; c++) {
          if (l[c] === open) depth++;
          else if (l[c] === close) {
            depth--;
            if (depth === 0) {
              closePos = { row: r, col: c };
              break;
            }
          }
        }
        if (closePos) break;
      }
    }

    if (openPos && closePos) {
      if (isInner) {
        if (openPos.row === closePos.row) {
          return {
            start: { row: openPos.row, col: openPos.col + 1 },
            end: { row: closePos.row, col: closePos.col },
          };
        } else {
          return {
            start: { row: openPos.row, col: openPos.col + 1 },
            end: { row: closePos.row, col: 0 },
          };
        }
      } else {
        return {
          start: { row: openPos.row, col: openPos.col },
          end: { row: closePos.row, col: closePos.col + 1 },
        };
      }
    }
    return null;
  }

  // 3. Words: iw, aw
  if (type === 'w') {
    let startCol = cursor.col;
    let endCol = cursor.col;
    while (startCol > 0 && /\w/.test(line[startCol - 1])) startCol--;
    while (endCol < line.length && /\w/.test(line[endCol])) endCol++;
    if (!isInner) {
      while (endCol < line.length && /\s/.test(line[endCol])) endCol++;
    }
    return {
      start: { row, col: startCol },
      end: { row, col: endCol },
    };
  }

  // 4. Arguments: ia, aa (comma-separated parameter)
  if (type === 'a') {
    // Look within enclosing parens for commas
    const parenRange = findTextObjectRange(buffer, cursor, true, '(');
    if (parenRange) {
      const innerStr = line.slice(parenRange.start.col, parenRange.end.col);
      const relCol = cursor.col - parenRange.start.col;
      const args = innerStr.split(',');
      let acc = 0;
      for (const arg of args) {
        const start = acc;
        const end = acc + arg.length;
        if (relCol >= start && relCol <= end + 1) {
          const matchStart = parenRange.start.col + start + (isInner ? arg.search(/\S/) : 0);
          const matchEnd = isInner
            ? parenRange.start.col + start + arg.trimEnd().length
            : parenRange.start.col + end + 1;
          return {
            start: { row, col: Math.max(parenRange.start.col, matchStart) },
            end: { row, col: Math.min(parenRange.end.col, matchEnd) },
          };
        }
        acc += arg.length + 1; // +1 for comma
      }
    }
  }

  // 5. Paragraph: ip, ap
  if (type === 'p') {
    const lines = buffer.getLines();
    let startRow = row;
    let endRow = row;
    while (startRow > 0 && lines[startRow - 1].trim() !== '') startRow--;
    while (endRow < lines.length - 1 && lines[endRow + 1].trim() !== '') endRow++;
    if (!isInner && endRow < lines.length - 1) endRow++;
    return {
      start: { row: startRow, col: 0 },
      end: { row: endRow, col: lines[endRow].length },
    };
  }

  // 6. Tag text object: it, at (<tag>...</tag>)
  if (type === 't') {
    const openTagRegex = /<([a-zA-Z0-9_-]+)[^>]*>/g;
    let match;
    while ((match = openTagRegex.exec(line)) !== null) {
      const tagName = match[1];
      const openStart = match.index;
      const openEnd = match.index + match[0].length;
      const closeTagStr = `</${tagName}>`;
      const closeStart = line.indexOf(closeTagStr, openEnd);
      if (closeStart !== -1) {
        const closeEnd = closeStart + closeTagStr.length;
        if (cursor.col >= openStart && cursor.col <= closeEnd) {
          if (isInner) {
            return {
              start: { row, col: openEnd },
              end: { row, col: closeStart },
            };
          } else {
            return {
              start: { row, col: openStart },
              end: { row, col: closeEnd },
            };
          }
        }
      }
    }
  }

  return null;
}
