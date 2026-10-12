import { ExternalLink } from "lucide-react";
import { getList } from "@/lib/content";
import { portalIcon, portalLive, portalTone } from "@/lib/portals";
import { TONE } from "@/lib/ui";
import { buttonVariants } from "@/components/ui/button";

/** Banner at the top of a page whose initiative has (or will have) its own site: UHV, R&D, IEEE. */
export default async function PortalCallout({ slug }: { slug: string }) {
  const portal = (await getList("portals")).find((p) => p.slug === slug);
  if (!portal) return null;
  const Icon = portalIcon(portal);
  const t = TONE[portalTone(portal)];
  const live = portalLive(portal);
  return (
    <div className={`flex flex-col gap-4 rounded-lg ${t.bg} p-5 text-white sm:flex-row sm:items-center sm:justify-between`}>
      <div className="flex items-center gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-white/15">
          <Icon aria-hidden="true" className="size-6" />
        </span>
        <div>
          <p className="font-semibold">{portal.title}</p>
          <p className="text-sm text-white/85">{portal.description}</p>
        </div>
      </div>
      {live ? (
        <a href={portal.url!} target="_blank" rel="noopener noreferrer" className={`${buttonVariants({ variant: "gold" })} shrink-0`}>
          Visit the {portal.title} site
          <ExternalLink aria-hidden="true" className="size-4" />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ) : (
        <span className="shrink-0 rounded-md border border-white/40 px-3 py-2 text-sm font-medium text-white/90">Dedicated site coming soon</span>
      )}
    </div>
  );
}
