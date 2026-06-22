"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, animate } from "framer-motion";

interface UseCounterOptions {
  duration?: number;
  delay?: number;
}

/**
 * Animates a number from 0 to `target` once the returned ref scrolls into
 * view. Used by the Stats section's animated counters.
 */
export function useCounter(target: number, options: UseCounterOptions = {}) {
  const { duration = 1.8, delay = 0 } = options;
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(0, target, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setValue(Math.round(latest)),
    });

    return () => controls.stop();
  }, [isInView, target, duration, delay]);

  return { ref, value, isInView };
}
