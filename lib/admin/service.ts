/*
 * Server-only access to the database and file storage with the secret key.
 * Only the admin code under lib/admin and lib/cms uses this module. The secret key is never
 * sent to the browser: this file is only imported by server actions and route handlers.
 */
export function serviceBase(): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) throw new Error("The database is not connected.");
  return base.replace(/\/$/, "");
}

export async function serviceFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!key) throw new Error("The database is not connected.");
  const headers = new Headers(init.headers);
  headers.set("apikey", key);
  headers.set("Authorization", `Bearer ${key}`);
  return fetch(`${serviceBase()}${path}`, { ...init, headers, cache: "no-store" });
}

/** A JSON request to the database REST API. Returns null for 204 responses. */
export async function restJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body !== undefined && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const res = await serviceFetch(path, { ...init, headers });
  if (!res.ok) throw new Error(`The database returned an error (${res.status}).`);
  // PostgREST answers writes sent with "Prefer: return=minimal" with an empty body, so read the text first.
  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}

/** Headers for a server-side request with the secret key, for reads that should be cached by Next.js. Null when not configured. */
export function serviceHeaders(): Record<string, string> | null {
  const key = process.env.SUPABASE_SECRET_KEY;
  return key ? { apikey: key, Authorization: `Bearer ${key}` } : null;
}
