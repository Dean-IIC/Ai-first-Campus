import { getContentMap } from "@/lib/cms/read";
import { FORM_LABELS, publicDetails, type AlertResult, type Enquiry } from "@/lib/enquiry";

/*
 * Emails the person responsible for a form when a new enquiry arrives, through Resend
 * (https://resend.com). Needs RESEND_API_KEY on the server; the recipients are set by the admin
 * under Edit content → Enquiry email alerts. A failure never stops the enquiry being saved.
 */

const FROM = process.env.ALERT_FROM_EMAIL || "HKBK Website <alerts@send.hkbkce.in>";

/** Which alert address field covers each form. Admission and hostel forms use the general address. */
const ROUTE: Record<string, string> = { consultancy: "consultancy", corporate_training: "corporate_training" };

const escape = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

async function recipientFor(type: string): Promise<string> {
  const raw = (await getContentMap())["site:alerts"];
  const v = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const pick = (k: string) => (typeof v[k] === "string" ? (v[k] as string).trim() : "");
  return pick(ROUTE[type] ?? "contact") || pick("contact");
}

export async function sendEnquiryAlert(e: Enquiry): Promise<AlertResult> {
  const at = new Date().toISOString();
  const key = process.env.RESEND_API_KEY;
  if (!key) return { status: "not_set_up", at, error: "Email alerts are not set up yet." };
  const to = await recipientFor(e.type);
  if (!to) return { status: "not_set_up", at, error: "No alert address is set for this form." };

  const form = FORM_LABELS[e.type] ?? e.type;
  const site = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.hkbkce.in").replace(/\/$/, "");
  const link = `${site}/admin/enquiries?id=${e.id}#e-${e.id}`;
  const rows: [string, string | null][] = [["Form", form], ["Name", e.name], ["Email", e.email], ["Phone", e.phone], ...publicDetails(e.details), ["Message", e.message]];
  const html = `<p>A new ${escape(form.toLowerCase())} enquiry arrived on the HKBK College of Engineering website.</p>
<table cellpadding="6" style="border-collapse:collapse">${rows
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="color:#555;vertical-align:top"><b>${escape(k)}</b></td><td style="white-space:pre-wrap">${escape(v!)}</td></tr>`)
    .join("")}</table>
<p><a href="${escape(link)}">Open this enquiry in the Enquiries inbox</a> (admin sign-in required).</p>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: [to], subject: `New ${form} enquiry — ${e.name}`, html, reply_to: e.email ?? undefined }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { message?: string };
      return { status: "failed", at, error: `Resend ${res.status}: ${body.message ?? "the email was not accepted"}` };
    }
    return { status: "sent", at };
  } catch (err) {
    return { status: "failed", at, error: err instanceof Error ? err.message : "The email service could not be reached." };
  }
}
