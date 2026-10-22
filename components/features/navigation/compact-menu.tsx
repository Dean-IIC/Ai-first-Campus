import Link from "next/link";
import { ArrowRight, Atom, Cpu } from "lucide-react";
import type { MenuSection } from "@/lib/menu";
import { cn } from "@/lib/utils";
import { TONE } from "@/lib/ui";

const ICON = { cpu: Cpu, atom: Atom };

/**
 * A short dropdown for a menu item whose columns are all direct links (for example AI & Quantum
 * Campus): one row per link with its icon, then the optional bottom link. Sized to its content.
 */
export default function CompactMenu({ section, pathname }: { section: MenuSection; pathname: string }) {
  const t = TONE[section.tone];
  return (
    <div className={cn("w-72 rounded-b-xl border border-t-[3px] border-border bg-popover/95 p-2 text-popover-foreground shadow-[0_24px_48px_-20px_rgba(10,42,87,0.45)] backdrop-blur-xl", t.borderTop)}>
      <ul>
        {(section.columns ?? []).map((col) => {
          const Icon = col.icon ? ICON[col.icon] : null;
          const current = col.href === pathname;
          return (
            <li key={col.title}>
              <Link
                href={col.href!}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-md px-2 py-2 text-[0.9375rem] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  t.hoverTint,
                  current ? "text-primary" : "text-foreground",
                )}
              >
                {Icon && (
                  <span className={cn("grid size-8 shrink-0 place-items-center rounded-md", t.tint, t.text)}>
                    <Icon aria-hidden="true" className="size-4" />
                  </span>
                )}
                {col.title}
              </Link>
            </li>
          );
        })}
      </ul>
      {section.footerLink && (
        <Link
          href={section.footerLink.href}
          className={cn("mx-2 mt-1 flex items-center gap-1.5 border-t border-border pb-1 pt-2.5 text-sm font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", t.text)}
        >
          {section.footerLink.label}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      )}
    </div>
  );
}
