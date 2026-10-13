"use client";

/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/components/features/admin/admin-provider";
import { checkPicture, shrinkPicture } from "@/lib/cms/client-image";

/** A photo in the content editor: shows the current one, uploads a replacement, or removes it. */
export default function ImageField({ value, onChange, name }: { value: string; onChange: (url: string) => void; name: string }) {
  const { uploadImage } = useAdmin();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function pick(file: File | undefined) {
    if (!file) return;
    const problem = checkPicture(file);
    if (problem) return setError(problem);
    setError("");
    setBusy(true);
    try {
      const blob = await shrinkPicture(file, 1600);
      onChange(await uploadImage(blob, `${name.replace(/[^a-z0-9]+/gi, "-")}.jpg`));
    } catch (err) {
      setError(err instanceof Error ? err.message : "The picture could not be uploaded.");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div className="grid gap-2">
      <div className="flex items-center gap-3">
        {value ? (
          <img src={value} alt="" className="size-16 rounded-md border border-border object-cover" />
        ) : (
          <span className="grid size-16 place-items-center rounded-md border border-dashed border-border text-xs text-muted-foreground">No photo</span>
        )}
        <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" tabIndex={-1} aria-hidden="true" onChange={(e) => pick(e.target.files?.[0])} />
        <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => input.current?.click()}>
          {busy ? <Loader2 aria-hidden="true" className="animate-spin" /> : <ImagePlus aria-hidden="true" />}
          {busy ? "Uploading…" : value ? "Replace photo" : "Upload photo"}
        </Button>
        {value && !busy && (
          <Button type="button" size="sm" variant="ghost" className="text-destructive" onClick={() => onChange("")}>
            <Trash2 aria-hidden="true" />
            Remove
          </Button>
        )}
      </div>
      {error && <p role="alert" className="text-sm font-medium text-destructive">{error}</p>}
    </div>
  );
}
