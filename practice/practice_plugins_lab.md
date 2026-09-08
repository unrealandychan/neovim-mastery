# 🧪 Hands-On Practice Lab: Modern Neovim Plugins

> Open this file directly in Neovim:
> ```bash
> nvim practice/practice_plugins_lab.md
> ```
> Work through each exercise below directly in this buffer to build true muscle memory for your installed plugins!

---

## 🎯 Lab 1: Flash.nvim Teleportation & Remote Actions

### Exercise 1.1: Visual Jump (`s`)
1. Place your cursor on line 18 below (the first line of the code block).
2. Without using `j` or arrow keys, jump to the word `TARGET_ALPHA` on line 26:
   - Press **`s`**.
   - Type **`ta`**.
   - Press the single-letter highlight label that appears over `TARGET_ALPHA`.
   - Your cursor should land directly on it!

```typescript
// --- BEGIN LAB 1.1 CODE ---
function processPaymentWorkflow(orderId: string, amount: number) {
  const transactionFee = calculateFee(amount);
  const total = amount + transactionFee;
  
  if (total > 500) {
    applyVipDiscount(orderId);
  }

  const status = TARGET_ALPHA; // <--- JUMP HERE WITH `s` + `ta`
  return notifyCustomer(status);
}
// --- END LAB 1.1 CODE ---
```

---

### Exercise 1.2: Remote Yank (`yr`) — NEVER LEAVE YOUR LINE!
1. Place your cursor on the comment line below: `const mySecret = "";`
2. Keep your cursor inside the empty string `""`.
3. You need to copy the string `"SUPER_SECURE_TOKEN_2026"` from line 46 below **without moving your cursor down there**:
   - Press **`y`** then **`r`** (Remote Yank).
   - Type **`su`**.
   - Type the jump label that appears on `SUPER_SECURE_TOKEN_2026`.
   - Type **`iq`** (Inside Quotes text object).
   - Your cursor never left line 38!
4. Press **`P`** to paste the yanked token into `""`.

```typescript
// Line 38: Cursor stays right here!
const mySecret = ""; 

// Other code in between...
function generateKey() {
  const salt = 12345;
  return salt * 2;
}

// Line 46:
const remoteConfig = { token: "SUPER_SECURE_TOKEN_2026" };
```

---

### Exercise 1.3: Treesitter Flash Selection (`S`)
1. Place your cursor anywhere on the `console.log` line below.
2. Press **`S`** (capital S).
3. Notice how Flash highlights syntax nodes: the whole `for` loop, the inner block, the function.
4. Type the label covering the entire `for` loop.
5. Notice that the entire loop is now visually selected! Press `y` to copy it.

```typescript
function calculateSum(items: number[]) {
  let sum = 0;
  for (const item of items) {
    console.log("Adding item: ", item);
    sum += item;
  }
  return sum;
}
```

---

## ⚡ Lab 2: `mini.ai` Smart Text Objects

### Exercise 2.1: Clean Argument Deletion (`daa`)
In the function call below, delete the argument `"obsolete_param_3"`:
1. Place your cursor anywhere inside `"obsolete_param_3"`.
2. Type **`daa`** (Delete Around Argument).
3. Notice how it cleanly removes both the string AND its adjacent comma! No leftover syntax errors.

```typescript
sendAnalyticsEvent("user_signup", 200, "obsolete_param_3", true);
```

### Exercise 2.2: Change Inside Function (`cif`)
1. Place your cursor anywhere inside `complexLegacyAlgorithm` below.
2. Type **`cif`** (Change Inside Function).
3. The entire body between `{ ... }` is wiped, and you are immediately placed in Insert Mode to write clean code! Press `<Esc> u` to undo when finished testing.

```typescript
function complexLegacyAlgorithm(a: number, b: number) {
  const step1 = a * 2;
  const step2 = b * 3;
  const step3 = Math.sqrt(step1 + step2);
  return step3 / 2;
}
```

---

## 🔍 Lab 3: Project Search & Replace with Grug-Far (`<leader>sr`)

1. Highlight the word `oldInternalHelper` below using `viw`.
2. Press **`<leader>sr`**.
3. Notice how Grug-Far opens with `oldInternalHelper` already in the `Search:` input!
4. Move down to `Replace:`, enter Insert Mode (`i`), and type `modernFastHelper`.
5. Look at the bottom half: notice the live `+` / `-` diff preview.
6. Press `<localleader>s` (or hover over `[Sync]` and hit `<Enter>`) to apply, or simply close the buffer with `q`.

```typescript
function executePipeline() {
  const data = oldInternalHelper();
  return oldInternalHelper() + data;
}
```

---

## 🖥️ Lab 4: Snacks.nvim Power Tools

### Exercise 4.1: Floating Terminal (`<C-/>` or `<leader>ft`)
1. Press **`<C-/>`** (or `<leader>ft`).
2. A floating terminal appears!
3. Type: `echo "Hello from Neovim Floating Terminal!"` and press `<Enter>`.
4. Press **`<C-/>`** again. The terminal disappears.
5. Press **`<C-/>`** once more. Notice your command output is still there!

### Exercise 4.2: Instant Scratchpad (`<leader>.`)
1. Press **`<leader>.`** (Space followed by dot).
2. A floating scratchpad opens.
3. Write: `TODO: Review Neovim plugin mastery guide tomorrow morning.`
4. Press `q` to close it.
5. Press **`<leader>.`** again: your note was automatically saved!

### Exercise 4.3: Reference Hopping (`]]` & `[[`)
1. Place cursor on the variable `counterState` in line 140 below.
2. Press **`]]`**: you jump straight to line 142.
3. Press **`]]`** again: you jump to line 145.
4. Press **`[[`**: you jump back up to line 142.

```typescript
// Line 140:
let counterState = 0;

function increment() {
  counterState += 1;
}

function reset() {
  counterState = 0;
}
```

---

## 🏷️ Lab 5: Todo-Comments Exploration (`]t`, `<leader>st`)

Below are three test action tags:

// TODO: Refactor authentication token validation to use JWT
// FIXME: Resolve null pointer exception when user has no avatar
// PERF: Cache database queries for customer profile

### Try These:
1. Put cursor on line 150.
2. Press **`]t`**: your cursor jumps straight to the `TODO:` comment.
3. Press **`]t`** again: cursor jumps to `FIXME:`.
4. Press **`<leader>st`**: Snacks Picker opens, listing all TODO comments across this repository!
5. Press **`<leader>xt`**: Trouble opens, showing every TODO in an interactive collapsible panel.

---

## 🏆 Lab 6: Inspecting Your Plugins & Health

1. Type **`:Lazy`**:
   - Inspect the loaded vs lazy plugins.
   - Press `/` and type `flash` to see how fast it loaded.
   - Press `q` to exit.
2. Type **`:checkhealth`**:
   - Confirm all providers, clipboard, and Mason packages are green!
   - Press `q` to exit.

🎉 **Congratulations! You have completed the Neovim Plugin Mastery Lab!**
