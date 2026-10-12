/* eslint-disable @next/next/no-img-element */
import type { HTMLAttributes, ReactNode } from "react";
import { UserRound } from "lucide-react";
import { personInitials } from "@/lib/ai-people";
import { cn } from "@/lib/utils";

export type ChampionViewData = {
  index: number;
  name: string;
  designation: string;
  department: string;
  photoSrc: string | null;
};

/**
 * One AI Faculty Champion card. A filled card shows the photo with a solid teal ring (or the
 * person's initials when there is no photo), then name, designation and department. An empty
 * card shows the dashed placeholder and "Faculty Champion N / Coming soon". `children` is the
 * shared Add/Edit button, shown only to editors.
 */
export default function ChampionView({
  data: c,
  compact = false,
  liProps,
  children,
}: {
  data: ChampionViewData;
  compact?: boolean;
  liProps?: HTMLAttributes<HTMLLIElement> & Record<`data-${string}`, string>;
  children?: ReactNode;
}) {
  const filled = Boolean(c.name);
  const label = `Faculty Champion ${c.index}`;
  const detail = [c.designation, c.department].filter(Boolean).join(", ");
  const alt = `Photo of ${filled ? c.name : label}${detail ? `, ${detail}` : ""}`;
  const px = compact ? 80 : 120;
  const size = compact ? "size-20" : "size-30";

  const picture = c.photoSrc ? (
    <img
      src={c.photoSrc}
      alt={alt}
      width={px}
      height={px}
      loading="lazy"
      decoding="async"
      className={cn(size, "rounded-full object-cover object-center ring-[3px] ring-t-teal ring-offset-2 ring-offset-card")}
    />
  ) : filled ? (
    <span
      aria-hidden="true"
      className={cn(size, "grid place-items-center rounded-full bg-t-teal-tint font-semibold text-t-teal ring-[3px] ring-t-teal ring-offset-2 ring-offset-card dark:text-t-teal-light", compact ? "text-xl" : "text-3xl")}
    >
      {personInitials(c.name)}
    </span>
  ) : (
    <span className={cn(size, "grid place-items-center rounded-full border-2 border-dashed border-t-teal/40 bg-card text-t-teal/60")}>
      <UserRound aria-hidden="true" className={compact ? "size-7" : "size-10"} />
    </span>
  );

  return (
    <li
      {...liProps}
      aria-label={filled ? undefined : `${label}: to be announced`}
      className={cn(
        "relative flex h-full flex-col items-center rounded-xl text-center transition duration-200 motion-safe:hover:-translate-y-1 hover:shadow-md",
        compact ? "p-3" : "p-5",
        filled ? "border border-border bg-card shadow-xs" : "border border-dashed border-border bg-muted",
      )}
    >
      {picture}
      {filled ? (
        <>
          <p className={cn("mt-4 font-bold leading-snug break-words text-heading", compact ? "text-sm" : "text-base")}>{c.name}</p>
          {c.designation && (
            <p className={cn("mt-0.5 font-medium break-words text-foreground text-balance", compact ? "text-xs" : "text-sm")}>{c.designation}</p>
          )}
          {c.department && <p className="mt-0.5 text-xs break-words text-muted-foreground text-balance">{c.department}</p>}
        </>
      ) : (
        <>
          <p className={cn("mt-4 font-semibold text-heading", compact ? "text-xs" : "text-sm")}>{label}</p>
          <p className={cn("text-muted-foreground", compact ? "text-[0.6875rem]" : "text-xs")}>Coming soon</p>
        </>
      )}
      {children}
    </li>
  );
}
