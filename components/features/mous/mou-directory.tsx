import { Handshake } from "lucide-react";
import ContentTabs from "@/components/features/content/content-tabs";
import type { Mou } from "@/lib/types";
import MouCard from "./mou-card";

const TYPES = ["Industry", "Academic", "Research", "Government"];

function Grid({ rows }: { rows: Mou[] }) {
  return (
    <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {rows.map((m) => (
        <li key={m.slug}>
          <MouCard mou={m} />
        </li>
      ))}
    </ul>
  );
}

/** All MoUs in tabs by partner type, or an empty state until the list is added. */
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
  const types = TYPES.filter((t) => mous.some((m) => m.partner_type === t));
  return (
    <ContentTabs
      label="MoUs by partner type"
      tone="amber"
      items={[
        { id: "all", label: `All (${mous.length})`, content: <Grid rows={mous} /> },
        ...types.map((t) => ({ id: t.toLowerCase(), label: t, content: <Grid rows={mous.filter((m) => m.partner_type === t)} /> })),
      ]}
    />
  );
}
