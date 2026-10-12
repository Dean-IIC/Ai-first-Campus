// Uploads everything in /content to Supabase.
// Usage: npm run db:seed            (all rows, including sample rows)
//        npm run db:seed:no-samples (skips rows marked "is_sample": true)
//
// Needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY (or the legacy
// SUPABASE_SERVICE_ROLE_KEY) in .env.local. Run the SQL migration first.

import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
const skipSamples = process.argv.includes("--no-samples");

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY in .env.local. See docs/SETUP.md.");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });
const root = path.join(process.cwd(), "content");

async function readMarkdownDir(dir) {
  const files = (await fs.readdir(path.join(root, dir))).filter((f) => f.endsWith(".md"));
  return Promise.all(
    files.map(async (file) => {
      const { data, content } = matter(await fs.readFile(path.join(root, dir, file), "utf8"));
      return { slug: file.replace(/\.md$/, ""), data, body: content.trim() };
    }),
  );
}

const blank = (v) => (typeof v === "string" && v.trim() ? v.trim() : null);

async function upsert(table, rows, onConflict = "slug") {
  if (rows.length === 0) return;
  // AI Champions and Ambassadors are edited on the website; seeding only adds people who are missing.
  const keepExisting = table === "ai_people";
  const { error } = await supabase.from(table).upsert(rows, { onConflict, ignoreDuplicates: keepExisting });
  if (error) throw new Error(`${table}: ${error.message}`);
  console.log(`  ${table.padEnd(22)} ${rows.length} row(s)`);
}

async function main() {
  console.log(`Seeding ${url}${skipSamples ? " (without sample rows)" : ""}`);

  const pages = await readMarkdownDir("pages");
  await upsert(
    "pages",
    pages.map((p) => ({
      slug: p.slug,
      title: String(p.data.title ?? p.slug),
      summary: blank(p.data.summary),
      body_md: p.body,
    })),
  );

  const messages = await readMarkdownDir("messages");
  await upsert(
    "leadership_messages",
    messages.map((m) => ({
      slug: m.slug,
      name: blank(m.data.name),
      designation: String(m.data.designation ?? m.slug),
      organisation: blank(m.data.organisation),
      excerpt: blank(m.data.excerpt),
      photo_url: blank(m.data.photo_url),
      body_md: m.body,
      sort_order: Number(m.data.sort_order ?? 99),
      section: blank(m.data.section) ?? "leadership",
    })),
  );

  const dataFiles = (await fs.readdir(path.join(root, "data"))).filter((f) => f.endsWith(".json"));
  for (const file of dataFiles) {
    const table = file.replace(/\.json$/, "");
    let rows = JSON.parse(await fs.readFile(path.join(root, "data", file), "utf8"));
    if (skipSamples) rows = rows.filter((r) => !r.is_sample);
    await upsert(table, rows);
  }

  console.log("Done. Pages refresh within 5 minutes, or call /api/revalidate to refresh now.");
}

main().catch((err) => {
  console.error(`Seeding failed: ${err.message}`);
  process.exit(1);
});
