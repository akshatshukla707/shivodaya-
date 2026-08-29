# Project Shivodaya: Deep Space Mesh Radiation Alert & Store-and-Forward Architecture

## Executive Overview
**Project Shivodaya** is a high-performance deep-space mesh network architecture designed for real-time solar radiation telemetry acquisition, space weather alert routing, and delay-tolerant store-and-forward communications.

The system is composed of four primary sub-modules:
1. **Prakash Module (Telemetry Acquisition & Pre-Processing Engine)**: Written in C11, optimized with zero-copy POSIX `mmap()`, lock-free C11 atomic ring buffers, core pinning (`pthread_setaffinity_np()`), L1 cache line isolation (`alignas(64)`), and JSCC 32-float semantic linear projection.
2. **Richa Module (Interplanetary Transport & DTN Engine)**: Written in C++/HTML5/Three.js, implementing dynamic Dijkstra Contact Graph Routing (CGR), Bundle Protocol v7 (RFC 9171 / BPv7) Store-and-Forward Custody Transfer, and a real-time 3D deep space visualizer dashboard.
3. **Akashdeep Module (Autonomous Mission Control & Early Warning System)**: Written in Java Swing (JDK 17+), featuring a pseudo-3D celestial trajectory engine, overall space health meter, automated flight safety advisory engine, dynamic waveform chart builder, and auto-data integration feeder writing to SQLite (`akashdeep_telemetry.db`).
4. **Earth Operations Monitoring Center**: Native C++ SQLite query bridge and HTML5 WebGL dashboard monitoring deep-space agency nodes (ISRO Bhaarat, NASA, ESA, Roscosmos, JAXA).

---

## 1. Prakash Module: Sensor Telemetry Acquisition Architecture

### Core Technical Principles
- **Zero-Copy Memory-Mapped File I/O (`mmap()`)**: Avoids double-buffering by mapping telemetry streams directly into memory address space with `madvise(..., MADV_SEQUENTIAL)`.
- **Lock-Free SPCM/MPMC Ring Buffer (`stdatomic.h`)**: Operates without POSIX mutexes or kernel lock contention, enabling nanosecond lock-free synchronization.
- **Power-of-2 Indexing**: Replaces modulo division with 1-cycle CPU bitwise logic (`(index + 1) & 4095`).
- **L1 Cache Line Alignment (`alignas(64)`)**: Eliminates CPU false sharing by isolating atomic read/write pointers onto separate 64-byte hardware cache lines.
- **Fast Zero-Allocation ASCII-to-Float Parser (`fast_atof`)**: Direct memory pointer arithmetic parsing without `sscanf()` overhead, cutting processing time for 500,000 records down to ~330 ms.
- **Derivative Spike Detection ($\frac{d\Phi}{dt}$)**: Real-time detection of radiation acceleration prior to absolute limit breaches.
- **Joint Source-Channel Coding (JSCC)**: Compresses raw telemetry features into 32-float semantic vectors embedded with the security marker `'Bhaarat'`.

### Data Stream Thresholds & Derivative Rules
| Telemetry Stream | Physical Quantity | Danger Ceiling | Derivative Warning ($\frac{d\Phi}{dt}$) |
| :--- | :--- | :--- | :--- |
| `cme_sim.txt` | Coronal Mass Ejection | Velocity $> 1000.0\text{ km/s}$ & Width $= 360^\circ$ | Acceleration $> 800.0\text{ km/s/min}$ |
| `sep_sim.txt` | Solar Energetic Particle | Intensity $> 50.0$ | Spike Rate $> 500.0\text{ /min}$ |
| `solar_wind_sim.txt` | Solar Wind | Speed $> 800.0\text{ km/s}$ | Acceleration $> 300.0\text{ km/s/min}$ |
| `proton_flux_sim.txt` | Proton Flux | Flux $> 100.0\text{ p/cm}^2/\text{s/sr}$ | Surge Rate $> 200.0\text{ p/cm}^2/\text{s/sr/min}$ |
| `xray_flux_sim.txt` | X-Ray Flux | Flux $> 0.5\text{ W/m}^2$ | Surge Rate $> 0.1\text{ W/m}^2/\text{min}$ |

---

## 2. Richa Module: Interplanetary Mesh & DTN Transport Architecture

### Core Technical Principles
- **Dynamic Contact Graph Routing (CGR)**: Uses a C++ dynamic Dijkstra algorithm over 100 deep-space mesh nodes (representing solar probes, relays, and planetary bases) to recalculate optimal multi-hop paths around coronal mass ejections and solar flare blackout zones.
- **Bundle Protocol v7 (RFC 9171 / BPv7) Store-and-Forward**: Handles planetary occultations and long propagation delays via non-volatile custody memory. Sender EID (`ipn:1.1`), Cis-Lunar Relay EID (`ipn:2.1`), and Mars Base EID (`ipn:3.1`).
- **Blackout Delay Latency Tracking**: Computes exact custody transfer latency and blackout duration when delayed receivers reconnect.
- **3D Deep Space Visualizer (`richa/index3d.html`)**: Real-time Three.js visualization featuring orbital rings, particle-emitter sun radiation sprinklers, interactive blackout triggers, CGR path rerouting lines, and collapsible console sidebars.

---

## 3. Akashdeep Module: Autonomous Mission Control & Early Warning System

### Core Technical Principles
- **Single-Unit Autonomous Data Integration**: Embedded background thread (`startAutoDataFeeder()`) automatically populates and streams telemetry records into SQLite (`akashdeep_telemetry.db`), running standalone without requiring manual data input.
- **3D Celestial Trajectory Engine (`TrajectoryMapPanel` & `ExpandedTrajectoryFrame`)**:
  - Renders 3D perspective plane grid, 3D Sun sphere, 3D Earth station, and 3D Mars target (`ipn:3.1`).
  - Animates smooth harmonic spacecraft transit along the 3D parabolic transfer arc (Perseverance / Akashdeep flight vector).
  - Renders 3D solar radiation particle swarms and concentric shockwave envelopes actively chasing the spacecraft.
- **Overall Space Health Index Meter (`HealthMeterPanel`)**: Calculates space weather threat status (0-100%) with dynamic color-coded arcs (`NOMINAL HEALTH`, `ELEVATED THREAT`, `CRITICAL SEVERE`).
- **Actionable Flight Safety Advisory (`FlightSuggestionPanel`)**: Generates real-time tactical directives and interactive buttons (`EXECUTE SAFE ZONE` and `RE-CALCULATE PATH`).
- **Gradual Waveform Builder (`DangerEventsChart` & `CMEAlertTrendChart`)**: Streams dataset rows at a controlled, steady pace (every 300-400 ms) so judges watch the line plot construct live.
- **Go Back Screen Navigation**: Includes prominent `[◀ GO BACK TO MAIN CONTROL CENTER]` header buttons on all sub-windows (`CME_Dashboard` and `ExpandedTrajectoryFrame`).

---

## 4. Key Execution & Build Commands

### **Full C/C++ Native Mesh Pipeline Build & Run**
```bash
# Build native C/C++ binaries
cd shivodaya
./build_all.sh

# Run end-to-end Prakash -> Richa -> Akashdeep -> Earth Monitor pipeline
./run_full_mesh_pipeline.sh
```

### **Akashdeep Control Center GUI Build & Run**
```bash
# Build Java GUI codebase
cd shivodaya
./build_java.sh

# Launch Akashdeep Control Center Dashboard
cd shivodaya/akashdeep/java_gui
java -cp "bin" Main
```

---

## 5. Overall Execution Summary Benchmark
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
