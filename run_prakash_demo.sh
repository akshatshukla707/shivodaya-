#!/usr/bin/env bash
# ==============================================================================
# PROJECT SHIVODAYA :: PRAKASH DATA PIPELINE & JSCC ENCODER DEMO
# ==============================================================================
# This script demonstrates to judges:
#   1. Deletion of previous dispatch artifacts
#   2. High-speed C11 zero-copy ingestion across 500,000 telemetry rows
#   3. Instant regeneration of:
#        - dispatch_records.csv  (Human-readable CSV dispatch ledger)
#        - dispatch_32f.bin      (32-float JSCC compact binary file)
#        - dispatch_summary.txt  (Monotonic execution & compression benchmarks)
# ==============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BUILD_DIR="${SCRIPT_DIR}/build"

if [ ! -f "${BUILD_DIR}/prakash_encoder" ]; then
    echo "[!] Compiling prakash_encoder binary..."
    mkdir -p "${BUILD_DIR}"
    cd "${BUILD_DIR}"
    cmake "${SCRIPT_DIR}" >/dev/null
    make prakash_encoder -j"$(nproc)"
fi

cd "${BUILD_DIR}"

echo "========================================================================"
echo "   🛰️  PROJECT SHIVODAYA :: PRAKASH JUDGING DEMONSTRATION RUNNER       "
echo "========================================================================"
echo ""
echo "[STEP 1] Purging existing dispatch and binary transmission artifacts..."
rm -f dispatch_records.csv dispatch_32f.bin semantic_dispatch.bin dispatch_summary.txt
echo "[✓] Verified clean workspace: dispatch artifacts deleted."
echo ""

echo "[STEP 2] Executing C11 Native Zero-Copy Prakash Ingestion & JSCC Encoder..."
echo "------------------------------------------------------------------------"
./prakash_encoder
echo "------------------------------------------------------------------------"
echo ""

echo "[STEP 3] Synchronizing and verifying freshly generated artifacts:"
echo "------------------------------------------------------------------------"
cp -f dispatch_records.csv dispatch_32f.bin semantic_dispatch.bin dispatch_summary.txt "${SCRIPT_DIR}/prakash/" 2>/dev/null || true
cp -f dispatch_records.csv dispatch_32f.bin semantic_dispatch.bin dispatch_summary.txt "${SCRIPT_DIR}/" 2>/dev/null || true
ls -lh dispatch_records.csv dispatch_32f.bin semantic_dispatch.bin dispatch_summary.txt
echo ""
echo "[✓] Verified in ${SCRIPT_DIR}/prakash/:"
ls -lh "${SCRIPT_DIR}/prakash/dispatch_records.csv" "${SCRIPT_DIR}/prakash/dispatch_32f.bin" "${SCRIPT_DIR}/prakash/semantic_dispatch.bin" "${SCRIPT_DIR}/prakash/dispatch_summary.txt"
echo "------------------------------------------------------------------------"
echo ""

echo "[STEP 4] Previewing Human-Readable CSV Dispatch Ledger (first 5 alerts):"
echo "------------------------------------------------------------------------"
head -n 6 dispatch_records.csv
echo "------------------------------------------------------------------------"
echo ""

echo "[STEP 5] Inspecting 32-Bit Float JSCC Binary Header & Marker ('Bhaarat'):"
echo "------------------------------------------------------------------------"
hexdump -C dispatch_32f.bin | head -n 8
echo "------------------------------------------------------------------------"
echo ""

echo "✨ PRAKASH DEMO COMPLETE: Artifacts ready for Richa DTN transmission!"
