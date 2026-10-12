"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

/** Switches between light and dark mode. Icons swap with CSS, so there is no hydration flash. */
export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      data-theme-toggle
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="rounded-full text-foreground"
    >
      <Moon aria-hidden="true" className="size-[1.125rem] dark:hidden" />
      <Sun aria-hidden="true" className="hidden size-[1.125rem] dark:block" />
    </Button>
  );
}
