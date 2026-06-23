"use client";

import Image from "next/image";
import { useRef, useState, useCallback } from "react";
import { GitCompareArrows } from "lucide-react";
import type { PosterItem } from "@/types";

const aspectClass: Record<string, string> = {
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  story: "aspect-[9/16]",
};

interface BeforeAfterImageSliderProps {
  poster: PosterItem;
}

export function BeforeAfterImageSlider({ poster }: BeforeAfterImageSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const isDragging = useRef(false);

  const calcPosition = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const raw = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(98, Math.max(2, raw)));
  }, []);

  const aspect = aspectClass[poster.aspect] ?? "aspect-square";

  return (
    <div className="group flex flex-col gap-3">
      {/* ── Image comparison container ── */}
      <div
        ref={containerRef}
        className={`relative w-full select-none overflow-hidden rounded-2xl border border-white/10 cursor-col-resize shadow-lg ${aspect}`}
        onPointerDown={(e) => {
          isDragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          calcPosition(e.clientX);
        }}
        onPointerMove={(e) => {
          if (isDragging.current) calcPosition(e.clientX);
        }}
        onPointerUp={() => { isDragging.current = false; }}
        onPointerCancel={() => { isDragging.current = false; }}
      >
        {/* ── AFTER layer — full width underneath ── */}
        <div className="absolute inset-0">
          {poster.imageUrl ? (
            <Image
              src={poster.imageUrl}
              alt={`${poster.title} — after`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
              className="object-cover"
              draggable={false}
              priority
            />
          ) : (
            <div className="h-full w-full bg-neutral-900 flex items-center justify-center">
              <span className="text-xs text-white/30 uppercase tracking-widest">After</span>
            </div>
          )}
        </div>

        {/* ── BEFORE layer — clipped to `position`% from the left ── */}
        {/*    The trick: clip the outer div to position%, then inside use   */}
        {/*    a fixed-position container anchored to the slider's left edge */}
        {/*    so the image never stretches. We use left:0 + width: 100vw   */}
        {/*    equivalent by anchoring to the parent's full width via CSS.   */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          {poster.beforeImageUrl ? (
            <Image
              src={poster.beforeImageUrl}
              alt={`${poster.title} — before`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
              className="object-cover"
              draggable={false}
              priority
            />
          ) : (
            <div className="h-full w-full bg-neutral-800 flex items-center justify-center">
              <span className="text-xs text-white/30 uppercase tracking-widest">Before</span>
            </div>
          )}
        </div>

        {/* ── Divider line + handle ── */}
        <div
          className="pointer-events-none absolute inset-y-0 z-20 w-px bg-white/70"
          style={{ left: `${position}%` }}
        >
          {/* Handle circle */}
          <div
            className="absolute top-1/2 left-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full shadow-lg"
            style={{
              background: "linear-gradient(135deg, #D4AF37, #E6C65C, #F4D76A)",
            }}
          >
            <GitCompareArrows className="h-3.5 w-3.5 text-black" />
          </div>
        </div>

        {/* ── Corner labels ── */}
        <span className="pointer-events-none absolute bottom-2 left-2 z-10 rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white backdrop-blur-sm">
          Before
        </span>
        <span className="pointer-events-none absolute bottom-2 right-2 z-10 rounded bg-white/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white backdrop-blur-sm">
          After
        </span>
      </div>

      {/* ── Card footer ── */}
      <div className="flex items-center justify-between px-0.5">
        <p className="text-xs font-semibold text-white truncate mr-2">{poster.title}</p>
        <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/40 whitespace-nowrap flex items-center gap-1">
          <span className="inline-block h-px w-3 bg-white/20" />
          Drag
        </p>
      </div>
    </div>
  );
}
