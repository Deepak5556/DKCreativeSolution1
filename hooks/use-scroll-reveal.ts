"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";

interface UseScrollRevealOptions {
  once?: boolean;
  margin?: string;
}

/**
 * Returns a ref + boolean used to trigger scroll-reveal animations.
 * Centralising this keeps every section's reveal threshold consistent.
 */
export function useScrollReveal(options: UseScrollRevealOptions = {}) {
  const { once = true, margin = "-100px" } = options;
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: margin as `${number}px` });

  return { ref, isInView };
}
