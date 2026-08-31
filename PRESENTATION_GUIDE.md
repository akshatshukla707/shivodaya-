# PROJECT SHIVODAYA :: PRESENTATION & EXECUTION GUIDE

---

## PRESENTATION ORDER & MODULE EXECUTION STEPS

### STEP 1: COMPILATION & BUILD (ALL NATIVE C/C++ MODULES)
**Working Directory:** `shivodaya` repo root  
**Description:** Compiles all native C11 and C++17 modules (`prakash_encoder`, `richa_neural_router`, `akashdeep_decoder`, `earth_monitor`) using CMake and gcc/g++.

**Commands to run:**
```bash
cd shivodaya-
./build_all.sh
```

---

### STEP 2: MODULE 3 - AKASHDEEP SEMANTIC DECODER (MARS DEEP SPACE TARGET - ipn:3.1)
**Working Directory:** `shivodaya/build`  
**Description:** Run in **Terminal 1**. Starts the destination decoder that ingests JSCC semantic vectors, verifies the `'Bhaarat'` signature, reconstructs physical space-weather telemetry using MLP matrix multiplication, and logs alerts via POSIX `write()`.

**Commands to run (Terminal 1):**
```bash
cd shivodaya/build
./akashdeep_decoder
```
**Files involved:**
- `akashdeep/akashdeep_decoder.cpp`
- Ingress Pipe: `/tmp/shivodaya_akashdeep_ingress.fifo`
- Log Output: `build/akashdeep_mission_control.log`

---

### STEP 3: MODULE 2 - RICHA NEURAL DTN ROUTER (CIS-LUNAR RELAY - ipn:2.1)
**Working Directory:** `shivodaya/build`  
**Description:** Run in **Terminal 2**. Starts the Perceptron router. Evaluates 100 Time-Varying Graph (TVG) link states using perceptron activation weights, executes Time-Dependent Dijkstra routing (`ipn:1.1 -> ipn:2.1 -> ipn:3.1`), triggers BFS multi-hop rerouting during solar blackouts (`ipn:1.1 -> ipn:6.1 -> ipn:5.1 -> ipn:4.1 -> ipn:3.1`), and logs state asynchronously into SQLite (`richa_routing_log.db`).

**Commands to run (Terminal 2):**
```bash
cd shivodaya/build
./richa_neural_router
```
**Files involved:**
- `richa/richa_neural_router.cpp`
- Ingress Pipe: `/tmp/shivodaya_richa_ingress.fifo`
- Egress Pipe: `/tmp/shivodaya_akashdeep_ingress.fifo`
- SQLite Log DB: `build/richa_routing_log.db`

---

### STEP 4: MODULE 1 - PRAKASH SEMANTIC ENCODER (ADITYA-L1 SOLAR PROBE - ipn:1.1)
**Working Directory:** `shivodaya/build`  
**Description:** Run in **Terminal 3**. Ingests telemetry streams across 5 CPU cores using `mmap()`, normalizes raw telemetry, computes 32-float JSCC linear projection vectors embedded with the `'Bhaarat'` marker, and dispatches them to `ipn:2.1`.

**Commands to run (Terminal 3):**
```bash
cd shivodaya/build
./prakash_encoder
```
**Files involved:**
- `prakash/prakash_encoder.c`
- Input Telemetry Files: `prakash/*_sim.txt`
- Egress Pipe: `/tmp/shivodaya_richa_ingress.fifo`

---

### STEP 5: AUTOMATED FULL PIPELINE EXECUTION
**Working Directory:** `shivodaya` repo root  
**Description:** Runs the entire Prakash -> Richa -> Akashdeep -> Earth Monitor mesh pipeline in a single automated script.

**Command to run:**
```bash
cd shivodaya
./run_full_mesh_pipeline.sh
```

---

### STEP 6: AKASHDEEP CONTROL CENTER GUI (JAVA SWING 3D DASHBOARD)
**Working Directory:** `shivodaya/akashdeep/java_gui`  
**Description:** Launches the advanced Akashdeep Mission Control Swing Dashboard featuring:
- **3D Celestial Trajectory Engine**: Visualizes Earth, Mars target (`ipn:3.1`), Perseverance / Akashdeep spacecraft trajectory, and chasing solar radiation particle fields.
- **Overall Space Health Meter**: Real-time status indicator showing severe/critical threat levels.
- **Actionable Flight Safety Advisory**: Real-time tactical directives (`EXECUTE SAFE ZONE` and `RE-CALCULATE PATH`).
- **5 Speedometer Gauges**: 3 out of 5 metrics pinned in the CRITICAL RED DANGER ZONE.
- **Live Building Waveform Graphs**: Progressively streams telemetry wave points step-by-step.
- **Go Back Header Navigation**: `[◀ GO BACK TO MAIN CONTROL CENTER]` button on all sub-windows.

**Commands to compile & launch:**
```bash
# Build Java GUI codebase
cd shivodaya
./build_java.sh

# Launch Dashboard
cd shivodaya/akashdeep/java_gui
java -cp "bin:." Main
```

---

### STEP 7: EARTH OPERATIONS MONITORING CENTER & 3D WEB DASHBOARD
**Working Directory:** `shivodaya/build`  

**Option A - Terminal Query:**
```bash
cd shivodaya/build
./earth_monitor
```

**Option B - Interactive 3D Web Dashboard:**
Open `earth_monitor/index_earth_dashboard.html` in your web browser.
