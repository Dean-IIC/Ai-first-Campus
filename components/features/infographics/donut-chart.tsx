import { cn } from "@/lib/utils";
import { TONE, type Tone } from "@/lib/ui";

const TONE_HEX: Record<Tone, string> = {
  blue: "#1a4f9c",
  green: "#1e7a4c",
  teal: "#0b7480",
  amber: "#925700",
  rose: "#a3253d",
  violet: "#5b3fa6",
};

/** Accessible SVG donut with a legend. Colours follow the section tones; the track and labels follow the theme. */
export default function DonutChart({ data, centerLabel }: { data: { label: string; value: number; tone: Tone }[]; centerLabel: string }) {
  const total = data.reduce((s, d) => s + Math.max(0, d.value), 0);
  const r = 70;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row">
      <svg
        viewBox="0 0 200 200"
        className="size-44 shrink-0"
        role="img"
        aria-label={`${centerLabel}: ${data.map((d) => `${d.label} ${d.value}`).join(", ")}`}
      >
        <circle cx="100" cy="100" r={r} fill="none" strokeWidth="26" className="stroke-border" />
        {total > 0 &&
          data.map((d) => {
            const len = (Math.max(0, d.value) / total) * c;
            const el = (
              <circle
                key={d.label}
                cx="100"
                cy="100"
                r={r}
                fill="none"
                stroke={TONE_HEX[d.tone]}
                strokeWidth="26"
                strokeDasharray={`${Math.max(len - 2, 0)} ${c}`}
                strokeDashoffset={-offset}
                transform="rotate(-90 100 100)"
              />
            );
            offset += len;
            return el;
          })}
        <text x="100" y="98" textAnchor="middle" fontSize="38" fontWeight="700" className="fill-heading">
          {total}
        </text>
        <text x="100" y="122" textAnchor="middle" fontSize="13" className="fill-muted-foreground">
          {centerLabel}
        </text>
      </svg>
      <ul className="w-full space-y-2">
        {data.map((d) => (
          <li key={d.label} className="flex items-center justify-between gap-4 border-b border-border pb-2 text-sm">
            <span className="flex items-center gap-2.5">
              <span aria-hidden="true" className={cn("size-3 rounded-sm", TONE[d.tone].bg)} />
              {d.label}
            </span>
            <span className="font-semibold text-heading">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
