import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import MainNav from "@/components/features/navigation/main-nav";
import MobileHeader from "@/components/features/navigation/mobile-header";
import type { MenuSection } from "@/lib/menu";
import { site } from "@/lib/site";
import { getSiteDetails } from "@/lib/site-details";
import { cn } from "@/lib/utils";
import { barWidth } from "@/lib/ui";
import AnniversaryBadge from "./anniversary-badge";
import Logo from "./logo";
import ThemeToggle from "./theme-toggle";

/** Main menu bar at the very top, then the logo row with contact details and the theme toggle. */
export default async function SiteHeader({ menu }: { menu: MenuSection[] }) {
  const details = await getSiteDetails();
  return (
    <>
      <MainNav menu={menu} />
      <MobileHeader menu={menu} name={site.name} />
      <header className="hidden border-b border-border bg-card lg:block">
        <div className={cn(barWidth, "flex items-center justify-between gap-6 py-3")}>
          <Link href="/" className="flex items-center gap-4 rounded-md" aria-label={`${site.name}, home`}>
            <Logo size="lg" />
            <span className="leading-tight">
              <span className="block text-lg font-bold text-heading sm:text-[1.5rem]">{site.name}</span>
              <span className="block text-[0.8125rem] text-muted-foreground sm:text-sm">Nagawara, Bengaluru. An AI First and Quantum Ready campus.</span>
            </span>
          </Link>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <AnniversaryBadge link className="h-16" />
            <p className="hidden leading-tight lg:block">
              <span className="block font-semibold text-heading">{site.affiliation}</span>
              <span className="block">{site.approval}</span>
              {details.phone && (
                <a href={`tel:${details.phone.replace(/\s+/g, "")}`} className="mt-1 flex items-center gap-1.5 hover:text-primary">
                  <Phone aria-hidden="true" className="size-3.5" />
                  {details.phone}
                </a>
              )}
              {details.email && (
                <a href={`mailto:${details.email}`} className="mt-1 flex items-center gap-1.5 hover:text-primary">
                  <Mail aria-hidden="true" className="size-3.5" />
                  {details.email}
                </a>
              )}
            </p>
            <ThemeToggle />
          </div>
        </div>
      </header>
    </>
  );
}
