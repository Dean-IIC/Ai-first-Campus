import { DateBadge, SampleTag } from "@/components/features/content/bits";
import type { NewsItem } from "@/lib/types";

/** News or events in two columns, each with a calendar-style date. */
export default function NewsList({ items }: { items: NewsItem[] }) {
  if (items.length === 0) return <p className="text-muted-foreground">Nothing here yet.</p>;
  return (
    <ul className="grid gap-x-10 md:grid-cols-2">
      {items.map((n) => (
        <li key={n.slug} className="flex gap-4 border-b border-border py-4 last:border-b-0 md:[&:nth-last-child(2):nth-child(odd)]:border-b-0">
          <DateBadge iso={n.kind === "event" && n.event_date ? n.event_date : n.published_on} />
          <div className="min-w-0">
            <p className="font-semibold leading-snug text-heading">
              {n.title}
              {n.is_sample && <SampleTag />}
            </p>
            {n.summary && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{n.summary}</p>}
          </div>
        </li>
      ))}
    </ul>
  );
}
