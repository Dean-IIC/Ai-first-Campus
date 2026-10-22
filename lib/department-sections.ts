import type { Department } from "@/lib/types";

/*
 * Department page sections are stored as lines of text, one point per line, so the admin
 * edits them as plain text. A line can start with a short code ("M1:", "PEO1:", "PO12:")
 * and/or a heading followed by a colon ("Corporate jobs: ...", "2021–22: ...").
 */

/** A leading code such as M1, PEO1, PSO2 or PO12. */
export const LABEL = /^([A-Z]{1,4}\d{1,2}):\s*/;

/** Splits "PEO1: text" into its code and the rest; lines without a code keep their full text. */
export function splitLabel(line: string): { label: string | null; text: string } {
  const m = line.match(LABEL);
  return m ? { label: m[1], text: line.slice(m[0].length) } : { label: null, text: line };
}

/** Splits "Heading: text" at the first colon; lines without one have no heading. */
export function splitHeading(line: string): { heading: string | null; text: string } {
  const i = line.indexOf(": ");
  if (i <= 0 || i > 80) return { heading: null, text: line.trim() };
  return { heading: line.slice(0, i).trim(), text: line.slice(i + 2).trim() };
}

export type Semester = { title: string; scheme: string | null; subjects: string[] };

/** "Semester 1 (2025 scheme): Subject one; Subject two" → title, scheme and subjects. */
export function parseSemester(line: string): Semester {
  const { heading, text } = splitHeading(line);
  const head = heading ?? "";
  const scheme = head.match(/\(([^)]+)\)\s*$/);
  return {
    title: (scheme ? head.slice(0, scheme.index) : head).trim() || "Semester",
    scheme: scheme ? scheme[1].trim() : null,
    subjects: text.split(";").map((s) => s.trim()).filter(Boolean),
  };
}

/** Lines with blanks removed; tolerates a missing column on rows loaded before it existed. */
export const linesOf = (value: string[] | null | undefined): string[] => (value ?? []).map((s) => s.trim()).filter(Boolean);

type SectionFields = Pick<Department, "history" | "peos" | "psos" | "pos" | "curriculum" | "employment_scope" | "career_roles">;

/**
 * True when the department uses the extended page (history, outcomes, curriculum or careers).
 * Such a page shows its overview under the vision and mission, and always has a Faculty tab.
 */
export const hasExtendedPage = (d: SectionFields) =>
  [d.history, d.peos, d.psos, d.pos, d.curriculum, d.employment_scope, d.career_roles].some((v) => linesOf(v).length > 0);

/** First academic year in the history ("2021–22"), and the last seat count it mentions ("180"). */
export function programmeFacts(history: string[] | null | undefined): { established: string | null; intake: string | null } {
  const rows = linesOf(history).map(splitHeading);
  const intakes = rows.map((r) => r.text.match(/(\d+)(?!.*\d)/)?.[1]).filter(Boolean);
  return { established: rows[0]?.heading ?? null, intake: intakes.at(-1) ?? null };
}
