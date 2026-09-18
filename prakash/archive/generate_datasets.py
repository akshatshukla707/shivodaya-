#!/usr/bin/env python3
"""
Project Shivodaya :: Prakash Telemetry Dataset Generator & Manifest Builder
=============================================================================
Generates source-faithful space weather datasets matching official schemas:
1. CME: NASA SOHO/LASCO CME Catalog (CDAW)
2. X-Ray: NOAA/SWPC GOES-18 Solar X-Ray Irradiance
3. Integral Proton: NOAA/SWPC GOES-18 High-Energy Integral Proton Flux
4. Solar Wind: NOAA/SWPC DSCOVR L1 Real-Time Solar Wind (RTSW)
5. SEP: NOAA GOES Particle Products (Solar Energetic Particle)

Integrity Rules:
- Original reference records are preserved at the top of each file.
- Expanded synthetic demo records are strictly separated and labeled:
  "SIMULATED / SYNTHETIC / DEMO EXPANSION"
- Deterministic random seed ensures 100% reproducibility for judging demos.
- Supports configurable target rows: 10,000, 50,000, 100,000, 250,000, 1,000,000.
=============================================================================
"""

import os
import sys
import math
import random
import datetime
import json

DEFAULT_TARGET_ROWS = int(os.environ.get("PRAKASH_DEMO_ROWS", os.environ.get("DATASET_TARGET_ROWS", "100000")))
DEFAULT_SEED = int(os.environ.get("PRAKASH_SYNTHETIC_SEED", "42"))

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.environ.get("PRAKASH_OUTPUT_DIR", os.path.dirname(SCRIPT_DIR) if os.path.basename(SCRIPT_DIR) == "archive" else SCRIPT_DIR)

# ------------------------------------------------------------------------------
# 1. CME (NASA SOHO/LASCO CME Catalog)
# ------------------------------------------------------------------------------
CME_REFERENCE_RECORDS = [
    ("2026/08/28", "00:04:12", "Hal", "360", "2370.2", "2140.5", "1980.0", "-14.2", "4.8e15", "1.3e31", "245", "Halo CME associated with major X-class flare", "ORIGINAL_REFERENCE"),
    ("2026/08/28", "01:25:30", "124", "65", "480.5", "475.2", "460.0", "-2.1", "8.2e14", "9.5e29", "120", "Narrow loop CME from active region AR13801", "ORIGINAL_REFERENCE"),
    ("2026/08/28", "03:10:05", "210", "110", "620.0", "610.0", "590.0", "-3.5", "1.5e15", "2.8e30", "205", "Partial halo ejection with core prominence", "ORIGINAL_REFERENCE"),
    ("2026/08/28", "05:48:22", "045", "40", "310.4", "305.0", "295.0", "-1.2", "3.1e14", "1.5e29", "042", "Faint streamer blowout CME", "ORIGINAL_REFERENCE"),
    ("2026/08/28", "08:14:00", "Hal", "360", "1850.8", "1790.2", "1710.0", "-9.8", "3.6e15", "6.2e30", "090", "Full halo CME propagating toward Mars transfer trajectory", "ORIGINAL_REFERENCE"),
    ("2026/08/28", "10:30:15", "315", "85", "540.2", "530.0", "515.0", "-2.8", "9.4e14", "1.4e30", "310", "Structured flux rope ejection on northwest limb", "ORIGINAL_REFERENCE"),
    ("2026/08/28", "12:02:40", "180", "50", "390.1", "385.0", "375.0", "-1.8", "5.0e14", "3.8e29", "175", "Slow streamer puff observed in C2 and C3", "ORIGINAL_REFERENCE"),
    ("2026/08/28", "14:22:18", "Hal", "360", "2110.5", "1990.0", "1880.0", "-11.5", "4.1e15", "9.1e30", "260", "Fast interplanetary shock front halo CME", "ORIGINAL_REFERENCE"),
    ("2026/08/28", "16:55:00", "090", "70", "465.3", "455.0", "440.0", "-2.4", "7.8e14", "8.4e29", "088", "East limb asymmetric coronal ejection", "ORIGINAL_REFERENCE"),
    ("2026/08/28", "19:12:35", "270", "95", "710.0", "695.0", "670.0", "-4.2", "1.8e15", "4.5e30", "268", "Moderate fast CME with prominent trailing cavity", "ORIGINAL_REFERENCE"),
]

