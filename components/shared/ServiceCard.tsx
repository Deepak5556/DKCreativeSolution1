"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { ServiceItem } from "@/types";

interface ServiceCardProps {
  service: ServiceItem;
  index: number;
  onSelectQuote?: (service: ServiceItem) => void;
}

export function ServiceCard({ service, index, onSelectQuote }: ServiceCardProps) {
  const Icon = service.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col gap-5 overflow-hidden rounded-2xl border border-white/10 bg-card p-7 border-glow-hover"
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/0 blur-2xl transition-all duration-500 group-hover:bg-primary/20"
        aria-hidden="true"
      />

      <div className="flex items-center justify-between">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-primary transition-all duration-300 group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:shadow-glow-sm">
          <Icon className="h-6 w-6" strokeWidth={1.6} />
        </div>
        <span className="font-mono text-xs text-white/20">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="font-display text-xl font-semibold text-white">{service.title}</h3>
        <p className="text-sm leading-relaxed text-dk-muted">{service.description}</p>
      </div>

      <ul className="flex flex-col gap-2 border-t border-white/10 pt-4">
        {service.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-xs text-white/70">
            <span className="h-1 w-1 rounded-full bg-primary" />
            {feature}
          </li>
        ))}
      </ul>

      {service.actionType === "link" ? (
        <a
          href={service.externalLink || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          Get a quote
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      ) : (
        <button
          type="button"
          onClick={() => onSelectQuote?.(service)}
          className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100 focus:outline-none"
        >
          Get a quote
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      )}
    </motion.div>
  );
}
