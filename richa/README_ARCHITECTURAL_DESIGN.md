# Project Shivodaya: Richa DTN Transport Engine Technical Architecture Documentation

## Executive Overview
The **Richa Module** is the inter-agency communication and routing transport engine for **Project Shivodaya**, the world's first inter-agency space mesh network and direct mission-to-mission radiation alert system.

Terrestrial network architectures operating over TCP/IP or standard UDP fail under deep-space conditions characterized by multi-minute propagation delays, high bit-error rates, and frequent planetary line-of-sight occultations. Richa implements **Delay-Tolerant Networking (DTN)** using the **Bundle Protocol v7 (RFC 9171)** and **Contact Graph Routing (CGR)**.

Every space probe, satellite, or orbital platform across global agencies (**ISRO, NASA, ESA, JAXA, Commercial Space Entities**) that integrates the Shivodaya receiver module dynamically acts as a **"Space Mesh Tower"**. Nodes gain real-time early warning radiation alerts while serving as store-and-forward custody relays for neighbor missions.

---

## Technical Architecture & Design Principles

### 1. Contact Graph Routing (CGR) via Time-Dependent Dijkstra
* **Mechanism**: C++ adjacency graph utilizing `std::priority_queue` to compute lowest-latency multi-hop paths across 100 space nodes ahead of scheduled contact windows.
* **Math Model**: Link weight $W(u, v, t) = \text{PropagationDelay}(t) + \text{QueueDelay}(t) + \frac{\text{BundleSize}}{\text{Bandwidth}(t)}$.
* **Rationale**: CGR accounts for planetary movement, orbital mechanics, and predictable contact topology to pre-compute bundle trajectories without relying on real-time handshake round-trips.

### 2. Autonomous Blackout Evasion (BFS Earth-Bypassing Failover)
* **Mechanism**: When primary links experience planetary occultation (e.g., Earth line-of-sight blocked by planetary alignment or solar flare interference), Richa instantly detects the dropped edge weight ($W \to \infty$) and executes a Breadth-First Search (BFS) failover traversal.
* **Mars Mesh Trajectory**: Automatically routes solar radiation alert bundles directly to Mars orbiters (**Mangalyaan-2, MAVEN, ExoMars TGO**) and deep-space relays, completely bypassing Earth without human operator intervention.

### 3. Inter-Agency Zero-Trust Cryptographic Isolation
* **Mechanism**: Encapsulates telemetry alerts inside RFC 9171 BPv7 bundle headers. Custody relays inspect *only* primary block headers (destination EID, priority flag, TTL) without accessing encrypted internal payload data.
* **Rationale**: Guarantees strict multi-agency interoperability and data confidentiality between ISRO, NASA, ESA, and JAXA assets.

### 4. Store-and-Forward Custody Transfer
* **Mechanism**: When all outbound links to a destination are blocked by planetary occultation, bundles are persisted in local non-volatile custody memory. Upon contact window restoration, bundles are forwarded and custody release signals are transmitted.

---

## Inter-Agency Node Topology (100 Space Mesh Nodes)

| Node Allocation | Agency / Entity | Primary Role / Location |
| :--- | :--- | :--- |
| **Node 0 - Node 15** | **ISRO (Bhaarat)** | Aditya-L1 Solar Probe, NavIC Constellation, Mangalyaan-2 |
| **Node 16 - Node 40** | **NASA** | Parker Solar Probe, MAVEN Mars Relay, Artemis Gateway |
| **Node 41 - Node 60** | **ESA** | Solar Orbiter, ExoMars Trace Gas Orbiter, Juice Relay |
| **Node 61 - Node 75** | **JAXA** | MMX Phobos Lunar/Mars Relay, QZSS Deep Space Nodes |
| **Node 76 - Node 99** | **Commercial Mesh** | Starlink/Kuiper Satellite Towers & Private Space Assets |

---

## Module Files Summary

- **`richa.cpp`**: Core C++ DTN transport engine executing CGR Dijkstra & BFS blackout evasion.
- **`richa_live_cli.cpp`**: Terminal runner for live hop-by-hop custody transfer debugging.
- **`index3d.html`**: Interactive Three.js 3D Deep Space Mesh Command Center featuring Earth-bypassing Mars routing visualization and camera presets.
- **`index.html`**: 2D tactical network topology graph.
- **`run_richa_demo.sh`**: Sub-second execution benchmark script.
