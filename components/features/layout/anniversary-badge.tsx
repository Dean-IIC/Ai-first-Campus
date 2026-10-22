/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { images } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The "30 Years of Excellence" badge (1997–2027), on a transparent background so it suits light
 * and dark mode. `small` uses the lighter file for sizes up to about 48 px; `link` makes it open
 * the About page.
 */
export default function AnniversaryBadge({ className, small = false, link = false }: { className?: string; small?: boolean; link?: boolean }) {
  const { src, srcSm, alt, width, height } = images.anniversary;
  const img = <img src={small ? srcSm : src} alt={alt} title={alt} width={width} height={height} className={cn("w-auto shrink-0", className)} />;
  if (!link) return img;
  return (
    <Link href="/about" className="shrink-0 rounded-md transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring motion-reduce:transition-none motion-reduce:hover:scale-100">
      {img}
    </Link>
  );
}
