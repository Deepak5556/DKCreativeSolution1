"use client";

import { motion } from "framer-motion";
import { Play, Film, Clapperboard, Sparkles } from "lucide-react";
import { ArtworkTile } from "@/components/shared/ArtworkTile";
import type { VideoItem } from "@/types";

const typeIcon = {
  reel: Film,
  short: Clapperboard,
  "motion-graphics": Sparkles,
  "before-after": Film,
};

interface VideoCardProps {
  video: VideoItem;
  index: number;
  onPlay?: (video: VideoItem) => void;
}

export function VideoCard({ video, index, onPlay }: VideoCardProps) {
  const Icon = typeIcon[video.type];

  return (
    <motion.button
      type="button"
      onClick={() => onPlay?.(video)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.07 }}
      whileHover={{ y: -6 }}
      className="group relative aspect-[9/16] overflow-hidden rounded-2xl border border-white/10 border-glow-hover text-left"
    >
      {video.thumbnailUrl ? (
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <ArtworkTile seed={video.id} icon={Icon} accent={index % 2 === 0 ? "gold" : "silver"} className="h-full w-full" />
      )}

      <div className="absolute inset-0 flex items-center justify-center">
        <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
          <span className="absolute inset-0 rounded-full border border-primary/50 animate-pulse-ring" />
          <Play className="h-5 w-5 fill-white text-white" />
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-primary">
            {video.category}
          </p>
          <p className="mt-1 text-sm font-semibold text-white">{video.title}</p>
        </div>
        <span className="rounded-full bg-black/50 px-2 py-1 font-mono text-[10px] text-white/80">
          {video.duration}
        </span>
      </div>
    </motion.button>
  );
}
