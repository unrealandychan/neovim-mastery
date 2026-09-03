# Chapter 4.4: Rust Craftsmanship with Rustaceanvim

> *"Rust's compiler is famously demanding. With `rustaceanvim` and `rust-analyzer`, you get deep compiler diagnostics, macro expansion, and inline crate version info directly inside your editor."*

---

## 🦀 1. The Rust Environment

* **Language Engine**: `rustaceanvim` + `rust-analyzer` (inlay hints, borrow-checker analysis, macro expansion).
* **Dependency Intelligence**: `crates.nvim` (manages `Cargo.toml` dependencies and checks crates.io for updates).
* **Debugger**: `codelldb` (LLVM-based native debugger).

---

## 📦 2. Cargo.toml Intelligence (`crates.nvim`)

Open any `Cargo.toml` file in Neovim:
- Next to each dependency (e.g. `serde = "1.0"`), `crates.nvim` displays:
  - The **latest version** available on crates.io.
  - A subtle indicator if your current version is outdated.
- Place cursor on a dependency and:
  - `<leader>cu` : Upgrade to the latest version of that crate!
  - `K` : View the crate's documentation, repository link, and feature flags.

---

## 🔍 3. Macro Expansion & Explanations

Rust macros (like `#[derive(Serialize)]` or `vec![]`) generate hidden code under the hood.

To see what code a macro expands to:
1. Place cursor on the macro or derive attribute.
2. Run `:RustLsp expandMacro` (or via `<leader>ca`).
3. Neovim opens a floating buffer showing the generated Rust code!

To explain a compiler error:
- Run `:RustLsp explainError` to read the official Rust compiler explanation and suggested fixes.

---

## 🏃 Day 26 Drill: Rust Workflow

1. Open or create a `main.rs` file.
2. Write a struct with derived traits:
   ```rust
   #[derive(Debug, Clone)]
   struct User {
       id: u64,
       username: String,
   }

   fn main() {
       let u = User { id: 1, username: String::from("eddie") };
       println!("{:?}", u);
   }
   ```
3. Hover over `u` and press `K` to inspect the inferred type.
4. Intentionally cause a borrow error (`let u2 = u; println!("{:?}", u);`).
5. Observe rust-analyzer's red squiggle, tap `]d` to jump to it, and press `<leader>cd` to read the borrow checker explanation!
