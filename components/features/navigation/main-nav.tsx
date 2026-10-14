"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ExternalLink, FlaskConical } from "lucide-react";
import { sectionFor, type MenuSection } from "@/lib/menu";
import { cn } from "@/lib/utils";
import { barWidth } from "@/lib/ui";
import MegaMenu from "./mega-menu";
import NavLink from "./nav-link";

const topItem =
  "relative flex min-h-11 items-center gap-0.5 whitespace-nowrap px-2.5 text-[0.875rem] font-semibold text-white/90 outline-none transition-colors hover:bg-white/10 hover:text-white focus-visible:bg-white/15 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold xl:min-h-12 xl:px-0.5 2xl:px-1.5";

/**
 * The main menu bar. Every item is always visible: on wide screens dropdowns
 * open on hover or keyboard focus; on narrower screens items wrap and
 * dropdowns open on tap or click. Escape or a click outside closes them.
 */
export default function MainNav({ menu }: { menu: MenuSection[] }) {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => setOpenMenu(null), [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const active = sectionFor(pathname, menu)?.label;

  return (
    <nav
      ref={navRef}
      aria-label="Main"
      className="relative z-40 bg-brand-dark/95 text-white shadow-[0_6px_16px_-10px_rgba(10,42,87,0.6)] backdrop-blur-md supports-[backdrop-filter]:bg-brand-dark/90 xl:sticky xl:top-0"
    >
      <div className={cn(barWidth, "relative flex items-stretch")}>
        <ul className="flex w-full flex-wrap items-stretch justify-center xl:flex-nowrap xl:justify-between">
          {menu.map((section) => {
            const isActive = active === section.label;
            const underline = isActive && <span aria-hidden="true" className="absolute inset-x-2 bottom-0 h-[3px] rounded-t bg-gold" />;

            if (!section.columns) {
              return (
                <li key={section.label} className="flex">
                  <NavLink
                    item={{ label: section.label, href: section.href ?? "/", external: section.external }}
                    className={cn(topItem, isActive && "bg-white/10 text-white")}
                    title={section.hint}
                  >
                    {section.icon === "flask" && <FlaskConical aria-hidden="true" className="mr-1 size-[1.05em] shrink-0" />}
                    {section.label}
                    {section.external && <ExternalLink aria-hidden="true" className="ml-1 size-3 text-white/60" />}
                    {underline}
                  </NavLink>
                </li>
              );
            }

            const isOpen = openMenu === section.label;
            return (
              <li key={section.label} data-open={isOpen ? "" : undefined} className="group flex">
                <button
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={isOpen}
                  onClick={() => setOpenMenu((o) => (o === section.label ? null : section.label))}
                  className={cn(topItem, isActive && "bg-white/10 text-white", "group-data-[open]:bg-white/10")}
                >
                  {section.label}
                  <ChevronDown aria-hidden="true" className="size-3.5 opacity-60 transition-transform duration-200 group-hover:rotate-180 group-data-[open]:rotate-180" />
                  {underline}
                </button>
                <div className="invisible absolute inset-x-2 top-full z-50 translate-y-1 opacity-0 transition-all duration-150 max-xl:group-data-[open]:visible max-xl:group-data-[open]:translate-y-0 max-xl:group-data-[open]:opacity-100 sm:inset-x-4 lg:inset-x-6 xl:group-focus-within:visible xl:group-focus-within:translate-y-0 xl:group-focus-within:opacity-100 xl:group-hover:visible xl:group-hover:translate-y-0 xl:group-hover:opacity-100">
                  <MegaMenu section={section} pathname={pathname} />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
