"use client";

import { useEffect, useState } from "react";
import { PencilLine, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { checkEditor } from "@/lib/editor";
import { hasPerson } from "@/lib/ai-people";
import PersonEditForm from "./person-edit-form";


export type EditablePerson = {
  slug: string | null;
  role: string;
  index: number;
  label: string;
  name: string;
  department: string;
  bio: string;
  photoUrl: string | null;
};

/** Add or Edit on one card. Renders nothing unless a signed-in editor is viewing. */
export default function PersonEditButton({ person, departments }: { person: EditablePerson; departments: string[] }) {
  const [editor, setEditor] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    let live = true;
    checkEditor().then((ok) => live && setEditor(ok));
    return () => {
      live = false;
    };
  }, []);
  if (!editor) return null;
  // Edit when the card holds a person (a name or a photo), from any source; Add only for an empty card.
  const filled = hasPerson(person);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="absolute right-1.5 top-1.5 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-1 text-[0.6875rem] font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
        aria-label={`${filled ? "Edit" : "Add"} ${person.label} ${person.index}`}
      >
        {filled ? <PencilLine aria-hidden="true" className="size-3" /> : <Plus aria-hidden="true" className="size-3" />}
        {filled ? "Edit" : "Add"}
      </button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{filled ? `Edit ${person.name}` : `Add ${person.label} ${person.index}`}</DialogTitle>
          <DialogDescription>Changes appear on the home page, the Champions page and the AI First page.</DialogDescription>
        </DialogHeader>
        {open && <PersonEditForm p={person} departments={departments} onDone={() => setOpen(false)} />}
      </DialogContent>
    </Dialog>
  );
}
