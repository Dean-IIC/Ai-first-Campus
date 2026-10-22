import { getContentMap } from "./cms/read";
import { FACULTY_RANKS, site } from "./site";

export type SiteDetails = {
  phone: string;
  email: string;
  mapQuery: string;
  address: typeof site.address;
};

/** Address, phone and email: the values in lib/site.ts, with anything the admin saved laid over them. Server only. */
export async function getSiteDetails(): Promise<SiteDetails> {
  const raw = (await getContentMap())["site:details"];
  const v = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const pick = (key: string, fallback: string) => (typeof v[key] === "string" ? (v[key] as string) : fallback);
  return {
    phone: pick("phone", site.phone),
    email: pick("email", site.email),
    mapQuery: pick("mapQuery", site.mapQuery) || site.mapQuery,
    address: {
      line1: pick("line1", site.address.line1),
      line2: pick("line2", site.address.line2),
      city: pick("city", site.address.city),
      state: pick("state", site.address.state),
      pin: pick("pin", site.address.pin),
    },
  };
}

/** Faculty designations, highest rank first, as set in the content editor ("Faculty designations"). Server only. */
export async function getFacultyRanks(): Promise<string[]> {
  const raw = (await getContentMap())["site:ranks"];
  const list = raw && typeof raw === "object" ? (raw as Record<string, unknown>).designations : null;
  const ranks = Array.isArray(list) ? list.filter((d): d is string => typeof d === "string" && d.trim() !== "").map((d) => d.trim()) : [];
  return ranks.length ? ranks : [...FACULTY_RANKS];
}

/** Links the admin can change in the content editor ("Alumni, R&D, UHV and Placement portal links"). Server only. */
export async function getSiteLinks(): Promise<{ alumniUrl: string; rndUrl: string; uhvUrl: string; placement_portal_link: string }> {
  const raw = (await getContentMap())["site:links"];
  const v = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const pick = (key: string) => (typeof v[key] === "string" ? (v[key] as string).trim() : "");
  return { alumniUrl: pick("alumniUrl"), rndUrl: pick("rndUrl"), uhvUrl: pick("uhvUrl"), placement_portal_link: pick("placement_portal_link") };
}
