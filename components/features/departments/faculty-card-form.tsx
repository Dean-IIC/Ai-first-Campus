"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useRef, useState } from "react";
import { Crop, ImagePlus, Loader2 } from "lucide-react";
import { useAdmin } from "@/components/features/admin/admin-provider";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { checkPicture, shrinkPicture } from "@/lib/cms/client-image";
import { FACULTY_RANKS } from "@/lib/site";
import type { Faculty } from "@/lib/types";
import { adminPill, navyPill } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { useFacultyEditor, type FacultyDraft } from "./faculty-editor";
import PortraitCropDialog from "./portrait-crop-dialog";

const plainPill = cn(adminPill, "border border-border bg-card text-foreground hover:bg-muted");

/**
 * A faculty member as a form, for Add and Edit: name, designation, qualification, head of the
 * department and a portrait photo (shrunk in the browser before upload), then Save or Cancel.
 */
export default function FacultyCardForm({ person, nextOrder, onDone }: { person?: Faculty; nextOrder: number; onDone: () => void }) {
  const { uploadImage } = useAdmin();
  const { saveFaculty, ranks } = useFacultyEditor();
  // The rank list, plus this person's designation if it was removed from the list since.
  const options = person?.designation && !ranks.includes(person.designation) ? [...ranks, person.designation] : ranks;
  const [d, setD] = useState<FacultyDraft>(() => ({
    name: person?.name ?? "",
    designation: person?.designation ?? (ranks.includes(FACULTY_RANKS[2]) ? FACULTY_RANKS[2] : ranks[0] ?? ""),
    qualification: person?.qualification ?? "",
    is_hod: person?.is_hod ?? false,
    photo_url: person?.photo_url ?? null,
    sort_order: person?.sort_order ?? nextOrder,
  }));
  const [photo, setPhoto] = useState<Blob | null>(null);
  // The picture as chosen (before cropping), so the crop can be redone; cropping holds it while the dialog is open.
  const [original, setOriginal] = useState<string | null>(null);
  const [cropping, setCropping] = useState(false);
  useEffect(() => () => {
    if (original) URL.revokeObjectURL(original);
  }, [original]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const file = useRef<HTMLInputElement>(null);
  const id = `fac-${person?.slug || "new"}`;
  const set = (patch: Partial<FacultyDraft>) => setD((old) => ({ ...old, ...patch }));
  const photoUrl = useMemo(() => (photo ? URL.createObjectURL(photo) : null), [photo]);
  useEffect(() => () => {
    if (photoUrl) URL.revokeObjectURL(photoUrl);
  }, [photoUrl]);
  const preview = photoUrl ?? d.photo_url;

  async function save() {
    setError("");
    setBusy(true);
    try {
      const photo_url = photo ? await uploadImage(photo, `${id}.jpg`) : d.photo_url;
      const problem = await saveFaculty(person?.slug ?? null, { ...d, photo_url, qualification: (d.qualification ?? "").trim() || null });
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
      <Input aria-label="Name" placeholder="Name *, e.g. Dr. Ravi Kumar" value={d.name} onChange={(e) => set({ name: e.target.value })} maxLength={300} className={field} autoFocus />
      <label htmlFor={`${id}-rank`} className="grid gap-1 text-xs font-medium text-muted-foreground">
        Designation *
        <NativeSelect id={`${id}-rank`} value={d.designation ?? ""} onChange={(e) => set({ designation: e.target.value })} className="min-h-9 py-1.5 text-sm">
          {options.map((r) => <option key={r}>{r}</option>)}
        </NativeSelect>
      </label>
      <Input aria-label="Qualification" placeholder="Qualification, e.g. M.Tech, Ph.D." value={d.qualification ?? ""} onChange={(e) => set({ qualification: e.target.value })} maxLength={300} className={field} />
      <label className="flex items-center gap-2 text-sm text-foreground">
        <input type="checkbox" checked={d.is_hod} onChange={(e) => set({ is_hod: e.target.checked })} className="size-4 accent-primary" />
        Head of the department (shown first)
      </label>
      <label htmlFor={`${id}-order`} className="grid gap-1 text-xs font-medium text-muted-foreground">
        Order within the designation
        <Input id={`${id}-order`} type="number" min={1} value={d.sort_order} onChange={(e) => set({ sort_order: Math.max(1, Number(e.target.value) || 1) })} className={cn(field, "w-24")} />
      </label>
      <div className="flex flex-wrap items-center gap-3">
        {preview && <img src={preview} alt="" className="aspect-[3/4] w-20 rounded-md object-cover ring-1 ring-border" />}
        <button type="button" className={plainPill} onClick={() => file.current?.click()}>
          <ImagePlus aria-hidden="true" className="size-3.5" />
          {preview ? "Replace photo" : "Add photo"}
        </button>
        {original && (
          <button type="button" className={plainPill} onClick={() => setCropping(true)}>
            <Crop aria-hidden="true" className="size-3.5" />
            Crop again
          </button>
        )}
        {preview && (
          <button type="button" className="text-xs text-muted-foreground underline-offset-4 hover:underline" onClick={() => { setPhoto(null); setOriginal(null); set({ photo_url: null }); }}>
            Remove
          </button>
        )}
        {cropping && original && (
          <PortraitCropDialog
            src={original}
            onApply={(blob) => {
              setPhoto(blob);
              setCropping(false);
            }}
            onCancel={() => setCropping(false)}
          />
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
            setError("");
            const shrunk = await shrinkPicture(f, 1600).catch(() => null);
            if (!shrunk) return setError("This picture could not be opened. Try a JPG or PNG.");
            setOriginal(URL.createObjectURL(shrunk));
            setCropping(true);
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
