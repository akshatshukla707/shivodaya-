"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Search, ZoomIn, ZoomOut, RotateCcw, Maximize2, 
  Layers, Cpu, Database, Network, Radio, Shield, Terminal, 
  ExternalLink, Sparkles, X, ChevronRight, FileCode, Play,
  GitFork, Share2, Workflow, Check, ArrowRight, Activity,
  Server, HardDrive, Compass, Gauge, AlertTriangle, ChevronDown
} from "lucide-react";

// ============================================================================
// ARCHITECTURE DATA WITH EXACT REQUESTED COLOR MAPPING:
// Group 1: Telemetry Inputs (#9CA3AF)
// Group 2: PRAKASH Aditya-L1 (#FBBF24)
// Group 3: RICHA Cis-Lunar (#06B6D4)
// Group 4: AKASHDEEP Mars Base (#EF4444)
// Group 5: Earth Operations (#10B981)
// ============================================================================
const GRAPH_NODES = [
  // Group 1: Raw Telemetry Inputs (Soft Grey #9CA3AF)
  { 
    id: "cme_sim", 
    name: "cme_sim.txt", 
    label: "cme_sim.txt", 
    group: "inputs", 
    color: "#9CA3AF", 
    val: 8,
    type: "Input Stream",
    path: "prakash/cme_sim.txt",
    subsystem: "Raw Telemetry Inputs",
    desc: "Simulated CME stream recording coronal ejection velocities (km/s), angular widths (deg), and flare power indices.",
    tech: "1,000 Event Epochs • Sensor Telemetry",
    command: "head -n 5 prakash/cme_sim.txt"
  },
  { 
    id: "sep_sim", 
    name: "sep_sim.txt", 
    label: "sep_sim.txt", 
    group: "inputs", 
    color: "#9CA3AF", 
    val: 8,
    type: "Input Stream",
    path: "prakash/sep_sim.txt",
    subsystem: "Raw Telemetry Inputs",
    desc: "Solar Energetic Particles (SEP) flux tracking high-energy proton acceleration during coronal shockwaves.",
    tech: "Omni-directional Proton Flux",
    command: "head -n 5 prakash/sep_sim.txt"
  },
  { 
    id: "solar_wind_sim", 
    name: "solar_wind_sim.txt", 
    label: "solar_wind_sim.txt", 
    group: "inputs", 
    color: "#9CA3AF", 
    val: 8,
    type: "Input Stream",
    path: "prakash/solar_wind_sim.txt",
    subsystem: "Raw Telemetry Inputs",
    desc: "Heliospheric bulk plasma density, speed, and magnetic vector orientation measurements.",
    tech: "Plasma Spectrometer Feeds",
    command: "head -n 5 prakash/solar_wind_sim.txt"
  },
  { 
    id: "proton_flux_sim", 
    name: "proton_flux_sim.txt", 
    label: "proton_flux_sim.txt", 
    group: "inputs", 
    color: "#9CA3AF", 
    val: 8,
    type: "Input Stream",
    path: "prakash/proton_flux_sim.txt",
    subsystem: "Raw Telemetry Inputs",
    desc: "High-energy proton spectrum calibrated to Aditya-L1 ASPEX and PAPA sensor payloads.",
    tech: "Calibrated Flux Channels",
    command: "head -n 5 prakash/proton_flux_sim.txt"
  },
  { 
    id: "xray_flux_sim", 
    name: "xray_flux_sim.txt", 
    label: "xray_flux_sim.txt", 
    group: "inputs", 
    color: "#9CA3AF", 
    val: 8,
    type: "Input Stream",
    path: "prakash/xray_flux_sim.txt",
    subsystem: "Raw Telemetry Inputs",
    desc: "Soft and hard X-ray irradiance curves (0.5-4.0 Å and 1.0-8.0 Å) triggering immediate flare alerts.",
    tech: "Photometer Sensor Stream",
    command: "head -n 5 prakash/xray_flux_sim.txt"
  },

  // Group 2: PRAKASH Module (Vibrant Yellow #FBBF24)
  { 
    id: "prakash_encoder", 
    name: "prakash_encoder.c", 
    label: "prakash_encoder.c", 
    group: "prakash", 
    color: "#FBBF24", 
    val: 14,
    type: "C11 Core Engine",
    path: "prakash/prakash_encoder.c",
    subsystem: "PRAKASH (Aditya-L1 - ipn:1.1)",
    desc: "High-speed C11 telemetry parser utilizing zero-copy POSIX mmap(), lock-free atomic ring buffers (alignas(64)), core affinity pinning (pthread_setaffinity_np), and derivative spike detection (dPhi/dt).",
    tech: "C11 • POSIX mmap • Lock-free Atomics • pthread",
    code: `// Zero-copy POSIX mmap() & C11 atomic ring buffer
void* map = mmap(NULL, sb.st_size, PROT_READ, MAP_SHARED, fd, 0);
pthread_setaffinity_np(thread, sizeof(cpu_set_t), &cpuset);
alignas(64) atomic_uint_fast64_t head;`,
    command: "gcc -O3 -std=c11 prakash/prakash_encoder.c -o build/prakash_encoder -lpthread -lm"
  },
  { 
    id: "jscc_transform", 
    name: "JSCC Linear Projection", 
    label: "JSCC 32-Float Transform", 
    group: "prakash", 
    color: "#FBBF24", 
    val: 10,
    type: "Compression Algorithm",
    path: "Algorithm in prakash/prakash_encoder.c",
    subsystem: "PRAKASH (Aditya-L1 - ipn:1.1)",
    desc: "1-layer Joint Source-Channel Coding linear projection matrix compressing 5 physical telemetry streams into a microscopic 32-float semantic vector (~128 bytes total). Embeds 'Bhaarat' security marker.",
    tech: "32-Float Vector • 128 Bytes • 'Bhaarat' Header",
    code: `// JSCC Linear Transform Matrix Projection
float vector[32];
for(int i = 0; i < 32; i++) {
  vector[i] = 0.0f;
  for(int k = 0; k < 5; k++) vector[i] += W[i][k] * raw_telemetry[k];
}
memcpy(packet.header, "Bhaarat", 7);`,
    command: "./prakash/run_cmd_demo.sh"
  },
  { 
    id: "warning_dispatch", 
    name: "warning_dispatch.txt", 
    label: "warning_dispatch.txt", 
    group: "prakash", 
    color: "#FBBF24", 
    val: 8,
    type: "Data Artifact",
    path: "prakash/warning_dispatch.txt",
    subsystem: "PRAKASH (Aditya-L1 - ipn:1.1)",
    desc: "Serialized semantic vector dispatches generated by the Prakash module for batch file transfers and offline replay.",
    tech: "Serialized Vector Dispatch",
    command: "cat prakash/warning_dispatch.txt"
  },
  { 
    id: "prakash_bin", 
    name: "build/prakash_encoder", 
    label: "prakash_encoder (Binary)", 
    group: "prakash", 
    color: "#FBBF24", 
    val: 10,
    type: "Compiled Binary",
    path: "build/prakash_encoder",
    subsystem: "PRAKASH (Aditya-L1 - ipn:1.1)",
    desc: "Compiled native executable running on the Aditya-L1 sentry processor.",
    tech: "ELF 64-bit LSB Executable",
    command: "./build/prakash_encoder"
  },
  { 
    id: "pipe_richa_ingress", 
    name: "IPC FIFO Pipe", 
    label: "/tmp/shivodaya_richa_ingress.fifo", 
    group: "prakash", 
    color: "#FBBF24", 
    val: 9,
    type: "IPC Mechanism",
    path: "/tmp/shivodaya_richa_ingress.fifo",
    subsystem: "Inter-Process Communication",
    desc: "High-speed POSIX Named FIFO pipe streaming compressed telemetry vectors from Prakash directly to Richa without disk I/O.",
    tech: "POSIX Named Pipe • Zero-Disk Transfer",
    command: "mkfifo /tmp/shivodaya_richa_ingress.fifo"
  },

  // Group 3: RICHA Module (Deep Cyan/Blue #06B6D4)
  { 
    id: "richa_router", 
    name: "richa_neural_router.cpp", 
    label: "richa_neural_router.cpp", 
    group: "richa", 
    color: "#06B6D4", 
    val: 14,
    type: "C++17 Neural Router",
    path: "richa/richa_neural_router.cpp",
    subsystem: "RICHA (Cis-Lunar Mesh - ipn:2.1)",
    desc: "100-node Interplanetary Space Mesh router evaluating links across ISRO, NASA, ESA, Roscosmos, and JAXA orbiters. Runs Perceptron decision weights and Dijkstra Contact Graph Routing.",
    tech: "C++17 • SQLite WAL • 100-Node Mesh Topology",
    code: `// Perceptron decision scoring & Dijkstra Contact Graph Routing
double W_cost = w_rad * rad_score + w_delay * delay_ms + w_buf * buf_pct;
if (rad_score > BLACKOUT_THRESH) {
  trigger_multihop_bfs_reroute();
}`,
    command: "g++ -O3 -std=c++17 richa/richa_neural_router.cpp -o build/richa_neural_router -lpthread -lsqlite3"
  },
  { 
    id: "perceptron_model", 
    name: "Perceptron Decision Model", 
    label: "Perceptron Weight Scorer", 
    group: "richa", 
    color: "#06B6D4", 
    val: 10,
    type: "Decision Algorithm",
    path: "Algorithm in richa/richa_neural_router.cpp",
    subsystem: "RICHA (Cis-Lunar Mesh - ipn:2.1)",
    desc: "Neural weight scoring equation W_i = sum(w_k * x_k) + b balancing radiation storm severity, propagation delay, remaining buffer health, and orbital line-of-sight.",
    tech: "W_i = \\sum w_k x_k + b",
    command: "./richa/run_richa_demo.sh"
  },
  { 
    id: "dijkstra_cgr", 
    name: "Time-Dependent Dijkstra", 
    label: "Time-Dependent Dijkstra (CGR)", 
    group: "richa", 
    color: "#06B6D4", 
    val: 9,
    type: "Routing Algorithm",
    path: "richa/richa_neural_router.cpp",
    subsystem: "RICHA (Cis-Lunar Mesh - ipn:2.1)",
    desc: "Calculates minimum-latency chronological contact graph routes across moving planetary orbiters (ipn:1.1 -> ipn:2.1 -> ipn:3.1).",
    tech: "Contact Graph Routing (CGR)",
    command: "grep -n 'Dijkstra' richa/richa_neural_router.cpp"
  },
  { 
    id: "bfs_rerouter", 
    name: "Multi-Hop BFS Rerouter", 
    label: "Multi-Hop Blackout Rerouter", 
    group: "richa", 
    color: "#06B6D4", 
    val: 10,
    type: "Failover Engine",
    path: "richa/richa_neural_router.cpp",
    subsystem: "RICHA (Cis-Lunar Mesh - ipn:2.1)",
    desc: "Autonomous failover triggered during solar storms. Reroutes packets through alternative nodes (ipn:1.1 -> ipn:6.1 ExoMars -> ipn:5.1 MAVEN -> ipn:3.1 Mars Base) around storm plasma walls.",
    tech: "Autonomous Blackout Evasion",
    command: "grep -n 'bfs_reroute' richa/richa_neural_router.cpp"
  },
  { 
    id: "ion_dtn_engine", 
    name: "ion_dtn_engine.cpp", 
    label: "ion_dtn_engine.cpp", 
    group: "richa", 
    color: "#06B6D4", 
    val: 11,
    type: "C++17 DTN Engine",
    path: "richa/ion_dtn_demo/ion_dtn_engine.cpp",
    subsystem: "RICHA (Cis-Lunar Mesh - ipn:2.1)",
    desc: "RFC 9171 / Bundle Protocol v7 (BPv7) Store-and-Forward Custody Transfer engine holding bundles in persistent storage until downstream contact windows clear.",
    tech: "RFC 9171 BPv7 • Store-and-Forward Custody",
    code: `// Bundle Protocol v7 Custody Transfer
BundleHeader bh = { .version = 7, .custody = true };
store_bundle_to_flash(bundle_id, payload);`,
    command: "python3 richa/ion_dtn_demo/test_ion_dtn_engine.py"
  },
  { 
    id: "richa_db", 
    name: "richa_routing_log.db", 
    label: "richa_routing_log.db", 
    group: "richa", 
    color: "#06B6D4", 
    val: 10,
    type: "SQLite Database",
    path: "build/richa_routing_log.db",
    subsystem: "RICHA (Cis-Lunar Mesh - ipn:2.1)",
    desc: "Asynchronous SQLite WAL database logging all bundle hops, radiation levels, link switches, and inter-agency handoffs.",
    tech: "SQLite 3 • WAL Journaling Mode",
    command: "sqlite3 build/richa_routing_log.db 'SELECT * FROM routing_events LIMIT 5;'"
  },
  { 
    id: "pipe_akashdeep_ingress", 
    name: "IPC Akashdeep Pipe", 
    label: "/tmp/shivodaya_akashdeep_ingress.fifo", 
    group: "akashdeep", 
    color: "#EF4444", 
    val: 9,
    type: "IPC Mechanism",
    path: "/tmp/shivodaya_akashdeep_ingress.fifo",
    subsystem: "Inter-Process Communication",
    desc: "High-bandwidth named pipe delivering routed bundles directly to the Martian Akashdeep decoder without intermediary disk writes.",
    tech: "POSIX Named Pipe",
    command: "mkfifo /tmp/shivodaya_akashdeep_ingress.fifo"
  },

  // Group 4: AKASHDEEP Module (Crimson Red #EF4444)
  { 
    id: "akashdeep_decoder", 
    name: "akashdeep_decoder.cpp", 
    label: "akashdeep_decoder.cpp", 
    group: "akashdeep", 
    color: "#EF4444", 
    val: 14,
    type: "C++17 Semantic Decoder",
    path: "akashdeep/akashdeep_decoder.cpp",
    subsystem: "AKASHDEEP (Mars Base - ipn:3.1)",
    desc: "Martian surface base decoder verifying 'Bhaarat' security headers, executing Reverse MLP matrix multiplication in <1ms, and triggering automated EVA sheltering.",
    tech: "Reverse Matrix • <1ms Latency • Posix write",
    code: `// Verify signature & execute Inverse Matrix Projection
if (strncmp(packet.marker, "Bhaarat", 7) != 0) return DROP_UNVERIFIED;
float Y[5];
for(int i = 0; i < 5; i++) {
  Y[i] = 0;
  for(int k = 0; k < 32; k++) Y[i] += W_inv[i][k] * vector[k];
}`,
    command: "g++ -O3 -std=c++17 akashdeep/akashdeep_decoder.cpp -o build/akashdeep_decoder -lpthread -lsqlite3"
  },
  { 
    id: "reverse_mlp", 
    name: "Reverse MLP Projection", 
    label: "Reverse MLP Matrix Y = W^T * V", 
    group: "akashdeep", 
    color: "#EF4444", 
    val: 10,
    type: "Neural Reconstruction",
    path: "Algorithm in akashdeep/akashdeep_decoder.cpp",
    subsystem: "AKASHDEEP (Mars Base - ipn:3.1)",
    desc: "Inverse matrix transformation Y = W^T * V reconstructing raw physical values (CME speed in km/s, surge rate dPhi/dt) with 99.4% fidelity.",
    tech: "Y = W^T \\cdot V_{vector}",
    command: "./run_full_mesh_pipeline.sh"
  },
  { 
    id: "java_gui_main", 
    name: "Akashdeep Java GUI", 
    label: "Akashdeep Java Swing GUI", 
    group: "akashdeep", 
    color: "#EF4444", 
    val: 11,
    type: "Java 17+ Application",
    path: "akashdeep/java_gui/Main.java",
    subsystem: "AKASHDEEP (Mars Base - ipn:3.1)",
    desc: "Aerospace Java Swing GUI featuring a pseudo-3D celestial trajectory engine, dynamic speedometer gauges, overall health meters, and CME alert trend charts.",
    tech: "Java Swing • FlatLaf • 3D Trajectory Engine",
    command: "cd akashdeep/java_gui && java -cp 'bin' Main"
  },
  { 
    id: "cme_dashboard_java", 
    name: "CME_Dashboard.java", 
    label: "CME_Dashboard.java", 
    group: "akashdeep", 
    color: "#EF4444", 
    val: 10,
    type: "Java Component",
    path: "akashdeep/java_gui/CME_Dashboard.java",
    subsystem: "AKASHDEEP (Mars Base - ipn:3.1)",
    desc: "Dynamic telemetry dashboard feeding risk classifications and automated flight suggestions to astronauts.",
    tech: "Java Swing UI Component",
    command: "./build_java.sh"
  },
  { 
    id: "akashdeep_db", 
    name: "akashdeep_telemetry.db", 
    label: "akashdeep_telemetry.db", 
    group: "akashdeep", 
    color: "#EF4444", 
    val: 9,
    type: "SQLite Database",
    path: "build/akashdeep_telemetry.db",
    subsystem: "AKASHDEEP (Mars Base - ipn:3.1)",
    desc: "Target Martian database storing decoded telemetry, risk classifications, and automated flight suggestions.",
    tech: "Embedded SQLite JDBC",
    command: "sqlite3 build/akashdeep_telemetry.db '.tables'"
  },

  // Group 5: Earth Operations (Soft Emerald #10B981)
  { 
    id: "earth_monitor", 
    name: "earth_monitor.cpp", 
    label: "earth_monitor.cpp", 
    group: "earth", 
    color: "#10B981", 
    val: 13,
    type: "C++17 Query Bridge",
    path: "earth_monitor/earth_monitor.cpp",
    subsystem: "Earth Operations Center",
    desc: "High-speed native C++ query bridge polling richa_routing_log.db and streaming telemetry metrics to Earth ground consoles.",
    tech: "C++17 • SQLite Query Bridge",
    command: "g++ -O3 -std=c++17 earth_monitor/earth_monitor.cpp -o build/earth_monitor -lsqlite3"
  },
  { 
    id: "earth_control_center", 
    name: "Ground Control Center GUI", 
    label: "Earth Control Center UI", 
    group: "earth", 
    color: "#10B981", 
    val: 11,
    type: "Java 17+ Swing",
    path: "earth_control_center/src/earthcontrol/EarthControlCenterUI.java",
    subsystem: "Earth Operations Center",
    desc: "Shivodaya Ground Operations Center featuring collapsible HUD sidebar, flashing emergency timers, Consolas typography, and live waveform charts.",
    tech: "Java Swing • FlatLaf • Multi-Agency Uplink",
    command: "./run_earth_control_center.sh"
  },
  { 
    id: "threejs_mesh_visualizer", 
    name: "main3dvisual.html (Three.js)", 
    label: "Three.js 3D Mesh Visualizer", 
    group: "earth", 
    color: "#10B981", 
    val: 10,
    type: "WebGL / Three.js Visualizer",
    path: "richa/main3dvisual.html",
    subsystem: "Deep Space Visualizer",
    desc: "Interactive 3D WebGL deep space visualizer rendering 100 planetary probes orbiting Sun, Earth, and Mars with revolving Aditya-L1 animations and dynamic Dijkstra pathways.",
    tech: "Three.js • WebGL • Live Mesh Orbits",
    command: "xdg-open richa/main3dvisual.html"
  }
];