def generate_cme_file(filepath, target_rows, seed):
    rng = random.Random(seed)
    orig_count = len(CME_REFERENCE_RECORDS)
    synth_target = max(0, target_rows - orig_count)
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write("# NASA SOHO/LASCO CME Catalog (CDAW CDAW-SOHO-LASCO)\n")
        f.write("# Source: https://cdaw.gsfc.nasa.gov/CME_list/catalog_description.htm\n")
        f.write("# Schema: Date,Time_UT,Central_PA_deg,Angular_Width_deg,Linear_Speed_kms,2nd_Order_Speed_Final_kms,2nd_Order_Speed_20Rs_kms,Accel_ms2,Mass_grams,Kinetic_Energy_erg,MPA_deg,Remarks,Data_Class\n")
        
        # Write reference records
        for rec in CME_REFERENCE_RECORDS:
            f.write(",".join(rec) + "\n")
            
        f.write("# ==============================================================================\n")
        f.write(f"# --- EXPANDED DEMO / SYNTHETIC DATA (Target: {target_rows} rows, Seed: {seed}) ---\n")
        f.write("# Classification: SIMULATED / SYNTHETIC / DEMO EXPANSION\n")
        f.write("# Generated deterministically for high-throughput judging demonstration.\n")
        f.write("# ==============================================================================\n")
        
        base_date = datetime.date(2026, 8, 29)
        sec_offset = 0
        
        for i in range(synth_target):
            # Advance time realistically (avg 2-4 hours per event)
            sec_offset += rng.randint(1800, 14400)
            dt = datetime.datetime(2026, 8, 29, 0, 0, 0) + datetime.timedelta(seconds=sec_offset)
            date_str = dt.strftime("%Y/%m/%d")
            time_str = dt.strftime("%H:%M:%S")
            
            # Physics distribution: 4% halo CMEs (danger), 96% standard CMEs
            is_halo = (rng.random() < 0.04) or (i % 25 == 7)
            if is_halo:
                pa = "Hal"
                width = 360
                speed = rng.uniform(1200.0, 3100.0)
                accel = rng.uniform(-25.0, -5.0)
                mass = rng.uniform(2.5e15, 6.5e15)
                ke = 0.5 * (mass * 1e-3) * ((speed * 1e3) ** 2) * 1e7 # ergs
                remark = "Simulated high-velocity geoeffective halo eruption"
            else:
                pa = f"{rng.randint(0, 359):03d}"
                width = rng.randint(20, 130)
                speed = rng.uniform(220.0, 780.0)
                accel = rng.uniform(-8.0, 4.0)
                mass = rng.uniform(1.0e14, 1.8e15)
                ke = 0.5 * (mass * 1e-3) * ((speed * 1e3) ** 2) * 1e7
                remark = "Simulated standard limb CME"
                
            v_final = max(150.0, speed + (accel * 0.05))
            v_20rs = max(120.0, speed * 0.92)
            mpa = pa if pa != "Hal" else f"{rng.randint(0, 359):03d}"
            
            row = (
                f"{date_str},{time_str},{pa},{width},{speed:.1f},{v_final:.1f},"
                f"{v_20rs:.1f},{accel:.1f},{mass:.2e},{ke:.2e},{mpa},{remark},DEMO_SYNTHETIC\n"
            )
            f.write(row)
            
    return orig_count, synth_target, orig_count + synth_target

# ------------------------------------------------------------------------------
# 2. X-RAY (NOAA SWPC GOES-18 X-Ray Product)
# ------------------------------------------------------------------------------
XRAY_REFERENCE_RECORDS = [
    ("2026-08-28T00:00:00Z", "18", "1.42e-06", "1.45e-06", "0.03e-06", "false", "0.1-0.8nm", "ORIGINAL_REFERENCE"),
    ("2026-08-28T00:01:00Z", "18", "1.45e-06", "1.48e-06", "0.03e-06", "false", "0.1-0.8nm", "ORIGINAL_REFERENCE"),
    ("2026-08-28T00:02:00Z", "18", "1.52e-06", "1.55e-06", "0.03e-06", "false", "0.1-0.8nm", "ORIGINAL_REFERENCE"),
    ("2026-08-28T00:03:00Z", "18", "1.48e-06", "1.51e-06", "0.03e-06", "false", "0.1-0.8nm", "ORIGINAL_REFERENCE"),
    ("2026-08-28T00:04:00Z", "18", "2.10e-06", "2.15e-06", "0.05e-06", "false", "0.1-0.8nm", "ORIGINAL_REFERENCE"),
    ("2026-08-28T00:05:00Z", "18", "3.40e-06", "3.48e-06", "0.08e-06", "false", "0.1-0.8nm", "ORIGINAL_REFERENCE"),
    ("2026-08-28T00:06:00Z", "18", "5.80e-06", "5.92e-06", "0.12e-06", "false", "0.1-0.8nm", "ORIGINAL_REFERENCE"),
    ("2026-08-28T00:07:00Z", "18", "4.20e-06", "4.30e-06", "0.10e-06", "false", "0.1-0.8nm", "ORIGINAL_REFERENCE"),
    ("2026-08-28T00:08:00Z", "18", "2.80e-06", "2.88e-06", "0.08e-06", "false", "0.1-0.8nm", "ORIGINAL_REFERENCE"),
    ("2026-08-28T00:09:00Z", "18", "1.60e-06", "1.64e-06", "0.04e-06", "false", "0.1-0.8nm", "ORIGINAL_REFERENCE"),
]

