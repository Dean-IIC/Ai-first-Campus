"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Achievement } from "@/lib/achievements";
import { adminPill as pill, navyPill, redPill } from "@/lib/ui";
import { cn } from "@/lib/utils";
import AchievementCardForm from "./achievement-card-form";
import AchievementFrame from "./achievement-frame";
import { useAchievementsEditor } from "./achievements-editor";

const paragraphs = (text: string) => text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

/**
 * One achievement: its framed photo, title, year and the start of the description. Clicking it
 * opens the whole achievement (full photo and text). The signed-in admin also gets Edit and Delete.
 */
export default function AchievementCard({ item }: { item: Achievement }) {
  const { admin, deleteAchievement } = useAchievementsEditor();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"view" | "edit" | "delete">("view");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (admin && mode === "edit") return <AchievementCardForm item={item} onDone={() => setMode("view")} />;

  return (
    <article className="flex h-full flex-col">
      <button type="button" onClick={() => setOpen(true)} className="group rounded-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label={`Open ${item.title}`}>
        <AchievementFrame src={item.photo_url} alt={item.title} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
        <div className="mt-3 px-1">
          {item.year && (
            <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-t-teal dark:text-t-teal-light">
              <CalendarDays aria-hidden="true" className="size-3.5" />
              {item.year}
            </span>
          )}
          <h3 className="mt-1 font-semibold leading-snug text-heading group-hover:underline group-hover:underline-offset-4">{item.title}</h3>
          {item.text && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.text}</p>}
        </div>
      </button>

      {admin && (
        <div className="mt-2 flex flex-wrap items-center gap-1 px-1">
          {mode === "delete" ? (
            <div role="alertdialog" aria-label="Delete this achievement?" className="flex flex-wrap items-center gap-1.5 rounded-md border border-destructive/40 bg-card px-2 py-1">
              <span className="text-xs font-semibold text-heading">Delete this achievement?</span>
              <button
                type="button"
                className={redPill}
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  const problem = await deleteAchievement(item.id);
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
              <button type="button" className={navyPill} onClick={() => setMode("edit")} aria-label={`Edit ${item.title}`}>
                <span aria-hidden="true">✏️</span> Edit
              </button>
              <button type="button" className={redPill} onClick={() => setMode("delete")} aria-label={`Delete ${item.title}`}>
                <span aria-hidden="true">🗑️</span> Delete
              </button>
            </>
          )}
          {error && <p role="alert" className="w-full text-xs font-medium text-destructive">{error}</p>}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            {item.year && <p className="text-xs font-semibold uppercase tracking-wide text-t-teal dark:text-t-teal-light">{item.year}</p>}
            <DialogTitle>{item.title}</DialogTitle>
            <DialogDescription className="sr-only">Achievement details</DialogDescription>
          </DialogHeader>
          {item.photo_url && <AchievementFrame src={item.photo_url} alt={item.title} fixed={false} />}
          {paragraphs(item.text).map((p) => (
            <p key={p} className="whitespace-pre-line leading-relaxed text-foreground">
              {p}
            </p>
          ))}
        </DialogContent>
      </Dialog>
    </article>
  );
}
