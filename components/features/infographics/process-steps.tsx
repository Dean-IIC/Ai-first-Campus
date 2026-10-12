import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { TONE, type Tone } from "@/lib/ui";

/** Numbered steps; in a row with arrows on wide screens, or a 2-column grid. */
export default function ProcessSteps({
  steps,
  tone = "teal",
  layout = "row",
}: {
  steps: { title: string; text: string; icon: LucideIcon }[];
  tone?: Tone;
  layout?: "row" | "grid";
}) {
  const t = TONE[tone];
  const row = layout === "row";
  return (
    <ol className={cn("grid gap-4", row ? "md:grid-cols-2 xl:grid-cols-4" : "sm:grid-cols-2")}>
      {steps.map(({ title, text, icon: Icon }, i) => (
        <li key={title} className="relative rounded-xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className={cn("grid size-11 place-items-center rounded-lg", t.tint, t.text)}>
              <Icon aria-hidden="true" className="size-6" />
            </span>
            <span className={cn("text-sm font-bold", t.text)}>Step {i + 1}</span>
          </div>
          <p className="mt-4 font-semibold text-heading">{title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{text}</p>
          {row && i < steps.length - 1 && (
            <span aria-hidden="true" className={cn("absolute -right-3 top-1/2 z-10 hidden size-6 -translate-y-1/2 place-items-center rounded-full text-xs text-white xl:grid", t.bg)}>
              ›
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}
