import { EnquiryForm } from "@/components/EnquiryForm";
import { enquirySettings, interestGroups } from "@/lib/enquiry";
import { absoluteUrl } from "@/lib/paths";
import { getContent } from "@/lib/sanity";

export default async function ContactPage() {
  const content = await getContent();
  const { settings } = content;
  const addressParts = [
    settings.address?.street,
    settings.address?.city,
    settings.address?.region,
    settings.address?.postalCode,
    settings.address?.country,
  ].filter(Boolean);
  const address = addressParts.join(", ");

  return (
    <div className="wrap grid-12 gap-y-12 py-14 lg:py-24">
      <div className="col-span-12 lg:col-span-5">
        <h1 className="text-title">Contact us</h1>
        <p className="mt-6 max-w-md text-lead">
          Ask about a product, a custom colour or a wholesale order. Every enquiry is read and answered by a person.
        </p>
        <dl className="mt-10 max-w-md">
          <div className="border-t border-rule py-3">
            <dt className="text-sm text-ink-soft">Email</dt>
            <dd><a href={`mailto:${settings.email}`} className="link-rule break-all">{settings.email}</a></dd>
          </div>
          {settings.phone && (
            <div className="border-t border-rule py-3">
              <dt className="text-sm text-ink-soft">Phone</dt>
              <dd><a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="link-rule">{settings.phone}</a></dd>
            </div>
          )}
          {settings.whatsappNumber && (
            <div className="border-t border-rule py-3">
              <dt className="text-sm text-ink-soft">WhatsApp</dt>
              <dd><a href={`https://wa.me/${settings.whatsappNumber}`} rel="noopener" className="link-rule">Message us on WhatsApp</a></dd>
            </div>
          )}
          {address && (
            <div className="border-t border-rule py-3">
              <dt className="text-sm text-ink-soft">Address</dt>
              <dd>
                {address}
                <br />
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                  rel="noopener"
                  className="link-rule"
                >
                  Find us on Google Maps
                </a>
              </dd>
            </div>
          )}
        </dl>
      </div>

      <section id="enquiry" aria-labelledby="enquiry-title" className="col-span-12 lg:col-span-6 lg:col-start-7">
        <h2 id="enquiry-title" className="mb-6 text-section">Send an enquiry</h2>
        <EnquiryForm {...enquirySettings(content)} pageUrl={absoluteUrl("/contact/")} interestGroups={interestGroups(content)} />
      </section>
    </div>
  );
}
