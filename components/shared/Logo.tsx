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
 * Enhanced withClockwork mechanical watch-movement animations:
 * 1. Clockwise slow rotation for the outer bezel ticks.
 * 2. Counter-clockwise slow rotation for the inner dots ring.
 * 3. Golden expanding pulse wave ring.
 * 4. Spherical crystal watch reflection background (radial gradient).
 * 5. Interactive hover speeds up rotation, glows and scales with smooth physics.
 */
export function Logo({ size = 56, withRing = true, animateRing = true, className }: LogoProps) {
  const gradId = useId();
  const glowId = useId();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("logo-container shrink-0", className)}
      role="img"
      aria-label="DK Creative Solutions logo"
    >
      <style>{`
        @keyframes logo-spin-cw {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes logo-spin-ccw {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes logo-wave {
          0% {
            transform: scale(0.72);
            opacity: 0.9;
          }
          100% {
            transform: scale(1.15);
            opacity: 0;
          }
        }
        .logo-container {
          transform-origin: center;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.6s ease;
          cursor: pointer;
        }
        .logo-container:hover {
          transform: scale(1.08);
          filter: drop-shadow(0 0 20px rgba(212, 175, 55, 0.45));
        }
        .logo-spin-clockwise {
          animation: logo-spin-cw 20s linear infinite;
          transform-origin: 60px 60px;
          transition: animation-duration 0.6s ease;
        }
        .logo-container:hover .logo-spin-clockwise {
          animation-duration: 6s;
        }
        .logo-spin-counter {
          animation: logo-spin-ccw 28s linear infinite;
          transform-origin: 60px 60px;
          transition: animation-duration 0.6s ease;
        }
        .logo-container:hover .logo-spin-counter {
          animation-duration: 9s;
        }
        .logo-pulse-ring {
          animation: logo-wave 3s cubic-bezier(0.16, 1, 0.3, 1) infinite;
          transform-origin: 60px 60px;
          pointer-events: none;
        }
      `}</style>

      <defs>
        <linearGradient id={gradId} x1="10" y1="10" x2="110" y2="110" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F4D76A" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#E6C65C" />
        </linearGradient>
        <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="polishedMetal" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
          <stop offset="0%" stopColor="#1e1e1e" />
          <stop offset="70%" stopColor="#0d0d0d" />
          <stop offset="100%" stopColor="#030303" />
        </radialGradient>
      </defs>

      {/* Ambient background glow */}
      <circle cx="60" cy="60" r="58" fill={`url(#${glowId})`} />

      {/* Expanding pulse wave ring (representing clockwork beat) */}
      {withRing && animateRing && (
        <circle
          cx="60"
          cy="60"
          r="52"
          stroke={`url(#${gradId})`}
          strokeWidth="1.2"
          opacity="0"
          className="logo-pulse-ring"
        />
      )}

      {/* Outer ticks bezel spinning clockwise */}
      {withRing && (
        <g className={animateRing ? "logo-spin-clockwise" : undefined}>
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
                strokeWidth={isMajor ? 2.2 : 1.2}
                strokeLinecap="round"
                opacity={isMajor ? 0.95 : 0.45}
                transform={`rotate(${angle} 60 60)`}
              />
            );
          })}
        </g>
      )}

      {/* Inner dots ring spinning counter-clockwise */}
      {withRing && (
        <g className={animateRing ? "logo-spin-counter" : undefined}>
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i * 360) / 16;
            return (
              <circle
                key={i}
                cx="60"
                cy="17"
                r="1.2"
                fill={`url(#${gradId})`}
                opacity="0.55"
                transform={`rotate(${angle} 60 60)`}
              />
            );
          })}
        </g>
      )}

      {/* Inner badge rings & polished metal backing */}
      <circle cx="60" cy="60" r="44" stroke={`url(#${gradId})`} strokeWidth="1.5" opacity="0.6" />
      <circle cx="60" cy="60" r="38" fill="url(#polishedMetal)" stroke={`url(#${gradId})`} strokeWidth="1" opacity="0.95" />

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
