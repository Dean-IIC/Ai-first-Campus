// Site-wide settings. Edit these values directly; they are not stored in Supabase.
import type { Tone } from "./ui";

export const site = {
  name: "HKBK College of Engineering",
  shortName: "HKBKCE",
  group: "HKBK Group of Institutions",
  established: 1997,
  affiliation: "Affiliated to VTU, Belagavi",
  approval: "Approved by AICTE, New Delhi",
  address: {
    line1: "#22/1, Opp. Manyata Tech Park",
    line2: "Nagawara",
    city: "Bengaluru",
    state: "Karnataka",
    pin: "560045",
  },
  // Add the official numbers and addresses before launch. Empty values are hidden.
  phone: "",
  email: "",
  website: "https://www.hkbk.edu.in",
  /** The Training and Placement Portal (staff sign-in), linked from the Placements page. */
  placementPortalUrl: "https://placements.hkbkce.in",
  mapQuery: "HKBK College of Engineering, Nagawara, Bengaluru 560045",
};

export type NavItem = {
  label: string;
  href: string;
  /** Opens another site (a live initiative subdomain) in a new tab. */
  external?: boolean;
  /** Other routes that should highlight this item, e.g. /uhv for the UHV initiative. */
  match?: string[];
  /** Short status shown under the label, e.g. "Coming soon". */
  note?: string;
  /** Initiative icon key and colour, used in menus. */
  icon?: string;
  iconTone?: Tone;
  /** For initiatives: the menu section they belong to. */
  group?: string;
};
/** Departments of this kind (Mathematics, Physics, Chemistry, Humanities) show no vision and mission. */
export const SCIENCES_KIND = "Basic sciences and humanities";

export const INITIATIVES_LABEL = "Centres & Initiatives";

type InitiativeLike = {
  slug: string;
  title: string;
  url: string | null;
  status: string;
  related_page: string | null;
  icon: string;
  category: string;
  menu_group?: string | null;
};

/**
 * Menu links for centres and initiatives. Each links to its own subdomain once
 * `url` is set and `status` is Live; until then it links to a ready-made page
 * at /initiatives/<slug>.
 */
export function initiativeItems(rows: InitiativeLike[], toneOf: (category: string) => Tone): NavItem[] {
  return rows.map((p) => {
    const live = Boolean(p.url) && p.status === "Live";
    return {
      label: p.title,
      href: live ? p.url! : `/initiatives/${p.slug}`,
      external: live,
      match: [`/initiatives/${p.slug}`, ...(p.related_page ? [p.related_page] : [])],
      note: live ? new URL(p.url!).hostname : "Coming soon",
      icon: p.icon,
      iconTone: toneOf(p.category),
      group: p.menu_group || "Campus Life",
    };
  });
}

/** True when `item` is the page at `path`. */
export function isActiveItem(item: NavItem, path: string): boolean {
  return item.href === path || Boolean(item.match?.includes(path));
}


export const fullAddress = [
  site.address.line1,
  site.address.line2,
  `${site.address.city} ${site.address.pin}`,
  site.address.state,
].join(", ");

// Images in /public/images. campus.webp is a photograph of the college building;
// the AI and quantum images are original illustrations. Keep alt text accurate.
export const images = {
  anniversary: { src: "/images/30-years-badge.webp", srcSm: "/images/30-years-badge-sm.webp", alt: "Celebrating 30 years of excellence, 1997–2027", width: 225, height: 192 },
  campus: { src: "/images/campus.webp", alt: "HKBK College of Engineering building, with the I love HKBK sign on the front lawn" },
  ai: { src: "/images/ai-network.webp", alt: "Illustration of a brain drawn as a glowing neural network" },
  quantum: { src: "/images/quantum-computer.webp", alt: "Illustration of a superconducting quantum computer with gold cooling stages" },
  bloch: { src: "/images/bloch-sphere.webp", alt: "Bloch sphere showing a qubit state as an arrow" },
};

// AI First programme. Names and photos go in the ai_people table when ready.
export const aiProgramme = {
  facultyChampions: 15,
  studentAmbassadors: 50,
};
