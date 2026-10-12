import { isShippedChampionPhoto } from "@/lib/ai-people";
import type { AiPerson } from "@/lib/types";
import ChampionView from "./champion-view";
import PersonEditButton from "./person-edit-button";

/**
 * One AI Faculty Champion slot. It uses the same slot markers, Add/Edit button, form and save
 * logic as the AI Student Ambassadors (PersonSlot); only the card design is the faculty design.
 * The person's designation is stored in ai_people.bio, as it is for ambassadors.
 */
export default function FacultyCard({
  person,
  index,
  compact = false,
  departments = [],
}: {
  person?: AiPerson;
  index: number;
  compact?: boolean;
  departments?: string[];
}) {
  const slot = `faculty-${String(index).padStart(2, "0")}`;
  const label = "Faculty Champion";
  const photo = person?.photo_url ?? null;
  const slotAttrs: Record<`data-${string}`, string> = {
    "data-person-slot": slot,
    "data-slot-label": label,
    "data-slot-index": String(index),
    "data-compact": compact ? "1" : "0",
  };
  // The shipped photo's key and the saved values let the preview's editor show this person.
  if (person) {
    slotAttrs["data-person-name"] = person.name;
    slotAttrs["data-person-department"] = person.department ?? "";
    slotAttrs["data-person-bio"] = person.bio ?? "";
    if (photo && isShippedChampionPhoto(photo)) slotAttrs["data-person-photo-key"] = photo.replace(/^\/images\//, "");
  }
  return (
    <ChampionView
      compact={compact}
      liProps={slotAttrs}
      data={{ index, name: person?.name ?? "", designation: person?.bio ?? "", department: person?.department ?? "", photoSrc: photo }}
    >
      <PersonEditButton
        departments={departments}
        person={{
          slug: person?.slug ?? null,
          role: "Faculty champion",
          index,
          label,
          name: person?.name ?? "",
          department: person?.department ?? "",
          bio: person?.bio ?? "",
          photoUrl: photo,
        }}
      />
    </ChampionView>
  );
}
