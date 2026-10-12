"use server";

import { revalidatePath } from "next/cache";
import type { JourneyMilestone } from "@/lib/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { JOURNEY_ICON_NAMES, JOURNEY_STATUSES, MAX_BULLETS, monthLabel, nextMonth } from "@/lib/journey-model";

export type JourneyInput = {
  slug: string;
  period: string;
  layer: number | null;
  title: string;
  summary: string | null;
  points: string[];
  icon: string;
  status: string;
};
export type JourneyResult = { ok: true; entry?: JourneyMilestone } | { ok: false; message: string };
export type JourneyListResult = { ok: true; entries: JourneyMilestone[] } | { ok: false; message: string };

type ServerClient = NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>;
type EditorAuth = { supabase: ServerClient; error: null } | { supabase: null; error: string };

/** A Supabase client for a signed-in editor, or a message explaining why not. */
async function editorClient(): Promise<EditorAuth> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { supabase: null, error: "The website is not connected to Supabase yet." };
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return { supabase: null, error: "Your session has ended. Sign in again at /staff/login." };
  const { data: isEditor, error: roleError } = await supabase.rpc("is_editor");
  if (roleError || isEditor !== true) return { supabase: null, error: "This account is not allowed to edit the website." };
  return { supabase, error: null };
}

/** Plain text: no markup, no control characters, spaces collapsed (or line breaks kept). **bold** is kept. */
function clean(value: unknown, max: number, multiline = false): string {
  if (typeof value !== "string") return "";
  const plain = value.replace(/<[^>]*>/g, "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
  const text = multiline ? plain.replace(/\r\n?/g, "\n").trim() : plain.replace(/\s+/g, " ").trim();
  if (text.length > max) throw new Error(`Text can be at most ${max} characters.`);
  return text;
}

function readInput(raw: JourneyInput) {
  const slug = typeof raw?.slug === "string" && /^[a-z0-9-]{1,80}$/.test(raw.slug) ? raw.slug : "";
  if (!slug) throw new Error("This month could not be identified. Refresh the page and try again.");
  const period = clean(raw.period, 40);
  if (!period) throw new Error("Enter the month and year, for example June 2026.");
  const title = clean(raw.title, 160);
  const summary = clean(raw.summary, 1200, true);
  const points = (Array.isArray(raw.points) ? raw.points : []).map((p) => clean(p, 300)).filter(Boolean);
  if (points.length > MAX_BULLETS) throw new Error(`There can be at most ${MAX_BULLETS} bullet points.`);
  if (!(JOURNEY_STATUSES as readonly string[]).includes(raw.status)) throw new Error("Choose Completed, In progress or Upcoming.");
  const icon = (JOURNEY_ICON_NAMES as readonly string[]).includes(raw.icon) ? raw.icon : "sparkles";
  const layer = raw.layer === null || raw.layer === undefined ? null : Number(raw.layer);
  if (layer !== null && !(Number.isInteger(layer) && layer >= 1 && layer <= 5)) throw new Error("The layer must be 1 to 5, or none.");
  return { slug, period, title, summary: summary || null, points, icon, status: raw.status, layer };
}

const refresh = () => revalidatePath("/");

/** Every entry, including empty months. Editors only: visitors never receive the empty ones. */
export async function listJourneyForEditor(): Promise<JourneyListResult> {
  const auth = await editorClient();
  if (!auth.supabase) return { ok: false, message: auth.error };
  const { data, error } = await auth.supabase.from("journey_milestones").select("*").order("sort_order", { ascending: true });
  if (error) return { ok: false, message: "The timeline could not be loaded. Try again." };
  return { ok: true, entries: data as unknown as JourneyMilestone[] };
}

/** Saves one entry's text, layer, icon and status. Its photos and badge are not changed here. */
export async function saveJourneyAction(raw: JourneyInput): Promise<JourneyResult> {
  const auth = await editorClient();
  if (!auth.supabase) return { ok: false, message: auth.error };
  let row: ReturnType<typeof readInput>;
  try {
    row = readInput(raw);
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : "The entry is not valid." };
  }
  const { slug, ...fields } = row;
  const { error } = await auth.supabase.from("journey_milestones").update(fields).eq("slug", slug);
  if (error) return { ok: false, message: "The change could not be saved. Check your connection and try again." };
  refresh();
  return { ok: true };
}

