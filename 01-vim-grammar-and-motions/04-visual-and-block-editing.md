# Chapter 1.4: Visual & Block Editing (Multi-Cursor Magic)

> *"VS Code has multi-cursor (`Cmd+D`). Neovim has something even more powerful: **Visual Block Mode**."*

In this chapter, you will learn how to select text with surgical precision and edit multiple columns of code simultaneously.

---

## 🎭 The Three Visual Flavors

```
      v                   V                  <C-v>
[Character-wise]     [Line-wise]         [Block / Column]
"Select words or    "Select whole lines "Select rectangular
 phrases anywhere"   up and down"        blocks of text"
```

---

## 1. Character Visual Mode (`v`)
- Press `v` in Normal Mode.
- Move with `w`, `b`, `f{char}`, `e`, `h`, `j`, `k`, `l` to expand your highlight.
- Press `o` while in Visual Mode to **jump between the beginning and end of the selection**! This is invaluable if you need to adjust the start of your highlight without losing the end.

---

## 2. Line Visual Mode (`V` - Shift+v)
- Press `V` in Normal Mode.
- Move `j` or `k` to highlight entire lines at a time.
- **Actions on selected lines**:
  - `>` : Indent all selected lines right (our setup keeps selection active so you can press `>` multiple times!)
  - `<` : Un-indent all selected lines left
  - `d` : Delete all selected lines
  - `y` : Copy all selected lines
  - `c` : Delete all selected lines and start typing replacement
  - `:s/find/replace/g` : Perform search-and-replace restricted **only** to the selected lines!

---

## 3. Visual Block Mode (`<C-v>` - Ctrl+v): Column Multi-Editing

Visual Block mode allows you to create rectangular selections. This is Neovim's equivalent of multi-cursor editing, but faster and more deterministic.

### Example 1: Commenting Out Multiple Lines
Suppose you have 5 lines of code:
```javascript
const a = 1;
const b = 2;
const c = 3;
const d = 4;
const e = 5;
```
To comment all 5 lines with `// `:
1. Move cursor to the `c` of `const a`.
2. Press **`<C-v>`** (statusline displays `VISUAL BLOCK`).
3. Press **`4j`** (or `j` four times) to select the first column across all 5 lines.
4. Press **`I`** (Capital `I` = Insert at the beginning of the block).
5. Type `// ` (notice only the first line changes initially—this is normal!).
6. Press **`<Esc>`**.  
   *Boom! All 5 lines instantly update with `// `!*

---

### Example 2: Appending Semicolons or Commas to Multiple Lines
Suppose you have an array list:
```javascript
"apple"
"banana"
"cherry"
"durian"
```
To append `,` to the end of every line:
1. Place cursor on the first line.
2. Press **`<C-v>`**.
3. Press **`3j`** to select down the column.
4. Press **`$`** (dollar sign = extend block to the end of each line, even if lengths differ!).
5. Press **`A`** (Capital `A` = Append at the end of the block).
6. Type `,`.
7. Press **`<Esc>`**.  
   *All 4 lines now have commas at the end!*

---

### Example 3: Changing a Column of Data
Suppose you have:
```text
Item: 100 USD
Item: 200 USD
Item: 300 USD
```
To change `USD` to `EUR`:
1. Place cursor on `U` of `USD` in the first line.
2. Press **`<C-v>`**, then **`2j`**, then **`2l`** (or `e`) to highlight the 3x3 rectangle of `USD`.
3. Press **`c`** (change).
4. Type `EUR`.
5. Press **`<Esc>`**.  
   *All three lines now say `EUR`.*

---

## 🏃 Day 7 Drill: Visual Mastery

Create a scratch file:
1. Write 5 lines of dummy text.
2. Use `<C-v>` to add `>` to the beginning of all 5 lines.
3. Use `<C-v>` with `$` to append ` // verified` to all 5 lines.
4. Use `V` to highlight the entire block, and press `>` twice to indent it.
