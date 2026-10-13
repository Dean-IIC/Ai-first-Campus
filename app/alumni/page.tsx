import ContentPage, { pageMetadata } from "@/components/features/layout/content-page";

export const revalidate = 300;
export const generateMetadata = () => pageMetadata("alumni", "Alumni");

/** Alumni: a holding page until the Alumni portal link is set in the content editor. */
export default function AlumniPage() {
  return <ContentPage slug="alumni" fallbackTitle="Alumni" current="/alumni" />;
}
