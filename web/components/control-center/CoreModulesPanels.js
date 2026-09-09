"use client";

import React, { useState } from "react";
import { Cpu, Network, ShieldAlert, Terminal, ChevronDown, ChevronUp, CheckCircle2, ArrowRight } from "lucide-react";

export default function CoreModulesPanels({
  isRelayOffline = false,
  alertAcknowledged = true
}) {
  const [showPrakashTech, setShowPrakashTech] = useState(false);
  const [showRichaTech, setShowRichaTech] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 font-mono">
      
      {/* 1. PRAKASH (Section 16) */}
      <div className="bg-zinc-950/90 border border-white/10 rounded-xl p-4 sm:p-5 space-y-3 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-white">
                PRAKASH // ENCODER
              </h3>
            </div>
            <span className="text-[9px] text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/30">
              ipn:1.1
            </span>
          </div>

          <div className="text-[11px] text-zinc-400 font-sans pt-1">
            Real-time solar telemetry acquisition & JSCC 32-float linear projection vector encoding.
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-3 text-xs">
            <div className="p-2 rounded bg-zinc-900/80 border border-white/5">
              <div className="text-[10px] text-zinc-500 uppercase">EVENTS INGESTED</div>
              <div className="font-bold text-white text-base tabular-nums">1,482</div>
            </div>
            <div className="p-2 rounded bg-zinc-900/80 border border-white/5">
              <div className="text-[10px] text-zinc-500 uppercase">EVENTS PROCESSED</div>
              <div className="font-bold text-cyan-300 text-base tabular-nums">1,482</div>
            </div>
            <div className="p-2 rounded bg-zinc-900/80 border border-white/5">
              <div className="text-[10px] text-zinc-500 uppercase">ALERTS GENERATED</div>
              <div className="font-bold text-amber-300 text-base tabular-nums">14</div>
            </div>
            <div className="p-2 rounded bg-zinc-900/80 border border-white/5">
              <div className="text-[10px] text-zinc-500 uppercase">QUEUE STATUS</div>
              <div className="font-bold text-emerald-400 text-base">0 PENDING</div>
            </div>
          </div>
        </div>

        {/* Technical Details Toggle */}
        <div className="pt-2 border-t border-white/10 space-y-2">
          <button
            onClick={() => setShowPrakashTech(!showPrakashTech)}
            className="w-full flex items-center justify-between text-[10px] text-zinc-400 hover:text-white uppercase tracking-wider py-1"
          >
            <span>{showPrakashTech ? "HIDE ARCHITECTURAL SPECS" : "VIEW TECHNICAL DETAILS"}</span>
            {showPrakashTech ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {showPrakashTech && (
            <div className="p-2.5 rounded bg-black border border-white/10 text-[10px] text-zinc-400 space-y-1 font-mono animate-fadeIn">
              <div>&bull; Ingestion: Memory-mapped (mmap) 5-stream lock-free ring buffer</div>
              <div>&bull; Hardware: 64-byte L1 CPU cache-line alignment</div>
              <div>&bull; Embedding: 32-float JSCC linear projection vector (128 bytes)</div>
              <div>&bull; Header: Pre-formatted CCSDS / BPv7 primary block</div>
            </div>
          )}

          <div className="text-[9px] text-zinc-500 flex justify-between">
            <span>SOURCE: SHIVODAYA PRAKASH</span>
            <span>● OPERATIONAL</span>
          </div>
        </div>
      </div>

      {/* 2. RICHA (Section 17) */}
      <div className="bg-zinc-950/90 border border-white/10 rounded-xl p-4 sm:p-5 space-y-3 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-white">
                RICHA // NEURAL ROUTER
              </h3>
            </div>
            <span className="text-[9px] text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/30">
              ipn:2.1
            </span>
          </div>

          <div className="text-[11px] text-zinc-400 font-sans pt-1">
            100-node Contact Graph TVG Dijkstra routing with autonomous BFS blackout evasion.
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-3 text-xs">
            <div className="p-2 rounded bg-zinc-900/80 border border-white/5">
              <div className="text-[10px] text-zinc-500 uppercase">AVAILABLE RELAYS</div>
              <div className="font-bold text-white text-base tabular-nums">12 NODES</div>
            </div>
            <div className="p-2 rounded bg-zinc-900/80 border border-white/5">
              <div className="text-[10px] text-zinc-500 uppercase">FAILED LINKS</div>
              <div className={`font-bold text-base tabular-nums ${isRelayOffline ? "text-red-400" : "text-emerald-400"}`}>
                {isRelayOffline ? "1 LINK SEVERED" : "0 LINKS"}
              </div>
            </div>
            <div className="p-2 rounded bg-zinc-900/80 border border-white/5">
              <div className="text-[10px] text-zinc-500 uppercase">ACTIVE REROUTES</div>
              <div className="font-bold text-cyan-300 text-base tabular-nums">
                {isRelayOffline ? "1 ACTIVE" : "0"}
              </div>
            </div>
            <div className="p-2 rounded bg-zinc-900/80 border border-white/5">
              <div className="text-[10px] text-zinc-500 uppercase">ROUTING LATENCY</div>
              <div className="font-bold text-emerald-400 text-base tabular-nums">3.8 ms</div>
            </div>
          </div>
        </div>

        {/* Dynamic Mini Topology Representation */}
        <div className="pt-2 border-t border-white/10 space-y-2">
          <div className="p-2 rounded bg-black border border-white/10 text-[10px] text-zinc-300 space-y-1 font-mono">
            <div className="text-[9px] text-zinc-500 uppercase">DYNAMIC ROUTE COMPUTATION:</div>
            <div className="text-cyan-300 font-bold truncate">
              {isRelayOffline
                ? "PRAKASH → [RELAY-C ALT] → RELAY-B → MARS"
                : "PRAKASH → RELAY-A → RELAY-B → MARS"}
            </div>
            {isRelayOffline && (
              <div className="text-[9px] text-amber-400">
                &bull; RELAY-A UNREACHABLE → TVG DIJKSTRA SWITCHED TO PATH-02
              </div>
            )}
          </div>

          <div className="text-[9px] text-zinc-500 flex justify-between">
            <span>PERSISTENCE: SQLITE WAL</span>
            <span className="text-amber-400">◇ SHIVODAYA SIMULATION</span>
          </div>
        </div>
      </div>

      {/* 3. AKASHDEEP (Section 18) */}
      <div className="bg-zinc-950/90 border border-white/10 rounded-xl p-4 sm:p-5 space-y-3 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-white">
                AKASHDEEP // MISSION INTERFACE
              </h3>
            </div>
            <span className="text-[9px] text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/30">
              ipn:3.1
            </span>
          </div>

          <div className="text-[11px] text-zinc-400 font-sans pt-1">
            Mars terminal semantic decoder reconstructing threat telemetry from 32-float vectors.
          </div>

          {/* Operator / Astronaut HUD View */}
          <div className="mt-3 p-3 rounded-lg bg-black border border-red-500/30 space-y-2 text-xs">
            <div className="flex justify-between items-center text-[10px] text-zinc-400 border-b border-white/10 pb-1">
              <span className="text-red-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                RADIATION ALERT DISPATCH
              </span>
              <span className="tabular-nums">12:46 UTC</span>
            </div>

            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-zinc-400">SEVERITY:</span>
                <span className="font-bold text-amber-300">HIGH // CLASS M4.5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">EST. SHOCK ARRIVAL:</span>
                <span className="font-bold text-white">T + 18.4 HOURS</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">CREW ACTION:</span>
                <span className="font-bold text-emerald-400">STORM SHELTER PROTOCOL</span>
              </div>
            </div>

            <div className="pt-1 border-t border-white/10 flex items-center justify-between text-[10px]">
              <span className="text-zinc-500">ACK STATUS:</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                {alertAcknowledged ? "ACKNOWLEDGED BY COMMANDER" : "PENDING CONFIRMATION"}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-white/10 flex justify-between text-[9px] text-zinc-500">
          <span>DECODER: REVERSE MLP MATRIX</span>
          <span className="text-amber-400">◇ SHIVODAYA SIMULATION</span>
        </div>
      </div>

    </div>
  );
}
