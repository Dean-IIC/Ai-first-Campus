"use client";

import { useState } from "react";
import type { Field } from "@/lib/cms/schema";
import FieldInput from "./field-input";
import SaveBar from "./save-bar";

type Row = Record<string, unknown>;

/** Edits one item: a page, a leadership message or the contact details. */
export default function RecordForm({ fields, initial, onSave }: { fields: Field[]; initial: Row; onSave: (value: Row) => Promise<boolean> }) {
  const [value, setValue] = useState<Row>(initial);
  const [dirty, setDirty] = useState(false);

  return (
    <form
      className="grid gap-4"
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        if (await onSave(Object.fromEntries(fields.map((f) => [f.key, value[f.key]])))) setDirty(false);
      }}
    >
      {fields.map((f) => (
        <FieldInput
          key={f.key}
          id={`cms-${f.key}`}
          field={f}
          value={value[f.key]}
          onChange={(v) => {
            setValue((old) => ({ ...old, [f.key]: v }));
            setDirty(true);
          }}
        />
      ))}
      <SaveBar dirty={dirty} />
    </form>
  );
}
