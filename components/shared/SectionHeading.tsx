"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  highlight?: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  highlight,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2.5"
      >
        <span className="h-px w-6 bg-gold-gradient" />
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
          {eyebrow}
        </span>
        <span className="h-px w-6 bg-gold-gradient" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className={cn(
          "text-balance font-display text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl",
          align === "center" ? "max-w-2xl" : "max-w-xl"
        )}
      >
        {title}{" "}
        {highlight && <span className="text-gradient-gold">{highlight}</span>}
      </motion.h2>

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={cn(
            "text-balance text-base text-dk-muted sm:text-lg",
            align === "center" ? "max-w-xl" : "max-w-lg"
          )}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
