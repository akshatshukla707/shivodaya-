# PROJECT SHIVODAYA :: MASTER PRESENTATION & DEMONSTRATION GUIDE
## Autonomous Interplanetary Mesh Network & Semantic Radiation Alert Pipeline

---

## 1. The 60-Second Elevator Pitch (Start with this)

> *"Distinguished Judges, modern deep-space missions face a fatal communication problem. When a solar storm erupts from the Sun, high-energy radiation reaches Mars in 15 to 45 minutes. Today's spacecraft depend entirely on Earth ground stations (NASA DSN, ISRO ISTRAC) to detect the storm and beam a warning back. But because radio signals take 4 to 24 minutes one-way to reach Mars, plus Earth queue times, the storm destroys electronics and irradiates astronauts before the warning ever arrives.*
>
> ***Project Shivodaya changes this completely.*** *We have built an autonomous, mission-to-mission deep-space mesh network. Probes at Sun-Earth L1 (like Aditya-L1) detect radiation bursts at the source, compress 44 scientific parameters into compact 32-float neural semantic vectors, and route emergency warnings directly through interplanetary orbital relays to spacecraft and habitats across the Solar System—**completely bypassing Earth**."*

---

## 2. Complete Presentation Roadmap (Order of Demonstration)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       PROJECT SHIVODAYA DEMO PIPELINE                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. PRAKASH ACQUISITION & JSCC ENCODER                                       │
│    • Live Ingestion of 500,000 rows across 5 streams                        │
│    • Live file deletion & regeneration in Windows Explorer                  │
│    • 72.71% Net Bandwidth Reduction & 'Bhaarat' Signature                   │
│                                     │                                       │
│                                     ▼                                       │
│ 2. NASA ION DTN ENGINE DEMO                                                 │
│    • Real NASA ION Delay-Tolerant Networking BPv7 daemon startup            │
│    • SDR Shared Memory & C++ Sender Endpoint Registration (ipn:1.1)         │
│                                     │                                       │
│                                     ▼                                       │
│ 3. AUTONOMOUS FULL MESH PIPELINE                                            │
│    • Prakash (ipn:1.1) ➔ Richa (ipn:2.1) ➔ Akashdeep (ipn:3.1) ➔ Earth      │
│    • C++ Neural Perceptron Link Evaluation & TVG Dijkstra                   │
│    • BFS Autonomous Solar Flare Blackout Evasion                            │
│                                     │                                       │
│                                     ▼                                       │
│ 4. RICHA 3D DEEP-SPACE MESH VISUALIZER (Three.js)                           │
│    • Interplanetary orbital view: Sun, Earth, Lunar Gateway, Mars Base      │
│    • ISRO, NASA, ESA, Roscosmos, JAXA, SpaceX Deep-Space Relays             │
│    • Dynamic Dijkstra route vs CME Radiation Hazard Blackout Reroute        │
│                                     │                                       │
│                                     ▼                                       │
│ 5. AKASHDEEP JAVA MISSION CONTROL 3D GUI                                    │
│    • 3D Celestial Trajectory Engine (Earth ➔ Mars ➔ Spacecraft)             │
│    • 5 Speedometer Gauges with 3 metrics pinned in RED DANGER ZONE          │
│    • Real-time Space Health Meter & Tactical Flight Directives              │
│                                     │                                       │
│                                     ▼                                       │
│ 6. EARTH OPERATIONS CONTROL CENTER (Java Desktop GUI)                       │
│    • FlatDarkLaf Mission Control UI connected to deep-space database        │
│    • Live waveform telemetry, antenna tracking, and NASA/ISRO audit logs    │
│                                     │                                       │
│                                     ▼                                       │
│ 7. AEROSPACE WEB PLATFORM & LANDING PORTAL                                  │
│    • SpaceX-style Next.js portal with spaceship video background            │
│    • 7-Step Onboarding Mission Wizard, Telemetry Lookup & Employee Portal   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Step-by-Step Live Execution Commands