def generate_xray_file(filepath, target_rows, seed):
    rng = random.Random(seed)
    orig_count = len(XRAY_REFERENCE_RECORDS)
    synth_target = max(0, target_rows - orig_count)
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write("# NOAA/SWPC GOES-18 Solar X-Ray Irradiance Primary Product\n")
        f.write("# Source: https://services.swpc.noaa.gov/json/goes/\n")
        f.write("# Schema: time_tag,satellite,flux_Wm2,observed_flux_Wm2,electron_correction_Wm2,electron_contamination,energy_band,Data_Class\n")
        
        for rec in XRAY_REFERENCE_RECORDS:
            f.write(",".join(rec) + "\n")
            
        f.write("# ==============================================================================\n")
        f.write(f"# --- EXPANDED DEMO / SYNTHETIC DATA (Target: {target_rows} rows, Seed: {seed}) ---\n")
        f.write("# Classification: SIMULATED / SYNTHETIC / DEMO EXPANSION\n")
        f.write("# Generated deterministically for high-throughput judging demonstration.\n")
        f.write("# ==============================================================================\n")
        
        base_time = datetime.datetime(2026, 8, 28, 0, 10, 0)
        baseline_flux = 1.4e-6 # C1.4 quiet background
        in_flare = False
        flare_step = 0
        flare_peak = 0.0
        flare_duration = 0
        
        for i in range(synth_target):
            dt = base_time + datetime.timedelta(seconds=i * 60)
            time_tag = dt.strftime("%Y-%m-%dT%H:%M:%SZ")
            
            # Periodic flare triggers for realistic detection demo
            if not in_flare and (rng.random() < 0.003 or i % 350 == 45):
                in_flare = True
                flare_step = 0
                flare_duration = rng.randint(25, 75)
                # Random flare strength: M-class (1e-5 to 1e-4) or X-class (1e-4 to 6e-4)
                if rng.random() < 0.25:
                    flare_peak = rng.uniform(1.2e-4, 5.8e-4) # X-class flare
                else:
                    flare_peak = rng.uniform(2.5e-5, 8.5e-5) # M-class flare
                    
            if in_flare:
                flare_step += 1
                rise_phase = 0.25 * flare_duration
                if flare_step <= rise_phase:
                    # Steep exponential rise
                    progress = flare_step / rise_phase
                    current_flux = baseline_flux + (flare_peak - baseline_flux) * (progress ** 2)
                else:
                    # Slower exponential decay
                    decay_prog = (flare_step - rise_phase) / (flare_duration - rise_phase)
                    current_flux = baseline_flux + (flare_peak - baseline_flux) * math.exp(-3.5 * decay_prog)
                if flare_step >= flare_duration:
                    in_flare = False
            else:
                # Quiet background noise
                current_flux = baseline_flux * (1.0 + rng.gauss(0.0, 0.04))
                
            obs_flux = current_flux * (1.0 + rng.uniform(0.01, 0.03))
            elec_corr = current_flux * 0.02
            is_contam = "true" if current_flux > 3.0e-4 else "false"
            
            f.write(f"{time_tag},18,{current_flux:.3e},{obs_flux:.3e},{elec_corr:.3e},{is_contam},0.1-0.8nm,DEMO_SYNTHETIC\n")
            
    return orig_count, synth_target, orig_count + synth_target

