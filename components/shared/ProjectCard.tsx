"use client";

import Image from "next/image";

import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { ArtworkTile } from "@/components/shared/ArtworkTile";
import { Badge } from "@/components/ui/badge";
import type { ProjectItem } from "@/types";

interface ProjectCardProps {
  project: ProjectItem;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.08 }}
      whileHover={{ y: -6 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-card border-glow-hover"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900">
        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
          {project.thumbnailUrl ? (
            <Image
              src={project.thumbnailUrl}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          ) : (
            <ArtworkTile
              seed={project.id}
              icon={project.icon}
              label={project.category}
              accent={project.accent}
              className="h-full w-full"
            />
          )}
        </div>
        <Badge
          variant={project.accent === "silver" ? "silver" : "default"}
          className="absolute right-4 top-4"
        >
          {project.category}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="font-display text-lg font-semibold text-white">{project.title}</h3>
        <p className="text-sm leading-relaxed text-dk-muted">{project.description}</p>

        <div className="mt-1 flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] text-white/70"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-3 border-t border-white/10 pt-4">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-gold-gradient px-4 py-2 text-xs font-semibold text-dk-bg transition-transform hover:-translate-y-0.5"
            >
              Live Demo
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white transition-colors hover:border-primary/40 hover:text-primary"
            >
              <Github className="h-3.5 w-3.5" />
              GitHub
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
