import Link from "next/link";
import { shell } from "@/lib/ui";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className={`${shell} py-20`}>
      <p className="text-sm font-semibold text-primary">Error 404</p>
      <h1 className="mt-3 text-4xl font-bold text-heading">This page does not exist</h1>
      <p className="mt-4 max-w-[56ch] text-lg text-muted-foreground">
        The link may be old, or the page may have moved. Start from the home page or use the menu above.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className={buttonVariants({ variant: "gold" })}>Go to the home page</Link>
        <Link href="/contact" className={buttonVariants({ variant: "outline" })}>Contact the college</Link>
      </div>
    </section>
  );
}
