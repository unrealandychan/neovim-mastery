# Chapter 1.3: Movement Mastery (Precision Navigation Without Arrow Keys)

> *"If you are holding down `h`, `j`, `k`, or `l` for more than 2 seconds, you are using the wrong motion."*

In this chapter, you will learn the exact motions that allow you to teleport your cursor anywhere on the screen in 1 or 2 keystrokes.

---

## 🏃 1. Word Navigation: Jumping by Tokens

Instead of moving character-by-character, hop through code by words:

| Key | Motion | Mental Cue |
| :--- | :--- | :--- |
| `w` | Jump to the **start** of the **next word** | **w**ord forward |
| `b` | Jump to the **start** of the **previous word** | **b**ackward |
| `e` | Jump to the **end** of the **current / next word** | **e**nd of word |
| `ge` | Jump to the **end** of the **previous word** | reverse **e** |

### `w` vs `W` (Word vs Big WORD)
* Small `w`: Punctuation counts as word boundaries. In `user.profile.getName()`, `w` stops at `user`, `.`, `profile`, `.`, `getName`, `(`, `)`.
* Big `W`: Only separated by whitespace! `user.profile.getName()` is treated as **one single token**. Big `W` jumps right over all dots and parens!

---

## 🎯 2. In-Line Seeking: The `f` and `t` Family

The fastest way to move horizontally on the current line is using the `f` (find) and `t` (till) character finders.

| Key | Motion | Example |
| :--- | :--- | :--- |
| `f{char}` | Jump **forward** and land directly **on** `{char}` | `f;` jumps straight to the semicolon at the end of the line! |
| `F{char}` | Jump **backward** and land directly **on** `{char}` | `F(` jumps back to the open parenthesis |
| `t{char}` | Jump **forward** and stop right **before (till)** `{char}` | `dt)` deletes everything *till* the closing parenthesis |
| `T{char}` | Jump **backward** and stop right **after** `{char}` | `cT"` changes everything back till the quote |

### The Semicolon (`;`) and Comma (`,`) Repeaters
After pressing `f:` to jump to a colon:
- Press `;` to repeat the jump forward to the **next** colon on that line!
- Press `,` to repeat the jump in the **reverse** direction.

> [!TIP]
> Combining verbs with `t`:  
> `dt;` = Delete everything from current cursor *till* the semicolon!  
> `ct=` = Change everything up *till* the equals sign!

---

## 📏 3. Line Boundaries: Start, Indent, and End

| Key | Motion | Where It Lands |
| :--- | :--- | :--- |
| `0` (Zero) | Absolute column 0 | The very left edge of the buffer (including indentation whitespace) |
| `^` (Caret) | First non-blank character | The beginning of the actual code on that line (ignoring indentation) |
| `$` | End of line | The last character of the line |

---

## 📜 4. Vertical Leaps: Screen & File Navigation

| Key | Target |
| :--- | :--- |
| `gg` | Jump to the **very first line** of the file |
| `G` | Jump to the **very last line** of the file |
| `{number}G` or `:{number}<CR>` | Jump to exact line `{number}` (e.g. `42G` jumps to line 42) |
| `<C-d>` | Scroll **half-page down** (customized in our setup to keep cursor centered!) |
| `<C-u>` | Scroll **half-page up** (centered) |
| `{` | Jump backward one **paragraph / code block** |
| `}` | Jump forward one **paragraph / code block** |
| `H` | High: Jump to the **top** of the current visible screen |
| `M` | Middle: Jump to the **exact middle** of the current visible screen |
| `L` | Low: Jump to the **bottom** of the current visible screen |

---

## 🔍 5. Search Navigation (`/` and `?`)

If you see a word on your screen and want to jump to it:
1. Press `/`
2. Type 2 or 3 letters of the word
3. Press `<Enter>`
4. Press `n` to jump to the **next match**.
5. Press `N` to jump to the **previous match**.
6. Press `<Esc>` anytime to clear highlighting!

### The Asterisk (`*`) Instant Search
Hover your cursor over any variable or function name in Normal Mode and press `*`:
- Neovim immediately highlights every occurrence of that variable in the file.
- Press `n` and `N` to cycle through them!

---

## 🏃 Day 5 Drill: Navigation Gauntlet

Open any code file:
1. Press `gg` to go to the top, then `G` to go to the bottom.
2. Jump to line 20 with `20G`.
3. Jump to the first non-blank character with `^`.
4. Jump forward to the next comma with `f,`. Press `;` twice to jump to the next commas.
5. Press `$` to jump to the end of the line. Press `0` to jump back to column 0.
6. Press `<C-d>` twice to scroll down, then `<C-u>` to scroll up.

---

> [!TIP]
> **Modern Neovim Superpower**: In addition to standard Vim motions, your setup includes **`flash.nvim`**. Press **`s`**, type 2 letters of any word on your screen, and teleport there in 1 keystroke! See **[Chapter 6.3: Flash.nvim Teleportation Motions](../06-plugin-mastery-and-ecosystem/03-flash-nvim-teleportation-motions.md)**.

