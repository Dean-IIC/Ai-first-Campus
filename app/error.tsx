"use client";

import Link from "next/link";
import { useEffect } from "react";
import { CircleAlert, RotateCcw } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

/** Error boundary for every route below the root layout. */
export default function RouteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[route error]", error);
  }, [error]);

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-20 sm:px-6">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-xs">
        <span className="grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive">
          <CircleAlert aria-hidden="true" className="size-6" />
        </span>
        <h1 className="mt-5 text-3xl font-bold text-heading">Something went wrong</h1>
        <p className="mt-3 max-w-[56ch] text-muted-foreground">
          This page could not be loaded. Try again, and if the problem continues, contact the college office.
        </p>
        {error.digest && <p className="mt-2 text-xs text-muted-foreground">Reference: {error.digest}</p>}
        <div className="mt-6 flex flex-wrap gap-3">
          <Button type="button" onClick={reset}>
            <RotateCcw aria-hidden="true" />
            Try again
          </Button>
          <Link href="/" className={buttonVariants({ variant: "outline" })}>
            Go to the home page
          </Link>
        </div>
      </div>
    </section>
  );
}
