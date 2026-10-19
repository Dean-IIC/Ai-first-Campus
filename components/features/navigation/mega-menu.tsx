/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowRight, Atom, Cpu, ExternalLink } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import type { MenuColumn, MenuSection } from "@/lib/menu";
import { iconByKey } from "@/lib/portals";
import { isActiveItem } from "@/lib/site";
import { cn } from "@/lib/utils";
import { TONE } from "@/lib/ui";
import NavLink from "./nav-link";

const COLUMN_ICON = { cpu: Cpu, atom: Atom };

/** A column heading: plain text, or a link (with its icon) when the column has its own page. */
function ColumnHeading({ col, text }: { col: MenuColumn; text: string }) {
  const Icon = col.icon ? COLUMN_ICON[col.icon] : null;
  const inner = (
    <>
      {Icon && <Icon aria-hidden="true" className="size-4 shrink-0" />}
      {col.title}
    </>
  );
  const base = cn("flex items-center gap-1.5 border-b border-border pb-2 text-xs font-bold tracking-wide", text);
  if (!col.href) return <p className={base}>{inner}</p>;
  return (
    <Link href={col.href} className={cn(base, "rounded-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring")}>
      {inner}
    </Link>
  );
}

/** The dropdown for one menu item: link columns, an optional bottom link and an optional feature card. */
export default function MegaMenu({ section, pathname }: { section: MenuSection; pathname: string }) {
  const t = TONE[section.tone];
  const columns = section.columns ?? [];
  const cols = columns.length;
  return (
    <div
      className={cn(
        "grid max-h-[75vh] overflow-y-auto rounded-b-xl border border-t-[3px] border-border bg-popover/95 text-popover-foreground shadow-[0_24px_48px_-20px_rgba(10,42,87,0.45)] backdrop-blur-xl xl:max-h-none xl:overflow-hidden",
        section.feature && "lg:grid-cols-[1fr_19rem]",
        t.borderTop,
      )}
    >
      <div className={cn("grid gap-x-8 gap-y-6 p-5 sm:p-7", cols >= 3 ? "sm:grid-cols-2 lg:grid-cols-3" : cols === 2 ? "sm:grid-cols-2" : "grid-cols-1")}>
        {columns.map((col, ci) => (
          <div key={ci}>
            <ColumnHeading col={col} text={t.text} />
            <ul className={cn("mt-2", cols === 1 && col.links.length > 5 ? "grid gap-x-8 sm:grid-cols-2" : "space-y-0.5")}>
              {col.links.map((item) => {
                const Icon = item.icon ? iconByKey(item.icon) : null;
                const it = item.iconTone ? TONE[item.iconTone] : null;
                return (
                  <li key={item.href + item.label}>
                    <NavLink
                      item={item}
                      className={cn(
                        "-mx-2 flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[0.9375rem] text-foreground transition-colors",
                        t.hoverTint,
                        isActiveItem(item, pathname) && "font-semibold text-primary",
                      )}
                    >
                      {Icon && it && (
                        <span className={cn("grid size-7 shrink-0 place-items-center rounded-md", it.tint, it.text)}>
                          <Icon aria-hidden="true" className="size-4" />
                        </span>
                      )}
                      <span className="min-w-0 flex-1 leading-snug">
                        <span className="block">{item.label}</span>
                        {item.note && <span className="block text-xs text-muted-foreground">{item.note}</span>}
                      </span>
                      {item.external && <ExternalLink aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground" />}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        {section.footerLink && (
          <Link
            href={section.footerLink.href}
            className={cn("inline-flex items-center gap-1.5 justify-self-start rounded-sm border-t border-border pt-3 text-sm font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:col-span-full", t.text)}
          >
            {section.footerLink.label}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        )}
      </div>
      {section.feature && (
        <aside className={cn("hidden flex-col lg:flex", t.tint)}>
          {section.feature.image && <img src={section.feature.image} alt="" aria-hidden="true" className="aspect-[16/9] w-full object-cover" />}
          <div className="flex flex-1 flex-col p-6">
            <p className="font-bold text-heading">{section.feature.title}</p>
            <p className="mt-2 flex-1 text-sm text-foreground">{section.feature.text}</p>
            <Link href={section.feature.href} className={cn(buttonVariants({ size: "sm" }), "mt-4 self-start")}>
              {section.feature.cta}
            </Link>
          </div>
        </aside>
      )}
    </div>
  );
}
