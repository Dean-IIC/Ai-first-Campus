const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Formats an ISO date (YYYY-MM-DD) as "3 Oct 2026" without timezone shifts. */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

export function initials(text: string): string {
  const words = text.replace(/^(dr|prof|mr|mrs|ms|sri|shri|smt)\.?\s+/i, "").split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

/** Initials of a person's name, or the acronym of their designation if no name is set. */
export function monogram(name: string | null, designation: string): string {
  if (name) return initials(name);
  return designation
    .split(/\s+/)
    .filter((w) => w && !/^(of|the|and)$/i.test(w))
    .map((w) => w[0].toUpperCase())
    .join("")
    .slice(0, 3);
}
