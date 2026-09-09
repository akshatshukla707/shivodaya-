"use client";

import React, { useState } from "react";
import { Play, RotateCcw, AlertTriangle, WifiOff, Network, Zap, CheckCircle2, ShieldAlert } from "lucide-react";

export default function SimulationAndFaults({
  isDemoRunning,
  demoStep,
  onRunSignatureDemo,
  onResetSimulation,
  isRelayOffline,
  onToggleRelay,
  onTriggerCme,
  onTriggerGap
}) {
  const demoStepTitles = [
    "IDLE",
    "STEP 1: SPACE-WEATHER EVENT (CLASS X-FLARE ERUPTION)",
    "STEP 2: PRAKASH DETECTS & COMPRESSES TELEMETRY (JSCC 32-FLOAT)",
    "STEP 3: CRITICAL ALERT BUNDLE CREATED (BPv7 HEADER)",
    "STEP 4: RICHA EVALUATES TVG DIJKSTRA CONTACT GRAPH",
    "STEP 5: FAULT INJECTED: RELAY-ALPHA ENTERS CME DEAD-ZONE",
    "STEP 6: RICHA AUTONOMOUSLY SELECTS ALTERNATE PATH (RELAY-GAMMA)",
    "STEP 7: ALERT TRAVELS VIA LASER CROSSLINK THROUGH ACTIVE MESH",
    "STEP 8: AKASHDEEP RECEIVES & RECONSTRUCTS VIA REVERSE MLP",
    "STEP 9: MARS MISSION OPERATOR & HUD ALERT DISPLAYED",
    "STEP 10: CREW ACKNOWLEDGES & INITIATES STORM SHELTER",
    "STEP 11: AUDIT LOG SECURED & ALERT FULLY DELIVERED"
  ];

  return (
    <div className="bg-zinc-950/90 border border-amber-500/30 rounded-xl p-4 sm:p-5 space-y-4 font-mono shadow-[0_0_20px_rgba(245,158,11,0.05)]">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-white">
            SIMULATION LAB & FAULT INJECTION RUNNER
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded bg-amber-950/50 border border-amber-500/40 text-amber-300 text-[10px] tracking-wider">
          ◇ OPERATIONAL SIMULATION BENCH
        </span>
      </div>

      {/* Signature 11-Step Demo Runner Box */}
      <div className="p-4 rounded-lg bg-zinc-900/80 border border-white/10 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-zinc-400 font-semibold">
              SIGNATURE DEMONSTRATION
            </div>
            <div className="text-sm font-bold text-white pt-0.5">
              AUTONOMOUS INTERPLANETARY ALERT & REROUTE PIPELINE
            </div>
            <div className="text-[11px] text-zinc-400 font-sans pt-0.5">
              Triggers end-to-end solar storm detection, JSCC encoding, blackout evasion reroute, and crew acknowledgment.
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRunSignatureDemo}
              disabled={isDemoRunning}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider font-mono transition-all flex items-center gap-2 shadow-lg ${
                isDemoRunning
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-wait"
                  : "bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-black shadow-amber-500/20"
              }`}
            >
              {isDemoRunning ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  <span>SIMULATING STEP {demoStep}/11...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>[ TRIGGER RADIATION EVENT ]</span>
                </>
              )}
            </button>

            <button
              onClick={onResetSimulation}
              className="px-3 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/15 text-zinc-300 hover:text-white text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5"
              title="Reset all states to nominal baseline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESET</span>
            </button>
          </div>
        </div>

        {/* Dynamic 11-Step Progress Bar & Title */}
        {isDemoRunning && (
          <div className="space-y-2 pt-2 border-t border-white/10 animate-fadeIn">
            <div className="flex justify-between items-center text-xs">
              <span className="text-amber-300 font-bold tracking-wide">
                {demoStepTitles[demoStep] || "PROCESSING STEP..."}
              </span>
              <span className="text-zinc-400 text-[10px] tabular-nums">
                {demoStep} / 11 COMPLETED
              </span>
            </div>
            <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 via-amber-400 to-emerald-400 transition-all duration-300"
                style={{ width: `${(demoStep / 11) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Individual Fault Injections & Test Probes */}
      <div className="space-y-2 pt-1">
        <div className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold">
          FAULT INJECTION CONTROLS:
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={onToggleRelay}
            className={`p-2.5 rounded text-left border text-xs transition-all space-y-1 ${
              isRelayOffline
                ? "bg-red-950/60 border-red-500/50 text-red-300"
                : "bg-zinc-900 hover:bg-zinc-850 border-white/10 text-zinc-300 hover:text-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold">RELAY FAILURE</span>
              <WifiOff className="w-3 h-3 text-red-400" />
            </div>
            <div className="text-[10px] text-zinc-500">
              {isRelayOffline ? "RELAY-A SEVERED" : "SEVER LINK A"}
            </div>
          </button>

          <button
            onClick={onTriggerCme}
            className="p-2.5 rounded text-left bg-zinc-900 hover:bg-zinc-850 border border-white/10 text-zinc-300 hover:text-white text-xs transition-all space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold">CME DISTURBANCE</span>
              <AlertTriangle className="w-3 h-3 text-amber-400" />
            </div>
            <div className="text-[10px] text-zinc-500">INJECT CONE DEAD-ZONE</div>
          </button>

          <button
            onClick={onTriggerGap}
            className="p-2.5 rounded text-left bg-zinc-900 hover:bg-zinc-850 border border-white/10 text-zinc-300 hover:text-white text-xs transition-all space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold">DELAYED LINK</span>
              <Network className="w-3 h-3 text-cyan-400" />
            </div>
            <div className="text-[10px] text-zinc-500">INJECT BUFFER LATENCY</div>
          </button>

          <button
            onClick={onResetSimulation}
            className="p-2.5 rounded text-left bg-zinc-900 hover:bg-zinc-850 border border-white/10 text-zinc-300 hover:text-white text-xs transition-all space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold">PURGE QUEUE</span>
              <RotateCcw className="w-3 h-3 text-zinc-400" />
            </div>
            <div className="text-[10px] text-zinc-500">RESTORE NOMINAL GRID</div>
          </button>
        </div>
      </div>

    </div>
  );
}
