# Project Shivodaya: Prakash Acquisition Module Technical Architecture & Implementation Documentation

## Executive Overview
The **Prakash Module** is the high-performance telemetry acquisition engine for **Project Shivodaya**, the world's first inter-agency space mesh network and mission-to-mission radiation alert system. Deployed on solar probes, Prakash monitors solar energetic particle (SEP), coronal mass ejection (CME), proton flux, solar wind, and X-ray flux telemetry streams at the source.

To guarantee nanosecond-level execution latency and maximum I/O throughput under strict space-grade computing constraints, Prakash avoids traditional operating system abstractions, standard I/O library overhead, and dynamic synchronization primitives.

---

## Technical Constraints & Design Rationale

### 1. Zero-Copy I/O via POSIX `mmap()`
* **Requirement**: Avoid standard I/O library functions (`fopen()`, `fgets()`, `fscanf()`).
* **Implementation**: Files are mapped directly into the process's virtual memory address space using `open()` and `mmap()` with `MAP_SHARED` / `MAP_PRIVATE` and `PROT_READ`.
* **Technical Rationale**: Standard file I/O involves double buffering—copying data from hardware storage to kernel page cache, then kernel cache to user-space buffer. `mmap()` establishes direct memory-mapped access to kernel page tables, completely bypassing user-space allocation and copy overheads. In combination with `madvise(..., MADV_SEQUENTIAL)`, the OS kernel prefetches pages, eliminating disk-bound latency spikes.

### 2. Multi-Threading & Core Affinity (`pthread_setaffinity_np()`)
* **Requirement**: 5 Producer threads (one for each telemetry file) + 1 Consumer thread. Enforce strict core pinning.
* **Implementation**: Each thread is assigned a specific CPU ID (Cores 0 to 5) using `cpu_set_t` and `pthread_setaffinity_np()`.
* **Technical Rationale**: Operating system thread schedulers frequently migrate threads between CPU cores for load balancing. Core migration invalidates L1/L2 CPU caches (cache misses) and causes expensive kernel context switches. Direct CPU affinity guarantees 100% L1 cache locality for memory-mapped pointers and ring buffer slots, keeping execution context resident in core cache lines.

### 3. Lock-Free Concurrency via C11 `stdatomic.h` & CAS
* **Requirement**: Lock-free SPCM/MPMC ring buffer using atomic operations (`stdatomic.h`). Strictly zero `pthread_mutex_t` locks.
* **Implementation**: Ring buffer index management uses atomic read/write and Compare-And-Swap (`atomic_compare_exchange_weak` / `atomic_compare_exchange_strong`) with acquired and released memory orderings (`memory_order_acquire`, `memory_order_release`).
* **Technical Rationale**: POSIX mutexes and condition variables involve kernel system calls (`futex` on Linux) when contention occurs, resulting in thread block/unpark cycles lasting microseconds. Lock-free ring buffers operate purely in user-space using hardware CPU atomic instructions (`LOCK CMPXCHG` on x86, `LDREX/STREX` or `CAS` on ARM), enabling nanosecond lock-free synchronization and eliminating thread starvation.

### 4. Zero-Copy Pointer Arithmetic Parsing
* **Requirement**: Avoid string tokenization routines (`strtok()`, `strtok_r()`, `sscanf()`).
* **Implementation**: Direct memory pointer traversal (`const char *ptr`). Skipping whitespace and double quotes by incrementing raw addresses, then extracting numbers via fast pointer arithmetic and fast custom float conversion (`strtof_l` or optimized `strtof`).
* **Technical Rationale**: `strtok()` modifies memory in-place by inserting null terminators (`\0`), which violates read-only memory mappings (`PROT_READ`). `strtok_r()` performs redundant memory scans and string copies. Direct pointer arithmetic moves directly along byte boundaries in memory-mapped address space without intermediate allocations or memory mutations.

### 5. Consumer Routing & UDP Telemetry Dispatch
* **Requirement**: Read danger breaches from atomic ring buffer, log to `warning_dispatch.txt` via low-level system call `write()` with `O_APPEND`, and dispatch serialization bundles over a local UDP socket on port `8080`.
* **Implementation**: The consumer thread polls the lock-free ring buffer, formats breached telemetry events into binary/structured bundles, appends them to disk using `write(fd, ...)` (low-level kernel I/O), and immediately transmits the telemetry payload over non-blocking UDP (`sendto()`) to `127.0.0.1:8080`.
* **Technical Rationale**: Standard library `fprintf()` buffers data in user space and lacks atomic append guarantees across non-synchronized calls. Low-level `write()` with `O_APPEND` provides kernel-level atomic file appends without mutex locks. UDP provides lightweight, connectionless transmission with zero handshaking or TCP congestion control delays, perfectly suited for real-time sensor telemetries.

---

## Data Stream Threshold Rules

| Stream File | Sensor Type | Danger Threshold Criteria |
| :--- | :--- | :--- |
| `cme_sim.txt` | Coronal Mass Ejection | Velocity $> 1000.0\text{ km/s}$ **AND** Angular Width $== 360.0^\circ$ (Halo CME) |
| `sep_sim.txt` | Solar Energetic Particle | Intensity $> 50.0$ |
| `solar_wind_sim.txt` | Solar Wind | Speed $> 800.0\text{ km/s}$ |
| `proton_flux_sim.txt` | Proton Flux | Flux $> 100.0\text{ p/cm}^2/\text{s/sr}$ |
| `xray_flux_sim.txt` | X-Ray Flux | Flux $> 0.5\text{ W/m}^2$ |

---

## Core Implementation Layout (`prakash.c`)

The binary architecture consists of:
1. `LockFreeRingBuffer`: Atomic head/tail circular array storing `AlertBundle` structures.
2. `ProducerContext`: Encapsulates file descriptor, memory map pointer, file size, telemetry type, and target CPU core ID.
3. `ConsumerContext`: Encapsulates disk log descriptor (`O_APPEND`), socket handle, target address, and target CPU core ID.
4. `Prakash Pipeline Loop`: Continuous zero-copy parsing by producer threads pushing danger events to the atomic ring buffer while the dedicated consumer thread dispatches alerts to network and disk.
