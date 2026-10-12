"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/** Light and dark mode via a `dark` class on <html>, following the visitor's system setting by default. */
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </NextThemesProvider>
  );
}
