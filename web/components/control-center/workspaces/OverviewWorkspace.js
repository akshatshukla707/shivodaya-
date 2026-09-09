"use client";

import React from "react";
import { 
  Sun, ShieldAlert, AlertTriangle, Radio, Network, CheckCircle2, 
  ArrowRight, Play, RotateCcw, Clock, ExternalLink 
} from "lucide-react";
import AlertPipeline from "../AlertPipeline";
import MissionNetworkMap from "../MissionNetworkMap";

export default function OverviewWorkspace({
  radEnv,
  alerts = [],
  streamEvents = [],
  activeStage = 0,
  isDemoRunning = false,
  isRelayOffline = false,
  onRunSignatureDemo,
  onResetSimulation,
  onInspectItem,
  onSelectWorkspace,
  lastUpdated
}) {
  const latestEvents = streamEvents.slice(0, 4);

  return (
    <div className="space-y-6 font-mono animate-in fade-in duration-200">
      
      {/* 1. TOP SUMMARY METRICS BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl bg-zinc-950/90 border border-white/10 space-y-1">
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider">SOLAR ACTIVITY</div>
          <div className="text-lg font-bold text-amber-400 truncate">{radEnv.scale_r || "R0 - NONE"}</div>
          <div className="text-[10px] text-zinc-400 truncate">{radEnv.background_flux || "1.42e-6 W/m²"}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-950/90 border border-white/10 space-y-1">
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider">RADIATION STATUS</div>
          <div className={`text-lg font-bold truncate ${
            radEnv.status === "CRITICAL" ? "text-red-400" : radEnv.status === "HIGH" ? "text-amber-400" : "text-emerald-400"
          }`}>
            {radEnv.status || "NOMINAL"}
          </div>
          <div className="text-[10px] text-zinc-400 truncate">{radEnv.scale_s || "S0 - NONE"}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-950/90 border border-white/10 space-y-1">
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider">ACTIVE ALERTS</div>
          <div className={`text-lg font-bold ${alerts.length > 0 ? "text-red-400" : "text-white"}`}>
            {alerts.length}
          </div>
          <div className="text-[10px] text-zinc-400 truncate">{alerts[0]?.type || "All Clear"}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-950/90 border border-white/10 space-y-1">
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider">MISSIONS</div>
          <div className="text-lg font-bold text-white">4 ACTIVE</div>
          <div className="text-[10px] text-zinc-400 truncate">Mars · Moon · Sentry</div>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-950/90 border border-white/10 space-y-1">
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider">NETWORK MESH</div>
          <div className="text-lg font-bold text-cyan-400">124 RELAYS</div>
          <div className="text-[10px] text-emerald-400 truncate">{isRelayOffline ? "● REROUTE ACTIVE" : "● LINKS NOMINAL"}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-950/90 border border-white/10 space-y-1">
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider">LAST SYNC</div>
          <div className="text-sm font-bold text-zinc-300 truncate">{lastUpdated ? lastUpdated.split(" ")[1] || "LIVE" : "LIVE"}</div>
          <div className="text-[10px] text-zinc-500 truncate">NOAA / NASA Feed</div>
        </div>
      </div>

      {/* 2. PRIMARY OPERATIONAL ROW: SPACE-WEATHER STATUS (LEFT) + ACTIVE ALERTS (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Space-Weather Summary Card */}
        <div className="lg:col-span-5 bg-zinc-950/90 border border-white/10 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                SPACE-WEATHER CONTEXT
              </h3>
            </div>
            <button
              onClick={() => onSelectWorkspace("radiation")}
              className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 uppercase tracking-wider"
            >
              Expand Radiation <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-white/5 space-y-1">
              <div className="text-[9px] text-zinc-500 uppercase">RADIO BLACKOUT</div>
              <div className="text-sm font-bold text-white">{radEnv.scale_r?.split(" - ")[0] || "R0"}</div>
              <div className="text-[9px] text-zinc-400">{radEnv.scale_r?.split(" - ")[1] || "NONE"}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-white/5 space-y-1">
              <div className="text-[9px] text-zinc-500 uppercase">RADIATION STORM</div>
              <div className={`text-sm font-bold ${radEnv.status === "CRITICAL" ? "text-red-400" : "text-white"}`}>
                {radEnv.scale_s?.split(" - ")[0] || "S0"}
              </div>
              <div className="text-[9px] text-zinc-400">{radEnv.scale_s?.split(" - ")[1] || "NONE"}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-white/5 space-y-1">
              <div className="text-[9px] text-zinc-500 uppercase">GEOMAGNETIC</div>
              <div className="text-sm font-bold text-white">{radEnv.scale_g?.split(" - ")[0] || "G1"}</div>
              <div className="text-[9px] text-zinc-400">{radEnv.scale_g?.split(" - ")[1] || "MINOR"}</div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-zinc-900/60 border border-white/5 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-500 uppercase text-[10px]">SOLAR X-RAY FLUX:</span>
              <span className="text-white font-semibold">{radEnv.background_flux}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500 uppercase text-[10px]">PROTON FLUX (≥10 MeV):</span>
              <span className="text-cyan-300 font-semibold">{radEnv.proton_activity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500 uppercase text-[10px]">DATA PROVENANCE:</span>
              <span className="text-emerald-400 font-semibold">NOAA SWPC / GOES-18 Primary</span>
            </div>
          </div>
        </div>

        {/* Right: Active Alerts Card */}
        <div className="lg:col-span-7 bg-zinc-950/90 border border-white/10 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                ACTIVE MISSION & SPACE-WEATHER ALERTS
              </h3>
            </div>
            <button
              onClick={() => onSelectWorkspace("alerts")}
              className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 uppercase tracking-wider"
            >
              Manage All ({alerts.length}) <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {alerts.length === 0 ? (
              <div className="p-4 rounded-lg bg-zinc-900/40 border border-white/5 text-center text-zinc-500 text-xs">
                No active radiation alerts. Deep space mesh operating under nominal baseline conditions.
              </div>
            ) : (
              alerts.slice(0, 3).map((al, idx) => (
                <div
                  key={idx}
                  onClick={() => onInspectItem && onInspectItem({ ...al, type: "alert" })}
                  className="p-3 rounded-lg bg-zinc-900/80 hover:bg-zinc-850 border border-white/10 hover:border-cyan-400/50 cursor-pointer transition-all flex items-start justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                        al.severity === "CRITICAL" ? "bg-red-950/80 text-red-300 border border-red-500/40 animate-pulse" : "bg-amber-950/80 text-amber-300 border border-amber-500/40"
                      }`}>
                        {al.severity}
                      </span>
                      <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {al.title}
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-400 font-sans leading-tight">
                      {al.desc || al.impact}
                    </div>
                    <div className="text-[9px] text-zinc-500">
                      TARGET: <span className="text-zinc-300 font-semibold">{al.mission}</span> · TIME: {al.time}
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-cyan-400 shrink-0 mt-1" />
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* 3. MIDDLE SECTION: MISSION NETWORK + SHIVODAYA ALERT PIPELINE */}
      <div className="space-y-5">
        <AlertPipeline activeStage={activeStage} isSimulating={isDemoRunning} />
        <MissionNetworkMap
          isRelayOffline={isRelayOffline}
          activeMission="MARS-01"
        />
      </div>

      {/* 4. BOTTOM SECTION: QUICK SIMULATION TRIGGER + RECENT EVENT STREAM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Quick Simulation Trigger Box */}
        <div className="lg:col-span-5 bg-zinc-950/90 border border-amber-500/30 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                SIGNATURE OPERATIONAL DEMO
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded bg-amber-950/50 border border-amber-500/30 text-amber-300 text-[9px]">
              11-STEP CHAIN
            </span>
          </div>

          <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
            Simulate an end-to-end event: Solar Class X eruption, Prakash JSCC compression, Relay Alpha blackout, Richa autonomous reroute, and Mars crew shelter ingress.
          </p>

          <div className="flex items-center gap-2.5 pt-1">
            <button
              onClick={onRunSignatureDemo}
              disabled={isDemoRunning}
              className={`flex-1 py-2.5 px-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                isDemoRunning
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-wait"
                  : "bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20"
              }`}
            >
              {isDemoRunning ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  <span>SIMULATION IN PROGRESS...</span>
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
              className="py-2.5 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/15 text-zinc-300 hover:text-white text-xs uppercase tracking-wider transition-colors"
              title="Reset baseline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Latest 4 Events Stream */}
        <div className="lg:col-span-7 bg-zinc-950/90 border border-white/10 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                LIVE EVENT STREAM (LATEST)
              </h3>
            </div>
            <button
              onClick={() => onSelectWorkspace("systems")}
              className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 uppercase tracking-wider"
            >
              View Full Audit <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-1.5 max-h-40 overflow-y-auto text-xs">
            {latestEvents.map((ev, i) => (
              <div key={i} className="p-2 rounded bg-zinc-900/60 border border-white/5 flex items-start gap-2.5">
                <span className="text-[10px] text-zinc-500 tabular-nums shrink-0 mt-0.5">{ev.time}</span>
                <span className={`px-1 rounded text-[9px] font-bold shrink-0 mt-0.5 ${
                  ev.level === "CRITICAL" ? "bg-red-950/80 text-red-300 border border-red-500/30" : ev.level === "WARN" ? "bg-amber-950/80 text-amber-300 border border-amber-500/30" : "bg-zinc-800 text-zinc-300"
                }`}>
                  {ev.level}
                </span>
                <span className="text-zinc-400 text-[11px] font-mono leading-tight">
                  <strong className="text-white">[{ev.source}]</strong> {ev.message}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
