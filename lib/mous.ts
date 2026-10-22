import type { Mou } from "./types";

/*
 * MoU helpers shared by the MoUs page, its on-card editor and the server. The admin-only fields
 * (departments, uploaded document, visitor visibility, status) live in the admin content store
 * (list:mous), not in database columns.
 */
export const MOU_TYPES = ["Industry", "Academic", "Research", "Government", "Other"] as const;
export const MOU_STATUSES = ["Automatic", "Active", "Expired"] as const;
export type MouStatus = (typeof MOU_STATUSES)[number];

/** An uploaded MoU document's path in the private "mou-documents" bucket. */
export const MOU_DOCUMENT_PATH = /^mous\/[a-z0-9-]+\.pdf$/;
export const MOU_DOCUMENT_BUCKET = "mou-documents";
export const MAX_MOU_DOCUMENT_BYTES = 10 * 1024 * 1024;

/** Active or Expired: as set by the admin, or, when Automatic, Expired once "Valid until" has passed. */
export function mouStatus(m: Pick<Mou, "status" | "valid_until">, today = new Date()): "Active" | "Expired" {
  if (m.status === "Active" || m.status === "Expired") return m.status;
  if (!m.valid_until) return "Active";
  const day = today.toISOString().slice(0, 10);
  return m.valid_until < day ? "Expired" : "Active";
}

/** What a visitor has picked in the MoU filters; empty strings mean "any". */
export type MouFilter = { type: string; status: string; q: string };
export const NO_FILTER: MouFilter = { type: "", status: "", q: "" };

/** The address that serves an MoU's uploaded document (visitors only when it is marked visible). */
export const mouDocumentHref = (slug: string) => `/api/mous/document?slug=${encodeURIComponent(slug)}`;
