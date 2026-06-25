"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/shared/SectionHeading";

import { resolveIcon } from "@/lib/icons";
import type { ProcessStepItem } from "@/types";

export function Process() {
  const [processStepsList, setProcessStepsList] = useState<ProcessStepItem[]>([]);

  useEffect(() => {
    fetch("/api/content/process")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const resolved = data.map((item) => ({
            ...item,
            icon: resolveIcon(item.icon),
          }));
          setProcessStepsList(resolved);
        }
      })
      .catch((err) => console.error("Error loading process steps:", err));
  }, []);

  return (
    <section id="process" className="relative bg-dk-bg py-24 sm:py-32">
      <div className="container">
        <SectionHeading
          eyebrow="My Web & Design Workflow"
          title="Refined Development & Design"
          highlight="Process"
          description="A five-stage workflow structured for high performance, accessibility, and clean code optimization."
        />

        <div className="relative mt-20">
          {/* connecting line */}
          <div className="absolute left-6 top-0 h-full w-px bg-gradient-to-b from-primary/60 via-white/10 to-transparent lg:left-0 lg:right-0 lg:top-6 lg:h-px lg:w-auto lg:bg-gradient-to-r lg:from-transparent lg:via-primary/60 lg:to-transparent" />

          <div className="flex flex-col gap-10 lg:flex-row lg:gap-6">
            {processStepsList.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative flex flex-1 flex-col items-start gap-4 pl-16 lg:items-center lg:pl-0 lg:text-center"
                >
                  <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-full border border-primary/40 bg-[#0a0a0a] font-mono text-sm font-semibold text-primary shadow-glow-sm lg:relative lg:left-auto lg:top-auto">
                    {step.step}
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-primary lg:mt-2">
                    <Icon className="h-5 w-5" strokeWidth={1.6} />
                  </div>

                  <h3 className="font-display text-lg font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="max-w-[220px] text-sm leading-relaxed text-dk-muted">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
