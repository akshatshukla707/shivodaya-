"use client";

import Link from "next/link";
import { ArrowLeft, Radio, Globe, Shield, Activity, RefreshCw } from "lucide-react";
import { useState } from "react";

export default function ControlCenterPage() {
  const [activeTab, setActiveTab] = useState("nodes");

  const nodes = [
    { ipn: "ipn:1.1", name: "ISRO Deep Space Sentry", orbit: "Earth-Moon L1", status: "NOMINAL", latency: "1.2s", band: "Ka-Band" },
    { ipn: "ipn:2.1", name: "NASA Lunar Gateway Alpha", orbit: "NRHO Lunar", status: "NOMINAL", latency: "1.4s", band: "Optical Laser" },
    { ipn: "ipn:4.1", name: "ESA Solar Sentinel", orbit: "Heliospheric L5", status: "NOMINAL", latency: "24.1s", band: "X-Band" },
    { ipn: "ipn:5.1", name: "SpaceX Starship Relay Fleet", orbit: "Mars Transfer (MTO)", status: "NOMINAL", latency: "8.3m", band: "Laser Crosslink" },
    { ipn: "ipn:3.1", name: "Akashdeep Mars Command Terminal", orbit: "Mars Surface / Valles Marineris", status: "ACTIVE DEFENSE", latency: "12.4m", band: "Optical / X-Band" },
  ];

  return (
    <div className="bg-black text-white min-h-screen pt-24 pb-20 px-6 sm:px-8">
      {/* --- FIXED GLASSMORPHIC NAVBAR --- */}
      <header className="fixed top-0 left-0 w-full h-14 z-50 flex items-center justify-between px-6 sm:px-8 bg-black/40 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-lg font-bold tracking-[0.2em] text-white hover:text-cyan-400 transition-colors uppercase">
            SHIVODAYA
          </Link>
          <span className="hidden md:inline-block text-[9px] tracking-widest text-cyan-400 font-mono border-l border-white/20 pl-3 uppercase">
            Control Center
          </span>
        </div>

        <nav className="hidden lg:flex items-center gap-7 text-[11px] font-bold tracking-widest uppercase">
          <Link href="/" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5">
            <ArrowLeft className="w-3 h-3" /> Home
          </Link>
          <Link href="/vision" className="text-zinc-400 hover:text-white transition-colors">Vision</Link>
          <Link href="/architecture" className="text-zinc-400 hover:text-white transition-colors">Architecture</Link>
          <span className="text-white border-b border-cyan-400 pb-0.5">Control Center</span>
          <Link href="/registration" className="text-zinc-400 hover:text-white transition-colors">Registration</Link>
        </nav>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 text-[10px] font-mono px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            ALL LINKS ONLINE
          </span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto space-y-10 pt-4">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/10">
          <div className="space-y-1.5">
            <span className="text-[10px] tracking-[0.3em] uppercase text-cyan-400 font-mono block">
              Mission Operations // Live Telemetry
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Space Mesh Control
            </h1>
            <p className="text-xs text-zinc-400 font-light">
              Real-time link custody and autonomous routing status across active nodes.
            </p>
          </div>
        </div>

        {/* Key Real-Time Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-zinc-950/80 border border-white/10 space-y-1">
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">Active Nodes</div>
            <div className="text-3xl font-bold text-white">124</div>
            <div className="text-[11px] text-zinc-400">Inter-Agency Spacecraft</div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950/80 border border-white/10 space-y-1">
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">DTN Buffer</div>
            <div className="text-3xl font-bold text-white">16.4 TB</div>
            <div className="text-[11px] text-zinc-400">Custody Pool</div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950/80 border border-white/10 space-y-1">
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">Reroute Time</div>
            <div className="text-3xl font-bold text-cyan-400">3.8 ms</div>
            <div className="text-[11px] text-zinc-400">TVG Dijkstra</div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950/80 border border-white/10 space-y-1">
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">Delivery Rate</div>
            <div className="text-3xl font-bold text-emerald-400">99.98%</div>
            <div className="text-[11px] text-zinc-400">Zero Blackout Loss</div>
          </div>
        </div>

        {/* Active Nodes Table */}
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950/80 border border-white/10 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">
              Active Interplanetary Relays
            </h3>
            <span className="text-xs text-zinc-500 font-mono">Live Sync Active</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs text-zinc-500 uppercase tracking-wider">
                  <th className="pb-3">Node IPN</th>
                  <th className="pb-3">Spacecraft / Agency</th>
                  <th className="pb-3">Orbital Profile</th>
                  <th className="pb-3">Link Band</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {nodes.map((node) => (
                  <tr key={node.ipn} className="hover:bg-white/5 transition">
                    <td className="py-4 font-mono text-xs text-white font-semibold">{node.ipn}</td>
                    <td className="py-4 font-medium text-white">{node.name}</td>
                    <td className="py-4 text-zinc-400">{node.orbit}</td>
                    <td className="py-4 text-zinc-400">{node.band}</td>
                    <td className="py-4">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-mono">
                        {node.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
