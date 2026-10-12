"use client";

import { useEffect, useState } from "react";
import { LogOut, PencilLine } from "lucide-react";
import { signOut } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { checkEditor } from "@/lib/editor";

/** Shown above the champions grid only to a signed-in editor. */
export default function EditorBar() {
  const [editor, setEditor] = useState(false);
  useEffect(() => {
    let live = true;
    checkEditor().then((ok) => live && setEditor(ok));
    return () => {
      live = false;
    };
  }, []);
  if (!editor) return null;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-t-teal/30 bg-t-teal-tint px-4 py-3">
      <p className="flex items-center gap-2 text-sm font-medium text-foreground">
        <PencilLine aria-hidden="true" className="size-4 text-t-teal dark:text-t-teal-light" />
        You are signed in as an editor. Use Add or Edit on any AI Faculty Champion or AI Student Ambassador card.
      </p>
      <form action={signOut}>
        <Button type="submit" variant="outline" size="sm">
          <LogOut aria-hidden="true" />
          Sign out
        </Button>
      </form>
    </div>
  );
}
