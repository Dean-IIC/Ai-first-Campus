/* eslint-disable @next/next/no-img-element */
import type { HTMLAttributes, ReactNode } from "react";
import { Award, BookOpen, Cpu, FlaskConical, Hammer, Presentation, Rocket, Sparkles, Sprout, Sunrise, Trophy, Users, type LucideIcon } from "lucide-react";
import type { JourneyMilestone, JourneyPhoto } from "@/lib/types";
import { inlinePhotoOf, isFilled } from "@/lib/journey-model";
import JourneyPhotoFigure from "./journey-photo";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  sunrise: Sunrise,
  hammer: Hammer,
  presentation: Presentation,
  sprout: Sprout,
  sparkles: Sparkles,
  rocket: Rocket,
  flask: FlaskConical,
  book: BookOpen,
  users: Users,
  trophy: Trophy,
  cpu: Cpu,
};

/** Renders **bold** segments in a plain string. */
function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**") ? (
          <strong key={i} className="font-semibold text-heading">
            {p.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

function photosOf(m: JourneyMilestone): JourneyPhoto[] {
  return Array.isArray(m.photos) ? (m.photos as unknown as JourneyPhoto[]).filter((p) => p && typeof p.src === "string") : [];
}

/**
 * One month of the journey: dot on the rail, card with summary and points, and any photos.
 * `present` adds "— Present"; upcoming months are faded and tagged; `controls` is the editor's
 * Edit/Add button; `liProps` lets the editor drag the month into a new place.
 */
export default function JourneyEntry({
  milestone: m,
  last,
  present = false,
  controls,
  liProps,
  photoSlot,
}: {
  milestone: JourneyMilestone;
  last: boolean;
  present?: boolean;
  controls?: ReactNode;
  liProps?: HTMLAttributes<HTMLLIElement>;
  photoSlot?: ReactNode;
}) {
  const Icon = ICONS[m.icon] ?? Sparkles;
  const photos = photosOf(m);
  const inline = inlinePhotoOf(m);
  const upcoming = m.status === "upcoming";
  const empty = !isFilled(m);
  return (
    <li {...liProps} className={cn("relative grid grid-cols-[2.75rem_1fr] gap-4 sm:gap-6", upcoming && "opacity-75")}>
      {!last && <span aria-hidden="true" className="absolute bottom-0 left-[1.3rem] top-12 w-0.5 bg-border" />}
      <span
        className={cn(
          "relative z-10 grid size-11 place-items-center rounded-full",
          upcoming ? "border border-t-teal/40 bg-muted text-t-teal dark:text-t-teal-light" : "bg-t-teal text-white shadow-[0_0_20px_-6px_rgba(11,116,128,0.7)]",
        )}
      >
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <div className={cn("relative mb-8 min-w-0 rounded-xl border bg-card p-5 shadow-xs sm:p-6", upcoming || empty ? "border-dashed" : "border-border", empty && "bg-muted/60")}>
        {controls && <div className="absolute right-3 top-3 flex items-center gap-1">{controls}</div>}
        <p className="flex flex-wrap items-center gap-2 text-xs font-bold tracking-wide text-t-teal dark:text-t-teal-light">
          <span>{present ? `${m.period} — Present` : m.period}</span>
          {m.layer && <span className="rounded-full border border-t-teal/40 px-2 py-0.5 font-semibold">Layer {m.layer}</span>}
          {upcoming && <span className="rounded-full bg-muted px-2 py-0.5 font-semibold text-muted-foreground">Upcoming</span>}
        </p>
        {m.title.trim() ? (
          <h3 className="mt-1 text-lg font-semibold leading-snug text-heading">{m.title}</h3>
        ) : (
          <h3 className="mt-1 text-lg font-semibold leading-snug italic text-muted-foreground">Nothing added yet</h3>
        )}
        {m.summary && (
          <p className="mt-2 max-w-[75ch] text-[0.9375rem] text-foreground">
            <Rich text={m.summary} />
          </p>
        )}
        {photoSlot ?? (inline && <JourneyPhotoFigure photo={inline} />)}
        {m.points.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {m.points.map((pt) => (
              <li key={pt} className="flex gap-2.5 text-[0.9375rem] text-foreground">
                <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-t-teal" />
                <span>
                  <Rich text={pt} />
                </span>
              </li>
            ))}
          </ul>
        )}
        {m.badge && (
          <p className="mt-4 inline-flex items-center gap-2 rounded-lg border border-t-amber/30 bg-t-amber-tint px-3 py-2 text-sm font-semibold text-t-amber dark:text-t-amber-light">
            <Award aria-hidden="true" className="size-4" />
            {m.badge}
          </p>
        )}
        {photos.length > 0 && (
          <ul className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label={`Photos: ${m.title}`}>
            {photos.map((ph) => (
              <li key={ph.src} className="overflow-hidden rounded-lg border border-border bg-muted">
                <img
                  src={ph.src}
                  alt={ph.alt}
                  loading="lazy"
                  className={cn("aspect-[4/3] w-full transition-transform duration-300 hover:scale-[1.03]", ph.fit === "contain" ? "object-contain" : "object-cover")}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}
