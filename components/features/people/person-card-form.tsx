"use client";

/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { useAdmin } from "@/components/features/admin/admin-provider";
import { Input } from "@/components/ui/input";
import { checkPicture } from "@/lib/cms/client-image";
import type { AiRole } from "@/lib/ai-people";
import type { AiPerson } from "@/lib/types";
import { adminPill, navyPill } from "@/lib/ui";
import { cn } from "@/lib/utils";
import ChampionCropDialog from "./champion-crop-dialog";
import { usePeopleEditor } from "./people-editor";

/**
 * The card as a form, for Add and Edit: click the photo to upload or replace it (with a circular
 * crop), type the name and details, then Save or Cancel. Used by both sections.
 */
export default function PersonCardForm({ role, index, person, compact, onDone }: { role: AiRole; index: number; person?: AiPerson; compact: boolean; onDone: (saved?: AiPerson) => void }) {
  const { uploadImage } = useAdmin();
  const { savePerson, departments } = usePeopleEditor();
  const faculty = role === "Faculty champion";
  const [name, setName] = useState(person?.name ?? "");
  const [bio, setBio] = useState(person?.bio ?? "");
  const [department, setDepartment] = useState(person?.department ?? "");
  const [photo, setPhoto] = useState<string | null>(person?.photo_url ?? null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const file = useRef<HTMLInputElement>(null);
  const id = `${faculty ? "fc" : "sa"}-${index}`;

  async function save() {
    setError("");
    setBusy(true);
    try {
      const url = blob ? await uploadImage(blob, `${id}.jpg`) : photo;
      const draft = { name, bio, department, photo_url: url };
      const problem = await savePerson(role, index, draft);
      if (problem) return setError(problem);
      onDone({ slug: person?.slug ?? "", role, sort_order: index, name: name.trim(), bio: bio.trim() || null, department: department.trim() || null, photo_url: url });
    } catch (err) {
      setError(err instanceof Error ? err.message : "The photo could not be uploaded.");
    } finally {
      setBusy(false);
    }
  }

  const field = "h-8 text-sm";
  return (
    <li className={cn("relative flex flex-col items-center gap-2 rounded-xl border-2 border-primary bg-card p-3 text-center shadow-md", compact && "col-span-2")}>
      <button type="button" onClick={() => file.current?.click()} className="group relative rounded-full focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60" aria-label={photo ? "Replace photo" : "Upload photo"}>
        {photo ? (
          <img src={photo} alt="" className="size-20 rounded-full object-cover ring-[3px] ring-t-teal ring-offset-2 ring-offset-card" />
        ) : (
          <span className="grid size-20 place-items-center rounded-full border-2 border-dashed border-t-teal/50 bg-muted text-[0.6875rem] text-muted-foreground">Add photo</span>
        )}
        <span className="absolute bottom-0 right-0 grid size-7 place-items-center rounded-full bg-brand-dark text-white shadow">
          <Camera aria-hidden="true" className="size-3.5" />
        </span>
      </button>
      <input
        ref={file}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (!f) return;
          const problem = checkPicture(f);
          if (problem) return setError(problem);
          setCropSrc(URL.createObjectURL(f));
        }}
      />
      {photo && (
        <button type="button" className="text-xs text-muted-foreground underline-offset-4 hover:underline" onClick={() => { setPhoto(null); setBlob(null); }}>
          Remove photo
        </button>
      )}
      <Input aria-label="Full name" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} maxLength={120} className={field} autoFocus />
      <Input aria-label={faculty ? "Designation" : "Year"} placeholder={faculty ? "Designation" : "Year, e.g. 3rd year"} value={bio} onChange={(e) => setBio(e.target.value)} maxLength={120} className={field} />
      <Input aria-label={faculty ? "Department" : "Branch"} placeholder={faculty ? "Department" : "Branch"} value={department} onChange={(e) => setDepartment(e.target.value)} maxLength={120} className={field} list={`${id}-depts`} />
      <datalist id={`${id}-depts`}>{departments.map((d) => <option key={d} value={d} />)}</datalist>
      {error && <p role="alert" className="text-xs font-medium text-destructive">{error}</p>}
      <div className="flex gap-1.5">
        <button type="button" className={navyPill} disabled={busy} onClick={save}>
          {busy && <Loader2 aria-hidden="true" className="size-3 animate-spin" />}
          {busy ? "Saving…" : "Save"}
        </button>
        <button type="button" className={cn(adminPill, "border border-border bg-card text-foreground hover:bg-muted")} disabled={busy} onClick={() => onDone()}>
          Cancel
        </button>
      </div>
      {cropSrc && (
        <ChampionCropDialog
          src={cropSrc}
          label={name || `${faculty ? "Faculty Champion" : "Student Ambassador"} ${index}`}
          onCancel={() => { URL.revokeObjectURL(cropSrc); setCropSrc(null); }}
          onApply={(b) => {
            URL.revokeObjectURL(cropSrc);
            setCropSrc(null);
            setBlob(b);
            setPhoto(URL.createObjectURL(b));
          }}
        />
      )}
    </li>
  );
}
