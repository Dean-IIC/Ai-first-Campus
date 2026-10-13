"use client";

import { useEffect, useState } from "react";
import type { AiRole } from "@/lib/ai-people";
import type { AiPerson } from "@/lib/types";
import { adminPill as pill, navyPill, redPill } from "@/lib/ui";
import { cn } from "@/lib/utils";
import AmbassadorView from "./ambassador-view";
import ChampionView from "./champion-view";
import { usePeopleEditor } from "./people-editor";
import PersonCardForm from "./person-card-form";


/**
 * One card in the AI Faculty Champions or AI Student Ambassadors grid, shared by both sections.
 * Visitors see the person or a "Coming soon" placeholder. The signed-in admin also sees Edit and
 * Delete (or Add on an empty card); Edit and Add turn the card itself into a form.
 */
export default function PersonCard({ role, index, person, compact = false }: { role: AiRole; index: number; person?: AiPerson; compact?: boolean }) {
  const { admin, deletePerson } = usePeopleEditor();
  const [shown, setShown] = useState(person);
  const [mode, setMode] = useState<"view" | "edit" | "delete">("view");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => setShown(person), [person]);

  const faculty = role === "Faculty champion";
  const label = faculty ? "Faculty Champion" : "Student Ambassador";
  const slot = `${faculty ? "faculty" : "ambassador"}-${String(index).padStart(2, "0")}`;
  const liProps = { "data-person-slot": slot, "data-slot-label": label, "data-slot-index": String(index), "data-compact": compact ? "1" : "0" };

  if (admin && mode === "edit") {
    return (
      <PersonCardForm
        role={role}
        index={index}
        person={shown}
        compact={compact}
        onDone={(saved) => {
          if (saved) setShown(saved);
          setMode("view");
        }}
      />
    );
  }

  const where = compact ? "mt-2 flex flex-wrap justify-center gap-1" : "absolute right-1.5 top-1.5 flex gap-1";
  const controls = admin && (
    <>
      <div className={where}>
        {shown ? (
          <>
            <button type="button" className={navyPill} onClick={() => setMode("edit")} aria-label={`Edit ${shown.name}`}>
              <span aria-hidden="true">✏️</span> Edit
            </button>
            <button type="button" className={redPill} onClick={() => setMode("delete")} aria-label={`Delete ${shown.name}`}>
              <span aria-hidden="true">🗑️</span> Delete
            </button>
          </>
        ) : (
          <button type="button" className={navyPill} onClick={() => setMode("edit")} aria-label={`Add ${label} ${index}`}>
            <span aria-hidden="true">➕</span> Add
          </button>
        )}
      </div>
      {mode === "delete" && shown && (
        <div role="alertdialog" aria-label="Delete this person?" className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-[inherit] bg-card/95 p-3 text-center backdrop-blur-sm">
          <p className="text-sm font-semibold text-heading">Delete this person?</p>
          <div className="flex gap-1.5">
            <button
              type="button"
              className={redPill}
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                const problem = await deletePerson(role, index);
                setBusy(false);
                if (problem) return setError(problem);
                setShown(undefined);
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
  );

  return faculty ? (
    <ChampionView compact={compact} liProps={liProps} data={{ index, name: shown?.name ?? "", designation: shown?.bio ?? "", department: shown?.department ?? "", photoSrc: shown?.photo_url ?? null }}>
      {controls}
    </ChampionView>
  ) : (
    <AmbassadorView compact={compact} liProps={liProps} data={{ index, name: shown?.name ?? "", department: shown?.department ?? "", bio: shown?.bio ?? "", photoSrc: shown?.photo_url ?? null }}>
      {controls}
    </AmbassadorView>
  );
}
