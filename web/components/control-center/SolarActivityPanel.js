"use client";

import React, { useState } from "react";
import { Sun, Flame, Wind, AlertTriangle, Eye, X, CheckCircle2, ArrowRight } from "lucide-react";

export default function SolarActivityPanel({ events = [], noaaAlerts = [] }) {
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <div className="bg-zinc-950/90 border border-white/10 rounded-xl p-4 sm:p-5 space-y-4 font-mono">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Sun className="w-4 h-4 text-amber-400" />
          <h2 className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-white">
            SOLAR ACTIVITY & RECENT EVENTS
          </h2>
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/15 text-zinc-300">
            SOURCE: NASA DONKI & NOAA SWPC
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-400">
            ● LIVE / NRT
          </span>
        </div>
      </div>

      {/* Events Table / Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 text-[10px] text-zinc-500 uppercase tracking-wider">
              <th className="pb-2 font-medium">EVENT TYPE</th>
              <th className="pb-2 font-medium">EVENT TIME (UTC)</th>
              <th className="pb-2 font-medium">CLASS / REGION</th>
              <th className="pb-2 font-medium">OFFICIAL SOURCE</th>
              <th className="pb-2 font-medium">STATUS</th>
              <th className="pb-2 font-medium text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-zinc-300">
            {events.map((evt) => (
              <tr 
                key={evt.id} 
                onClick={() => setSelectedEvent(evt)}
                className="hover:bg-white/5 cursor-pointer transition-colors group"
              >
                <td className="py-2.5 flex items-center gap-2">
                  {evt.type.includes("FLARE") ? (
                    <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  ) : evt.type.includes("CME") ? (
                    <Sun className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  ) : (
                    <Wind className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  )}
                  <span className="font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {evt.type}
                  </span>
                </td>
                <td className="py-2.5 text-zinc-400 tabular-nums">{evt.time}</td>
                <td className="py-2.5">
                  <span className="text-cyan-300 font-semibold">{evt.class}</span>
                  {evt.active_region && (
                    <span className="text-zinc-500 ml-1.5">({evt.active_region})</span>
                  )}
                </td>
                <td className="py-2.5 text-zinc-400 text-[11px]">{evt.source}</td>
                <td className="py-2.5">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                    evt.status.includes("ACTIVE") || evt.status.includes("WARNING")
                      ? "bg-red-950/60 border-red-500/40 text-red-300"
                      : "bg-zinc-900 border-white/10 text-zinc-300"
                  }`}>
                    {evt.status}
                  </span>
                </td>
                <td className="py-2.5 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEvent(evt);
                    }}
                    className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-zinc-900 hover:bg-cyan-950/50 border border-white/10 hover:border-cyan-500/40 text-zinc-300 hover:text-cyan-300 transition-colors uppercase"
                  >
                    <Eye className="w-3 h-3" /> Inspect
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* NOAA Space Weather Bulletins ticker */}
      {noaaAlerts && noaaAlerts.length > 0 && (
        <div className="pt-2 border-t border-white/5 space-y-1.5">
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            LATEST NOAA SPACE WEATHER BULLETINS:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {noaaAlerts.slice(0, 2).map((a, i) => (
              <div key={i} className="p-2.5 rounded bg-zinc-900/60 border border-white/5 text-[11px] space-y-1">
                <div className="flex justify-between items-center text-zinc-400 text-[10px]">
                  <span className="font-bold text-amber-300">[{a.code}] {a.scale}</span>
                  <span className="tabular-nums">{a.time}</span>
                </div>
                <div className="text-zinc-300 font-sans text-xs leading-relaxed line-clamp-2">
                  {a.headline}: {a.impact}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Event Detail Inspector Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-zinc-950 border border-white/20 rounded-xl p-6 space-y-5 shadow-2xl relative font-mono">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] text-cyan-400 uppercase tracking-widest">
                  SPACE-WEATHER EVENT INSPECTOR
                </span>
                <h3 className="text-lg font-bold text-white tracking-wide flex items-center gap-2 mt-0.5">
                  {selectedEvent.type} // {selectedEvent.class}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1 text-zinc-400 hover:text-white rounded hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Official Observational Metadata */}
            <div className="space-y-2 text-xs">
              <div className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold border-b border-white/5 pb-1">
                OFFICIAL OBSERVATIONAL DATA (NASA / NOAA)
              </div>
              <div className="grid grid-cols-2 gap-2 text-zinc-300">
                <div><span className="text-zinc-500">EVENT ID:</span> {selectedEvent.id}</div>
                <div><span className="text-zinc-500">TIME:</span> {selectedEvent.time}</div>
                <div><span className="text-zinc-500">ACTIVE REGION:</span> {selectedEvent.active_region || "None"}</div>
                <div><span className="text-zinc-500">LOCATION:</span> {selectedEvent.location || "Solar Disk"}</div>
                <div><span className="text-zinc-500">SOURCE:</span> {selectedEvent.source}</div>
                <div><span className="text-zinc-500">OBSERVED STATUS:</span> {selectedEvent.status}</div>
              </div>
              {selectedEvent.description && (
                <div className="p-2.5 rounded bg-zinc-900 border border-white/5 text-[11px] text-zinc-300 font-sans">
                  {selectedEvent.description}
                </div>
              )}
            </div>

            {/* Shivodaya Simulation Response Chain (Section 29) */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-cyan-400 font-bold">
                <span>SHIVODAYA SIMULATION RESPONSE CHAIN</span>
                <span className="text-zinc-500">◇ SIMULATED RESPONSE</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-center text-[10px]">
                <div className="p-2 rounded bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 space-y-1">
                  <CheckCircle2 className="w-3.5 h-3.5 mx-auto text-cyan-400" />
                  <div className="font-bold uppercase">PRAKASH</div>
                  <div className="text-[9px] text-zinc-400">PROCESSED</div>
                </div>
                <div className="p-2 rounded bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 space-y-1">
                  <CheckCircle2 className="w-3.5 h-3.5 mx-auto text-cyan-400" />
                  <div className="font-bold uppercase">RICHA</div>
                  <div className="text-[9px] text-zinc-400">ROUTED</div>
                </div>
                <div className="p-2 rounded bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 space-y-1">
                  <CheckCircle2 className="w-3.5 h-3.5 mx-auto text-cyan-400" />
                  <div className="font-bold uppercase">RELAY MESH</div>
                  <div className="text-[9px] text-zinc-400">FORWARDED</div>
                </div>
                <div className="p-2 rounded bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 space-y-1">
                  <CheckCircle2 className="w-3.5 h-3.5 mx-auto text-cyan-400" />
                  <div className="font-bold uppercase">AKASHDEEP</div>
                  <div className="text-[9px] text-zinc-400">RECEIVED</div>
                </div>
                <div className="p-2 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 space-y-1">
                  <CheckCircle2 className="w-3.5 h-3.5 mx-auto text-emerald-400" />
                  <div className="font-bold uppercase">MISSION</div>
                  <div className="text-[9px] text-emerald-400 font-bold">ACKNOWLEDGED</div>
                </div>
              </div>

              <div className="text-[9px] text-zinc-500 font-sans italic">
                * Note: Real observational data from NASA/NOAA was processed through the Shivodaya neural vector pipeline simulation. No live deep-space spacecraft link was controlled.
              </div>
            </div>

            {/* Close Button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-white/20 text-white text-xs uppercase tracking-wider transition"
              >
                Close Inspector
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
