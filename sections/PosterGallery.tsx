"use client";

import { useMemo, useState, useEffect } from "react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { PosterCard } from "@/components/shared/PosterCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { posterCategories } from "@/data/data";
import type { PosterItem } from "@/types";

export function PosterGallery() {
  const [filter, setFilter] = useState<string>("All");
  const [postersList, setPostersList] = useState<PosterItem[]>([]);

  useEffect(() => {
    fetch("/api/content/posters")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPostersList(data);
      })
      .catch((err) => console.error("Error loading posters:", err))
      .finally(() => {
        window.dispatchEvent(new CustomEvent("sectionLoaded", { detail: "posters" }));
      });
  }, []);

  const filtered = useMemo(
    () => (filter === "All" ? postersList : postersList.filter((p) => p.category === filter)),
    [filter, postersList]
  );

  return (
    <section id="posters" className="relative bg-[#0a0a0a] py-24 sm:py-32">
      <div className="container">
        <SectionHeading
          eyebrow="Poster Design"
          title="Visuals designed to"
          highlight="stop the scroll"
          description="Instagram posts, event posters, promotions, and business collateral — all built on a consistent brand system."
        />

        <div className="mt-10 flex justify-center">
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList>
              {posterCategories.map((cat) => (
                <TabsTrigger key={cat} value={cat}>
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="mt-14 columns-2 gap-4 sm:columns-3 lg:columns-4">
          {filtered.map((poster, i) => (
            <PosterCard key={poster.id} poster={poster} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
