import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, ExternalLink, Globe } from "lucide-react";
import PageBanner from "@/components/features/layout/page-banner";
import Panel from "@/components/features/content/panel";
import { getList } from "@/lib/content";
import { portalIcon, portalLive, portalTone } from "@/lib/portals";
import { INITIATIVES_LABEL } from "@/lib/site";
import { TONE, shell } from "@/lib/ui";
import { buttonVariants } from "@/components/ui/button";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getList("portals")).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = (await getList("portals")).find((x) => x.slug === slug);
  return p ? { title: p.title, description: p.description ?? undefined } : { title: "Not found" };
}

/**
 * Ready-made page for each centre or initiative. The menu links here until
 * the initiative's own subdomain is set and marked Live in the portals table.
 */
export default async function InitiativePage({ params }: Props) {
  const { slug } = await params;
  const p = (await getList("portals")).find((x) => x.slug === slug);
  if (!p) notFound();

  const Icon = portalIcon(p);
  const t = TONE[portalTone(p)];
  const live = portalLive(p);

  return (
    <>
      <PageBanner title={p.title} summary={p.description} tone="violet" trail={[{ label: INITIATIVES_LABEL, href: "/initiatives" }, { label: p.title }]} />
      <div className={`${shell} pt-8 lg:pt-10`}>
        <div className="min-w-0 space-y-6">
          <div className={`flex flex-col gap-5 rounded-lg ${t.bg} p-6 text-white sm:flex-row sm:items-center`}>
            <span className="grid size-16 shrink-0 place-items-center rounded-xl bg-white/15">
              <Icon aria-hidden="true" className="size-8" />
            </span>
            <div className="flex-1">
              <p className="text-xl font-semibold">{p.title}</p>
              <p className="mt-1 text-white/85">{p.description}</p>
            </div>
            {live ? (
              <a href={p.url!} target="_blank" rel="noopener noreferrer" className={`${buttonVariants({ variant: "gold" })} shrink-0`}>
                Visit the site
                <ExternalLink aria-hidden="true" className="size-4" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ) : (
              <span className="inline-flex shrink-0 items-center gap-2 rounded-md border border-white/40 px-3 py-2 text-sm font-medium">
                <Clock aria-hidden="true" className="size-4" />
                Coming soon
              </span>
            )}
          </div>

          <Panel title={live ? "Visit the dedicated site" : "A dedicated site is on its way"} icon={Globe} tone="violet">
            {live ? (
              <p className="max-w-[64ch]">
                {p.title} has its own website at <strong>{new URL(p.url!).hostname}</strong>, with the latest news, events and resources.
              </p>
            ) : (
              <p className="max-w-[64ch]">
                {p.title} will soon have its own HKBK website, with news, events, resources and contacts. This page will link
                straight to it as soon as it goes live.
              </p>
            )}
            <div className="mt-5 flex flex-wrap gap-3">
              {p.related_page && (
                <Link href={p.related_page} className={buttonVariants({ variant: "outline" })}>
                  Read about {p.title} on this site
                </Link>
              )}
              <Link href="/initiatives" className={buttonVariants({ variant: "outline" })}>
                All centres and initiatives
              </Link>
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}
