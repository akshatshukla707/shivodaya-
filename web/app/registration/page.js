"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, ArrowRight, Sparkles, AlertTriangle, ShieldCheck, 
  Search, ExternalLink, Radio, Check, ChevronRight, X, Mic
} from "lucide-react";

import WorkspaceProgressNav, { REGISTRATION_STEPS } from "@/components/registration/WorkspaceProgressNav";
import PersistentMissionPreview from "@/components/registration/PersistentMissionPreview";
import MissionStatusModal from "@/components/registration/MissionStatusModal";

import Step01Organization from "@/components/registration/Step01Organization";
import Step02Mission from "@/components/registration/Step02Mission";
import Step03Trajectory from "@/components/registration/Step03Trajectory";
import Step04DataAndRadiation from "@/components/registration/Step04DataAndRadiation";
import Step05NetworkRole from "@/components/registration/Step05NetworkRole";
import Step06CrewAndResponsibility from "@/components/registration/Step06CrewAndResponsibility";
import Step07ReviewAndSubmit from "@/components/registration/Step07ReviewAndSubmit";

export default function RegistrationPage() {
  // Mode Selection: false = Minimal Landing Screen, true = Wizard Workspace
  const [isWizardActive, setIsWizardActive] = useState(false);

  // Wizard Step State
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isDemoLoaded, setIsDemoLoaded] = useState(false);
  const [isPreviewDrawerOpen, setIsPreviewDrawerOpen] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Core Form State
  const [formData, setFormData] = useState({
    organization: {
      name: "",
      agencyCode: "",
      type: "Commercial Space Operator",
      country: "",
      director: "",
      contact: "",
      email: "",
      phone: "",
      website: "",
      verificationContact: ""
    },
    mission: {
      name: "",
      id: "",
      type: "Robotic",
      status: "Planned",
      objective: "",
      description: "",
      launchVehicle: "",
      launchSite: "",
      launchDate: "",
      destination: "Mars",
      duration: ""
    },
    trajectory: {
      phase: "Cruise Phase",
      departureWindow: "",
      expectedArrival: "",
      regime: "Mars Transfer Orbit (MTO)",
      ephemerisFileName: null,
      ephemerisFileSize: null,
      ephemerisFormat: null
    },
    dataAndTelemetry: {
      availability: "Planned",
      types: ["Spacecraft Health", "Position", "Power"],
      delivery: "API",
      updateFrequency: "60s",
      contact: ""
    },
    radiation: {
      hasSensors: "NO",
      sensorTypes: [],
      dataMode: "Event-based",
      alertGeneration: "Both",
      canGenerateAlert: false
    },
    network: {
      primaryRole: "Hybrid Node",
      sendAlerts: true,
      relayAlerts: true,
      provideData: true,
      receiveEmergency: true,
      alternateRoute: true,
      alertTypes: ["Radiation", "Solar Particle Event", "CME Shockwave"],
      priority: "High",
      preferredDelivery: "Any available path"
    },
    crew: {
      isCrewed: "NO",
      members: [],
      healthOption: "No health integration",
      medicalOfficer: "",
      emergencyMedicalContact: "",
      healthSystemRef: ""
    },
    responsibility: {
      primaryOps: "",
      secondaryOps: ""
    },
    interoperability: {
      declaredCapabilities: ["DTN / BPv7", "IPN Node Architecture"],
      telemetryFormat: "JSON Schema",
      commandFormat: "CCSDS Telecommand",
      dataInterface: "RESTful API / WebSocket"
    },
    security: {
      authContact: "",
      securityContact: "",
      integrationContact: "",
      authMethod: "Institutional Identity"
    },
    dataSharing: {
      publicLevel: true,
      networkLevel: true,
      operationalLevel: true,
      restrictedLevel: false,
      medicalRestricted: true,
      purposes: ["Network operations", "Alert delivery", "Safety analysis"]
    }
  });

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStage, setSubmissionStage] = useState("");
  const [submissionResult, setSubmissionResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const updateFormData = (sectionKey, sectionData) => {
    setFormData((prev) => ({
      ...prev,
      [sectionKey]: sectionData
    }));
  };

  // Step Validation & Transition Logic
  const markStepComplete = (stepId) => {
    setCompletedSteps((prev) => (prev.includes(stepId) ? prev : [...prev, stepId]));
  };

  const isStepAccessible = (targetStepId) => {
    if (targetStepId <= currentStep) return true;
    for (let i = 1; i < targetStepId; i++) {
      if (!completedSteps.includes(i)) {
        return false;
      }
    }
    return true;
  };

  const goToNextStep = () => {
    markStepComplete(currentStep);
    if (currentStep < 7) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  // Populate Demo Mission Utility
  const populateDemoData = () => {
    setFormData({
      organization: {
        name: "Shivodaya Research Flight",
        agencyCode: "SRF",
        type: "Research Institution",
        country: "India / International",
        director: "Dr. A. K. Sharma",
        contact: "Flight Ops Director P. Nair",
        email: "flight-ops@shivodaya-research.space",
        phone: "+91-80-2839-4400",
        website: "https://shivodaya.space",
        verificationContact: "Deputy Registrar S. Iyer"
      },
      mission: {
        name: "AURORA-DEEP-01",
        id: "ADR-01",
        type: "Technology Demonstration",
        status: "Planned",
        objective: "Autonomous radiation sentry and delay-tolerant laser mesh testbed",
        description: "Deep space technology pathfinder evaluating lock-free JSCC telemetry compression and TVG Dijkstra reroutes along Mars transfer corridors.",
        launchVehicle: "LVM3 / Falcon Heavy",
        launchSite: "Satish Dhawan Space Centre (SDSC)",
        launchDate: "2027-04-15",
        destination: "Mars",
        duration: "36 Months"
      },
      trajectory: {
        phase: "Cruise Phase",
        departureWindow: "2027-04-10 to 2027-05-02 (TMI)",
        expectedArrival: "2027-11-20 UTC (Mars Insertion)",
        regime: "Mars Transfer Orbit (MTO)",
        ephemerisFileName: "aurora_deep_01_ephem_v2.oem",
        ephemerisFileSize: "148.4 KB",
        ephemerisFormat: "OEM"
      },
      dataAndTelemetry: {
        availability: "Live During Mission",
        types: ["Radiation", "Proton Flux", "Spacecraft Health", "Position", "Power", "Thermal"],
        delivery: "Stream",
        updateFrequency: "1 Hz (High-Frequency Stream)",
        contact: "telemetry-desk@shivodaya-research.space"
      },
      radiation: {
        hasSensors: "YES",
        sensorTypes: ["Proton", "X-Ray", "Dosimeter", "Solar Energetic Particles"],
        dataMode: "Continuous",
        alertGeneration: "Both",
        canGenerateAlert: true
      },
      network: {
        primaryRole: "Hybrid Node",
        sendAlerts: true,
        relayAlerts: true,
        provideData: true,
        receiveEmergency: true,
        alternateRoute: true,
        alertTypes: ["Radiation", "Solar Particle Event", "CME Shockwave", "Communication Disruption"],
        priority: "High",
        preferredDelivery: "Any available path"
      },
      crew: {
        isCrewed: "NO",
        members: [],
        healthOption: "No health integration",
        medicalOfficer: "N/A (Robotic Asset)",
        emergencyMedicalContact: "ops-safety@shivodaya-research.space",
        healthSystemRef: ""
      },
      responsibility: {
        primaryOps: "Flight Director P. Nair (+91-80-2839-4401)",
        secondaryOps: "Standby Lead E. Vance (Ka-Band Link)"
      },
      interoperability: {
        declaredCapabilities: ["CCSDS Standard", "DTN / BPv7", "IPN Node Architecture", "Optical Laser Direct"],
        telemetryFormat: "JSON Schema & XTCE",
        commandFormat: "CCSDS Telecommand",
        dataInterface: "RESTful API / UDP Stream"
      },
      security: {
        authContact: "auth-desk@shivodaya-research.space",
        securityContact: "security-officer@shivodaya-research.space",
        integrationContact: "lead-engineer@shivodaya-research.space",
        authMethod: "Institutional Identity"
      },
      dataSharing: {
        publicLevel: true,
        networkLevel: true,
        operationalLevel: true,
        restrictedLevel: false,
        medicalRestricted: true,
        purposes: ["Network operations", "Alert delivery", "Mission monitoring", "Research", "Safety analysis"]
      }
    });

    setIsDemoLoaded(true);
    setCompletedSteps([1, 2, 3, 4, 5, 6]);
  };

  const handleLoadDemoAndStart = () => {
    populateDemoData();
    setIsWizardActive(true);
    setCurrentStep(1);
  };

  const handleBeginRegistration = () => {
    setIsWizardActive(true);
    setCurrentStep(1);
  };

  // Submit Mission Registration Handler
  const handleSubmitRegistration = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // Step 1: Validating
      setSubmissionStage("validating");
      await new Promise((r) => setTimeout(r, 400));

      // Step 2: Creating Application
      setSubmissionStage("creating");
      await new Promise((r) => setTimeout(r, 400));

      // Step 3: Generating ID & Sending Confirmation
      setSubmissionStage("id");
      const res = await fetch("/api/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          isDemo: isDemoLoaded
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to register mission profile.");
      }

      setSubmissionStage("email");
      await new Promise((r) => setTimeout(r, 400));

      setSubmissionStage("done");
      setSubmissionResult(data);
      markStepComplete(7);

    } catch (err) {
      console.error("Submission failed:", err);
      setErrorMessage(err.message || "Network transmission error during mission registration.");
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setSubmissionResult(null);
    setIsSubmitting(false);
    setSubmissionStage("");
    setIsDemoLoaded(false);
    setCurrentStep(1);
    setCompletedSteps([]);
    setFormData({
      organization: { name: "", agencyCode: "", type: "Commercial Space Operator", country: "", email: "" },
      mission: { name: "", destination: "Mars", type: "Robotic", status: "Planned" },
      trajectory: { regime: "Mars Transfer Orbit (MTO)", phase: "Cruise Phase" },
      dataAndTelemetry: { availability: "Planned", types: [] },
      radiation: { hasSensors: "NO", sensorTypes: [], canGenerateAlert: false },
      network: { primaryRole: "Hybrid Node", sendAlerts: true, relayAlerts: true },
      crew: { isCrewed: "NO", members: [] },
      responsibility: {},
      interoperability: { declaredCapabilities: [] },
      security: { authMethod: "Institutional Identity" },
      dataSharing: { purposes: [] }
    });
  };

  const triggerVani = () => {
    if (typeof window !== "undefined" && window.openVani) {
      window.openVani("What telemetry should we provide for node onboarding?");
    }
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* 1. Fixed Shivodaya Global Header (Unchanged) */}
      <header className="fixed top-0 left-0 w-full h-14 z-50 flex items-center justify-between px-6 sm:px-8 bg-black/70 backdrop-blur-md border-b border-white/10 select-none">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-lg font-bold tracking-[0.2em] text-white hover:text-cyan-400 transition-colors uppercase font-mono">
            SHIVODAYA
          </Link>
          <span className="hidden md:inline-block text-[9px] tracking-widest text-cyan-400 font-mono border-l border-white/20 pl-3 uppercase">
            MISSION INTEGRATION
          </span>
        </div>

        <nav className="hidden lg:flex items-center gap-7 text-[11px] font-bold tracking-widest uppercase font-mono">
          <Link href="/" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5">
            <ArrowLeft className="w-3 h-3" /> Home
          </Link>
          <Link href="/vision" className="text-zinc-400 hover:text-white transition-colors">Vision</Link>
          <Link href="/architecture" className="text-zinc-400 hover:text-white transition-colors">Architecture</Link>
          <Link href="/control-center" className="text-zinc-400 hover:text-white transition-colors">Control Center</Link>
          <span className="text-white border-b border-cyan-400 pb-0.5">Registration</span>
        </nav>

        <div className="flex items-center gap-3 font-mono">
          <span className="text-[10px] tracking-wider px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
            IPN REGISTRY OPEN
          </span>
        </div>
      </header>

      {/* ============================================================ */}
      {/* MODE 1: MINIMAL LANDING SCREEN (Shown on first arrival)        */}
      {/* ============================================================ */}
      {!isWizardActive ? (
        <section className="relative min-h-screen pt-14 flex flex-col justify-center items-center px-4 overflow-hidden select-none">
          {/* Subtle Ambient Aerospace Grid and Radial Starlight */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-radial-gradient from-cyan-950/20 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

          {/* Central Aerospace Container */}
          <div className="relative z-10 max-w-2xl w-full mx-auto text-center flex flex-col items-center py-12 sm:py-20 animate-in fade-in duration-300">
            
            {/* Tiny Abstract Mission-Node Vector Diagram */}
            <div className="relative mb-6">
              <svg width="120" height="96" viewBox="0 0 120 96" className="text-cyan-400 mx-auto">
                {/* Connecting hairline mesh lines */}
                <line x1="60" y1="16" x2="24" y2="52" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" className="opacity-40 animate-pulse" />
                <line x1="60" y1="16" x2="96" y2="52" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" className="opacity-40 animate-pulse" />
                <line x1="24" y1="52" x2="96" y2="52" stroke="currentColor" strokeWidth="1.2" className="opacity-30" />
                <line x1="60" y1="52" x2="60" y2="82" stroke="currentColor" strokeWidth="1.2" className="opacity-30" />
                
                {/* Node Points */}
                <circle cx="60" cy="16" r="6" fill="#06b6d4" className="opacity-80" />
                <circle cx="60" cy="16" r="10" fill="none" stroke="#22d3ee" strokeWidth="1" className="opacity-40 animate-ping" style={{ transformOrigin: "60px 16px", animationDuration: "3s" }} />
                <circle cx="24" cy="52" r="5" fill="#38bdf8" className="opacity-80" />
                <circle cx="96" cy="52" r="5" fill="#38bdf8" className="opacity-80" />
                <circle cx="60" cy="82" r="5" fill="#818cf8" className="opacity-80" />
              </svg>
            </div>

            {/* Status Pill: MISSION NODE // READY TO BEGIN */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 border border-white/15 text-[10px] font-mono tracking-widest text-zinc-400 mb-6 uppercase shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>MISSION NODE // READY TO BEGIN</span>
            </div>

            {/* Category / Subsystem Identification */}
            <div className="space-y-1 mb-3">
              <div className="text-[11px] font-mono tracking-[0.3em] uppercase text-cyan-400 font-semibold">
                SHIVODAYA · MISSION INTEGRATION
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-mono uppercase">
                MISSION NODE ONBOARDING
              </h1>
            </div>

            {/* Headline in Quotes */}
            <h2 className="text-base sm:text-lg font-mono text-zinc-300 tracking-wider uppercase mb-3">
              “REGISTER YOUR MISSION”
            </h2>

            {/* Single Core Sentence */}
            <p className="text-xs sm:text-sm text-zinc-400 font-sans max-w-lg mx-auto leading-relaxed mb-8">
              “Connect your mission with the Shivodaya deep-space communication network.”
            </p>

            {/* 3 Clean Concept Indicators */}
            <div className="flex items-center justify-center gap-3 sm:gap-6 text-[11px] font-mono text-zinc-300 mb-10 tracking-widest uppercase">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> MISSION
              </span>
              <span className="text-zinc-600 font-sans">·</span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> TRAJECTORY
              </span>
              <span className="text-zinc-600 font-sans">·</span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> NETWORK
              </span>
            </div>

            {/* Action Buttons: Primary + Demo Utility */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md">
              <button
                type="button"
                onClick={handleBeginRegistration}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-black font-bold font-mono text-xs uppercase tracking-[0.2em] transition-all duration-150 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] flex items-center justify-center gap-2 group"
              >
                <span>BEGIN MISSION REGISTRATION</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={handleLoadDemoAndStart}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-white/15 hover:border-white/30 text-zinc-300 hover:text-white font-mono text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
                title="Populate workspace with consistent fictional dummy mission profile"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>LOAD DEMO MISSION</span>
              </button>
            </div>

            {/* Subtle Status Check Link */}
            <div className="mt-10 pt-6 border-t border-white/10 w-full max-w-sm text-center">
              <button
                type="button"
                onClick={() => setShowStatusModal(true)}
                className="text-[11px] font-mono tracking-widest text-zinc-400 hover:text-cyan-400 uppercase transition-colors inline-flex items-center gap-1.5 group"
              >
                <span>ALREADY HAVE AN APPLICATION? CHECK STATUS</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>
        </section>
      ) : (
        /* ============================================================ */
        /* MODE 2: FOCUSED MISSION ONBOARDING WORKSPACE (WIZARD)        */
        /* ============================================================ */
        <div className="pt-14 animate-in fade-in duration-300">
          
          {/* Sticky Progress Indicator (7 Steps) */}
          <WorkspaceProgressNav
            currentStep={currentStep}
            completedSteps={completedSteps}
            onSelectStep={(stepId) => {
              if (isStepAccessible(stepId)) {
                setCurrentStep(stepId);
                window.scrollTo({ top: 120, behavior: "smooth" });
              }
            }}
            isStepAccessible={isStepAccessible}
          />

          {/* Focused Workspace Top Bar */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-5 pb-2 flex flex-wrap items-center justify-between gap-3 font-mono">
            {/* Exit / Return to Minimal Landing */}
            <button
              type="button"
              onClick={() => setIsWizardActive(false)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 text-[11px] text-zinc-400 hover:text-white transition"
              title="Return to minimal registration overview"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>EXIT TO OVERVIEW</span>
            </button>

            {/* Compact Spacecraft Identity Pill */}
            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-zinc-950 border border-white/10 text-[10px] text-zinc-400">
              <span>NODE: <strong className="text-white">{formData.mission.name || "UNNAMED"}</strong></span>
              <span>|</span>
              <span>DEST: <strong className="text-cyan-400">{formData.mission.destination}</strong></span>
              <span>|</span>
              <span>ROLE: <strong className="text-emerald-400">{formData.network.primaryRole}</strong></span>
            </div>

            {/* Utility Actions: Preview Drawer & Vani Voice */}
            <div className="flex items-center gap-2">
              {isDemoLoaded && (
                <span className="hidden md:inline-block px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[10px] font-bold">
                  ● DEMO LOADED
                </span>
              )}
              
              {!isDemoLoaded && (
                <button
                  type="button"
                  onClick={populateDemoData}
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-[10px] text-zinc-400 hover:text-white transition flex items-center gap-1"
                  title="Auto-populate form with fictional test mission"
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>DEMO DATA</span>
                </button>
              )}

              {/* Vani Voice Assistant Quick Button */}
              <button
                type="button"
                onClick={triggerVani}
                className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-[10px] text-cyan-400 hover:text-cyan-300 transition flex items-center gap-1"
                title="Ask Vani Voice Assistant"
              >
                <Mic className="w-3 h-3" />
                <span>ASK VANI</span>
              </button>

              {/* View Mission Preview Drawer Toggle */}
              <button
                type="button"
                onClick={() => setIsPreviewDrawerOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-[11px] text-cyan-300 font-bold uppercase tracking-wider transition flex items-center gap-1.5 shadow-sm"
              >
                <span>VIEW MISSION PREVIEW</span>
              </button>
            </div>
          </div>

          {/* Main Focused Step Workspace Container */}
          <main className="max-w-4xl mx-auto px-4 sm:px-6 pb-24 pt-3 space-y-6">
            
            {/* Global Error Banner */}
            {errorMessage && (
              <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/50 text-red-200 text-xs font-mono flex items-center gap-2 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Active Step Card */}
            <div className="bg-zinc-950/95 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
              {currentStep === 1 && (
                <Step01Organization
                  formData={formData}
                  updateFormData={updateFormData}
                  onNext={goToNextStep}
                />
              )}

              {currentStep === 2 && (
                <Step02Mission
                  formData={formData}
                  updateFormData={updateFormData}
                  onNext={goToNextStep}
                  onBack={goToPrevStep}
                />
              )}

              {currentStep === 3 && (
                <Step03Trajectory
                  formData={formData}
                  updateFormData={updateFormData}
                  onNext={goToNextStep}
                  onBack={goToPrevStep}
                />
              )}

              {currentStep === 4 && (
                <Step04DataAndRadiation
                  formData={formData}
                  updateFormData={updateFormData}
                  onNext={goToNextStep}
                  onBack={goToPrevStep}
                />
              )}

              {currentStep === 5 && (
                <Step05NetworkRole
                  formData={formData}
                  updateFormData={updateFormData}
                  onNext={goToNextStep}
                  onBack={goToPrevStep}
                />
              )}

              {currentStep === 6 && (
                <Step06CrewAndResponsibility
                  formData={formData}
                  updateFormData={updateFormData}
                  onNext={goToNextStep}
                  onBack={goToPrevStep}
                />
              )}

              {currentStep === 7 && (
                <Step07ReviewAndSubmit
                  formData={formData}
                  onEditStep={(stepNumber) => {
                    setCurrentStep(stepNumber);
                    window.scrollTo({ top: 120, behavior: "smooth" });
                  }}
                  onSubmit={handleSubmitRegistration}
                  isSubmitting={isSubmitting}
                  submissionStage={submissionStage}
                  submissionResult={submissionResult}
                  onReset={handleResetForm}
                />
              )}
            </div>

          </main>

          {/* Slide-out Persistent Mission Preview Drawer */}
          {isPreviewDrawerOpen && (
            <div 
              className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
              onClick={() => setIsPreviewDrawerOpen(false)}
            >
              <div 
                className="w-full max-w-md bg-zinc-950 border-l border-white/15 h-full overflow-y-auto p-5 shadow-2xl animate-in slide-in-from-right duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <PersistentMissionPreview
                  formData={formData}
                  isSubmitted={!!submissionResult}
                  applicationId={submissionResult?.applicationId}
                  isMobileOpen={true}
                  onClose={() => setIsPreviewDrawerOpen(false)}
                />
              </div>
            </div>
          )}

        </div>
      )}

      {/* Application Status Modal */}
      <MissionStatusModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        onLoadApplication={(appRecord) => {
          if (appRecord) {
            setFormData((prev) => ({
              ...prev,
              organization: { ...prev.organization, ...(appRecord.organization || {}) },
              mission: { ...prev.mission, ...(appRecord.mission || {}) },
              trajectory: { ...prev.trajectory, ...(appRecord.trajectory || {}) },
              network: { ...prev.network, ...(appRecord.network || {}) },
              radiation: { ...prev.radiation, ...(appRecord.radiation || {}) }
            }));
            setIsWizardActive(true);
            setCurrentStep(1);
          }
        }}
      />

    </div>
  );
}
