import ContentPage, { pageMetadata } from "@/components/features/layout/content-page";
import Tabs from "@/components/features/content/content-tabs";
import { Chip, DateBadge, SampleTag } from "@/components/features/content/bits";
import { getList } from "@/lib/content";
import type { NewsItem } from "@/lib/types";
import { linkText } from "@/lib/ui";

export const revalidate = 300;
export const generateMetadata = () => pageMetadata("news", "News and events");

function List({ items }: { items: NewsItem[] }) {
  if (items.length === 0) return <p className="text-muted-foreground">Nothing here yet. Add rows to the news_items table in Supabase.</p>;
  return (
    <ul className="divide-y divide-border">
      {items.map((n) => (
        <li key={n.slug} className="flex gap-5 py-5 first:pt-0 last:pb-0">
          <DateBadge iso={n.kind === "event" && n.event_date ? n.event_date : n.published_on} />
          <div className="min-w-0">
            <Chip tone={n.kind === "event" ? "rose" : "blue"}>{n.kind === "event" ? "Event" : "News"}</Chip>
            <h2 className="mt-2 text-lg font-semibold leading-snug text-heading">
              {n.title}
              {n.is_sample && <SampleTag />}
            </h2>
            {n.summary && <p className="mt-1.5 max-w-[68ch] text-muted-foreground">{n.summary}</p>}
            {n.link_url && (
              <a href={n.link_url} target="_blank" rel="noopener noreferrer" className={`${linkText} mt-2 inline-block text-sm`}>
                Read more
              </a>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default async function NewsPage() {
  const items = await getList("news_items");
  return (
    <ContentPage
      slug="news"
      fallbackTitle="News and events"
      current="/news"
      layout={() => (
        <Tabs
          label="News and events"
          tone="rose"
          items={[
            { id: "all", label: `All (${items.length})`, content: <List items={items} /> },
            { id: "news", label: "News", content: <List items={items.filter((n) => n.kind === "news")} /> },
            { id: "events", label: "Events", content: <List items={items.filter((n) => n.kind === "event")} /> },
          ]}
        />
      )}
    />
  );
}
