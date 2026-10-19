"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { addEnquiryDetails, insertEnquiry, recentFromVisitor } from "@/lib/admin/enquiries";
import { sendEnquiryAlert } from "@/lib/admin/email-alert";
import { ENQUIRY_TYPES, SUCCESS_MESSAGE, type EnquiryType, type FormState } from "@/lib/enquiry";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^[0-9+\-\s()]{7,20}$/;
const MAX_PER_HOUR = 5;
/** Extra fields each form may send; anything else is ignored. */
const EXTRAS: Partial<Record<EnquiryType, string[]>> = {
  consultancy: ["organisation", "department"],
  corporate_training: ["organisation", "programme", "participants", "mode"],
};
const REQUIRED_EXTRAS: Partial<Record<EnquiryType, string[]>> = { consultancy: ["organisation"], corporate_training: ["organisation"] };

/** Plain text only: markup and control characters are removed before anything is stored. */
function clean(formData: FormData, key: string, max: number, multiline = false): string {
  const value = formData.get(key);
  if (typeof value !== "string") return "";
  const plain = value.replace(/<[^>]*>/g, "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
  return (multiline ? plain.replace(/\r\n?/g, "\n") : plain.replace(/\s+/g, " ")).trim().slice(0, max);
}

const fail = (message: string, fieldErrors?: FormState["fieldErrors"]): FormState => ({ status: "error", message, fieldErrors });

/** A one-way fingerprint of the visitor's network address, used only for the hourly limit. */
async function visitorKey(): Promise<string> {
  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip") || "unknown";
  return createHash("sha256").update(`hkbk-enquiry:${ip}`).digest("hex").slice(0, 32);
}

/** Validates an enquiry, stores it in the `enquiries` table and emails an alert. */
export async function submitEnquiry(_prev: FormState, formData: FormData): Promise<FormState> {
  const type = clean(formData, "type", 40) as EnquiryType;

  // Honeypot: real visitors never see or fill this field.
  if (clean(formData, "website", 200)) return { status: "success", message: SUCCESS_MESSAGE };
  if (!ENQUIRY_TYPES.includes(type)) return fail("This form is not set up correctly. Refresh the page and try again.");

  const name = clean(formData, "name", 200);
  const email = clean(formData, "email", 200);
  const phone = clean(formData, "phone", 30);
  const message = clean(formData, "message", 4000, true);
  const messageRequired = formData.get("message_required") === "yes";

  if (name.length < 2) return fail("Enter your full name.", { name: "Enter your full name." });
  if (!email && !phone) return fail("Enter an email address or a phone number so we can reply.", { email: "Email or phone is required." });
  if (email && !EMAIL.test(email)) return fail("Enter a valid email address, like name@example.com.", { email: "Enter a valid email address." });
  if (phone && !PHONE.test(phone)) return fail("Enter a valid phone number, using digits only.", { phone: "Enter a valid phone number." });
  if (messageRequired && message.length < 5) return fail("Describe your request in the message box.", { message: "Describe your request." });

  const details: Record<string, string> = {};
  for (const key of EXTRAS[type] ?? []) {
    const v = clean(formData, `extra:${key}`, 300);
    if (v) details[key] = v;
  }
  const missing = (REQUIRED_EXTRAS[type] ?? []).find((k) => !details[k]);
  if (missing) return fail(`Enter your ${missing}.`);
  if (formData.get("consent") !== "yes") return fail("Tick the consent box so we can store and use your details to reply.", { consent: "Consent is required." });

  try {
    const visitor = await visitorKey();
    if ((await recentFromVisitor(visitor)) >= MAX_PER_HOUR) {
      return fail("You have sent several requests in the last hour. Please try again later, or contact the college office directly.");
    }
    const saved = await insertEnquiry({ type, name, email: email || null, phone: phone || null, message: message || null, details: { ...details, _visitor: visitor } });
    // The enquiry is saved; an alert that fails is recorded next to it in the inbox.
    const alert = await sendEnquiryAlert(saved);
    await addEnquiryDetails(saved.id, { _alert: alert }).catch((err) => console.error("[enquiries] could not record the alert:", err));
  } catch (err) {
    console.error("[enquiries] could not save:", err instanceof Error ? err.message : err);
    return fail("Your request could not be saved. Try again in a minute, or contact the college office directly.");
  }
  return { status: "success", message: SUCCESS_MESSAGE };
}
