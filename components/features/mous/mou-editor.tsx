"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useAdmin } from "@/components/features/admin/admin-provider";
import { LIST_SPECS } from "@/lib/cms/schema";
import type { Mou } from "@/lib/types";

export type MouDraft = Omit<Mou, "slug" | "sort_order">;

type MouEditor = {
  admin: boolean;
  rows: Mou[];
  departments: string[];
  saveMou: (slug: string | null, draft: MouDraft) => Promise<string | null>;
  deleteMou: (slug: string) => Promise<string | null>;
  moveMou: (fromSlug: string, toSlug: string) => Promise<string | null>;
  sortByDate: () => Promise<string | null>;
};

const Ctx = createContext<MouEditor>({ admin: false, rows: [], departments: [], saveMou: async () => null, deleteMou: async () => null, moveMou: async () => null, sortByDate: async () => null });
export function useMouEditor(): MouEditor {
  return useContext(Ctx);
}

const FIELDS = ["slug", ...LIST_SPECS.mous.fields.map((f) => f.key)];
const pick = (m: Mou) => Object.fromEntries(FIELDS.map((k) => [k, (m as Record<string, unknown>)[k] ?? null]));

/**
 * Holds every MoU for the cards' Add, Edit, Delete, drag-to-reorder and sort. Each change saves
 * the whole list through the admin's content store (key list:mous), so it shows on the live site
 * at once and can be undone from the admin toolbar (Undo and History).
 */
export default function MouEditorProvider({ mous, departments, children }: { mous: Mou[]; departments: string[]; children: ReactNode }) {
  const { admin, save } = useAdmin();
  const [rows, setRows] = useState(mous);
  useEffect(() => setRows(mous), [mous]);

  const store = useCallback(
    async (next: Mou[], label: string) => {
      const ok = await save("list:mous", next.map(pick), label);
      if (ok) setRows(next);
      return ok ? null : "The change could not be saved. The admin bar at the top shows why.";
    },
    [save],
  );

  const saveMou = useCallback(
    async (slug: string | null, d: MouDraft) => {
      const partner = d.partner.trim();
      if (!partner) return "Enter the partner organisation's name.";
      const old = slug ? rows.find((r) => r.slug === slug) : undefined;
      const mou: Mou = { ...d, partner, slug: old?.slug ?? "", sort_order: old?.sort_order ?? rows.length + 1 };
      const next = old ? rows.map((r) => (r === old ? mou : r)) : [...rows, mou];
      return store(next, `MoU ${old ? "edited" : "added"}: ${partner}`);
    },
    [rows, store],
  );

  const deleteMou = useCallback(
    async (slug: string) => {
      const old = rows.find((r) => r.slug === slug);
      if (!old) return null;
      return store(rows.filter((r) => r !== old), `MoU deleted: ${old.partner}`);
    },
    [rows, store],
  );

  const moveMou = useCallback(
    async (fromSlug: string, toSlug: string) => {
      const from = rows.findIndex((r) => r.slug === fromSlug);
      const to = rows.findIndex((r) => r.slug === toSlug);
      if (from < 0 || to < 0 || from === to) return null;
      const next = [...rows];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return store(next, `MoUs reordered: ${item.partner}`);
    },
    [rows, store],
  );

  const sortByDate = useCallback(async () => {
    // Newest first; MoUs without a signing date keep their order at the end.
    const next = [...rows].sort((a, b) => (b.signed_on ?? "").localeCompare(a.signed_on ?? ""));
    return store(next, "MoUs sorted by date signed (newest first)");
  }, [rows, store]);

  const value = useMemo(() => ({ admin, rows, departments, saveMou, deleteMou, moveMou, sortByDate }), [admin, rows, departments, saveMou, deleteMou, moveMou, sortByDate]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
