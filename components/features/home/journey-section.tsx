import { SectionHeading } from "@/components/features/content/bits";
import { isFilled } from "@/lib/journey-model";
import type { JourneyMilestone } from "@/lib/types";
import { shell } from "@/lib/ui";
import JourneyTimeline from "./journey-timeline";

/**
 * "Our AI Transformation Journey 2026". Only the months with content are sent to visitors;
 * empty months reach a signed-in editor, who sees them with an Add button.
 */
export default function JourneySection({ milestones }: { milestones: JourneyMilestone[] }) {
  if (milestones.length === 0) return null;
  const visible = milestones.filter(isFilled);
  return (
    <section id="ai-journey" className={`${shell} scroll-mt-20 pt-14`}>
      <SectionHeading
        title="Our AI Transformation Journey 2026"
        tone="teal"
        intro="A month-by-month chronicle of how HKBK is rewriting the future of engineering education."
      />
      <JourneyTimeline visible={visible} />
    </section>
  );
}
