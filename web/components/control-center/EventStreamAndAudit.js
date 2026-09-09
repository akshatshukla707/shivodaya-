"use client";

import React, { useState } from "react";
import { Terminal, ListFilter, Shield, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";

export default function EventStreamAndAudit({
  streamEvents = [],
  auditLog = []
}) {
  const [activeTab, setActiveTab] = useState("stream"); // "stream" or "audit"

  return (
    <div className="bg-zinc-950/90 border border-white/10 rounded-xl p-4 sm:p-5 space-y-4 font-mono">
      
      {/* Header with Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-white">
            OPERATIONAL LOGS & REAL-TIME STREAM
          </h3>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => setActiveTab("stream")}
            className={`px-3 py-1 rounded text-[11px] uppercase tracking-wider font-semibold border transition-all ${
              activeTab === "stream"
                ? "bg-zinc-800 border-cyan-500/50 text-cyan-300"
                : "bg-zinc-900/60 border-white/10 text-zinc-400 hover:text-white"
            }`}
          >
            LIVE EVENT STREAM ({streamEvents.length})
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`px-3 py-1 rounded text-[11px] uppercase tracking-wider font-semibold border transition-all ${
              activeTab === "audit"
                ? "bg-zinc-800 border-cyan-500/50 text-cyan-300"
                : "bg-zinc-900/60 border-white/10 text-zinc-400 hover:text-white"
            }`}
          >
            MISSION AUDIT LOG ({auditLog.length})
          </button>
        </div>
      </div>

      {/* Content Area */}
      {activeTab === "stream" ? (
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[10px] text-zinc-500 pb-1">
            <span>REAL-TIME STREAMING TELEMETRY (ROLLING BUFFER)</span>
            <div className="flex items-center gap-3">
              <span className="text-cyan-400">● EXTERNAL DATA (NOAA/NASA)</span>
              <span className="text-amber-400">◇ SHIVODAYA SIMULATION</span>
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1 text-xs">
            {streamEvents.map((item, idx) => {
              const isExternal = item.source?.includes("NOAA") || item.source?.includes("NASA");
              return (
                <div
                  key={idx}
                  className="p-2.5 rounded bg-zinc-900/60 border border-white/5 flex flex-wrap items-start justify-between gap-2 hover:bg-zinc-900/90 transition-colors"
                >
                  <div className="flex items-start gap-2.5">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase shrink-0 mt-0.5 ${
                      item.level === "WARNING"
                        ? "bg-amber-950/70 border border-amber-500/40 text-amber-300"
                        : item.level === "CRITICAL"
                        ? "bg-red-950/70 border border-red-500/40 text-red-300"
                        : "bg-zinc-800 text-cyan-300"
                    }`}>
                      {item.level}
                    </span>
                    <div className="space-y-0.5">
                      <div className="text-zinc-200 font-sans text-xs">
                        {item.message}
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        ORIGIN: <span className={isExternal ? "text-cyan-400" : "text-amber-400"}>{item.source}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-zinc-500 text-[10px] tabular-nums shrink-0">
                    {item.time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[10px] text-zinc-500 pb-1">
            <span>SECURE AUDIT RECORD // CRYPTOGRAPHIC ACTION LOG</span>
            <span className="text-zinc-400">OPERATOR ATTRIBUTION ACTIVE</span>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1 text-xs">
            {auditLog.map((log, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded bg-zinc-900/60 border border-white/5 flex flex-wrap items-center justify-between gap-2 hover:bg-zinc-900/90 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                    log.severity === "CRITICAL"
                      ? "bg-red-950 text-red-400 border border-red-500/30"
                      : log.severity === "ACTION"
                      ? "bg-cyan-950 text-cyan-300 border border-cyan-500/30"
                      : "bg-zinc-800 text-zinc-400"
                  }`}>
                    {log.severity}
                  </span>
                  <div>
                    <span className="font-bold text-white text-xs">{log.event}</span>
                    {log.details && (
                      <span className="text-zinc-400 text-[11px] font-sans ml-2">&bull; {log.details}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-[10px] text-zinc-500">
                  <span>OPERATOR: <span className="text-zinc-300 font-bold">{log.operator}</span></span>
                  <span className="tabular-nums text-zinc-400">{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
