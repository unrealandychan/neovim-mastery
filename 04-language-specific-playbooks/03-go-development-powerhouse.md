# Chapter 4.3: Go Development Powerhouse

> *"Go and Neovim are a match made in heaven. With `gopls` and `gofumpt`, code formatting, package imports, and type checking are instantaneous."*

---

## 🐹 1. The Go Stack Configured

* **LSP**: `gopls` (official Google Go language server).
* **Formatters**: `gofumpt` (a stricter version of `gofmt`) + `goimports`.
* **Linter**: `golangci-lint`.
* **Inlay Hints**: Enabled by default (displays inferred types and parameter names inline).

---

## 🚀 2. Automatic Imports & Formatting on Save

When writing Go code in Neovim:
- You **never** need to write `import "fmt"` or `import "net/http"` by hand.
- Simply type `fmt.Println("hello")` and press `<leader>w` to save:
  - `goimports` immediately inserts `import "fmt"` at the top!
  - If you delete the `fmt.Println` statement and save, `goimports` removes the unused import automatically.
  - `gofumpt` enforces official idiomatic Go formatting.

---

## 🏷️ 3. Struct Tag & Interface Helpers

### Auto-Generating JSON / DB Struct Tags
When writing Go structs:
```go
type User struct {
    ID    int64
    Email string
}
```
1. Place cursor on the struct or field.
2. Press **`<leader>ca`** (Code Action).
3. Select `Add JSON tags` or `Add tags to struct`:
   ```go
   type User struct {
       ID    int64  `json:"id"`
       Email string `json:"email"`
   }
   ```

### Implementing Interfaces
Need a struct to implement `io.Reader` or `http.Handler`?
- Press `<leader>ca` on the struct name and select `Implement interface...`.

---

## 🏃 Day 25 Drill: Go Rapid Development

1. Create a file: `nvim /tmp/main.go`.
2. Write the following minimal code:
   ```go
   package main

   func main() {
       time.Sleep(100 * time.Millisecond)
   }
   ```
3. Notice there is no `import "time"`.
4. Press `<leader>w` to save.
5. Watch `import "time"` automatically appear at the top!
6. Type `time.` and see all functions and types autocompleted by `gopls`.
