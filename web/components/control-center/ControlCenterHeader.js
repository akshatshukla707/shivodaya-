"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Radio, Globe, Shield, RefreshCw, Cpu, Activity, Clock, LogOut, 
  Search, Bell, AlertTriangle, CheckCircle2, Info, X, ExternalLink
} from "lucide-react";

export default function ControlCenterHeader({
  operator = "ABC",
  onLogout,
  activeMission = "MARS-01",
  setActiveMission,
  simulationMode,
  setSimulationMode,
  isRefreshing,
  onRefresh,
  lastUpdated,
  searchQuery = "",
  setSearchQuery,
  onSelectSearchResult,
  notifications = []
}) {
  const [utcTime, setUtcTime] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(notifications.length || 3);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const updateClock = () => {
      const d = new Date();
      const iso = d.toISOString().replace("T", " ").replace("Z", " UTC");
      setUtcTime(iso);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const missions = [
    { id: "MARS-01", label: "MARS-01 // CREWED TRANSFER VEHICLE", target: "Mars Transfer Orbit (MTO)" },
    { id: "LUNAR-01", label: "LUNAR-01 // ARTEMIS GATEWAY RELAY NODE", target: "Lunar NRHO Orbit" },
    { id: "CHANDRAYAAN-BASE", label: "CHANDRAYAAN-BASE // SOUTH POLE HABITAT", target: "Shackleton Crater Rim" },
    { id: "SENTRY-01", label: "SENTRY-01 // ISRO DEEP SPACE SENTRY", target: "Heliospheric L1 Halo" },
    { id: "AKASHDEEP-01", label: "AKASHDEEP-01 // MARS SURFACE TERMINAL", target: "Mars Valles Marineris" }
  ];

  const defaultNotifications = [
    { id: 1, type: "alert", title: "Solar Sentry Synced", text: "NOAA/SDO telemetry connection nominal", time: "13:58 UTC" },
    { id: 2, type: "info", title: "Contact Plan Updated", text: "TVG Dijkstra routing table synchronized across 124 nodes", time: "13:55 UTC" },
    { id: 3, type: "warn", title: "Relay Custody Check", text: "Lunar Gateway buffer pool at 14% utilization", time: "13:42 UTC" }
  ];

  const displayNotifications = notifications.length > 0 ? notifications : defaultNotifications;

  const searchableItems = [
    { id: "MARS-01", title: "MARS-01 Crewed Vehicle", category: "MISSION", workspace: "missions", type: "mission", description: "Crewed Transfer Vehicle en route to Mars (1.38 AU). Currently in Cruise Phase." },
    { id: "LUNAR-01", title: "LUNAR-01 Artemis Gateway", category: "MISSION", workspace: "missions", type: "mission", description: "Cislunar NRHO relay backbone and science habitat." },
    { id: "CHANDRAYAAN-BASE", title: "Chandrayaan Surface Base", category: "MISSION", workspace: "missions", type: "mission", description: "Shackleton Crater rim polar habitat with subterranean regolith shielding." },
    { id: "SENTRY-01", title: "Sentry-01 Heliospheric Monitor", category: "MISSION", workspace: "missions", type: "mission", description: "Upstream solar radiation sentry at Sun-Earth L1 Lagrange point." },
    { id: "AKASHDEEP-01", title: "Akashdeep-01 Mars Terminal", category: "MISSION", workspace: "missions", type: "mission", description: "Mars surface receiver terminal with Reverse MLP decoder." },
    { id: "prakash", title: "Prakash C11 JSCC Encoder", category: "NODE", workspace: "systems", type: "node", description: "Lock-free 32-float vector encoder operating at Sun-Earth L1." },
    { id: "richa", title: "Richa C++17 TVG Router", category: "NODE", workspace: "systems", type: "node", description: "Time-Varying Graph Dijkstra routing engine across 124 interplanetary relays." },
    { id: "relay-alpha", title: "Relay Alpha (Sentry-01)", category: "RELAY", workspace: "network", type: "relay", description: "Primary cislunar/L5 link. Subject to CME flare occlusion simulation." },
    { id: "relay-gamma", title: "Relay Gamma (Re-route Sentry)", category: "RELAY", workspace: "network", type: "relay", description: "Autonomous backup laser crosslink relay for blackout evasion." },
    { id: "spe-alert", title: "Solar Proton Event (SPE)", category: "ALERT", workspace: "alerts", type: "alert", description: "High-energy proton shockwave warning exceeding S3 storm threshold." },
    { id: "cme-front", title: "CME Plasma Eruption", category: "EVENT", workspace: "solar", type: "event", description: "Coronal Mass Ejection detected by SDO AIA imagery and LASCO coronagraphs." },
    { id: "crew-dosimetry", title: "Crew Dosimeter & Shelters", category: "CREW", workspace: "crew", type: "crew", description: "Personal astronaut dosimeters and water-wall storm shelter ingress telemetry." },
    { id: "telemetry-power", title: "EPS Bus & Array Telemetry", category: "TELEMETRY", workspace: "telemetry", type: "telemetry", description: "124V DC bus voltage, array output, and battery state of charge." }
  ];

  const filteredSearchResults = searchQuery.trim()
    ? searchableItems.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="bg-black/95 backdrop-blur-md border-b border-white/10 text-white font-mono px-4 sm:px-6 py-2.5 space-y-2 relative z-40">
      
      {/* Top Bar: Title, UTC Time, Operational Status, Operator, Notifications, Logout */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Left: Brand & Section */}
        <div className="flex items-center gap-3">
          <Link 
            href="/" 
            className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 text-[11px] uppercase tracking-wider pr-3 border-r border-white/10"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Portal
          </Link>
          <div className="flex items-baseline gap-2">
            <span className="font-bold tracking-[0.25em] text-white uppercase text-sm sm:text-base">
              SHIVODAYA
            </span>
            <span className="text-[11px] tracking-[0.18em] text-cyan-400 uppercase font-semibold">
              MISSION OPERATIONS
            </span>
          </div>
        </div>

        {/* Center: Live UTC Master Clock */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded bg-zinc-900/90 border border-white/10 text-[11px] text-zinc-300 font-mono">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-zinc-500 uppercase tracking-widest text-[10px]">UTC CLOCK:</span>
          <span className="text-white font-semibold tabular-nums">{utcTime || "2026-09-08 13:55:00 UTC"}</span>
        </div>

        {/* Right: Operational Status, Search, Notifications, Operator Name, Logout */}
        <div className="flex items-center gap-2.5">
          
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            SYSTEM OPERATIONAL
          </span>

          {/* Global Search Box */}
          <div className="relative hidden lg:block">
            <Search className="w-3 h-3 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
              placeholder="SEARCH MISSIONS / EVENTS / NODES"
              className="bg-zinc-900/90 border border-white/10 rounded pl-7 pr-3 py-1 text-[10px] text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-400 w-56 uppercase tracking-wider font-mono transition-colors"
            />

            {/* Search Dropdown Results */}
            {isSearchFocused && searchQuery.trim() && (
              <div className="absolute left-0 mt-1.5 w-72 bg-zinc-950/98 border border-white/15 rounded-xl shadow-2xl p-2 z-50 space-y-1 text-xs font-mono animate-in fade-in duration-100">
                <div className="text-[9px] text-zinc-500 uppercase tracking-wider px-2 py-1 border-b border-white/5">
                  SEARCH RESULTS ({filteredSearchResults.length})
                </div>
                {filteredSearchResults.length === 0 ? (
                  <div className="p-2 text-center text-zinc-500 text-[10px]">
                    No matching entity found
                  </div>
                ) : (
                  <div className="max-h-56 overflow-y-auto divide-y divide-white/5">
                    {filteredSearchResults.slice(0, 5).map((res) => (
                      <button
                        key={res.id}
                        onMouseDown={() => {
                          if (onSelectSearchResult) onSelectSearchResult(res);
                          if (setSearchQuery) setSearchQuery("");
                        }}
                        className="w-full text-left p-2 hover:bg-zinc-900 rounded flex flex-col gap-0.5 transition-colors group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-white font-bold text-[11px] group-hover:text-cyan-300">
                            {res.title}
                          </span>
                          <span className="text-[9px] text-cyan-400 px-1 rounded bg-cyan-950/60 border border-cyan-500/20">
                            {res.category}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-400 font-sans truncate">
                          {res.description}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Notifications Center Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setUnreadCount(0);
              }}
              className="relative p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white transition-colors"
              title="Operations Notifications"
            >
              <Bell className="w-3.5 h-3.5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-400 text-black text-[9px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Popover Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-zinc-950/98 border border-white/15 rounded-xl shadow-2xl p-3 z-50 space-y-2 text-xs font-mono animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-[11px] font-bold tracking-wider uppercase text-cyan-400 flex items-center gap-1.5">
                    <Bell className="w-3 h-3" /> NOTIFICATION CENTER
                  </span>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="text-zinc-500 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="divide-y divide-white/5 max-h-64 overflow-y-auto space-y-1">
                  {displayNotifications.map((n, i) => (
                    <div key={i} className="pt-2 pb-1 space-y-0.5">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-white font-bold">{n.title}</span>
                        <span className="text-zinc-500 tabular-nums">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 font-sans leading-tight">{n.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-zinc-900/80 border border-white/10 text-[11px]">
            <span className="text-zinc-500 uppercase tracking-wider text-[10px]">OPERATOR:</span>
            <span className="text-white font-bold tracking-wider">{operator}</span>
          </div>

          <button
            onClick={onLogout}
            title="Terminate Secure Session"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 hover:bg-red-950/60 border border-white/15 hover:border-red-500/40 text-zinc-400 hover:text-red-300 text-[11px] tracking-wider uppercase transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">LOG OUT</span>
          </button>
        </div>
      </div>

      {/* Sub-Bar: Primary Mission Selector & Live Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-white/5 text-xs">
        
        {/* Mission Selector */}
        <div className="flex items-center gap-2">
          <label className="text-[11px] tracking-widest text-zinc-400 uppercase font-semibold flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            ACTIVE MISSION:
          </label>
          <div className="relative">
            <select
              value={activeMission}
              onChange={(e) => setActiveMission(e.target.value)}
              className="bg-zinc-900 border border-white/20 text-cyan-300 rounded px-2.5 py-1 text-xs font-mono font-bold tracking-wider uppercase focus:outline-none focus:border-cyan-400 cursor-pointer pr-7"
            >
              {missions.map((m) => (
                <option key={m.id} value={m.id} className="bg-zinc-950 text-white">
                  {m.id}
                </option>
              ))}
            </select>
          </div>
          <span className="hidden lg:inline-block text-[11px] text-zinc-500 font-sans">
            — {missions.find(m => m.id === activeMission)?.target}
          </span>
        </div>

        {/* Live Controls: Simulation Mode Toggle, Manual Refresh, Sync Timestamp */}
        <div className="flex items-center gap-2.5">
          
          {/* Simulation Mode Toggle Button */}
          <button
            onClick={() => setSimulationMode(!simulationMode)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] tracking-widest uppercase font-mono border transition-all ${
              simulationMode
                ? "bg-amber-950/40 border-amber-500/50 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                : "bg-zinc-900/80 border-white/10 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${simulationMode ? "bg-amber-400 animate-ping" : "bg-zinc-600"}`} />
            SIMULATION MODE: {simulationMode ? "ACTIVE" : "STANDBY"}
          </button>

          {/* Refresh Action */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 text-[10px] tracking-wider uppercase transition-colors disabled:opacity-50"
            title="Sync Space Weather & Telemetry"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? "animate-spin text-cyan-400" : ""}`} />
            <span>SYNC</span>
          </button>

          <span className="hidden xl:inline-block text-[10px] text-zinc-500">
            SYNCHRONIZED: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : "LIVE"}
          </span>
        </div>

      </div>

    </header>
  );
}
