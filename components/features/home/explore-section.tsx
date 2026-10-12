import Link from "next/link";
import { SectionHeading } from "@/components/features/content/bits";
import Panel from "@/components/features/content/panel";
import { AREAS } from "@/lib/areas";
import { linkText, shell } from "@/lib/ui";

const EXPLORE = ["researchCentres", "research", "consultancy", "training"];

/** Research and industry panels. */
export default function ExploreSection() {
  return (
    <section className={`${shell} pt-14`}>
      <SectionHeading title="Research and industry" tone="amber" />
      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {EXPLORE.map((k) => {
          const a = AREAS[k];
          if (!a) return null;
          return (
            <Panel key={k} title={a.title} icon={a.icon} tone={a.tone} className="transition-shadow hover:shadow-md">
              <p className="text-muted-foreground">{a.text}</p>
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                {(a.links ?? [{ label: `Open ${a.short}`, href: a.href }]).map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={`${linkText} text-sm`}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Panel>
          );
        })}
      </div>
    </section>
  );
}
