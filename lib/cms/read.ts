import { serviceBase, serviceHeaders } from "@/lib/admin/service";
import { DATA_FOLDER } from "./store";

/*
 * Reads every saved content value for the public pages. The read runs on the server and is
 * cached with the "cms" tag, which the admin's saves refresh immediately.
 */
export async function getContentMap(): Promise<Record<string, unknown>> {
  const headers = serviceHeaders();
  if (!headers || !process.env.NEXT_PUBLIC_SUPABASE_URL) return {};
  try {
    const res = await fetch(`${serviceBase()}/storage/v1/object/site-images/${DATA_FOLDER}/content.json`, {
      headers,
      next: { tags: ["cms"], revalidate: 300 },
    });
    if (res.status === 400 || res.status === 404) return {};
    if (!res.ok) throw new Error(`status ${res.status}`);
    const map = (await res.json()) as unknown;
    return map && typeof map === "object" && !Array.isArray(map) ? (map as Record<string, unknown>) : {};
  } catch (err) {
    console.error("[cms] could not read saved content:", err instanceof Error ? err.message : err);
    return {};
  }
}
