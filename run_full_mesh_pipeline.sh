#!/bin/bash
set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR/build"

echo "========================================================================"
echo "   PROJECT SHIVODAYA :: END-TO-END AUTONOMOUS MESH EXECUTION TEST      "
echo "========================================================================"

# Remove old logs and database for clean run
rm -f richa_routing_log.db akashdeep_mission_control.log richa.log akashdeep.log

# Run Akashdeep Decoder in background
stdbuf -o0 -e0 ./akashdeep_decoder > akashdeep.log 2>&1 &
DECODER_PID=$!

# Run Richa Neural Router in background
stdbuf -o0 -e0 ./richa_neural_router > richa.log 2>&1 &
ROUTER_PID=$!

sleep 1

# Run Prakash Encoder in foreground
./prakash_encoder

sleep 1

# Kill background workers gracefully
kill -INT $ROUTER_PID 2>/dev/null || true
kill -INT $DECODER_PID 2>/dev/null || true
sleep 1

echo ""
echo "--- RICHA NEURAL ROUTER LOG SUMMARY ---"
head -n 30 richa.log

echo ""
echo "--- AKASHDEEP SEMANTIC DECODER LOG SUMMARY ---"
head -n 30 akashdeep.log

echo ""
# Run Earth Monitor to query SQLite log table
./earth_monitor
