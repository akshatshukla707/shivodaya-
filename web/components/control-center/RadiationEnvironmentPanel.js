"use client";

import React from "react";
import { ShieldAlert, ShieldCheck, AlertOctagon, Activity, Radio, Info, Zap } from "lucide-react";

export default function RadiationEnvironmentPanel({
  radStatus = "NOMINAL",
  scaleR = "R0 - NONE",
  scaleS = "S0 - NONE",
  scaleG = "G1 - MINOR",
  backgroundFlux = "1.42e-6 W/m² (C1.4)",
  protonActivity = "1.09 pfu (>=10 MeV)",
  dataStatus = "LIVE",
  dataSource = "NOAA / SWPC",
  simulatedAlertActive = false
}) {
  // If simulation triggered an alert, escalate status for the demo
  const effectiveStatus = simulatedAlertActive ? "CRITICAL" : radStatus;

  const getStatusColor = (status) => {
    switch (status) {
      case "CRITICAL":
        return "text-red-400 bg-red-950/60 border-red-500/50";
      case "HIGH":
        return "text-orange-400 bg-orange-950/60 border-orange-500/50";
      case "ELEVATED":
        return "text-amber-400 bg-amber-950/60 border-amber-500/50";
      default:
        return "text-emerald-400 bg-emerald-950/60 border-emerald-500/50";
    }
  };

  return (
    <div className="bg-zinc-950/90 border border-white/10 rounded-xl p-4 sm:p-5 space-y-4 font-mono">
      
      {/* Panel Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-white">
            RADIATION ENVIRONMENT
          </h2>
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="px-2 py-0.5 rounded bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 tracking-wider">
            SOURCE: {dataSource}
          </span>
          <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/15 text-white tracking-widest">
            ● {dataStatus}
          </span>
        </div>
      </div>

      {/* Main Status Badge & Scientific Assessment */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        
        {/* Current Radiation Status */}
        <div className={`p-4 rounded-lg border flex flex-col justify-between ${getStatusColor(effectiveStatus)}`}>
          <div className="text-[10px] uppercase tracking-widest text-zinc-400">
            CURRENT THREAT LEVEL
          </div>
          <div className="text-2xl font-bold tracking-wider py-1 flex items-center gap-2">
            {effectiveStatus === "NOMINAL" ? (
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            ) : (
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            )}
            {effectiveStatus}
          </div>
          <div className="text-[10px] text-zinc-400 font-sans">
            {effectiveStatus === "NOMINAL"
              ? "Background cosmic ray flux within baseline safety limits."
              : effectiveStatus === "CRITICAL"
              ? "Solar proton / X-ray event active. Deep space crew shelter protocol advised."
              : "Flux escalation detected. Autonomous sentry nodes tracking propagation."}
          </div>
        </div>

        {/* NOAA Space Weather Scales (R, S, G) */}
        <div className="p-3.5 rounded-lg bg-zinc-900/80 border border-white/10 space-y-2">
          <div className="text-[10px] text-zinc-400 uppercase tracking-widest flex items-center justify-between">
            <span>NOAA SCALES</span>
            <span className="text-[9px] text-zinc-500">R / S / G</span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">RADIO BLACKOUT:</span>
              <span className="font-bold text-cyan-300">{scaleR}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">SOLAR RADIATION:</span>
              <span className="font-bold text-amber-300">{scaleS}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">GEOMAGNETIC:</span>
              <span className="font-bold text-white">{scaleG}</span>
            </div>
          </div>
          <div className="text-[9px] text-zinc-500 border-t border-white/5 pt-1">
            Derived from operational SWPC scales.
          </div>
        </div>

        {/* Particle & Flux Indicators */}
        <div className="p-3.5 rounded-lg bg-zinc-900/80 border border-white/10 space-y-2">
          <div className="text-[10px] text-zinc-400 uppercase tracking-widest">
            FLUX SENSORS (L1 / GEO)
          </div>
          <div className="space-y-1 text-xs">
            <div>
              <div className="text-[10px] text-zinc-500">SOLAR X-RAY FLUX:</div>
              <div className="font-bold text-white truncate">{backgroundFlux}</div>
            </div>
            <div>
              <div className="text-[10px] text-zinc-500">PROTON FLUX (&ge;10 MeV):</div>
              <div className="font-bold text-cyan-300">{protonActivity}</div>
            </div>
          </div>
          <div className="text-[9px] text-zinc-500 border-t border-white/5 pt-1">
            Live GOES-18 Primary Ingestion.
          </div>
        </div>

        {/* Shivodaya Latency Advantage */}
        <div className="p-3.5 rounded-lg bg-cyan-950/20 border border-cyan-500/20 space-y-1.5">
          <div className="text-[10px] text-cyan-400 uppercase tracking-widest flex items-center gap-1">
            <Zap className="w-3 h-3 text-cyan-400" />
            SHIVODAYA TIME IMPACT
          </div>
          <div className="text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-zinc-400">EARTH-MARS RELAY:</span>
              <span className="text-red-400 font-semibold line-through">60–1440 min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">AUTONOMOUS MESH:</span>
              <span className="text-emerald-400 font-bold">5–20 min</span>
            </div>
            <div className="flex justify-between text-[11px] pt-0.5 border-t border-cyan-500/20">
              <span className="text-cyan-300">WARNING ADVANCE:</span>
              <span className="text-white font-bold">+3.8 Hours</span>
            </div>
          </div>
          <div className="text-[9px] text-zinc-500">
            ◇ SHIVODAYA MODELED ESTIMATE
          </div>
        </div>

      </div>

    </div>
  );
}
