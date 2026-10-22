"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import AnniversaryBadge from "@/components/features/layout/anniversary-badge";
import Logo from "@/components/features/layout/logo";
import ThemeToggle from "@/components/features/layout/theme-toggle";
import type { MenuSection } from "@/lib/menu";
import MobileMenuPanel from "./mobile-menu-panel";

/**
 * The header on screens narrower than 1024px: one compact sticky row with the crest, the
 * college name, the dark-mode toggle and the ☰ button that opens the slide-in menu panel.
 * Wider screens use the full menu bar (MainNav) and the logo row instead.
 */
export default function MobileHeader({ menu, name }: { menu: MenuSection[]; name: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header data-mobile-header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-md supports-[backdrop-filter]:bg-card/85 lg:hidden">
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 sm:gap-2 sm:px-4">
        <Link href="/" aria-label={`${name}, home`} className="flex min-w-0 flex-1 items-center gap-2 rounded-md">
          <Logo size="xs" />
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-[0.875rem] font-bold tracking-tight text-heading min-[400px]:text-[0.9375rem] sm:text-base">{name}</span>
            <span className="hidden truncate text-xs text-muted-foreground min-[400px]:block">Nagawara, Bengaluru</span>
          </span>
        </Link>
        <span className="hidden min-[440px]:block">
          <AnniversaryBadge link small className="h-10" />
        </span>
        <ThemeToggle className="size-11" />
        <button
          ref={trigger}
          type="button"
          onClick={() => setOpen(true)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-dark text-white transition-colors hover:bg-brand-dark/85 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
        >
          <Menu aria-hidden="true" className="size-6" />
        </button>
      </div>
      <MobileMenuPanel menu={menu} open={open} onOpenChange={setOpen} pathname={pathname} returnFocus={trigger} />
    </header>
  );
}
