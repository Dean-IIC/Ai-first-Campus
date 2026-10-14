"use client";

import { useRef, useState, type PointerEvent, type RefObject } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import Logo from "@/components/features/layout/logo";
import { sectionFor, type MenuSection } from "@/lib/menu";
import MobileMenuItem from "./mobile-menu-item";

/**
 * The slide-in menu for phones and tablets: a navy panel from the right over a dimmed page.
 * Radix Dialog keeps keyboard focus inside, closes on Escape or a tap on the overlay, and stops
 * the page behind from scrolling. Tapping a link or swiping the panel to the right also closes it.
 */
export default function MobileMenuPanel({
  menu,
  open,
  onOpenChange,
  pathname,
  returnFocus,
}: {
  menu: MenuSection[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pathname: string;
  /** The ☰ button, which gets keyboard focus back when the panel closes. */
  returnFocus: RefObject<HTMLButtonElement | null>;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [drag, setDrag] = useState(0);
  const start = useRef<{ x: number; y: number; dx: number } | null>(null);
  const active = sectionFor(pathname, menu)?.label;

  function onDown(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "mouse") return;
    start.current = { x: e.clientX, y: e.clientY, dx: 0 };
  }
  function onMove(e: PointerEvent<HTMLDivElement>) {
    const s = start.current;
    if (!s) return;
    const dx = e.clientX - s.x;
    // Follow the finger only for a mostly sideways swipe, so the list still scrolls up and down.
    if (dx > 0 && Math.abs(dx) > Math.abs(e.clientY - s.y)) {
      s.dx = dx;
      setDrag(dx);
    }
  }
  function onUp() {
    if ((start.current?.dx ?? 0) > 80) onOpenChange(false);
    start.current = null;
    setDrag(0);
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[70] bg-black/55 backdrop-blur-[1px] duration-300 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 lg:hidden" />
        <DialogPrimitive.Content
          id="mobile-menu"
          aria-describedby={undefined}
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            returnFocus.current?.focus();
          }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("a")) onOpenChange(false);
          }}
          style={drag ? { transform: `translateX(${drag}px)`, transition: "none" } : undefined}
          className="fixed inset-y-0 right-0 z-[71] flex w-[85vw] max-w-[360px] flex-col bg-brand-dark text-white shadow-2xl outline-none duration-300 ease-out data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right lg:hidden"
        >
          <div className="flex items-center gap-3 border-b border-white/15 px-4 py-3">
            <span className="rounded-full bg-white p-0.5">
              <Logo size="xs" />
            </span>
            <DialogPrimitive.Title className="flex-1 text-lg font-bold">Menu</DialogPrimitive.Title>
            <DialogPrimitive.Close
              aria-label="Close menu"
              className="grid size-11 place-items-center rounded-full text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-gold/70"
            >
              <X aria-hidden="true" className="size-6" />
            </DialogPrimitive.Close>
          </div>
          <nav aria-label="Mobile" className="flex-1 touch-pan-y overflow-y-auto overscroll-contain">
            <ul className="divide-y divide-white/10">
              {menu.map((section) => (
                <MobileMenuItem
                  key={section.label}
                  section={section}
                  pathname={pathname}
                  active={active === section.label}
                  expanded={expanded === section.label}
                  onToggle={() => setExpanded((x) => (x === section.label ? null : section.label))}
                />
              ))}
            </ul>
          </nav>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
