#!/bin/bash
# Terminal 2: NASA ION DTN BPv7 Live Receiver (Cis-Lunar Gateway ipn:2.1)
cd "$(dirname "$0")/../.."
./richa/ion_dtn_demo/ion_dtn_engine recv_online
