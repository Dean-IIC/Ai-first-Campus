"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { MOU_TYPES, type MouFilter } from "@/lib/mous";

/** Filters for visitors: type, status and a search box over partner, purpose and departments. */
export default function MouFilters({ value, onChange }: { value: MouFilter; onChange: (next: MouFilter) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_11rem_10rem]">
      <label className="relative">
        <span className="sr-only">Search MoUs</span>
        <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input type="search" placeholder="Search partner, purpose or department" value={value.q} onChange={(e) => onChange({ ...value, q: e.target.value })} className="pl-9" />
      </label>
      <label>
        <span className="sr-only">Filter by type</span>
        <NativeSelect value={value.type} onChange={(e) => onChange({ ...value, type: e.target.value })}>
          <option value="">All types</option>
          {MOU_TYPES.map((t) => <option key={t}>{t}</option>)}
        </NativeSelect>
      </label>
      <label>
        <span className="sr-only">Filter by status</span>
        <NativeSelect value={value.status} onChange={(e) => onChange({ ...value, status: e.target.value })}>
          <option value="">Any status</option>
          <option>Active</option>
          <option>Expired</option>
        </NativeSelect>
      </label>
    </div>
  );
}
