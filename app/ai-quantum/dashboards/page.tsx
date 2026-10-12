import ContentPage, { pageMetadata } from "@/components/features/layout/content-page";
import Panel from "@/components/features/content/panel";
import Tabs from "@/components/features/content/content-tabs";
import { StatusPill } from "@/components/features/content/bits";
import { DonutChart } from "@/components/features/infographics";
import { getList } from "@/lib/content";
import type { Dashboard } from "@/lib/types";
import { linkText, type Tone } from "@/lib/ui";

export const revalidate = 300;
export const generateMetadata = () => pageMetadata("dashboards", "AI and quantum dashboards");

const CATEGORY_TONE: Record<string, Tone> = { AI: "teal", Quantum: "blue", Academic: "green", Research: "amber", Operations: "rose" };

const CATEGORIES: { key: Dashboard["category"]; label: string }[] = [
  { key: "AI", label: "Artificial intelligence" },
  { key: "Quantum", label: "Quantum computing" },
  { key: "Academic", label: "Teaching and learning" },
  { key: "Research", label: "Research" },
  { key: "Operations", label: "Campus operations" },
];

function DashboardGrid({ rows }: { rows: Dashboard[] }) {
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {rows.map((d) => (
        <li key={d.slug} className="flex flex-col rounded-md border border-border border-l-[3px] border-l-t-teal p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-heading">{d.title}</h3>
            <StatusPill status={d.status} />
          </div>
          {d.description && <p className="mt-2 flex-1 text-sm text-muted-foreground">{d.description}</p>}
          <div className="mt-4 text-sm">
            {d.url && d.status !== "In development" ? (
              <a href={d.url} target="_blank" rel="noopener noreferrer" className={linkText}>
                Open dashboard
              </a>
            ) : (
              <span className="text-muted-foreground">Not published yet</span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default async function DashboardsPage() {
  const dashboards = await getList("dashboards");
  const count = (s: Dashboard["status"]) => dashboards.filter((d) => d.status === s).length;

  return (
    <ContentPage
      slug="dashboards"
      fallbackTitle="AI and quantum dashboards"
      current="/ai-quantum/dashboards"
      layout={(body) => (
        <>
          <Panel>
            <div className="grid gap-8 xl:grid-cols-[1fr_22rem] xl:items-center">
              <div>{body}</div>
              <DonutChart
                centerLabel="dashboards"
                data={CATEGORIES.map((c) => ({
                  label: c.label,
                  value: dashboards.filter((d) => d.category === c.key).length,
                  tone: CATEGORY_TONE[c.key] ?? "blue",
                }))}
              />
            </div>
            <ul className="mt-6 grid grid-cols-3 gap-3">
              {(["Live", "Beta", "In development"] as const).map((s) => (
                <li
                  key={s}
                  className={`rounded-md border border-border border-l-4 p-4 ${
                    s === "Live" ? "border-l-t-green" : s === "Beta" ? "border-l-t-amber" : "border-l-muted-foreground/40"
                  }`}
                >
                  <p className="text-2xl font-bold text-heading">{count(s)}</p>
                  <p className="text-sm text-muted-foreground">{s}</p>
                </li>
              ))}
            </ul>
          </Panel>
          <Tabs
            label="Dashboards by area"
            tone="teal"
            items={[
              { id: "all", label: `All (${dashboards.length})`, content: <DashboardGrid rows={dashboards} /> },
              ...CATEGORIES.filter((c) => dashboards.some((d) => d.category === c.key)).map((c) => ({
                id: c.key.toLowerCase(),
                label: c.label,
                content: <DashboardGrid rows={dashboards.filter((d) => d.category === c.key)} />,
              })),
            ]}
          />
        </>
      )}
    />
  );
}
