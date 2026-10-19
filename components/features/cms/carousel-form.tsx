"use client";

import { useState, type DragEvent } from "react";
import { ArrowDown, ArrowUp, GripVertical, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MAX_SLIDES, type HeroSlide } from "@/lib/carousel";
import { cn } from "@/lib/utils";
import ImageField from "./image-field";
import SaveBar from "./save-bar";

/**
 * The home page carousel in Edit content: upload photos (shrunk to 1600 px and compressed before
 * upload), give each a badge title, subtitle and alt text, reorder by dragging or with the
 * arrows, and delete. Saved in one go, so the change appears in History.
 */
export default function CarouselForm({ initial, onSave }: { initial: HeroSlide[]; onSave: (slides: HeroSlide[]) => Promise<boolean> }) {
  const [slides, setSlides] = useState<HeroSlide[]>(initial);
  const [dirty, setDirty] = useState(false);
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [error, setError] = useState("");

  const update = (next: HeroSlide[]) => {
    setSlides(next);
    setDirty(true);
    setError("");
  };
  const move = (from: number, to: number) => {
    if (to < 0 || to >= slides.length || from === to) return;
    const next = [...slides];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    update(next);
  };
  const set = (i: number, patch: Partial<HeroSlide>) => update(slides.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  const onDrop = (e: DragEvent, to: number) => {
    e.preventDefault();
    if (dragFrom !== null) move(dragFrom, to);
    setDragFrom(null);
  };

  return (
    <form
      className="grid gap-3"
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        const missing = slides.findIndex((s) => !s.src || !s.alt.trim());
        if (missing >= 0) return setError(`Photo ${missing + 1}: add the photo and its alt text before saving.`);
        if (await onSave(slides)) setDirty(false);
      }}
    >
      <p className="text-sm text-muted-foreground">
        JPG, PNG or WebP up to 5 MB, at most {MAX_SLIDES} photos. Drag a photo by its handle, or use the arrows, to change the order. Leave the badge title and subtitle empty to hide the badge on that photo.
      </p>
      <ol className="grid gap-3">
        {slides.map((s, i) => (
          <li
            key={i}
            draggable
            onDragStart={() => setDragFrom(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDrop(e, i)}
            onDragEnd={() => setDragFrom(null)}
            className={cn("grid gap-3 rounded-lg border border-border p-3", dragFrom === i && "opacity-50")}
          >
            <div className="flex items-center gap-1">
              <GripVertical aria-hidden="true" className="size-4 cursor-grab text-muted-foreground" />
              <span className="flex-1 text-sm font-semibold text-heading">Photo {i + 1}</span>
              <Button type="button" size="icon" variant="ghost" className="size-8" aria-label={`Move photo ${i + 1} up`} disabled={i === 0} onClick={() => move(i, i - 1)}>
                <ArrowUp aria-hidden="true" />
              </Button>
              <Button type="button" size="icon" variant="ghost" className="size-8" aria-label={`Move photo ${i + 1} down`} disabled={i === slides.length - 1} onClick={() => move(i, i + 1)}>
                <ArrowDown aria-hidden="true" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="size-8 text-destructive"
                aria-label={`Delete photo ${i + 1}`}
                disabled={slides.length === 1}
                onClick={() => window.confirm(`Delete photo ${i + 1}? You can undo this after saving.`) && update(slides.filter((_, j) => j !== i))}
              >
                <Trash2 aria-hidden="true" />
              </Button>
            </div>
            <ImageField value={s.src} name={`carousel-${i + 1}`} onChange={(url) => set(i, { src: url })} />
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor={`c-title-${i}`}>Badge title</Label>
                <Input id={`c-title-${i}`} value={s.title} maxLength={80} onChange={(e) => set(i, { title: e.target.value })} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor={`c-sub-${i}`}>Badge subtitle</Label>
                <Input id={`c-sub-${i}`} value={s.subtitle} maxLength={120} onChange={(e) => set(i, { subtitle: e.target.value })} />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor={`c-alt-${i}`}>
                Alt text <span className="text-destructive">*</span>
              </Label>
              <Input id={`c-alt-${i}`} value={s.alt} maxLength={300} placeholder="Describe the photo for visitors who cannot see it" onChange={(e) => set(i, { alt: e.target.value })} />
            </div>
          </li>
        ))}
      </ol>
      <Button type="button" variant="outline" className="justify-self-start" disabled={slides.length >= MAX_SLIDES} onClick={() => update([...slides, { src: "", alt: "", title: "", subtitle: "" }])}>
        <Plus aria-hidden="true" />
        {slides.length >= MAX_SLIDES ? `${MAX_SLIDES} photos is the most` : "Add photo"}
      </Button>
      {error && <p role="alert" className="text-sm font-medium text-destructive">{error}</p>}
      <SaveBar dirty={dirty} />
    </form>
  );
}
