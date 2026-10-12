import Link from "next/link";
import ContentPage, { pageMetadata } from "@/components/features/layout/content-page";
import Panel from "@/components/features/content/panel";
import { Chip } from "@/components/features/content/bits";
import { getList } from "@/lib/content";
import { AREAS } from "@/lib/areas";
import { linkText } from "@/lib/ui";

export const revalidate = 300;
export const generateMetadata = () => pageMetadata("academics", "Departments");

const KINDS = ["Engineering", "Basic sciences and humanities", "Physical education"];

export default async function AcademicsPage() {
  const departments = await getList("departments");
  const kinds = [...KINDS, ...new Set(departments.map((d) => d.kind).filter((k) => !KINDS.includes(k)))];
  return (
    <ContentPage slug="academics" fallbackTitle="Departments" current="/academics">
      {kinds.map((kind) => {
        const rows = departments.filter((d) => d.kind === kind);
        if (rows.length === 0) return null;
        return (
          <Panel key={kind} title={kind === "Engineering" ? "Engineering departments" : kind} icon={AREAS.departments.icon} tone="green">
            <ul className="grid gap-4 md:grid-cols-2">
              {rows.map((d) => (
                <li key={d.slug} className="flex flex-col rounded-md border border-border border-l-[3px] border-l-t-green p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="font-semibold leading-snug text-heading">
                      <Link href={`/academics/${d.slug}`} className="hover:underline hover:underline-offset-4">
                        {d.name}
                      </Link>
                    </h3>
                    <div className="flex gap-1.5">
                      {d.has_research_centre && <Chip tone="amber">Research centre</Chip>}
                      {d.short_name && <Chip tone="green">{d.short_name}</Chip>}
                    </div>
                  </div>
                  {d.description && <p className="mt-2 flex-1 text-sm text-muted-foreground">{d.description}</p>}
                  <Link href={`/academics/${d.slug}`} className={`${linkText} mt-3 text-sm`}>
                    Vision, mission and details
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>
        );
      })}
    </ContentPage>
  );
}
