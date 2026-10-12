import { Badge } from "@/components/ui/badge";
import EditableText from "@/components/features/cms/editable-text";
import { cn } from "@/lib/utils";
import { TONE, type Tone } from "@/lib/ui";

/** Section heading used on the home page. */
export function SectionHeading({ title, intro, tone = "blue", action }: { title: string; intro?: string; tone?: Tone; action?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="flex items-center gap-3 text-2xl font-bold text-heading sm:text-[1.75rem]">
          <span aria-hidden="true" className={cn("h-7 w-1.5 rounded-full", TONE[tone].bg)} />
          <EditableText id={`heading:${title}`}>{title}</EditableText>
        </h2>
        {intro && (
          <EditableText as="p" id={`intro:${intro}`} className="mt-2 max-w-[68ch] text-muted-foreground">
            {intro}
          </EditableText>
        )}
      </div>
      {action}
    </div>
  );
}

/** Marks seeded placeholder rows so nobody mistakes them for real records. */
export function SampleTag() {
  return (
    <Badge variant="dashed" title="Placeholder content. Replace or delete this row in Supabase." className="ml-2 align-middle">
      Sample entry
    </Badge>
  );
}

const STATUS_TONE: Record<string, Tone | "muted"> = {
  Live: "green",
  Completed: "green",
  Beta: "amber",
  Ongoing: "amber",
};

export function StatusPill({ status }: { status: string }) {
  const tone = STATUS_TONE[status] ?? "muted";
  return (
    <Badge variant={tone === "muted" ? "muted" : "secondary"} className={tone === "muted" ? undefined : cn(TONE[tone].tint, TONE[tone].text)}>
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {status}
    </Badge>
  );
}

/** Portrait placeholder until photos are uploaded. */
export function Monogram({ text, size = "md" }: { text: string; size?: "md" | "lg" | "xl" }) {
  const dims = { md: "size-12 text-lg", lg: "size-20 text-2xl", xl: "size-28 text-4xl" }[size];
  return (
    <span aria-hidden="true" className={cn("grid shrink-0 place-items-center rounded-lg bg-brand-tint font-serif font-semibold text-primary", dims)}>
      {text}
    </span>
  );
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Calendar-style date block. */
export function DateBadge({ iso, tone = "rose" }: { iso: string; tone?: Tone }) {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  if (!y || !m || !d) return null;
  return (
    <span className="block w-14 shrink-0 overflow-hidden rounded-md border border-border bg-card text-center" aria-label={`${d} ${MONTHS[m - 1]} ${y}`}>
      <span className={cn("block py-0.5 text-[0.6875rem] font-semibold text-white", TONE[tone].bg)}>{MONTHS[m - 1]}</span>
      <span className="block py-1 text-xl font-bold leading-tight text-heading">{d}</span>
    </span>
  );
}

export function Chip({ children, tone = "blue" }: { children: React.ReactNode; tone?: Tone }) {
  return (
    <Badge variant="secondary" className={cn(TONE[tone].tint, TONE[tone].text)}>
      {children}
    </Badge>
  );
}
