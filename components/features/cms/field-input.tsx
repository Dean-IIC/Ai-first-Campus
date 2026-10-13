"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import type { Field } from "@/lib/cms/schema";
import ImageField from "./image-field";

const asText = (v: unknown) => (v == null ? "" : Array.isArray(v) ? v.join("\n") : String(v));

/** One field of the content editor, edited with the control that suits its kind. */
export default function FieldInput({ field, value, onChange, id }: { field: Field; value: unknown; onChange: (v: unknown) => void; id: string }) {
  const hint = field.hint ? <p className="text-xs text-muted-foreground">{field.hint}</p> : null;

  if (field.kind === "bool") {
    return (
      <div className="flex items-center gap-2">
        <Checkbox id={id} checked={value === true} onChange={(e) => onChange(e.target.checked)} />
        <Label htmlFor={id} className="font-normal">{field.label}</Label>
      </div>
    );
  }

  if (field.kind === "image") {
    return (
      <div className="grid gap-1.5">
        <Label>{field.label}</Label>
        <ImageField value={typeof value === "string" ? value : ""} onChange={onChange} name={id} />
        {hint}
      </div>
    );
  }

  const common = { id, value: asText(value), onChange: (e: { target: { value: string } }) => onChange(field.kind === "lines" ? e.target.value.split("\n") : e.target.value) };

  let control: React.ReactNode;
  if (field.kind === "choice") {
    control = (
      <NativeSelect {...common}>
        {!field.required && <option value="">—</option>}
        {field.options?.map((o) => <option key={o} value={o}>{o}</option>)}
      </NativeSelect>
    );
  } else if (field.kind === "markdown") {
    control = <Textarea {...common} rows={16} className="font-mono text-sm" />;
  } else if (field.kind === "long" || field.kind === "lines") {
    control = <Textarea {...common} rows={field.kind === "lines" ? 5 : 3} />;
  } else {
    const type = field.kind === "number" ? "number" : field.kind === "date" ? "date" : "text";
    control = <Input {...common} type={type} inputMode={field.kind === "number" ? "decimal" : field.kind === "link" ? "url" : undefined} autoComplete="off" />;
  }

  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>
        {field.label}
        {field.required && <span className="text-destructive"> *</span>}
      </Label>
      {control}
      {hint}
    </div>
  );
}
