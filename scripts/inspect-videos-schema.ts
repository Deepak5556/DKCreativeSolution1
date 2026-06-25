import { createClient } from "@supabase/supabase-js";
import fs from "fs";

// Load local environment variables
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
  console.log("Checking policies on 'videos' table...");
  const { data, error } = await supabase.rpc("exec_sql", { query: "select * from pg_policies where tablename = 'videos';" });
  if (error) {
    console.log("RPC exec_sql failed or not permitted, trying raw query via REST if available...");
    // Let's try executing standard query
    const { data: data2, error: error2 } = await supabase.from("pg_policies").select("*").eq("tablename", "videos");
    console.log("Direct query pg_policies data:", data2, "error:", error2);
  } else {
    console.log("Policies info:", data);
  }
}

run();
