import type { Department } from "@/lib/types";

/** Key facts about a department. */
export default function DepartmentOverview({ department: d }: { department: Department }) {
  const facts: [string, string][] = [
    ["Department", d.name],
    ["Focus", d.description ?? "To be added"],
    ["Programme", d.programmes === "BE" ? "Bachelor of Engineering (BE), four years" : d.programmes ?? "To be added"],
    ["Research centre", d.has_research_centre ? "Yes, doctoral research" : "No"],
  ];
  return (
    <dl className="grid gap-x-8 sm:grid-cols-2">
      {facts.map(([term, value]) => (
        <div key={term} className="border-b border-border py-3.5">
          <dt className="text-sm text-muted-foreground">{term}</dt>
          <dd className="mt-0.5 font-semibold text-heading">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
