#!/bin/bash
# Project Shivodaya - SpaceX-Style Next.js Web Application Launcher

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEB_DIR="$SCRIPT_DIR/web"

cd "$WEB_DIR" || exit 1

# Ensure dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "[!] node_modules missing. Installing npm packages..."
    npm install
fi

# Free port 3000 if occupied
fuser -k 3000/tcp 2>/dev/null || true

echo "============================================================"
echo "🚀 LAUNCHING PROJECT SHIVODAYA AEROSPACE WEB PLATFORM"
echo "🌐 URL: http://localhost:3000"
echo "============================================================"

# Mode check: Dev or Production
if [ "$1" == "--dev" ]; then
    echo "[+] Starting Next.js Development Server..."
    npx next dev -p 3000 -H 0.0.0.0
else
    # Build if production build missing
    if [ ! -d ".next" ]; then
        echo "[+] Production build (.next) not found. Building web app..."
        npm run build
    fi
    echo "[+] Starting Next.js Production Server..."
    npx next start -p 3000 -H 0.0.0.0
fi
