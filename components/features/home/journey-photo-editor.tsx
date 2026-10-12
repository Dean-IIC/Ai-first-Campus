"use client";

import { useRef, useState } from "react";
import { Camera, ImageOff, ImagePlus, Loader2 } from "lucide-react";
import { setJourneyPhotoAction } from "@/actions/journey";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { checkPicture, shrinkPicture } from "@/lib/cms/client-image";
import { uploadJourneyPhoto } from "@/lib/editor";
import type { JourneyInlinePhoto } from "@/lib/journey-model";
import JourneyPhotoFigure from "./journey-photo";

/**
 * The photo block for an editor: Replace or Add, Remove, and the caption and alt text. A month
 * without a photo shows "Photo coming soon". Uploads are resized to 1600px and compressed first.
 */
export default function JourneyPhotoEditor({
  slug,
  period,
  photo,
  onSaved,
}: {
  slug: string;
  period: string;
  photo: JourneyInlinePhoto | null;
  onSaved: (photo: JourneyInlinePhoto | null) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<"upload" | "save" | null>(null);
  const [message, setMessage] = useState("");

  async function save(next: JourneyInlinePhoto | null) {
    setBusy("save");
    setMessage("");
    const res = await setJourneyPhotoAction(slug, next);
    setBusy(null);
    if (!res.ok) return setMessage(res.message);
    onSaved(next);
  }

  async function pick(file: File) {
    const problem = checkPicture(file);
    if (problem) return setMessage(problem);
    setMessage("");
    setBusy("upload");
    try {
      const src = await uploadJourneyPhoto(await shrinkPicture(file, 1600));
      setBusy(null);
      await save({ src, alt: photo?.alt || `Photo from ${period}`, caption: photo?.caption ?? "" });
    } catch (err) {
      setBusy(null);
      setMessage(err instanceof Error ? err.message : "The photo could not be uploaded.");
    }
  }

  const chooser = (
    <input
      ref={input}
      type="file"
      accept="image/jpeg,image/png,image/webp"
      className="sr-only"
      tabIndex={-1}
      aria-label={`Choose a photo for ${period}`}
      onChange={(e) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (file) void pick(file);
      }}
    />
  );

  return (
    <div className="my-5">
      {photo ? (
        <>
          <JourneyPhotoFigure photo={photo} />
          <div className="mx-auto flex w-full max-w-[90%] flex-wrap items-center justify-center gap-2 sm:max-w-[400px]">
            <Button type="button" size="sm" variant="outline" disabled={busy !== null} onClick={() => input.current?.click()}>
              <Camera aria-hidden="true" />
              Replace photo
            </Button>
            <Button type="button" size="sm" variant="ghost" disabled={busy !== null} className="text-destructive" onClick={() => save(null)}>
              <ImageOff aria-hidden="true" />
              Remove photo
            </Button>
          </div>
          <div className="mx-auto mt-3 grid w-full max-w-[90%] gap-3 sm:max-w-[400px]">
            <label className="grid gap-1 text-xs text-muted-foreground">
              Caption (optional)
              <Input
                key={`c-${photo.src}-${photo.caption}`}
                defaultValue={photo.caption}
                maxLength={300}
                onBlur={(e) => {
                  const v = e.currentTarget.value.trim();
                  if (v !== photo.caption) void save({ ...photo, caption: v });
                }}
              />
            </label>
            <label className="grid gap-1 text-xs text-muted-foreground">
              Alt text (read by screen readers)
              <Input
                key={`a-${photo.src}-${photo.alt}`}
                defaultValue={photo.alt}
                maxLength={300}
                onBlur={(e) => {
                  const v = e.currentTarget.value.trim();
                  if (v && v !== photo.alt) void save({ ...photo, alt: v });
                }}
              />
            </label>
          </div>
        </>
      ) : (
        <div className="mx-auto grid h-40 w-full max-w-[90%] place-items-center rounded-xl border border-dashed border-t-teal/50 bg-muted/60 text-center sm:max-w-[400px]">
          <div className="grid justify-items-center gap-2">
            <p className="text-sm text-muted-foreground">Photo coming soon</p>
            <Button type="button" size="sm" variant="outline" disabled={busy !== null} onClick={() => input.current?.click()}>
              <ImagePlus aria-hidden="true" />
              Add photo
            </Button>
          </div>
        </div>
      )}
      {chooser}
      {busy && (
        <p role="status" className="mt-2 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 aria-hidden="true" className="size-4 animate-spin" />
          {busy === "upload" ? "Uploading photo…" : "Saving…"}
        </p>
      )}
      {message && (
        <p role="alert" className="mt-2 text-center text-sm font-medium text-destructive">
          {message}
        </p>
      )}
    </div>
  );
}
