import { getContentMap } from "./cms/read";
import { site } from "./site";

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

/** Links the admin can change in the content editor ("Alumni, R&D and UHV portal links"). Server only. */
export async function getSiteLinks(): Promise<{ alumniUrl: string; rndUrl: string; uhvUrl: string }> {
  const raw = (await getContentMap())["site:links"];
  const v = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const pick = (key: string) => (typeof v[key] === "string" ? (v[key] as string).trim() : "");
  return { alumniUrl: pick("alumniUrl"), rndUrl: pick("rndUrl"), uhvUrl: pick("uhvUrl") };
}
