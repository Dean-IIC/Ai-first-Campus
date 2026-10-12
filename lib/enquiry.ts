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

export const SUCCESS_MESSAGES: Record<EnquiryType, string> = {
  contact: "Message sent. The college office will reply by email or phone.",
  admission: "Enquiry sent. The admissions team will contact you with next steps.",
  corporate_training: "Training enquiry sent. Our training cell will contact you to plan the programme.",
  consultancy: "Consultancy request sent. A faculty coordinator will contact you to scope the work.",
  hostel_application: "Hostel application sent. The hostel office will confirm room availability with you.",
  hostel_complaint: "Issue reported. The hostel maintenance team has been notified.",
};
