import { SampleTag, StatusPill } from "@/components/features/content/bits";

type Row = {
  slug: string;
  title: string;
  summary: string | null;
  status: string;
  year: number | null;
  is_sample: boolean;
  /** Optional bullet points shown under the summary (consultancy outcomes). */
  outcomes?: string[] | null;
  meta: { label: string; value: string | null }[];
};

/** Project rows for R&D and consultancy, with a coloured edge per section. */
export default function ProjectList({ rows, empty }: { rows: Row[]; empty: string }) {
  if (rows.length === 0) return <p className="text-muted-foreground">{empty}</p>;
  return (
    <ul className="space-y-4">
      {rows.map((p) => (
        <li key={p.slug} className="rounded-md border border-border border-l-[3px] border-l-t-amber p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h3 className="max-w-[60ch] font-semibold leading-snug text-heading">
              {p.title}
              {p.is_sample && <SampleTag />}
            </h3>
            <div className="flex items-center gap-3">
              {p.year && <span className="text-sm text-muted-foreground">{p.year}</span>}
              <StatusPill status={p.status} />
            </div>
          </div>
          {p.summary && <p className="mt-2 max-w-[70ch] text-sm text-muted-foreground">{p.summary}</p>}
          {p.outcomes && p.outcomes.length > 0 && (
            <ul className="mt-3 max-w-[70ch] space-y-1 text-sm">
              {p.outcomes.map((o) => (
                <li key={o} className="flex gap-2">
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-t-amber" />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          )}
          <dl className="mt-3 flex flex-wrap gap-x-8 gap-y-1 text-sm">
            {p.meta
              .filter((m) => m.value)
              .map((m) => (
                <div key={m.label} className="flex gap-1.5">
                  <dt className="text-muted-foreground">{m.label}:</dt>
                  <dd className="font-medium">{m.value}</dd>
                </div>
              ))}
          </dl>
        </li>
      ))}
    </ul>
  );
}
