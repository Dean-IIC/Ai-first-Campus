import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Download, Inbox } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import EnquiryCard from "@/components/features/admin/enquiries/enquiry-card";
import EnquiryFilters from "@/components/features/admin/enquiries/enquiry-filters";
import { listEnquiries, cleanSearch } from "@/lib/admin/enquiries";
import { isAdminSession } from "@/lib/admin/session";
import { shell } from "@/lib/ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Enquiries", robots: { index: false, follow: false } };

type Search = { type?: string; status?: string; q?: string; id?: string };

/** The admin's inbox of every form submission, newest first. Admin only. */
export default async function EnquiriesPage({ searchParams }: { searchParams: Promise<Search> }) {
  if (!(await isAdminSession())) redirect("/admin/login");
  const sp = await searchParams;
  const filter = { type: sp.type || undefined, status: sp.status || undefined, q: cleanSearch(sp.q) || undefined };
  let rows: Awaited<ReturnType<typeof listEnquiries>> = [];
  let error = "";
  try {
    rows = await listEnquiries(filter);
  } catch (err) {
    error = err instanceof Error ? err.message : "The enquiries could not be loaded.";
  }
  const query = new URLSearchParams(Object.entries(filter).filter((e): e is [string, string] => Boolean(e[1]))).toString();

  return (
    <div className={`${shell} py-8 lg:py-10`}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-bold text-heading sm:text-3xl">
            <Inbox aria-hidden="true" className="size-7 text-primary" />
            Enquiries
          </h1>
          <p className="mt-1 text-muted-foreground">Contact, consultancy and corporate training requests from the website, newest first.</p>
        </div>
        <a href={`/api/admin/enquiries/csv${query ? `?${query}` : ""}`} className={buttonVariants({ variant: "outline" })}>
          <Download aria-hidden="true" />
          Download CSV
        </a>
      </div>
      <EnquiryFilters type={filter.type} status={filter.status} q={filter.q} />
      {error ? (
        <p role="alert" className="mt-6 font-medium text-destructive">{error}</p>
      ) : (
        <>
          <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
            {rows.length === 1 ? "1 enquiry" : `${rows.length} enquiries`}
            {query ? " match these filters." : "."}
          </p>
          <ol className="mt-3 grid gap-4">
            {rows.map((e) => (
              <EnquiryCard key={e.id} enquiry={e} highlighted={e.id === sp.id} />
            ))}
          </ol>
        </>
      )}
    </div>
  );
}
