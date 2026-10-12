import VisionMission from "@/components/features/content/vision-mission";
import { SectionHeading } from "@/components/features/content/bits";
import AiFirstSection from "@/components/features/home/ai-first-section";
import DepartmentsPanel from "@/components/features/home/departments-panel";
import ExploreSection from "@/components/features/home/explore-section";
import Hero from "@/components/features/home/hero";
import JourneySection from "@/components/features/home/journey-section";
import KeyFigures from "@/components/features/home/key-figures";
import LeadershipSection from "@/components/features/home/leadership-section";
import NoticesSection from "@/components/features/home/notices-section";
import QuickAccess from "@/components/features/home/quick-access";
import VisitStrip from "@/components/features/home/visit-strip";
import { getList, getMessages, getPage } from "@/lib/content";
import { shell } from "@/lib/ui";

// Rendered on each request: the journey timeline is edited on this page, and a cached copy would
// show the previous version for a few minutes after every save.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [messages, aiMessages, departments, news, aiFirstPage, journey] = await Promise.all([
    getMessages(),
    getMessages("ai-first"),
    getList("departments"),
    getList("news_items"),
    getPage("home-ai-first"),
    getList("journey_milestones"),
  ]);

  return (
    <>
      <Hero />
      <div className="mt-10">
        <KeyFigures />
      </div>
      <QuickAccess />
      <section className={`${shell} pt-14`}>
        <SectionHeading title="Our vision and mission" tone="blue" />
        <div className="mt-6">
          <VisionMission />
        </div>
      </section>
      <LeadershipSection messages={messages} />
      <AiFirstSection page={aiFirstPage} messages={aiMessages} />
      <JourneySection milestones={journey} />
      <NoticesSection news={news} />
      <ExploreSection />
      <DepartmentsPanel departments={departments} />
      <VisitStrip />
    </>
  );
}
