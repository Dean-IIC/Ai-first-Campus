import { Briefcase, Building2, FlaskConical, Globe, GraduationCap, Landmark, Rocket, type LucideIcon } from "lucide-react";
import { Chip } from "@/components/features/content/bits";
import { Card } from "@/components/ui/card";
import { linesOf, splitHeading } from "@/lib/department-sections";
import type { Department } from "@/lib/types";

/** Icon for a scope card, chosen from words in its heading. */
const ICONS: [RegExp, LucideIcon][] = [
  [/corporate|industry/i, Building2],
  [/government|public/i, Landmark],
  [/higher|studies|exam/i, GraduationCap],
  [/entrepreneur|startup/i, Rocket],
  [/research|innovation/i, FlaskConical],
  [/global|international|certif/i, Globe],
];
const iconFor = (heading: string) => ICONS.find(([re]) => re.test(heading))?.[1] ?? Briefcase;

/** Scope of employment as cards, then the job roles graduates go on to. */
export default function DepartmentCareers({ department: d }: { department: Department }) {
  const scope = linesOf(d.employment_scope).map(splitHeading);
  const roles = linesOf(d.career_roles);
  return (
    <div className="space-y-8">
      {scope.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-heading">Scope of employment</h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {scope.map(({ heading, text }) => {
              const Icon = iconFor(heading ?? text);
              return (
                <li key={`${heading}-${text}`}>
                  <Card className="h-full p-5">
                    <span className="grid size-10 place-items-center rounded-lg bg-gradient-to-br from-t-green to-t-teal text-white">
                      <Icon aria-hidden="true" className="size-5" />
                    </span>
                    {heading && <h3 className="mt-3 font-semibold text-heading">{heading}</h3>}
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
                  </Card>
                </li>
              );
            })}
          </ul>
        </section>
      )}
      {roles.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-heading">Career roles</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {roles.map((r) => (
              <li key={r}>
                <Chip tone="teal">{r}</Chip>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

/** True when the department has careers content to show. */
export const hasCareers = (d: Department) => linesOf(d.employment_scope).length + linesOf(d.career_roles).length > 0;
