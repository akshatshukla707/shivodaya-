"use client";

import React from "react";
import { Network, ShieldAlert, Radio, Cpu, Share2, Eye, ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle } from "lucide-react";

export default function Step05NetworkRole({
  formData,
  updateFormData,
  onNext,
  onBack
}) {
  const { network = {} } = formData;

  const handleNetworkChange = (field, value) => {
    updateFormData("network", {
      ...network,
      [field]: value
    });
  };

  const toggleAlertType = (type) => {
    const current = network.alertTypes || [];
    const next = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    handleNetworkChange("alertTypes", next);
  };

  const roles = [
    {
      id: "Radiation Sentinel",
      num: "01",
      title: "RADIATION SENTINEL",
      desc: "Detect environmental hazards and contribute relevant radiation information.",
      icon: ShieldAlert,
      color: "text-amber-400 border-amber-500/40 bg-amber-950/20"
    },
    {
      id: "Relay Node",
      num: "02",
      title: "RELAY NODE",
      desc: "Help carry important information and delay-tolerant bundles for other missions.",
      icon: Radio,
      color: "text-indigo-400 border-indigo-500/40 bg-indigo-950/20"
    },
    {
      id: "Mission Endpoint",
      num: "03",
      title: "MISSION ENDPOINT",
      desc: "Receive alerts and mission-critical early warnings for crew and avionics defense.",
      icon: Cpu,
      color: "text-cyan-400 border-cyan-500/40 bg-cyan-950/20"
    },
    {
      id: "Hybrid Node",
      num: "04",
      title: "HYBRID NODE",
      desc: "Detect environmental radiation, relay network packets, and receive critical alerts.",
      icon: Network,
      color: "text-emerald-400 border-emerald-500/40 bg-emerald-950/20"
    },
    {
      id: "Data Contributor",
      num: "05",
      title: "DATA CONTRIBUTOR",
      desc: "Provide selected environmental, telemetry, or scientific observation data.",
      icon: Share2,
      color: "text-sky-400 border-sky-500/40 bg-sky-950/20"
    },
    {
      id: "Observer",
      num: "06",
      title: "OBSERVER",
      desc: "Receive network telemetry and status bulletins without forwarding traffic.",
      icon: Eye,
      color: "text-zinc-400 border-zinc-500/40 bg-zinc-900/40"
    }
  ];

  const participationQuestions = [
    { key: "sendAlerts", label: "MAY SHIVODAYA SEND ALERTS TO THIS MISSION?" },
    { key: "relayAlerts", label: "MAY THIS MISSION RELAY ALERTS FOR OTHER MISSIONS?" },
    { key: "provideData", label: "MAY THIS MISSION PROVIDE SELECTED DATA TO THE NETWORK?" },
    { key: "receiveEmergency", label: "MAY THIS MISSION RECEIVE EMERGENCY ALERTS?" },
    { key: "alternateRoute", label: "MAY THIS MISSION PROVIDE AN ALTERNATE ROUTE DURING BLACKOUTS?" }
  ];

  const alertTypesList = [
    "Radiation",
    "Solar Particle Event",
    "Solar Flare",
    "CME Shockwave",
    "Communication Disruption",
    "Navigation Anomaly",
    "Spacecraft Health",
    "Network Failure",
    "Mission-Critical Event",
    "Other"
  ];

  return (
    <div className="space-y-6 font-mono animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 text-cyan-400 text-[10px] font-bold tracking-widest uppercase">
          <Network className="w-3.5 h-3.5" />
          <span>STEP 05 // DEEP-SPACE MESH PARTICIPATION</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide mt-1">
          HOW WILL YOUR MISSION PARTICIPATE?
        </h2>
        <p className="text-xs text-zinc-400 font-sans mt-0.5">
          Select your spacecraft’s architectural node archetype, routing permissions, and emergency dispatch preferences.
        </p>
      </div>

      {/* 1. Six Primary Node Archetypes */}
      <div className="space-y-3">
        <label className="text-[10px] uppercase tracking-wider text-zinc-300 font-semibold block">
          SELECT PRIMARY NODE ARCHETYPE:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {roles.map((r) => {
            const Icon = r.icon;
            const isSelected = (network.primaryRole || "Hybrid Node") === r.id;

            return (
              <div
                key={r.id}
                onClick={() => handleNetworkChange("primaryRole", r.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 select-none ${
                  isSelected
                    ? "bg-cyan-500/15 border-cyan-400/80 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                    : "bg-zinc-950/80 hover:bg-zinc-900 border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${isSelected ? "text-cyan-400" : "text-zinc-500"}`} />
                    <span className="text-[10px] text-zinc-500">{r.num}</span>
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                  )}
                </div>

                <h4 className={`text-xs font-bold uppercase tracking-wider ${isSelected ? "text-white" : "text-zinc-300"}`}>
                  {r.title}
                </h4>

                <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                  {r.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Network Participation Permissions (Requested Capabilities) */}
      <div className="bg-zinc-950/90 border border-white/10 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            REQUESTED PARTICIPATION CAPABILITIES
          </h3>
          <span className="text-[9px] text-zinc-500 italic">
            * Declared capabilities are subject to operational verification. No guaranteed access.
          </span>
        </div>

        <div className="space-y-3">
          {participationQuestions.map((q) => {
            const isYes = !!network[q.key];

            return (
              <div
                key={q.key}
                className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg bg-zinc-900/60 border border-white/5 text-xs"
              >
                <span className="text-zinc-300 text-[11px] font-medium">{q.label}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleNetworkChange(q.key, true)}
                    className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-all ${
                      isYes
                        ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/20"
                        : "bg-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    YES
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNetworkChange(q.key, false)}
                    className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-all ${
                      !isYes
                        ? "bg-zinc-700 text-white"
                        : "bg-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    NO
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Alert Subscription Preferences */}
      <div className="bg-zinc-950/90 border border-white/10 rounded-2xl p-5 space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
          WHAT SHOULD THIS MISSION KNOW? (ALERT SUBSCRIPTIONS)
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {alertTypesList.map((type) => {
            const isChecked = (network.alertTypes || []).includes(type);

            return (
              <label
                key={type}
                className={`flex items-center gap-2 p-2 rounded-lg border text-[11px] cursor-pointer transition-all select-none ${
                  isChecked
                    ? "bg-cyan-500/15 text-cyan-300 border-cyan-400/50 font-bold"
                    : "bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border-white/5"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleAlertType(type)}
                  className="accent-cyan-400 rounded"
                />
                <span className="truncate">{type}</span>
              </label>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
              ALERT PRIORITY THRESHOLD
            </label>
            <select
              value={network.priority || "High"}
              onChange={(e) => handleNetworkChange("priority", e.target.value)}
              className="w-full bg-zinc-900/90 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 transition cursor-pointer"
            >
              <option value="Emergency">Emergency Only (Life / Severe Damage Risk)</option>
              <option value="High">High & Emergency (SPE, Class X Flares, Severe CME)</option>
              <option value="Normal">Normal Operational Range</option>
              <option value="Informational">All Informational & Diagnostic Bulletins</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
              PREFERRED DELIVERY PATH
            </label>
            <select
              value={network.preferredDelivery || "Any available path"}
              onChange={(e) => handleNetworkChange("preferredDelivery", e.target.value)}
              className="w-full bg-zinc-900/90 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 transition cursor-pointer"
            >
              <option value="Direct where available">Direct Line-of-Sight where available</option>
              <option value="Relay where available">Laser Relay Crosslink where available</option>
              <option value="Store-and-forward">Delay-Tolerant Store-and-Forward (BPv7)</option>
              <option value="Any available path">Any Available Routing Path</option>
            </select>
          </div>
        </div>
      </div>

      {/* Navigation Actions */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/15 text-zinc-300 hover:text-white text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
        >
          <span>CONTINUE TO CREW & RESPONSIBILITY</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
