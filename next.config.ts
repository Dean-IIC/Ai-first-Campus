import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Markdown and JSON in /content are read at runtime as a fallback when
  // Supabase is not configured, so make sure they ship with every function.
  outputFileTracingIncludes: {
    "/**": ["./content/**/*"],
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co" }],
  },
  async redirects() {
    return [
      { source: "/portals", destination: "/initiatives", permanent: true },
      // A message removed on 2026-10-14: its old address opens the AI First Campus page.
      // The Champions and Dashboards content now sits on the AI First Campus page.
      { source: "/ai-quantum/champions", destination: "/ai-quantum/ai-first#champions", permanent: true },
      { source: "/ai-quantum/dashboards", destination: "/ai-quantum/ai-first#dashboards", permanent: true },
      { source: "/leadership/chief-ai-quantum-officer", destination: "/ai-quantum/ai-first", permanent: true },
    ];
  },
};

export default nextConfig;
