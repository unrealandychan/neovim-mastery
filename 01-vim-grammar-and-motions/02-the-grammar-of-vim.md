# Chapter 1.2: The Grammar of Vim (Editing Like Spoken Language)

The single biggest breakthrough when learning Neovim is realizing you are **not memorizing random key combinations**. You are learning a **language with grammar**.

In English, you construct sentences like:
> *"Delete three words"*  
> *"Change inside quotes"*  
> *"Yank (copy) around paragraph"*

In Neovim, you write the exact same sentence in keystrokes:
```
[Verb]  +  [Count]  +  [Adverb/Modifier]  +  [Noun / Motion]
```

---

## 🔤 The Vocabulary

### 1. The Core Verbs (Operators)
These keys tell Neovim **what action** to take:

| Verb | Meaning | Mnemonic |
| :--- | :--- | :--- |
| `d` | **Delete** (cuts to register) | **D**elete |
| `c` | **Change** (deletes and drops you into Insert Mode) | **C**hange |
| `y` | **Yank** (copies to register) | **Y**ank |
| `v` | **Visual Select** (highlights the target) | **V**isual |
| `>` | **Indent** | Indent right |
| `<` | **Unindent** | Indent left |
| `=` | **Format / Auto-indent** | Equalize |

---

### 2. The Modifiers (Adverbs: Inner vs Around)
Used with text objects to define boundaries:

| Modifier | Meaning | Behavior |
| :--- | :--- | :--- |
| `i` | **Inside / Inner** | Targets only the content *inside* the delimiters, excluding surrounding quotes/brackets. |
| `a` | **Around / A** | Targets the content *plus* the surrounding delimiters/whitespace. |

---

### 3. The Nouns (Text Objects & Targets)
These tell Neovim **what target** to act upon:

| Noun | Target Object |
| :--- | :--- |
| `w` | **Word** |
| `W` | **WORD** (delimited only by whitespace, ignores punctuation) |
| `s` | **Sentence** |
| `p` | **Paragraph** (code block between blank lines) |
| `"` or `'` or `` ` `` | **Quotes** (`"string"`, `'char'`, `` `template` ``) |
| `(` or `)` or `b` | **Parentheses** `(args, list)` |
| `{` or `}` or `B` | **Braces / Blocks** `{ code block }` |
| `[` or `]` | **Square brackets** `[array, items]` |
| `<` or `>` | **HTML / XML tags** `<Component />` or `<t>` |
| `t` | **Tag** (entire HTML/JSX tag block) |

---

## 💡 Putting It Together: Real World Examples

Observe how natural this grammar becomes:

### 1. Working with Strings
Imagine cursor is inside `"User Authentication Failed"`:
- `ci"` → **C**hange **I**nside **"**  
  *Result: deletes `User Authentication Failed` and puts you in Insert Mode inside `""` ready to type the new string!*
- `di"` → **D**elete **I**nside **"**  
  *Result: leaves empty `""`.*
- `da"` → **D**elete **A**round **"**  
  *Result: deletes the string AND the surrounding quotation marks.*

### 2. Working with Function Arguments
Imagine cursor is inside `calculateTax(income, rate, deductions)`:
- `ci(` or `cib` → **C**hange **I**nner **B**rackets  
  *Result: deletes all arguments and leaves `calculateTax(|)` in Insert Mode.*
- `da(` → **D**elete **A**round **B**rackets  
  *Result: leaves `calculateTax` without parentheses.*

### 3. Working with Words
Imagine cursor is on `current_user_profile`:
- `ciw` → **C**hange **I**nside **W**ord  
  *(Works even if your cursor is in the middle of the word! No need to backspace from the end).*
- `diw` → **D**elete **I**nside **W**ord
- `yiw` → **Y**ank (copy) **I**nside **W**ord

### 4. Working with Blocks & Paragraphs
Imagine cursor is inside a JavaScript function `{ ... }`:
- `ci{` or `ciB` → **C**hange **I**nside **B**lock  
  *Result: wipes the entire function body and leaves empty `{}` ready for new code!*
- `yap` → **Y**ank **A**round **P**aragraph  
  *Result: copies the entire function or block with its surrounding whitespace.*
- `dap` → **D**elete **A**round **P**aragraph

---

## 🔢 The Secret Weapon: Counts
You can prefix almost any motion or grammar sentence with a number count:

- `3w` → Jump forward 3 words
- `d2w` → Delete 2 words
- `5j` → Move down 5 lines
- `y2p` → Yank 2 paragraphs
- `c3w` → Change the next 3 words

---

## ⚡ The Dot Operator (`.`): Neovim's Superpower

The single period key `.` in Normal Mode repeats **the last change command**.

Suppose you need to delete inside three different quotes:
1. Move to first quote: `ci"` → type new text → `<Esc>`.
2. Move to second quote: press `.` (it instantly repeats the same change!).
3. Move to third quote: press `.`.

> [!TIP]
> Whenever you perform an edit with `c`, `d`, or `s`, ask yourself: *"Can I do this once and repeat it with `.`?"* This is how Neovim masters edit code 5x faster than anyone else.

---

## 🚀 Modern Evolution: Supercharged Nouns with `mini.ai`

Standard Vim only knows text objects like words, quotes, and paragraphs. Your LazyVim setup extends this grammar with **`mini.ai`**, giving you code-aware nouns:
- **`daa`**: Delete **a**n argument (including its comma!).
- **`daf`**: Delete **a** **f**unction.
- **`dac`**: Delete **a** **c**lass.

Learn all modern text objects in **[Chapter 6.6: Micro-Productivity & Modern Editing Plugins](../06-plugin-mastery-and-ecosystem/06-micro-productivity-and-editing-plugins.md)**!

