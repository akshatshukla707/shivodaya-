import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "registrations.json");

// Helper to load registrations
function getRegistrations() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Error reading registrations.json:", e);
  }

  // Default seed applications for Employee Review portal
  return [
    {
      applicationId: "SHV-2026-0038",
      mission: {
        name: "CYGNUS-EXPLORER-02",
        destination: "Lunar Orbit (NRHO)",
        type: "Robotic Science & Relay",
        status: "Planned",
        launchDate: "2027-03-15"
      },
      organization: {
        name: "Cislunar Space Dynamics",
        agencyCode: "CSD",
        type: "Commercial Space Operator",
        country: "USA / Global",
        email: "flight-ops@cislunar-dynamics.space"
      },
      network: {
        primaryRole: "Relay Node",
        sendAlerts: true,
        relayAlerts: true,
        provideData: true,
        receiveEmergency: true,
        alternateRoute: true
      },
      radiation: {
        hasSensors: "YES",
        canGenerateAlert: true
      },
      telemetry: {
        availability: "Live During Mission",
        types: ["Radiation", "Position", "Power"]
      },
      crew: {
        isCrewed: "NO",
        members: []
      },
      status: "UNDER REVIEW",
      assignedNode: null,
      createdAt: "2026-09-08T10:14:22.000Z"
    },
    {
      applicationId: "SHV-2026-0041",
      mission: {
        name: "HELIOS-SENTINEL-X",
        destination: "Heliocentric (Sun-Earth L5)",
        type: "Science & Early Warning",
        status: "Pre-launch",
        launchDate: "2026-11-20"
      },
      organization: {
        name: "International Heliophysics Consortium",
        agencyCode: "IHC",
        type: "Research Institution",
        country: "International",
        email: "sentry-operations@helioconsortium.org"
      },
      network: {
        primaryRole: "Radiation Sentinel",
        sendAlerts: true,
        relayAlerts: false,
        provideData: true,
        receiveEmergency: false,
        alternateRoute: false
      },
      radiation: {
        hasSensors: "YES",
        canGenerateAlert: true
      },
      telemetry: {
        availability: "Live During Mission",
        types: ["Radiation", "Proton Flux", "Solar Activity", "X-Ray"]
      },
      crew: {
        isCrewed: "NO",
        members: []
      },
      status: "VERIFIED",
      assignedNode: "ipn:ihc.5",
      createdAt: "2026-09-08T16:30:00.000Z"
    }
  ];
}

function saveRegistrations(list) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch (e) {
    console.error("Error saving registrations.json:", e);
  }
}

// GET: List all mission applications or query by id/search
export async function GET(req) {
  const registrations = getRegistrations();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const query = searchParams.get("query");

    if (id) {
      const found = registrations.find(
        (r) => r.applicationId?.toLowerCase() === id.trim().toLowerCase()
      );
      if (!found) {
        return NextResponse.json(
          { success: false, error: `Application "${id}" not found in registry.` },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, registration: found });
    }

    if (query) {
      const q = query.toLowerCase().trim();
      const filtered = registrations.filter(
        (r) =>
          r.applicationId?.toLowerCase().includes(q) ||
          r.mission?.name?.toLowerCase().includes(q) ||
          r.organization?.name?.toLowerCase().includes(q) ||
          r.organization?.email?.toLowerCase().includes(q)
      );
      return NextResponse.json({
        success: true,
        count: filtered.length,
        registrations: filtered
      });
    }
  } catch (e) {
    console.error("GET query parsing error:", e);
  }

  return NextResponse.json({
    success: true,
    count: registrations.length,
    registrations
  });
}

