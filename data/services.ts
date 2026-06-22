import {
  Code2,
  Film,
  Image as ImageIcon,
  Palette,
  Rocket,
  LayoutTemplate,
} from "lucide-react";
import type { ServiceItem } from "@/types";

export const services: ServiceItem[] = [
  {
    id: "web-development",
    icon: Code2,
    title: "Web Development",
    description:
      "Fast, scalable websites built on modern frameworks — engineered for performance, accessibility, and growth.",
    features: ["Next.js & React", "API integrations", "CMS-driven content"],
    actionType: "popup"
  },
  {
    id: "video-editing",
    icon: Film,
    title: "Video Editing",
    description:
      "Cinematic edits, motion graphics, and short-form content that hold attention and drive engagement.",
    features: ["Reels & Shorts", "Color grading", "Motion graphics"],
    actionType: "popup"
  },
  {
    id: "poster-design",
    icon: ImageIcon,
    title: "Poster Design",
    description:
      "Bold visual identity pieces for campaigns, events, and promotions — designed to stop the scroll.",
    features: ["Social campaigns", "Print-ready files", "Brand-consistent"],
    actionType: "popup"
  },
  {
    id: "ui-ux-design",
    icon: Palette,
    title: "UI/UX Design",
    description:
      "Interfaces that feel effortless. Research-backed design systems built for clarity and conversion.",
    features: ["Wireframes & prototypes", "Design systems", "Usability testing"],
    actionType: "popup"
  },
  {
    id: "seo-optimization",
    icon: Rocket,
    title: "SEO Optimization",
    description:
      "Technical SEO, structured data, and performance tuning that get your site found and keep it fast.",
    features: ["Core Web Vitals", "Schema markup", "On-page SEO"],
    actionType: "popup"
  },
  {
    id: "portfolio-websites",
    icon: LayoutTemplate,
    title: "Portfolio Websites",
    description:
      "Personal and studio portfolios that present your best work with the polish of a flagship product.",
    features: ["Case-study layouts", "Custom animation", "One-page or multi-page"],
    actionType: "popup"
  },
];
