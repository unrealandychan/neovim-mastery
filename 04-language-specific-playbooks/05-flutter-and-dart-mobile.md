# Chapter 4.5: Flutter & Dart Mobile Development Powerhouse

> *"Flutter's deeply nested widget trees are notoriously hard to read without closing labels and widget refactoring tools. Your custom setup brings full mobile IDE ergonomics to Neovim."*

---

## 📱 1. The Flutter Stack in Your Setup

Configured in [lua/plugins/flutter.lua](../nvim/lua/plugins/flutter.lua):
* **Language Server**: `dartls` (official Dart analysis server).
* **Tooling Engine**: `akinsho/flutter-tools.nvim`.
* **Closing Labels**: Automatically comments the closing bracket of every widget (e.g. `// Column`, `// Scaffold`, `// SizedBox`).
* **Widget Outline**: Tree view of your UI hierarchy.

---

## ⚡ 2. The Flutter Command Center Keybindings

All Flutter actions are grouped under **`<leader>f...`**:

| Keybinding | Action | Description |
| :--- | :--- | :--- |
| **`<leader>fr`** | **Flutter Run** | Prompts for target or runs active app with debugging output. |
| **`<leader>fl`** | **Flutter Hot Reload** | Blazing-fast stateful hot reload (sub-second UI update!). |
| **`<leader>fR`** | **Flutter Hot Restart** | Full app state reset and rebuild. |
| **`<leader>fs`** | **Select Device** | Floating picker of connected phones, simulators, or web browsers. |
| **`<leader>fe`** | **Launch Emulator** | Pick and start an iOS Simulator or Android AVD. |
| **`<leader>fo`** | **Widget Outline** | Opens an interactive tree view of your widget hierarchy. |
| **`<leader>fd`** | **Flutter DevTools** | Launches Flutter DevTools browser profiler. |
| **`<leader>fq`** | **Quit Session** | Stops the active Flutter debugging process. |

---

## 🧩 3. Widget Refactoring Code Actions (`<leader>ca`)

One of Flutter's most common tasks is wrapping or unwrapping widgets.

Place your cursor on any Widget name (e.g. `Text('Hello')`):
1. Press **`<leader>ca`** (Code Action).
2. You will see instant Flutter-specific refactorings:
   - `Wrap with Container`
   - `Wrap with Padding`
   - `Wrap with Center`
   - `Wrap with Column / Row`
   - `Wrap with Builder`
   - `Remove this widget`
3. Hit `<Enter>` on any action: Neovim refactors the AST and adjusts indents and commas automatically!

---

## 🏷️ 4. Closing Labels: Never Count Brackets Again

When you write nested Flutter code:
```dart
Scaffold(
  body: Center(
    child: Column(
      children: [
        Text('Hello, Eddie!'),
      ],
    ), // Column
  ), // Center
); // Scaffold
```
`flutter-tools.nvim` automatically renders the subtle grey comments `// Column`, `// Center`, `// Scaffold` right at the closing parentheses. You never have to trace indentation lines to see which closing paren belongs to which widget.

---

## 🏃 Day 27 Drill: Flutter Mobile Workflow

1. Open a Flutter project or sample widget file: `nvim /tmp/sample_widget.dart`.
2. Add a `Container` inside a `Column`.
3. Save the file with `<leader>w` and observe the closing tags appear.
4. Put cursor on the `Container`, press `<leader>ca`, and select `Wrap with Padding`.
5. Press `<leader>fs` to view your connected devices/simulators!
