import ContentPage, { pageMetadata } from "@/components/features/layout/content-page";
import ProjectList from "@/components/features/content/project-list";
import Tabs from "@/components/features/content/content-tabs";
import PortalCallout from "@/components/features/initiatives/initiative-callout";
import { getList } from "@/lib/content";

export const revalidate = 300;
export const generateMetadata = () => pageMetadata("research", "Research and development");

export default async function ResearchPage() {
  const projects = await getList("research_projects");
  return (
    <ContentPage
      slug="research"
      fallbackTitle="Research and development"
      current="/research"
      layout={(body) => (
        <>
        <PortalCallout slug="research" />
        <Tabs
          label="Research and development"
          tone="amber"
          items={[
            { id: "overview", label: "Research centre and focus", content: body },
            {
              id: "projects",
              label: `Projects (${projects.length})`,
              content: (
                <ProjectList
                  empty="Research projects will be listed here soon."
                  rows={projects.map((p) => ({
                    ...p,
                    meta: [
                      { label: "Led by", value: p.investigator },
                      { label: "Funding", value: p.funding_agency },
                    ],
                  }))}
                />
              ),
            },
          ]}
        />
        </>
      )}
    />
  );
}
