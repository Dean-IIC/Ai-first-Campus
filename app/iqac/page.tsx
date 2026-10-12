import ContentPage, { pageMetadata } from "@/components/features/layout/content-page";
import Markdown from "@/components/features/content/markdown";
import Tabs from "@/components/features/content/content-tabs";
import { getPage } from "@/lib/content";
import { splitSections } from "@/lib/markdown";

export const revalidate = 300;
export const generateMetadata = () => pageMetadata("iqac", "IQAC");

export default async function IqacPage() {
  const page = await getPage("iqac");
  const { sections } = splitSections(page?.body_md ?? "");
  return (
    <ContentPage
      slug="iqac"
      fallbackTitle="IQAC"
      current="/iqac"
      layout={() => (
        <Tabs label="IQAC" tone="blue" items={sections.map((s) => ({ id: s.id, label: s.title, content: <Markdown>{s.body}</Markdown> }))} />
      )}
    />
  );
}
