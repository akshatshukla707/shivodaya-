"use client";

import React from "react";
import { Network, Wifi, WifiOff, AlertTriangle, RefreshCw, Radio, CheckCircle2, Shield } from "lucide-react";
import MissionNetworkMap from "../MissionNetworkMap";

export default function NetworkWorkspace({
  isRelayOffline = false,
  onToggleRelay,
  activeMission = "MARS-01",
  onInspectItem
}) {
  const relays = [
    { id: "prakash", name: "PRAKASH L1 ENCODER", ipn: "ipn:1.1", orbit: "Sun-Earth L1", band: "Ka-Band", status: "ONLINE", load: "4.2%", latency: "5.1s" },
    { id: "lunar", name: "LUNAR GATEWAY ALPHA", ipn: "ipn:2.1", orbit: "Lunar NRHO", band: "Laser Optical", status: "ONLINE", load: "14.1%", latency: "1.4s" },
    { id: "relayA", name: "RELAY ALPHA (SENTRY-01)", ipn: "ipn:4.1", orbit: "Heliospheric L5", band: "X-Band", status: isRelayOffline ? "OFFLINE (CME DISTURBANCE)" : "ONLINE", load: isRelayOffline ? "0.0%" : "28.4%", latency: "24.1s" },
    { id: "relayB", name: "RELAY BETA (STARSHIP-04)", ipn: "ipn:5.1", orbit: "Mars Transfer (MTO)", band: "Laser Crosslink", status: "ONLINE", load: "18.2%", latency: "8.3m" },
    { id: "relayC", name: "RELAY GAMMA (RE-ROUTE SENTRY)", ipn: "ipn:6.1", orbit: "Deep Space Lagrange", band: "Laser Crosslink", status: isRelayOffline ? "REROUTE CUSTODY ACTIVE" : "STANDBY", load: isRelayOffline ? "42.1%" : "2.0%", latency: "6.9m" },
    { id: "mars", name: "AKASHDEEP-01 (MARS TARGET)", ipn: "ipn:3.1", orbit: "Mars Surface", band: "Optical / Ka", status: "TARGET DECODER ONLINE", load: "2.1%", latency: "12.4m" }
  ];

  return (
    <div className="space-y-6 font-mono animate-in fade-in duration-200">
      
      {/* 1. Header with Topology State */}
      <div className="bg-zinc-950/90 border border-white/10 rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4 text-cyan-400" />
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
                LIVE DEEP-SPACE AUTONOMOUS MESH TOPOLOGY
              </h2>
            </div>
            <p className="text-[11px] text-zinc-400 font-sans pt-0.5">
              Delay-Tolerant Networking (BPv7) with Time-Varying Graph (TVG) Dijkstra routing engine.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            <span className="px-2 py-0.5 rounded bg-amber-950/50 border border-amber-500/30 text-amber-300">
              ◇ SHIVODAYA SIMULATION
            </span>
            <button
              onClick={onToggleRelay}
              className={`px-3 py-1 rounded font-bold uppercase transition-all flex items-center gap-1.5 ${
                isRelayOffline
                  ? "bg-red-950/80 border border-red-500/50 text-red-300"
                  : "bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white"
              }`}
            >
              {isRelayOffline ? <WifiOff className="w-3 h-3 text-red-400" /> : <Wifi className="w-3 h-3 text-cyan-400" />}
              <span>{isRelayOffline ? "RESTORE RELAY-ALPHA" : "FAULT: SEVER RELAY-ALPHA"}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Topology Alert Banner */}
        {isRelayOffline ? (
          <div className="p-3.5 rounded-lg bg-red-950/30 border border-red-500/40 text-red-200 flex items-center justify-between text-xs animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <div>
                <strong>RELAY-ALPHA OFFLINE // CME DISTURBANCE DETECTED</strong>
                <div className="text-[11px] text-red-300 font-sans">
                  Richa Perceptron router autonomously engaged alternate path: <span className="font-mono font-bold text-white">PRAKASH → RELAY-GAMMA (ESA L5) → RELAY-BETA → MARS</span>. Delivery confirmed.
                </div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold shrink-0">
              ALTERNATE ROUTE FOUND
            </span>
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-zinc-900/60 border border-white/5 text-zinc-400 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Primary TVG Dijkstra path nominal: <strong className="text-white">SOL → PRAKASH → RELAY-ALPHA → RELAY-BETA → AKASHDEEP (MARS-01)</strong></span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold">ALL LINKS OPTIMAL</span>
          </div>
        )}
      </div>

      {/* 2. Interactive SVG Mesh Visualizer */}
      <MissionNetworkMap
        isRelayOffline={isRelayOffline}
        onToggleRelay={onToggleRelay}
        activeMission={activeMission}
      />

      {/* 3. Available Relays & Node Status Directory */}
      <div className="bg-zinc-950/90 border border-white/10 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            INTERPLANETARY RELAY REGISTRY & BUFFER CUSTODY
          </h3>
          <span className="text-[10px] text-zinc-500">CLICK NODE TO INSPECT</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {relays.map((r) => (
            <div
              key={r.id}
              onClick={() => onInspectItem && onInspectItem({ ...r, type: "node", title: r.name })}
              className="p-3.5 rounded-lg bg-zinc-900/60 hover:bg-zinc-850 border border-white/5 hover:border-cyan-400/40 cursor-pointer transition-all space-y-2 group"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-[10px] text-zinc-500">{r.ipn}</div>
                  <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">{r.name}</div>
                </div>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                  r.status.includes("OFFLINE") ? "bg-red-950/80 text-red-300 border border-red-500/40" : "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                }`}>
                  {r.status.split(" ")[0]}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1 text-[11px] text-zinc-400 pt-1 border-t border-white/5">
                <div>ORBIT: <span className="text-zinc-200">{r.orbit}</span></div>
                <div>DELAY: <span className="text-amber-300 tabular-nums">{r.latency}</span></div>
                <div>BAND: <span className="text-zinc-200">{r.band}</span></div>
                <div>BUFFER: <span className="text-cyan-300 tabular-nums">{r.load}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
