import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LoginForm from "@/components/features/admin/login-form";
import Logo from "@/components/features/layout/logo";
import { isAdminSession } from "@/lib/admin/session";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Admin sign-in", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAdminSession()) redirect("/");
  return (
    <section className="grid min-h-[70dvh] place-items-center bg-muted px-4 py-16">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-[0_24px_48px_-28px_rgba(10,42,87,0.45)]">
        <div className="relative bg-gradient-to-br from-brand-dark via-brand to-t-blue px-6 py-7 text-center text-white">
          <div className="mx-auto mb-4 grid size-20 place-items-center rounded-full bg-white p-2 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.35)] sm:size-24">
            <Logo className="size-full object-contain" />
          </div>
          <p className="text-lg font-bold">{site.name}</p>
          <p className="mt-1 text-sm text-white/80">Admin sign-in</p>
        </div>
        <div className="p-6 sm:p-8">
          <LoginForm />
        </div>
      </div>
    </section>
  );
}
