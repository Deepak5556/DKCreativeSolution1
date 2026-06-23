"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/shared/Logo";

export function PageLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isHomepage = window.location.pathname === "/";
    if (!isHomepage) {
      // Normal behavior on subpages
      const handleLoad = () => {
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
      };
      if (document.readyState === "complete") {
        handleLoad();
      } else {
        window.addEventListener("load", handleLoad);
        const fallback = setTimeout(handleLoad, 3000);
        return () => {
          window.removeEventListener("load", handleLoad);
          clearTimeout(fallback);
        };
      }
      return;
    }

    // Homepage logic: Wait for backend data sections to load
    const required = ["services", "projects", "videos", "posters"];
    const loaded = new Set<string>();

    const handleSectionLoaded = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (required.includes(customEvent.detail)) {
        loaded.add(customEvent.detail);
        if (loaded.size >= required.length) {
          // Extra buffer for exit transition feel
          setTimeout(() => setLoading(false), 300);
        }
      }
    };

    window.addEventListener("sectionLoaded", handleSectionLoaded);

    // Safety fallback (e.g. offline, database down) to hide loader after 5.5 seconds
    const fallbackTimer = setTimeout(() => {
      setLoading(false);
    }, 5500);

    return () => {
      window.removeEventListener("sectionLoaded", handleSectionLoaded);
      clearTimeout(fallbackTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] } }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#050505] text-white"
        >
          {/* Engineering grid backdrop */}
          <div className="absolute inset-0 bg-grid bg-grid-fade opacity-20 pointer-events-none animate-pulse" />

          {/* Central Monogram Widget */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }}
            exit={{ scale: 1.05, opacity: 0, transition: { duration: 0.5, ease: "easeIn" } }}
            className="relative flex flex-col items-center gap-6"
          >
            {/* The circular animated logo monogram */}
            <div className="relative p-4 rounded-full border border-white/5 bg-black/40 backdrop-blur-md shadow-glow-md">
              <Logo size={100} animateRing={true} withRing={true} />
            </div>

            {/* Premium Loading text */}
            <div className="flex flex-col items-center gap-1.5 text-center">
              <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-primary/80 animate-pulse">
                Loading Studio
              </span>
              <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-dk-muted/65">
                DK Creative Solutions
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
