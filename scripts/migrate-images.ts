import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const envFile = fs.readFileSync(".env.local", "utf-8");
envFile.split("\n").forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    process.env[match[1].trim()] = match[2].trim();
  }
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

async function migrateImages() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    console.log("No public/uploads directory found. Skipping image migration.");
    return;
  }

  const files = fs.readdirSync(UPLOAD_DIR);
  console.log(`Found ${files.length} files in public/uploads.`);

  for (const file of files) {
    const filePath = path.join(UPLOAD_DIR, file);
    const buffer = fs.readFileSync(filePath);
    
    // Default bucket, can be changed later
    const bucket = "project-images";

    console.log(`Uploading ${file} to ${bucket}...`);
    const { error } = await supabase.storage
      .from(bucket)
      .upload(file, buffer, {
        upsert: true,
      });

    if (error) {
      console.error(`Failed to upload ${file}:`, error.message);
    } else {
      console.log(`Success: ${file}`);
    }
  }

  console.log("Image migration complete!");
}

migrateImages();
