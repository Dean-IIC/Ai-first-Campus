import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { ENQUIRY_STATUSES, FORM_LABELS, STATUS_LABELS } from "@/lib/enquiry";
import { linkText } from "@/lib/ui";

const FORMS = ["contact", "consultancy", "corporate_training"] as const;

/** Filter by form and status, and search by name, email or organisation. A plain GET form. */
export default function EnquiryFilters({ type, status, q }: { type?: string; status?: string; q?: string }) {
  return (
    <form method="get" action="/admin/enquiries" className="mt-6 grid gap-4 rounded-xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_2fr_auto] lg:items-end">
      <div className="grid gap-1.5">
        <Label htmlFor="f-type">Form</Label>
        <NativeSelect id="f-type" name="type" defaultValue={type ?? ""}>
          <option value="">All forms</option>
          {FORMS.map((f) => <option key={f} value={f}>{FORM_LABELS[f]}</option>)}
        </NativeSelect>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="f-status">Status</Label>
        <NativeSelect id="f-status" name="status" defaultValue={status ?? ""}>
          <option value="">Any status</option>
          {ENQUIRY_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </NativeSelect>
      </div>
      <div className="grid gap-1.5 sm:col-span-2 lg:col-span-1">
        <Label htmlFor="f-q">Search</Label>
        <Input id="f-q" name="q" type="search" defaultValue={q ?? ""} placeholder="Name, email or organisation" maxLength={80} />
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit">
          <Search aria-hidden="true" />
          Apply
        </Button>
        {(type || status || q) && (
          <Link href="/admin/enquiries" className={`${linkText} text-sm`}>
            Clear
          </Link>
        )}
      </div>
    </form>
  );
}
