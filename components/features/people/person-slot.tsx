/* eslint-disable @next/next/no-img-element */
import { UserRound } from "lucide-react";
import { personInitials } from "@/lib/ai-people";
import type { AiPerson } from "@/lib/types";
import PersonEditButton from "./person-edit-button";

/** One card in the AI Champions or Ambassadors grid: a real person, or a numbered placeholder. */
export default function PersonSlot({
  person,
  label,
  index,
  slot,
  compact = false,
  departments = [],
}: {
  person?: AiPerson;
  label: string;
  index: number;
  /** Stable card id, e.g. "faculty-03" or "ambassador-12"; used by editors to fill this card. */
  slot: string;
  compact?: boolean;
  /** Department names suggested in the edit form. */
  departments?: string[];
}) {
  const edit = (
    <PersonEditButton
      departments={departments}
      person={{
        slug: person?.slug ?? null,
        role: person?.role ?? (slot.startsWith("faculty") ? "Faculty champion" : "Student ambassador"),
        index,
        label,
        name: person?.name ?? "",
        department: person?.department ?? "",
        bio: person?.bio ?? "",
        photoUrl: person?.photo_url ?? null,
      }}
    />
  );
  const slotAttrs = { "data-person-slot": slot, "data-slot-label": label, "data-slot-index": String(index), "data-compact": compact ? "1" : "0" };
  const avatar = compact ? "size-16" : "size-24";
  const icon = compact ? "size-7" : "size-10";
  const pad = compact ? "p-3" : "p-4";
  if (person) {
    return (
      <li {...slotAttrs} className={`relative flex flex-col items-center rounded-lg border border-border bg-card ${pad} text-center`}>
        {person.photo_url ? (
          <img src={person.photo_url} alt={`Photo of ${person.name}`} className={`${avatar} rounded-full object-cover ring-4 ring-t-teal-tint`} />
        ) : (
          <span aria-hidden="true" className={`grid ${avatar} place-items-center rounded-full bg-t-teal-tint font-semibold text-t-teal dark:text-t-teal-light ring-4 ring-t-teal-tint`}>
            {personInitials(person.name)}
          </span>
        )}
        <p className="mt-2.5 text-sm font-semibold leading-snug text-heading">{person.name}</p>
        {person.department && <p className="text-xs text-muted-foreground">{person.department}</p>}
        {person.bio && <p className="text-xs text-muted-foreground">{person.bio}</p>}
        {edit}
      </li>
    );
  }
  return (
    <li
      {...slotAttrs}
      className={`relative flex flex-col items-center rounded-lg border border-dashed border-border bg-muted ${pad} text-center`}
      aria-label={`${label} ${index}: to be announced`}
    >
      <span className={`grid ${avatar} place-items-center rounded-full border-2 border-dashed border-t-teal/30 bg-card text-t-teal/50`}>
        <UserRound aria-hidden="true" className={icon} />
      </span>
      <p className={`mt-2.5 font-semibold leading-snug text-heading ${compact ? "text-xs" : "text-sm"}`}>
        {label}&nbsp;{index}
      </p>
      <p className={`text-muted-foreground ${compact ? "text-[0.6875rem]" : "text-xs"}`}>{compact ? "Coming soon" : "Photo and name coming soon"}</p>
      {edit}
    </li>
  );
}
