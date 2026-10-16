import Link from "next/link";
import { ArrowRight, ExternalLink, FlaskConical } from "lucide-react";
import ContentPage, { pageMetadata } from "@/components/features/layout/content-page";
import Panel from "@/components/features/content/panel";
import { buttonVariants } from "@/components/ui/button";
import { isOffSite } from "@/lib/menu";
import { getSiteLinks } from "@/lib/site-details";
import { linkText } from "@/lib/ui";

export const revalidate = 300;
export const generateMetadata = () => pageMetadata("rnd", "Research & Development");

const LINKS = [
  { label: "Research centres", href: "/research/centres" },
  { label: "Research projects", href: "/research#projects" },
];

/** Research & Development: the way to the HKBK Research portal (the R&D portal link set in Edit content), and the research pages. */
export default async function RndPage() {
  const { rndUrl } = await getSiteLinks();
  const offSite = rndUrl ? isOffSite(rndUrl) : false;
  return (
    <ContentPage slug="rnd" fallbackTitle="Research & Development" current="/rnd">
      {rndUrl && (
        <a
          href={rndUrl}
          {...(offSite ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className={buttonVariants({ size: "lg", className: "w-full sm:w-auto" })}
        >
          <FlaskConical aria-hidden="true" />
          Open HKBK Research
          {offSite ? <ExternalLink aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
        </a>
      )}
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
