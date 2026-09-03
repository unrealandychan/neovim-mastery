# Chapter 4.2: Python Environment & Fast Workflow Playbook

> *"Python tooling used to be notorious for slow linters and messy virtual environments. With Pyright, Ruff, and Venv-Selector, Neovim transforms Python into a lightning-fast experience."*

---

## 🐍 1. The Python Architecture

* **Type Checker & LSP**: `pyright` (Microsoft's high-speed static type analysis engine).
* **Linter & Formatter**: `ruff` (written in Rust, replaces Black, Flake8, and isort; runs in ~10ms).
* **Virtualenv Manager**: `venv-selector.nvim` (auto-detects and switches Python virtualenvs).

---

## 🌐 2. Virtual Environment Switching (`<leader>cv`)

Python developers frequently switch between different virtual environments (`.venv`, Poetry, Pipenv, Conda, UV).

### How to Select a Virtualenv:
1. Inside any Python project, press **`<leader>cv`** (Code → Venv).
2. A floating picker appears searching your project, `~/.virtualenvs`, `~/.conda/envs`, and poetry cache.
3. Select your desired Python binary and press `<Enter>`.
4. Pyright immediately reloads its paths and recognizes all installed third-party libraries (`numpy`, `fastapi`, `pydantic`, `torch`, etc.)!

---

## ⚡ 3. Formatting & Linting with Ruff

Whenever you save a Python file (`<leader>w`):
1. **Ruff Format**: Formats the code strictly following PEP 8.
2. **Ruff Linter**: Automatically sorts imports (replacing `isort`) and removes unused imports.
3. **Pyright**: Validates type signatures, argument counts, and return types.

---

## 🏃 Day 24 Drill: Python Workflow

1. Create a Python file: `nvim /tmp/app.py`.
2. Deliberately add out-of-order imports and messy formatting:
   ```python
   import sys
   import json
   import os
   from typing import List, Dict, Optional

   def calculate_metrics(values: List[int]) -> float:
       total=sum(values)
       return total/len(values)
   ```
3. Save the file with `<leader>w`.
4. Observe Ruff instantly sort the imports and format the whitespace cleanly.
5. Place cursor on `calculate_metrics` and press `K` to view the inferred return type and docstring.
