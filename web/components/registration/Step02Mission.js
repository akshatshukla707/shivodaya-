"use client";

import React, { useState } from "react";
import { Rocket, ArrowRight, ArrowLeft, Calendar, Compass, Clock, Info } from "lucide-react";

export default function Step02Mission({
  formData,
  updateFormData,
  onNext,
  onBack
}) {
  const { mission = {} } = formData;
  const [touched, setTouched] = useState({});

  const handleChange = (field, value) => {
    updateFormData("mission", {
      ...mission,
      [field]: value
    });
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const isNameValid = !!mission.name?.trim();
  const isDestValid = !!mission.destination?.trim();
  const canProceed = isNameValid && isDestValid;

  const missionTypes = [
    "Robotic",
    "Crewed",
    "Relay",
    "Science",
    "Communication",
    "Technology Demonstration",
    "Earth Observation",
    "Other"
  ];

  const missionStatuses = [
    "Planned",
    "Pre-launch",
    "Active",
    "Extended",
    "Other"
  ];

  const destinations = [
    "Moon",
    "Mars",
    "Asteroid",
    "Heliocentric",
    "Deep Space",
    "Other"
  ];

  return (
    <div className="space-y-6 font-mono animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 text-cyan-400 text-[10px] font-bold tracking-widest uppercase">
          <Rocket className="w-3.5 h-3.5" />
          <span>STEP 02 // SPACECRAFT IDENTITY</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide mt-1">
          WHAT ARE YOU FLYING?
        </h2>
        <p className="text-xs text-zinc-400 font-sans mt-0.5">
          Declare the vehicle specifications, operational category, launch manifests, and flight parameters.
        </p>
      </div>

      {/* Form Fields Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        
        {/* Mission Name */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold flex items-center justify-between">
            <span>MISSION NAME *</span>
            {touched.name && !isNameValid && (
              <span className="text-red-400 text-[9px]">MISSION NAME REQUIRED</span>
            )}
          </label>
          <input
            type="text"
            value={mission.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            onBlur={() => handleBlur("name")}
            placeholder="e.g. AURORA-DEEP-01, CHANDRAYAAN-4, CYGNUS-LUNAR"
            className={`w-full bg-zinc-900/90 border rounded-xl px-4 py-2.5 text-sm text-white font-bold tracking-wide placeholder-zinc-600 focus:outline-none transition ${
              touched.name && !isNameValid ? "border-red-500/60 focus:border-red-400" : "border-white/15 focus:border-cyan-400"
            }`}
          />
        </div>

        {/* Mission ID / Code */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
            MISSION ID / CALLSIGN
          </label>
          <input
            type="text"
            value={mission.id || ""}
            onChange={(e) => handleChange("id", e.target.value.toUpperCase())}
            placeholder="e.g. ADR-01, MARS-EXP-4"
            className="w-full bg-zinc-900/90 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white font-mono uppercase placeholder-zinc-600 focus:outline-none focus:border-cyan-400 transition"
          />
        </div>

        {/* Mission Type */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
            MISSION TYPE
          </label>
          <select
            value={mission.type || missionTypes[0]}
            onChange={(e) => handleChange("type", e.target.value)}
            className="w-full bg-zinc-900/90 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 transition cursor-pointer"
          >
            {missionTypes.map((t) => (
              <option key={t} value={t} className="bg-zinc-950 text-white">
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Mission Status */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
            MISSION STATUS
          </label>
          <select
            value={mission.status || missionStatuses[0]}
            onChange={(e) => handleChange("status", e.target.value)}
            className="w-full bg-zinc-900/90 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 transition cursor-pointer"
          >
            {missionStatuses.map((s) => (
              <option key={s} value={s} className="bg-zinc-950 text-white">
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Destination */}
        <div className="space-y-1 sm:col-span-2">
          <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold flex items-center justify-between">
            <span>DESTINATION CELESTIAL TARGET *</span>
            {touched.destination && !isDestValid && (
              <span className="text-red-400 text-[9px]">DESTINATION REQUIRED</span>
            )}
          </label>
          <select
            value={mission.destination || destinations[0]}
            onChange={(e) => handleChange("destination", e.target.value)}
            onBlur={() => handleBlur("destination")}
            className="w-full bg-zinc-900/90 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-cyan-300 font-bold focus:outline-none focus:border-cyan-400 transition cursor-pointer"
          >
            {destinations.map((d) => (
              <option key={d} value={d} className="bg-zinc-950 text-white">
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Mission Objective */}
        <div className="space-y-1 sm:col-span-2">
          <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
            PRIMARY MISSION OBJECTIVE
          </label>
          <input
            type="text"
            value={mission.objective || ""}
            onChange={(e) => handleChange("objective", e.target.value)}
            placeholder="e.g. Deploy autonomous radiation sensors along Mars transit corridor"
            className="w-full bg-zinc-900/90 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-400 transition"
          />
        </div>

        {/* Mission Description */}
        <div className="space-y-1 sm:col-span-2">
          <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
            MISSION SYNOPSIS
          </label>
          <textarea
            rows={2}
            value={mission.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Short technical description of scientific payload, spacecraft bus, and operational trajectory."
            className="w-full bg-zinc-900/90 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-400 transition resize-none font-sans"
          />
        </div>

        {/* Launch Vehicle */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
            LAUNCH VEHICLE
          </label>
          <input
            type="text"
            value={mission.launchVehicle || ""}
            onChange={(e) => handleChange("launchVehicle", e.target.value)}
            placeholder="e.g. LVM3, Falcon Heavy, Starship, Ariane 6"
            className="w-full bg-zinc-900/90 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-400 transition"
          />
        </div>

        {/* Launch Site */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
            LAUNCH SITE
          </label>
          <input
            type="text"
            value={mission.launchSite || ""}
            onChange={(e) => handleChange("launchSite", e.target.value)}
            placeholder="e.g. SDSC Sriharikota, Cape Canaveral Space Force Station"
            className="w-full bg-zinc-900/90 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-400 transition"
          />
        </div>

        {/* Launch Date */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
            TARGET LAUNCH DATE
          </label>
          <input
            type="date"
            value={mission.launchDate || ""}
            onChange={(e) => handleChange("launchDate", e.target.value)}
            className="w-full bg-zinc-900/90 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400 transition"
          />
        </div>

        {/* Mission Duration */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
            NOMINAL MISSION DURATION
          </label>
          <input
            type="text"
            value={mission.duration || ""}
            onChange={(e) => handleChange("duration", e.target.value)}
            placeholder="e.g. 24 Months, 5 Years"
            className="w-full bg-zinc-900/90 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-400 transition"
          />
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
          disabled={!canProceed}
          className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
            canProceed
              ? "bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/20 cursor-pointer"
              : "bg-zinc-800 text-zinc-500 border border-white/5 cursor-not-allowed"
          }`}
        >
          <span>CONTINUE TO TRAJECTORY</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
