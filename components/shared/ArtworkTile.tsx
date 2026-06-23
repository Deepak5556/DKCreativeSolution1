import type { LucideIcon } from "lucide-react";
import { cn, seededRange } from "@/lib/utils";

interface ArtworkTileProps {
  seed: string;
  icon: LucideIcon;
  label?: string;
  accent?: "gold" | "purple" | "silver" | "mixed";
  className?: string;
}

/**
 * A deterministically-generated abstract artwork tile, used as the visual
 * surface for project, poster, and video cards in place of real
 * screenshots. Replace with next/image once real project/client assets are
 * available — every card component accepts an optional `image` prop for
 * exactly that purpose.
 */
export function ArtworkTile({ seed, icon: Icon, label, accent = "gold", className }: ArtworkTileProps) {
  const angle = Math.round(seededRange(seed + "a", 20, 200));
  const blobX = seededRange(seed + "x", 10, 90);
  const blobY = seededRange(seed + "y", 10, 90);
  const blobX2 = seededRange(seed + "x2", 10, 90);
  const blobY2 = seededRange(seed + "y2", 10, 90);
  const rotate = Math.round(seededRange(seed + "r", -18, 18));

  const resolvedAccent = (accent === "purple" || accent === "gold") ? "gold" : accent;
  const accentColor =
    resolvedAccent === "silver" ? "#D6D0CB" : resolvedAccent === "mixed" ? "#F4D76A" : "#D4AF37";
  const accentColor2 = resolvedAccent === "silver" ? "#A3A3A3" : "#E6C65C";

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden bg-[#0c0c0c]",
        className
      )}
      style={{
        backgroundImage: `linear-gradient(${angle}deg, #0a0a0a 0%, #131313 100%)`,
      }}
    >
      {/* generative gradient blobs */}
      <div
        className="absolute h-2/3 w-2/3 rounded-full opacity-25 blur-3xl"
        style={{
          left: `${blobX}%`,
          top: `${blobY}%`,
          transform: "translate(-50%, -50%)",
          background: accentColor,
        }}
      />
      <div
        className="absolute h-1/2 w-1/2 rounded-full opacity-15 blur-3xl"
        style={{
          left: `${blobX2}%`,
          top: `${blobY2}%`,
          transform: "translate(-50%, -50%)",
          background: accentColor2,
        }}
      />

      {/* engineering grid */}
      <div className="absolute inset-0 bg-grid opacity-40" />

      {/* large faint icon, the focal mark of the tile */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ transform: `rotate(${rotate}deg)` }}
      >
        <Icon className="h-[42%] w-[42%] text-white/[0.07]" strokeWidth={1} />
      </div>

      {/* thin corner accents */}
      <div className="absolute left-5 top-5 h-3 w-3 border-l border-t border-white/20" />
      <div className="absolute bottom-5 right-5 h-3 w-3 border-b border-r border-white/20" />

      {label && (
        <span className="absolute bottom-5 left-5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
          {label}
        </span>
      )}

      {/* vignette for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
    </div>
  );
}
