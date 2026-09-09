"use client";

import React from "react";
import { Disc, Radio, AlertOctagon, ArrowUpRight, Compass } from "lucide-react";

export default function CmeMonitor({ cmes = [] }) {
  const latestCme = cmes[0] || {
    id: "CME-2026-0802-001",
    detection_time: "2026-08-02 10:45 UTC",
    source_region: "NE Limb",
    speed_kms: 420,
    half_width_deg: 8,
    instruments: "GOES CCOR-1",
    estimated_arrival: "NO ESTIMATE AVAILABLE",
    impact_risk: "LOW"
  };

  return (
    <div className="bg-zinc-950/90 border border-white/10 rounded-xl p-4 sm:p-5 space-y-4 font-mono">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Disc className="w-4 h-4 text-red-400 animate-spin-slow" />
          <h3 className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-white">
            CME MONITOR & TRAJECTORY VECTOR
          </h3>
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 text-zinc-400">
            SOURCE: NASA CCMC DONKI
          </span>
          <span className="px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
            ● REAL EVENT
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        
        {/* Trajectory Vector Visualization */}
        <div className="lg:col-span-5 bg-black/70 border border-white/10 rounded-lg p-4 relative flex flex-col items-center justify-between h-52">
          <div className="w-full flex justify-between items-center text-[10px] text-zinc-500">
            <span>SOLAR SYSTEM CROSS-SECTION</span>
            <span>POLAR PLANE</span>
          </div>

          {/* Celestial SVG Vector Diagram */}
          <svg viewBox="0 0 280 140" className="w-full h-32">
            {/* Sun */}
            <circle cx="40" cy="70" r="16" fill="#f59e0b" className="animate-pulse" />
            <circle cx="40" cy="70" r="22" fill="none" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.4" />
            <text x="40" y="102" fill="#f59e0b" fontSize="9" textAnchor="middle" fontFamily="monospace">SUN</text>

            {/* CME Shockfront Wave */}
            <path
              d="M 70 45 Q 110 70 70 95"
              fill="none"
              stroke="#ef4444"
              strokeWidth="3"
              strokeLinecap="round"
              className="animate-pulse"
            />
            <path
              d="M 85 35 Q 130 70 85 105"
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
              strokeDasharray="3 3"
              strokeOpacity="0.7"
            />
            <text x="100" y="32" fill="#ef4444" fontSize="8" textAnchor="middle" fontFamily="monospace">CME WAVE</text>

            {/* Trajectory Vector Line */}
            <line x1="56" y1="70" x2="220" y2="70" stroke="#06b6d4" strokeWidth="1" strokeDasharray="4 4" />

            {/* Earth Target */}
            <circle cx="190" cy="70" r="7" fill="#3b82f6" />
            <text x="190" y="92" fill="#93c5fd" fontSize="8" textAnchor="middle" fontFamily="monospace">EARTH (1 AU)</text>

            {/* Mars Target */}
            <circle cx="255" cy="70" r="5" fill="#ef4444" />
            <text x="255" y="92" fill="#fca5a5" fontSize="8" textAnchor="middle" fontFamily="monospace">MARS (1.5 AU)</text>
          </svg>

          <div className="w-full text-[9px] text-zinc-500 text-center uppercase tracking-wider">
            TRAJECTORY VECTOR: HELIOSPHERIC SHOCK PROPAGATION (MODELED)
          </div>
        </div>

        {/* CME Telemetry Data Table */}
        <div className="lg:col-span-7 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-2.5 rounded bg-zinc-900/80 border border-white/5">
              <div className="text-[10px] text-zinc-500 uppercase">LATEST CME ID</div>
              <div className="font-bold text-white truncate">{latestCme.id}</div>
            </div>
            <div className="p-2.5 rounded bg-zinc-900/80 border border-white/5">
              <div className="text-[10px] text-zinc-500 uppercase">DETECTION TIME</div>
              <div className="font-bold text-cyan-300 tabular-nums">{latestCme.detection_time}</div>
            </div>
            <div className="p-2.5 rounded bg-zinc-900/80 border border-white/5">
              <div className="text-[10px] text-zinc-500 uppercase">SPEED</div>
              <div className="font-bold text-white tabular-nums">
                {latestCme.speed_kms ? `${latestCme.speed_kms} km/s` : "MODELED SPEED"}
              </div>
            </div>
            <div className="p-2.5 rounded bg-zinc-900/80 border border-white/5">
              <div className="text-[10px] text-zinc-500 uppercase">SOURCE REGION</div>
              <div className="font-bold text-zinc-300">{latestCme.source_region}</div>
            </div>
            <div className="p-2.5 rounded bg-zinc-900/80 border border-white/5">
              <div className="text-[10px] text-zinc-500 uppercase">ANGULAR WIDTH</div>
              <div className="font-bold text-zinc-300">
                {latestCme.half_width_deg ? `±${latestCme.half_width_deg}°` : "NARROW JET"}
              </div>
            </div>
            <div className="p-2.5 rounded bg-zinc-900/80 border border-white/5">
              <div className="text-[10px] text-zinc-500 uppercase">ESTIMATED ARRIVAL</div>
              <div className="font-bold text-amber-300 truncate">{latestCme.estimated_arrival}</div>
            </div>
          </div>

          <div className="p-2.5 rounded bg-zinc-900/50 border border-white/5 text-[11px] text-zinc-400 font-sans leading-relaxed">
            Observational instrumentation: <span className="text-white font-mono font-semibold">{latestCme.instruments}</span>. If solar plasma trajectory does not intersect the spacecraft orbital plane, interplanetary impact risk remains <span className="text-emerald-400 font-semibold font-mono">LOW</span>.
          </div>
        </div>

      </div>

    </div>
  );
}
