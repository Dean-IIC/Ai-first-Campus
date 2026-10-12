"use server";

import { revalidatePath } from "next/cache";
import { AI_ROLES, isShippedChampionPhoto } from "@/lib/ai-people";
import type { TablesInsert } from "@/lib/database.types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type PersonInput = {
  /** The person's slug when editing an existing card; omit to add a new person. */
  slug?: string;
  role: string;
  name: string;
  department: string;
  bio: string;
  sortOrder: number;
  photoUrl: string | null;
};

export type EditResult = { ok: true } | { ok: false; message: string };

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

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

/** Photos must come from this project's site-images/ai-people/ folder, or be a faculty photo shipped with the site. */
function photoAllowed(url: string | null) {
  if (!url) return true;
  if (isShippedChampionPhoto(url)) return true;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return Boolean(base) && url.startsWith(`${base}/storage/v1/object/public/site-images/ai-people/`);
}

function refreshPages() {
  revalidatePath("/");
  revalidatePath("/ai-quantum/champions");
  revalidatePath("/ai-quantum/ai-first");
}

function slugFor(role: string, name: string) {
  const base = name.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "person";
  return `${role === "Faculty champion" ? "fc" : "sa"}-${base}-${crypto.randomUUID().slice(0, 6)}`;
}

/** Adds a new AI Champion or Ambassador, or updates an existing one. */
export async function saveAiPerson(input: PersonInput): Promise<EditResult> {
  const role = clean(input?.role, 40);
  const name = clean(input?.name, 120);
  const department = clean(input?.department, 120);
  const bio = clean(input?.bio, 400);
  const sortOrder = Number(input?.sortOrder);
  const photoUrl = input?.photoUrl ? clean(input.photoUrl, 500) : null;

  if (!(AI_ROLES as readonly string[]).includes(role)) return { ok: false, message: "Choose Faculty champion or Student ambassador." };
  if (name.length < 2) return { ok: false, message: "Enter the person's full name." };
  if (!Number.isInteger(sortOrder) || sortOrder < 1 || sortOrder > 500) return { ok: false, message: "Position must be a whole number from 1 to 500." };
  if (!photoAllowed(photoUrl)) return { ok: false, message: "The photo must be uploaded through this form." };

  const auth = await editorClient();
  if (!auth.supabase) return { ok: false, message: auth.error ?? "You cannot edit right now." };
  const supabase = auth.supabase;

  try {
    const fields = { role, name, department: department || null, bio: bio || null, sort_order: sortOrder, photo_url: photoUrl };
    // Update the person's own row. Without a slug, the card's slot (role and position) identifies the row.
    const slugIn = input.slug ? clean(input.slug, 120) : "";
    const slot = slugIn ? null : (await supabase.from("ai_people").select("slug").eq("role", role).eq("sort_order", sortOrder).limit(1)).data?.[0];
    const existing = slugIn || slot?.slug;
    if (existing) {
      const { error } = await supabase.from("ai_people").update(fields).eq("slug", existing);
      if (error) throw error;
    } else {
      const row: TablesInsert<"ai_people"> = { ...fields, slug: slugFor(role, name) };
      const { error } = await supabase.from("ai_people").insert(row);
      if (error) throw error;
    }
  } catch (err) {
    console.error("[ai_people] save failed:", err instanceof Error ? err.message : err);
    return { ok: false, message: "The change could not be saved. Check your connection and try again." };
  }
  refreshPages();
  return { ok: true };
}

/** Removes an AI Champion or Ambassador; the card goes back to a numbered placeholder. */
export async function deleteAiPerson(input: { slug: string | null; role: string; sortOrder: number }): Promise<EditResult> {
  const auth = await editorClient();
  if (!auth.supabase) return { ok: false, message: auth.error ?? "You cannot edit right now." };
  try {
    const slug = input.slug ? clean(input.slug, 120) : "";
    const query = slug
      ? auth.supabase.from("ai_people").delete().eq("slug", slug)
      : auth.supabase.from("ai_people").delete().eq("role", clean(input.role, 40)).eq("sort_order", Number(input.sortOrder));
    const { error } = await query;
    if (error) throw error;
  } catch (err) {
    console.error("[ai_people] delete failed:", err instanceof Error ? err.message : err);
    return { ok: false, message: "The person could not be removed. Try again." };
  }
  refreshPages();
  return { ok: true };
}
