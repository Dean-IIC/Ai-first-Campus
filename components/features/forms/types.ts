export type ExtraField = {
  name: string;
  label: string;
  type?: "text" | "select" | "date" | "number";
  options?: string[];
  required?: boolean;
  placeholder?: string;
  hint?: string;
};
