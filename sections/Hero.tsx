"use client";

import { motion } from "framer-motion";
import { ArrowRight, FolderOpenDot, Sparkle } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { GlowOrb } from "@/components/shared/GlowOrb";
import { ParticlesBackground } from "@/components/shared/ParticlesBackground";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden bg-dk-bg pt-32 pb-20"
    >
      <div className="absolute inset-0 bg-grid bg-grid-fade opacity-50" />
      <ParticlesBackground density={60} />

      <GlowOrb color="gold" size={520} className="-left-40 top-10" />
      <GlowOrb
        color="silver"
        size={420}
        className="-right-32 bottom-0"
        floatClassName="animate-float"
      />

      <div className="container relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.15em] text-white/70">
            Available for freelance projects
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative my-6"
        >
          <Logo size={120} animateRing className="drop-shadow-[0_0_40px_rgba(247,165,0,0.35)]" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl text-balance font-display text-4xl font-bold leading-[1.1] text-white sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Transforming Ideas Into{" "}
          <span className="text-gradient-gold">Digital Experiences</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 max-w-2xl text-balance text-base leading-relaxed text-dk-muted sm:text-lg md:text-xl"
        >
          Professional Web Development, Video Editing and Creative Design Solutions
          for brands that want to look — and perform — a level above.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <Button asChild size="lg">
            <a href="#contact">
              Hire Me
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="#projects">
              <FolderOpenDot className="h-4 w-4" />
              View Projects
            </a>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-dk-muted"
        >
          {[
            "Website Development",
            "Video Editing",
            "UI/UX Design",
            "Poster Design",
          ].map((item) => (
            <span key={item} className="flex items-center gap-2">
              <Sparkle className="h-3 w-3 text-primary" />
              {item}
            </span>
          ))}
        </motion.div>
      </div>

    </section>
  );
}
