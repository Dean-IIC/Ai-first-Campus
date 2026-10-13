import { serviceFetch } from "@/lib/admin/service";

/*
 * Small JSON files in the site-images storage bucket, under cms-data/, written and read only
 * on the server with the secret key. They hold the admin's saved content, the change history
 * and the sign-in lock, so editing needs no extra database tables.
 */
export const DATA_FOLDER = "cms-data";
const objectPath = (name: string) => `/storage/v1/object/site-images/${DATA_FOLDER}/${name}`;

export async function readJson<T>(name: string, fallback: T): Promise<T> {
  const res = await serviceFetch(objectPath(name));
  if (res.status === 400 || res.status === 404) return fallback; // not created yet
  if (!res.ok) throw new Error(`Saved content could not be read (${res.status}).`);
  return (await res.json()) as T;
}

export async function writeJson(name: string, data: unknown): Promise<void> {
  const res = await serviceFetch(objectPath(name), {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-upsert": "true", "cache-control": "no-cache" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`The change could not be saved (${res.status}).`);
}
