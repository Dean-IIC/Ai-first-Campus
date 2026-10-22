"use client";

import { useState } from "react";
import type { Mou } from "@/lib/types";
import { adminPill as pill, navyPill, redPill } from "@/lib/ui";
import { cn } from "@/lib/utils";
import MouCardForm from "./mou-card-form";
import MouCardView from "./mou-card-view";
import { useMouEditor } from "./mou-editor";

/**
 * One MoU card. Visitors see the MoU. The signed-in admin also sees Edit and Delete at the
 * top-right; Edit turns the card itself into a form, and Delete asks for confirmation first.
 */
export default function MouCard({ mou }: { mou: Mou }) {
  const { admin, deleteMou } = useMouEditor();
  const [mode, setMode] = useState<"view" | "edit" | "delete">("view");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (admin && mode === "edit") return <MouCardForm mou={mou} onDone={() => setMode("view")} />;

  return (
    <MouCardView mou={mou} admin={admin}>
      {admin && (
        <>
          <div className="absolute right-1.5 top-1.5 z-10 flex gap-1">
            <button type="button" className={navyPill} onClick={() => setMode("edit")} aria-label={`Edit ${mou.partner}`}>
              <span aria-hidden="true">✏️</span> Edit
            </button>
            <button type="button" className={redPill} onClick={() => setMode("delete")} aria-label={`Delete ${mou.partner}`}>
              <span aria-hidden="true">🗑️</span> Delete
            </button>
          </div>
          {mode === "delete" && (
            <div role="alertdialog" aria-label="Delete this MoU?" className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 rounded-[inherit] bg-card/95 p-3 text-center backdrop-blur-sm">
              <p className="text-sm font-semibold text-heading">Delete the MoU with {mou.partner}?</p>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  className={redPill}
                  disabled={busy}
                  onClick={async () => {
                    setBusy(true);
                    const problem = await deleteMou(mou.slug);
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
              {error && <p role="alert" className="text-xs font-medium text-destructive">{error}</p>}
            </div>
          )}
        </>
      )}
    </MouCardView>
  );
}
