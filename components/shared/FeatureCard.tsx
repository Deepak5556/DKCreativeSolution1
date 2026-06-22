"use client";

import { motion } from "framer-motion";
import type { FeatureItem } from "@/types";

interface FeatureCardProps {
  feature: FeatureItem;
  index: number;
}

export function FeatureCard({ feature, index }: FeatureCardProps) {
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
      whileHover={{ y: -4 }}
      className="group flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6 border-glow-hover"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-gradient text-dk-bg shadow-glow-sm transition-transform duration-300 group-hover:scale-110">
        <Icon className="h-5 w-5" strokeWidth={1.8} />
      </div>
      <h3 className="font-display text-lg font-semibold text-white">{feature.title}</h3>
      <p className="text-sm leading-relaxed text-dk-muted">{feature.description}</p>
    </motion.div>
  );
}
