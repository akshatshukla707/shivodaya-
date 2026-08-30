# PROJECT SHIVODAYA :: CHRONOLOGICAL STEP-BY-STEP EXECUTION TRANSCRIPTS (1 TO 7)

---

## [TRANSCRIPT 1] SETUP & CLONING ON A NEW LAPTOP (WSL / Ubuntu)

### Step 1.1: Install System Dependencies
```bash
sudo apt update
sudo apt install -y build-essential cmake openjdk-17-jdk libsqlite3-dev git
```

### Step 1.2: Clone Project Repository
```bash
cd ~
git clone https://github.com/akshatshukla707/shivodaya-.git shivodaya
cd shivodaya
chmod +x *.sh
```

### Step 1.3: Build All Native Binaries & Java GUIs
```bash
./build_all.sh
./build_java.sh
```

---

## [TRANSCRIPT 2] MODULE 1 - PRAKASH SEMANTIC ENCODER (`ipn:1.1` Aditya-L1 Probe)

### Step 2.1: Run Prakash Native Binary
```bash
cd ~/shivodaya
./build/prakash_encoder
```

### Step 2.2: Standalone Demo Runner Script
```bash
cd ~/shivodaya/prakash
./run_cmd_demo.sh
```

---

## [TRANSCRIPT 3] MODULE 2 - RICHA NEURAL DTN ROUTER (`ipn:2.1` Cis-Lunar Relay)

### Step 3.1: Run Richa Perceptron Router Binary
```bash
cd ~/shivodaya
./build/richa_neural_router
```

### Step 3.2: Run 3-Terminal NASA ION BPv7 Store-and-Forward Demo
Open **3 separate terminal windows** and execute in order:

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

### Step 3.3: Launch Richa 3D WebGL Mesh Visualizer
```bash
cd ~/shivodaya/richa
explorer.exe main3dvisual.html
```

---

## [TRANSCRIPT 4] MODULE 3 - AKASHDEEP SEMANTIC DECODER & 3D MISSION CONTROL GUI (`ipn:3.1` Mars Base)

### Step 4.1: Run Akashdeep Native C++ Decoder Listener
```bash
cd ~/shivodaya/build
./akashdeep_decoder
```

### Step 4.2: Launch Akashdeep 3D Mission Control Java Dashboard
```bash
cd ~/shivodaya/akashdeep/java_gui
java -cp "bin:." Main
```

---

## [TRANSCRIPT 5] 4-TERMINAL NATIVE NEURAL ARCHITECTURE PIPELINE EXECUTION

Execute in chronological order across **3 terminal windows**:

### Step 5.1: Build All Binaries (Terminal 1)
```bash
cd ~/shivodaya && ./build_all.sh
```

### Step 5.2: Launch Akashdeep Destination Decoder (Terminal 1 Listener)
```bash
cd ~/shivodaya/build && ./akashdeep_decoder
```

### Step 5.3: Launch Richa Neural Router (Terminal 2 Relay)
```bash
cd ~/shivodaya/build && ./richa_neural_router
```

### Step 5.4: Launch Prakash Encoder (Terminal 3 Source)
```bash
cd ~/shivodaya/build && ./prakash_encoder
```

### Alternative: Automated Single-Command Execution
```bash
cd ~/shivodaya && ./run_full_mesh_pipeline.sh
```

---

## [TRANSCRIPT 6] GROUND OPERATIONS EARTH CONTROL CENTER & WEB DASHBOARDS

### Step 6.1: Launch Ground Operations Control Center Java HUD
```bash
cd ~/shivodaya
./run_earth_control_center.sh
```

### Step 6.2: Launch 3D WebGL Earth Operations Dashboard
```bash
cd ~/shivodaya/earth_monitor
explorer.exe index_earth_dashboard.html
```

---

## [TRANSCRIPT 7] STANDALONE STREAMLIT MISSION CONTROL ANALYTICS DASHBOARD

### Step 7.1: Install Streamlit & Dependencies (On Laptop)
```bash
sudo apt update
sudo apt install -y python3-pip python3-pandas python3-numpy python3-plotly
pip3 install streamlit
```

### Step 7.2: Launch Streamlit Dashboard
```bash
cd ~/shivodaya
streamlit run streamlit_dashboard.py
```
*(Automatically opens browser at `http://localhost:8501`)*
