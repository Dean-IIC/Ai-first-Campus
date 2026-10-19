/* eslint-disable @next/next/no-img-element */
import { CalendarDays, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import type { Mou } from "@/lib/types";

const SUFFIXES = /^(pvt|private|ltd|limited|llp|inc|co)$/i;

/** Initials for a partner without a logo: "VTU", "CITRIOT" → "CI", "Dyashin Technosoft Pvt Ltd" → "DT". */
function partnerInitials(name: string): string {
  const words = name.split(/[\s-]+/).filter((w) => w && !SUFFIXES.test(w));
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].length <= 4 ? words[0].toUpperCase() : words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

/** The partner's logo, or its initials until a logo is added. */
function MouLogo({ mou }: { mou: Mou }) {
  if (mou.logo_url) {
    return <img src={mou.logo_url} alt={`${mou.partner} logo`} className="size-16 rounded-xl bg-white object-contain p-1.5 ring-1 ring-border" />;
  }
  return (
    <span aria-hidden="true" className="grid size-16 place-items-center rounded-xl bg-t-amber-tint text-lg font-semibold text-t-amber dark:text-t-amber-light">
      {partnerInitials(mou.partner)}
    </span>
  );
}

/** One MoU: logo, partner name, signed date and association, centred in a card. */
export default function MouCard({ mou }: { mou: Mou }) {
  const signed = formatDate(mou.signed_on);
  return (
    <Card className="h-full border-t-[3px] border-t-t-amber transition-shadow hover:shadow-md">
      <CardContent className="flex h-full flex-col items-center gap-2.5 text-center">
        <MouLogo mou={mou} />
        <h3 className="mt-1 font-semibold leading-snug text-heading">{mou.partner}</h3>
        {signed && (
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <CalendarDays aria-hidden="true" className="size-4" />
            Signed on {signed}
          </p>
        )}
        {mou.association && (
          <Badge variant="muted" className="mt-auto whitespace-normal">
            {mou.association}
          </Badge>
        )}
        {mou.document_url && (
          <a href={mou.document_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            View MoU
            <ExternalLink aria-hidden="true" className="size-3.5" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
      </CardContent>
    </Card>
  );
}
