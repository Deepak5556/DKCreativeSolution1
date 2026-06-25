"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/shared/Logo";

export function PageLoader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isHomepage = window.location.pathname === "/";
    let progressInterval: NodeJS.Timeout;

    // Smooth simulated progress count up
    let currentProgress = 0;
    const runProgressCountup = () => {
      progressInterval = setInterval(() => {
        if (currentProgress < 90) {
          // Increment random steps for natural load simulation
          currentProgress += Math.floor(Math.random() * 6) + 1;
          setProgress(Math.min(currentProgress, 95));
        }
      }, 120);
    };

    runProgressCountup();

    // Handlers to end loading smoothly
    const completeLoading = () => {
      clearInterval(progressInterval);
      setProgress(100);
      // Wait for progress circle to fill up completely, then fade out
      setTimeout(() => {
        setLoading(false);
      }, 550);
    };

    if (!isHomepage) {
      // Subpages load simulation
      const handleLoad = () => {
        completeLoading();
      };
      if (document.readyState === "complete") {
        handleLoad();
      } else {
        window.addEventListener("load", handleLoad);
        const fallback = setTimeout(handleLoad, 2500);
        return () => {
          window.removeEventListener("load", handleLoad);
          clearTimeout(fallback);
          clearInterval(progressInterval);
        };
      }
      return;
    }

    // Homepage logic: Wait for backend data sections to fire load events
    const required = ["services", "projects", "videos", "posters"];
    const loaded = new Set<string>();

    const handleSectionLoaded = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (required.includes(customEvent.detail)) {
        loaded.add(customEvent.detail);
        
        // Increase progress corresponding to loaded modules
        const baseProgress = Math.floor((loaded.size / required.length) * 95);
        if (baseProgress > currentProgress) {
          currentProgress = baseProgress;
          setProgress(currentProgress);
        }

        if (loaded.size >= required.length) {
          completeLoading();
        }
      }
    };

    window.addEventListener("sectionLoaded", handleSectionLoaded);

    // Safety fallback (e.g. offline, database down) to hide loader after 5 seconds
    const fallbackTimer = setTimeout(() => {
      completeLoading();
    }, 5000);

    return () => {
      window.removeEventListener("sectionLoaded", handleSectionLoaded);
      clearTimeout(fallbackTimer);
      clearInterval(progressInterval);
    };
  }, []);

  const strokeDashoffset = 2 * Math.PI * 66 * (1 - progress / 100);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] } }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#050505] text-white"
        >
          {/* Engineering grid backdrop */}
          <div className="absolute inset-0 bg-grid bg-grid-fade opacity-[0.15] pointer-events-none" />

          {/* Central Monogram Widget */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
            exit={{ scale: 1.05, opacity: 0, transition: { duration: 0.5, ease: "easeIn" } }}
            className="relative flex flex-col items-center gap-8"
          >
            {/* Concentric rotating design rings */}
            <div className="absolute inset-0 -m-8 rounded-full border border-dashed border-white/5 animate-[spin_60s_linear_infinite_reverse] pointer-events-none" />
            <div className="absolute inset-0 -m-12 rounded-full border border-dashed border-white/[0.02] animate-[spin_90s_linear_infinite] pointer-events-none" />

            <div className="relative p-6 rounded-full border border-white/5 bg-black/60 backdrop-blur-md shadow-glow-md flex items-center justify-center">
              {/* Circular Progress Bar Ring */}
              <svg className="absolute -inset-0.5 h-[136px] w-[136px] -rotate-90 pointer-events-none">
                <circle
                  cx="68"
                  cy="68"
                  r="66"
                  className="stroke-white/[0.04]"
                  strokeWidth="1.5"
                  fill="transparent"
                />
                <circle
                  cx="68"
                  cy="68"
                  r="66"
                  className="stroke-primary"
                  strokeWidth="1.5"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 66}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 0.25s cubic-bezier(0.16, 1, 0.3, 1)" }}
                />
              </svg>

              {/* The circular animated logo monogram */}
              <Logo size={88} animateRing={true} withRing={true} />
            </div>

            {/* Premium Loading text & percentage counter */}
            <div className="flex flex-col items-center gap-2.5 text-center mt-2">
              <span className="font-mono text-[11px] font-bold tracking-[0.25em] text-primary">
                {String(Math.floor(progress)).padStart(2, "0")}%
              </span>
              <div className="flex flex-col items-center gap-1">
                <span className="font-mono text-[8px] uppercase tracking-[0.4em] text-white/80 animate-pulse">
                  Calibrating Studio
                </span>
                <span className="font-mono text-[7px] uppercase tracking-[0.25em] text-dk-muted/60">
                  DK Creative Solutions
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
