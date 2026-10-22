import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A gallery-style frame: a thin green-to-teal border, a light mat and a fine inner line around the
 * photo. The photo is always shown whole (never cropped); `fixed` keeps a 16:9 window for card grids.
 */
export default function AchievementFrame({ src, alt, fixed = true, className }: { src: string | null; alt: string; fixed?: boolean; className?: string }) {
  return (
    <div className={cn("rounded-2xl bg-gradient-to-br from-t-green via-t-teal to-t-blue p-[3px] shadow-[0_18px_40px_-28px_rgba(10,42,87,0.6)]", className)}>
      <div className="rounded-[13px] bg-card p-2.5 sm:p-3">
        <div className={cn("overflow-hidden rounded-lg bg-muted/50 ring-1 ring-border", fixed && "aspect-video")}>
          {src ? (
            <img src={src} alt={alt} loading="lazy" className={cn("w-full object-contain", fixed ? "size-full" : "max-h-[70vh]")} />
          ) : (
            <span className="flex size-full min-h-40 flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
              <ImageIcon aria-hidden="true" className="size-8" />
              Photo to be added
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
