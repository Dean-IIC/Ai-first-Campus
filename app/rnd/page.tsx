import ContentPage, { pageMetadata } from "@/components/features/layout/content-page";

export const revalidate = 300;
export const generateMetadata = () => pageMetadata("rnd", "Research & Development");

/** Research & Development: a holding page until the R&D portal link is set in the content editor. */
export default function RndPage() {
  return <ContentPage slug="rnd" fallbackTitle="Research & Development" current="/rnd" />;
}
