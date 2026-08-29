#!/bin/bash
set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR/build"

echo "========================================================================"
echo "   PROJECT SHIVODAYA :: STEP-BY-STEP GUIDED MESH PIPELINE DEMO         "
echo "========================================================================"
echo ""

# Remove old logs and database for clean run
rm -f richa_routing_log.db akashdeep_mission_control.log richa.log akashdeep.log

echo "------------------------------------------------------------------------"
echo " [STEP 1/4] INITIALIZING MODULE 3: AKASHDEEP SEMANTIC DECODER (ipn:3.1) "
echo "------------------------------------------------------------------------"
echo "Starting Akashdeep Semantic Decoder process on Mars / Deep Space Target..."
stdbuf -o0 -e0 ./akashdeep_decoder > akashdeep.log 2>&1 &
DECODER_PID=$!
sleep 1

if ps -p $DECODER_PID > /dev/null; then
    echo "[+] Akashdeep Decoder is ONLINE (PID: $DECODER_PID), listening on ingress FIFO."
else
    echo "[-] Failed to start Akashdeep Decoder."
    exit 1
fi
echo ""
read -p ">>> Press [ENTER] to proceed to Step 2 (Initializing Richa Neural Router)..." unused_var

echo ""
echo "------------------------------------------------------------------------"
echo " [STEP 2/4] INITIALIZING MODULE 2: RICHA NEURAL DTN ROUTER (ipn:2.1)    "
echo "------------------------------------------------------------------------"
echo "Starting Richa Perceptron Engine on Cis-lunar Relay node..."
stdbuf -o0 -e0 ./richa_neural_router > richa.log 2>&1 &
ROUTER_PID=$!
sleep 1

if ps -p $ROUTER_PID > /dev/null; then
    echo "[+] Richa Neural Router is ONLINE (PID: $ROUTER_PID), TVG 100-node graph ready."
else
    echo "[-] Failed to start Richa Neural Router."
    kill -INT $DECODER_PID 2>/dev/null || true
    exit 1
fi
echo ""
read -p ">>> Press [ENTER] to proceed to Step 3 (Executing Prakash Telemetry Ingestion)..." unused_var

echo ""
echo "------------------------------------------------------------------------"
echo " [STEP 3/4] EXECUTING MODULE 1: PRAKASH ENCODER & DISPATCH (ipn:1.1)    "
echo "------------------------------------------------------------------------"
echo "Launching Prakash JSCC Semantic Encoder on Aditya-L1 Solar Probe..."
echo "Ingesting 5 telemetry streams, computing 32-float embeddings, and dispatching..."
echo ""

./prakash_encoder

sleep 1
echo ""
echo "[+] Prakash Encoder finished telemetry dispatch."
echo ""
read -p ">>> Press [ENTER] to inspect Richa & Akashdeep Logs and run Step 4 (Earth Monitor)..." unused_var

echo ""
echo "------------------------------------------------------------------------"
echo " [LIVE LOG INSPECTION] RICHA ROUTER & AKASHDEEP DECODER RESULTS        "
echo "------------------------------------------------------------------------"
echo "--- RICHA NEURAL ROUTER LOG SUMMARY (First 15 routed bundles) ---"
head -n 25 richa.log

echo ""
echo "--- AKASHDEEP SEMANTIC DECODER LOG SUMMARY (First 15 decoded alerts) ---"
head -n 25 akashdeep.log

echo ""
read -p ">>> Press [ENTER] to launch Step 4 (Earth Operations Monitoring Center)..." unused_var

echo ""
echo "------------------------------------------------------------------------"
echo " [STEP 4/4] EXECUTING MODULE 4: EARTH OPERATIONS MONITORING CENTER      "
echo "------------------------------------------------------------------------"
echo "Querying SQLite asynchronous log database (richa_routing_log.db)..."
echo ""

# Run Earth Monitor to query SQLite log table
./earth_monitor

# Kill background workers gracefully
kill -INT $ROUTER_PID 2>/dev/null || true
kill -INT $DECODER_PID 2>/dev/null || true
sleep 1

echo ""
echo "========================================================================"
echo "   [+] STEP-BY-STEP SHIVODAYA MESH DEMONSTRATION COMPLETE!              "
echo "========================================================================"
