import type { LucideIcon } from "lucide-react";

export interface ServiceItem {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  actionType?: "popup" | "link";
  externalLink?: string;
}

export type ProjectCategory = "Web Development" | "Mobile Apps" | "Both";

export interface ProjectItem {
  id: string;
  category: ProjectCategory;
  title: string;
  description: string;
  tech: string[];
  liveUrl?: string;
  githubUrl?: string;
  accent: "gold" | "silver";
  icon: LucideIcon;
  thumbnailUrl?: string;
}

export interface VideoItem {
  id: string;
  title: string;
  category: string;
  duration: string;
  type: "reel" | "short" | "motion-graphics";
  videoUrl?: string;
  thumbnailUrl?: string;
}

export type PosterCategory =
  | "Instagram Posters"
  | "Event Posters"
  | "Promotional Posters"
  | "Business Posters"
  | "Before / After";

export interface PosterItem {
  id: string;
  title: string;
  category: PosterCategory;
  aspect: "square" | "portrait" | "story";
  palette: "gold" | "silver" | "mixed";
  imageUrl?: string;
  beforeImageUrl?: string;
}

export interface FeatureItem {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  initials: string;
}

export interface ProcessStepItem {
  id: string;
  step: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface StatItem {
  id: string;
  value: number;
  suffix: string;
  label: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface QueryItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  priority: string;
  subCategory?: string;
  details?: string;
  createdAt: string;
}
