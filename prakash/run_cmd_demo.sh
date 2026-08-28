#!/usr/bin/env bash
rm -f /home/akshat/shivodaya/prakash/warning_dispatch.txt
echo "==============================================================="
echo "        PROJECT SHIVODAYA :: PRAKASH ACQUISITION MODULE        "
echo "==============================================================="
echo "[+] Mmapping 5 telemetry streams & binding CPU core affinity..."
echo "[+] Running zero-copy C11 lock-free acquisition pipeline..."
echo ""
time /home/akshat/shivodaya/prakash/prakash
echo ""
echo "[+] Verification & Output Summary:"
echo "    - Output Dispatch File: /home/akshat/shivodaya/prakash/warning_dispatch.txt"
echo "    - Total Severe Radiation Alerts Logged: $(wc -l < /home/akshat/shivodaya/prakash/warning_dispatch.txt) lines"
echo ""
echo "[+] Sample Real-Time Alert Dispatches:"
head -n 6 /home/akshat/shivodaya/prakash/warning_dispatch.txt

