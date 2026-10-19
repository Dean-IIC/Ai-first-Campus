"use server";

import { isAdminSession } from "@/lib/admin/session";
import { countNewEnquiries, updateEnquiry } from "@/lib/admin/enquiries";
import { ENQUIRY_STATUSES, type Enquiry, type EnquiryStatus } from "@/lib/enquiry";

const SIGNED_OUT = "You are signed out. Sign in again to manage enquiries.";

/** Number of New enquiries, for the badge in the admin bar. Visitors get 0. */
export async function newEnquiryCountAction(): Promise<number> {
  if (!(await isAdminSession())) return 0;
  try {
    return await countNewEnquiries();
  } catch {
    return 0;
  }
}

/** Saves an enquiry's status and private admin note. */
export async function updateEnquiryAction(id: string, status: string, note: string): Promise<{ ok: true; enquiry: Enquiry } | { ok: false; error: string }> {
  if (!(await isAdminSession())) return { ok: false, error: SIGNED_OUT };
  if (!(ENQUIRY_STATUSES as readonly string[]).includes(status)) return { ok: false, error: "Choose a status." };
  const cleanNote = String(note ?? "").replace(/<[^>]*>/g, "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, 2000);
  try {
    return { ok: true, enquiry: await updateEnquiry(String(id), status as EnquiryStatus, cleanNote) };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "The change could not be saved." };
  }
}
