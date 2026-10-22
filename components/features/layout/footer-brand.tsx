import Link from "next/link";
import { Mail, MapPin, Navigation, Phone, Send } from "lucide-react";
import { site } from "@/lib/site";
import { getSiteDetails } from "@/lib/site-details";
import AnniversaryBadge from "./anniversary-badge";
import Logo from "./logo";

/** Logo, motto, address and contact links at the start of the footer. */
export default async function FooterBrand() {
  const details = await getSiteDetails();
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(details.mapQuery)}`;
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="rounded-full bg-white p-0.5">
          <Logo size="sm" />
        </span>
        <div>
          <p className="text-sm font-bold leading-tight text-white">{site.name}</p>
          <p className="mt-0.5 text-xs italic text-gold">Pursuit of knowledge is eternal</p>
        </div>
        <AnniversaryBadge small className="h-12" />
      </div>
      <ul className="mt-5 space-y-2.5 text-xs leading-relaxed text-white/75">
        <li className="flex gap-2.5">
          <MapPin aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-gold" />
          <address className="not-italic">
            {details.address.line1}, {details.address.line2}
            <br />
            {details.address.city} {details.address.pin}, {details.address.state}
          </address>
        </li>
        {details.phone && (
          <li className="flex gap-2.5">
            <Phone aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-gold" />
            <a className="hover:text-white" href={`tel:${details.phone.replace(/\s+/g, "")}`}>
              {details.phone}
            </a>
          </li>
        )}
        {details.email && (
          <li className="flex gap-2.5">
            <Mail aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-gold" />
            <a className="hover:text-white" href={`mailto:${details.email}`}>
              {details.email}
            </a>
          </li>
        )}
        <li className="flex gap-2.5">
          <Navigation aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-gold" />
          <a className="hover:text-white hover:underline hover:underline-offset-4" href={mapUrl} target="_blank" rel="noopener noreferrer">
            Get directions
            <span className="sr-only"> (opens Google Maps in a new tab)</span>
          </a>
        </li>
        <li className="flex gap-2.5">
          <Send aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-gold" />
          <Link className="hover:text-white hover:underline hover:underline-offset-4" href="/contact#write">
            Write to the college
          </Link>
        </li>
      </ul>
    </div>
  );
}
