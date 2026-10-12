/*
 * Reads every saved content value for the public pages. Public reads use the publishable
 * key and are cached with the "cms" tag, which the admin's saves refresh immediately.
 */
export async function getContentMap(): Promise<Record<string, unknown>> {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!base || !key) return {};
  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/rest/v1/site_content?select=key,value`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      next: { tags: ["cms"], revalidate: 300 },
    });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const rows = (await res.json()) as { key: string; value: unknown }[];
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  } catch (err) {
    console.error("[cms] could not read saved content:", err instanceof Error ? err.message : err);
    return {};
  }
}
