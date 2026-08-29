# Project Shivodaya: System Architecture & Execution Flowchart

## Executive Overview
**Project Shivodaya** is a high-performance deep-space mesh network architecture designed for real-time solar radiation telemetry acquisition, space weather alert routing, and delay-tolerant store-and-forward communications.

The system is composed of four primary sub-modules:
1. **Prakash Module (Telemetry Acquisition & Pre-Processing Engine)**: Written in C11, optimized with zero-copy POSIX `mmap()`, lock-free C11 atomic ring buffers, core pinning (`pthread_setaffinity_np()`), L1 cache line isolation (`alignas(64)`), and JSCC 32-float semantic linear projection.
2. **Richa Module (Interplanetary Transport & DTN Engine)**: Written in C++/HTML5/Three.js, implementing dynamic Dijkstra Contact Graph Routing (CGR), Bundle Protocol v7 (RFC 9171 / BPv7) Store-and-Forward Custody Transfer, and a real-time 3D deep space visualizer dashboard.
3. **Akashdeep Module (Autonomous Mission Control & Early Warning System)**: Written in Java Swing (JDK 17+), featuring a pseudo-3D celestial trajectory engine, overall space health meter, automated flight safety advisory engine, dynamic waveform chart builder, and auto-data integration feeder writing to SQLite (`akashdeep_telemetry.db`).
4. **Earth Operations Monitoring Center**: Native C++ SQLite query bridge and HTML5 WebGL dashboard monitoring deep-space agency nodes (ISRO Bhaarat, NASA, ESA, Roscosmos, JAXA).

---

## Complete End-to-End System Flowchart & File Dependencies

```mermaid
flowchart TD
    subgraph DataInputs ["1. Raw Telemetry Input Files"]
        CME["prakash/cme_sim.txt"]
        SEP["prakash/sep_sim.txt"]
        SW["prakash/solar_wind_sim.txt"]
        PF["prakash/proton_flux_sim.txt"]
        XRAY["prakash/xray_flux_sim.txt"]
    end

    subgraph PrakashModule ["2. PRAKASH Module (Aditya-L1 - ipn:1.1)"]
        PE_C["prakash/prakash_encoder.c<br/>(C11, POSIX mmap, Ring Buffer)"]
        WD_TXT["prakash/warning_dispatch.txt<br/>(Semantic Vectors + Bhaarat Marker)"]
        PE_BIN["build/prakash_encoder"]
    end

    subgraph RichaModule ["3. RICHA Module (Cis-Lunar Mesh - ipn:2.1)"]
        R_CPP["richa/richa_neural_router.cpp<br/>(C++17, Perceptron CGR, Dijkstra)"]
        RD_LOG["richa/richa_dispatch_log.txt<br/>(Trajectory Dispatches)"]
        RL_DB["build/richa_routing_log.db<br/>(Async SQLite WAL Logger)"]
        R_BIN["build/richa_neural_router"]
        
        ION_CPP["richa/ion_dtn_demo/ion_dtn_engine.cpp<br/>(BPv7 Custody Transfer & Blackout Store)"]
        ION_BIN["build/ion_dtn_engine"]
    end

    subgraph AkashdeepModule ["4. AKASHDEEP Module (Mars Base - ipn:3.1)"]
        AD_CPP["akashdeep/akashdeep_decoder.cpp<br/>(C++17, Reverse Matrix Projection)"]
        MC_LOG["build/akashdeep_mission_control.log<br/>(Mission Log)"]
        AD_BIN["build/akashdeep_decoder"]

        subgraph JavaGUI ["Akashdeep Mission Control Java GUI"]
            J_MAIN["akashdeep/java_gui/Main.java"]
            J_DASH["akashdeep/java_gui/CME_Dashboard.java"]
            J_DB["akashdeep/java_gui/org/sqlite/JDBC.java<br/>(Embedded SQLite Driver)"]
            J_DATA["akashdeep/java_gui/CME_dataset_1000_harmful.txt"]
            AT_DB["build/akashdeep_telemetry.db"]
        end
    end

    subgraph EarthModule ["5. EARTH OPERATIONS CENTER"]
        EM_CPP["earth_monitor/earth_monitor.cpp<br/>(C++17, Query Bridge)"]
        EM_BIN["build/earth_monitor"]
        HTML_DASH["earth_monitor/index_earth_dashboard.html<br/>(HTML5 / WebGL 3D Dashboard)"]
        THREE_3D["richa/index3d.html<br/>(Three.js Mesh Visualizer)"]
    end

    %% Dependencies and Flow
    CME & SEP & SW & PF & XRAY -->|mmap Stream Ingest| PE_C
    PE_C -->|Compiles to| PE_BIN
    PE_BIN -->|Outputs| WD_TXT
    PE_BIN -->|IPC FIFO Pipe /tmp/shivodaya_richa_ingress.fifo| R_BIN

    WD_TXT -->|Reads Dispatches| R_CPP
    R_CPP -->|Compiles to| R_BIN
    R_BIN -->|Outputs| RD_LOG
    R_BIN -->|Async Log| RL_DB
    R_BIN -->|IPC FIFO Pipe /tmp/shivodaya_akashdeep_ingress.fifo| AD_BIN

    R_BIN -->|Optional ION BPv7 Engine| ION_CPP
    ION_CPP -->|Compiles to| ION_BIN

    AD_CPP -->|Compiles to| AD_BIN
    AD_BIN -->|Writes Logs| MC_LOG

    J_DATA & J_DB -->|Ingested by| J_MAIN & J_DASH
    J_MAIN -->|Auto-Populates| AT_DB
    
    RL_DB & AT_DB -->|Queries DB| EM_CPP
    EM_CPP -->|Compiles to| EM_BIN
    
    RL_DB -->|Streams Telemetry| HTML_DASH
    RL_DB -->|Renders Mesh Node Graph| THREE_3D
```

