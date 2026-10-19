import { Handshake } from "lucide-react";
import type { Mou } from "@/lib/types";
import MouCard from "./mou-card";

/** Every MoU in one grid, in the order set by sort_order, or an empty state until the list is added. */
export default function MouDirectory({ mous, total }: { mous: Mou[]; total: number | null }) {
  if (mous.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-muted/50 px-6 py-10 text-center">
        <span className="grid size-14 place-items-center rounded-full bg-t-amber-tint text-t-amber dark:text-t-amber-light">
          <Handshake aria-hidden="true" className="size-7" />
        </span>
        <p className="mt-4 font-semibold text-heading">Partner list coming soon</p>
        <p className="mt-1 max-w-[52ch] text-sm text-muted-foreground">
          {total ? `Details of all ${total} MoUs, ` : "Details of each MoU, "}including partners, purpose and signed documents, will be listed here.
        </p>
      </div>
    );
  }
  return (
    <ul aria-label="MoUs signed" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {mous.map((m) => (
        <li key={m.slug}>
          <MouCard mou={m} />
        </li>
      ))}
    </ul>
  );
}
