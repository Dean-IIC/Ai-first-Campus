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
      // News is no longer shown; the page lists events only.
      { source: "/news", destination: "/events", permanent: true },
      // A message removed on 2026-10-14: its old address opens the AI First Campus page.
      // AI First Campus and Quantum Ready Campus are sections of the AI & Quantum Campus page.
      { source: "/ai-quantum/ai-first", destination: "/ai-quantum#ai-first-campus", permanent: true },
      { source: "/ai-quantum/quantum-lab", destination: "/ai-quantum#quantum-ready-campus", permanent: true },
      { source: "/ai-quantum/champions", destination: "/ai-quantum#champions", permanent: true },
      // Dashboards are not shown for now.
      { source: "/ai-quantum/dashboards", destination: "/ai-quantum#ai-first-campus", permanent: true },
      { source: "/leadership/chief-ai-quantum-officer", destination: "/ai-quantum#ai-first-campus", permanent: true },
    ];
  },
};

export default nextConfig;
