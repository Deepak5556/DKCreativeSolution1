import fs from "fs";
import path from "path";

const DB_DIR = path.join(process.cwd(), "data", "db");
const SEED_FILE = path.join(process.cwd(), "supabase", "seed.sql");

function escapeSql(str: string | null | undefined): string {
  if (str === null || str === undefined) return "NULL";
  return "'" + str.replace(/'/g, "''") + "'";
}

function escapeArray(arr: string[] | null | undefined): string {
  if (!arr || arr.length === 0) return "'{}'";
  const escaped = arr.map(item => `"${item.replace(/"/g, '""')}"`).join(",");
  return `'{${escaped}}'`;
}

function generateSeed() {
  let sql = "-- Supabase Seed Data\n\n";

  // 1. Projects
  if (fs.existsSync(path.join(DB_DIR, "projects.json"))) {
    const projects = JSON.parse(fs.readFileSync(path.join(DB_DIR, "projects.json"), "utf-8"));
    if (projects.length > 0) {
      sql += "INSERT INTO public.projects (category, title, description, tech, live_url, github_url, accent, icon, thumbnail_url, order_idx) VALUES\n";
      sql += projects.map((p: any, i: number) => {
        return `(${escapeSql(p.category)}, ${escapeSql(p.title)}, ${escapeSql(p.description)}, ${escapeArray(p.tech)}, ${escapeSql(p.liveUrl)}, ${escapeSql(p.githubUrl)}, ${escapeSql(p.accent)}, ${escapeSql(p.icon)}, ${escapeSql(p.thumbnailUrl)}, ${i})`;
      }).join(",\n") + ";\n\n";
    }
  }

  // 2. Videos
  if (fs.existsSync(path.join(DB_DIR, "videos.json"))) {
    const videos = JSON.parse(fs.readFileSync(path.join(DB_DIR, "videos.json"), "utf-8"));
    if (videos.length > 0) {
      sql += "INSERT INTO public.videos (title, category, duration, type, video_url, thumbnail_url, order_idx) VALUES\n";
      sql += videos.map((v: any, i: number) => {
        return `(${escapeSql(v.title)}, ${escapeSql(v.category)}, ${escapeSql(v.duration)}, ${escapeSql(v.type)}, ${escapeSql(v.videoUrl)}, ${escapeSql(v.thumbnailUrl)}, ${i})`;
      }).join(",\n") + ";\n\n";
    }
  }

  // 3. Posters
  if (fs.existsSync(path.join(DB_DIR, "posters.json"))) {
    const posters = JSON.parse(fs.readFileSync(path.join(DB_DIR, "posters.json"), "utf-8"));
    if (posters.length > 0) {
      sql += "INSERT INTO public.posters (title, category, aspect, palette, image_url, order_idx) VALUES\n";
      sql += posters.map((p: any, i: number) => {
        return `(${escapeSql(p.title)}, ${escapeSql(p.category)}, ${escapeSql(p.aspect)}, ${escapeSql(p.palette)}, ${escapeSql(p.imageUrl)}, ${i})`;
      }).join(",\n") + ";\n\n";
    }
  }

  // 4. Services
  if (fs.existsSync(path.join(DB_DIR, "services.json"))) {
    const services = JSON.parse(fs.readFileSync(path.join(DB_DIR, "services.json"), "utf-8"));
    if (services.length > 0) {
      sql += "INSERT INTO public.services (title, description, features, action_type, external_link, icon, order_idx) VALUES\n";
      sql += services.map((s: any, i: number) => {
        return `(${escapeSql(s.title)}, ${escapeSql(s.description)}, ${escapeArray(s.features)}, ${escapeSql(s.actionType)}, ${escapeSql(s.externalLink)}, ${escapeSql(s.icon)}, ${i})`;
      }).join(",\n") + ";\n\n";
    }
  }

  // 5. Testimonials
  if (fs.existsSync(path.join(DB_DIR, "testimonials.json"))) {
    const testimonials = JSON.parse(fs.readFileSync(path.join(DB_DIR, "testimonials.json"), "utf-8"));
    if (testimonials.length > 0) {
      sql += "INSERT INTO public.testimonials (name, role, company, quote, rating, initials, order_idx) VALUES\n";
      sql += testimonials.map((t: any, i: number) => {
        return `(${escapeSql(t.name)}, ${escapeSql(t.role)}, ${escapeSql(t.company)}, ${escapeSql(t.quote)}, ${t.rating || 5}, ${escapeSql(t.initials)}, ${i})`;
      }).join(",\n") + ";\n\n";
    }
  }

  // 6. Features
  if (fs.existsSync(path.join(DB_DIR, "features.json"))) {
    const features = JSON.parse(fs.readFileSync(path.join(DB_DIR, "features.json"), "utf-8"));
    if (features.length > 0) {
      sql += "INSERT INTO public.features (title, description, icon, order_idx) VALUES\n";
      sql += features.map((f: any, i: number) => {
        return `(${escapeSql(f.title)}, ${escapeSql(f.description)}, ${escapeSql(f.icon)}, ${i})`;
      }).join(",\n") + ";\n\n";
    }
  }

  // 7. Process Steps
  if (fs.existsSync(path.join(DB_DIR, "process.json"))) {
    const process = JSON.parse(fs.readFileSync(path.join(DB_DIR, "process.json"), "utf-8"));
    if (process.length > 0) {
      sql += "INSERT INTO public.process_steps (step, title, description, icon, order_idx) VALUES\n";
      sql += process.map((p: any, i: number) => {
        return `(${escapeSql(p.step)}, ${escapeSql(p.title)}, ${escapeSql(p.description)}, ${escapeSql(p.icon)}, ${i})`;
      }).join(",\n") + ";\n\n";
    }
  }

  // 8. Stats
  if (fs.existsSync(path.join(DB_DIR, "stats.json"))) {
    const stats = JSON.parse(fs.readFileSync(path.join(DB_DIR, "stats.json"), "utf-8"));
    if (stats.length > 0) {
      sql += "INSERT INTO public.stats (value, suffix, label, order_idx) VALUES\n";
      sql += stats.map((s: any, i: number) => {
        return `(${s.value}, ${escapeSql(s.suffix)}, ${escapeSql(s.label)}, ${i})`;
      }).join(",\n") + ";\n\n";
    }
  }

  fs.writeFileSync(SEED_FILE, sql);
  console.log(`Generated ${SEED_FILE}`);
}

generateSeed();
