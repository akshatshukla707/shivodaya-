"use client";

import React from "react";
import { Database, ShieldAlert, ArrowRight, ArrowLeft, Upload, CheckCircle2, Lock } from "lucide-react";

export default function Step04DataAndRadiation({
  formData,
  updateFormData,
  onNext,
  onBack
}) {
  const { dataAndTelemetry = {}, radiation = {} } = formData;

  const handleTelemetryChange = (field, value) => {
    updateFormData("dataAndTelemetry", {
      ...dataAndTelemetry,
      [field]: value
    });
  };

  const handleRadiationChange = (field, value) => {
    updateFormData("radiation", {
      ...radiation,
      [field]: value
    });
  };

  const toggleTelemetryType = (type) => {
    const current = dataAndTelemetry.types || [];
    const next = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    handleTelemetryChange("types", next);
  };

  const toggleSensorType = (sensor) => {
    const current = radiation.sensorTypes || [];
    const next = current.includes(sensor)
      ? current.filter((s) => s !== sensor)
      : [...current, sensor];
    handleRadiationChange("sensorTypes", next);
  };

  const telemetryTypesList = [
    "Spacecraft Health",
    "Radiation",
    "Proton Flux",
    "Solar Activity",
    "X-Ray",
    "Solar Wind",
    "Position",
    "Power",
    "Thermal",
    "Payload",
    "Communication",
    "Crew Health",
    "Other"
  ];

  const sensorTypesList = [
    "Proton",
    "Electron",
    "X-Ray",
    "Gamma",
    "Dosimeter",
    "Solar Energetic Particles",
    "Other"
  ];

  return (
    <div className="space-y-6 font-mono animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 text-cyan-400 text-[10px] font-bold tracking-widest uppercase">
          <Database className="w-3.5 h-3.5" />
          <span>STEP 04 // SENSOR & TELEMETRY FEEDS</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide mt-1">
          WHAT CAN YOUR MISSION SEE?
        </h2>
        <p className="text-xs text-zinc-400 font-sans mt-0.5">
          Specify available downlink telemetry parameters, sensor sampling intervals, and radiation monitoring instrumentation.
        </p>
      </div>

      {/* 1. General Telemetry Availability & Delivery */}
      <div className="bg-zinc-950/90 border border-white/10 rounded-2xl p-5 space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2">
          TELEMETRY DOWNLINK AVAILABILITY
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="space-y-1 sm:col-span-1">
            <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
              TELEMETRY STATUS
            </label>
            <select
              value={dataAndTelemetry.availability || "Planned"}
              onChange={(e) => handleTelemetryChange("availability", e.target.value)}
              className="w-full bg-zinc-900/90 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 transition cursor-pointer"
            >
              <option value="None">None</option>
              <option value="Planned">Planned</option>
              <option value="Test Feed">Test Feed</option>
              <option value="Live During Mission">Live During Mission</option>
            </select>
          </div>

          <div className="space-y-1 sm:col-span-1">
            <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
              DELIVERY PROTOCOL
            </label>
            <select
              value={dataAndTelemetry.delivery || "API"}
              onChange={(e) => handleTelemetryChange("delivery", e.target.value)}
              className="w-full bg-zinc-900/90 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 transition cursor-pointer"
            >
              <option value="API">REST / GraphQL API</option>
              <option value="Stream">WebSocket / UDP Stream</option>
              <option value="File">Scheduled File Push (SFTP)</option>
              <option value="Scheduled Transfer">Delay-Tolerant Bundle (BPv7)</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="space-y-1 sm:col-span-1">
            <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
              UPDATE FREQUENCY
            </label>
            <input
              type="text"
              value={dataAndTelemetry.updateFrequency || ""}
              onChange={(e) => handleTelemetryChange("updateFrequency", e.target.value)}
              placeholder="e.g. 1 Hz, 60s, 5 Minutes"
              className="w-full bg-zinc-900/90 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-400 transition"
            />
          </div>
        </div>

        {/* Telemetry Types Checkbox Grid */}
        <div className="space-y-2 pt-2">
          <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold block">
            SELECT AVAILABLE TELEMETRY CHANNELS:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {telemetryTypesList.map((type) => {
              const isChecked = (dataAndTelemetry.types || []).includes(type);
              return (
                <label
                  key={type}
                  className={`flex items-center gap-2 p-2 rounded-lg border text-[11px] cursor-pointer transition-all select-none ${
                    isChecked
                      ? "bg-cyan-500/15 text-cyan-300 border-cyan-400/50 font-bold"
                      : "bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border-white/5"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleTelemetryType(type)}
                    className="accent-cyan-400 rounded"
                  />
                  <span>{type}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="p-3 rounded-lg bg-black/50 border border-white/5 flex items-center gap-2 text-[10px] text-zinc-400">
          <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Never supply API secrets, passwords, or authentication keys in the registration form. Interface credentials are exchanged securely during Phase 05 authorization.</span>
        </div>
      </div>

      {/* 2. SUB-PANEL: RADIATION MONITORING CAPABILITY */}
      <div className="bg-zinc-950/90 border border-amber-500/30 rounded-2xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              RADIATION MONITORING INSTRUMENTATION
            </h3>
          </div>
          <span className="px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/30 text-amber-300 text-[9px] font-bold">
            SHIVODAYA SENTRY NETWORK
          </span>
        </div>

        {/* Does this mission carry radiation sensors? */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-wider text-zinc-300 font-semibold block">
            DOES THIS MISSION CARRY ONBOARD RADIATION SENSORS?
          </label>
          <div className="flex items-center gap-3">
            {["YES", "NO", "PLANNED"].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => handleRadiationChange("hasSensors", opt)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                  radiation.hasSensors === opt
                    ? "bg-amber-500/20 text-amber-300 border-amber-400/60 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                    : "bg-zinc-900/80 text-zinc-400 hover:text-white border-white/5"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Expanded Radiation Sensor Options if YES */}
        {radiation.hasSensors === "YES" && (
          <div className="space-y-4 pt-3 border-t border-white/5 animate-in fade-in">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold block">
                MOUNTED DETECTOR SENSOR TYPES:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {sensorTypesList.map((sensor) => {
                  const isChecked = (radiation.sensorTypes || []).includes(sensor);
                  return (
                    <label
                      key={sensor}
                      className={`flex items-center gap-2 p-2 rounded-lg border text-[11px] cursor-pointer transition-all select-none ${
                        isChecked
                          ? "bg-amber-500/20 text-amber-300 border-amber-400/50 font-bold"
                          : "bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border-white/5"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSensorType(sensor)}
                        className="accent-amber-400 rounded"
                      />
                      <span>{sensor}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
                  SENSOR DATA MODE
                </label>
                <select
                  value={radiation.dataMode || "Continuous"}
                  onChange={(e) => handleRadiationChange("dataMode", e.target.value)}
                  className="w-full bg-zinc-900/90 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 transition cursor-pointer"
                >
                  <option value="Continuous">Continuous (High-frequency sampling)</option>
                  <option value="Event-based">Event-based (Threshold delta triggered)</option>
                  <option value="Scheduled">Scheduled Pass / Downlink</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
                  ALERT GENERATION LOGIC
                </label>
                <select
                  value={radiation.alertGeneration || "Both"}
                  onChange={(e) => handleRadiationChange("alertGeneration", e.target.value)}
                  className="w-full bg-zinc-900/90 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 transition cursor-pointer"
                >
                  <option value="Mission-generated">Autonomous Onboard Generator</option>
                  <option value="Shivodaya-assisted">Shivodaya Neural Assisted</option>
                  <option value="Both">Hybrid Autonomous + Shivodaya Verified</option>
                </select>
              </div>
            </div>

            {/* Can this mission generate a critical radiation alert? */}
            <div className="space-y-2 pt-2">
              <label className="text-[10px] uppercase tracking-wider text-zinc-300 font-semibold block">
                CAN THIS MISSION GENERATE A CRITICAL RADIATION ALERT INTO THE DEEP-SPACE MESH?
              </label>
              <div className="flex items-center gap-3">
                {[
                  { label: "YES (EMERGENCY BROADCAST AUTHORIZED)", val: true },
                  { label: "NO (PASSIVE OBSERVATION ONLY)", val: false }
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => handleRadiationChange("canGenerateAlert", opt.val)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                      radiation.canGenerateAlert === opt.val
                        ? "bg-amber-500/20 text-amber-300 border-amber-400/60 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                        : "bg-zinc-900/80 text-zinc-400 hover:text-white border-white/5"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
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
          <span>CONTINUE TO NETWORK ROLE</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
