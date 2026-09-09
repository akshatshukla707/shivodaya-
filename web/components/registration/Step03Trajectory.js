"use client";

import React, { useState } from "react";
import { Compass, ArrowRight, ArrowLeft, Upload, FileText, CheckCircle2, AlertCircle, Eye } from "lucide-react";

export default function Step03Trajectory({
  formData,
  updateFormData,
  onNext,
  onBack
}) {
  const { trajectory = {}, mission = {} } = formData;
  const destination = mission.destination || "Mars";

  const [uploadError, setUploadError] = useState("");

  const handleChange = (field, value) => {
    updateFormData("trajectory", {
      ...trajectory,
      [field]: value
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split(".").pop()?.toLowerCase();
    const validExts = ["csv", "json", "oem", "txt"];

    if (!validExts.includes(ext)) {
      setUploadError("Unsupported format. Please upload CSV, JSON, or CCSDS OEM navigation ephemeris.");
      return;
    }

    setUploadError("");
    handleChange("ephemerisFileName", file.name);
    handleChange("ephemerisFileSize", `${(file.size / 1024).toFixed(1)} KB`);
    handleChange("ephemerisFormat", ext.toUpperCase());
  };

  const missionPhases = [
    "Launch & Early Orbit (LEOP)",
    "Cruise Phase",
    "Orbital Insertion",
    "Surface Operations",
    "Earth Return",
    "Extended Mission"
  ];

  const trajectoryRegimes = [
    "Mars Transfer Orbit (MTO)",
    "Lunar Near-Rectilinear Halo Orbit (NRHO)",
    "Cislunar Transfer",
    "Sun-Earth L1 / L5 Lagrange Halo",
    "Low Earth Orbit (LEO)",
    "Geostationary Orbit (GEO)",
    "Martian Aerostationary & Orbit",
    "Outer Solar System Heliocentric",
    "Other"
  ];

  // 2D Visualizer mapping based on destination & regime
  const renderTrajectory2D = () => {
    const isMars = destination.toLowerCase().includes("mars") || trajectory.regime?.toLowerCase().includes("mars");
    const isMoon = destination.toLowerCase().includes("moon") || trajectory.regime?.toLowerCase().includes("lunar") || trajectory.regime?.toLowerCase().includes("cislunar");
    const isL1L5 = destination.toLowerCase().includes("heliocentric") || trajectory.regime?.toLowerCase().includes("lagrange");

    return (
      <div className="w-full bg-black/90 rounded-2xl p-4 border border-white/10 space-y-2 select-none">
        <div className="flex items-center justify-between text-[9px] text-zinc-500 uppercase tracking-widest">
          <span>2D MISSION FLIGHT PATH PREVIEW</span>
          <span className="text-cyan-400 font-semibold">{destination.toUpperCase()} TRAJECTORY</span>
        </div>

        <svg viewBox="0 0 460 170" className="w-full h-40">
          <defs>
            <radialGradient id="solSun" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="1" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.2" />
            </radialGradient>
            <radialGradient id="earthGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </radialGradient>
            <radialGradient id="targetGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={isMars ? "#ef4444" : isMoon ? "#e2e8f0" : "#a855f7"} />
              <stop offset="100%" stopColor={isMars ? "#991b1b" : isMoon ? "#94a3b8" : "#6b21a8"} />
            </radialGradient>
          </defs>

          {/* Background Reference Grid */}
          <line x1="20" y1="85" x2="440" y2="85" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />

          {/* Central Sol Reference */}
          <circle cx="50" cy="85" r="16" fill="url(#solSun)" />
          <text x="50" y="89" fill="#000" fontSize="8" fontWeight="bold" textAnchor="middle">SOL</text>
          <text x="50" y="112" fill="#fbbf24" fontSize="7" textAnchor="middle">1.0 AU</text>

          {/* Earth Departure Point */}
          <circle cx="160" cy="85" r="10" fill="url(#earthGrad)" />
          <circle cx="160" cy="85" r="14" fill="none" stroke="#0284c7" strokeWidth="1" strokeDasharray="2 2" />
          <text x="160" y="89" fill="#000" fontSize="7" fontWeight="bold" textAnchor="middle">EARTH</text>
          <text x="160" y="112" fill="#38bdf8" fontSize="7" textAnchor="middle">DEPARTURE</text>

          {isMoon ? (
            <>
              {/* Moon Orbit & Trajectory */}
              <circle cx="250" cy="85" r="8" fill="url(#targetGrad)" />
              <ellipse cx="205" cy="85" rx="45" ry="25" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="3 2" />
              <circle cx="215" cy="65" r="4" fill="#06b6d4" />
              <text x="250" y="88" fill="#000" fontSize="6.5" fontWeight="bold" textAnchor="middle">MOON</text>
              <text x="250" y="112" fill="#e2e8f0" fontSize="7" textAnchor="middle">CISLUNAR NRHO</text>
              <text x="215" y="55" fill="#67e8f9" fontSize="6.5" textAnchor="middle">TLI TRANSFER</text>
            </>
          ) : isMars ? (
            <>
              {/* Mars Heliocentric Transfer Arc */}
              <circle cx="380" cy="85" r="11" fill="url(#targetGrad)" />
              <path
                d="M 160 85 Q 260 20 380 85"
                fill="none"
                stroke="#22d3ee"
                strokeWidth="2"
                strokeDasharray="4 2"
              />
              {/* Spacecraft Node along transfer */}
              <circle cx="270" cy="52" r="5" fill="#06b6d4" stroke="#fff" strokeWidth="1.5" />
              <text x="380" y="89" fill="#fff" fontSize="7.5" fontWeight="bold" textAnchor="middle">MARS</text>
              <text x="380" y="112" fill="#f87171" fontSize="7" textAnchor="middle">1.52 AU (ARRIVAL)</text>
              <text x="270" y="42" fill="#67e8f9" fontSize="7" fontWeight="bold" textAnchor="middle">SPACECRAFT (MTO)</text>
            </>
          ) : (
            <>
              {/* Lagrange / Deep Space Halo Orbit */}
              <circle cx="340" cy="85" r="8" fill="url(#targetGrad)" />
              <ellipse cx="340" cy="85" rx="28" ry="18" fill="none" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="2 2" />
              <path
                d="M 160 85 C 220 50, 280 60, 340 85"
                fill="none"
                stroke="#22d3ee"
                strokeWidth="1.5"
                strokeDasharray="3 2"
              />
              <circle cx="260" cy="65" r="4.5" fill="#06b6d4" stroke="#fff" strokeWidth="1" />
              <text x="340" y="88" fill="#fff" fontSize="6.5" fontWeight="bold" textAnchor="middle">L1/L5</text>
              <text x="340" y="112" fill="#c084fc" fontSize="7" textAnchor="middle">HALO STATION</text>
              <text x="260" y="55" fill="#67e8f9" fontSize="6.5" textAnchor="middle">TRANSFER VECTOR</text>
            </>
          )}
        </svg>

        <div className="flex justify-between items-center text-[10px] text-zinc-400 border-t border-white/5 pt-2">
          <span>REGIME: <strong className="text-white">{trajectory.regime || "Heliocentric Transit"}</strong></span>
          <span className="text-cyan-300">Phase: {trajectory.phase || "Cruise Phase"}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 font-mono animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 text-cyan-400 text-[10px] font-bold tracking-widest uppercase">
          <Compass className="w-3.5 h-3.5" />
          <span>STEP 03 // ORBITAL & TRAJECTORY PROFILE</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide mt-1">
          WHERE WILL THE MISSION GO?
        </h2>
        <p className="text-xs text-zinc-400 font-sans mt-0.5">
          Define the flight trajectory regimes, transfer windows, and upload optional CCSDS/OEM ephemeris vectors.
        </p>
      </div>

      {/* 2D Trajectory Visualizer */}
      {renderTrajectory2D()}

      {/* Trajectory Form Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        
        {/* Mission Phase */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
            MISSION OPERATIONAL PHASE
          </label>
          <select
            value={trajectory.phase || missionPhases[1]}
            onChange={(e) => handleChange("phase", e.target.value)}
            className="w-full bg-zinc-900/90 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 transition cursor-pointer"
          >
            {missionPhases.map((p) => (
              <option key={p} value={p} className="bg-zinc-950 text-white">
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Orbital Regime */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
            ORBITAL / TRAJECTORY REGIME
          </label>
          <select
            value={trajectory.regime || trajectoryRegimes[0]}
            onChange={(e) => handleChange("regime", e.target.value)}
            className="w-full bg-zinc-900/90 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 transition cursor-pointer"
          >
            {trajectoryRegimes.map((r) => (
              <option key={r} value={r} className="bg-zinc-950 text-white">
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Departure Window */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
            DEPARTURE WINDOW / TMI WINDOW
          </label>
          <input
            type="text"
            value={trajectory.departureWindow || ""}
            onChange={(e) => handleChange("departureWindow", e.target.value)}
            placeholder="e.g. 2026-10-15 to 2026-11-05 (Optimum Window)"
            className="w-full bg-zinc-900/90 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-400 transition"
          />
        </div>

        {/* Expected Arrival */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
            EXPECTED ARRIVAL / ORBITAL INSERTION
          </label>
          <input
            type="text"
            value={trajectory.expectedArrival || ""}
            onChange={(e) => handleChange("expectedArrival", e.target.value)}
            placeholder="e.g. 2027-05-18 UTC (Arrival Periapsis)"
            className="w-full bg-zinc-900/90 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-400 transition"
          />
        </div>

        {/* Ephemeris File Upload Box */}
        <div className="sm:col-span-2 space-y-2">
          <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold flex items-center justify-between">
            <span>TRAJECTORY EPHEMERIS (OPTIONAL UPLOAD)</span>
            <span className="text-zinc-500 text-[9px]">ACCEPTED: CSV, JSON, CCSDS OEM</span>
          </label>

          <div className="p-4 rounded-xl bg-zinc-900/70 border border-dashed border-white/15 hover:border-cyan-400/40 transition-colors text-center space-y-2">
            <input
              type="file"
              id="ephemeris-upload"
              accept=".csv,.json,.oem,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label
              htmlFor="ephemeris-upload"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-cyan-300 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{trajectory.ephemerisFileName ? "REPLACE EPHEMERIS FILE" : "UPLOAD TRAJECTORY FILE"}</span>
            </label>

            {trajectory.ephemerisFileName ? (
              <div className="flex items-center justify-center gap-2 text-xs text-emerald-400 font-medium pt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{trajectory.ephemerisFileName} ({trajectory.ephemerisFileSize} · {trajectory.ephemerisFormat})</span>
              </div>
            ) : (
              <p className="text-[11px] text-zinc-500 font-sans">
                Drag and drop your mission ephemeris state vectors. Only verified navigation formats are parsed.
              </p>
            )}

            {uploadError && (
              <div className="text-red-400 text-[10px] flex items-center justify-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{uploadError}</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Navigation Actions */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/15 text-zinc-300 hover:text-white text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
        >
          <span>CONTINUE TO DATA & SENSORS</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
