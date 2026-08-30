# PROJECT SHIVODAYA :: COMPLETE MODULE EXECUTION TRANSCRIPT & COMMAND GUIDE

---

## 1. PRAKASH SEMANTIC ENCODER MODULE (`ipn:1.1` Aditya-L1 Probe)

### Build & Direct Run
```bash
cd ~/shivodaya
chmod +x *.sh
./build_all.sh
./build/prakash_encoder
```

### Standalone Demo Script
```bash
cd ~/shivodaya/prakash
./run_cmd_demo.sh
```

---

## 2. RICHA NEURAL DTN ROUTER MODULE (`ipn:2.1` Cis-Lunar Relay)

### Build & Direct Run
```bash
cd ~/shivodaya
./build_all.sh
./build/richa_neural_router
```

### 3-Terminal NASA ION BPv7 DTN Store-and-Forward Demonstration
Run across 3 separate terminal windows:

- **Terminal 1 (Sender - Aditya-L1 `ipn:1.1`)**:
  ```bash
  cd ~/shivodaya
  ./richa/ion_dtn_demo/terminal1sender.sh
  ```

- **Terminal 2 (Receiver 1 - Online Earth Gateway `ipn:2.1`)**:
  ```bash
  cd ~/shivodaya
  ./richa/ion_dtn_demo/terminal2receiver.sh
  ```

- **Terminal 3 (Receiver 2 - Delayed Mars Base `ipn:3.1`)**:
  ```bash
  cd ~/shivodaya
  ./richa/ion_dtn_demo/terminal3_delayed_receiver.sh
  ```

### Launch 3D WebGL Neural Mesh Visualizer
```bash
cd ~/shivodaya/richa
explorer.exe main3dvisual.html
```

---

## 3. AKASHDEEP SEMANTIC DECODER & 3D MISSION CONTROL GUI (`ipn:3.1` Mars Base)

### Native C++ Semantic Decoder Listener
```bash
cd ~/shivodaya/build
./akashdeep_decoder
```

### Akashdeep 3D Mission Control Java Swing GUI
```bash
cd ~/shivodaya
./build_java.sh
cd akashdeep/java_gui
java -cp "bin:." Main
```

---

## 4. 4-STEP NATIVE NEURAL ARCHITECTURE PIPELINE COMMANDS

Run across 3 separate terminal windows in order:

### Command 1: Build All Binaries
```bash
cd ~/shivodaya && ./build_all.sh
```

### Command 2: Start Akashdeep Decoder (Terminal 1)
```bash
cd ~/shivodaya/build && ./akashdeep_decoder
```

### Command 3: Start Richa Neural Router (Terminal 2)
```bash
cd ~/shivodaya/build && ./richa_neural_router
```

### Command 4: Start Prakash Encoder (Terminal 3)
```bash
cd ~/shivodaya/build && ./prakash_encoder
```

### Automated Single-Command Execution
```bash
cd ~/shivodaya && ./run_full_mesh_pipeline.sh
```

---

## 5. GROUND OPERATIONS EARTH CONTROL CENTER & WEB DASHBOARDS

### Java Control Center HUD GUI
```bash
cd ~/shivodaya
./build_java.sh
./run_earth_control_center.sh
```

### 3D WebGL Earth Operations Dashboard
```bash
cd ~/shivodaya/earth_monitor
explorer.exe index_earth_dashboard.html
```

---

## 6. CLONING & EXECUTING ON ANOTHER LAPTOP (WSL / Ubuntu)

### Step 1: Clone Repository
```bash
cd ~
git clone https://github.com/akshatshukla707/shivodaya-.git shivodaya
cd shivodaya
```

### Step 2: Build All Native & Java Code
```bash
chmod +x *.sh
./build_all.sh
./build_java.sh
```

### Step 3: Run Any Module
- **Akashdeep Dashboard**: `cd akashdeep/java_gui && java -cp "bin:." Main`
- **Earth Ground Center**: `./run_earth_control_center.sh`
- **Full Mesh Pipeline**: `./run_full_mesh_pipeline.sh`
