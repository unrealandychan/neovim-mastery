# Chapter 6.3: Flash.nvim — Teleportation Motions & Remote Actions

> *"Why press `jjjjjww` or `/search` and cycle with `n` when you can teleport to any character on your screen in two keystrokes?"*

---

## ⚡ 1. The Death of Tedious Navigation

Traditional Vim navigation often looks like this:
- Pressing `j` five times, then `w` four times to reach a variable.
- Pressing `/functionName`, hitting `<Enter>`, then pressing `n` three times to get to the third occurrence.

**`flash.nvim`** (pre-installed and active in your setup) replaces all of this with **visual teleportation labels**:
1. You press **`s`**.
2. You type 1 or 2 characters of where you want to go.
3. Every match on the screen receives a distinctive single-letter colored label.
4. You press that letter, and your cursor lands precisely on target.

Response time: **< 100 milliseconds**. Keystrokes: **3**.

---

## 🚀 2. Core Flash Shortcuts

| Mode | Shortcut | Action | Description |
| :--- | :--- | :--- | :--- |
| **Normal / Visual** | **`s`** | **Flash Jump** | Search forward and backward across the entire window (and splits!). |
| **Normal / Visual** | **`S`** | **Treesitter Flash** | Highlights code blocks, functions, and parameters as syntax tree targets. |
| **Operator-Pending** | **`r`** | **Remote Flash** | Perform an action (yank, delete, change) on remote text **without moving cursor**! |
| **Operator-Pending** | **`R`** | **Treesitter Remote** | Perform an action on a remote Treesitter syntax node. |
| **Command (`/`)** | **`<C-s>`** | **Toggle Flash Search** | Toggle flash labels on/off during standard `/` search. |

---

## 🎯 3. Step-by-Step Walkthrough: The `s` Jump

Suppose you have this code on screen and your cursor is on line 1:

```typescript
1  const calculateTax = (price: number, rate: number): number => {
2    const total = price * rate;
3    if (total > 1000) {
4      return applyDiscount(total);
5    }
6    return total;
7  };
```

You want to move your cursor to `applyDiscount` on line 4:

1. Press **`s`**.
2. Type **`ap`** (the first two letters of `applyDiscount`).
3. Neovim dims the screen and places an uppercase label (e.g. `J`) directly on `applyDiscount`.
4. Press **`j`**.
5. Your cursor is instantly on line 4!

> [!TIP]
> Flash works **across all open window splits**! If you have two split windows side-by-side, pressing `s` will label targets in both windows. Typing the label will jump straight into the other window.

---

## 🌳 4. Treesitter Flash (`S`)

While `s` jumps to characters, **`S`** jumps to **code structures** (Abstract Syntax Tree nodes):

1. Put your cursor anywhere inside a function or loop.
2. Press **`S`**.
3. Flash analyzes the syntax tree and puts labels on:
   - The entire function body
   - The `if` condition block
   - The parameter list
   - The return statement
4. Type the label.
5. Neovim visually selects that entire syntax block in Visual Mode! You can now immediately press `y` to copy it, `d` to delete it, or `c` to rewrite it.

---

## 🧙‍♂️ 5. The Secret Weapon: Remote Flash (`r`)

This is one of the most powerful, jaw-dropping features in modern Neovim that graphical editors like VS Code simply cannot do.

**Scenario**: You are writing an argument list on line 50. You need to copy a variable name `customerBillingAddress` located on line 12.

### The Old Way:
1. Scroll up to line 12.
2. Position cursor on `customerBillingAddress`.
3. Press `yiw` (yank inner word).
4. Jump back down to line 50 with `Ctrl-O` or line numbers.
5. Paste.

### The Remote Flash Way (Never Leave Line 50!):
1. Stay on line 50.
2. Press **`y`** (Yank) followed by **`r`** (Remote Flash).
3. Type the first two letters of the word on line 12 (e.g., `cu`).
4. Type the jump label that appears on `customerBillingAddress`.
5. Type **`iw`** (Inner Word text object).
6. **Done!** The word on line 12 is yanked directly into your register, and **your cursor never moved from line 50**.
7. Now simply press `p` to paste it into line 50!

> [!IMPORTANT]
> Remote Flash works with any operator:
> - **`dr`**: Delete text remotely.
> - **`cr`**: Change text remotely (teleports you there, lets you edit, and returns).
> - **`yr`**: Yank text remotely without moving.

---

## ⚙️ 6. Customizing Flash Options

If you want to tweak Flash labels or behavior, you can configure it in `~/.config/nvim/lua/plugins/flash.lua`:

```lua
return {
  "folke/flash.nvim",
  event = "VeryLazy",
  opts = {
    labels = "asdfghjklqwertyuiopzxcvbnm", -- Keys used for jump labels
    search = {
      multi_window = true,                -- Search across all visible splits
      wrap = true,                        -- Wrap around buffer edges
    },
    modes = {
      char = {
        enabled = true,                   -- Enhance standard f/t/F/T motions
      },
    },
  },
}
```

---

## 💡 Key Takeaways

1. **`s`** is your go-to shortcut to jump anywhere on screen in 2 keystrokes.
2. **`S`** uses Treesitter to visually grab entire code blocks and functions instantly.
3. **`yr`** (Remote Yank) lets you copy code from anywhere on screen without losing your cursor position.
4. Flash searches across all split windows simultaneously.
