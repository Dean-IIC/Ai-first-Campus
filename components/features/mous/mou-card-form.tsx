"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { useAdmin } from "@/components/features/admin/admin-provider";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { checkLogo, shrinkLogo } from "@/lib/cms/client-image";
import { MOU_STATUSES, MOU_TYPES, type MouStatus } from "@/lib/mous";
import type { Mou } from "@/lib/types";
import { adminPill, navyPill } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { MouLogo } from "./mou-card-view";
import MouDocumentField from "./mou-document-field";
import { useMouEditor, type MouDraft } from "./mou-editor";

const EMPTY: MouDraft = { partner: "", partner_type: "Industry", departments: "", association: "", academic_year: "", purpose: "", signed_on: null, valid_until: null, status: "Automatic", logo_url: null, document_url: null, document_path: "", document_public: false };

/** Small labelled field on the card form. */
function Row({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="grid w-full gap-1 text-left text-xs font-medium text-muted-foreground">
      {label}
      {children}
    </label>
  );
}

/**
 * The MoU card as a form, for Add and Edit: click the logo to upload or replace it (converted to a
 * PNG, shown on white without cropping), fill in the details and the document, then Save or Cancel.
 */
export default function MouCardForm({ mou, onDone }: { mou?: Mou; onDone: () => void }) {
  const { uploadImage } = useAdmin();
  const { saveMou, departments } = useMouEditor();
  const [d, setD] = useState<MouDraft>(() => ({ ...EMPTY, ...mou, departments: mou?.departments ?? "", document_path: mou?.document_path ?? "", status: mou?.status ?? "Automatic" }));
  const [logo, setLogo] = useState<Blob | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const file = useRef<HTMLInputElement>(null);
  const id = `mou-${mou?.slug || "new"}`;
  const set = (patch: Partial<MouDraft>) => setD((old) => ({ ...old, ...patch }));
  const logoUrl = useMemo(() => (logo ? URL.createObjectURL(logo) : null), [logo]);
  useEffect(() => () => {
    if (logoUrl) URL.revokeObjectURL(logoUrl);
  }, [logoUrl]);
  const preview = logoUrl ?? d.logo_url;

  async function save() {
    setError("");
    setBusy(true);
    try {
      const logo_url = logo ? await uploadImage(logo, `${id}.png`) : d.logo_url;
      const problem = await saveMou(mou?.slug ?? null, { ...d, logo_url, signed_on: d.signed_on || null, valid_until: d.valid_until || null });
      if (problem) return setError(problem);
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "The logo could not be uploaded.");
    } finally {
      setBusy(false);
    }
  }

  const field = "h-8 text-sm";
  return (
    <div className="relative flex h-full flex-col items-center gap-2 rounded-xl border-2 border-primary bg-card p-3 text-center shadow-md">
      <button type="button" onClick={() => file.current?.click()} className="relative rounded-xl focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60" aria-label={preview ? "Replace logo" : "Upload logo"}>
        <MouLogo partner={d.partner} src={preview} />
        <span className="absolute -bottom-1 -right-1 grid size-7 place-items-center rounded-full bg-brand-dark text-white shadow">
          <Camera aria-hidden="true" className="size-3.5" />
        </span>
      </button>
      <input
        ref={file}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/svg+xml"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (!f) return;
          const problem = checkLogo(f);
          if (problem) return setError(problem);
          try {
            setLogo(await shrinkLogo(f));
          } catch (err) {
            setError(err instanceof Error ? err.message : "The logo could not be read.");
          }
        }}
      />
      <Input aria-label="Partner organisation name" placeholder="Partner organisation name *" value={d.partner} onChange={(e) => set({ partner: e.target.value })} maxLength={300} className={field} autoFocus />
      <div className="grid w-full grid-cols-2 gap-2">
        <Row label="Type" htmlFor={`${id}-type`}>
          <NativeSelect id={`${id}-type`} value={d.partner_type} onChange={(e) => set({ partner_type: e.target.value })} className="min-h-8 py-1 text-sm">
            {MOU_TYPES.map((t) => <option key={t}>{t}</option>)}
          </NativeSelect>
        </Row>
        <Row label="Status" htmlFor={`${id}-status`}>
          <NativeSelect id={`${id}-status`} value={d.status ?? "Automatic"} onChange={(e) => set({ status: e.target.value as MouStatus })} className="min-h-8 py-1 text-sm">
            {MOU_STATUSES.map((s) => <option key={s}>{s}</option>)}
          </NativeSelect>
        </Row>
        <Row label="Date signed" htmlFor={`${id}-signed`}>
          <Input id={`${id}-signed`} type="date" value={d.signed_on ?? ""} onChange={(e) => set({ signed_on: e.target.value })} className={field} />
        </Row>
        <Row label="Valid until (optional)" htmlFor={`${id}-until`}>
          <Input id={`${id}-until`} type="date" value={d.valid_until ?? ""} onChange={(e) => set({ valid_until: e.target.value })} className={field} />
        </Row>
      </div>
      <Input aria-label="Department(s) involved" placeholder="Department(s), or Institution-wide" value={d.departments ?? ""} onChange={(e) => set({ departments: e.target.value })} maxLength={300} className={field} list={`${id}-depts`} />
      <datalist id={`${id}-depts`}>{["Institution-wide", ...departments].map((x) => <option key={x} value={x} />)}</datalist>
      <Input aria-label="Academic year" placeholder="Academic year, e.g. AY 2025-27" value={d.academic_year ?? ""} onChange={(e) => set({ academic_year: e.target.value })} maxLength={300} className={field} />
      <Input aria-label="Association" placeholder="Signed by, e.g. HKBKCE or VTU and HKBKCE" value={d.association ?? ""} onChange={(e) => set({ association: e.target.value })} maxLength={300} className={field} />
      <Textarea aria-label="Purpose" placeholder="Purpose, in two or three lines" value={d.purpose ?? ""} onChange={(e) => set({ purpose: e.target.value })} maxLength={600} rows={3} className="text-sm" />
      <MouDocumentField id={id} path={d.document_path ?? ""} visible={Boolean(d.document_public)} onChange={(document_path, document_public) => set({ document_path, document_public })} />
      {error && <p role="alert" className="text-xs font-medium text-destructive">{error}</p>}
      <div className="mt-auto flex gap-1.5">
        <button type="button" className={navyPill} disabled={busy} onClick={save}>
          {busy && <Loader2 aria-hidden="true" className="size-3 animate-spin" />}
          {busy ? "Saving…" : "Save"}
        </button>
        <button type="button" className={cn(adminPill, "border border-border bg-card text-foreground hover:bg-muted")} disabled={busy} onClick={onDone}>
          Cancel
        </button>
      </div>
    </div>
  );
}
