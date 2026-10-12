import { Flag, Quote } from "lucide-react";
import ContentPage, { pageMetadata } from "@/components/features/layout/content-page";
import Tabs from "@/components/features/content/content-tabs";
import { getList } from "@/lib/content";

export const revalidate = 300;
export const generateMetadata = () => pageMetadata("houses", "Houses");

export default async function HousesPage() {
  const houses = await getList("houses");
  return (
    <ContentPage
      slug="houses"
      fallbackTitle="Houses"
      current="/houses"
      layout={(body) => (
        <>
          {body && <div className="max-w-[72ch] text-muted-foreground">{body}</div>}
          <Tabs
            label="Houses"
            tone="violet"
            items={houses.map((h) => ({
              id: h.slug,
              label: h.name.replace(/^Dr\. A\. P\. J\. /, "").replace(/ House$/, ""),
              content: (
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                  <span className={`grid size-16 shrink-0 place-items-center rounded-xl ${h.is_placeholder ? "border-2 border-dashed border-t-violet/40 text-t-violet/60" : "bg-t-violet text-white"}`}>
                    <Flag aria-hidden="true" className="size-8" />
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-xl font-semibold text-heading">{h.name}</h2>
                    {h.namesake && (
                      <blockquote className="mt-3 flex max-w-[64ch] gap-3 font-serif text-[1.0625rem] leading-relaxed text-foreground">
                        <Quote aria-hidden="true" className="mt-1 size-5 shrink-0 text-gold" />
                        <p>{h.namesake}</p>
                      </blockquote>
                    )}
                    {h.about && <p className="mt-4 max-w-[64ch]">{h.about}</p>}
                    {h.motto && <p className="mt-3 font-semibold text-t-violet dark:text-t-violet-light">Motto: {h.motto}</p>}
                    <p className="mt-5 rounded-md border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
                      House captains, mentors and points will be added here.
                    </p>
                  </div>
                </div>
              ),
            }))}
          />
        </>
      )}
    />
  );
}
