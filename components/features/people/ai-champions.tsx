import Link from "next/link";
import { UserRound, Users } from "lucide-react";
import Panel from "@/components/features/content/panel";
import { aiProgramme } from "@/lib/site";

/** Summary of the AI Champions programme, linking to the grids with every person. */
export default function AiChampions() {
  const groups = [
    {
      title: "AI Faculty Champions",
      count: aiProgramme.facultyChampions,
      icon: Users,
      text: "Faculty members who lead AI adoption in their departments.",
      href: "/ai-quantum#faculty-champions",
    },
    {
      title: "AI Student Ambassadors",
      count: aiProgramme.studentAmbassadors,
      icon: UserRound,
      text: "Students who help classmates use AI tools well and responsibly.",
      href: "/ai-quantum#student-ambassadors",
    },
  ];
  return (
    <Panel id="ai-champions" title="AI Champions and Ambassadors" icon={Users} tone="teal">
      <div className="grid gap-5 md:grid-cols-2">
        {groups.map(({ title, count, icon: Icon, text, href }) => (
          <div key={title} className="flex gap-4 rounded-lg bg-t-teal-tint p-5">
            <span className="grid size-14 shrink-0 place-items-center rounded-full bg-t-teal text-white">
              <Icon aria-hidden="true" className="size-7" />
            </span>
            <div>
              <p className="text-4xl font-bold leading-none text-heading">{count}</p>
              <p className="mt-1 font-semibold text-t-teal dark:text-t-teal-light">{title}</p>
              <p className="mt-2 text-sm text-foreground">{text}</p>
              <Link href={href} className="mt-2 inline-block text-sm font-semibold text-primary hover:underline hover:underline-offset-4">
                See all {count}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
