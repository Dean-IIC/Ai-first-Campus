import { Compass, Crosshair, ListChecks, type LucideIcon } from "lucide-react";
import { linesOf } from "@/lib/department-sections";
import type { Department } from "@/lib/types";
import { Statements } from "./department-vision-mission";

type Block = { title: string; icon: LucideIcon; points: string[]; headings: boolean };

/** Programme educational objectives, programme specific outcomes and programme outcomes. */
export default function DepartmentOutcomes({ department: d }: { department: Department }) {
  const blocks: Block[] = [
    { title: "Programme educational objectives (PEOs)", icon: Compass, points: linesOf(d.peos), headings: false },
    { title: "Programme specific outcomes (PSOs)", icon: Crosshair, points: linesOf(d.psos), headings: true },
    { title: "Programme outcomes (POs)", icon: ListChecks, points: linesOf(d.pos), headings: true },
  ].filter((b) => b.points.length > 0);
  return (
    <div className="space-y-8">
      {blocks.map(({ title, icon: Icon, points, headings }) => (
        <section key={title}>
          <h2 className="mb-4 flex items-center gap-2.5 text-lg font-semibold text-heading">
            <Icon aria-hidden="true" className="size-5 text-t-teal dark:text-t-teal-light" />
            {title}
          </h2>
          <Statements points={points} headings={headings} />
        </section>
      ))}
    </div>
  );
}

/** True when the department has any outcomes to show. */
export const hasOutcomes = (d: Department) => linesOf(d.peos).length + linesOf(d.psos).length + linesOf(d.pos).length > 0;
