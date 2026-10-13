import { UserRound, Users } from "lucide-react";
import Panel from "@/components/features/content/panel";
import EditableText from "@/components/features/cms/editable-text";
import AddPersonCard from "@/components/features/people/add-person-card";
import PeopleEditorProvider from "@/components/features/people/people-editor";
import PersonCard from "@/components/features/people/person-card";
import { getList } from "@/lib/content";
import { aiProgramme } from "@/lib/site";
import type { AiPerson } from "@/lib/types";

const FACULTY_TEXT =
  "Faculty members who lead AI adoption in their departments: redesigning courses, mentoring colleagues and reviewing how AI is used in teaching and assessment.";
const AMBASSADOR_TEXT =
  "Students who run peer workshops, help classmates use AI tools well and responsibly, and bring student ideas to the AI office.";

/**
 * Puts each student ambassador in the card numbered by their sort_order (the position the
 * editor saved), keeps the rest as empty placeholders, and adds anyone without a free
 * position to the first empty card or the end.
 */
function placeCards(rows: AiPerson[], count: number): (AiPerson | undefined)[] {
  const byPos = new Map<number, AiPerson>();
  const extra: AiPerson[] = [];
  for (const r of [...rows].sort((a, b) => a.sort_order - b.sort_order)) {
    if (r.sort_order >= 1 && !byPos.has(r.sort_order)) byPos.set(r.sort_order, r);
    else extra.push(r);
  }
  const size = Math.max(count, ...byPos.keys());
  const cards: (AiPerson | undefined)[] = Array.from({ length: size }, (_, i) => byPos.get(i + 1));
  for (const e of extra) {
    const free = cards.findIndex((c) => !c);
    if (free >= 0) cards[free] = e;
    else cards.push(e);
  }
  return cards;
}

/**
 * The AI Faculty Champions and AI Student Ambassadors both come from the ai_people list and
 * are edited the same way, on the cards themselves (PersonCard): people fill the card matching
 * their sort_order, the rest stay as numbered placeholders up to the programme size, and the
 * admin's "Add new" card adds people after them. The heading counts the cards.
 */
export default async function AiPeopleGrid({ compact = false, idPrefix = "" }: { compact?: boolean; idPrefix?: string }) {
  const [people, departments] = await Promise.all([getList("ai_people"), getList("departments")]);
  const deptNames = departments.map((d) => d.name);
  const facultyCount = aiProgramme.facultyChampions;
  const faculty = placeCards(
    people.filter((p) => p.role === "Faculty champion"),
    facultyCount,
  );
  const count = aiProgramme.studentAmbassadors;
  const cards = placeCards(
    people.filter((p) => p.role === "Student ambassador"),
    count,
  );
  const facultyCols = compact ? "grid-cols-3 gap-3 sm:grid-cols-5" : "grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3";
  const cols = compact ? "grid-cols-3 sm:grid-cols-5 lg:grid-cols-10" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";
  return (
    <PeopleEditorProvider people={people} departments={deptNames}>
      <div className="space-y-6">
        <Panel id={`${idPrefix}faculty-champions`} title={`AI Faculty Champions (${faculty.length})`} icon={Users} tone="teal">
          <EditableText as="p" id="champions.intro" className="max-w-[70ch] text-muted-foreground">
            {FACULTY_TEXT}
          </EditableText>
          <ul className={`mt-5 grid ${facultyCols}`}>
            {faculty.map((person, i) => (
              <PersonCard key={i} role="Faculty champion" index={i + 1} person={person} compact={compact} />
            ))}
            <AddPersonCard role="Faculty champion" next={faculty.length + 1} compact={compact} />
          </ul>
        </Panel>
        <Panel id={`${idPrefix}student-ambassadors`} title={`AI Student Ambassadors (${cards.length})`} icon={UserRound} tone="teal">
          <p className="max-w-[70ch] text-muted-foreground">{AMBASSADOR_TEXT}</p>
          <ul className={`mt-5 grid gap-3 ${cols}`}>
            {cards.map((person, i) => (
              <PersonCard key={i} role="Student ambassador" index={i + 1} person={person} compact={compact} />
            ))}
            <AddPersonCard role="Student ambassador" next={cards.length + 1} compact={compact} />
          </ul>
        </Panel>
      </div>
    </PeopleEditorProvider>
  );
}
