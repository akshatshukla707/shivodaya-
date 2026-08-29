#!/bin/bash
set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SRC_DIR="${SCRIPT_DIR}/earth_control_center/src"
BIN_DIR="${SCRIPT_DIR}/earth_control_center/bin"
DB_PATH="/home/akshat/Downloads/parabitshivchaitanya.db"

mkdir -p "$BIN_DIR"

echo "========================================================================"
echo "   BUILDING PROJECT SHIVODAYA EARTH CONTROL CENTER JAVA GUI            "
echo "========================================================================"

# Extract embedded SQLite JDBC wrapper from akashdeep if available
if [ -d "${SCRIPT_DIR}/akashdeep/java_gui/bin/org/sqlite" ]; then
    cp -r "${SCRIPT_DIR}/akashdeep/java_gui/bin/org" "${BIN_DIR}/" 2>/dev/null || true
fi

# Ensure SQLite DB exists or fallback
if [ ! -f "$DB_PATH" ]; then
    echo "[!] Target database not found at $DB_PATH, using fallback location."
fi

# Include SQLite JDBC classpath from akashdeep
CP=".:${SCRIPT_DIR}/earth_control_center/bin"
if [ -d "${SCRIPT_DIR}/akashdeep/java_gui/bin" ]; then
    CP="${CP}:${SCRIPT_DIR}/akashdeep/java_gui/bin"
fi

# Compile Java sources
javac -cp "$CP" -d "$BIN_DIR" -sourcepath "$SRC_DIR" \
    "${SRC_DIR}/earthcontrol/ModernTheme.java" \
    "${SRC_DIR}/earthcontrol/TelemetryChartPanel.java" \
    "${SRC_DIR}/earthcontrol/NASADataSeeder.java" \
    "${SRC_DIR}/earthcontrol/DatabaseManager.java" \
    "${SRC_DIR}/earthcontrol/EarthControlCenterUI.java"

echo ""
echo "[+] Build Successful! Compiled class files located in earth_control_center/bin/"
echo "[+] To run the Earth Operations Control Center GUI:"
echo "    ./run_earth_control_center.sh"
