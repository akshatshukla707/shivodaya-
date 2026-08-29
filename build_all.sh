#!/bin/bash
set -e

echo "========================================================================"
echo "   PROJECT SHIVODAYA :: NATIVE C/C++ NEURAL DTN MESH PIPELINE BUILD     "
echo "========================================================================"

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BUILD_DIR="${SCRIPT_DIR}/build"
mkdir -p "$BUILD_DIR"

cd "$BUILD_DIR"
cmake "$SCRIPT_DIR"
make -j$(nproc)

echo ""
echo "[+] Build Successful! Binaries generated in build/:"
ls -la prakash_encoder richa_neural_router akashdeep_decoder earth_monitor
