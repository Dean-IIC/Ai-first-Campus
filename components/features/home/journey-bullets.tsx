"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MAX_BULLETS } from "@/lib/journey-model";

/** The bullet points of one month: edit, reorder, remove, and add. */
export default function JourneyBullets({ value, onChange }: { value: string[]; onChange: (next: string[]) => void }) {
  const set = (i: number, text: string) => onChange(value.map((v, k) => (k === i ? text : v)));
  const move = (i: number, delta: number) => {
    const j = i + delta;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const remove = (i: number) => onChange(value.filter((_, k) => k !== i));
  const small = "size-9 px-0";
  return (
    <div className="grid gap-2">
      {value.map((text, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <Input aria-label={`Bullet point ${i + 1}`} value={text} maxLength={300} onChange={(e) => set(i, e.target.value)} />
          <Button type="button" variant="ghost" size="sm" className={small} aria-label={`Move bullet ${i + 1} up`} disabled={i === 0} onClick={() => move(i, -1)}>
            <ArrowUp aria-hidden="true" />
          </Button>
          <Button type="button" variant="ghost" size="sm" className={small} aria-label={`Move bullet ${i + 1} down`} disabled={i === value.length - 1} onClick={() => move(i, 1)}>
            <ArrowDown aria-hidden="true" />
          </Button>
          <Button type="button" variant="ghost" size="sm" className={`${small} text-destructive`} aria-label={`Remove bullet ${i + 1}`} onClick={() => remove(i)}>
            <Trash2 aria-hidden="true" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" className="justify-self-start" disabled={value.length >= MAX_BULLETS} onClick={() => onChange([...value, ""])}>
        <Plus aria-hidden="true" />
        Add bullet point
      </Button>
    </div>
  );
}
