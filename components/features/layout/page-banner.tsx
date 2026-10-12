import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { TONE, shell, type Tone } from "@/lib/ui";

type Crumb = { label: string; href?: string };

/**
 * Page banner: breadcrumb, title and summary on the section's tint.
 * With `prefix`, the title is shown as a highlighted name in the section's
 * gradient (for example "Department of" + "Information Science & Engineering"),
 * and `watermark` adds a large faint label behind it.
 */
export default function PageBanner({
  title,
  summary,
  trail = [],
  tone = "blue",
  prefix,
  watermark,
}: {
  title: string;
  summary?: string | null;
  trail?: Crumb[];
  tone?: Tone;
  prefix?: string;
  watermark?: string | null;
}) {
  return (
    <section className="relative overflow-hidden bg-brand-tint">
      {watermark && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-6 right-4 select-none font-serif text-[7rem] font-bold leading-none text-heading/[0.05] sm:right-10 sm:text-[11rem]"
        >
          {watermark}
        </span>
      )}
      {prefix && <div aria-hidden="true" className={`pointer-events-none absolute -right-24 -top-24 size-80 rounded-full opacity-25 blur-3xl ${TONE[tone].bg}`} />}
      <span aria-hidden="true" className={`absolute inset-x-0 bottom-0 h-1 ${TONE[tone].bg}`} />
      <div className={`${shell} py-8 lg:py-10`}>
        <nav aria-label="Breadcrumb" className="text-[0.875rem] text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-x-1.5">
            <li>
              <Link href="/" className="hover:text-primary hover:underline">Home</Link>
            </li>
            {trail.map((c) => (
              <li key={c.label} className="flex items-center gap-x-1.5">
                <ChevronRight aria-hidden="true" className="size-3.5" />
                {c.href ? (
                  <Link href={c.href} className="hover:text-primary hover:underline">{c.label}</Link>
                ) : (
                  <span aria-current="page" className="text-foreground">{c.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        {prefix ? (
          <h1 className="relative mt-3 max-w-4xl">
            <span className="block text-base font-semibold tracking-wide text-muted-foreground sm:text-lg">{prefix}</span>
            <span className={`mt-1 block pb-1 text-3xl font-extrabold leading-tight sm:text-[2.75rem] ${TONE[tone].gradientText}`}>{title}</span>
          </h1>
        ) : (
          <h1 className="mt-3 max-w-4xl text-3xl font-bold leading-tight text-heading sm:text-[2.5rem]">{title}</h1>
        )}
        {summary && <p className="relative mt-3 max-w-[70ch] text-[1.0625rem] leading-relaxed text-muted-foreground">{summary}</p>}
      </div>
    </section>
  );
}
