"use client";

import { useMemo, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ProjectCard } from "@/components/shared/ProjectCard";
import { FilterPills } from "@/components/shared/FilterPills";
import { projectCategories } from "@/data/data";
import { resolveIcon } from "@/lib/icons";
import type { ProjectItem, ProjectCategory } from "@/types";

type FilterValue = "All" | ProjectCategory;

const filterOptions = projectCategories.map((cat) => ({ id: cat, label: cat }));

export function Projects() {
  const [filter, setFilter] = useState<FilterValue>("All");
  const [projectsList, setProjectsList] = useState<ProjectItem[]>([]);

  useEffect(() => {
    fetch("/api/content/projects")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const resolved = data.map((item) => ({
            ...item,
            icon: resolveIcon(item.icon),
          }));
          setProjectsList(resolved);
        }
      })
      .catch((err) => console.error("Error loading projects:", err))
      .finally(() => {
        window.dispatchEvent(new CustomEvent("sectionLoaded", { detail: "projects" }));
      });
  }, []);

  const filtered = useMemo(
    () => (filter === "All" ? projectsList : projectsList.filter((p) => p.category === filter)),
    [filter, projectsList]
  );

  return (
    <section id="projects" className="relative bg-[#0a0a0a] py-24 sm:py-32">
      <div className="container">
        <SectionHeading
          eyebrow="Featured Work"
          title="Projects across web and"
          highlight="mobile"
          description="A selection of products built end-to-end — from data model to final UI polish."
        />

        <FilterPills
          options={filterOptions}
          active={filter}
          onChange={(v) => setFilter(v as FilterValue)}
          layoutId="projects-filter-pill"
          className="mt-10"
        />

        <motion.div
          layout
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.94, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.35, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              >
                <ProjectCard project={project} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <p className="mt-20 text-center text-sm text-white/30">
            No projects in this category yet.
          </p>
        )}
      </div>
    </section>
  );
}
