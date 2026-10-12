import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const STYLES = {
  green: {
    surface: "from-t-green-tint via-card to-card",
    icon: "from-t-green to-t-teal shadow-[0_12px_28px_-12px_rgba(30,122,76,0.9)]",
    label: "text-t-green dark:text-t-green-light",
    quote: "text-t-green/10 dark:text-t-green-light/10",
    bar: "from-t-green to-t-teal",
  },
  teal: {
    surface: "from-t-teal-tint via-card to-card",
    icon: "from-t-teal to-t-blue shadow-[0_12px_28px_-12px_rgba(11,116,128,0.9)]",
    label: "text-t-teal dark:text-t-teal-light",
    quote: "text-t-teal/10 dark:text-t-teal-light/10",
    bar: "from-t-teal to-t-blue",
  },
} as const;

/** A highlighted statement card (department vision or mission). */
export default function StatementTile({
  title,
  icon: Icon,
  tone,
  children,
}: {
  title: string;
  icon: LucideIcon;
  tone: keyof typeof STYLES;
  children: React.ReactNode;
}) {
  const s = STYLES[tone];
  return (
    <section
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br p-6 shadow-[0_18px_40px_-30px_rgba(10,42,87,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_48px_-28px_rgba(10,42,87,0.55)] sm:p-7",
        s.surface,
      )}
    >
      <span aria-hidden="true" className={cn("pointer-events-none absolute -right-2 -top-8 select-none font-serif text-[9rem] leading-none", s.quote)}>
        &ldquo;
      </span>
      <div className="relative flex items-center gap-4">
        <span className={cn("grid size-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-white ring-4 ring-card", s.icon)}>
          <Icon aria-hidden="true" className="size-6" />
        </span>
        <h2 className={cn("text-xl font-bold tracking-tight", s.label)}>{title}</h2>
      </div>
      <div className="relative mt-5">{children}</div>
      <span aria-hidden="true" className={cn("absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r", s.bar)} />
    </section>
  );
}
