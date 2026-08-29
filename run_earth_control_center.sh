#!/bin/bash
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BIN_DIR="${SCRIPT_DIR}/earth_control_center/bin"

if [ ! -d "$BIN_DIR" ] || [ ! -f "${BIN_DIR}/earthcontrol/EarthControlCenterUI.class" ]; then
    echo "[!] Executable classes not found. Building Earth Control Center GUI..."
    "${SCRIPT_DIR}/build_earth_gui.sh"
fi

echo "========================================================================"
echo "   LAUNCHING BHAARAT PROJECT SHIVODAYA EARTH CONTROL CENTER JAVA GUI    "
echo "========================================================================"

cd "$BIN_DIR"
CP=".:${SCRIPT_DIR}/akashdeep/java_gui/bin"
java -cp "$CP" earthcontrol.EarthControlCenterUI
