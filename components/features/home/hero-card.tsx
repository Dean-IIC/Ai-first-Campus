/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from "react";
import type { HeroSlide } from "@/lib/carousel";
import { cn } from "@/lib/utils";

/**
 * Where a card sits in the deck: 0 is the front photo; 1 and 2 peek out on the right (smaller and
 * fainter); further cards wait, invisible, behind them. "leaving" is the front card sliding out.
 * The peek width comes from the deck's --peek variable, so phones get a narrower deck.
 */
function placement(pos: number, leaving: boolean): CSSProperties {
  if (leaving) return { transform: "translateX(-35%) scale(0.96)", opacity: 0, zIndex: 40 };
  if (pos === 0) return { transform: "none", opacity: 1, zIndex: 30 };
  if (pos === 1) return { transform: "translateX(calc(var(--peek) * 0.5)) scale(0.92)", opacity: 0.85, zIndex: 20 };
  return { transform: "translateX(var(--peek)) scale(0.84)", opacity: pos === 2 ? 0.6 : 0, zIndex: pos === 2 ? 10 : 0 };
}

/** One photo of the stacked hero deck. Posters ("contain") show in full on a light backing. */
export default function HeroCard({
  slide,
  index,
  count,
  pos,
  leaving,
  snap,
  load,
  onPick,
}: {
  slide: HeroSlide;
  index: number;
  count: number;
  pos: number;
  leaving: boolean;
  snap: boolean;
  load: boolean;
  onPick: () => void;
}) {
  const front = pos === 0 && !leaving;
  const peeking = !leaving && (pos === 1 || pos === 2);
  const poster = slide.fit === "contain";
  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={`Photo ${index + 1} of ${count}`}
      aria-hidden={!front}
      onClick={peeking ? onPick : undefined}
      style={{ ...placement(pos, leaving), transformOrigin: "right center" }}
      className={cn(
        "absolute inset-0 overflow-hidden rounded-2xl shadow-[0_30px_60px_-30px_rgba(10,42,87,0.55)] ring-1 ring-border transition-[transform,opacity] duration-[600ms] ease-out motion-reduce:transition-none",
        poster ? "bg-white" : "bg-muted",
        snap && "transition-none",
        peeking && "cursor-pointer",
        !front && !peeking && "pointer-events-none",
      )}
    >
      {load ? (
        <img
          src={slide.src}
          alt={slide.alt}
          width={1600}
          height={1066}
          loading={index === 0 ? "eager" : "lazy"}
          fetchPriority={index === 0 ? "high" : "auto"}
          decoding="async"
          draggable={false}
          className={cn("size-full", poster ? "object-contain p-2" : "object-cover object-center")}
        />
      ) : null}
    </div>
  );
}
