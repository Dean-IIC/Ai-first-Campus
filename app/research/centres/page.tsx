import Link from "next/link";
import { Microscope } from "lucide-react";
import ContentPage, { pageMetadata } from "@/components/features/layout/content-page";
import { Chip } from "@/components/features/content/bits";
import { getList } from "@/lib/content";
import { linkText } from "@/lib/ui";

export const revalidate = 300;
export const generateMetadata = () => pageMetadata("research-centres", "Research centres");

export default async function ResearchCentresPage() {
  const centres = (await getList("departments")).filter((d) => d.has_research_centre);
  return (
    <ContentPage slug="research-centres" fallbackTitle="Research centres" current="/research/centres">
      <div className="grid gap-5 md:grid-cols-2">
        {centres.map((d) => (
          <article key={d.slug} className="flex flex-col rounded-lg border border-border border-t-[3px] border-t-t-amber bg-card p-5">
            <div className="flex items-start gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-t-amber text-white">
                <Microscope aria-hidden="true" className="size-6" />
              </span>
              <div>
                <h2 className="font-semibold leading-snug text-heading">Research Centre in {d.name}</h2>
                <p className="text-sm text-muted-foreground">Department of {d.name}</p>
              </div>
            </div>
            {d.research_areas.length > 0 && (
              <ul className="mt-4 flex flex-1 flex-wrap content-start gap-2">
                {d.research_areas.map((a) => (
                  <li key={a}>
                    <Chip tone="amber">{a}</Chip>
                  </li>
                ))}
              </ul>
            )}
            <Link href={`/academics/${d.slug}#research-centre`} className={`${linkText} mt-4 text-sm`}>
              About the centre
            </Link>
          </article>
        ))}
      </div>
    </ContentPage>
  );
}
