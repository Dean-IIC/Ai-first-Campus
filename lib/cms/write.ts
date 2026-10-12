import { restJson, serviceFetch } from "@/lib/admin/service";

/*
 * Saves, undoes and restores content. Every save records the value it replaced in
 * site_history, and only the last 30 changes are kept.
 */
export type HistoryRow = { id: number; key: string; label: string; old_value: unknown; new_value: unknown; created_at: string };
const KEEP = 30;

async function currentValue(key: string): Promise<unknown> {
  const rows = await restJson<{ value: unknown }[]>(`/rest/v1/site_content?key=eq.${encodeURIComponent(key)}&select=value`);
  return rows[0]?.value ?? null;
}

async function putValue(key: string, value: unknown | null): Promise<void> {
  const k = encodeURIComponent(key);
  if (value === null) {
    await restJson(`/rest/v1/site_content?key=eq.${k}`, { method: "DELETE", headers: { Prefer: "return=minimal" } });
    return;
  }
  await restJson("/rest/v1/site_content?on_conflict=key", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({ key, value }),
  });
}

async function trimHistory(): Promise<void> {
  const rows = await restJson<{ id: number }[]>(`/rest/v1/site_history?select=id&order=id.desc&offset=${KEEP}&limit=500`);
  if (rows.length === 0) return;
  await restJson(`/rest/v1/site_history?id=in.(${rows.map((r) => r.id).join(",")})`, { method: "DELETE", headers: { Prefer: "return=minimal" } });
}

/** Saves a value (null removes it), and records the change. */
export async function writeContent(key: string, value: unknown | null, label: string): Promise<void> {
  const oldValue = await currentValue(key);
  await putValue(key, value);
  await restJson("/rest/v1/site_history", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ key, label, old_value: oldValue, new_value: value }),
  });
  await trimHistory();
}

/** Puts back the value the latest change replaced, and removes that entry from history. */
export async function undoLastChange(): Promise<{ key: string; label: string; value: unknown | null }> {
  const rows = await restJson<HistoryRow[]>("/rest/v1/site_history?select=*&order=id.desc&limit=1");
  const last = rows[0];
  if (!last) throw new Error("There is nothing to undo.");
  await putValue(last.key, last.old_value ?? null);
  await restJson(`/rest/v1/site_history?id=eq.${last.id}`, { method: "DELETE", headers: { Prefer: "return=minimal" } });
  return { key: last.key, label: last.label, value: last.old_value ?? null };
}

/** Restores the value a past change set. This is itself recorded as a new change. */
export async function restoreChange(id: number): Promise<{ key: string; label: string; value: unknown | null }> {
  const rows = await restJson<HistoryRow[]>(`/rest/v1/site_history?id=eq.${id}&select=*`);
  const row = rows[0];
  if (!row) throw new Error("That version is no longer in the history.");
  const value = row.new_value ?? null;
  const label = `Restored: ${row.label}`;
  await writeContent(row.key, value, label);
  return { key: row.key, label, value };
}

export async function listHistory(): Promise<HistoryRow[]> {
  return restJson<HistoryRow[]>("/rest/v1/site_history?select=*&order=id.desc&limit=30");
}

/** Stores an image in the site's storage bucket and returns its public address. */
export async function storeImage(bytes: ArrayBuffer, contentType: string, fileName: string): Promise<string> {
  const path = `cms/${fileName}`;
  const res = await serviceFetch(`/storage/v1/object/site-images/${path}`, {
    method: "POST",
    headers: { "Content-Type": contentType, "x-upsert": "false" },
    body: bytes,
  });
  if (!res.ok) throw new Error(`The photo could not be stored (${res.status}).`);
  const base = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");
  return `${base}/storage/v1/object/public/site-images/${path}`;
}
