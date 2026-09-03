#!/usr/bin/env bash
set -e

# ==============================================================================
# Neovim Mastery - Configuration Installer & Setup Script
# ==============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NVIM_SRC="$SCRIPT_DIR/nvim"
TARGET_DIR="${XDG_CONFIG_HOME:-$HOME/.config}/nvim"

echo "============================================================"
echo " 🥋 Neovim Mastery Setup & Configuration Installer"
echo "============================================================"
echo ""

# 1. Check for Neovim installation
if ! command -v nvim &> /dev/null; then
  echo "⚠️  Neovim is not installed or not found in PATH."
  echo "👉 On macOS, install it using: brew install neovim"
  echo "👉 On Linux, install Neovim v0.10+ using your package manager or appimage."
  echo ""
  read -p "Do you want to proceed with copying configuration anyway? [y/N] " -n 1 -r
  echo ""
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
else
  NVIM_VERSION=$(nvim --version | head -n 1)
  echo "✅ Found $NVIM_VERSION"
fi

# 2. Check for Git
if ! command -v git &> /dev/null; then
  echo "⚠️  Git is required by Lazy.nvim to download plugins."
  echo "👉 Please install git before launching Neovim."
fi

# 3. Handle existing configuration
if [ -e "$TARGET_DIR" ]; then
  TIMESTAMP=$(date +%Y%m%d_%H%M%S)
  BACKUP_DIR="${TARGET_DIR}.backup.${TIMESTAMP}"
  echo ""
  echo "ℹ️  Existing Neovim config detected at: $TARGET_DIR"
  echo "📦 Backing up existing config to: $BACKUP_DIR"
  mv "$TARGET_DIR" "$BACKUP_DIR"
fi

# 4. Link or copy configuration
echo ""
echo "How would you like to install the configuration?"
echo "  1) Symlink (Recommended: changes in this repo reflect immediately in Neovim)"
echo "  2) Copy (Independent standalone copy in ~/.config/nvim)"
read -p "Select [1/2] (default 1): " choice
choice=${choice:-1}

mkdir -p "$(dirname "$TARGET_DIR")"

if [ "$choice" = "1" ]; then
  ln -s "$NVIM_SRC" "$TARGET_DIR"
  echo "🔗 Symlinked: $NVIM_SRC -> $TARGET_DIR"
else
  cp -r "$NVIM_SRC" "$TARGET_DIR"
  echo "📋 Copied: $NVIM_SRC -> $TARGET_DIR"
fi

echo ""
echo "============================================================"
echo "🎉 Setup Complete!"
echo "============================================================"
echo ""
echo "Launch Neovim to start installing plugins automatically:"
echo "    nvim"
echo ""
echo "To explore the tutorial curriculum, browse the course folders or run:"
echo "    nvim README.md"
echo "============================================================"
