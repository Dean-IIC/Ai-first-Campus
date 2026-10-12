import Link from "next/link";
import NavLink from "@/components/features/navigation/nav-link";
import type { MenuSection } from "@/lib/menu";
import { site } from "@/lib/site";
import { shell } from "@/lib/ui";
import FooterBrand from "./footer-brand";
import { buildFooterColumns } from "./footer-columns";

const linkClass = "text-white/70 transition-colors hover:text-white hover:underline hover:underline-offset-4";

/** Site footer: brand and contact block, six link columns, and a slim bottom bar. */
export default function SiteFooter({ menu = [] }: { menu?: MenuSection[] }) {
  const columns = buildFooterColumns(menu);
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 bg-brand-dark text-white/80">
      <span aria-hidden="true" className="block h-1 bg-gradient-to-r from-gold via-gold/70 to-gold" />
      <div className={`${shell} grid gap-10 py-12 xl:grid-cols-[15rem_1fr]`}>
        <FooterBrand />
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 xl:grid-cols-6">
          {columns.map((col) => (
            <div key={col.title}>
              <h2 className="border-b border-white/10 pb-2 text-xs font-bold tracking-wide text-gold">{col.title}</h2>
              <ul className="mt-3 space-y-1.5 text-xs leading-snug">
                {col.links.map((item) => (
                  <li key={item.href + item.label}>
                    <NavLink item={item} className={linkClass}>
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="border-t border-white/10 bg-black/20">
        <div className={`${shell} flex flex-col gap-2 py-4 text-[0.6875rem] text-white/60 sm:flex-row sm:items-center sm:justify-between`}>
          <p>
            © {year} {site.name}. Established {site.established}.
          </p>
          <p className="flex flex-wrap gap-x-4 gap-y-1">
            <span>{site.affiliation}</span>
            <span>{site.approval}</span>
            <Link href="/contact" className="hover:text-white hover:underline hover:underline-offset-4">
              Contact
            </Link>
            <Link href="/initiatives" className="hover:text-white hover:underline hover:underline-offset-4">
              Centres and initiatives
            </Link>
            <Link href="/admin/login" className="text-white/40 hover:text-white/80 hover:underline hover:underline-offset-4">
              Admin
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
