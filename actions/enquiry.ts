"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { TablesInsert } from "@/lib/database.types";
import { ENQUIRY_TYPES, SUCCESS_MESSAGES, type EnquiryType, type FormState } from "@/lib/enquiry";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^[0-9+\-\s()]{7,20}$/;

function text(formData: FormData, key: string, max = 300): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

const fail = (message: string, fieldErrors?: FormState["fieldErrors"]): FormState => ({ status: "error", message, fieldErrors });

/** Validates an enquiry form and stores it in the `enquiries` table (insert-only under RLS). */
export async function submitEnquiry(_prev: FormState, formData: FormData): Promise<FormState> {
  const type = text(formData, "type") as EnquiryType;

  // Honeypot: real visitors never see or fill this field.
  if (text(formData, "website")) {
    return { status: "success", message: SUCCESS_MESSAGES[type] ?? "Received." };
  }
  if (!ENQUIRY_TYPES.includes(type)) return fail("This form is not set up correctly. Refresh the page and try again.");

  const name = text(formData, "name", 200);
  const email = text(formData, "email", 200);
  const phone = text(formData, "phone", 30);
  const message = text(formData, "message", 4000);
  const messageRequired = formData.get("message_required") === "yes";

  if (name.length < 2) return fail("Enter your full name.", { name: "Enter your full name." });
  if (!email && !phone) return fail("Enter an email address or a phone number so we can reply.", { email: "Email or phone is required." });
  if (email && !EMAIL.test(email)) return fail("Enter a valid email address, like name@example.com.", { email: "Enter a valid email address." });
  if (phone && !PHONE.test(phone)) return fail("Enter a valid phone number, using digits only.", { phone: "Enter a valid phone number." });
  if (messageRequired && message.length < 5) return fail("Describe your request in the message box.", { message: "Describe your request." });
  if (formData.get("consent") !== "yes") return fail("Tick the consent box so we can store and use your details to reply.", { consent: "Consent is required." });

  const details: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("extra:") && typeof value === "string" && value.trim()) {
      details[key.slice(6)] = value.trim().slice(0, 500);
    }
  }

  let supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>;
  try {
    supabase = await createSupabaseServerClient();
  } catch (err) {
    console.error("[enquiries] could not create Supabase client:", err);
    return fail("Your request could not be saved. Try again in a minute, or contact the college office directly.");
  }
  if (!supabase) {
    return fail("This form is not connected to the database yet. Add the Supabase keys to .env.local (see docs/SETUP.md).");
  }

  const row: TablesInsert<"enquiries"> = {
    type,
    name,
    email: email || null,
    phone: phone || null,
    message: message || null,
    details,
  };

  try {
    const { error } = await supabase.from("enquiries").insert(row);
    if (error) {
      console.error("[enquiries] insert failed:", error.message);
      return fail("Your request could not be saved. Try again in a minute, or contact the college office directly.");
    }
  } catch (err) {
    console.error("[enquiries] network error:", err);
    return fail("We could not reach the server. Check your connection and try again.");
  }

  return { status: "success", message: SUCCESS_MESSAGES[type] };
}
