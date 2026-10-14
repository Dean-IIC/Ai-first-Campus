import Link from "next/link";
import type { NavItem } from "@/lib/site";

/** A menu link: internal pages use next/link; live initiative sites open in a new tab. */
export default function NavLink({ item, className, title, children }: { item: NavItem; className?: string; title?: string; children: React.ReactNode }) {
  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className={className} title={title}>
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  return (
    <Link href={item.href} className={className} title={title}>
      {children}
    </Link>
  );
}
