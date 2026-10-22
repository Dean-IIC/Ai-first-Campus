import ContentPage, { pageMetadata } from "@/components/features/layout/content-page";
import EventList from "@/components/features/events/event-list";
import EventsEditorProvider from "@/components/features/events/events-editor";
import { getList } from "@/lib/content";

// Rendered on each request: events are edited on this page, and upcoming events move to "Past
// events" by date, so a cached copy would be out of date.
export const dynamic = "force-dynamic";
export const generateMetadata = () => pageMetadata("news", "Events");

/** Every event: upcoming (soonest first), then past events. The old /news address redirects here. */
export default async function EventsPage() {
  const items = await getList("news_items");
  return (
    <ContentPage
      slug="news"
      fallbackTitle="Events"
      current="/events"
      layout={() => (
        <EventsEditorProvider items={items}>
          <EventList />
        </EventsEditorProvider>
      )}
    />
  );
}
