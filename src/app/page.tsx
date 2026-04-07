"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Share2, Volume2, RefreshCw, Quote, Check, Sparkles, AlertCircle, HelpCircle, Download
} from "lucide-react";
import confetti from "canvas-confetti";
import { toPng } from "html-to-image";
import { type Language, type Joke } from "@/data/jokes";
import { fetchJoke } from "@/lib/fetchJoke";

const MAX_HISTORY = 50;

function HasmukhLogo({ className = "w-10 h-10", giggleTrigger = 0 }: { className?: string, giggleTrigger?: number }) {
  return (
    <motion.svg 
      viewBox="0 0 100 100" 
      className={className} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      aria-hidden="true"
      animate={{ rotate: giggleTrigger > 0 ? [0, -10, 10, -10, 10, 0] : 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--saas-from)" />
          <stop offset="50%" stopColor="var(--saas-via)" />
          <stop offset="100%" stopColor="var(--saas-to)" />
        </linearGradient>
      </defs>
      <path d="M20 25C20 19.4772 24.4772 15 30 15H70C75.5228 15 80 19.4772 80 25V60C80 65.5228 75.5228 70 70 70H45L25 85V70H20C14.4772 70 10 65.5228 10 60V25C10 19.4772 14.4772 15 20 15Z" stroke="url(#logoGradient)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M35 45C35 45 42.5 55 50 55C57.5 55 65 45 65 45" stroke="url(#logoGradient)" strokeWidth="5" strokeLinecap="round"/>
      <circle cx="38" cy="36" r="3" fill="url(#logoGradient)" />
      <circle cx="62" cy="36" r="3" fill="url(#logoGradient)" />
    </motion.svg>
  );
}

function getFontFamily(lang: Language): string {
  switch (lang) {
    case "ta": return "var(--font-noto-sans-tamil), sans-serif";
    case "te": return "var(--font-noto-sans-telugu), sans-serif";
    case "ml": return "var(--font-noto-sans-malayalam), sans-serif";
    case "hi": case "mr": return "var(--font-noto-sans-devanagari), sans-serif";
    default: return "var(--font-poppins), sans-serif";
  }
}

function getExplainer(lang: Language): string {
  if (lang === 'en') return "This joke relies on Wordplay (Pun), playfully twisting the double meaning of typical phrases to trigger a laugh.";
  return "This joke plays on regional cultural references, colloquialisms, and language-specific undertones.";
}

const languages: { code: Language; label: string }[] = [
  { code: "en", label: "English" }, { code: "hi", label: "हिंदी" },
  { code: "mr", label: "मराठी" }, { code: "ta", label: "தமிழ்" },
  { code: "te", label: "తెలుగు" }, { code: "ml", label: "മലയാളം" },
];

function SplashScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const playWhoosh = () => {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        
        const bufferSize = ctx.sampleRate * 1.5;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(200, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.8);
        filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 1.5);
        
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.5);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        
        noise.start();
      } catch (e) {
        console.warn("Audio block:", e);
      }
    };
    
    playWhoosh();

    const timer = setTimeout(() => {
      onComplete();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 bg-[#030712] z-[100] flex flex-col items-center justify-center"
    >
      <div className="relative flex flex-col items-center">
        <motion.svg
          viewBox="0 0 100 100"
          className="w-32 h-32 mb-6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="splashGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="50%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>
          </defs>
          <motion.path
            d="M20 25C20 19.4772 24.4772 15 30 15H70C75.5228 15 80 19.4772 80 25V60C80 65.5228 75.5228 70 70 70H45L25 85V70H20C14.4772 70 10 65.5228 10 60V25C10 19.4772 14.4772 15 20 15Z"
            stroke="url(#splashGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          <motion.path
            d="M35 45C35 45 42.5 55 50 55C57.5 55 65 45 65 45"
            stroke="url(#splashGradient)"
            strokeWidth="5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          <motion.circle
            cx="38" cy="36" r="3" fill="url(#splashGradient)"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          />
          <motion.circle
            cx="62" cy="36" r="3" fill="url(#splashGradient)"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1, duration: 0.5 }}
          />
        </motion.svg>
        
        <motion.h1
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1.05, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8, ease: "easeOut" }}
          className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-rose-400 to-rose-500 font-black tracking-[0.2em] text-4xl uppercase"
        >
          Hasmukh
        </motion.h1>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [lang, setLang] = useState<Language>("en");
  const [currentJoke, setCurrentJoke] = useState<Joke | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [giggleTrigger, setGiggleTrigger] = useState(0);
  const [showExplainer, setShowExplainer] = useState(false);
  
  const viewedIdsRef = useRef<Set<string>>(new Set());
  const jokeCardRef = useRef<HTMLDivElement>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2500);
  };

  const loadJoke = useCallback(async (targetLang: Language) => {
    setIsLoading(true);
    setHasError(false);
    setShowExplainer(false);
    try {
      const joke = await fetchJoke(targetLang, viewedIdsRef.current);
      
      const ids = viewedIdsRef.current;
      ids.add(joke.id);
      if (ids.size > MAX_HISTORY) {
        const first = ids.values().next().value;
        if (first !== undefined) ids.delete(first);
      }
      
      setCurrentJoke(joke);
      // Trigger giggle animation
      setGiggleTrigger(prev => prev + 1);
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadJoke(lang); }, [lang, loadJoke]);

  const handleShare = async () => {
    if (!currentJoke) return;
    const text = `${currentJoke.text}\n\n— shared from Hasmukh App`;
    if (navigator.share) {
      try { await navigator.share({ title: "Hasmukh Joke", text, url: window.location.href }); } catch {}
    } else {
      try { await navigator.clipboard.writeText(text); triggerToast("Copied to Clipboard!"); } catch {}
    }
  };

  const speakJoke = () => {
    if (!currentJoke || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(currentJoke.text);
    const m: Record<Language, string> = { en:"en-US", hi:"hi-IN", mr:"mr-IN", ta:"ta-IN", te:"te-IN", ml:"ml-IN" };
    u.lang = m[lang];
    window.speechSynthesis.speak(u);
  };

  const handleReaction = (emoji: string) => {
    if (emoji === '😂' || emoji === '🔥') {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 1 },
        colors: ['#6366F1', '#EC4899', '#F43F5E', '#10B981', '#F59E0B']
      });
    }
  };

  const downloadImage = async () => {
    if (!jokeCardRef.current) return;
    try {
      const dataUrl = await toPng(jokeCardRef.current, { 
        cacheBust: true, 
        pixelRatio: 2,
        filter: (node) => {
          if (node?.classList?.contains('exclude-from-download')) return false;
          return true;
        }
      });
      const link = document.createElement('a');
      link.download = `hasmukh-joke-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      triggerToast("Image Saved!");
    } catch (err) {
      triggerToast("Failed to save image.");
    }
  };

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      </AnimatePresence>
      <main data-lang={lang} className="saas-bg relative flex flex-col items-center flex-1 text-white antialiased overflow-hidden">
      {/* Grid Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

      {/* ─── Animated Aura Blobs ─── */}
      <motion.div 
        className="fixed top-[-10%] right-[-5%] w-[800px] h-[800px] rounded-full blur-[140px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, var(--aura-1) 0%, transparent 70%)' }}
        animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0], scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="fixed bottom-[-10%] left-[-5%] w-[800px] h-[800px] rounded-full blur-[140px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, var(--aura-2) 0%, transparent 70%)' }}
        animate={{ x: [0, -30, 40, 0], y: [0, 20, -40, 0], scale: [1, 1.05, 0.9, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div className="relative flex flex-col items-center w-full flex-1 z-10" style={{ padding: "2rem clamp(1rem, 4vw, 3rem)", minHeight: "100vh" }}>
        
        {/* Header */}
        <header className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center gap-6">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="flex items-center gap-3 group cursor-default select-none">
            <div className="relative">
              <HasmukhLogo className="w-12 h-12" giggleTrigger={giggleTrigger} />
              <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <h1 className="text-saas-gradient font-black tracking-[0.15em] text-2xl uppercase">Hasmukh</h1>
          </motion.div>
          
          <motion.nav initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.15 }} className="lang-bar flex gap-1 p-1.5 shadow-lg">
            {languages.map((l) => (
              <button key={l.code} onClick={() => setLang(l.code)}
                className={`lang-pill ${lang === l.code ? "lang-pill--active" : "lang-pill--inactive"}`}>
                {l.label}
              </button>
            ))}
          </motion.nav>
        </header>

        {/* Floating Joke Section */}
        <div className="flex-1 w-full flex flex-col items-center justify-center py-10 md:py-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="w-full max-w-4xl"
          >
            {/* The Joke Card (Also used for Image Generation capture) */}
            <div 
              ref={jokeCardRef}
              className="glass-card-premium relative w-full flex items-center justify-center overflow-visible"
              style={{ borderRadius: "2.5rem", padding: "clamp(3rem, 6vw, 5rem) clamp(2rem, 5vw, 6rem)", minHeight: "380px" }}
            >
              <div className="quote-accent quote-accent--tl"><Quote size={56} className="fill-white" /></div>
              <div className="quote-accent quote-accent--br"><Quote size={56} className="fill-white" /></div>

              {/* Explainer Icon & Popover container */}
              <div className="absolute top-6 right-6 z-50 exclude-from-download">
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  onClick={() => setShowExplainer(!showExplainer)} 
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white/80 transition-all"
                >
                  <HelpCircle size={22} />
                </motion.button>
                <AnimatePresence>
                  {showExplainer && !isLoading && !hasError && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 10 }}
                      className="absolute top-full mt-2 right-0 w-64 p-4 rounded-xl bg-slate-900/90 backdrop-blur-md shadow-2xl border border-white/10"
                    >
                      <p className="text-sm font-medium leading-relaxed text-white/90">
                        <Sparkles size={14} className="inline mr-2 text-indigo-400" />
                        {getExplainer(lang)}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative w-full z-10">
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                      className="flex flex-col items-center gap-5 w-full">
                      <div className="skeleton-line" style={{ width: "85%" }} />
                      <div className="skeleton-line" style={{ width: "70%" }} />
                      <div className="skeleton-line" style={{ width: "50%" }} />
                    </motion.div>
                  ) : hasError ? (
                    <motion.div key="error" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="flex flex-col items-center gap-5">
                      <AlertCircle size={48} className="text-rose-400 opacity-70" />
                      <p className="text-white/70 text-lg">Whoops... laughter engine misfired.</p>
                      <button onClick={() => loadJoke(lang)}
                        className="bg-saas-gradient btn-glow-saas rounded-full text-white font-bold px-8 py-3 text-sm mt-2">
                        Try Again
                      </button>
                    </motion.div>
                  ) : currentJoke ? (
                    <motion.div key={`${currentJoke.id}-${lang}`} initial={{ opacity: 0, filter: "blur(8px)" }} animate={{ opacity: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, filter: "blur(8px)" }} transition={{ duration: 0.5 }}
                      className="flex items-center justify-center">
                      <p className={lang === "en" ? "joke-text-en" : "joke-text-regional"}
                        style={{ fontFamily: getFontFamily(lang), textAlign: "center", color: "rgba(255,255,255,0.95)", maxWidth: "800px" }}>
                        {currentJoke.text}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>

            </div>

            {/* Reaction Dock */}
            {!isLoading && !hasError && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="flex items-center justify-center gap-4 mt-8"
              >
                {['😂', '❤️', '😐', '🔥'].map((emoji, idx) => (
                  <button key={idx} onClick={() => handleReaction(emoji)} className="reaction-btn">
                    {emoji}
                  </button>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Global Footer Dock */}
        <footer className="w-full flex flex-col items-center gap-6 pb-6 mt-auto">
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }} className="dock-bar flex items-center gap-4">
            
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => loadJoke(lang)} disabled={isLoading}
              className="bg-saas-gradient btn-glow-saas flex items-center gap-3 rounded-full text-white font-bold disabled:opacity-50"
              style={{ padding: "0.875rem 2.5rem", fontSize: "0.9375rem" }}>
              <RefreshCw size={20} className={isLoading ? "animate-spin" : ""} />
              <span>{isLoading ? "Fetching…" : "Next Laugh"}</span>
            </motion.button>
            
            <div className="w-px h-8 bg-white/10 mx-1" />
            
            <div className="flex items-center gap-2">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={speakJoke} className="icon-btn" aria-label="Listen to joke">
                <Volume2 size={20} />
              </motion.button>
              
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={downloadImage} className="icon-btn" aria-label="Download Image">
                <Download size={20} />
              </motion.button>

              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleShare} className="icon-btn" aria-label="Share">
                <Share2 size={20} />
              </motion.button>
            </div>

          </motion.div>
          
          <div className="flex items-center gap-4">
            <div className="w-8 h-px bg-white/20" />
            <p className="text-slate-500/50 uppercase tracking-[0.3em] font-bold text-xs">© {new Date().getFullYear()} HASMUKH • SAAS EDITION</p>
            <div className="w-8 h-px bg-white/20" />
          </div>
        </footer>

        {/* Toast Notifs */}
        <AnimatePresence>
          {toastMsg && (
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.9 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="toast-notification"
            >
              <Check size={18} className="text-emerald-400" />
              <span>{toastMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>
        
      </div>
    </main>
    </>
  );
}
