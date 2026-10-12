import AiPeopleGrid from "@/components/features/people/ai-people-grid";
import ContentPage, { pageMetadata } from "@/components/features/layout/content-page";

// Rendered on each request: the faculty and ambassador cards are edited on this page, and a
// cached copy would show the previous card for a few seconds after every save.
export const dynamic = "force-dynamic";
export const generateMetadata = () => pageMetadata("ai-champions", "AI Champions and Ambassadors");

export default function ChampionsPage() {
  return (
    <ContentPage slug="ai-champions" fallbackTitle="AI Champions and Ambassadors" current="/ai-quantum/champions">
      <AiPeopleGrid />
    </ContentPage>
  );
}
