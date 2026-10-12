import type { Metadata } from "next";
import Markdown from "@/components/features/content/markdown";
import PageBanner from "@/components/features/layout/page-banner";
import Panel from "@/components/features/content/panel";
import { getPage } from "@/lib/content";
import { getMenu } from "@/lib/menu-server";
import { sectionFor, sectionLinks } from "@/lib/menu";
import { shell } from "@/lib/ui";

type Crumb = { label: string; href?: string };

/**
 * Standard inner page: banner, then the content at full width.
 * `layout` receives the page's markdown body so a page can place it inside
 * tabs; without it the body is shown in a panel above `children`.
 */
export default async function ContentPage({
  slug,
  fallbackTitle,
  current,
  trail,
  tone,
  layout,
  children,
}: {
  slug: string;
  fallbackTitle: string;
  current: string;
  trail?: Crumb[];
  tone?: import("@/lib/ui").Tone;
  layout?: (body: React.ReactNode) => React.ReactNode;
  children?: React.ReactNode;
}) {
  const [page, menu] = await Promise.all([getPage(slug), getMenu()]);
  const title = page?.title ?? fallbackTitle;
  const body = page?.body_md ? <Markdown>{page.body_md}</Markdown> : null;
  const section = sectionFor(current, menu);
  const sectionHref = section ? section.href ?? sectionLinks(section)[0]?.href : undefined;
  const crumbs = trail ?? [
    ...(section && section.label !== title ? [{ label: section.label, href: sectionHref && sectionHref !== current ? sectionHref : undefined }] : []),
    { label: title },
  ];

  return (
    <>
      <PageBanner title={title} summary={page?.summary} trail={crumbs} tone={tone ?? section?.tone ?? "blue"} />
      <div className={`${shell} pt-8 lg:pt-10`}>
        <div className="min-w-0 space-y-8">
          {layout ? (
            layout(body)
          ) : (
            <>
              {body && <Panel>{body}</Panel>}
              {children}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export async function pageMetadata(slug: string, fallbackTitle: string): Promise<Metadata> {
  const page = await getPage(slug);
  return {
    title: page?.title ?? fallbackTitle,
    description: page?.summary ?? undefined,
  };
}
