# Chapter 1.1: The Four Essential Modes

To master Neovim, you must understand that the keyboard's behavior changes depending on which **Mode** you are currently in.

---

## 🎛️ Overview of the Four Modes

```
                    ┌──────────────┐
                    │ Normal Mode  │ ◄─── (Your default home base)
                    └──────┬───────┘
          ┌────────────────┼────────────────┐
          │ i, a, o, O     │ v, V, <C-v>    │ :
          ▼                ▼                ▼
   ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
   │ Insert Mode  │ │ Visual Mode  │ │ Command Mode │
   └──────┬───────┘ └──────┬───────┘ └──────┬───────┘
          │ <Esc>          │ <Esc>          │ <Esc> or <Enter>
          └────────────────┴────────────────┘
```

---

## 1. Normal Mode (Your Home Base)

This is where you start and where you should spend 90% of your time. Keys don't insert letters into the buffer; they execute motions and verbs.

- Indicator in statusline: `NORMAL` (Blue)
- How to enter: Press `<Esc>` from any other mode.

---

## 2. Insert Mode (Typing Text)

This is the only mode where pressing `a` actually writes the letter "a" to your file.

- Indicator in statusline: `INSERT` (Green)
- How to enter: There are multiple ways to enter Insert Mode depending on **where** you want your cursor to start:

| Key | Action                                              | Mental Cue           |
| :-- | :-------------------------------------------------- | :------------------- |
| `i` | Insert **before** current cursor                    | **i**nsert           |
| `a` | Append **after** current cursor                     | **a**ppend           |
| `I` | Insert at the **very beginning** of the line        | Big **I**ndent start |
| `A` | Append at the **very end** of the line              | Big **A**fter end    |
| `o` | Open a new line **below** current line and insert   | **o**pen below       |
| `O` | Open a new line **above** current line and insert   | **O**pen above       |
| `cl`| Change (delete) character and enter insert          | **c**hange **l**etter|
| `cc` / `S` | Change entire line (wipe line and enter insert)   | **S**ubstitute line  |

> [!NOTE]
> In classic Vim, `s` was substitute character (`cl`). In modern LazyVim, **`s` is mapped to `flash.nvim`** for instant 2-character visual teleportation across your entire screen! (See [Chapter 6.3](../06-plugin-mastery-and-ecosystem/03-flash-nvim-teleportation-motions.md)). To substitute a single character, use `cl` or `r{char}`.

> [!TIP]
> Pro-tip: Stop using `l` to move to the end of a line and pressing `i`. Just press `A`.  
> Stop using `Enter` to create a blank line below: just press `o` in Normal Mode!


---

## 3. Visual Mode (Selecting Text)

Visual mode allows you to highlight text, similar to clicking and dragging with a mouse.

- Indicator in statusline: `VISUAL` (Orange/Yellow)
- There are **three types** of visual mode:

| Key     | Visual Type                         | Best Used For                                           |
| :------ | :---------------------------------- | :------------------------------------------------------ |
| `v`     | **Character-wise** Visual Mode      | Highlighting specific words, phrases, or inside quotes  |
| `V`     | **Line-wise** Visual Mode           | Highlighting full lines (up/down)                       |
| `<C-v>` | **Block-wise** (Column) Visual Mode | Highlighting columns/rectangles (multi-cursor editing!) |

Once highlighted, you can press:

- `d` to delete (cut) the selection
- `y` to yank (copy) the selection
- `c` to change (delete and enter insert mode)
- `>` or `<` to indent/un-indent

---

## 4. Command-Line Mode (Ex Commands)

Used for editor-level tasks: saving, quitting, searching with regex, opening terminals, running system commands.

- Indicator: Prompt at bottom starting with `:` or `/`
- How to enter:
  - `:` — For commands (`:w`, `:q`, `:Lazy`, `:Mason`)
  - `/` — For forward text search
  - `?` — For backward text search
- How to exit: Press `<Esc>` or `<Enter>`.

---

## 🎯 Mode Switching Drill

Open any scratch buffer:

1. Press `o` → type `console.log("Neovim is fast");` → press `<Esc>`.
2. Press `O` → type `// Let's add a comment` → press `<Esc>`.
3. Press `A` → type ` // end of line` → press `<Esc>`.
4. Press `V` → press `d` to delete the entire line.
5. Press `u` to undo.

Notice how fluid switching between modes feels without touching a mouse.
