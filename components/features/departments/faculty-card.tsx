"use client";

import { useState } from "react";
import type { Faculty } from "@/lib/types";
import { adminPill as pill, navyPill, redPill } from "@/lib/ui";
import { cn } from "@/lib/utils";
import FacultyCardForm from "./faculty-card-form";
import { useFacultyEditor } from "./faculty-editor";
import { FacultyCard, HodCard } from "./faculty-view";

/**
 * One faculty member. Visitors see the card. The signed-in admin also sees Edit and Delete;
 * Edit turns the card into a form, and Delete asks for confirmation first.
 */
export default function FacultyMember({ person, hod = false }: { person: Faculty; hod?: boolean }) {
  const { admin, deleteFaculty } = useFacultyEditor();
  const [mode, setMode] = useState<"view" | "edit" | "delete">("view");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (admin && mode === "edit") return <FacultyCardForm person={person} nextOrder={person.sort_order} onDone={() => setMode("view")} />;

  const controls = admin && (
    <div className={cn("mt-3 flex flex-wrap items-center gap-1", !hod && "justify-center")}>
      {mode === "delete" ? (
        <div role="alertdialog" aria-label="Delete this faculty member?" className="flex flex-wrap items-center justify-center gap-1.5 rounded-md border border-destructive/40 bg-card px-2 py-1">
          <span className="text-xs font-semibold text-heading">Delete?</span>
          <button
            type="button"
            className={redPill}
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              const problem = await deleteFaculty(person.slug);
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
          <button type="button" className={navyPill} onClick={() => setMode("edit")} aria-label={`Edit ${person.name}`}>
            <span aria-hidden="true">✏️</span> Edit
          </button>
          <button type="button" className={redPill} onClick={() => setMode("delete")} aria-label={`Delete ${person.name}`}>
            <span aria-hidden="true">🗑️</span> Delete
          </button>
        </>
      )}
      {error && <p role="alert" className="w-full text-xs font-medium text-destructive">{error}</p>}
    </div>
  );

  return hod ? <HodCard person={person}>{controls}</HodCard> : <FacultyCard person={person}>{controls}</FacultyCard>;
}
