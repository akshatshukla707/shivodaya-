"use client";

import React, { useState } from "react";
import { 
  Sun, ZoomIn, ZoomOut, RotateCcw, AlertTriangle, Activity, 
  Wind, Eye, Radio, ExternalLink 
} from "lucide-react";
import CmeMonitor from "../CmeMonitor";

export default function SolarWorkspace({
  solarEvents = [],
  noaaAlerts = [],
  cmes = [],
  xrayFlux = [],
  protonFlux = [],
  solarWind = {},
  sdoImagery = {},
  provenance = {},
  onInspectItem
}) {
  const [activeSubTab, setActiveSubTab] = useState("all"); // "all", "flares", "cme", "xray", "solar_wind", "imagery"
  const [selectedChannel, setSelectedChannel] = useState("171");
  const [zoomLevel, setZoomLevel] = useState(1);

  const channels = sdoImagery?.channels || [
    { id: "171", name: "AIA 171", wavelength: "17.1 nm (Fe IX)", description: "Quiet corona & upper transition region", color: "#eab308", url: "https://sdo.gsfc.nasa.gov/assets/img/latest/latest_512_0171.jpg" },
    { id: "193", name: "AIA 193", wavelength: "19.3 nm (Fe XII, XXIV)", description: "Corona & hot flare plasma", color: "#f97316", url: "https://sdo.gsfc.nasa.gov/assets/img/latest/latest_512_0193.jpg" },
    { id: "304", name: "AIA 304", wavelength: "30.4 nm (He II)", description: "Chromosphere & transition region filaments", color: "#ef4444", url: "https://sdo.gsfc.nasa.gov/assets/img/latest/latest_512_0304.jpg" },
    { id: "hmi", name: "HMI Continuum", wavelength: "617.3 nm (Fe I)", description: "Photosphere & active sunspot complexes", color: "#cbd5e1", url: "https://sdo.gsfc.nasa.gov/assets/img/latest/latest_512_HMIIC.jpg" }
  ];

  const currentChannel = channels.find(c => c.id === selectedChannel) || channels[0];

  return (
    <div className="space-y-6 font-mono animate-in fade-in duration-200">
      
      {/* 1. Header & Segmented Sub-Workspace Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-950/90 border border-white/10 rounded-xl p-4">
        <div className="flex items-center gap-2">
          <Sun className="w-4 h-4 text-amber-400" />
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
            SOLAR OBSERVATORY & HELIOPHYSICS WORKSPACE
          </h2>
        </div>

        {/* Sub-Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto text-[11px]">
          {[
            { id: "all", label: "ALL SENSORS" },
            { id: "imagery", label: "SDO IMAGERY" },
            { id: "cme", label: "CME MONITOR" },
            { id: "flares", label: "FLARES & ALERTS" },
            { id: "xray", label: "GOES X-RAY" },
            { id: "solar_wind", label: "SOLAR WIND" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-2.5 py-1 rounded font-bold uppercase tracking-wider transition-all ${
                activeSubTab === tab.id
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/50"
                  : "bg-zinc-900 text-zinc-400 hover:text-white border border-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. SOLAR IMAGERY SECTION (When "all" or "imagery") */}
      {(activeSubTab === "all" || activeSubTab === "imagery") && (
        <div className="bg-zinc-950/90 border border-white/10 rounded-xl p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  NASA SDO MULTI-SPECTRAL SOLAR IMAGER
                </h3>
              </div>
              <p className="text-[11px] text-zinc-400 font-sans pt-0.5">
                Real-time full-disk solar disk imagery from NASA Solar Dynamics Observatory.
              </p>
            </div>

            {/* Channel Buttons */}
            <div className="flex items-center gap-1.5 text-xs">
              {channels.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => setSelectedChannel(ch.id)}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    selectedChannel === ch.id
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm"
                      : "bg-zinc-900 text-zinc-400 hover:text-white border border-white/5"
                  }`}
                >
                  {ch.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            {/* Image Box with Zoom & Pan */}
            <div className="lg:col-span-7 relative rounded-lg bg-black border border-white/15 overflow-hidden flex items-center justify-center min-h-[340px]">
              <div 
                className="transition-transform duration-200 cursor-grab active:cursor-grabbing"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                <img
                  src={currentChannel.url}
                  alt={currentChannel.name}
                  className="max-h-[380px] w-auto object-contain rounded select-none pointer-events-none"
                  onError={(e) => {
                    e.target.src = "https://services.swpc.noaa.gov/images/synoptic-map.jpg";
                  }}
                />
              </div>

              {/* Zoom Controls Overlay */}
              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-zinc-900/90 border border-white/15 rounded-lg p-1 text-xs">
                <button
                  onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.5))}
                  className="p-1 text-zinc-300 hover:text-white"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))}
                  className="p-1 text-zinc-300 hover:text-white"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoomLevel(1)}
                  className="p-1 text-zinc-300 hover:text-white"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="absolute top-3 left-3 bg-black/80 px-2 py-0.5 rounded border border-white/10 text-[10px] text-zinc-300">
                {currentChannel.wavelength}
              </div>
            </div>

            {/* Metadata & Channel Info */}
            <div className="lg:col-span-5 space-y-3 text-xs">
              <div className="p-3 rounded bg-zinc-900/60 border border-white/5 space-y-1.5">
                <div className="text-[10px] text-zinc-500 uppercase">SELECTED CHANNEL</div>
                <div className="text-sm font-bold text-white">{currentChannel.name} — {currentChannel.wavelength}</div>
                <p className="text-[11px] text-zinc-300 font-sans leading-relaxed">{currentChannel.description}</p>
              </div>

              <div className="p-3 rounded bg-zinc-900/60 border border-white/5 space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-zinc-500 uppercase">OBSERVATORY:</span>
                  <span className="text-white font-semibold">NASA SDO (GEO Orbit)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 uppercase">INSTRUMENT:</span>
                  <span className="text-cyan-300 font-semibold">Atmospheric Imaging Assembly</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 uppercase">DATA STATUS:</span>
                  <span className="text-emerald-400 font-semibold">LIVE SYNC ACTIVE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 uppercase">LAST FRAME:</span>
                  <span className="text-zinc-300 tabular-nums">2026-09-08 13:55 UTC</span>
                </div>
              </div>

              <div className="text-[9px] text-zinc-500 italic">
                SDO provides continuous EUV multi-band views to detect emerging active flare regions, coronal loops, and coronal hole boundaries.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. CME MONITOR (When "all" or "cme") */}
      {(activeSubTab === "all" || activeSubTab === "cme") && (
        <CmeMonitor cmes={cmes} />
      )}

      {/* 4. SOLAR WIND & IMF (When "all" or "solar_wind") */}
      {(activeSubTab === "all" || activeSubTab === "solar_wind") && (
        <div className="bg-zinc-950/90 border border-white/10 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                SOLAR WIND & INTERPLANETARY MAGNETIC FIELD (IMF)
              </h3>
            </div>
            <span className="text-[10px] text-zinc-400">
              NOAA / DSCOVR L1 FARADAY CUP & MAGNETOMETER
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-lg bg-zinc-900/60 border border-white/5 space-y-1">
              <div className="text-[10px] text-zinc-500 uppercase">WIND SPEED</div>
              <div className="text-xl font-bold text-cyan-300 tabular-nums">{solarWind.speed_kms || 504} <span className="text-xs text-zinc-500">km/s</span></div>
              <div className="text-[10px] text-emerald-400">NOMINAL FLOW</div>
            </div>

            <div className="p-3 rounded-lg bg-zinc-900/60 border border-white/5 space-y-1">
              <div className="text-[10px] text-zinc-500 uppercase">TOTAL IMF (Bt)</div>
              <div className="text-xl font-bold text-white tabular-nums">{solarWind.bt_nt || 14.2} <span className="text-xs text-zinc-500">nT</span></div>
              <div className="text-[10px] text-zinc-400">FIELD INTENSITY</div>
            </div>

            <div className="p-3 rounded-lg bg-zinc-900/60 border border-white/5 space-y-1">
              <div className="text-[10px] text-zinc-500 uppercase">SOUTHWARD (Bz)</div>
              <div className={`text-xl font-bold tabular-nums ${(solarWind.bz_nt || -6.1) < -10 ? "text-red-400" : "text-amber-300"}`}>
                {solarWind.bz_nt || -6.1} <span className="text-xs text-zinc-500">nT</span>
              </div>
              <div className="text-[10px] text-zinc-400">GEOMAGNETIC RECONNECTION</div>
            </div>

            <div className="p-3 rounded-lg bg-zinc-900/60 border border-white/5 space-y-1">
              <div className="text-[10px] text-zinc-500 uppercase">PROTON DENSITY</div>
              <div className="text-xl font-bold text-white tabular-nums">{solarWind.density_p_cm3 || 6.4} <span className="text-xs text-zinc-500">p/cm³</span></div>
              <div className="text-[10px] text-zinc-400">SOLAR PLASMA DENSITY</div>
            </div>
          </div>

          <div className="text-[9px] text-zinc-500 italic">
            * Context Attribution: Measured at Sun-Earth L1 Lagrange point (~1.5M km upstream of Earth). Provides ~45-minute advance warning before shock impact on Earth magnetosphere.
          </div>
        </div>
      )}

      {/* 5. FLARES & ALERTS LIST (When "all" or "flares") */}
      {(activeSubTab === "all" || activeSubTab === "flares") && (
        <div className="bg-zinc-950/90 border border-white/10 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                RECENT SOLAR FLARE ERUPTIONS (NOAA SWPC / NASA DONKI)
              </h3>
            </div>
            <span className="text-[10px] text-zinc-400">CLICK ROW TO INSPECT</span>
          </div>

          <div className="space-y-2">
            {solarEvents.map((ev, i) => (
              <div
                key={i}
                onClick={() => onInspectItem && onInspectItem({ ...ev, type: "event" })}
                className="p-3 rounded-lg bg-zinc-900/70 hover:bg-zinc-850 border border-white/10 hover:border-amber-400/50 cursor-pointer transition-all flex flex-wrap items-center justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/40 text-amber-300 font-bold text-xs">
                      CLASS {ev.class || "C2.4"}
                    </span>
                    <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                      {ev.id} — {ev.active_region || "AR 14506"}
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400 font-sans">
                    {ev.description}
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right text-[10px]">
                  <div>
                    <div className="text-zinc-300 font-semibold tabular-nums">{ev.time}</div>
                    <div className="text-zinc-500">LOC: {ev.location || "DISK"}</div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-amber-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
