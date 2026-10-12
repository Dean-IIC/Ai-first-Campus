/* eslint-disable @next/next/no-img-element */
import ReactMarkdown from "react-markdown";
import { Quote } from "lucide-react";
import { monogram } from "@/lib/format";
import type { LeadershipMessage } from "@/lib/types";

/** Splits a leading salutation line ("Dear students, ...,") from the rest of the letter. */
function splitSalutation(body: string): { salutation: string | null; rest: string } {
  const text = body.trim();
  const end = text.indexOf("\n\n");
  const first = end === -1 ? text : text.slice(0, end).trim();
  if (first.length <= 80 && first.endsWith(",")) return { salutation: first, rest: end === -1 ? "" : text.slice(end).trim() };
  return { salutation: null, rest: text };
}

/**
 * A featured leadership message: navy header band with portrait, pull quote, name and title,
 * then the letter with a salutation, drop cap and signature. Used for every leadership message:
 * home page, /leadership, /leadership/[slug] and the AI First Campus page.
 */
export default function FeaturedMessage({ message: m, as: Tag = "article" }: { message: LeadershipMessage; as?: "article" | "li" | "div" }) {
  const { salutation, rest } = splitSalutation(m.body_md);
  const who = m.name ?? `the ${m.designation}`;
  return (
    <Tag
      id={m.slug}
      className="scroll-mt-20 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_24px_48px_-28px_rgba(10,42,87,0.45)]"
    >
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-dark via-brand to-t-blue px-6 py-8 text-white sm:px-10 sm:py-10">
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 size-72 rounded-full bg-gold/20 blur-3xl" />
        <Quote aria-hidden="true" className="pointer-events-none absolute -bottom-6 right-6 size-40 rotate-180 text-white/[0.06]" />
        <div className="relative grid items-center gap-6 md:grid-cols-[auto_1fr] md:gap-10">
          {m.photo_url ? (
            <img
              src={m.photo_url}
              alt={`Photo of ${who}`}
              className="size-36 rounded-2xl object-cover object-top shadow-lg ring-4 ring-gold/70 md:size-40"
            />
          ) : (
            <span className="grid size-36 place-items-center rounded-2xl bg-white/10 font-serif text-5xl font-semibold text-gold shadow-lg ring-2 ring-gold/70 backdrop-blur-sm md:size-40">
              <span className="sr-only">Photo coming soon. </span>
              <span aria-hidden="true">{monogram(m.name, m.designation)}</span>
            </span>
          )}
          <div>
            <p className="text-sm font-semibold tracking-wide text-white/80">Message from the {m.designation}</p>
            {m.excerpt && (
              <blockquote className="mt-3 max-w-[48ch] font-serif text-xl leading-snug text-white sm:text-2xl">
                &ldquo;{m.excerpt}&rdquo;
              </blockquote>
            )}
            <div className="mt-5 flex items-center gap-3">
              <span aria-hidden="true" className="h-10 w-1 rounded-full bg-gold" />
              <p>
                {m.name && <span className="block font-serif text-2xl font-semibold leading-tight text-gold sm:text-[1.75rem]">{m.name}</span>}
                <span className="mt-1 block text-sm font-medium text-white/80">
                  {[m.designation, m.organisation].filter(Boolean).join(", ")}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 sm:px-10 sm:py-10">
        <div className="mx-auto max-w-[72ch]">
          {salutation && <p className="mb-5 font-serif text-xl italic text-primary">{salutation}</p>}
          <div className="letter letter-dropcap font-serif text-[1.0625rem] leading-[1.85] text-foreground">
            <ReactMarkdown>{rest}</ReactMarkdown>
          </div>
          <div className="mt-8 border-t border-border pt-6">
            <span aria-hidden="true" className="mb-3 block h-0.5 w-16 rounded-full bg-gold" />
            {m.name && <p className="font-serif text-2xl font-semibold italic text-primary">{m.name}</p>}
            <p className="mt-1 text-sm font-medium text-muted-foreground">
              {[m.designation, m.organisation].filter(Boolean).join(", ")}
            </p>
          </div>
        </div>
      </div>
    </Tag>
  );
}
