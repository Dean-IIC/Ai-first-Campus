"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { useAdmin } from "@/components/features/admin/admin-provider";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { checkPicture, shrinkPicture } from "@/lib/cms/client-image";
import { EVENT_CATEGORIES } from "@/lib/events";
import type { NewsItem } from "@/lib/types";
import { adminPill, navyPill } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { useEventsEditor, type EventDraft } from "./events-editor";

const EMPTY: EventDraft = { title: "", summary: "", event_date: "", end_date: "", event_time: "", venue: "", category: "Other", poster_url: null, link_url: "" };

function Row({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="grid gap-1 text-xs font-medium text-muted-foreground">
      {label}
      {children}
    </label>
  );
}

/**
 * An event as a form, for Add and Edit: title, dates, time, venue, category, description, link and
 * an optional poster or photo (shrunk before upload, shown in full), then Save or Cancel.
 */
export default function EventCardForm({ event, onDone }: { event?: NewsItem; onDone: () => void }) {
  const { uploadImage } = useAdmin();
  const { saveEvent } = useEventsEditor();
  const [d, setD] = useState<EventDraft>(() => ({ ...EMPTY, ...(event ?? {}), category: event?.category ?? "Other" }));
  const [poster, setPoster] = useState<Blob | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const file = useRef<HTMLInputElement>(null);
  const id = `ev-${event?.slug || "new"}`;
  const set = (patch: Partial<EventDraft>) => setD((old) => ({ ...old, ...patch }));
  const posterUrl = useMemo(() => (poster ? URL.createObjectURL(poster) : null), [poster]);
  useEffect(() => () => {
    if (posterUrl) URL.revokeObjectURL(posterUrl);
  }, [posterUrl]);
  const preview = posterUrl ?? d.poster_url;

  async function save() {
    setError("");
    setBusy(true);
    try {
      const poster_url = poster ? await uploadImage(poster, `${id}.jpg`) : d.poster_url;
      const clean = (v: string | null | undefined) => (v ?? "").trim() || null;
      const problem = await saveEvent(event?.slug ?? null, {
        ...d,
        poster_url,
        summary: clean(d.summary),
        end_date: clean(d.end_date),
        event_time: clean(d.event_time),
        venue: clean(d.venue),
        link_url: clean(d.link_url),
      });
      if (problem) return setError(problem);
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "The poster could not be uploaded.");
    } finally {
      setBusy(false);
    }
  }

  const field = "h-9 text-sm";
  return (
    <div className="my-3 grid gap-3 rounded-xl border-2 border-primary bg-card p-4 shadow-md">
      <Input aria-label="Event title" placeholder="Event title *" value={d.title} onChange={(e) => set({ title: e.target.value })} maxLength={300} className={field} autoFocus />
      <div className="grid gap-3 sm:grid-cols-3">
        <Row label="Start date *" htmlFor={`${id}-start`}>
          <Input id={`${id}-start`} type="date" value={d.event_date ?? ""} onChange={(e) => set({ event_date: e.target.value })} className={field} />
        </Row>
        <Row label="End date (optional)" htmlFor={`${id}-end`}>
          <Input id={`${id}-end`} type="date" value={d.end_date ?? ""} onChange={(e) => set({ end_date: e.target.value })} className={field} />
        </Row>
        <Row label="Category" htmlFor={`${id}-cat`}>
          <NativeSelect id={`${id}-cat`} value={d.category ?? "Other"} onChange={(e) => set({ category: e.target.value })} className="min-h-9 py-1.5 text-sm">
            {EVENT_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </NativeSelect>
        </Row>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input aria-label="Time" placeholder="Time, e.g. 10:00 am – 1:00 pm (optional)" value={d.event_time ?? ""} onChange={(e) => set({ event_time: e.target.value })} maxLength={120} className={field} />
        <Input aria-label="Venue" placeholder="Venue, e.g. Seminar Hall or Online" value={d.venue ?? ""} onChange={(e) => set({ venue: e.target.value })} maxLength={200} className={field} />
      </div>
      <Textarea aria-label="Short description" placeholder="Short description, in two or three lines" value={d.summary ?? ""} onChange={(e) => set({ summary: e.target.value })} maxLength={600} rows={3} className="text-sm" />
      <Input aria-label="Registration or details link" placeholder="Registration or details link (https://…), optional" value={d.link_url ?? ""} onChange={(e) => set({ link_url: e.target.value })} maxLength={500} className={field} />
      <div className="flex flex-wrap items-center gap-3">
        {preview && <img src={preview} alt="" className="h-24 w-20 rounded-md bg-white object-contain ring-1 ring-border" />}
        <button type="button" className={cn(adminPill, "border border-border bg-card text-foreground hover:bg-muted")} onClick={() => file.current?.click()}>
          <ImagePlus aria-hidden="true" className="size-3.5" />
          {preview ? "Replace poster or photo" : "Add poster or photo (optional)"}
        </button>
        {preview && (
          <button type="button" className="text-xs text-muted-foreground underline-offset-4 hover:underline" onClick={() => { setPoster(null); set({ poster_url: null }); }}>
            Remove
          </button>
        )}
        <input
          ref={file}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            if (!f) return;
            const problem = checkPicture(f);
            if (problem) return setError(problem);
            setPoster(await shrinkPicture(f).catch(() => null));
          }}
        />
      </div>
      {error && <p role="alert" className="text-xs font-medium text-destructive">{error}</p>}
      <div className="flex gap-1.5">
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