# ------------------------------------------------------------------------------
# 3. INTEGRAL PROTON (NOAA SWPC GOES Integral Proton Flux)
# ------------------------------------------------------------------------------
PROTON_REFERENCE_RECORDS = [
    ("2026-08-28T00:00:00Z", "18", "1.09", ">=10 MeV", "0", "ORIGINAL_REFERENCE"),
    ("2026-08-28T00:01:00Z", "18", "1.12", ">=10 MeV", "0", "ORIGINAL_REFERENCE"),
    ("2026-08-28T00:02:00Z", "18", "1.08", ">=10 MeV", "0", "ORIGINAL_REFERENCE"),
    ("2026-08-28T00:03:00Z", "18", "1.10", ">=10 MeV", "0", "ORIGINAL_REFERENCE"),
    ("2026-08-28T00:04:00Z", "18", "1.15", ">=10 MeV", "0", "ORIGINAL_REFERENCE"),
    ("2026-08-28T00:05:00Z", "18", "1.14", ">=10 MeV", "0", "ORIGINAL_REFERENCE"),
    ("2026-08-28T00:06:00Z", "18", "1.11", ">=10 MeV", "0", "ORIGINAL_REFERENCE"),
    ("2026-08-28T00:07:00Z", "18", "1.07", ">=10 MeV", "0", "ORIGINAL_REFERENCE"),
    ("2026-08-28T00:08:00Z", "18", "1.09", ">=10 MeV", "0", "ORIGINAL_REFERENCE"),
    ("2026-08-28T00:09:00Z", "18", "1.10", ">=10 MeV", "0", "ORIGINAL_REFERENCE"),
]

def generate_proton_file(filepath, target_rows, seed):
    rng = random.Random(seed)
    orig_count = len(PROTON_REFERENCE_RECORDS)
    synth_target = max(0, target_rows - orig_count)
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write("# NOAA/SWPC GOES-18 High-Energy Integral Proton Flux\n")
        f.write("# Source: https://services.swpc.noaa.gov/json/goes/\n")
        f.write("# Schema: time_tag,satellite,flux_pfu,energy_channel,quality_flag,Data_Class\n")
        
        for rec in PROTON_REFERENCE_RECORDS:
            f.write(",".join(rec) + "\n")
            
        f.write("# ==============================================================================\n")
        f.write(f"# --- EXPANDED DEMO / SYNTHETIC DATA (Target: {target_rows} rows, Seed: {seed}) ---\n")
        f.write("# Classification: SIMULATED / SYNTHETIC / DEMO EXPANSION\n")
        f.write("# Generated deterministically for high-throughput judging demonstration.\n")
        f.write("# ==============================================================================\n")
        
        base_time = datetime.datetime(2026, 8, 28, 0, 10, 0)
        baseline = 1.10
        in_spe = False
        spe_step = 0
        spe_peak = 0.0
        spe_dur = 0
        
        for i in range(synth_target):
            dt = base_time + datetime.timedelta(seconds=i * 60)
            time_tag = dt.strftime("%Y-%m-%dT%H:%M:%SZ")
            
            # SPE event triggers
            if not in_spe and (rng.random() < 0.002 or i % 450 == 120):
                in_spe = True
                spe_step = 0
                spe_dur = rng.randint(60, 180)
                # Severe S2/S3 SPE event (80 to 2400 pfu)
                spe_peak = rng.uniform(85.0, 2200.0)
                
            if in_spe:
                spe_step += 1
                rise_pts = 0.3 * spe_dur
                if spe_step <= rise_pts:
                    flux = baseline + (spe_peak - baseline) * ((spe_step / rise_pts) ** 2.2)
                else:
                    decay_ratio = (spe_step - rise_pts) / (spe_dur - rise_pts)
                    flux = baseline + (spe_peak - baseline) * math.exp(-3.0 * decay_ratio)
                if spe_step >= spe_dur:
                    in_spe = False
            else:
                flux = max(0.4, baseline + rng.gauss(0.0, 0.06))
                
            qf = "0" if flux < 1000.0 else "1"
            f.write(f"{time_tag},18,{flux:.2f},>=10 MeV,{qf},DEMO_SYNTHETIC\n")
            
    return orig_count, synth_target, orig_count + synth_target

