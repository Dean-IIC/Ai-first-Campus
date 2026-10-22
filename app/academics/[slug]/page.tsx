import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContentTabs from "@/components/features/content/content-tabs";
import DepartmentAchievements, { hasAchievements } from "@/components/features/departments/department-achievements";
import DepartmentCareers, { hasCareers } from "@/components/features/departments/department-careers";
import DepartmentCurriculum from "@/components/features/departments/department-curriculum";
import DepartmentFacts from "@/components/features/departments/department-facts";
import DepartmentFaculty from "@/components/features/departments/department-faculty";
import FacultyEditorProvider from "@/components/features/departments/faculty-editor";
import DepartmentOutcomes, { hasOutcomes } from "@/components/features/departments/department-outcomes";
import DepartmentOverview from "@/components/features/departments/department-overview";
import DepartmentResearch from "@/components/features/departments/department-research";
import DepartmentVisionMission from "@/components/features/departments/department-vision-mission";
import PageBanner from "@/components/features/layout/page-banner";
import { getList } from "@/lib/content";
import { hasExtendedPage, linesOf } from "@/lib/department-sections";
import { NO_STATEMENT_KINDS } from "@/lib/site";
import { shell } from "@/lib/ui";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

async function findDepartment(slug: string) {
  const departments = await getList("departments");
  return { department: departments.find((d) => d.slug === slug), departments };
}

export async function generateStaticParams() {
  const departments = await getList("departments");
  return departments.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { department } = await findDepartment(slug);
  if (!department) return { title: "Department not found" };
  return { title: `Department of ${department.name}`, description: (!NO_STATEMENT_KINDS.includes(department.kind) && department.vision) || department.description || undefined };
}

export default async function DepartmentPage({ params }: Props) {
  const { slug } = await params;
  const { department: d } = await findDepartment(slug);
  if (!d) notFound();
  const allFaculty = await getList("faculty");
  const faculty = allFaculty.filter((f) => f.department === d.slug);

  // Optional tabs appear only when the department has that content, so other departments are unchanged.
  // An extended page (AIML) shows its overview under the vision and mission, and always has a Faculty tab.
  const extended = hasExtendedPage(d);
  const statements = !NO_STATEMENT_KINDS.includes(d.kind);
  const visionAndOverview = (
    <div className="space-y-10">
      <DepartmentVisionMission department={d} />
      <section aria-labelledby="overview-heading" className="border-t border-border pt-8">
        <h2 id="overview-heading" className="mb-2 text-xl font-bold tracking-tight text-heading">Overview</h2>
        <DepartmentOverview department={d} />
      </section>
    </div>
  );
  const items = [
    // Basic sciences and humanities, and sports, have no vision and mission tab.
    ...(statements ? [{ id: "vision-mission", label: "Vision and mission", content: extended ? visionAndOverview : <DepartmentVisionMission department={d} /> }] : []),
    ...(statements && extended ? [] : [{ id: "overview", label: "Overview", content: <DepartmentOverview department={d} /> }]),
    ...(hasOutcomes(d) ? [{ id: "outcomes", label: "Outcomes", content: <DepartmentOutcomes department={d} /> }] : []),
    ...(linesOf(d.curriculum).length ? [{ id: "curriculum", label: "Curriculum", content: <DepartmentCurriculum department={d} /> }] : []),
    ...(hasCareers(d) ? [{ id: "careers", label: "Careers", content: <DepartmentCareers department={d} /> }] : []),
    ...(faculty.length || extended
      ? [
          {
            id: "faculty",
            label: "Faculty",
            content: (
              <FacultyEditorProvider items={allFaculty} department={d.slug}>
                <DepartmentFaculty />
              </FacultyEditorProvider>
            ),
          },
        ]
      : []),
    ...(hasAchievements(d) ? [{ id: "achievements", label: "Achievements", content: <DepartmentAchievements department={d} /> }] : []),
    ...(d.has_research_centre ? [{ id: "research-centre", label: "Research centre", content: <DepartmentResearch department={d} /> }] : []),
  ];

  return (
    <>
      <PageBanner
        prefix="Department of"
        title={d.name}
        watermark={d.short_name}
        summary={d.description}
        tone="green"
        trail={[{ label: "Departments", href: "/academics" }, { label: d.short_name ?? d.name }]}
      />
      <div className={`${shell} pt-8 lg:pt-10`}>
        <div className="min-w-0 space-y-6">
          <DepartmentFacts department={d} />
          {/* With only one section (Overview), show it directly instead of a single lonely tab. */}
          {items.length > 1 ? <ContentTabs label={`Department of ${d.name}`} tone="green" items={items} /> : <section aria-label={items[0].label} className="rounded-xl border border-border bg-card p-5 sm:p-7">{items[0].content}</section>}
        </div>
      </div>
    </>
  );
}