const GRAPH_LINKS = [
  { source: "cme_sim", target: "prakash_encoder" },
  { source: "sep_sim", target: "prakash_encoder" },
  { source: "solar_wind_sim", target: "prakash_encoder" },
  { source: "proton_flux_sim", target: "prakash_encoder" },
  { source: "xray_flux_sim", target: "prakash_encoder" },
  { source: "prakash_encoder", target: "jscc_transform" },
  { source: "prakash_encoder", target: "prakash_bin" },
  { source: "jscc_transform", target: "warning_dispatch" },
  { source: "prakash_bin", target: "pipe_richa_ingress" },
  { source: "warning_dispatch", target: "richa_router" },
  { source: "pipe_richa_ingress", target: "richa_router" },
  { source: "richa_router", target: "perceptron_model" },
  { source: "perceptron_model", target: "dijkstra_cgr" },
  { source: "perceptron_model", target: "bfs_rerouter" },
  { source: "richa_router", target: "ion_dtn_engine" },
  { source: "richa_router", target: "richa_db" },
  { source: "richa_router", target: "pipe_akashdeep_ingress" },
  { source: "pipe_akashdeep_ingress", target: "akashdeep_decoder" },
  { source: "akashdeep_decoder", target: "reverse_mlp" },
  { source: "reverse_mlp", target: "java_gui_main" },
  { source: "java_gui_main", target: "cme_dashboard_java" },
  { source: "cme_dashboard_java", target: "akashdeep_db" },
  { source: "richa_db", target: "earth_monitor" },
  { source: "akashdeep_db", target: "earth_monitor" },
  { source: "earth_monitor", target: "earth_control_center" },
  { source: "richa_db", target: "threejs_mesh_visualizer" }
];

