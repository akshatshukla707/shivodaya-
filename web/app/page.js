"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { 
  ArrowRight, Sparkles, Volume2, VolumeX, Shield, Radio, 
  Activity, Compass, Cpu, Layers, Terminal, AlertTriangle, 
  Gauge, Network, ArrowUpRight, X, BookOpen, ExternalLink, Clock 
} from "lucide-react";

// ============================================================
// SYSTEM INSPECTOR DETAILS (TECHNICAL LAYER REVEALED ON INTERACTION)
// ============================================================
const SYSTEM_DETAILS = {
  prakash: {
    number: "01",
    name: "PRAKASH",
    identity: "SOLAR SENTRY",
    conceptTag: "PRAKASH SEES",
    summary: "Turning solar activity into information missions can understand.",
    role: "Detects and refines solar-event information for downstream communication.",
    status: "Active Sensing Stream",
    accentColor: "amber",
    techDetails: [
      { label: "Core Architecture", value: "Native C11 JSCC Linear Projection Vector Engine" },
      { label: "Protocol & Addressing", value: "ipn:1.1 (Aditya-L1 Lagrange-1 Sentry Node)" },
      { label: "Data Ingestion", value: "POSIX mmap() 5-stream lock-free ring buffer" },
      { label: "Vector Compression", value: "5GB raw sensor telemetry compressed into 128-byte semantic vectors" },
      { label: "Pipeline Latency", value: "<1.42 ms real-time JSCC encoding with zero heap allocations" },
      { label: "Radiation Detection", value: "Multi-band magnetometer, proton flux sensor, and X-ray coronagraph feeds" }
    ]
  },
  richa: {
    number: "02",
    name: "RICHA",
    identity: "LIGHT BETWEEN WORLDS",
    conceptTag: "RICHA CARRIES",
    summary: "Finding resilient ways to carry important information through deep space.",
    role: "Autonomous interplanetary routing engine and DTN custody transport layer.",
    status: "Dynamic Mesh Routing Active",
    accentColor: "cyan",
    techDetails: [
      { label: "Core Architecture", value: "Native C++17 Perceptron Mesh Router Engine" },
      { label: "Protocol & Addressing", value: "ipn:2.1 (Cis-Lunar Mesh Node) & RFC 9171 BPv7" },
      { label: "Graph Algorithm", value: "100-node Time-Varying Graph (TVG) Dijkstra with multi-hop BFS fallback" },
      { label: "Custody Engine", value: "ION-DTN Bundle Protocol v7 store-and-forward custody transfer" },
      { label: "Asynchronous Logging", value: "SQLite3 WAL journaling (build/richa_routing_log.db)" },
      { label: "Blackout Resilience", value: "Autonomous multi-path rerouting around solar conjunction dead-zones" }
    ]
  },
  akashdeep: {
    number: "03",
    name: "AKASHDEEP",
    identity: "LIGHT OF HOME",
    conceptTag: "AKASHDEEP REVEALS",
    summary: "Turning distant mission data into information humans can understand.",
    role: "Terminal semantic decoder and flight commander HUD visualization.",
    status: "Command HUD Online",
    accentColor: "red",
    techDetails: [
      { label: "Core Architecture", value: "Native C++17 Reverse MLP Matrix Engine & Java Swing HUD" },
      { label: "Protocol & Addressing", value: "ipn:3.1 (Mars Base / Crew Vehicle Target Node)" },
      { label: "Inverse Decoding", value: "Reverse MLP matrix weights reconstructing telemetry with 99.4% fidelity" },
      { label: "Decoded Telemetry", value: "CME shockwave velocity, proton flux density, and arrival ETA" },
      { label: "Response Latency", value: "<0.85 ms decode latency triggering automated EVA directives" },
      { label: "Safety Actuation", value: "Automated shelter vault sealing and directional antenna feathering" }
    ]
  }
};

