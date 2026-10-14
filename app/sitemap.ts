import type { MetadataRoute } from "next";
import { getList, getMessages } from "@/lib/content";

const ROUTES = [
  "/",
  "/about",
  "/leadership",
  "/academics",
  "/programmes",
  "/uhv",
  "/ai-quantum",
  "/ai-quantum/ai-first",
  "/ai-quantum/quantum-lab",
  "/ai-quantum/dashboards",
  "/research",
  "/research/centres",
  "/consultancy",
  "/corporate-training",
  "/ieee",
  "/news",
  "/initiatives",
  "/houses",
  "/placements",
  "/alumni",
  "/rnd",
  "/mous",
  "/iqac",
  "/ai-quantum/champions",
  "/contact",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const [messages, departments, initiatives] = await Promise.all([getMessages(), getList("departments"), getList("portals")]);
  return [
    ...ROUTES.map((r) => ({ url: `${base}${r}`, changeFrequency: "weekly" as const })),
    ...messages.map((m) => ({ url: `${base}/leadership/${m.slug}`, changeFrequency: "monthly" as const })),
    ...departments.map((d) => ({ url: `${base}/academics/${d.slug}`, changeFrequency: "monthly" as const })),
    ...initiatives.map((p) => ({ url: `${base}/initiatives/${p.slug}`, changeFrequency: "monthly" as const })),
  ];
}
