import { UserRound, Users } from "lucide-react";
import { SectionHeading } from "@/components/features/content/bits";
import Markdown from "@/components/features/content/markdown";
import AiPeopleGrid from "@/components/features/people/ai-people-grid";
import FeaturedMessage from "@/components/features/people/featured-message";
import { aiProgramme } from "@/lib/site";
import type { LeadershipMessage, Page } from "@/lib/types";
import { shell } from "@/lib/ui";

const STATS = [
  { value: aiProgramme.facultyChampions, label: "AI Faculty Champions", text: "Lead AI adoption in every department.", icon: Users },
  { value: aiProgramme.studentAmbassadors, label: "AI Student Ambassadors", text: "Help classmates use AI well and responsibly.", icon: UserRound },
];

/** AI-First Campus: introduction, programme figures, the Chief AI and Quantum Officer's message, and every champion and ambassador. */
export default function AiFirstSection({ page, messages }: { page: Page | null; messages: LeadershipMessage[] }) {
  return (
    <section id="ai-first-campus" className={`${shell} scroll-mt-20 pt-14`}>
      <SectionHeading title={page?.title ?? "AI-First Campus"} tone="teal" />
      <div className="mt-5 grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        {page?.body_md ? <Markdown>{page.body_md}</Markdown> : <div />}
        <div className="grid gap-4 rounded-xl border border-border border-t-[3px] border-t-t-teal bg-card p-5 shadow-xs sm:grid-cols-2 lg:grid-cols-1">
          {STATS.map(({ value, label, text, icon: Icon }) => (
            <div key={label} className="flex items-center gap-4">
              <span className="grid size-14 shrink-0 place-items-center rounded-full bg-t-teal text-white shadow-[0_0_24px_-6px_rgba(11,116,128,0.7)]">
                <Icon aria-hidden="true" className="size-7" />
              </span>
              <div>
                <p className="text-3xl font-bold leading-none text-heading">{value}</p>
                <p className="mt-1 font-semibold text-t-teal dark:text-t-teal-light">{label}</p>
                <p className="text-sm text-muted-foreground">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {messages.map((m) => (
        <div key={m.slug} className="mt-8">
          <FeaturedMessage message={m} as="div" />
        </div>
      ))}
      <div className="mt-8">
        <AiPeopleGrid compact idPrefix="home-" />
      </div>
    </section>
  );
}
