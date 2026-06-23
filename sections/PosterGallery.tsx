"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { PosterCard } from "@/components/shared/PosterCard";
import { BeforeAfterImageSlider } from "@/components/shared/BeforeAfterImageSlider";
import { FilterPills } from "@/components/shared/FilterPills";
import { posterCategories } from "@/data/data";
import type { PosterItem } from "@/types";

const filterOptions = posterCategories.map((cat) => ({ id: cat, label: cat }));

export function PosterGallery() {
  const [filter, setFilter] = useState<string>("All");
  const [postersList, setPostersList] = useState<PosterItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content/posters")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPostersList(data);
      })
      .catch((err) => console.error("Error loading posters:", err))
      .finally(() => {
        setLoading(false);
        window.dispatchEvent(new CustomEvent("sectionLoaded", { detail: "posters" }));
      });
  }, []);

  const filtered = useMemo(
    () => (filter === "All" ? postersList : postersList.filter((p) => p.category === filter)),
    [filter, postersList]
  );

  const beforeAfterPosters = useMemo(
    () => filtered.filter((p) => p.category === "Before / After"),
    [filtered]
  );
  const regularPosters = useMemo(
    () => filtered.filter((p) => p.category !== "Before / After"),
    [filtered]
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

        <FilterPills
          options={filterOptions}
          active={filter}
          onChange={setFilter}
          layoutId="posters-filter-pill"
          className="mt-10"
        />

        {/* ── Content ── */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-20 flex items-center justify-center"
            >
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-white/60" />
            </motion.div>
          ) : filtered.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-20 text-center text-sm text-white/30"
            >
              No posters in this category yet.
            </motion.p>
          ) : (
            <motion.div
              key={filter}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {/* Before / After grid — 1 col mobile → 2 col sm → 3 col lg, compact size */}
              {beforeAfterPosters.length > 0 && (
                <div className="mt-14">
                  {filter === "All" && (
                    <p className="mb-5 text-xs font-mono uppercase tracking-widest text-white/30">
                      Before / After
                    </p>
                  )}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {beforeAfterPosters.map((poster) => (
                      <BeforeAfterImageSlider key={poster.id} poster={poster} />
                    ))}
                  </div>
                </div>
              )}

              {/* Regular posters masonry */}
              {regularPosters.length > 0 && (
                <div
                  className={`${
                    beforeAfterPosters.length > 0 ? "mt-12" : "mt-14"
                  } columns-2 gap-3 sm:gap-4 sm:columns-3 lg:columns-4`}
                >
                  {regularPosters.map((poster, i) => (
                    <PosterCard key={poster.id} poster={poster} index={i} />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