// POST: Submit new mission registration
export async function POST(req) {
  try {
    const body = await req.json();
    const {
      organization = {},
      mission = {},
      trajectory = {},
      dataAndTelemetry = {},
      radiation = {},
      network = {},
      crew = {},
      responsibility = {},
      interoperability = {},
      security = {},
      dataSharing = {},
      isDemo = false
    } = body;

    // Progressive field validation
    if (!organization.name || !organization.email) {
      return NextResponse.json(
        { success: false, error: "ORGANIZATION NAME AND OPERATIONS EMAIL ARE REQUIRED." },
        { status: 400 }
      );
    }

    if (!mission.name || !mission.destination) {
      return NextResponse.json(
        { success: false, error: "MISSION NAME AND DESTINATION ARE REQUIRED." },
        { status: 400 }
      );
    }

    if (!network.primaryRole) {
      return NextResponse.json(
        { success: false, error: "NETWORK PARTICIPATION ROLE IS REQUIRED." },
        { status: 400 }
      );
    }

    // Generate unique Application ID
    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const applicationId = `SHV-${year}-${randomSuffix}`;
    const createdAt = new Date().toISOString();

    const newApplication = {
      applicationId,
      organization: {
        name: organization.name.trim(),
        agencyCode: (organization.agencyCode || "AGY").trim().toUpperCase(),
        type: organization.type || "Commercial Space Operator",
        country: organization.country || "Global",
        director: organization.director || "",
        contact: organization.contact || "",
        email: organization.email.trim(),
        phone: organization.phone || "",
        website: organization.website || "",
        verificationContact: organization.verificationContact || ""
      },
      mission: {
        name: mission.name.trim().toUpperCase(),
        id: (mission.id || mission.name.slice(0, 8)).trim().toUpperCase(),
        type: mission.type || "Robotic",
        status: mission.status || "Planned",
        objective: mission.objective || "",
        description: mission.description || "",
        launchVehicle: mission.launchVehicle || "",
        launchSite: mission.launchSite || "",
        launchDate: mission.launchDate || "",
        destination: mission.destination || "Deep Space",
        duration: mission.duration || ""
      },
      trajectory: {
        phase: trajectory.phase || "Cruise",
        departureWindow: trajectory.departureWindow || "",
        expectedArrival: trajectory.expectedArrival || "",
        regime: trajectory.regime || "Heliocentric",
        ephemerisUploaded: !!trajectory.ephemerisFileName,
        ephemerisFileName: trajectory.ephemerisFileName || null,
        ephemerisFormat: trajectory.ephemerisFormat || null
      },
      telemetry: {
        availability: dataAndTelemetry.availability || "None",
        types: dataAndTelemetry.types || [],
        delivery: dataAndTelemetry.delivery || "API",
        updateFrequency: dataAndTelemetry.updateFrequency || "60s",
        contact: dataAndTelemetry.contact || "",
        docsUploaded: !!dataAndTelemetry.docsFileName
      },
      radiation: {
        hasSensors: radiation.hasSensors || "NO",
        sensorTypes: radiation.sensorTypes || [],
        dataMode: radiation.dataMode || "Event-based",
        alertGeneration: radiation.alertGeneration || "Both",
        canGenerateAlert: !!radiation.canGenerateAlert
      },
      network: {
        primaryRole: network.primaryRole || "Hybrid Node",
        sendAlerts: !!network.sendAlerts,
        relayAlerts: !!network.relayAlerts,
        provideData: !!network.provideData,
        receiveEmergency: !!network.receiveEmergency,
        alternateRoute: !!network.alternateRoute,
        alertTypes: network.alertTypes || [],
        priority: network.priority || "High",
        preferredDelivery: network.preferredDelivery || "Any available path"
      },
      crew: {
        isCrewed: crew.isCrewed || "NO",
        members: crew.members || [],
        healthOption: crew.healthOption || "No health integration",
        medicalOfficer: crew.medicalOfficer || "",
        emergencyMedicalContact: crew.emergencyMedicalContact || "",
        healthSystemRef: crew.healthSystemRef || ""
      },
      responsibility: {
        hierarchy: responsibility.hierarchy || [],
        emergencyContacts: responsibility.emergencyContacts || []
      },
      interoperability: {
        declaredCapabilities: interoperability.declaredCapabilities || [],
        telemetryFormat: interoperability.telemetryFormat || "",
        commandFormat: interoperability.commandFormat || "",
        dataInterface: interoperability.dataInterface || ""
      },
      security: {
        authContact: security.authContact || "",
        securityContact: security.securityContact || "",
        integrationContact: security.integrationContact || "",
        authMethod: security.authMethod || "Institutional Identity"
      },
      dataSharing: {
        publicLevel: !!dataSharing.publicLevel,
        networkLevel: !!dataSharing.networkLevel,
        operationalLevel: !!dataSharing.operationalLevel,
        restrictedLevel: !!dataSharing.restrictedLevel,
        medicalRestricted: !!dataSharing.medicalRestricted,
        purposes: dataSharing.purposes || []
      },
      status: "VERIFICATION PENDING",
      assignedNode: null,
      isDemo: !!isDemo,
      createdAt
    };

    // Save to persistence store
    const existing = getRegistrations();
    existing.unshift(newApplication);
    saveRegistrations(existing);

    // Email Dispatch (or Development Fallback)
    const emailApiKey = process.env.EMAIL_API_KEY;
    const emailTo = newApplication.organization.email;
    const missionName = newApplication.mission.name;
    const orgName = newApplication.organization.name;
    const roleName = newApplication.network.primaryRole;

    if (emailApiKey) {
      try {
        // Transactional email provider integration (e.g. Resend)
        const emailFrom = process.env.EMAIL_FROM || "operations@shivodaya.space";
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${emailApiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            from: emailFrom,
            to: emailTo,
            subject: `Shivodaya Mission Registration Received — ${missionName}`,
            text: `SHIVODAYA MISSION REGISTRATION\n\nRegistration received.\n\nMission: ${missionName}\nOrganization: ${orgName}\nApplication ID: ${applicationId}\nRequested Network Role: ${roleName}\nStatus: VERIFICATION PENDING\n\nYour mission registration has been received by Shivodaya Mission Operations.\nThis confirmation does not mean the mission has been authorized or activated on the network.\n\nMission Operations Contact: ${emailTo}\nShivodaya Mission Operations`,
            html: `
              <div style="background-color: #000; color: #fff; padding: 24px; font-family: monospace;">
                <h2 style="color: #22d3ee; margin-bottom: 4px;">SHIVODAYA MISSION REGISTRATION</h2>
                <p style="color: #a1a1aa; font-size: 12px; margin-top: 0;">Registration Profile Received</p>
                <hr style="border-color: #27272a; margin: 16px 0;" />
                <p><strong>Mission:</strong> ${missionName}</p>
                <p><strong>Organization:</strong> ${orgName}</p>
                <p><strong>Application ID:</strong> <span style="color: #22d3ee; font-weight: bold;">${applicationId}</span></p>
                <p><strong>Requested Network Role:</strong> ${roleName}</p>
                <p><strong>Status:</strong> <span style="color: #f59e0b; font-weight: bold;">VERIFICATION PENDING</span></p>
                <div style="background-color: #18181b; padding: 12px; border-radius: 8px; margin: 16px 0; font-size: 12px; color: #d4d4d8;">
                  Your mission profile has been submitted to Shivodaya Mission Operations.<br/>
                  <em>Note: This confirmation does not mean the mission has been authorized or activated on the network.</em>
                </div>
                <p style="font-size: 11px; color: #71717a;">Shivodaya Mission Operations // Automated Dispatch</p>
              </div>
            `
          })
        });
      } catch (err) {
        console.error("Transactional email dispatch error:", err);
      }
    } else {
      // Development Email Mode
      console.log("==================================================");
      console.log("EMAIL MODE: DEVELOPMENT");
      console.log(`EMAIL WOULD HAVE BEEN SENT TO: ${emailTo}`);
      console.log(`SUBJECT: Shivodaya Mission Registration Received — ${missionName}`);
      console.log(`APPLICATION ID: ${applicationId}`);
      console.log(`STATUS: VERIFICATION PENDING`);
      console.log("==================================================");
    }

    return NextResponse.json({
      success: true,
      applicationId,
      mission: missionName,
      organization: orgName,
      role: roleName,
      status: "VERIFICATION PENDING",
      emailSent: true,
      emailMode: emailApiKey ? "production" : "development",
      createdAt
    });

  } catch (err) {
    console.error("Failed to process registration:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error while creating mission onboarding profile." },
      { status: 500 }
    );
  }
}

// PATCH: Update application status by Employee Control Center
export async function PATCH(req) {
  try {
    const { applicationId, status, notes } = await req.json();
    if (!applicationId || !status) {
      return NextResponse.json(
        { success: false, error: "Application ID and target status are required." },
        { status: 400 }
      );
    }

    const registrations = getRegistrations();
    const target = registrations.find(r => r.applicationId === applicationId);
    if (!target) {
      return NextResponse.json(
        { success: false, error: "Application not found." },
        { status: 404 }
      );
    }

    target.status = status;
    if (status === "AUTHORIZED" || status === "ACTIVE") {
      if (!target.assignedNode) {
        const prefix = (target.organization.agencyCode || "NODE").toLowerCase();
        target.assignedNode = `ipn:${prefix}.${Math.floor(1 + Math.random() * 9)}`;
      }
    }
    if (notes) {
      target.notes = notes;
    }
    target.updatedAt = new Date().toISOString();

    saveRegistrations(registrations);

    return NextResponse.json({
      success: true,
      applicationId,
      status: target.status,
      assignedNode: target.assignedNode
    });

  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to update registration status." },
      { status: 500 }
    );
  }
}
