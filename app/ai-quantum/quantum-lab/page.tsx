/* eslint-disable @next/next/no-img-element */
import { Atom, Cpu, MessageSquareText, PenTool, ShieldCheck } from "lucide-react";
import ContentPage, { pageMetadata } from "@/components/features/layout/content-page";
import Panel from "@/components/features/content/panel";
import { MilestoneTimeline, ProcessSteps } from "@/components/features/infographics";
import { images } from "@/lib/site";

export const revalidate = 300;
export const generateMetadata = () => pageMetadata("quantum-lab", "Quantum Lab");

export default function QuantumLabPage() {
  return (
    <ContentPage
      slug="quantum-lab"
      fallbackTitle="Quantum Lab"
      current="/ai-quantum/quantum-lab"
      layout={(body) => (
        <>
          <img src={images.quantum.src} alt={images.quantum.alt} width={1600} height={1000} className="aspect-[16/8] w-full rounded-lg object-cover object-[50%_85%]" />
          <Panel title="How students run a quantum circuit" icon={Atom} tone="teal">
            <div className="grid gap-6 lg:grid-cols-[1fr_15rem] lg:items-center">
              <ProcessSteps
                layout="grid"
                steps={[
                  { title: "Build", text: "Design a circuit in the drag-and-drop composer or in Python with Qiskit.", icon: PenTool },
                  { title: "Simulate", text: "Run it instantly in the browser, or on the lab server for larger circuits.", icon: Cpu },
                  { title: "Run on hardware", text: "Send it to a real quantum computer through IBM Quantum, within your quota.", icon: Atom },
                  { title: "Explain", text: "The AI quantum explainer walks through what the circuit did and why.", icon: MessageSquareText },
                ]}
              />
              <img src={images.bloch.src} alt={images.bloch.alt} width={1000} height={1000} className="mx-auto hidden w-60 rounded-xl bg-white p-2 lg:block" />
            </div>
          </Panel>
          <Panel title="Why quantum-safe security matters now" icon={ShieldCheck} tone="teal">
            <MilestoneTimeline
              items={[
                { when: "2024", title: "New encryption standards", text: "NIST publishes ML-KEM, ML-DSA and SLH-DSA (FIPS 203, 204 and 205)." },
                { when: "Now", title: "HKBK moves early", text: "Student and research records move to quantum-safe protection.", highlight: true },
                { when: "2030", title: "Old algorithms deprecated", text: "RSA and elliptic-curve cryptography deprecated, per NIST's draft transition plan (IR 8547)." },
                { when: "2035", title: "Old algorithms disallowed", text: "Quantum-vulnerable public-key algorithms disallowed, per the same draft plan." },
              ]}
            />
          </Panel>
          {body && <Panel>{body}</Panel>}
        </>
      )}
    />
  );
}
