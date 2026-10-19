import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Area } from "@/lib/areas";
import { cn } from "@/lib/utils";
import { TONE } from "@/lib/ui";

/**
 * Clickable cards that lead to related pages, side by side on wider screens and stacked on
 * phones. Each card shows the area's icon, a title and its short description.
 */
export default function LinkCards({ items, label }: { items: { area: Area; title: string }[]; label: string }) {
  return (
    <nav aria-label={label}>
      <ul className="grid gap-4 sm:grid-cols-2">
        {items.map(({ area, title }) => {
          const t = TONE[area.tone];
          const Icon = area.icon;
          return (
            <li key={area.href}>
              <Link href={area.href} className="group block h-full rounded-xl focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring">
                <Card className={cn("flex h-full flex-row items-center gap-4 border-t-[3px] p-5 transition-shadow group-hover:shadow-md", t.borderTop)}>
                  <span className={cn("grid size-11 shrink-0 place-items-center rounded-lg", t.tint, t.text)}>
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-heading">{title}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">{area.text}</span>
                  </span>
                  <ArrowRight aria-hidden="true" className={cn("size-5 shrink-0 transition-transform group-hover:translate-x-0.5", t.text)} />
                </Card>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
