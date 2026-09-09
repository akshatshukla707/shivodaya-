"use client";

import React, { useState } from "react";
import { Server, Shield, Cpu, Network, CheckCircle2, AlertTriangle, Play, RotateCcw, Lock, Terminal, FileText, Download } from "lucide-react";

export default function SystemsWorkspace({
  isRelayOffline = false,
  alertAcknowledged = true,
  auditLog = [],
  onInspectItem
}) {
  const [activeSubTab, setActiveSubTab] = useState("triad"); // "triad", "control", "audit"
  
  // Module Isolation / Safe State states
  const [moduleStates, setModuleStates] = useState({
    prakash: { status: "ONLINE", mode: "ACTIVE_INGEST", health: "99.9%", load: "4.8%", memory: "128 MB / 4 GB" },
    richa: { status: isRelayOffline ? "REROUTING" : "ONLINE", mode: "TVG_DIJKSTRA", health: "99.8%", load: isRelayOffline ? "42.1%" : "14.2%", memory: "512 MB / 8 GB" },
    akashdeep: { status: "ONLINE", mode: "REVERSE_MLP_READY", health: "99.9%", load: "2.1%", memory: "256 MB / 4 GB" }
  });

  // Confirmation modal state for simulated module controls
  const [pendingAction, setPendingAction] = useState(null); // { module, action, title }
  const [auditFilter, setAuditFilter] = useState("ALL");

  const handleActionRequest = (moduleKey, actionName) => {
    setPendingAction({
      module: moduleKey,
      action: actionName,
      title: `${actionName.toUpperCase()} ON ${moduleKey.toUpperCase()}`
    });
  };

  const confirmAction = () => {
    if (!pendingAction) return;
    const { module, action } = pendingAction;
    setModuleStates((prev) => ({
      ...prev,
      [module]: {
        ...prev[module],
        status: action === "isolate" ? "ISOLATED" : action === "safe" ? "SAFE STATE" : "ONLINE",
        mode: action === "isolate" ? "LOCKDOWN" : action === "safe" ? "LOW_POWER" : "NOMINAL"
      }
    }));
    setPendingAction(null);
  };

  const cancelAction = () => {
    setPendingAction(null);
  };

  const filteredAudit = auditLog.filter(item => {
    if (auditFilter === "ALL") return true;
    return item.entity?.toUpperCase().includes(auditFilter);
  });

  return (
    <div className="space-y-6 font-mono animate-in fade-in duration-200">
      
      {/* 1. Header & Navigation Sub-Tabs */}
      <div className="bg-zinc-950/90 border border-white/10 rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" />
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
                CORE ARCHITECTURAL SYSTEMS & AUDIT LEDGER
              </h2>
            </div>
            <p className="text-[11px] text-zinc-400 font-sans pt-0.5">
              Prakash C11 Encoder, Richa C++17 Neural Router, Akashdeep Receiver, and Immutable SHA-256 Audit Log.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            <span className="px-2 py-0.5 rounded bg-amber-950/50 border border-amber-500/30 text-amber-300">
              ◇ PROTOTYPE SYSTEM BENCH
            </span>
          </div>
        </div>

        {/* Sub-Tabs: Core Triad, Module Control, Cryptographic Audit */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          {[
            { id: "triad", label: "TRIAD ARCHITECTURE", icon: Cpu },
            { id: "control", label: "MODULE CONTROLS", icon: Terminal },
            { id: "audit", label: `AUDIT LOG (${auditLog.length})`, icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.25)]"
                    : "bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-white/5"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-cyan-400" : "text-zinc-500"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. SUB-TAB: TRIAD ARCHITECTURE */}
      {activeSubTab === "triad" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Prakash Panel */}
          <div className="bg-zinc-950/90 border border-white/10 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[9px] text-cyan-400 font-bold uppercase tracking-widest">MODULE 01</span>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">PRAKASH ENCODER</h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                {moduleStates.prakash.status}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-zinc-500 text-[10px]">IMPLEMENTATION:</span>
                <span className="text-zinc-200">ISO C11 (Lock-Free)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-zinc-500 text-[10px]">VECTOR ENVELOPE:</span>
                <span className="text-cyan-300 font-semibold">32-Float JSCC (128B)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-zinc-500 text-[10px]">TRIGGER THRESHOLD:</span>
                <span className="text-amber-400">dPhi/dt &gt; 4.2 Rate-Delta</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-zinc-500 text-[10px]">CPU / RING LOAD:</span>
                <span className="text-white">{moduleStates.prakash.load}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-zinc-500 text-[10px]">ACTIVE MEMORY:</span>
                <span className="text-zinc-400">{moduleStates.prakash.memory}</span>
              </div>
            </div>

            <p className="text-[11px] text-zinc-400 font-sans leading-relaxed pt-1">
              Autonomous telemetry compressor operating at upstream Sun-Earth L1 Lagrange point. Compresses raw telemetry into 128-byte JSCC micro-vectors.
            </p>
          </div>

          {/* Richa Panel */}
          <div className="bg-zinc-950/90 border border-white/10 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-widest">MODULE 02</span>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">RICHA ROUTER</h3>
              </div>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                moduleStates.richa.status === "REROUTING"
                  ? "bg-amber-950 text-amber-300 border border-amber-500/40 animate-pulse"
                  : "bg-emerald-950 text-emerald-300 border border-emerald-500/30"
              }`}>
                {moduleStates.richa.status}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-zinc-500 text-[10px]">IMPLEMENTATION:</span>
                <span className="text-zinc-200">ISO C++17 TVG Engine</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-zinc-500 text-[10px]">ALGORITHM:</span>
                <span className="text-indigo-300 font-semibold">Time-Varying Graph Dijkstra</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-zinc-500 text-[10px]">MESH TOPOLOGY:</span>
                <span className="text-white">124 Interplanetary Relays</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-zinc-500 text-[10px]">CPU ROUTING LOAD:</span>
                <span className="text-amber-300 font-semibold">{moduleStates.richa.load}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-zinc-500 text-[10px]">ACTIVE MEMORY:</span>
                <span className="text-zinc-400">{moduleStates.richa.memory}</span>
              </div>
            </div>

            <p className="text-[11px] text-zinc-400 font-sans leading-relaxed pt-1">
              Autonomous contact-graph routing engine. Dispatches BPv7 emergency bundles along optimal geometric laser links while dodging solar blackouts.
            </p>
          </div>

          {/* Akashdeep Panel */}
          <div className="bg-zinc-950/90 border border-white/10 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest">MODULE 03</span>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">AKASHDEEP DECODER</h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                {moduleStates.akashdeep.status}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-zinc-500 text-[10px]">IMPLEMENTATION:</span>
                <span className="text-zinc-200">ISO C++17 / Embedded ML</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-zinc-500 text-[10px]">DECODING MECHANISM:</span>
                <span className="text-emerald-300 font-semibold">Reverse MLP Reconstruction</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-zinc-500 text-[10px]">DESTINATION ASSET:</span>
                <span className="text-white">Mars & Cislunar Terminals</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-zinc-500 text-[10px]">DECODE INFERENCE:</span>
                <span className="text-white">&lt; 0.8 ms</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-zinc-500 text-[10px]">ACTIVE MEMORY:</span>
                <span className="text-zinc-400">{moduleStates.akashdeep.memory}</span>
              </div>
            </div>

            <p className="text-[11px] text-zinc-400 font-sans leading-relaxed pt-1">
              End-point terminal decoder aboard Mars and Artemis Gateway vehicles. Reconstructs multi-channel shockwave telemetry from 32-float vectors.
            </p>
          </div>

        </div>
      )}

      {/* 3. SUB-TAB: MODULE CONTROL BENCH */}
      {activeSubTab === "control" && (
        <div className="bg-zinc-950/90 border border-white/10 rounded-xl p-5 space-y-5">
          <div className="border-b border-white/10 pb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                PROTOTYPE MODULE CONTROL BENCH
              </h3>
              <p className="text-[11px] text-zinc-400 font-sans pt-0.5">
                Simulated flight software controls. Actions require operator review and confirmation.
              </p>
            </div>
            <span className="px-2.5 py-0.5 rounded bg-amber-950/60 border border-amber-500/40 text-amber-300 text-[10px] font-bold">
              CONFIRMATION REQUIRED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: "prakash", name: "PRAKASH C11 ENCODER", state: moduleStates.prakash },
              { id: "richa", name: "RICHA C++17 ROUTER", state: moduleStates.richa },
              { id: "akashdeep", name: "AKASHDEEP DECODER", state: moduleStates.akashdeep }
            ].map((mod) => (
              <div key={mod.id} className="p-4 rounded-xl bg-zinc-900/60 border border-white/10 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-white">{mod.name}</span>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">
                    {mod.state.status}
                  </span>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => handleActionRequest(mod.id, "isolate")}
                    className="w-full py-1.5 px-3 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs uppercase tracking-wider transition-colors text-left flex justify-between items-center"
                  >
                    <span>ISOLATE MODULE</span>
                    <Lock className="w-3 h-3 text-zinc-500" />
                  </button>

                  <button
                    onClick={() => handleActionRequest(mod.id, "safe")}
                    className="w-full py-1.5 px-3 rounded bg-zinc-800 hover:bg-zinc-700 text-amber-300 hover:text-amber-200 text-xs uppercase tracking-wider transition-colors text-left flex justify-between items-center"
                  >
                    <span>PLACE IN SAFE STATE</span>
                    <AlertTriangle className="w-3 h-3 text-amber-500" />
                  </button>

                  <button
                    onClick={() => handleActionRequest(mod.id, "restore")}
                    className="w-full py-1.5 px-3 rounded bg-zinc-800 hover:bg-zinc-700 text-emerald-300 hover:text-emerald-200 text-xs uppercase tracking-wider transition-colors text-left flex justify-between items-center"
                  >
                    <span>RESTORE MODULE</span>
                    <RotateCcw className="w-3 h-3 text-emerald-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Modal / Confirmation Box */}
          {pendingAction && (
            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/60 space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase">
                <AlertTriangle className="w-4 h-4" />
                <span>CONFIRM SIMULATED FLIGHT ACTION: {pendingAction.title}</span>
              </div>
              <p className="text-[11px] text-zinc-300 font-sans">
                You are about to execute a state change on {pendingAction.module.toUpperCase()}. In a production environment, this would alter interplanetary buffer handling. Proceed with simulation state change?
              </p>
              <div className="flex items-center gap-2.5 pt-1">
                <button
                  onClick={confirmAction}
                  className="py-1.5 px-4 rounded bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  CONFIRM & EXECUTE
                </button>
                <button
                  onClick={cancelAction}
                  className="py-1.5 px-4 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs uppercase tracking-wider transition-colors"
                >
                  CANCEL
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* 4. SUB-TAB: CRYPTOGRAPHIC AUDIT LOG */}
      {activeSubTab === "audit" && (
        <div className="bg-zinc-950/90 border border-white/10 rounded-xl p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                IMMUTABLE CRYPTOGRAPHIC AUDIT LOG
              </h3>
              <p className="text-[11px] text-zinc-400 font-sans pt-0.5">
                Every state transition, JSCC vector generation, and TVG reroute sealed with SHA-256 integrity hash.
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1 text-[10px]">
              {["ALL", "PRAKASH", "RICHA", "AKASHDEEP", "OPERATOR"].map((f) => (
                <button
                  key={f}
                  onClick={() => setAuditFilter(f)}
                  className={`px-2 py-0.5 rounded uppercase font-bold transition-colors ${
                    auditFilter === f
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                      : "bg-zinc-900 text-zinc-400 hover:text-white"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 text-[10px] text-zinc-500 uppercase">
                  <th className="py-2 px-3">TIMESTAMP</th>
                  <th className="py-2 px-3">ENTITY</th>
                  <th className="py-2 px-3">ACTION EVENT</th>
                  <th className="py-2 px-3">SHA-256 HASH</th>
                  <th className="py-2 px-3 text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredAudit.map((log, idx) => (
                  <tr key={idx} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="py-2.5 px-3 text-zinc-400 tabular-nums">{log.time}</td>
                    <td className="py-2.5 px-3 text-cyan-300 font-semibold">{log.entity}</td>
                    <td className="py-2.5 px-3 text-white font-medium">{log.action}</td>
                    <td className="py-2.5 px-3 text-zinc-500 text-[10px] font-mono">{log.hash}</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 uppercase">
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
