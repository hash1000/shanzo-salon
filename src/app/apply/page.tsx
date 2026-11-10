import type { Metadata } from "next";
import { getSalonHours } from "@/lib/salon-hours-store";
import SalonHoursList from "@/components/hours/SalonHoursList";
import SiteShell, { PageHeading } from "@/components/site/SiteShell";
import ContactSection from "@/components/home/ContactSection";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Careers | Shanzo Salon",
  description:
    "Apply to join Shanzo Salon in Chicago. Tell us about your hair, nail, or waxing experience.",
};
export default async function ApplyPage() {
  const hours = await getSalonHours();
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
      <ContactSection
        variant="page"
        application
        hours={<SalonHoursList data={hours} now={new Date().toISOString()} />}
      />
    </SiteShell>
  );
}
