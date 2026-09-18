"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

export default function MeshNetworkPage() {
  return (
    <div className="bg-black text-white min-h-screen pt-24 pb-20 px-6 sm:px-8">
      {/* --- FIXED GLASSMORPHIC NAVBAR --- */}
      <header className="fixed top-0 left-0 w-full h-14 z-50 flex items-center justify-between px-6 sm:px-8 bg-black/40 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-lg font-bold tracking-[0.2em] text-white hover:text-cyan-400 transition-colors uppercase">
            SHIVODAYA
          </Link>
          <span className="hidden md:inline-block text-[9px] tracking-widest text-cyan-400 font-mono border-l border-white/20 pl-3 uppercase">
            Mesh Network
          </span>
        </div>

        <nav className="hidden lg:flex items-center gap-7 text-[11px] font-bold tracking-widest uppercase">
          <Link href="/" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5">
            <ArrowLeft className="w-3 h-3" /> Home
          </Link>
          <Link href="/vision" className="text-zinc-400 hover:text-white transition-colors">Vision</Link>
          <Link href="/architecture" className="text-zinc-400 hover:text-white transition-colors">Architecture</Link>
          <Link href="/control-center" className="text-zinc-400 hover:text-white transition-colors">Control Center</Link>
          <Link href="/registration" className="text-zinc-400 hover:text-white transition-colors">Registration</Link>
        </nav>
      </header>

      <div className="max-w-5xl mx-auto space-y-16 pt-4">
        
        {/* Header */}
        <div className="space-y-2">
          <span className="text-[10px] tracking-[0.3em] uppercase text-cyan-400 font-mono block">
            The Autonomous Triad
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Prakash • Richa • Akashdeep
          </h1>
          <p className="text-sm text-zinc-400 font-light max-w-xl leading-relaxed">
            Native C/C++ aerospace modules engineered for extreme space radiation and deep-space custody routing.
          </p>
        </div>

        {/* 1. PRAKASH SECTION */}
        <section id="prakash" className="border-t border-white/10 pt-12 space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              ipn:1.1 • C11 NATIVE
            </span>
            <span className="text-xs uppercase tracking-widest text-zinc-400 font-mono">
              Sensor Array & JSCC Encoder
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-4">
              <h2 className="text-2xl font-bold text-white">
                Prakash: Vector Compression Engine
              </h2>
              <p className="text-xs text-zinc-300 font-light leading-relaxed">
                Deployed at Lagrange L1/L5 solar sentinels. Ingests 5 live telemetry streams via lock-free atomic rings and zero-copy <code className="text-amber-300 font-mono text-xs">mmap</code>, compressing them into 128-byte JSCC semantic vectors.
              </p>
              <div className="space-y-2 text-xs text-zinc-300 bg-zinc-950 p-4 rounded-xl border border-white/10 font-sans">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-zinc-400" /> Linear Projection: <strong>y = W · x + b</strong></div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-zinc-400" /> Compressed Output: <strong>1 x 32-Float Vector (128 Bytes)</strong></div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-zinc-400" /> Latency: <strong>&lt; 150 microseconds</strong></div>
              </div>
            </div>

            <div className="md:col-span-5 rounded-2xl overflow-hidden border border-white/10 bg-zinc-950">
              <img src="/images/prakash_preview.jpg" alt="Prakash Sensor Array" className="w-full h-auto object-cover opacity-85 hover:opacity-100 transition duration-500" />
            </div>
          </div>
        </section>

        {/* 2. RICHA SECTION */}
        <section id="richa" className="border-t border-white/10 pt-12 space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              ipn:2.1 • C++17 NATIVE
            </span>
            <span className="text-xs uppercase tracking-widest text-zinc-400 font-mono">
              Neural Mesh Router & DTN Custody
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-5 rounded-2xl overflow-hidden border border-white/10 bg-zinc-950 order-2 md:order-1">
              <img src="/images/richa_preview.jpg" alt="Richa Router Constellation" className="w-full h-auto object-cover opacity-85 hover:opacity-100 transition duration-500" />
            </div>

            <div className="md:col-span-7 space-y-4 order-1 md:order-2">
              <h2 className="text-2xl font-bold text-white">
                Richa: Neural Routing Engine
              </h2>
              <p className="text-xs text-zinc-300 font-light leading-relaxed">
                Operates across 100+ deep-space orbiters. Evaluates dynamic contact windows via Time-Varying Graphs (TVG) and performs autonomous multi-hop rerouting around solar blackout zones.
              </p>
              <div className="space-y-2 text-xs text-zinc-300 bg-zinc-950 p-4 rounded-xl border border-white/10 font-sans">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-zinc-400" /> Algorithm: <strong>100-Node TVG Dijkstra + Multi-Hop BFS</strong></div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-zinc-400" /> Protocol: <strong>Bundle Protocol v7 (BPv7) Custody</strong></div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-zinc-400" /> Reroute Time: <strong>&lt; 4 milliseconds</strong></div>
              </div>

              <div className="pt-2">
                <a
                  href="/mesh-3d.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 hover:text-white border border-cyan-500/40 hover:border-cyan-400 text-xs font-mono tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(0,240,255,0.15)]"
                >
                  <span>Launch 3D DTN Mesh Visualizer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 3. AKASHDEEP SECTION */}
        <section id="akashdeep" className="border-t border-white/10 pt-12 space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
              ipn:3.1 • C++17 & JAVA HUD
            </span>
            <span className="text-xs uppercase tracking-widest text-zinc-400 font-mono">
              Martian Semantic Decoder & HUD
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-4">
              <h2 className="text-2xl font-bold text-white">
                Akashdeep: Semantic Wavefront Decoder
              </h2>
              <p className="text-xs text-zinc-300 font-light leading-relaxed">
                Stationed at Martian and Lunar habitats. Performs Reverse MLP matrix multiplication in sub-milliseconds to reconstruct radiation fronts and trigger automatic crew bunker alarms.
              </p>
              <div className="space-y-2 text-xs text-zinc-300 bg-zinc-950 p-4 rounded-xl border border-white/10 font-sans">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-zinc-400" /> Decoder: <strong>32-Float Vector ➔ Physical Spectra</strong></div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-zinc-400" /> Decode Latency: <strong>&lt; 0.8 milliseconds</strong></div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-zinc-400" /> Emergency Alerts: <strong>Autonomous EVA Safe-Zone Alarm</strong></div>
              </div>
            </div>

            <div className="md:col-span-5 rounded-2xl overflow-hidden border border-white/10 bg-zinc-950">
              <img src="/images/akashdeep_preview.jpg" alt="Akashdeep Martian HUD" className="w-full h-auto object-cover opacity-85 hover:opacity-100 transition duration-500" />
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
