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
    return [{ source: "/portals", destination: "/initiatives", permanent: true }];
  },
};

export default nextConfig;
