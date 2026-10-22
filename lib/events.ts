import type { NewsItem } from "./types";

/*
 * Events helpers shared by the home page, the Events page and the on-card editor. Events are the
 * rows of the news_items list with kind "event"; the old news rows stay in the list but are not
 * shown. Extra fields (end date, time, venue, category, poster) live in the admin content store.
 */
export const EVENT_CATEGORIES = ["Workshop", "Seminar", "Fest", "Sports", "Cultural", "Other"] as const;
export type EventCategory = (typeof EVENT_CATEGORIES)[number];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Today's date in India (YYYY-MM-DD), so an event becomes "past" after its last day on campus. */
export function todayInIndia(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(now);
}

export const eventStart = (e: NewsItem) => e.event_date ?? e.published_on;
export const eventEnd = (e: NewsItem) => e.end_date || eventStart(e);
export const isPastEvent = (e: NewsItem, today = todayInIndia()) => eventEnd(e) < today;

/** Events only, split into upcoming (soonest first) and past (most recent first). */
export function splitEvents(items: NewsItem[], today = todayInIndia()): { upcoming: NewsItem[]; past: NewsItem[] } {
  const events = items.filter((n) => n.kind === "event");
  const upcoming = events.filter((e) => !isPastEvent(e, today)).sort((a, b) => eventStart(a).localeCompare(eventStart(b)));
  const past = events.filter((e) => isPastEvent(e, today)).sort((a, b) => eventStart(b).localeCompare(eventStart(a)));
  return { upcoming, past };
}

/** "10 Jul 2026", "10–12 Jul 2026", "30 Jul – 2 Aug 2026" or "30 Dec 2026 – 2 Jan 2027". */
export function eventDates(e: NewsItem): string {
  const [y1, m1, d1] = eventStart(e).split("-").map(Number);
  const [y2, m2, d2] = eventEnd(e).split("-").map(Number);
  if (!y1 || !m1 || !d1) return "";
  const one = (y: number, m: number, d: number) => `${d} ${MONTHS[m - 1]} ${y}`;
  if (!y2 || eventEnd(e) <= eventStart(e)) return one(y1, m1, d1);
  if (y1 !== y2) return `${one(y1, m1, d1)} – ${one(y2, m2, d2)}`;
  if (m1 !== m2) return `${d1} ${MONTHS[m1 - 1]} – ${one(y2, m2, d2)}`;
  return `${d1}–${one(y2, m2, d2)}`;
}
