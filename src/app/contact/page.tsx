import type { Metadata } from "next";
import Navbar from "@/components/home/Navbar";
import ContactSection from "@/components/home/ContactSection";
import SocialLinks from "@/components/home/SocialLinks";
import Footer from "@/components/home/Footer";
import { SITE_NAME, ADDRESS } from "@/lib/site";
import "./contact.css";

export const metadata: Metadata = {
  title: `Contact Us | ${SITE_NAME}`,
  description: `Get in touch with ${SITE_NAME} at ${ADDRESS}. Send a message, call us, or check our opening hours.`,
  openGraph: {
    title: `Contact Us | ${SITE_NAME}`,
    description: "Send us a message or visit our nail and beauty salon in Chicago. View our address, phone number, and opening hours.",
  },
};

export default function ContactPage() {
  return (
    <div className="salon-home contact-page">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Navbar />
      <main id="main-content">
        <ContactSection variant="page" />
        <SocialLinks heading="Connect with us" />
      </main>
      <Footer />
    </div>
  );
}
