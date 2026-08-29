#!/bin/bash
# Master 3-Terminal NASA ION DTN Loop Agent Demonstration Runner
cd "$(dirname "$0")/../.."

# Clean previous IPC custody stores and FIFO pipes
rm -f /tmp/ion_dtn_bpv7_custody.store /tmp/ion_dtn_live.fifo
mkfifo /tmp/ion_dtn_live.fifo 2>/dev/null

echo "========================================================================="
echo "   PROJECT SHIVODAYA :: NASA ION DTN BPv7 3-TERMINAL DEMONSTRATION SETUP "
echo "========================================================================="
echo ""
echo "This test demonstrates NASA ION DTN Store-and-Forward Custody Transfer:"
echo ""
echo "  TERMINAL 1 (Sender - Aditya-L1 ipn:1.1): Dispatches radiation alert bundles."
echo "  TERMINAL 2 (Receiver 1 - Gateway ipn:2.1): Listens LIVE before dispatches."
echo "  TERMINAL 3 (Receiver 2 - Mars Base ipn:3.1): Opened LATER (after dispatches)."
echo "             Retrieves stored custody bundles with visual pacing (0.8s)."
echo ""
echo "-------------------------------------------------------------------------"
echo "Instructions to run in 3 terminal windows or tmux panes:"
echo "-------------------------------------------------------------------------"
echo "  Terminal 1: ./richa/ion_dtn_demo/run_terminal1_sender.sh"
echo "  Terminal 2: ./richa/ion_dtn_demo/run_terminal2_receiver_online.sh"
echo "  Terminal 3: ./richa/ion_dtn_demo/run_terminal3_receiver_delayed.sh"
echo "-------------------------------------------------------------------------"
echo ""

chmod +x richa/ion_dtn_demo/*.sh