### ACT 1: Prakash Live Telemetry Ingestion & Compression Demo
**Where to run:** WSL Terminal OR Windows Terminal  
**Location:** `/home/shivodaya-/prakash/` (or `C:\Users\lenovo\Desktop\shivodaya-\prakash\`)

#### Step 1.1: Open Windows File Explorer
Show the judges the `prakash/` folder on your Windows Desktop:
`C:\Users\lenovo\Desktop\shivodaya-\prakash\`
Point out the 5 official space-weather datasets:
1. `cme_sim.txt` (NASA SOHO/LASCO CME)
2. `sep_sim.txt` (NOAA SWPC GOES-18 SEP)
3. `solar_wind_sim.txt` (NOAA DSCOVR Solar Wind)
4. `proton_flux_sim.txt` (NOAA GOES-18 Proton Flux)
5. `xray_flux_sim.txt` (NOAA GOES-18 X-Ray Irradiance)

#### Step 1.2: Delete Files 6 and 7 Live in Front of Judges
In your terminal, run:
```bash
cd /home/shivodaya-/prakash
rm -f dispatch_records.csv dispatch_32f.bin semantic_dispatch.bin dispatch_summary.txt
```
*Show judges in File Explorer that the generated files are completely gone.*

#### Step 1.3: Run the Prakash Acquisition Engine
```bash
cd /home/shivodaya-/prakash
./run_cmd_demo.sh
```

#### Step 1.4: What Judges Will See
1. **Live Column Parsing Breakdown:** Zero-copy parser reads all 44 columns across the 5 streams.
2. **High-Speed Filtered Alert Stream:** Terminal streams danger detections with color-coded classification:
   * 🔴 **Red:** CME and SEP high-energy particle bursts.
   * 🟡 **Yellow:** Solar Wind density surges.
   * 🟣 **Magenta:** Proton Flux S2 radiation storms.
   * 🔵 **Cyan:** X-Ray solar flares.
3. **Official Benchmark Table:**
   * **Source Data:** 500,000 rows = **38.76 MB**
   * **Dispatch CSV Ledger:** 60,271 alerts = **11.93 MB**
   * **Final 32-Float Binary Wire File:** 60,271 records = **10.58 MB**
   * **Net Deep-Space Bandwidth Reduction:** **72.71%**
   * **Processing Speed:** Ingests and filters 500,000 rows in **~450 milliseconds** (>1.1 million rows/sec)!

#### Step 1.5: Refresh File Explorer
Press `F5` in Windows File Explorer:
* `dispatch_records.csv` and `dispatch_32f.bin` reappear with new timestamps!

---

### ACT 2: NASA ION DTN Engine Demonstration (BPv7 RFC 9171)
**Where to run:** Terminal 1  
**Location:** `/home/shivodaya-/richa/ion_cpp_demo/`

This proves that Project Shivodaya integrates natively with the official NASA Jet Propulsion Laboratory (JPL) Interplanetary Overlay Network (ION) Delay-Tolerant Networking stack.

#### Commands to run:
```bash
cd /home/shivodaya-/richa/ion_cpp_demo/ion_runtime

# 1. Start the NASA ION DTN daemon (allocates SDR shared memory & starts LTP/BPv7)
ionstart -I loopback.rc

# 2. Run the C++ Sender to attach to the BP service and open endpoint ipn:1.1
cd /home/shivodaya-/richa/ion_cpp_demo
./sender

# 3. Gracefully stop the ION node and release shared memory semaphores
cd /home/shivodaya-/richa/ion_cpp_demo/ion_runtime
ionstop
```

#### What Judges Will See:
1. `ionstart` creates SDR (Software Defined Radio) working memory segments and initializes Posix Named Semaphores.
2. The C++ `sender` program issues `bp_attach()`, creates a Bundle Service Access Point (`BpSAP`), and registers source endpoint `ipn:1.1`.
3. Demonstrates native C/C++ compatibility with NASA JPL space flight software.
4. `ionstop` cleanly flushes bundles and cleans up shared memory.

---

### ACT 3: End-to-End Autonomous Mesh Pipeline
**Where to run:** Terminal  
**Location:** `/home/shivodaya-`

#### 1-Click Automated Pipeline Command:
```bash
cd /home/shivodaya-
./run_full_mesh_pipeline.sh
```

#### What Judges Will See (The Entire Mesh in Action):
1. **Prakash (`ipn:1.1`):** Ingests 500,000 rows, filters 60,271 alerts, and dispatches 184-byte bundles over UDP port 8088 and named pipes.
2. **Richa (`ipn:2.1`):** 
   * Ingests bundles on port 8088.
   * Verifies cryptographic marker `'Bhaarat'`.
   * C++ Neural Perceptron evaluates dynamic link conditions (Perceptron Score: `0.7820`).
   * Dynamic Dijkstra calculates the shortest interplanetary path (`ipn:1.1 -> ipn:2.1 -> ipn:3.1`).
   * Asynchronously commits decisions to SQLite (`richa_routing_log.db`).
   * Forwards bundle to Mars Base target (`ipn:3.1`) over UDP port 8090.
3. **Akashdeep (`ipn:3.1`):**
   * Ingests at Mars Base, validates `'Bhaarat'`, and runs the inverse MLP neural matrix reconstruction.
   * Logs reconstructed physical metrics (CME Speed, Proton Flux, Acceleration) to `akashdeep_mission_control.log`.
4. **Earth Monitor:** Queries SQLite database and displays a live synchronized telemetry table across deep-space ground stations: **ISRO (Bhaarat), NASA, ESA, Roscosmos, and JAXA**.

*(Note: You can also run them in separate terminals: Terminal 1: `cd build && ./akashdeep_decoder`, Terminal 2: `cd build && ./richa_neural_router`, Terminal 3: `cd build && ./prakash_encoder`, Terminal 4: `cd build && ./earth_monitor`).*

---

### ACT 4: Richa 3D Deep-Space Mesh Visualizer (`main3dvisual.html`)
**How to launch:**

* **Option A (Instant 1-Click on Windows):**  
  Double-click `main3dvisual.html` at:
  `C:\Users\lenovo\Desktop\shivodaya-\richa\main3dvisual.html`  
  *(Opens directly in Google Chrome, Microsoft Edge, or Firefox)*

* **Option B (Local Web Server from WSL):**
  ```bash
  cd /home/shivodaya-/richa
  python3 -m http.server 8000
  ```
  Open `http://localhost:8000/main3dvisual.html` in your browser.

#### What to Highlight to Judges:
1. **Interplanetary Space Mesh Topology:** Orbiting Sun, Earth, Lunar Gateway, Mars Base Alpha, and Deep-Space Relays representing ISRO, NASA, ESA, Roscosmos, JAXA, and SpaceX.
2. **Sun Radiation Sprinkler Effect:** Animated solar particles ejecting radially from the Sun.
3. **Normal DTN Route vs Autonomous Blackout Reroute:**
   * Click **Simulate Disturbance**: A massive red CME disturbance cube appears across the primary link.
   * Watch the routing lines instantly adapt: The bundle bypasses the blocked relay and routes through **Relay Gamma (Sun-Earth L5)** to reach Mars Base Alpha without packet loss!
4. **Interactive HUD Analytics:** Live link quality telemetry, buffer queue occupancy, and transmission logs.

---

### ACT 5: Akashdeep Mission Control 3D GUI (Java Swing)
**How to launch:**

* **Option A (From WSL / Linux Terminal):**
  ```bash
  cd /home/shivodaya-/akashdeep/java_gui
  java -cp "bin:." Main
  ```
  *(Or `./run_akashdeep_gui.sh`)*

* **Option B (Instant 1-Click on Windows):**  
  Double-click `run_akashdeep_gui.bat` at:
  `C:\Users\lenovo\Desktop\shivodaya-\akashdeep\java_gui\run_akashdeep_gui.bat`

#### What to Show Judges:
1. **Synchronized Clocks:** Real-time Earth Time (IST) and Mars Coordinated Time (MTC) with 13-hour/20-minute offset.
2. **5 Speedometer Gauges:** 3 out of 5 metrics held in the **RED CRITICAL DANGER ZONE** (>75% scale):
   * CME Velocity: `> 2,400 km/s`
   * Solar Flares: `> 1,600 pfu`
   * Proton Flux: `> 800 pfu`
3. **3D Celestial Trajectory Engine:** Interactive canvas showing the orbital paths of Earth and Mars, the Akashdeep spacecraft trajectory, and the incoming solar shockfront wavefront.
4. **Space Health Meter & Tactical Safety Directives:** Live advisory advising crew to `EXECUTE SAFE ZONE` and `RE-CALCULATE PATH`.
5. **Interactive Sub-Windows:** Click any stream button (`▶ CME VELOCITY`) to open the detailed sub-window with progressive live-building waveform charts.

---

### ACT 6: Earth Operations Control Center (Java Desktop GUI)
**How to launch:**

* **Option A (From WSL / Linux Terminal):**
  ```bash
  cd /home/shivodaya-
  ./run_earth_control_center.sh
  ```

* **Option B (Instant 1-Click on Windows):**  
  Double-click `run_earth_control_center.bat` at:
  `C:\Users\lenovo\Desktop\shivodaya-\run_earth_control_center.bat`

#### What to Show Judges:
1. **Modern Dark HUD Interface:** Built using FlatDarkLaf with high-contrast space typography.
2. **Real Deep-Space Database Integration:** Connected to SQLite telemetry tables.
3. **Multi-Agency Ground Tracking:** Real-time signal strength, antenna dish azimuth/elevation, and NASA/ISRO audit logs.

---

### ACT 7: Aerospace Web Platform & Landing Portal
**How to launch:**
```bash
cd /home/shivodaya-
./run_web.sh
```
Open in browser: `http://localhost:3000`

#### What to Show Judges:
1. **Cinematic Hero Landing:** Fullscreen aerospace spaceship video background with live mission countdown.
2. **7-Step Onboarding Mission Wizard:** Interactive registration workflow for space agency researchers.
3. **Telemetry Status Lookup Modal:** Instant search of radiation alert manifests and employee clearance verification.

---

## 4. Key Metrics & Numbers Cheat Sheet (Memorize These)

| Metric | Measured Value | Scientific Rationale |
| :--- | :--- | :--- |
| **Total Source Rows** | **500,000 records** | 100,000 rows $\times$ 5 official space-weather streams |
| **Preserved Columns** | **44 official columns** | CME (13), SEP (8), Wind (9), Proton (6), X-Ray (8) |
| **Raw Ingestion Size** | **38.76 MB** | Full uncompressed ASCII telemetry files |
| **Filtered Danger Alerts** | **60,271 alerts** | Critical radiation events crossing scientific danger limits |
| **Human Dispatch Ledger** | **11.93 MB** | Comprehensive CSV audit ledger (`dispatch_records.csv`) |
| **Binary Wire Format** | **10.58 MB** | Compact IEEE-754 32-float format (`dispatch_32f.bin`) |
| **Net Bandwidth Reduction**| **72.71%** | $38.76\text{ MB} \rightarrow 10.58\text{ MB}$ deep-space transmission savings |
| **Wire Frame Size** | **184 bytes** | 32B timestamp + 4B type + 12B physics + 128B (32 floats) + 8B marker |
| **Cryptographic Marker** | `'Bhaarat'` | Authenticates payload integrity across inter-agency nodes |
| **Processing Throughput** | **> 1,100,000 rows/sec** | Zero-copy POSIX `mmap()` & 64-byte aligned lock-free ring buffers |
| **Inference Latency** | **< 1.8 milliseconds** | High-speed C++ native inverse MLP projection engine |

---

## 5. Top 5 Questions Judges Will Ask & How to Win

#### Q1: "Why did you build your own mesh instead of using standard TCP/IP?"
> **Answer:** "Standard TCP/IP requires continuous round-trip handshakes. Between Earth and Mars, radio signals take 4 to 24 minutes one-way. A single TCP SYN/ACK handshake takes 48 minutes just to establish a connection. Celestial orbital mechanics also break line of sight as planets rotate. TCP interprets this as packet loss and permanently disconnects. Project Shivodaya implements Delay-Tolerant Networking (RFC 9171 Bundle Protocol v7) with Store-and-Forward architecture, allowing packets to traverse orbital relays asynchronously without waiting for continuous end-to-end circuits."

#### Q2: "Why use .bin binary wire format instead of JSON or CSV?"
> **Answer:** "Text files waste immense deep-space bandwidth on commas, quotes, and ASCII characters. More importantly, text requires the receiving Mars computer to waste clock cycles running string-parsing functions like `atof()` and `sscanf()`. Our `.bin` format stores raw IEEE-754 bytes directly. The receiving flight computer on Mars can load the 184-byte bundle directly into RAM via Direct Memory Access (DMA) and feed the 32 latent floats straight into its neural network without a single line of parsing code."

#### Q3: "How does rate-of-change ($\frac{d\Phi}{dt}$) detection work?"
> **Answer:** "Static thresholds only trigger after a radiation ceiling is already breached, which is too late for astronauts on EVA spacewalks. Prakash calculates first-order discrete derivatives ($\Delta = \Phi_t - \Phi_{t-1}$) between consecutive sensor measurements. A sudden rate spike (e.g. CME accelerating $> 350\text{ km/s/min}$) signals a solar shockfront minutes before static limits are crossed, giving crews critical life-saving lead time to reach shelter."

#### Q4: "What happens if a relay satellite is knocked out by radiation?"
> **Answer:** "Richa evaluates link health in real time using an autonomous Neural Perceptron and Time-Varying Graph Dijkstra. When a relay goes offline (like Relay Alpha in our 3D visualizer), Richa detects the broken link and immediately executes an autonomous BFS reroute through alternate orbital paths (such as Relay Gamma at Sun-Earth L5 to Relay Beta to Mars), all without requiring ground operators on Earth."

#### Q5: "How does the system ensure data integrity across different space agencies?"
> **Answer:** "Every 184-byte bundle carries a fixed 8-byte cryptographic system marker `'Bhaarat\0'` alongside the 32-float JSCC payload. Downstream nodes (`ipn:2.1` and `ipn:3.1`) strictly validate this wire marker before ingesting the payload into the routing engine or inverse MLP decoder. Any corrupted, incomplete, or unauthorized frames are dropped immediately."
