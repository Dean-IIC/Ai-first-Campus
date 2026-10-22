"use client";

import { ArrowRight, Atom, ChevronDown, Cpu, ExternalLink, FlaskConical, HeartHandshake } from "lucide-react";
import { isDirectColumn, type MenuSection } from "@/lib/menu";
import { isActiveItem } from "@/lib/site";
import { cn } from "@/lib/utils";
import NavLink from "./nav-link";

const row =
  "relative flex min-h-12 w-full items-center gap-2 px-5 py-3 text-left text-base font-semibold text-white/95 transition-colors hover:bg-white/10 focus-visible:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold";

/**
 * One item of the mobile menu: a full-width link, or an accordion (About, Programmes, ...)
 * whose sub-links open below it. The current page's item carries the orange accent.
 */
export default function MobileMenuItem({
  section,
  pathname,
  active,
  expanded,
  onToggle,
}: {
  section: MenuSection;
  pathname: string;
  active: boolean;
  expanded: boolean;
  onToggle: () => void;
}) {
  const accent = active && <span aria-hidden="true" className="absolute inset-y-2 left-0 w-1 rounded-r bg-gold" />;
  const label = (
    <>
      {section.icon === "flask" && <FlaskConical aria-hidden="true" className="size-[1.05em] shrink-0" />}
      {section.icon === "heart" && <HeartHandshake aria-hidden="true" className="size-[1.05em] shrink-0" />}
      <span className="flex-1">{section.label}</span>
    </>
  );

  if (!section.columns) {
    return (
      <li>
        <NavLink item={{ label: section.label, href: section.href ?? "/", external: section.external }} className={cn(row, active && "bg-white/10 text-white")} title={section.hint}>
          {accent}
          {label}
          {section.external && <ExternalLink aria-hidden="true" className="size-4 text-white/60" />}
        </NavLink>
      </li>
    );
  }

  const panelId = `mobile-sub-${section.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <li>
      <button type="button" aria-expanded={expanded} aria-controls={panelId} onClick={onToggle} className={cn(row, active && "bg-white/10 text-white")}>
        {accent}
        {label}
        <ChevronDown aria-hidden="true" className={cn("size-5 text-white/70 transition-transform duration-300", expanded && "rotate-180")} />
      </button>
      <div id={panelId} hidden={!expanded} className="bg-black/15 pb-2">
        {section.columns.map((col) =>
          isDirectColumn(col) ? (
            <MobileDirectLink key={col.title} title={col.title} href={col.href!} icon={col.icon} current={col.href === pathname} />
          ) : (
            <div key={col.title} className="px-5 pt-3">
              <MobileColumnHeading title={col.title} href={col.href} icon={col.icon} />
              <ul className="mt-1">
                {col.links.map((item) => {
                  const current = isActiveItem(item, pathname);
                  return (
                    <li key={item.href + item.label}>
                      <NavLink
                        item={item}
                        className={cn(
                          "flex min-h-11 items-center gap-2 border-l-2 py-2 pl-3 text-[0.9375rem] leading-snug transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold",
                          current ? "border-gold font-semibold text-gold" : "border-white/15 text-white/85",
                        )}
                      >
                        <span className="flex-1">
                          {item.label}
                          {item.note && <span className="block text-xs font-normal text-white/55">{item.note}</span>}
                        </span>
                        {item.external && <ExternalLink aria-hidden="true" className="size-3.5 shrink-0 text-white/55" />}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ),
        )}
        {section.footerLink && (
          <NavLink
            item={{ label: section.footerLink.label, href: section.footerLink.href }}
            className="mx-5 mt-3 flex min-h-11 items-center gap-2 border-t border-white/15 pt-2 text-[0.9375rem] font-semibold text-gold/90 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold"
          >
            {section.footerLink.label}
            <ArrowRight aria-hidden="true" className="size-4" />
          </NavLink>
        )}
      </div>
    </li>
  );
}

/** A column shown as one direct link (its heading), with its icon, at the same size as other sub-links. */
function MobileDirectLink({ title, href, icon, current }: { title: string; href: string; icon?: "cpu" | "atom"; current: boolean }) {
  const Icon = icon === "cpu" ? Cpu : icon === "atom" ? Atom : null;
  return (
    <div className="px-5 pt-2">
      <NavLink
        item={{ label: title, href }}
        className={cn(
          "flex min-h-11 items-center gap-2.5 border-l-2 py-2 pl-3 text-[0.9375rem] leading-snug transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold",
          current ? "border-gold font-semibold text-gold" : "border-white/15 text-white/85",
        )}
      >
        {Icon && <Icon aria-hidden="true" className="size-4 shrink-0" />}
        {title}
      </NavLink>
    </div>
  );
}

/** A column heading in the mobile menu: a link with its icon when the column has its own page. */
function MobileColumnHeading({ title, href, icon }: { title: string; href?: string; icon?: "cpu" | "atom" }) {
  const Icon = icon === "cpu" ? Cpu : icon === "atom" ? Atom : null;
  const inner = (
    <>
      {Icon && <Icon aria-hidden="true" className="size-4 shrink-0" />}
      {title}
    </>
  );
  const base = "flex items-center gap-1.5 text-xs font-bold tracking-wide text-gold/90";
  if (!href) return <p className={base}>{inner}</p>;
  return (
    <NavLink item={{ label: title, href }} className={cn(base, "min-h-8 rounded-sm hover:text-gold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold")}>
      {inner}
    </NavLink>
  );
}
