import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContentTabs from "@/components/features/content/content-tabs";
import DepartmentFacts from "@/components/features/departments/department-facts";
import DepartmentOverview from "@/components/features/departments/department-overview";
import DepartmentResearch from "@/components/features/departments/department-research";
import DepartmentVisionMission from "@/components/features/departments/department-vision-mission";
import PageBanner from "@/components/features/layout/page-banner";
import { getList } from "@/lib/content";
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

  const items = [
    // Basic sciences and humanities, and sports, have no vision and mission tab.
    ...(!NO_STATEMENT_KINDS.includes(d.kind) ? [{ id: "vision-mission", label: "Vision and mission", content: <DepartmentVisionMission department={d} /> }] : []),
    { id: "overview", label: "Overview", content: <DepartmentOverview department={d} /> },
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
