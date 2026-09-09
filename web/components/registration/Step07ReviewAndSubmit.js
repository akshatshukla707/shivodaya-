"use client";

import React, { useState } from "react";
import { CheckCircle2, ShieldCheck, ArrowRight, ArrowLeft, Edit3, Send, AlertTriangle, FileText, Check, ChevronDown, ChevronUp } from "lucide-react";

export default function Step07ReviewAndSubmit({
  formData,
  onEditStep,
  onSubmit,
  isSubmitting,
  submissionStage, // "validating", "creating", "id", "email", "done"
  submissionResult,
  onReset
}) {
  const [accuracyConfirmed, setAccuracyConfirmed] = useState(false);
  const [openSections, setOpenSections] = useState({
    org: true,
    mission: true,
    traj: false,
    data: false,
    network: true,
    crew: false
  });

  const toggleSection = (key) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const {
    organization = {},
    mission = {},
    trajectory = {},
    dataAndTelemetry = {},
    radiation = {},
    network = {},
    crew = {},
    responsibility = {}
  } = formData;

  // If already submitted and result available, render Confirmation View
  if (submissionResult && submissionResult.success) {
    return (
      <div className="bg-zinc-950/95 border border-white/20 rounded-3xl p-6 sm:p-10 space-y-6 text-center font-mono animate-in fade-in duration-300">
        
        <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center mx-auto text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] text-cyan-400 tracking-[0.3em] uppercase font-bold">
            PHASE 04 COMPLETE // MISSION INGESTED
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">
            MISSION REGISTRATION RECEIVED
          </h2>
          <p className="text-xs text-zinc-400 font-sans max-w-lg mx-auto">
            Your spacecraft mission profile has been submitted to Shivodaya Mission Operations for engineering verification.
          </p>
        </div>

        {/* Application Credentials Card */}
        <div className="max-w-xl mx-auto p-5 rounded-2xl bg-black border border-cyan-500/30 text-left space-y-3 shadow-xl">
          <div className="flex justify-between items-center border-b border-white/10 pb-2.5">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest">OFFICIAL APPLICATION ID</span>
            <span className="text-base font-bold text-cyan-400 tracking-wider">
              {submissionResult.applicationId}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-zinc-500 uppercase text-[9px]">MISSION NAME:</span>
              <div className="text-white font-bold">{submissionResult.mission}</div>
            </div>
            <div>
              <span className="text-zinc-500 uppercase text-[9px]">ORGANIZATION:</span>
              <div className="text-white font-medium">{submissionResult.organization}</div>
            </div>
            <div>
              <span className="text-zinc-500 uppercase text-[9px]">REQUESTED ROLE:</span>
              <div className="text-cyan-300 font-semibold">{submissionResult.role}</div>
            </div>
            <div>
              <span className="text-zinc-500 uppercase text-[9px]">APPLICATION STATUS:</span>
              <div className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                {submissionResult.status || "VERIFICATION PENDING"}
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-2 text-[11px] text-zinc-400 font-sans">
            A confirmation dispatch has been sent to <strong className="text-white">{organization.email}</strong>.
            <div className="text-[10px] text-zinc-500 italic pt-1">
              Note: Registration received does not constitute active network authorization. An engineer from Shivodaya Flight Integration will review telemetry formats prior to issuing cryptographic node keys.
            </div>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={onReset}
            className="px-6 py-2.5 rounded-full border border-white/20 hover:border-white text-xs uppercase tracking-wider text-white hover:bg-white hover:text-black transition-all"
          >
            REGISTER ANOTHER SPACECRAFT
          </button>
        </div>

      </div>
    );
  }

  return (
    <div className="space-y-6 font-mono animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 text-cyan-400 text-[10px] font-bold tracking-widest uppercase">
          <FileText className="w-3.5 h-3.5" />
          <span>STEP 07 // AUDIT & SUBMISSION</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide mt-1">
          REVIEW MISSION ONBOARDING PROFILE
        </h2>
        <p className="text-xs text-zinc-400 font-sans mt-0.5">
          Verify all declared spacecraft parameters, telemetry feeds, and organizational authorities prior to submission.
        </p>
      </div>

      {/* Review Summaries Accordion */}
      <div className="space-y-3 text-xs">
        
        {/* 1. Organization Summary */}
        <div className="rounded-xl bg-zinc-950/90 border border-white/10 overflow-hidden">
          <div className="p-4 flex items-center justify-between bg-zinc-900/60 cursor-pointer" onClick={() => toggleSection("org")}>
            <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-white">
              <span>01 // ORGANIZATION</span>
              <span className="text-zinc-500 text-[11px]">({organization.name || "None declared"})</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onEditStep(1); }}
                className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 uppercase"
              >
                <Edit3 className="w-3 h-3" /> EDIT
              </button>
              {openSections.org ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
            </div>
          </div>
          {openSections.org && (
            <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-white/5 text-[11px]">
              <div>
                <span className="text-zinc-500 text-[9px] uppercase">AGENCY CODE</span>
                <div className="text-white font-bold font-mono">{organization.agencyCode || "—"}</div>
              </div>
              <div>
                <span className="text-zinc-500 text-[9px] uppercase">TYPE</span>
                <div className="text-zinc-300">{organization.type || "—"}</div>
              </div>
              <div>
                <span className="text-zinc-500 text-[9px] uppercase">JURISDICTION</span>
                <div className="text-zinc-300">{organization.country || "—"}</div>
              </div>
              <div>
                <span className="text-zinc-500 text-[9px] uppercase">OPERATIONS EMAIL</span>
                <div className="text-cyan-300 font-mono truncate">{organization.email || "—"}</div>
              </div>
            </div>
          )}
        </div>

        {/* 2. Mission Identity Summary */}
        <div className="rounded-xl bg-zinc-950/90 border border-white/10 overflow-hidden">
          <div className="p-4 flex items-center justify-between bg-zinc-900/60 cursor-pointer" onClick={() => toggleSection("mission")}>
            <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-white">
              <span>02 // MISSION PROFILE</span>
              <span className="text-zinc-500 text-[11px]">({mission.name || "None declared"})</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onEditStep(2); }}
                className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 uppercase"
              >
                <Edit3 className="w-3 h-3" /> EDIT
              </button>
              {openSections.mission ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
            </div>
          </div>
          {openSections.mission && (
            <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-white/5 text-[11px]">
              <div>
                <span className="text-zinc-500 text-[9px] uppercase">DESTINATION</span>
                <div className="text-white font-bold">{mission.destination || "—"}</div>
              </div>
              <div>
                <span className="text-zinc-500 text-[9px] uppercase">TYPE</span>
                <div className="text-cyan-300">{mission.type || "—"}</div>
              </div>
              <div>
                <span className="text-zinc-500 text-[9px] uppercase">LAUNCH VEHICLE</span>
                <div className="text-zinc-300">{mission.launchVehicle || "TBD"}</div>
              </div>
              <div>
                <span className="text-zinc-500 text-[9px] uppercase">TARGET DATE</span>
                <div className="text-zinc-300">{mission.launchDate || "TBD"}</div>
              </div>
            </div>
          )}
        </div>

        {/* 3. Trajectory Summary */}
        <div className="rounded-xl bg-zinc-950/90 border border-white/10 overflow-hidden">
          <div className="p-4 flex items-center justify-between bg-zinc-900/60 cursor-pointer" onClick={() => toggleSection("traj")}>
            <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-white">
              <span>03 // TRAJECTORY & EPHEMERIS</span>
              <span className="text-zinc-500 text-[11px]">({trajectory.regime || "Heliocentric"})</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onEditStep(3); }}
                className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 uppercase"
              >
                <Edit3 className="w-3 h-3" /> EDIT
              </button>
              {openSections.traj ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
            </div>
          </div>
          {openSections.traj && (
            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-white/5 text-[11px]">
              <div>
                <span className="text-zinc-500 text-[9px] uppercase">OPERATIONAL PHASE</span>
                <div className="text-white font-medium">{trajectory.phase || "Cruise"}</div>
              </div>
              <div>
                <span className="text-zinc-500 text-[9px] uppercase">TRAJECTORY REGIME</span>
                <div className="text-cyan-300">{trajectory.regime || "—"}</div>
              </div>
              <div>
                <span className="text-zinc-500 text-[9px] uppercase">EPHEMERIS VECTOR FILE</span>
                <div className="text-emerald-400 font-mono">
                  {trajectory.ephemerisFileName ? `✓ ${trajectory.ephemerisFileName}` : "None Uploaded"}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. Data & Radiation Summary */}
        <div className="rounded-xl bg-zinc-950/90 border border-white/10 overflow-hidden">
          <div className="p-4 flex items-center justify-between bg-zinc-900/60 cursor-pointer" onClick={() => toggleSection("data")}>
            <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-white">
              <span>04 // DATA & SENSORS</span>
              <span className="text-zinc-500 text-[11px]">({radiation.hasSensors === "YES" ? "Radiation Sentry" : "Telemetry Only"})</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onEditStep(4); }}
                className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 uppercase"
              >
                <Edit3 className="w-3 h-3" /> EDIT
              </button>
              {openSections.data ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
            </div>
          </div>
          {openSections.data && (
            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-white/5 text-[11px]">
              <div>
                <span className="text-zinc-500 text-[9px] uppercase">TELEMETRY DOWNLINK</span>
                <div className="text-white font-medium">{dataAndTelemetry.availability || "None"}</div>
              </div>
              <div>
                <span className="text-zinc-500 text-[9px] uppercase">RADIATION SENSORS</span>
                <div className={radiation.hasSensors === "YES" ? "text-amber-400 font-bold" : "text-zinc-400"}>
                  {radiation.hasSensors === "YES" ? "YES (Active Detectors)" : "NO"}
                </div>
              </div>
              <div>
                <span className="text-zinc-500 text-[9px] uppercase">CRITICAL ALERT GENERATION</span>
                <div className={radiation.canGenerateAlert ? "text-emerald-400 font-bold" : "text-zinc-500"}>
                  {radiation.canGenerateAlert ? "AUTHORIZED" : "DISABLED"}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 5. Network Role Summary */}
        <div className="rounded-xl bg-zinc-950/90 border border-white/10 overflow-hidden">
          <div className="p-4 flex items-center justify-between bg-zinc-900/60 cursor-pointer" onClick={() => toggleSection("network")}>
            <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-white">
              <span>05 // NETWORK ROLE</span>
              <span className="text-cyan-400 font-bold text-[11px]">({network.primaryRole || "Hybrid Node"})</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onEditStep(5); }}
                className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 uppercase"
              >
                <Edit3 className="w-3 h-3" /> EDIT
              </button>
              {openSections.network ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
            </div>
          </div>
          {openSections.network && (
            <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-white/5 text-[11px]">
              <div>
                <span className="text-zinc-500 text-[9px] uppercase">NODE ARCHETYPE</span>
                <div className="text-cyan-300 font-bold">{network.primaryRole || "Hybrid Node"}</div>
              </div>
              <div>
                <span className="text-zinc-500 text-[9px] uppercase">RECEIVE ALERTS</span>
                <div className={network.sendAlerts ? "text-emerald-400" : "text-zinc-500"}>{network.sendAlerts ? "YES" : "NO"}</div>
              </div>
              <div>
                <span className="text-zinc-500 text-[9px] uppercase">RELAY FOR OTHERS</span>
                <div className={network.relayAlerts ? "text-purple-400 font-bold" : "text-zinc-500"}>{network.relayAlerts ? "YES (BPv7)" : "NO"}</div>
              </div>
              <div>
                <span className="text-zinc-500 text-[9px] uppercase">PRIORITY LEVEL</span>
                <div className="text-white font-medium">{network.priority || "High"}</div>
              </div>
            </div>
          )}
        </div>

        {/* 6. Crew & Governance Summary */}
        <div className="rounded-xl bg-zinc-950/90 border border-white/10 overflow-hidden">
          <div className="p-4 flex items-center justify-between bg-zinc-900/60 cursor-pointer" onClick={() => toggleSection("crew")}>
            <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-white">
              <span>06 // CREW & RESPONSIBILITY</span>
              <span className="text-zinc-500 text-[11px]">({crew.isCrewed === "YES" ? `${crew.members?.length || 1} Astronauts` : "Robotic"})</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onEditStep(6); }}
                className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 uppercase"
              >
                <Edit3 className="w-3 h-3" /> EDIT
              </button>
              {openSections.crew ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
            </div>
          </div>
          {openSections.crew && (
            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-white/5 text-[11px]">
              <div>
                <span className="text-zinc-500 text-[9px] uppercase">CREW STATUS</span>
                <div className={crew.isCrewed === "YES" ? "text-amber-400 font-bold" : "text-zinc-400"}>
                  {crew.isCrewed === "YES" ? `${crew.members?.length || 1} Human Crew` : "Uncrewed Robotic"}
                </div>
              </div>
              <div>
                <span className="text-zinc-500 text-[9px] uppercase">CHIEF FLIGHT SURGEON</span>
                <div className="text-white">{crew.medicalOfficer || "N/A (Robotic)"}</div>
              </div>
              <div>
                <span className="text-zinc-500 text-[9px] uppercase">24/7 DUTY CONSOLE</span>
                <div className="text-zinc-300 truncate">{responsibility.primaryOps || "On File"}</div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Accuracy Verification Checkbox */}
      <div className="p-4 rounded-xl bg-zinc-950 border border-white/10 space-y-3">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={accuracyConfirmed}
            onChange={(e) => setAccuracyConfirmed(e.target.checked)}
            className="mt-1 accent-cyan-400 w-4 h-4 rounded cursor-pointer"
          />
          <span className="text-xs text-zinc-300 font-sans leading-relaxed">
            I confirm the information provided is accurate and representative of authorized mission parameters. I understand that registration submits this spacecraft profile for review and does not constitute guaranteed network access until formal node authorization is granted.
          </span>
        </label>
      </div>

      {/* Submission Progression Feedback */}
      {isSubmitting && (
        <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-center space-y-2 animate-in fade-in">
          <div className="flex items-center justify-center gap-2 text-cyan-300 text-xs font-bold uppercase">
            <span className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <span>
              {submissionStage === "validating" && "VALIDATING MISSION PROFILE..."}
              {submissionStage === "creating" && "CREATING REGISTRATION RECORD..."}
              {submissionStage === "id" && "GENERATING OFFICIAL APPLICATION ID..."}
              {submissionStage === "email" && "DISPATCHING CONFIRMATION DISPATCH..."}
              {(!submissionStage || submissionStage === "submitting") && "TRANSMITTING MISSION REGISTRATION..."}
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 font-sans">
            Please remain on this page while your mission profile is registered into the Shivodaya operational queue.
          </p>
        </div>
      )}

      {/* Navigation Actions */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onEditStep(6)}
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/15 text-zinc-300 hover:text-white text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK</span>
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={!accuracyConfirmed || isSubmitting}
          className={`px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
            accuracyConfirmed && !isSubmitting
              ? "bg-cyan-500 hover:bg-cyan-400 text-black shadow-xl shadow-cyan-500/25 cursor-pointer scale-100 active:scale-95"
              : "bg-zinc-800 text-zinc-500 border border-white/5 cursor-not-allowed"
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isSubmitting ? "SUBMITTING..." : "SUBMIT MISSION REGISTRATION"}</span>
        </button>
      </div>

    </div>
  );
}
