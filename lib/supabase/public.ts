import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import { supabaseEnv } from "./env";

let cached: SupabaseClient<Database> | null | undefined;

/**
 * Cookie-free client for public content (pages, departments, news...).
 * It does not read cookies, so pages that use it stay statically cached and
 * revalidate on a timer. Row-level security limits it to public reads.
 */
export function getPublicSupabase(): SupabaseClient<Database> | null {
  if (cached !== undefined) return cached;
  const env = supabaseEnv();
  cached = env ? createClient<Database>(env.url, env.key, { auth: { persistSession: false, autoRefreshToken: false } }) : null;
  return cached;
}
