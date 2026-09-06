"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Mic, MicOff, Volume2, VolumeX, X, Send, Sparkles, Radio, Menu } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  // 1. Mounted & Interactive Vani AI Modal State
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [micSupported, setMicSupported] = useState(true);
  const [micStatusText, setMicStatusText] = useState("");
  const [liveTranscript, setLiveTranscript] = useState("");
  const [inputVal, setInputVal] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const initialGreeting = "Greetings voyager. I am Vani, your deep space neural navigator. As we venture beyond Earth's horizon, I am monitoring all solar streams. How may I assist your mission today?";

  const [messages, setMessages] = useState([
    {
      sender: "vani",
      text: initialGreeting,
      time: "Now",
    },
  ]);

  const activeRecognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const recognitionTimeoutRef = useRef(null);
  const autoPoppedRef = useRef(false);

  // 2. Safe Web Speech check on mount
  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      setMicSupported(false);
      setMicStatusText("Speech recognition not supported in this browser. Please use text input or Chrome/Edge.");
    }

    // Expose global window.openVani for navbar / deep links
    window.openVani = (promptText) => {
      setIsOpen(true);
      if (promptText) {
        handleSendMessage(promptText);
      }
    };

    return () => {
      stopListening();
    };
  }, []);

  // 3. Auto-pop Vani Assistant on Scroll
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      if (scrollY > 120 && !autoPoppedRef.current) {
        autoPoppedRef.current = true;
        setIsOpen(true);
        if (voiceEnabled) {
          speakText(initialGreeting);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [voiceEnabled]);

  // Auto-scroll chat
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, liveTranscript]);

  // 4. Pleasant, Soothing Deep-Space Bass Female Voice Synthesis (TTS)
  const speakText = (text) => {
    if (!voiceEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      // Soothing, calm deep-space cadence with resonant warmth
      utterance.rate = 0.90;
      utterance.pitch = 0.85; // Low-pitch resonance gives warm space bass tone
      utterance.lang = "en-US";

      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        // Prioritize natural, soft, melodic female voices
        const naturalVoice = voices.find(
          (v) =>
            v.lang.startsWith("en") &&
            (v.name.includes("Google UK English Female") ||
              v.name.includes("Google US English") ||
              v.name.includes("Samantha") ||
              v.name.includes("Jenny") ||
              v.name.includes("Aria") ||
              v.name.includes("Natural") ||
              v.name.includes("Siri") ||
              v.name.includes("Victoria") ||
              v.name.includes("Karen") ||
              v.name.includes("Female") ||
              v.name.includes("Zira"))
        ) || voices[0];
        if (naturalVoice) utterance.voice = naturalVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (e) => {
        console.warn("TTS Error:", e);
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn("SpeechSynthesis error:", err);
      setIsSpeaking(false);
    }
  };

  // 5. Safe Stop Listening
  const stopListening = () => {
    if (recognitionTimeoutRef.current) {
      clearTimeout(recognitionTimeoutRef.current);
      recognitionTimeoutRef.current = null;
    }
    if (activeRecognitionRef.current) {
      try {
        activeRecognitionRef.current.abort();
      } catch (e) {}
      activeRecognitionRef.current = null;
    }
    setIsListening(false);
  };

  // 6. Fresh Speech Recognition Instance on demand
  const startListening = () => {
    if (typeof window === "undefined") return;

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      setMicSupported(false);
      setMicStatusText("Web Speech API not available in this browser. Please use Chrome/Edge or type below.");
      return;
    }

    stopListening();

    try {
      const recognition = new SpeechRec();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      recognition.maxAlternatives = 1;

      let recognizedFinal = "";

      recognition.onstart = () => {
        setIsListening(true);
        setMicStatusText("");
        setLiveTranscript("Listening for your voice...");
      };

      recognition.onresult = (event) => {
        let interim = "";
        let final = "";

        for (let i = 0; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) {
            final += res[0].transcript;
          } else {
            interim += res[0].transcript;
          }
        }

        const fullText = final || interim;
        setLiveTranscript(fullText);

        if (final) {
          recognizedFinal = final;
        }
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
        if (event.error === "not-allowed" || event.error === "permission-denied") {
          setMicStatusText("Microphone permission denied by browser. Please type below or allow mic.");
        } else if (event.error === "no-speech") {
          setMicStatusText("No voice detected. Tap microphone and speak clearly.");
        } else if (event.error === "network") {
          setMicStatusText("Voice network recognition timeout. Use text input below.");
        } else {
          setMicStatusText(`Microphone error (${event.error}). Please type below.`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        if (recognizedFinal && recognizedFinal.trim()) {
          const sent = recognizedFinal.trim();
          recognizedFinal = "";
          setLiveTranscript("");
          handleSendMessage(sent);
        } else {
          setTimeout(() => {
            setLiveTranscript("");
          }, 1500);
        }
      };

      activeRecognitionRef.current = recognition;
      recognition.start();

      // Guard timeout
      recognitionTimeoutRef.current = setTimeout(() => {
        if (activeRecognitionRef.current) {
          try {
            activeRecognitionRef.current.stop();
          } catch (e) {}
        }
      }, 12000);
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      setIsListening(false);
      setMicStatusText("Could not initialize microphone. Please type below.");
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // 7. Send Message Handler (with fallback /api/chat)
  const handleSendMessage = async (userText) => {
    if (!userText || !userText.trim()) return;
    const trimmed = userText.trim();

    setMessages((prev) => [...prev, { sender: "user", text: trimmed, time: "Now" }]);
    setInputVal("");
    setLiveTranscript("");

    const q = trimmed.toLowerCase();
    let reply = "";
    let targetRoute = null;

    // Fast local routing logic for immediate responsiveness
    if (q.includes("vision") || q.includes("mission") || q.includes("about") || q.includes("earth")) {
      reply = "Project Shivodaya severs Earth-dependency during solar blackouts through direct mission-to-mission neural routing. Navigating to Vision.";
      targetRoute = "/vision";
    } else if (q.includes("mesh") || q.includes("network") || q.includes("prakash") || q.includes("richa") || q.includes("akashdeep") || q.includes("triad")) {
      reply = "Routing to our core triad modules: Prakash (C11 JSCC Encoder), Richa (C++17 Neural Router), and Akashdeep (Martian Semantic Decoder).";
      targetRoute = "/mesh-network";
    } else if (q.includes("control") || q.includes("center") || q.includes("telemetry") || q.includes("hud") || q.includes("earth control")) {
      reply = "Connecting to the Multi-Agency Ground Operations and Telemetry Control Center.";
      targetRoute = "/control-center";
    } else if (q.includes("register") || q.includes("agency") || q.includes("join") || q.includes("onboard") || q.includes("asset")) {
      reply = "Opening the Inter-Agency Spacecraft Registration portal to assign an IPN node.";
      targetRoute = "/registration";
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply) reply = data.reply;
        if (data.route) targetRoute = data.route;
      }
    } catch (e) {
      if (!reply) {
        reply = `Vani received: "${trimmed}". Ask me about Vision, Mesh Network, or Agency Registration.`;
      }
    }

    if (!reply) {
      reply = `I am Vani, your Shivodaya flight navigator. How can I assist your deep space exploration?`;
    }

    setMessages((prev) => [...prev, { sender: "vani", text: reply, time: "Now" }]);
    speakText(reply);

    if (targetRoute) {
      setTimeout(() => {
        router.push(targetRoute);
      }, 1200);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    handleSendMessage(inputVal);
  };

  const navLinks = [
    { name: "Vision", href: "/vision" },
    { name: "Architecture", href: "/architecture" },
    { name: "Control Center", href: "/control-center" },
    { name: "Agency Registration", href: "/registration" },
  ];

  return (
    <>
      {/* ============================================================
          TOP NAVIGATION BAR (Clean & Minimalist)
          ============================================================ */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo & Tagline */}
          <Link href="/" className="flex items-center gap-3 group">
            <span className="font-sans font-black text-lg sm:text-xl tracking-[0.2em] text-white group-hover:text-cyan-400 transition-colors">
              SHIVODAYA
            </span>
            <span className="hidden lg:inline-block text-[10px] tracking-widest text-zinc-400 uppercase border-l border-white/20 pl-3">
              Deep Space Neural Mesh
            </span>
          </Link>

          {/* Fixed Navbar Spacing with gap-8 */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-sans tracking-wide">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`transition-colors duration-200 py-1 ${
                    isActive
                      ? "text-white font-semibold border-b-2 border-cyan-400 text-shadow-sm"
                      : "text-zinc-300 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            
            {/* Vani AI Status Indicator in Navbar */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(true);
                if (voiceEnabled) {
                  speakText(initialGreeting);
                }
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/15 hover:bg-cyan-500/30 border border-cyan-400/40 hover:border-cyan-400 text-xs tracking-wider uppercase text-cyan-300 hover:text-white transition-all font-sans font-medium cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.2)] active:scale-95"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Vani AI</span>
            </button>

            {/* Join Mesh CTA */}
            <Link
              href="/registration"
              className="hidden sm:inline-flex px-5 py-2 rounded-full border border-white/30 hover:border-white text-xs tracking-wider uppercase text-white hover:bg-white hover:text-black transition-all duration-300 font-sans font-medium"
            >
              Join Mesh
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition"
              aria-label="Toggle Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Nav Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-zinc-950/95 border-b border-white/10 px-6 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm text-zinc-300 hover:text-white py-1.5"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-2 border-t border-white/10 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-xs uppercase tracking-wider font-semibold"
              >
                <Mic className="w-3.5 h-3.5" />
                Launch Vani AI
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ============================================================
          VANI AI CINEMATIC GLASSMORPHISM HUD OVERLAY (AUTO-POP ON SCROLL)
          ============================================================ */}
      {isOpen && (
        <div className="fixed inset-0 z-[999999] flex items-end sm:items-center justify-end p-4 sm:p-8 font-sans bg-black/40 backdrop-blur-sm transition-all duration-300 pointer-events-none">
          
          {/* Futuristic Modal Card */}
          <div className="pointer-events-auto w-full sm:w-[450px] rounded-3xl bg-zinc-950/95 border border-cyan-500/40 backdrop-blur-3xl shadow-[0_0_90px_rgba(0,0,0,0.95),0_0_40px_rgba(0,240,255,0.25)] p-6 text-white flex flex-col max-h-[85vh] animate-in fade-in slide-in-from-bottom-6 duration-300">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              
              {/* Luminous Glowing Avatar / Holographic Core */}
              <div className="flex items-center gap-3.5">
                <div className="relative flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500/30 via-indigo-500/20 to-purple-500/30 border border-cyan-400/60 flex items-center justify-center text-cyan-300 shadow-[0_0_25px_rgba(0,240,255,0.5)]">
                    <Sparkles className="w-4 h-4 animate-spin-slow text-cyan-300" />
                  </div>
                  {isListening && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full animate-ping" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold tracking-[0.2em] text-white uppercase flex items-center gap-2">
                    <span>VANI AI</span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 uppercase tracking-widest font-mono">
                      Neural Uplink
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400 font-light">
                    {isListening
                      ? "Listening to voice stream..."
                      : isSpeaking
                      ? "Transmitting soothing audio..."
                      : "Deep Space Flight Navigator"}
                  </div>
                </div>
              </div>

              {/* Header Controls: Voice Toggle & Close (X) */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    if (voiceEnabled && typeof window !== "undefined" && "speechSynthesis" in window) {
                      window.speechSynthesis.cancel();
                    }
                    setVoiceEnabled(!voiceEnabled);
                  }}
                  className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                  title={voiceEnabled ? "Mute Speech" : "Unmute Speech"}
                >
                  {voiceEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    stopListening();
                    if (typeof window !== "undefined" && "speechSynthesis" in window) {
                      window.speechSynthesis.cancel();
                    }
                    setIsOpen(false);
                  }}
                  className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                  aria-label="Close Vani Modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Audio Waveform Resonance Equalizer */}
            <div className="py-2.5 px-3.5 my-2.5 rounded-2xl bg-zinc-900/90 border border-white/10 flex items-center justify-between shadow-inner">
              <div className="flex items-center gap-2">
                <Radio className={`w-3.5 h-3.5 ${isListening ? "text-red-400 animate-pulse" : isSpeaking ? "text-cyan-400 animate-pulse" : "text-zinc-500"}`} />
                <span className="text-[10px] font-mono tracking-widest text-zinc-300 uppercase">
                  {isListening ? "VOICE RECOGNITION ACTIVE" : isSpeaking ? "ACOUSTIC BASS TRANSMISSION" : "SYSTEM MONITORING"}
                </span>
              </div>

              {/* Dynamic Equalizer Bars */}
              <div className="flex items-center gap-1 h-5">
                <span className={`w-1 bg-cyan-400 rounded-full transition-all duration-200 ${isListening || isSpeaking ? "animate-pulse h-4 shadow-[0_0_8px_rgba(0,240,255,0.8)]" : "h-2 opacity-40"}`} />
                <span className={`w-1 bg-cyan-300 rounded-full transition-all duration-200 ${isListening || isSpeaking ? "animate-bounce h-5 shadow-[0_0_8px_rgba(0,240,255,0.8)]" : "h-3 opacity-40"}`} />
                <span className={`w-1 bg-indigo-400 rounded-full transition-all duration-200 ${isListening || isSpeaking ? "animate-pulse h-3.5 shadow-[0_0_8px_rgba(99,102,241,0.8)]" : "h-2 opacity-40"}`} />
                <span className={`w-1 bg-cyan-200 rounded-full transition-all duration-200 ${isListening || isSpeaking ? "animate-bounce h-4.5 shadow-[0_0_8px_rgba(0,240,255,0.8)]" : "h-2.5 opacity-40"}`} />
              </div>
            </div>

            {/* Messages Stream */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-60 min-h-[160px] my-1 scrollbar-thin">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`text-xs leading-relaxed p-3.5 rounded-2xl ${
                    m.sender === "vani"
                      ? "bg-zinc-900/90 border border-white/10 text-zinc-200 shadow-md"
                      : "bg-cyan-500 text-black font-semibold ml-auto max-w-[85%] shadow-lg"
                  }`}
                >
                  {m.text}
                </div>
              ))}

              {/* Live Transcript Bubble */}
              {liveTranscript && (
                <div className="p-3 rounded-2xl bg-cyan-950/60 border border-cyan-400/40 text-xs text-cyan-200 animate-pulse">
                  <span className="font-semibold text-cyan-400 mr-1.5">Hearing:</span>
                  {liveTranscript}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Status / Microphone Warning Banner */}
            {micStatusText && (
              <div className="my-1.5 p-2 rounded-xl bg-amber-950/40 border border-amber-500/30 text-[11px] text-amber-300 flex items-center justify-between">
                <span>{micStatusText}</span>
                <button
                  type="button"
                  onClick={() => setMicStatusText("")}
                  className="text-amber-400 hover:text-white text-xs px-1"
                >
                  ×
                </button>
              </div>
            )}

            {/* Quick Prompt Suggestions */}
            <div className="grid grid-cols-2 gap-1.5 pt-2.5 border-t border-white/10 text-[11px]">
              <button
                type="button"
                onClick={() => handleSendMessage("Explain the Prakash, Richa, and Akashdeep triad")}
                className="px-2.5 py-1.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 text-left text-zinc-300 hover:text-white transition truncate cursor-pointer"
              >
                🛰️ Mesh Triad Info
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage("How do I register our agency?")}
                className="px-2.5 py-1.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 text-left text-zinc-300 hover:text-white transition truncate cursor-pointer"
              >
                🚀 Register Node
              </button>
            </div>

            {/* Input Form with Text Box and Mic Button */}
            <form onSubmit={handleFormSubmit} className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isListening
                    ? "bg-red-500 text-white animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.7)] border-red-400"
                    : "bg-zinc-900 border-white/15 text-cyan-400 hover:bg-zinc-800 hover:border-cyan-400"
                }`}
                title={isListening ? "Stop Listening" : "Click to Speak"}
                aria-label="Microphone"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={isListening ? "Listening... speak into mic" : "Ask Vani or type a command..."}
                className="flex-1 bg-zinc-900/90 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition"
                autoFocus
              />

              <button
                type="submit"
                disabled={!inputVal.trim()}
                className="p-2.5 rounded-xl bg-white text-black font-semibold hover:bg-cyan-300 disabled:opacity-40 disabled:hover:bg-white transition cursor-pointer"
                aria-label="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>
        </div>
      )}
    </>
  );
}





