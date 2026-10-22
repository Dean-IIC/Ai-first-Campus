import type { Achievement } from "@/lib/achievements";
import AchievementList from "./achievement-list";
import AchievementsEditorProvider from "./achievements-editor";

/** The department's achievements: framed cards that open on click, edited on the tab by the signed-in admin. */
export default function DepartmentAchievements({ items, department }: { items: Achievement[]; department: string }) {
  return (
    <AchievementsEditorProvider items={items} department={department}>
      <AchievementList />
    </AchievementsEditorProvider>
  );
}
