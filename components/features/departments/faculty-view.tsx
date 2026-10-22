import { UserRound } from "lucide-react";
import { initials } from "@/lib/format";
import type { Faculty } from "@/lib/types";

/** Shown before any faculty member is added: one empty portrait frame and a note. */
export function NoFacultyYet() {
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

/** A portrait photo, or the person's initials until one is uploaded. */
function Portrait({ person, className }: { person: Faculty; className: string }) {
  if (person.photo_url) return <img src={person.photo_url} alt={person.name} width={600} height={800} loading="lazy" className={`aspect-[3/4] object-cover ${className}`} />;
  return (
    <div aria-hidden="true" className={`grid aspect-[3/4] place-items-center bg-t-green-tint font-serif text-4xl font-bold text-t-green dark:text-t-green-light ${className}`}>
      {initials(person.name)}
    </div>
  );
}

/** The head of department: a wider card with the photo beside the details. `children` holds the admin buttons. */
export function HodCard({ person, children }: { person: Faculty; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[0_18px_40px_-30px_rgba(10,42,87,0.5)] sm:flex-row">
      <Portrait person={person} className="w-full sm:w-52" />
      <div className="flex flex-col justify-center gap-1 p-5 sm:p-7">
        <span className="text-sm font-semibold uppercase tracking-wide text-t-green dark:text-t-green-light">Head of the Department</span>
        <p className="text-xl font-bold text-heading">{person.name}</p>
        {person.designation && <p className="font-medium text-foreground">{person.designation}</p>}
        {person.qualification && <p className="text-muted-foreground">{person.qualification}</p>}
        {children}
      </div>
    </div>
  );
}

/** One faculty member: portrait, then name, designation and qualification. `children` holds the admin buttons. */
export function FacultyCard({ person, children }: { person: Faculty; children?: React.ReactNode }) {
  return (
    <div className="h-full overflow-hidden rounded-xl border border-border bg-card shadow-[0_12px_30px_-26px_rgba(10,42,87,0.5)]">
      <Portrait person={person} className="w-full" />
      <div className="px-3 py-3.5 text-center">
        <p className="font-semibold leading-snug text-heading">{person.name}</p>
        {person.designation && <p className="mt-1 text-sm font-medium text-t-green dark:text-t-green-light">{person.designation}</p>}
        {person.qualification && <p className="mt-0.5 text-sm text-muted-foreground">{person.qualification}</p>}
        {children}
      </div>
    </div>
  );
}
