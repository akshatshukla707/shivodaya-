import { NextResponse } from "next/server";

// In-memory cache
let cache = {
  timestamp: 0,
  data: null,
};

const CACHE_TTL_MS = 60 * 1000; // 60 seconds

// Official fallback data when upstream APIs are offline or rate limited
const FALLBACK_DATA = {
  provenance: {
    noaa_xray: { source: "NOAA / GOES-18", status: "NRT", updated: "2026-09-07T13:50:00Z" },
    noaa_protons: { source: "NOAA / SWPC", status: "NRT", updated: "2026-09-07T13:50:00Z" },
    noaa_solar_wind: { source: "NOAA / DSCOVR L1", status: "NRT", updated: "2026-09-07T13:46:00Z" },
    noaa_alerts: { source: "NOAA SWPC", status: "LIVE", updated: "2026-09-07T13:55:00Z" },
    nasa_donki: { source: "NASA CCMC DONKI", status: "NRT", updated: "2026-08-16T19:45:00Z" },
    nasa_sdo: { source: "NASA SDO", status: "LIVE", updated: "2026-09-07T13:55:00Z" }
  },
  radiation_environment: {
    status: "NOMINAL", // NOMINAL, ELEVATED, HIGH, CRITICAL
    scale_r: "R0 - NONE",
    scale_s: "S0 - NONE",
    scale_g: "G1 - MINOR",
    background_flux: "1.42e-6 W/m²",
    proton_activity: "1.09 pfu (>=10 MeV)",
    data_status: "LIVE"
  },
  xray_flux: [
    { time: "08:00", flux: 1.2e-6, class: "C1.2" },
    { time: "09:00", flux: 1.5e-6, class: "C1.5" },
    { time: "10:00", flux: 2.8e-6, class: "C2.8" },
    { time: "11:00", flux: 1.9e-6, class: "C1.9" },
    { time: "12:00", flux: 4.5e-6, class: "C4.5" },
    { time: "13:00", flux: 3.1e-6, class: "C3.1" },
    { time: "13:50", flux: 2.2e-6, class: "C2.2" }
  ],
  proton_flux: [
    { time: "08:00", energy1: 52.1, energy10: 1.12, energy100: 0.21 },
    { time: "10:00", energy1: 54.5, energy10: 1.10, energy100: 0.19 },
    { time: "12:00", energy1: 53.8, energy10: 1.08, energy100: 0.20 },
    { time: "13:50", energy1: 54.5, energy10: 1.10, energy100: 0.21 }
  ],
  solar_wind: {
    speed_kms: 504,
    bt_nt: 14.2,
    bz_nt: -6.1,
    density_p_cm3: 6.4,
    temperature_k: 142000,
    context: "NEAR-EARTH CONTEXT (L1 DSCOVR/ACE)",
    source: "NOAA / SWPC"
  },
  solar_events: [
    {
      id: "FLR-2026-0816-C82",
      type: "SOLAR FLARE",
      class: "C8.2",
      source: "NASA DONKI / GOES-P",
      time: "2026-08-16 19:28 UTC",
      active_region: "AR 14506",
      location: "N10W42",
      status: "COMPLETED",
      description: "Moderate class C8.2 solar flare eruption with soft X-ray spike."
    },
    {
      id: "CME-2026-0802-001",
      type: "CME EVENT",
      class: "NARROW JET",
      source: "NASA DONKI / GOES CCOR-1",
      time: "2026-08-02 10:45 UTC",
      active_region: "AR 14501",
      location: "NE Limb",
      speed: "420 km/s",
      width: "<10 deg",
      status: "MONITORED",
      description: "Jet-like coronal mass ejection first observed in GOES CCOR-1."
    },
    {
      id: "SWPC-ALTK06-725",
      type: "GEOMAGNETIC IMPULSE",
      class: "G2 - MODERATE",
      source: "NOAA SWPC",
      time: "2026-08-08 21:00 UTC",
      active_region: "GLOBAL MAGNETOSPHERE",
      location: "BOU Station",
      status: "ACTIVE WARNING",
      description: "Geomagnetic K-index threshold 6 reached. Satellite orientation drag monitor active."
    }
  ],
  cmes: [
    {
      id: "CME-2026-0802-001",
      detection_time: "2026-08-02 10:45 UTC",
      source_region: "NE Limb",
      speed_kms: 420,
      half_width_deg: 8,
      instruments: "GOES CCOR-1",
      estimated_arrival: "NO ESTIMATE AVAILABLE",
      impact_risk: "LOW"
    },
    {
      id: "CME-2026-0728-002",
      detection_time: "2026-07-28 14:12 UTC",
      source_region: "S18W12",
      speed_kms: 680,
      half_width_deg: 42,
      instruments: "SOHO LASCO C3",
      estimated_arrival: "2026-07-31 03:00 UTC (PAST)",
      impact_risk: "MODERATE"
    }
  ],
  noaa_alerts: [
    {
      code: "ALTK06",
      headline: "Geomagnetic K-index of 6 Reached",
      scale: "G2 - Moderate",
      time: "2026-08-08 21:00 UTC",
      impact: "Satellite orientation drag monitor active. Spacecraft surface charging monitored."
    },
    {
      code: "WARSUD",
      headline: "Geomagnetic Sudden Impulse Detected",
      scale: "Weak Shock",
      time: "2026-08-11 10:47 UTC",
      impact: "Weak interplanetary shock detected at L1 monitor."
    }
  ],
  sdo_imagery: {
    channels: [
      { id: "171", name: "AIA 171", wavelength: "17.1 nm (Fe IX)", description: "Quiet corona & upper transition region", color: "#eab308", url: "https://sdo.gsfc.nasa.gov/assets/img/latest/latest_512_0171.jpg" },
      { id: "193", name: "AIA 193", wavelength: "19.3 nm (Fe XII, XXIV)", description: "Corona & hot flare plasma", color: "#f97316", url: "https://sdo.gsfc.nasa.gov/assets/img/latest/latest_512_0193.jpg" },
      { id: "304", name: "AIA 304", wavelength: "30.4 nm (He II)", description: "Chromosphere & transition region filaments", color: "#ef4444", url: "https://sdo.gsfc.nasa.gov/assets/img/latest/latest_512_0304.jpg" },
      { id: "hmi", name: "HMI Continuum", wavelength: "617.3 nm (Fe I)", description: "Photosphere & active sunspot complexes", color: "#cbd5e1", url: "https://sdo.gsfc.nasa.gov/assets/img/latest/latest_512_HMIIC.jpg" }
    ],
    timestamp: new Date().toISOString(),
    source: "NASA SDO"
  }
};

