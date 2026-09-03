#!/bin/bash
set -e
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
mkdir -p "$DIR/bin"

echo "========================================================================"
echo "   BUILDING SHIVODAYA EARTH CONTROL CENTER (JAVA SWING GUI)            "
echo "========================================================================"

javac -cp ".:$DIR/lib/*" -d "$DIR/bin" -sourcepath "$DIR/src" \
    "$DIR/src/earthcontrol/ModernTheme.java" \
    "$DIR/src/earthcontrol/TelemetryChartPanel.java" \
    "$DIR/src/earthcontrol/NASADataSeeder.java" \
    "$DIR/src/earthcontrol/DatabaseManager.java" \
    "$DIR/src/earthcontrol/EarthControlCenterUI.java"

echo "[+] Compilation successful! Class files placed in earth_control_center/bin/"
