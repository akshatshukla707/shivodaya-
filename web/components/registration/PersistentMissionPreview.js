"use client";

import React from "react";
import { ShieldCheck, Rocket, Radio, Network, Users, Activity, ChevronDown, ChevronUp, Sun, Sparkles, X } from "lucide-react";

export default function PersistentMissionPreview({
  formData,
  isSubmitted = false,
  applicationId = null,
  isMobileOpen = false,
  setIsMobileOpen,
  onClose
}) {
  const {
    organization = {},
    mission = {},
    radiation = {},
    dataAndTelemetry = {},
    network = {},
    crew = {}
  } = formData;

  const missionName = mission.name?.trim() || "UNNAMED MISSION";
  const destination = mission.destination || "DEEP SPACE";
  const missionType = mission.type || "ROBOTIC";
  const primaryRole = network.primaryRole || "Hybrid Node";

  const hasRadiation = radiation.hasSensors === "YES";
  const hasTelemetry = dataAndTelemetry.availability && dataAndTelemetry.availability !== "None";
  const hasRelay = !!network.relayAlerts;
  const crewCount = crew.isCrewed === "YES" ? (crew.members?.length || 1) : 0;

  // Role visual configuration
  const roleStyles = {
    "Radiation Sentinel": { color: "text-amber-400", border: "border-amber-500/40", bg: "bg-amber-950/30", label: "RADIATION SENTINEL" },
    "Relay Node": { color: "text-indigo-400", border: "border-indigo-500/40", bg: "bg-indigo-950/30", label: "RELAY FORWARDER" },
    "Mission Endpoint": { color: "text-cyan-400", border: "border-cyan-500/40", bg: "bg-cyan-950/30", label: "ALERT RECEIVER" },
    "Hybrid Node": { color: "text-emerald-400", border: "border-emerald-500/40", bg: "bg-emerald-950/30", label: "FULL TRIAD PARTICIPANT" },
    "Data Contributor": { color: "text-sky-400", border: "border-sky-500/40", bg: "bg-sky-950/30", label: "ENVIRONMENTAL CONTRIBUTOR" },
    "Observer": { color: "text-zinc-400", border: "border-zinc-500/40", bg: "bg-zinc-950/30", label: "PASSIVE OBSERVER" }
  }[primaryRole] || { color: "text-cyan-400", border: "border-cyan-500/40", bg: "bg-cyan-950/30", label: "HYBRID NODE" };

  return (
    <aside className="w-full font-mono">
      
      {/* Mobile Collapsible Header */}
      <div className="lg:hidden mb-4">
        <button
          type="button"
          onClick={() => setIsMobileOpen && setIsMobileOpen(!isMobileOpen)}
          className="w-full p-3 rounded-xl bg-zinc-950 border border-white/10 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-cyan-300"
        >
          <div className="flex items-center gap-2">
            <Rocket className="w-3.5 h-3.5 text-cyan-400" />
            <span>MISSION PREVIEW: {missionName}</span>
          </div>
          {isMobileOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Preview Card */}
      <div className={`rounded-2xl bg-zinc-950/95 border border-white/10 p-5 space-y-5 shadow-2xl backdrop-blur-xl ${
        isMobileOpen ? "block" : "hidden lg:block"
      }`}>
        
        {/* Top Title & Status */}
        <div className="flex items-start justify-between border-b border-white/10 pb-3">
          <div>
            <div className="text-[9px] text-zinc-500 uppercase tracking-widest font-semibold">
              MISSION PROFILE PREVIEW
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider truncate max-w-[200px] mt-0.5">
              {missionName}
            </h3>
            <span className="text-[10px] text-zinc-400 truncate block">
              {organization.name?.trim() || "Applicant Organization"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
              isSubmitted
                ? "bg-amber-950/80 text-amber-300 border border-amber-500/40 animate-pulse"
                : "bg-zinc-900 text-zinc-400 border border-white/10"
            }`}>
              {isSubmitted ? "VERIFICATION PENDING" : "DRAFT PROFILE"}
            </span>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
                title="Close Preview Drawer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Essential Mission Metadata */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-white/5 space-y-0.5">
            <span className="text-[9px] text-zinc-500 uppercase">DESTINATION</span>
            <div className="text-white font-semibold text-[11px] truncate">{destination}</div>
          </div>

          <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-white/5 space-y-0.5">
            <span className="text-[9px] text-zinc-500 uppercase">MISSION TYPE</span>
            <div className="text-cyan-300 font-semibold text-[11px] truncate">{missionType}</div>
          </div>
        </div>

        {/* Network Role Badge */}
        <div className={`p-3 rounded-xl border ${roleStyles.border} ${roleStyles.bg} space-y-1`}>
          <div className="flex items-center justify-between text-[9px] text-zinc-400 uppercase tracking-wider">
            <span>NETWORK PARTICIPATION</span>
            <span className="text-emerald-400">REQUESTED</span>
          </div>
          <div className={`text-xs font-bold ${roleStyles.color} uppercase tracking-wide flex items-center gap-1.5`}>
            <Network className="w-3.5 h-3.5" />
            <span>{primaryRole}</span>
          </div>
          <div className="text-[10px] text-zinc-400 font-sans leading-tight pt-0.5">
            {primaryRole === "Radiation Sentinel" && "Monitors heliospheric particle fluxes and generates early shock warnings."}
            {primaryRole === "Relay Node" && "Stores and forwards delay-tolerant bundles along interplanetary optical crosslinks."}
            {primaryRole === "Mission Endpoint" && "Receives high-priority storm alerts to initiate astronaut shelter ingress."}
            {primaryRole === "Hybrid Node" && "Full participant: detects space weather, relays bundles, and secures crew/avionics."}
            {primaryRole === "Data Contributor" && "Feeds environmental and telemetry state vectors into the decentralized graph."}
            {primaryRole === "Observer" && "Receives global ephemeris updates and space weather alerts without relay obligations."}
          </div>
        </div>

        {/* 4 Feature Badges (Radiation, Telemetry, Relay, Crew) */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 rounded bg-zinc-900/80 border border-white/5 flex items-center justify-between">
            <span className="text-[10px] text-zinc-400">RADIATION</span>
            <span className={`text-[10px] font-bold ${hasRadiation ? "text-emerald-400" : "text-zinc-600"}`}>
              {hasRadiation ? "✓ YES" : "— NO"}
            </span>
          </div>

          <div className="p-2 rounded bg-zinc-900/80 border border-white/5 flex items-center justify-between">
            <span className="text-[10px] text-zinc-400">TELEMETRY</span>
            <span className={`text-[10px] font-bold ${hasTelemetry ? "text-cyan-300" : "text-zinc-600"}`}>
              {hasTelemetry ? "✓ YES" : "— NONE"}
            </span>
          </div>

          <div className="p-2 rounded bg-zinc-900/80 border border-white/5 flex items-center justify-between">
            <span className="text-[10px] text-zinc-400">RELAY MESH</span>
            <span className={`text-[10px] font-bold ${hasRelay ? "text-purple-300" : "text-zinc-600"}`}>
              {hasRelay ? "✓ YES" : "— NO"}
            </span>
          </div>

          <div className="p-2 rounded bg-zinc-900/80 border border-white/5 flex items-center justify-between">
            <span className="text-[10px] text-zinc-400">CREW</span>
            <span className={`text-[10px] font-bold ${crewCount > 0 ? "text-amber-300" : "text-zinc-500"}`}>
              {crewCount > 0 ? `${crewCount} HUMAN` : "0 (ROBOTIC)"}
            </span>
          </div>
        </div>

        {/* 2D Interactive Network Node Placement Visualization */}
        <div className="space-y-2 pt-1 border-t border-white/10">
          <div className="flex items-center justify-between text-[9px] text-zinc-500 uppercase tracking-widest font-semibold">
            <span>NETWORK INTEGRATION TOPOLOGY</span>
            <span className="text-cyan-400">AUTONOMOUS MESH</span>
          </div>

          <div className="w-full bg-black/80 rounded-xl p-3 border border-white/5 relative overflow-hidden">
            <svg viewBox="0 0 280 180" className="w-full h-36 select-none">
              <defs>
                <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Connecting Lines */}
              {/* Sun -> Prakash */}
              <line x1="140" y1="20" x2="140" y2="55" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 2" />
              {/* Prakash -> Richa */}
              <line x1="140" y1="55" x2="140" y2="95" stroke="#06b6d4" strokeWidth="1.5" />
              {/* Richa -> Relay Left */}
              <line x1="140" y1="95" x2="55" y2="145" stroke="#818cf8" strokeWidth="1.2" />
              {/* Richa -> Your Mission (Center) */}
              <line
                x1="140"
                y1="95"
                x2="140"
                y2="145"
                stroke={hasRelay || primaryRole === "Hybrid Node" ? "#22d3ee" : "#38bdf8"}
                strokeWidth={primaryRole === "Hybrid Node" ? "2.5" : "1.5"}
                strokeDasharray={primaryRole === "Observer" ? "4 3" : "none"}
              />
              {/* Richa -> Deep Mission Right */}
              <line x1="140" y1="95" x2="225" y2="145" stroke="#818cf8" strokeWidth="1.2" />

              {/* Crosslink: Relay Left <-> Your Mission */}
              {hasRelay && (
                <line x1="55" y1="145" x2="140" y2="145" stroke="#c084fc" strokeWidth="1.5" strokeDasharray="2 2" />
              )}
              {/* Crosslink: Your Mission <-> Deep Mission Right */}
              {hasRelay && (
                <line x1="140" y1="145" x2="225" y2="145" stroke="#c084fc" strokeWidth="1.5" strokeDasharray="2 2" />
              )}

              {/* Direct Sensor Vector from Sun if Radiation Sentinel */}
              {hasRadiation && (
                <path
                  d="M 140 20 Q 90 80 140 145"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                  className="animate-pulse"
                />
              )}

              {/* 1. Sun Node */}
              <circle cx="140" cy="20" r="12" fill="url(#sunGlow)" />
              <circle cx="140" cy="20" r="6" fill="#f59e0b" />
              <text x="140" y="32" fill="#fbbf24" fontSize="7" fontWeight="bold" textAnchor="middle">SOL</text>

              {/* 2. Prakash Node */}
              <circle cx="140" cy="55" r="5" fill="#06b6d4" />
              <text x="140" y="47" fill="#67e8f9" fontSize="6.5" textAnchor="middle">PRAKASH L1</text>

              {/* 3. Richa Node */}
              <circle cx="140" cy="95" r="6" fill="#6366f1" />
              <text x="140" y="87" fill="#a5b4fc" fontSize="6.5" textAnchor="middle">RICHA CORE</text>

              {/* 4. Left Relay */}
              <circle cx="55" cy="145" r="4.5" fill="#a855f7" />
              <text x="55" y="160" fill="#c084fc" fontSize="6" textAnchor="middle">RELAY α</text>

              {/* 5. YOUR MISSION (Center Node) */}
              <circle cx="140" cy="145" r="10" fill="url(#nodeGlow)" className="animate-pulse" />
              <circle
                cx="140"
                cy="145"
                r="6"
                fill={primaryRole === "Radiation Sentinel" ? "#f59e0b" : primaryRole === "Relay Node" ? "#a855f7" : "#06b6d4"}
                stroke="#fff"
                strokeWidth="1.5"
              />
              <text x="140" y="163" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">
                YOUR MISSION
              </text>

              {/* 6. Right Mission */}
              <circle cx="225" cy="145" r="4.5" fill="#10b981" />
              <text x="225" y="160" fill="#6ee7b7" fontSize="6" textAnchor="middle">MARS-01</text>
            </svg>

            <div className="text-center pt-1">
              <span className="text-[9px] text-cyan-300 font-sans tracking-wide">
                “This mission becomes a node in the Shivodaya deep-space defense mesh.”
              </span>
            </div>
          </div>
        </div>

        {/* Application ID if available */}
        {applicationId && (
          <div className="p-3 rounded-lg bg-zinc-900 border border-cyan-500/30 text-center space-y-0.5">
            <span className="text-[9px] text-zinc-500 uppercase">OFFICIAL APPLICATION IDENTIFIER</span>
            <div className="text-sm font-bold text-cyan-400 tracking-widest">{applicationId}</div>
          </div>
        )}

      </div>

    </aside>
  );
}
