"use client";

import { useState } from "react";
import { Loader2, Mail, MailWarning, Phone } from "lucide-react";
import { updateEnquiryAction } from "@/actions/enquiries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { ENQUIRY_STATUSES, FORM_LABELS, STATUS_LABELS, publicDetails, type AlertResult, type Enquiry } from "@/lib/enquiry";
import { cn } from "@/lib/utils";

const when = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" });

/** One enquiry: what the visitor sent (shown as plain text), its status, the admin note and the email alert result. */
export default function EnquiryCard({ enquiry, highlighted }: { enquiry: Enquiry; highlighted: boolean }) {
  const [e, setE] = useState(enquiry);
  const [status, setStatus] = useState<string>(enquiry.status);
  const [note, setNote] = useState(typeof enquiry.details._note === "string" ? enquiry.details._note : "");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const alert = e.details._alert as AlertResult | undefined;
  const dirty = status !== e.status || note !== (e.details._note ?? "");

  async function save() {
    setBusy(true);
    setMsg(null);
    const r = await updateEnquiryAction(e.id, status, note);
    setBusy(false);
    if (r.ok) {
      setE(r.enquiry);
      setMsg({ ok: true, text: "Saved." });
    } else setMsg({ ok: false, text: r.error });
  }

  return (
    <li id={`e-${e.id}`} className={cn("scroll-mt-24 rounded-xl border bg-card p-4 shadow-xs sm:p-5", highlighted ? "border-primary ring-2 ring-primary/30" : "border-border")}>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <Badge variant="secondary">{FORM_LABELS[e.type] ?? e.type}</Badge>
        <Badge variant={e.status === "new" ? "default" : "muted"}>{STATUS_LABELS[e.status]}</Badge>
        <span className="text-muted-foreground">{when(e.created_at)}</span>
      </div>
      <p className="mt-2 text-lg font-semibold text-heading">{e.name}</p>
      <p className="mt-1 flex flex-wrap gap-x-5 gap-y-1 text-sm">
        {e.email && (
          <a href={`mailto:${e.email}`} className="inline-flex items-center gap-1.5 text-primary hover:underline">
            <Mail aria-hidden="true" className="size-4" />
            {e.email}
          </a>
        )}
        {e.phone && (
          <a href={`tel:${e.phone.replace(/\s+/g, "")}`} className="inline-flex items-center gap-1.5 text-primary hover:underline">
            <Phone aria-hidden="true" className="size-4" />
            {e.phone}
          </a>
        )}
      </p>
      {publicDetails(e.details).length > 0 && (
        <dl className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm">
          {publicDetails(e.details).map(([k, v]) => (
            <div key={k} className="flex gap-1.5">
              <dt className="text-muted-foreground">{k}:</dt>
              <dd className="font-medium">{v}</dd>
            </div>
          ))}
        </dl>
      )}
      {e.message && <p className="mt-3 whitespace-pre-wrap rounded-lg bg-muted p-3 text-[0.9375rem]">{e.message}</p>}
      {alert && alert.status !== "sent" && (
        <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          <MailWarning aria-hidden="true" className={cn("size-4", alert.status === "failed" && "text-destructive")} />
          {alert.status === "failed" ? `Email alert failed: ${alert.error}` : alert.error}
        </p>
      )}
      {alert?.status === "sent" && <p className="mt-3 text-sm text-muted-foreground">Email alert sent.</p>}

      <div className="mt-4 grid gap-3 border-t border-border pt-4 sm:grid-cols-[12rem_1fr]">
        <div className="grid gap-1.5">
          <Label htmlFor={`s-${e.id}`}>Status</Label>
          <NativeSelect id={`s-${e.id}`} value={status} onChange={(ev) => setStatus(ev.target.value)}>
            {ENQUIRY_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </NativeSelect>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor={`n-${e.id}`}>Admin note <span className="font-normal text-muted-foreground">(private)</span></Label>
          <Textarea id={`n-${e.id}`} value={note} onChange={(ev) => setNote(ev.target.value)} rows={2} maxLength={2000} className="min-h-16" />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <Button type="button" size="sm" disabled={!dirty || busy} onClick={save}>
          {busy && <Loader2 aria-hidden="true" className="animate-spin" />}
          {busy ? "Saving…" : "Save"}
        </Button>
        {msg && <p role="status" className={cn("text-sm", msg.ok ? "text-muted-foreground" : "font-medium text-destructive")}>{msg.text}</p>}
      </div>
    </li>
  );
}
