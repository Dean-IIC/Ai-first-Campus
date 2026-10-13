"use client";

import { useState } from "react";
import { FilePen, History, LogOut, Pencil, Undo2 } from "lucide-react";
import { logoutAction } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { useAdmin } from "./admin-provider";
import HistoryPanel from "./history-panel";
import ContentEditor from "@/components/features/cms/content-editor";

/** Fixed bar at the top of every page for the signed-in admin. Visitors never see it. */
export default function AdminToolbar() {
  const { admin, editMode, setEditMode, status, undo, setHistoryOpen } = useAdmin();
  const [busy, setBusy] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  if (!admin) return null;

  const statusText =
    status.kind === "saving" ? "Saving…" : status.kind === "saved" ? "Saved ✓" : status.kind === "error" ? status.message : "";

  return (
    <>
      <div role="region" aria-label="Admin toolbar" className="fixed inset-x-0 top-0 z-[60] flex h-10 items-center gap-2 bg-brand-dark px-3 text-white shadow-md sm:gap-3 sm:px-4">
        <span className="hidden text-xs font-semibold text-white/90 md:inline">Signed in as admin</span>
        <button
          type="button"
          role="switch"
          aria-checked={editMode}
          onClick={() => setEditMode(!editMode)}
          className={`inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-gold/60 ${
            editMode ? "bg-gold text-brand-dark" : "bg-white/10 text-white hover:bg-white/20"
          }`}
        >
          <Pencil aria-hidden="true" className="size-3.5" />
          Edit page {editMode ? "on" : "off"}
        </button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="h-7 px-2 text-xs text-white hover:bg-white/10 hover:text-white"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            await undo();
            setBusy(false);
          }}
        >
          <Undo2 aria-hidden="true" className="size-3.5" />
          <span className="sr-only sm:not-sr-only">Undo</span>
        </Button>
        <Button type="button" size="sm" variant="ghost" className="h-7 px-2 text-xs font-semibold text-gold hover:bg-white/10 hover:text-gold" onClick={() => setEditorOpen(true)}>
          <FilePen aria-hidden="true" className="size-3.5" />
          Edit content
        </Button>
        <Button type="button" size="sm" variant="ghost" className="h-7 px-2 text-xs text-white hover:bg-white/10 hover:text-white" onClick={() => setHistoryOpen(true)}>
          <History aria-hidden="true" className="size-3.5" />
          <span className="sr-only sm:not-sr-only">History</span>
        </Button>
        <p role="status" aria-live="polite" className={`min-w-0 flex-1 truncate text-xs ${status.kind === "error" ? "text-red-200" : "text-white/80"}`}>
          {statusText}
        </p>
        <form action={logoutAction}>
          <Button type="submit" size="sm" variant="ghost" className="h-7 px-2 text-xs text-white hover:bg-white/10 hover:text-white">
            <LogOut aria-hidden="true" className="size-3.5" />
            <span className="sr-only sm:not-sr-only">Sign out</span>
          </Button>
        </form>
      </div>
      <HistoryPanel />
      <ContentEditor open={editorOpen} onOpenChange={setEditorOpen} />
    </>
  );
}
