/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from "react";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { Chip, DateBadge, SampleTag } from "@/components/features/content/bits";
import { eventDates, eventStart } from "@/lib/events";
import type { NewsItem } from "@/lib/types";
import { linkText } from "@/lib/ui";
import { cn } from "@/lib/utils";

/**
 * One event: the calendar date badge (month in the red strip, day below), category, title, dates,
 * time and venue, a short description, the poster shown in full on white (it opens full size),
 * and the registration or details link. `children` holds the admin buttons.
 */
export default function EventCardView({ event: e, compact = false, children }: { event: NewsItem; compact?: boolean; children?: ReactNode }) {
  return (
    <div className={cn("relative flex gap-4", compact ? "py-4" : "py-5")}>
      <DateBadge iso={eventStart(e)} />
      <div className="min-w-0 flex-1">
        {e.category && <Chip tone="rose">{e.category}</Chip>}
        <p className={cn("mt-1.5 font-semibold leading-snug text-heading", !compact && "text-lg")}>
          {e.title}
          {e.is_sample && <SampleTag />}
        </p>
        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <CalendarDays aria-hidden="true" className="size-3.5" />
            {eventDates(e)}
          </span>
          {e.event_time && (
            <span className="flex items-center gap-1">
              <Clock aria-hidden="true" className="size-3.5" />
              {e.event_time}
            </span>
          )}
          {e.venue && (
            <span className="flex items-center gap-1">
              <MapPin aria-hidden="true" className="size-3.5" />
              {e.venue}
            </span>
          )}
        </p>
        {e.summary && <p className={cn("mt-1.5 text-sm text-foreground", compact ? "line-clamp-2" : "line-clamp-3 max-w-[68ch]")}>{e.summary}</p>}
        {e.link_url && (
          <a href={e.link_url} target="_blank" rel="noopener noreferrer" className={`${linkText} mt-2 inline-block text-sm`}>
            Register or read more
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
        {children}
      </div>
      {e.poster_url && (
        <a href={e.poster_url} target="_blank" rel="noopener noreferrer" className="shrink-0 self-start rounded-md focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring">
          <img src={e.poster_url} alt={`Poster: ${e.title}`} loading="lazy" className={cn("rounded-md bg-white object-contain ring-1 ring-border", compact ? "h-24 w-20" : "h-36 w-28 sm:h-44 sm:w-32")} />
          <span className="sr-only"> (opens the poster full size in a new tab)</span>
        </a>
      )}
    </div>
  );
}
