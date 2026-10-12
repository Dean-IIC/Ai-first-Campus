import { SectionHeading } from "@/components/features/content/bits";
import FeaturedMessage from "@/components/features/people/featured-message";
import type { LeadershipMessage } from "@/lib/types";
import { shell } from "@/lib/ui";

/** All leadership messages in full, one below the other, in the featured message design. */
export default function LeadershipSection({ messages }: { messages: LeadershipMessage[] }) {
  if (messages.length === 0) return null;
  return (
    <section className={`${shell} pt-14`}>
      <SectionHeading title="Messages from our leadership" intro="Why HKBK is becoming an AI-First campus, from the people leading the change." />
      <ul className="mt-6 space-y-6">
        {messages.map((m) => (
          <FeaturedMessage key={m.slug} message={m} as="li" />
        ))}
      </ul>
    </section>
  );
}
