# Chapter 5.2: Google AI Stack & AI Coding Agents

> *"Whether pairing with Google Antigravity, running the Pi agent harness, or querying Gemini CLI with buffer context — your Neovim setup provides instant, first-class AI orchestration with zero latency."*

---

## 🌟 1. The Native Google AI Stack in Neovim

Rather than relying on closed vendor lock-in or heavyweight web views, your configuration is engineered to orchestrate Google's premier AI coding tools directly inside Neovim via high-speed, non-blocking floating windows:

| Agent / Tool | Trigger Shortcut | Description |
| :--- | :--- | :--- |
| **Google Antigravity** | `<leader>aa` | Opens interactive Antigravity CLI (`agy`) agent in a floating terminal |
| **Antigravity Resume** | `<leader>ac` | Resumes your most recent Antigravity conversation (`agy -c`) |
| **Pi Coding Agent** | `<leader>ap` | Launches the Pi coding harness with tools (read, bash, edit, write) |
| **Pi Resume** | `<leader>aP` | Continues your previous Pi agent session (`pi -c`) |
| **Google Gemini CLI** | `<leader>ag` | Opens interactive Gemini terminal session |
| **Gemini Explain** | `<leader>ae` *(Visual)* | Sends highlighted code to Gemini with an explanation prompt |
| **Gemini Fix / Refactor** | `<leader>af` *(Visual)* | Sends highlighted code to Gemini to optimize, refactor, and fix bugs |
| **Ask Google AI** | `<leader>as` *(Normal/Visual)* | Prompts for a question and passes active buffer/selection context |

---

## 🕹️ 2. In-Editor Workflow: Context-Aware Prompts

### Instant Floating Terminals
Pressing `<leader>aa`, `<leader>ap`, or `<leader>ag` instantly spawns a sleek rounded floating terminal centered over your editor. You can interact with the agent, ask questions, run commands, and dismiss the terminal at any time with `<Esc>` or `<C-/>`.

### Visual Code Analysis & Refactoring
1. Enter Visual mode with `v` or `V` and highlight lines of code.
2. Press `<leader>ae`: Gemini launches with your code snippet and provides a breakdown of edge cases, complexity, and mechanics.
3. Press `<leader>af`: Gemini refactors the snippet for idioms, speed, and safety.
4. Press `<leader>as`: Neovim displays an input prompt where you can type any question or instruction (e.g., *"Convert this to async/await with error handling"*), and launches with your selected code as context!

---

## 🧩 3. LazyExtras Ecosystem (`:LazyExtras`)

LazyVim also provides an official interactive catalog for optional modules:

```vim
:LazyExtras
```

- **`x`** : Toggle the highlighted extra on or off!
- **`i`** : Inspect the extra's documentation and dependencies.
- **`/`** : Search for an extra (e.g., `lang.rust`, `lang.markdown`, `dap.core`).

When enabled, LazyVim automatically adds it to [lazyvim.json](../nvim/lazyvim.json) and configures keymaps and dependencies.

---

## 🏃 Day 29 Drill: Launching the Google AI Stack

1. Open any source file in Neovim (e.g. `practice/sample.ts`).
2. Press `<leader>aa` to invoke Google Antigravity. Inspect the interface, then type `exit` or close.
3. Select 5 lines in Visual Mode (`V4j`), then press `<leader>ae` to ask Gemini to explain them.
4. Press `<leader>ap` to toggle your Pi coding agent session.
5. Press `<Space>` and notice `a` is cleanly documented in Which-Key as `+ai (Google / Pi / Antigravity)`!
