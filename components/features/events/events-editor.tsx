"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useAdmin } from "@/components/features/admin/admin-provider";
import { LIST_SPECS } from "@/lib/cms/schema";
import type { NewsItem } from "@/lib/types";

export type EventDraft = Pick<NewsItem, "title" | "summary" | "event_date" | "end_date" | "event_time" | "venue" | "category" | "poster_url" | "link_url">;

type EventsEditor = {
  admin: boolean;
  rows: NewsItem[];
  saveEvent: (slug: string | null, draft: EventDraft) => Promise<string | null>;
  deleteEvent: (slug: string) => Promise<string | null>;
};

const Ctx = createContext<EventsEditor>({ admin: false, rows: [], saveEvent: async () => null, deleteEvent: async () => null });
export function useEventsEditor(): EventsEditor {
  return useContext(Ctx);
}

const FIELDS = ["slug", ...LIST_SPECS.news_items.fields.map((f) => f.key)];
const pick = (n: NewsItem) => Object.fromEntries(FIELDS.map((k) => [k, (n as Record<string, unknown>)[k] ?? null]));

/**
 * Holds the whole news_items list (old news rows included, untouched) for the event cards' Add,
 * Edit and Delete. Each change saves the list through the admin's content store (key
 * list:news_items), so it shows on the live site at once and can be undone (Undo and History).
 */
export default function EventsEditorProvider({ items, children }: { items: NewsItem[]; children: ReactNode }) {
  const { admin, save } = useAdmin();
  const [rows, setRows] = useState(items);
  useEffect(() => setRows(items), [items]);

  const store = useCallback(
    async (next: NewsItem[], label: string) => {
      const ok = await save("list:news_items", next.map(pick), label);
      if (ok) setRows(next);
      return ok ? null : "The change could not be saved. The admin bar at the top shows why.";
    },
    [save],
  );

  const saveEvent = useCallback(
    async (slug: string | null, d: EventDraft) => {
      const title = d.title.trim();
      if (!title) return "Enter the event's title.";
      if (!d.event_date) return "Choose the start date.";
      if (d.end_date && d.end_date < d.event_date) return "The end date is before the start date.";
      const old = slug ? rows.find((r) => r.slug === slug) : undefined;
      const event: NewsItem = { ...(old ?? { slug: "", is_sample: false, link_url: null }), ...d, title, kind: "event", published_on: d.event_date };
      const next = old ? rows.map((r) => (r === old ? event : r)) : [...rows, event];
      return store(next, `Event ${old ? "edited" : "added"}: ${title}`);
    },
    [rows, store],
  );

  const deleteEvent = useCallback(
    async (slug: string) => {
      const old = rows.find((r) => r.slug === slug);
      if (!old) return null;
      return store(rows.filter((r) => r !== old), `Event deleted: ${old.title}`);
    },
    [rows, store],
  );

  const value = useMemo(() => ({ admin, rows, saveEvent, deleteEvent }), [admin, rows, saveEvent, deleteEvent]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
