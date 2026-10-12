"use client";

import { useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { TONE, type Tone } from "@/lib/ui";

export type TabItem = { id: string; label: string; content: React.ReactNode };

/**
 * Folder-style tabs built on shadcn/Radix Tabs. Every panel stays in the HTML
 * (forceMount) for search engines, and a URL hash matching a tab id, such as
 * /ieee#wie, opens that tab and scrolls to it.
 */
export default function ContentTabs({ items, tone = "blue", label }: { items: TabItem[]; tone?: Tone; label: string }) {
  const [value, setValue] = useState(items[0]?.id ?? "");
  const listRef = useRef<HTMLDivElement>(null);
  const ids = items.map((i) => i.id).join("|");

  useEffect(() => {
    const valid = ids.split("|");
    const sync = () => {
      const hash = decodeURIComponent(window.location.hash.slice(1));
      if (hash && valid.includes(hash)) {
        setValue(hash);
        listRef.current?.scrollIntoView({ block: "start" });
      }
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [ids]);

  const onValueChange = (next: string) => {
    setValue(next);
    try {
      window.history.replaceState(null, "", `#${next}`);
    } catch {
      // History API unavailable (for example in a sandboxed frame); the tab still changes.
    }
  };

  if (items.length === 0) return null;

  return (
    <Tabs value={value} onValueChange={onValueChange} data-tabs>
      <TabsList ref={listRef} aria-label={label} className="flex w-full scroll-mt-24 justify-start gap-1 overflow-x-auto border-b border-border">
        {items.map((t) => (
          <TabsTrigger
            key={t.id}
            value={t.id}
            data-tab-id={t.id}
            className={cn(
              "-mb-px shrink-0 rounded-t-md border border-b-0 border-t-[3px] border-border border-t-transparent bg-muted px-4 py-2.5 text-[0.9375rem] text-muted-foreground hover:bg-card hover:text-foreground",
              "data-[state=active]:bg-card data-[state=active]:font-semibold data-[state=active]:text-heading",
              TONE[tone].tabActive,
            )}
          >
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {items.map((t) => (
        <TabsContent
          key={t.id}
          value={t.id}
          forceMount
          data-tab-id={t.id}
          className="scroll-mt-24 rounded-b-xl border border-t-0 border-border bg-card p-5 data-[state=inactive]:hidden sm:p-7"
        >
          {t.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
