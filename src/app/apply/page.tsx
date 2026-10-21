import type { Metadata } from "next";
import SiteShell, { PageHeading } from "@/components/site/SiteShell";
import ContactSection from "@/components/home/ContactSection";
export const metadata: Metadata = {
  title: "Careers | Shanzo Salon",
  description:
    "Apply to join Shanzo Salon in Chicago. Tell us about your hair, nail, or waxing experience.",
};
export default function ApplyPage() {
  return (
    <SiteShell>
      <PageHeading
        label="01 / Careers at Shanzo"
        title="Bring your"
        accent="care."
      >
        We’re hiring people who take pride in their work and make others feel
        welcome. Tell us about your experience in hair, nails, or waxing, your
        availability, and what you’d bring to our team.
      </PageHeading>
      <ContactSection variant="page" application />
    </SiteShell>
  );
}
