"use client";

import { motion, AnimatePresence } from "framer-motion";

interface FilterOption {
  id: string;
  label: string;
}

interface FilterPillsProps {
  options: FilterOption[];
  active: string;
  onChange: (id: string) => void;
  /** Layout ID — must be unique per page if multiple FilterPills exist */
  layoutId?: string;
  className?: string;
}

/**
 * Premium pill-style filter bar used across Projects, Videos, and Posters sections.
 * Horizontally scrollable on mobile, spring-animated gold sliding indicator on desktop.
 */
export function FilterPills({
  options,
  active,
  onChange,
  layoutId = "filter-pill",
  className = "",
}: FilterPillsProps) {
  return (
    <div className={`overflow-x-auto pb-1 hide-scrollbar ${className}`}>
      <div className="flex min-w-max items-center gap-1.5 px-px justify-center">
        {options.map((opt) => {
          const isActive = active === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onChange(opt.id)}
              className={`
                relative rounded-full px-4 py-2 text-xs font-semibold
                whitespace-nowrap transition-colors duration-300
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-[#D4AF37]/60
                ${isActive
                  ? "text-black"
                  : "text-white/45 hover:text-white/80 bg-white/[0.05] hover:bg-white/[0.09]"
                }
              `}
            >
              {/* Animated gold pill indicator */}
              <AnimatePresence>
                {isActive && (
                  <motion.span
                    key="pill"
                    layoutId={layoutId}
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        "linear-gradient(135deg, #D4AF37 0%, #E6C65C 40%, #F4D76A 70%, #FFD700 100%)",
                      boxShadow: "0 2px 16px rgba(212,175,55,0.35)",
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
              </AnimatePresence>
              <span className="relative z-10">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
