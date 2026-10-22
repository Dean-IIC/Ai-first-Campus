import ContentPage, { pageMetadata } from "@/components/features/layout/content-page";
import Panel from "@/components/features/content/panel";
import AiFirstSection from "@/components/features/initiatives/ai-first-section";
import QuantumSection from "@/components/features/initiatives/quantum-section";

// Rendered on each request: the faculty and ambassador cards and the journey are edited on this
// page, and a cached copy would show the previous version for a few seconds after every save.
export const dynamic = "force-dynamic";
export const generateMetadata = () => pageMetadata("ai-quantum", "AI & Quantum Campus");

/**
 * The AI & Quantum Campus page: the overview text, then the AI First Campus section
 * (#ai-first-campus) and the Quantum Ready Campus section (#quantum-ready-campus). The old
 * /ai-quantum/ai-first, /quantum-lab, /champions and /dashboards addresses redirect here.
 */
export default function AiQuantumPage() {
  return (
    <ContentPage
      slug="ai-quantum"
      fallbackTitle="AI & Quantum Campus"
      current="/ai-quantum"
      layout={(body) => (
        <>
          {body && <Panel>{body}</Panel>}
          <AiFirstSection />
          <QuantumSection />
        </>
      )}
    />
  );
}
