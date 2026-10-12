import type { Metadata } from "next";
import PageBanner from "@/components/features/layout/page-banner";
import FeaturedMessage from "@/components/features/people/featured-message";
import { getMessages } from "@/lib/content";
import { shell } from "@/lib/ui";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Leadership messages",
  description: "Messages from the Chairman, Director and Principal of HKBK College of Engineering.",
};

/** All leadership messages in full, one below the other. */
export default async function LeadershipPage() {
  const messages = await getMessages();
  return (
    <>
      <PageBanner
        title="Leadership messages"
        summary="The Chairman, Director and Principal of HKBK College of Engineering on the college and its AI-First campus."
        trail={[{ label: "About", href: "/about" }, { label: "Leadership messages" }]}
      />
      <div className={`${shell} pt-8 lg:pt-10`}>
        <div className="min-w-0 space-y-8">
          {messages.map((m) => (
            <FeaturedMessage key={m.slug} message={m} />
          ))}
        </div>
      </div>
    </>
  );
}
