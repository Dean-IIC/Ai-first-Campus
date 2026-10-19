import { ENQUIRY_STATUSES, ENQUIRY_TYPES, type Enquiry, type EnquiryStatus } from "@/lib/enquiry";
import { restJson, serviceFetch } from "./service";

/*
 * Server-only access to the `enquiries` table with the secret key. Visitors can only insert
 * through row-level security; reading and updating happen here, after the admin check in the
 * calling action or route. Private fields (admin note, email alert result, rate-limit key) are
 * kept in `details` under names starting with "_".
 */

export type EnquiryFilter = { type?: string; status?: string; q?: string };

/** Keeps only letters, digits and a few safe characters, so the search cannot change the query. */
export function cleanSearch(q: string | undefined): string {
  return (q ?? "").replace(/[^\p{L}\p{N}@.\-_ ]/gu, "").replace(/\s+/g, " ").trim().slice(0, 80);
}

export async function listEnquiries(f: EnquiryFilter = {}): Promise<Enquiry[]> {
  const params = new URLSearchParams({ select: "*", order: "created_at.desc", limit: "2000" });
  if (f.type && (ENQUIRY_TYPES as readonly string[]).includes(f.type)) params.set("type", `eq.${f.type}`);
  if (f.status && (ENQUIRY_STATUSES as readonly string[]).includes(f.status)) params.set("status", `eq.${f.status}`);
  const q = cleanSearch(f.q);
  if (q) params.set("or", `(name.ilike.*${q}*,email.ilike.*${q}*,details->>organisation.ilike.*${q}*)`);
  return restJson<Enquiry[]>(`/rest/v1/enquiries?${params}`);
}

export async function getEnquiry(id: string): Promise<Enquiry | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const rows = await restJson<Enquiry[]>(`/rest/v1/enquiries?id=eq.${id}&select=*`);
  return rows[0] ?? null;
}

export async function countNewEnquiries(): Promise<number> {
  const res = await serviceFetch("/rest/v1/enquiries?status=eq.new&select=id", { headers: { Prefer: "count=exact", Range: "0-0" } });
  if (!res.ok) throw new Error(`The database returned an error (${res.status}).`);
  return Number((res.headers.get("content-range") ?? "").split("/")[1] ?? 0) || 0;
}

/** Changes the status and the private admin note. */
export async function updateEnquiry(id: string, status: EnquiryStatus, note: string): Promise<Enquiry> {
  const current = await getEnquiry(id);
  if (!current) throw new Error("That enquiry was not found.");
  const details = { ...current.details, _note: note };
  const rows = await restJson<Enquiry[]>(`/rest/v1/enquiries?id=eq.${id}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ status, details }),
  });
  return rows[0];
}

/** Adds private fields to an enquiry's details (used for the email alert result). */
export async function addEnquiryDetails(id: string, extra: Record<string, unknown>): Promise<void> {
  const current = await getEnquiry(id);
  if (!current) return;
  await restJson(`/rest/v1/enquiries?id=eq.${id}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ details: { ...current.details, ...extra } }),
  });
}

export async function insertEnquiry(row: Omit<Enquiry, "id" | "status" | "created_at">): Promise<Enquiry> {
  const rows = await restJson<Enquiry[]>("/rest/v1/enquiries", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(row),
  });
  return rows[0];
}

/** How many enquiries this visitor (by hashed address) sent in the last hour. */
export async function recentFromVisitor(visitor: string): Promise<number> {
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const rows = await restJson<{ id: string }[]>(`/rest/v1/enquiries?select=id&created_at=gte.${encodeURIComponent(since)}&details->>_visitor=eq.${visitor}`);
  return rows.length;
}
