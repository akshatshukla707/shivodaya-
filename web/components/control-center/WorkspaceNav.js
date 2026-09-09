"use client";

import React from "react";
import { 
  LayoutDashboard, ShieldAlert, Sun, Rocket, Network, Users, 
  Cpu, Bell, Server
} from "lucide-react";

export const WORKSPACES = [
  { id: "overview", label: "OVERVIEW", icon: LayoutDashboard },
  { id: "radiation", label: "RADIATION", icon: ShieldAlert },
  { id: "solar", label: "SOLAR", icon: Sun },
  { id: "missions", label: "MISSIONS", icon: Rocket },
  { id: "network", label: "NETWORK", icon: Network },
  { id: "crew", label: "CREW", icon: Users },
  { id: "telemetry", label: "TELEMETRY", icon: Cpu },
  { id: "alerts", label: "ALERTS", icon: Bell },
  { id: "systems", label: "SYSTEMS", icon: Server }
];

export default function WorkspaceNav({ activeWorkspace, onSelectWorkspace, alertsCount = 0 }) {
  return (
    <div className="sticky top-0 z-30 bg-zinc-950/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-2 transition-all shadow-md">
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar font-mono text-xs select-none">
        {WORKSPACES.map((ws) => {
          const Icon = ws.icon;
          const isActive = activeWorkspace === ws.id;

          return (
            <button
              key={ws.id}
              onClick={() => onSelectWorkspace(ws.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold tracking-wider uppercase transition-all whitespace-nowrap text-[11px] cursor-pointer ${
                isActive
                  ? "bg-cyan-500/15 text-cyan-300 border border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.25)]"
                  : "bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 border border-white/5"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-cyan-400" : "text-zinc-500"}`} />
              <span>{ws.label}</span>
              {ws.id === "alerts" && alertsCount > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                  isActive ? "bg-cyan-400 text-black" : "bg-red-500/80 text-white animate-pulse"
                }`}>
                  {alertsCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
