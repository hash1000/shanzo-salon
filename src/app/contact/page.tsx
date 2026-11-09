import type { Metadata } from "next";
import SiteShell, {
  PageHeading,
  SocialLinks,
} from "@/components/site/SiteShell";
import ContactPageSection from "@/components/sections/ContactPageSection";
import "./contact.css";
export const metadata: Metadata = {
  title: "Contact | Shanzo Salon",
  description:
    "Visit Shanzo Salon at 67 W Chicago Ave, Chicago. Email info@shanzosalon.com or call (312) 754-0191. Open Monday to Saturday 10 AM to 7 PM, Sunday 1 PM to 7 PM.",
};
export default function ContactPage() {
  return (
    <SiteShell>
      <div className="contact-page">
        <PageHeading
          label="01 / Let’s talk"
          title="We’re here for"
          accent="you."
        >
          Questions about a service, a group visit or your next appointment?
          Send us a note and we will reply by email. Ready to book? You can
          reserve online any time.
        </PageHeading>
        <ContactPageSection />
        <section className="about-wrap pb-20">
          <p className="about-label">02 / Come on in</p>
          <iframe
            title="Shanzo Salon at 67 W Chicago Ave, Chicago, IL 60654"
            src="https://maps.google.com/maps?q=67+W+Chicago+Ave+Chicago+IL+60654&output=embed"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            className="h-96 w-full rounded-2xl border-0"
          />
          <div className="mt-6 flex justify-between gap-6">
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=67+W+Chicago+Ave+Chicago+IL+60654"
              target="_blank"
              rel="noopener noreferrer"
              className="about-text-link"
            >
              Get directions ↗
            </a>
            <SocialLinks />
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
