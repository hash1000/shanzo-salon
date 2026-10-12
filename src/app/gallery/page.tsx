import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import Reveal from "@/components/home/Reveal";
import { SITE_NAME, SOCIALS } from "@/lib/site";
import "./gallery.css";

export const metadata: Metadata = {
  title: `Gallery | ${SITE_NAME}`,
  description: `Explore the beauty gallery at ${SITE_NAME} in Chicago, including nail designs and salon videos.`,
  openGraph: {
    title: `Gallery | ${SITE_NAME}`,
    description: "Explore our beauty gallery and salon videos.",
    images: [{ url: "/gallery/gallery-image-2.webp", alt: "Colorful nail art with flowing rainbow patterns" }],
  },
};

const images = [
  "A relaxing shoulder massage in a treatment chair",
  "Colorful nail art with flowing rainbow patterns",
  "Classic French manicure with white tips",
  "A hand treatment beside a warm wax bath",
  "Nude and bronze glitter nail design",
  "A relaxing hair wash at a salon basin",
];

export default function GalleryPage() {
  return (
    <div className="salon-home gallery-page">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Navbar />
      <main id="main-content">
        <Reveal>
          <section className="gallery-welcome home-container text-center" aria-labelledby="welcome-title">
            <h1 id="welcome-title" className="section-title font-script">Welcome</h1>
            <p>There’s much to see here. So, take your time, look around, and learn all there is to know about us. We hope you enjoy our site and take a moment to drop us a line.</p>
            <Link href="/about" className="text-link">Find Out More <span aria-hidden="true">↗</span></Link>
          </section>
          <section className="gallery-photo-grid" aria-label="Beauty photo gallery">
            {images.map((alt, index) => (
              <div className="gallery-photo" key={alt}>
                <Image src={`/gallery/gallery-image-${index + 1}.webp`} alt={alt} fill sizes="(max-width: 639px) 50vw, 33vw" className="object-cover" />
              </div>
            ))}
          </section>
          <section className="gallery-videos home-container" aria-labelledby="video-title">
            <h2 id="video-title" className="eyebrow text-center">Video</h2>
            <div className="gallery-video-grid">
              {[1, 2].map(index => (
                <video key={index} autoPlay loop muted playsInline preload="auto" aria-label={index === 1 ? "Beauty treatment video: warm wax preparation" : "Beauty treatment video: foot care"}>
                  <source src={`/gallery/gallery-video-${index}.mp4`} type="video/mp4" />
                  Your browser does not support video playback. <a href={`/gallery/gallery-video-${index}.mp4`}>Download the video</a>.
                </video>
              ))}
            </div>
          </section>
          <section className="gallery-instagram home-container text-center" aria-labelledby="instagram-title">
            <h2 id="instagram-title" className="eyebrow">Instagram</h2>
            <p>Feed coming soon</p>
            <a href={SOCIALS.instagram} target="_blank" rel="noopener noreferrer" className="text-link">Follow me on Instagram <span aria-hidden="true">↗</span></a>
          </section>
        </Reveal>
      </main>
      <Footer />
    </div>
  );
}
