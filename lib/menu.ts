import { toneForCategory } from "./portals";
import { images, initiativeItems, isActiveItem, type NavItem } from "./site";
import type { Tone } from "./ui";

/** A dropdown column. With `href` the heading is a link; `icon` shows before the heading. A column with `href` and no links is shown as one direct link. */
export type MenuColumn = { title: string; links: NavItem[]; href?: string; icon?: "cpu" | "atom" };

/** A full web address on another site. HKBK's own sites (*.hkbkce.in) open in the same tab. */
export const isOffSite = (url: string) => /^https?:\/\//i.test(url) && !/^https?:\/\/([a-z0-9-]+\.)*hkbkce\.in(\/|$)/i.test(url);

/**
 * One item in the top menu. Items with `columns` open a dropdown; items with
 * only `href` are plain links. The same list drives the top menu, the left
 * panel and the footer, so they always match.
 */
export type MenuSection = {
  label: string;
  tone: Tone;
  href?: string;
  external?: boolean;
  /** Other routes that belong to this item (for highlighting). */
  match?: string[];
  /** A small icon shown before the label (a key the menu knows, e.g. "flask"). */
  icon?: "flask" | "heart";
  /** Tooltip shown on hover. */
  hint?: string;
  columns?: MenuColumn[];
  feature?: { title: string; text: string; image?: string; href: string; cta: string };
  /** A small link at the bottom of the dropdown, e.g. to an overview page. */
  footerLink?: { label: string; href: string };
};

type Dept = { slug: string; name: string; kind: string; programmes: string | null; has_research_centre: boolean };
type Leader = { slug: string; designation: string; name: string | null };
type House = { slug: string; name: string; is_placeholder?: boolean };
type Initiative = Parameters<typeof initiativeItems>[0][number];

export const IEEE_CHAPTERS = [
  { id: "cis", label: "Computational Intelligence Society (CIS)" },
  { id: "wie", label: "Women in Engineering (WIE)" },
  { id: "information-theory", label: "Information Theory Society" },
  { id: "education-society", label: "Education Society" },
];

