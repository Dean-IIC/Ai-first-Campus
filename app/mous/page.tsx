import { Handshake } from "lucide-react";
import ContentPage, { pageMetadata } from "@/components/features/layout/content-page";
import Markdown from "@/components/features/content/markdown";
import Panel from "@/components/features/content/panel";
import MouDirectory from "@/components/features/mous/mou-directory";
import MouEditorProvider from "@/components/features/mous/mou-editor";
import { getList, getPage } from "@/lib/content";
import { splitSections } from "@/lib/markdown";

// Rendered on each request: MoUs are edited on this page, and a cached copy would show the
// previous card for a few seconds after every save.
export const dynamic = "force-dynamic";
export const generateMetadata = () => pageMetadata("mous", "MoUs");

export default async function MousPage() {
  const [mous, figures, page, departments] = await Promise.all([getList("mous"), getList("key_figures"), getPage("mous"), getList("departments")]);
  // The count matches the cards shown; the key figure is used only until the list is added.
  const total = mous.length > 0 ? mous.length : (figures.find((f) => f.slug === "mous")?.value ?? null);
  const { sections } = splitSections(page?.body_md ?? "");
  const scope = sections.find((s) => s.id === "what-our-mous-cover");

  return (
    <ContentPage
      slug="mous"
      fallbackTitle="MoUs"
      current="/mous"
      layout={() => (
        <>
          <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
            <div className="flex items-center gap-4 rounded-xl border border-border border-t-[3px] border-t-t-amber bg-card p-6 shadow-xs">
              <span className="grid size-14 shrink-0 place-items-center rounded-full bg-t-amber text-white shadow-[0_0_24px_-6px_rgba(146,87,0,0.7)]">
                <Handshake aria-hidden="true" className="size-7" />
              </span>
              <div>
                <p className="text-4xl font-bold leading-none text-heading">{total ?? "—"}</p>
                <p className="mt-1 font-semibold text-t-amber dark:text-t-amber-light">MoUs signed</p>
              </div>
            </div>
            {scope && (
              <Panel title="What our MoUs cover" tone="amber">
                <Markdown>{scope.body}</Markdown>
              </Panel>
            )}
          </div>
          <MouEditorProvider mous={mous} departments={departments.map((d) => d.name)}>
            <MouDirectory />
          </MouEditorProvider>
        </>
      )}
    />
  );
}
