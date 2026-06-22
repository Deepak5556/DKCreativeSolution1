import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes safely, resolving conflicts in favour of the
 * classes that appear last. Used by every component in the design system.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Deterministic string -> [0, 1) hash (FNV-1a based). Used to derive
 * generative artwork patterns from a stable id so server and client render
 * identical markup (no hydration mismatch, unlike Math.random()).
 */
export function hashSeed(seed: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return ((hash >>> 0) % 1000) / 1000;
}

/** Maps a seed deterministically into a numeric range. */
export function seededRange(seed: string, min: number, max: number): number {
  return min + hashSeed(seed) * (max - min);
}
