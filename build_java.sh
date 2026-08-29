#!/bin/bash
set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
JAVA_GUI_DIR="${SCRIPT_DIR}/akashdeep/java_gui"
BUILD_DIR="${JAVA_GUI_DIR}/bin"

mkdir -p "$BUILD_DIR"

echo "[+] Compiling Akashdeep Java Swing Dashboard & Embedded Drivers..."
javac -d "$BUILD_DIR" "${JAVA_GUI_DIR}/org/sqlite/JDBC.java" "${JAVA_GUI_DIR}/"*.java

echo "[+] Compiling Earth Operations Control Center GUI..."
"${SCRIPT_DIR}/build_earth_gui.sh"

echo ""
echo "========================================================================"
echo "   [+] ALL JAVA MODULES BUILD SUCCESSFUL!                                "
echo "========================================================================"
echo "To launch Akashdeep Dashboard : cd ${JAVA_GUI_DIR} && java -cp \"${BUILD_DIR}\" Main"
echo "To launch Earth Operations GUI  : ./run_earth_control_center.sh"
