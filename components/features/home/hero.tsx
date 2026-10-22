/* eslint-disable @next/next/no-img-element */
import { GraduationCap, type LucideIcon } from "lucide-react";
import AnniversaryBadge from "@/components/features/layout/anniversary-badge";
import { images, site } from "@/lib/site";
import { getHeroSlides } from "@/lib/carousel-server";
import HeroCarousel from "./hero-carousel";
import EditableText from "@/components/features/cms/editable-text";
import { shell } from "@/lib/ui";

type Logo = { src: string; alt: string; width: number; height: number };

// The first three points show the 30 Years of Excellence badge and the VTU and AICTE logos
// (56 px, on transparent backgrounds); the last keeps its icon. Every mark sits in the same slot
// width, so the four labels line up.
const FACTS: { icon?: LucideIcon; logo?: Logo; label: string }[] = [
  { label: `Established ${site.established}` },
  { logo: images.vtu, label: "Affiliated to VTU, Belagavi" },
  { logo: images.aicte, label: "Approved by AICTE, New Delhi" },
  { icon: GraduationCap, label: "Five BE programmes, six research centres" },
];

const slot = "grid h-14 w-[4.25rem] shrink-0 place-items-center";

/** Opening section: headline, key facts and the photo carousel with a frosted location badge. */
export default async function Hero() {
  const slides = await getHeroSlides();
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 size-[32rem] rounded-full bg-primary/10 blur-3xl dark:bg-primary/15" />
      <div className={`${shell} relative grid gap-10 py-10 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:py-14`}>
        <div>
          <EditableText as="h1" id="home.hero.title" className="text-4xl font-bold leading-[1.1] text-heading sm:text-5xl lg:text-[3.25rem]">Engineering education for the age of AI and quantum computing</EditableText>
          <EditableText as="p" id="home.hero.intro" className="mt-5 max-w-[56ch] text-lg leading-relaxed text-muted-foreground">{`${site.name} has educated engineers in Nagawara, Bengaluru since ${site.established}, directly opposite Manyata Tech Park. Every programme now teaches students to build with AI, and our Quantum Lab prepares them for what comes next.`}</EditableText>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {FACTS.map(({ icon: Icon, logo, label }) => (
              <li key={label} className="flex items-center gap-3 text-[0.9375rem] font-medium text-foreground">
                <span className={slot}>
                  {Icon ? (
                    <span className="grid size-9 place-items-center rounded-full bg-brand-tint text-primary">
                      <Icon aria-hidden="true" className="size-[1.125rem]" />
                    </span>
                  ) : logo ? (
                    <img src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} className="h-14 w-auto max-w-none object-contain" />
                  ) : (
                    <AnniversaryBadge className="h-14 max-w-none" />
                  )}
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>
        <HeroCarousel slides={slides} />
      </div>
    </section>
  );
}
