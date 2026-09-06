"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring,
  AnimatePresence
} from "framer-motion";
import { 
  ArrowRight, 
  Volume2, 
  VolumeX, 
  ChevronDown,
  Radio,
  ShieldAlert,
  Wifi,
  WifiOff,
  Share2,
  Cpu,
  Layers,
  Sparkles,
  Users,
  Compass,
  AlertTriangle,
  RefreshCw,
  CheckCircle2
} from "lucide-react";

// ============================================================
// 1. FILM GRAIN OVERLAY (Subtle 35mm Analog Cinematic Texture)
// ============================================================
function FilmGrain() {
  return (
    <div 
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-30 opacity-[0.022] mix-blend-overlay"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
      }}
    />
  );
}

// ============================================================
// 2. AMBIENT BACKGROUND ENGINE (Deep Space Horizon Progression)
// Rich, luminous, clearly visible deep-space textures with soft atmospheric shifts
// ============================================================
function AmbientBackground({ scrollYProgress }) {
  // Layer 1: Cosmic Nebula (0% -> 20%)
  // Pristine, unreduced complete image at start (0 blur, full opacity). Blurs dynamically as user scrolls down!
  const bg1Opacity = useTransform(scrollYProgress, [0, 0.12, 0.22], [1, 0.9, 0], { clamp: true });
  const bg1BlurPx = useTransform(scrollYProgress, [0, 0.06, 0.16], [0, 6, 18]);
  const bg1Filter = useTransform(bg1BlurPx, (px) => `brightness(1.02) contrast(1.08) blur(${px}px)`);
  
  // Layer 2: Deep Space Void & Stars (Deep Space 4) (14% -> 38%)
  const bg2Opacity = useTransform(scrollYProgress, [0.12, 0.22, 0.35, 0.42], [0, 0.85, 0.85, 0], { clamp: true });
  
  // Layer 3: Deep Space 6 (deepspace6.jpg) - Replaces repeated sun background!
  // Strictly WITHOUT BLUR, crystal clear & highly visible for "The Network Grows With Us" & living mesh
  const bg3Opacity = useTransform(scrollYProgress, [0.34, 0.42, 0.60, 0.68], [0, 0.95, 0.95, 0], { clamp: true });
  
  // Layer 4: Deep Space Filaments & Mesh (Deep Space 5) (58% -> 78%)
  const bg4Opacity = useTransform(scrollYProgress, [0.58, 0.66, 0.76, 0.82], [0, 0.9, 0.9, 0], { clamp: true });

  // Layer 5: Expansive Golden Dawn & Beyond (Golden Sunrise) (76% -> 100%)
  const bg5Opacity = useTransform(scrollYProgress, [0.76, 0.88], [0, 0.95], { clamp: true });

  // Subtle atmospheric wash: transparent at start so cosmic nebula is 100% pristine and unreduced!
  const atmosphericWash = useTransform(
    scrollYProgress,
    [0, 0.25, 0.45, 0.70, 0.90, 1.0],
    [
      "radial-gradient(ellipse at 50% 25%, rgba(0,0,0,0.05) 0%, rgba(3,4,8,0.25) 85%)",
      "radial-gradient(ellipse at 50% 40%, rgba(16,20,38,0.25) 0%, rgba(4,5,10,0.65) 85%)",
      "radial-gradient(ellipse at 50% 50%, rgba(20,24,42,0.2) 0%, rgba(4,5,10,0.6) 80%)",
      "radial-gradient(ellipse at 50% 60%, rgba(22,28,52,0.25) 0%, rgba(5,6,12,0.68) 80%)",
      "radial-gradient(ellipse at 50% 75%, rgba(80,45,18,0.32) 0%, rgba(12,8,6,0.68) 75%)",
      "radial-gradient(ellipse at 50% 85%, rgba(120,65,22,0.38) 0%, rgba(16,10,6,0.7) 75%)"
    ]
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#030408]">
      
      {/* Dynamic Luminous Atmosphere */}
      <motion.div 
        className="absolute inset-0 z-10 will-change-[background]"
        style={{ background: atmosphericWash }}
      />

      {/* Layer 1: Cosmic Nebula (Complete, unreduced image at start; blurs on scroll down) */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center will-change-[opacity,filter]"
        style={{
          opacity: bg1Opacity,
          filter: bg1Filter,
          backgroundImage: "url('/images/vision/cosmic_nebula_4k.jpg')",
        }}
      />

      {/* Layer 2: Deep Space Void & Stars (deepspace4.jpg) */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center will-change-[opacity]"
        style={{
          opacity: bg2Opacity,
          backgroundImage: "url('/images/vision/deepspace4.jpg')",
          filter: "brightness(0.95) contrast(1.15)",
        }}
      />

      {/* Layer 3: Deep Space 6 (deepspace6.jpg) - Visible & Unblurred for The Network Grows With Us */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center will-change-[opacity]"
        style={{
          opacity: bg3Opacity,
          backgroundImage: "url('/images/vision/deepspace6.jpg')",
          filter: "brightness(1.1) contrast(1.18)", // strictly NO blur as requested
        }}
      />

      {/* Layer 4: Deep Space Filaments & Mesh (deepspace5.jpg) */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center will-change-[opacity]"
        style={{
          opacity: bg4Opacity,
          backgroundImage: "url('/images/vision/deepspace5.jpg')",
          filter: "brightness(0.95) contrast(1.15)",
        }}
      />

      {/* Layer 5: Golden Sunrise Beyond (golden_sunrise.jpg) */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center will-change-[opacity]"
        style={{
          opacity: bg5Opacity,
          backgroundImage: "url('/images/vision/golden_sunrise.jpg')",
          filter: "brightness(1.05) contrast(1.1)",
        }}
      />

      {/* Soft Horizon Ambient Light Flare */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[140vw] h-[40vh] bg-gradient-to-t from-amber-500/10 via-transparent to-transparent blur-[120px] pointer-events-none z-15" />

      {/* Subtle Text Contrast Protector - soft gradient preserving star and nebula visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/25 z-20" />
    </div>
  );
}

// ============================================================
// 3. PERSISTENT AUDIO CONTROLLER (Ludovico Einaudi - Experience)
// ============================================================
function AudioController({ scrollYProgress }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const START_TIMESTAMP = 30.0; // Skips soft solo piano intro and starts suddenly at the main rhythmic swell

  // Dynamic volume following narrative curve:
  // Starts bold (0.20), lifts during threat (0.24), builds during mesh (0.28), climax (0.34), gentle finish
  const targetVolume = useTransform(
    scrollYProgress,
    [0, 0.15, 0.40, 0.65, 0.88, 1.0],
    [0.20, 0.22, 0.26, 0.30, 0.34, 0.12]
  );

  useEffect(() => {
    const unsubscribe = targetVolume.on("change", (latest) => {
      if (audioRef.current && isPlaying) {
        audioRef.current.volume = Math.max(0.08, Math.min(0.40, latest));
      }
    });
    return () => unsubscribe();
  }, [isPlaying, targetVolume]);

  const handleLoadedMetadata = () => {
    if (audioRef.current && audioRef.current.currentTime < START_TIMESTAMP) {
      audioRef.current.currentTime = START_TIMESTAMP;
    }
  };

  const handleEnded = () => {
    // Loop directly back to 30s instead of the soft intro
    if (audioRef.current) {
      audioRef.current.currentTime = START_TIMESTAMP;
      audioRef.current.play().catch(() => {});
    }
  };

  const handleTimeUpdate = () => {
    // Guard against any accidental reset below 30s
    if (audioRef.current && isPlaying && audioRef.current.currentTime < START_TIMESTAMP - 0.5) {
      audioRef.current.currentTime = START_TIMESTAMP;
    }
  };

  const [hasInteracted, setHasInteracted] = useState(false);

  const toggleSound = () => {
    setHasInteracted(true);
    if (!audioRef.current) return;

    if (isPlaying) {
      let v = audioRef.current.volume;
      const fadeInterval = setInterval(() => {
        v = Math.max(0, v - 0.05);
        if (audioRef.current) audioRef.current.volume = v;
        if (v <= 0) {
          clearInterval(fadeInterval);
          audioRef.current?.pause();
          setIsPlaying(false);
        }
      }, 30);
    } else {
      const currentScrollVal = targetVolume.get();
      
      // Snap directly to 30s so the soft intro is removed
      if (audioRef.current.currentTime < START_TIMESTAMP) {
        audioRef.current.currentTime = START_TIMESTAMP;
      }
      
      // Set volume immediately to full presence so it starts suddenly with impact
      const startVol = Math.max(0.20, currentScrollVal);
      audioRef.current.volume = startVol;
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.warn("Audio playback blocked or interrupted:", err);
          });
      }
    }
  };

  return (
    <>
      <audio 
        ref={audioRef} 
        src="/audio/vision.mp3#t=30" 
        preload="auto" 
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onTimeUpdate={handleTimeUpdate}
      />

      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="fixed top-4 right-4 sm:right-8 z-50 pointer-events-auto"
      >
        <button
          onClick={toggleSound}
          aria-label={isPlaying ? "Mute soundtrack" : "Enable soundtrack"}
          className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all duration-300 text-[10px] tracking-wider uppercase font-mono backdrop-blur-md ${
            isPlaying 
              ? "bg-amber-500/10 border-amber-400/40 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.15)]" 
              : "bg-black/40 border-amber-400/20 text-amber-200/70 hover:text-amber-200 hover:border-amber-400/40 hover:bg-black/60"
          }`}
        >
          {isPlaying && (
            <span className="flex items-center gap-[1.5px] h-2.5">
              <span className="w-[1.5px] h-1.5 bg-amber-400 animate-pulse rounded-full" />
              <span className="w-[1.5px] h-2.5 bg-amber-300 animate-pulse rounded-full delay-75" />
              <span className="w-[1.5px] h-2 bg-amber-400 animate-pulse rounded-full delay-150" />
            </span>
          )}
          <span className="font-semibold">
            {isPlaying ? "♫ SOUND ON" : hasInteracted ? "♫ SOUND OFF" : "♫ SOUND"}
          </span>
        </button>
      </motion.div>
    </>
  );
}

// ============================================================
// 4. TOP SCROLL PROGRESS INDICATOR
// ============================================================
function ScrollProgressIndicator({ scrollYProgress }) {
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400/40 via-amber-400 to-amber-200 origin-left z-50 pointer-events-none"
      style={{ scaleX }}
    />
  );
}

// ============================================================
// 5. NAVBAR
// ============================================================
function VisionNavbar() {
  return (
    <header className="fixed top-0 left-0 w-full h-16 z-40 flex items-center justify-between px-6 sm:px-10 pointer-events-none">
      <div className="flex items-center gap-4 pointer-events-auto">
        <Link 
          href="/" 
          className="text-sm sm:text-base font-bold tracking-[0.25em] text-white uppercase hover:text-amber-300 transition-colors drop-shadow-md"
        >
          SHIVODAYA
        </Link>
        <span className="hidden sm:inline-block text-[9px] tracking-[0.3em] text-zinc-400 font-mono border-l border-white/20 pl-3 uppercase">
          Civilizational Horizon
        </span>
      </div>

      <nav className="hidden md:flex items-center gap-8 text-[11px] font-medium tracking-[0.2em] uppercase text-zinc-300 pointer-events-auto backdrop-blur-md px-5 py-2 rounded-full bg-black/25 border border-white/10 mr-28 sm:mr-32">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span className="text-amber-300 border-b border-amber-400 pb-0.5 font-semibold">Vision</span>
        <Link href="/architecture" className="hover:text-white transition-colors">Architecture</Link>
        <Link href="/control-center" className="hover:text-white transition-colors">Control Center</Link>
        <Link href="/registration" className="hover:text-white transition-colors">Registration</Link>
      </nav>
    </header>
  );
}

// ============================================================
// 6. HERO — HUMANITY BEYOND EARTH
// ============================================================
function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-between px-6 sm:px-12 md:px-20 pt-36 pb-16 max-w-7xl mx-auto z-20">
      
      {/* Tagline */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-3"
      >
        <span className="w-2 h-2 rounded-full bg-amber-400/90 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
        <span className="text-[10px] sm:text-xs font-mono tracking-[0.4em] uppercase text-amber-200/90 font-semibold">
          OUR VISION // CIVILIZATIONAL HORIZON
        </span>
      </motion.div>

      {/* Monumental Hero Headline */}
      <div className="my-auto py-8 max-w-6xl">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl sm:text-8xl md:text-9xl lg:text-[9.5rem] font-black tracking-[-0.03em] uppercase leading-[0.9] text-white drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)]"
        >
          HUMANITY<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-amber-200 to-amber-400">
            BEYOND
          </span><br />
          EARTH.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 text-lg sm:text-2xl md:text-3xl font-light text-zinc-200 max-w-3xl leading-relaxed tracking-wide drop-shadow-md"
        >
          Building the network that will keep humanity connected as we go deeper into space.
        </motion.p>
      </div>

      {/* Subtext & Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.8 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-zinc-400 text-[10px] tracking-[0.3em] font-mono uppercase border-t border-white/15 pt-6"
      >
        <span className="text-zinc-300">Earth is our beginning. Space is our future. But going farther means staying connected.</span>
        <div className="flex items-center gap-2 text-amber-400 animate-bounce">
          <span>SCROLL TO EXPLORE</span>
          <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
        </div>
      </motion.div>
    </section>
  );
}

// ============================================================
// SECTION 01 — WE WANT TO GO FARTHER
// ============================================================
function Section01GoFarther() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 sm:px-12 md:px-20 max-w-6xl mx-auto z-20 py-32">
      <div className="space-y-12">
        
        <div className="space-y-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[10px] font-mono tracking-[0.35em] uppercase text-amber-400/90 font-semibold"
          >
            01 // THE OUTWARD JOURNEY
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="text-4xl sm:text-6xl md:text-7xl font-light text-white tracking-tight uppercase leading-tight drop-shadow-lg"
          >
            “WE WANT TO GO FARTHER.”
          </motion.h2>
        </div>

        {/* Visual Showcase Card with High-Definition Spacecraft Image */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4 }}
          className="relative rounded-3xl overflow-hidden border border-white/15 bg-black/40 backdrop-blur-xl shadow-2xl p-8 sm:p-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Spacecraft Visual */}
            <div className="lg:col-span-6 relative group overflow-hidden rounded-2xl border border-white/10">
              <div 
                className="w-full h-64 sm:h-80 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: "url('/images/vision/spaceship.webp')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] font-mono text-zinc-300 uppercase tracking-widest">
                <span>Deep Space Transit Vessel</span>
                <span className="text-amber-300">Trajectory: Interplanetary</span>
              </div>
            </div>

            {/* Narrative Copy */}
            <div className="lg:col-span-6 space-y-6">
              <p className="text-xl sm:text-2xl font-light text-zinc-100 leading-relaxed">
                Every generation reaches a little farther than the one before it.
              </p>
              <p className="text-base sm:text-lg text-zinc-300 font-light leading-relaxed">
                One day, humanity will travel deeper into space than ever before.
              </p>
              <div className="p-4 rounded-xl bg-white/[0.04] border-l-2 border-amber-400 text-sm text-amber-200 font-normal leading-relaxed">
                “But the farther we go, the harder it becomes to know what is happening out there.”
              </div>
            </div>

          </div>

          {/* Outward Progression Milestones */}
          <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono text-zinc-400">
            <div className="space-y-1">
              <span className="text-zinc-500 block text-[9px]">PHASE 01</span>
              <span className="text-white font-medium">Earth Orbit</span>
              <span className="block text-[10px] text-zinc-400">Latency: &lt; 0.5s</span>
            </div>
            <div className="space-y-1">
              <span className="text-zinc-500 block text-[9px]">PHASE 02</span>
              <span className="text-white font-medium">Cislunar & Moon</span>
              <span className="block text-[10px] text-zinc-400">Latency: ~1.3s</span>
            </div>
            <div className="space-y-1">
              <span className="text-zinc-500 block text-[9px]">PHASE 03</span>
              <span className="text-white font-medium">Lagrange Points</span>
              <span className="block text-[10px] text-zinc-400">Latency: ~5s - 15s</span>
            </div>
            <div className="space-y-1">
              <span className="text-amber-400 block text-[9px]">PHASE 04 (HORIZON)</span>
              <span className="text-amber-200 font-medium">Deep Space / Mars</span>
              <span className="block text-[10px] text-amber-300/80">Latency: 4m - 24m+</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

// ============================================================
// SECTION 02 — THE INVISIBLE THREAT (RADIATION)
// Authentic NASA Solar Dynamics Observatory Video Feature
// ============================================================
function Section02InvisibleThreat() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 sm:px-12 md:px-20 max-w-6xl mx-auto z-20 py-32">
      <div className="space-y-12">
        
        <div className="space-y-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[10px] font-mono tracking-[0.35em] uppercase text-amber-400/90 font-semibold"
          >
            02 // THE INVISIBLE THREAT
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="text-4xl sm:text-6xl md:text-7xl font-light text-white tracking-tight uppercase leading-tight"
          >
            “BUT SPACE HAS AN INVISIBLE THREAT.”
          </motion.h2>

          {/* Standout Single Word Impact */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="pt-2"
          >
            <span className="text-3xl sm:text-5xl md:text-6xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 drop-shadow-[0_0_30px_rgba(245,158,11,0.5)]">
              RADIATION.
            </span>
          </motion.div>
        </div>

        {/* Authentic NASA SDO Solar Flare Video Player Card */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4 }}
          className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-black/50 backdrop-blur-xl shadow-[0_0_50px_rgba(245,158,11,0.15)] p-6 sm:p-10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* NASA SDO Video Container */}
            <div className="lg:col-span-7 relative rounded-2xl overflow-hidden border border-amber-400/20 bg-black aspect-video flex items-center justify-center group">
              <video
                src="/videos/sun_radiation.mp4"
                poster="/images/vision/sun.jpg"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 border border-amber-400/40 text-[9px] font-mono uppercase tracking-widest text-amber-300 backdrop-blur-md flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                NASA SDO // Active Solar Flare & Coronal Mass Ejection
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[9px] font-mono text-zinc-400">
                <span>Solar Energetic Particle (SEP) Horizon</span>
                <span className="text-amber-300">Field: Omnidirectional</span>
              </div>
            </div>

            {/* Narrative Explanation */}
            <div className="lg:col-span-5 space-y-5">
              <p className="text-lg sm:text-xl font-light text-zinc-100 leading-relaxed">
                We cannot see it.
              </p>
              <p className="text-lg sm:text-xl font-light text-zinc-100 leading-relaxed">
                We cannot simply switch it off.
              </p>
              <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed">
                But when dangerous radiation reaches a mission, the mission needs to know.
              </p>
              
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-amber-100 space-y-2">
                <div className="text-xs font-mono uppercase tracking-widest text-amber-300 font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  The Immutable Law
                </div>
                <p className="text-sm sm:text-base font-medium text-amber-100 leading-relaxed">
                  “We cannot stop the radiation.<br />
                  <span className="text-white font-bold">But we can warn the mission.”</span>
                </p>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}

// ============================================================
// SECTION 03 — THE WARNING
// ============================================================
function Section03TheWarning() {
  const [activeStep, setActiveStep] = useState(0);

  const narrativeBeats = [
    {
      title: "A mission detects danger.",
      subtext: "An on-board sensor in deep space registers a dangerous solar particle surge.",
      pulseX: 0,
      elapsed: "+00:00",
    },
    {
      title: "A warning is created.",
      subtext: "A lightweight alert signal is formulated, carrying vital radiation vectors into the dark.",
      pulseX: 8,
      elapsed: "+00:02",
    },
    {
      title: "The warning has to travel.",
      subtext: "The light pulse begins its journey across the empty void along the direct line of sight.",
      pulseX: 38,
      elapsed: "+09:15",
    },
    {
      title: "The mission is very far away.",
      subtext: "Tens of millions of kilometers of silent vacuum separate the forward sentry from the crew.",
      pulseX: 68,
      elapsed: "+18:40",
    },
    {
      title: "Time passes.",
      subtext: "The signal takes time to arrive. Every elapsed second reduces the available operational response buffer.",
      pulseX: 96,
      elapsed: "+26:10",
    },
  ];

  // Elegant slow auto-advance through the cinematic sequence
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % narrativeBeats.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [narrativeBeats.length]);

  const currentBeat = narrativeBeats[activeStep];

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 sm:px-12 md:px-20 max-w-6xl mx-auto z-20 py-32">
      <div className="space-y-12">
        
        {/* Section Header */}
        <div className="space-y-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[10px] font-mono tracking-[0.35em] uppercase text-amber-400/90 font-semibold"
          >
            03 // CRITICAL TIMING
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="text-3xl sm:text-5xl md:text-6xl font-light text-white tracking-tight uppercase leading-tight"
          >
            “A WARNING IS ONLY USEFUL<br />
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-white">
              IF IT ARRIVES IN TIME.”
            </span>
          </motion.h2>
        </div>

        {/* Cinematic Narrative Text Reveal */}
        <div className="min-h-[85px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBeat.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-2"
            >
              <h3 className="text-2xl sm:text-4xl md:text-5xl font-light text-white tracking-tight">
                {currentBeat.title}
              </h3>
              <p className="text-sm sm:text-base text-zinc-400 font-light max-w-2xl leading-relaxed">
                {currentBeat.subtext}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Continuous Cinematic Visual Event */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="relative rounded-3xl bg-black/40 border border-white/10 backdrop-blur-xl p-8 sm:p-12 md:p-14 overflow-hidden space-y-12"
        >
          {/* Subtle cosmic background depth */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_50%,rgba(245,158,11,0.06),transparent_50%),radial-gradient(circle_at_85%_50%,rgba(56,189,248,0.04),transparent_50%)] pointer-events-none" />
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(1px_1px_at_30px_40px,#fff,transparent),radial-gradient(1px_1px_at_160px_120px,#fff,transparent),radial-gradient(1.5px_1.5px_at_320px_200px,#fff,transparent),radial-gradient(1px_1px_at_520px_80px,#fff,transparent),radial-gradient(1px_1px_at_780px_160px,#fff,transparent)]" />

          {/* Deep Space Visualization Stage */}
          <div className="relative py-12 sm:py-16">
            
            {/* The Slender Communication Vector Line */}
            <div className="absolute top-1/2 left-[10%] right-[10%] h-[1px] -translate-y-1/2 bg-gradient-to-r from-amber-400/30 via-white/15 to-cyan-400/30" />
            
            {/* Subtle distance hash ticks along the void */}
            <div className="absolute top-1/2 left-[10%] right-[10%] -translate-y-1/2 flex justify-between pointer-events-none opacity-20">
              <span className="h-2 w-[1px] bg-white -mt-1" />
              <span className="h-2 w-[1px] bg-white -mt-1" />
              <span className="h-2 w-[1px] bg-white -mt-1" />
              <span className="h-2 w-[1px] bg-white -mt-1" />
              <span className="h-2 w-[1px] bg-white -mt-1" />
            </div>

            {/* Left Node: Sentry Spacecraft */}
            <div className="absolute left-[6%] sm:left-[8%] top-1/2 -translate-y-1/2 flex flex-col items-center gap-3 z-10">
              <div className="relative flex items-center justify-center">
                {/* Radiation event shockwave ripple */}
                <AnimatePresence>
                  {activeStep >= 0 && (
                    <motion.div
                      key={`ripple-${activeStep}`}
                      initial={{ scale: 0.8, opacity: 0.9 }}
                      animate={{ scale: 2.8, opacity: 0 }}
                      transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut" }}
                      className="absolute w-12 h-12 rounded-full border border-amber-400/60 bg-amber-500/10 pointer-events-none"
                    />
                  )}
                </AnimatePresence>

                {/* Spacecraft icon */}
                <div className="w-12 h-12 rounded-full border border-amber-400/40 bg-black/80 flex items-center justify-center text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
                  <Radio className="w-5 h-5 text-amber-300 animate-pulse" />
                </div>
              </div>

              <div className="text-center">
                <span className="text-[10px] font-mono tracking-widest uppercase text-amber-300 font-semibold block">
                  MISSION
                </span>
                <span className="text-[9px] font-mono text-zinc-500 uppercase">
                  Sentry Node
                </span>
              </div>
            </div>

            {/* Center: Distance and Time Indicators */}
            <div className="flex flex-col items-center justify-center py-8 pointer-events-none text-center relative z-10">
              <motion.span 
                animate={{ opacity: activeStep >= 2 ? 0.9 : 0.3 }}
                transition={{ duration: 0.8 }}
                className="text-[9px] sm:text-[10px] font-mono tracking-[0.3em] uppercase text-zinc-400"
              >
                INTERPLANETARY VOID // ~225,000,000 KM
              </motion.span>
              <div className="mt-2 px-3 py-1 rounded-full bg-black/60 border border-white/10 text-xs font-mono tracking-widest text-amber-300/90">
                TIME ELAPSED: <span className="font-bold text-amber-200">{currentBeat.elapsed}</span>
              </div>
            </div>

            {/* Right Node: Destination */}
            <div className="absolute right-[6%] sm:right-[8%] top-1/2 -translate-y-1/2 flex flex-col items-center gap-3 z-10">
              <div className="relative flex items-center justify-center">
                {/* Delayed arrival glow */}
                {activeStep === 4 && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: [1, 2], opacity: [0.8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                    className="absolute w-12 h-12 rounded-full border border-amber-400 bg-amber-400/20 pointer-events-none"
                  />
                )}

                <div className={`w-12 h-12 rounded-full border transition-all duration-700 bg-black/80 flex items-center justify-center ${
                  activeStep === 4 
                    ? "border-amber-400 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.4)]" 
                    : "border-white/20 text-zinc-400"
                }`}>
                  <Compass className="w-5 h-5" />
                </div>
              </div>

              <div className="text-center">
                <span className={`text-[10px] font-mono tracking-widest uppercase font-semibold block transition-colors ${
                  activeStep === 4 ? "text-amber-300" : "text-zinc-300"
                }`}>
                  DESTINATION
                </span>
                <span className="text-[9px] font-mono text-zinc-500 uppercase">
                  Crew Habitat
                </span>
              </div>
            </div>

            {/* The Traveling Warning Light Pulse */}
            <motion.div
              animate={{
                left: `${8 + (currentBeat.pulseX / 100) * 84}%`,
                opacity: activeStep === 0 ? 0.3 : 1
              }}
              transition={{ duration: 2.8, ease: [0.25, 1, 0.5, 1] }}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 pointer-events-none"
            >
              {/* Soft ambient aura */}
              <div className="w-8 h-8 -ml-3 -mt-3 rounded-full bg-amber-400/30 blur-sm animate-pulse" />
              {/* Core light bead */}
              <div className="absolute inset-0 m-auto w-3 h-3 rounded-full bg-amber-200 shadow-[0_0_14px_rgba(245,158,11,1)]" />
              {/* Subtle trailing motion trail */}
              {activeStep >= 1 && activeStep <= 3 && (
                <div className="absolute top-1/2 right-full h-[1.5px] w-14 -translate-y-1/2 bg-gradient-to-l from-amber-300/80 to-transparent pointer-events-none" />
              )}
            </motion.div>

          </div>

          {/* Minimal Story Progress Stepper */}
          <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-2 sm:gap-4">
            {narrativeBeats.map((beat, idx) => (
              <button
                key={beat.title}
                onClick={() => setActiveStep(idx)}
                className={`group flex-1 flex flex-col gap-2 text-left transition-all duration-300 ${
                  activeStep === idx ? "opacity-100" : "opacity-35 hover:opacity-75"
                }`}
              >
                <div className={`h-[2px] rounded-full transition-all duration-500 ${
                  activeStep === idx 
                    ? "bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]" 
                    : "bg-white/20"
                }`} />
                <span className="text-[9px] font-mono tracking-widest uppercase text-zinc-400 group-hover:text-zinc-200 hidden md:inline truncate">
                  0{idx + 1} // {beat.title.replace(/\.$/, "")}
                </span>
              </button>
            ))}
          </div>

        </motion.div>

        {/* Emotional Heart of the Problem */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="p-8 sm:p-10 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-xl"
        >
          <p className="text-xl sm:text-2xl md:text-3xl font-light text-zinc-100 leading-relaxed">
            “When a warning arrives late, a mission has less time to understand what happened and respond.”
          </p>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 font-light leading-relaxed max-w-3xl">
            In deep space, radiation gives no second chances. Every minute gained is a shelter sealed, an antenna safely feathered, or sensitive instrumentation shielded.
          </p>
        </motion.div>

        {/* Section Transition Bridge */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500 border-t border-white/5"
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="tracking-widest uppercase text-zinc-400">
              Single direct path is slow & vulnerable — there must be another way
            </span>
          </div>
          <span className="text-zinc-500 tracking-wider">
            Deep space changes the rules ↓
          </span>
        </motion.div>

      </div>
    </section>
  );
}

// ============================================================
// SECTION 04 — DEEP SPACE CHANGES THE RULES
// ============================================================
function Section04DeepSpaceRules() {
  const [isBroken, setIsBroken] = useState(true);

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 sm:px-12 md:px-20 max-w-6xl mx-auto z-20 py-32">
      <div className="space-y-12">
        
        <div className="space-y-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[10px] font-mono tracking-[0.35em] uppercase text-red-400/90 font-semibold"
          >
            04 // THE COMMUNICATION PROBLEM
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="text-4xl sm:text-6xl md:text-7xl font-light text-white tracking-tight uppercase leading-tight"
          >
            “DEEP SPACE CHANGES THE RULES.”
          </motion.h2>
        </div>

        {/* Visual Demonstration of Interrupted Path */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4 }}
          className="p-8 sm:p-12 rounded-3xl bg-black/30 border border-white/15 backdrop-blur-md relative overflow-hidden shadow-2xl space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm font-light text-zinc-300 leading-relaxed">
            <div className="p-4 rounded-xl bg-white/[0.03] border-l border-white/20">
              Messages have a long way to travel.
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border-l border-white/20">
              Sometimes a communication path is unavailable. Sometimes a connection is interrupted.
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border-l border-red-400/60">
              Sometimes important information cannot take the path we expected.
            </div>
          </div>

          {/* Interactive Line-of-Sight Break Simulation */}
          <div className="py-8 px-6 rounded-2xl bg-black/60 border border-white/10 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isBroken ? "bg-red-500 animate-pulse" : "bg-emerald-400"}`} />
                <span className="uppercase tracking-wider text-zinc-300">
                  {isBroken ? "SINGLE POINT OF FAILURE: PATH SEVERED" : "LINE-OF-SIGHT CLEAR"}
                </span>
              </div>
              <button
                onClick={() => setIsBroken(!isBroken)}
                className="px-4 py-1.5 rounded-full border border-white/20 text-[10px] tracking-widest uppercase hover:bg-white/10 transition-colors"
              >
                {isBroken ? "Toggle Signal Test" : "Simulate Occultation"}
              </button>
            </div>

            {/* Path Graphic */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-full border border-amber-400/40 bg-black flex items-center justify-center font-mono font-bold text-amber-300 mx-auto">
                  SENTRY
                </div>
                <span className="text-[11px] font-mono text-zinc-400">Mission Sentry</span>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center px-4 w-full">
                <div className="w-full flex items-center justify-center relative">
                  <div className={`h-[2px] w-full ${isBroken ? "bg-gradient-to-r from-amber-400 via-red-500 to-zinc-700 dashed" : "bg-emerald-400"}`} />
                  {isBroken && (
                    <div className="absolute px-3 py-1 rounded-md bg-red-950/80 border border-red-500/60 text-[10px] font-mono text-red-300 uppercase tracking-widest">
                      Blocked by Solar Interference
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-mono text-zinc-500 mt-2">
                  {isBroken ? "Alert cannot transit single direct path" : "Signal transit normal"}
                </span>
              </div>

              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-full border border-white/20 bg-black flex items-center justify-center font-mono font-bold text-zinc-400 mx-auto">
                  DEST
                </div>
                <span className="text-[11px] font-mono text-zinc-400">Crew Vehicle</span>
              </div>
            </div>
          </div>

          <div className="pt-4 text-center sm:text-left">
            <p className="text-lg sm:text-xl font-light text-zinc-100">
              When that single link fails, the warning stops.<br />
              <span className="text-amber-300 font-semibold">This is where we need another way.</span>
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

// ============================================================
// SECTION 05 — WHAT IF A MISSION COULD WARN ANOTHER MISSION?
// ============================================================
function Section05WarnAnotherMission() {
  const [topologyMode, setTopologyMode] = useState("mesh");

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 sm:px-12 md:px-20 max-w-6xl mx-auto z-20 py-32">
      <div className="space-y-12">
        
        <div className="space-y-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[10px] font-mono tracking-[0.35em] uppercase text-amber-400/90 font-semibold"
          >
            05 // ARCHITECTURAL INTENT
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="text-3xl sm:text-5xl md:text-6xl font-light text-white tracking-tight uppercase leading-tight"
          >
            “WHAT IF A MISSION COULD<br />
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-white">
              WARN ANOTHER MISSION?”
            </span>
          </motion.h2>

          <p className="text-base sm:text-lg text-zinc-300 font-light leading-relaxed">
            Why should a spacecraft tens of millions of kilometers away wait for an alert to travel all the way back to Earth, through processing queues, and back out into deep space?
          </p>
        </div>

        {/* Path Comparison Visual */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4 }}
          className="p-8 sm:p-12 rounded-3xl bg-black/30 border border-white/15 backdrop-blur-md relative overflow-hidden shadow-2xl space-y-8"
        >
          {/* Mode Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
              Compare Communication Paradigms:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTopologyMode("earth")}
                className={`px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase transition-all ${
                  topologyMode === "earth" 
                    ? "bg-red-500/20 text-red-300 border border-red-400/50" 
                    : "text-zinc-500 hover:text-white"
                }`}
              >
                Traditional Earth Detour
              </button>
              <button
                onClick={() => setTopologyMode("mesh")}
                className={`px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase transition-all ${
                  topologyMode === "mesh" 
                    ? "bg-amber-500/20 text-amber-300 border border-amber-400/50" 
                    : "text-zinc-500 hover:text-white"
                }`}
              >
                Shivodaya Mesh Multi-Hop
              </button>
            </div>
          </div>

          {/* Dynamic Diagram */}
          <div className="py-8">
            {topologyMode === "earth" ? (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-red-950/20 border border-red-500/20 text-center font-mono">
                  <div className="p-3 rounded-xl bg-black/60 border border-white/10 w-36">
                    <span className="text-xs text-white font-bold block">MISSION A</span>
                    <span className="text-[9px] text-zinc-400">Detects Flare</span>
                  </div>
                  <div className="text-xs text-red-400 font-mono">
                    → Long Terrestrial Detour (20 min) →
                  </div>
                  <div className="p-3 rounded-xl bg-black/60 border border-white/10 w-36">
                    <span className="text-xs text-white font-bold block">EARTH</span>
                    <span className="text-[9px] text-zinc-400">Ground Station</span>
                  </div>
                  <div className="text-xs text-red-400 font-mono">
                    → Long Outward Transit (20 min) →
                  </div>
                  <div className="p-3 rounded-xl bg-black/60 border border-white/10 w-36">
                    <span className="text-xs text-white font-bold block">MISSION B</span>
                    <span className="text-[9px] text-zinc-400">Receives Late Alert</span>
                  </div>
                </div>
                <p className="text-xs font-mono text-zinc-400 text-center">
                  TOTAL LATENCY: 40+ MINUTES // VULNERABILITY WINDOW CRITICAL
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-center font-mono">
                  <div className="p-3 rounded-xl bg-black/60 border border-amber-400/40 w-32">
                    <span className="text-xs text-amber-200 font-bold block">MISSION A</span>
                    <span className="text-[9px] text-zinc-400">Detects Flare</span>
                  </div>
                  <div className="text-xs text-amber-300 font-mono">
                    → Direct Inter-Satellite Hop →
                  </div>
                  <div className="p-3 rounded-xl bg-black/60 border border-white/10 w-32">
                    <span className="text-xs text-white font-bold block">RELAY / SENTRY</span>
                    <span className="text-[9px] text-zinc-400">Cislunar Bridge</span>
                  </div>
                  <div className="text-xs text-amber-300 font-mono">
                    → Immediate Relay Hop →
                  </div>
                  <div className="p-3 rounded-xl bg-black/60 border border-amber-400/40 w-32">
                    <span className="text-xs text-amber-200 font-bold block">MISSION B</span>
                    <span className="text-[9px] text-zinc-400">Receives In-Time Alert</span>
                  </div>
                </div>
                <p className="text-xs font-mono text-amber-300 text-center">
                  TRANSIT LATENCY: SECONDS TO MINUTES // MISSION HAS MAXIMUM RESPONSE TIME
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/10">
            <p className="text-base sm:text-lg font-light text-zinc-200">
              “The message does not always need one single route. It can take whatever path is open.”
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

// ============================================================
// SECTION 06 — SO WE BUILD THE NETWORK
// ============================================================
function Section06BuildTheNetwork() {
  const deliverables = [
    { title: "Faster Warnings", desc: "Alerts move along nearest available pathways instead of waiting for full planetary loops." },
    { title: "Greater Resilience", desc: "No single severed cable or eclipse terminates humanity's situational awareness." },
    { title: "Fewer Blind Spots", desc: "Surrounding lunar far sides and solar conjunctions with active orbital sentinels." },
    { title: "More Time to Act", desc: "Converting passive latency into valuable minutes to power down instruments or seal shelters." },
  ];

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 sm:px-12 md:px-20 max-w-6xl mx-auto z-20 py-32">
      <div className="space-y-12">
        
        <div className="space-y-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[10px] font-mono tracking-[0.35em] uppercase text-amber-400/90 font-semibold"
          >
            06 // THE SHIVODAYA VISION
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight uppercase leading-tight"
          >
            “SO WE BUILD<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-100 to-white">
              THE NETWORK.”
            </span>
          </motion.h2>

          <p className="text-lg sm:text-2xl font-light text-zinc-200 leading-relaxed pt-2">
            Shivodaya is a vision for a deep-space communication network where missions and relay systems can help carry critical information.
          </p>
        </div>

        {/* Clean, Simple Manifesto Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4 }}
          className="p-8 sm:p-12 rounded-3xl bg-black/40 border border-white/15 backdrop-blur-xl shadow-2xl space-y-8"
        >
          <div className="space-y-4 max-w-2xl">
            <p className="text-xl sm:text-2xl font-light text-amber-200 leading-relaxed">
              “One mission sees danger.<br />
              Another mission needs to know.<br />
              The network helps carry the warning there.”
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-white/10">
            {deliverables.map((item) => (
              <div key={item.title} className="p-5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                <span className="text-sm font-semibold text-white uppercase tracking-wider block">
                  {item.title}
                </span>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}

// ============================================================
// SECTION 07 — ONE MISSION CAN HELP ANOTHER
// ============================================================
function Section07MissionsCanHelp() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 sm:px-12 md:px-20 max-w-6xl mx-auto z-20 py-32">
      <div className="space-y-12">
        
        <div className="space-y-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[10px] font-mono tracking-[0.35em] uppercase text-amber-400/90 font-semibold"
          >
            07 // MUTUAL ASSISTANCE
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="text-3xl sm:text-5xl md:text-6xl font-light text-white tracking-tight uppercase leading-tight"
          >
            “ONE MISSION CAN<br />
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-white to-amber-100">
              HELP ANOTHER.”
            </span>
          </motion.h2>
        </div>

        {/* Narrative & Visual Concept */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4 }}
          className="p-8 sm:p-12 rounded-3xl bg-black/40 border border-white/15 backdrop-blur-xl shadow-2xl space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <p className="text-xl sm:text-2xl font-light text-zinc-100 leading-relaxed">
                “A spacecraft does not have to be only a destination.”
              </p>
              <p className="text-2xl sm:text-3xl font-normal text-amber-300 leading-relaxed">
                “It can also become a link.”
              </p>
              <div className="space-y-2 text-sm text-zinc-300 font-light border-l-2 border-white/20 pl-4">
                <p>One mission can warn another.</p>
                <p>One relay can help another.</p>
                <p>One available path can help another path.</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-black/60 border border-white/10 space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 block">
                Inter-Spacecraft Collaboration
              </span>
              <div className="space-y-3 font-mono text-xs text-zinc-300">
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.04]">
                  <span>Aditya-L1 Sentry Node</span>
                  <span className="text-emerald-400">Solar Field Sentry</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.04]">
                  <span>Lunar Gateway Relay</span>
                  <span className="text-amber-300">Cislunar Bridge</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.04]">
                  <span>Deep Space Transit Craft</span>
                  <span className="text-cyan-400">Crew Habitat Link</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

// ============================================================
// SECTION 08 — THE NETWORK GROWS WITH US (LIVING MESH)
// ============================================================
function Section08TheMesh() {
  const [activePath, setActivePath] = useState("pathA");

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 sm:px-12 md:px-20 max-w-6xl mx-auto z-20 py-32">
      <div className="space-y-12">
        
        <div className="space-y-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[10px] font-mono tracking-[0.35em] uppercase text-cyan-400 font-semibold"
          >
            08 // LIVING TOPOLOGY
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="text-3xl sm:text-5xl md:text-6xl font-light text-white tracking-tight uppercase leading-tight"
          >
            “THE NETWORK GROWS WITH US.”
          </motion.h2>

          <p className="text-base sm:text-xl font-light text-zinc-200 leading-relaxed">
            The mesh behaves like a living neural network in space. Each mission is a node. Each communication path is a thread.
          </p>
        </div>

        {/* Interactive Obsidian / Neural Network Mesh Display */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4 }}
          className="p-8 sm:p-12 rounded-3xl bg-black/30 border border-white/15 backdrop-blur-md relative overflow-hidden shadow-2xl space-y-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-zinc-300 uppercase tracking-wider">NEURAL MESH TOPOLOGY: RECONFIGURABLE</span>
            </div>
            <button
              onClick={() => setActivePath(activePath === "pathA" ? "pathB" : "pathA")}
              className="px-4 py-1.5 rounded-full border border-cyan-400/40 text-cyan-300 text-[10px] tracking-widest uppercase hover:bg-cyan-500/10 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-3 h-3" />
              {activePath === "pathA" ? "Simulate Disruption on Route A" : "Restore Primary Route"}
            </button>
          </div>

          {/* Minimalist Node Graph Visualization */}
          <div className="relative py-12 flex flex-col md:flex-row items-center justify-between gap-6">
            {[
              { id: "N1", name: "Solar Probe", active: true },
              { id: "N2", name: "Lunar Relay", active: activePath === "pathA" },
              { id: "N3", name: "Orbital Drone", active: activePath === "pathB" },
              { id: "N4", name: "Crew Habitat", active: true },
            ].map((node) => (
              <div key={node.id} className="flex flex-col items-center text-center relative z-10">
                <div className={`w-14 h-14 rounded-full border flex items-center justify-center font-mono font-bold transition-all duration-500 ${
                  node.active 
                    ? "border-cyan-400 bg-cyan-950/40 text-cyan-200 shadow-[0_0_25px_rgba(6,182,212,0.4)] scale-105" 
                    : "border-zinc-700 bg-black/80 text-zinc-600 opacity-50"
                }`}>
                  {node.id}
                </div>
                <span className="text-xs font-semibold text-white tracking-wider mt-2">{node.name}</span>
                <span className="text-[9px] text-zinc-400 font-mono">{node.active ? "ONLINE LINK" : "BYPASSED"}</span>
              </div>
            ))}
          </div>

          {/* Simple, Child-Clear Principle */}
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">The Core Reality</span>
              <p className="text-lg font-light text-white">
                “One way stopped working. <span className="text-cyan-300 font-normal">The network found another way.”</span>
              </p>
            </div>
            <div className="text-xs font-mono text-cyan-400/90 uppercase tracking-widest">
              Autonomous Re-routing
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

// ============================================================
// SECTION 09 — MAKE THE MESSAGE SURVIVE THE JOURNEY
// ============================================================
function Section09DataResilience() {
  const steps = [
    { title: "MESSAGE", desc: "Critical warning generated" },
    { title: "SMALL PIECES", desc: "Divided into resilient vector packets" },
    { title: "SPACE NETWORK", desc: "Carried through multiple open paths" },
    { title: "REASSEMBLED", desc: "Rebuilt accurately at destination" },
  ];

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 sm:px-12 md:px-20 max-w-6xl mx-auto z-20 py-32">
      <div className="space-y-12">
        
        <div className="space-y-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[10px] font-mono tracking-[0.35em] uppercase text-amber-400/90 font-semibold"
          >
            09 // DATA RESILIENCE
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="text-3xl sm:text-5xl md:text-6xl font-light text-white tracking-tight uppercase leading-tight"
          >
            “THE MESSAGE SHOULD<br />
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-white">
              SURVIVE THE JOURNEY.”
            </span>
          </motion.h2>

          <p className="text-base sm:text-lg text-zinc-300 font-light leading-relaxed">
            Important information can travel in smaller pieces. The network carries those pieces through space.
          </p>
        </div>

        {/* Visual Diagram of Packet Reassembly */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4 }}
          className="p-8 sm:p-12 rounded-3xl bg-black/40 border border-white/15 backdrop-blur-xl shadow-2xl space-y-8"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div key={step.title} className="p-6 rounded-2xl bg-black/60 border border-white/10 space-y-3 relative group hover:border-amber-400/40 transition-all">
                <span className="text-xs font-mono text-amber-400 font-bold block">0{idx + 1}</span>
                <h3 className="text-base font-semibold text-white tracking-wider font-mono uppercase">
                  {step.title}
                </h3>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-400/20 text-sm sm:text-base font-light text-zinc-200 leading-relaxed">
            “If part of the journey is interrupted, the system should be able to recover what is missing when communication becomes available again.”
          </div>
        </motion.div>

      </div>
    </section>
  );
}

// ============================================================
// SECTION 10 — THE BEST PATH CAN CHANGE
// ============================================================
function Section10BestPathCanChange() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 sm:px-12 md:px-20 max-w-6xl mx-auto z-20 py-32">
      <div className="space-y-12">
        
        <div className="space-y-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[10px] font-mono tracking-[0.35em] uppercase text-amber-400/90 font-semibold"
          >
            10 // DYNAMIC ADAPTATION
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="text-4xl sm:text-6xl md:text-7xl font-light text-white tracking-tight uppercase leading-tight"
          >
            “THE BEST PATH CAN CHANGE.”
          </motion.h2>

          <p className="text-lg sm:text-xl font-light text-zinc-200 leading-relaxed pt-2">
            Space is not static. Planets rotate. Craft change orbits. Solar storms erupt without notice.
          </p>
        </div>

        {/* Adaptive Visual Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4 }}
          className="p-8 sm:p-12 rounded-3xl bg-black/40 border border-white/15 backdrop-blur-xl shadow-2xl space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-center">
            <div className="p-6 rounded-2xl bg-black/60 border border-white/10 space-y-2">
              <span className="text-[10px] text-zinc-500 uppercase">Primary Choice</span>
              <h4 className="text-base font-bold text-white">PATH A</h4>
              <p className="text-xs text-zinc-400 font-sans font-light">Direct High-Gain Line</p>
            </div>

            <div className="p-6 rounded-2xl bg-red-950/30 border border-red-500/30 space-y-2">
              <span className="text-[10px] text-red-400 uppercase">Environmental Event</span>
              <h4 className="text-base font-bold text-red-300">PATH A UNAVAILABLE</h4>
              <p className="text-xs text-zinc-300 font-sans font-light">Coronal Ejection Occlusion</p>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-400/40 space-y-2">
              <span className="text-[10px] text-emerald-400 uppercase">Adaptive Handover</span>
              <h4 className="text-base font-bold text-emerald-200">PATH B ENGAGED</h4>
              <p className="text-xs text-zinc-300 font-sans font-light">Cislunar Sentry Relay</p>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 text-center sm:text-left">
            <p className="text-xl sm:text-2xl font-light text-white">
              “The network adapts. Something went wrong. <span className="text-amber-300 font-normal">The network found another way.”</span>
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

// ============================================================
// SECTION 11 — A NETWORK THAT CAN LEARN TO FIND THE WAY
// ============================================================
function Section11IntelligentPathFinding() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 sm:px-12 md:px-20 max-w-6xl mx-auto z-20 py-32">
      <div className="space-y-12">
        
        <div className="space-y-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[10px] font-mono tracking-[0.35em] uppercase text-cyan-400 font-semibold"
          >
            11 // LONG-TERM AMBITION
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="text-3xl sm:text-5xl md:text-6xl font-light text-white tracking-tight uppercase leading-tight"
          >
            “A NETWORK THAT CAN LEARN<br />
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-white">
              TO FIND THE WAY.”
            </span>
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4 }}
          className="p-8 sm:p-12 rounded-3xl bg-black/40 border border-white/15 backdrop-blur-xl shadow-2xl space-y-6"
        >
          <p className="text-lg sm:text-2xl font-light text-zinc-100 leading-relaxed">
            Future versions of the network could become smarter about choosing paths, understanding changing conditions, and deciding how important information should move.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-white/10 text-xs font-mono">
            <div className="p-4 rounded-xl bg-white/[0.03] space-y-1">
              <span className="text-cyan-300 block font-bold">OBSERVATION</span>
              <p className="text-zinc-400 font-sans font-light">Tracking radiation flux and solar particle fronts in real time.</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] space-y-1">
              <span className="text-cyan-300 block font-bold">EVALUATION</span>
              <p className="text-zinc-400 font-sans font-light">Calculating line-of-sight probabilities across moving planetary bodies.</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] space-y-1">
              <span className="text-cyan-300 block font-bold">OPTIMIZATION</span>
              <p className="text-zinc-400 font-sans font-light">Selecting the highest-probability path before severe packet loss occurs.</p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

// ============================================================
// SECTION 12 — EVERY MISSION BECOMES PART OF THE NETWORK
// ============================================================
function Section12EveryMissionNode() {
  const steps = [
    { count: "1 MISSION", desc: "An isolated point in the solar void with limited line-of-sight." },
    { count: "3 MISSIONS", desc: "A rudimentary triangular relay overcoming planetary shadows." },
    { count: "MANY MISSIONS", desc: "A dense resilient constellation across interplanetary space." },
  ];

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 sm:px-12 md:px-20 max-w-6xl mx-auto z-20 py-32">
      <div className="space-y-12">
        
        <div className="space-y-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[10px] font-mono tracking-[0.35em] uppercase text-amber-400/90 font-semibold"
          >
            12 // EXPANDING REACH
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="text-3xl sm:text-5xl md:text-6xl font-light text-white tracking-tight uppercase leading-tight"
          >
            “EVERY MISSION CAN BECOME<br />
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-white">
              A PART OF THE NETWORK.”
            </span>
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4 }}
          className="p-8 sm:p-12 rounded-3xl bg-black/40 border border-white/15 backdrop-blur-xl shadow-2xl space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((s, idx) => (
              <div key={s.count} className="p-6 rounded-2xl bg-black/60 border border-white/10 space-y-3">
                <span className="text-xs font-mono text-zinc-500 font-bold block">STAGE 0{idx + 1}</span>
                <h3 className="text-lg font-bold text-white font-mono uppercase">
                  {s.count}
                </h3>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <p className="text-lg sm:text-xl font-light text-zinc-100 leading-relaxed">
              “The network becomes stronger as more useful links become available.”
            </p>
            <p className="text-base text-zinc-400 font-light leading-relaxed">
              Missions no longer have to exist as isolated islands. They can become part of a larger communication layer.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

// ============================================================
// SECTION 13 — MISSIONS CAN HELP MISSIONS (COLLABORATION)
// ============================================================
function Section13Collaboration() {
  const roles = [
    { title: "Relay Critical Alerts", desc: "Passing urgent warnings forward when a neighbor's direct downlink is occulted." },
    { title: "Share Observations", desc: "Combining sensor telemetry so sudden solar flares are detected instantly from any angle." },
    { title: "Provide Alternate Paths", desc: "Serving as an orbital stepping stone between deep space vessels and ground stations." },
    { title: "Improve Availability", desc: "Ensuring continuous communication coverage across celestial bodies." },
  ];

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 sm:px-12 md:px-20 max-w-6xl mx-auto z-20 py-32">
      <div className="space-y-12">
        
        <div className="space-y-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[10px] font-mono tracking-[0.35em] uppercase text-amber-400/90 font-semibold"
          >
            13 // UNIVERSAL COOPERATION
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="text-4xl sm:text-6xl md:text-7xl font-light text-white tracking-tight uppercase leading-tight"
          >
            “MISSIONS CAN HELP MISSIONS.”
          </motion.h2>

          <p className="text-base sm:text-xl text-zinc-300 font-light leading-relaxed">
            This is not about borders, politics, or ownership. This is about mutual assistance and human survival in deep space.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {roles.map((item) => (
            <div key={item.title} className="p-8 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl hover:border-amber-400/40 transition-all flex flex-col justify-between min-h-[220px]">
              <div>
                <span className="w-2 h-2 rounded-full bg-amber-400 block mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  {item.title}
                </h3>
              </div>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </motion.div>

        <p className="text-center text-sm font-mono text-zinc-400 uppercase tracking-widest">
          “THE NETWORK ACTS LIKE A COLLECTIVE NERVOUS SYSTEM FOR SPACE.”
        </p>

      </div>
    </section>
  );
}

// ============================================================
// SECTION 14 — BECAUSE SOMEDAY, HUMANS WILL GO THERE
// ============================================================
function Section14SomedayHumans() {
  const chain = [
    "Radiation Detected",
    "Warning Formed",
    "Communication Mesh",
    "Path Resilience",
    "More Time to Respond",
    "Safer Exploration",
    "Humanity Goes Farther"
  ];

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 sm:px-12 md:px-20 max-w-6xl mx-auto z-20 py-32">
      <div className="space-y-12">
        
        <div className="space-y-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[10px] font-mono tracking-[0.35em] uppercase text-amber-400/90 font-semibold"
          >
            14 // THE HUMAN HORIZON
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="text-4xl sm:text-6xl md:text-7xl font-light text-white tracking-tight uppercase leading-tight"
          >
            “BECAUSE SOMEDAY,<br />
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-300">
              HUMANS WILL GO THERE.”
            </span>
          </motion.h2>
        </div>

        {/* Feature Card with High-Definition Astronaut Visual */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4 }}
          className="relative rounded-3xl overflow-hidden border border-white/15 bg-black/40 backdrop-blur-xl shadow-2xl p-8 sm:p-12 space-y-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-white/10 aspect-square group">
              <div 
                className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: "url('/images/vision/people_to_space.webp')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <span className="absolute bottom-4 left-4 text-[10px] font-mono uppercase tracking-widest text-amber-200">
                Future Human Exploration
              </span>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <p className="text-xl sm:text-3xl font-light text-zinc-100 leading-relaxed">
                “We are not building the network because communication is interesting.”
              </p>
              <p className="text-2xl sm:text-4xl font-normal text-amber-300 leading-relaxed">
                “We are building it because people will one day depend on it.”
              </p>
              <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed">
                When human crews step out toward Mars, the asteroids, and deep space habitats, they cannot afford communication blackouts when solar storms ignite. They need continuous awareness.
              </p>
            </div>

          </div>

          {/* Chain of Consequence */}
          <div className="pt-8 border-t border-white/10">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-4">
              The Chain of Civilizational Resilience:
            </span>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              {chain.map((link, idx) => (
                <React.Fragment key={link}>
                  <span className={`px-3 py-1 rounded-md border ${idx === chain.length - 1 ? "bg-amber-400 text-black border-amber-400 font-bold" : "bg-white/[0.04] text-zinc-200 border-white/10"}`}>
                    {link}
                  </span>
                  {idx < chain.length - 1 && (
                    <span className="text-zinc-600">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

// ============================================================
// SECTION 15 — THE ULTIMATE PURPOSE
// ============================================================
function Section15UltimatePurpose() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 sm:px-12 md:px-20 max-w-6xl mx-auto z-20 py-32">
      <div className="space-y-12">
        
        <div className="space-y-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[10px] font-mono tracking-[0.35em] uppercase text-amber-400/90 font-semibold"
          >
            15 // THE ENABLING LAYER
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight uppercase leading-tight"
          >
            “THE NETWORK IS NOT THE DESTINATION.”<br />
            <span className="font-light text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-400">
              IT IS WHAT HELPS US GO FURTHER.
            </span>
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
        >
          <div className="p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl space-y-3">
            <span className="text-xs font-mono text-amber-400 font-bold block">01</span>
            <h4 className="text-base font-semibold text-white">More Options</h4>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              Better communication gives missions multiple paths and operating flexibility.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl space-y-3">
            <span className="text-xs font-mono text-amber-400 font-bold block">02</span>
            <h4 className="text-base font-semibold text-white">More Time</h4>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              More resilience gives crews and autonomous systems more time to respond safely.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl space-y-3">
            <span className="text-xs font-mono text-amber-400 font-bold block">03</span>
            <h4 className="text-base font-semibold text-white">Farther Reach</h4>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              More capable, informed missions can venture deeper into unexplored horizons.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl space-y-3">
            <span className="text-xs font-mono text-amber-400 font-bold block">04</span>
            <h4 className="text-base font-semibold text-white">Human Follow-Through</h4>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              Missions that go farther open the door for more humans to follow safely.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

// ============================================================
// SECTION 16 — HUMANITY BEYOND EARTH
// ============================================================
function Section16HumanityBeyondEarth() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 sm:px-12 md:px-24 max-w-6xl mx-auto z-20 py-40">
      <div className="space-y-12 max-w-4xl">
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[10px] font-mono tracking-[0.4em] uppercase text-amber-300/90 font-semibold"
        >
          16 // THE SYNTHESIS
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white tracking-tight uppercase leading-none drop-shadow-[0_10px_40px_rgba(0,0,0,0.8)]"
        >
          HUMANITY<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-amber-200 to-amber-400">
            BEYOND
          </span><br />
          EARTH.
        </motion.h2>

        <div className="space-y-6 pt-4">
          {[
            "Connected enough to communicate.",
            "Resilient enough to keep going.",
            "Collaborative enough to go farther.",
            "Together."
          ].map((line, idx) => (
            <motion.p
              key={line}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: idx * 0.15 }}
              className={`text-2xl sm:text-4xl md:text-5xl tracking-tight ${
                idx === 3 ? "text-amber-300 font-bold" : "text-zinc-200 font-extralight"
              }`}
            >
              {line}
            </motion.p>
          ))}
        </div>

      </div>
    </section>
  );
}

// ============================================================
// SECTION 17 — WE ARE BUILDING THE NETWORK THAT GOES WITH US
// ============================================================
function Section17NetworkThatGoesWithUs() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 sm:px-12 md:px-20 max-w-6xl mx-auto z-20 py-36">
      <div className="space-y-12 max-w-4xl">
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[10px] font-mono tracking-[0.35em] uppercase text-amber-400/90 font-semibold"
        >
          17 // THE SHIVODAYA COMMITMENT
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4 }}
          className="text-4xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight uppercase leading-tight"
        >
          “WE ARE BUILDING THE NETWORK<br />
          <span className="font-light text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-300">
            THAT GOES WITH US.”
          </span>
        </motion.h2>

        <div className="space-y-6 text-xl sm:text-2xl text-zinc-200 font-light leading-relaxed border-l-2 border-amber-400/50 pl-6 sm:pl-8">
          <p>Not to replace Earth.</p>
          <p>Not to disconnect from Earth.</p>
          <p className="text-white font-normal">But to give humanity more than one path to stay connected.</p>
          <p className="pt-4 text-base sm:text-xl text-zinc-300">
            To help critical information reach the mission that needs it.<br />
            To make deep-space communication more resilient.<br />
            To help missions help missions.<br />
            And to help humanity go farther.
          </p>
        </div>

      </div>
    </section>
  );
}

