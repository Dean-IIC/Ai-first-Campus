import { images } from "./site";

/**
 * One photo in the home page carousel. An empty title and subtitle hide the badge for that photo.
 * `fit`: "cover" fills the frame (photos); "contain" shows the whole image on a light backing
 * (posters and certificates), so nothing is cropped.
 */
export type SlideFit = "cover" | "contain";
export type HeroSlide = { src: string; alt: string; title: string; subtitle: string; fit: SlideFit };

/** Saved under this key in the content store (Edit content → Home page carousel). */
export const CAROUSEL_KEY = "home:carousel";
export const MAX_SLIDES = 10;

/** What the carousel shows until photos are saved: the campus photo with its location badge. */
export const DEFAULT_SLIDES: HeroSlide[] = [
  { src: images.campus.src, alt: images.campus.alt, title: "Nagawara campus", subtitle: "Opposite Manyata Tech Park", fit: "cover" },
];
