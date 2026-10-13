"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/components/features/admin/admin-provider";

/** The Save button at the foot of the content editor, with the result of the last save. */
export default function SaveBar({ dirty }: { dirty: boolean }) {
  const { status } = useAdmin();
  const saving = status.kind === "saving";
  return (
    <div className="sticky bottom-0 -mx-6 -mb-6 flex flex-wrap items-center justify-end gap-3 border-t border-border bg-card px-6 py-3">
      <p role="status" aria-live="polite" className={`mr-auto text-sm ${status.kind === "error" ? "font-medium text-destructive" : "text-muted-foreground"}`}>
        {status.kind === "error" ? status.message : status.kind === "saved" ? "Saved. The live site is updated." : dirty ? "You have unsaved changes." : ""}
      </p>
      <Button type="submit" disabled={saving || !dirty}>
        {saving && <Loader2 aria-hidden="true" className="animate-spin" />}
        {saving ? "Saving…" : "Save changes"}
      </Button>
    </div>
  );
}
