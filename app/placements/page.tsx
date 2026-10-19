import { Briefcase, ExternalLink, GraduationCap, LayoutDashboard } from "lucide-react";
import ContentPage, { pageMetadata } from "@/components/features/layout/content-page";
import Panel from "@/components/features/content/panel";
import { buttonVariants } from "@/components/ui/button";
import { getList } from "@/lib/content";
import { site } from "@/lib/site";

export const revalidate = 300;
export const generateMetadata = () => pageMetadata("placements", "Placements");

export default async function PlacementsPage() {
  const figures = await getList("key_figures");
  const placed = figures.find((f) => f.slug === "students-placed");
  const students = figures.find((f) => f.slug === "students");
  return (
    <ContentPage
      slug="placements"
      fallbackTitle="Placements"
      current="/placements"
      layout={(body) => (
        <>
          {/* The placement office's own portal: staff sign-in, opens in a new tab. */}
          <div className="flex flex-col gap-3 rounded-lg border border-border border-l-[3px] border-l-t-blue bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-heading">Training and Placement Portal</p>
              <p className="mt-0.5 text-sm text-muted-foreground">Student records, drives, offers and reports. Sign-in for the placement office, principals and the director.</p>
            </div>
            <a
              href={site.placementPortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ size: "lg", className: "w-full shrink-0 sm:w-auto" })}
            >
              <LayoutDashboard aria-hidden="true" />
              Open the Placement Portal
              <ExternalLink aria-hidden="true" />
            </a>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { f: placed, icon: Briefcase },
              { f: students, icon: GraduationCap },
            ]
              .filter((x) => x.f && x.f.value !== null)
              .map(({ f, icon: Icon }) => (
                <div key={f!.slug} className="flex items-center gap-4 rounded-lg border border-border border-t-[3px] border-t-t-blue bg-card p-5">
                  <span className="grid size-14 shrink-0 place-items-center rounded-full bg-t-blue text-white">
                    <Icon aria-hidden="true" className="size-7" />
                  </span>
                  <div>
                    <p className="text-4xl font-bold leading-none text-heading">
                      {f!.value!.toLocaleString("en-IN")}
                      {f!.suffix}
                    </p>
                    <p className="mt-1 font-semibold text-t-blue dark:text-t-blue-light">{f!.label}</p>
                  </div>
                </div>
              ))}
          </div>
          {body && <Panel>{body}</Panel>}
        </>
      )}
    />
  );
}
