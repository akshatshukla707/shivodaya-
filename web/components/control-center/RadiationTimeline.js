"use client";

import React from "react";
import { Clock, CheckCircle2, AlertCircle, ArrowDown } from "lucide-react";

export default function RadiationTimeline({ customTimeline }) {
  const defaultTimeline = [
    { time: "12:41 UTC", stage: "SOLAR EVENT OBSERVED", realm: "REAL OBSERVATION", source: "NOAA GOES / NASA SDO", status: "CONFIRMED", desc: "X-ray flux jump from C1.2 to M4.5 detected at L1 sentry sensor." },
    { time: "12:42 UTC", stage: "EVENT INGESTED", realm: "REAL OBSERVATION", source: "NOAA SWPC / DONKI", status: "PROCESSED", desc: "Real-time space weather message serialized into telemetry buffer." },
    { time: "12:43 UTC", stage: "PRAKASH PROCESSED EVENT", realm: "SHIVODAYA SIMULATION", source: "PRAKASH JSCC C11", status: "COMPRESSED", desc: "Lock-free ring buffer projected 5-stream data into 32-float linear vector." },
    { time: "12:43 UTC", stage: "ALERT CREATED", realm: "SHIVODAYA SIMULATION", source: "BPv7 BUNDLE ENGINE", status: "ENCRYPTED", desc: "Rate-delta dPhi/dt crossed threshold. Critical priority bundle generated." },
    { time: "12:44 UTC", stage: "RICHA ROUTE SELECTED", realm: "SHIVODAYA SIMULATION", source: "RICHA PERCEPTRON C++17", status: "CALCULATED", desc: "TVG Dijkstra evaluated 100-node contact graph; avoided CME disturbance cone." },
    { time: "12:45 UTC", stage: "RELAY ACCEPTED", realm: "SHIVODAYA SIMULATION", source: "SPACE MESH RELAY 02", status: "CUSTODY SECURED", desc: "Store-and-forward custody transfer confirmed via BPv7 acknowledgement." },
    { time: "12:46 UTC", stage: "AKASHDEEP RECEIVED", realm: "SHIVODAYA SIMULATION", source: "AKASHDEEP DECODER C++17", status: "RECONSTRUCTED", desc: "Reverse MLP projection decoded 32-float vector into full CME threat telemetry." },
    { time: "12:46 UTC", stage: "MISSION ACKNOWLEDGED", realm: "SHIVODAYA SIMULATION", source: "MARS MISSION CONTROL", status: "DEFENSE ACTIVE", desc: "Spacecraft radiation shielding oriented; crew entered solar storm storm-shelter." }
  ];

  const items = customTimeline || defaultTimeline;

  return (
    <div className="bg-zinc-950/90 border border-white/10 rounded-xl p-4 sm:p-5 space-y-4 font-mono">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-white">
            RADIATION EVENT TIMELINE
          </h3>
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="px-2 py-0.5 rounded bg-emerald-950/50 border border-emerald-500/30 text-emerald-400">
            ● REAL OBSERVATION
          </span>
          <span className="px-2 py-0.5 rounded bg-amber-950/50 border border-amber-500/30 text-amber-400">
            ◇ SHIVODAYA SIMULATION
          </span>
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="relative border-l border-white/15 ml-3 pl-5 space-y-4">
        {items.map((item, idx) => {
          const isReal = item.realm.includes("REAL");
          return (
            <div key={idx} className="relative group">
              {/* Step indicator dot */}
              <div className={`absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full border-2 bg-black flex items-center justify-center ${
                isReal ? "border-emerald-400" : "border-amber-400"
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${isReal ? "bg-emerald-400" : "bg-amber-400"}`} />
              </div>

              {/* Step Content Card */}
              <div className="p-3 rounded-lg bg-zinc-900/60 border border-white/5 space-y-1 hover:border-white/15 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-400 tabular-nums font-semibold">{item.time}</span>
                    <span className="font-bold text-white tracking-wide">{item.stage}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className={`px-1.5 py-0.2 rounded border font-semibold ${
                      isReal 
                        ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-400" 
                        : "bg-amber-950/40 border-amber-500/30 text-amber-400"
                    }`}>
                      {item.realm}
                    </span>
                    <span className="text-zinc-500">[{item.status}]</span>
                  </div>
                </div>

                <div className="text-xs text-zinc-300 font-sans leading-relaxed">
                  {item.desc}
                </div>

                <div className="text-[9px] text-zinc-500 font-mono pt-0.5">
                  SYSTEM ENTITY: {item.source}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-[9px] text-zinc-500 font-sans italic pt-1 border-t border-white/5">
        * Architectural Integrity Rule: Real space-weather observations from NOAA/NASA are ingested to demonstrate how the simulated Shivodaya space mesh would autonomously route alerts across deep space.
      </div>

    </div>
  );
}
