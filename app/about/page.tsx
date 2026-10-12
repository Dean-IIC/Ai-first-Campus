import Link from "next/link";
import ContentPage, { pageMetadata } from "@/components/features/layout/content-page";
import Tabs from "@/components/features/content/content-tabs";
import VisionMission from "@/components/features/content/vision-mission";
import { Monogram } from "@/components/features/content/bits";
import { getMessages } from "@/lib/content";
import { monogram } from "@/lib/format";
import { images } from "@/lib/site";
import { linkText } from "@/lib/ui";

export const revalidate = 300;
export const generateMetadata = () => pageMetadata("about", "About HKBK");

export default async function AboutPage() {
  const messages = await getMessages();
  return (
    <ContentPage
      slug="about"
      fallbackTitle="About HKBK"
      current="/about"
      layout={(body) => (
        <Tabs
          label="About HKBK"
          tone="blue"
          items={[
            {
              id: "overview",
              label: "Overview",
              content: (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={images.campus.src} alt={images.campus.alt} width={1600} height={1066} className="mb-7 aspect-[16/8] w-full rounded-lg object-cover" />
                  {body}
                </>
              ),
            },
            { id: "vision-mission", label: "Vision and mission", content: <VisionMission /> },
            {
              id: "leadership",
              label: "Leadership",
              content: (
                <ul className="grid gap-4 sm:grid-cols-2">
                  {messages.map((m) => (
                    <li key={m.slug} className="flex gap-4 rounded-md border border-border p-4">
                      <Monogram text={monogram(m.name, m.designation)} />
                      <div>
                        <p className="font-semibold text-heading">{m.designation}</p>
                        {m.name && <p className="text-sm text-muted-foreground">{m.name}</p>}
                        <Link href={`/leadership/${m.slug}`} className={`${linkText} mt-1 inline-block text-sm`}>
                          Read the message
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              ),
            },
          ]}
        />
      )}
    />
  );
}
