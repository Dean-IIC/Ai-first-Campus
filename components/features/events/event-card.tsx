"use client";

import { useState } from "react";
import type { NewsItem } from "@/lib/types";
import { adminPill as pill, navyPill, redPill } from "@/lib/ui";
import { cn } from "@/lib/utils";
import EventCardForm from "./event-card-form";
import EventCardView from "./event-card-view";
import { useEventsEditor } from "./events-editor";

/**
 * One event in a list. Visitors see the event. The signed-in admin also sees Edit and Delete
 * together; Edit turns the card into a form, and Delete asks for confirmation first.
 */
export default function EventCard({ event, compact = false }: { event: NewsItem; compact?: boolean }) {
  const { admin, deleteEvent } = useEventsEditor();
  const [mode, setMode] = useState<"view" | "edit" | "delete">("view");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (admin && mode === "edit") return <EventCardForm event={event} onDone={() => setMode("view")} />;

  return (
    <EventCardView event={event} compact={compact}>
      {admin && (
        <div className="mt-2 flex flex-wrap items-center gap-1">
          {mode === "delete" ? (
            <div role="alertdialog" aria-label="Delete this event?" className="flex flex-wrap items-center gap-1.5 rounded-md border border-destructive/40 bg-card px-2 py-1">
              <span className="text-xs font-semibold text-heading">Delete this event?</span>
              <button
                type="button"
                className={redPill}
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  const problem = await deleteEvent(event.slug);
                  setBusy(false);
                  if (problem) return setError(problem);
                  setMode("view");
                }}
              >
                {busy ? "Deleting…" : "Confirm"}
              </button>
              <button type="button" className={cn(pill, "border border-border bg-card text-foreground hover:bg-muted")} disabled={busy} onClick={() => setMode("view")}>
                Cancel
              </button>
            </div>
          ) : (
            <>
              <button type="button" className={navyPill} onClick={() => setMode("edit")} aria-label={`Edit ${event.title}`}>
                <span aria-hidden="true">✏️</span> Edit
              </button>
              <button type="button" className={redPill} onClick={() => setMode("delete")} aria-label={`Delete ${event.title}`}>
                <span aria-hidden="true">🗑️</span> Delete
              </button>
            </>
          )}
          {error && <p role="alert" className="w-full text-xs font-medium text-destructive">{error}</p>}
        </div>
      )}
    </EventCardView>
  );
}
