"use client";

import { useRef, type HTMLAttributes } from "react";
import type { JourneyMilestone } from "@/lib/types";

/**
 * Drag to reorder for the editor's timeline. Dragging starts from the card's text, not from its
 * fields or buttons, so typing and clicking still work. `onMoved` receives the new full order.
 */
export function useJourneyDrag(all: JourneyMilestone[] | null, onMoved: (next: JourneyMilestone[]) => void) {
  const dragging = useRef<string | null>(null);

  return (slug: string): HTMLAttributes<HTMLLIElement> => ({
    draggable: true,
    onDragStart: (e) => {
      if ((e.target as HTMLElement).closest("input, textarea, button")) {
        e.preventDefault();
        return;
      }
      dragging.current = slug;
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", slug);
    },
    onDragOver: (e) => {
      if (!dragging.current) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    },
    onDrop: (e) => {
      e.preventDefault();
      const from = dragging.current;
      dragging.current = null;
      if (!from || !all) return;
      const i = all.findIndex((m) => m.slug === from);
      const j = all.findIndex((m) => m.slug === slug);
      if (i < 0 || j < 0 || i === j) return;
      const next = [...all];
      const [item] = next.splice(i, 1);
      next.splice(j, 0, item);
      onMoved(next);
    },
    onDragEnd: () => {
      dragging.current = null;
    },
  });
}
