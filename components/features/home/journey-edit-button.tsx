"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, PencilLine, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { isFilled } from "@/lib/journey-model";
import type { JourneyMilestone } from "@/lib/types";
import JourneyEditForm from "./journey-edit-form";

/** Edit (filled months) or Add (empty months), plus move up and down. Shown only to signed-in editors. */
export default function JourneyEditButton({
  m,
  position,
  total,
  onSaved,
  onDeleted,
  onMove,
}: {
  m: JourneyMilestone;
  position: number;
  total: number;
  onSaved: (entry: JourneyMilestone) => void;
  onDeleted: (slug: string) => void;
  onMove: (delta: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const filled = isFilled(m);
  const small = "inline-flex size-7 items-center justify-center rounded-full bg-muted text-foreground shadow-sm hover:bg-accent disabled:opacity-40";
  return (
    <>
      <button
        type="button"
        aria-label={`${filled ? "Edit" : "Add"} ${m.period}`}
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-1 text-[0.6875rem] font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
      >
        {filled ? <PencilLine aria-hidden="true" className="size-3" /> : <Plus aria-hidden="true" className="size-3" />}
        {filled ? "Edit" : "Add"}
      </button>
      <button type="button" className={small} aria-label={`Move ${m.period} up`} disabled={position === 0} onClick={() => onMove(-1)}>
        <ArrowUp aria-hidden="true" className="size-3.5" />
      </button>
      <button type="button" className={small} aria-label={`Move ${m.period} down`} disabled={position === total - 1} onClick={() => onMove(1)}>
        <ArrowDown aria-hidden="true" className="size-3.5" />
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{filled ? `Edit ${m.period}` : `Add ${m.period}`}</DialogTitle>
            <DialogDescription>Changes appear on the home page straight away.</DialogDescription>
          </DialogHeader>
          {open && (
            <JourneyEditForm
              m={m}
              onSaved={(entry) => {
                onSaved(entry);
                setOpen(false);
              }}
              onDeleted={(slug) => {
                onDeleted(slug);
                setOpen(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
