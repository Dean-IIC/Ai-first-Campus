import type { Department } from "./types";

/**
 * One achievement on a department's Achievements tab: a title, an optional year or date, a
 * description and a photo shown whole in its frame. Saved per department in the content store.
 */
export type Achievement = { id: string; title: string; year: string; text: string; photo_url: string | null };

export const MAX_ACHIEVEMENTS = 50;

/** Content store key for a department's achievements (edited on the Achievements tab). */
export const achievementsKey = (slug: string) => `achievements:${slug}`;
export const ACHIEVEMENTS_KEY = /^achievements:[a-z0-9-]{1,60}$/;

/**
 * The department's single achievement from before the list existed (the achievements text and
 * photo on the departments row), as a one-item list, so nothing is lost until the list is saved.
 */
export function legacyAchievements(d: Pick<Department, "achievements" | "achievements_image">): Achievement[] {
  const text = (d.achievements ?? "").trim();
  if (!text && !d.achievements_image) return [];
  return [{ id: "legacy", title: "Student achievement", year: "", text, photo_url: d.achievements_image ?? null }];
}
