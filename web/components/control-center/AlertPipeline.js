"use client";

import React, { useState, useEffect } from "react";
import { Sun, Cpu, Network, Radio, ShieldAlert, Users, ArrowRight, CheckCircle2 } from "lucide-react";

export default function AlertPipeline({ activeStage = 0, isSimulating = false }) {
  // If not manually driven by an external simulation state, cycle periodically
  const [internalStep, setInternalStep] = useState(0);

  useEffect(() => {
    if (isSimulating) return; // externally driven
    const interval = setInterval(() => {
      setInternalStep((prev) => (prev + 1) % 6);
    }, 2800);
    return () => clearInterval(interval);
  }, [isSimulating]);

  const currentStep = isSimulating ? activeStage : internalStep;

  const stages = [
    {
      idx: 0,
      title: "SOLAR EVENT",
      sub: "NOAA/SDO L1 SENTRY",
      status: "TRIGGER DETECTED",
      icon: Sun,
      color: "text-amber-400",
      desc: "X-ray flare / SEP jump detected at heliospheric monitor."
    },
    {
      idx: 1,
      title: "PRAKASH",
      sub: "JSCC VECTOR ENCODER",
      status: "PROCESSING (32-FLOAT)",
      icon: Cpu,
      color: "text-cyan-400",
      desc: "Lock-free ring buffer encodes 5-stream data into micro-embedding."
    },
    {
      idx: 2,
      title: "RICHA",
      sub: "PERCEPTRON ROUTER",
      status: "ROUTING (TVG DIJKSTRA)",
      icon: Network,
      color: "text-indigo-400",
      desc: "Dynamic path calculated to bypass solar blackout disturbance cone."
    },
    {
      idx: 3,
      title: "SPACE RELAYS",
      sub: "INTER-AGENCY MESH",
      status: "FORWARDING (BPv7)",
      icon: Radio,
      color: "text-purple-400",
      desc: "Laser crosslink handoff between ISRO, NASA, and ESA deep space sentries."
    },
    {
      idx: 4,
      title: "AKASHDEEP",
      sub: "SEMANTIC DECODER",
      status: "RECEIVED & DECODED",
      icon: ShieldAlert,
      color: "text-red-400",
      desc: "Reverse MLP reconstructs high-dimensional CME front telemetry."
    },
    {
      idx: 5,
      title: "MISSION & CREW",
      sub: "TARGET VEHICLE",
      status: "ALERT ACKNOWLEDGED",
      icon: Users,
      color: "text-emerald-400",
      desc: "Radiation shielding deployed; crew safely inside storm shelter."
    }
  ];

  return (
    <div className="bg-zinc-950/90 border border-white/10 rounded-xl p-4 sm:p-5 space-y-4 font-mono">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-white">
              SHIVODAYA RADIATION ALERT PIPELINE
            </h3>
          </div>
          <p className="text-[11px] text-zinc-400 font-sans pt-0.5">
            Autonomous mission-to-mission early warning signal propagation sequence.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/15 text-zinc-400">
            STAGE {currentStep + 1} OF 6
          </span>
          <span className="px-2 py-0.5 rounded bg-amber-950/50 border border-amber-500/30 text-amber-400">
            ◇ SHIVODAYA SIMULATION
          </span>
        </div>
      </div>

      {/* Sequential Glowing Stages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 pt-2 relative">
        {stages.map((st) => {
          const Icon = st.icon;
          const isActive = currentStep === st.idx;
          const isPassed = currentStep > st.idx;

          return (
            <div
              key={st.idx}
              className={`p-3.5 rounded-lg border flex flex-col justify-between transition-all duration-300 relative ${
                isActive
                  ? "bg-zinc-900/95 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)] scale-[1.02] z-10"
                  : isPassed
                  ? "bg-zinc-950/80 border-emerald-500/40 text-zinc-300"
                  : "bg-zinc-950/40 border-white/5 opacity-50"
              }`}
            >
              {/* Top Row: Icon and Status Badge */}
              <div className="flex items-start justify-between">
                <div className={`p-1.5 rounded-md ${isActive ? "bg-cyan-500/20 text-cyan-300" : isPassed ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-900 text-zinc-600"}`}>
                  <Icon className="w-4 h-4" />
                </div>
                {isPassed && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                )}
              </div>

              {/* Middle: Title & Subtitle */}
              <div className="py-2.5 space-y-0.5">
                <div className="text-[10px] text-zinc-500 tracking-wider font-semibold uppercase">
                  STEP 0{st.idx + 1}
                </div>
                <div className="text-xs font-bold text-white tracking-wide">
                  {st.title}
                </div>
                <div className="text-[9px] text-zinc-400 truncate">
                  {st.sub}
                </div>
              </div>

              {/* Bottom: Dynamic telemetry state */}
              <div className="pt-2 border-t border-white/5 space-y-1">
                <div className={`text-[10px] font-bold uppercase truncate ${
                  isActive ? "text-cyan-300 animate-pulse" : isPassed ? "text-emerald-400" : "text-zinc-600"
                }`}>
                  ● {isActive ? st.status : isPassed ? "COMPLETE" : "QUEUED"}
                </div>
                <div className="text-[9px] text-zinc-400 font-sans leading-tight line-clamp-2">
                  {st.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Propagation Speed Benchmark Notice */}
      <div className="flex flex-wrap items-center justify-between text-[10px] text-zinc-500 bg-zinc-900/50 p-2.5 rounded border border-white/5">
        <span>END-TO-END AUTONOMOUS LATENCY: <span className="text-white font-bold">5–20 MINUTES</span></span>
        <span>STANDARD GROUND CONTROL LATENCY: <span className="text-red-400 font-semibold line-through">1–24 HOURS</span></span>
        <span className="text-emerald-400 font-semibold">EARTH BYPASS SUCCESSFUL</span>
      </div>

    </div>
  );
}
