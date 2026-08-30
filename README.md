# Project Shivodaya: Interplanetary Neural DTN & Solar Early Warning System

**Project Shivodaya** is a space mesh network architecture designed for real-time solar radiation telemetry acquisition, neural space weather alert routing, delay-tolerant communications (DTN), and ground station operations.

---

## Architecture Overview

1. **Prakash Module (`prakash/`)**: Native C11 JSCC 32-float linear projection vector encoder (`ipn:1.1`). Memory-mapped (`mmap`) 5-stream ingestion, lock-free ring buffer.
2. **Richa Module (`richa/`)**: Native C++17 Perceptron node router (`ipn:2.1`). 100-node TVG Time-Dependent Dijkstra routing with fallback multi-hop BFS rerouting during solar blackouts. Asynchronous SQLite3 WAL logging (`richa_routing_log.db`). Includes Bundle Protocol v7 (BPv7) store-and-forward custody engine (`ion_dtn_demo/`).
3. **Akashdeep Module (`akashdeep/`)**: Native C++17 semantic decoder (`ipn:3.1`). Reverse MLP matrix multiplication projection and alert logging (`akashdeep_mission_control.log`). Includes Java Swing CME telemetry dashboard (`akashdeep/java_gui/`).
4. **Ground Operations Center (`earth_control_center/`)**: Java Swing HUD monitoring dashboard for deep-space agency nodes (ISRO, NASA, ESA, Roscosmos, JAXA) with live waveform charts, collapsible sidebars, and radiation alert dispatches.
5. **Earth Operations Visualizer (`earth_monitor/` & `richa/main3dvisual.html`)**: SQLite query bridge and HTML5 WebGL 3D Deep Space Mesh visualizers.

---

## Project Directory Structure

```text
shivodaya/
├── prakash/                   # Acquisition & JSCC Encoder Module (C11)
├── richa/                     # Neural Router & DTN Transport Engine (C++17)
│   └── ion_dtn_demo/          # Bundle Protocol v7 (BPv7) Custody Engine
├── akashdeep/                 # Mars Target Semantic Decoder & Java GUI
├── earth_control_center/      # Ground Operations Control Center GUI (Java)
├── earth_monitor/             # Earth Monitoring Bridge & 3D Dashboard Modal
├── build_all.sh               # Builds all C/C++ native binaries into build/
├── build_java.sh              # Builds Java GUIs (Akashdeep & Ground Operations)
├── run_earth_control_center.sh# Launches Ground Operations GUI
├── run_full_mesh_pipeline.sh  # Automated end-to-end pipeline runner
└── ARCHITECTURE.md            # Detailed system design & pipeline flowchart
```

---

## Quick Start & Build Instructions

### Prerequisites
- GCC / G++ (C11 / C++17 support)
- CMake 3.10+
- Java JDK 17 or higher
- SQLite3 development libraries (`libsqlite3-dev`)

### 1. Build All Native C/C++ Binaries
```bash
./build_all.sh
```
This compiles `prakash_encoder`, `richa_neural_router`, `akashdeep_decoder`, `earth_monitor`, and `ion_dtn_engine` into the `build/` directory.

### 2. Build All Java GUI Applications
```bash
./build_java.sh
```
This compiles the Akashdeep CME Dashboard and the Ground Operations Control Center GUI into their respective `bin/` directories.

### 3. Run Ground Operations Control Center
```bash
./run_earth_control_center.sh
```

### 4. Run Akashdeep Target Dashboard
```bash
cd akashdeep/java_gui
java -cp "bin:." Main
```

### 5. Run Full End-to-End Mesh Pipeline
```bash
./run_full_mesh_pipeline.sh
```

---

## WebGL 3D Visualization

To launch the interactive 3D Deep Space Mesh visualizer directly in your web browser:
- **3D Solar Network Mesh**: Open `richa/main3dvisual.html`
- **Earth Operations Visualizer**: Open `earth_monitor/index_earth_dashboard.html`

---

## Presentation & Guidance

For presentation execution steps, refer to:
- [`PRESENTATION_GUIDE.md`](./PRESENTATION_GUIDE.md)
- [`ARCHITECTURE.md`](./ARCHITECTURE.md)
