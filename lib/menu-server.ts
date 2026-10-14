import { getList, getMessages } from "./content";
import { getSiteLinks } from "./site-details";
import { buildMenu, type MenuSection } from "./menu";

/** Loads everything the menu needs and builds it. Server components only. */
export async function getMenu(): Promise<MenuSection[]> {
  const [departments, leaders, initiatives, houses, links] = await Promise.all([
    getList("departments"),
    getMessages(),
    getList("portals"),
    getList("houses"),
    getSiteLinks(),
  ]);
  return buildMenu({ departments, leaders, initiatives, houses, alumniUrl: links.alumniUrl, rndUrl: links.rndUrl });
}
