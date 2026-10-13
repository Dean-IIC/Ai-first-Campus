"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useAdmin } from "@/components/features/admin/admin-provider";
import type { AiRole } from "@/lib/ai-people";
import type { AiPerson } from "@/lib/types";

export type PersonDraft = { name: string; bio: string; department: string; photo_url: string | null };

type PeopleEditor = {
  admin: boolean;
  departments: string[];
  savePerson: (role: AiRole, index: number, draft: PersonDraft) => Promise<string | null>;
  deletePerson: (role: AiRole, index: number) => Promise<string | null>;
};

const Ctx = createContext<PeopleEditor>({ admin: false, departments: [], savePerson: async () => null, deletePerson: async () => null });
export function usePeopleEditor(): PeopleEditor {
  return useContext(Ctx);
}

const FIELDS = ["slug", "name", "role", "department", "bio", "photo_url", "sort_order"] as const;
const pick = (p: AiPerson) => Object.fromEntries(FIELDS.map((k) => [k, p[k] ?? (k === "slug" ? "" : null)]));

/**
 * Holds every AI Faculty Champion and AI Student Ambassador for the cards' Add, Edit and Delete.
 * Each change saves the whole list through the admin's content store (key list:ai_people), so it
 * appears on the live site at once and can be undone from the admin toolbar.
 */
export default function PeopleEditorProvider({ people, departments, children }: { people: AiPerson[]; departments: string[]; children: ReactNode }) {
  const { admin, save } = useAdmin();
  const [rows, setRows] = useState(people);
  useEffect(() => setRows(people), [people]);

  const store = useCallback(
    async (next: AiPerson[], label: string) => {
      const ok = await save("list:ai_people", next.map(pick), label);
      if (ok) setRows(next);
      return ok ? null : "The change could not be saved. The admin bar at the top shows why.";
    },
    [save],
  );

  const savePerson = useCallback(
    async (role: AiRole, index: number, d: PersonDraft) => {
      const name = d.name.trim();
      if (!name) return "Enter the person's name.";
      const old = rows.find((r) => r.role === role && r.sort_order === index);
      const person: AiPerson = { slug: old?.slug ?? "", role, sort_order: index, name, bio: d.bio.trim() || null, department: d.department.trim() || null, photo_url: d.photo_url };
      const next = [...rows.filter((r) => r !== old), person];
      return store(next, `${old ? "Edited" : "Added"}: ${name}`);
    },
    [rows, store],
  );

  const deletePerson = useCallback(
    async (role: AiRole, index: number) => {
      const old = rows.find((r) => r.role === role && r.sort_order === index);
      if (!old) return null;
      return store(rows.filter((r) => r !== old), `Deleted: ${old.name}`);
    },
    [rows, store],
  );

  const value = useMemo(() => ({ admin, departments, savePerson, deletePerson }), [admin, departments, savePerson, deletePerson]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
