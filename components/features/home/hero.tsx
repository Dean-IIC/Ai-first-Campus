/* eslint-disable @next/next/no-img-element */
import { Award, Building2, CalendarDays, GraduationCap, MapPin } from "lucide-react";
import { images, site } from "@/lib/site";
import EditableImage from "@/components/features/cms/editable-image";
import EditableText from "@/components/features/cms/editable-text";
import { shell } from "@/lib/ui";

const FACTS = [
  { icon: CalendarDays, label: `Established ${site.established}` },
  { icon: Building2, label: "Affiliated to VTU, Belagavi" },
  { icon: Award, label: "Approved by AICTE, New Delhi" },
  { icon: GraduationCap, label: "Five BE programmes, six research centres" },
];

/** Opening section: headline, key facts and the campus photograph with a frosted location badge. */
export default function Hero() {
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
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-tint text-primary">
                  <Icon aria-hidden="true" className="size-[1.125rem]" />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>
        <figure className="relative">
          <EditableImage id="home.hero" src={images.campus.src} alt={images.campus.alt} width={1600} height={1066} priority className="aspect-[3/2] w-full rounded-2xl object-cover shadow-[0_30px_60px_-30px_rgba(10,42,87,0.55)] ring-1 ring-border" />
          <figcaption className="absolute -bottom-5 left-5 flex items-center gap-3 rounded-xl border border-white/40 bg-card/80 px-4 py-3 shadow-[0_12px_32px_-12px_rgba(10,42,87,0.45)] backdrop-blur-md dark:border-white/10">
            <span className="grid size-10 place-items-center rounded-lg bg-brand text-white shadow-[0_0_20px_-4px_rgba(18,62,124,0.8)]">
              <MapPin aria-hidden="true" className="size-5" />
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-semibold text-heading">Nagawara campus</span>
              <span className="block text-xs text-muted-foreground">Opposite Manyata Tech Park</span>
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
