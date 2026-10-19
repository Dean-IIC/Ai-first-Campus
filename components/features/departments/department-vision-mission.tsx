import { Eye, Target } from "lucide-react";
import type { Department } from "@/lib/types";
import StatementTile from "./statement-tile";

const statement = "font-serif text-[1.1875rem] leading-relaxed text-foreground";
const LABEL = /^(M\d{1,2}):\s*/;

/**
 * One statement, or several as a numbered list. When every point starts with its own label
 * ("M1: …", "M2: …"), the badge shows that label instead of a number.
 */
function Statements({ points }: { points: string[] }) {
  if (points.length === 1) return <p className={statement}>{points[0]}</p>;
  const labelled = points.every((p) => LABEL.test(p));
  return (
    <ol className="space-y-3">
      {points.map((p, i) => {
        const label = labelled ? (p.match(LABEL)?.[1] ?? String(i + 1)) : String(i + 1);
        return (
          <li key={p} className="flex gap-3 text-[1.0625rem] leading-relaxed text-foreground">
            <span className="mt-0.5 grid h-6 min-w-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-t-teal to-t-blue px-1 text-xs font-bold text-white">
              {label}
            </span>
            <span>{labelled ? p.replace(LABEL, "") : p}</span>
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
