import { getContentMap } from "./cms/read";
import { CAROUSEL_KEY, DEFAULT_SLIDES, MAX_SLIDES, type HeroSlide } from "./carousel";

/** The home page carousel photos the admin saved, or the campus photo when none are saved. Server only. */
export async function getHeroSlides(): Promise<HeroSlide[]> {
  const raw = (await getContentMap())[CAROUSEL_KEY];
  if (!Array.isArray(raw)) return DEFAULT_SLIDES;
  const str = (v: unknown) => (typeof v === "string" ? v : "");
  const slides = raw
    .filter((s): s is Record<string, unknown> => Boolean(s) && typeof s === "object" && typeof (s as Record<string, unknown>).src === "string")
    .map((s) => ({ src: str(s.src), alt: str(s.alt), title: str(s.title), subtitle: str(s.subtitle) }))
    .slice(0, MAX_SLIDES);
  return slides.length ? slides : DEFAULT_SLIDES;
}
