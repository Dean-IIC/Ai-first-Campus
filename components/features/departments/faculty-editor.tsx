"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useAdmin } from "@/components/features/admin/admin-provider";
import { LIST_SPECS } from "@/lib/cms/schema";
import type { Faculty } from "@/lib/types";

export type FacultyDraft = Pick<Faculty, "name" | "designation" | "qualification" | "is_hod" | "photo_url" | "sort_order">;

type FacultyEditor = {
  admin: boolean;
  department: string;
  /** Designations, highest rank first (Edit content → Faculty designations). */
  ranks: string[];
  rows: Faculty[];
  saveFaculty: (slug: string | null, draft: FacultyDraft) => Promise<string | null>;
  deleteFaculty: (slug: string) => Promise<string | null>;
};

const Ctx = createContext<FacultyEditor>({ admin: false, department: "", ranks: [], rows: [], saveFaculty: async () => null, deleteFaculty: async () => null });
export function useFacultyEditor(): FacultyEditor {
  return useContext(Ctx);
}

const FIELDS = ["slug", ...LIST_SPECS.faculty.fields.map((f) => f.key)];
const pick = (f: Faculty) => Object.fromEntries(FIELDS.map((k) => [k, (f as Record<string, unknown>)[k] ?? null]));

/**
 * Holds the whole faculty list (every department) for the Faculty tab's Add, Edit and Delete.
 * Each change saves the list through the admin's content store (key list:faculty), so it shows
 * on the live site at once and can be undone (Undo and History).
 */
export default function FacultyEditorProvider({ items, department, ranks, children }: { items: Faculty[]; department: string; ranks: string[]; children: ReactNode }) {
  const { admin, save } = useAdmin();
  const [rows, setRows] = useState(items);
  useEffect(() => setRows(items), [items]);

  const store = useCallback(
    async (next: Faculty[], label: string) => {
      const ok = await save("list:faculty", next.map(pick), label);
      if (ok) setRows(next);
      return ok ? null : "The change could not be saved. The admin bar at the top shows why.";
    },
    [save],
  );

  const saveFaculty = useCallback(
    async (slug: string | null, d: FacultyDraft) => {
      const name = d.name.trim();
      if (!name) return "Enter the name.";
      if (!d.designation) return "Choose the designation.";
      const old = slug ? rows.find((r) => r.slug === slug) : undefined;
      const person: Faculty = { ...(old ?? { slug: "", department }), ...d, name };
      // One head per department: ticking it for this person clears it for the others.
      const others = rows.map((r) => (person.is_hod && r !== old && r.department === department && r.is_hod ? { ...r, is_hod: false } : r));
      const next = old ? others.map((r) => (r === old ? person : r)) : [...others, person];
      return store(next, `Faculty ${old ? "edited" : "added"}: ${name}`);
    },
    [rows, department, store],
  );

  const deleteFaculty = useCallback(
    async (slug: string) => {
      const old = rows.find((r) => r.slug === slug);
      if (!old) return null;
      return store(rows.filter((r) => r !== old), `Faculty deleted: ${old.name}`);
    },
    [rows, store],
  );

  const value = useMemo(() => ({ admin, department, ranks, rows, saveFaculty, deleteFaculty }), [admin, department, ranks, rows, saveFaculty, deleteFaculty]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
