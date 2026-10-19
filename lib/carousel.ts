import { images } from "./site";

/** One photo in the home page carousel. An empty title and subtitle hide the badge for that photo. */
export type HeroSlide = { src: string; alt: string; title: string; subtitle: string };

/** Saved under this key in the content store (Edit content → Home page carousel). */
export const CAROUSEL_KEY = "home:carousel";
export const MAX_SLIDES = 10;

/** What the carousel shows until photos are saved: the campus photo with its location badge. */
export const DEFAULT_SLIDES: HeroSlide[] = [
  { src: images.campus.src, alt: images.campus.alt, title: "Nagawara campus", subtitle: "Opposite Manyata Tech Park" },
];
