/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { TONE, type Tone } from "@/lib/ui";

/** A large image with a caption panel, used for AI, quantum and campus features. */
export default function ImageFeature({
  src,
  alt,
  title,
  text,
  href,
  linkLabel,
  tone = "teal",
  priority = false,
}: {
  src: string;
  alt: string;
  title: string;
  text: string;
  href?: string;
  linkLabel?: string;
  tone?: Tone;
  priority?: boolean;
}) {
  const t = TONE[tone];
  return (
    <article className={`group flex flex-col overflow-hidden rounded-lg border border-border border-t-[3px] ${t.borderTop} bg-card`}>
      <div className="aspect-[16/9] overflow-hidden bg-brand-dark">
        <img
          src={src}
          alt={alt}
          width={1600}
          height={1000}
          loading={priority ? "eager" : "lazy"}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-lg font-semibold text-heading">{title}</h3>
        <p className="mt-1.5 flex-1 text-muted-foreground">{text}</p>
        {href && (
          <Link href={href} className={`mt-4 text-sm font-semibold ${t.text} hover:underline hover:underline-offset-4`}>
            {linkLabel ?? "Learn more"}
          </Link>
        )}
      </div>
    </article>
  );
}
