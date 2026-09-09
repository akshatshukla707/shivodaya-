"use client";

import React from "react";
import { Send, CheckCheck, RefreshCw, FileText, ArrowRight, ShieldCheck, Cpu } from "lucide-react";

export default function DeliveryIntegrityPanel({ isRelayOffline = false }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 font-mono">
      
      {/* 1. Alert Delivery Metrics (Section 23) */}
      <div className="bg-zinc-950/90 border border-white/10 rounded-xl p-4 sm:p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-white">
              ALERT DELIVERY
            </h3>
          </div>
          <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 text-zinc-400 text-[9px]">
            DEMO NETWORK STATE
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs">
          <div className="p-2 rounded bg-zinc-900/60 border border-white/5">
            <div className="text-[10px] text-zinc-500 uppercase">GENERATED</div>
            <div className="font-bold text-white text-base tabular-nums">48</div>
          </div>
          <div className="p-2 rounded bg-zinc-900/60 border border-white/5">
            <div className="text-[10px] text-zinc-500 uppercase">ROUTED</div>
            <div className="font-bold text-cyan-300 text-base tabular-nums">48</div>
          </div>
          <div className="p-2 rounded bg-zinc-900/60 border border-white/5">
            <div className="text-[10px] text-zinc-500 uppercase">RELAYED</div>
            <div className="font-bold text-purple-300 text-base tabular-nums">48</div>
          </div>
          <div className="p-2 rounded bg-zinc-900/60 border border-white/5">
            <div className="text-[10px] text-zinc-500 uppercase">DELIVERED</div>
            <div className="font-bold text-emerald-400 text-base tabular-nums">47</div>
          </div>
          <div className="p-2 rounded bg-zinc-900/60 border border-white/5">
            <div className="text-[10px] text-zinc-500 uppercase">ACKNOWLEDGED</div>
            <div className="font-bold text-emerald-400 text-base tabular-nums">47</div>
          </div>
          <div className="p-2 rounded bg-zinc-900/60 border border-white/5">
            <div className="text-[10px] text-zinc-500 uppercase">PENDING</div>
            <div className="font-bold text-amber-400 text-base tabular-nums">1 IN TRANSIT</div>
          </div>
        </div>

        <div className="text-[9px] text-zinc-500 pt-1 border-t border-white/5">
          Delivery confirmation recorded over BPv7 custodial reports.
        </div>
      </div>

      {/* 2. Data Integrity & Resilience (Section 24) */}
      <div className="bg-zinc-950/90 border border-white/10 rounded-xl p-4 sm:p-5 space-y-3 flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-white">
                DATA INTEGRITY & RESILIENCE
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 text-zinc-400 text-[9px]">
              RESILIENCE STATUS
            </span>
          </div>

          <div className="space-y-2 pt-1 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-400">BUNDLES SENT:</span>
              <span className="text-white font-bold tabular-nums">1,240</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">BUNDLES RECEIVED:</span>
              <span className="text-cyan-300 font-bold tabular-nums">1,234</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">RETRIES REQUIRED:</span>
              <span className="text-amber-300 font-bold tabular-nums">6</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">RECOVERED TRANSFERS:</span>
              <span className="text-emerald-400 font-bold tabular-nums">6</span>
            </div>
          </div>

          {/* Reassembly Diagram */}
          <div className="p-2.5 mt-2 rounded bg-black border border-white/10 space-y-1.5">
            <div className="text-[9px] text-zinc-500 uppercase">TELEMETRY FLOW:</div>
            <div className="flex items-center justify-between text-[10px] text-zinc-300">
              <span className="p-1 rounded bg-zinc-900 border border-white/10">TELEMETRY</span>
              <ArrowRight className="w-3 h-3 text-cyan-400 shrink-0" />
              <span className="p-1 rounded bg-zinc-900 border border-white/10">32-FLOAT</span>
              <ArrowRight className="w-3 h-3 text-cyan-400 shrink-0" />
              <span className="p-1 rounded bg-zinc-900 border border-white/10">RELAY</span>
              <ArrowRight className="w-3 h-3 text-cyan-400 shrink-0" />
              <span className="p-1 rounded bg-zinc-900 border border-white/10">RECONSTRUCT</span>
            </div>
          </div>
        </div>

        <div className="text-[9px] text-zinc-500 font-sans leading-tight pt-1 border-t border-white/5">
          * Honest Engineering Note: Packet drops and link disruptions occur in space environments; resilience relies on BPv7 store-and-forward custody rather than claims of perfection.
        </div>
      </div>

      {/* 3. Intelligent Routing (Section 25) */}
      <div className="bg-zinc-950/90 border border-white/10 rounded-xl p-4 sm:p-5 space-y-3 flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-white">
                INTELLIGENT NETWORK
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded bg-amber-950/40 border border-amber-500/30 text-amber-400 text-[9px]">
              ◇ SHIVODAYA SIMULATION
            </span>
          </div>

          <div className="space-y-2 pt-1 text-xs">
            <div>
              <div className="text-[10px] text-zinc-500 uppercase">MODEL STATUS:</div>
              <div className="font-bold text-emerald-400 text-xs">● ACTIVE (TVG CONTACT GRAPH ENGINE)</div>
            </div>
            <div>
              <div className="text-[10px] text-zinc-500 uppercase">ACTIVE ROUTE:</div>
              <div className="font-bold text-white text-xs truncate">
                {isRelayOffline
                  ? "PRAKASH → RELAY-GAMMA → RELAY-BETA → MARS"
                  : "PRAKASH → RELAY-ALPHA → RELAY-BETA → MARS"}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-zinc-500 uppercase">DECISION LOGIC:</div>
              <div className="text-zinc-300 text-[11px] font-sans">
                {isRelayOffline
                  ? "Link degradation detected on Relay-A. Dijkstra cost recalculated to select Relay-Gamma."
                  : "Direct line-of-sight optimal. Lowest contact latency pathway selected."}
              </div>
            </div>
          </div>

          {/* Decision Pipeline */}
          <div className="p-2 mt-2 rounded bg-black border border-white/10 flex items-center justify-between text-[9px] text-zinc-400">
            <span className="font-bold text-cyan-300">OBSERVE</span>
            <ArrowRight className="w-2.5 h-2.5 text-zinc-600" />
            <span className="font-bold text-purple-300">EVALUATE</span>
            <ArrowRight className="w-2.5 h-2.5 text-zinc-600" />
            <span className="font-bold text-amber-300">CHOOSE</span>
            <ArrowRight className="w-2.5 h-2.5 text-zinc-600" />
            <span className="font-bold text-emerald-300">ROUTE</span>
          </div>
        </div>

        <div className="text-[9px] text-zinc-500 pt-1 border-t border-white/5">
          Decision confidence: Modeled dynamic link feasibility.
        </div>
      </div>

    </div>
  );
}
