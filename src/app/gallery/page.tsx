import type { Metadata } from "next";
import SiteShell, { PageHeading, VisitCTA } from "@/components/site/SiteShell";
import Gallery from "@/components/site/Gallery";
import "./gallery.css";
export const metadata: Metadata = {
  title: "Gallery | Shanzo Salon",
  description:
    "Take a look inside Shanzo Salon in Chicago. Explore our hair, nail, and waxing spaces.",
};
export default function GalleryPage() {
  return (
    <SiteShell>
      <PageHeading
        label="01 / A closer look"
        title="A space to settle"
        accent="in."
      >
        Warm light, thoughtful details, and room to feel comfortable. Take a
        look around Shanzo Salon.
      </PageHeading>
      <Gallery />
      <VisitCTA />
    </SiteShell>
  );
}
