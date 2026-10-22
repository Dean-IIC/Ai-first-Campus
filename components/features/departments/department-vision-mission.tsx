import { Eye, Target } from "lucide-react";
import { LABEL, splitHeading, splitLabel } from "@/lib/department-sections";
import type { Department } from "@/lib/types";
import StatementTile from "./statement-tile";

const statement = "font-serif text-[1.1875rem] leading-relaxed text-foreground";

/**
 * One statement, or several as a numbered list. When every point starts with its own label
 * ("M1: …", "PEO1: …"), the badge shows that label instead of a number. With `headings`,
 * a "Heading: text" point shows its heading in bold ("PO1: Engineering knowledge: …").
 */
export function Statements({ points, headings = false }: { points: string[]; headings?: boolean }) {
  if (points.length === 1 && !LABEL.test(points[0])) return <p className={statement}>{points[0]}</p>;
  const labelled = points.every((p) => LABEL.test(p));
  return (
    <ol className="space-y-3">
      {points.map((p, i) => {
        const { label, text } = labelled ? splitLabel(p) : { label: null, text: p };
        const { heading, text: body } = headings ? splitHeading(text) : { heading: null, text };
        return (
          <li key={p} className="flex gap-3 text-[1.0625rem] leading-relaxed text-foreground">
            <span className="mt-0.5 grid h-6 min-w-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-t-teal to-t-blue px-1.5 text-xs font-bold text-white">
              {label ?? i + 1}
            </span>
            <span>
              {heading && <strong className="font-semibold text-heading">{heading}: </strong>}
              {body}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/** A department's vision and mission as two highlighted tiles; several points (one per line) show as a numbered list. */
export default function DepartmentVisionMission({ department: d }: { department: Department }) {
  const vision = (d.vision ?? "").split("\n").map((s) => s.trim()).filter(Boolean);
  if (vision.length === 0 && d.mission.length === 0) {
    return <p className="text-muted-foreground">The department&apos;s vision and mission will be published here.</p>;
  }
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {vision.length > 0 && (
        <StatementTile title="Vision" icon={Eye} tone="green">
          <Statements points={vision} />
        </StatementTile>
      )}
      {d.mission.length > 0 && (
        <StatementTile title="Mission" icon={Target} tone="teal">
          <Statements points={d.mission} />
        </StatementTile>
      )}
    </div>
  );
}
