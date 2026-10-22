"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useAdmin } from "@/components/features/admin/admin-provider";
import { achievementsKey, type Achievement } from "@/lib/achievements";

export type AchievementDraft = Omit<Achievement, "id">;

type AchievementsEditor = {
  admin: boolean;
  rows: Achievement[];
  saveAchievement: (id: string | null, draft: AchievementDraft) => Promise<string | null>;
  deleteAchievement: (id: string) => Promise<string | null>;
};

const Ctx = createContext<AchievementsEditor>({ admin: false, rows: [], saveAchievement: async () => null, deleteAchievement: async () => null });
export function useAchievementsEditor(): AchievementsEditor {
  return useContext(Ctx);
}

/** A short random id for a new achievement. */
const newId = () => `a-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

/**
 * Holds one department's achievements for the Achievements tab's Add, Edit and Delete. Each change
 * saves the whole list through the admin's content store (key achievements:<slug>), so it shows on
 * the live site at once and can be undone (Undo and History). New achievements go to the top.
 */
export default function AchievementsEditorProvider({ items, department, children }: { items: Achievement[]; department: string; children: ReactNode }) {
  const { admin, save } = useAdmin();
  const [rows, setRows] = useState(items);
  useEffect(() => setRows(items), [items]);

  const store = useCallback(
    async (next: Achievement[], label: string) => {
      const ok = await save(achievementsKey(department), next, label);
      if (ok) setRows(next);
      return ok ? null : "The change could not be saved. The admin bar at the top shows why.";
    },
    [save, department],
  );

  const saveAchievement = useCallback(
    async (id: string | null, d: AchievementDraft) => {
      const title = d.title.trim();
      if (!title) return "Enter a title.";
      const item: Achievement = { id: id ?? newId(), ...d, title, year: d.year.trim(), text: d.text.trim() };
      const next = id ? rows.map((r) => (r.id === id ? item : r)) : [item, ...rows];
      return store(next, `Achievement ${id ? "edited" : "added"}: ${title}`);
    },
    [rows, store],
  );

  const deleteAchievement = useCallback(
    async (id: string) => {
      const old = rows.find((r) => r.id === id);
      if (!old) return null;
      return store(rows.filter((r) => r !== old), `Achievement deleted: ${old.title}`);
    },
    [rows, store],
  );

  const value = useMemo(() => ({ admin, rows, saveAchievement, deleteAchievement }), [admin, rows, saveAchievement, deleteAchievement]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