// Structural Blueprint Pipeline Stages definition for the Native Blueprint View
const SCHEMATIC_STAGES = [
  {
    id: "inputs",
    number: "01",
    name: "Telemetry Ingestion",
    role: "Sensor Telemetry Feed",
    location: "Aditya-L1 Sentry Payloads",
    color: "#9CA3AF",
    borderClass: "border-zinc-700",
    bgClass: "bg-zinc-900/40",
    glowClass: "shadow-[0_0_20px_rgba(156,163,175,0.1)]",
    badge: "5 Sensor Streams",
    tech: "mmap() • ASPEX • PAPA",
    items: [
      { id: "cme_sim", label: "cme_sim.txt", detail: "Coronal Mass Ejection (km/s, width)", icon: Activity },
      { id: "sep_sim", label: "sep_sim.txt", detail: "Solar Energetic Proton Flux", icon: Activity },
      { id: "solar_wind_sim", label: "solar_wind_sim.txt", detail: "Plasma Bulk Density & Velocity", icon: Activity },
      { id: "proton_flux_sim", label: "proton_flux_sim.txt", detail: "High-Energy Proton Spectrum", icon: Activity },
      { id: "xray_flux_sim", label: "xray_flux_sim.txt", detail: "0.5-8.0 Å Flare Irradiance", icon: Activity },
    ],
    conduit: "Zero-Copy POSIX mmap Stream Ingest"
  },
  {
    id: "prakash",
    number: "02",
    name: "PRAKASH Module",
    role: "Semantic Vector Encoder",
    location: "Aditya-L1 Halo Orbit (ipn:1.1)",
    color: "#FBBF24",
    borderClass: "border-amber-500/40",
    bgClass: "bg-amber-950/20",
    glowClass: "shadow-[0_0_30px_rgba(251,191,36,0.15)]",
    badge: "ipn:1.1 • C11 Engine",
    tech: "C11 • Lock-Free Ring Buffer • pthread",
    items: [
      { id: "prakash_encoder", label: "prakash_encoder.c", detail: "Zero-copy mmap, alignas(64), core pinning", icon: Cpu },
      { id: "jscc_transform", label: "JSCC Linear Projection", detail: "Compresses 5 streams -> 32-float vector", icon: Layers },
      { id: "warning_dispatch", label: "warning_dispatch.txt", detail: "Serialized dispatches + 'Bhaarat' header", icon: FileCode },
      { id: "pipe_richa_ingress", label: "IPC FIFO Pipe", detail: "/tmp/shivodaya_richa_ingress.fifo", icon: Network },
    ],
    conduit: "128-Byte Compressed Vector Transit (IPC Pipe)"
  },
  {
    id: "richa",
    number: "03",
    name: "RICHA Neural Mesh",
    role: "Autonomous Interplanetary Router",
    location: "Cis-Lunar Mesh (ipn:2.1)",
    color: "#06B6D4",
    borderClass: "border-cyan-500/40",
    bgClass: "bg-cyan-950/20",
    glowClass: "shadow-[0_0_30px_rgba(6,182,212,0.15)]",
    badge: "ipn:2.1 • C++17 TVG",
    tech: "C++17 • Perceptron • BPv7 Custody",
    items: [
      { id: "richa_router", label: "richa_neural_router.cpp", detail: "100-node interplanetary dynamic mesh", icon: Compass },
      { id: "perceptron_model", label: "Perceptron Weight Scorer", detail: "W_i = sum(w_k * x_k) + b decision engine", icon: Cpu },
      { id: "dijkstra_cgr", label: "Time-Dependent Dijkstra", detail: "Contact Graph Routing (CGR)", icon: Network },
      { id: "bfs_rerouter", label: "Multi-Hop BFS Rerouter", detail: "Storm plasma blackout failover", icon: Shield },
      { id: "ion_dtn_engine", label: "ion_dtn_engine.cpp", detail: "RFC 9171 / BPv7 Store-and-Forward", icon: HardDrive },
      { id: "richa_db", label: "richa_routing_log.db", detail: "Async SQLite WAL routing logs", icon: Database },
    ],
    conduit: "Custody Bundles via Martian Named Pipe"
  },
  {
    id: "akashdeep",
    number: "04",
    name: "AKASHDEEP Module",
    role: "Martian Semantic Decoder",
    location: "Mars Base Terminal (ipn:3.1)",
    color: "#EF4444",
    borderClass: "border-red-500/40",
    bgClass: "bg-red-950/20",
    glowClass: "shadow-[0_0_30px_rgba(239,68,68,0.15)]",
    badge: "ipn:3.1 • Reverse Matrix",
    tech: "C++17 • Y = W^T * V • <1ms Latency",
    items: [
      { id: "akashdeep_decoder", label: "akashdeep_decoder.cpp", detail: "Verifies 'Bhaarat' header, sub-ms matrix decode", icon: Shield },
      { id: "reverse_mlp", label: "Reverse MLP Projection", detail: "Reconstructs CME speed & flux with 99.4% fidelity", icon: Cpu },
      { id: "java_gui_main", label: "Akashdeep Java GUI", detail: "3D celestial trajectory engine & alert dials", icon: Gauge },
      { id: "cme_dashboard_java", label: "CME_Dashboard.java", detail: "Astronaut EVA lockdown suggestions", icon: AlertTriangle },
      { id: "akashdeep_db", label: "akashdeep_telemetry.db", detail: "Target Martian SQLite storage", icon: Database },
    ],
    conduit: "Telemetry Feeds to Ground Bridge"
  },
  {
    id: "earth",
    number: "05",
    name: "EARTH OPERATIONS",
    role: "Ground Mission Command",
    location: "Bhaarat Ground Ops Center",
    color: "#10B981",
    borderClass: "border-emerald-500/40",
    bgClass: "bg-emerald-950/20",
    glowClass: "shadow-[0_0_30px_rgba(16,185,129,0.15)]",
    badge: "Ground Console • WebGL",
    tech: "Java Swing • Three.js • C++17 SQLite",
    items: [
      { id: "earth_monitor", label: "earth_monitor.cpp", detail: "High-speed C++17 query bridge for routing logs", icon: Server },
      { id: "earth_control_center", label: "Earth Control Center UI", detail: "Java Swing mission control console", icon: Gauge },
      { id: "threejs_mesh_visualizer", label: "Three.js 3D Visualizer", detail: "100-probe orbiting planetary visualizer", icon: Compass },
    ],
    conduit: "Live Mission Command Stream"
  }
];


