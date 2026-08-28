#!/usr/bin/env bash
echo "==============================================================="
echo "       PROJECT SHIVODAYA :: RICHA DTN TRANSPORT MODULE         "
echo "==============================================================="
echo "[+] Running autonomous Contact Graph Routing (CGR) on 100 space nodes..."
echo ""
time /home/akshat/shivodaya/richa/richa
echo ""
echo "[+] Output Verification:"
echo "    - Trajectory Dispatch File: /home/akshat/shivodaya/richa/richa_dispatch_log.txt"
echo "    - Total Trajectory Records: $(wc -l < /home/akshat/shivodaya/richa/richa_dispatch_log.txt) lines"
echo ""
echo "[+] Sample DTN Bundle Custody Dispatches:"
head -n 20 /home/akshat/shivodaya/richa/richa_dispatch_log.txt
