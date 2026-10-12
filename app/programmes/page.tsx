import Link from "next/link";
import { Clock, GraduationCap } from "lucide-react";
import ContentPage, { pageMetadata } from "@/components/features/layout/content-page";
import Panel from "@/components/features/content/panel";
import { Chip } from "@/components/features/content/bits";
import { getList } from "@/lib/content";
import { linkText } from "@/lib/ui";

export const revalidate = 300;
export const generateMetadata = () => pageMetadata("programmes", "Programmes");

export default async function ProgrammesPage() {
  const programmes = (await getList("departments")).filter((d) => d.programmes === "BE");
  return (
    <ContentPage slug="programmes" fallbackTitle="Programmes" current="/programmes">
      <Panel title={`Bachelor of Engineering (${programmes.length} programmes)`} icon={GraduationCap} tone="green">
        <ul className="grid gap-4 md:grid-cols-2">
          {programmes.map((d) => (
            <li key={d.slug} className="flex flex-col rounded-md border border-border border-l-[3px] border-l-t-green p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold leading-snug text-heading">BE in {d.name}</h3>
                {d.short_name && <Chip tone="green">{d.short_name}</Chip>}
              </div>
              {d.description && <p className="mt-2 flex-1 text-sm text-muted-foreground">{d.description}</p>}
              <p className="mt-3 flex items-center gap-1.5 text-sm">
                <Clock aria-hidden="true" className="size-4 text-t-green dark:text-t-green-light" />
                Four years, affiliated to VTU
              </p>
              <Link href={`/academics/${d.slug}`} className={`${linkText} mt-3 text-sm`}>
                About the department
              </Link>
            </li>
          ))}
        </ul>
      </Panel>
    </ContentPage>
  );
}