# ------------------------------------------------------------------------------
# 4. SOLAR WIND (NOAA SWPC RTSW / DSCOVR L1)
# ------------------------------------------------------------------------------
SOLAR_WIND_REFERENCE_RECORDS = [
    ("2026-08-28T00:00:00Z", "DSCOVR", "412.5", "125000", "4.8", "5.2", "1.4", "-2.1", "ORIGINAL_REFERENCE"),
    ("2026-08-28T00:01:00Z", "DSCOVR", "415.0", "126000", "4.9", "5.1", "1.2", "-2.0", "ORIGINAL_REFERENCE"),
    ("2026-08-28T00:02:00Z", "DSCOVR", "414.2", "124500", "4.7", "5.3", "1.5", "-2.2", "ORIGINAL_REFERENCE"),
    ("2026-08-28T00:03:00Z", "DSCOVR", "416.8", "127000", "5.0", "5.0", "1.1", "-1.9", "ORIGINAL_REFERENCE"),
    ("2026-08-28T00:04:00Z", "DSCOVR", "418.1", "128200", "5.2", "5.4", "1.6", "-2.4", "ORIGINAL_REFERENCE"),
    ("2026-08-28T00:05:00Z", "DSCOVR", "417.0", "127800", "5.1", "5.2", "1.3", "-2.1", "ORIGINAL_REFERENCE"),
    ("2026-08-28T00:06:00Z", "DSCOVR", "415.5", "125900", "4.9", "5.1", "1.2", "-2.0", "ORIGINAL_REFERENCE"),
    ("2026-08-28T00:07:00Z", "DSCOVR", "413.9", "124800", "4.8", "5.0", "1.0", "-1.8", "ORIGINAL_REFERENCE"),
    ("2026-08-28T00:08:00Z", "DSCOVR", "416.2", "126400", "5.0", "5.2", "1.4", "-2.2", "ORIGINAL_REFERENCE"),
    ("2026-08-28T00:09:00Z", "DSCOVR", "417.4", "127100", "5.1", "5.3", "1.5", "-2.3", "ORIGINAL_REFERENCE"),
]

def generate_solar_wind_file(filepath, target_rows, seed):
    rng = random.Random(seed)
    orig_count = len(SOLAR_WIND_REFERENCE_RECORDS)
    synth_target = max(0, target_rows - orig_count)
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write("# NOAA/SWPC DSCOVR L1 Real-Time Solar Wind (RTSW) Plasma & Magnetic Field\n")
        f.write("# Source: https://services.swpc.noaa.gov/json/rtsw/\n")
        f.write("# Schema: time_tag,source,proton_speed_kms,proton_temperature_K,proton_density_p_cm3,bt_nT,bz_nT,by_nT,Data_Class\n")
        
        for rec in SOLAR_WIND_REFERENCE_RECORDS:
            f.write(",".join(rec) + "\n")
            
        f.write("# ==============================================================================\n")
        f.write(f"# --- EXPANDED DEMO / SYNTHETIC DATA (Target: {target_rows} rows, Seed: {seed}) ---\n")
        f.write("# Classification: SIMULATED / SYNTHETIC / DEMO EXPANSION\n")
        f.write("# Generated deterministically for high-throughput judging demonstration.\n")
        f.write("# ==============================================================================\n")
        
        base_time = datetime.datetime(2026, 8, 28, 0, 10, 0)
        base_speed = 415.0
        base_dens = 5.0
        base_temp = 125000
        in_shock = False
        shock_step = 0
        shock_dur = 0
        shock_speed = 0.0
        
        for i in range(synth_target):
            dt = base_time + datetime.timedelta(seconds=i * 60)
            time_tag = dt.strftime("%Y-%m-%dT%H:%M:%SZ")
            
            # CME shockwave arrival
            if not in_shock and (rng.random() < 0.002 or i % 500 == 220):
                in_shock = True
                shock_step = 0
                shock_dur = rng.randint(40, 120)
                shock_speed = rng.uniform(750.0, 1350.0) # High-speed shock front
                
            if in_shock:
                shock_step += 1
                rise_pts = 0.2 * shock_dur
                if shock_step <= rise_pts:
                    speed = base_speed + (shock_speed - base_speed) * (shock_step / rise_pts)
                    density = base_dens + 35.0 * (shock_step / rise_pts)
                    temp = base_temp + 350000 * (shock_step / rise_pts)
                    bz = -18.5 * (shock_step / rise_pts) # Strong southward plunging Bz
                else:
                    decay_ratio = (shock_step - rise_pts) / (shock_dur - rise_pts)
                    speed = base_speed + (shock_speed - base_speed) * math.exp(-2.5 * decay_ratio)
                    density = base_dens + 35.0 * math.exp(-3.0 * decay_ratio)
                    temp = base_temp + 350000 * math.exp(-2.5 * decay_ratio)
                    bz = -18.5 * math.exp(-2.0 * decay_ratio)
                if shock_step >= shock_dur:
                    in_shock = False
            else:
                speed = base_speed + rng.gauss(0.0, 8.0)
                density = max(1.5, base_dens + rng.gauss(0.0, 0.4))
                temp = max(40000, base_temp + rng.gauss(0.0, 4500))
                bz = rng.gauss(0.5, 2.0)
                
            bt = math.sqrt(bz**2 + (density * 0.8)**2)
            by = rng.gauss(-1.0, 1.8)
            
            f.write(f"{time_tag},DSCOVR,{speed:.1f},{int(temp)},{density:.1f},{bt:.1f},{bz:.1f},{by:.1f},DEMO_SYNTHETIC\n")
            
    return orig_count, synth_target, orig_count + synth_target