// ============================================================
// SECTION 18 — FINAL MANIFESTO & CALL TO ACTION
// ============================================================
function Section18FinalManifesto() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 sm:px-12 md:px-20 max-w-6xl mx-auto z-20 py-48">
      <div className="space-y-16 max-w-5xl">
        
        {/* Solemn Staccato Truths */}
        <div className="space-y-8 text-2xl sm:text-4xl md:text-5xl font-extralight tracking-tight text-zinc-200">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
          >
            “SPACE WILL CHALLENGE US.”
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.15 }}
          >
            “RADIATION WILL NOT WAIT.”
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.3 }}
          >
            “DISTANCE WILL NOT WAIT.”
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.45 }}
          >
            “COMMUNICATION CANNOT WAIT.”
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.6 }}
            className="text-amber-300 font-normal pt-4"
          >
            “SO WE BUILD THE NETWORK.”
          </motion.p>
        </div>

        {/* Monumental Climax */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="pt-12 space-y-4"
        >
          <h1 className="text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black tracking-[0.08em] text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-100 to-amber-300 leading-none select-none drop-shadow-[0_10px_60px_rgba(245,158,11,0.4)]">
            HUMANITY
          </h1>
          <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-[9rem] font-black tracking-[0.1em] text-transparent bg-clip-text bg-gradient-to-b from-amber-100 to-amber-400 leading-none select-none">
            BEYOND
          </h2>
          <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-[8.5rem] font-light tracking-[0.12em] text-white leading-none select-none">
            EARTH.
          </h2>
          <div className="pt-6 text-3xl sm:text-5xl font-mono uppercase tracking-[0.25em] text-amber-300">
            TOGETHER.
          </div>
          <div className="pt-2 text-sm sm:text-base font-mono uppercase tracking-[0.4em] text-zinc-400">
            FURTHER THAN TODAY.
          </div>
        </motion.div>

        {/* Calls to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-12"
        >
          <Link
            href="/registration"
            className="w-full sm:w-auto px-10 py-5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-xs tracking-[0.25em] uppercase transition-all shadow-[0_0_35px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Join the Journey</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/architecture"
            className="w-full sm:w-auto px-10 py-5 rounded-full border border-white/20 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/40 text-white font-medium text-xs tracking-[0.25em] uppercase transition-all flex items-center justify-center cursor-pointer backdrop-blur-md"
          >
            Explore Architecture
          </Link>
        </motion.div>

        <div className="pt-16 text-[10px] font-mono text-zinc-500 tracking-[0.25em] uppercase">
          PROJECT SHIVODAYA // BUILDING THE DEEP SPACE MESH FOR HUMANITY
        </div>

      </div>
    </section>
  );
}

// ============================================================
// ROOT VISION PAGE COMPONENT
// ============================================================
export default function VisionPage() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div 
      ref={containerRef}
      className="bg-[#020306] text-white font-sans selection:bg-amber-400 selection:text-black relative selection:font-medium overflow-x-hidden min-h-screen"
    >
      <FilmGrain />

      <ScrollProgressIndicator scrollYProgress={scrollYProgress} />

      <AudioController scrollYProgress={scrollYProgress} />

      <AmbientBackground scrollYProgress={scrollYProgress} />

      <VisionNavbar />

      <main className="relative z-20">
        <HeroSection />
        <Section01GoFarther />
        <Section02InvisibleThreat />
        <Section03TheWarning />
        <Section04DeepSpaceRules />
        <Section05WarnAnotherMission />
        <Section06BuildTheNetwork />
        <Section07MissionsCanHelp />
        <Section08TheMesh />
        <Section09DataResilience />
        <Section10BestPathCanChange />
        <Section11IntelligentPathFinding />
        <Section12EveryMissionNode />
        <Section13Collaboration />
        <Section14SomedayHumans />
        <Section15UltimatePurpose />
        <Section16HumanityBeyondEarth />
        <Section17NetworkThatGoesWithUs />
        <Section18FinalManifesto />
      </main>
    </div>
  );
}
