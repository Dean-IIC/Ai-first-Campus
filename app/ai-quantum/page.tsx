import ContentPage, { pageMetadata } from "@/components/features/layout/content-page";
import ImageFeature from "@/components/features/content/image-feature";
import { AREAS } from "@/lib/areas";
import { images } from "@/lib/site";

export const revalidate = 300;
export const generateMetadata = () => pageMetadata("ai-quantum", "AI and quantum at HKBK");

/** The AI and quantum overview: the AI First campus and Quantum Lab picture cards. The dashboards chart is not shown for now. */
export default function AiQuantumPage() {
  return (
    <ContentPage slug="ai-quantum" fallbackTitle="AI and quantum at HKBK" current="/ai-quantum">
      <div className="grid gap-6 md:grid-cols-2">
        <ImageFeature src={images.ai.src} alt={images.ai.alt} title={AREAS.aiFirst.title} text={AREAS.aiFirst.text} href={AREAS.aiFirst.href} linkLabel="Open AI First campus" priority />
        <ImageFeature src={images.quantum.src} alt={images.quantum.alt} title={AREAS.quantumLab.title} text={AREAS.quantumLab.text} href={AREAS.quantumLab.href} linkLabel="Open the Quantum Lab" priority />
      </div>
    </ContentPage>
  );
}
