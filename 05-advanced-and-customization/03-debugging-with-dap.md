# Chapter 5.3: Debugging with DAP (Debug Adapter Protocol)

> *"Print debugging (`console.log`, `fmt.Println`, `print`) has its place. But for complex concurrency or memory bugs, you need a true step-through debugger."*

Just as LSP standardizes language servers, **DAP (Debug Adapter Protocol)** standardizes debuggers across editors. Your setup comes equipped with `codelldb` and debugger support.

---

## 🪲 1. The Core Debugger Controls

All debugging shortcuts live under **`<leader>d...`**:

| Keybinding | Action | Description |
| :--- | :--- | :--- |
| **`<leader>db`** | **Toggle Breakpoint** | Places a red dot (breakpoint) on the current line. |
| **`<leader>dB`** | **Conditional Breakpoint** | Prompts for an expression (e.g. `count > 100`). |
| **`<leader>dc`** | **Continue / Start** | Starts debugging or runs until the next breakpoint. |
| **`<leader>do`** | **Step Over** | Executes the current line without entering functions. |
| **`<leader>di`** | **Step Into** | Steps inside the highlighted function call. |
| **`<leader>dO`** | **Step Out** | Finishes the current function and returns to caller. |
| **`<leader>dt`** | **Terminate** | Stops and kills the debugging session. |
| **`<leader>du`** | **Toggle DAP UI** | Opens the visual debugger dashboard (call stack, watches, scopes). |

---

## 🖥️ 2. The DAP Visual Dashboard (`<leader>du`)

When your debugger hits a breakpoint, pressing `<leader>du` displays:
1. **Scopes / Variables**: Inspect local and global variables and their live values.
2. **Watch Expressions**: Add custom expressions to evaluate on every step.
3. **Call Stack**: Trace the execution path through all stack frames.
4. **Breakpoints**: Manage all active breakpoints across files.

---

## 🏃 Debugger Workout

1. Set a breakpoint on a function line using `<leader>db`.
2. Notice the red indicator appear in the gutter.
3. Press `<leader>du` to preview the debugging windows.
4. Press `<leader>du` again to close the debugging interface.
5. Press `<leader>db` to remove the breakpoint.
