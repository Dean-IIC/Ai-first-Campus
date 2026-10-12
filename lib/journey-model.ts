/** Shared rules for the AI Transformation Journey timeline (visitors and editors). */
export const JOURNEY_STATUSES = ["completed", "in_progress", "upcoming"] as const;
export type JourneyStatus = (typeof JOURNEY_STATUSES)[number];

export const STATUS_LABEL: Record<JourneyStatus, string> = {
  completed: "Completed",
  in_progress: "In progress",
  upcoming: "Upcoming",
};

/** Icon names an entry can use; the matching icons are drawn in journey-entry. */
export const JOURNEY_ICON_NAMES = ["sparkles", "sunrise", "sprout", "hammer", "presentation", "rocket", "flask", "book", "users", "trophy", "cpu"] as const;
export const ICON_LABEL: Record<string, string> = {
  sparkles: "Sparkles",
  sunrise: "Sunrise",
  sprout: "Sprout",
  hammer: "Hammer",
  presentation: "Presentation",
  rocket: "Rocket",
  flask: "Flask",
  book: "Book",
  users: "People",
  trophy: "Trophy",
  cpu: "Chip",
};

export const MAX_BULLETS = 20;
export const LAYERS = [1, 2, 3, 4, 5] as const;

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** A photo shown between an entry's first paragraph and its bullet points, with an optional caption. */
export type JourneyInlinePhoto = { src: string; alt: string; caption: string };

/** The entry's inline photo, or null when it has none. */
export function inlinePhotoOf(m: { inline_photo?: unknown }): JourneyInlinePhoto | null {
  const v = m.inline_photo as Partial<JourneyInlinePhoto> | null | undefined;
  if (!v || typeof v !== "object" || typeof v.src !== "string" || !v.src) return null;
  return { src: v.src, alt: typeof v.alt === "string" ? v.alt : "", caption: typeof v.caption === "string" ? v.caption : "" };
}

type Entry = { title: string; summary: string | null; points: string[]; badge: string | null; photos: unknown; inline_photo?: unknown };

/** An entry with any content is shown to visitors. An entry with nothing in it is an empty month. */
export function isFilled(m: Entry): boolean {
  const photos = Array.isArray(m.photos) ? m.photos.length : 0;
  return Boolean(m.title.trim() || (m.summary ?? "").trim() || m.points.some((p) => p.trim()) || (m.badge ?? "").trim() || photos || inlinePhotoOf(m));
}

/** The latest entry marked In progress (in timeline order). It is the one that shows "— Present". */
export function presentSlug(list: { slug: string; status: string }[]): string | null {
  let found: string | null = null;
  for (const m of list) if (m.status === "in_progress") found = m.slug;
  return found;
}

/** The month after a label such as "June 2026", or null if the label is not "Month YYYY". */
export function nextMonth(period: string): { label: string; slug: string; year: number; month: number } | null {
  const m = /^\s*([A-Za-z]+)\s+(\d{4})\s*$/.exec(period);
  if (!m) return null;
  const index = MONTHS.findIndex((name) => name.toLowerCase() === m[1].toLowerCase());
  if (index < 0) return null;
  const year = index === 11 ? Number(m[2]) + 1 : Number(m[2]);
  const month = (index + 1) % 12;
  const slug = `m-${year}-${String(month + 1).padStart(2, "0")}`;
  return { label: `${MONTHS[month]} ${year}`, slug, year, month };
}

/** Month label and slug for a given date, used for new months. */
export function monthLabel(year: number, month: number): string {
  return `${MONTHS[month]} ${year}`;
}
