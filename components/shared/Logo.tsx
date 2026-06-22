"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: number;
  withRing?: boolean;
  animateRing?: boolean;
  className?: string;
}

/**
 * The DK monogram — a circular badge with a tick-marked bezel ring (the
 * site's recurring signature motif, echoed in the hero, stats, and process
 * sections) and a tight "DK" wordmark rendered in gold gradient.
 *
 * No source logo file was supplied, so this is an original mark designed
 * to match the requested luxury-tech direction. Swap the contents of this
 * component (or replace /public/logo.svg) to drop in a real logo later.
 */
export function Logo({ size = 56, withRing = true, animateRing = false, className }: LogoProps) {
  const gradId = useId();
  const glowId = useId();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      role="img"
      aria-label="DK Creative Solutions logo"
    >
      <defs>
        <linearGradient id={gradId} x1="10" y1="10" x2="110" y2="110" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFB800" />
          <stop offset="50%" stopColor="#F7A500" />
          <stop offset="100%" stopColor="#FFB800" />
        </linearGradient>
        <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F7A500" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#F7A500" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ambient glow */}
      <circle cx="60" cy="60" r="58" fill={`url(#${glowId})`} />

      {/* outer tick bezel, echoes a watch/dial — the recurring motif */}
      {withRing && (
        <g
          className={animateRing ? "origin-center animate-spin-slow" : undefined}
          style={{ transformOrigin: "60px 60px" }}
        >
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i * 360) / 24;
            const isMajor = i % 6 === 0;
            return (
              <line
                key={i}
                x1="60"
                y1={isMajor ? 6 : 9}
                x2="60"
                y2={isMajor ? 13 : 12}
                stroke={`url(#${gradId})`}
                strokeWidth={isMajor ? 2 : 1}
                strokeLinecap="round"
                opacity={isMajor ? 0.95 : 0.45}
                transform={`rotate(${angle} 60 60)`}
              />
            );
          })}
        </g>
      )}

      {/* inner badge ring */}
      <circle cx="60" cy="60" r="44" stroke={`url(#${gradId})`} strokeWidth="1.5" opacity="0.55" />
      <circle cx="60" cy="60" r="38" fill="#0a0a0a" stroke={`url(#${gradId})`} strokeWidth="1" opacity="0.9" />

      {/* DK wordmark */}
      <text
        x="60"
        y="69"
        textAnchor="middle"
        fontFamily="var(--font-display), sans-serif"
        fontWeight={700}
        fontSize="30"
        letterSpacing="-1.5"
        fill={`url(#${gradId})`}
      >
        DK
      </text>
      <line x1="44" y1="76" x2="76" y2="76" stroke={`url(#${gradId})`} strokeWidth="1.5" opacity="0.8" />
    </svg>
  );
}
