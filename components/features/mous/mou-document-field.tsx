"use client";

import { useRef, useState } from "react";
import { FileText, Loader2, Upload } from "lucide-react";
import { checkMouDocumentAction, mouUploadTicketAction } from "@/actions/mous";
import { Checkbox } from "@/components/ui/checkbox";
import { MAX_MOU_DOCUMENT_BYTES, MOU_DOCUMENT_BUCKET } from "@/lib/mous";
import { adminPill } from "@/lib/ui";
import { cn } from "@/lib/utils";

/** Sends the PDF straight to the private bucket with the one-time ticket from the server. */
async function uploadPdf(file: File): Promise<string> {
  const ticket = await mouUploadTicketAction();
  if (!ticket.ok) throw new Error(ticket.error);
  const base = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const res = await fetch(`${base}/storage/v1/object/upload/sign/${MOU_DOCUMENT_BUCKET}/${ticket.path}?token=${encodeURIComponent(ticket.token)}`, {
    method: "PUT",
    headers: { apikey: key, "Content-Type": "application/pdf", "x-upsert": "false" },
    body: file,
  });
  if (!res.ok) throw new Error(`The document could not be uploaded (${res.status}).`);
  const check = await checkMouDocumentAction(ticket.path);
  if (!check.ok) throw new Error(check.error);
  return ticket.path;
}

/**
 * The MoU document on the card form: upload or replace a PDF (up to 10 MB), remove it, and choose
 * whether visitors see a download link. Documents are admin-only unless that box is ticked.
 */
export default function MouDocumentField({
  id,
  path,
  visible,
  onChange,
}: {
  id: string;
  path: string;
  visible: boolean;
  onChange: (path: string, visible: boolean) => void;
}) {
  const file = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const outline = cn(adminPill, "border border-border bg-card text-foreground hover:bg-muted");

  return (
    <div className="grid w-full gap-1.5 rounded-lg border border-dashed border-border p-2 text-left">
      <div className="flex flex-wrap items-center gap-1.5">
        <FileText aria-hidden="true" className="size-4 text-muted-foreground" />
        <span className="flex-1 text-xs text-muted-foreground">{path ? "PDF uploaded" : "No MoU document"}</span>
        <button type="button" className={outline} disabled={busy} onClick={() => file.current?.click()}>
          {busy ? <Loader2 aria-hidden="true" className="size-3 animate-spin" /> : <Upload aria-hidden="true" className="size-3" />}
          {busy ? "Uploading…" : path ? "Replace PDF" : "Upload PDF"}
        </button>
        {path && !busy && (
          <button type="button" className={outline} onClick={() => onChange("", false)}>
            Remove
          </button>
        )}
      </div>
      <input
        ref={file}
        type="file"
        accept="application/pdf"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (!f) return;
          if (f.type !== "application/pdf") return setError("Choose a PDF document.");
          if (f.size > MAX_MOU_DOCUMENT_BYTES) return setError("That document is larger than 10 MB. Choose a smaller one.");
          setError("");
          setBusy(true);
          try {
            onChange(await uploadPdf(f), visible);
          } catch (err) {
            setError(err instanceof Error ? err.message : "The document could not be uploaded.");
          } finally {
            setBusy(false);
          }
        }}
      />
      {path && (
        <label htmlFor={`${id}-public`} className="flex items-center gap-2 text-xs text-foreground">
          <Checkbox id={`${id}-public`} checked={visible} onChange={(e) => onChange(path, e.target.checked)} />
          Show download link to visitors
        </label>
      )}
      {error && <p role="alert" className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}
