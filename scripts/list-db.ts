import { createClient } from "@supabase/supabase-js";
import fs from "fs";

// Simple dotenv parser
const envFile = fs.readFileSync(".env.local", "utf-8");
envFile.split("\n").forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    process.env[match[1].trim()] = match[2].trim();
  }
});

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(url, key);

async function run() {
  const tables = ["projects", "posters", "blogs", "services", "testimonials", "skills"];
  for (const table of tables) {
    console.log(`\n=== Table: ${table} ===`);
    const { data, error } = await supabase.from(table).select("*");
    if (error) {
      console.error(`Error fetching ${table}:`, error.message);
    } else if (data) {
      console.log(`Found ${data.length} records.`);
      data.forEach((row) => {
        const item = row as { id: string; title?: string; name?: string; [key: string]: unknown };
        const imgKeys = ["image_url", "thumbnail_url", "icon", "og_image"];
        const foundUrls: Record<string, string> = {};
        for (const k of imgKeys) {
          if (item[k]) foundUrls[k] = String(item[k]);
        }
        console.log(`- ID: ${item.id}, Title/Name: ${item.title || item.name || "N/A"}, URLs:`, foundUrls);
      });
    }
  }
}

run();
