"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CircleAlert, Loader2, Trash2 } from "lucide-react";
import { deleteAiPerson, saveAiPerson } from "@/actions/ai-people";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { refreshSession, uploadPersonPhoto } from "@/lib/editor";
import { hasPerson } from "@/lib/ai-people";
import type { EditablePerson } from "./person-edit-button";
import PersonPhotoField from "./person-photo-field";

/**
 * The fields for one card. Student Ambassadors: photo, name, department and a short line.
 * Faculty Champions: photo (with circular crop), name, designation and department.
 */
export default function PersonEditForm({ p, departments, onDone }: { p: EditablePerson; departments: string[]; onDone: () => void }) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(p.photoUrl);
  const [busy, setBusy] = useState<"save" | "delete" | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState("");
  const faculty = p.role === "Faculty champion";
  const filled = hasPerson(p);

  async function save(form: FormData) {
    setError("");
    setBusy("save");
    try {
      await refreshSession();
      const photoUrl = file ? await uploadPersonPhoto(file) : preview;
      const res = await saveAiPerson({
        slug: p.slug ?? undefined,
        role: p.role,
        name: String(form.get("name") ?? ""),
        department: String(form.get("department") ?? ""),
        bio: String(form.get("bio") ?? ""),
        sortOrder: p.index,
        photoUrl,
      });
      if (!res.ok) throw new Error(res.message);
      router.refresh();
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "The change could not be saved.");
    } finally {
      setBusy(null);
    }
  }

  async function remove() {
    if (!filled) return;
    if (!confirmDelete) return setConfirmDelete(true);
    setBusy("delete");
    const res = await deleteAiPerson({ slug: p.slug, role: p.role, sortOrder: p.index });
    setBusy(null);
    if (!res.ok) return setError(res.message);
    router.refresh();
    onDone();
  }

  return (
    <form action={save} className="grid gap-4" noValidate>
      <PersonPhotoField
        preview={preview}
        crop={faculty}
        label={p.name || `${p.label} ${p.index}`}
        onPick={(f, url) => {
          setFile(f);
          setPreview(url);
        }}
        onRemove={() => {
          setFile(null);
          setPreview(null);
        }}
      />
      <div className="grid gap-1.5">
        <Label htmlFor="person-name">Full name</Label>
        <Input id="person-name" name="name" defaultValue={p.name} required maxLength={120} autoComplete="off" />
      </div>
      {faculty ? (
        <>
      <div className="grid gap-1.5">
        <Label htmlFor="person-bio">{faculty ? "Designation" : "Designation or year"} <span className="font-normal text-muted-foreground">(optional)</span></Label>
        <Input id="person-bio" name="bio" defaultValue={p.bio} maxLength={120} placeholder={faculty ? "For example: Assistant Professor" : "For example: Assistant Professor, or 3rd year"} />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="person-dept">Department</Label>
        <Input id="person-dept" name="department" defaultValue={p.department} list="person-departments" maxLength={120} autoComplete="off" />
        <datalist id="person-departments">
          {departments.map((d) => (
            <option key={d} value={d} />
          ))}
        </datalist>
      </div>
        </>
      ) : (
        <>
      <div className="grid gap-1.5">
        <Label htmlFor="person-dept">Department</Label>
        <Input id="person-dept" name="department" defaultValue={p.department} list="person-departments" maxLength={120} autoComplete="off" />
        <datalist id="person-departments">
          {departments.map((d) => (
            <option key={d} value={d} />
          ))}
        </datalist>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="person-bio">{faculty ? "Designation" : "Designation or year"} <span className="font-normal text-muted-foreground">(optional)</span></Label>
        <Input id="person-bio" name="bio" defaultValue={p.bio} maxLength={120} placeholder={faculty ? "For example: Assistant Professor" : "For example: Assistant Professor, or 3rd year"} />
      </div>
        </>
      )}
      {error && (
        <Alert variant="destructive">
          <CircleAlert aria-hidden="true" />
          <AlertDescription className="text-foreground">{error}</AlertDescription>
        </Alert>
      )}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        {filled ? (
          <Button type="button" variant="ghost" size="sm" onClick={remove} disabled={busy !== null} className="text-destructive">
            {busy === "delete" ? <Loader2 aria-hidden="true" className="animate-spin" /> : <Trash2 aria-hidden="true" />}
            {confirmDelete ? "Click again to clear this card" : "Clear this card"}
          </Button>
        ) : (
          <span />
        )}
        <Button type="submit" disabled={busy !== null}>
          {busy === "save" && <Loader2 aria-hidden="true" className="animate-spin" />}
          {busy === "save" ? "Saving…" : "Save"}
        </Button>
      </div>
    </form>
  );
}
