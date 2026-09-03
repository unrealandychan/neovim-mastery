# Chapter 2.1: Buffers, Windows & Tabs Demystified

> *"In VS Code, a file open in a tab is just a tab. In Neovim, **Buffers, Windows, and Tabs** are three distinct concepts. Master this distinction, and you will control complex multi-file layouts with ease."*

---

## 🏛️ The Three Concepts Defined

```
┌────────────────────────────────────────────────────────┐
│ Tab 1 (A workspace viewport)                           │
│ ┌───────────────────────────┬────────────────────────┐ │
│ │ Window A (View into Buf 1)│ Window B (View into 2) │ │
│ │ File: app.ts              │ File: api.ts           │ │
│ └───────────────────────────┴────────────────────────┘ │
└────────────────────────────────────────────────────────┘

Buffer = An in-memory copy of a file loaded in RAM.
Window = A viewport that displays a buffer.
Tab    = A collection / page of windows.
```

1. **Buffer**: The actual file content in memory. You can have 50 buffers open simultaneously without taking up screen space.
2. **Window**: A viewport (split) showing a buffer. You can view the *same* buffer in two different windows simultaneously (e.g. viewing the top and bottom of a 2,000 line file).
3. **Tab**: A layout containing one or more windows (like a virtual desktop or workspace).

---

## 📑 1. Buffer Management (Your File Tabs)

In your Tokyo Night setup, all active buffers are shown across the top bar (**Bufferline**).

| Keybinding | Action |
| :--- | :--- |
| **`<Shift>h`** | Go to the **previous buffer** (tab to the left) |
| **`<Shift>l`** | Go to the **next buffer** (tab to the right) |
| **`<leader>bd`** | **Delete / Close** the current buffer |
| **`<leader>bo`** | Close all **other** buffers except current |
| **`<leader>bp`** | Toggle **pin** on current buffer |
| **`<leader>fb`** | Open **Fuzzy Buffer Picker** (search through open files) |

---

## 🪟 2. Window Management (Splits)

Splitting your screen allows you to compare files, view tests next to source code, or refer to documentation side-by-side.

### Creating Splits:
- **`<leader>\|`** : Split window **vertically** (side-by-side)
- **`<leader>-`** : Split window **horizontally** (top and bottom)
- `:vsplit <filename>` : Split vertically and open `<filename>`
- `:split <filename>` : Split horizontally and open `<filename>`

### Navigating Between Splits:
LazyVim has seamless split navigation built-in:
- **`<C-h>`** : Focus window to the **left**
- **`<C-j>`** : Focus window **below**
- **`<C-k>`** : Focus window **above**
- **`<C-l>`** : Focus window to the **right**

### Resizing Splits:
- `<C-Up>` : Increase window height
- `<C-Down>` : Decrease window height
- `<C-Left>` : Decrease window width
- `<C-Right>` : Increase window width
- `<C-w>=` : Equalize all window sizes

### Closing Splits:
- `<C-w>c` or `<C-w>q` : Close the current window viewport (keeps the buffer alive in memory!)
- `<C-w>o` : Close all other windows, keeping ONLY the active window open.

---

## 🏃 Day 8 Drill: Layout Gymnastics

1. Open Neovim: `nvim README.md`
2. Press `<leader>\|` to open a vertical split.
3. In the new split, press `<leader><space>` and select another file (e.g. `01-mindset-and-mental-model.md`).
4. Jump back and forth between left and right windows using `<C-h>` and `<C-l>`.
5. Press `<leader>-` to create a horizontal split.
6. Equalize all windows with `<C-w>=`.
7. Focus the horizontal split and close it with `<C-w>c`.
8. Cycle through top buffer tabs with `<Shift>l` and `<Shift>h`.
