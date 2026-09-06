"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Volume2, VolumeX, X, Sparkles, Send } from "lucide-react";
import { useRouter } from "next/navigation";

export default function VaniVoiceAssistant() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [inputVal, setInputVal] = useState("");

  const [messages, setMessages] = useState([
    {
      sender: "vani",
      text: "Hello! I am Vani, navigator for Project Shivodaya. How can I guide you today?"
    }
  ]);

  const recognitionRef = useRef(null);

  useEffect(() => {
    setMounted(true);

    // Initialize Web Speech Recognition
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onstart = () => {
          setIsListening(true);
          setTranscript("Listening...");
        };

        recognition.onresult = (event) => {
          const text = Array.from(event.results)
            .map(result => result[0].transcript)
            .join("");
          setTranscript(text);
          if (event.results[0].isFinal) {
            handleSendMessage(text);
          }
        };

        recognition.onerror = (e) => {
          console.warn("Speech recognition error:", e);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }

    // Global listener for opening Vani from navbar or page buttons
    window.openVani = (prompt) => {
      setIsOpen(true);
      if (prompt) {
        handleSendMessage(prompt);
      } else {
        speakAudio("Welcome to Shivodaya, I am Vani. How can I navigate you today?");
      }
    };

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
      }
    };
  }, []);

  // 1. Web Speech Synthesis for Audio Playback
  const speakAudio = (text) => {
    if (!voiceEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.05;

      const voices = window.speechSynthesis.getVoices();
      const naturalVoice = voices.find(v => 
        v.lang.startsWith("en") && 
        (v.name.includes("Samantha") || v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Female") || v.name.includes("Siri"))
      );
      if (naturalVoice) utterance.voice = naturalVoice;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn("SpeechSynthesis error:", err);
      setIsSpeaking(false);
    }
  };

  // 2. Async function that sends user transcript to /api/chat
  const handleSendMessage = async (userText) => {
    if (!userText || !userText.trim()) return;

    const trimmed = userText.trim();
    setMessages(prev => [...prev, { sender: "user", text: trimmed }]);
    setTranscript("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed })
      });

      const data = await res.json();
      const reply = data.reply || "Transmission received.";
      
      setMessages(prev => [...prev, { sender: "vani", text: reply }]);
      speakAudio(reply);

      // Route if JSON command provided
      if (data.route) {
        setTimeout(() => {
          router.push(data.route);
        }, 1200);
      }
    } catch (e) {
      const errorMsg = "Relay offline. Could not reach flight intelligence.";
      setMessages(prev => [...prev, { sender: "vani", text: errorMsg }]);
      speakAudio(errorMsg);
    }
  };

  // 3. Toggle Microphone Listening
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    if (isListening) {
      try { recognitionRef.current.stop(); } catch (e) {}
      setIsListening(false);
    } else {
      setIsOpen(true);
      try {
        recognitionRef.current.start();
      } catch (e) {
        try {
          recognitionRef.current.stop();
          setTimeout(() => recognitionRef.current.start(), 100);
        } catch (err) {}
      }
    }
  };

  const handleManualForm = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    handleSendMessage(inputVal);
    setInputVal("");
  };

  if (!mounted) return null;

  return (
    <aside aria-label="Vani AI Voice Assistant" className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[999999] flex flex-col items-end pointer-events-auto font-sans">
      
      {/* CHAT / VOICE DIALOG MODAL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25 }}
            className="mb-4 w-[90vw] sm:w-[380px] rounded-3xl bg-zinc-950/95 border border-white/20 backdrop-blur-2xl shadow-[0_0_60px_rgba(0,0,0,0.9)] p-5 overflow-hidden text-white"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-bold tracking-wider text-white uppercase">
                    Vani • Space Navigator
                  </div>
                  <div className="text-[10px] text-zinc-400">
                    {isListening ? "Listening to mic..." : isSpeaking ? "Speaking..." : "Ready"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition"
                  title={voiceEnabled ? "Mute Voice" : "Enable Voice"}
                >
                  {voiceEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Conversation Messages Stream */}
            <div className="my-3 space-y-2.5 max-h-52 overflow-y-auto pr-1">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`text-xs leading-relaxed p-3 rounded-2xl ${
                    m.sender === "vani"
                      ? "bg-zinc-900 border border-white/10 text-zinc-200"
                      : "bg-white text-black font-semibold ml-auto max-w-[80%]"
                  }`}
                >
                  {m.text}
                </div>
              ))}

              {/* Waveform while speaking */}
              {isSpeaking && (
                <div className="flex items-center gap-1 text-[11px] text-cyan-300 py-1 pl-1">
                  <motion.span animate={{ scaleY: [0.3, 1.4, 0.3] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 h-3 bg-cyan-400 rounded-full" />
                  <motion.span animate={{ scaleY: [0.4, 1.8, 0.4] }} transition={{ repeat: Infinity, duration: 0.9, delay: 0.1 }} className="w-1 h-4 bg-cyan-400 rounded-full" />
                  <motion.span animate={{ scaleY: [0.2, 1.2, 0.2] }} transition={{ repeat: Infinity, duration: 0.7, delay: 0.2 }} className="w-1 h-3 bg-cyan-400 rounded-full" />
                  <motion.span animate={{ scaleY: [0.5, 1.6, 0.5] }} transition={{ repeat: Infinity, duration: 0.85, delay: 0.15 }} className="w-1 h-4 bg-cyan-400 rounded-full" />
                  <span className="ml-1 text-[10px] text-zinc-400">Vani is speaking...</span>
                </div>
              )}

              {/* Live transcript indicator */}
              {isListening && (
                <div className="text-xs text-emerald-400 animate-pulse italic bg-emerald-950/40 p-2 rounded-xl border border-emerald-500/30">
                  {transcript || "Listening to your voice..."}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-white/10 text-[11px]">
              <button
                type="button"
                onClick={() => handleSendMessage("Show me the mesh network and models")}
                className="px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-left text-zinc-300 hover:text-white transition"
              >
                🛰️ Show Mesh
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage("How do I register our agency?")}
                className="px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-left text-zinc-300 hover:text-white transition"
              >
                🚀 Register Node
              </button>
            </div>

            {/* Text Input fallback */}
            <form onSubmit={handleManualForm} className="mt-2.5 flex gap-2">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Type or use microphone..."
                className="flex-1 bg-zinc-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. FRAMER MOTION FLOATING BUTTON WITH GLOWING RING & WAVEFORM */}
      <div className="relative flex items-center justify-center">
        
        {/* Glowing CSS Ring while Listening */}
        {isListening && (
          <motion.div
            animate={{
              scale: [1, 1.35, 1],
              opacity: [0.8, 0.2, 0.8],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -inset-2.5 rounded-full border-2 border-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.8)] pointer-events-none"
          />
        )}

        {/* Floating Button */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={toggleListening}
          className={`relative z-10 flex items-center gap-3 px-5 py-3.5 rounded-full border-2 transition-all duration-300 shadow-2xl backdrop-blur-2xl ${
            isListening
              ? "bg-cyan-950 border-cyan-400 text-cyan-200 shadow-[0_0_30px_rgba(0,240,255,0.7)]"
              : "bg-zinc-950 border-white/40 hover:border-white text-white shadow-[0_0_25px_rgba(255,255,255,0.15)]"
          }`}
        >
          {/* Microphone / Waveform Icon */}
          <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center border border-white/20">
            {isSpeaking ? (
              /* Waveform while speaking */
              <div className="flex items-center gap-0.5 h-4">
                <motion.span animate={{ scaleY: [0.3, 1.4, 0.3] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-0.5 h-3 bg-cyan-400 rounded-full" />
                <motion.span animate={{ scaleY: [0.4, 1.8, 0.4] }} transition={{ repeat: Infinity, duration: 0.7, delay: 0.1 }} className="w-0.5 h-4 bg-cyan-400 rounded-full" />
                <motion.span animate={{ scaleY: [0.2, 1.2, 0.2] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }} className="w-0.5 h-3 bg-cyan-400 rounded-full" />
              </div>
            ) : (
              <Mic className={`w-4 h-4 ${isListening ? "text-cyan-400 animate-pulse" : "text-white"}`} />
            )}
          </div>

          <div className="flex flex-col text-left pr-1">
            <span className="text-xs font-bold tracking-wide text-white flex items-center gap-1.5">
              <span>Vani Assistant</span>
              <span className={`w-2 h-2 rounded-full ${isListening ? "bg-cyan-400 animate-ping" : "bg-emerald-400"}`}></span>
            </span>
            <span className="text-[10px] text-zinc-400">
              {isListening ? "Listening... (Speak now)" : isSpeaking ? "Speaking..." : "Tap to Speak"}
            </span>
          </div>
        </motion.button>

      </div>

    </aside>
  );
}
