import fs from "fs/promises";
import path from "path";

// Import fallback static data
import { services as fallbackServices } from "../data/services";
import { projects as fallbackProjects } from "../data/projects";
import { videoItems as fallbackVideos } from "../data/videos";
import { posters as fallbackPosters } from "../data/posters";
import { stats as fallbackStats } from "../data/stats";
import { testimonials as fallbackTestimonials } from "../data/testimonials";
import { processSteps as fallbackProcess } from "../data/process";
import { features as fallbackFeatures } from "../data/features";

const DB_DIR = path.join(process.cwd(), "data", "db");

interface ItemWithIcon {
  icon?: {
    displayName?: string;
    name?: string;
  };
  [key: string]: unknown;
}

// Helper to convert icon components to strings for JSON storage
function serializeIcons(data: unknown[]): unknown[] {
  return data.map((item) => {
    if (item && typeof item === "object") {
      const typedItem = item as ItemWithIcon;
      const iconName = typedItem.icon?.displayName || typedItem.icon?.name || "Sparkles";
      return { ...typedItem, icon: iconName };
    }
    return item;
  });
}

// Map content type to fallback values and serialization requirements
const FALLBACKS: Record<string, unknown[]> = {
  services: serializeIcons(fallbackServices),
  projects: serializeIcons(fallbackProjects),
  videos: fallbackVideos,
  posters: fallbackPosters,
  stats: fallbackStats,
  testimonials: fallbackTestimonials,
  process: serializeIcons(fallbackProcess),
  features: serializeIcons(fallbackFeatures),
  queries: [],
};

async function ensureDbDir() {
  try {
    await fs.mkdir(DB_DIR, { recursive: true });
  } catch {
    // Ignore if directory exists
  }
}

export async function readData(type: string): Promise<unknown[]> {
  await ensureDbDir();
  const filePath = path.join(DB_DIR, `${type}.json`);
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    return JSON.parse(fileContent) as unknown[];
  } catch {
    // If file doesn't exist, initialize it with fallback data and return it
    const fallback = FALLBACKS[type] || [];
    await writeData(type, fallback);
    return fallback;
  }
}

export async function writeData(type: string, data: unknown[]): Promise<void> {
  await ensureDbDir();
  const filePath = path.join(DB_DIR, `${type}.json`);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}
