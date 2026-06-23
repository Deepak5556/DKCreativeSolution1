"use client";

import { useMemo, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ProjectCard } from "@/components/shared/ProjectCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { projectCategories } from "@/data/data";
import { resolveIcon } from "@/lib/icons";
import type { ProjectItem, ProjectCategory } from "@/types";

type FilterValue = "All" | ProjectCategory;

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

        <div className="mt-10 flex justify-center">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterValue)}>
            <TabsList>
              {projectCategories.map((cat) => (
                <TabsTrigger key={cat} value={cat}>
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <motion.div
          layout
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <ProjectCard project={project} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
