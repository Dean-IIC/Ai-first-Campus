/* eslint-disable @next/next/no-img-element */
import Markdown from "@/components/features/content/markdown";
import Panel from "@/components/features/content/panel";
import { SectionHeading } from "@/components/features/content/bits";
import JourneySection from "@/components/features/home/journey-section";
import AiChampions from "@/components/features/people/ai-champions";
import AiPeopleGrid from "@/components/features/people/ai-people-grid";
import { getList, getPage } from "@/lib/content";
import { images } from "@/lib/site";

/**
 * The AI First Campus section of the AI & Quantum Campus page (#ai-first-campus): the picture,
 * the "ai-first" page text, the Champions summary, the full AI Champions and Ambassadors grids
 * (#champions) and the AI First journey timeline (#journey), the same one as on the home page.
 * The dashboards section is not shown for now; its data and editor are unchanged.
 */
export default async function AiFirstSection() {
  const [page, champions, journey] = await Promise.all([getPage("ai-first"), getPage("ai-champions"), getList("journey_milestones")]);
  return (
    <section id="ai-first-campus" className="scroll-mt-24 space-y-8">
      <SectionHeading title="AI First Campus" tone="teal" intro={page?.summary ?? undefined} />
      <img src={images.ai.src} alt={images.ai.alt} width={1600} height={1000} className="aspect-[16/7] w-full rounded-lg object-cover" />
      {page?.body_md && (
        <Panel tone="teal">
          <Markdown>{page.body_md}</Markdown>
        </Panel>
      )}
      <AiChampions />
      <section id="champions" className="scroll-mt-24 space-y-8">
        <SectionHeading title="AI Champions and Ambassadors" tone="teal" />
        {champions?.body_md && (
          <Panel>
            <Markdown>{champions.body_md}</Markdown>
          </Panel>
        )}
        <AiPeopleGrid />
      </section>
      <JourneySection milestones={journey} id="journey" embedded />
    </section>
  );
}
