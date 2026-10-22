import { UserRound } from "lucide-react";
import { initials } from "@/lib/format";
import type { Faculty } from "@/lib/types";

/** Shown before any faculty member is added: one empty portrait frame and a note. */
function NoFacultyYet() {
  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row">
      <div aria-hidden="true" className="grid aspect-[3/4] w-36 shrink-0 place-items-center rounded-xl border-2 border-dashed border-border bg-muted/40 text-muted-foreground">
        <UserRound className="size-10" />
      </div>
      <div className="text-center sm:text-left">
        <h2 className="text-lg font-semibold text-heading">Faculty</h2>
        <p className="mt-1 text-muted-foreground">Faculty profiles, with photo, designation and qualification, will be added here.</p>
      </div>
    </div>
  );
}

/** Faculty cards: a portrait photo (initials until one is uploaded), then name, designation and qualification. */
export default function DepartmentFaculty({ faculty }: { faculty: Faculty[] }) {
  if (faculty.length === 0) return <NoFacultyYet />;
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {faculty.map((f) => (
        <li key={f.slug} className="overflow-hidden rounded-xl border border-border bg-card shadow-[0_12px_30px_-26px_rgba(10,42,87,0.5)]">
          {f.photo_url ? (
            <img src={f.photo_url} alt={f.name} width={600} height={800} loading="lazy" className="aspect-[3/4] w-full object-cover" />
          ) : (
            <div aria-hidden="true" className="grid aspect-[3/4] w-full place-items-center bg-t-green-tint font-serif text-4xl font-bold text-t-green dark:text-t-green-light">
              {initials(f.name)}
            </div>
          )}
          <div className="px-3 py-3.5 text-center">
            <p className="font-semibold leading-snug text-heading">{f.name}</p>
            {f.designation && <p className="mt-1 text-sm font-medium text-t-green dark:text-t-green-light">{f.designation}</p>}
            {f.qualification && <p className="mt-0.5 text-sm text-muted-foreground">{f.qualification}</p>}
          </div>
        </li>
      ))}
    </ul>
  );
}
