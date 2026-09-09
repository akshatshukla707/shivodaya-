"use client";

import React, { useState } from "react";
import { Users, Shield, HeartPulse, Lock, ArrowRight, ArrowLeft, Plus, Trash2, KeyRound, Share2, CheckCircle2 } from "lucide-react";

export default function Step06CrewAndResponsibility({
  formData,
  updateFormData,
  onNext,
  onBack
}) {
  const {
    crew = {},
    responsibility = {},
    interoperability = {},
    security = {},
    dataSharing = {}
  } = formData;

  const handleCrewChange = (field, value) => {
    updateFormData("crew", { ...crew, [field]: value });
  };

  const handleResponsibilityChange = (field, value) => {
    updateFormData("responsibility", { ...responsibility, [field]: value });
  };

  const handleInteroperabilityChange = (field, value) => {
    updateFormData("interoperability", { ...interoperability, [field]: value });
  };

  const handleSecurityChange = (field, value) => {
    updateFormData("security", { ...security, [field]: value });
  };

  const handleDataSharingChange = (field, value) => {
    updateFormData("dataSharing", { ...dataSharing, [field]: value });
  };

  // Crew Members list helpers
  const crewMembers = crew.members || [];

  const addCrewMember = () => {
    const newMember = {
      id: `CRW-${crewMembers.length + 1}`,
      name: "",
      role: "Mission Specialist",
      responsibility: "Payload Operations",
      status: "Active"
    };
    handleCrewChange("members", [...crewMembers, newMember]);
  };

  const updateCrewMember = (index, field, val) => {
    const updated = [...crewMembers];
    updated[index] = { ...updated[index], [field]: val };
    handleCrewChange("members", updated);
  };

  const removeCrewMember = (index) => {
    const updated = crewMembers.filter((_, i) => i !== index);
    handleCrewChange("members", updated);
  };

  const toggleInteroperability = (cap) => {
    const current = interoperability.declaredCapabilities || [];
    const next = current.includes(cap) ? current.filter(c => c !== cap) : [...current, cap];
    handleInteroperabilityChange("declaredCapabilities", next);
  };

  const toggleDataPurpose = (purpose) => {
    const current = dataSharing.purposes || [];
    const next = current.includes(purpose) ? current.filter(p => p !== purpose) : [...current, purpose];
    handleDataSharingChange("purposes", next);
  };

  return (
    <div className="space-y-6 font-mono animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 text-cyan-400 text-[10px] font-bold tracking-widest uppercase">
          <Users className="w-3.5 h-3.5" />
          <span>STEP 06 // CREW PROFILE & MISSION GOVERNANCE</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide mt-1">
          WHO IS ON BOARD / RESPONSIBLE?
        </h2>
        <p className="text-xs text-zinc-400 font-sans mt-0.5">
          Establish the human flight complement, operational chain of command, 24/7 duty contacts, and data governance policies.
        </p>
      </div>

      {/* 1. CREWED MISSION SECTION */}
      <div className="bg-zinc-950/90 border border-white/10 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              CREW COMPLEMENT SPECIFICATION
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleCrewChange("isCrewed", "NO")}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                crew.isCrewed !== "YES" ? "bg-zinc-800 text-white" : "bg-black text-zinc-500 hover:text-white"
              }`}
            >
              ROBOTIC (UNCREWED)
            </button>
            <button
              type="button"
              onClick={() => {
                handleCrewChange("isCrewed", "YES");
                if (crewMembers.length === 0) addCrewMember();
              }}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                crew.isCrewed === "YES" ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/20" : "bg-black text-zinc-500 hover:text-white"
              }`}
            >
              CREWED MISSION
            </button>
          </div>
        </div>

        {crew.isCrewed === "YES" ? (
          <div className="space-y-4 animate-in fade-in">
            {/* Crew Member Rows */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
                  ASSIGNED ASTRONAUT COMPLEMENT ({crewMembers.length})
                </span>
                <button
                  type="button"
                  onClick={addCrewMember}
                  className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-cyan-300 text-[10px] font-bold uppercase flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3 h-3" /> ADD CREW MEMBER
                </button>
              </div>

              {crewMembers.map((m, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-400 font-mono">
                      ASTRONAUT #{idx + 1}
                    </span>
                    {crewMembers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCrewMember(idx)}
                        className="text-zinc-500 hover:text-red-400 transition-colors p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="text-[9px] uppercase text-zinc-500">FULL NAME</label>
                      <input
                        type="text"
                        value={m.name}
                        onChange={(e) => updateCrewMember(idx, "name", e.target.value)}
                        placeholder="e.g. Commander S. Rao"
                        className="w-full bg-black border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase text-zinc-500">ROLE</label>
                      <select
                        value={m.role}
                        onChange={(e) => updateCrewMember(idx, "role", e.target.value)}
                        className="w-full bg-black border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                      >
                        <option value="Commander">Commander</option>
                        <option value="Pilot">Pilot</option>
                        <option value="Mission Specialist">Mission Specialist</option>
                        <option value="Flight Engineer">Flight Engineer</option>
                        <option value="Medical Officer">Medical Officer</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] uppercase text-zinc-500">RESPONSIBILITY</label>
                      <input
                        type="text"
                        value={m.responsibility}
                        onChange={(e) => updateCrewMember(idx, "responsibility", e.target.value)}
                        placeholder="e.g. Avionics & Storm Shelter"
                        className="w-full bg-black border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase text-zinc-500">STATUS</label>
                      <select
                        value={m.status}
                        onChange={(e) => updateCrewMember(idx, "status", e.target.value)}
                        className="w-full bg-black border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                      >
                        <option value="Active">Active Flight Crew</option>
                        <option value="Reserve">Backup / Reserve</option>
                        <option value="Ground Simulation">Ground Simulation</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Crew Health & Medical Privacy Section */}
            <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase">
                <HeartPulse className="w-4 h-4 text-emerald-400" />
                <span>CREW RADIOLOGICAL HEALTH & MEDICAL PRIVACY PROTOCOL</span>
              </div>
              <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                Shivodaya uses personal dosimeter telemetry strictly for emergency storm shelter ingress calculations. Sensitive medical records are strictly protected under international space-flight privacy standards.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                <div className="space-y-1">
                  <label className="text-[9px] text-zinc-500 uppercase">HEALTH INTEGRATION MODE</label>
                  <select
                    value={crew.healthOption || "Secure health profile reference"}
                    onChange={(e) => handleCrewChange("healthOption", e.target.value)}
                    className="w-full bg-zinc-900 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="No health integration">No health integration</option>
                    <option value="Secure health profile reference">Secure health profile reference</option>
                    <option value="Secure health-data integration">Secure health-data integration</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-zinc-500 uppercase">CHIEF FLIGHT SURGEON</label>
                  <input
                    type="text"
                    value={crew.medicalOfficer || ""}
                    onChange={(e) => handleCrewChange("medicalOfficer", e.target.value)}
                    placeholder="e.g. Dr. E. Rostova"
                    className="w-full bg-zinc-900 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-zinc-500 uppercase">EMERGENCY MEDICAL CONTACT</label>
                  <input
                    type="email"
                    value={crew.emergencyMedicalContact || ""}
                    onChange={(e) => handleCrewChange("emergencyMedicalContact", e.target.value)}
                    placeholder="flight-surgeon@spacecraft.org"
                    className="w-full bg-zinc-900 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-zinc-900/40 border border-white/5 text-zinc-500 text-xs">
            No crew profile is required for this autonomous robotic mission. Radiation defense directives will apply to hardened electronic components and solid-state detectors.
          </div>
        )}
      </div>

      {/* 2. 24/7 EMERGENCY CONTACTS */}
      <div className="bg-zinc-950/90 border border-white/10 rounded-2xl p-5 space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
          24/7 MISSION OPERATIONS EMERGENCY CONTACTS
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
              PRIMARY FLIGHT OPERATIONS CONSOLE (24/7)
            </label>
            <input
              type="text"
              value={responsibility.primaryOps || ""}
              onChange={(e) => handleResponsibilityChange("primaryOps", e.target.value)}
              placeholder="Name, Desk Phone, and Secure Email"
              className="w-full bg-zinc-900/90 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-400 transition"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
              BACKUP / SECONDARY OPERATIONS CONSOLE
            </label>
            <input
              type="text"
              value={responsibility.secondaryOps || ""}
              onChange={(e) => handleResponsibilityChange("secondaryOps", e.target.value)}
              placeholder="Name and Standby Frequency / Phone"
              className="w-full bg-zinc-900/90 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-400 transition"
            />
          </div>
        </div>
      </div>

      {/* 3. TECHNICAL INTEROPERABILITY & PROTOCOL CAPABILITIES */}
      <div className="bg-zinc-950/90 border border-white/10 rounded-2xl p-5 space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
          DECLARED INTEROPERABILITY PROTOCOLS (OPTIONAL)
        </h3>

        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold block">
            SELECT SUPPORTED PROTOCOLS:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {["CCSDS Standard", "Space Packet Protocol", "DTN / BPv7", "IPN Node Architecture", "Optical Laser Direct", "Ka-Band RF"].map((cap) => {
              const isChecked = (interoperability.declaredCapabilities || []).includes(cap);
              return (
                <label
                  key={cap}
                  className={`flex items-center gap-2 p-2 rounded-lg border text-[11px] cursor-pointer transition-all select-none ${
                    isChecked
                      ? "bg-cyan-500/15 text-cyan-300 border-cyan-400/50 font-bold"
                      : "bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border-white/5"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleInteroperability(cap)}
                    className="accent-cyan-400 rounded"
                  />
                  <span>{cap}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
              TELEMETRY DICTIONARY FORMAT
            </label>
            <input
              type="text"
              value={interoperability.telemetryFormat || ""}
              onChange={(e) => handleInteroperabilityChange("telemetryFormat", e.target.value)}
              placeholder="e.g. XTCE XML, JSON Schema, Custom FlatBuffer"
              className="w-full bg-zinc-900/90 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-400 transition"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
              DATA SHARING PURPOSE
            </label>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {["Network operations", "Alert delivery", "Mission monitoring", "Research", "Safety analysis"].map((p) => {
                const isChecked = (dataSharing.purposes || []).includes(p);
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => toggleDataPurpose(p)}
                    className={`px-2 py-1 rounded text-[10px] uppercase font-bold border transition-colors ${
                      isChecked
                        ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50"
                        : "bg-zinc-900 text-zinc-500 border-white/5 hover:text-white"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
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
          <span>CONTINUE TO REVIEW & SUBMISSION</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
