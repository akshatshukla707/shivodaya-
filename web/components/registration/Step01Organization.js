"use client";

import React, { useState } from "react";
import { Building2, ArrowRight, Shield, Globe, Mail, Phone, ExternalLink } from "lucide-react";

export default function Step01Organization({
  formData,
  updateFormData,
  onNext
}) {
  const { organization = {} } = formData;
  const [touched, setTouched] = useState({});

  const handleChange = (field, value) => {
    updateFormData("organization", {
      ...organization,
      [field]: value
    });
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const isEmailValid = !organization.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(organization.email);
  const isOrgValid = !!organization.name?.trim();
  const isCodeValid = !!organization.agencyCode?.trim();
  const isCountryValid = !!organization.country?.trim();
  const isEmailPresent = !!organization.email?.trim() && isEmailValid;

  const canProceed = isOrgValid && isCodeValid && isCountryValid && isEmailPresent;

  const orgTypes = [
    "Commercial Space Operator",
    "Government Agency",
    "Research Institution",
    "University",
    "Private Mission",
    "International Consortium",
    "Other"
  ];

  return (
    <div className="space-y-6 font-mono animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 text-cyan-400 text-[10px] font-bold tracking-widest uppercase">
          <Building2 className="w-3.5 h-3.5" />
          <span>STEP 01 // ORGANIZATIONAL PROFILE</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide mt-1">
          WHO ARE YOU?
        </h2>
        <p className="text-xs text-zinc-400 font-sans mt-0.5">
          Establish the legal authority, operational points of contact, and sovereign jurisdiction responsible for this spacecraft.
        </p>
      </div>

      {/* Form Fields Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        
        {/* Organization Name */}
        <div className="space-y-1 sm:col-span-2">
          <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold flex items-center justify-between">
            <span>ORGANIZATION / SPACE AGENCY *</span>
            {touched.name && !isOrgValid && (
              <span className="text-red-400 text-[9px]">ORGANIZATION NAME REQUIRED</span>
            )}
          </label>
          <input
            type="text"
            value={organization.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            onBlur={() => handleBlur("name")}
            placeholder="e.g. Agnikul Cosmos, Indian Space Research Organisation, Rocket Lab"
            className={`w-full bg-zinc-900/90 border rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none transition ${
              touched.name && !isOrgValid ? "border-red-500/60 focus:border-red-400" : "border-white/15 focus:border-cyan-400"
            }`}
          />
        </div>

        {/* Agency Code */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold flex items-center justify-between">
            <span>AGENCY CODE (FOR IPN SUBNET) *</span>
            {touched.agencyCode && !isCodeValid && (
              <span className="text-red-400 text-[9px]">CODE REQUIRED</span>
            )}
          </label>
          <input
            type="text"
            maxLength={10}
            value={organization.agencyCode || ""}
            onChange={(e) => handleChange("agencyCode", e.target.value.toUpperCase())}
            onBlur={() => handleBlur("agencyCode")}
            placeholder="e.g. AGNI, ISRO, ESA, NASA, SRF"
            className={`w-full bg-zinc-900/90 border rounded-xl px-4 py-2.5 text-sm text-white font-mono uppercase placeholder-zinc-600 focus:outline-none transition ${
              touched.agencyCode && !isCodeValid ? "border-red-500/60 focus:border-red-400" : "border-white/15 focus:border-cyan-400"
            }`}
          />
          <span className="text-[9px] text-zinc-500">Used for Delay-Tolerant Networking routing identifier (ipn:code.node).</span>
        </div>

        {/* Organization Type */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
            ORGANIZATION TYPE
          </label>
          <select
            value={organization.type || orgTypes[0]}
            onChange={(e) => handleChange("type", e.target.value)}
            className="w-full bg-zinc-900/90 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 transition cursor-pointer"
          >
            {orgTypes.map((t) => (
              <option key={t} value={t} className="bg-zinc-950 text-white">
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Country / Jurisdiction */}
        <div className="space-y-1 sm:col-span-2">
          <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold flex items-center justify-between">
            <span>COUNTRY / JURISDICTION *</span>
            {touched.country && !isCountryValid && (
              <span className="text-red-400 text-[9px]">COUNTRY / JURISDICTION REQUIRED</span>
            )}
          </label>
          <input
            type="text"
            value={organization.country || ""}
            onChange={(e) => handleChange("country", e.target.value)}
            onBlur={() => handleBlur("country")}
            placeholder="e.g. India, United States, ESA Member State, Global"
            className={`w-full bg-zinc-900/90 border rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none transition ${
              touched.country && !isCountryValid ? "border-red-500/60 focus:border-red-400" : "border-white/15 focus:border-cyan-400"
            }`}
          />
        </div>

        {/* Mission Director */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
            MISSION DIRECTOR (OPTIONAL)
          </label>
          <input
            type="text"
            value={organization.director || ""}
            onChange={(e) => handleChange("director", e.target.value)}
            placeholder="e.g. Dr. A. K. Sharma"
            className="w-full bg-zinc-900/90 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-400 transition"
          />
        </div>

        {/* Mission Operations Contact Name */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
            MISSION OPERATIONS LEAD
          </label>
          <input
            type="text"
            value={organization.contact || ""}
            onChange={(e) => handleChange("contact", e.target.value)}
            placeholder="e.g. Flight Director Sarah Jenkins"
            className="w-full bg-zinc-900/90 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-400 transition"
          />
        </div>

        {/* Operations Email */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold flex items-center justify-between">
            <span>OPERATIONS EMAIL *</span>
            {touched.email && !isEmailPresent && (
              <span className="text-red-400 text-[9px]">{!organization.email ? "EMAIL REQUIRED" : "INVALID EMAIL FORMAT"}</span>
            )}
          </label>
          <input
            type="email"
            value={organization.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            onBlur={() => handleBlur("email")}
            placeholder="ops-control@spacecraft.org"
            className={`w-full bg-zinc-900/90 border rounded-xl px-4 py-2.5 text-xs text-white font-mono placeholder-zinc-600 focus:outline-none transition ${
              touched.email && !isEmailPresent ? "border-red-500/60 focus:border-red-400" : "border-white/15 focus:border-cyan-400"
            }`}
          />
          <span className="text-[9px] text-zinc-500">Official dispatch confirmation will be transmitted here.</span>
        </div>

        {/* Operations Phone */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
            OPERATIONS 24/7 PHONE
          </label>
          <input
            type="tel"
            value={organization.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="+1-555-0199 or +91-80-..."
            className="w-full bg-zinc-900/90 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white font-mono placeholder-zinc-600 focus:outline-none focus:border-cyan-400 transition"
          />
        </div>

        {/* Mission Website */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
            MISSION WEBSITE (OPTIONAL)
          </label>
          <input
            type="url"
            value={organization.website || ""}
            onChange={(e) => handleChange("website", e.target.value)}
            placeholder="https://mission.agency.org"
            className="w-full bg-zinc-900/90 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-400 transition"
          />
        </div>

        {/* Verification Contact */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
            VERIFICATION CONTACT (OPTIONAL)
          </label>
          <input
            type="text"
            value={organization.verificationContact || ""}
            onChange={(e) => handleChange("verificationContact", e.target.value)}
            placeholder="e.g. Deputy Chief Scientist or Registrar"
            className="w-full bg-zinc-900/90 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-400 transition"
          />
        </div>

      </div>

      {/* Navigation Actions */}
      <div className="pt-4 border-t border-white/10 flex justify-end">
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
            canProceed
              ? "bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/20 cursor-pointer"
              : "bg-zinc-800 text-zinc-500 border border-white/5 cursor-not-allowed"
          }`}
        >
          <span>CONTINUE TO MISSION PROFILE</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
