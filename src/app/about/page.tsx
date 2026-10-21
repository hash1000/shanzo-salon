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

const team = [
  { name: "Molly Sproles-Barbian", initials: "MS", service: "Hair Stylist", image: "/molly-sproles-Barbian(Hair Stylist).png" },
  { name: "Genean Michele", initials: "GD", service: "Hair Stylist", image: null },
  { name: "Deanna Walsh", initials: "DW", service: "Hair Stylist", image: null },
  { name: "Nina Maney", initials: "NM", service: "Hair Stylist", image: "/nina-maney(Hair Stylist).png" },
  { name: "Dana Rivera", initials: "DR", service: "Nail Technician", image: "/dana-rivera(Nail Technician) 2026.png" },
  { name: "Marija Aleksic", initials: "MA", service: "Nail Technician", image: "/marija-aleksic (Nail Technician).png" },
  { name: "Melanie Ruiz", initials: "MR", service: "Esthetician", image: "/melanie-ruiz(Esthetician).png" },
];

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
          <section className="about-team home-container text-center" aria-labelledby="team-title">
            <p className="eyebrow">The people behind your visit</p>
            <h2 id="team-title" className="section-title font-script">Our Team</h2>
            <ul className="about-team-grid">
              {team.map((member) => (
                <li key={member.name} className="about-team-member">
                  <div className="about-team-portrait">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={`${member.name}, ${member.service}`}
                        fill
                        sizes="(max-width: 639px) 84vw, (max-width: 900px) 35vw, 23vw"
                      />
                    ) : (
                      <span className="about-team-avatar" aria-hidden="true">{member.initials}</span>
                    )}
                  </div>
                  <h3>{member.name}</h3>
                  {member.service && <p>{member.service}</p>}
                </li>
              ))}
            </ul>
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
