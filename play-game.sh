#!/usr/bin/env bash
# ==============================================================================
# 🥋 Neovim Mastery: The 30-Day Dojo Launcher
# Launches the interactive browser-based Vim game locally.
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT=8000

echo "=================================================================="
echo "🥋 Welcome to Neovim Mastery: The 30-Day Dojo"
echo "=================================================================="

# Check if Python is installed to serve locally with accurate ES module headers
if command -v python3 &>/dev/null; then
  echo "🚀 Starting local server at http://localhost:${PORT}/game/ ..."
  echo "Press Ctrl+C to stop the server."
  
  # Try to open in default browser in background
  if command -v xdg-open &>/dev/null; then
    (sleep 1 && xdg-open "http://localhost:${PORT}/game/") &
  elif command -v open &>/dev/null; then
    (sleep 1 && open "http://localhost:${PORT}/game/") &
  fi

  cd "${SCRIPT_DIR}"
  python3 -m http.server "${PORT}"
elif command -v npx &>/dev/null; then
  echo "🚀 Starting local server with npx serve ..."
  npx -y serve "${SCRIPT_DIR}"
else
  # Direct file opening fallback
  GAME_PATH="${SCRIPT_DIR}/game/index.html"
  echo "🌐 Opening directly in browser: ${GAME_PATH}"
  if command -v xdg-open &>/dev/null; then
    xdg-open "${GAME_PATH}"
  elif command -v open &>/dev/null; then
    open "${GAME_PATH}"
  fi
fi
