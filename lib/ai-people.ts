/** The two groups in the AI programme; values match ai_people.role. */
export const AI_ROLES = ["Faculty champion", "Student ambassador"] as const;
export type AiRole = (typeof AI_ROLES)[number];

/**
 * Initials shown in a card's circle when there is no photo: the first letters of the first
 * two words of the name, skipping titles. "Mohammed Ibrahim" becomes "MI" and "Dr. Sujhita"
 * becomes "S". The preview uses the same rule.
 */
export function personInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w) && !/^(dr|mr|mrs|ms|prof|shri|smt)\.?$/i.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

/** Photos shipped with the site for the faculty champions (public/images/champions/). */
export const isShippedChampionPhoto = (url: string) => /^\/images\/champions\/[a-z0-9][a-z0-9._-]*\.(jpe?g|png|webp)$/i.test(url);

/** A card holds a person when it has a name or a photo. The Add/Edit label follows this, not how the record was saved. */
export const hasPerson = (p: { name: string; photoUrl: string | null }) => Boolean(p.name.trim() || p.photoUrl);