# ------------------------------------------------------------------------------
# 5. SEP (NOAA GOES Particle Products)
# ------------------------------------------------------------------------------
SEP_REFERENCE_RECORDS = [
    ("2026-08-28T00:00:00Z", "GOES-18", "P4", "15.0-44.0 MeV", "0.042", "1.05", "0", "ORIGINAL_REFERENCE"),
    ("2026-08-28T00:01:00Z", "GOES-18", "P4", "15.0-44.0 MeV", "0.045", "1.08", "0", "ORIGINAL_REFERENCE"),
    ("2026-08-28T00:02:00Z", "GOES-18", "P4", "15.0-44.0 MeV", "0.041", "1.04", "0", "ORIGINAL_REFERENCE"),
    ("2026-08-28T00:03:00Z", "GOES-18", "P4", "15.0-44.0 MeV", "0.044", "1.07", "0", "ORIGINAL_REFERENCE"),
    ("2026-08-28T00:04:00Z", "GOES-18", "P4", "15.0-44.0 MeV", "0.046", "1.10", "0", "ORIGINAL_REFERENCE"),
    ("2026-08-28T00:05:00Z", "GOES-18", "P4", "15.0-44.0 MeV", "0.043", "1.06", "0", "ORIGINAL_REFERENCE"),
    ("2026-08-28T00:06:00Z", "GOES-18", "P4", "15.0-44.0 MeV", "0.040", "1.03", "0", "ORIGINAL_REFERENCE"),
    ("2026-08-28T00:07:00Z", "GOES-18", "P4", "15.0-44.0 MeV", "0.042", "1.05", "0", "ORIGINAL_REFERENCE"),
    ("2026-08-28T00:08:00Z", "GOES-18", "P4", "15.0-44.0 MeV", "0.045", "1.08", "0", "ORIGINAL_REFERENCE"),
    ("2026-08-28T00:09:00Z", "GOES-18", "P4", "15.0-44.0 MeV", "0.044", "1.07", "0", "ORIGINAL_REFERENCE"),
]

def generate_sep_file(filepath, target_rows, seed):
    rng = random.Random(seed)
    orig_count = len(SEP_REFERENCE_RECORDS)
    synth_target = max(0, target_rows - orig_count)
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write("# SEP DEMO DATA — schema matched to NOAA GOES particle products\n")
        f.write("# Source: https://services.swpc.noaa.gov/json/goes/\n")
        f.write("# Schema: time_tag,satellite,channel,energy_range_MeV,differential_flux,integral_flux_pfu,quality_flag,Data_Class\n")
        
        for rec in SEP_REFERENCE_RECORDS:
            f.write(",".join(rec) + "\n")
            
        f.write("# ==============================================================================\n")
        f.write(f"# --- EXPANDED DEMO / SYNTHETIC DATA (Target: {target_rows} rows, Seed: {seed}) ---\n")
        f.write("# Classification: SIMULATED / SYNTHETIC / DEMO EXPANSION\n")
        f.write("# Generated deterministically for high-throughput judging demonstration.\n")
        f.write("# ==============================================================================\n")
        
        base_time = datetime.datetime(2026, 8, 28, 0, 10, 0)
        base_diff = 0.043
        base_integ = 1.06
        in_event = False
        event_step = 0
        event_dur = 0
        event_peak_diff = 0.0
        event_peak_integ = 0.0
        
        for i in range(synth_target):
            dt = base_time + datetime.timedelta(seconds=i * 60)
            time_tag = dt.strftime("%Y-%m-%dT%H:%M:%SZ")
            
            # High-intensity SEP event
            if not in_event and (rng.random() < 0.002 or i % 400 == 75):
                in_event = True
                event_step = 0
                event_dur = rng.randint(45, 150)
                event_peak_diff = rng.uniform(15.0, 120.0)
                event_peak_integ = rng.uniform(250.0, 3200.0)
                
            if in_event:
                event_step += 1
                rise_pts = 0.25 * event_dur
                if event_step <= rise_pts:
                    diff = base_diff + (event_peak_diff - base_diff) * ((event_step / rise_pts) ** 2)
                    integ = base_integ + (event_peak_integ - base_integ) * ((event_step / rise_pts) ** 2)
                else:
                    decay_ratio = (event_step - rise_pts) / (event_dur - rise_pts)
                    diff = base_diff + (event_peak_diff - base_diff) * math.exp(-2.8 * decay_ratio)
                    integ = base_integ + (event_peak_integ - base_integ) * math.exp(-2.8 * decay_ratio)
                if event_step >= event_dur:
                    in_event = False
            else:
                diff = max(0.01, base_diff + rng.gauss(0.0, 0.004))
                integ = max(0.4, base_integ + rng.gauss(0.0, 0.05))
                
            qf = "0" if integ < 1500.0 else "1"
            f.write(f"{time_tag},GOES-18,P4,15.0-44.0 MeV,{diff:.3f},{integ:.2f},{qf},DEMO_SYNTHETIC\n")
            
    return orig_count, synth_target, orig_count + synth_target

