import { Building2, GraduationCap, Microscope, type LucideIcon } from "lucide-react";
import type { Department } from "@/lib/types";
import { cn } from "@/lib/utils";

type Fact = { icon: LucideIcon; label: string; value: string; gradient: string };

/** Three small information tiles above the department tabs. */
export default function DepartmentFacts({ department: d }: { department: Department }) {
  const facts: Fact[] = [
    ...(d.programmes === "BE"
      ? [{ icon: GraduationCap, label: "Programme", value: "BE, four years", gradient: "from-t-green to-t-teal" }]
      : []),
    { icon: Building2, label: "Department", value: d.short_name ? `${d.short_name} · ${d.kind}` : d.kind, gradient: "from-t-blue to-t-teal" },
    {
      icon: Microscope,
      label: "Research centre",
      value: d.has_research_centre ? "Doctoral research centre" : "Teaching department",
      gradient: d.has_research_centre ? "from-t-amber to-t-rose" : "from-t-violet to-t-blue",
    },
  ];
  return (
    <ul className="grid gap-3 sm:grid-cols-3">
      {facts.map(({ icon: Icon, label, value, gradient }) => (
        <li
          key={label}
          className="flex items-center gap-3.5 rounded-xl border border-border bg-card p-4 shadow-[0_12px_30px_-26px_rgba(10,42,87,0.5)] transition-shadow hover:shadow-[0_16px_34px_-24px_rgba(10,42,87,0.55)]"
        >
          <span className={cn("grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-white", gradient)}>
            <Icon aria-hidden="true" className="size-5" />
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block text-xs font-medium text-muted-foreground">{label}</span>
            <span className="mt-0.5 block font-semibold text-heading">{value}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
