"use client";

import { useState } from "react";
import { ArrowDownWideNarrow, GripVertical, Handshake } from "lucide-react";
import { adminPill, navyPill } from "@/lib/ui";
import { cn } from "@/lib/utils";
import MouCard from "./mou-card";
import MouCardForm from "./mou-card-form";
import { useMouEditor } from "./mou-editor";

/**
 * Every MoU as a card, under "MoUs (N)". The signed-in admin also gets Add, drag-to-reorder and
 * sort by date.
 */
export default function MouDirectory() {
  const { admin, rows, moveMou, sortByDate } = useMouEditor();
  const [adding, setAdding] = useState(false);
  const [dragFrom, setDragFrom] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const canDrag = admin;

  return (
    <section aria-labelledby="mou-list" className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 id="mou-list" className="text-2xl font-bold text-heading">
          MoUs ({rows.length})
        </h2>
        {admin && rows.length > 1 && (
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <GripVertical aria-hidden="true" className="size-3.5" />
              Drag cards to reorder
            </span>
            <button type="button" className={cn(adminPill, "border border-border bg-card text-foreground hover:bg-muted")} onClick={async () => setMessage((await sortByDate()) ?? "")}>
              <ArrowDownWideNarrow aria-hidden="true" className="size-3.5" />
              Sort by date signed (newest first)
            </button>
          </div>
        )}
      </div>
      {message && <p role="alert" className="text-sm font-medium text-destructive">{message}</p>}
      {rows.length === 0 && !admin && (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-muted/50 px-6 py-10 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-t-amber-tint text-t-amber dark:text-t-amber-light">
            <Handshake aria-hidden="true" className="size-7" />
          </span>
          <p className="mt-4 font-semibold text-heading">MoUs will be listed here soon.</p>
        </div>
      )}
      <ul aria-label="MoUs signed" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((m, i) => (
          <li
            key={m.slug || `new-${i}`}
            draggable={canDrag}
            onDragStart={() => setDragFrom(m.slug)}
            onDragOver={(e) => canDrag && e.preventDefault()}
            onDrop={async (e) => {
              e.preventDefault();
              if (dragFrom) setMessage((await moveMou(dragFrom, m.slug)) ?? "");
              setDragFrom(null);
            }}
            onDragEnd={() => setDragFrom(null)}
            className={cn(canDrag && "cursor-grab", dragFrom === m.slug && "opacity-50")}
          >
            <MouCard mou={m} />
          </li>
        ))}
        {admin && (
          <li>
            {adding ? (
              <MouCardForm onDone={() => setAdding(false)} />
            ) : (
              <button type="button" onClick={() => setAdding(true)} className="grid h-full min-h-48 w-full place-items-center rounded-xl border-2 border-dashed border-border bg-muted/40 p-6 text-sm font-semibold text-heading transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring">
                <span className={navyPill}>
                  <span aria-hidden="true">➕</span> Add MoU
                </span>
              </button>
            )}
          </li>
        )}
      </ul>
    </section>
  );
}
