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
  console.log("Listing buckets:");
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  console.log("Buckets:", buckets, "Error:", listError);

  console.log("Trying to upload a test file to 'project-images' bucket...");
  const buffer = Buffer.from("test image content");
  const { data, error } = await supabase.storage
    .from("project-images")
    .upload("test-file.txt", buffer, {
      contentType: "text/plain",
      upsert: true,
    });
  console.log("Upload result:", data, "Error:", error);
}

run();
