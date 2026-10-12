import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import SocialLinks from "@/components/home/SocialLinks";
import Reveal from "@/components/home/Reveal";
import { SITE_NAME, SOCIALS } from "@/lib/site";
import "./about.css";

export const metadata: Metadata = {
  title: `About Us | ${SITE_NAME}`,
  description: `Take a look inside ${SITE_NAME}, a nail and beauty salon in Chicago’s Gold Coast.`,
  openGraph: {
    title: `About Us | ${SITE_NAME}`,
    description: `Take a look inside our Chicago nail and beauty salon.`,
    images: [{ url: "/about/about1.webp", alt: "Salon vanity with gold fixtures and an illuminated mirror" }],
  },
};

export default function AboutPage() {
  return (
    <div className="salon-home about-page">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Navbar />
      <main id="main-content">
        <Reveal>
          <section className="home-container about-gallery" aria-labelledby="about-title">
            <h1 id="about-title" className="eyebrow text-center">About Us</h1>
            <div className="about-main-image">
              <Image src="/about/about1.webp" alt="Salon vanity with twin sinks, warm gold fixtures, and a large illuminated mirror" width={1920} height={960} sizes="(max-width: 1159px) 100vw, 1120px" preload />
            </div>
            <div className="about-detail-grid">
              <Image src="/about/about-2.webp" alt="Gold faucet beside a sculptural vase and fresh towels at the salon" width={1200} height={600} sizes="(max-width: 639px) 100vw, (max-width: 1159px) 50vw, 546px" />
              <Image src="/about/web-3.webp" alt="Gold Coast Beauty Spa business cards on a wooden counter" width={1200} height={600} sizes="(max-width: 639px) 100vw, (max-width: 1159px) 50vw, 546px" />
            </div>
          </section>
          <section className="about-instagram home-container text-center" aria-labelledby="instagram-title">
            <h2 id="instagram-title" className="eyebrow">Instagram</h2>
            <p>Feed coming soon</p>
            <a href={SOCIALS.instagram} target="_blank" rel="noopener noreferrer" className="text-link">Follow me on Instagram <span aria-hidden="true">↗</span></a>
          </section>
          <section className="about-reviews" aria-labelledby="reviews-title">
            <Image src="/about/transformations-gallery-5.webp" alt="Comfortable salon chairs at the hair washing stations" fill sizes="100vw" className="object-cover" />
            <div className="about-reviews-shade" />
            <div className="home-container about-reviews-content text-center">
              <h2 id="reviews-title" className="section-title font-script">Reviews</h2>
              <p>Reviews coming soon!</p>
            </div>
          </section>
          <SocialLinks heading="Connect with us" />
        </Reveal>
      </main>
      <Footer />
    </div>
  );
}
