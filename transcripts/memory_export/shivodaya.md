---
name: shivodaya
description: Final state of Project Shivodaya space radiation DTN mesh architecture, C/C++ native pipeline, Java GUIs, Streamlit dashboard, and GitHub repository sync.
type: project
modified: 2026-08-30
---

# Project Shivodaya Space Radiation DTN Mesh Architecture (Finalized)

Project Shivodaya is a space mesh network architecture for real-time solar radiation telemetry acquisition, neural space weather alert routing, delay-tolerant communications (DTN), and ground station operations.

## Project Structure & Key Modules
- **Prakash Encoder (`prakash/prakash_encoder.c`)**: Native C11 JSCC 32-float linear projection vector encoder (`ipn:1.1` Aditya-L1 Solar Probe). Memory-mapped (`mmap`) 5-stream ingestion, ring buffer, `'Bhaarat'` marker verification.
- **Richa Neural Router (`richa/richa_neural_router.cpp`)**: Native C++17 Perceptron node engine (`ipn:2.1`). 100-node TVG Time-Dependent Dijkstra routing with fallback multi-hop BFS rerouting on solar blackout events. Asynchronous SQLite3 WAL logger (`richa_routing_log.db`). Includes Bundle Protocol v7 (BPv7) store-and-forward custody engine (`richa/ion_dtn_demo/`).
- **Akashdeep Semantic Decoder (`akashdeep/akashdeep_decoder.cpp`, `akashdeep/java_gui/`)**: Native C++17 semantic decoder (`ipn:3.1`) and Java Swing 3D trajectory & radiation wave dashboard with customized stream sub-windows (`SOLAR_FLARES`, `SOLAR_WIND`, `PROTON_FLUX`, `XRAY_FLUX`).
- **Ground Operations Center (`earth_control_center/`, `earth_monitor/`)**: Java Swing HUD monitoring dashboard for deep-space agency nodes (ISRO, NASA, ESA, Roscosmos, JAXA) and HTML5 WebGL 3D Deep Space Mesh visualizers (`main3dvisual.html`, `index_earth_dashboard.html`).
- **Streamlit Analytics Dashboard (`streamlit_dashboard.py`)**: Optional standalone Python analytics dashboard for Akashdeep Mars Control, Ground Operations, and SQLite routing log queries.
- **Chronological Transcripts (`transcripts/execution_transcript_guide.md`)**: Full 1-to-6 chronological setup and execution guide.
- **Bundled Dependencies (`third_party/ION-DTN`, `third_party/sqlite3`)**: Standalone, zero-external-dependency CMake build configuration (`build_all.sh`).

## Repository & Sync Status
- Remote Repository: `https://github.com/akshatshukla707/shivodaya-.git`
- Branch: `main`
- Status: Fully synchronized and clean.
