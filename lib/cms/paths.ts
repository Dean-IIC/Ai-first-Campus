/*
 * Which content the editor opens first on each page of the site, so "Edit content"
 * starts on what the admin is looking at. Anything else can be picked from the list.
 */
const PAGE_FOR_PATH: Record<string, string> = {
  "/research/centres": "research-centres",
  "/ai-quantum/champions": "ai-champions",
  "/ai-quantum/ai-first": "ai-first",
  "/ai-quantum/quantum-lab": "quantum-lab",
  "/ai-quantum/dashboards": "dashboards",
};

const LIST_FOR_PATH: Record<string, string> = {
  "/": "journey_milestones",
  "/academics": "departments",
  "/initiatives": "portals",
};

export function keyForPath(pathname: string): string | null {
  const path = pathname.replace(/\/+$/, "") || "/";
  if (path.startsWith("/leadership/")) return `message:${path.split("/")[2]}`;
  if (path.startsWith("/academics/")) return "list:departments";
  if (path.startsWith("/initiatives/")) return "list:portals";
  if (LIST_FOR_PATH[path]) return `list:${LIST_FOR_PATH[path]}`;
  if (PAGE_FOR_PATH[path]) return `page:${PAGE_FOR_PATH[path]}`;
  const slug = path.split("/").filter(Boolean).pop();
  return slug && /^[a-z0-9-]+$/.test(slug) && path.split("/").length === 2 ? `page:${slug}` : null;
}
