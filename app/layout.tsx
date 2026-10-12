import type { Metadata, Viewport } from "next";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/400-italic.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-sans/700.css";
import "@fontsource/ibm-plex-serif/400.css";
import "@fontsource/ibm-plex-serif/600.css";
import "./globals.css";
import SiteHeader from "@/components/features/layout/site-header";
import ThemeProvider from "@/components/features/layout/theme-provider";
import SiteFooter from "@/components/features/layout/site-footer";
import { site } from "@/lib/site";
import { getMenu } from "@/lib/menu-server";
import { getContentMap } from "@/lib/cms/read";
import { AdminProvider } from "@/components/features/admin/admin-provider";
import AdminToolbar from "@/components/features/admin/admin-toolbar";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: `${site.name}, Bengaluru`,
    template: `%s | ${site.name}`,
  },
  description:
    "HKBK College of Engineering, Nagawara, Bengaluru: an AI First and Quantum Ready engineering campus affiliated to VTU and approved by AICTE.",
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_IN",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#123e7c" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [menu, overrides] = await Promise.all([getMenu(), getContentMap()]);
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col antialiased">
        <AdminProvider initialOverrides={overrides}>
          <ThemeProvider>
            <AdminToolbar />
            <a href="#main" className="skip-link">
              Skip to content
            </a>
            <SiteHeader menu={menu} />
            <main id="main" className="flex-1">
              {children}
            </main>
            <SiteFooter menu={menu} />
          </ThemeProvider>
        </AdminProvider>
      </body>
    </html>
  );
}
