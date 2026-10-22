import Link from "next/link";
import { SectionHeading } from "@/components/features/content/bits";
import EventList from "@/components/features/events/event-list";
import EventsEditorProvider from "@/components/features/events/events-editor";
import type { NewsItem } from "@/lib/types";
import { linkText, shell } from "@/lib/ui";

/** Events on the home page: the next three upcoming events, or the latest three past ones. */
export default function NoticesSection({ news }: { news: NewsItem[] }) {
  return (
    <section className={`${shell} pt-14`}>
      <SectionHeading
        title="Events"
        tone="rose"
        intro="Latest from the campus."
        action={
          <Link href="/events" className={linkText}>
            All events
          </Link>
        }
      />
      <div className="mt-6">
        <EventsEditorProvider items={news}>
          <EventList home />
        </EventsEditorProvider>
      </div>
    </section>
  );
}
