#!/bin/bash
# ==============================================================================
# PROJECT SHIVODAYA :: UNIFIED MASTER BUILD & DEPENDENCY INSTALLER
# ==============================================================================
# Builds all modules:
#  1. System & package dependencies (C/C++, Java, Python, Node.js)
#  2. Native C/C++ Neural Mesh & DTN binaries (prakash, richa, akashdeep, etc.)
#  3. Java GUIs (Akashdeep CME HUD, Earth Control Center)
#  4. Python dependencies (Streamlit telemetry dashboard)
#  5. Next.js Aerospace Web Platform (Landing page & 3D portals)
# ==============================================================================

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "========================================================================"
echo "   🛰️  PROJECT SHIVODAYA :: UNIFIED SYSTEM BUILD & INSTALLER            "
echo "========================================================================"

# ------------------------------------------------------------------------------
# STEP 1: CHECK & INSTALL SYSTEM DEPENDENCIES
# ------------------------------------------------------------------------------
echo ""
echo "[STEP 1/5] Checking system prerequisites..."

MISSING_PACKAGES=()

command -v gcc >/dev/null 2>&1 || MISSING_PACKAGES+=("build-essential")
command -v g++ >/dev/null 2>&1 || MISSING_PACKAGES+=("g++")
command -v cmake >/dev/null 2>&1 || MISSING_PACKAGES+=("cmake")
command -v javac >/dev/null 2>&1 || MISSING_PACKAGES+=("default-jdk")
command -v node >/dev/null 2>&1 || MISSING_PACKAGES+=("nodejs")
command -v npm >/dev/null 2>&1 || MISSING_PACKAGES+=("npm")
command -v python3 >/dev/null 2>&1 || MISSING_PACKAGES+=("python3")
command -v pip3 >/dev/null 2>&1 || command -v pip >/dev/null 2>&1 || MISSING_PACKAGES+=("python3-pip")

if [ ${#MISSING_PACKAGES[@]} -ne 0 ]; then
    echo "[!] Missing system packages: ${MISSING_PACKAGES[*]}"
    if [ "$EUID" -eq 0 ]; then
        echo "[+] Installing missing packages with apt-get..."
        apt-get update -y
        apt-get install -y "${MISSING_PACKAGES[@]}"
    elif command -v sudo >/dev/null 2>&1; then
        echo "[+] Installing missing packages with sudo apt-get..."
        sudo apt-get update -y
        sudo apt-get install -y "${MISSING_PACKAGES[@]}"
    else
        echo "[WARNING] Please manually install: ${MISSING_PACKAGES[*]}"
    fi
else
    echo "[✓] All essential system packages are installed."
fi

# ------------------------------------------------------------------------------
# STEP 2: BUILD NATIVE C/C++ NEURAL MESH & DTN BINARIES
# ------------------------------------------------------------------------------
echo ""
echo "[STEP 2/5] Compiling C11 / C++17 Neural DTN Mesh Binaries..."
BUILD_DIR="${SCRIPT_DIR}/build"
mkdir -p "$BUILD_DIR"
cd "$BUILD_DIR"
cmake "$SCRIPT_DIR"
make -j"$(nproc)"

# Copy ion_dtn_engine binary to richa/ion_dtn_demo directory for script compatibility
cp -f "${BUILD_DIR}/ion_dtn_engine" "${SCRIPT_DIR}/richa/ion_dtn_demo/ion_dtn_engine" 2>/dev/null || true

echo "[✓] Native binaries compiled successfully:"
ls -lh prakash_encoder richa_neural_router akashdeep_decoder earth_monitor ion_dtn_engine
cd "$SCRIPT_DIR"

# ------------------------------------------------------------------------------
# STEP 3: BUILD JAVA GUIs (Akashdeep & Earth Operations)
# ------------------------------------------------------------------------------
echo ""
echo "[STEP 3/5] Compiling Java Swing Control Centers & Dashboards..."
"${SCRIPT_DIR}/build_java.sh"
echo "[✓] Java dashboards compiled successfully."

# ------------------------------------------------------------------------------
# STEP 4: PYTHON ENVIRONMENT & TELEMETRY DASHBOARD DEPENDENCIES
# ------------------------------------------------------------------------------
echo ""
echo "[STEP 4/5] Installing Python telemetry requirements..."
if [ -f "${SCRIPT_DIR}/requirements.txt" ]; then
    if command -v pip3 >/dev/null 2>&1; then
        pip3 install -q -r "${SCRIPT_DIR}/requirements.txt" || echo "[!] Notice: pip3 install encountered an issue; ensure your python env is active."
    elif command -v pip >/dev/null 2>&1; then
        pip install -q -r "${SCRIPT_DIR}/requirements.txt" || echo "[!] Notice: pip install encountered an issue; ensure your python env is active."
    fi
    echo "[✓] Python telemetry requirements checked."
fi

# ------------------------------------------------------------------------------
# STEP 5: NEXT.JS WEB AEROSPACE PLATFORM
# ------------------------------------------------------------------------------
echo ""
echo "[STEP 5/5] Building Next.js Web Platform & Landing Page..."
cd "${SCRIPT_DIR}/web"
if [ ! -d "node_modules" ]; then
    echo "[+] Installing npm dependencies..."
    npm install
fi
echo "[+] Creating production build for web application..."
npm run build
cd "$SCRIPT_DIR"

echo ""
echo "========================================================================"
echo "   ✨ PROJECT SHIVODAYA :: ALL MODULES BUILT & READY!                   "
echo "========================================================================"
echo ""
echo "COMMANDS TO LAUNCH FROM YOUR TERMINAL:"
echo "------------------------------------------------------------------------"
echo "  1. Launch Next.js Web Landing Page (Port 3000):"
echo "     ./run_web.sh"
echo ""
echo "  2. Launch Interactive End-to-End Simulation Pipeline:"
echo "     ./run_interactive_mesh_pipeline.sh"
echo ""
echo "  3. Launch Automated Full Mesh Pipeline:"
echo "     ./run_full_mesh_pipeline.sh"
echo ""
echo "  4. Launch Ground Operations Control Center (Java GUI):"
echo "     ./run_earth_control_center.sh"
echo ""
echo "  5. Launch Mars Akashdeep CME Telemetry GUI (Java Swing):"
echo "     cd akashdeep/java_gui && java -cp \"bin:.\" Main"
echo ""
echo "  6. Launch Streamlit Telemetry Dashboard (Port 8501):"
echo "     streamlit run streamlit_dashboard.py"
echo "------------------------------------------------------------------------"
