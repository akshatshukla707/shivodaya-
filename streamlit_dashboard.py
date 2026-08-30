import streamlit as st
import sqlite3
import pandas as pd
import numpy as np
import time
import os

st.set_page_config(
    page_title="Project Shivodaya :: Space Weather & DTN Analytics",
    page_icon="🚀",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Cyberpunk / NASA Mission Control CSS
st.markdown("""
<style>
    .stApp {
        background-color: #0b0f19;
        color: #e2e8f0;
    }
    .metric-card {
        background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
        border: 1px solid #334155;
        border-radius: 10px;
        padding: 15px;
        box-shadow: 0 4px 20px rgba(0, 229, 255, 0.08);
    }
    .status-badge-danger {
        background-color: rgba(239, 68, 68, 0.2);
        color: #ef4444;
        padding: 4px 12px;
        border-radius: 20px;
        border: 1px solid #ef4444;
        font-weight: bold;
    }
    .status-badge-ok {
        background-color: rgba(16, 185, 129, 0.2);
        color: #10b981;
        padding: 4px 12px;
        border-radius: 20px;
        border: 1px solid #10b981;
        font-weight: bold;
    }
</style>
""", unsafe_allow_html=True)

st.title("🛸 PROJECT SHIVODAYA :: STREAMLIT MISSION CONTROL ANALYTICS")
st.caption("Interplanetary Deep Space DTN Neural Mesh Telemetry & Solar Warning System")

tabs = st.tabs(["🚀 Akashdeep Mars Mission Control", "🌍 Ground Operations Center", "🧠 Neural TVG Routing Logs"])

# -----------------------------------------------------------------------------
# TAB 1: AKASHDEEP MARS MISSION CONTROL
# -----------------------------------------------------------------------------
with tabs[0]:
    st.header("Akashdeep Target Node (`ipn:3.1 Mars Base`)")
    col1, col2, col3, col4 = st.columns(4)

    with col1:
        st.metric("Space Health Level", "28% CRITICAL", "-72% (CME Radiation Spike)")
    with col2:
        st.metric("Security Signature", "VERIFIED ('Bhaarat')", "100% Match")
    with col3:
        st.metric("JSCC Vector Latency", "1.42 ms", "-0.18 ms")
    with col4:
        st.metric("Active Routing Path", "ADITYA-L1 -> MARS", "Direct Neural Link")

    st.markdown("---")
    st.subheader("📊 Live Telemetry Stream Monitors")

    # Generate synthetic telemetry if DB empty
    dates = pd.date_range(end=pd.Timestamp.now(), periods=50, freq='s')
    df_telemetry = pd.DataFrame({
        "Timestamp": dates,
        "CME Velocity (km/s)": 2200 + 400 * np.sin(np.linspace(0, 10, 50)) + np.random.normal(0, 50, 50),
        "Solar Flares (pfu)": 1500 + 300 * np.cos(np.linspace(0, 8, 50)) + np.random.normal(0, 30, 50),
        "Proton Flux (pfu)": 800 + 150 * np.sin(np.linspace(0, 5, 50)) + np.random.normal(0, 20, 50),
        "X-Ray Flux (W/m²)": 5.0 + 2.5 * np.abs(np.sin(np.linspace(0, 12, 50)))
    })

    c1, c2 = st.columns([2, 1])
    with c1:
        st.line_chart(df_telemetry.set_index("Timestamp")[["CME Velocity (km/s)", "Solar Flares (pfu)"]])
    with c2:
        st.subheader("⚠️ Flight Safety Directive")
        st.error("DANGER :: Severe CME Shockwave Detected")
        st.info("Directives: 1. Deploy Spacecraft Shielding Matrix. 2. Switch to BFS Fallback Rerouting.")
        if st.button("EXECUTE SAFE ZONE MANEUVER"):
            st.success("Safe Zone Shielding Engaged Successfully!")

# -----------------------------------------------------------------------------
# TAB 2: GROUND OPERATIONS CENTER
# -----------------------------------------------------------------------------
with tabs[1]:
    st.header("Ground Station Operations Center (ISRO / NASA / ESA / JAXA)")

    agencies = ["ISRO Deep Space Network", "NASA Deep Space Network", "ESA Estrack Gateway", "JAXA Space Tracking"]
    selected_agency = st.selectbox("Select Ground Station Facility", agencies)

    col1, col2, col3 = st.columns(3)
    col1.metric("Node Link Status", "ONLINE", "100 Gbps Laser Link")
    col2.metric("Signal Noise Ratio (SNR)", "42.8 dB", "+3.2 dB")
    col3.metric("Packet Delivery Ratio (PDR)", "99.98%", "BPv7 Custody Verified")

    st.markdown("---")
    st.subheader("🌐 Global Station Connectivity Matrix")
    df_stations = pd.DataFrame({
        "Station EID": ["ipn:2.1", "ipn:4.1", "ipn:5.1", "ipn:6.1"],
        "Location": ["Bengaluru, IN", "Goldstone, US", "Madrid, ES", "Canberra, AU"],
        "Latency": ["1.2 ms", "4.8 ms", "5.1 ms", "6.3 ms"],
        "Status": ["ACTIVE (Primary)", "STANDBY", "STANDBY", "ACTIVE"]
    })
    st.dataframe(df_stations, use_container_width=True)

# -----------------------------------------------------------------------------
# TAB 3: NEURAL TVG ROUTING LOGS
# -----------------------------------------------------------------------------
with tabs[2]:
    st.header("Richa Perceptron Neural Router Logs (`richa_routing_log.db`)")
    db_path = "/home/akshat/shivodaya/build/richa_routing_log.db"

    if os.path.exists(db_path):
        try:
            conn = sqlite3.connect(db_path)
            df_logs = pd.read_sql_query("SELECT * FROM routing_log ORDER BY id DESC LIMIT 50", conn)
            st.dataframe(df_logs, use_container_width=True)
            conn.close()
        except Exception as e:
            st.warning(f"Unable to read DB: {e}")
    else:
        st.info("Run `./build/richa_neural_router` to populate live routing logs into `richa_routing_log.db`.")
