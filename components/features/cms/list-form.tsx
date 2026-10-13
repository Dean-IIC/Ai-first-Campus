"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ListSpec } from "@/lib/cms/schema";
import FieldInput from "./field-input";
import SaveBar from "./save-bar";

type Row = Record<string, unknown>;

function blankRow(spec: ListSpec): Row {
  return Object.fromEntries(spec.fields.map((f) => [f.key, f.kind === "bool" ? false : f.kind === "lines" ? [] : f.kind === "choice" && f.required ? f.options?.[0] : ""]));
}

/** Edits a whole list: change any item, add, delete and reorder. Saved in one go. */
export default function ListForm({ spec, initial, onSave }: { spec: ListSpec; initial: Row[]; onSave: (rows: Row[]) => Promise<boolean> }) {
  const [rows, setRows] = useState<Row[]>(initial);
  const [open, setOpen] = useState<number | null>(null);
  const [dirty, setDirty] = useState(false);

  const update = (next: Row[]) => {
    setRows(next);
    setDirty(true);
  };
  const move = (i: number, by: number) => {
    const next = [...rows];
    [next[i], next[i + by]] = [next[i + by], next[i]];
    update(next);
    setOpen(open === i ? i + by : open);
  };

  return (
    <form
      className="grid gap-3"
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        const removed = initial.length - rows.length;
        if (removed > 0 && removed * 2 >= initial.length && !window.confirm(`This removes ${removed} of the ${initial.length} items in this list from the live site. Save anyway?`)) return;
        const clean = rows.map((r) => ({ slug: r.slug ?? "", ...Object.fromEntries(spec.fields.map((f) => [f.key, r[f.key]])) }));
        if (await onSave(clean)) setDirty(false);
      }}
    >
      {rows.length === 0 && <p className="text-sm text-muted-foreground">This list is empty.</p>}
      <ol className="grid gap-2">
        {rows.map((row, i) => (
          <li key={String(row.slug || `new-${i}`)} className="rounded-lg border border-border">
            <div className="flex items-center gap-1 px-3 py-2">
              <button type="button" className="min-w-0 flex-1 truncate rounded text-left text-sm font-medium text-heading focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
                {i + 1}. {String(row[spec.title] || `New ${spec.item}`)}
              </button>
              <Button type="button" size="icon" variant="ghost" className="size-8" aria-label={`Move ${spec.item} ${i + 1} up`} disabled={i === 0} onClick={() => move(i, -1)}>
                <ArrowUp aria-hidden="true" />
              </Button>
              <Button type="button" size="icon" variant="ghost" className="size-8" aria-label={`Move ${spec.item} ${i + 1} down`} disabled={i === rows.length - 1} onClick={() => move(i, 1)}>
                <ArrowDown aria-hidden="true" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="size-8 text-destructive"
                aria-label={`Delete ${spec.item} ${i + 1}`}
                onClick={() => {
                  if (!window.confirm(`Delete “${String(row[spec.title] || spec.item)}”? You can undo this after saving.`)) return;
                  update(rows.filter((_, j) => j !== i));
                  setOpen(null);
                }}
              >
                <Trash2 aria-hidden="true" />
              </Button>
            </div>
            {open === i && (
              <div className="grid gap-4 border-t border-border p-3">
                {spec.fields.map((f) => (
                  <FieldInput key={f.key} id={`cms-${i}-${f.key}`} field={f} value={row[f.key]} onChange={(v) => update(rows.map((r, j) => (j === i ? { ...r, [f.key]: v } : r)))} />
                ))}
              </div>
            )}
          </li>
        ))}
      </ol>
      <Button
        type="button"
        variant="outline"
        className="justify-self-start"
        onClick={() => {
          update([...rows, blankRow(spec)]);
          setOpen(rows.length);
        }}
      >
        <Plus aria-hidden="true" />
        Add {spec.item}
      </Button>
      <SaveBar dirty={dirty} />
    </form>
  );
}
