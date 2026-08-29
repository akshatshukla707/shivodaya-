# PROJECT SHIVODAYA :: PRESENTATION & EXECUTION GUIDE

---

## PRESENTATION ORDER & MODULE EXECUTION STEPS

### STEP 1: COMPILATION & BUILD (ALL NATIVE C/C++ MODULES)
**Working Directory:** `/home/akshat/shivodaya`
**Description:** Compiles all native C11 and C++17 modules (`prakash_encoder`, `richa_neural_router`, `akashdeep_decoder`, `earth_monitor`) using CMake and gcc/g++.

**Commands to run:**
```bash
cd /home/akshat/shivodaya
./build_all.sh
```

---

### STEP 2: MODULE 3 - AKASHDEEP SEMANTIC DECODER (MARS DEEP SPACE TARGET - ipn:3.1)
**Working Directory:** `/home/akshat/shivodaya/build`
**Description:** Run in **Terminal 1**. Starts the destination decoder that ingests JSCC semantic vectors, verifies the `'Bhaarat'` signature, reconstructs physical space-weather telemetry using MLP matrix multiplication, and logs alerts via POSIX `write()`.

**Commands to run (Terminal 1):**
```bash
cd /home/akshat/shivodaya/build
./akashdeep_decoder
```
**Files involved:**
- `/home/akshat/shivodaya/akashdeep/akashdeep_decoder.cpp`
- Ingress Pipe: `/tmp/shivodaya_akashdeep_ingress.fifo`
- Log Output: `/home/akshat/shivodaya/build/akashdeep_mission_control.log`

---

### STEP 3: MODULE 2 - RICHA NEURAL DTN ROUTER (CIS-LUNAR RELAY - ipn:2.1)
**Working Directory:** `/home/akshat/shivodaya/build`
**Description:** Run in **Terminal 2**. Starts the Perceptron router. Evaluates 100 Time-Varying Graph (TVG) link states using perceptron activation weights, executes Time-Dependent Dijkstra routing (`ipn:1.1 -> ipn:2.1 -> ipn:3.1`), triggers BFS multi-hop rerouting during solar blackouts (`ipn:1.1 -> ipn:6.1 -> ipn:5.1 -> ipn:4.1 -> ipn:3.1`), and logs state asynchronously into SQLite (`richa_routing_log.db`).

**Commands to run (Terminal 2):**
```bash
cd /home/akshat/shivodaya/build
./richa_neural_router
```
**Files involved:**
- `/home/akshat/shivodaya/richa/richa_neural_router.cpp`
- Ingress Pipe: `/tmp/shivodaya_richa_ingress.fifo`
- Egress Pipe: `/tmp/shivodaya_akashdeep_ingress.fifo`
- SQLite Log DB: `/home/akshat/shivodaya/build/richa_routing_log.db`

---

### STEP 4: MODULE 1 - PRAKASH SEMANTIC ENCODER (ADITYA-L1 SOLAR PROBE - ipn:1.1)
**Working Directory:** `/home/akshat/shivodaya/build`
**Description:** Run in **Terminal 3**. Ingests telemetry streams across 5 CPU cores using `mmap()`, normalizes raw telemetry, computes 32-float JSCC linear projection vectors embedded with the `'Bhaarat'` marker, and dispatches them to `ipn:2.1`.

**Commands to run (Terminal 3):**
```bash
cd /home/akshat/shivodaya/build
./prakash_encoder
```
**Files involved:**
- `/home/akshat/shivodaya/prakash/prakash_encoder.c`
- Input Telemetry Files: `/home/akshat/shivodaya/prakash/*_sim.txt`
- Egress Pipe: `/tmp/shivodaya_richa_ingress.fifo`

---

### STEP 5: MODULE 4 - EARTH OPERATIONS MONITORING CENTER & 3D DASHBOARD
**Working Directory:** `/home/akshat/shivodaya/build`
**Description:** Run in **Terminal 4** or view in browser.

**Option A - Terminal Table Query (Terminal 4):**
```bash
cd /home/akshat/shivodaya/build
./earth_monitor
```

**Option B - Interactive 3D Web Dashboard:**
Open in web browser:
```text
file:///home/akshat/shivodaya/earth_monitor/index_earth_dashboard.html
```
**Files involved:**
- `/home/akshat/shivodaya/earth_monitor/earth_monitor.cpp`
- `/home/akshat/shivodaya/earth_monitor/index_earth_dashboard.html`
