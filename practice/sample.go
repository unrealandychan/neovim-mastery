package main

import (
	"fmt"
	"time"
)

// Practice:
// 1. Inlay hints: notice parameter and inferred type hints.
// 2. Add JSON struct tags: put cursor on 'ServerConfig' or its fields, press <Space>ca, select "Add JSON tags".
// 3. Auto-imports: remove the "fmt" import above, save with <Space>w, watch goimports restore it!
// 4. Format on save: add extra spaces or uneven indents, save with <Space>w to see gofumpt format it.

type ServerConfig struct {
	Host         string
	Port         int
	ReadTimeout  time.Duration
	WriteTimeout time.Duration
	EnableTLS    bool
}

func NewDefaultConfig() *ServerConfig {
	return &ServerConfig{
		Host:         "127.0.0.1",
		Port:         8080,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		EnableTLS:    true,
	}
}

func main() {
	cfg := NewDefaultConfig()
	fmt.Printf("Server starting on %s:%d (TLS=%t)\n", cfg.Host, cfg.Port, cfg.EnableTLS)
}
