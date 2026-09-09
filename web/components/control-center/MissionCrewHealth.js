"use client";

import React from "react";
import { HeartPulse, Radio, BatteryCharging, Thermometer, Compass, Activity, ShieldCheck, Users } from "lucide-react";

export default function MissionCrewHealth({
  activeMission = "AKASHDEEP-01",
  simulatedAlertActive = false
}) {
  const missionProfiles = {
    "AKASHDEEP-01": {
      name: "AKASHDEEP-01 (Mars Surface Terminal)",
      type: "Deep Space Target Node",
      comm: "Optical Laser / Ka-Band (12.4m latency, SNR 28 dB)",
      radiation: simulatedAlertActive ? "ELEVATED // CME FRONT APPROACHING" : "NOMINAL (0.04 mSv/hr baseline)",
      power: "98% (Multi-Mission RTG + Surface Solar)",
      thermal: "21.4°C (Nominal internal bay)",
      nav: "Mars Surface Lat -14.0° Long 301.0° (Valles Marineris)",
      status: simulatedAlertActive ? "CAUTION" : "NOMINAL",
      lastTelemetry: "2026-09-07 13:54:12 UTC",
      crew: [
        { id: "CDR-101", name: "Commander S. Sharma", role: "Mission Commander", status: "NOMINAL", dosimeter: "0.12 mSv accumulated", shelter: simulatedAlertActive ? "STANDBY IN SHELTER" : "NOMINAL OPERATIONS" },
        { id: "SCI-104", name: "Dr. E. Vance", role: "Astrodynamics Specialist", status: "NOMINAL", dosimeter: "0.11 mSv accumulated", shelter: simulatedAlertActive ? "STANDBY IN SHELTER" : "NOMINAL OPERATIONS" }
      ]
    },
    "LUNAR-01": {
      name: "LUNAR-01 (Artemis Gateway Relay)",
      type: "Cislunar Mesh Backbone",
      comm: "Direct Optical Crosslink (1.4s latency, SNR 42 dB)",
      radiation: "NOMINAL (0.02 mSv/hr)",
      power: "100% (Solar Electric Propulsion Array)",
      thermal: "19.8°C",
      nav: "Lunar Near-Rectilinear Halo Orbit (NRHO)",
      status: "NOMINAL",
      lastTelemetry: "2026-09-07 13:54:55 UTC",
      crew: [
        { id: "PLT-201", name: "Pilot M. Chen", role: "Lunar Station Lead", status: "NOMINAL", dosimeter: "0.08 mSv accumulated", shelter: "NOMINAL OPERATIONS" }
      ]
    },
    "MARS-01": {
      name: "MARS-01 (Crewed Transfer Vehicle)",
      type: "Interplanetary Transit Vessel",
      comm: "Ka-Band High-Gain Sentry Link (8.2m latency, SNR 19 dB)",
      radiation: simulatedAlertActive ? "ELEVATED // MESH ALERT FORWARDED" : "NOMINAL (0.05 mSv/hr)",
      power: "94% (Deployable Solar Wings)",
      thermal: "22.1°C",
      nav: "Mars Transfer Trajectory (Velocity 24.2 km/s)",
      status: simulatedAlertActive ? "CAUTION" : "NOMINAL",
      lastTelemetry: "2026-09-07 13:53:40 UTC",
      crew: [
        { id: "CDR-301", name: "Commander A. Nair", role: "Vessel Commander", status: "NOMINAL", dosimeter: "0.19 mSv accumulated", shelter: simulatedAlertActive ? "STORM SHELTER ENGAGED" : "HABITAT NOMINAL" },
        { id: "ENG-302", name: "Lead Eng. J. Dupont", role: "Systems Specialist", status: "NOMINAL", dosimeter: "0.18 mSv accumulated", shelter: simulatedAlertActive ? "STORM SHELTER ENGAGED" : "HABITAT NOMINAL" }
      ]
    },
    "DEEP-01": {
      name: "DEEP-01 (Outer Solar System Sentry)",
      type: "Autonomous Robotic Probe",
      comm: "Deep Space S-Band / Laser (24.1s latency, SNR 14 dB)",
      radiation: "NOMINAL (Heliospheric Background)",
      power: "99% (Next-Gen RTG)",
      thermal: "18.2°C",
      nav: "Sun-Earth L5 Lagrange Point",
      status: "NOMINAL",
      lastTelemetry: "2026-09-07 13:51:22 UTC",
      crew: []
    },
    "SIMULATION": {
      name: "SIMULATION (Multi-Node Sandbox)",
      type: "Virtual Testbed",
      comm: "Simulated Loopback (0.1ms latency)",
      radiation: simulatedAlertActive ? "CRITICAL EVENT SIMULATION" : "NOMINAL BASELINE",
      power: "100% (Simulated Bus)",
      thermal: "20.0°C",
      nav: "Virtual Grid Coordinate X:0 Y:0 Z:0",
      status: simulatedAlertActive ? "ELEVATED" : "NOMINAL",
      lastTelemetry: "LIVE SYNCHRONIZATION",
      crew: [
        { id: "SIM-001", name: "Synthetic Operator 01", role: "Autonomous Agent", status: "NOMINAL", dosimeter: "0.00 mSv", shelter: "ACTIVE MONITOR" }
      ]
    }
  };

  const profile = missionProfiles[activeMission] || missionProfiles["AKASHDEEP-01"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 font-mono">
      <div className="bg-zinc-950/90 border border-white/10 rounded-xl p-4 sm:p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-white">
              MISSION HEALTH // {activeMission}
            </h3>
          </div>
          <span className="px-2 py-0.5 rounded bg-amber-950/40 border border-amber-500/30 text-amber-400 text-[9px]">
            ◇ SIMULATED MISSION STATE
          </span>
        </div>

        <div className="space-y-2 text-xs pt-1">
          <div className="flex justify-between items-center p-2 rounded bg-zinc-900/60 border border-white/5">
            <span className="text-zinc-400 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-cyan-400" /> COMMUNICATION:
            </span>
            <span className="font-bold text-white text-right truncate max-w-[240px]">{profile.comm}</span>
          </div>

          <div className="flex justify-between items-center p-2 rounded bg-zinc-900/60 border border-white/5">
            <span className="text-zinc-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-amber-400" /> RADIATION CONTEXT:
            </span>
            <span className={`font-bold ${profile.status === "CAUTION" ? "text-amber-400" : "text-emerald-400"}`}>
              {profile.radiation}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded bg-zinc-900/60 border border-white/5 space-y-0.5">
              <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                <BatteryCharging className="w-3 h-3 text-emerald-400" /> POWER STATUS:
              </span>
              <div className="font-bold text-white text-xs">{profile.power}</div>
            </div>
            <div className="p-2 rounded bg-zinc-900/60 border border-white/5 space-y-0.5">
              <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                <Thermometer className="w-3 h-3 text-cyan-400" /> THERMAL BUS:
              </span>
              <div className="font-bold text-white text-xs">{profile.thermal}</div>
            </div>
          </div>

          <div className="p-2 rounded bg-zinc-900/60 border border-white/5 space-y-0.5">
            <span className="text-[10px] text-zinc-500 flex items-center gap-1">
              <Compass className="w-3 h-3 text-cyan-400" /> ORBITAL TRAJECTORY:
            </span>
            <div className="font-bold text-zinc-300 text-xs truncate">{profile.nav}</div>
          </div>
        </div>

        <div className="flex justify-between items-center text-[10px] text-zinc-500 pt-2 border-t border-white/5">
          <span>TELEMETRY SYNC: {profile.lastTelemetry}</span>
          <span className={`font-bold px-2 py-0.5 rounded ${profile.status === "CAUTION" ? "bg-amber-950/60 text-amber-300 border border-amber-500/30" : "bg-emerald-950/60 text-emerald-300 border border-emerald-500/30"}`}>
            ● {profile.status}
          </span>
        </div>
      </div>

      <div className="bg-zinc-950/90 border border-white/10 rounded-xl p-4 sm:p-5 space-y-3 flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-white">
                CREW HEALTH & SHELTER STATUS
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded bg-amber-950/40 border border-amber-500/30 text-amber-400 text-[9px]">
              ◇ SIMULATED CREW DATA
            </span>
          </div>

          {profile.crew && profile.crew.length > 0 ? (
            <div className="space-y-2.5 pt-2">
              {profile.crew.map((member) => (
                <div key={member.id} className="p-3 rounded-lg bg-zinc-900/70 border border-white/5 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span className="text-cyan-400 text-[10px]">[{member.id}]</span>
                      {member.name}
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                      ● {member.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-400 pt-1">
                    <div>ROLE: <span className="text-zinc-200 font-semibold">{member.role}</span></div>
                    <div>EXPOSURE: <span className="text-cyan-300 font-semibold">{member.dosimeter}</span></div>
                  </div>

                  <div className="text-[11px] flex items-center gap-1.5 pt-0.5">
                    <span className="text-zinc-500">PROTOCOL:</span>
                    <span className={`font-bold ${member.shelter.includes("SHELTER") ? "text-amber-400" : "text-zinc-300"}`}>
                      {member.shelter}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-zinc-500 text-xs space-y-1">
              <div>UNMANNED AUTONOMOUS SPACECRAFT</div>
              <div className="text-[10px]">No human crew aboard this mission platform.</div>
            </div>
          )}
        </div>

        <div className="text-[9px] text-zinc-500 font-sans leading-tight pt-2 border-t border-white/5">
          * Medical Disclaimer: Simulated values for demonstration. Does not represent actual astronaut medical records or validated biological dosimetry models.
        </div>
      </div>
    </div>
  );
}
