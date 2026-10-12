import Link from "next/link";
import { Microscope } from "lucide-react";
import { Chip } from "@/components/features/content/bits";
import type { Department } from "@/lib/types";
import { linkText } from "@/lib/ui";

/** The department's research centre and its research areas. */
export default function DepartmentResearch({ department: d }: { department: Department }) {
  return (
    <div className="flex gap-4">
      <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-t-amber-tint text-t-amber dark:text-t-amber-light">
        <Microscope aria-hidden="true" className="size-5" />
      </span>
      <div>
        <h2 className="text-lg font-semibold text-heading">Research Centre in {d.name}</h2>
        {d.research_areas.length > 0 && (
          <>
            <p className="mt-2 text-muted-foreground">Research areas</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {d.research_areas.map((a) => (
                <li key={a}>
                  <Chip tone="amber">{a}</Chip>
                </li>
              ))}
            </ul>
          </>
        )}
        <Link href="/research/centres" className={`${linkText} mt-4 inline-block text-sm`}>
          All research centres
        </Link>
      </div>
    </div>
  );
}
