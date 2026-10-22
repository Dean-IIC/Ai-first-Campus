"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import type { HeroSlide } from "@/lib/carousel";
import { cn } from "@/lib/utils";
import HeroCard from "./hero-card";
import { CarouselControls, SlideBadge } from "./hero-carousel-parts";

const INTERVAL = 5000;
const MOVE_MS = 600;

/**
 * The home page photos as a stacked deck: the front photo with the next two peeking out on the
 * right. Every five seconds the front photo slides out to the back and the next one moves forward.
 * Pauses while the mouse is over it, and a tap pauses or resumes it. Arrows, dots, swiping and
 * clicking a peeking photo change the photo. Visitors who prefer reduced motion get no auto-play
 * and no animation. Only photos that are, or have been, near the front are loaded.
 */
export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const n = slides.length;
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);
  const [snap, setSnap] = useState<number | null>(null);
  const [hovered, setHovered] = useState(false);
  const [tapPaused, setTapPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set([0, 1 % n, 2 % n]));
  const touch = useRef<{ x: number; y: number } | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const go = useCallback(
    (target: number, slideOut = false) => {
      if (n < 2) return;
      const next = (target + n) % n;
      if (next === index) return;
      window.clearTimeout(timer.current);
      setLeaving(slideOut && !reduced ? index : null);
      setIndex(next);
      setLoaded((s) => new Set([...s, next, (next + 1) % n, (next + 2) % n]));
      if (slideOut && !reduced) {
        const gone = index;
        timer.current = window.setTimeout(() => {
          setLeaving(null);
          setSnap(gone);
          requestAnimationFrame(() => requestAnimationFrame(() => setSnap(null)));
        }, MOVE_MS);
      }
    },
    [n, index, reduced],
  );

  useEffect(() => {
    if (n < 2 || hovered || tapPaused || reduced) return;
    const t = window.setInterval(() => go(index + 1, true), INTERVAL);
    return () => window.clearInterval(t);
  }, [n, hovered, tapPaused, reduced, index, go]);

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") touch.current = { x: e.clientX, y: e.clientY };
  }
  function onPointerUp(e: PointerEvent<HTMLDivElement>) {
    const start = touch.current;
    touch.current = null;
    if (!start || n < 2) return;
    const dx = e.clientX - start.x;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(e.clientY - start.y)) go(index + (dx < 0 ? 1 : -1), dx < 0);
    else if (Math.abs(dx) < 10) setTapPaused((p) => !p);
  }

  const slide = slides[index];
  const badge = Boolean(slide.title || slide.subtitle);
  return (
    <figure className="relative">
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Campus photos"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (touch.current = null)}
        className={n > 1 ? "touch-pan-y pr-6 [--peek:24px] sm:pr-8 sm:[--peek:32px] lg:pr-11 lg:[--peek:44px]" : undefined}
      >
        <div className="relative aspect-[3/2]">
          {slides.map((s, i) => (
            <HeroCard
              key={`${s.src}-${i}`}
              slide={s}
              index={i}
              count={n}
              pos={(i - index + n) % n}
              leaving={leaving === i}
              snap={snap === i}
              load={loaded.has(i)}
              onPick={() => go(i)}
            />
          ))}
          <SlideBadge title={slide.title} subtitle={slide.subtitle} />
        </div>
      </div>
      {n > 1 && (
        // Under the badge on phones; beside it, on the right, from the sm breakpoint.
        <div className={cn("flex justify-center sm:mt-8 sm:justify-end", badge ? "mt-[4.75rem]" : "mt-6")}>
          <CarouselControls count={n} index={index} onPrev={() => go(index - 1)} onNext={() => go(index + 1, true)} onSelect={(i) => go(i)} />
        </div>
      )}
    </figure>
  );
}
