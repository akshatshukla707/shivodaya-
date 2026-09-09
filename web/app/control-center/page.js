"use client";

import React, { useState, useEffect, useRef } from "react";
import EmployeeLogin from "@/components/control-center/EmployeeLogin";
import ControlCenterHeader from "@/components/control-center/ControlCenterHeader";
import WorkspaceNav from "@/components/control-center/WorkspaceNav";
import InspectorDrawer from "@/components/control-center/InspectorDrawer";

// 9 Specialized Workspaces
import OverviewWorkspace from "@/components/control-center/workspaces/OverviewWorkspace";
import RadiationWorkspace from "@/components/control-center/workspaces/RadiationWorkspace";
import SolarWorkspace from "@/components/control-center/workspaces/SolarWorkspace";
import MissionsWorkspace from "@/components/control-center/workspaces/MissionsWorkspace";
import NetworkWorkspace from "@/components/control-center/workspaces/NetworkWorkspace";
import CrewWorkspace from "@/components/control-center/workspaces/CrewWorkspace";
import TelemetryWorkspace from "@/components/control-center/workspaces/TelemetryWorkspace";
import AlertsWorkspace from "@/components/control-center/workspaces/AlertsWorkspace";
import SystemsWorkspace from "@/components/control-center/workspaces/SystemsWorkspace";

