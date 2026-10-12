import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import PageBanner from "@/components/features/layout/page-banner";
import SignInForm from "@/components/features/staff/sign-in-form";
import { shell } from "@/lib/ui";

export const metadata: Metadata = { title: "Staff sign-in", robots: { index: false, follow: false } };

/** Sign-in for staff who edit website content (AI Champions and Ambassadors). */
export default function StaffLoginPage() {
  return (
    <>
      <PageBanner title="Staff sign-in" summary="For college staff who update the website." trail={[{ label: "Staff sign-in" }]} />
      <div className={`${shell} pt-8 lg:pt-10`}>
        <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-6 shadow-xs sm:p-8">
          <p className="mb-6 flex items-start gap-3 text-sm text-muted-foreground">
            <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
            Only accounts on the editors list can sign in. After signing in you can add and edit AI Faculty Champions and AI Student Ambassadors on the Champions page.
          </p>
          <SignInForm />
        </div>
      </div>
    </>
  );
}
