import { Eye, Target } from "lucide-react";
import type { Department } from "@/lib/types";
import StatementTile from "./statement-tile";

const statement = "font-serif text-[1.1875rem] leading-relaxed text-foreground";

/** A department's vision and mission as two highlighted tiles; several mission points show as a numbered list. */
export default function DepartmentVisionMission({ department: d }: { department: Department }) {
  if (!d.vision && d.mission.length === 0) {
    return <p className="text-muted-foreground">The department&apos;s vision and mission will be published here.</p>;
  }
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {d.vision && (
        <StatementTile title="Vision" icon={Eye} tone="green">
          <p className={statement}>{d.vision}</p>
        </StatementTile>
      )}
      {d.mission.length > 0 && (
        <StatementTile title="Mission" icon={Target} tone="teal">
          {d.mission.length === 1 ? (
            <p className={statement}>{d.mission[0]}</p>
          ) : (
            <ol className="space-y-3">
              {d.mission.map((m, i) => (
                <li key={m} className="flex gap-3 text-[1.0625rem] leading-relaxed text-foreground">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-t-teal to-t-blue text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <span>{m}</span>
                </li>
              ))}
            </ol>
          )}
        </StatementTile>
      )}
    </div>
  );
}
