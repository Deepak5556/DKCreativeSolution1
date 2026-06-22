"use client";

import { useCounter } from "@/hooks/use-counter";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  duration?: number;
  delay?: number;
  className?: string;
}

export function AnimatedCounter({
  value,
  suffix = "",
  duration,
  delay,
  className,
}: AnimatedCounterProps) {
  const { ref, value: current } = useCounter(value, { duration, delay });

  return (
    <div ref={ref} className={className}>
      {current}
      {suffix}
    </div>
  );
}
