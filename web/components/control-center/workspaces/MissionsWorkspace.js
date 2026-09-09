"use client";

import React, { useState, useEffect } from "react";
import { Rocket, Radio, Shield, Users, Network, ExternalLink, CheckCircle2, Compass, AlertTriangle, Cpu, FileText, Check, Clock, ChevronRight } from "lucide-react";

export default function MissionsWorkspace({
  activeMission = "MARS-01",
  setActiveMission,
  simulatedAlertActive = false,
  alertAcknowledged = true,
  onInspectItem
}) {
  const [activeTab, setActiveTab] = useState("fleet"); // "fleet" | "applications"
  const [applications, setApplications] = useState([]);
  const [isLoadingApps, setIsLoadingApps] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  const fetchApplications = async () => {
    setIsLoadingApps(true);
    try {
      const res = await fetch("/api/registration");
      if (res.ok) {
        const data = await res.json();
        setApplications(data.registrations || []);
        if (data.registrations?.length > 0 && !selectedApp) {
          setSelectedApp(data.registrations[0]);
        }
      }
    } catch (e) {
      console.error("Failed to fetch mission applications:", e);
    } finally {
      setIsLoadingApps(false);
    }
  };

  useEffect(() => {
    if (activeTab === "applications") {
      fetchApplications();
    }
  }, [activeTab]);

  const updateAppStatus = async (appId, newStatus) => {
    try {
      const res = await fetch("/api/registration", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: appId, status: newStatus })
      });
      if (res.ok) {
        const updated = await res.json();
        setApplications((prev) =>
          prev.map((a) => (a.applicationId === appId ? { ...a, status: updated.status, assignedNode: updated.assignedNode } : a))
        );
        if (selectedApp && selectedApp.applicationId === appId) {
          setSelectedApp((prev) => ({ ...prev, status: updated.status, assignedNode: updated.assignedNode }));
        }
      }
    } catch (e) {
      console.error("Failed to update status:", e);
    }
  };

  const missionsList = [
    {
      id: "MARS-01",
      name: "MARS-01 // CREWED EXPEDITION VEHICLE",
      destination: "Mars (Valles Marineris)",
      phase: "Trans-Mars Cruise Phase",
      radiation: simulatedAlertActive ? "CRITICAL // SEP HAZARD" : "ELEVATED // GCR BASELINE",
      radiationStatus: simulatedAlertActive ? "CRITICAL" : "ELEVATED",
      comm: "Nominal (Ka-Band & Laser Crosslink)",
      network: "Connected (DTN Node ipn:3.1)",
      crew: 4,
      crewStatus: simulatedAlertActive ? (alertAcknowledged ? "SHELTERED (WATER-WALL SEALED)" : "SHELTER INGRESS ACTIVE") : "HABITAT NOMINAL",
      status: simulatedAlertActive ? "ACTIVE DEFENSE" : "NOMINAL",
      orbit: "Heliocentric Transfer Orbit (1.38 AU)",
      velocity: "24.18 km/s",
      route: simulatedAlertActive ? "Prakash L1 -> Relay Gamma -> Relay Beta -> Akashdeep Mars" : "Prakash L1 -> Relay Alpha -> Relay Beta -> Akashdeep Mars",
      latency: "12.4m RTT",
      lastTelemetry: "13:58:24 UTC",
      lastAlert: simulatedAlertActive ? "Solar Particle Event (SPE) S3 Shockwave" : "None (Nominal Baseline)",
      participation: "Core Deep-Space Mobile Node & Life Science Habitat",
      type: "mission",
      provenance: "SHIVODAYA SIMULATION"
    },
    {
      id: "LUNAR-01",
      name: "LUNAR-01 // ARTEMIS GATEWAY ALPHA",
      destination: "Moon (Cislunar NRHO)",
      phase: "Lunar NRHO Orbit Ops",
      radiation: simulatedAlertActive ? "HIGH // UNSHIELDED CISLUNAR" : "NOMINAL",
      radiationStatus: simulatedAlertActive ? "HIGH" : "NOMINAL",
      comm: "Nominal (Optical Laser Transceiver)",
      network: "Connected (DTN Node ipn:2.1)",
      crew: 3,
      crewStatus: simulatedAlertActive ? "GATEWAY STORM SHELTER" : "NOMINAL",
      status: simulatedAlertActive ? "MONITORING" : "NOMINAL",
      orbit: "9:2 Lunar Resonant NRHO (Perilune 3,000 km)",
      velocity: "1.42 km/s",
      route: "Prakash L1 -> Lunar Gateway Sentry",
      latency: "1.4s RTT",
      lastTelemetry: "13:58:20 UTC",
      lastAlert: simulatedAlertActive ? "CME Plasma Front Ingress" : "None",
      participation: "Cislunar Backbone Relay & High-Power Optical Transceiver",
      type: "mission",
      provenance: "SHIVODAYA SIMULATION"
    },
    {
      id: "CHANDRAYAAN-BASE",
      name: "CHANDRAYAAN-BASE // SOUTH POLE HABITAT",
      destination: "Moon (Shackleton Rim)",
      phase: "Surface Long-Duration Habitation",
      radiation: "NOMINAL (Regolith Shielding Active)",
      radiationStatus: "NOMINAL",
      comm: "Nominal (S-Band Direct-to-Earth + Ka Relay)",
      network: "Connected (DTN Node ipn:5.1)",
      crew: 2,
      crewStatus: "SUBTERRANEAN LAVA TUBE SECURE",
      status: "NOMINAL",
      orbit: "Lunar Surface (89.9°S Latitude)",
      velocity: "0.00 km/s (Stationary)",
      route: "Prakash L1 -> Lunar Gateway -> Surface Transceiver",
      latency: "1.3s RTT",
      lastTelemetry: "13:58:15 UTC",
      lastAlert: "None",
      participation: "Lunar Surface Terminus & Geological Laboratory",
      type: "mission",
      provenance: "SHIVODAYA SIMULATION"
    },
    {
      id: "SENTRY-01",
      name: "SENTRY-01 // ISRO DEEP SPACE SENTRY",
      destination: "Sun-Earth L1 Lagrange",
      phase: "Heliospheric Radiation Sentinel Ops",
      radiation: "MONITORED // SENSOR ARRAY PEGGED",
      radiationStatus: "NOMINAL",
      comm: "Nominal (Deep Space Ka-Band)",
      network: "Connected (Encoder Node ipn:1.1)",
      crew: 0,
      crewStatus: "AUTONOMOUS ROBOTIC SENTRY",
      status: "NOMINAL",
      orbit: "L1 Halo Orbit (1.5M km Upstream Sol)",
      velocity: "0.22 km/s (Halo Stationkeeping)",
      route: "Prakash Encoder Lock-Free Ring Buffer",
      latency: "5.1s RTT",
      lastTelemetry: "13:58:22 UTC",
      lastAlert: simulatedAlertActive ? "Sensor Saturation Warning" : "None",
      participation: "Frontline Upstream Heliospheric Early-Warning Sentry",
      type: "mission",
      provenance: "SHIVODAYA SIMULATION"
    },
    {
      id: "AKASHDEEP-01",
      name: "AKASHDEEP-01 // MARS SURFACE TERMINAL",
      destination: "Mars (Valles Marineris)",
      phase: "Surface Operations & Base Station",
      radiation: simulatedAlertActive ? "CAUTION // ATMOSPHERIC SCATTERING" : "NOMINAL",
      radiationStatus: simulatedAlertActive ? "HIGH" : "NOMINAL",
      comm: "Nominal (Optical Receiver / Ka-Band)",
      network: "Connected (Target Node ipn:4.1)",
      crew: 2,
      crewStatus: simulatedAlertActive ? "HABITAT STORM BUNKER ACTIVE" : "NOMINAL SURFACE OPS",
      status: simulatedAlertActive ? "ACTIVE DEFENSE" : "NOMINAL",
      orbit: "Mars Surface (-14.0° Lat, 301.0° Lon)",
      velocity: "0.00 km/s (Surface)",
      route: "Relay Beta -> Akashdeep Reverse MLP Decoder",
      latency: "12.4m RTT",
      lastTelemetry: "13:58:24 UTC",
      lastAlert: simulatedAlertActive ? "Emergency Shockwave Telemetry Decoded" : "None",
      participation: "Primary Mars Surface Terminal & Reverse MLP Decoder",
      type: "mission",
      provenance: "SHIVODAYA SIMULATION"
    }
  ];

  const currentMission = missionsList.find((m) => m.id === activeMission) || missionsList[0];

  return (
    <div className="space-y-6 font-mono animate-in fade-in duration-200">
      
      {/* 1. Top Header & Sub-Tab Switcher */}
      <div className="bg-zinc-950/90 border border-white/10 rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Rocket className="w-4 h-4 text-cyan-400" />
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
                FEDERATED DEEP-SPACE MISSION FLEET & ONBOARDING
              </h2>
            </div>
            <p className="text-[11px] text-zinc-400 font-sans pt-0.5">
              Real-time active fleet status, communication states, and applicant mission node review queue.
            </p>
          </div>

          {/* Sub-Tab Switcher */}
          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => setActiveTab("fleet")}
              className={`px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider transition-all ${
                activeTab === "fleet"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/60 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                  : "bg-zinc-900 text-zinc-400 hover:text-white border border-white/5"
              }`}
            >
              ACTIVE FLEET ({missionsList.length})
            </button>
            <button
              onClick={() => setActiveTab("applications")}
              className={`px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                activeTab === "applications"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/60 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                  : "bg-zinc-900 text-zinc-400 hover:text-white border border-white/5"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>MISSION APPLICATIONS</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. SUB-VIEW A: ACTIVE FLEET TABLE & OPERATIONAL PROFILE */}
      {activeTab === "fleet" && (
        <div className="space-y-6">
          <div className="bg-zinc-950/90 border border-white/10 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-zinc-900/80 text-[10px] text-zinc-400 uppercase tracking-wider">
                    <th className="p-3.5">MISSION</th>
                    <th className="p-3.5">DESTINATION</th>
                    <th className="p-3.5">MISSION PHASE</th>
                    <th className="p-3.5">RADIATION</th>
                    <th className="p-3.5">COMMUNICATION</th>
                    <th className="p-3.5">NETWORK</th>
                    <th className="p-3.5 text-center">CREW</th>
                    <th className="p-3.5">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-zinc-300">
                  {missionsList.map((m) => {
                    const isSelected = activeMission === m.id;
                    return (
                      <tr
                        key={m.id}
                        onClick={() => {
                          if (setActiveMission) setActiveMission(m.id);
                          if (onInspectItem) onInspectItem(m);
                        }}
                        className={`transition-colors cursor-pointer group ${
                          isSelected ? "bg-cyan-500/10 hover:bg-cyan-500/15" : "hover:bg-white/5"
                        }`}
                      >
                        <td className="p-3.5 font-bold text-white group-hover:text-cyan-300 flex items-center gap-2">
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                          <span>{m.id}</span>
                        </td>
                        <td className="p-3.5 text-zinc-300">{m.destination}</td>
                        <td className="p-3.5 text-zinc-400">{m.phase}</td>
                        <td className="p-3.5 font-semibold">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${
                            m.radiationStatus === "CRITICAL" ? "bg-red-950/80 text-red-300 border border-red-500/40 animate-pulse" : m.radiationStatus === "HIGH" ? "bg-amber-950/80 text-amber-300 border border-amber-500/40" : "text-emerald-400"
                          }`}>
                            {m.radiation}
                          </span>
                        </td>
                        <td className="p-3.5 text-zinc-400 text-[11px]">{m.comm}</td>
                        <td className="p-3.5 text-cyan-300 text-[11px]">{m.network}</td>
                        <td className="p-3.5 text-center font-bold text-white">{m.crew > 0 ? m.crew : "—"}</td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            m.status === "ACTIVE DEFENSE" ? "bg-red-950/80 text-red-300 border border-red-500/40 animate-pulse" : "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                          }`}>
                            {m.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detailed Active Mission Context Card */}
          <div className="bg-zinc-950/90 border border-white/10 rounded-xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  DETAILED OPERATIONAL PROFILE // {currentMission.name}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-zinc-400">LAST TELEMETRY: {currentMission.lastTelemetry}</span>
                <button
                  onClick={() => onInspectItem && onInspectItem(currentMission)}
                  className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-cyan-300 text-xs flex items-center gap-1.5 transition-colors"
                >
                  <span>Inspect Mission</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-zinc-900/60 border border-white/5 space-y-1">
                <span className="text-zinc-500 uppercase text-[10px]">LOCATION / TRAJECTORY:</span>
                <div className="text-white font-medium">{currentMission.orbit}</div>
                <div className="text-[10px] text-zinc-400">Velocity: {currentMission.velocity}</div>
              </div>

              <div className="p-3 rounded-lg bg-zinc-900/60 border border-white/5 space-y-1">
                <span className="text-zinc-500 uppercase text-[10px]">MISSION PHASE:</span>
                <div className="text-cyan-300 font-medium">{currentMission.phase}</div>
                <div className="text-[10px] text-zinc-400">Target: {currentMission.destination}</div>
              </div>

              <div className="p-3 rounded-lg bg-zinc-900/60 border border-white/5 space-y-1">
                <span className="text-zinc-500 uppercase text-[10px]">COMMUNICATION STATE:</span>
                <div className="text-emerald-400 font-medium">{currentMission.comm}</div>
                <div className="text-[10px] text-amber-300">RTT: {currentMission.latency}</div>
              </div>

              <div className="p-3 rounded-lg bg-zinc-900/60 border border-white/5 space-y-1">
                <span className="text-zinc-500 uppercase text-[10px]">RADIATION CONTEXT:</span>
                <div className={`font-semibold ${currentMission.radiationStatus === "CRITICAL" ? "text-red-400" : "text-emerald-300"}`}>
                  {currentMission.radiation}
                </div>
                <div className="text-[10px] text-zinc-400">Last Alert: {currentMission.lastAlert}</div>
              </div>

              <div className="p-3 rounded-lg bg-zinc-900/60 border border-white/5 space-y-1">
                <span className="text-zinc-500 uppercase text-[10px]">ACTIVE SHIVODAYA ROUTE:</span>
                <div className="text-indigo-300 font-medium text-[11px] truncate">{currentMission.route}</div>
                <div className="text-[10px] text-zinc-400">Protocol: BPv7 Bundle Custody Transfer</div>
              </div>

              <div className="p-3 rounded-lg bg-zinc-900/60 border border-white/5 space-y-1">
                <span className="text-zinc-500 uppercase text-[10px]">CREW STATUS & PARTICIPATION:</span>
                <div className="text-white font-medium">{currentMission.crewStatus}</div>
                <div className="text-[10px] text-zinc-400">{currentMission.participation}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. SUB-VIEW B: MISSION APPLICATIONS REVIEW PORTAL */}
      {activeTab === "applications" && (
        <div className="space-y-6">
          <div className="bg-zinc-950/90 border border-white/10 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>EXTERNAL SPACECRAFT ONBOARDING APPLICATIONS ({applications.length})</span>
              </div>
              <span className="text-[10px] text-zinc-500">
                CLICK APPLICATION TO MANAGE LIFE CYCLE
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-zinc-900/80 text-[10px] text-zinc-400 uppercase tracking-wider">
                    <th className="p-3.5">APPLICATION ID</th>
                    <th className="p-3.5">MISSION</th>
                    <th className="p-3.5">ORGANIZATION</th>
                    <th className="p-3.5">NETWORK ROLE</th>
                    <th className="p-3.5">SUBMITTED</th>
                    <th className="p-3.5">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-zinc-300">
                  {applications.map((app) => {
                    const isSelected = selectedApp?.applicationId === app.applicationId;
                    return (
                      <tr
                        key={app.applicationId}
                        onClick={() => setSelectedApp(app)}
                        className={`transition-colors cursor-pointer group ${
                          isSelected ? "bg-cyan-500/15" : "hover:bg-white/5"
                        }`}
                      >
                        <td className="p-3.5 font-mono font-bold text-cyan-400 group-hover:underline">
                          {app.applicationId}
                        </td>
                        <td className="p-3.5 font-bold text-white">
                          {app.mission?.name}
                        </td>
                        <td className="p-3.5 text-zinc-300">
                          {app.organization?.name}
                        </td>
                        <td className="p-3.5 text-cyan-300">
                          {app.network?.primaryRole}
                        </td>
                        <td className="p-3.5 text-zinc-500 text-[11px]">
                          {app.createdAt ? app.createdAt.slice(0, 10) : "2026-09-08"}
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            app.status === "ACTIVE"
                              ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                              : app.status === "AUTHORIZED"
                              ? "bg-cyan-950 text-cyan-300 border border-cyan-500/40"
                              : app.status === "VERIFIED"
                              ? "bg-indigo-950 text-indigo-300 border border-indigo-500/40"
                              : app.status === "UNDER REVIEW"
                              ? "bg-amber-950 text-amber-300 border border-amber-500/40"
                              : "bg-zinc-800 text-zinc-300 border border-white/10"
                          }`}>
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detailed Application Review Panel */}
          {selectedApp && (
            <div className="bg-zinc-950/90 border border-white/10 rounded-xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase">APPLICATION PROFILE REVIEW</span>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    {selectedApp.mission?.name} // {selectedApp.applicationId}
                  </h3>
                </div>

                {/* Life-Cycle Status Transition Buttons */}
                <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                  {["SUBMITTED", "UNDER REVIEW", "VERIFIED", "AUTHORIZED", "ACTIVE", "HOLD", "REJECTED"].map((st) => (
                    <button
                      key={st}
                      onClick={() => updateAppStatus(selectedApp.applicationId, st)}
                      className={`px-2.5 py-1 rounded font-bold uppercase transition-all ${
                        selectedApp.status === st
                          ? "bg-cyan-500 text-black shadow-sm font-bold"
                          : "bg-zinc-900 text-zinc-400 hover:text-white border border-white/5"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Application Details Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded bg-zinc-900/60 border border-white/5 space-y-1">
                  <span className="text-zinc-500 text-[9px] uppercase">ORGANIZATION & CONTACT</span>
                  <div className="text-white font-bold">{selectedApp.organization?.name}</div>
                  <div className="text-zinc-400 text-[11px]">Email: {selectedApp.organization?.email}</div>
                  <div className="text-zinc-500 text-[10px]">Agency Code: {selectedApp.organization?.agencyCode}</div>
                </div>

                <div className="p-3 rounded bg-zinc-900/60 border border-white/5 space-y-1">
                  <span className="text-zinc-500 text-[9px] uppercase">MISSION & DESTINATION</span>
                  <div className="text-cyan-300 font-bold">{selectedApp.mission?.name}</div>
                  <div className="text-white">Target: {selectedApp.mission?.destination}</div>
                  <div className="text-zinc-400 text-[11px]">Type: {selectedApp.mission?.type}</div>
                </div>

                <div className="p-3 rounded bg-zinc-900/60 border border-white/5 space-y-1">
                  <span className="text-zinc-500 text-[9px] uppercase">TELEMETRY & RADIATION</span>
                  <div className="text-emerald-400 font-semibold">
                    Radiation: {selectedApp.radiation?.hasSensors === "YES" ? "Sensors Mounted" : "None"}
                  </div>
                  <div className="text-zinc-300">Downlink: {selectedApp.telemetry?.availability || "Planned"}</div>
                  <div className="text-zinc-500 text-[10px]">Relay Service: {selectedApp.network?.relayAlerts ? "Enabled" : "Disabled"}</div>
                </div>
              </div>

              {/* POST-AUTHORIZATION ASSIGNED NODE IDENTITY */}
              {(selectedApp.status === "AUTHORIZED" || selectedApp.status === "ACTIVE") && (
                <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/40 space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-300 uppercase flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      ASSIGNED MISSION NODE IDENTITY
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold uppercase">
                      READY FOR INTEGRATION
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                    <div className="p-2 rounded bg-black/50 border border-white/5">
                      <span className="text-zinc-500 text-[9px] uppercase">ASSIGNED IPN NODE:</span>
                      <div className="text-cyan-300 font-bold font-mono text-sm">{selectedApp.assignedNode || `ipn:${(selectedApp.organization?.agencyCode || "node").toLowerCase()}.1`}</div>
                    </div>
                    <div className="p-2 rounded bg-black/50 border border-white/5">
                      <span className="text-zinc-500 text-[9px] uppercase">NETWORK ROLE:</span>
                      <div className="text-white font-bold">{selectedApp.network?.primaryRole}</div>
                    </div>
                    <div className="p-2 rounded bg-black/50 border border-white/5">
                      <span className="text-zinc-500 text-[9px] uppercase">RADIATION CHANNEL:</span>
                      <div className="text-emerald-400 font-bold">{selectedApp.radiation?.hasSensors === "YES" ? "ENABLED" : "DISABLED"}</div>
                    </div>
                    <div className="p-2 rounded bg-black/50 border border-white/5">
                      <span className="text-zinc-500 text-[9px] uppercase">RELAY CAPABILITY:</span>
                      <div className="text-purple-300 font-bold">{selectedApp.network?.relayAlerts ? "ENABLED" : "DISABLED"}</div>
                    </div>
                  </div>

                  <div className="text-[10px] text-zinc-500 italic pt-1 border-t border-white/5">
                    * Protocol Notice: REGISTERED does not mean CONNECTED. CONNECTED does not mean ACTIVE. Cryptographic Phase 05 key exchange required prior to live mesh injection.
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      )}

      <div className="text-[10px] text-zinc-500 italic">
        * Scientific Transparency: Real NOAA and NASA observations are ingested for solar space weather. Mission telemetry and crew parameters represent an operational simulation prototype of the future federated deep space fleet.
      </div>

    </div>
  );
}
