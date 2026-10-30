import type { Metadata } from "next";
import SiteShell, {
  PageHeading,
  SocialLinks,
} from "@/components/site/SiteShell";
import ContactSection from "@/components/home/ContactSection";
export const metadata: Metadata = {
  title: "Contact | Shanzo Salon",
  description:
    "Contact Shanzo Salon at 67 W Chicago Ave, Chicago, IL 60654. Call info@shanzosalon.com. Open 10 AM–7 PM daily.",
};
export default function ContactPage() {
  return (
    <SiteShell>
      <PageHeading label="01 / Let’s talk" title="We’re here for" accent="you.">
        Questions about a service or your next visit? Send us a note. For
        appointments, you can also book online.
      </PageHeading>
      <ContactSection variant="page" />
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
    </SiteShell>
  );
}
