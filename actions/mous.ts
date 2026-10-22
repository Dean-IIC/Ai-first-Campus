"use server";

import { randomUUID } from "node:crypto";
import { isAdminSession } from "@/lib/admin/session";
import { serviceFetch } from "@/lib/admin/service";
import { MOU_DOCUMENT_BUCKET, MOU_DOCUMENT_PATH } from "@/lib/mous";

/*
 * MoU documents for the signed-in admin. A PDF is uploaded straight from the browser to the
 * private bucket with a one-time signed upload URL (the website itself only accepts 4.5 MB per
 * request), then checked here to be a real PDF.
 */

export type UploadTicket = { ok: true; path: string; token: string } | { ok: false; error: string };
export type DocumentCheck = { ok: true } | { ok: false; error: string };

const SIGNED_OUT = "You are signed out. Sign in again to upload documents.";

/** A one-time upload address for a new MoU document. */
export async function mouUploadTicketAction(): Promise<UploadTicket> {
  if (!(await isAdminSession())) return { ok: false, error: SIGNED_OUT };
  try {
    const path = `mous/${randomUUID()}.pdf`;
    const res = await serviceFetch(`/storage/v1/object/upload/sign/${MOU_DOCUMENT_BUCKET}/${path}`, { method: "POST" });
    if (!res.ok) return { ok: false, error: `The upload could not be prepared (${res.status}).` };
    const data = (await res.json()) as { url?: string; token?: string };
    const token = data.token ?? new URL(data.url ?? "", "http://x").searchParams.get("token");
    if (!token) return { ok: false, error: "The upload could not be prepared." };
    return { ok: true, path, token };
  } catch {
    return { ok: false, error: "The upload could not be prepared. Check your connection and try again." };
  }
}

/** Confirms an uploaded file is a PDF by its first bytes; anything else is deleted. */
export async function checkMouDocumentAction(path: string): Promise<DocumentCheck> {
  if (!(await isAdminSession())) return { ok: false, error: SIGNED_OUT };
  if (!MOU_DOCUMENT_PATH.test(path)) return { ok: false, error: "That document could not be found." };
  try {
    const res = await serviceFetch(`/storage/v1/object/${MOU_DOCUMENT_BUCKET}/${path}`, { headers: { Range: "bytes=0-4" } });
    if (!res.ok) return { ok: false, error: "The document did not upload. Try again." };
    const head = new TextDecoder().decode(new Uint8Array(await res.arrayBuffer()).slice(0, 5));
    if (head === "%PDF-") return { ok: true };
    await serviceFetch(`/storage/v1/object/${MOU_DOCUMENT_BUCKET}/${path}`, { method: "DELETE" });
    return { ok: false, error: "That file is not a PDF. Choose a PDF document." };
  } catch {
    return { ok: false, error: "The document could not be checked. Try again." };
  }
}
