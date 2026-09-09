import { NextResponse } from "next/server";

const SYSTEM_PROMPT = "You are Vani, the navigator for Project Shivodaya. Keep answers under 2 sentences. If the user asks to see the network, reply with a JSON command to route to '/mesh'.";

export async function POST(req) {
  try {
    const { message } = await req.json();
    const cleanMsg = (message || "").trim().toLowerCase();

    let reply = "";
    let route = null;

    if (!cleanMsg) {
      reply = "Welcome to Shivodaya, I am Vani. How can I navigate you today?";
    } else if (cleanMsg.includes("ephemeris") || cleanMsg.includes("trajectory format")) {
      reply = "An ephemeris provides precise calculated positions and velocities of your spacecraft over time, accepted in CSV, JSON, or OEM formats.";
    } else if (cleanMsg.includes("relay node") || cleanMsg.includes("what is a relay")) {
      reply = "A relay node carries emergency alert bundles across the deep-space mesh for other spacecraft using Delay-Tolerant Networking.";
    } else if (cleanMsg.includes("telemetry") && (cleanMsg.includes("provide") || cleanMsg.includes("should") || cleanMsg.includes("what"))) {
      reply = "Missions typically provide spacecraft health, radiation dosimeter readings, proton flux, power bus state, and position state vectors.";
    } else if (cleanMsg.includes("hybrid node") || cleanMsg.includes("what does a hybrid")) {
      reply = "A hybrid node detects environmental radiation, relays data for nearby missions, and receives mission-critical alerts simultaneously.";
    } else if (cleanMsg.includes("network") || cleanMsg.includes("mesh") || cleanMsg.includes("model") || cleanMsg.includes("prakash") || cleanMsg.includes("richa") || cleanMsg.includes("akashdeep")) {
      reply = "Routing you to the Shivodaya deep space neural mesh network and subsystem models.";
      route = "/mesh-network";
    } else if (cleanMsg.includes("register") || cleanMsg.includes("agency") || cleanMsg.includes("join") || cleanMsg.includes("onboard")) {
      reply = "Opening the inter-agency spacecraft registration portal to onboard your assets.";
      route = "/registration";
    } else if (cleanMsg.includes("vision") || cleanMsg.includes("mission") || cleanMsg.includes("about") || cleanMsg.includes("barrier")) {
      reply = "Shivodaya is the world's first autonomous deep-space radiation early-warning network. Severing humanity's Earth-dependency during solar blackouts.";
      route = "/vision";
    } else if (cleanMsg.includes("control") || cleanMsg.includes("center") || cleanMsg.includes("telemetry") || cleanMsg.includes("earth")) {
      reply = "Connecting to the ground operations control center telemetry matrix.";
      route = "/control-center";
    } else {
      reply = `I am Vani, your Shivodaya flight navigator. Ask me to show the network, explain our vision, or register your spacecraft.`;
    }

    return NextResponse.json({
      systemPrompt: SYSTEM_PROMPT,
      reply,
      route
    });
  } catch (err) {
    return NextResponse.json({
      systemPrompt: SYSTEM_PROMPT,
      reply: "Communication relay error. Please try speaking again.",
      route: null
    }, { status: 500 });
  }
}
