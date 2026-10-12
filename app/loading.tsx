import { Skeleton } from "@/components/ui/skeleton";

/** Shown while a route's data loads: a banner and content skeleton that match the page layout. */
export default function Loading() {
  return (
    <div role="status" aria-live="polite" aria-label="Loading page">
      <div className="border-b border-border bg-brand-tint">
        <div className="mx-auto w-full max-w-7xl space-y-3 px-4 py-10 sm:px-6 lg:px-8">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-10 w-2/3 max-w-xl" />
          <Skeleton className="h-5 w-full max-w-2xl" />
        </div>
      </div>
      <div className="mx-auto w-full max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
