import { Star, Quote } from "lucide-react";
import type { TestimonialItem } from "@/types";

interface TestimonialCardProps {
  testimonial: TestimonialItem;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="glass-strong flex h-full flex-col gap-6 rounded-2xl p-8">
      <Quote className="h-8 w-8 text-primary/40" />

      <p className="flex-1 text-balance text-base leading-relaxed text-white/90">
        {testimonial.quote}
      </p>

      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className="h-3.5 w-3.5"
            strokeWidth={0}
            fill={i < testimonial.rating ? "#F7A500" : "#2a2a2a"}
          />
        ))}
      </div>

      <div className="flex items-center gap-3 border-t border-white/10 pt-5">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-gradient font-display text-sm font-semibold text-dk-bg">
          {testimonial.initials}
        </span>
        <div>
          <p className="text-sm font-semibold text-white">{testimonial.name}</p>
          <p className="text-xs text-dk-muted">
            {testimonial.role}, {testimonial.company}
          </p>
        </div>
      </div>
    </div>
  );
}
