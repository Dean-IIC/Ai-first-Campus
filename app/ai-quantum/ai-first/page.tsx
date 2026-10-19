/* eslint-disable @next/next/no-img-element */
import ContentPage, { pageMetadata } from "@/components/features/layout/content-page";
import Markdown from "@/components/features/content/markdown";
import Panel from "@/components/features/content/panel";
import { SectionHeading } from "@/components/features/content/bits";
import DashboardsSection from "@/components/features/initiatives/dashboards-section";
import AiChampions from "@/components/features/people/ai-champions";
import AiPeopleGrid from "@/components/features/people/ai-people-grid";
import { getPage } from "@/lib/content";
import { images } from "@/lib/site";

// Rendered on each request: the faculty and ambassador cards are edited on this page, and a
// cached copy would show the previous card for a few seconds after every save.
export const dynamic = "force-dynamic";
export const generateMetadata = () => pageMetadata("ai-first", "AI First campus");

/**
 * The AI First campus page. It also holds the AI Champions and Ambassadors and the Dashboards
 * content (their old addresses redirect to #champions and #dashboards here).
 */
export default async function AiFirstPage() {
  const champions = await getPage("ai-champions");
  return (
    <ContentPage
      slug="ai-first"
      fallbackTitle="AI First campus"
      current="/ai-quantum/ai-first"
      layout={(body) => (
        <>
          <section id="champions" className="scroll-mt-24 space-y-8">
            <SectionHeading title="AI Champions and Ambassadors" tone="teal" />
            {champions?.body_md && (
              <Panel>
                <Markdown>{champions.body_md}</Markdown>
              </Panel>
            )}
            <AiPeopleGrid />
          </section>
          <section id="dashboards" className="scroll-mt-24 space-y-8">
            <SectionHeading title="Dashboards" tone="teal" />
            <DashboardsSection />
          </section>
          <img src={images.ai.src} alt={images.ai.alt} width={1600} height={1000} className="aspect-[16/7] w-full rounded-lg object-cover" />
          <AiChampions />
          {body && <Panel tone="teal">{body}</Panel>}
        </>
      )}
    />
  );
}
