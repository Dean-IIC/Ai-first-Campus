import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageBanner from "@/components/features/layout/page-banner";
import FeaturedMessage from "@/components/features/people/featured-message";
import { getMessage, getMessages } from "@/lib/content";
import { shell } from "@/lib/ui";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const messages = await getMessages();
  return messages.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const m = await getMessage(slug);
  if (!m) return { title: "Message not found" };
  return { title: `Message from the ${m.designation}`, description: m.excerpt ?? undefined };
}

export default async function MessagePage({ params }: Props) {
  const { slug } = await params;
  const message = await getMessage(slug);
  if (!message) notFound();

  return (
    <>
      <PageBanner
        title={`Message from the ${message.designation}`}
        summary={[message.name, message.organisation].filter(Boolean).join(", ") || null}
        trail={[{ label: "About", href: "/about" }, { label: "Leadership messages", href: "/leadership" }, { label: message.designation }]}
      />
      <div className={`${shell} pt-8 lg:pt-10`}>
        <FeaturedMessage message={message} />
      </div>
    </>
  );
}
