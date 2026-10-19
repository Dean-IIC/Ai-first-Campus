// Shared between the server action and the client form.
export const ENQUIRY_TYPES = [
  "contact",
  "admission",
  "corporate_training",
  "consultancy",
  "hostel_application",
  "hostel_complaint",
] as const;

export type EnquiryType = (typeof ENQUIRY_TYPES)[number];

export type FormState = {
  status: "idle" | "success" | "error";
  message: string;
  /** Per-field messages, used to mark the matching input as invalid. */
  fieldErrors?: Partial<Record<"name" | "email" | "phone" | "message" | "consent", string>>;
};

export const initialFormState: FormState = { status: "idle", message: "" };

/** What a visitor sees after sending any form. */
export const SUCCESS_MESSAGE = "Thank you, we'll get back to you.";

/** Form names shown in the Enquiries inbox, the CSV export and email alerts. */
export const FORM_LABELS: Record<EnquiryType, string> = {
  contact: "Contact",
  admission: "Admission",
  corporate_training: "Corporate training",
  consultancy: "Consultancy",
  hostel_application: "Hostel application",
  hostel_complaint: "Hostel complaint",
};

export const ENQUIRY_STATUSES = ["new", "in_progress", "closed"] as const;
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];
export const STATUS_LABELS: Record<EnquiryStatus, string> = { new: "New", in_progress: "In progress", closed: "Closed" };

/** Result of the email alert for one enquiry, stored with it. */
export type AlertResult = { status: "sent" | "failed" | "not_set_up"; at: string; error?: string };

/** One enquiry as the admin sees it. Private fields live in `details` under names starting with "_". */
export type Enquiry = {
  id: string;
  type: EnquiryType;
  name: string;
  email: string | null;
  phone: string | null;
  message: string | null;
  status: EnquiryStatus;
  created_at: string;
  details: Record<string, unknown>;
};

/** The visitor's own extra answers (organisation, programme, ...), without the private "_" fields. */
export function publicDetails(details: Record<string, unknown>): [string, string][] {
  return Object.entries(details)
    .filter(([k, v]) => !k.startsWith("_") && typeof v === "string" && v)
    .map(([k, v]) => [k.charAt(0).toUpperCase() + k.slice(1).replace(/_/g, " "), v as string]);
}
