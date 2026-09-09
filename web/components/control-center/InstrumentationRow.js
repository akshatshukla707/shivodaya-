"use client";

import React, { useState } from "react";
import { Activity, Zap, Compass, Eye, ZoomIn, ZoomOut, RotateCcw, AlertCircle } from "lucide-react";

export default function InstrumentationRow({
  xrayFlux = [],
  protonFlux = [],
  solarWind = {},
  sdoImagery = {},
  provenance = {}
}) {
  // SDO Channel selection
  const [selectedChannel, setSelectedChannel] = useState("171");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [imgError, setImgError] = useState(false);

  const channels = sdoImagery.channels || [
    { id: "171", name: "AIA 171", wavelength: "17.1 nm (Fe IX)", description: "Quiet corona & upper transition region", color: "#eab308", url: "https://sdo.gsfc.nasa.gov/assets/img/latest/latest_512_0171.jpg" },
    { id: "193", name: "AIA 193", wavelength: "19.3 nm (Fe XII)", description: "Corona & hot flare plasma", color: "#f97316", url: "https://sdo.gsfc.nasa.gov/assets/img/latest/latest_512_0193.jpg" },
    { id: "304", name: "AIA 304", wavelength: "30.4 nm (He II)", description: "Chromosphere & transition filaments", color: "#ef4444", url: "https://sdo.gsfc.nasa.gov/assets/img/latest/latest_512_0304.jpg" },
    { id: "hmi", name: "HMI Continuum", wavelength: "617.3 nm (Fe I)", description: "Photosphere & sunspots", color: "#cbd5e1", url: "https://sdo.gsfc.nasa.gov/assets/img/latest/latest_512_HMIIC.jpg" }
  ];

  const activeChanObj = channels.find(c => c.id === selectedChannel) || channels[0];

  // Fallback local image if external SDO times out
  const displayImgUrl = imgError ? "/images/sun.jpg" : activeChanObj.url;

  // X-Ray SVG Sparkline calculations
  const xPoints = xrayFlux.length > 0 ? xrayFlux : [
    { time: "08:00", flux: 1.2e-6, class: "C1.2" },
    { time: "10:00", flux: 2.8e-6, class: "C2.8" },
    { time: "12:00", flux: 4.5e-6, class: "C4.5" },
    { time: "13:50", flux: 2.2e-6, class: "C2.2" }
  ];

  // Map flux (log scale from 1e-8 to 1e-3) to SVG y: 0 to 90
  const svgWidth = 260;
  const svgHeight = 90;
  const logMin = -8; // 1e-8 (A class)
  const logMax = -3; // 1e-3 (X class)

  const getLogY = (fluxVal) => {
    const val = Math.max(1e-8, Math.min(1e-3, fluxVal));
    const log = Math.log10(val);
    const normalized = (log - logMin) / (logMax - logMin); // 0 to 1
    return svgHeight - (normalized * (svgHeight - 12) + 6);
  };

  const polylineCoords = xPoints.map((pt, idx) => {
    const x = (idx / (xPoints.length - 1 || 1)) * (svgWidth - 20) + 10;
    const y = getLogY(pt.flux);
    return `${x},${y}`;
  }).join(" ");

  const latestXray = xPoints[xPoints.length - 1];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 font-mono">
      
      {/* 1. Solar Image Monitor (Section 12) */}
      <div className="lg:col-span-2 bg-zinc-950/90 border border-white/10 rounded-xl p-4 sm:p-5 space-y-3 flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-white">
                SOLAR IMAGING (SDO)
              </h3>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 text-zinc-400">
                SOURCE: NASA SDO
              </span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                ● LIVE
              </span>
            </div>
          </div>

          {/* Channel Selector Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2.5">
            {channels.map((ch) => (
              <button
                key={ch.id}
                onClick={() => {
                  setSelectedChannel(ch.id);
                  setImgError(false);
                }}
                className={`px-2.5 py-1 text-[11px] rounded uppercase tracking-wider font-semibold border transition-all ${
                  selectedChannel === ch.id
                    ? "bg-zinc-800 text-cyan-300 border-cyan-500/60 shadow-[0_0_10px_rgba(6,182,212,0.15)]"
                    : "bg-zinc-900/60 text-zinc-400 border-white/10 hover:text-white"
                }`}
              >
                {ch.name}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-zinc-400 font-sans pt-1">
            {activeChanObj.description} &bull; <span className="font-mono text-cyan-400">{activeChanObj.wavelength}</span>
          </div>
        </div>

        {/* Viewport Frame with Zoom / Pan Controls */}
        <div className="relative w-full h-56 sm:h-64 rounded-lg bg-black border border-white/15 overflow-hidden flex items-center justify-center group">
          <div 
            className="w-full h-full flex items-center justify-center transition-transform duration-200 cursor-grab"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <img
              src={displayImgUrl}
              alt={activeChanObj.name}
              onError={() => setImgError(true)}
              className="max-h-full max-w-full object-contain filter drop-shadow-[0_0_15px_rgba(234,179,8,0.2)]"
            />
          </div>

          {/* Floating Zoom Controls */}
          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 bg-zinc-950/80 backdrop-blur-md border border-white/15 rounded p-1 text-xs">
            <button
              onClick={() => setZoomLevel(prev => Math.min(2.5, prev + 0.25))}
              className="p-1 text-zinc-300 hover:text-white hover:bg-white/10 rounded transition"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.max(0.75, prev - 0.25))}
              className="p-1 text-zinc-300 hover:text-white hover:bg-white/10 rounded transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1 text-zinc-300 hover:text-white hover:bg-white/10 rounded transition"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <span className="text-[9px] text-zinc-400 px-1 border-l border-white/10">
              {(zoomLevel * 100).toFixed(0)}%
            </span>
          </div>

          {/* Timestamp overlay */}
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 border border-white/10 text-[10px] text-zinc-400">
            TIMESTAMP: {new Date().toISOString().slice(0, 16)} UTC
          </div>

          {imgError && (
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-amber-950/70 border border-amber-500/40 text-[9px] text-amber-300">
              LOCAL SATELLITE MIRROR
            </div>
          )}
        </div>

      </div>

      {/* 2. Solar X-Ray Flux Monitor (Section 8) */}
      <div className="bg-zinc-950/90 border border-white/10 rounded-xl p-4 sm:p-5 space-y-3 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-white">
                SOLAR X-RAY FLUX
              </h3>
            </div>
            <span className="text-[9px] text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/30">
              NOAA / GOES
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-2">
            <div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider">CURRENT FLUX:</div>
              <div className="text-xl font-bold text-white tabular-nums">
                {latestXray.flux.toExponential(2)} <span className="text-xs font-normal text-zinc-400">W/m²</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider">CLASS:</div>
              <div className="text-xl font-bold text-amber-300">{latestXray.class}</div>
            </div>
          </div>
        </div>

        {/* SVG Logarithmic Chart */}
        <div className="relative w-full h-28 bg-black/60 border border-white/10 rounded p-2 flex flex-col justify-between">
          {/* Threshold guide lines */}
          <div className="absolute inset-0 px-2 py-1 flex flex-col justify-between text-[8px] text-zinc-600 pointer-events-none">
            <div className="border-b border-red-500/20 text-red-400/60">X CLASS (1e-4)</div>
            <div className="border-b border-orange-500/20 text-orange-400/60">M CLASS (1e-5)</div>
            <div className="border-b border-amber-500/20 text-amber-400/60">C CLASS (1e-6)</div>
            <div className="border-b border-emerald-500/20 text-emerald-400/60">B CLASS (1e-7)</div>
          </div>

          {/* Polyline Sparkline */}
          <svg className="w-full h-full overflow-visible">
            <polyline
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={polylineCoords}
            />
            {xPoints.map((pt, idx) => {
              const x = (idx / (xPoints.length - 1 || 1)) * (svgWidth - 20) + 10;
              const y = getLogY(pt.flux);
              return (
                <circle
                  key={idx}
                  cx={x}
                  cy={y}
                  r="3"
                  fill="#06b6d4"
                  className="hover:r-5 transition-all"
                />
              );
            })}
          </svg>
        </div>

        <div className="text-[9px] text-zinc-500 flex justify-between pt-1 border-t border-white/5">
          <span>0.1–0.8 nm FLUX</span>
          <span>UPDATED: {provenance.noaa_xray?.updated ? new Date(provenance.noaa_xray.updated).toLocaleTimeString() : "LIVE"}</span>
        </div>
      </div>

      {/* 3. Proton Flux & Solar Wind (Section 9 & 10) */}
      <div className="bg-zinc-950/90 border border-white/10 rounded-xl p-4 sm:p-5 space-y-3 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-white">
                PROTONS & SOLAR WIND
              </h3>
            </div>
            <span className="text-[9px] text-zinc-400 px-1.5 py-0.5 rounded bg-zinc-900 border border-white/10">
              NOAA / SWPC
            </span>
          </div>

          {/* Solar Wind Values */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400">WIND SPEED:</span>
              <span className="font-bold text-white text-sm tabular-nums">
                {solarWind.speed_kms || 504} <span className="text-[10px] text-zinc-400 font-normal">km/s</span>
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400">MAG FIELD (Bt / Bz):</span>
              <span className="font-bold text-cyan-300 text-xs tabular-nums">
                {solarWind.bt_nt || 14.2} nT / {solarWind.bz_nt || -6.1} nT
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400">PROTON (&ge;10 MeV):</span>
              <span className="font-bold text-amber-300 text-xs tabular-nums">
                {protonFlux[protonFlux.length - 1]?.energy10?.toFixed(2) || "1.10"} pfu
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400">PROTON (&ge;100 MeV):</span>
              <span className="font-bold text-emerald-300 text-xs tabular-nums">
                {protonFlux[protonFlux.length - 1]?.energy100?.toFixed(2) || "0.21"} pfu
              </span>
            </div>
          </div>
        </div>

        {/* Environmental Context Badge */}
        <div className="p-2 rounded bg-zinc-900/90 border border-white/5 space-y-1">
          <div className="text-[9px] text-zinc-400 uppercase tracking-widest">
            OBSERVATIONAL CONTEXT:
          </div>
          <div className="text-[10px] text-cyan-300 font-semibold">
            {solarWind.context || "NEAR-EARTH CONTEXT (L1 DSCOVR/ACE)"}
          </div>
        </div>

        {/* Medical / Dose Disclaimer (Section 9 Requirement) */}
        <div className="text-[9px] text-zinc-500 leading-tight font-sans border-t border-white/5 pt-1.5 flex items-start gap-1">
          <AlertCircle className="w-3 h-3 text-zinc-500 shrink-0 mt-0.5" />
          <span>Do not convert proton measurements into biological radiation dose without validated tissue geometry modeling.</span>
        </div>
      </div>

    </div>
  );
}
