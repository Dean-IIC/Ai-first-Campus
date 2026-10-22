import { History } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { linesOf, splitHeading } from "@/lib/department-sections";
import type { Department } from "@/lib/types";
import IntakeChart, { type IntakePoint } from "./intake-chart";

/** The last whole number in a milestone ("Intake increased from 60 to 120" → 120). */
const intakeOf = (text: string): number | null => {
  const n = text.match(/(\d+)(?!.*\d)/)?.[1];
  return n ? Number(n) : null;
};

/**
 * The programme's year-by-year history. When every year states an intake, it is drawn as a bar
 * chart, with the table kept for screen readers; otherwise the table is shown.
 */
export default function DepartmentHistory({ department: d }: { department: Department }) {
  const history = linesOf(d.history).map(splitHeading);
  if (history.length === 0) return null;
  const points: IntakePoint[] = history.map(({ heading, text }) => ({ year: heading ?? "", intake: intakeOf(text) ?? -1, milestone: text }));
  const chart = history.length >= 2 && points.every((p) => p.year && p.intake >= 0);

  return (
    <section className="mt-8" aria-labelledby="history-heading">
      <h2 id="history-heading" className="flex items-center gap-2.5 text-lg font-semibold text-heading">
        <History aria-hidden="true" className="size-5 text-t-green dark:text-t-green-light" />
        History of the programme
      </h2>
      {chart && <IntakeChart points={points} />}
      <div className={chart ? "sr-only" : "mt-4 overflow-hidden rounded-xl border border-border bg-card"}>
        <Table>
          <TableHeader className="bg-t-green-tint">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-28 sm:w-36">Academic year</TableHead>
              <TableHead>Milestone</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map(({ heading, text }) => (
              <TableRow key={`${heading}-${text}`}>
                <TableCell className="whitespace-nowrap font-semibold text-heading">{heading ?? ""}</TableCell>
                <TableCell className="text-foreground">{text}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
