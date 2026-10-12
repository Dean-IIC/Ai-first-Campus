/* eslint-disable @next/next/no-img-element */
import { CalendarDays, ExternalLink, Handshake } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import type { Mou } from "@/lib/types";

/** One MoU: partner, type, purpose, dates and a link to the signed document. */
export default function MouCard({ mou }: { mou: Mou }) {
  return (
    <Card className="h-full border-t-[3px] border-t-t-amber transition-shadow hover:shadow-md">
      <CardContent className="flex h-full flex-col gap-3">
        <div className="flex items-start gap-3">
          {mou.logo_url ? (
            <img src={mou.logo_url} alt={`${mou.partner} logo`} className="size-12 shrink-0 rounded-lg bg-white object-contain p-1 ring-1 ring-border" />
          ) : (
            <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-t-amber-tint text-t-amber dark:text-t-amber-light">
              <Handshake aria-hidden="true" className="size-6" />
            </span>
          )}
          <div className="min-w-0">
            <h3 className="font-semibold leading-snug text-heading">{mou.partner}</h3>
            <Badge variant="muted" className="mt-1">
              {mou.partner_type}
            </Badge>
          </div>
        </div>
        {mou.purpose && <p className="flex-1 text-sm text-muted-foreground">{mou.purpose}</p>}
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          {mou.signed_on && (
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <CalendarDays aria-hidden="true" className="size-4" />
              Signed {formatDate(mou.signed_on)}
              {mou.valid_until ? `, valid until ${formatDate(mou.valid_until)}` : ""}
            </span>
          )}
          {mou.document_url && (
            <a href={mou.document_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 font-semibold text-primary hover:underline">
              View MoU
              <ExternalLink aria-hidden="true" className="size-3.5" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
