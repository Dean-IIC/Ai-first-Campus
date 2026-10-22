"use client";

import { useState } from "react";
import { splitEvents } from "@/lib/events";
import type { NewsItem } from "@/lib/types";
import { navyPill } from "@/lib/ui";
import { cn } from "@/lib/utils";
import EventCard from "./event-card";
import EventCardForm from "./event-card-form";
import { useEventsEditor } from "./events-editor";

const EMPTY = "Upcoming events will be listed here soon.";

function Items({ items, compact }: { items: NewsItem[]; compact: boolean }) {
  return (
    <ul className={cn(compact ? "grid gap-x-10 md:grid-cols-2" : "divide-y divide-border")}>
      {items.map((e, i) => (
        <li key={e.slug || `new-${i}`} className={cn(compact && "border-b border-border last:border-b-0 md:[&:nth-last-child(2):nth-child(odd)]:border-b-0")}>
          <EventCard event={e} compact={compact} />
        </li>
      ))}
    </ul>
  );
}

/**
 * Events with the admin's "Add event" button at the top. On the home page (`home`): the next three
 * upcoming events, or the latest three past ones when nothing is coming up. On the Events page:
 * every upcoming event (soonest first), then "Past events" (most recent first).
 */
export default function EventList({ home = false }: { home?: boolean }) {
  const { admin, rows } = useEventsEditor();
  const [adding, setAdding] = useState(false);
  const { upcoming, past } = splitEvents(rows);

  const add = admin && (
    <div className="mb-2">
      {adding ? (
        <EventCardForm onDone={() => setAdding(false)} />
      ) : (
        <button type="button" className={navyPill} onClick={() => setAdding(true)}>
          <span aria-hidden="true">➕</span> Add event
        </button>
      )}
    </div>
  );

  if (home) {
    const shown = upcoming.length > 0 ? upcoming.slice(0, 3) : past.slice(0, 3);
    return (
      <div>
        {add}
        {shown.length === 0 ? <p className="text-muted-foreground">{EMPTY}</p> : <Items items={shown} compact />}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section aria-labelledby="upcoming-events">
        <h2 id="upcoming-events" className="text-2xl font-bold text-heading">
          Upcoming events
        </h2>
        <div className="mt-3">
          {add}
          {upcoming.length === 0 ? <p className="py-3 text-muted-foreground">{EMPTY}</p> : <Items items={upcoming} compact={false} />}
        </div>
      </section>
      {past.length > 0 && (
        <section aria-labelledby="past-events">
          <h2 id="past-events" className="text-2xl font-bold text-heading">
            Past events
          </h2>
          <div className="mt-3">
            <Items items={past} compact={false} />
          </div>
        </section>
      )}
    </div>
  );
}
