import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

// This route applies the required DB schema migrations via Supabase REST API
// using the service role key (if configured) or returns instructions.
export async function POST() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (session?.value !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!serviceRoleKey || !supabaseUrl || serviceRoleKey === "your-service-role-key-here") {
    return NextResponse.json(
      {
        error: "SUPABASE_SERVICE_ROLE_KEY not configured",
        sql: `-- Run this in your Supabase SQL Editor:
ALTER TABLE public.posters DROP CONSTRAINT IF EXISTS posters_category_check;
ALTER TABLE public.posters ADD CONSTRAINT posters_category_check CHECK (category IN ('Instagram Posters','Event Posters','Promotional Posters','Business Posters','Before / After'));
ALTER TABLE public.posters ADD COLUMN IF NOT EXISTS before_image_url TEXT;

-- Create change_history table
CREATE TABLE IF NOT EXISTS public.change_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_type TEXT NOT NULL,
    action TEXT NOT NULL,
    item_title TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS and add policies
ALTER TABLE public.change_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon insert on change_history" ON public.change_history;
CREATE POLICY "Allow anon insert on change_history" ON public.change_history FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow anon select on change_history" ON public.change_history;
CREATE POLICY "Allow anon select on change_history" ON public.change_history FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow anon update on change_history" ON public.change_history;
CREATE POLICY "Allow anon update on change_history" ON public.change_history FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Allow anon delete on change_history" ON public.change_history;
CREATE POLICY "Allow anon delete on change_history" ON public.change_history FOR DELETE USING (true);`,
      },
      { status: 422 }
    );
  }

  const migrations = [
    `ALTER TABLE public.posters DROP CONSTRAINT IF EXISTS posters_category_check`,
    `ALTER TABLE public.posters ADD CONSTRAINT posters_category_check CHECK (category IN ('Instagram Posters','Event Posters','Promotional Posters','Business Posters','Before / After'))`,
    `ALTER TABLE public.posters ADD COLUMN IF NOT EXISTS before_image_url TEXT`,
    `CREATE TABLE IF NOT EXISTS public.change_history (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        content_type TEXT NOT NULL,
        action TEXT NOT NULL,
        item_title TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )`,
    `ALTER TABLE public.change_history ENABLE ROW LEVEL SECURITY`,
    `DROP POLICY IF EXISTS "Allow anon insert on change_history" ON public.change_history`,
    `CREATE POLICY "Allow anon insert on change_history" ON public.change_history FOR INSERT WITH CHECK (true)`,
    `DROP POLICY IF EXISTS "Allow anon select on change_history" ON public.change_history`,
    `CREATE POLICY "Allow anon select on change_history" ON public.change_history FOR SELECT USING (true)`,
    `DROP POLICY IF EXISTS "Allow anon update on change_history" ON public.change_history`,
    `CREATE POLICY "Allow anon update on change_history" ON public.change_history FOR UPDATE USING (true)`,
    `DROP POLICY IF EXISTS "Allow anon delete on change_history" ON public.change_history`,
    `CREATE POLICY "Allow anon delete on change_history" ON public.change_history FOR DELETE USING (true)`,
  ];

  const results: { sql: string; ok: boolean; error?: string }[] = [];

  for (const sql of migrations) {
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
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
        results.push({ sql, ok: false, error: JSON.stringify(data) });
      } else {
        results.push({ sql, ok: true });
      }
    } catch (err) {
      results.push({ sql, ok: false, error: String(err) });
    }
  }

  const allOk = results.every((r) => r.ok);
  return NextResponse.json({ success: allOk, results }, { status: allOk ? 200 : 500 });
}
