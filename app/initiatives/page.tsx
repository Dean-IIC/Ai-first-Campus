import Link from "next/link";
import { ExternalLink } from "lucide-react";
import ContentPage, { pageMetadata } from "@/components/features/layout/content-page";
import Tabs from "@/components/features/content/content-tabs";
import { getList } from "@/lib/content";
import { portalIcon, portalLive, portalTone } from "@/lib/portals";
import { INITIATIVES_LABEL } from "@/lib/site";
import { TONE, linkText } from "@/lib/ui";
import { buttonVariants } from "@/components/ui/button";

export const revalidate = 300;
export const generateMetadata = () => pageMetadata("initiatives", "Centres and initiatives");

export default async function InitiativesPage() {
  const rows = await getList("portals");
  return (
    <ContentPage
      slug="initiatives"
      fallbackTitle="Centres and initiatives"
      current="/initiatives"
      tone="violet"
      trail={[{ label: INITIATIVES_LABEL }]}
      layout={(body) => (
        <>
          {body && <div className="max-w-[72ch] text-muted-foreground">{body}</div>}
          <Tabs
            label={INITIATIVES_LABEL}
            tone="violet"
            items={rows.map((p) => {
              const Icon = portalIcon(p);
              const t = TONE[portalTone(p)];
              const live = portalLive(p);
              return {
                id: p.slug,
                label: p.title,
                content: (
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                    <span className={`grid size-16 shrink-0 place-items-center rounded-xl ${t.bg} text-white`}>
                      <Icon aria-hidden="true" className="size-8" />
                    </span>
                    <div className="min-w-0">
                      <h2 className="text-xl font-semibold text-heading">{p.title}</h2>
                      <p className="text-sm text-muted-foreground">{live ? new URL(p.url!).hostname : "Dedicated site coming soon"}</p>
                      {p.description && <p className="mt-3 max-w-[64ch]">{p.description}</p>}
                      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
                        {live ? (
                          <a href={p.url!} target="_blank" rel="noopener noreferrer" className={buttonVariants()}>
                            Visit the {p.title} site
                            <ExternalLink aria-hidden="true" className="size-4" />
                            <span className="sr-only"> (opens in a new tab)</span>
                          </a>
                        ) : (
                          <Link href={`/initiatives/${p.slug}`} className={buttonVariants()}>
                            Open {p.title}
                          </Link>
                        )}
                        {p.related_page && (
                          <Link href={p.related_page} className={`${linkText} text-sm`}>
                            Read more on this site
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ),
              };
            })}
          />
        </>
      )}
    />
  );
}