// ============================================================================
// REFINED GRAPH VISUAL SYSTEM (Obsidian / Neural-Network Spatial Hierarchy)
// ============================================================================
function getNodeHierarchy(node) {
  // Level 1: Core Systems (Core Hubs: 8-10px visual diameter => radius 4.2px)
  if (['prakash_encoder', 'richa_router', 'akashdeep_decoder', 'earth_control_center'].includes(node.id)) {
    return { level: 1, radius: 4.2, isCore: true, isImportant: true };
  }
  // Level 2: Important Nodes (5-7px visual diameter => radius 3.0px)
  if (['jscc_transform', 'perceptron_model', 'dijkstra_cgr', 'bfs_rerouter', 'ion_dtn_engine', 'reverse_mlp', 'java_gui_main', 'earth_monitor'].includes(node.id)) {
    return { level: 2, radius: 3.0, isCore: false, isImportant: true };
  }
  // Level 3: Data / Simulation / Database Nodes (3-5px visual diameter => radius 2.2px)
  if (node.group === 'inputs' || ['cme_dashboard_java', 'akashdeep_db', 'richa_db', 'threejs_mesh_visualizer'].includes(node.id)) {
    return { level: 3, radius: 2.2, isCore: false, isImportant: false };
  }
  // Level 4: Peripheral Nodes (Fifo pipes, dispatch artifacts: 2-3px visual diameter => radius 1.5px)
  return { level: 4, radius: 1.5, isCore: false, isImportant: false };
}

function getCleanLabel(node) {
  const cleanMap = {
    cme_sim: "cme_sim",
    sep_sim: "sep_sim",
    solar_wind_sim: "solar_wind",
    proton_flux_sim: "proton_flux",
    xray_flux_sim: "xray_flux",
    prakash_encoder: "prakash_encoder.c",
    jscc_transform: "JSCC Transform",
    warning_dispatch: "warning_dispatch",
    prakash_bin: "prakash_bin",
    pipe_richa_ingress: "richa_ingress",
    richa_router: "richa_router.cpp",
    perceptron_model: "Perceptron Router",
    dijkstra_cgr: "TVG Dijkstra",
    bfs_rerouter: "BFS Rerouter",
    ion_dtn_engine: "NASA ION BPv7",
    richa_db: "richa_log.db",
    pipe_akashdeep_ingress: "akashdeep_ingress",
    akashdeep_decoder: "akashdeep_decoder.cpp",
    reverse_mlp: "Reverse MLP",
    java_gui_main: "Akashdeep HUD",
    cme_dashboard_java: "CME Dashboard",
    akashdeep_db: "akashdeep.db",
    earth_monitor: "earth_monitor.cpp",
    earth_control_center: "Earth Control Center",
    threejs_mesh_visualizer: "3D Mesh Visualizer"
  };
  return cleanMap[node.id] || node.name || node.id;
}

