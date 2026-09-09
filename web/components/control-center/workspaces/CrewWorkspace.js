"use client";

import React, { useState } from "react";
import { Users, Shield, HeartPulse, AlertTriangle, CheckCircle2, Lock, Eye, ExternalLink } from "lucide-react";

export default function CrewWorkspace({
  activeMission = "MARS-01",
  simulatedAlertActive = false,
  alertAcknowledged = true,
  onInspectItem
}) {
  const [authorizedView, setAuthorizedView] = useState(false);

  const crewRoster = {
    "MARS-01": [
      {
        id: "CREW-M01-01",
        name: "Commander A. Nair",
        role: "Mission Commander / Astrodynamics Lead",
        agency: "ISRO / Global Deep Space Alliance",
        status: simulatedAlertActive ? (alertAcknowledged ? "SHELTERED" : "INGRESS ACTIVE") : "NOMINAL",
        level: simulatedAlertActive ? (alertAcknowledged ? "MONITOR" : "CRITICAL") : "NOMINAL",
        accumulatedDose: simulatedAlertActive ? "0.34 mSv (Transient Peak)" : "0.19 mSv (GCR Baseline)",
        hourlyRate: simulatedAlertActive ? "1.82 mSv/h (Unshielded CME Cone)" : "0.04 mSv/h (Hab Protected)",
        shelterState: simulatedAlertActive ? (alertAcknowledged ? "STORM SHELTER SECURED (Water-wall extended)" : "SHELTER INGRESS IN PROGRESS") : "MAIN HABITAT NOMINAL",
        heartRate: "72 bpm (Telemetry Normal)",
        lastUpdate: "13:58:20 UTC",
        notes: "Authorized for interplanetary transit radiation dose tracking. Medical privacy policy level 2 active."
      },
      {
        id: "CREW-M01-02",
        name: "Lead Eng. J. Dupont",
        role: "Flight Systems & Propulsion Specialist",
        agency: "ESA Operations / ISRO",
        status: simulatedAlertActive ? (alertAcknowledged ? "SHELTERED" : "INGRESS ACTIVE") : "NOMINAL",
        level: simulatedAlertActive ? (alertAcknowledged ? "MONITOR" : "CRITICAL") : "NOMINAL",
        accumulatedDose: simulatedAlertActive ? "0.31 mSv (Transient Peak)" : "0.18 mSv (GCR Baseline)",
        hourlyRate: simulatedAlertActive ? "1.82 mSv/h (Unshielded CME Cone)" : "0.04 mSv/h (Hab Protected)",
        shelterState: simulatedAlertActive ? (alertAcknowledged ? "STORM SHELTER SECURED (Water-wall extended)" : "SHELTER INGRESS IN PROGRESS") : "MAIN HABITAT NOMINAL",
        heartRate: "78 bpm (Nominal)",
        lastUpdate: "13:58:18 UTC",
        notes: "Power bus maintenance on standby during solar storm event."
      },
      {
        id: "CREW-M01-03",
        name: "Dr. Elena Rostova",
        role: "Medical Officer & Biosphere Lead",
        agency: "ESA / Shivodaya Partner",
        status: simulatedAlertActive ? (alertAcknowledged ? "SHELTERED" : "INGRESS ACTIVE") : "NOMINAL",
        level: simulatedAlertActive ? (alertAcknowledged ? "MONITOR" : "CRITICAL") : "NOMINAL",
        accumulatedDose: simulatedAlertActive ? "0.29 mSv (Transient Peak)" : "0.16 mSv (GCR Baseline)",
        hourlyRate: simulatedAlertActive ? "1.82 mSv/h (Unshielded CME Cone)" : "0.04 mSv/h (Hab Protected)",
        shelterState: simulatedAlertActive ? (alertAcknowledged ? "STORM SHELTER SECURED (Water-wall extended)" : "SHELTER INGRESS IN PROGRESS") : "MAIN HABITAT NOMINAL",
        heartRate: "68 bpm (Resting)",
        lastUpdate: "13:58:10 UTC",
        notes: "Monitoring autonomous radioprotectant dispensary and dosimeter badges."
      },
      {
        id: "CREW-M01-04",
        name: "Col. T. Hayashi",
        role: "Communications & Avionics Engineer",
        agency: "JAXA / Shivodaya",
        status: simulatedAlertActive ? (alertAcknowledged ? "SHELTERED" : "INGRESS ACTIVE") : "NOMINAL",
        level: simulatedAlertActive ? (alertAcknowledged ? "MONITOR" : "CRITICAL") : "NOMINAL",
        accumulatedDose: simulatedAlertActive ? "0.30 mSv (Transient Peak)" : "0.17 mSv (GCR Baseline)",
        hourlyRate: simulatedAlertActive ? "1.82 mSv/h (Unshielded CME Cone)" : "0.04 mSv/h (Hab Protected)",
        shelterState: simulatedAlertActive ? (alertAcknowledged ? "STORM SHELTER SECURED (Water-wall extended)" : "SHELTER INGRESS IN PROGRESS") : "MAIN HABITAT NOMINAL",
        heartRate: "74 bpm (Nominal)",
        lastUpdate: "13:58:04 UTC",
        notes: "Lock-free receiver telemetry link synchronized with Akashdeep-01 terminal."
      }
    ],
    "LUNAR-01": [
      {
        id: "CREW-L01-01",
        name: "Commander M. Chen",
        role: "Gateway Station Commander",
        agency: "NASA / International Partner",
        status: simulatedAlertActive ? "SHELTERED" : "NOMINAL",
        level: simulatedAlertActive ? "MONITOR" : "NOMINAL",
        accumulatedDose: simulatedAlertActive ? "0.16 mSv" : "0.08 mSv",
        hourlyRate: simulatedAlertActive ? "0.45 mSv/h" : "0.02 mSv/h",
        shelterState: simulatedAlertActive ? "HALO MODULE STORM SHELTER ENGAGED" : "NOMINAL STATION OPS",
        heartRate: "70 bpm",
        lastUpdate: "13:57:42 UTC",
        notes: "NRHO orbital shelter protocol nominal."
      },
      {
        id: "CREW-L01-02",
        name: "Flight Eng. K. Patel",
        role: "Laser Crosslink Specialist",
        agency: "ISRO Lunar Wing",
        status: simulatedAlertActive ? "SHELTERED" : "NOMINAL",
        level: simulatedAlertActive ? "MONITOR" : "NOMINAL",
        accumulatedDose: simulatedAlertActive ? "0.14 mSv" : "0.07 mSv",
        hourlyRate: simulatedAlertActive ? "0.45 mSv/h" : "0.02 mSv/h",
        shelterState: simulatedAlertActive ? "HALO MODULE STORM SHELTER ENGAGED" : "NOMINAL STATION OPS",
        heartRate: "65 bpm",
        lastUpdate: "13:57:30 UTC",
        notes: "Maintaining laser comm pointing lock toward Earth L1 Sentry."
      },
      {
        id: "CREW-L01-03",
        name: "Dr. Sarah Lindqvist",
        role: "Cislunar Science Lead",
        agency: "ESA Gateway",
        status: simulatedAlertActive ? "SHELTERED" : "NOMINAL",
        level: simulatedAlertActive ? "MONITOR" : "NOMINAL",
        accumulatedDose: simulatedAlertActive ? "0.15 mSv" : "0.08 mSv",
        hourlyRate: simulatedAlertActive ? "0.45 mSv/h" : "0.02 mSv/h",
        shelterState: simulatedAlertActive ? "HALO MODULE STORM SHELTER ENGAGED" : "NOMINAL STATION OPS",
        heartRate: "69 bpm",
        lastUpdate: "13:57:15 UTC",
        notes: "Secondary cosmic ray spectrometer logging solar particle flux."
      }
    ],
    "CHANDRAYAAN-BASE": [
      {
        id: "CREW-CB-01",
        name: "Habitat Commander R. Rao",
        role: "Surface Base Commander",
        agency: "ISRO Space Exploration Wing",
        status: "NOMINAL",
        level: "NOMINAL",
        accumulatedDose: "0.05 mSv",
        hourlyRate: "0.01 mSv/h (Regolith Protected)",
        shelterState: "SUBTERRANEAN LAVA TUBE HABITAT ACTIVE",
        heartRate: "66 bpm",
        lastUpdate: "13:56:50 UTC",
        notes: "Natural 4-meter basalt regolith provides complete solar flare shielding."
      },
      {
        id: "CREW-CB-02",
        name: "Dr. L. Fernandez",
        role: "Polar Volatiles Geologist",
        agency: "ESA / ISRO Joint Team",
        status: "NOMINAL",
        level: "NOMINAL",
        accumulatedDose: "0.06 mSv",
        hourlyRate: "0.01 mSv/h",
        shelterState: "SUBTERRANEAN LAVA TUBE HABITAT ACTIVE",
        heartRate: "71 bpm",
        lastUpdate: "13:56:40 UTC",
        notes: "Shackleton rim drilling operations suspended during solar event."
      }
    ],
    "SENTRY-01": []
  };

  const currentCrew = crewRoster[activeMission] || crewRoster["MARS-01"];

  return (
    <div className="space-y-6 font-mono animate-in fade-in duration-200">
      
      {/* 1. Header with Medical Privacy Notice & Simulation Provenance */}
      <div className="bg-zinc-950/90 border border-white/10 rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
                CREW HEALTH & RADIOLOGICAL DOSIMETRY // {activeMission}
              </h2>
            </div>
            <p className="text-[11px] text-zinc-400 font-sans pt-0.5">
              Astronaut personal dosimeter monitoring, storm shelter ingress telemetry, and occupational dose limits.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            <span className="px-2 py-0.5 rounded bg-amber-950/50 border border-amber-500/30 text-amber-300">
              ◇ SHIVODAYA SIMULATED CREW DATA
            </span>
            <button
              onClick={() => setAuthorizedView(!authorizedView)}
              className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              {authorizedView ? <Eye className="w-3 h-3 text-emerald-400" /> : <Lock className="w-3 h-3 text-amber-400" />}
              <span>{authorizedView ? "SURGEON PRIVACY ACTIVE" : "AUTHORIZE BIO-TELEMETRY"}</span>
            </button>
          </div>
        </div>

        {/* Radiation Storm Action Banner if Event is Active */}
        {simulatedAlertActive && (
          <div className="p-3.5 rounded-lg bg-red-950/30 border border-red-500/40 text-red-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 animate-pulse" />
              <div>
                <span className="font-bold tracking-wider text-red-300 uppercase">
                  SOLAR PARTICLE EVENT // CREW STORM SHELTER DIRECTIVE
                </span>
                <p className="text-[11px] text-zinc-300 font-sans mt-0.5">
                  High-energy proton flux exceeds nominal cruise thresholds. All crew members ordered into polyethylene/water-wall storm shelter.
                </p>
              </div>
            </div>
            <div className="px-2.5 py-1 rounded bg-red-900/60 border border-red-400/50 text-[10px] font-bold text-red-200 uppercase tracking-widest">
              {alertAcknowledged ? "✓ INGRESS ACKNOWLEDGED" : "● INGRESS IN PROGRESS"}
            </div>
          </div>
        )}

        {/* Top Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-zinc-900/80 border border-white/5 space-y-1">
            <div className="text-[10px] text-zinc-500 uppercase">MISSION COMPLEMENT</div>
            <div className="text-base font-bold text-white">
              {currentCrew.length === 0 ? "0 (UNCREWED ROBOTIC)" : `${currentCrew.length} ASTRONAUTS`}
            </div>
            <div className="text-[9px] text-zinc-400">All crew verified accounted for</div>
          </div>

          <div className="p-3 rounded-lg bg-zinc-900/80 border border-white/5 space-y-1">
            <div className="text-[10px] text-zinc-500 uppercase">SHELTER READINESS</div>
            <div className={`text-base font-bold truncate ${simulatedAlertActive ? "text-amber-400" : "text-emerald-400"}`}>
              {simulatedAlertActive ? "DEPLOYED (100%)" : "READY (PASSIVE)"}
            </div>
            <div className="text-[9px] text-zinc-400">Water-wall density 18 g/cm²</div>
          </div>

          <div className="p-3 rounded-lg bg-zinc-900/80 border border-white/5 space-y-1">
            <div className="text-[10px] text-zinc-500 uppercase">DOSE ACCUMULATION (AVG)</div>
            <div className="text-base font-bold text-cyan-300">
              {currentCrew.length > 0 ? currentCrew[0].accumulatedDose.split(" ")[0] + " mSv" : "N/A"}
            </div>
            <div className="text-[9px] text-zinc-400">Career Limit: 600 mSv (NASA/ESA)</div>
          </div>

          <div className="p-3 rounded-lg bg-zinc-900/80 border border-white/5 space-y-1">
            <div className="text-[10px] text-zinc-500 uppercase">MEDICAL PRIVACY PROTOCOL</div>
            <div className="text-sm font-bold text-zinc-300">ENFORCED</div>
            <div className="text-[9px] text-zinc-500">HIPAA / ESA Space Flight Ethics</div>
          </div>
        </div>

      </div>

      {/* 2. Crew Roster Table / Cards */}
      {currentCrew.length === 0 ? (
        <div className="bg-zinc-950/90 border border-white/10 rounded-xl p-8 text-center space-y-2">
          <Shield className="w-8 h-8 text-zinc-600 mx-auto" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300">UNCREWED AUTONOMOUS ASSET</h3>
          <p className="text-xs text-zinc-500 font-sans max-w-md mx-auto">
            {activeMission} is an unmanned robotic sentry monitor without astronaut personnel aboard. Radiological protection applies to hardened avionics.
          </p>
        </div>
      ) : (
        <div className="bg-zinc-950/90 border border-white/10 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              ASSIGNED PERSONNEL ROSTER & RADIOLOGICAL DOSIMETRY
            </h3>
            <span className="text-[10px] text-zinc-500">
              CLICK CREW MEMBER TO INSPECT
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentCrew.map((member) => (
              <div
                key={member.id}
                onClick={() => onInspectItem && onInspectItem({
                  type: "crew",
                  title: member.name,
                  id: member.id,
                  role: member.role,
                  status: member.status,
                  destination: activeMission,
                  description: `${member.role} aboard ${activeMission}. ${member.notes} Shelter State: ${member.shelterState}. Accumulated dose: ${member.accumulatedDose}.`,
                  time: member.lastUpdate,
                  source: "SHIVODAYA CREW TELEMETRY"
                })}
                className="p-4 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 border border-white/10 hover:border-cyan-400/50 cursor-pointer transition-all space-y-3 group"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {member.name}
                      </span>
                      <span className="text-[9px] text-zinc-500 uppercase">
                        ({member.id})
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-400 font-sans">
                      {member.role}
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                    member.level === "CRITICAL"
                      ? "bg-red-950/80 text-red-300 border border-red-500/40 animate-pulse"
                      : member.level === "MONITOR"
                      ? "bg-amber-950/80 text-amber-300 border border-amber-500/40"
                      : "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                  }`}>
                    {member.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] bg-black/40 p-2.5 rounded-lg border border-white/5">
                  <div>
                    <span className="text-zinc-500 uppercase">ACCUMULATED DOSE:</span>
                    <div className="text-cyan-300 font-semibold">{member.accumulatedDose}</div>
                  </div>
                  <div>
                    <span className="text-zinc-500 uppercase">DOSE RATE:</span>
                    <div className="text-white font-semibold">{member.hourlyRate}</div>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-white/5">
                    <span className="text-zinc-500 uppercase">SHELTER COUNTERMEASURE:</span>
                    <div className="text-zinc-300 font-medium truncate">{member.shelterState}</div>
                  </div>
                </div>

                {authorizedView && (
                  <div className="p-2.5 rounded bg-cyan-950/20 border border-cyan-500/20 text-[10px] space-y-1 animate-fadeIn">
                    <div className="text-cyan-400 font-semibold uppercase flex items-center gap-1.5">
                      <HeartPulse className="w-3 h-3" /> MEDICAL BIO-TELEMETRY (CLASSIFIED)
                    </div>
                    <div className="flex justify-between text-zinc-300">
                      <span>Resting Heart Rate:</span>
                      <span className="text-white font-mono">{member.heartRate}</span>
                    </div>
                    <div className="text-zinc-400 text-[9px] pt-1">
                      {member.notes}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-[9px] text-zinc-500 pt-1">
                  <span>LAST TELEMETRY: {member.lastUpdate}</span>
                  <span className="text-cyan-400 group-hover:underline flex items-center gap-1">
                    Inspect Bio-Profile <ExternalLink className="w-2.5 h-2.5" />
                  </span>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Operational Radiation Guidelines Reference */}
      <div className="bg-zinc-950/90 border border-white/10 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2 border-b border-white/10 pb-2.5">
          <Shield className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            SCIENTIFIC STANDARDS: HUMAN RADIOLOGICAL EXPOSURE THRESHOLDS
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] font-sans text-zinc-300">
          <div className="p-3 rounded bg-zinc-900/60 border border-white/5 space-y-1">
            <span className="font-bold text-emerald-400 uppercase font-mono text-[10px]">NOMINAL (GCR BASELINE)</span>
            <p className="text-zinc-400 text-[11px]">
              Daily exposure ~1.0–1.5 mSv during cruise. Passive aluminum/polyethylene walls provide adequate shielding. Normal activities authorized.
            </p>
          </div>
          <div className="p-3 rounded bg-zinc-900/60 border border-white/5 space-y-1">
            <span className="font-bold text-amber-400 uppercase font-mono text-[10px]">ELEVATED // PROTON STORM</span>
            <p className="text-zinc-400 text-[11px]">
              Solar Particle Events (SPE) can spike dose rates to &gt;100 mSv/h. Mandatory early alert triggers ingress into central water-jacket core shelter.
            </p>
          </div>
          <div className="p-3 rounded bg-zinc-900/60 border border-white/5 space-y-1">
            <span className="font-bold text-cyan-400 uppercase font-mono text-[10px]">SHIVODAYA TIME ADVANTAGE</span>
            <p className="text-zinc-400 text-[11px]">
              By bypassing the 4.8h Earth ground loop, Shivodaya delivers the alert in ~14 min, granting the crew an essential 18–45 min shelter preparation margin.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