---

## File-by-File Dependency & Execution Matrix

### 1. Prakash Module (Telemetry Acquisition & Semantic Encoding)
| File | Language / Type | External & Internal Dependencies | What It Does / How to Run |
| :--- | :--- | :--- | :--- |
| `prakash/prakash_encoder.c` | C11 | `pthread`, `math`, `third_party/sqlite3` | Zero-copy mmap telemetry parser. Compiles to `build/prakash_encoder`. |
| `prakash/*_sim.txt` | Input Data | None | 5 simulation streams (`cme`, `sep`, `solar_wind`, `proton_flux`, `xray_flux`). |
| `prakash/prakash.c` | C11 | `pthread`, `stdatomic.h` | Standalone CLI encoder generating `prakash/warning_dispatch.txt`. Run via `./prakash/run_cmd_demo.sh`. |

### 2. Richa Module (Interplanetary Neural DTN Router)
| File | Language / Type | External & Internal Dependencies | What It Does / How to Run |
| :--- | :--- | :--- | :--- |
| `richa/richa_neural_router.cpp` | C++17 | `pthread`, `sqlite3_static` (`third_party/sqlite3`) | 100-node Perceptron Dijkstra CGR router. Compiles to `build/richa_neural_router`. |
| `richa/richa.cpp` | C++17 | `prakash/warning_dispatch.txt` | Offline batch router script. Run via `./richa/run_richa_demo.sh`. |
| `richa/ion_dtn_demo/ion_dtn_engine.cpp` | C++17 | `pthread`, `math` | Standalone BPv7 store-and-forward custody engine with delayed receiver simulation. Tested via `python3 richa/ion_dtn_demo/test_ion_dtn_engine.py`. |
| `richa/index3d.html` | HTML5 / JS | Three.js (via CDN), `build/richa_routing_log.db` | Interactive 3D Deep Space network mesh visualizer. Open directly in browser. |

### 3. Akashdeep Module (Mars Target Semantic Decoder & Mission Control)
| File | Language / Type | External & Internal Dependencies | What It Does / How to Run |
| :--- | :--- | :--- | :--- |
| `akashdeep/akashdeep_decoder.cpp` | C++17 | `pthread`, `sqlite3_static` | Inverse matrix projection decoder writing to `build/akashdeep_mission_control.log`. |
| `akashdeep/java_gui/Main.java` | Java (JDK 17+) | Java Swing, `org/sqlite/JDBC.java` | Launcher for 3D Celestial Trajectory Engine & Control Center. Run via `./build_java.sh` then `cd akashdeep/java_gui && java -cp "bin" Main`. |
| `akashdeep/java_gui/CME_Dashboard.java` | Java (JDK 17+) | `CME_dataset_1000_harmful.txt`, `org/sqlite/JDBC.java` | Live telemetry dashboard, health meter, safety advisory & chart builder. |

### 4. Earth Operations Monitoring Center
| File | Language / Type | External & Internal Dependencies | What It Does / How to Run |
| :--- | :--- | :--- | :--- |
| `earth_monitor/earth_monitor.cpp` | C++17 | `build/richa_routing_log.db`, `sqlite3_static` | Command line SQLite telemetry log bridge. Compiles to `build/earth_monitor`. |
| `earth_monitor/index_earth_dashboard.html` | HTML5 / JS | Three.js (via CDN), `richa_routing_log.db` | WebGL 3D Earth Station Operations dashboard modal and alert viewer. |

---

## Core Build & Execution Workflows

### 1. Single Command Build
```bash
./build_all.sh      # Compiles all C/C++ modules into build/
./build_java.sh     # Compiles Java Swing GUI into akashdeep/java_gui/bin/
```

### 2. End-to-End Automated Pipeline Execution
```bash
./run_full_mesh_pipeline.sh
```
Executes: `prakash_encoder` $\rightarrow$ `richa_neural_router` $\rightarrow$ `akashdeep_decoder` $\rightarrow$ `earth_monitor`.

---

## Technical Performance Benchmarks
```text
========================================================================
             PROJECT SHIVODAYA :: SYSTEM ARCHITECTURE BENCHMARK         
========================================================================
[+] Prakash Telemetry Pipeline : 500,000 Records Parsed in 0.330 sec
[+] Synchronization Primitive : Lock-Free Atomic SPCM/MPMC Ring Buffer
[+] Cache Optimization        : 64-Byte Line Alignment & Power-of-2 Bitwise Masking
[+] Networking Protocols      : RFC 9171 BPv7 DTN & Contact Graph Routing (CGR)
[+] Deep Space Mesh Nodes     : 100 Inter-Agency Space Probes & Orbiters
[+] Control Center GUI        : Pseudo-3D Celestial Engine & Live SQLite Bridge
========================================================================
```
