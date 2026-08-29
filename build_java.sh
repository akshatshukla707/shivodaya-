#!/bin/bash
set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
JAVA_GUI_DIR="${SCRIPT_DIR}/akashdeep/java_gui"
BUILD_DIR="${JAVA_GUI_DIR}/bin"

mkdir -p "$BUILD_DIR"

echo "[+] Compiling Akashdeep Java Swing Dashboard & Embedded Drivers..."
javac -d "$BUILD_DIR" "${JAVA_GUI_DIR}/org/sqlite/JDBC.java" "${JAVA_GUI_DIR}/"*.java

echo ""
echo "========================================================================"
echo "   [+] AKASHDEEP JAVA SWING DASHBOARD BUILD SUCCESSFUL!                 "
echo "========================================================================"
echo "To launch the Akashdeep Control Center Swing Dashboard:"
echo "cd ${JAVA_GUI_DIR} && java -cp \"${BUILD_DIR}\" Main"
