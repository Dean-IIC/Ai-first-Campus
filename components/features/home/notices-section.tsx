import Link from "next/link";
import { SectionHeading } from "@/components/features/content/bits";
import ContentTabs from "@/components/features/content/content-tabs";
import type { NewsItem } from "@/lib/types";
import { linkText, shell } from "@/lib/ui";
import NewsList from "./news-list";

/** Latest news and events in tabs. */
export default function NoticesSection({ news }: { news: NewsItem[] }) {
  const newsOnly = news.filter((n) => n.kind === "news").slice(0, 4);
  const events = news.filter((n) => n.kind === "event").slice(0, 4);
  return (
    <section className={`${shell} pt-14`}>
      <SectionHeading
        title="Notices and events"
        tone="rose"
        intro="Latest from the campus."
        action={
          <Link href="/news" className={linkText}>
            All news and events
          </Link>
        }
      />
      <div className="mt-6">
        <ContentTabs
          label="Notices and events"
          tone="rose"
          items={[
            { id: "home-news", label: "News", content: <NewsList items={newsOnly} /> },
            { id: "home-events", label: "Events", content: <NewsList items={events} /> },
          ]}
        />
      </div>
    </section>
  );
}
