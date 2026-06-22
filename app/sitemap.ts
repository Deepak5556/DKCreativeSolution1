import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const sections = [
    "",
    "#services",
    "#projects",
    "#video-editing",
    "#posters",
    "#process",
    "#testimonials",
    "#contact",
  ];

  return sections.map((section) => ({
    url: `${siteConfig.url}/${section}`,
    lastModified,
    changeFrequency: section === "" ? "weekly" : "monthly",
    priority: section === "" ? 1 : 0.7,
  }));
}
