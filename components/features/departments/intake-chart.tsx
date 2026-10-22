export type IntakePoint = { year: string; intake: number; milestone: string };

/** A round axis top above the largest value (50, 100, 200, 250, 500 ...) and its tick step. */
function scale(max: number): { top: number; step: number } {
  const steps = [10, 20, 25, 50, 100, 200, 250, 500, 1000];
  const step = steps.find((s) => max / s <= 5) ?? 1000;
  return { top: Math.max(step, Math.ceil(max / step) * step), step };
}

/**
 * Annual intake as a bar chart, one bar per academic year: the seat count above each bar, the
 * year below, faint gridlines behind, and the year's milestone on hover. The chart is hidden from
 * screen readers; the history table beside it (visually hidden) carries the same data.
 */
export default function IntakeChart({ points }: { points: IntakePoint[] }) {
  const { top, step } = scale(Math.max(...points.map((p) => p.intake)));
  const ticks = Array.from({ length: top / step + 1 }, (_, i) => top - i * step);
  const first = points[0];
  const last = points[points.length - 1];
  const growth = first.intake > 0 ? last.intake / first.intake : 0;

  return (
    <figure className="mt-4 rounded-xl border border-border bg-card p-4 sm:p-6">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <span className="font-semibold text-heading">Annual intake (seats) by academic year</span>
        {growth > 1 && (
          <span className="text-sm text-muted-foreground">
            <strong className="font-semibold text-heading">{growth % 1 === 0 ? growth : growth.toFixed(1)}×</strong> since {first.year}
          </span>
        )}
      </figcaption>

      <div className="mb-7 mt-6 flex gap-3" aria-hidden="true">
        {/* Y axis labels, aligned with the gridlines. */}
        <div className="relative h-56 w-8 shrink-0 text-right text-xs text-muted-foreground sm:h-64">
          {ticks.map((t) => (
            <span key={t} className="absolute right-0 -translate-y-1/2 tabular-nums" style={{ top: `${((top - t) / top) * 100}%` }}>
              {t}
            </span>
          ))}
        </div>
        <div className="relative h-56 flex-1 sm:h-64">
          {ticks.map((t) => (
            <span key={t} className={`absolute inset-x-0 border-t ${t === 0 ? "border-foreground/40" : "border-dashed border-border"}`} style={{ top: `${((top - t) / top) * 100}%` }} />
          ))}
          <ol className="absolute inset-0 flex items-end justify-around gap-2 px-1">
            {points.map((p) => (
              <li key={p.year} className="group relative flex h-full w-full max-w-16 flex-col items-center justify-end">
                <span
                  className="relative flex w-full max-w-12 justify-center rounded-t-[4px] bg-t-green transition-colors group-hover:bg-t-teal dark:bg-t-green-light dark:group-hover:bg-t-teal-light"
                  style={{ height: `${(p.intake / top) * 100}%` }}
                >
                  <span className="absolute -top-6 text-sm font-semibold tabular-nums text-heading">{p.intake}</span>
                </span>
                <span className="absolute top-full mt-2 whitespace-nowrap text-xs font-medium tabular-nums text-muted-foreground sm:text-sm">
                  {/* Phones show "21–22" so the five labels fit; wider screens show "2021–22". */}
                  <span className="sm:hidden">{p.year.replace(/^\d\d(\d\d)/, "$1")}</span>
                  <span className="hidden sm:inline">{p.year}</span>
                </span>
                {/* Tooltip with the milestone. */}
                <span className="pointer-events-none absolute bottom-full z-10 mb-1 hidden w-44 rounded-md border border-border bg-popover px-2.5 py-1.5 text-center text-xs text-popover-foreground shadow-md group-hover:block">
                  <span className="block font-semibold">{p.year}</span>
                  {p.milestone}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </figure>
  );
}
