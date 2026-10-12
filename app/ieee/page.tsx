import ContentPage, { pageMetadata } from "@/components/features/layout/content-page";
import Markdown from "@/components/features/content/markdown";
import PortalCallout from "@/components/features/initiatives/initiative-callout";
import Tabs from "@/components/features/content/content-tabs";
import { getPage } from "@/lib/content";
import { splitSections } from "@/lib/markdown";

export const revalidate = 300;
export const generateMetadata = () => pageMetadata("ieee", "IEEE Student Branch");

export default async function IeeePage() {
  const page = await getPage("ieee");
  const { sections } = splitSections(page?.body_md ?? "");
  return (
    <ContentPage
      slug="ieee"
      fallbackTitle="IEEE Student Branch"
      current="/ieee"
      layout={() => (
        <>
          <PortalCallout slug="ieee" />
          <Tabs
            label="IEEE Student Branch"
            tone="rose"
            items={sections.map((s) => ({ id: s.id, label: s.title, content: <Markdown>{s.body}</Markdown> }))}
          />
        </>
      )}
    />
  );
}
