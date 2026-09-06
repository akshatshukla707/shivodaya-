"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle, ShieldCheck, Mic } from "lucide-react";
import { useState } from "react";

export default function RegistrationPage() {
  const [formData, setFormData] = useState({
    agencyName: "",
    agencyCode: "",
    sector: "Commercial Space Operator",
    country: "",
    email: "",
    orbit: "Lunar Halo Orbit (NRHO / L2)",
    nodeRole: "Richa Perceptron Mesh Node",
    transponder: "Optical Laser Crosslink & Ka-Band"
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [assignedIpn, setAssignedIpn] = useState("");

  const triggerVani = () => {
    if (typeof window !== "undefined" && window.openVani) {
      window.openVani("How do I register our spacecraft into Shivodaya?");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = formData.agencyCode.trim().toUpperCase() || "AGENCY";
    const ipn = `ipn:${code}.1`;
    setAssignedIpn(ipn);
    setIsSubmitted(true);
  };

  return (
    <div className="bg-black text-white min-h-screen pt-24 pb-20 px-6 sm:px-8">
      {/* --- FIXED GLASSMORPHIC NAVBAR --- */}
      <header className="fixed top-0 left-0 w-full h-14 z-50 flex items-center justify-between px-6 sm:px-8 bg-black/40 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-lg font-bold tracking-[0.2em] text-white hover:text-cyan-400 transition-colors uppercase">
            SHIVODAYA
          </Link>
          <span className="hidden md:inline-block text-[9px] tracking-widest text-cyan-400 font-mono border-l border-white/20 pl-3 uppercase">
            Node Onboarding
          </span>
        </div>

        <nav className="hidden lg:flex items-center gap-7 text-[11px] font-bold tracking-widest uppercase">
          <Link href="/" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5">
            <ArrowLeft className="w-3 h-3" /> Home
          </Link>
          <Link href="/vision" className="text-zinc-400 hover:text-white transition-colors">Vision</Link>
          <Link href="/architecture" className="text-zinc-400 hover:text-white transition-colors">Architecture</Link>
          <Link href="/control-center" className="text-zinc-400 hover:text-white transition-colors">Control Center</Link>
          <span className="text-white border-b border-cyan-400 pb-0.5">Registration</span>
        </nav>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono tracking-wider px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
            IPN REGISTRY OPEN
          </span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto space-y-10 pt-4">
        
        {/* Header */}
        <div className="space-y-2">
          <span className="text-[10px] tracking-[0.3em] uppercase text-cyan-400 font-mono block">
            Phase 04 // Orbital Node Onboarding
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Register Spacecraft Node
          </h1>
          <p className="text-xs text-zinc-400 font-light leading-relaxed max-w-xl">
            Integrate orbital assets into the Shivodaya autonomous deep-space early-warning network.
          </p>
        </div>

        {/* Vani Voice Assistant Banner in Main Registration Lane */}
        <div 
          onClick={triggerVani}
          className="p-4 sm:p-5 rounded-2xl bg-zinc-950/80 border border-white/15 hover:border-cyan-400/40 cursor-pointer transition-all duration-300 flex items-center justify-between group shadow-lg"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-400/30 group-hover:bg-cyan-500 group-hover:text-black transition-colors">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white flex items-center gap-2">
                <span>Need Voice Assistance?</span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-400/30">Vani Online</span>
              </div>
              <div className="text-[11px] text-zinc-400 font-light mt-0.5">
                Let Vani guide you through node credentials setup.
              </div>
            </div>
          </div>
          <button 
            type="button"
            className="px-3.5 py-1.5 rounded-full bg-white text-black text-[11px] font-semibold uppercase tracking-wider group-hover:bg-zinc-200 transition"
          >
            Ask Vani
          </button>
        </div>

        {/* Registration Form / Success Modal */}
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="p-8 sm:p-10 rounded-3xl bg-zinc-950 border border-white/10 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">
                  Organization / Space Agency Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Agnikul Cosmos, Rocket Lab, ISRO"
                  value={formData.agencyName}
                  onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })}
                  className="w-full bg-black border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white transition"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">
                  Agency Code (for IPN Subnet) *
                </label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  placeholder="e.g. AGNI, NASA, SPACEX"
                  value={formData.agencyCode}
                  onChange={(e) => setFormData({ ...formData, agencyCode: e.target.value.toUpperCase() })}
                  className="w-full bg-black border border-white/15 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder-zinc-600 focus:outline-none focus:border-white transition"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">
                  Sector Classification
                </label>
                <select
                  value={formData.sector}
                  onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                  className="w-full bg-black border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition"
                >
                  <option value="Commercial Space Operator">Commercial Space Operator</option>
                  <option value="Government Space Agency">Government Space Agency</option>
                  <option value="Research & Deep Space Observatory">Research & Deep Space Observatory</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">
                  Country / Jurisdiction *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. India, USA, Global"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full bg-black border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white transition"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">
                  Mission Director Contact Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="flight-director@spacecraft.org"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-black border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white transition font-mono"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">
                  Orbital Regime / Ephemeris
                </label>
                <select
                  value={formData.orbit}
                  onChange={(e) => setFormData({ ...formData, orbit: e.target.value })}
                  className="w-full bg-black border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition"
                >
                  <option value="Lunar Halo Orbit (NRHO / L2)">Lunar Halo Orbit (NRHO / L2)</option>
                  <option value="Mars Transfer Orbit (MTO)">Mars Transfer Orbit (MTO)</option>
                  <option value="Martian Aerostationary & Surface">Martian Aerostationary & Surface</option>
                  <option value="Heliospheric Lagrange L1/L5">Heliospheric Lagrange L1 / L5</option>
                  <option value="GEO / LEO Constellation">GEO / LEO Constellation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">
                  Desired Node Subsystem Role
                </label>
                <select
                  value={formData.nodeRole}
                  onChange={(e) => setFormData({ ...formData, nodeRole: e.target.value })}
                  className="w-full bg-black border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition"
                >
                  <option value="Prakash JSCC Vector Sensor">Prakash JSCC Vector Sensor</option>
                  <option value="Richa Perceptron Mesh Node">Richa Perceptron Mesh Node</option>
                  <option value="Akashdeep Semantic Decoder">Akashdeep Semantic Decoder</option>
                  <option value="Full Triad Universal Node">Full Triad Universal Node</option>
                </select>
              </div>

            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-black font-medium text-xs tracking-wider uppercase hover:bg-zinc-200 transition-all duration-300"
              >
                Submit Node Authorization Request
              </button>
            </div>
          </form>
        ) : (
          <div className="p-10 rounded-3xl bg-zinc-950 border border-white/20 text-center space-y-6">
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">
                Spacecraft Node Authorized
              </h2>
              <p className="text-sm text-zinc-400 font-light">
                Assigned Interplanetary Node Identifier:
              </p>
              <div className="text-2xl font-mono font-bold text-white tracking-widest py-2">
                {assignedIpn}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-black border border-white/10 text-left font-mono text-xs text-zinc-400 space-y-1">
              <div>Agency: <span className="text-white">{formData.agencyName}</span></div>
              <div>Orbit: <span className="text-white">{formData.orbit}</span></div>
              <div>Subsystem: <span className="text-white">{formData.nodeRole}</span></div>
              <div>Status: <span className="text-emerald-400">CLEARANCE GRANTED</span></div>
            </div>

            <button
              onClick={() => setIsSubmitted(false)}
              className="px-6 py-2.5 rounded-full border border-white/30 hover:border-white text-xs tracking-wider uppercase text-white hover:bg-white hover:text-black transition"
            >
              Register Another Spacecraft
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
