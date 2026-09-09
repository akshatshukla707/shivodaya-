"use client";

import React, { useState } from "react";
import { Bell, ShieldAlert, AlertTriangle, Info, CheckCircle2, Clock, Filter, ExternalLink } from "lucide-react";

export default function AlertsWorkspace({
  alerts = [],
  simulatedAlertActive = false,
  alertAcknowledged = true,
  onAcknowledgeAlert,
  onInspectItem
}) {
  const [filterSeverity, setFilterSeverity] = useState("all"); // "all", "CRITICAL", "HIGH", "WARNING", "INFO", "ACKNOWLEDGED"

  // Base persistent & simulated alerts
  const defaultAlerts = [
    {
      id: "ALT-2026-0908-01",
      time: "13:54:10 UTC",
      source: "NOAA SWPC / GOES-18",
      mission: "MARS-01",
      type: "RADIATION ALERT // SOLAR PROTON EVENT (SPE)",
      title: "Solar Energetic Proton Shock Detected",
      severity: "CRITICAL",
      status: alertAcknowledged ? "ACKNOWLEDGED" : "DELIVERED",
      impact: "High-energy proton flux exceeding S3 threshold. Emergency water-wall storm shelter ingress directive active.",
      pipeline: {
        prakash: "✓ ENCODED (Rate delta dPhi/dt > 4.2)",
        richa: "✓ ROUTED (TVG Dijkstra bypass)",
        relay: "✓ FORWARDED (Laser crosslink)",
        akashdeep: "✓ DECODED (Reverse MLP)",
        mission: "✓ HUD ACTIVE",
        ack: alertAcknowledged ? "✓ ACKNOWLEDGED BY CREW" : "● AWAITING ACKNOWLEDGEMENT"
      }
    },
    {
      id: "ALT-2026-0908-02",
      time: "13:42:00 UTC",
      source: "NASA CCMC DONKI",
      mission: "LUNAR-01",
      type: "CORONAL MASS EJECTION (CME) ARRIVAL",
      title: "CME Plasma Shock Front Approaching Cislunar Space",
      severity: "HIGH",
      status: "ACKNOWLEDGED",
      impact: "Estimated plasma arrival in 18 hours. Cislunar NRHO optical link tracking adjustments initiated.",
      pipeline: {
        prakash: "✓ ENCODED",
        richa: "✓ ROUTED",
        relay: "✓ FORWARDED",
        akashdeep: "✓ DECODED",
        mission: "✓ HUD ACTIVE",
        ack: "✓ ACKNOWLEDGED"
      }
    },
    {
      id: "ALT-2026-0908-03",
      time: "13:30:15 UTC",
      source: "SHIVODAYA SIMULATION",
      mission: "FLEET-WIDE",
      type: "INTERPLANETARY MESH ROUTE UPDATE",
      title: "Autonomous Reroute via Relay Gamma Engaged",
      severity: "WARNING",
      status: "DELIVERED",
      impact: "Simulated Relay Alpha occlusion triggered lock-free TVG Dijkstra reroute through deep space sentry.",
      pipeline: {
        prakash: "✓ ENCODED",
        richa: "✓ ROUTED",
        relay: "✓ FORWARDED",
        akashdeep: "✓ DECODED",
        mission: "✓ HUD ACTIVE",
        ack: "✓ DELIVERED"
      }
    },
    {
      id: "ALT-2026-0908-04",
      time: "13:15:00 UTC",
      source: "ISRO SENTRY-01",
      mission: "SENTRY-01",
      type: "HELIOSPHERIC SENSOR CALIBRATION",
      title: "L1 Sentry Silicon Micro-Dosimeter Auto-Zero",
      severity: "INFO",
      status: "DELIVERED",
      impact: "Routine zero-point recalibration completed on primary radiation detector array.",
      pipeline: {
        prakash: "✓ ENCODED",
        richa: "✓ ROUTED",
        relay: "✓ FORWARDED",
        akashdeep: "✓ DECODED",
        mission: "✓ HUD ACTIVE",
        ack: "✓ COMPLETE"
      }
    }
  ];

  // If simulation is not active and no real alerts, show filtered list
  const activeAlerts = simulatedAlertActive ? defaultAlerts : defaultAlerts.filter(a => a.id !== "ALT-2026-0908-01");

  const counts = {
    all: activeAlerts.length,
    CRITICAL: activeAlerts.filter(a => a.severity === "CRITICAL").length,
    HIGH: activeAlerts.filter(a => a.severity === "HIGH").length,
    WARNING: activeAlerts.filter(a => a.severity === "WARNING").length,
    INFO: activeAlerts.filter(a => a.severity === "INFO").length,
    ACKNOWLEDGED: activeAlerts.filter(a => a.status === "ACKNOWLEDGED").length
  };

  const filteredList = activeAlerts.filter(a => {
    if (filterSeverity === "all") return true;
    if (filterSeverity === "ACKNOWLEDGED") return a.status === "ACKNOWLEDGED";
    return a.severity === filterSeverity;
  });

  return (
    <div className="space-y-6 font-mono animate-in fade-in duration-200">
      
      {/* 1. Header & Metric Badges */}
      <div className="bg-zinc-950/90 border border-white/10 rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-cyan-400" />
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
                DEDICATED ALERT & DISPATCH WORKSPACE
              </h2>
            </div>
            <p className="text-[11px] text-zinc-400 font-sans pt-0.5">
              Mission-critical radiation storm alerts, autonomous network re-route dispatches, and crew ingress tracking.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 text-zinc-300">
              DISPATCH PROTOCOL: BPv7 EMERGENCY BUNDLE
            </span>
          </div>
        </div>

        {/* Top Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {[
            { id: "all", label: "TOTAL ACTIVE", count: counts.all, color: "text-white" },
            { id: "CRITICAL", label: "CRITICAL", count: counts.CRITICAL, color: "text-red-400" },
            { id: "HIGH", label: "HIGH", count: counts.HIGH, color: "text-amber-400" },
            { id: "WARNING", label: "WARNING", count: counts.WARNING, color: "text-yellow-300" },
            { id: "INFO", label: "INFO", count: counts.INFO, color: "text-cyan-300" },
            { id: "ACKNOWLEDGED", label: "ACKNOWLEDGED", count: counts.ACKNOWLEDGED, color: "text-emerald-400" }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilterSeverity(item.id)}
              className={`p-3 rounded-lg text-left transition-all border ${
                filterSeverity === item.id
                  ? "bg-zinc-900 border-cyan-400/60 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                  : "bg-zinc-900/60 border-white/5 hover:border-white/15"
              }`}
            >
              <div className="text-[9px] text-zinc-500 uppercase tracking-wider">{item.label}</div>
              <div className={`text-lg font-bold ${item.color}`}>{item.count}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Alerts List & Detailed Pipeline Cards */}
      <div className="space-y-4">
        {filteredList.length === 0 ? (
          <div className="bg-zinc-950/90 border border-white/10 rounded-xl p-8 text-center text-zinc-500 text-xs">
            No alerts match the selected filter criteria. Space mesh communications nominal.
          </div>
        ) : (
          filteredList.map((alert) => {
            const isCritical = alert.severity === "CRITICAL";
            const isUnacknowledged = alert.status !== "ACKNOWLEDGED";

            return (
              <div
                key={alert.id}
                className={`bg-zinc-950/90 border rounded-xl p-5 space-y-4 transition-all ${
                  isCritical && isUnacknowledged
                    ? "border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.15)] bg-red-950/10"
                    : "border-white/10"
                }`}
              >
                {/* Top Row: Severity, Title, Mission, Status, Time */}
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        alert.severity === "CRITICAL"
                          ? "bg-red-950 text-red-300 border border-red-500/50 animate-pulse"
                          : alert.severity === "HIGH"
                          ? "bg-amber-950 text-amber-300 border border-amber-500/50"
                          : alert.severity === "WARNING"
                          ? "bg-yellow-950 text-yellow-300 border border-yellow-500/50"
                          : "bg-zinc-900 text-zinc-300 border border-white/10"
                      }`}>
                        {alert.severity}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {alert.id}
                      </span>
                      <span className="text-[10px] text-cyan-400 font-semibold uppercase px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/30">
                        MISSION: {alert.mission}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white tracking-wide pt-1">
                      {alert.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <div className="text-[10px] text-zinc-500">{alert.time}</div>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider mt-0.5 px-2 py-0.5 rounded ${
                        alert.status === "ACKNOWLEDGED"
                          ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                          : "bg-amber-950/60 text-amber-300 border border-amber-500/30 animate-pulse"
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {alert.status}
                      </span>
                    </div>

                    <button
                      onClick={() => onInspectItem && onInspectItem({
                        type: "alert",
                        title: alert.title,
                        id: alert.id,
                        severity: alert.severity,
                        status: alert.status,
                        source: alert.source,
                        destination: alert.mission,
                        time: alert.time,
                        description: alert.impact
                      })}
                      className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                      title="Inspect Alert"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Impact Summary & Provenance */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
                  <div className="md:col-span-8 p-3 rounded-lg bg-zinc-900/60 border border-white/5 space-y-1">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider">EVENT IMPACT:</span>
                    <p className="text-zinc-300 font-sans text-xs leading-relaxed">
                      {alert.impact}
                    </p>
                  </div>
                  <div className="md:col-span-4 p-3 rounded-lg bg-zinc-900/60 border border-white/5 space-y-1 text-[10px]">
                    <span className="text-zinc-500 uppercase tracking-wider">DATA PROVENANCE:</span>
                    <div className="text-cyan-300 font-semibold">{alert.source}</div>
                    <div className="text-zinc-500 pt-1">FEED FRESHNESS: &lt; 60s NRT</div>
                  </div>
                </div>

                {/* 6-Stage Shivodaya Alert Pipeline Verification */}
                <div className="space-y-2 pt-1 border-t border-white/5">
                  <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
                    SHIVODAYA 6-STAGE PIPELINE VERIFICATION:
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-[10px]">
                    <div className="p-2 rounded bg-zinc-900/80 border border-white/5 text-zinc-300">
                      <span className="text-zinc-500 block text-[9px]">1. PRAKASH</span>
                      <span className="text-emerald-400 font-medium">{alert.pipeline.prakash}</span>
                    </div>
                    <div className="p-2 rounded bg-zinc-900/80 border border-white/5 text-zinc-300">
                      <span className="text-zinc-500 block text-[9px]">2. RICHA</span>
                      <span className="text-emerald-400 font-medium">{alert.pipeline.richa}</span>
                    </div>
                    <div className="p-2 rounded bg-zinc-900/80 border border-white/5 text-zinc-300">
                      <span className="text-zinc-500 block text-[9px]">3. RELAY</span>
                      <span className="text-emerald-400 font-medium">{alert.pipeline.relay}</span>
                    </div>
                    <div className="p-2 rounded bg-zinc-900/80 border border-white/5 text-zinc-300">
                      <span className="text-zinc-500 block text-[9px]">4. AKASHDEEP</span>
                      <span className="text-emerald-400 font-medium">{alert.pipeline.akashdeep}</span>
                    </div>
                    <div className="p-2 rounded bg-zinc-900/80 border border-white/5 text-zinc-300">
                      <span className="text-zinc-500 block text-[9px]">5. MISSION HUD</span>
                      <span className="text-emerald-400 font-medium">{alert.pipeline.mission}</span>
                    </div>
                    <div className="p-2 rounded bg-zinc-900/80 border border-white/5 text-zinc-300">
                      <span className="text-zinc-500 block text-[9px]">6. ACKNOWLEDGE</span>
                      <span className={alert.status === "ACKNOWLEDGED" ? "text-emerald-400 font-medium" : "text-amber-400 font-bold"}>
                        {alert.pipeline.ack}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action if not acknowledged */}
                {isUnacknowledged && (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => onAcknowledgeAlert && onAcknowledgeAlert(alert.id)}
                      className="py-2 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase tracking-wider text-xs transition-colors flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>ACKNOWLEDGE MISSION ALERT</span>
                    </button>
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
