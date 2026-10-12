import { Eye, Quote, Target } from "lucide-react";
import Markdown from "@/components/features/content/markdown";
import Panel from "@/components/features/content/panel";
import { getPage } from "@/lib/content";
import { splitSections } from "@/lib/markdown";

/** College vision and mission, from the `vision-mission` page (Supabase or content/pages/vision-mission.md). */
export default async function VisionMission() {
  const page = await getPage("vision-mission");
  if (!page) return null;
  const { sections } = splitSections(page.body_md);
  const vision = sections.find((s) => s.id === "vision");
  const mission = sections.find((s) => s.id === "mission");
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
      {vision && (
        <Panel title="Vision" icon={Eye} tone="blue" bodyClassName="p-6">
          <blockquote className="flex gap-3">
            <Quote aria-hidden="true" className="mt-1 size-6 shrink-0 text-gold" />
            <p className="font-serif text-[1.25rem] leading-relaxed text-heading">{vision.body.replace(/\s+/g, " ")}</p>
          </blockquote>
        </Panel>
      )}
      {mission && (
        <Panel title="Mission" icon={Target} tone="blue">
          <Markdown>{mission.body}</Markdown>
        </Panel>
      )}
    </div>
  );
}
