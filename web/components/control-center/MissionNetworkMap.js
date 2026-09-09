"use client";

import React, { useState, useEffect } from "react";
import { Network, Wifi, WifiOff, AlertTriangle, RefreshCw } from "lucide-react";

export default function MissionNetworkMap({
  isRelayOffline = false,
  onToggleRelay,
  activeMission = "AKASHDEEP-01"
}) {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [pulsePos, setPulsePos] = useState(0);

  // Animate the luminous signal packet
  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePos((prev) => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Celestial Nodes
  const nodes = [
    { id: "sun", name: "SUN // SOL-0", x: 50, y: 150, type: "star", agency: "Heliosphere", status: "SOLAR STORM ACTIVE", color: "#f59e0b" },
    { id: "prakash", name: "PRAKASH ENCODER", x: 140, y: 150, type: "encoder", agency: "ISRO / Shivodaya", status: "ONLINE", color: "#06b6d4" },
    { id: "earth", name: "EARTH (BHAARAT MASTER)", x: 230, y: 220, type: "ground", agency: "ISRO / NASA / ESA", status: "GROUND CONTROL (BYPASS)", color: "#3b82f6" },
    { id: "moon", name: "LUNAR GATEWAY (LUNAR-01)", x: 270, y: 140, type: "relay", agency: "NASA / ESA", status: "ONLINE", color: "#a855f7" },
    { id: "relayA", name: "RELAY ALPHA (SENTRY-01)", x: 380, y: 90, type: "relay", agency: "ISRO Deep Space", status: isRelayOffline ? "OFFLINE (CME DISTURBANCE)" : "ONLINE", color: isRelayOffline ? "#ef4444" : "#10b981" },
    { id: "relayB", name: "RELAY BETA (STARSHIP-04)", x: 490, y: 120, type: "relay", agency: "Commercial / SpaceX", status: "ONLINE", color: "#10b981" },
    { id: "relayC", name: "RELAY GAMMA (RE-ROUTE SENTRY)", x: 380, y: 220, type: "relay", agency: "ESA Heliospheric", status: "ONLINE", color: "#10b981" },
    { id: "mars", name: "AKASHDEEP-01 (MARS TARGET)", x: 620, y: 160, type: "mission", agency: "Mars Command", status: "TARGET DECODER ACTIVE", color: "#ef4444" }
  ];

  // Active Path: Normal vs Rerouted around failed Relay A
  // Normal: Sun -> Prakash -> Relay A -> Relay B -> Mars
  // Reroute (when Relay A is offline): Sun -> Prakash -> Relay C -> Relay B -> Mars
  const activeLinks = isRelayOffline
    ? [
        { from: "sun", to: "prakash" },
        { from: "prakash", to: "relayC" },
        { from: "relayC", to: "relayB" },
        { from: "relayB", to: "mars" },
        { from: "prakash", to: "moon" }
      ]
    : [
        { from: "sun", to: "prakash" },
        { from: "prakash", to: "relayA" },
        { from: "relayA", to: "relayB" },
        { from: "relayB", to: "mars" },
        { from: "prakash", to: "moon" },
        { from: "moon", to: "earth" }
      ];

  const failedLink = isRelayOffline ? { from: "prakash", to: "relayA" } : null;

  return (
    <div className="bg-zinc-950/90 border border-white/10 rounded-xl p-4 sm:p-5 space-y-4 font-mono">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-white">
              MISSION NETWORK & ALERT PROPAGATION MAP
            </h3>
          </div>
          <p className="text-[11px] text-zinc-400 font-sans pt-0.5">
            Inter-agency topological mesh with autonomous TVG blackout evasion.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          <button
            onClick={onToggleRelay}
            className={`px-2.5 py-1 rounded border uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5 ${
              isRelayOffline
                ? "bg-red-950/60 border-red-500/50 text-red-300"
                : "bg-zinc-900 border-white/15 text-zinc-300 hover:text-white"
            }`}
          >
            {isRelayOffline ? <WifiOff className="w-3 h-3 text-red-400" /> : <Wifi className="w-3 h-3 text-emerald-400" />}
            <span>{isRelayOffline ? "RESTORE RELAY ALPHA" : "INJECT FAULT: SEVER RELAY A"}</span>
          </button>
          <span className="px-2 py-1 rounded bg-amber-950/40 border border-amber-500/30 text-amber-400">
            ◇ SHIVODAYA SIMULATION
          </span>
        </div>
      </div>

      {/* SVG Interactive Canvas */}
      <div className="relative w-full h-80 sm:h-96 bg-black/80 rounded-lg border border-white/10 overflow-hidden select-none">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {/* Orbit reference rings */}
        <svg viewBox="0 0 700 300" className="w-full h-full">
          
          {/* Faint planetary orbit arcs */}
          <circle cx="50" cy="150" r="190" fill="none" stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="4 8" strokeOpacity="0.2" />
          <circle cx="50" cy="150" r="570" fill="none" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="4 8" strokeOpacity="0.2" />

          {/* Background Links */}
          {activeLinks.map((link, idx) => {
            const n1 = nodes.find(n => n.id === link.from);
            const n2 = nodes.find(n => n.id === link.to);
            if (!n1 || !n2) return null;

            const isHovered = hoveredNode && (hoveredNode.id === n1.id || hoveredNode.id === n2.id);

            return (
              <g key={idx}>
                {/* Connection line */}
                <line
                  x1={n1.x}
                  y1={n1.y}
                  x2={n2.x}
                  y2={n2.y}
                  stroke={isHovered ? "#06b6d4" : "#06b6d4"}
                  strokeWidth={isHovered ? "2" : "1.2"}
                  strokeOpacity={hoveredNode && !isHovered ? 0.2 : 0.6}
                  strokeDasharray="4 4"
                />

                {/* Animated Luminous Packet Pulse along active path */}
                <circle
                  r="3"
                  fill="#38bdf8"
                  className="filter drop-shadow-[0_0_6px_#38bdf8]"
                  cx={n1.x + (n2.x - n1.x) * ((pulsePos + idx * 25) % 100) / 100}
                  cy={n1.y + (n2.y - n1.y) * ((pulsePos + idx * 25) % 100) / 100}
                />
              </g>
            );
          })}

          {/* Severed / Failed Link (if Relay A offline) */}
          {failedLink && (() => {
            const n1 = nodes.find(n => n.id === failedLink.from);
            const n2 = nodes.find(n => n.id === failedLink.to);
            return (
              <g>
                <line
                  x1={n1.x}
                  y1={n1.y}
                  x2={n2.x}
                  y2={n2.y}
                  stroke="#ef4444"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                  strokeOpacity="0.8"
                />
                <circle cx={(n1.x + n2.x) / 2} cy={(n1.y + n2.y) / 2} r="6" fill="#ef4444" fillOpacity="0.3" />
                <text
                  x={(n1.x + n2.x) / 2}
                  y={(n1.y + n2.y) / 2 + 14}
                  fill="#ef4444"
                  fontSize="8"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  SEVERED: BLACKOUT ZONE
                </text>
              </g>
            );
          })()}

          {/* Render Nodes */}
          {nodes.map((node) => {
            const isHovered = hoveredNode?.id === node.id;
            const isDimmed = hoveredNode && !isHovered;

            return (
              <g
                key={node.id}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                className="cursor-pointer transition-opacity duration-200"
                opacity={isDimmed ? 0.35 : 1}
              >
                {/* Node Outer Glow / Halo */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isHovered ? 14 : 10}
                  fill={node.color}
                  fillOpacity={isHovered ? 0.35 : 0.15}
                  className="transition-all duration-200"
                />

                {/* Node Core */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isHovered ? 6 : 4}
                  fill={node.color}
                  className="transition-all duration-200"
                />

                {/* Node Label */}
                <text
                  x={node.x}
                  y={node.y - 12}
                  fill="#ffffff"
                  fontSize={isHovered ? "9" : "8"}
                  fontWeight={isHovered ? "bold" : "normal"}
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  {node.name.split(" ")[0]}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hovered Node Detail Inspector Box */}
        {hoveredNode ? (
          <div className="absolute bottom-3 left-3 bg-zinc-950/95 border border-cyan-500/40 rounded-lg p-3 text-xs space-y-1 backdrop-blur-md shadow-xl max-w-xs pointer-events-none animate-fadeIn">
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">NODE TELEMETRY</div>
            <div className="font-bold text-white text-sm">{hoveredNode.name}</div>
            <div className="text-zinc-400 text-[11px]">AGENCY: <span className="text-cyan-300">{hoveredNode.agency}</span></div>
            <div className="text-[11px] flex items-center gap-1.5 pt-0.5">
              <span className="text-zinc-400">STATUS:</span>
              <span className={`font-bold ${hoveredNode.status.includes("OFFLINE") ? "text-red-400" : "text-emerald-400"}`}>
                {hoveredNode.status}
              </span>
            </div>
          </div>
        ) : (
          <div className="absolute bottom-3 left-3 text-[10px] text-zinc-500 bg-black/60 px-2.5 py-1 rounded border border-white/5 pointer-events-none">
            HOVER OVER NODES TO VIEW ORBITAL & TELEMETRY PROFILE
          </div>
        )}

        {/* Real-Time Reroute Status Tag */}
        <div className="absolute top-3 right-3 text-right space-y-1 pointer-events-none">
          <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
            CURRENT TRANSMISSION PATH:
          </div>
          <div className="text-xs font-mono font-bold text-cyan-300 bg-black/70 px-2.5 py-1 rounded border border-cyan-500/30">
            {isRelayOffline
              ? "PRAKASH → RELAY-GAMMA → RELAY-BETA → MARS"
              : "PRAKASH → RELAY-ALPHA → RELAY-BETA → MARS"}
          </div>
          {isRelayOffline && (
            <div className="text-[10px] text-amber-400 font-bold animate-pulse">
              [!] AUTONOMOUS REROUTE ACTIVE: RELAY-ALPHA BYPASSED
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
