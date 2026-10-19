import { isAdminSession } from "@/lib/admin/session";
import { listEnquiries } from "@/lib/admin/enquiries";
import { FORM_LABELS, STATUS_LABELS, type AlertResult } from "@/lib/enquiry";

/** A spreadsheet cell: quoted, and never starting with a formula character (CSV injection). */
function cell(value: unknown): string {
  let s = value == null ? "" : String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

/** Downloads the enquiries matching the inbox filters as CSV. Admin only. */
export async function GET(request: Request) {
  if (!(await isAdminSession())) return new Response("You are signed out.", { status: 401 });
  const p = new URL(request.url).searchParams;
  try {
    const rows = await listEnquiries({ type: p.get("type") ?? undefined, status: p.get("status") ?? undefined, q: p.get("q") ?? undefined });
    const header = ["Received", "Form", "Status", "Name", "Email", "Phone", "Organisation", "Other details", "Message", "Admin note", "Email alert"];
    const lines = rows.map((e) => {
      const d = e.details ?? {};
      const others = Object.entries(d)
        .filter(([k, v]) => !k.startsWith("_") && k !== "organisation" && typeof v === "string")
        .map(([k, v]) => `${k}: ${v}`)
        .join("; ");
      const alert = d._alert as AlertResult | undefined;
      return [
        new Date(e.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        FORM_LABELS[e.type] ?? e.type,
        STATUS_LABELS[e.status] ?? e.status,
        e.name,
        e.email,
        e.phone,
        d.organisation,
        others,
        e.message,
        d._note,
        alert ? (alert.status === "sent" ? "Sent" : alert.error ?? alert.status) : "",
      ]
        .map(cell)
        .join(",");
    });
    const date = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
    return new Response("﻿" + [header.map(cell).join(","), ...lines].join("\r\n"), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="HKBK-College-of-Engineering-enquiries-${date}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    return new Response(err instanceof Error ? err.message : "The enquiries could not be exported.", { status: 500 });
  }
}
