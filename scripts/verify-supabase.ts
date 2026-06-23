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

async function verifySupabase() {
  console.log("=== SUPABASE VERIFICATION REPORT ===");
  console.log("");

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log("1. Environment Variables");
  console.log(`- NEXT_PUBLIC_SUPABASE_URL: ${url ? "Loaded Successfully [PASS]" : "Missing [FAIL]"}`);
  console.log(`- NEXT_PUBLIC_SUPABASE_ANON_KEY: ${key ? "Loaded Successfully [PASS]" : "Missing [FAIL]"}`);

  if (url && url.includes("eyJhbGciOiJ")) {
    console.log("  ⚠️ WARNING: The Supabase URL appears to be a JWT token instead of a URL. It should look like 'https://[PROJECT_ID].supabase.co'.");
  }

  if (!url || !key) {
    console.log("");
    console.log("Status: Not Connected [FAIL]");
    console.log("Reason: Missing environment variables.");
    return;
  }

  // Handle invalid URL error gracefully
  let supabase;
  try {
    supabase = createClient(url, key);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.log("");
    console.log("2. Connection Status");
    console.log("- Connected / Not Connected: Not Connected [FAIL]");
    console.log(`- Fatal Error initializing client: ${errorMsg}`);
    console.log("");
    console.log("Migration Readiness: Not Ready [FAIL]");
    return;
  }

  console.log("");
  console.log("2. Connection Status");
  
  // Test query
  try {
    const { data, error } = await supabase.from("projects").select("*").limit(1);
    if (error) {
      console.log("- Connected / Not Connected: Connected but Query Failed [WARN]");
      console.log(`- Error Details: ${error.message} (Code: ${error.code})`);
      if (error.code === '42P01') {
         console.log("  - It seems the 'projects' table does not exist.");
      }
    } else {
      console.log("- Connected / Not Connected: Connected [PASS]");
      console.log(`- Test Query Response: ${JSON.stringify(data)}`);
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.log("- Connected / Not Connected: Not Connected [FAIL]");
    console.log(`- Fatal Error: ${errorMsg}`);
  }

  // Check buckets
  console.log("");
  console.log("3. Storage Buckets");
  try {
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    if (bucketError) {
      console.log(`- Could not fetch buckets: ${bucketError.message}`);
    } else {
      const requiredBuckets = ['project-images', 'project-videos', 'gallery-images', 'service-icons', 'blog-images', 'profile-images'];
      const existingNames = buckets?.map(b => b.name) || [];
      
      console.log("- Existing Buckets:");
      existingNames.forEach(b => console.log(`  - ${b}`));
      if (existingNames.length === 0) console.log("  - None");

      console.log("- Missing Buckets:");
      const missing = requiredBuckets.filter(b => !existingNames.includes(b));
      missing.forEach(b => console.log(`  - ${b}`));
      if (missing.length === 0) console.log("  - None");
    }
  } catch (err: unknown) {
     const errorMsg = err instanceof Error ? err.message : String(err);
     console.log(`- Error checking buckets: ${errorMsg}`);
  }
}

verifySupabase();