// ============================================================
// RESEARCH / FIELD NOTES ARTICLES (9 CONNECTED SCIENTIFIC ESSAYS)
// ============================================================
const RESEARCH_ARTICLES = [
  {
    id: "art-1",
    featured: true,
    category: "RADIATION / HUMAN SPACEFLIGHT",
    source: "NASA + ESA",
    sourceType: "SOURCE MATERIAL: NASA / ESA Public Research",
    readTime: "5 MIN READ",
    title: "THE INVISIBLE THREAT: WHY SPACE RADIATION MATTERS",
    summary: "Beyond Earth's protective environment, radiation becomes one of the major hazards of long-duration human spaceflight. Some events build gradually. Others can arrive suddenly.",
    image: "/images/sun.jpg",
    content: [
      "Beyond low Earth orbit, human missions leave behind the protective cocoon of Earth's geomagnetic field. Spacecraft and crews face two distinct radiological environments: Galactic Cosmic Rays (GCRs)—steady, high-energy atomic nuclei originating outside our solar system—and Solar Particle Events (SPEs), sudden explosive ejections of protons accelerated by solar flares and coronal mass ejections.",
      "While GCRs contribute to cumulative lifetime exposure, solar storms pose an acute, immediate threat. High-energy protons can pierce spacecraft hulls, destroy electronic guidance avionics, and deliver life-threatening ionizing doses to unshielded astronauts within hours.",
      "NASA's Space Radiation Analysis Group (SRAG) and ESA's Space Safety Programme emphasize that passive shielding alone is insufficient for multi-month voyages to Mars. Survival depends on time: providing crews with an early-warning horizon long enough to shelter within heavily shielded command vaults and orient solar panels edge-on to incoming proton fronts.",
      "Shivodaya's forward sentry network is designed around this exact imperative—turning hours of fatal Earth-dependent communication latency into decisive minutes of local evasive action."
    ],
    citation: "NASA Space Radiation Program Element & ESA Space Safety Programme Technical Reports"
  },
  {
    id: "art-2",
    featured: false,
    category: "DEEP-SPACE COMMUNICATION",
    source: "ISRO",
    sourceType: "SOURCE MATERIAL: ISRO MOM Telemetry Archives",
    readTime: "4 MIN READ",
    title: "WHEN MARS IS FAR AWAY",
    summary: "The farther a spacecraft goes, the harder it becomes to communicate with it. Lessons from the Mars Orbiter Mission on signal attenuation across interplanetary distances.",
    image: "/images/deep_space.jpg",
    content: [
      "Operating an asset millions of kilometers from Earth confronts the harsh reality of the inverse-square law. As radio waves propagate across the interplanetary void, signal power diminishes exponentially. A 20-watt transmitter at lunar distance delivers robust telemetry; at Mars aphelion (~400 million km), that same signal arrives at Earth ground stations as a faint whisper measuring fractions of an attowatt.",
      "ISRO's Mars Orbiter Mission (Mangalyaan) demonstrated India's ability to maintain communications across 225 million kilometers using the Indian Deep Space Network (IDSN) 32-meter antenna at Byalalu. However, massive ground dish steerability and high power consumption make direct-to-Earth communication an expensive, narrow bottleneck during emergency scenarios.",
      "When unexpected solar disturbances degrade ground station visibility, distant probes cannot afford to wait for scheduled Deep Space Network tracking windows. Autonomous peer-to-peer relaying between nearby spacecraft solves this fundamental physical constraint."
    ],
    citation: "ISRO Telemetry, Tracking and Command Network (ISTRAC) & Mars Orbiter Mission Documentation"
  },
  {
    id: "art-3",
    featured: false,
    category: "COMMUNICATION DELAY",
    source: "ISRO",
    sourceType: "SOURCE MATERIAL: ISRO Deep Space Operational Data",
    readTime: "4 MIN READ",
    title: "WHEN A QUESTION TAKES 42 MINUTES TO COME BACK",
    summary: "Distance creates time. At maximum planetary separation, commands and replies face round-trip delays exceeding 40 minutes, changing how missions must operate.",
    image: "/images/satellite_mesh.jpg",
    content: [
      "Light travels at approximately 300,000 kilometers per second—an immense speed on Earth, but a painful crawl across interplanetary space. When Earth and Mars are on opposite sides of the Sun (solar conjunction), one-way signal travel time stretches to over 21 minutes, creating a round-trip latency of 42+ minutes.",
      "During this window, real-time command-and-control from Earth is physically impossible. If an Aditya-L1 class sentry detects an erupting X-class solar flare directed toward Mars, routing that alert back to Earth, waiting for ground processing, and re-transmitting to Mars introduces fatal delays.",
      "Shivodaya's core architectural principle directly addresses this: space weather data must be processed, compressed into semantic vectors, and routed mission-to-mission directly through space, eliminating Earth-bounce latency."
    ],
    citation: "ISRO Planetary Science & Deep Space Network Operations Manuals"
  },
  {
    id: "art-4",
    featured: false,
    category: "AUTONOMOUS MISSION SAFETY",
    source: "NASA",
    sourceType: "SOURCE MATERIAL: NASA Autonomous Systems Capabilities",
    readTime: "4 MIN READ",
    title: "WHEN A SPACECRAFT CAN NOTICE DANGER BY ITSELF",
    summary: "On-board autonomous detection allows sentry craft to recognize solar particle surges in seconds. But detecting danger is only half the problem: how does that warning reach distant missions?",
    image: "/images/prakash_preview.jpg",
    content: [
      "Modern interplanetary probes carry sophisticated magnetometer suites, plasma spectrometers, and coronagraphs capable of detecting coronal shockwaves in real time. NASA's autonomy roadmaps prioritize edge compute algorithms that recognize solar energetic particle (SEP) spikes locally without requiring human data analysts.",
      "Yet, autonomous local detection creates a critical dilemma: detecting danger locally only protects the sensor itself. A forward sentry stationed near the Sun (such as at Lagrange point L1) sees the threat hours before it strikes cis-lunar habitats or Martian surface bases.",
      "The missing architectural link is rapid, autonomous alert dissemination. Detecting danger is step one; autonomously packaging that threat into an ultra-low-bandwidth vector that traverses space unassisted is the mission of Shivodaya."
    ],
    citation: "NASA Autonomous Systems Roadmap & Heliophysics Division Open Literature"
  },
  {
    id: "art-5",
    featured: false,
    category: "SPACE WEATHER",
    source: "ESA",
    sourceType: "SOURCE MATERIAL: ESA Vigil Mission Architecture",
    readTime: "3 MIN READ",
    title: "CAN WE SEE A RADIATION STORM COMING?",
    summary: "We cannot stop a Coronal Mass Ejection. But knowing sooner gives missions crucial time to seal hatches, orient solar arrays, and safe sensitive payloads.",
    image: "/images/solar_corona.jpg",
    content: [
      "Coronal Mass Ejections (CMEs) sling billions of tons of magnetized plasma across the solar system at speeds exceeding 2,000 kilometers per second. While humanity cannot alter the trajectory of a solar superstorm, space weather forecasting provides an operational buffer.",
      "The European Space Agency's upcoming Vigil mission will be stationed at the Sun-Earth L5 Lagrange point, providing a constant 'side-view' of active solar regions before they rotate into Earth or Mars line-of-sight. This orbital geometry offers days of advance warning for emerging coronal mass ejections.",
      "For human missions in deep space, early warning is the difference between catastrophe and routine safety. Even 15 minutes of advance notice allows automated spacecraft systems to safe science instruments, feather solar arrays, and alert astronauts to enter storm shelters."
    ],
    citation: "ESA Space Safety Programme & Vigil Mission Technical Overview"
  },
  {
    id: "art-6",
    featured: false,
    category: "RELAY NETWORKS",
    source: "NASA + ESA",
    sourceType: "SOURCE MATERIAL: Mars Relay Network Architecture",
    readTime: "4 MIN READ",
    title: "WHEN ONE SPACECRAFT HELPS ANOTHER",
    summary: "Robotic explorers on Mars routinely rely on orbiters like Odyssey and TGO to relay discoveries. What happens when this ad-hoc assistance expands into an autonomous mesh?",
    image: "/images/hero_space_mesh.jpg",
    content: [
      "Surface rovers like Perseverance and Curiosity rarely transmit science data directly back to Earth. Instead, they use low-power Ultra-High Frequency (UHF) radios to bounce gigabits of telemetry up to orbiters overhead—including NASA's Mars Reconnaissance Orbiter and ESA's Trace Gas Orbiter—which then relay the data to ground stations using massive high-gain dishes.",
      "This cooperative proximity relaying demonstrates that inter-agency teamwork in space is not just possible, but indispensable. A single rover cannot carry a multi-meter parabolic dish, but a shared network of overhead orbiters solves the power equation.",
      "Shivodaya expands this cooperative relay paradigm from local planetary orbits to the interplanetary void. When spacecraft dynamically route alerts for one another, no mission is ever left isolated."
    ],
    citation: "NASA Mars Exploration Program & ESA ExoMars Collaborative Operations"
  },
  {
    id: "art-7",
    featured: false,
    category: "SPACE NETWORKING",
    source: "NASA",
    sourceType: "SOURCE MATERIAL: CCSDS & NASA DTN Working Group",
    readTime: "5 MIN READ",
    title: "WHAT HAPPENS WHEN THE PATH DISAPPEARS?",
    summary: "Traditional Internet protocols require unbroken end-to-end connections. In deep space, celestial orbits cause constant disruptions. Delay/Disruption Tolerant Networking keeps data moving.",
    image: "/images/neural_grid.jpg",
    content: [
      "Terrestrial TCP/IP breaks down completely across interplanetary distances. If a packet drops or an antenna rotates out of alignment, TCP times out, retransmits indefinitely, and collapses. In deep space, communication paths are inherently intermittent, delayed, and asymmetrical.",
      "Delay and Disruption Tolerant Networking (DTN) and the Bundle Protocol (RFC 9171) solve this with a fundamental shift in philosophy: Store-and-Forward Custody Transfer. When a link to the next hop is unavailable, an intermediate spacecraft retains custody of the data in non-volatile storage, waiting until orbital mechanics create the next transmission window.",
      "The message lifecycle becomes: MESSAGE → PATH → PATH DISAPPEARS → WAIT / STORE CUSTODY → NEW PATH DISCOVERED → MESSAGE CONTINUES TO DESTINATION.",
      "Shivodaya incorporates Bundle Protocol v7 (BPv7) within its Richa engine, ensuring that radiation warning vectors are never dropped, even when solar interference severs primary communication lines."
    ],
    citation: "Consultative Committee for Space Data Systems (CCSDS) & RFC 9171 Specifications"
  },
  {
    id: "art-8",
    featured: false,
    category: "INTEROPERABILITY",
    source: "NASA",
    sourceType: "SOURCE MATERIAL: NASA LunaNet Interoperability Specification",
    readTime: "4 MIN READ",
    title: "THE BEGINNING OF A NETWORKED MOON",
    summary: "LunaNet establishes open standards for lunar communications and positioning, demonstrating how independent agency assets unite into a single shared framework.",
    image: "/images/cats_eye_nebula.jpg",
    content: [
      "As humanity prepares to establish permanent bases under the Artemis program, NASA and international partners are deploying LunaNet: a flexible, mutually-operated network architecture for the Moon. Rather than each mission bringing its own proprietary communications infrastructure, LunaNet provides shared communications, navigation, and space weather alerts.",
      "LunaNet's defining breakthrough is standard interoperability. A commercial lander, an ESA rover, an ISRO orbiter, and a NASA crew habitat will be able to exchange telemetry seamlessly across standardized DTN protocols.",
      "Shivodaya embraces this open-standard philosophy, architecting a neural mesh that transcends proprietary boundaries so any spacecraft—from ISRO's Aditya-L1 to international lunar and martian orbiters—can participate in the safety network."
    ],
    citation: "NASA LunaNet Architecture Interoperability Standards & Artemis Communications Plans"
  },
  {
    id: "art-9",
    featured: false,
    category: "SHIVODAYA CONCEPT",
    source: "SHIVODAYA EDITORIAL",
    sourceType: "SHIVODAYA CONCEPTUAL WHITE PAPER",
    readTime: "6 MIN READ",
    title: "WHAT IF MISSIONS COULD WARN MISSIONS?",
    summary: "A mission detects dangerous radiation. Another mission is elsewhere. What if the warning did not always have to travel all the way back to Earth first?",
    image: "/images/portrait_astronaut.jpg",
    content: [
      "Every existing deep-space early warning paradigm relies on Earth as a mandatory hub: Spacecraft A senses danger → transmits to Earth DSN → ground operations validates data → ground generates an alert → transmits to Spacecraft B. When solar storms trigger ground blackouts or when Mars is at conjunction, this chain breaks fatally.",
      "Shivodaya introduces an entirely new model: Peer-to-Peer Interplanetary Warning Mesh.",
      "MISSION A (Forward Sentry at Sun L1) detects the radiation eruption → Compresses the threat into a 32-float JSCC vector → Routes directly to RELAY (Cis-Lunar satellite) → Routes immediately to MISSION B (Mars Crewed Station).",
      "If the primary path is blocked: MISSION A → MISSION C → RELAY → MISSION B. The network dynamically routes around dead-zones.",
      "By eliminating the mandatory Earth bounce, Shivodaya reduces warning latencies by up to 98%, giving astronauts the precious minutes required to survive the harshest environment in the cosmos."
    ],
    citation: "Project Shivodaya System Architecture & Interplanetary Mesh White Paper"
  }
];