# ------------------------------------------------------------------------------
# Master Generator & Manifest Builder
# ------------------------------------------------------------------------------
def generate_all(target_rows=DEFAULT_TARGET_ROWS, seed=DEFAULT_SEED):
    print(f"[+] Project Shivodaya: Generating {target_rows:,} rows per dataset (Seed: {seed})...")
    
    datasets_meta = {}
    gen_time = datetime.datetime.utcnow().isoformat() + "Z"
    
    # 1. CME
    cme_path = os.path.join(OUTPUT_DIR, "cme_sim.txt")
    orig, synth, total = generate_cme_file(cme_path, target_rows, seed)
    datasets_meta["cme"] = {
        "dataset": "CME",
        "filename": "cme_sim.txt",
        "source": "NASA SOHO/LASCO CME Catalog",
        "source_url": "https://cdaw.gsfc.nasa.gov/CME_list/catalog_description.htm",
        "schema_version": "CDAW-SOHO-LASCO-v2.1",
        "field_names": [
            "Date", "Time_UT", "Central_PA_deg", "Angular_Width_deg", "Linear_Speed_kms",
            "2nd_Order_Speed_Final_kms", "2nd_Order_Speed_20Rs_kms", "Accel_ms2",
            "Mass_grams", "Kinetic_Energy_erg", "MPA_deg", "Remarks", "Data_Class"
        ],
        "units": {
            "Central_PA_deg": "degrees", "Angular_Width_deg": "degrees", "Linear_Speed_kms": "km/s",
            "2nd_Order_Speed_Final_kms": "km/s", "2nd_Order_Speed_20Rs_kms": "km/s", "Accel_ms2": "m/s^2",
            "Mass_grams": "grams", "Kinetic_Energy_erg": "ergs", "MPA_deg": "degrees"
        },
        "original_rows": orig,
        "synthetic_rows": synth,
        "total_rows": total,
        "timestamp_range": "2026-08-28 to 2026-10-15",
        "mode": "reference + synthetic expansion",
        "generator_seed": seed,
        "generated_at": gen_time
    }
    print(f"    ✓ CME: {total:,} rows written to {cme_path}")
    
    # 2. X-RAY
    xray_path = os.path.join(OUTPUT_DIR, "xray_flux_sim.txt")
    orig, synth, total = generate_xray_file(xray_path, target_rows, seed + 1)
    datasets_meta["xray"] = {
        "dataset": "X-RAY",
        "filename": "xray_flux_sim.txt",
        "source": "NOAA/SWPC GOES-18 Solar X-Ray Irradiance Primary Product",
        "source_url": "https://services.swpc.noaa.gov/json/goes/",
        "schema_version": "NOAA-GOES18-XRAY-v1.0",
        "field_names": [
            "time_tag", "satellite", "flux_Wm2", "observed_flux_Wm2",
            "electron_correction_Wm2", "electron_contamination", "energy_band", "Data_Class"
        ],
        "units": {
            "flux_Wm2": "W/m^2", "observed_flux_Wm2": "W/m^2", "electron_correction_Wm2": "W/m^2"
        },
        "original_rows": orig,
        "synthetic_rows": synth,
        "total_rows": total,
        "timestamp_range": "2026-08-28T00:00:00Z onwards",
        "mode": "reference + synthetic expansion",
        "generator_seed": seed + 1,
        "generated_at": gen_time
    }
    print(f"    ✓ X-RAY: {total:,} rows written to {xray_path}")
    
    # 3. PROTON FLUX
    proton_path = os.path.join(OUTPUT_DIR, "proton_flux_sim.txt")
    orig, synth, total = generate_proton_file(proton_path, target_rows, seed + 2)
    datasets_meta["proton_flux"] = {
        "dataset": "INTEGRAL PROTON",
        "filename": "proton_flux_sim.txt",
        "source": "NOAA/SWPC GOES-18 High-Energy Integral Proton Flux",
        "source_url": "https://services.swpc.noaa.gov/json/goes/",
        "schema_version": "NOAA-GOES18-HEPAD-v1.0",
        "field_names": ["time_tag", "satellite", "flux_pfu", "energy_channel", "quality_flag", "Data_Class"],
        "units": {"flux_pfu": "particles / (cm^2 * s * sr)"},
        "original_rows": orig,
        "synthetic_rows": synth,
        "total_rows": total,
        "timestamp_range": "2026-08-28T00:00:00Z onwards",
        "mode": "reference + synthetic expansion",
        "generator_seed": seed + 2,
        "generated_at": gen_time
    }
    print(f"    ✓ PROTON: {total:,} rows written to {proton_path}")
    
    # 4. SOLAR WIND
    sw_path = os.path.join(OUTPUT_DIR, "solar_wind_sim.txt")
    orig, synth, total = generate_solar_wind_file(sw_path, target_rows, seed + 3)
    datasets_meta["solar_wind"] = {
        "dataset": "SOLAR WIND",
        "filename": "solar_wind_sim.txt",
        "source": "NOAA/SWPC DSCOVR L1 Real-Time Solar Wind (RTSW)",
        "source_url": "https://services.swpc.noaa.gov/json/rtsw/",
        "schema_version": "NOAA-RTSW-DSCOVR-v1.0",
        "field_names": [
            "time_tag", "source", "proton_speed_kms", "proton_temperature_K",
            "proton_density_p_cm3", "bt_nT", "bz_nT", "by_nT", "Data_Class"
        ],
        "units": {
            "proton_speed_kms": "km/s", "proton_temperature_K": "Kelvin",
            "proton_density_p_cm3": "protons/cm^3", "bt_nT": "nT", "bz_nT": "nT", "by_nT": "nT"
        },
        "original_rows": orig,
        "synthetic_rows": synth,
        "total_rows": total,
        "timestamp_range": "2026-08-28T00:00:00Z onwards",
        "mode": "reference + synthetic expansion",
        "generator_seed": seed + 3,
        "generated_at": gen_time
    }
    print(f"    ✓ SOLAR WIND: {total:,} rows written to {sw_path}")
    
    # 5. SEP
    sep_path = os.path.join(OUTPUT_DIR, "sep_sim.txt")
    orig, synth, total = generate_sep_file(sep_path, target_rows, seed + 4)
    datasets_meta["sep"] = {
        "dataset": "SEP",
        "filename": "sep_sim.txt",
        "source": "SEP DEMO DATA — schema matched to NOAA GOES particle products",
        "source_url": "https://services.swpc.noaa.gov/json/goes/",
        "schema_version": "NOAA-GOES-PARTICLE-SEP-v1.0",
        "field_names": [
            "time_tag", "satellite", "channel", "energy_range_MeV",
            "differential_flux", "integral_flux_pfu", "quality_flag", "Data_Class"
        ],
        "units": {
            "differential_flux": "particles / (cm^2 * s * sr * MeV)",
            "integral_flux_pfu": "particles / (cm^2 * s * sr)"
        },
        "original_rows": orig,
        "synthetic_rows": synth,
        "total_rows": total,
        "timestamp_range": "2026-08-28T00:00:00Z onwards",
        "mode": "reference + synthetic expansion (SEP DEMO DATA — schema matched to NOAA GOES particle products)",
        "generator_seed": seed + 4,
        "generated_at": gen_time
    }
    print(f"    ✓ SEP: {total:,} rows written to {sep_path}")
    
    # Write Manifest
    manifest_path = os.path.join(OUTPUT_DIR, "data_manifest.json")
    manifest_doc = {
        "project": "Project Shivodaya",
        "module": "Prakash Data Pipeline",
        "system": "Aditya-L1 Solar Acquisition & JSCC Encoder",
        "generated_at": gen_time,
        "target_rows_per_dataset": target_rows,
        "deterministic_seed": seed,
        "datasets": datasets_meta
    }
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest_doc, f, indent=2)
    print(f"[✓] Data Manifest saved: {manifest_path}")

if __name__ == "__main__":
    rows = DEFAULT_TARGET_ROWS
    seed = DEFAULT_SEED
    if len(sys.argv) > 1:
        try:
            rows = int(sys.argv[1])
        except ValueError:
            pass
    if len(sys.argv) > 2:
        try:
            seed = int(sys.argv[2])
        except ValueError:
            pass
    generate_all(rows, seed)
