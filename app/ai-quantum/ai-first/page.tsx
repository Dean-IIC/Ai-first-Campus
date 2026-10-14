/* eslint-disable @next/next/no-img-element */
import ContentPage, { pageMetadata } from "@/components/features/layout/content-page";
import Panel from "@/components/features/content/panel";
import AiChampions from "@/components/features/people/ai-champions";
import { images } from "@/lib/site";

export const revalidate = 300;
export const generateMetadata = () => pageMetadata("ai-first", "AI First campus");

export default function AiFirstPage() {
  return (
    <ContentPage
      slug="ai-first"
      fallbackTitle="AI First campus"
      current="/ai-quantum/ai-first"
      layout={(body) => (
        <>
          <img src={images.ai.src} alt={images.ai.alt} width={1600} height={1000} className="aspect-[16/7] w-full rounded-lg object-cover" />
          <AiChampions />
          {body && <Panel tone="teal">{body}</Panel>}
        </>
      )}
    />
  );
}
