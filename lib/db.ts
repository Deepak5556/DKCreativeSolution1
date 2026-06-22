import { supabase } from "./supabase";

export async function readData(type: string): Promise<unknown[]> {
  const table = type === "process" ? "process_steps" : type;
  const { data, error } = await supabase.from(table).select("*").order("order_idx", { ascending: true });
  if (error) {
    console.error(`Error reading ${type} from Supabase:`, error);
    return [];
  }
  return data || [];
}

export async function writeData(type: string, data: unknown[]): Promise<void> {
  // Since we don't have a service role key, we assume the Admin API routes will handle this
  // by executing updates one by one. In a real scenario, you'd use supabase-admin here.
  // For this migration, we'll implement an upsert loop.
  if (!Array.isArray(data)) return;

  const table = type === "process" ? "process_steps" : type;

  for (let i = 0; i < data.length; i++) {
    const item = data[i] as any;
    item.order_idx = i; // Maintain order
    const { error } = await supabase.from(table).upsert(item);
    if (error) {
      console.error(`Error writing ${type} to Supabase:`, error);
    }
  }
}

