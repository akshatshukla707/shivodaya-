"use client";

import React from "react";
import { X, ShieldAlert, Rocket, Radio, Network, CheckCircle2, Clock, Cpu, AlertTriangle, ExternalLink } from "lucide-react";

export default function InspectorDrawer({ item, onClose, onAcknowledgeAlert, onSelectMission }) {
  if (!item) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 md:w-[420px] bg-zinc-950/98 border-l border-white/15 backdrop-blur-2xl shadow-2xl p-5 overflow-y-auto font-mono text-white flex flex-col justify-between animate-in slide-in-from-right duration-200">
      
      {/* Top Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-widest text-cyan-400 uppercase font-semibold px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
              {item.type?.toUpperCase() || "INSPECTOR"} DETAIL
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title="Close Inspector"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title & Status */}
        <div className="space-y-1">
          <div className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">
            {item.category || item.agency || "TELEMETRY ENTITY"}
          </div>
          <h2 className="text-lg font-bold text-white tracking-wide">
            {item.title || item.name || item.id}
          </h2>
          {item.status && (
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 border uppercase bg-zinc-900 border-white/15 text-zinc-200">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              {item.status}
            </div>
          )}
        </div>

        {/* Dynamic Fields / Attributes */}
        <div className="space-y-2.5 pt-2 border-t border-white/10 text-xs">
          
          {item.time && (
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-zinc-500 uppercase tracking-wider text-[10px]">TIMESTAMP:</span>
              <span className="text-zinc-200 tabular-nums">{item.time}</span>
            </div>
          )}

          {item.source && (
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-zinc-500 uppercase tracking-wider text-[10px]">DATA SOURCE:</span>
              <span className="text-cyan-300 font-semibold">{item.source}</span>
            </div>
          )}

          {item.destination && (
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-zinc-500 uppercase tracking-wider text-[10px]">DESTINATION:</span>
              <span className="text-white font-medium">{item.destination}</span>
            </div>
          )}

          {item.orbit && (
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-zinc-500 uppercase tracking-wider text-[10px]">ORBIT / LOC:</span>
              <span className="text-zinc-300">{item.orbit}</span>
            </div>
          )}

          {item.latency && (
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-zinc-500 uppercase tracking-wider text-[10px]">ROUND-TRIP DELAY:</span>
              <span className="text-amber-300 font-semibold tabular-nums">{item.latency}</span>
            </div>
          )}

          {item.band && (
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-zinc-500 uppercase tracking-wider text-[10px]">COMM BAND:</span>
              <span className="text-zinc-300">{item.band}</span>
            </div>
          )}

          {item.severity && (
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-zinc-500 uppercase tracking-wider text-[10px]">SEVERITY LEVEL:</span>
              <span className={`font-bold ${
                item.severity === "CRITICAL" ? "text-red-400" : item.severity === "HIGH" ? "text-amber-400" : "text-cyan-400"
              }`}>
                {item.severity}
              </span>
            </div>
          )}

          {item.description && (
            <div className="space-y-1 pt-2">
              <span className="text-zinc-500 uppercase tracking-wider text-[10px]">SYNOPSIS:</span>
              <p className="text-xs text-zinc-300 font-sans leading-relaxed bg-zinc-900/60 p-2.5 rounded border border-white/5">
                {item.description}
              </p>
            </div>
          )}

          {/* Alert Specific 6-Stage Pipeline Checklist */}
          {item.type === "alert" && (
            <div className="space-y-2 pt-3">
              <div className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold">
                SHIVODAYA PIPELINE VERIFICATION:
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded bg-zinc-900/80 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> PRAKASH: ✓ ENCODED
                </div>
                <div className="p-2 rounded bg-zinc-900/80 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> RICHA: ✓ ROUTED
                </div>
                <div className="p-2 rounded bg-zinc-900/80 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> RELAY: ✓ FORWARDED
                </div>
                <div className="p-2 rounded bg-zinc-900/80 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> AKASHDEEP: ✓ DECODED
                </div>
                <div className="p-2 rounded bg-zinc-900/80 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> MISSION: ✓ HUD ACTIVE
                </div>
                <div className="p-2 rounded bg-zinc-900/80 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> CREW: ✓ SHELTERED
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Bottom Actions */}
      <div className="pt-5 border-t border-white/10 space-y-2">
        {item.type === "alert" && (
          <button
            onClick={() => {
              if (onAcknowledgeAlert) onAcknowledgeAlert(item.id);
              onClose();
            }}
            className="w-full py-2.5 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>ACKNOWLEDGE ALERT</span>
          </button>
        )}

        {item.type === "mission" && (
          <button
            onClick={() => {
              if (onSelectMission) onSelectMission(item.id);
              onClose();
            }}
            className="w-full py-2.5 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2"
          >
            <Rocket className="w-4 h-4" />
            <span>SET AS ACTIVE MISSION</span>
          </button>
        )}

        <button
          onClick={onClose}
          className="w-full py-2 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white uppercase tracking-wider text-xs transition-colors"
        >
          DISMISS INSPECTOR
        </button>
      </div>

    </div>
  );
}
