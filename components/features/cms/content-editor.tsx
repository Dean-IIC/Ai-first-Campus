"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { catalogAction, loadContentAction, type Catalog } from "@/actions/content";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { useAdmin } from "@/components/features/admin/admin-provider";
import { LINK_FIELDS, LIST_SPECS, LIST_TABLES, MESSAGE_FIELDS, PAGE_FIELDS, SITE_FIELDS } from "@/lib/cms/schema";
import { keyForPath } from "@/lib/cms/paths";
import ListForm from "./list-form";
import RecordForm from "./record-form";

type Row = Record<string, unknown>;

/** The admin's editor for everything stored as content: pages, leadership messages, every list and the contact details. */
export default function ContentEditor({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { save } = useAdmin();
  const router = useRouter();
  const pathname = usePathname();
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [key, setKey] = useState("");
  const [value, setValue] = useState<unknown>(null);
  const [version, setVersion] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setKey(keyForPath(pathname) ?? "site:details");
    catalogAction().then((r) => (r.ok ? setCatalog(r.catalog) : setError(r.error)));
  }, [open, pathname]);

  useEffect(() => {
    if (!open || !key) return;
    let live = true;
    setValue(null);
    setError("");
    loadContentAction(key).then((r) => {
      if (!live) return;
      if (r.ok) setValue(r.value);
      else setError(r.error);
    });
    return () => {
      live = false;
    };
  }, [open, key, version]);

  async function store(next: unknown, label: string) {
    const ok = await save(key, next, label);
    if (ok) {
      router.refresh();
      setVersion((v) => v + 1);
    }
    return ok;
  }

  const [kind, name] = key.split(":");
  const title = (v: unknown) => String((v as Row | null)?.title ?? (v as Row | null)?.designation ?? name);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit content</DialogTitle>
          <DialogDescription>Choose what to edit. Saved changes appear on the live site at once and can be undone from the toolbar.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-1.5">
          <Label htmlFor="cms-target">What do you want to edit?</Label>
          <NativeSelect id="cms-target" value={key} onChange={(e) => setKey(e.target.value)}>
            <option value="site:details">Contact details (address, phone, email)</option>
            <option value="site:links">Alumni, R&amp;D and UHV portal links</option>
            <optgroup label="Lists">
              {LIST_TABLES.map((t) => <option key={t} value={`list:${t}`}>{LIST_SPECS[t].label}</option>)}
            </optgroup>
            <optgroup label="Page text">
              {catalog?.pages.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
              {!catalog && key.startsWith("page:") && <option value={key}>{name}</option>}
            </optgroup>
            <optgroup label="Leadership messages">
              {catalog?.messages.map((m) => <option key={m.key} value={m.key}>{m.label}</option>)}
              {!catalog && key.startsWith("message:") && <option value={key}>{name}</option>}
            </optgroup>
          </NativeSelect>
        </div>
        {error && <p role="alert" className="text-sm font-medium text-destructive">{error}</p>}
        {!error && value === null && <p className="text-sm text-muted-foreground">Loading…</p>}
        {value !== null && kind === "list" && name in LIST_SPECS && (
          <ListForm key={`${key}-${version}`} spec={LIST_SPECS[name as keyof typeof LIST_SPECS]} initial={value as Row[]} onSave={(rows) => store(rows, `List: ${LIST_SPECS[name as keyof typeof LIST_SPECS].label}`)} />
        )}
        {value !== null && kind !== "list" && (
          <RecordForm
            key={`${key}-${version}`}
            fields={kind === "page" ? PAGE_FIELDS : kind === "message" ? MESSAGE_FIELDS : key === "site:links" ? LINK_FIELDS : SITE_FIELDS}
            initial={value as Row}
            onSave={(v) => store(v, key === "site:links" ? "Alumni, R&D and UHV portal links" : kind === "site" ? "Contact details" : `${kind === "page" ? "Page" : "Message"}: ${title(v)}`)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
