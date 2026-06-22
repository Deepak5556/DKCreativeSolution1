import * as Icons from "lucide-react";

/**
 * Resolves a Lucide icon component by name, or returns the component directly
 * if it's already a react component. Falls back to Sparkles if not found.
 */
export function resolveIcon(iconName: unknown): Icons.LucideIcon {
  if (!iconName) return Icons.Sparkles;
  if (typeof iconName !== "string") {
    return iconName as Icons.LucideIcon;
  }
  const icon = (Icons as Record<string, unknown>)[iconName];
  if (icon && typeof icon === "function") {
    return icon as Icons.LucideIcon;
  }
  return Icons.Sparkles;
}

/**
 * List of common/recommended Lucide icons to choose from in the admin panel
 */
export const AVAILABLE_ICONS = [
  "GraduationCap",
  "Droplets",
  "UserSquare2",
  "CalendarRange",
  "Sparkles",
  "CloudSun",
  "Hand",
  "Code2",
  "Film",
  "Image",
  "Palette",
  "Rocket",
  "LayoutTemplate",
  "Zap",
  "Gem",
  "Headset",
  "Cpu",
  "Wallet",
  "Brush",
  "MessageCircle",
  "PencilRuler",
  "TestTube2",
  "PackageCheck",
  "Star",
  "Heart",
  "Award",
  "Bookmark",
  "Briefcase",
  "CheckCircle",
  "Compass",
  "Layers",
  "Monitor",
  "Phone",
  "Settings",
  "Smile",
  "Users",
  "Video",
] as const;
