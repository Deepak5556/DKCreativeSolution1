"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";

import type { StatItem } from "@/types";

export function Stats() {
  const [statsList, setStatsList] = useState<StatItem[]>([]);

  useEffect(() => {
    fetch("/api/content/stats")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setStatsList(data);
      })
      .catch((err) => console.error("Error loading stats:", err));
  }, []);

  return (
    <section className="relative border-y border-white/10 bg-[#0a0a0a] py-16">
      <div className="container">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {statsList.map((stat, i) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative flex flex-col items-center gap-2 text-center"
            >
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/10 transition-colors duration-300 group-hover:border-primary/40 sm:h-24 sm:w-24">
                <span className="absolute inset-0 rounded-full border border-dashed border-white/10 transition-transform duration-700 group-hover:rotate-90" />
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  delay={i * 0.1}
                  className="font-display text-xl font-bold text-gradient-gold sm:text-2xl"
                />
              </div>
              <p className="mt-2 text-xs font-medium uppercase tracking-[0.1em] text-dk-muted sm:text-sm">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
