"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const VaniContext = createContext(null);

export function VaniProvider({ children }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const introSpokenRef = useRef(false);

  const introText = "Hello, I am Vani. Welcome to Shivodaya. How may I help you navigate? Would you like me to first introduce our vision and models, or help register your agency?";

  const [messages, setMessages] = useState([
    {
      sender: "vani",
      text: introText,
      time: "Just now"
    }
  ]);

  // Web Speech Synthesis (TTS)
  const speakText = (text) => {
    if (!voiceEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 1.05;
      utter.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(v => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Samantha")));
      if (voice) utter.voice = voice;

      utter.onstart = () => setIsSpeaking(true);
      utter.onend = () => setIsSpeaking(false);
      utter.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utter);
    } catch (e) {
      console.warn("TTS Error:", e);
    }
  };

  const openVani = (customPrompt) => {
    setIsOpen(true);
    if (customPrompt) {
      handleUserQuery(customPrompt);
    } else if (!introSpokenRef.current && voiceEnabled) {
      introSpokenRef.current = true;
      speakText(introText);
    }
  };

  const closeVani = () => {
    setIsOpen(false);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  const toggleVani = () => {
    if (isOpen) {
      closeVani();
    } else {
      openVani();
    }
  };

  // Web Speech Recognition (STT)
  const startListening = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleUserQuery(transcript);
      };

      recognition.start();
    } catch (e) {
      console.warn("STT Error:", e);
    }
  };

  const handleUserQuery = (query) => {
    const userMsg = { sender: "user", text: query, time: "Now" };
    setMessages(prev => [...prev, userMsg]);

    const q = query.toLowerCase();
    let reply = "";

    if (q.includes("vision") || q.includes("introduce") || q.includes("mission")) {
      reply = "Shivodaya is the world's first autonomous deep-space radiation alert mesh network, severing Earth-dependency during solar blackouts. Navigating to our Vision page.";
      router.push("/vision");
    } else if (q.includes("model") || q.includes("prakash") || q.includes("richa") || q.includes("akashdeep") || q.includes("mesh")) {
      reply = "Our core triad consists of Prakash (JSCC Encoder), Richa (TVG Dijkstra Neural Router), and Akashdeep (Martian Semantic Decoder). Routing to the Mesh Network page.";
      router.push("/mesh-network");
    } else if (q.includes("register") || q.includes("agency") || q.includes("join") || q.includes("onboard")) {
      reply = "Opening the Inter-Agency Spacecraft Registration Portal where organizations can claim an IPN node ID.";
      router.push("/registration");
    } else if (q.includes("control") || q.includes("center") || q.includes("telemetry") || q.includes("earth")) {
      reply = "Accessing the Ground & Deep Space Control Center.";
      router.push("/control-center");
    } else {
      reply = `I heard: "${query}". You can ask me to introduce our vision, explain our models (Prakash, Richa, Akashdeep), or open the Agency Registration portal.`;
    }

    setTimeout(() => {
      setMessages(prev => [...prev, { sender: "vani", text: reply, time: "Now" }]);
      speakText(reply);
    }, 300);
  };

  // Auto-pop on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY || document.documentElement.scrollTop || 0;
      if (scrollPos > 30 && !introSpokenRef.current) {
        introSpokenRef.current = true;
        setIsOpen(true);
        speakText(introText);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <VaniContext.Provider
      value={{
        isOpen,
        openVani,
        closeVani,
        toggleVani,
        messages,
        isListening,
        isSpeaking,
        voiceEnabled,
        setVoiceEnabled,
        startListening,
        handleUserQuery,
        speakText
      }}
    >
      {children}
    </VaniContext.Provider>
  );
}

export function useVani() {
  const context = useContext(VaniContext);
  if (!context) {
    throw new Error("useVani must be used within a VaniProvider");
  }
  return context;
}
