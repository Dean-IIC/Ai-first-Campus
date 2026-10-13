import { serviceFetch } from "@/lib/admin/service";
import { readJson, writeJson } from "./store";

/*
 * Saves, undoes and restores content. Every save records the value it replaced in the
 * history, and only the last 30 changes are kept.
 */
export type HistoryRow = { id: number; key: string; label: string; old_value: unknown; new_value: unknown; created_at: string };
type ContentMap = Record<string, unknown>;
const KEEP = 30;
const CONTENT = "content.json";
const HISTORY = "history.json";

async function putValue(key: string, value: unknown | null): Promise<void> {
  const map = await readJson<ContentMap>(CONTENT, {});
  if (value === null) delete map[key];
  else map[key] = value;
  await writeJson(CONTENT, map);
}

/** Saves a value (null removes it), and records the change. */
export async function writeContent(key: string, value: unknown | null, label: string): Promise<void> {
  const [map, history] = await Promise.all([readJson<ContentMap>(CONTENT, {}), readJson<HistoryRow[]>(HISTORY, [])]);
  const oldValue = map[key] ?? null;
  if (value === null) delete map[key];
  else map[key] = value;
  await writeJson(CONTENT, map);
  const id = history.reduce((max, h) => Math.max(max, h.id), 0) + 1;
  const entry: HistoryRow = { id, key, label, old_value: oldValue, new_value: value, created_at: new Date().toISOString() };
  await writeJson(HISTORY, [entry, ...history].slice(0, KEEP));
}

/** Puts back the value the latest change replaced, and removes that entry from history. */
export async function undoLastChange(): Promise<{ key: string; label: string; value: unknown | null }> {
  const history = await readJson<HistoryRow[]>(HISTORY, []);
  const last = history[0];
  if (!last) throw new Error("There is nothing to undo.");
  await putValue(last.key, last.old_value ?? null);
  await writeJson(HISTORY, history.slice(1));
  return { key: last.key, label: last.label, value: last.old_value ?? null };
}

/** Restores the value a past change set. This is itself recorded as a new change. */
export async function restoreChange(id: number): Promise<{ key: string; label: string; value: unknown | null }> {
  const row = (await readJson<HistoryRow[]>(HISTORY, [])).find((h) => h.id === id);
  if (!row) throw new Error("That version is no longer in the history.");
  const value = row.new_value ?? null;
  const label = `Restored: ${row.label}`;
  await writeContent(row.key, value, label);
  return { key: row.key, label, value };
}

export async function listHistory(): Promise<HistoryRow[]> {
  return readJson<HistoryRow[]>(HISTORY, []);
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
