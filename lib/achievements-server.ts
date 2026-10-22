import { achievementsKey, legacyAchievements, type Achievement } from "./achievements";
import { getContentMap } from "./cms/read";
import type { Department } from "./types";

/** A department's achievements: the saved list, or its single older achievement until one is saved. Server only. */
export async function getAchievements(d: Department): Promise<Achievement[]> {
  const raw = (await getContentMap())[achievementsKey(d.slug)];
  if (!Array.isArray(raw)) return legacyAchievements(d);
  return raw
    .filter((a): a is Record<string, unknown> => Boolean(a) && typeof a === "object")
    .map((a) => ({
      id: String(a.id ?? ""),
      title: String(a.title ?? ""),
      year: String(a.year ?? ""),
      text: String(a.text ?? ""),
      photo_url: typeof a.photo_url === "string" && a.photo_url ? a.photo_url : null,
    }))
    .filter((a) => a.id && a.title);
}
