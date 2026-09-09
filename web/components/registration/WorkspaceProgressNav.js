"use client";

import React from "react";
import { Check, ShieldCheck, Building2, Rocket, Compass, Database, Network, Users, FileCheck } from "lucide-react";

export const REGISTRATION_STEPS = [
  { id: 1, key: "organization", number: "01", label: "ORGANIZATION", question: "WHO ARE YOU?", icon: Building2 },
  { id: 2, key: "mission", number: "02", label: "MISSION", question: "WHAT ARE YOU FLYING?", icon: Rocket },
  { id: 3, key: "trajectory", number: "03", label: "TRAJECTORY", question: "WHERE IS IT GOING?", icon: Compass },
  { id: 4, key: "data", number: "04", label: "DATA & SENSORS", question: "WHAT CAN IT SEE?", icon: Database },
  { id: 5, key: "network", number: "05", label: "NETWORK ROLE", question: "HOW WILL IT HELP?", icon: Network },
  { id: 6, key: "crew", number: "06", label: "CREW & ROLES", question: "WHO IS RESPONSIBLE?", icon: Users },
  { id: 7, key: "review", number: "07", label: "REVIEW & SUBMIT", question: "IS EVERYTHING READY?", icon: FileCheck }
];

export default function WorkspaceProgressNav({
  currentStep = 1,
  completedSteps = [],
  onSelectStep,
  isStepAccessible
}) {
  return (
    <div className="sticky top-14 z-30 bg-zinc-950/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-2.5 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        
        {/* Horizontal Steps List */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5 select-none w-full">
          {REGISTRATION_STEPS.map((step) => {
            const isActive = currentStep === step.id;
            const isCompleted = completedSteps.includes(step.id);
            const canNavigate = isStepAccessible ? isStepAccessible(step.id) : (step.id <= currentStep || isCompleted);
            const Icon = step.icon;

            return (
              <button
                key={step.id}
                onClick={() => {
                  if (canNavigate && onSelectStep) {
                    onSelectStep(step.id);
                  }
                }}
                disabled={!canNavigate}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-xs transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? "bg-cyan-500/15 text-cyan-300 border border-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.25)] font-bold"
                    : isCompleted
                    ? "bg-zinc-900/80 text-zinc-300 hover:text-white border border-emerald-500/30 hover:border-emerald-500/60 cursor-pointer"
                    : canNavigate
                    ? "bg-zinc-900/50 text-zinc-400 hover:text-zinc-200 border border-white/5 cursor-pointer"
                    : "bg-black/40 text-zinc-600 border border-white/5 cursor-not-allowed opacity-60"
                }`}
              >
                {/* Step indicator: checkmark if completed and not active, otherwise number */}
                <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold ${
                  isActive
                    ? "bg-cyan-400 text-black"
                    : isCompleted
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : "bg-zinc-800 text-zinc-400"
                }`}>
                  {isCompleted && !isActive ? (
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  ) : (
                    step.number
                  )}
                </span>

                <span className="tracking-wider uppercase text-[11px]">
                  {step.label}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
