import Link from "next/link";
import Panel from "@/components/features/content/panel";
import { AREAS } from "@/lib/areas";
import type { Department } from "@/lib/types";
import { linkText, shell } from "@/lib/ui";

/** Grid of all departments, each linking to its page. */
export default function DepartmentsPanel({ departments }: { departments: Department[] }) {
  if (departments.length === 0) return null;
  return (
    <section className={`${shell} pt-14`}>
      <Panel
        title="Departments"
        icon={AREAS.departments.icon}
        tone="green"
        action={
          <Link href="/academics" className={`${linkText} text-sm`}>
            View all departments
          </Link>
        }
        bodyClassName="p-0"
      >
        <ul className="-mb-px -mr-px grid sm:grid-cols-2 lg:grid-cols-5">
          {departments.map((d) => (
            <li key={d.slug} className="border-b border-r border-border">
              <Link href={`/academics/${d.slug}`} className="block h-full p-5 transition-colors hover:bg-t-green-tint">
                <p className="text-sm font-semibold text-t-green dark:text-t-green-light">{d.short_name}</p>
                <p className="mt-1 font-semibold leading-snug text-heading">{d.name}</p>
                {d.has_research_centre && <p className="mt-1 text-xs font-medium text-t-amber dark:text-t-amber-light">Research centre</p>}
              </Link>
            </li>
          ))}
        </ul>
      </Panel>
    </section>
  );
}
