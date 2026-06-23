import { cn } from "@/lib/utils";

interface GlowOrbProps {
  color?: "purple" | "silver" | "gold";
  size?: number;
  className?: string;
  floatClassName?: string;
}

/**
 * A large, blurred, ambient orb used behind hero/CTA/contact content to
 * create the "premium glow" atmosphere. Purely decorative — aria-hidden.
 */
export function GlowOrb({
  color = "gold",
  size = 480,
  className,
  floatClassName = "animate-float-slow",
}: GlowOrbProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute rounded-full opacity-40 blur-3xl", floatClassName, className)}
      style={{
        width: size,
        height: size,
        background:
          color === "silver"
            ? "radial-gradient(circle, rgba(214,208,203,0.4) 0%, rgba(214,208,203,0) 70%)"
            : "radial-gradient(circle, rgba(212,175,55,0.45) 0%, rgba(212,175,55,0) 70%)",
      }}
    />
  );
}
