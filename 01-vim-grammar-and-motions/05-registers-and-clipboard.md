# Chapter 1.5: Registers, Clipboard Secrets & Macros

> *"Why did my copied text disappear when I deleted something else?"*  
> Welcome to Neovim's register system. Once you understand it, you will never lose copied text again.

---

## 📋 1. Registers: Neovim's Multi-Clipboard System

In standard operating systems, you have **one** clipboard: if you copy A, then copy B, A is overwritten and gone forever.

In Neovim, you have **48 independent registers** (clipboards):
- Unnamed register (`""`)
- Numbered registers (`"0` through `"9`)
- Named letter registers (`"a` through `"z`)
- System clipboard (`"+` and `"*`)
- Black hole register (`"_`)

To inspect what is currently stored in all your registers:
```vim
:registers
```

---

## 🍎 2. macOS System Clipboard Integration

In your configuration ([options.lua](../nvim/lua/config/options.lua)), we have pre-configured:
```lua
opt.clipboard = "unnamedplus"
```
This means:
1. Whenever you yank with `y` (or `yy`, `yiw`, `yap`), it is **automatically copied to your macOS system clipboard**! You can switch to Chrome or Slack and press `Cmd+V` to paste.
2. Whenever you copy something in another app with `Cmd+C`, you can switch to Neovim and press `p` in Normal Mode to paste it immediately!

---

## 🕳️ 3. The Number One Neovim Frustration (And How to Solve It)

### The Problem
You copy a function name with `yiw`.  
Then you move to the destination where an old variable sits, and delete it with `dw`.  
You press `p` to paste your function name... **but it pastes the old variable you just deleted instead!** Why?

Because in Vim, **`d` (delete) actually means `cut`**! It overwrote the default register.

### The 3 Solutions:

#### Solution A: The "0" Yank Register (`"0p`)
Whenever you yank with `y`, Neovim **always** preserves a backup copy in register `0`. Deletes (`d`) never overwrite register `0`!
- Press `"0p` to paste the last yanked text, even if you deleted 10 things afterwards!

#### Solution B: The Black Hole Register (`"_d`)
If you want to delete something without copying it anywhere (true deletion):
- `"_dw` (delete word into the black hole `_`)
- `"_dd` (delete line into the black hole)

#### Solution C: Visual Paste Without Replacing Register
In your configuration, we added this custom keymap:
- In Visual mode, highlight the text you want to overwrite and press **`<leader>P`**!
- It pastes your clipboard content over the selection **without** replacing your clipboard with the overwritten text.

---

## 🎬 4. Macros: Recording & Automating Repetitive Tasks

A macro records a sequence of keystrokes into a letter register and lets you replay it hundreds of times.

### The Macro Syntax:
1. `q{letter}` : Start recording into register `{letter}` (e.g. `qa` records into register `a`).  
   *(Notice `recording @a` in the bottom statusline).*
2. Perform your editing steps using Normal mode motions.
3. `q` : Press `q` again in Normal Mode to stop recording.
4. `@a` : Replay the macro once!
5. `@@` : Replay the last played macro again.
6. `10@a` : Replay the macro **10 times in a row**!

### Real-World Macro Example: Converting Key-Value Pairs to JSON
Suppose you have a list:
```text
name: Alice
role: Developer
city: New York
```
To convert this to JSON (`"name": "Alice",`):
1. Place cursor at the start of line 1 (`name:`).
2. Type **`qa`** to start recording into register `a`.
3. Type **`i"`**, press **`f:`**, type **`i"`**, press **`w`**, type **`i"`**, press **`A",`**, press **`<Esc>`**, press **`j0`**.
4. Press **`q`** to stop recording.
5. Move to line 2, press **`@a`**.  
   *Line 2 transforms instantly.*
6. Press **`@@`** on line 3.  
   *Line 3 transforms instantly.*

---

## 🏃 Day 7 Drill: Register & Macro Mastery

1. Open `/tmp/macro_test.txt`
2. Write 5 lines:
   ```text
   user1
   user2
   user3
   user4
   user5
   ```
3. Record a macro `qa` that turns `user1` into `export const USER1 = "user1";`
4. Replay it across lines 2–5 using `4@a`!
