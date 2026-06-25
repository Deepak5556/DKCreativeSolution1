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
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const sqlCommands = [
  `CREATE TABLE IF NOT EXISTS public.change_history (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      content_type TEXT NOT NULL,
      action TEXT NOT NULL,
      item_title TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );`,
  `ALTER TABLE public.change_history ENABLE ROW LEVEL SECURITY;`,
  `DROP POLICY IF EXISTS "Allow anon insert on change_history" ON public.change_history;`,
  `CREATE POLICY "Allow anon insert on change_history" ON public.change_history FOR INSERT WITH CHECK (true);`,
  `DROP POLICY IF EXISTS "Allow anon select on change_history" ON public.change_history;`,
  `CREATE POLICY "Allow anon select on change_history" ON public.change_history FOR SELECT USING (true);`,
  `DROP POLICY IF EXISTS "Allow anon update on change_history" ON public.change_history;`,
  `CREATE POLICY "Allow anon update on change_history" ON public.change_history FOR UPDATE USING (true);`,
  `DROP POLICY IF EXISTS "Allow anon delete on change_history" ON public.change_history;`,
  `CREATE POLICY "Allow anon delete on change_history" ON public.change_history FOR DELETE USING (true);`
];

async function run() {
  if (!serviceRoleKey || serviceRoleKey === "your-service-role-key-here") {
    console.log("\n========================================================");
    console.log("WARNING: SUPABASE_SERVICE_ROLE_KEY is not configured in .env.local.");
    console.log("Please run the following SQL commands in your Supabase SQL Editor:");
    console.log("========================================================\n");
    console.log(sqlCommands.join("\n"));
    console.log("\n========================================================\n");
    return;
  }

  const supabase = createClient(url, serviceRoleKey);
  console.log("Creating 'change_history' table and policies...");
  
  for (const sql of sqlCommands) {
    try {
      const res = await fetch(`${url}/rest/v1/rpc/exec_sql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
        body: JSON.stringify({ query: sql }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error(`FAILED: ${sql}\nError:`, JSON.stringify(data));
      } else {
        console.log(`SUCCESS: ${sql.trim().split("\n")[0]}`);
      }
    } catch (err) {
      console.error(`FAILED: ${sql}\nError:`, err);
    }
  }
}

run();