export default function ShivodayaLanding() {
  const [isMounted, setIsMounted] = useState(false);
  const [isVaniOpen, setIsVaniOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [navHidden, setNavHidden] = useState(false);
  const [joinBgIndex, setJoinBgIndex] = useState(0);
  const [audioPlaying, setAudioPlaying] = useState(false);

  // New interactive states for Three Systems & Research Articles
  const [hoveredSystem, setHoveredSystem] = useState(null);
  const [inspectedSystem, setInspectedSystem] = useState(null);
  const [activeArticle, setActiveArticle] = useState(null);
  
  // Layer visibility state across scenes
  const [showSolarLayer, setShowSolarLayer] = useState(false);
  const [showJoinLayer, setShowJoinLayer] = useState(false);

  const audioRef = useRef(null);

  // Exact 2 chosen images for Section 4 (Third image removed per specification)
  const joinImages = [
    "/images/people_to_space.webp",
    "/images/portrait_astronaut.jpg",
  ];

  // Preload Section 4 images on mount for instant smooth transitions
  useEffect(() => {
    joinImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Auto-switch Section 4 Background every 2.6 seconds (shortened interval with smooth crossfade)
  useEffect(() => {
    const timer = setInterval(() => {
      setJoinBgIndex((prev) => (prev + 1) % joinImages.length);
    }, 2600);
    return () => clearInterval(timer);
  }, [joinImages.length]);
  
  // Chat History State
  const [messages, setMessages] = useState([
    { role: "ai", text: "Greetings voyager. I am Vani, your deep space neural navigator. As we venture beyond Earth's horizon, I am monitoring all solar streams. How may I assist your mission today?" }
  ]);
  
  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);

  // --- SCROLL PARALLAX ENGINE ---
  const { scrollY, scrollYProgress } = useScroll();
  
  // Hide Nav on scroll down past 150px
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 150) setNavHidden(true);
    else setNavHidden(false);
  });

  // Strict layer isolation across progressive scenes - Sun is 100% pure for Section 2
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setShowSolarLayer(latest > 0.08 && latest < 0.44);
    setShowJoinLayer(latest >= 0.78);
  });

  // Background 1 (Hero Deep Space 1) -> Clean, performant fade out
  const bg1Opacity = useTransform(scrollYProgress, [0, 0.18], [1, 0], { clamp: true });

  // Background 2 (Single High-Def Sun) -> Smooth fade in and out for Section 2, never mixed with anything else
  const bg2Opacity = useTransform(scrollYProgress, [0.08, 0.18, 0.38, 0.44], [0, 1, 1, 0], { clamp: true });

  // Background 4 (Registration: Join Us 2-Image Cycle) -> Fades in at Section 4
  const bg4Opacity = useTransform(scrollYProgress, [0.78, 0.90], [0, 1], { clamp: true });

  // --- INITIALIZATION ---
  useEffect(() => {
    setIsMounted(true);
    
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
    }

    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = "en-US";
        
        recognition.onresult = (event) => {
          const text = event.results[event.resultIndex][0].transcript;
          setInputValue(text);
        };
        
        recognition.onend = () => {
          setIsListening(false);
        };
        recognitionRef.current = recognition;
      }
    }
  }, []);

  // Ambient Deep-Space Audio toggle
  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (audioPlaying) {
      audioRef.current.pause();
      setAudioPlaying(false);
    } else {
      audioRef.current.volume = 0.35;
      const p = audioRef.current.play();
      if (p !== undefined) {
        p.then(() => setAudioPlaying(true)).catch(() => {});
      }
    }
  };

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- INTERACTION LOGIC ---
  const toggleListening = () => {
    if (!recognitionRef.current) return alert("Microphone not supported. Please use Google Chrome.");
    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsListening(false);
    } else {
      setInputValue("");
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn("Speech error:", err);
      }
    }
  };

  const speakResponse = (text) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const targetVoice = voices.find(v => 
        v.name.includes("Google UK English Female") || 
        v.name.includes("Samantha") || 
        v.name.includes("Microsoft Zira") ||
        v.name.includes("Microsoft Jenny") ||
        v.name.includes("Aria")
      );
      if (targetVoice) utterance.voice = targetVoice;
      utterance.pitch = 0.6; 
      utterance.rate = 0.85; 
      window.speechSynthesis.speak(utterance);
    }
  };

  const processQuery = (userText) => {
    if (!userText.trim()) return;

    setMessages(prev => [...prev, { role: "user", text: userText }]);
    setInputValue("");
    
    const q = userText.toLowerCase();
    let reply = "Processing telemetry for Bhaarat Command... Node connection stable. Threat levels are nominal.";

    if (q.includes("richa") || q.includes("router") || q.includes("dtn") || q.includes("cis-lunar")) {
      reply = "Richa C++17 Time-Dependent Dijkstra Router online. Interplanetary bundle custody active across all registered nodes with RFC 9171 protocol.";
    } else if (q.includes("prakash") || q.includes("encoder") || q.includes("vector") || q.includes("aditya")) {
      reply = "Prakash Linear Projection Vector compression initialized. Radiation telemetry compressed to 32-bit packets with 'Bhaarat' security seal.";
    } else if (q.includes("akashdeep") || q.includes("mars") || q.includes("hud") || q.includes("eva")) {
      reply = "Akashdeep HUD active. Semantic reconstruction mapping coronal mass ejection wavefront trajectories in less than one millisecond.";
    } else if (q.includes("register") || q.includes("agency") || q.includes("payload") || q.includes("node")) {
      reply = "Autonomous Agency Node Registration module ready. Navigate to registration portal to assign IPN node credentials.";
    } else if (q.includes("solar") || q.includes("cme") || q.includes("storm") || q.includes("threat")) {
      reply = "Aditya-L1 ASPEX and PAPA sensor streams detect coronal shockwave. Direct neural mesh transit initiated, reducing alert latency to 30 seconds.";
    }

    setTimeout(() => {
      setMessages(prev => [...prev, { role: "ai", text: reply }]);
      speakResponse(reply);
    }, 600);
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();
    processQuery(inputValue);
  };

  const handlePromptChip = (chipText) => {
    processQuery(chipText);
  };

  return (
    <div className="bg-black text-white font-sans selection:bg-cyan-500 selection:text-black relative">
      
      {/* --- BACKGROUND AMBIENT AUDIO --- */}
      <audio ref={audioRef} loop preload="auto">
        <source src="https://actions.google.com/sounds/v1/science_fiction/deep_space_drone.ogg" type="audio/ogg" />
        <source src="https://assets.mixkit.co/active_storage/sfx/2874/2874-preview.mp3" type="audio/mp3" />
      </audio>

      {/* --- CINEMATIC FIXED PARALLAX BACKGROUND LAYERS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-black overflow-hidden">
        
        {/* Layer 1: Deep Space 1 (Hero) */}
        <motion.div 
          style={{
            opacity: bg1Opacity,
            backgroundImage: "url('/images/deepspace1.jpg')",
          }}
          className="absolute inset-0 bg-cover bg-center will-change-[opacity]"
        />
        
        {/* Layer 2: Single High-Definition Sun Corona (Phase 02 - Pure & Unmixed) */}
        <motion.div 
          style={{ 
            opacity: bg2Opacity,
            display: showSolarLayer ? "block" : "none",
          }}
          className="absolute inset-0 overflow-hidden pointer-events-none will-change-[opacity]"
        >
          {/* Solid pure black backing so no underlying deep space image can mix */}
          <div className="absolute inset-0 bg-black" />
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -inset-4 bg-cover bg-center"
            style={{
              backgroundImage: "url('/images/sun.jpg')",
              filter: "brightness(1.15) contrast(1.1)",
            }}
          />
          {/* Ambient Warm Solar Glow */}
          <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-orange-600/30 rounded-full blur-[140px] pointer-events-none" />
        </motion.div>

        {/* Layer 4: Registration / Join Us (Silky Smooth 2-Image Crossfade) */}
        <motion.div 
          style={{ 
            opacity: bg4Opacity,
            display: showJoinLayer ? "block" : "none",
          }}
          className="absolute inset-0 overflow-hidden pointer-events-none will-change-[opacity]"
        >
          {joinImages.map((src, idx) => {
            const isActive = joinBgIndex === idx;
            return (
              <div
                key={src}
                className="absolute inset-0 bg-cover bg-center will-change-[opacity,transform]"
                style={{
                  backgroundImage: `url('${src}')`,
                  opacity: isActive ? 0.92 : 0,
                  transform: isActive ? "scale(1)" : "scale(1.04)",
                  transition: "opacity 1.0s cubic-bezier(0.4, 0, 0.2, 1), transform 5s ease-out",
                  zIndex: isActive ? 2 : 1,
                  filter: "brightness(1.1) contrast(1.05)",
                }}
              />
            );
          })}
          {/* Ambient Deep Space Cyan Glow */}
          <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-cyan-600/20 rounded-full blur-[140px] pointer-events-none z-10" />
        </motion.div>

        {/* Subtle Bottom Ambient Vignette to keep background fully visible */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none z-20" />
      </div>

      {/* --- SMART AEROSPACE NAVBAR --- */}
      <motion.nav 
        variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
        animate={navHidden ? "hidden" : "visible"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 left-0 w-full z-40 flex items-center justify-between px-6 sm:px-8 py-2.5 sm:py-3 bg-black/40 backdrop-blur-md border-b border-white/10 pointer-events-auto"
      >
        <div className="flex items-center gap-4">
          <Link href="/" className="text-lg font-bold tracking-[0.2em] text-white uppercase hover:text-cyan-400 transition-colors">
            SHIVODAYA
          </Link>
          <span className="hidden md:inline-block text-[9px] tracking-widest text-cyan-400 font-mono border-l border-white/20 pl-3 uppercase">
            Interplanetary Neural Mesh
          </span>
        </div>
        
        <div className="hidden lg:flex items-center gap-7 text-[11px] font-bold tracking-widest uppercase text-white">
          <Link href="/vision" className="text-zinc-300 hover:text-cyan-400 transition-colors">Vision</Link>
          <Link href="/architecture" className="text-zinc-300 hover:text-cyan-400 transition-colors">Architecture</Link>
          <Link href="/control-center" className="text-zinc-300 hover:text-cyan-400 transition-colors">Control Center</Link>
          <Link href="/registration" className="text-zinc-300 hover:text-cyan-400 transition-colors">Registration</Link>
        </div>

        <div className="flex items-center gap-3">
          {/* Audio Ambient Toggle Button */}
          <button
            onClick={toggleAudio}
            className={`p-1.5 px-2.5 rounded-full border transition-all text-xs flex items-center gap-1.5 ${
              audioPlaying 
                ? "border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.3)]" 
                : "border-white/20 bg-white/5 text-zinc-400 hover:text-white"
            }`}
            title={audioPlaying ? "Mute Ambient Audio" : "Play Ambient Space Audio"}
          >
            {audioPlaying ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline text-[9px] font-mono uppercase tracking-wider">{audioPlaying ? "Sound ON" : "Sound"}</span>
          </button>

          {/* Vani AI Launcher Button */}
          <button
            onClick={() => setIsVaniOpen(true)}
            className="px-4 py-1.5 rounded-full border border-cyan-400/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-[10px] font-bold tracking-widest uppercase transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.2)]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Initialize Vani
          </button>
        </div>
      </motion.nav>

      {/* --- SCROLLABLE CONTENT SECTIONS --- */}
      <div className="relative z-10">
        
        {/* ============================================================
            SECTION 1: HERO - MINIMALIST CINEMATIC
            ============================================================ */}
        <section id="hero" className="min-h-screen flex flex-col justify-end pb-28 px-8 md:px-24 pointer-events-none">
          <div className="max-w-3xl pointer-events-auto">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-[0.2em] uppercase text-white drop-shadow-[0_4px_25px_rgba(0,0,0,0.95)] leading-tight mb-3">
              SHIVODAYA
            </h1>
            <p className="text-xs sm:text-sm md:text-base font-light tracking-[0.22em] text-zinc-300 uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] leading-relaxed">
              Severing Humanity's Earth-Dependency in Deep Space.
            </p>
          </div>
        </section>

        {/* ============================================================
            SECTION 2: CME THREAT & LIVE LATENCY BENCHMARK
            ============================================================ */}
        <section id="mesh" className="min-h-screen flex flex-col justify-center pb-24 px-6 md:px-24">
          <div className="max-w-4xl">
            
            <span className="inline-block text-[10px] text-orange-400 tracking-[0.3em] font-mono uppercase mb-4 drop-shadow-md">
              Phase 02 // Coronal Mass Ejections & Blackouts
            </span>

            <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight mb-6 drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)] leading-[1.05]">
              Solar Storm<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-white">
                Blackout Defense.
              </span>
            </h2>

            <p className="text-zinc-200 text-sm sm:text-base leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] mb-8 max-w-2xl font-light">
              Class-X coronal mass ejections sever ground links. Shivodaya routes mission-critical alerts directly through space, eliminating Earth-queue delays entirely.
            </p>

            {/* Interactive Latency Reduction Benchmark Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 max-w-3xl">
              <div className="p-6 rounded-2xl bg-black/70 border border-cyan-500/40 backdrop-blur-xl shadow-[0_0_30px_rgba(0,240,255,0.1)]">
                <div className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 mb-1">Autonomous Mesh</div>
                <div className="text-4xl sm:text-5xl font-bold text-white mb-1">30s</div>
                <p className="text-xs text-zinc-400 leading-snug">
                  Direct Aditya-L1 to Mars Base transit.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-black/70 border border-red-500/30 backdrop-blur-xl shadow-[0_0_30px_rgba(239,68,68,0.08)]">
                <div className="text-[10px] font-mono uppercase tracking-widest text-red-400 mb-1">Ground Link</div>
                <div className="text-4xl sm:text-5xl font-bold text-zinc-400 mb-1">240m</div>
                <p className="text-xs text-zinc-400 leading-snug">
                  Planetary queues and signal blackouts.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-black/70 border border-emerald-500/30 backdrop-blur-xl shadow-[0_0_30px_rgba(16,185,129,0.08)]">
                <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 mb-1">Latency Reduction</div>
                <div className="text-4xl sm:text-5xl font-bold text-emerald-400 mb-1">98.7%</div>
                <p className="text-xs text-zinc-400 leading-snug">
                  Astronaut warning window secured.
                </p>
              </div>
            </div>

            <Link
              href="/control-center"
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/40 bg-white/5 hover:bg-white hover:text-black text-white font-bold text-xs tracking-[0.2em] uppercase transition-all shadow-lg cursor-pointer"
            >
              <span>Launch Control Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

          </div>
        </section>

        {/* ============================================================
            SECTION 3: THREE SUBSYSTEMS. ONE DEEP-SPACE NETWORK.
            ============================================================ */}
        <section id="triad" className="relative min-h-screen flex flex-col justify-center py-28 px-6 md:px-24 overflow-hidden">
          
          {/* Black Hole Background Video */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-85 motion-reduce:hidden"
              style={{ filter: "brightness(0.95) contrast(1.15)" }}
            >
              <source src="/videos/blackhole.mp4" type="video/mp4" />
            </video>
            {/* Fallback image for prefers-reduced-motion */}
            <div 
              className="hidden motion-reduce:block absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/hero_space_mesh.jpg')" }}
            />
            {/* Subtle dark gradient overlay to preserve text readability without hiding the black hole */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/75" />
          </div>

          <div className="max-w-6xl mx-auto w-full relative z-10">
            
            {/* Section Heading */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block text-[10px] text-cyan-400 tracking-[0.3em] font-mono uppercase mb-3 drop-shadow-md">
                Phase 03 // Core Architecture
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold uppercase tracking-tight mb-3 drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)] text-white">
                Three Subsystems.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-cyan-300 to-amber-100">
                  One Deep-Space Network.
                </span>
              </h2>
              <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed font-light max-w-xl mx-auto drop-shadow-md">
                Three layers built to sense, carry, and surface critical information across deep space.
              </p>
            </div>

            {/* Three Connected Minimal Modules */}
            <div className="relative mb-14">
              
              {/* Thin luminous communication thread connecting 01 -> 02 -> 03 on desktop */}
              <div className="hidden lg:block absolute top-1/2 left-[18%] right-[18%] h-[1px] -translate-y-1/2 bg-gradient-to-r from-amber-400/40 via-cyan-400/50 to-amber-200/40 pointer-events-none z-0">
                {/* Continuous subtle traveling light pulse */}
                <motion.div
                  animate={{
                    left: ["0%", "100%"],
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 -ml-2 rounded-full bg-cyan-300 blur-[2px] shadow-[0_0_12px_rgba(6,182,212,0.9)]"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
                
                {/* Module 1: PRAKASH */}
                <div
                  onMouseEnter={() => setHoveredSystem("prakash")}
                  onMouseLeave={() => setHoveredSystem(null)}
                  onClick={() => setInspectedSystem("prakash")}
                  className={`group relative rounded-2xl p-7 transition-all duration-500 cursor-pointer flex flex-col justify-between min-h-[300px] border backdrop-blur-xl ${
                    hoveredSystem === "prakash"
                      ? "bg-zinc-950/90 border-amber-400 shadow-[0_0_45px_rgba(245,158,11,0.25)] scale-[1.02]"
                      : "bg-zinc-950/65 border-white/15 hover:border-amber-400/60 shadow-[0_4px_25px_rgba(0,0,0,0.5)]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
                      <span className="text-xs font-mono font-bold text-amber-400">01</span>
                      <span className="text-[9px] font-mono tracking-widest text-amber-300/80 uppercase font-semibold">
                        PRAKASH SEES
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-1 tracking-wide">
                      PRAKASH
                    </h3>
                    <p className="text-xs font-mono text-amber-300/90 uppercase tracking-widest mb-4">
                      SOLAR SENTRY
                    </p>
                    
                    <p className="text-xs text-zinc-300 leading-relaxed font-light">
                      Turning solar activity into information missions can understand.
                    </p>
                  </div>

                  <div className="pt-5 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                    <span className="text-[10px] text-amber-300/70 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      Senses Solar Threats
                    </span>
                    <span className="text-zinc-400 group-hover:text-amber-300 flex items-center gap-1 transition text-[11px]">
                      <span>Inspect</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>

                {/* Module 2: RICHA */}
                <div
                  onMouseEnter={() => setHoveredSystem("richa")}
                  onMouseLeave={() => setHoveredSystem(null)}
                  onClick={() => setInspectedSystem("richa")}
                  className={`group relative rounded-2xl p-7 transition-all duration-500 cursor-pointer flex flex-col justify-between min-h-[300px] border backdrop-blur-xl ${
                    hoveredSystem === "richa"
                      ? "bg-zinc-950/90 border-cyan-400 shadow-[0_0_45px_rgba(6,182,212,0.25)] scale-[1.02]"
                      : "bg-zinc-950/65 border-white/15 hover:border-cyan-400/60 shadow-[0_4px_25px_rgba(0,0,0,0.5)]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
                      <span className="text-xs font-mono font-bold text-cyan-400">02</span>
                      <span className="text-[9px] font-mono tracking-widest text-cyan-300/80 uppercase font-semibold">
                        RICHA CARRIES
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-1 tracking-wide">
                      RICHA
                    </h3>
                    <p className="text-xs font-mono text-cyan-300/90 uppercase tracking-widest mb-4">
                      LIGHT BETWEEN WORLDS
                    </p>
                    
                    <p className="text-xs text-zinc-300 leading-relaxed font-light">
                      Finding resilient ways to carry important information through deep space.
                    </p>
                  </div>

                  <div className="pt-5 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                    <span className="text-[10px] text-cyan-300/70 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      Dynamic Space Mesh
                    </span>
                    <span className="text-zinc-400 group-hover:text-cyan-300 flex items-center gap-1 transition text-[11px]">
                      <span>Inspect</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>

                {/* Module 3: AKASHDEEP */}
                <div
                  onMouseEnter={() => setHoveredSystem("akashdeep")}
                  onMouseLeave={() => setHoveredSystem(null)}
                  onClick={() => setInspectedSystem("akashdeep")}
                  className={`group relative rounded-2xl p-7 transition-all duration-500 cursor-pointer flex flex-col justify-between min-h-[300px] border backdrop-blur-xl ${
                    hoveredSystem === "akashdeep"
                      ? "bg-zinc-950/90 border-amber-200 shadow-[0_0_45px_rgba(253,230,138,0.25)] scale-[1.02]"
                      : "bg-zinc-950/65 border-white/15 hover:border-amber-200/60 shadow-[0_4px_25px_rgba(0,0,0,0.5)]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
                      <span className="text-xs font-mono font-bold text-amber-200">03</span>
                      <span className="text-[9px] font-mono tracking-widest text-amber-200/80 uppercase font-semibold">
                        AKASHDEEP REVEALS
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-1 tracking-wide">
                      AKASHDEEP
                    </h3>
                    <p className="text-xs font-mono text-amber-200/90 uppercase tracking-widest mb-4">
                      LIGHT OF HOME
                    </p>
                    
                    <p className="text-xs text-zinc-300 leading-relaxed font-light">
                      Turning distant mission data into information humans can understand.
                    </p>
                  </div>

                  <div className="pt-5 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                    <span className="text-[10px] text-amber-200/70 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
                      Flight Commander HUD
                    </span>
                    <span className="text-zinc-400 group-hover:text-amber-200 flex items-center gap-1 transition text-[11px]">
                      <span>Inspect</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Central Architecture Explorer CTA */}
            <div className="text-center">
              <Link 
                href="/architecture"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs tracking-[0.2em] uppercase transition-all shadow-[0_0_25px_rgba(0,240,255,0.4)] cursor-pointer"
              >
                <span>Launch Architecture Blueprint</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </section>

        {/* ============================================================
            SECTION: RESEARCH / FIELD NOTES (SCIENTIFIC CHALLENGES & ARTICLES)
            ============================================================ */}
        <section id="research" className="min-h-screen flex flex-col justify-center py-28 px-6 md:px-24 bg-black/60 border-t border-white/10 relative z-20">
          <div className="max-w-6xl mx-auto w-full">
            
            {/* Section Header */}
            <div className="max-w-3xl mb-16">
              <span className="inline-block text-[10px] text-amber-400 tracking-[0.35em] font-mono uppercase mb-3 font-semibold">
                RESEARCH / FIELD NOTES
              </span>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tight text-white mb-4 leading-tight">
                THE PROBLEMS WE NEED TO SOLVE.
              </h2>
              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-light max-w-2xl">
                Humanity is learning to travel farther into space. The farther we go, the more important it becomes to remain aware, connected, and resilient.
              </p>
            </div>

            {/* NASA-Inspired Editorial Layout */}
            <div className="space-y-8">
              
              {/* 1. DOMINANT FEATURED STORY CARD (Article 1) */}
              {RESEARCH_ARTICLES.filter(a => a.featured).map((art) => (
                <div
                  key={art.id}
                  onClick={() => setActiveArticle(art)}
                  className="group rounded-3xl bg-zinc-950/80 border border-white/15 hover:border-amber-400/60 p-6 sm:p-10 backdrop-blur-xl transition-all duration-300 cursor-pointer grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-[0_0_40px_rgba(0,0,0,0.6)]"
                >
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono">
                      <span className="px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 font-bold uppercase tracking-wider">
                        {art.category}
                      </span>
                      <span className="text-zinc-400 tracking-wider">
                        SOURCE: <strong className="text-zinc-200">{art.source}</strong>
                      </span>
                      <span className="text-zinc-500">•</span>
                      <span className="text-zinc-400">{art.readTime}</span>
                    </div>

                    <h3 className="text-2xl sm:text-4xl font-bold text-white uppercase tracking-tight group-hover:text-amber-200 transition-colors leading-tight">
                      {art.title}
                    </h3>

                    <p className="text-zinc-300 text-sm sm:text-base font-light leading-relaxed">
                      {art.summary}
                    </p>

                    <div className="pt-2 flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-amber-300 group-hover:text-amber-200 uppercase">
                      <span>Read Research Note</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  <div className="lg:col-span-5 h-64 sm:h-80 rounded-2xl overflow-hidden relative border border-white/10">
                    <img 
                      src={art.image} 
                      alt={art.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute bottom-3 left-3 text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-black/60 text-zinc-300 border border-white/10">
                      Scientific Archive Imagery
                    </span>
                  </div>
                </div>
              ))}

              {/* 2. MEDIUM CARDS (Articles 2, 3, 4) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {RESEARCH_ARTICLES.slice(1, 4).map((art) => (
                  <div
                    key={art.id}
                    onClick={() => setActiveArticle(art)}
                    className="group rounded-2xl bg-zinc-950/70 border border-white/10 hover:border-cyan-400/50 p-6 backdrop-blur-xl transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-lg"
                  >
                    <div>
                      <div className="h-44 rounded-xl overflow-hidden mb-5 relative border border-white/10">
                        <img 
                          src={art.image} 
                          alt={art.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                        <span className="absolute top-2.5 left-2.5 text-[8px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-black/70 text-cyan-300 border border-cyan-500/30">
                          {art.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[9px] font-mono text-zinc-400 mb-2">
                        <span>SOURCE: <strong className="text-zinc-200">{art.source}</strong></span>
                        <span>•</span>
                        <span>{art.readTime}</span>
                      </div>

                      <h4 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight mb-3 group-hover:text-cyan-200 transition-colors leading-snug">
                        {art.title}
                      </h4>

                      <p className="text-xs text-zinc-300 font-light leading-relaxed line-clamp-3">
                        {art.summary}
                      </p>
                    </div>

                    <div className="pt-5 border-t border-white/10 flex items-center justify-between text-xs font-mono text-cyan-400 mt-5">
                      <span className="text-[10px] tracking-widest uppercase">Read Note</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>

              {/* 3. SECONDARY COMPACT CARDS (Articles 5, 6, 7, 8, 9) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {RESEARCH_ARTICLES.slice(4).map((art) => (
                  <div
                    key={art.id}
                    onClick={() => setActiveArticle(art)}
                    className={`group rounded-2xl p-5 backdrop-blur-xl transition-all duration-300 cursor-pointer flex flex-col justify-between border ${
                      art.category.includes("SHIVODAYA")
                        ? "bg-amber-950/20 border-amber-400/40 hover:border-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.1)]"
                        : "bg-zinc-950/60 border-white/10 hover:border-white/30"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[9px] font-mono mb-3">
                        <span className={art.category.includes("SHIVODAYA") ? "text-amber-300 font-bold uppercase" : "text-zinc-400 uppercase"}>
                          {art.category}
                        </span>
                        <span className="text-zinc-500">{art.readTime}</span>
                      </div>

                      <div className="text-[9px] font-mono text-zinc-400 mb-1.5">
                        SOURCE: <strong className="text-zinc-200">{art.source}</strong>
                      </div>

                      <h5 className="text-sm font-bold text-white uppercase tracking-tight mb-2 group-hover:text-amber-200 transition-colors leading-snug">
                        {art.title}
                      </h5>

                      <p className="text-xs text-zinc-400 font-light leading-relaxed line-clamp-3">
                        {art.summary}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-zinc-400 group-hover:text-white mt-4">
                      <span className="text-[9px] tracking-widest uppercase">Explore Field Note</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </section>

        {/* ============================================================
            SECTION 4: REGISTRATION & ONBOARDING
            ============================================================ */}
        <section id="register" className="min-h-screen flex flex-col justify-center items-end text-right pb-32 px-6 md:px-24">
          <div className="max-w-2xl">
            
            <span className="text-[10px] text-cyan-300 font-mono tracking-[0.3em] uppercase mb-3 block drop-shadow-md">
              Phase 04 // Node Onboarding
            </span>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tight mb-4 drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)] leading-tight text-white">
              Join the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-white">
                Interplanetary Mesh.
              </span>
            </h2>

            <p className="text-zinc-200 text-sm sm:text-base leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] mb-6 font-light">
              Register orbital assets to receive dedicated IPN node credentials and autonomous early warnings.
            </p>

            <div className="flex justify-end gap-4">
              <Link
                href="/registration"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-black font-bold text-xs tracking-[0.2em] uppercase hover:bg-zinc-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.4)] cursor-pointer"
              >
                <span>Begin Registration</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </section>
      </div>

      {/* --- VANI AI CONVERSATIONAL MODAL WITH ACTIONABLE CHIPS --- */}
      <AnimatePresence>
        {isVaniOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl h-[75vh] flex flex-col rounded-2xl overflow-hidden border border-white/20 shadow-[0_0_60px_rgba(0,255,255,0.2)] bg-black/85 backdrop-blur-2xl"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-5 border-b border-white/10 bg-black/40">
                <div className="flex items-center gap-4">
                  {/* Holographic 3D AI Orb */}
                  <div className="relative w-12 h-12 rounded-full overflow-hidden flex items-center justify-center border border-cyan-500/40 shadow-[0_0_20px_rgba(0,255,255,0.3)] bg-black shrink-0">
                    <img 
                      src="https://i.pinimg.com/originals/a7/60/a6/a760a6396b7da23a233c0bd582e3458c.gif" 
                      alt="Vani AI Core" 
                      referrerPolicy="no-referrer"
                      className="w-[180%] h-[180%] object-cover mix-blend-screen opacity-90"
                    />
                    <div className="absolute inset-0 rounded-full shadow-[inset_0_0_15px_rgba(0,0,0,0.8)] pointer-events-none" />
                  </div>
                  
                  <div>
                    <h3 className="text-base font-bold tracking-[0.2em] text-white">VANI AI</h3>
                    <p className="text-[9px] text-cyan-400 tracking-[0.2em] uppercase font-mono">Status: Awaiting Mission Telemetry Query</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                   <button onClick={() => speakResponse(messages[messages.length-1].text)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer" title="Replay Last Audio">
                     <Volume2 className="w-4 h-4" />
                   </button>
                   <button onClick={() => { if (typeof window !== "undefined" && "speechSynthesis" in window) { window.speechSynthesis.cancel(); } setIsVaniOpen(false); }} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-base transition-colors cursor-pointer">✕</button>
                </div>
              </div>

              {/* Actionable Prompt Chips */}
              <div className="px-5 py-2.5 bg-black/50 border-b border-white/5 flex items-center gap-2 overflow-x-auto scrollbar-none">
                <span className="text-[9px] font-mono text-zinc-500 uppercase shrink-0">Quick Prompts:</span>
                {[
                  "Check Aditya-L1 Solar Threat",
                  "Simulate Richa Cis-Lunar Route",
                  "Reconstruct Mars Base EVA Alert",
                  "Register Payload (ipn:4.1)"
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePromptChip(chip)}
                    className="shrink-0 px-2.5 py-1 rounded-full bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400/40 text-[10px] text-zinc-300 hover:text-cyan-300 font-mono transition"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Chat History Window */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5 scroll-smooth">
                {messages.map((msg, index) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={index} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`p-4 text-xs sm:text-sm leading-relaxed tracking-wide ${
                      msg.role === 'user' 
                        ? 'bg-white/10 text-white rounded-2xl rounded-tr-sm max-w-[80%]' 
                        : 'bg-cyan-950/40 border border-cyan-500/30 text-cyan-50 rounded-2xl rounded-tl-sm max-w-[85%]'
                    }`}>
                      {msg.role === 'ai' && (
                        <div className="flex items-center gap-2 mb-1.5 text-[8px] text-cyan-400 tracking-widest font-mono uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                          <span>VANI NEURAL SYNTHESIS</span>
                        </div>
                      )}
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
                
                {/* Listening Indicator */}
                {isListening && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-end">
                    <div className="p-3 bg-white/5 text-zinc-400 rounded-2xl rounded-tr-sm max-w-[80%] text-xs italic flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"/> Listening to mission command voice...
                    </div>
                  </motion.div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <form onSubmit={handleSendMessage} className="p-4 bg-black/60 border-t border-white/10 flex items-center gap-3">
                 <button 
                   type="button" 
                   onClick={toggleListening} 
                   className={`w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-full transition-all cursor-pointer ${
                     isListening 
                       ? 'bg-red-500/20 text-red-400 border border-red-500/50 animate-pulse' 
                       : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                   }`}
                   title={isListening ? "Listening..." : "Speak via Voice Uplink"}
                 >
                   <Radio className={`w-4 h-4 ${isListening ? 'animate-spin' : ''}`} />
                 </button>
                 <input 
                   type="text" 
                   value={inputValue}
                   onChange={(e) => setInputValue(e.target.value)}
                   placeholder="Ask Vani about Aditya-L1, Richa routing, or register assets..." 
                   className="flex-1 bg-white/5 border border-white/10 focus:border-cyan-400 rounded-full py-3 px-5 text-xs sm:text-sm text-white placeholder-zinc-500 outline-none transition-colors font-sans" 
                 />
                 <button 
                   type="submit" 
                   disabled={!inputValue.trim()} 
                   className="w-11 h-11 flex-shrink-0 flex items-center justify-center bg-cyan-500/20 hover:bg-cyan-500/40 disabled:bg-white/5 disabled:text-zinc-600 disabled:cursor-not-allowed text-cyan-400 rounded-full transition-colors cursor-pointer border border-cyan-500/30"
                 >
                   <ArrowRight className="w-4 h-4" />
                 </button>
              </form>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- TECHNICAL INSPECTOR MODAL (SYSTEM DISCOVERY LAYER) --- */}
      <AnimatePresence>
        {inspectedSystem && SYSTEM_DETAILS[inspectedSystem] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setInspectedSystem(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl overflow-hidden border border-white/20 shadow-[0_0_60px_rgba(0,0,0,0.9)] bg-zinc-950/95 backdrop-blur-2xl"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-white/10 bg-black/40">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs font-mono font-bold text-white">
                    {SYSTEM_DETAILS[inspectedSystem].number}
                  </span>
                  <div>
                    <h3 className="text-xl font-bold tracking-wider text-white uppercase">
                      {SYSTEM_DETAILS[inspectedSystem].name}
                    </h3>
                    <p className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
                      {SYSTEM_DETAILS[inspectedSystem].identity} // {SYSTEM_DETAILS[inspectedSystem].conceptTag}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setInspectedSystem(null)}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* ROLE */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <span className="text-[10px] font-mono tracking-[0.25em] text-zinc-400 uppercase font-semibold block">
                    MISSION ROLE
                  </span>
                  <p className="text-sm text-zinc-200 font-light leading-relaxed">
                    “{SYSTEM_DETAILS[inspectedSystem].role}”
                  </p>
                </div>

                {/* TECHNICAL LAYER */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono tracking-[0.25em] text-zinc-400 uppercase font-semibold">
                      TECHNICAL LAYER SPECIFICATIONS
                    </span>
                    <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {SYSTEM_DETAILS[inspectedSystem].status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {SYSTEM_DETAILS[inspectedSystem].techDetails.map((detail, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1">
                        <span className="text-[9px] font-mono uppercase text-zinc-500 block">
                          {detail.label}
                        </span>
                        <p className="text-xs font-mono text-zinc-200">
                          {detail.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-5 border-t border-white/10 bg-black/50 flex items-center justify-between">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                  SHIVODAYA NATIVE SUBSYSTEM SPEC
                </span>
                <Link
                  href="/architecture"
                  className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-mono uppercase tracking-wider transition flex items-center gap-1.5"
                >
                  <span>Explore Full Architecture</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- RESEARCH ARTICLE DETAIL MODAL (SCIENTIFIC FIELD NOTE) --- */}
      <AnimatePresence>
        {activeArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setActiveArticle(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl overflow-hidden border border-white/20 shadow-[0_0_70px_rgba(0,0,0,0.95)] bg-zinc-950/95 backdrop-blur-2xl"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-white/10 bg-black/40">
                <div className="flex items-center gap-2.5 text-[10px] font-mono">
                  <span className="px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 font-bold uppercase tracking-wider">
                    {activeArticle.category}
                  </span>
                  <span className="text-zinc-400 tracking-wider">
                    SOURCE: <strong className="text-zinc-200">{activeArticle.source}</strong>
                  </span>
                  <span className="text-zinc-500">•</span>
                  <span className="text-zinc-400">{activeArticle.readTime}</span>
                </div>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
                
                {/* Hero Image */}
                <div className="h-56 sm:h-72 rounded-2xl overflow-hidden relative border border-white/10">
                  <img
                    src={activeArticle.image}
                    alt={activeArticle.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute bottom-3 left-3 text-[9px] font-mono uppercase tracking-widest px-2.5 py-1 rounded bg-black/70 text-zinc-300 border border-white/10">
                    Scientific Archive Imagery // Deep Space Telemetry
                  </span>
                </div>

                {/* Title & Summary */}
                <div className="space-y-3">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-tight leading-tight">
                    {activeArticle.title}
                  </h2>
                  <p className="text-sm sm:text-base text-zinc-300 font-light italic leading-relaxed border-l-2 border-amber-400/60 pl-4 py-1">
                    {activeArticle.summary}
                  </p>
                </div>

                {/* Transparency Notice */}
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-zinc-400 uppercase tracking-wider">
                    {activeArticle.sourceType}
                  </span>
                  <span className="text-amber-300 font-semibold uppercase">
                    SHIVODAYA RESEARCH EDITORIAL
                  </span>
                </div>

                {/* Article Body */}
                <div className="space-y-4 text-sm text-zinc-300 font-light leading-relaxed">
                  {activeArticle.content.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>

                {/* Citation Notice */}
                <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-1">
                  <span className="text-[9px] font-mono uppercase text-zinc-500 block">
                    Public Reference Attribution
                  </span>
                  <p className="text-xs font-mono text-zinc-400">
                    {activeArticle.citation}
                  </p>
                </div>

              </div>

              {/* Footer */}
              <div className="p-5 border-t border-white/10 bg-black/50 flex items-center justify-between">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                  Open Science & Interoperability
                </span>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-mono uppercase tracking-wider transition cursor-pointer"
                >
                  Close Article
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
