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
  const buckets = ['project-images', 'project-videos', 'gallery-images', 'service-icons', 'blog-images', 'profile-images'];
  for (const bucket of buckets) {
    console.log(`\n=== Bucket: ${bucket} ===`);
    const { data: files, error } = await supabase.storage.from(bucket).list("", {
      limit: 100,
      sortBy: { column: 'created_at', order: 'desc' }
    });
    if (error) {
      console.error(`Error listing ${bucket}:`, error.message);
    } else if (files) {
      console.log(`Found ${files.length} files.`);
      files.forEach(f => {
        console.log(`- Name: ${f.name}, Created: ${f.created_at}, Size: ${f.metadata?.size || 'unknown'}`);
      });
    }
  }
}

run();