export default function ArchitectureGraphPage() {
  const containerRef = useRef(null);
  const graphRef = useRef(null);

  // View state: "mesh" (Force Graph) vs "schematic" (Native Blueprint Flowchart)
  const [activeView, setActiveView] = useState("mesh");

  const [selectedNode, setSelectedNode] = useState(GRAPH_NODES.find(n => n.id === "richa_router"));
  const [hoverNode, setHoverNode] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [particlesActive, setParticlesActive] = useState(true);
  const [specModalOpen, setSpecModalOpen] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);

  const hoverNodeRef = useRef(null);
  const selectedNodeRef = useRef(selectedNode);

  useEffect(() => {
    selectedNodeRef.current = selectedNode;
  }, [selectedNode]);

  useEffect(() => {
    hoverNodeRef.current = hoverNode;
  }, [hoverNode]);

  // Precomputed neighborhood map for O(1) adjacency lookup
  const neighborsMap = useMemo(() => {
    const map = new Map();
    GRAPH_LINKS.forEach(link => {
      const s = typeof link.source === "object" ? link.source.id : link.source;
      const t = typeof link.target === "object" ? link.target.id : link.target;
      if (!map.has(s)) map.set(s, new Set());
      if (!map.has(t)) map.set(t, new Set());
      map.get(s).add(t);
      map.get(t).add(s);
    });
    return map;
  }, []);

  // Filtered graph dataset
  const filteredData = useMemo(() => {
    let nodes = GRAPH_NODES;
    if (selectedFilter !== "all") {
      nodes = nodes.filter(n => n.group === selectedFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      nodes = nodes.filter(n => 
        n.name.toLowerCase().includes(q) || 
        n.subsystem.toLowerCase().includes(q) ||
        n.desc.toLowerCase().includes(q)
      );
    }
    const nodeIds = new Set(nodes.map(n => n.id));
    const links = GRAPH_LINKS.filter(l => 
      nodeIds.has(typeof l.source === 'object' ? l.source.id : l.source) &&
      nodeIds.has(typeof l.target === 'object' ? l.target.id : l.target)
    );
    return { nodes, links };
  }, [selectedFilter, searchQuery]);

  // Force Graph Refined Rendering Engine (Obsidian + Neural-Mesh Paradigm)
  useEffect(() => {
    let isMounted = true;
    let fg = null;

    async function initGraph() {
      if (typeof window === "undefined" || !containerRef.current) return;

      const ForceGraphModule = await import("force-graph");
      const ForceGraph = ForceGraphModule.default || ForceGraphModule;

      if (!isMounted || !containerRef.current) return;

      const w = containerRef.current.clientWidth || (typeof window !== "undefined" ? window.innerWidth : 1200);
      const h = containerRef.current.clientHeight || (typeof window !== "undefined" ? window.innerHeight : 800);

      fg = ForceGraph()(containerRef.current)
        .backgroundColor("#05070a")
        .width(w)
        .height(h)
        .nodeRelSize(3.5)
        .d3AlphaDecay(0.028)
        .d3VelocityDecay(0.35)
        .cooldownTicks(150)
        // Thin neural-network connections
        .linkColor((link) => {
          if (!link || !link.source || !link.target) return "rgba(255, 255, 255, 0.08)";
          const h = hoverNodeRef.current;
          const s = selectedNodeRef.current;
          const sourceId = typeof link.source === "object" ? link.source.id : link.source;
          const targetId = typeof link.target === "object" ? link.target.id : link.target;

          const activeFocusId = h ? h.id : (s ? s.id : null);
          if (activeFocusId) {
            const isConnected = sourceId === activeFocusId || targetId === activeFocusId;
            if (isConnected) {
              return h ? "rgba(56, 189, 248, 0.95)" : "rgba(245, 158, 11, 0.9)";
            }
            return "rgba(255, 255, 255, 0.025)";
          }
          return "rgba(255, 255, 255, 0.08)";
        })
        .linkWidth((link) => {
          if (!link || !link.source || !link.target) return 0.55;
          const h = hoverNodeRef.current;
          const s = selectedNodeRef.current;
          const sourceId = typeof link.source === "object" ? link.source.id : link.source;
          const targetId = typeof link.target === "object" ? link.target.id : link.target;

          const activeFocusId = h ? h.id : (s ? s.id : null);
          if (activeFocusId) {
            const isConnected = sourceId === activeFocusId || targetId === activeFocusId;
            if (isConnected) return 1.1;
            return 0.35;
          }
          return 0.55;
        })
        // Gentle, calm signal pulses
        .linkDirectionalParticles((link) => {
          if (!particlesActive || !link || !link.source || !link.target) return 0;
          const h = hoverNodeRef.current;
          const s = selectedNodeRef.current;
          const sourceId = typeof link.source === "object" ? link.source.id : link.source;
          const targetId = typeof link.target === "object" ? link.target.id : link.target;

          const activeFocusId = h ? h.id : (s ? s.id : null);
          if (activeFocusId) {
            const isConnected = sourceId === activeFocusId || targetId === activeFocusId;
            if (isConnected) return 2;
            return 0;
          }
          return (link.index % 3 === 0) ? 1 : 0;
        })
        .linkDirectionalParticleSpeed(0.0022)
        .linkDirectionalParticleWidth(1.2)
        .linkDirectionalParticleColor(() => "rgba(56, 189, 248, 0.8)")
        // Comfortable hit-test pointer area so small nodes are easily targeted
        .nodePointerAreaPaint((node, color, ctx) => {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(node.x, node.y, 8.5, 0, 2 * Math.PI, false);
          ctx.fill();
        })
        // Canvas node rendering with spatial hierarchy and progressive disclosure
        .nodeCanvasObject((node, ctx, globalScale) => {
          if (!node || typeof node.x !== 'number' || typeof node.y !== 'number' || isNaN(node.x) || isNaN(node.y)) return;
          const h = hoverNodeRef.current;
          const s = selectedNodeRef.current;
          const isHovered = h && h.id === node.id;
          const isSelected = s && s.id === node.id;

          const activeFocusId = h ? h.id : (s ? s.id : null);
          const neighbors = activeFocusId ? (neighborsMap.get(activeFocusId) || new Set()) : null;
          const isNeighbor = neighbors ? neighbors.has(node.id) : false;
          const hasFocus = Boolean(activeFocusId);

          const hierarchy = getNodeHierarchy(node);
          let r = hierarchy.radius;

          // Focus-based alpha
          let nodeAlpha = 1.0;
          if (hasFocus) {
            if (isHovered || isSelected) {
              nodeAlpha = 1.0;
              r = r * 1.35;
            } else if (isNeighbor) {
              nodeAlpha = 0.85;
              r = r * 1.15;
            } else {
              nodeAlpha = 0.22;
            }
          }

          ctx.save();
          ctx.globalAlpha = nodeAlpha;

          // 1. Soft atmospheric outer glow
          const glowRadius = (isHovered || isSelected) ? 18 : (hierarchy.isCore ? 12 : 8);
          const grad = ctx.createRadialGradient(node.x, node.y, r * 0.4, node.x, node.y, glowRadius);
          grad.addColorStop(0, node.color);
          grad.addColorStop(1, "rgba(0, 0, 0, 0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(node.x, node.y, glowRadius, 0, 2 * Math.PI, false);
          ctx.fill();

          // 2. Node core circle
          ctx.fillStyle = node.color;
          ctx.beginPath();
          ctx.arc(node.x, node.y, r, 0, 2 * Math.PI, false);
          ctx.fill();

          // 3. Pinpoint bright center core
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(node.x, node.y, Math.max(0.8, r * 0.38), 0, 2 * Math.PI, false);
          ctx.fill();

          // 4. Progressive disclosure of labels (Obsidian hierarchy)
          let showLabel = false;
          if (hasFocus) {
            showLabel = isHovered || isSelected || isNeighbor;
          } else {
            // In default state: show Level 1 & 2 nodes, hide peripheral clutter
            if (hierarchy.level <= 2) {
              showLabel = true;
            } else {
              showLabel = (globalScale || 1) >= 1.6;
            }
          }

          if (showLabel) {
            const fontSize = Math.max(9, Math.min(12, 11 / Math.sqrt(globalScale || 1)));
            ctx.font = `${(isHovered || isSelected) ? "600" : "400"} ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "top";

            if (isHovered || isSelected) {
              ctx.fillStyle = "#F8FAFC";
              ctx.shadowBlur = 4;
              ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
            } else if (isNeighbor) {
              ctx.fillStyle = "#D7DAE0";
              ctx.shadowBlur = 3;
              ctx.shadowColor = "rgba(0, 0, 0, 0.85)";
            } else {
              ctx.fillStyle = hierarchy.level === 1 ? "#A8ADB7" : "#64748B";
              ctx.shadowBlur = 0;
            }

            const labelText = getCleanLabel(node);
            ctx.fillText(labelText, node.x, node.y + r + 3.5);
          }

          ctx.restore();
        })
        .onNodeHover((node) => {
          if (containerRef.current) {
            containerRef.current.style.cursor = node ? "pointer" : "grab";
          }
          if ((!node && !hoverNodeRef.current) || (node && hoverNodeRef.current && node.id === hoverNodeRef.current.id)) {
            return;
          }
          setHoverNode(node || null);
          hoverNodeRef.current = node || null;
          
        })
        .onNodeClick((node) => {
          setSelectedNode(node);
          selectedNodeRef.current = node;
          fg.centerAt(node.x, node.y, 600);
          fg.zoom(2.0, 600);
          
        });

      // Adjust D3 force parameters for generous spatial breathing room
      fg.d3Force("charge").strength(-240);
      fg.d3Force("link").distance(75);

      fg.graphData(filteredData);
      graphRef.current = fg;

      setTimeout(() => {
        if (fg) fg.zoomToFit(400, 70);
      }, 500);
    }

    if (activeView === "mesh") {
      initGraph();
    }

    const handleResize = () => {
      if (graphRef.current && containerRef.current && activeView === "mesh") {
        const rw = containerRef.current.clientWidth || (typeof window !== "undefined" ? window.innerWidth : 1200);
        const rh = containerRef.current.clientHeight || (typeof window !== "undefined" ? window.innerHeight : 800);
        graphRef.current.width(rw).height(rh);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      isMounted = false;
      window.removeEventListener("resize", handleResize);
      if (fg) {
        try { fg._destructor(); } catch (e) {}
      }
    };
  }, [activeView]);



  // Sync data updates for Force Graph
  useEffect(() => {
    if (graphRef.current && activeView === "mesh") {
      graphRef.current.graphData(filteredData);
      graphRef.current.linkDirectionalParticles(particlesActive ? 2 : 0);
    }
  }, [filteredData, particlesActive, activeView]);

  const handleNodeJump = (nodeId) => {
    const target = GRAPH_NODES.find(n => n.id === nodeId);
    if (target) {
      setSelectedNode(target);
      if (activeView === "mesh" && graphRef.current) {
        graphRef.current.centerAt(target.x, target.y, 600);
        graphRef.current.zoom(2.0, 600);
      }
    }
  };

  const inboundLinks = useMemo(() => {
    if (!selectedNode) return [];
    return GRAPH_LINKS.filter(l => (typeof l.target === 'object' ? l.target.id : l.target) === selectedNode.id);
  }, [selectedNode]);

  const outboundLinks = useMemo(() => {
    if (!selectedNode) return [];
    return GRAPH_LINKS.filter(l => (typeof l.source === 'object' ? l.source.id : l.source) === selectedNode.id);
  }, [selectedNode]);

  const copyCommand = (cmd) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(cmd);
      setCopiedCmd(true);
      setTimeout(() => setCopiedCmd(false), 2000);
    }
  };

  return (
    <div className="bg-[#020308] text-white w-screen h-screen overflow-hidden font-sans relative select-none">
      
      {/* ============================================================
          TOP FIXED GLASSMORPHIC NAVBAR
          ============================================================ */}
      <header className="fixed top-0 left-0 right-0 h-14 z-50 flex items-center justify-between px-6 bg-black/40 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-lg font-bold tracking-[0.2em] text-white hover:text-cyan-400 transition-colors uppercase">
            SHIVODAYA
          </Link>
          <span className="hidden sm:inline-block text-[9px] tracking-widest text-cyan-400 font-mono border-l border-white/20 pl-3 uppercase">
            System Architecture
          </span>
        </div>

        {/* Central Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-[11px] font-bold tracking-widest uppercase">
          <Link href="/" className="text-zinc-400 hover:text-white transition flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Home
          </Link>
          <Link href="/vision" className="text-zinc-400 hover:text-white transition">
            Vision
          </Link>
          <span className="text-white border-b border-cyan-400 pb-0.5">
            Architecture
          </span>
          <Link href="/control-center" className="text-zinc-400 hover:text-white transition">
            Control Center
          </Link>
          <Link href="/registration" className="text-zinc-400 hover:text-white transition">
            Registration
          </Link>
        </nav>

        {/* Right Section: View Switcher Toggle */}
        <div className="flex items-center gap-3">
          
          {/* Glassmorphic Mode Toggle Button Group */}
          <div className="flex items-center p-1 rounded-full bg-white/5 border border-white/15 backdrop-blur-md">
            <button
              onClick={() => setActiveView("mesh")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-1.5 ${
                activeView === "mesh"
                  ? "bg-cyan-500 text-black shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Mesh View</span>
            </button>
            <button
              onClick={() => setActiveView("schematic")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-1.5 ${
                activeView === "schematic"
                  ? "bg-cyan-500 text-black shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Workflow className="w-3.5 h-3.5" />
              <span>Schematic View</span>
            </button>
          </div>

          <button
            onClick={() => setSpecModalOpen(true)}
            className="px-3 py-1.5 rounded-lg border border-white/20 hover:border-cyan-400 bg-white/5 text-zinc-300 hover:text-white text-xs transition flex items-center gap-1.5"
            title="View Full Markdown Specification"
          >
            <FileCode className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden lg:inline">ARCHITECTURE.md</span>
          </button>
        </div>
      </header>

      {/* ============================================================
          TOP CONTROLS & FILTER BAR (VISIBLE IN MESH VIEW)
          ============================================================ */}
      {activeView === "mesh" && (
        <div className="absolute top-20 left-6 z-40 flex flex-wrap items-center gap-2 max-w-[calc(100vw-450px)]">
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search nodes, files, protocols..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-black/70 border border-white/15 focus:border-cyan-400 rounded-full pl-8 pr-4 py-1.5 text-xs text-white placeholder-zinc-500 outline-none w-56 backdrop-blur-md transition"
            />
          </div>

          {/* Minimalist Cluster Filter Pills (Obsidian / Linear Style) */}
          <div className="flex items-center gap-1 bg-black/70 border border-white/10 p-1 rounded-full backdrop-blur-md">
            {[
              { id: "all", label: "All", dot: "#ffffff" },
              { id: "prakash", label: "Prakash", dot: "#F59E0B" },
              { id: "richa", label: "Richa", dot: "#06B6D4" },
              { id: "akashdeep", label: "Akashdeep", dot: "#EF4444" },
              { id: "earth", label: "Earth Ops", dot: "#10B981" },
              { id: "inputs", label: "Telemetry", dot: "#9CA3AF" }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium transition ${
                  selectedFilter === f.id
                    ? "bg-white/15 text-white shadow-sm font-semibold border border-white/20"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: f.dot }} />
                <span>{f.label}</span>
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 bg-black/60 border border-white/10 p-1 rounded-full backdrop-blur-md">
            <button
              onClick={() => {
                if (graphRef.current) graphRef.current.zoomToFit(400, 70);
              }}
              className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition"
              title="Fit to Screen"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setParticlesActive(!particlesActive)}
              className={`p-1.5 rounded-full transition ${particlesActive ? "text-cyan-400 bg-cyan-500/20" : "text-zinc-500 hover:bg-white/10"}`}
              title="Toggle Flow Particles"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                if (graphRef.current) graphRef.current.d3ReheatSimulation();
              }}
              className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition"
              title="Reset Simulation Physics"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}

      {/* ============================================================
          MAIN VIEW CONTAINER: MESH VIEW VS SCHEMATIC BLUEPRINT VIEW
          ============================================================ */}
      <div className="w-full h-full relative">
        
        {/* 1. Force Graph Container with Subtle Deep Space Vignette */}
        <div 
          ref={containerRef} 
          className={`w-full h-full cursor-grab active:cursor-grabbing ${activeView === "mesh" ? "block" : "hidden"}`}
          style={{
            background: "radial-gradient(ellipse at 50% 50%, #080d16 0%, #05070a 85%)"
          }}
        />

        {/* 2. Native Aerospace Schematic Blueprint (100% In-Frame, Crisp & Readable) */}
        <div 
          className={`w-full h-full overflow-y-auto pt-20 pb-24 px-6 lg:px-12 ${activeView === "schematic" ? "block" : "hidden"}`}
          style={{
            backgroundImage: "radial-gradient(rgba(0, 240, 255, 0.08) 1px, transparent 1px)",
            backgroundSize: "28px 28px"
          }}
        >
          {/* Header Banner */}
          <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-xl shadow-2xl">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">
                  AEROSPACE ARCHITECTURE // CCSDS DTN COMPLIANT
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Shivodaya Execution Pipeline
              </h1>
              <p className="text-xs text-zinc-400 mt-1 max-w-2xl font-light">
                End-to-end topological pipeline: Aditya-L1 streams ➔ C11 JSCC compression ➔ C++17 TVG routing ➔ Martian Reverse MLP decoding.
              </p>
            </div>

            {/* Pipeline Highlights Badges */}
            <div className="flex flex-wrap gap-2 text-[10px] font-mono">
              <span className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300">
                PRAKASH: ipn:1.1
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                RICHA: ipn:2.1
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300">
                AKASHDEEP: ipn:3.1
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                EARTH OPS
              </span>
            </div>
          </div>

          {/* Master 5-Stage Pipeline Cards in Horizontal Flow Layout */}
          <div className="max-w-7xl mx-auto space-y-6">
            {SCHEMATIC_STAGES.map((stage, sIdx) => {
              return (
                <div key={stage.id} className="relative group">
                  
                  {/* Stage Card */}
                  <div className={`rounded-2xl border ${stage.borderClass} ${stage.bgClass} ${stage.glowClass} backdrop-blur-xl p-6 transition-all duration-300 hover:border-white/30`}>
                    
                    {/* Stage Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-white/10 gap-2">
                      <div className="flex items-center gap-3">
                        <span 
                          className="w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs border"
                          style={{ borderColor: stage.color, color: stage.color, backgroundColor: `${stage.color}15` }}
                        >
                          {stage.number}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-white tracking-wide">
                              {stage.name}
                            </h3>
                            <span 
                              className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
                              style={{ borderColor: `${stage.color}40`, color: stage.color, backgroundColor: `${stage.color}10` }}
                            >
                              {stage.badge}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400 font-mono">
                            {stage.role} • <span className="text-zinc-300">{stage.location}</span>
                          </p>
                        </div>
                      </div>

                      {/* Tech Badge */}
                      <div className="text-[11px] font-mono text-zinc-400 bg-black/50 px-3 py-1.5 rounded-lg border border-white/10">
                        {stage.tech}
                      </div>
                    </div>

                    {/* Stage Items Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {stage.items.map((item) => {
                        const IconComponent = item.icon || FileCode;
                        const isSelected = selectedNode && selectedNode.id === item.id;
                        return (
                          <div 
                            key={item.id}
                            onClick={() => handleNodeJump(item.id)}
                            className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                              isSelected 
                                ? "bg-white/15 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.25)]" 
                                : "bg-black/50 border-white/10 hover:border-white/25 hover:bg-white/5"
                            }`}
                          >
                            <div className="flex items-start gap-2.5 mb-2">
                              <div 
                                className="p-1.5 rounded-lg shrink-0"
                                style={{ backgroundColor: `${stage.color}20`, color: stage.color }}
                              >
                                <IconComponent className="w-4 h-4" />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-white tracking-tight">
                                  {item.label}
                                </h4>
                                <p className="text-[11px] text-zinc-400 leading-snug mt-0.5">
                                  {item.detail}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[9px] font-mono text-zinc-500">
                              <span>Click to inspect code</span>
                              <span className="text-cyan-400 group-hover:translate-x-0.5 transition">→</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                  </div>

                  {/* Inter-Stage High-Speed Data Conduit Arrow */}
                  {sIdx < SCHEMATIC_STAGES.length - 1 && (
                    <div className="py-2 flex items-center justify-center gap-3 text-[11px] font-mono text-cyan-400">
                      <div className="h-4 w-[1px] bg-gradient-to-b from-white/30 to-cyan-400" />
                      <div className="px-3 py-1 rounded-full bg-black/80 border border-cyan-500/30 text-[10px] tracking-wider uppercase text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.2)] flex items-center gap-1.5">
                        <ArrowRight className="w-3 h-3 text-cyan-400 animate-pulse" />
                        <span>{stage.conduit}</span>
                      </div>
                      <div className="h-4 w-[1px] bg-gradient-to-b from-cyan-400 to-white/30" />
                    </div>
                  )}

                </div>
              );
            })}
          </div>

          {/* Technical Specs Footer */}
          <div className="max-w-7xl mx-auto mt-10 p-6 rounded-2xl bg-zinc-950/90 border border-white/10 text-xs text-zinc-400 leading-relaxed font-mono flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-white font-bold">PROJECT SHIVODAYA // VERIFIED ARTIFACTS</span>
              <div className="text-[11px] text-zinc-500 mt-0.5">All 24 architecture nodes mapped from ARCHITECTURE.md with C11, C++17, and Java 17+ implementations.</div>
            </div>
            <button
              onClick={() => setSpecModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition"
            >
              View Full ARCHITECTURE.md
            </button>
          </div>
        </div>

      </div>

      {/* ============================================================
          BOTTOM STATUS BAR (OBSIDIAN GRAPH HUD)
          ============================================================ */}
      <footer className="absolute bottom-3 left-6 z-40 flex items-center gap-4 text-[10px] font-mono tracking-widest text-zinc-400 uppercase bg-black/70 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          {activeView === "mesh" ? `ACTIVE NODES: ${filteredData.nodes.length}` : "MODE: SCHEMATIC SPECIFICATION"}
        </span>
        <span>•</span>
        <span className="text-zinc-300">PRAKASH (#FBBF24) ➔ RICHA (#06B6D4) ➔ AKASHDEEP (#EF4444)</span>
        <span>•</span>
        <span className="text-emerald-400">EARTH OPS (#10B981)</span>
      </footer>

      {/* ============================================================
          OBSIDIAN INSPECTOR SIDEBAR (RIGHT SLIDEOUT DRAWER)
          Works in BOTH Mesh View and Schematic View!
          ============================================================ */}
      {selectedNode && (
        <aside className="absolute top-20 right-6 bottom-6 w-96 z-50 bg-zinc-950/95 border border-white/15 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.9)] backdrop-blur-2xl flex flex-col overflow-hidden animate-in slide-in-from-right-8 duration-200">
          
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-start justify-between">
            <div>
              <span 
                className="inline-block text-[10px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full mb-2 border"
                style={{ 
                  color: selectedNode.color, 
                  borderColor: `${selectedNode.color}50`, 
                  backgroundColor: `${selectedNode.color}15` 
                }}
              >
                {selectedNode.subsystem}
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight leading-snug">
                {selectedNode.name}
              </h2>
              <p className="text-[11px] font-mono text-zinc-400">{selectedNode.path}</p>
            </div>
            <button 
              onClick={() => setSelectedNode(null)}
              className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin text-xs">
            
            {/* Architectural Role Description */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
                Architectural Role
              </h4>
              <p className="text-zinc-200 leading-relaxed font-light">
                {selectedNode.desc}
              </p>
            </div>

            {/* Technical Specification Badge */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono mb-1">
                Implementation Stack
              </div>
              <div className="text-xs font-semibold text-cyan-300 font-mono">
                {selectedNode.tech}
              </div>
            </div>

            {/* Code / Algorithm Snippet */}
            {selectedNode.code && (
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5 flex items-center gap-1.5">
                  <Terminal className="w-3 h-3 text-cyan-400" />
                  <span>C11 / C++17 Core Implementation</span>
                </h4>
                <pre className="p-3 rounded-xl bg-black border border-white/15 text-[11px] font-mono text-cyan-200 overflow-x-auto leading-normal">
                  {selectedNode.code}
                </pre>
              </div>
            )}

            {/* Build / Run Command */}
            {selectedNode.command && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    Execution Command
                  </h4>
                  <button
                    onClick={() => copyCommand(selectedNode.command)}
                    className="text-[10px] text-cyan-400 hover:text-cyan-300 transition"
                  >
                    {copiedCmd ? "✓ Copied" : "Copy"}
                  </button>
                </div>
                <pre className="p-2.5 rounded-xl bg-black/80 border border-white/15 text-[11px] font-mono text-amber-300 select-all overflow-x-auto">
                  $ {selectedNode.command}
                </pre>
              </div>
            )}

            {/* Inbound & Outbound Connections */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
                Connected Data Pipelines
              </h4>
              <div className="space-y-2">
                {inboundLinks.length > 0 && (
                  <div>
                    <div className="text-[9px] uppercase tracking-wider text-zinc-500 mb-1 font-mono">Inbound Feeds:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {inboundLinks.map((link, idx) => {
                        const srcId = typeof link.source === 'object' ? link.source.id : link.source;
                        const srcNode = GRAPH_NODES.find(n => n.id === srcId);
                        return (
                          <button
                            key={idx}
                            onClick={() => handleNodeJump(srcId)}
                            className="px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-[10px] text-zinc-300 hover:text-white flex items-center gap-1 transition"
                          >
                            <span>← {srcNode?.name || srcId}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {outboundLinks.length > 0 && (
                  <div className="pt-2">
                    <div className="text-[9px] uppercase tracking-wider text-zinc-500 mb-1 font-mono">Outbound Destinations:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {outboundLinks.map((link, idx) => {
                        const tgtId = typeof link.target === 'object' ? link.target.id : link.target;
                        const tgtNode = GRAPH_NODES.find(n => n.id === tgtId);
                        return (
                          <button
                            key={idx}
                            onClick={() => handleNodeJump(tgtId)}
                            className="px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-[10px] text-cyan-300 hover:text-white flex items-center gap-1 transition"
                          >
                            <span>→ {tgtNode?.name || tgtId}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Footer Action */}
          <div className="p-4 border-t border-white/10 bg-black/40 flex items-center justify-between">
            <span className="text-[10px] font-mono text-zinc-500">PROJECT SHIVODAYA // ARCHITECTURE</span>
            {activeView === "mesh" && (
              <button
                onClick={() => {
                  if (graphRef.current && selectedNode) {
                    graphRef.current.centerAt(selectedNode.x, selectedNode.y, 400);
                    graphRef.current.zoom(2.2, 400);
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-cyan-500 text-black text-xs font-bold uppercase tracking-wider hover:bg-cyan-400 transition"
              >
                Center Node
              </button>
            )}
          </div>

        </aside>
      )}

      {/* ============================================================
          ARCHITECTURE.MD SPEC MODAL
          ============================================================ */}
      {specModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-3xl max-h-[80vh] rounded-2xl bg-zinc-950 border border-white/20 flex flex-col overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white tracking-wide">
                  ARCHITECTURE.md // Master Technical Blueprint
                </h3>
              </div>
              <button onClick={() => setSpecModalOpen(false)} className="text-zinc-400 hover:text-white">
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 text-xs text-zinc-300 leading-relaxed font-mono">
              <p className="text-white font-semibold text-sm">
                Project Shivodaya: Deep-Space Neural Mesh Architecture
              </p>
              <div className="p-4 rounded-xl bg-black border border-white/10 space-y-2">
                <div className="text-amber-400 font-bold">1. PRAKASH MODULE (Aditya-L1 - ipn:1.1) [#FBBF24]</div>
                <div>• Written in C11 with POSIX mmap(), lock-free atomic ring buffers (alignas(64)), and core pinning (pthread_setaffinity_np).</div>
                <div>• JSCC Linear Projection Matrix: compresses 5 telemetry streams into 32-float vectors (128 bytes) with 'Bhaarat' signature.</div>
              </div>
              <div className="p-4 rounded-xl bg-black border border-white/10 space-y-2">
                <div className="text-cyan-400 font-bold">2. RICHA MODULE (Cis-Lunar Mesh - ipn:2.1) [#06B6D4]</div>
                <div>• Written in C++17 with 100-node dynamic Dijkstra Contact Graph Routing (CGR).</div>
                <div>• Perceptron neural weight decision model (W_i = \sum w_k x_k + b) scoring radiation, delay, and buffer storage.</div>
                <div>• Multi-Hop BFS Blackout Rerouter & RFC 9171 / Bundle Protocol v7 (BPv7) Store-and-Forward Custody Engine.</div>
              </div>
              <div className="p-4 rounded-xl bg-black border border-white/10 space-y-2">
                <div className="text-red-400 font-bold">3. AKASHDEEP MODULE (Mars Base - ipn:3.1) [#EF4444]</div>
                <div>• Written in C++17 and Java 17+ Swing with Reverse MLP Matrix Projection (Y = W^T \cdot V) in &lt;1ms.</div>
                <div>• Verifies 'Bhaarat' header, reconstructs CME speed in km/s, and issues automated astronaut EVA safety directives.</div>
              </div>
              <div className="p-4 rounded-xl bg-black border border-white/10 space-y-2">
                <div className="text-emerald-400 font-bold">4. EARTH OPERATIONS MONITORING CENTER [#10B981]</div>
                <div>• High-speed C++17 SQLite query bridge polling richa_routing_log.db.</div>
                <div>• Java Swing Ground Control Center GUI & Three.js 3D WebGL deep space visualizer.</div>
              </div>
            </div>
            <div className="p-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setSpecModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition"
              >
                Close Blueprint
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
