import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const arrow =
  "absolute top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white shadow-md backdrop-blur-sm transition-opacity hover:bg-black/55 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-white/80 opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100";

/** Previous and next buttons on the photo: shown on hover with a mouse, always on touch screens. */
export function CarouselArrows({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) {
  return (
    <>
      <button type="button" onClick={onPrev} aria-label="Previous photo" className={cn(arrow, "left-3")}>
        <ChevronLeft aria-hidden="true" className="size-5" />
      </button>
      <button type="button" onClick={onNext} aria-label="Next photo" className={cn(arrow, "right-3")}>
        <ChevronRight aria-hidden="true" className="size-5" />
      </button>
    </>
  );
}

/** One dot per photo at the bottom right; the current photo's dot is wider. */
export function CarouselDots({ count, index, onSelect }: { count: number; index: number; onSelect: (i: number) => void }) {
  return (
    <div className="absolute bottom-3 right-3 flex items-center rounded-full bg-black/35 px-1.5 py-1 backdrop-blur-sm">
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={`Show photo ${i + 1} of ${count}`}
          aria-current={i === index ? "true" : undefined}
          className="grid h-6 min-w-5 place-items-center rounded-full px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <span aria-hidden="true" className={cn("block h-2 rounded-full bg-current text-white transition-all", i === index ? "w-5" : "w-2 opacity-60")} />
        </button>
      ))}
    </div>
  );
}

/** The frosted location badge under the photo; hidden when the photo has no title and no subtitle. */
export function SlideBadge({ title, subtitle }: { title: string; subtitle: string }) {
  if (!title && !subtitle) return null;
  return (
    <figcaption className="absolute -bottom-5 left-5 flex items-center gap-3 rounded-xl border border-white/40 bg-card/80 px-4 py-3 shadow-[0_12px_32px_-12px_rgba(10,42,87,0.45)] backdrop-blur-md dark:border-white/10">
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
