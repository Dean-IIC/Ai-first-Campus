"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { ImageUp } from "lucide-react";
import { Label } from "@/components/ui/label";
import ChampionCropDialog from "./champion-crop-dialog";

/**
 * The photo part of the Add/Edit form: preview, choose, and Remove photo. With `crop` on
 * (faculty cards), the chosen picture opens a circular crop and zoom preview first; the
 * result is a 400 × 400 JPG.
 */
export default function PersonPhotoField({
  preview,
  crop,
  label,
  onPick,
  onRemove,
}: {
  preview: string | null;
  crop: boolean;
  label: string;
  onPick: (file: File, previewUrl: string) => void;
  onRemove: () => void;
}) {
  const [cropSrc, setCropSrc] = useState<string | null>(null);

  return (
    <div className="flex items-center gap-4">
      {preview ? (
        <img src={preview} alt="" className="size-20 rounded-full object-cover ring-4 ring-t-teal-tint" />
      ) : (
        <span className="grid size-20 place-items-center rounded-full border-2 border-dashed border-border text-xs text-muted-foreground">No photo</span>
      )}
      <div className="grid gap-2">
        <Label htmlFor="person-photo" className="inline-flex cursor-pointer items-center gap-2 text-primary">
          <ImageUp aria-hidden="true" className="size-4" /> {preview ? "Change photo" : "Add photo"}
        </Label>
        <input
          id="person-photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0] ?? null;
            e.target.value = "";
            if (!f) return;
            if (crop) setCropSrc(URL.createObjectURL(f));
            else onPick(f, URL.createObjectURL(f));
          }}
        />
        {preview && (
          <button type="button" className="text-left text-sm text-muted-foreground underline-offset-4 hover:underline" onClick={onRemove}>
            Remove photo
          </button>
        )}
      </div>
      {cropSrc && (
        <ChampionCropDialog
          src={cropSrc}
          label={label}
          onCancel={() => {
            URL.revokeObjectURL(cropSrc);
            setCropSrc(null);
          }}
          onApply={(blob) => {
            URL.revokeObjectURL(cropSrc);
            setCropSrc(null);
            onPick(new File([blob], "photo.jpg", { type: "image/jpeg" }), URL.createObjectURL(blob));
          }}
        />
      )}
    </div>
  );
}
