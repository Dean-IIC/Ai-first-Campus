"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BOX_H, BOX_W, portraitLayout, renderPortraitJpeg, type Natural, type Pan } from "@/lib/portrait-crop";

const NOT_OPENED = "This picture could not be opened. Try a JPG or PNG.";
const MOVES: Record<string, Pan> = {
  ArrowLeft: { x: -8, y: 0 },
  ArrowRight: { x: 8, y: 0 },
  ArrowUp: { x: 0, y: -8 },
  ArrowDown: { x: 0, y: 8 },
};

/** Portrait (3:4) crop for faculty photos: drag or use the arrow keys to position the picture; the slider zooms. */
export default function PortraitCropDialog({ src, onApply, onCancel }: { src: string; onApply: (blob: Blob) => void; onCancel: () => void }) {
  const [nat, setNat] = useState<Natural | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<Pan>({ x: 0, y: 0 });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const drag = useRef<{ px: number; py: number; x: number; y: number } | null>(null);
  const view = nat ? portraitLayout(nat, zoom, pan) : null;

  const place = (z: number, p: Pan) => {
    if (nat) setPan(portraitLayout(nat, z, p).clamped);
  };

  function onDown(e: PointerEvent<HTMLDivElement>) {
    if (!view) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { px: e.clientX, py: e.clientY, x: view.clamped.x, y: view.clamped.y };
  }

  function onMove(e: PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (d) place(zoom, { x: d.x + e.clientX - d.px, y: d.y + e.clientY - d.py });
  }

  function onKey(e: KeyboardEvent<HTMLDivElement>) {
    const m = MOVES[e.key];
    if (!view || !m) return;
    e.preventDefault();
    const k = e.shiftKey ? 3 : 1;
    place(zoom, { x: view.clamped.x + m.x * k, y: view.clamped.y + m.y * k });
  }

  async function apply() {
    if (!nat) return;
    setBusy(true);
    setError(null);
    try {
      onApply(await renderPortraitJpeg(src, nat, zoom, pan));
    } catch (err) {
      setError(err instanceof Error ? err.message : "The photo could not be saved.");
      setBusy(false);
    }
  }

  const style =
    nat && view
      ? { left: BOX_W / 2 + view.clamped.x - (nat.w * view.scale) / 2, top: BOX_H / 2 + view.clamped.y - (nat.h * view.scale) / 2, width: nat.w * view.scale, height: nat.h * view.scale }
      : { left: 0, top: 0, visibility: "hidden" as const };

  return (
    <Dialog open onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crop the photo</DialogTitle>
          <DialogDescription>Drag the picture to place the face in the frame, then use the slider to zoom.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-5">
          <div
            tabIndex={0}
            role="group"
            aria-label="Photo position. Drag the picture, or use the arrow keys to move it."
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={() => (drag.current = null)}
            onPointerCancel={() => (drag.current = null)}
            onKeyDown={onKey}
            style={{ width: BOX_W, height: BOX_H }}
            className="relative cursor-grab touch-none select-none overflow-hidden rounded-xl bg-muted ring-[3px] ring-t-teal focus-visible:outline-none focus-visible:ring-ring active:cursor-grabbing"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              draggable={false}
              onLoad={(e) => {
                const i = e.currentTarget;
                if (i.naturalWidth) setNat({ w: i.naturalWidth, h: i.naturalHeight });
                else setError(NOT_OPENED);
              }}
              onError={() => setError(NOT_OPENED)}
              className="pointer-events-none absolute max-w-none"
              style={style}
            />
          </div>
          <div className="w-full max-w-60">
            <label htmlFor="portrait-zoom" className="text-sm font-medium text-foreground">
              Zoom
            </label>
            <input
              id="portrait-zoom"
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              disabled={!nat}
              onChange={(e) => {
                const z = Number(e.target.value);
                setZoom(z);
                place(z, pan);
              }}
              className="w-full accent-t-teal"
            />
          </div>
          {error && (
            <p role="alert" className="text-sm font-medium text-destructive">
              {error}
            </p>
          )}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={apply} disabled={!nat || busy}>
            {busy ? "Saving…" : "Use this photo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
