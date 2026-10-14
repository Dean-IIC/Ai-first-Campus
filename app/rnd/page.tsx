import Link from "next/link";
import { ArrowRight, FlaskConical } from "lucide-react";
import ContentPage, { pageMetadata } from "@/components/features/layout/content-page";
import Panel from "@/components/features/content/panel";
import { linkText } from "@/lib/ui";

export const revalidate = 300;
export const generateMetadata = () => pageMetadata("rnd", "Research & Development");

const LINKS = [
  { label: "Research centres", href: "/research/centres" },
  { label: "Research projects", href: "/research#projects" },
];

/** Research & Development: a holding page until the R&D portal link is set, with links to the research pages. */
export default function RndPage() {
  return (
    <ContentPage slug="rnd" fallbackTitle="Research & Development" current="/rnd">
      <Panel title="Research at HKBK" icon={FlaskConical} tone="amber">
        <ul className="space-y-2">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={`${linkText} inline-flex items-center gap-1.5`}>
                {l.label}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </li>
          ))}
        </ul>
      </Panel>
    </ContentPage>
  );
}
