/* eslint-disable @next/next/no-img-element */
import type { JourneyInlinePhoto } from "@/lib/journey-model";

/**
 * The photo shown between an entry's first paragraph and its bullet points: centred, at most 400px wide
 * on desktop and at most 90% of the card on mobile, original proportions, with an optional caption.
 */
export default function JourneyPhotoFigure({ photo }: { photo: JourneyInlinePhoto }) {
  return (
    <figure className="mx-auto my-5 w-full max-w-[90%] text-center sm:max-w-[400px]">
      <img
        src={photo.src}
        alt={photo.alt || photo.caption || "Photo"}
        loading="lazy"
        decoding="async"
        className="block h-auto w-full rounded-xl border border-t-teal/30 bg-muted shadow-xs"
      />
      {photo.caption && <figcaption className="mt-2 text-sm italic text-muted-foreground">{photo.caption}</figcaption>}
    </figure>
  );
}
