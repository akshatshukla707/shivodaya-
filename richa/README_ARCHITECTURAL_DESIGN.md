# Project Shivodaya: Richa DTN Transport Engine & Inter-Agency Mesh Architecture Documentation

## Executive Overview
The **Richa Module** is the core communication and routing transport engine for **Project Shivodaya**, the world's first inter-agency space mesh network and radiation alert system. 

Unlike terrestrial Earth-based networks operating over TCP/IP (which fail under long propagation delays, high bit-error rates, and frequent planetary line-of-sight occultations), Richa implements **Delay-Tolerant Networking (DTN)** using the **Bundle Protocol v7 (RFC 9171)** and **Contact Graph Routing (CGR)**.

Every space probe, satellite, or orbital platform across global agencies (ISRO, NASA, ESA, JAXA, CNSA, private commercial assets) that installs the Shivodaya receiver module dynamically joins the mesh network as a **"Space Cell Tower"**. Nodes benefit from receiving zero-latency radiation alerts while serving as store-and-forward relay custody nodes for neighbor missions.

---

## Architectural & Technical Design Rationale

### 1. Autonomous Dynamic Graph Routing (Time-Dependent Dijkstra)
* **Requirement**: Dynamic C++ adjacency list representing deep-space nodes, with autonomous lowest-latency path calculation via an optimized Priority Queue (`std::priority_queue`).
* **Implementation**: Graph nodes represent deep-space missions across orbits (L1/L2 Lagrangian points, Low Earth Orbit, Lunar Gateway, Mars Relay). Edges encapsulate time-varying propagation delays $D(t) = \frac{\text{Distance}}{c}$ and bandwidth capacities.
* **Technical Rationale**: CGR uses time-dependent Dijkstra algorithms to compute optimal multi-hop bundle trajectories ahead of contact windows, accounting for planetary movement and orbital mechanics.

### 2. Blackout Evasion & Autonomous Rerouting (BFS Alternative Mapping)
* **Requirement**: Instant detection of dropped link weights (planetary occultation, solar flare interference, hardware outage) and automated Breadth-First Search (BFS) rerouting without human operator intervention.
* **Implementation**: When an active edge transitions to a blackout state (weight set to $\infty$ or offline), Richa triggers a lock-free BFS traversal across adjacent inter-agency nodes to establish a secondary custody relay path immediately.
* **Technical Rationale**: Deep-space links cannot wait for Earth-based control reconfigurations (which take 8 to 20 minutes one-way light travel time). Autonomous edge-failure detection guarantees packet survival and instant failover.

### 3. Inter-Agency Security & Zero-Trust Bundle Isolation
* **Requirement**: Multi-agency inter-operability (ISRO, NASA, ESA, JAXA) without compromising internal mission telemetry or security.
* **Implementation**: Richa uses cryptographic payload envelope isolation. Nodes act as **DTN Custody Relays**—they read *only* BPv7 bundle headers (destination Endpoint ID, priority flag, TTL) without accessing encrypted internal payload data.
* **Technical Rationale**: Zero-Trust DTN architecture allows competitor agencies to safely relay each other's bundles while maintaining strict cryptographic confidentiality for primary mission payloads.

### 4. Store-and-Forward Custody Transfer & Local Persistence
* **Requirement**: Persistent local storage for bundles when no downstream route is currently available.
* **Implementation**: When all outbound links to a destination are blocked by planetary occlusion, the bundle is stored in local non-volatile custody memory (`richa_custody_store/`). Once a new contact window opens, bundles are forwarded and custody release signals are transmitted.

### 5. Interactive 2D Mesh Graph Visualizer (100 Space Nodes)
* **Requirement**: Visualizing 100 space missions dynamically transferring bundles, detecting blackouts, and executing real-time rerouting on a clean 2D canvas without opening 100 separate terminal windows.
* **Implementation**: Built a standalone, client-side HTML5 Canvas 2D inter-agency mesh visualization (`richa/index.html`). Loads alert dispatches straight from Prakash's `warning_dispatch.txt` and simulates real-time BPv7 bundle hops across 100 agency satellites (ISRO, NASA, ESA, JAXA, Commercial). Includes interactive blackout toggles, node inspection, and live CGR trajectory tracking.

---

## Inter-Agency Node Allocation (100 Space Mesh Nodes)

| Node Range | Agency / Entity | Orbital Domain | Primary Function |
| :--- | :--- | :--- | :--- |
| **Node 0 - Node 14** | **ISRO (Bhaarat)** | Aditya-L1, Chandrayaan Orbiters, NAVIC | Solar Monitoring & Home Target Relay |
| **Node 15 - Node 39** | **NASA** | Artemis Gateway, James Webb, Deep Space Network | CGR High-Bandwidth Backbone |
| **Node 40 - Node 59** | **ESA** | Juice, Solar Orbiter, Euclid | European Inter-Planetary Relay |
| **Node 60 - Node 74** | **JAXA** | MMX, QZSS Relay, Lunar Recon | East Asian Deep-Space Node |
| **Node 75 - Node 99** | **Commercial / Global** | Starlink Inter-Satellite Mesh, Kuiper, Private Space Stations | Opportunistic High-Density Relays |

---

## Core Software Layout (`richa/richa.cpp`)

1. `DTNBundle`: Structure encapsulating RFC 9171 BPv7 fields (Source EID, Destination EID, Priority, Creation Timestamp, Lifetime TTL, Payload).
2. `SpaceNode`: Encapsulates Agency owner, Orbital Coordinates $(X,Y)$, Local Custody Buffer, and Status (ACTIVE / BLACKOUT).
3. `CGRGraph`: Adjacency list graph supporting `time_dependent_dijkstra()`, `bfs_alternate_path()`, and `trigger_link_blackout()`.
4. `RichaEngine`: Main C++ DTN transport engine reading dispatches from `/home/akshat/shivodaya/prakash/warning_dispatch.txt`, assigning BPv7 routes across 100 space nodes, and writing dispatch trajectory logs to `richa_dispatch_log.txt`.
