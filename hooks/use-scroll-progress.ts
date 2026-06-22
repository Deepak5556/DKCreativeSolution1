"use client";

import { useScroll, useSpring } from "framer-motion";

/**
 * Returns a smoothed (spring-damped) scroll progress motion value (0–1)
 * used to drive the navbar's top progress bar.
 */
export function useScrollProgress() {
  const { scrollYProgress } = useScroll();
  return useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
}
