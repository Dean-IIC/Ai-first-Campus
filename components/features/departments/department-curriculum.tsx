import { BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { linesOf, parseSemester } from "@/lib/department-sections";
import type { Department } from "@/lib/types";

/** The curriculum as one card per semester: its scheme and its subjects. */
export default function DepartmentCurriculum({ department: d }: { department: Department }) {
  const semesters = linesOf(d.curriculum).map(parseSemester);
  return (
    <div>
      <p className="text-muted-foreground">Subjects in each semester, as set by the VTU scheme shown on the card.</p>
      <ol className="mt-5 grid gap-4 md:grid-cols-2">
        {semesters.map((s) => (
          <li key={`${s.title}-${s.scheme}`}>
            <Card className="h-full">
              <div className="flex items-center justify-between gap-3 border-b border-border bg-t-teal-tint px-5 py-3">
                <h2 className="flex items-center gap-2 font-semibold text-heading">
                  <BookOpen aria-hidden="true" className="size-4 text-t-teal dark:text-t-teal-light" />
                  {s.title}
                </h2>
                {s.scheme && <span className="text-xs font-medium text-muted-foreground">{s.scheme}</span>}
              </div>
              <ul className="list-disc space-y-1 py-4 pl-10 pr-5 text-sm leading-relaxed text-foreground marker:text-t-teal">
                {s.subjects.map((subject) => (
                  <li key={subject}>{subject}</li>
                ))}
              </ul>
            </Card>
          </li>
        ))}
      </ol>
    </div>
  );
}
