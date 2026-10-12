"use client";

import { useActionState, useId } from "react";
import { CircleAlert, CircleCheck, Loader2 } from "lucide-react";
import { submitEnquiry } from "@/actions/enquiry";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { initialFormState, type EnquiryType } from "@/lib/enquiry";
import ExtraFieldInput from "./extra-field-input";
import FormField from "./form-field";
import type { ExtraField } from "./types";

export type { ExtraField };

/** Enquiry form posting to the `submitEnquiry` Server Action. Works before JavaScript loads. */
export default function EnquiryForm({
  type,
  submitLabel,
  extraFields = [],
  messageLabel = "Message",
  messagePlaceholder,
  messageRequired = false,
}: {
  type: EnquiryType;
  submitLabel: string;
  extraFields?: ExtraField[];
  messageLabel?: string;
  messagePlaceholder?: string;
  messageRequired?: boolean;
}) {
  const [state, formAction, pending] = useActionState(submitEnquiry, initialFormState);
  const id = useId();
  const err = state.status === "error" ? state.fieldErrors ?? {} : {};

  if (state.status === "success") {
    return (
      <Alert variant="success" role="status">
        <CircleCheck aria-hidden="true" />
        <AlertTitle>Thank you</AlertTitle>
        <AlertDescription className="text-foreground">{state.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <form action={formAction} className="grid max-w-3xl gap-5 sm:grid-cols-2" noValidate>
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="message_required" value={messageRequired ? "yes" : "no"} />
      <div aria-hidden="true" className="hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <FormField id={`${id}-name`} label="Full name" required error={err.name} className="sm:col-span-2">
        <Input id={`${id}-name`} name="name" required autoComplete="name" aria-invalid={Boolean(err.name)} />
      </FormField>
      <FormField id={`${id}-email`} label="Email" required error={err.email}>
        <Input id={`${id}-email`} name="email" type="email" autoComplete="email" aria-invalid={Boolean(err.email)} />
      </FormField>
      <FormField id={`${id}-phone`} label="Phone" required error={err.phone}>
        <Input id={`${id}-phone`} name="phone" type="tel" autoComplete="tel" inputMode="tel" aria-invalid={Boolean(err.phone)} />
      </FormField>
      <p className="-mt-3 text-sm text-muted-foreground sm:col-span-2">Give at least one: email or phone.</p>

      {extraFields.map((f) => (
        <ExtraFieldInput key={f.name} field={f} idPrefix={id} />
      ))}

      <FormField id={`${id}-message`} label={messageLabel} required={messageRequired} error={err.message} className="sm:col-span-2">
        <Textarea
          id={`${id}-message`}
          name="message"
          rows={5}
          maxLength={4000}
          required={messageRequired}
          placeholder={messagePlaceholder}
          aria-invalid={Boolean(err.message)}
        />
      </FormField>

      <label className="flex items-start gap-3 text-[0.9375rem] sm:col-span-2">
        <Checkbox name="consent" value="yes" required className="mt-1" aria-invalid={Boolean(err.consent)} />
        <span>I agree that HKBK College of Engineering may store these details and use them only to respond to this request.</span>
      </label>

      {state.status === "error" && (
        <Alert variant="destructive" className="sm:col-span-2">
          <CircleAlert aria-hidden="true" />
          <AlertTitle>Please check the form</AlertTitle>
          <AlertDescription className="text-foreground">{state.message}</AlertDescription>
        </Alert>
      )}

      <div className="sm:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 aria-hidden="true" className="animate-spin" />}
          {pending ? "Sending…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
