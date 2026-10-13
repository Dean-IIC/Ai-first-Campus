"use client";

import { useEffect, useState } from "react";
import type { AiRole } from "@/lib/ai-people";
import type { AiPerson } from "@/lib/types";
import { cn } from "@/lib/utils";
import { usePeopleEditor } from "./people-editor";
import PersonCard from "./person-card";
import PersonCardForm from "./person-card-form";

/** The "Add new" card at the end of a grid, for people beyond the numbered cards. Admin only. */
export default function AddPersonCard({ role, next, compact = false }: { role: AiRole; next: number; compact?: boolean }) {
  const { admin } = usePeopleEditor();
  const [added, setAdded] = useState<AiPerson[]>([]);
  const [open, setOpen] = useState(false);
  // Once the page reloads with the new people, they are drawn by the grid itself.
  useEffect(() => setAdded([]), [next]);
  if (!admin) return null;

  const index = next + added.length;
  return (
    <>
      {added.map((p) => (
        <PersonCard key={p.sort_order} role={role} index={p.sort_order} person={p} compact={compact} />
      ))}
      {open ? (
        <PersonCardForm
          role={role}
          index={index}
          compact={compact}
          onDone={(saved) => {
            if (saved) setAdded((a) => [...a, saved]);
            setOpen(false);
          }}
        />
      ) : (
        <li className="flex">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={cn(
              "flex w-full flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-primary/40 bg-card font-semibold text-primary transition-colors hover:border-primary hover:bg-muted focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60",
              compact ? "min-h-28 p-3 text-xs" : "min-h-40 p-5 text-sm",
            )}
          >
            <span aria-hidden="true" className="text-xl">➕</span>
            Add new
          </button>
        </li>
      )}
    </>
  );
}