export default function ControlCenterPage() {
  // 1. Employee Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [operator, setOperator] = useState("ABC");
  const [activeMission, setActiveMission] = useState("MARS-01");
  const [simulationMode, setSimulationMode] = useState(false);

  // 2. Active Tab / Workspace State
  const [activeWorkspace, setActiveWorkspace] = useState("overview"); // overview, radiation, solar, missions, network, crew, telemetry, alerts, systems
  const [inspectedItem, setInspectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Check persisted session on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("shivodaya_operator");
      if (savedUser) {
        setOperator(savedUser);
        setIsLoggedIn(true);
      }
    } catch (e) {}
  }, []);

  const handleLoginSuccess = (callsign) => {
    setOperator(callsign || "ABC");
    setIsLoggedIn(true);
    try {
      localStorage.setItem("shivodaya_operator", callsign || "ABC");
    } catch (e) {}
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    try {
      localStorage.removeItem("shivodaya_operator");
    } catch (e) {}
  };

  // 3. Real Space-Weather Data State
  const [spaceWeatherData, setSpaceWeatherData] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");

  const fetchSpaceWeather = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/space-weather");
      if (res.ok) {
        const json = await res.json();
        setSpaceWeatherData(json);
        setLastUpdated(new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC");
      }
    } catch (err) {
      console.error("Failed to fetch space weather telemetry:", err);
    } finally {
      setIsLoadingData(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSpaceWeather();
    // Auto refresh every 60 seconds
    const interval = setInterval(fetchSpaceWeather, 60000);
    return () => clearInterval(interval);
  }, []);

  // 4. Signature 11-Step Demo & Simulation State
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [isRelayOffline, setIsRelayOffline] = useState(false);
  const [simulatedAlertActive, setSimulatedAlertActive] = useState(false);
  const [alertAcknowledged, setAlertAcknowledged] = useState(true);
  const [activeStage, setActiveStage] = useState(0); // 0 to 5 for AlertPipeline
  const demoTimerRef = useRef(null);

  // Dynamic Event Stream
  const [streamEvents, setStreamEvents] = useState([
    { time: "13:58:12", source: "DSCOVR L1", level: "INFO", message: "Solar wind speed nominal at 504 km/s; IMF Bz vector stable." },
    { time: "13:57:40", source: "GOES-18", level: "INFO", message: "HEPAD energetic proton channel flux below event threshold (1.09 pfu)." },
    { time: "13:55:00", source: "RICHA ROUTER", level: "INFO", message: "TVG Contact Plan synchronized across 124 interplanetary relay nodes." },
    { time: "13:50:22", source: "AKASHDEEP-01", level: "INFO", message: "Mars surface receiver telemetry heartbeat OK. Bit error rate 0.00%." }
  ]);

  // Immutable Cryptographic Audit Log
  const [auditLog, setAuditLog] = useState([
    { time: "13:55:00", entity: "RICHA C++17 ROUTER", action: "SYNC_CONTACT_GRAPH", hash: "a89f...2d14", status: "VERIFIED" },
    { time: "13:45:10", entity: "OPERATOR ABC", action: "LOGIN_CHALLENGE", hash: "9e4c...ff01", status: "AUTHORIZED" },
    { time: "13:30:00", entity: "PRAKASH C11 ENCODER", action: "HEARTBEAT_INGEST", hash: "7c1b...34e2", status: "SECURE" }
  ]);

  // Notification Feed
  const [notifications, setNotifications] = useState([
    { id: 1, type: "info", title: "Solar Sentry Synced", text: "NOAA/SDO telemetry connection nominal", time: "13:58 UTC" },
    { id: 2, type: "info", title: "Contact Plan Updated", text: "TVG Dijkstra routing table synchronized across 124 nodes", time: "13:55 UTC" },
    { id: 3, type: "warn", title: "Relay Custody Check", text: "Lunar Gateway buffer pool at 14% utilization", time: "13:42 UTC" }
  ]);

  const addStreamEvent = (source, level, message) => {
    const time = new Date().toISOString().split("T")[1].slice(0, 8);
    setStreamEvents((prev) => [{ time, source, level, message }, ...prev.slice(0, 40)]);
  };

  const addAuditEntry = (entity, action, status = "VERIFIED") => {
    const time = new Date().toISOString().split("T")[1].slice(0, 8);
    const hash = Math.random().toString(16).slice(2, 10) + "..." + Math.random().toString(16).slice(2, 6);
    setAuditLog((prev) => [{ time, entity, action, hash, status }, ...prev.slice(0, 30)]);
  };

  const addNotification = (title, text, type = "alert") => {
    const time = new Date().toISOString().split("T")[1].slice(0, 5) + " UTC";
    setNotifications((prev) => [{ id: Date.now(), title, text, time, type }, ...prev.slice(0, 10)]);
  };

  // Run the 11-Step Signature End-to-End Demonstration
  const runSignatureDemo = () => {
    if (isDemoRunning) return;
    setIsDemoRunning(true);
    setDemoStep(1);
    setSimulatedAlertActive(true);
    setAlertAcknowledged(false);
    setActiveStage(0);
    setIsRelayOffline(false);
    setSimulationMode(true);

    addStreamEvent("NOAA / SDO SENTRY", "CRITICAL", "SIGNATURE DEMO TRIGGERED: Major Class X-flare & CME eruption detected at L1.");
    addAuditEntry("SIMULATION_RUNNER", "TRIGGER_X_FLARE_EVENT", "COMMITTED");
    addNotification("Radiation Event Triggered", "Class X Solar Eruption & Proton Storm detected upstream.", "alert");

    let step = 1;
    if (demoTimerRef.current) clearInterval(demoTimerRef.current);

    demoTimerRef.current = setInterval(() => {
      step++;
      setDemoStep(step);

      if (step === 2) {
        // Prakash detects & compresses
        setActiveStage(1);
        addStreamEvent("PRAKASH ENCODER", "CRITICAL", "Rate-delta threshold tripped (dPhi/dt > 4.2). Lock-free JSCC encoded 32-float micro-vector.");
        addAuditEntry("PRAKASH_C11", "JSCC_VECTOR_ENCODE_32F", "VERIFIED");
      } else if (step === 3) {
        // Alert bundle created
        setActiveStage(2);
        addStreamEvent("BPv7 BUNDLE ENGINE", "CRITICAL", "High-priority alert bundle generated (ipn:1.1 -> ipn:3.1). Payload: 128 bytes.");
        addAuditEntry("BPv7_ENGINE", "CREATE_EMERGENCY_BUNDLE", "ENCRYPTED");
      } else if (step === 4) {
        // Richa evaluates routes
        setActiveStage(2);
        addStreamEvent("RICHA ROUTER", "WARN", "TVG Dijkstra computed primary path via Lunar Gateway Alpha (Sentry-01).");
      } else if (step === 5) {
        // Relay Alpha fails
        setIsRelayOffline(true);
        addStreamEvent("RICHA ROUTER", "CRITICAL", "FAULT INJECTED: Sentry-01 (Relay Alpha) link severed by solar occlusion / dead-zone!");
        addAuditEntry("RICHA_ROUTER", "DETECT_RELAY_A_BLACKOUT", "TRIGGERED");
        addNotification("Relay Alpha Blackout", "Primary link severed. Initiating TVG Dijkstra autonomous reroute.", "warn");
      } else if (step === 6) {
        // Richa reroutes via Gamma
        addStreamEvent("RICHA ROUTER", "WARN", "Blackout evasion engaged: TVG Dijkstra rerouted path dynamically through Relay Gamma (ESA L5).");
        addAuditEntry("RICHA_ROUTER", "AUTONOMOUS_REROUTE_GAMMA", "VERIFIED");
      } else if (step === 7) {
        // Alert travels through mesh
        setActiveStage(3);
        addStreamEvent("SPACE MESH RELAY", "INFO", "Laser crosslink custody transfer accepted by Relay Beta (Starship-04).");
      } else if (step === 8) {
        // Akashdeep receives
        setActiveStage(4);
        addStreamEvent("AKASHDEEP-01", "CRITICAL", "Mars receiver captured 32-float vector. Reverse MLP reconstructed full CME shockwave telemetry.");
        addAuditEntry("AKASHDEEP_C++", "REVERSE_MLP_DECODE", "CONFIRMED");
      } else if (step === 9) {
        // Mission HUD Alert displayed
        addStreamEvent("AKASHDEEP-01", "CRITICAL", "COMMAND HUD: RED RADIATION ALERT ACTIVE. Estimated proton shock arrival: 18 minutes.");
        addNotification("Mars HUD Alert Active", "Radiation storm alert rendered. Ingress to storm shelter ordered.", "alert");
      } else if (step === 10) {
        // Crew acknowledges
        setActiveStage(5);
        setAlertAcknowledged(true);
        addStreamEvent("MARS EXPEDITION CREW", "SUCCESS", "Crew ingress completed into shielded subterranean storm shelter. Radiation bulkheads sealed.");
        addAuditEntry("CREW_COMMAND", "SHELTER_INGRESS_ACK", "CONFIRMED");
      } else if (step === 11) {
        // Alert fully delivered & audit secured
        addStreamEvent("SHIVODAYA NETWORK", "SUCCESS", "END-TO-END DEMO COMPLETE: Alert delivered in 14.2 minutes (Bypassed 4.8h Earth ground loop). Zero packet loss.");
        addAuditEntry("AUDIT_LOG_LEDGER", "DELIVERY_COMPLETE_SHA256", "SEALED");
        addNotification("Demo Complete", "Alert delivered in 14.2 min. Cryptographic log sealed.", "info");
        setIsDemoRunning(false);
        clearInterval(demoTimerRef.current);
      }
    }, 2800);
  };

  const resetSimulation = () => {
    if (demoTimerRef.current) clearInterval(demoTimerRef.current);
    setIsDemoRunning(false);
    setDemoStep(0);
    setIsRelayOffline(false);
    setSimulatedAlertActive(false);
    setAlertAcknowledged(true);
    setActiveStage(0);
    setSimulationMode(false);
    addStreamEvent("SYSTEM OPERATOR", "INFO", "Simulation bench reset to nominal baseline state.");
    addNotification("Simulation Reset", "Control center restored to nominal baseline.", "info");
  };

  const toggleRelayFailure = () => {
    setIsRelayOffline((prev) => {
      const next = !prev;
      addStreamEvent(
        "FAULT INJECTION",
        next ? "WARN" : "INFO",
        next ? "Relay Alpha manually severed. Rerouting triggered." : "Relay Alpha restored to nominal online state."
      );
      addNotification(
        next ? "Relay Alpha Severed" : "Relay Alpha Restored",
        next ? "Manual fault injection: link severed." : "Link restored to nominal online state.",
        next ? "warn" : "info"
      );
      return next;
    });
  };

  const handleAcknowledgeAlert = (alertId) => {
    setAlertAcknowledged(true);
    addStreamEvent("OPERATOR ABC", "SUCCESS", `Mission Alert [${alertId}] manually acknowledged.`);
    addAuditEntry("OPERATOR_ABC", `ACK_ALERT_${alertId}`, "CONFIRMED");
    addNotification("Alert Acknowledged", `Mission alert [${alertId}] acknowledged by operator.`, "info");
  };

  const handleSelectSearchResult = (item) => {
    if (item.workspace) {
      setActiveWorkspace(item.workspace);
    }
    if (item.type === "mission" && setActiveMission) {
      setActiveMission(item.id);
    }
    setInspectedItem(item);
  };

  // If unauthenticated, render Dedicated Employee Mission Operations Login Gateway
  if (!isLoggedIn) {
    return <EmployeeLogin onLoginSuccess={handleLoginSuccess} />;
  }

  // Fallback defaults if API is fetching
  const radEnv = spaceWeatherData?.radiation_environment || {
    status: simulatedAlertActive ? "CRITICAL" : "NOMINAL",
    scale_r: simulatedAlertActive ? "R4 - SEVERE" : "R0 - NONE",
    scale_s: simulatedAlertActive ? "S3 - STRONG" : "S0 - NONE",
    scale_g: simulatedAlertActive ? "G4 - SEVERE" : "G1 - MINOR",
    background_flux: simulatedAlertActive ? "4.82e-4 W/m² (X4.8)" : "1.42e-6 W/m² (C1.4)",
    proton_activity: simulatedAlertActive ? "1,240 pfu (>=10 MeV)" : "1.09 pfu (>=10 MeV)",
    data_status: "LIVE"
  };

  const xrayFlux = spaceWeatherData?.xray_flux || [];
  const protonFlux = spaceWeatherData?.proton_flux || [];
  const solarWind = spaceWeatherData?.solar_wind || {};
  const cmes = spaceWeatherData?.cmes || [];
  const solarEvents = spaceWeatherData?.solar_events || [];
  const noaaAlerts = spaceWeatherData?.noaa_alerts || [];
  const sdoImagery = spaceWeatherData?.sdo_imagery || {};
  const provenance = spaceWeatherData?.provenance || {};

  // Active alerts list passed to Overview & Alerts workspaces
  const activeAlertsList = [
    ...(simulatedAlertActive ? [{
      id: "ALT-2026-0908-01",
      title: "Solar Particle Event (SPE) S3 Shockwave",
      mission: activeMission,
      severity: "CRITICAL",
      type: "RADIATION ALERT",
      time: "13:54 UTC",
      status: alertAcknowledged ? "ACKNOWLEDGED" : "DELIVERED",
      impact: "High-energy proton flux exceeding S3 threshold. Emergency water-wall storm shelter ingress directive active."
    }] : []),
    {
      id: "ALT-2026-0908-02",
      title: "CME Plasma Shock Front Approaching Cislunar Space",
      mission: "LUNAR-01",
      severity: "HIGH",
      type: "CME MONITOR",
      time: "13:42 UTC",
      status: "ACKNOWLEDGED",
      impact: "Plasma shock arrival in ~18 hours. Cislunar optical link tracking adjusted."
    }
  ];

  return (
    <div className="bg-black text-white min-h-screen font-sans selection:bg-cyan-500 selection:text-black relative">
      
      {/* 1. Header: Persistent Top Mission Selector, Clock, Operator & Live Controls */}
      <ControlCenterHeader
        operator={operator}
        onLogout={handleLogout}
        activeMission={activeMission}
        setActiveMission={setActiveMission}
        simulationMode={simulationMode}
        setSimulationMode={setSimulationMode}
        isRefreshing={isRefreshing}
        onRefresh={fetchSpaceWeather}
        lastUpdated={lastUpdated}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSelectSearchResult={handleSelectSearchResult}
        notifications={notifications}
      />

      {/* 2. Workspace Navigation Bar: Compact, Sticky, Technical Tab Selector */}
      <WorkspaceNav
        activeWorkspace={activeWorkspace}
        onSelectWorkspace={setActiveWorkspace}
        alertsCount={simulatedAlertActive && !alertAcknowledged ? 1 : 0}
      />

      {/* 3. Main Content: Only ONE Workspace Rendered at a Time */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {activeWorkspace === "overview" && (
          <OverviewWorkspace
            radEnv={radEnv}
            alerts={activeAlertsList}
            streamEvents={streamEvents}
            activeStage={activeStage}
            isDemoRunning={isDemoRunning}
            isRelayOffline={isRelayOffline}
            onRunSignatureDemo={runSignatureDemo}
            onResetSimulation={resetSimulation}
            onInspectItem={setInspectedItem}
            onSelectWorkspace={setActiveWorkspace}
            lastUpdated={lastUpdated}
          />
        )}

        {activeWorkspace === "radiation" && (
          <RadiationWorkspace
            radEnv={radEnv}
            protonFlux={protonFlux}
            xrayFlux={xrayFlux}
            activeMission={activeMission}
            simulatedAlertActive={simulatedAlertActive}
            onInspectItem={setInspectedItem}
          />
        )}

        {activeWorkspace === "solar" && (
          <SolarWorkspace
            solarEvents={solarEvents}
            noaaAlerts={noaaAlerts}
            cmes={cmes}
            xrayFlux={xrayFlux}
            protonFlux={protonFlux}
            solarWind={solarWind}
            sdoImagery={sdoImagery}
            provenance={provenance}
            onInspectItem={setInspectedItem}
          />
        )}

        {activeWorkspace === "missions" && (
          <MissionsWorkspace
            activeMission={activeMission}
            setActiveMission={setActiveMission}
            simulatedAlertActive={simulatedAlertActive}
            alertAcknowledged={alertAcknowledged}
            onInspectItem={setInspectedItem}
          />
        )}

        {activeWorkspace === "network" && (
          <NetworkWorkspace
            isRelayOffline={isRelayOffline}
            onToggleRelay={toggleRelayFailure}
            activeMission={activeMission}
            onInspectItem={setInspectedItem}
          />
        )}

        {activeWorkspace === "crew" && (
          <CrewWorkspace
            activeMission={activeMission}
            simulatedAlertActive={simulatedAlertActive}
            alertAcknowledged={alertAcknowledged}
            onInspectItem={setInspectedItem}
          />
        )}

        {activeWorkspace === "telemetry" && (
          <TelemetryWorkspace
            activeMission={activeMission}
            simulatedAlertActive={simulatedAlertActive}
            onInspectItem={setInspectedItem}
          />
        )}

        {activeWorkspace === "alerts" && (
          <AlertsWorkspace
            alerts={activeAlertsList}
            simulatedAlertActive={simulatedAlertActive}
            alertAcknowledged={alertAcknowledged}
            onAcknowledgeAlert={handleAcknowledgeAlert}
            onInspectItem={setInspectedItem}
          />
        )}

        {activeWorkspace === "systems" && (
          <SystemsWorkspace
            isRelayOffline={isRelayOffline}
            alertAcknowledged={alertAcknowledged}
            auditLog={auditLog}
            onInspectItem={setInspectedItem}
          />
        )}

        {/* SECTION 52: The Core Shivodaya Flow Banner */}
        <section className="mt-12 p-6 rounded-2xl bg-zinc-950/80 border border-white/10 font-mono text-center space-y-4">
          <div className="text-[10px] tracking-[0.3em] uppercase text-cyan-400 font-semibold">
            THE CORE SHIVODAYA FLOW
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-bold tracking-wider">
            <span className="text-amber-400">THE SUN CHANGES</span>
            <span className="text-zinc-600">→</span>
            <span className="text-cyan-400">WE SEE IT (PRAKASH)</span>
            <span className="text-zinc-600">→</span>
            <span className="text-indigo-400">WE UNDERSTAND THE EVENT</span>
            <span className="text-zinc-600">→</span>
            <span className="text-purple-400">THE NETWORK FINDS A WAY (RICHA)</span>
            <span className="text-zinc-600">→</span>
            <span className="text-red-400">THE MISSION KNOWS (AKASHDEEP)</span>
            <span className="text-zinc-600">→</span>
            <span className="text-emerald-400">THE HUMAN RESPONDS</span>
          </div>
        </section>

        {/* SECTION 53: Final Visual Statement */}
        <footer className="pt-8 pb-12 border-t border-white/10 text-center space-y-2 font-mono">
          <div className="text-xs uppercase tracking-[0.3em] text-zinc-400">
            “THE NETWORK IS ONLY THE BEGINNING.”
          </div>
          <div className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
            “THE PURPOSE IS TO HELP HUMANITY GO FARTHER.”
          </div>
          <div className="text-[10px] text-zinc-600 uppercase tracking-widest pt-2">
            SHIVODAYA MISSION OPERATIONS // FEDERATED DEEP SPACE DEFENSE
          </div>
        </footer>

      </main>

      {/* 4. Right-Side Inspector Drawer for Deep Dives */}
      <InspectorDrawer
        item={inspectedItem}
        onClose={() => setInspectedItem(null)}
        onAcknowledgeAlert={handleAcknowledgeAlert}
        onSelectMission={(missionId) => setActiveMission(missionId)}
      />

    </div>
  );
}
