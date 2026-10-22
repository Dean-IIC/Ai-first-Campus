/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from "react";
import { Building2, CalendarDays, ExternalLink, FileText, GraduationCap, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import { mouDocumentHref, mouStatus } from "@/lib/mous";
import type { Mou } from "@/lib/types";

const SUFFIXES = /^(pvt|private|ltd|limited|llp|inc|co)$/i;

/** Initials for a partner without a logo: "VTU", "CITRIOT" → "CI", "Dyashin Technosoft Pvt Ltd" → "DT". */
function partnerInitials(name: string): string {
  const words = name.split(/[\s-]+/).filter((w) => w && !SUFFIXES.test(w));
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].length <= 4 ? words[0].toUpperCase() : words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

/** The partner's logo on white, never cropped, or its initials until a logo is added. */
export function MouLogo({ partner, src }: { partner: string; src: string | null }) {
  if (src) return <img src={src} alt={`${partner} logo`} className="size-16 rounded-xl bg-white object-contain p-1.5 ring-1 ring-border" />;
  return (
    <span aria-hidden="true" className="grid size-16 place-items-center rounded-xl bg-t-amber-tint text-lg font-semibold text-t-amber dark:text-t-amber-light">
      {partnerInitials(partner || "?")}
    </span>
  );
}

const link = "flex items-center gap-1 text-sm font-semibold text-primary hover:underline";

/**
 * One MoU for visitors: logo, partner, type, academic year (or signing date), departments,
 * purpose and association, with the document link when there is one visitors may open. The
 * signed-in admin also sees an admin-only document; `children` holds the admin buttons.
 */
export default function MouCardView({ mou, admin = false, children }: { mou: Mou; admin?: boolean; children?: ReactNode }) {
  // The academic year replaces the signing date on the card when both are set.
  const signed = mou.academic_year ? "" : formatDate(mou.signed_on);
  const expired = mouStatus(mou) === "Expired";
  const uploaded = Boolean(mou.document_path) && (mou.document_public || admin);
  return (
    <Card className="relative h-full border-t-[3px] border-t-t-amber transition-shadow hover:shadow-md">
      {children}
      <CardContent className="flex h-full flex-col items-center gap-2.5 text-center">
        <MouLogo partner={mou.partner} src={mou.logo_url} />
        <h3 className="mt-1 font-semibold leading-snug text-heading">{mou.partner}</h3>
        <div className="flex flex-wrap justify-center gap-1.5">
          <Badge variant="secondary" className="bg-t-amber-tint text-t-amber dark:text-t-amber-light">{mou.partner_type}</Badge>
          {expired && <Badge variant="muted">Expired</Badge>}
        </div>
        {signed && (
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <CalendarDays aria-hidden="true" className="size-4" />
            Signed on {signed}
          </p>
        )}
        {mou.academic_year && (
          <p className="flex items-center gap-1.5 text-sm font-medium text-t-amber dark:text-t-amber-light">
            <GraduationCap aria-hidden="true" className="size-4" />
            {mou.academic_year}
          </p>
        )}
        {mou.departments && (
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Building2 aria-hidden="true" className="size-4 shrink-0" />
            {mou.departments}
          </p>
        )}
        {mou.purpose && <p className="line-clamp-3 text-sm text-foreground">{mou.purpose}</p>}
        {mou.association && (
          <Badge variant="muted" className="mt-auto whitespace-normal">
            {mou.association}
          </Badge>
        )}
        {uploaded ? (
          <a href={mouDocumentHref(mou.slug)} target="_blank" rel="noopener noreferrer" className={link}>
            {mou.document_public ? <FileText aria-hidden="true" className="size-3.5" /> : <Lock aria-hidden="true" className="size-3.5" />}
            {mou.document_public ? "View MoU" : "MoU document (admin only)"}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : (
          mou.document_url && (
            <a href={mou.document_url} target="_blank" rel="noopener noreferrer" className={link}>
              View MoU
              <ExternalLink aria-hidden="true" className="size-3.5" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          )
        )}
      </CardContent>
    </Card>
  );
}
