"use client";

import { useState } from "react";
import { Trophy } from "lucide-react";
import { navyPill } from "@/lib/ui";
import AchievementCard from "./achievement-card";
import AchievementCardForm from "./achievement-card-form";
import { useAchievementsEditor } from "./achievements-editor";

/** The department's achievements as framed cards (click one to open it), with the admin's Add achievement on top. */
export default function AchievementList() {
  const { admin, rows } = useAchievementsEditor();
  const [adding, setAdding] = useState(false);

  return (
    <div className="space-y-6">
      {admin &&
        (adding ? (
          <AchievementCardForm onDone={() => setAdding(false)} />
        ) : (
          <button type="button" className={navyPill} onClick={() => setAdding(true)}>
            <span aria-hidden="true">➕</span> Add achievement
          </button>
        ))}
      {rows.length === 0 ? (
        <div className="flex items-center gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-t-amber to-t-rose text-white">
            <Trophy aria-hidden="true" className="size-5" />
          </span>
          <p className="text-muted-foreground">The department&apos;s achievements will be added here.</p>
        </div>
      ) : (
        <ul className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((a) => (
            <li key={a.id}>
              <AchievementCard item={a} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
