/* eslint-disable @next/next/no-img-element */
import type { HTMLAttributes, ReactNode } from "react";
import { UserRound } from "lucide-react";
import { personInitials } from "@/lib/ai-people";

export type AmbassadorViewData = { index: number; name: string; department: string; bio: string; photoSrc: string | null };

/**
 * One AI Student Ambassador card: the person (photo or initials, name, department, year), or a
 * numbered placeholder. `children` holds the admin's buttons, shown only when signed in.
 */
export default function AmbassadorView({
  data: p,
  compact = false,
  liProps,
  children,
}: {
  data: AmbassadorViewData;
  compact?: boolean;
  liProps?: HTMLAttributes<HTMLLIElement> & Record<`data-${string}`, string>;
  children?: ReactNode;
}) {
  const label = "Student Ambassador";
  const avatar = compact ? "size-16" : "size-24";
  const pad = compact ? "p-3" : "p-4";
  if (p.name) {
    return (
      <li {...liProps} className={`relative flex flex-col items-center rounded-lg border border-border bg-card ${pad} text-center`}>
        {p.photoSrc ? (
          <img src={p.photoSrc} alt={`Photo of ${p.name}`} className={`${avatar} rounded-full object-cover ring-4 ring-t-teal-tint`} />
        ) : (
          <span aria-hidden="true" className={`grid ${avatar} place-items-center rounded-full bg-t-teal-tint font-semibold text-t-teal dark:text-t-teal-light ring-4 ring-t-teal-tint`}>
            {personInitials(p.name)}
          </span>
        )}
        <p className="mt-2.5 text-sm font-semibold leading-snug text-heading">{p.name}</p>
        {p.department && <p className="text-xs text-muted-foreground">{p.department}</p>}
        {p.bio && <p className="text-xs text-muted-foreground">{p.bio}</p>}
        {children}
      </li>
    );
  }
  return (
    <li
      {...liProps}
      className={`relative flex flex-col items-center rounded-lg border border-dashed border-border bg-muted ${pad} text-center`}
      aria-label={`${label} ${p.index}: to be announced`}
    >
      <span className={`grid ${avatar} place-items-center rounded-full border-2 border-dashed border-t-teal/30 bg-card text-t-teal/50`}>
        <UserRound aria-hidden="true" className={compact ? "size-7" : "size-10"} />
      </span>
      <p className={`mt-2.5 font-semibold leading-snug text-heading ${compact ? "text-xs" : "text-sm"}`}>
        {label}&nbsp;{p.index}
      </p>
      <p className={`text-muted-foreground ${compact ? "text-[0.6875rem]" : "text-xs"}`}>{compact ? "Coming soon" : "Photo and name coming soon"}</p>
      {children}
    </li>
  );
}
