import { linesOf, programmeFacts } from "@/lib/department-sections";
import type { Department } from "@/lib/types";
import DepartmentHistory from "./department-history";

/**
 * Key facts about a department, then the programme's history when it has one. A department
 * with a history shows when it was established, its current intake and its approvals instead of its focus.
 */
export default function DepartmentOverview({ department: d }: { department: Department }) {
  const { established, intake } = programmeFacts(d.history);
  const approvals = linesOf(d.approvals);
  const facts: [string, string][] = [
    ["Department", d.name],
    ...(established ? [] : [["Focus", d.description ?? "To be added"] as [string, string]]),
    ["Programme", d.programmes === "BE" ? "Bachelor of Engineering (BE), four years" : d.programmes ?? "To be added"],
    ...(established ? [["Established", established] as [string, string]] : []),
    ...(intake ? [["Annual intake", `${intake} seats`] as [string, string]] : []),
    ...(approvals.length ? [["Approvals", approvals.join(" · ")] as [string, string]] : []),
    ...(d.show_research_tile !== false ? [["Research centre", d.has_research_centre ? "Yes, doctoral research" : "No"] as [string, string]] : []),
  ];
  return (
    <>
      <dl className="grid gap-x-8 sm:grid-cols-2">
        {facts.map(([term, value]) => (
          <div key={term} className="border-b border-border py-3.5">
            <dt className="text-sm text-muted-foreground">{term}</dt>
            <dd className="mt-0.5 font-semibold text-heading">{value}</dd>
          </div>
        ))}
      </dl>
      <DepartmentHistory department={d} />
    </>
  );
}
