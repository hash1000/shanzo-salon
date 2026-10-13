import Navbar from "@/components/home/Navbar";
import Hero from "@/components/home/Hero";
import HiringBanner from "@/components/home/HiringBanner";
import ServicesIntro from "@/components/home/ServicesIntro";
import GalleryGrid from "@/components/home/GalleryGrid";
import Reviews from "@/components/home/Reviews";
import ContactSection from "@/components/home/ContactSection";
import MapEmbed from "@/components/home/MapEmbed";
import SocialLinks from "@/components/home/SocialLinks";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/home/Footer";
import Reveal from "@/components/home/Reveal";
export default function Home() {
  return (
    <div className="salon-home">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Navbar />
      <main id="main-content">
        <Hero />
        <Reveal>
          <HiringBanner />
          <ServicesIntro />
          <GalleryGrid />
          <Reviews />
          <ContactSection />
          <MapEmbed />
          <SocialLinks />
          <Newsletter />
        </Reveal>
      </main>
      <Footer />
    </div>
  );
}
