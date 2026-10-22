import { ImageIcon, Trophy } from "lucide-react";
import type { Department } from "@/lib/types";

/** The department's achievements: a framed photo (an empty frame until one is uploaded) beside the text. */
export default function DepartmentAchievements({ department: d }: { department: Department }) {
  const text = (d.achievements ?? "").split("\n").map((s) => s.trim()).filter(Boolean);
  return (
    <div className="grid items-center gap-6 md:grid-cols-2">
      <figure className="rounded-2xl border border-border bg-card p-2.5 shadow-[0_18px_40px_-30px_rgba(10,42,87,0.5)]">
        {d.achievements_image ? (
          <img
            src={d.achievements_image}
            alt={`Achievement of the Department of ${d.name}`}
            width={1600}
            height={1200}
            loading="lazy"
            className="aspect-[4/3] w-full rounded-xl object-cover"
          />
        ) : (
          <div className="grid aspect-[4/3] w-full place-items-center rounded-xl border-2 border-dashed border-border bg-muted/40 text-muted-foreground">
            <span className="flex flex-col items-center gap-2 text-sm">
              <ImageIcon aria-hidden="true" className="size-8" />
              Photo to be added
            </span>
          </div>
        )}
      </figure>
      <div>
        <span className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-t-amber to-t-rose text-white">
          <Trophy aria-hidden="true" className="size-5" />
        </span>
        <h2 className="mt-3 text-lg font-semibold text-heading">Achievements</h2>
        {text.map((p) => (
          <p key={p} className="mt-2 leading-relaxed text-foreground">
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}

/** True when the department has an achievement to show. */
export const hasAchievements = (d: Department) => Boolean((d.achievements ?? "").trim() || d.achievements_image);
