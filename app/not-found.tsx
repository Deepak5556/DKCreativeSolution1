"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#050505] px-4 text-white">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid bg-grid-fade opacity-30" />

      {/* Gold glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full blur-[120px]"
        style={{ background: "radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Giant 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative select-none"
        >
          <span
            className="block font-display font-black leading-none tracking-tighter"
            style={{
              fontSize: "clamp(7rem, 22vw, 16rem)",
              background: "linear-gradient(135deg, #D4AF37 0%, #F5E27A 45%, #B8860B 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            404
          </span>
          {/* Mirror reflection */}
          <span
            aria-hidden
            className="pointer-events-none absolute top-full left-0 right-0 block font-display font-black leading-none tracking-tighter"
            style={{
              fontSize: "clamp(7rem, 22vw, 16rem)",
              background: "linear-gradient(135deg, #D4AF37 0%, #F5E27A 45%, #B8860B 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              opacity: 0.06,
              transform: "scaleY(-1)",
              maskImage: "linear-gradient(to bottom, black, transparent 60%)",
              WebkitMaskImage: "linear-gradient(to bottom, black, transparent 60%)",
            }}
          >
            404
          </span>
        </motion.div>

        {/* Heading + body */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 flex flex-col items-center gap-4"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm">
            <Compass className="h-5 w-5 text-[#D4AF37]" />
          </div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">
            Page not found
          </h1>
          <p className="max-w-sm text-sm leading-relaxed text-white/40">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            Let&apos;s get you back on track.
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-black shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_24px_rgba(212,175,55,0.4)] active:scale-95"
            style={{ background: "linear-gradient(135deg, #D4AF37, #F5E27A, #B8860B)" }}
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
            Back to Home
          </Link>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white/60 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
          >
            Contact Us
          </Link>
        </motion.div>

        {/* Decorative pill row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.8 }}
          className="mt-16 flex items-center gap-1.5"
        >
          {[6, 6, 28, 6, 6].map((w, i) => (
            <span
              key={i}
              className="block h-1.5 rounded-full"
              style={{
                width: w,
                background:
                  i === 2
                    ? "linear-gradient(90deg, #D4AF37, #F5E27A)"
                    : "rgba(255,255,255,0.12)",
              }}
            />
          ))}
        </motion.div>
      </div>
    </main>
  );
}
