import ContentPage, { pageMetadata } from "@/components/features/layout/content-page";
import ImageFeature from "@/components/features/content/image-feature";
import Panel from "@/components/features/content/panel";
import { DonutChart } from "@/components/features/infographics";
import { AREAS } from "@/lib/areas";
import { getList } from "@/lib/content";
import { images } from "@/lib/site";
import Link from "next/link";
import { linkText } from "@/lib/ui";

export const revalidate = 300;
export const generateMetadata = () => pageMetadata("ai-quantum", "AI and quantum at HKBK");

export default async function AiQuantumPage() {
  const dashboards = await getList("dashboards");
  const by = (c: string) => dashboards.filter((d) => d.category === c).length;
  return (
    <ContentPage slug="ai-quantum" fallbackTitle="AI and quantum at HKBK" current="/ai-quantum">
      <div className="grid gap-6 md:grid-cols-2">
        <ImageFeature src={images.ai.src} alt={images.ai.alt} title={AREAS.aiFirst.title} text={AREAS.aiFirst.text} href={AREAS.aiFirst.href} linkLabel="Open AI First campus" priority />
        <ImageFeature src={images.quantum.src} alt={images.quantum.alt} title={AREAS.quantumLab.title} text={AREAS.quantumLab.text} href={AREAS.quantumLab.href} linkLabel="Open the Quantum Lab" priority />
      </div>
      <Panel title="Dashboards in progress" icon={AREAS.dashboards.icon} tone="teal" action={<Link href="/ai-quantum/dashboards" className={`${linkText} text-sm`}>See all dashboards</Link>}>
        <DonutChart
          centerLabel="dashboards"
          data={[
            { label: "Artificial intelligence", value: by("AI"), tone: "teal" },
            { label: "Quantum computing", value: by("Quantum"), tone: "blue" },
            { label: "Teaching and learning", value: by("Academic"), tone: "green" },
            { label: "Research", value: by("Research"), tone: "amber" },
            { label: "Campus operations", value: by("Operations"), tone: "rose" },
          ]}
        />
      </Panel>
    </ContentPage>
  );
}
