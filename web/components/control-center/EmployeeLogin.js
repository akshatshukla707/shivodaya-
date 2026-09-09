"use client";

import React, { useState } from "react";
import { Shield, Lock, Terminal, AlertTriangle, CheckCircle2, KeyRound } from "lucide-react";

export default function EmployeeLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      // Prototype credentials check: abc / 123
      if (username.trim().toLowerCase() === "abc" && password === "123") {
        onLoginSuccess(username.trim().toUpperCase());
      } else {
        setError("AUTHENTICATION FAILED // INVALID CREDENTIALS // ATTEMPT LOGGED");
        setIsLoading(false);
      }
    }, 400);
  };

  const handleQuickFill = () => {
    setUsername("abc");
    setPassword("123");
    setError("");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-4 relative overflow-hidden font-sans select-none">
      {/* Background Video - Dedicated to Employee Login Page */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-35 pointer-events-none z-0 scale-105 transition-opacity duration-1000"
        src="/videos/spaceship.mp4"
      />

      {/* Dark Overlay with Radial Vignette for Contrast */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/70 to-black pointer-events-none z-0" />

      {/* Subtle Background Grid and Radar Rings */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370f_1px,transparent_1px),linear-gradient(to_bottom,#1f29370f_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      <div className="absolute w-[600px] h-[600px] rounded-full border border-cyan-500/10 pointer-events-none animate-pulse z-0" />
      <div className="absolute w-[900px] h-[900px] rounded-full border border-cyan-500/5 pointer-events-none z-0" />

      {/* Main Terminal Container */}
      <div className="w-full max-w-md relative z-10 bg-zinc-950/90 border border-white/15 rounded-xl shadow-2xl backdrop-blur-xl p-8 space-y-6">
        
        {/* Aerospace Identification Header */}
        <div className="border-b border-white/10 pb-5 space-y-1.5 text-center">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-[10px] tracking-widest uppercase mb-2">
            <Terminal className="w-3 h-3" />
            SECURITY GATEWAY // NODE 01
          </div>
          <h1 className="text-2xl font-bold tracking-[0.25em] uppercase text-white font-mono">
            SHIVODAYA
          </h1>
          <h2 className="text-sm font-semibold tracking-[0.2em] uppercase text-cyan-400 font-mono">
            MISSION OPERATIONS
          </h2>
          <p className="text-[11px] tracking-[0.2em] uppercase text-zinc-400 font-mono font-medium pt-1">
            AUTHORIZED PERSONNEL ONLY
          </p>
        </div>

        {/* Security Badge Indicator */}
        <div className="flex items-center justify-between px-3.5 py-2 rounded-lg bg-zinc-900/80 border border-white/10 text-xs font-mono">
          <div className="flex items-center gap-2 text-emerald-400">
            <Shield className="w-4 h-4" />
            <span className="tracking-wider text-[11px]">SYSTEM ACCESS: SECURE</span>
          </div>
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest">ENCRYPTION ACTIVE</span>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-mono flex items-start gap-2.5 animate-shake">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono tracking-widest uppercase text-zinc-400 font-semibold">
              USERNAME
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="OPERATOR CALLSIGN (e.g. abc)"
                required
                autoFocus
                className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900/90 border border-white/15 text-white font-mono text-sm placeholder:text-zinc-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-colors uppercase tracking-wider"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono tracking-widest uppercase text-zinc-400 font-semibold">
              PASSWORD
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="ACCESS CIPHER (e.g. 123)"
                required
                className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900/90 border border-white/15 text-white font-mono text-sm placeholder:text-zinc-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-colors tracking-wider"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-lg bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-black font-bold font-mono tracking-[0.2em] text-xs uppercase transition-all duration-150 shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                AUTHENTICATING...
              </span>
            ) : (
              "[ LOGIN ]"
            )}
          </button>
        </form>

        {/* Prototype Credentials Assistance */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <span>PROTOTYPE CREDENTIALS: <span className="text-zinc-300">abc / 123</span></span>
          <button
            type="button"
            onClick={handleQuickFill}
            className="text-cyan-400 hover:text-cyan-300 underline uppercase tracking-wider text-[10px] flex items-center gap-1"
          >
            <KeyRound className="w-3 h-3" /> Auto-Fill
          </button>
        </div>

        {/* Footer Mission Security Disclaimer */}
        <div className="text-[10px] font-mono text-zinc-600 text-center uppercase tracking-widest pt-1">
          DEEP SPACE EARLY WARNING SENTRY // ISRO - NASA - ESA FEDERATION
        </div>

      </div>
    </div>
  );
}
