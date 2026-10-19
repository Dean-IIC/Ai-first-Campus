"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import type { HeroSlide } from "@/lib/carousel";
import { CarouselArrows, CarouselDots, SlideBadge } from "./hero-carousel-parts";

const INTERVAL = 5000;

/**
 * The home page photo carousel, in the frame the single campus photo used. Slides every five
 * seconds; pauses while the mouse is over it, and a tap pauses or resumes it. Arrows, dots and
 * swiping change the photo. Visitors who prefer reduced motion get no auto-play and no animation.
 * Only the current photo and its neighbours are loaded.
 */
export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const n = slides.length;
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [tapPaused, setTapPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set([0, 1 % n]));
  const touch = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const go = useCallback(
    (i: number) => {
      const next = (i + n) % n;
      setIndex(next);
      setLoaded((s) => new Set([...s, next, (next + 1) % n, (next - 1 + n) % n]));
    },
    [n],
  );

  useEffect(() => {
    if (n < 2 || hovered || tapPaused || reduced) return;
    const t = window.setInterval(() => go(index + 1), INTERVAL);
    return () => window.clearInterval(t);
  }, [n, hovered, tapPaused, reduced, index, go]);

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") touch.current = { x: e.clientX, y: e.clientY };
  }
  function onPointerUp(e: PointerEvent<HTMLDivElement>) {
    const start = touch.current;
    touch.current = null;
    if (!start || n < 2 || (e.target as HTMLElement).closest("button")) return;
    const dx = e.clientX - start.x;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(e.clientY - start.y)) go(index + (dx < 0 ? 1 : -1));
    else if (Math.abs(dx) < 10) setTapPaused((p) => !p);
  }

  const slide = slides[index];
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
        className="group relative touch-pan-y overflow-hidden rounded-2xl shadow-[0_30px_60px_-30px_rgba(10,42,87,0.55)] ring-1 ring-border"
      >
        <div className="flex transition-transform duration-500 ease-out motion-reduce:transition-none" style={{ transform: `translateX(-${index * 100}%)` }}>
          {slides.map((s, i) => (
            <div key={`${s.src}-${i}`} role="group" aria-roledescription="slide" aria-label={`Photo ${i + 1} of ${n}`} aria-hidden={i !== index} className="w-full shrink-0">
              {loaded.has(i) ? (
                <img
                  src={s.src}
                  alt={s.alt}
                  width={1600}
                  height={1066}
                  loading={i === 0 ? "eager" : "lazy"}
                  fetchPriority={i === 0 ? "high" : "auto"}
                  decoding="async"
                  draggable={false}
                  className="aspect-[3/2] w-full object-cover object-center"
                />
              ) : (
                <div className="aspect-[3/2] w-full bg-muted" />
              )}
            </div>
          ))}
        </div>
        {n > 1 && (
          <>
            <CarouselArrows onPrev={() => go(index - 1)} onNext={() => go(index + 1)} />
            <CarouselDots count={n} index={index} onSelect={go} />
          </>
        )}
      </div>
      <SlideBadge title={slide.title} subtitle={slide.subtitle} />
    </figure>
  );
}
