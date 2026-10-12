import Link from "next/link";
import { MapPin } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { fullAddress } from "@/lib/site";
import { shell } from "@/lib/ui";

/** Closing call to visit or contact the college. */
export default function VisitStrip() {
  return (
    <section className={`${shell} pt-14`}>
      <div className="relative flex flex-col gap-6 overflow-hidden rounded-2xl bg-brand p-6 text-white sm:p-8 lg:flex-row lg:items-center lg:justify-between">
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-gold/20 blur-3xl" />
        <div className="relative flex gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-full border border-white/15 bg-white/10 text-gold backdrop-blur-sm">
            <MapPin aria-hidden="true" className="size-6" />
          </span>
          <div>
            <h2 className="text-xl font-semibold">Visit the campus</h2>
            <p className="mt-1 text-white/80">{fullAddress}</p>
          </div>
        </div>
        <Link href="/contact" className={`${buttonVariants({ variant: "gold" })} relative`}>
          Contact the college
        </Link>
      </div>
    </section>
  );
}
