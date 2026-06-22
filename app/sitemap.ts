import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/constants";

export const dynamic = "force-static";

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
