"use client";

import Image from "next/image";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { GitCompareArrows, CircleOff, Sparkles } from "lucide-react";
import { ArtworkTile } from "@/components/shared/ArtworkTile";
import type { VideoItem } from "@/types";

interface BeforeAfterSliderProps {
  video: VideoItem;
}

/**
 * A draggable / touch-friendly before-after comparison reveal, used in the
 * Video Editing Portfolio section to demonstrate colour-grade and edit
 * transformations.
 */
export function BeforeAfterSlider({ video }: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const dragging = useRef(false);
  const [containerWidth, setContainerWidth] = useState(0);

  const updateWidth = useCallback(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.getBoundingClientRect().width);
    }
  }, []);

  useEffect(() => {
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [updateWidth]);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <div
        ref={containerRef}
        className="relative aspect-video w-full cursor-ew-resize overflow-hidden rounded-2xl border border-white/10 border-glow-hover select-none"
        onPointerDown={(e) => {
          dragging.current = true;
          updateFromClientX(e.clientX);
        }}
        onPointerMove={(e) => {
          if (dragging.current) updateFromClientX(e.clientX);
        }}
        onPointerUp={() => (dragging.current = false)}
        onPointerLeave={() => (dragging.current = false)}
      >
        {/* After (full, gold) */}
        <div className="absolute inset-0">
          {video.thumbnailUrl ? (
            <Image
              src={video.thumbnailUrl}
              alt="After edit"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          ) : (
            <ArtworkTile seed={video.id + "-after"} icon={Sparkles} accent="gold" label="After" className="h-full w-full" />
          )}
        </div>

        {/* Before (clipped, desaturated) */}
        <div
          className="absolute inset-0 overflow-hidden grayscale"
          style={{ width: `${position}%` }}
        >
          {video.thumbnailUrl ? (
            <div style={{ width: containerWidth }} className="absolute inset-y-0 left-0 h-full">
              <Image
                src={video.thumbnailUrl}
                alt="Before edit"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
          ) : (
            <ArtworkTile seed={video.id + "-before"} icon={CircleOff} accent="silver" label="Before" className="h-full w-full" />
          )}
        </div>

        {/* Handle */}
        <motion.div
          className="absolute inset-y-0 z-10 flex w-0.5 -translate-x-1/2 flex-col items-center bg-white/80"
          style={{ left: `${position}%` }}
        >
          <span className="absolute top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-gold-gradient text-dk-bg shadow-glow-sm">
            <GitCompareArrows className="h-4 w-4" />
          </span>
        </motion.div>
      </div>

      <div className="flex items-center justify-between px-1">
        <p className="text-sm font-semibold text-white">{video.title}</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-dk-muted">
          Drag to compare
        </p>
      </div>
    </div>
  );
}
