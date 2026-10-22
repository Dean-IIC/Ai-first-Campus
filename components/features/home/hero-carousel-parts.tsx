import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const arrow =
  "grid size-9 place-items-center rounded-full border border-border bg-card text-foreground shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring";

/** Previous and next arrows with one dot per photo, under the deck. */
export function CarouselControls({
  count,
  index,
  onPrev,
  onNext,
  onSelect,
}: {
  count: number;
  index: number;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={onPrev} aria-label="Previous photo" className={arrow}>
        <ChevronLeft aria-hidden="true" className="size-4" />
      </button>
      <div className="flex items-center">
        {Array.from({ length: count }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(i)}
            aria-label={`Show photo ${i + 1} of ${count}`}
            aria-current={i === index ? "true" : undefined}
            className="grid h-8 min-w-6 place-items-center rounded-full px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span aria-hidden="true" className={cn("block h-2 rounded-full bg-primary transition-all", i === index ? "w-5" : "w-2 opacity-35")} />
          </button>
        ))}
      </div>
      <button type="button" onClick={onNext} aria-label="Next photo" className={arrow}>
        <ChevronRight aria-hidden="true" className="size-4" />
      </button>
    </div>
  );
}

/** The frosted badge just below the front photo, overlapping its edge by 12 px so it never covers the picture; hidden when the photo has no title and no subtitle. */
export function SlideBadge({ title, subtitle }: { title: string; subtitle: string }) {
  if (!title && !subtitle) return null;
  return (
    <figcaption className="absolute left-5 top-full z-50 -translate-y-3 flex items-center gap-3 rounded-xl border border-white/40 bg-card/80 px-4 py-3 shadow-[0_12px_32px_-12px_rgba(10,42,87,0.45)] backdrop-blur-md dark:border-white/10">
      <span className="grid size-10 place-items-center rounded-lg bg-brand text-white shadow-[0_0_20px_-4px_rgba(18,62,124,0.8)]">
        <MapPin aria-hidden="true" className="size-5" />
      </span>
      <span className="leading-tight">
        {title && <span className="block text-sm font-semibold text-heading">{title}</span>}
        {subtitle && <span className="block text-xs text-muted-foreground">{subtitle}</span>}
      </span>
    </figcaption>
  );
}
