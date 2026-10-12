/* eslint-disable @next/next/no-img-element */
import { Award, BadgeCheck, BrainCircuit, Briefcase, CalendarDays, FileText, GraduationCap, Handshake, Lightbulb, School, Sparkles, type LucideIcon } from "lucide-react";
import CountUp from "@/components/features/home/count-up";
import { getList } from "@/lib/content";
import { aiProgramme, images, site } from "@/lib/site";
import { shell } from "@/lib/ui";

const ICONS: Record<string, LucideIcon> = {
  "years-of-excellence": CalendarDays,
  students: GraduationCap,
  "papers-published": FileText,
  faculty: School,
  "patents-filed": Lightbulb,
  "patents-published": BadgeCheck,
  "patents-granted": Award,
  mous: Handshake,
  "ai-faculty-champions": BrainCircuit,
  "ai-student-ambassadors": Sparkles,
  "students-placed": Briefcase,
};

/** Figures the site already knows, so they never drift out of date. */
function computed(slug: string): number | undefined {
  if (slug === "years-of-excellence") return new Date().getFullYear() - site.established;
  if (slug === "ai-faculty-champions") return aiProgramme.facultyChampions;
  if (slug === "ai-student-ambassadors") return aiProgramme.studentAmbassadors;
  return undefined;
}

/** Big numbers on a darkened campus photo. Figures without a value show "Figure coming soon". */
export default async function KeyFigures() {
  const figures = await getList("key_figures");
  if (figures.length === 0) return null;

  return (
    <section aria-label="HKBK in numbers" className="relative isolate overflow-hidden bg-brand-dark text-white">
      <img src={images.campus.src} alt="" aria-hidden="true" className="absolute inset-0 -z-10 size-full object-cover opacity-20" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-dark via-brand-dark/90 to-brand/80" />
      <div className={`${shell} py-12 lg:py-14`}>
        <ul className="flex flex-wrap justify-center gap-4">
          {figures.map((f) => {
            const Icon = ICONS[f.slug] ?? FileText;
            const value = computed(f.slug) ?? f.value;
            return (
              <li key={f.slug} className="min-w-0 basis-[calc((100%-1rem)/2-1px)] rounded-2xl border sm:basis-[calc((100%-2rem)/3-1px)] lg:basis-[calc((100%-5rem)/6-1px)] border-white/10 bg-white/[0.06] p-5 text-center shadow-[0_0_40px_-14px_rgba(242,169,0,0.45)] backdrop-blur-md transition-colors hover:bg-white/10">
                <span className="mx-auto grid size-12 place-items-center rounded-full bg-white/10 text-gold">
                  <Icon aria-hidden="true" className="size-6" />
                </span>
                <p className="mt-4 text-4xl font-bold leading-none text-white lg:text-[2.5rem]">
                  {value !== null ? <CountUp value={value} suffix={f.suffix} /> : <span className="text-white/40">—</span>}
                </p>
                <p className="mt-3 text-base font-semibold text-gold">{f.label}</p>
                {value === null && <p className="mt-1 text-xs text-white/60">Figure coming soon</p>}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
