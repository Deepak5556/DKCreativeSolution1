"use client";

import { useEffect, useState } from "react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { FeatureCard } from "@/components/shared/FeatureCard";

import { resolveIcon } from "@/lib/icons";
import type { FeatureItem } from "@/types";

export function WhyChooseUs() {
  const [featuresList, setFeaturesList] = useState<FeatureItem[]>([]);

  useEffect(() => {
    fetch("/api/content/features")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const resolved = data.map((item) => ({
            ...item,
            icon: resolveIcon(item.icon),
          }));
          setFeaturesList(resolved);
        }
      })
      .catch((err) => console.error("Error loading features:", err));
  }, []);

  return (
    <section className="relative bg-dk-bg py-24 sm:py-32">
      <div className="container">
        <SectionHeading
          eyebrow="Why Partner With Us"
          title="A Brand Identity & Web"
          highlight="Development Studio"
          description="DK Creative Solutions delivers high-performance websites, creative graphic designs, and custom SEO services with transparent communication."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuresList.map((feature, i) => (
            <FeatureCard key={feature.id} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
