import { cn } from "@/lib/utils";

/** Horizontal timeline on wide screens, vertical on phones. */
export default function MilestoneTimeline({ items }: { items: { when: string; title: string; text: string; highlight?: boolean }[] }) {
  return (
    <ol className="relative grid gap-6 md:grid-cols-4 md:gap-4">
      <span aria-hidden="true" className="absolute bottom-2 left-[7px] top-2 w-0.5 bg-border md:inset-x-2 md:bottom-auto md:top-[7px] md:h-0.5 md:w-auto" />
      {items.map((m) => (
        <li key={m.when} className="relative pl-8 md:pl-0 md:pt-8">
          <span
            aria-hidden="true"
            className={cn(
              "absolute left-0 top-1 size-4 rounded-full border-4 border-card md:top-0",
              m.highlight ? "bg-t-teal ring-4 ring-t-teal-tint" : "bg-primary",
            )}
          />
          <p className={cn("text-xl font-bold", m.highlight ? "text-t-teal dark:text-t-teal-light" : "text-heading")}>{m.when}</p>
          <p className="mt-1 font-semibold leading-snug text-foreground">{m.title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{m.text}</p>
        </li>
      ))}
    </ol>
  );
}
