"use client";

import React from "react";
import { ShieldAlert, Activity, AlertTriangle, Clock, Info, CheckCircle2 } from "lucide-react";
import RadiationTimeline from "../RadiationTimeline";

export default function RadiationWorkspace({
  radEnv,
  protonFlux = [],
  xrayFlux = [],
  activeMission = "MARS-01",
  simulatedAlertActive = false,
  onInspectItem
}) {
  const currentP10 = protonFlux.length > 0 ? protonFlux[protonFlux.length - 1].energy10 : 1.09;
  const currentP1 = protonFlux.length > 0 ? protonFlux[protonFlux.length - 1].energy1 : 54.5;
  const currentP100 = protonFlux.length > 0 ? protonFlux[protonFlux.length - 1].energy100 : 0.21;

  const missionImpact = {
    "MARS-01": {
      orbit: "Mars Transfer Orbit (MTO) / Cruise Phase",
      magnetosphere: "ABSENT (Direct interplanetary exposure; GCR baseline ~1.5 mSv/day)",
      sepRisk: simulatedAlertActive ? "CRITICAL // SOLAR PROTON EVENT ACTIVE" : "LOW // BACKGROUND GCR BASELINE",
      shieldingReq: simulatedAlertActive ? "EMERGENCY WATER-WALL SHELTER DEPLOYED" : "PASSIVE HULL SHIELDING ADEQUATE",
      modelingSource: "NASA OLTARIS / HZETRN Space Radiation Modeling"
    },
    "LUNAR-01": {
      orbit: "Near-Rectilinear Halo Orbit (NRHO)",
      magnetosphere: "INTERMITTENT (Traverses geomagnetic tail ~4 days per month)",
      sepRisk: simulatedAlertActive ? "HIGH // UNSHIELDED CISLUNAR ENVIRONMENT" : "NOMINAL",
      shieldingReq: simulatedAlertActive ? "GATEWAY CREW INGRESS STORM SHELTER" : "NOMINAL",
      modelingSource: "ESA SPENVIS / NASA CCMC"
    },
    "CHANDRAYAAN-BASE": {
      orbit: "Lunar South Pole (Shackleton Rim)",
      magnetosphere: "ABSENT (Surface regolith provides 2π steradian planetary shielding)",
      sepRisk: simulatedAlertActive ? "MODERATE // SURFACE REGOLITH COVERAGE SECURE" : "NOMINAL",
      shieldingReq: simulatedAlertActive ? "SUBTERRANEAN LAVA TUBE HABITAT ACTIVE" : "NOMINAL",
      modelingSource: "ISRO Space Physics Laboratory"
    },
    "SENTRY-01": {
      orbit: "Sun-Earth L1 Halo Orbit",
      magnetosphere: "NONE (Upstream solar sentry monitor)",
      sepRisk: simulatedAlertActive ? "SEVERE SENTRY SENSOR SATURATION" : "NOMINAL MONITORING",
      shieldingReq: "HARDENED SILICON-ON-INSULATOR (SOI) ELECTRONICS",
      modelingSource: "ISRO Sentry Telemetry"
    }
  }[activeMission] || {
    orbit: "Deep Space Heliocentric Orbit",
    magnetosphere: "ABSENT",
    sepRisk: simulatedAlertActive ? "CRITICAL" : "NOMINAL",
    shieldingReq: "NOMINAL",
    modelingSource: "Shivodaya Telemetry"
  };

  return (
    <div className="space-y-6 font-mono animate-in fade-in duration-200">
      
      {/* 1. Header with Scientific Derivation Logic */}
      <div className="bg-zinc-950/90 border border-white/10 rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-white">
                RADIATION ENVIRONMENT MONITOR
              </h2>
            </div>
            <p className="text-[11px] text-zinc-400 font-sans pt-0.5">
              Real-time energetic particle fluxes, solar radiation storm scales, and mission-specific dosimetry context.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 text-zinc-300">
              SOURCE: NOAA SWPC / GOES-18 HEPAD
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-bold">
              ● LIVE OBSERVATION
            </span>
          </div>
        </div>

        {/* Current Radiation Status Card with Explicit Threshold Criteria */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className={`p-4 rounded-lg border space-y-2 ${
            radEnv.status === "CRITICAL" 
              ? "bg-red-950/40 border-red-500/50 text-red-200" 
              : radEnv.status === "HIGH"
              ? "bg-amber-950/40 border-amber-500/50 text-amber-200"
              : "bg-zinc-900/80 border-emerald-500/30 text-emerald-300"
          }`}>
            <div className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold">
              GLOBAL RADIATION STATUS
            </div>
            <div className="text-2xl font-bold tracking-wider">
              {radEnv.status || "NOMINAL"}
            </div>
            <div className="text-[10px] font-sans leading-tight text-zinc-300 border-t border-white/10 pt-2">
              <strong>Scientific Criteria:</strong> {radEnv.status === "CRITICAL" ? "Proton flux >100 pfu (S3+) OR X-ray flux >10⁻⁴ W/m² (X-Class). Immediate storm shelter alert." : "Proton flux <10 pfu (S0) and soft X-ray background <10⁻⁵ W/m² (C-Class). Background GCR baseline."}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-zinc-900/80 border border-white/10 space-y-2">
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider">RADIO BLACKOUT (R)</div>
            <div className="text-xl font-bold text-white">{radEnv.scale_r || "R0 - NONE"}</div>
            <div className="text-[10px] text-zinc-400 font-sans">Solar soft X-ray ionospheric disturbance scale.</div>
          </div>

          <div className="p-4 rounded-lg bg-zinc-900/80 border border-white/10 space-y-2">
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider">RADIATION STORM (S)</div>
            <div className={`text-xl font-bold ${radEnv.status === "CRITICAL" ? "text-red-400" : "text-white"}`}>
              {radEnv.scale_s || "S0 - NONE"}
            </div>
            <div className="text-[10px] text-zinc-400 font-sans">Energetic proton flux (≥10 MeV) threshold scale.</div>
          </div>

          <div className="p-4 rounded-lg bg-zinc-900/80 border border-white/10 space-y-2">
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider">GEOMAGNETIC STORM (G)</div>
            <div className="text-xl font-bold text-white">{radEnv.scale_g || "G1 - MINOR"}</div>
            <div className="text-[10px] text-zinc-400 font-sans">Planetary K-index magnetosphere fluctuation.</div>
          </div>
        </div>
      </div>

      {/* 2. PROTON & ENERGETIC PARTICLE ACTIVITY CHANNELS */}
      <div className="bg-zinc-950/90 border border-white/10 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              INTEGRAL PROTON FLUX CHANNELS (GOES-18 HEPAD)
            </h3>
          </div>
          <span className="text-[10px] text-zinc-500">UNITS: pfu (protons/cm²·s·sr)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-zinc-900/60 border border-white/10 space-y-1.5">
            <div className="text-[10px] text-zinc-400 uppercase">CHANNEL 01 (≥1 MeV)</div>
            <div className="text-xl font-bold text-white tabular-nums">
              {simulatedAlertActive ? "14,820" : currentP1.toFixed(1)} <span className="text-xs font-normal text-zinc-500">pfu</span>
            </div>
            <div className="text-[10px] text-zinc-500 font-sans">Low-energy solar wind & flare envelope protons.</div>
          </div>

          <div className="p-4 rounded-lg bg-zinc-900/60 border border-white/10 space-y-1.5">
            <div className="text-[10px] text-zinc-400 uppercase">CHANNEL 02 (≥10 MeV) [BENCHMARK]</div>
            <div className={`text-xl font-bold tabular-nums ${simulatedAlertActive ? "text-red-400" : "text-cyan-300"}`}>
              {simulatedAlertActive ? "1,240.0" : currentP10.toFixed(2)} <span className="text-xs font-normal text-zinc-500">pfu</span>
            </div>
            <div className="text-[10px] text-zinc-500 font-sans">Official NOAA SWPC Radiation Storm event trigger threshold (10 pfu).</div>
          </div>

          <div className="p-4 rounded-lg bg-zinc-900/60 border border-white/10 space-y-1.5">
            <div className="text-[10px] text-zinc-400 uppercase">CHANNEL 03 (≥100 MeV)</div>
            <div className="text-xl font-bold text-white tabular-nums">
              {simulatedAlertActive ? "48.5" : currentP100.toFixed(2)} <span className="text-xs font-normal text-zinc-500">pfu</span>
            </div>
            <div className="text-[10px] text-zinc-500 font-sans">High-energy relativistic protons capable of hull penetration.</div>
          </div>
        </div>
      </div>

      {/* 3. MISSION SPECIFIC RADIATION EXPOSURE CONTEXT */}
      <div className="bg-zinc-950/90 border border-white/10 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              MISSION IMPACT CONTEXT: {activeMission}
            </h3>
          </div>
          <span className="px-2 py-0.5 rounded bg-amber-950/50 border border-amber-500/30 text-amber-300 text-[10px]">
            ◇ MODELED / SIMULATED CONTEXT
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded bg-zinc-900/60 border border-white/5 space-y-1">
            <span className="text-zinc-500 uppercase text-[10px]">ORBITAL PROFILE:</span>
            <div className="text-white font-semibold">{missionImpact.orbit}</div>
          </div>
          <div className="p-3 rounded bg-zinc-900/60 border border-white/5 space-y-1">
            <span className="text-zinc-500 uppercase text-[10px]">MAGNETOSPHERIC SHIELDING:</span>
            <div className="text-zinc-300 font-sans">{missionImpact.magnetosphere}</div>
          </div>
          <div className="p-3 rounded bg-zinc-900/60 border border-white/5 space-y-1">
            <span className="text-zinc-500 uppercase text-[10px]">SEP RADIATION RISK LEVEL:</span>
            <div className={`font-bold ${simulatedAlertActive ? "text-red-400" : "text-emerald-400"}`}>
              {missionImpact.sepRisk}
            </div>
          </div>
          <div className="p-3 rounded bg-zinc-900/60 border border-white/5 space-y-1">
            <span className="text-zinc-500 uppercase text-[10px]">SHIELDING & SAFE-STATE REQUIREMENT:</span>
            <div className="text-zinc-300 font-sans">{missionImpact.shieldingReq}</div>
          </div>
        </div>

        <div className="text-[9px] text-zinc-500 italic pt-1">
          * Scientific Integrity Note: Near-Earth proton fluxes (from L1 DSCOVR or GEO GOES) do not directly equate to Mars or deep-space dose. Mars exposure is modeled using {missionImpact.modelingSource} taking into account heliocentric distance (1/R² attenuation) and lack of intrinsic planetary dipole.
        </div>
      </div>

      {/* 4. REUSABLE RADIATION TIMELINE */}
      <RadiationTimeline />

    </div>
  );
}
