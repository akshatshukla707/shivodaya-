"use client";

import React, { useState } from "react";
import { Search, X, CheckCircle2, Clock, AlertTriangle, ShieldCheck, ArrowRight, Radio } from "lucide-react";

export default function MissionStatusModal({ isOpen, onClose, onLoadApplication }) {
  const [queryId, setQueryId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSearch = async (idToSearch) => {
    const targetId = (idToSearch || queryId).trim();
    if (!targetId) return;

    setIsLoading(true);
    setError("");
    setSearchResult(null);

    try {
      const res = await fetch(`/api/registration?id=${encodeURIComponent(targetId)}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || `No registered application found with ID "${targetId}".`);
      }

      setSearchResult(data.registration);
    } catch (err) {
      setError(err.message || "Failed to retrieve application status.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (id) => {
    setQueryId(id);
    handleSearch(id);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "ACTIVE":
      case "AUTHORIZED":
        return { bg: "bg-emerald-500/15", border: "border-emerald-500/40", text: "text-emerald-300", icon: CheckCircle2 };
      case "VERIFIED":
        return { bg: "bg-cyan-500/15", border: "border-cyan-500/40", text: "text-cyan-300", icon: ShieldCheck };
      case "UNDER REVIEW":
        return { bg: "bg-amber-500/15", border: "border-amber-500/40", text: "text-amber-300", icon: Clock };
      case "REJECTED":
      case "HOLD":
        return { bg: "bg-red-500/15", border: "border-red-500/40", text: "text-red-300", icon: AlertTriangle };
      default:
        return { bg: "bg-zinc-800", border: "border-white/10", text: "text-zinc-300", icon: Clock };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-mono animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-zinc-950 border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-white">
              MISSION REGISTRY // APPLICATION STATUS
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-2 font-semibold">
              ENTER APPLICATION REFERENCE ID
            </label>
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
              className="flex gap-2"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={queryId}
                  onChange={(e) => setQueryId(e.target.value)}
                  placeholder="e.g. SHV-2026-0038"
                  autoFocus
                  className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-white/15 text-white font-mono text-sm placeholder:text-zinc-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 uppercase tracking-wider"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !queryId.trim()}
                className="px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:hover:bg-cyan-500 text-black font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5"
              >
                {isLoading ? (
                  <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Search className="w-3.5 h-3.5" />
                )}
                <span>QUERY</span>
              </button>
            </form>

            {/* Quick Fill Samples */}
            <div className="mt-3 flex items-center gap-2 text-[10px] text-zinc-500">
              <span>SAMPLES IN REGISTRY:</span>
              <button
                type="button"
                onClick={() => handleQuickFill("SHV-2026-0038")}
                className="text-cyan-400 hover:underline hover:text-cyan-300 uppercase"
              >
                SHV-2026-0038
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => handleQuickFill("SHV-2026-0041")}
                className="text-cyan-400 hover:underline hover:text-cyan-300 uppercase"
              >
                SHV-2026-0041
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Search Result Card */}
          {searchResult && (
            <div className="p-4 rounded-xl bg-zinc-900/90 border border-white/15 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <div className="text-[10px] text-zinc-500 tracking-widest uppercase">
                    APPLICATION RECORD
                  </div>
                  <div className="text-base font-bold text-white tracking-wider">
                    {searchResult.applicationId}
                  </div>
                  <div className="text-xs text-zinc-400 font-sans mt-0.5">
                    {searchResult.organization?.name} ({searchResult.organization?.agencyCode || "N/A"})
                  </div>
                </div>

                {/* Status Badge */}
                {(() => {
                  const badge = getStatusBadge(searchResult.status);
                  const Icon = badge.icon;
                  return (
                    <div className={`px-2.5 py-1 rounded-full border flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${badge.bg} ${badge.border} ${badge.text}`}>
                      <Icon className="w-3 h-3" />
                      <span>{searchResult.status || "SUBMITTED"}</span>
                    </div>
                  );
                })()}
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-zinc-500 block">MISSION IDENTITY</span>
                  <span className="text-zinc-200 font-semibold">{searchResult.mission?.name || "N/A"}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-zinc-500 block">DESTINATION / REGIME</span>
                  <span className="text-zinc-200 font-semibold">{searchResult.mission?.destination || searchResult.trajectory?.regime || "Mars"}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-zinc-500 block">DECLARED ROLE</span>
                  <span className="text-cyan-300 font-semibold">{searchResult.network?.primaryRole || "Hybrid Node"}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-zinc-500 block">ASSIGNED IPN NODE</span>
                  <span className="text-emerald-400 font-semibold">
                    {searchResult.assignedNode || "PENDING BOARD REVIEW"}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-zinc-500 block">SUBMISSION DATE</span>
                  <span className="text-zinc-400">
                    {searchResult.createdAt ? new Date(searchResult.createdAt).toLocaleDateString() : "2026-09-08"}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-zinc-500 block">RADIATION SENSORS</span>
                  <span className="text-zinc-300">
                    {searchResult.radiation?.hasSensors === "YES" ? "ACTIVE / TELEMETRY LINKED" : "NONE DECLARED"}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] text-zinc-500">
                  Operated under ISRO / NASA / ESA IPN Accord
                </span>
                {onLoadApplication && (
                  <button
                    type="button"
                    onClick={() => {
                      onLoadApplication(searchResult);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-cyan-300 hover:text-white text-[11px] font-mono uppercase tracking-wider transition flex items-center gap-1"
                  >
                    <span>LOAD INTO WORKSPACE</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-zinc-900/40 text-center">
          <p className="text-[10px] text-zinc-500 font-sans">
            Need urgent operator authorization? Contact Mission Flight Ops desk at <span className="text-zinc-300 font-mono">ops@shivodaya.space</span>
          </p>
        </div>
      </div>
    </div>
  );
}
