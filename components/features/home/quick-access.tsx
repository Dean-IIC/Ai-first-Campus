import Link from "next/link";
import Panel from "@/components/features/content/panel";
import { AREAS } from "@/lib/areas";
import { cn } from "@/lib/utils";
import { TONE, shell } from "@/lib/ui";

const QUICK = ["departments", "programmes", "researchCentres", "research", "aiChampions", "quantumLab", "training", "dashboards"];

/** Colour-coded shortcut tiles to the most-used pages. */
export default function QuickAccess() {
  return (
    <section className={`${shell} pt-12`}>
      <Panel title="Quick access" tone="blue" bodyClassName="p-3 sm:p-4">
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
          {QUICK.map((k) => {
            const a = AREAS[k];
            if (!a) return null;
            const t = TONE[a.tone];
            return (
              <li key={k}>
                <Link
                  href={a.href}
                  className={cn(
                    "group flex h-full flex-col items-center gap-2.5 rounded-lg border border-transparent p-3 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:shadow-[0_12px_24px_-14px_rgba(10,42,87,0.45)]",
                    t.hoverTint,
                  )}
                >
                  <span className={cn("grid size-12 place-items-center rounded-xl text-white shadow-sm transition-shadow group-hover:shadow-md", t.bg)}>
                    <a.icon aria-hidden="true" className="size-6" />
                  </span>
                  <span className="text-sm font-semibold leading-tight text-heading">{a.short}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Panel>
    </section>
  );
}
