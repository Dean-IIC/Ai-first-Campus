"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { useAdmin } from "@/components/features/admin/admin-provider";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Achievement } from "@/lib/achievements";
import { checkPicture, shrinkPicture } from "@/lib/cms/client-image";
import { adminPill, navyPill } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { useAchievementsEditor, type AchievementDraft } from "./achievements-editor";

const plainPill = cn(adminPill, "border border-border bg-card text-foreground hover:bg-muted");

/**
 * An achievement as a form, for Add and Edit: title, year or date, description and a photo (shrunk in
 * the browser before upload; shown whole in its frame, so it needs no cropping), then Save or Cancel.
 */
export default function AchievementCardForm({ item, onDone }: { item?: Achievement; onDone: () => void }) {
  const { uploadImage } = useAdmin();
  const { saveAchievement } = useAchievementsEditor();
  const [d, setD] = useState<AchievementDraft>(() => ({ title: item?.title ?? "", year: item?.year ?? "", text: item?.text ?? "", photo_url: item?.photo_url ?? null }));
  const [photo, setPhoto] = useState<Blob | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const file = useRef<HTMLInputElement>(null);
  const set = (patch: Partial<AchievementDraft>) => setD((old) => ({ ...old, ...patch }));
  const photoUrl = useMemo(() => (photo ? URL.createObjectURL(photo) : null), [photo]);
  useEffect(() => () => {
    if (photoUrl) URL.revokeObjectURL(photoUrl);
  }, [photoUrl]);
  const preview = photoUrl ?? d.photo_url;

  async function save() {
    setError("");
    setBusy(true);
    try {
      const photo_url = photo ? await uploadImage(photo, `achievement-${item?.id ?? "new"}.jpg`) : d.photo_url;
      const problem = await saveAchievement(item?.id ?? null, { ...d, photo_url });
      if (problem) return setError(problem);
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "The photo could not be uploaded.");
    } finally {
      setBusy(false);
    }
  }

  const field = "h-9 text-sm";
  return (
    <div className="grid gap-3 rounded-xl border-2 border-primary bg-card p-4 text-left shadow-md">
      <Input aria-label="Title" placeholder="Title *, e.g. 8th rank at VTU" value={d.title} onChange={(e) => set({ title: e.target.value })} maxLength={200} className={field} autoFocus />
      <Input aria-label="Year or date" placeholder="Year or date, e.g. 2025 or March 2026 (optional)" value={d.year} onChange={(e) => set({ year: e.target.value })} maxLength={40} className={field} />
      <Textarea aria-label="Description" placeholder="Description: who, what and where. A blank line starts a new paragraph." value={d.text} onChange={(e) => set({ text: e.target.value })} maxLength={3000} rows={4} className="text-sm" />
      <div className="flex flex-wrap items-center gap-3">
        {preview && <img src={preview} alt="" className="h-20 max-w-36 rounded-md bg-muted object-contain ring-1 ring-border" />}
        <button type="button" className={plainPill} onClick={() => file.current?.click()}>
          <ImagePlus aria-hidden="true" className="size-3.5" />
          {preview ? "Replace photo" : "Add photo"}
        </button>
        {preview && (
          <button type="button" className="text-xs text-muted-foreground underline-offset-4 hover:underline" onClick={() => { setPhoto(null); set({ photo_url: null }); }}>
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
            setPhoto(await shrinkPicture(f).catch(() => null));
          }}
        />
      </div>
      {error && <p role="alert" className="text-xs font-medium text-destructive">{error}</p>}
      <div className="flex gap-1.5">
        <button type="button" className={navyPill} disabled={busy} onClick={save}>
          {busy && <Loader2 aria-hidden="true" className="size-3 animate-spin" />}
          {busy ? "Saving…" : "Save"}
        </button>
        <button type="button" className={plainPill} disabled={busy} onClick={onDone}>
          Cancel
        </button>
      </div>
    </div>
  );
}
