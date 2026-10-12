import ContentPage, { pageMetadata } from "@/components/features/layout/content-page";
import Tabs from "@/components/features/content/content-tabs";
import PortalCallout from "@/components/features/initiatives/initiative-callout";
import { Chip } from "@/components/features/content/bits";
import { getList } from "@/lib/content";
import { INITIATIVES_LABEL } from "@/lib/site";

export const revalidate = 300;
export const generateMetadata = () => pageMetadata("uhv", "Universal Human Values");

export default async function UhvPage() {
  const activities = await getList("uhv_activities");
  return (
    <ContentPage
      slug="uhv"
      fallbackTitle="Universal Human Values"
      current="/uhv"
      tone="violet"
      trail={[{ label: INITIATIVES_LABEL, href: "/initiatives" }, { label: "Universal Human Values" }]}
      layout={(body) => (
        <>
        <PortalCallout slug="uhv" />
        <Tabs
          label="Universal Human Values"
          tone="green"
          items={[
            { id: "about-uhv", label: "About UHV", content: body },
            {
              id: "activities",
              label: "Activities",
              content: (
                <ul className="grid gap-4 md:grid-cols-2">
                  {activities.map((a) => (
                    <li key={a.slug} className="rounded-md border border-border border-l-[3px] border-l-t-green p-5">
                      <Chip tone="green">{a.activity_type}</Chip>
                      <h3 className="mt-2 font-semibold text-heading">{a.title}</h3>
                      {a.description && <p className="mt-1.5 text-sm text-muted-foreground">{a.description}</p>}
                    </li>
                  ))}
                </ul>
              ),
            },
          ]}
        />
        </>
      )}
    />
  );
}
