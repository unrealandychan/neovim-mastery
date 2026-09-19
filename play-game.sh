#!/usr/bin/env bash
# ==============================================================================
# 🥋 Neovim Mastery & Vim Adventures Launcher
# Launches the interactive browser-based games locally.
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_PATH=""

# Parse flags
if [ "${1:-}" = "--adventure" ] || [ "${1:-}" = "-a" ]; then
  TARGET_PATH="/adventure/"
elif [ "${1:-}" = "--dojo" ] || [ "${1:-}" = "-d" ]; then
  TARGET_PATH="/game/"
else
  TARGET_PATH="/"
fi

# Ensure bundle.js is built if node is present
if command -v node &>/dev/null && [ -f "${SCRIPT_DIR}/scripts/bundle.js" ]; then
  node "${SCRIPT_DIR}/scripts/bundle.js" >/dev/null 2>&1 || true
fi

# Detect an open port
find_port() {
  local port
  for port in 8000 8080 8888 3000 5000 8001 8002 8003 8004 8005; do
    if ! lsof -i :"$port" >/dev/null 2>&1; then
      echo "$port"
      return 0
    fi
  done
  echo "8000"
}
PORT=$(find_port)

echo "=================================================================="
echo "🥋 Welcome to Neovim Mastery & Vim Adventures!"
echo "=================================================================="
echo "⚔️  Vim Adventures RPG:  http://localhost:${PORT}/adventure/"
echo "🥋 30-Day Dojo Game:    http://localhost:${PORT}/game/"
echo "🏠 Game Hub Portal:     http://localhost:${PORT}/"
echo "=================================================================="

# Check if Python is installed to serve locally with accurate ES module headers
if command -v python3 &>/dev/null; then
  TARGET_URL="http://localhost:${PORT}${TARGET_PATH}"
  echo "🚀 Starting local server at ${TARGET_URL} ..."
  echo "Press Ctrl+C to stop the server."
  
  # Try to open in default browser in background
  if command -v xdg-open &>/dev/null; then
    (sleep 1 && xdg-open "${TARGET_URL}") &
  elif command -v open &>/dev/null; then
    (sleep 1 && open "${TARGET_URL}") &
  fi

  cd "${SCRIPT_DIR}"
  python3 -m http.server "${PORT}"
elif command -v npx &>/dev/null; then
  echo "🚀 Starting local server with npx serve on port ${PORT} ..."
  npx -y serve -l "${PORT}" "${SCRIPT_DIR}"
else
  # Direct file opening fallback
  GAME_PATH="${SCRIPT_DIR}/adventure/index.html"
  echo "🌐 Opening directly in browser: ${GAME_PATH}"
  if command -v xdg-open &>/dev/null; then
    xdg-open "${GAME_PATH}"
  elif command -v open &>/dev/null; then
    open "${GAME_PATH}"
  fi
fi