/** Adds the month after the last entry, for example January 2027 after December 2026. */
export async function addJourneyMonthAction(): Promise<JourneyResult> {
  const auth = await editorClient();
  if (!auth.supabase) return { ok: false, message: auth.error };
  const { data, error } = await auth.supabase.from("journey_milestones").select("slug, period, sort_order").order("sort_order", { ascending: false }).limit(1);
  if (error) return { ok: false, message: "The timeline could not be read. Try again." };
  const last = data?.[0];
  const next = last ? nextMonth(last.period) : null;
  if (!last || !next) return { ok: false, message: "The last entry needs a month and year (for example June 2026) before a new month can follow it." };
  const now = new Date();
  const status = next.year * 12 + next.month < now.getFullYear() * 12 + now.getMonth() ? "completed" : "upcoming";
  const entry: JourneyMilestone = {
    slug: next.slug,
    period: monthLabel(next.year, next.month),
    title: "",
    summary: null,
    points: [],
    badge: null,
    icon: "sparkles",
    photos: [],
    inline_photo: null,
    layer: null,
    status,
    sort_order: last.sort_order + 1,
  };
  const { error: insertError } = await auth.supabase.from("journey_milestones").insert(entry);
  if (insertError) return { ok: false, message: "The month could not be added. Check your connection and try again." };
  refresh();
  return { ok: true, entry };
}

export async function deleteJourneyAction(slug: string): Promise<JourneyResult> {
  const auth = await editorClient();
  if (!auth.supabase) return { ok: false, message: auth.error };
  if (!/^[a-z0-9-]{1,80}$/.test(slug)) return { ok: false, message: "This month could not be identified." };
  const { error } = await auth.supabase.from("journey_milestones").delete().eq("slug", slug);
  if (error) return { ok: false, message: "The month could not be removed. Try again." };
  refresh();
  return { ok: true };
}

/** Saves an entry's photo with its caption and alt text, or removes it (photo = null). */
export async function setJourneyPhotoAction(slug: string, photo: { src: string; alt: string; caption: string } | null): Promise<JourneyResult> {
  const auth = await editorClient();
  if (!auth.supabase) return { ok: false, message: auth.error };
  if (!/^[a-z0-9-]{1,80}$/.test(slug)) return { ok: false, message: "This month could not be identified." };
  let value: { src: string; alt: string; caption: string } | null = null;
  try {
    if (photo) {
      const base = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");
      const src = typeof photo.src === "string" ? photo.src : "";
      const allowed = src.startsWith("/images/journey/") || (base && src.startsWith(`${base}/storage/v1/object/public/site-images/journey/`));
      if (!allowed || src.includes("..")) throw new Error("The photo address is not allowed.");
      value = { src, alt: clean(photo.alt, 300), caption: clean(photo.caption, 300) };
    }
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : "The photo is not valid." };
  }
  const { error } = await auth.supabase.from("journey_milestones").update({ inline_photo: value }).eq("slug", slug);
  if (error) return { ok: false, message: "The photo could not be saved. Try again." };
  refresh();
  return { ok: true };
}

/** Stores the order of the entries: the slugs in the order they now appear. */
export async function reorderJourneyAction(slugs: string[]): Promise<JourneyResult> {
  const auth = await editorClient();
  if (!auth.supabase) return { ok: false, message: auth.error };
  if (!Array.isArray(slugs) || slugs.some((s) => typeof s !== "string" || !/^[a-z0-9-]{1,80}$/.test(s))) {
    return { ok: false, message: "The new order could not be read." };
  }
  for (let i = 0; i < slugs.length; i++) {
    const { error } = await auth.supabase.from("journey_milestones").update({ sort_order: i + 1 }).eq("slug", slugs[i]);
    if (error) return { ok: false, message: "The new order could not be saved. Try again." };
  }
  refresh();
  return { ok: true };
}
