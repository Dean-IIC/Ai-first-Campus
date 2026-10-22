import { Award, Building2, GraduationCap, type LucideIcon } from "lucide-react";
import AnniversaryBadge from "@/components/features/layout/anniversary-badge";
import { site } from "@/lib/site";
import { getHeroSlides } from "@/lib/carousel-server";
import HeroCarousel from "./hero-carousel";
import EditableText from "@/components/features/cms/editable-text";
import { shell } from "@/lib/ui";

// The first point shows the 30 Years of Excellence badge instead of an icon.
const FACTS: { icon?: LucideIcon; label: string }[] = [
  { label: `Established ${site.established}` },
  { icon: Building2, label: "Affiliated to VTU, Belagavi" },
  { icon: Award, label: "Approved by AICTE, New Delhi" },
  { icon: GraduationCap, label: "Five BE programmes, six research centres" },
];

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
            {FACTS.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-[0.9375rem] font-medium text-foreground">
                {Icon ? (
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-tint text-primary">
                    <Icon aria-hidden="true" className="size-[1.125rem]" />
                  </span>
                ) : (
                  <span className="grid size-9 shrink-0 place-items-center">
                    <AnniversaryBadge small className="h-9 max-w-none" />
                  </span>
                )}
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
