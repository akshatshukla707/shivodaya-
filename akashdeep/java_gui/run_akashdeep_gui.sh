#!/bin/bash
set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "========================================================================"
echo "   LAUNCHING AKASHDEEP AUTONOMOUS MISSION CONTROL GUI (JAVA SWING)     "
echo "========================================================================"
echo "Target: ipn:3.1 (Mars Base) | DTN BPv7 | Cryptographic Marker: 'Bhaarat'"
echo ""

# Auto-detect display or fallback to xvfb if in headless mode
if [ -z "$DISPLAY" ]; then
    if which xvfb-run >/dev/null 2>&1; then
        echo "[*] Headless environment detected. Launching inside virtual frame buffer (xvfb -a)..."
        exec xvfb-run -a java -cp "bin:." Main "$@"
    else
        export DISPLAY=:0
    fi
fi

exec java -cp "bin:." Main "$@"