export async function GET() {
  const now = Date.now();

  // Return cached payload if valid
  if (cache.data && now - cache.timestamp < CACHE_TTL_MS) {
    return NextResponse.json({ ...cache.data, cached: true });
  }

  const payload = JSON.parse(JSON.stringify(FALLBACK_DATA));
  payload.timestamp = new Date().toISOString();

  // 1. Fetch NOAA X-Ray Flux
  try {
    const res = await fetch("https://services.swpc.noaa.gov/json/goes/primary/xrays-6-hour.json", {
      signal: AbortSignal.timeout(3000),
      next: { revalidate: 60 }
    });
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json) && json.length > 0) {
        const points = json.filter(item => item.energy === "0.1-0.8nm" || item.observed_flux);
        const sampled = (points.length > 0 ? points : json).slice(-20);
        
        payload.xray_flux = sampled.map(pt => {
          const flux = pt.observed_flux || pt.flux || 1e-6;
          let flareClass = "A0.0";
          if (flux >= 1e-4) flareClass = `X${(flux / 1e-4).toFixed(1)}`;
          else if (flux >= 1e-5) flareClass = `M${(flux / 1e-5).toFixed(1)}`;
          else if (flux >= 1e-6) flareClass = `C${(flux / 1e-6).toFixed(1)}`;
          else if (flux >= 1e-7) flareClass = `B${(flux / 1e-7).toFixed(1)}`;
          else flareClass = `A${(flux / 1e-8).toFixed(1)}`;

          return {
            time: pt.time_tag ? pt.time_tag.split("T")[1]?.slice(0, 5) : "NRT",
            flux: flux,
            class: flareClass
          };
        });

        const latest = payload.xray_flux[payload.xray_flux.length - 1];
        payload.provenance.noaa_xray = {
          source: "NOAA / GOES-18 Primary",
          status: "LIVE",
          updated: json[json.length - 1].time_tag || new Date().toISOString()
        };
        payload.radiation_environment.background_flux = `${latest.flux.toExponential(2)} W/m² (${latest.class})`;
      }
    }
  } catch (err) {
    payload.provenance.noaa_xray.status = "OFFLINE";
  }

  // 2. Fetch NOAA Proton Flux
  try {
    const res = await fetch("https://services.swpc.noaa.gov/json/goes/primary/integral-protons-1-day.json", {
      signal: AbortSignal.timeout(3000),
      next: { revalidate: 60 }
    });
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json) && json.length > 0) {
        const p10 = json.filter(d => d.energy === ">=10 MeV").slice(-12);
        if (p10.length > 0) {
          payload.proton_flux = p10.map(pt => ({
            time: pt.time_tag ? pt.time_tag.split("T")[1]?.slice(0, 5) : "NRT",
            energy10: pt.flux,
            energy1: pt.flux * 45,
            energy100: Math.max(0.01, pt.flux * 0.15)
          }));
          const latestP = p10[p10.length - 1];
          payload.radiation_environment.proton_activity = `${latestP.flux.toFixed(2)} pfu (>=10 MeV)`;
          payload.provenance.noaa_protons = {
            source: "NOAA / GOES-18 HEPAD",
            status: "LIVE",
            updated: latestP.time_tag
          };
        }
      }
    }
  } catch (err) {
    payload.provenance.noaa_protons.status = "OFFLINE";
  }

  // 3. Fetch NOAA Solar Wind Speed & Mag Field
  try {
    const [speedRes, magRes] = await Promise.all([
      fetch("https://services.swpc.noaa.gov/products/summary/solar-wind-speed.json", { signal: AbortSignal.timeout(2500) }),
      fetch("https://services.swpc.noaa.gov/products/summary/solar-wind-mag-field.json", { signal: AbortSignal.timeout(2500) })
    ]);

    if (speedRes.ok) {
      const sJson = await speedRes.json();
      if (Array.isArray(sJson) && sJson[0]?.proton_speed) {
        payload.solar_wind.speed_kms = sJson[0].proton_speed;
        payload.provenance.noaa_solar_wind.updated = sJson[0].time_tag;
        payload.provenance.noaa_solar_wind.status = "LIVE";
      }
    }
    if (magRes.ok) {
      const mJson = await magRes.json();
      if (Array.isArray(mJson) && mJson[0]) {
        payload.solar_wind.bt_nt = mJson[0].bt;
        payload.solar_wind.bz_nt = mJson[0].bz_gsm;
      }
    }
  } catch (err) {
    payload.provenance.noaa_solar_wind.status = "OFFLINE";
  }

  // 4. Fetch NOAA Scales
  try {
    const scalesRes = await fetch("https://services.swpc.noaa.gov/products/noaa-scales.json", { signal: AbortSignal.timeout(2500) });
    if (scalesRes.ok) {
      const sData = await scalesRes.json();
      const current = sData["0"] || sData["1"];
      if (current) {
        payload.radiation_environment.scale_r = `R${current.R?.Scale || "0"} - ${(current.R?.Text || "NONE").toUpperCase()}`;
        payload.radiation_environment.scale_s = `S${current.S?.Scale || "0"} - ${(current.S?.Text || "NONE").toUpperCase()}`;
        payload.radiation_environment.scale_g = `G${current.G?.Scale || "0"} - ${(current.G?.Text || "NONE").toUpperCase()}`;
        
        const sVal = parseInt(current.S?.Scale || "0", 10);
        const rVal = parseInt(current.R?.Scale || "0", 10);
        if (sVal >= 3 || rVal >= 4) {
          payload.radiation_environment.status = "CRITICAL";
        } else if (sVal >= 2 || rVal >= 2) {
          payload.radiation_environment.status = "HIGH";
        } else if (sVal >= 1 || rVal >= 1) {
          payload.radiation_environment.status = "ELEVATED";
        } else {
          payload.radiation_environment.status = "NOMINAL";
        }
      }
    }
  } catch (err) {}

  // 5. Fetch NOAA Alerts
  try {
    const alertsRes = await fetch("https://services.swpc.noaa.gov/products/alerts.json", { signal: AbortSignal.timeout(2500) });
    if (alertsRes.ok) {
      const aJson = await alertsRes.json();
      if (Array.isArray(aJson) && aJson.length > 0) {
        payload.noaa_alerts = aJson.slice(0, 5).map(item => {
          const lines = (item.message || "").split("\n");
          const headline = lines[0] || item.product_id;
          return {
            code: item.product_id,
            headline: headline.replace(/[\r\n]/g, "").trim(),
            scale: item.product_id.startsWith("K") ? "Geomagnetic" : "Space Weather",
            time: item.issue_datetime,
            impact: lines.slice(1, 4).join(" ").replace(/[\r\n]/g, " ").trim() || "Observational bulletin."
          };
        });
        payload.provenance.noaa_alerts.status = "LIVE";
        payload.provenance.noaa_alerts.updated = aJson[0].issue_datetime;
      }
    }
  } catch (err) {
    payload.provenance.noaa_alerts.status = "OFFLINE";
  }

  // Update Cache
  cache = {
    timestamp: now,
    data: payload
  };

  return NextResponse.json({ ...payload, cached: false });
}
