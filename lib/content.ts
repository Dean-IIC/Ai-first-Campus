import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { getPublicSupabase as getSupabase } from "./supabase/public";
import type { LeadershipMessage, ListTable, ListTables, Page } from "./types";

/*
 * Content comes from Supabase when it is configured. If Supabase is not
 * connected yet, or a query fails, the same content is read from the
 * /content folder, which is also what `npm run db:seed` uploads.
 */

const CONTENT_DIR = path.join(process.cwd(), "content");

async function readMarkdown(dir: string, slug: string) {
  try {
    const raw = await fs.readFile(path.join(CONTENT_DIR, dir, `${slug}.md`), "utf8");
    return matter(raw);
  } catch {
    return null;
  }
}

function warn(scope: string, message: string) {
  console.warn(`[content] ${scope}: ${message}. Using files in /content instead.`);
}

// ---------- Pages ----------

export async function getPage(slug: string): Promise<Page | null> {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb.from("pages").select("slug,title,summary,body_md").eq("slug", slug).maybeSingle();
      if (error) warn(`pages/${slug}`, error.message);
      else if (data) return data;
    } catch (err) {
      warn(`pages/${slug}`, err instanceof Error ? err.message : "network error");
    }
  }

  const file = await readMarkdown("pages", slug);
  if (!file) return null;
  return {
    slug,
    title: String(file.data.title ?? slug),
    summary: (file.data.summary as string | undefined) ?? null,
    body_md: file.content.trim(),
  };
}

// ---------- Leadership messages ----------

function messageFromFile(slug: string, file: matter.GrayMatterFile<string>): LeadershipMessage {
  const d = file.data as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);
  return {
    slug,
    name: str(d.name),
    designation: str(d.designation) ?? slug,
    organisation: str(d.organisation),
    excerpt: str(d.excerpt),
    photo_url: str(d.photo_url),
    body_md: file.content.trim(),
    sort_order: typeof d.sort_order === "number" ? d.sort_order : 99,
    section: str(d.section) ?? "leadership",
  };
}

/** Messages for one place on the site: "leadership" (default) or "ai-first". */
export async function getMessages(section = "leadership"): Promise<LeadershipMessage[]> {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb.from("leadership_messages").select("*").eq("section", section).order("sort_order", { ascending: true });
      if (error) warn("leadership_messages", error.message);
      else if (data && data.length) return data;
    } catch (err) {
      warn("leadership_messages", err instanceof Error ? err.message : "network error");
    }
  }

  try {
    const files = (await fs.readdir(path.join(CONTENT_DIR, "messages"))).filter((f) =>
      f.endsWith(".md"),
    );
    const messages = await Promise.all(
      files.map(async (f) => {
        const slug = f.replace(/\.md$/, "");
        const file = await readMarkdown("messages", slug);
        return file ? messageFromFile(slug, file) : null;
      }),
    );
    return messages
      .filter((m): m is LeadershipMessage => m !== null && m.section === section)
      .sort((a, b) => a.sort_order - b.sort_order);
  } catch {
    return [];
  }
}

export async function getMessage(slug: string): Promise<LeadershipMessage | null> {
  const messages = await getMessages();
  return messages.find((m) => m.slug === slug) ?? null;
}

// ---------- Lists (departments, dashboards, projects, ...) ----------

const ORDER: Record<ListTable, { column: string; ascending: boolean }> = {
  departments: { column: "sort_order", ascending: true },
  dashboards: { column: "sort_order", ascending: true },
  uhv_activities: { column: "sort_order", ascending: true },
  research_projects: { column: "sort_order", ascending: true },
  consultancy_projects: { column: "sort_order", ascending: true },
  training_programs: { column: "sort_order", ascending: true },
  news_items: { column: "published_on", ascending: false },
  portals: { column: "sort_order", ascending: true },
  ai_people: { column: "sort_order", ascending: true },
  key_figures: { column: "sort_order", ascending: true },
  houses: { column: "sort_order", ascending: true },
  mous: { column: "sort_order", ascending: true },
  journey_milestones: { column: "sort_order", ascending: true },
};

export async function getList<T extends ListTable>(
  table: T,
  options: { limit?: number } = {},
): Promise<ListTables[T][]> {
  const order = ORDER[table];
  const sb = getSupabase();

  if (sb) {
    try {
      let query = sb.from(table).select("*").order(order.column, { ascending: order.ascending });
      if (options.limit) query = query.limit(options.limit);
      const { data, error } = await query;
      if (error) warn(table, error.message);
      // Rows match the generated Database types; the table name is a runtime value, so narrow explicitly.
      else if (data) return data as unknown as ListTables[T][];
    } catch (err) {
      warn(table, err instanceof Error ? err.message : "network error");
    }
  }

  try {
    const raw = await fs.readFile(path.join(CONTENT_DIR, "data", `${table}.json`), "utf8");
    const rows = JSON.parse(raw) as Record<string, unknown>[];
    rows.sort((a, b) => {
      const av = a[order.column] as string | number;
      const bv = b[order.column] as string | number;
      if (av === bv) return 0;
      return (av > bv ? 1 : -1) * (order.ascending ? 1 : -1);
    });
    const limited = options.limit ? rows.slice(0, options.limit) : rows;
    return limited as unknown as ListTables[T][];
  } catch {
    return [];
  }
}
