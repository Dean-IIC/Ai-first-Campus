import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import FormField from "./form-field";
import type { ExtraField } from "./types";

/** Renders one form-specific field; its value is saved in the enquiry's `details`. */
export default function ExtraFieldInput({ field, idPrefix }: { field: ExtraField; idPrefix: string }) {
  const id = `${idPrefix}-${field.name}`;
  const describedBy = field.hint ? `${id}-hint` : undefined;
  return (
    <FormField id={id} label={field.label} required={field.required} hint={field.hint}>
      {field.type === "select" ? (
        <NativeSelect id={id} name={`extra:${field.name}`} required={field.required} defaultValue="" aria-describedby={describedBy}>
          <option value="" disabled>
            Choose one
          </option>
          {(field.options ?? []).map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </NativeSelect>
      ) : (
        <Input
          id={id}
          name={`extra:${field.name}`}
          type={field.type ?? "text"}
          required={field.required}
          placeholder={field.placeholder}
          min={field.type === "number" ? 1 : undefined}
          aria-describedby={describedBy}
        />
      )}
    </FormField>
  );
}
