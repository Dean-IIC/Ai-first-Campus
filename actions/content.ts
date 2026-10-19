"use server";

import fs from "node:fs/promises";
import path from "node:path";
import { isAdminSession } from "@/lib/admin/session";
import { getList, getMessages, getPage } from "@/lib/content";
import { isListTable } from "@/lib/cms/schema";
import { getSiteDetails, getSiteLinks } from "@/lib/site-details";
import { CAROUSEL_KEY } from "@/lib/carousel";
import { getHeroSlides } from "@/lib/carousel-server";
import { getContentMap } from "@/lib/cms/read";

export type Choice = { key: string; label: string };
export type Catalog = { pages: Choice[]; messages: Choice[] };
export type LoadResult = { ok: true; value: unknown } | { ok: false; error: string };

const SIGNED_OUT = "You are signed out. Sign in again to make changes.";

/** Every page and leadership message the content editor can open, with readable names. */
export async function catalogAction(): Promise<{ ok: true; catalog: Catalog } | { ok: false; error: string }> {
  if (!(await isAdminSession())) return { ok: false, error: SIGNED_OUT };
  try {
    const files = await fs.readdir(path.join(process.cwd(), "content", "pages")).catch(() => [] as string[]);
    const slugs = files.filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
    const pages = await Promise.all(slugs.map(async (slug) => ({ key: `page:${slug}`, label: (await getPage(slug))?.title ?? slug })));
    const leaders = await getMessages();
    return {
      ok: true,
      catalog: {
        pages: pages.sort((a, b) => a.label.localeCompare(b.label)),
        messages: leaders.map((m) => ({ key: `message:${m.slug}`, label: [m.designation, m.name].filter(Boolean).join(": ") })),
      },
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "The list of pages could not be loaded." };
  }
}

/** The current value behind one content-editor key, including anything already saved. */
export async function loadContentAction(key: string): Promise<LoadResult> {
  if (!(await isAdminSession())) return { ok: false, error: SIGNED_OUT };
  try {
    const [kind, name = ""] = String(key).split(":");
    if (kind === "page") {
      const page = await getPage(name);
      return page ? { ok: true, value: page } : { ok: false, error: "That page was not found." };
    }
    if (kind === "message") {
      const all = await getMessages();
      const m = all.find((x) => x.slug === name);
      return m ? { ok: true, value: m } : { ok: false, error: "That message was not found." };
    }
    if (kind === "list" && isListTable(name)) return { ok: true, value: await getList(name) };
    if (key === "site:links") return { ok: true, value: await getSiteLinks() };
    if (key === CAROUSEL_KEY) return { ok: true, value: await getHeroSlides() };
    if (key === "site:alerts") {
      const raw = (await getContentMap())["site:alerts"];
      return { ok: true, value: raw && typeof raw === "object" ? raw : {} };
    }
    if (kind === "site") {
      const d = await getSiteDetails();
      return { ok: true, value: { phone: d.phone, email: d.email, mapQuery: d.mapQuery, ...d.address } };
    }
    return { ok: false, error: "This content cannot be edited." };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "The content could not be loaded." };
  }
}
