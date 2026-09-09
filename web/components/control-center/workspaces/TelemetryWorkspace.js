"use client";

import React, { useState, useMemo } from "react";
import { Cpu, Activity, Zap, Thermometer, Compass, Radio, ShieldAlert, Database, Users, ExternalLink } from "lucide-react";

export default function TelemetryWorkspace({
  activeMission = "MARS-01",
  simulatedAlertActive = false,
  onInspectItem
}) {
  const [selectedCategory, setSelectedCategory] = useState("radiation"); // "power", "thermal", "position", "comm", "radiation", "payload", "crew"

  const categories = [
    { id: "radiation", label: "RADIATION", icon: ShieldAlert },
    { id: "power", label: "POWER BUS", icon: Zap },
    { id: "thermal", label: "THERMAL", icon: Thermometer },
    { id: "position", label: "TRAJECTORY", icon: Compass },
    { id: "comm", label: "COMMUNICATION", icon: Radio },
    { id: "payload", label: "PAYLOAD / JSCC", icon: Database },
    { id: "crew", label: "LIFE SUPPORT", icon: Users }
  ];

  // Telemetry channels per mission and category
  const telemetryData = useMemo(() => {
    return {
      radiation: {
        title: "RADIOLOGICAL DOSIMETRY & HIGH-ENERGY FLUX",
        source: "GOES-18 HEPAD / Onboard Micro-Dosimeter",
        unit: "mSv/h & pfu",
        status: simulatedAlertActive ? "CRITICAL ALERT" : "NOMINAL BASELINE",
        statusLevel: simulatedAlertActive ? "CRITICAL" : "NOMINAL",
        metrics: [
          { label: "ABSORBED DOSE RATE", value: simulatedAlertActive ? "1.820 mSv/h" : "0.042 mSv/h", limit: "<0.100 mSv/h", status: simulatedAlertActive ? "CRITICAL" : "NOMINAL" },
          { label: "PROTON FLUX (≥10 MeV)", value: simulatedAlertActive ? "1,240.5 pfu" : "1.09 pfu", limit: "<10.0 pfu", status: simulatedAlertActive ? "CRITICAL" : "NOMINAL" },
          { label: "SILICON SOI SENSOR SEU RATE", value: simulatedAlertActive ? "14.2 upsets/hr" : "0.02 upsets/hr", limit: "<1.00 upsets/hr", status: simulatedAlertActive ? "WARN" : "NOMINAL" },
          { label: "WATER-WALL SHIELD ATTENUATION", value: simulatedAlertActive ? "94.2% (Active)" : "12.0% (Stowed)", limit: ">90% under SPE", status: "NOMINAL" }
        ],
        chartData: simulatedAlertActive
          ? [1.1, 1.2, 1.2, 1.3, 4.8, 42.0, 185.0, 520.0, 940.0, 1240.0]
          : [1.08, 1.12, 1.09, 1.07, 1.11, 1.09, 1.08, 1.10, 1.09, 1.09]
      },
      power: {
        title: "ELECTRICAL POWER SYSTEM (EPS) BUS TELEMETRY",
        source: "UltraFlex Deployable Solar Wing & SuperCap Buffer",
        unit: "Volts & Watts",
        status: "NOMINAL",
        statusLevel: "NOMINAL",
        metrics: [
          { label: "MAIN DC BUS VOLTAGE", value: "124.8 V", limit: "120 - 130 V", status: "NOMINAL" },
          { label: "ARRAY GENERATION", value: "14,820 W", limit: ">12,000 W", status: "NOMINAL" },
          { label: "BATTERY STATE OF CHARGE", value: "96.4%", limit: ">80.0%", status: "NOMINAL" },
          { label: "BUS SHUNT TEMPERATURE", value: "34.1 °C", limit: "<65.0 °C", status: "NOMINAL" }
        ],
        chartData: [124.6, 124.8, 124.7, 124.9, 124.8, 125.0, 124.8, 124.7, 124.8, 124.8]
      },
      thermal: {
        title: "ACTIVE THERMAL CONTROL SYSTEM (ATCS)",
        source: "Dual-Phase Mechanically Pumped Fluid Loop",
        unit: "Celsius (°C)",
        status: "NOMINAL",
        statusLevel: "NOMINAL",
        metrics: [
          { label: "AVIONICS BAY CORE TEMP", value: "21.4 °C", limit: "15 - 28 °C", status: "NOMINAL" },
          { label: "RADIATOR OUTLET TEMP", value: "-14.2 °C", limit: "-40 - +10 °C", status: "NOMINAL" },
          { label: "CRYO PROPELLANT TANK GRADIENT", value: "4.2 K/m", limit: "<8.0 K/m", status: "NOMINAL" },
          { label: "AMMONIA PUMP RPM", value: "3,420 RPM", limit: "3,000 - 3,800 RPM", status: "NOMINAL" }
        ],
        chartData: [21.1, 21.2, 21.4, 21.3, 21.5, 21.4, 21.6, 21.4, 21.5, 21.4]
      },
      position: {
        title: "GUIDANCE, NAVIGATION & CONTROL (GN&C)",
        source: "Deep Space Star Trackers & Optical Navigation",
        unit: "AU, km/s, arcsec",
        status: "NOMINAL",
        statusLevel: "NOMINAL",
        metrics: [
          { label: "HELIOCENTRIC DISTANCE", value: "1.384 AU", limit: "Transit Range", status: "NOMINAL" },
          { label: "INERTIAL VELOCITY", value: "24.18 km/s", limit: "Planned Trajectory", status: "NOMINAL" },
          { label: "STAR TRACKER POINTING ERROR", value: "0.08 arcsec", limit: "<0.35 arcsec", status: "NOMINAL" },
          { label: "PRIMARY OPTICAL LINK BEARING", value: "AZ 142.1° EL +18.4°", limit: "Target Locked", status: "NOMINAL" }
        ],
        chartData: [24.16, 24.17, 24.17, 24.18, 24.18, 24.18, 24.19, 24.18, 24.19, 24.18]
      },
      comm: {
        title: "RADIO FREQUENCY & OPTICAL LASER CROSSLINK",
        source: "High-Gain Ka-Band & Deep Space Optical Transceiver",
        unit: "dB, SNR, RTT",
        status: simulatedAlertActive ? "WARN // ELEVATED NOISE" : "NOMINAL",
        statusLevel: simulatedAlertActive ? "WARN" : "NOMINAL",
        metrics: [
          { label: "ROUND-TRIP LIGHT TIME (RTT)", value: "12.4 minutes", limit: "Nominal Geometry", status: "NOMINAL" },
          { label: "OPTICAL SNR (LASER LINK)", value: simulatedAlertActive ? "18.2 dB (Degraded)" : "32.4 dB (Optimal)", limit: ">15.0 dB", status: simulatedAlertActive ? "WARN" : "NOMINAL" },
          { label: "BIT ERROR RATE (BER)", value: simulatedAlertActive ? "1.4e-6 (Forward ECC)" : "<1e-9 (Zero error)", limit: "<1e-5", status: "NOMINAL" },
          { label: "CUSTODY BUFFER RESERVES", value: "98.4% Available", limit: ">20.0%", status: "NOMINAL" }
        ],
        chartData: simulatedAlertActive
          ? [32.4, 32.1, 31.8, 30.2, 24.1, 19.8, 18.5, 18.2, 18.4, 18.2]
          : [32.2, 32.5, 32.3, 32.4, 32.6, 32.4, 32.5, 32.4, 32.5, 32.4]
      },
      payload: {
        title: "JSCC COMPRESSION & NEURAL ROUTING TELEMETRY",
        source: "Prakash C11 Core & Richa TVG Routing Engine",
        unit: "bytes & ms",
        status: "NOMINAL",
        statusLevel: "NOMINAL",
        metrics: [
          { label: "JSCC VECTOR COMPRESSION RATIO", value: "98.2% Reduction", limit: ">90%", status: "NOMINAL" },
          { label: "COMPRESSION VECTOR SIZE", value: "32 Floats (128 bytes)", limit: "Fixed Envelope", status: "NOMINAL" },
          { label: "TVG ROUTING LATENCY", value: "3.2 ms Compute Time", limit: "<10.0 ms", status: "NOMINAL" },
          { label: "LOCK-FREE RING BUFFER OCCUPANCY", value: "4.8% Memory Pool", limit: "<60.0%", status: "NOMINAL" }
        ],
        chartData: [98.1, 98.2, 98.2, 98.3, 98.2, 98.2, 98.4, 98.2, 98.3, 98.2]
      },
      crew: {
        title: "ENVIRONMENTAL CONTROL & LIFE SUPPORT (ECLSS)",
        source: "Cabin Atmospheric Sensor Array & Storm Shelter",
        unit: "kPa, % O₂, ppm CO₂",
        status: simulatedAlertActive ? "SHELTER ENGAGED" : "NOMINAL",
        statusLevel: simulatedAlertActive ? "WARN" : "NOMINAL",
        metrics: [
          { label: "CABIN TOTAL PRESSURE", value: "101.3 kPa", limit: "98 - 103 kPa", status: "NOMINAL" },
          { label: "OXYGEN PARTIAL PRESSURE", value: "21.2 kPa", limit: "19.5 - 23.0 kPa", status: "NOMINAL" },
          { label: "CARBON DIOXIDE LEVEL", value: "2,400 ppm", limit: "<4,000 ppm", status: "NOMINAL" },
          { label: "STORM SHELTER BULKHEAD SEAL", value: simulatedAlertActive ? "HERMETIC 100%" : "STANDBY READY", limit: "100% under alert", status: "NOMINAL" }
        ],
        chartData: [101.2, 101.3, 101.3, 101.2, 101.4, 101.3, 101.3, 101.3, 101.4, 101.3]
      }
    };
  }, [simulatedAlertActive]);

  const activeCategoryData = telemetryData[selectedCategory] || telemetryData.radiation;

  // Stream of recent telemetry packets
  const telemetryStream = [
    { time: "13:58:24", channel: "RAD-HEPAD-P10", mission: activeMission, value: simulatedAlertActive ? "1,240.5 pfu" : "1.09 pfu", status: simulatedAlertActive ? "CRITICAL" : "NOMINAL" },
    { time: "13:58:22", channel: "RAD-DOS-RATE", mission: activeMission, value: simulatedAlertActive ? "1.820 mSv/h" : "0.042 mSv/h", status: simulatedAlertActive ? "CRITICAL" : "NOMINAL" },
    { time: "13:58:20", channel: "EPS-BUS-MAIN", mission: activeMission, value: "124.8 V", status: "NOMINAL" },
    { time: "13:58:18", channel: "ATCS-CORE-T", mission: activeMission, value: "21.4 °C", status: "NOMINAL" },
    { time: "13:58:15", channel: "GN&C-VEL-V", mission: activeMission, value: "24.18 km/s", status: "NOMINAL" },
    { time: "13:58:12", channel: "COMM-OPT-SNR", mission: activeMission, value: simulatedAlertActive ? "18.2 dB" : "32.4 dB", status: simulatedAlertActive ? "WARN" : "NOMINAL" },
    { time: "13:58:10", channel: "PAY-JSCC-VEC", mission: activeMission, value: "32F / 128B", status: "NOMINAL" },
    { time: "13:58:08", channel: "ECLSS-CAB-P", mission: activeMission, value: "101.3 kPa", status: "NOMINAL" }
  ];

  // Helper to render responsive SVG sparkline/chart
  const renderChart = (data, isCritical) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const width = 600;
    const height = 140;
    const padding = 20;

    const points = data.map((val, idx) => {
      const x = padding + (idx / (data.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((val - min) / range) * (height - 2 * padding);
      return `${x},${y}`;
    }).join(" ");

    return (
      <div className="w-full bg-black/60 rounded-lg p-3 border border-white/5 space-y-2">
        <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
          <span>T - 10 SAMPLES (LIVE SAMPLING RATE: 1 Hz)</span>
          <span className="text-zinc-300">MAX: {max.toFixed(2)} | MIN: {min.toFixed(2)}</span>
        </div>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-28 overflow-visible">
          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
          <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />

          {/* Polyline */}
          <polyline
            fill="none"
            stroke={isCritical ? "#f87171" : "#22d3ee"}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />

          {/* Data points */}
          {data.map((val, idx) => {
            const x = padding + (idx / (data.length - 1)) * (width - 2 * padding);
            const y = height - padding - ((val - min) / range) * (height - 2 * padding);
            return (
              <circle
                key={idx}
                cx={x}
                cy={y}
                r={idx === data.length - 1 ? 4 : 2.5}
                fill={isCritical ? "#ef4444" : "#06b6d4"}
                stroke="#000"
                strokeWidth="1.5"
              />
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className="space-y-6 font-mono animate-in fade-in duration-200">
      
      {/* 1. Header & Parameter Category Selector */}
      <div className="bg-zinc-950/90 border border-white/10 rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
                MISSION TELEMETRY WORKSPACE // {activeMission}
              </h2>
            </div>
            <p className="text-[11px] text-zinc-400 font-sans pt-0.5">
              Multi-channel downlinked engineering parameters, flight limits, and high-frequency sensor streams.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 text-zinc-300">
              DOWNLINK RATE: 256 kbps (Ka/Optical)
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-bold">
              ● SYNC NOMINAL
            </span>
          </div>
        </div>

        {/* Category Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.25)]"
                    : "bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-white/5"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-cyan-400" : "text-zinc-500"}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Selected Parameter Detail & Chart Visualization */}
      <div className="bg-zinc-950/90 border border-white/10 rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">
              ACTIVE TELEMETRY SUBSYSTEM
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              {activeCategoryData.title}
            </h3>
            <span className="text-[10px] text-cyan-300">
              SOURCE: {activeCategoryData.source}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
              activeCategoryData.statusLevel === "CRITICAL"
                ? "bg-red-950/80 text-red-300 border border-red-500/40 animate-pulse"
                : activeCategoryData.statusLevel === "WARN"
                ? "bg-amber-950/80 text-amber-300 border border-amber-500/40"
                : "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
            }`}>
              {activeCategoryData.status}
            </span>
          </div>
        </div>

        {/* 4 Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {activeCategoryData.metrics.map((m, idx) => (
            <div
              key={idx}
              onClick={() => onInspectItem && onInspectItem({
                type: "telemetry",
                title: m.label,
                category: selectedCategory.toUpperCase(),
                status: m.status,
                description: `${m.label} on ${activeMission}. Current value: ${m.value}. Operational tolerance: ${m.limit}.`,
                source: activeCategoryData.source
              })}
              className="p-3.5 rounded-lg bg-zinc-900/60 hover:bg-zinc-900 border border-white/5 hover:border-cyan-400/40 cursor-pointer transition-all space-y-1 group"
            >
              <div className="text-[10px] text-zinc-400 uppercase tracking-wider group-hover:text-cyan-300 transition-colors">
                {m.label}
              </div>
              <div className="text-lg font-bold text-white tracking-wide">
                {m.value}
              </div>
              <div className="flex justify-between items-center text-[9px] text-zinc-500 pt-1 border-t border-white/5">
                <span>LIMIT: {m.limit}</span>
                <span className={m.status === "CRITICAL" ? "text-red-400 font-bold" : m.status === "WARN" ? "text-amber-400 font-bold" : "text-emerald-400"}>
                  {m.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Trend Chart */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="uppercase text-[10px] tracking-wider">HIGH-FREQUENCY SENSOR TREND</span>
            <span className="text-[10px] text-zinc-500">UNIT: {activeCategoryData.unit}</span>
          </div>
          {renderChart(activeCategoryData.chartData, activeCategoryData.statusLevel === "CRITICAL")}
        </div>

      </div>

      {/* 3. Live Telemetry Stream Log */}
      <div className="bg-zinc-950/90 border border-white/10 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              LIVE SENSOR PACKET STREAM ({activeMission})
            </h3>
          </div>
          <span className="text-[10px] text-zinc-500">
            FRAME SEQUENCE: 0x4B21 · PACKET LOSS: 0.00%
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-zinc-500 text-[10px] uppercase">
                <th className="py-2 px-3">TIMESTAMP</th>
                <th className="py-2 px-3">CHANNEL ID</th>
                <th className="py-2 px-3">TARGET ASSET</th>
                <th className="py-2 px-3">CURRENT VALUE</th>
                <th className="py-2 px-3">STATUS</th>
                <th className="py-2 px-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {telemetryStream.map((pkt, i) => (
                <tr key={i} className="hover:bg-zinc-900/50 transition-colors">
                  <td className="py-2 px-3 text-zinc-400 tabular-nums">{pkt.time}</td>
                  <td className="py-2 px-3 text-cyan-300 font-semibold">{pkt.channel}</td>
                  <td className="py-2 px-3 text-zinc-300">{pkt.mission}</td>
                  <td className="py-2 px-3 text-white font-bold">{pkt.value}</td>
                  <td className="py-2 px-3">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                      pkt.status === "CRITICAL" ? "bg-red-950 text-red-300 border border-red-500/30" : pkt.status === "WARN" ? "bg-amber-950 text-amber-300 border border-amber-500/30" : "bg-emerald-950 text-emerald-300 border border-emerald-500/30"
                    }`}>
                      {pkt.status}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right">
                    <button
                      onClick={() => onInspectItem && onInspectItem({
                        type: "telemetry",
                        title: pkt.channel,
                        time: pkt.time,
                        status: pkt.status,
                        destination: pkt.mission,
                        description: `Live downlink telemetry frame for channel ${pkt.channel}. Current reading: ${pkt.value}.`
                      })}
                      className="text-[10px] text-zinc-500 hover:text-cyan-400 transition-colors inline-flex items-center gap-1"
                    >
                      <span>Inspect</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
