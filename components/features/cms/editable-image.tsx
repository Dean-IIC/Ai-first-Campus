"use client";

import { useRef, useState } from "react";
import { Camera } from "lucide-react";
import { useAdmin } from "@/components/features/admin/admin-provider";
import { checkPicture, shrinkPicture } from "@/lib/cms/client-image";
import { cn } from "@/lib/utils";

type Saved = { url: string; alt: string };

/**
 * A picture that the admin can replace on the page. Visitors see the picture as before. In
 * edit mode a "Replace photo" button and an alt-text field appear under it. The new picture is
 * shrunk and compressed in the browser, then uploaded and saved.
 */
export default function EditableImage({
  id,
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  wrapperClassName,
}: {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  wrapperClassName?: string;
}) {
  const { admin, editMode, overrides, save, uploadImage } = useAdmin();
  const key = `image:${id}`;
  const saved = overrides[key] as Saved | undefined;
  const url = saved?.url ?? src;
  const text = saved?.alt ?? alt;
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={text}
      width={width}
      height={height}
      className={className}
      fetchPriority={priority ? "high" : undefined}
      data-cms={admin && editMode ? "image" : undefined}
      data-cms-id={id}
    />
  );

  if (!admin || !editMode) return img;

  async function replace(file: File) {
    const problem = checkPicture(file);
    if (problem) return setMessage(problem);
    setBusy(true);
    setMessage(null);
    try {
      const blob = await shrinkPicture(file, 1600);
      const link = await uploadImage(blob, `${id.replace(/[^a-z0-9]+/gi, "-")}.jpg`);
      const ok = await save(key, { url: link, alt: text }, `Photo: ${id}`);
      if (!ok) setMessage("The photo could not be saved. Try again.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "The photo could not be uploaded.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={cn("grid gap-2", wrapperClassName)}>
      <div className="group relative">
        {img}
        <button
          type="button"
          onClick={() => input.current?.click()}
          disabled={busy}
          className="absolute bottom-2 right-2 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-md focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60 disabled:opacity-60"
        >
          <Camera aria-hidden="true" className="size-3.5" />
          {busy ? "Uploading…" : "Replace photo"}
        </button>
        <input
          ref={input}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          tabIndex={-1}
          aria-label={`Choose a new photo for ${id}`}
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file) void replace(file);
          }}
        />
      </div>
      <label className="grid gap-1 text-xs text-muted-foreground">
        Alt text (read by screen readers)
        <input
          key={text}
          defaultValue={text}
          maxLength={300}
          className="rounded-md border border-input bg-background px-2 py-1 text-sm text-foreground"
          onBlur={(e) => {
            const next = e.currentTarget.value.trim();
            if (next && next !== text) void save(key, { url, alt: next }, `Alt text: ${id}`);
          }}
        />
      </label>
      {message && <p role="alert" className="text-xs font-medium text-destructive">{message}</p>}
    </div>
  );
}
