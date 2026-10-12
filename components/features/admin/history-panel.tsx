"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { HistoryRow } from "@/actions/admin";
import { useAdmin } from "./admin-provider";

const when = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" });

/** The last 30 changes. Restoring one puts back the text, photo or list it set. */
export default function HistoryPanel() {
  const { historyOpen, setHistoryOpen, loadHistory, restore } = useAdmin();
  const [entries, setEntries] = useState<HistoryRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!historyOpen) return;
    setError(null);
    loadHistory().then((r) => (r.ok ? setEntries(r.entries) : setError(r.error)));
  }, [historyOpen, loadHistory]);

  return (
    <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change history</DialogTitle>
          <DialogDescription>The last 30 changes. Restore one to put back the version it saved.</DialogDescription>
        </DialogHeader>
        {error && <p role="alert" className="text-sm font-medium text-destructive">{error}</p>}
        {!error && entries === null && <p className="text-sm text-muted-foreground">Loading…</p>}
        {entries?.length === 0 && <p className="text-sm text-muted-foreground">No changes yet.</p>}
        <ol className="max-h-[60dvh] space-y-2 overflow-y-auto pr-1">
          {entries?.map((e) => (
            <li key={e.id} className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-heading">{e.label}</p>
                <p className="text-xs text-muted-foreground">{when(e.created_at)}</p>
              </div>
              <Button type="button" size="sm" variant="outline" onClick={() => restore(e.id)}>
                Restore
              </Button>
            </li>
          ))}
        </ol>
      </DialogContent>
    </Dialog>
  );
}