/** The top menu, in the order requested by the college. */
export function buildMenu({
  departments,
  leaders,
  initiatives,
  houses,
  alumniUrl = "",
  rndUrl = "",
  uhvUrl = "",
  placementUrl = "",
}: {
  departments: Dept[];
  leaders: Leader[];
  initiatives: Initiative[];
  houses: House[];
  /** The Alumni portal address the admin saved; empty opens the /alumni page. */
  alumniUrl?: string;
  /** The R&D portal address the admin saved; empty opens the /rnd page. */
  rndUrl?: string;
  /** The UHV portal address the admin saved; empty opens the /uhv page. */
  uhvUrl?: string;
  /** The Placement Portal address the admin saved; empty opens the /placements page. */
  placementUrl?: string;
}): MenuSection[] {
  const items = initiativeItems(initiatives, toneForCategory);
  const bySlug = (slug: string) => {
    const i = initiatives.findIndex((p) => p.slug === slug);
    return i >= 0 ? items[i] : undefined;
  };
  const pick = (...slugs: string[]) => slugs.map(bySlug).filter((x): x is NavItem => Boolean(x));

  const engineering = departments.filter((d) => d.kind === "Engineering");
  const sciences = departments.filter((d) => d.kind === "Basic sciences and humanities");
  const physical = departments.filter((d) => d.kind === "Physical education");
  const programmes = departments.filter((d) => d.programmes === "BE");
  const centres = departments.filter((d) => d.has_research_centre);
  const ideaLab = bySlug("idea-lab");
  const ieeeSite = bySlug("ieee");

  return [
    { label: "Home", tone: "blue", href: "/" },
    {
      label: "About",
      tone: "blue",
      columns: [
        {
          title: "About HKBK",
          links: [
            { label: "Overview", href: "/about" },
            { label: "Vision and mission", href: "/about#vision-mission" },
            { label: "Leadership messages", href: "/leadership" },
          ],
        },
        {
          title: "Leadership",
          links: leaders.map((l) => ({ label: `${l.designation}'s message`, note: l.name ?? undefined, href: `/leadership#${l.slug}` })),
        },
      ],
      feature: {
        title: "HKBK College of Engineering",
        text: "Educating engineers since 1997, affiliated to VTU, Belagavi and approved by AICTE, directly opposite Manyata Tech Park.",
        image: images.campus.src,
        href: "/about",
        cta: "Learn more",
      },
    },
    {
      label: "Programmes",
      tone: "green",
      match: ["/programmes"],
      columns: [
        {
          title: "Bachelor of Engineering (BE)",
          links: [...programmes.map((d) => ({ label: d.name, href: `/academics/${d.slug}` })), { label: "All programmes", href: "/programmes" }],
        },
      ],
      feature: {
        title: "Undergraduate programmes",
        text: `${programmes.length} four-year BE programmes under the VTU curriculum, with AI built into every one.`,
        href: "/programmes",
        cta: "View all programmes",
      },
    },
    {
      label: "Departments",
      tone: "green",
      match: ["/academics"],
      columns: [
        { title: "Engineering", links: engineering.map((d) => ({ label: d.name, href: `/academics/${d.slug}` })) },
        { title: "Basic sciences and humanities", links: sciences.map((d) => ({ label: d.name, href: `/academics/${d.slug}` })) },
        { title: "Physical education", links: [...physical.map((d) => ({ label: d.name, href: `/academics/${d.slug}` })), { label: "All departments", href: "/academics" }] },
      ],
      feature: {
        title: "Departments",
        text: `${departments.length} departments, each with its own vision and mission.`,
        href: "/academics",
        cta: "View all departments",
      },
    },
    {
      label: "Centre of Excellence",
      tone: "amber",
      match: ["/research", "/research/centres", "/consultancy", "/corporate-training", "/initiatives"],
      columns: [
        {
          title: "Industry",
          links: [
            { label: "Consultancy projects", href: "/consultancy" },
            { label: "Corporate training", href: "/corporate-training" },
          ],
        },
        { title: "Research centres", links: centres.map((d) => ({ label: d.name, href: `/academics/${d.slug}#research-centre` })) },
        { title: "Centres and cells", links: pick("skill-development", "equal-opportunity-cell", "alumni") },
      ],
      feature: {
        title: "Centre of Excellence",
        text: `${centres.length} research centres, dedicated cells and industry partnerships driving excellence at HKBK.`,
        href: "/research/centres",
        cta: "Explore research centres",
      },
    },
    {
      label: "IEEE",
      tone: "rose",
      match: ["/ieee", "/initiatives/ieee"],
      columns: [
        {
          title: "IEEE Student Branch",
          links: [
            { label: "About the branch", href: "/ieee#about-the-branch" },
            { label: "Activities", href: "/ieee#activities" },
            { label: "Membership", href: "/ieee#membership" },
            ...(ieeeSite?.external ? [{ ...ieeeSite, label: "Branch website" }] : []),
          ],
        },
        { title: "Chapters", links: IEEE_CHAPTERS.map((c) => ({ label: c.label, href: `/ieee#${c.id}` })) },
      ],
      feature: {
        title: "IEEE at HKBK",
        text: "Join the world's largest technical professional organisation through our student branch and its chapters.",
        href: "/ieee",
        cta: "About the branch",
      },
    },
    {
      label: "Houses",
      tone: "violet",
      match: ["/houses"],
      columns: [{ title: "Our five houses", links: houses.map((h) => ({ label: h.name, href: `/houses#${h.slug}`, note: h.is_placeholder ? "Name coming soon" : undefined })) }],
      feature: {
        title: "House system",
        text: "Every student belongs to one of five houses, which compete in sport, culture and service through the year.",
        href: "/houses",
        cta: "Meet the houses",
      },
    },
    // A saved Placement Portal Link opens straight in a new tab, even on *.hkbkce.in (unlike R&D and UHV).
    { label: "Placements", tone: "blue", href: placementUrl || "/placements", external: /^https?:\/\//i.test(placementUrl), match: ["/placements"] },
    { label: "Alumni", tone: "blue", href: alumniUrl || "/alumni", external: isOffSite(alumniUrl), match: ["/alumni"] },
    {
      label: "R&D",
      tone: "amber",
      href: rndUrl || "/rnd",
      external: isOffSite(rndUrl),
      match: ["/rnd"],
      icon: "flask",
      hint: "Research & Development",
    },
    {
      label: "UHV",
      tone: "green",
      href: uhvUrl || "/uhv",
      external: isOffSite(uhvUrl),
      match: ["/uhv"],
      icon: "heart",
      hint: "Universal Human Values — Coming soon",
    },
    { label: "MoUs", tone: "amber", href: "/mous" },
    {
      label: "AI & Quantum Campus",
      tone: "teal",
      match: ["/ai-quantum", "/ai-quantum/ai-first", "/ai-quantum/champions", "/ai-quantum/dashboards", "/ai-quantum/quantum-lab"],
      columns: [
        {
          title: "AI First Campus",
          href: "/ai-quantum/ai-first",
          icon: "cpu",
          links: [],
        },
        {
          title: "Quantum Ready Campus",
          href: "/ai-quantum/quantum-lab",
          icon: "atom",
          links: [],
        },
      ],
      footerLink: { label: "Overview of AI and quantum", href: "/ai-quantum" },
    },
    {
      label: "IDEA Lab",
      tone: "amber",
      href: ideaLab?.href ?? "/initiatives/idea-lab",
      external: ideaLab?.external,
      match: ["/initiatives/idea-lab"],
    },
    { label: "IQAC", tone: "blue", href: "/iqac" },
  ];
}

/** True for a column that is one direct link (its heading) rather than a list. */
export const isDirectColumn = (col: MenuColumn) => Boolean(col.href) && col.links.length === 0;

/** True when every column is a direct link, so the dropdown is a short compact list. */
export const isCompactSection = (section: MenuSection) => Boolean(section.columns?.length) && section.columns!.every(isDirectColumn);

/** Every link inside a section, in order. A direct-link column counts as its heading's link. */
export function sectionLinks(section: MenuSection): NavItem[] {
  if (!section.columns) return section.href ? [{ label: section.label, href: section.href, external: section.external }] : [];
  return section.columns.flatMap((c) => (isDirectColumn(c) ? [{ label: c.title, href: c.href! }] : c.links));
}

/** True when `path` is the section's own page or one of its links. */
function sectionMatches(section: MenuSection, path: string): boolean {
  if (section.href && section.href === path) return true;
  if (section.match?.includes(path)) return true;
  return sectionLinks(section).some((i) => isActiveItem(i, path) || i.href.split("#")[0] === path);
}

/** The menu section a route belongs to, for highlighting, the banner colour and breadcrumbs. */
export function sectionFor(path: string, menu: MenuSection[]): MenuSection | undefined {
  if (path === "/") return menu[0];
  if (path.startsWith("/academics/")) return menu.find((s) => s.label === "Departments");
  const direct = menu.slice(1).find((s) => sectionMatches(s, path));
  if (direct) return direct;
  if (path.startsWith("/initiatives/")) return menu.find((s) => s.label === "Centre of Excellence");
  return undefined;
}
