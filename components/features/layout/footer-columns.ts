import { IEEE_CHAPTERS, sectionLinks, type MenuSection } from "@/lib/menu";
import type { NavItem } from "@/lib/site";

export type FooterColumn = { title: string; links: NavItem[] };

/** Research pages kept in the footer, since the R&D menu item may point to the research portal. */
const RESEARCH_LINKS: NavItem[] = [
  { label: "Research centres", href: "/research/centres" },
  { label: "Research projects", href: "/research#projects" },
];

/** Short footer labels for the IEEE chapters. */
const IEEE_SHORT: Record<string, string> = {
  cis: "IEEE CIS chapter",
  wie: "IEEE Women in Engineering",
  "information-theory": "IEEE Information Theory",
  "education-society": "IEEE Education Society",
};

/**
 * Six balanced footer columns, built from the same menu tree as the header
 * so the two never drift apart.
 */
export function buildFooterColumns(menu: MenuSection[]): FooterColumn[] {
  const find = (label: string) => menu.find((m) => m.label === label);
  const single = (label: string): NavItem[] => {
    const s = find(label);
    return s?.href ? [{ label: s.label, href: s.href, external: s.external }] : [];
  };
  const column = (label: string, index: number): NavItem[] => find(label)?.columns?.[index]?.links ?? [];
  const about = find("About");
  // The R&D item's portal address (set in Edit content), listed as "HKBK Research" when it is a web address.
  const rnd = find("R&D");
  const portal: NavItem[] = rnd?.href && /^https?:\/\//i.test(rnd.href) ? [{ label: "HKBK Research", href: rnd.href, external: rnd.external }] : [];
  const ai = find("AI First Campus");

  return [
    {
      title: "About HKBK",
      links: [...(about ? column("About", 0) : []), ...single("Placements"), ...single("MoUs"), ...single("IQAC")],
    },
    { title: "Programmes", links: column("Programmes", 0) },
    { title: "Departments", links: find("Departments") ? sectionLinks(find("Departments")!) : [] },
    { title: "Centre of Excellence", links: [...portal, ...RESEARCH_LINKS, ...column("Centre of Excellence", 0), ...column("Centre of Excellence", 2)] },
    {
      title: "Student life",
      links: [
        { label: "IEEE Student Branch", href: "/ieee" },
        ...IEEE_CHAPTERS.map((c) => ({ label: IEEE_SHORT[c.id] ?? c.label, href: `/ieee#${c.id}` })),
        { label: "Houses", href: "/houses" },
        { label: "News and events", href: "/news" },
      ],
    },
    {
      title: "AI and quantum",
      links: [...(ai ? sectionLinks(ai) : []), ...single("Quantum Ready Campus"), ...single("IDEA Lab")],
    },
  ].filter((c) => c.links.length > 0);
}
