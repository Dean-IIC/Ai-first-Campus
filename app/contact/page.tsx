import { ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import ContentPage, { pageMetadata } from "@/components/features/layout/content-page";
import EnquiryForm from "@/components/features/forms/enquiry-form";
import Panel from "@/components/features/content/panel";
import { site } from "@/lib/site";
import { getSiteDetails } from "@/lib/site-details";
import { linkText } from "@/lib/ui";

export const revalidate = 300;
export const generateMetadata = () => pageMetadata("contact", "Contact");

export default async function ContactPage() {
  const details = await getSiteDetails();
  const embed = `https://www.google.com/maps?q=${encodeURIComponent(details.mapQuery)}&output=embed`;
  const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(details.mapQuery)}`;

  return (
    <ContentPage
      slug="contact"
      fallbackTitle="Contact"
      current="/contact"
      trail={[{ label: "Contact" }]}
      layout={() => (
        <>
          <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
            <Panel title="Address" icon={MapPin} tone="blue">
              <address className="not-italic leading-relaxed">
                <span className="font-semibold text-heading">{site.name}</span>
                <br />
                {details.address.line1}
                <br />
                {details.address.line2}, {details.address.city} {details.address.pin}
                <br />
                {details.address.state}, India
              </address>
              <ul className="mt-4 space-y-2 text-[0.9375rem]">
                {details.phone && (
                  <li className="flex items-center gap-2">
                    <Phone aria-hidden="true" className="size-4 text-primary" />
                    <a className={linkText} href={`tel:${details.phone.replace(/\s+/g, "")}`}>{details.phone}</a>
                  </li>
                )}
                {details.email && (
                  <li className="flex items-center gap-2">
                    <Mail aria-hidden="true" className="size-4 text-primary" />
                    <a className={linkText} href={`mailto:${details.email}`}>{details.email}</a>
                  </li>
                )}
                <li className="flex items-center gap-2">
                  <ExternalLink aria-hidden="true" className="size-4 text-primary" />
                  <a className={linkText} href={directions} target="_blank" rel="noopener noreferrer">
                    Get directions on Google Maps
                  </a>
                </li>
              </ul>
            </Panel>
            <div className="min-h-72 overflow-hidden rounded-lg border border-border bg-muted">
              <iframe
                src={embed}
                title="Map showing HKBK College of Engineering in Nagawara, Bengaluru"
                className="size-full min-h-72"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
          <Panel title="Write to us" icon={Mail} tone="blue" id="write">
            <p className="mb-6 max-w-[64ch] text-muted-foreground">
              Write to us with any question. Your message goes to the college office, which forwards it to the right department.
            </p>
            <EnquiryForm type="contact" submitLabel="Send message" messageLabel="Your message" messageRequired />
          </Panel>
        </>
      )}
    />
  );
}
