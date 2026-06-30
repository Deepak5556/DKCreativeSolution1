import { supabase } from "./supabase";

function mapKeys(obj: unknown, mapper: (key: string) => string): unknown {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) {
    return obj.map(item => mapKeys(item, mapper));
  }
  if (typeof obj === "object") {
    const mapped: Record<string, unknown> = {};
    for (const key of Object.keys(obj)) {
      const mappedKey = mapper(key);
      const val = (obj as Record<string, unknown>)[key];
      mapped[mappedKey] = mapKeys(val, mapper);
    }
    return mapped;
  }
  return obj;
}

const camelToSnake = (str: string) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
const snakeToCamel = (str: string) => str.replace(/([-_][a-z])/g, group => group.toUpperCase().replace("-", "").replace("_", ""));

export function toSnakeCase<T>(val: T): T {
  return mapKeys(val, camelToSnake) as T;
}

export function toCamelCase<T>(val: T): T {
  return mapKeys(val, snakeToCamel) as T;
}

export async function readData(type: string): Promise<unknown[]> {
  const table = type === "process" ? "process_steps" : type;
  const hasOrderIdx = !["queries", "blogs", "categories", "site_settings"].includes(type);

  let query = supabase.from(table).select("*");
  if (hasOrderIdx) {
    query = query.order("order_idx", { ascending: true });
  } else if (type === "queries" || type === "blogs") {
    query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;
  if (error) {
    console.error(`Error reading ${type} from Supabase:`, error);
    return [];
  }

  const camelData = toCamelCase(data || []) as unknown[];

  return camelData;
}

export async function writeData(type: string, data: unknown[]): Promise<void> {
  if (!Array.isArray(data)) return;

  const table = type === "process" ? "process_steps" : type;
  const hasOrderIdx = !["queries", "blogs", "categories", "site_settings"].includes(type);
  
  // Convert frontend camelCase data to database snake_case
  const snakeData = toSnakeCase(data) as Record<string, unknown>[];

  // 1. Fetch existing IDs from Supabase to determine deleted items
  const { data: existingData, error: fetchError } = await supabase.from(table).select("id");
  if (fetchError) {
    console.error(`Error fetching existing ${type} for write comparison:`, fetchError);
  }

  // 2. Identify and delete obsolete records
  const newIds = new Set(
    snakeData
      .map((item) => (item && typeof item === "object" ? item.id : null))
      .filter((id): id is string => typeof id === "string" && id !== "")
  );

  if (existingData) {
    const idsToDelete = existingData
      .map((row) => row.id)
      .filter((id) => id && !newIds.has(id));

    if (idsToDelete.length > 0) {
      const { error: deleteError } = await supabase.from(table).delete().in("id", idsToDelete);
      if (deleteError) {
        console.error(`Error deleting obsolete ${type} items:`, deleteError);
      }
    }
  }

  // 3. Upsert the updated items
  for (let i = 0; i < snakeData.length; i++) {
    const itemData = snakeData[i];
    const item = (hasOrderIdx ? { ...itemData, order_idx: i } : { ...itemData }) as Record<string, unknown>;
    
    // If the ID is not a valid UUID (e.g. legacy 'project-1234' format or missing/empty),
    // remove the id property to let PostgreSQL generate a valid UUID on insert.
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (typeof item.id !== "string" || !uuidRegex.test(item.id)) {
      delete item.id;
    }

    const { error } = await supabase.from(table).upsert(item);
    if (error) {
      console.error(`Error writing ${type} to Supabase:`, error);
      // Throw so the API route can return an error response instead of silently failing
      throw new Error(
        `Database error: ${error.message || error.code || "Unknown Supabase error"}`
      );
    }
  }
}

