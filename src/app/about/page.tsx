import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Scissors, Sparkles, HeartHandshake, Leaf, MapPin } from "lucide-react";
import AboutNav from "@/components/about/AboutNav";
import { SiteFooter } from "@/components/site/SiteShell";
import AboutReveal from "@/components/about/AboutReveal";
import { BOOKING_URL, PHONE, PHONE_HREF } from "@/lib/site";
import "./about.css";

export const metadata: Metadata = {
  title: "About Shanzo Salon | Hair, Nails & Waxing in Chicago",
  description: "Meet Shanzo Salon. Thoughtful hair, nail, and waxing services for men, women, and kids at 67 W Chicago Ave, Chicago, IL.",
  openGraph: { title: "A little time, beautifully yours | Shanzo Salon", description: "Personal care in the heart of Chicago. Get to know our salon.", images: [{ url: "/images/salon-reception.webp", alt: "Shanzo Salon reception and chandelier" }] },
};

// Replace these local images and their descriptive alt text with your own photography.
const images = {
  hero: { src: "/images/salon-reception.webp", alt: "Shanzo Salon reception desk beneath a crystal chandelier" },
  story: { src: "/images/salon-overview.webp", alt: "Nail stations and pedicure seating at Shanzo Salon" },
  detail: { src: "/images/gold-faucet.webp", alt: "Fresh towels and a sculptural vase beside a gold faucet" },
};
const services = [
  { number: "01", name: "Hair", description: "From a thoughtful trim to a new shape, we create hair that suits your features, your routine, and the way you want to feel.", detail: "Shape. Movement. You." },
  { number: "02", name: "Nails", description: "Considered colour, careful shaping, and a polished finish. Small details that make everyday moments feel a little more put together.", detail: "Care in every detail." },
  { number: "03", name: "Waxing", description: "Attentive waxing with your comfort in mind. We take our time, explain the process, and help you feel at ease.", detail: "A softer kind of care." },
];
const reasons = [
  { icon: Scissors, title: "Skilled stylists", text: "A practiced eye and a thoughtful approach." },
  { icon: Leaf, title: "Quality products", text: "Chosen with your hair and skin in mind." },
  { icon: Sparkles, title: "A clean, calm space", text: "Room to settle in and slow down." },
  { icon: HeartHandshake, title: "Personal attention", text: "We listen before we begin." },
];

export default function AboutPage() {
  return (
    <div className="about-luxury">
      <a className="about-skip" href="#main-content">Skip to content</a>
      <AboutNav />
      <main id="main-content">
        <section className="about-hero" aria-labelledby="about-title">
          <Image src={images.hero.src} alt={images.hero.alt} fill preload sizes="100vw" className="object-cover" />
          <div className="about-hero-shade site-bright-shade" />
          <div className="about-wrap relative z-10 py-28 md:py-36">
            <p className="about-label text-white/85">Shanzo Salon · Chicago</p>
            <h1 id="about-title">A little time,<br /><em>beautifully yours.</em></h1>
            <p className="about-hero-description">Personal care. Thoughtful details. A place to feel like yourself.</p>
            <a href={BOOKING_URL} className="about-button about-button-light mt-9">Book an Appointment <ArrowUpRight size={18} aria-hidden="true" /></a>
          </div>
          <a href="#our-story" className="about-hero-scroll"><span>Get to know us</span><ArrowDown size={16} aria-hidden="true" /></a>
        </section>

        <section id="our-story" className="about-wrap about-space grid items-center gap-14 lg:grid-cols-2 lg:gap-24" aria-labelledby="story-title">
          <AboutReveal className="about-story-photos">
            <div className="about-story-main"><Image src={images.story.src} alt={images.story.alt} fill sizes="(max-width: 1023px) 85vw, 40vw" className="object-cover object-left" /></div>
            <div className="about-story-detail"><Image src={images.detail.src} alt={images.detail.alt} fill sizes="(max-width: 1023px) 36vw, 18vw" className="object-cover" /></div>
            <span className="about-photo-caption">A warm welcome, always.</span>
          </AboutReveal>
          <AboutReveal>
            <p className="about-label">01 / Our story</p>
            <h2 id="story-title">Good care starts<br />with <em>listening.</em></h2>
            <div className="about-rule" />
            <p className="about-body">At Shanzo Salon, we believe feeling good starts with feeling understood. Our Chicago salon welcomes men, women, and kids for hair, nails, and waxing, with care shaped around each person.</p>
            <p className="about-body mt-5">Whether you’re visiting for a familiar service or trying something different, we make space for your questions, preferences, and everyday needs.</p>
            <Link href="/team" className="about-text-link mt-7">Meet the people behind the care <ArrowUpRight size={17} aria-hidden="true" /></Link>
          </AboutReveal>
        </section>

        <section className="about-services about-space" aria-labelledby="services-title">
          <div className="about-wrap">
            <AboutReveal className="mb-12 flex flex-wrap items-end justify-between gap-6">
              <div><p className="about-label">02 / What we do</p><h2 id="services-title">The details.<br /><em>The difference.</em></h2></div>
              <span className="about-small-note">Hair · Nails · Waxing</span>
            </AboutReveal>
            <div className="grid gap-5 md:grid-cols-3">
              {services.map(service => <AboutReveal key={service.name} className="h-full"><article className="about-service-card h-full"><span className="about-card-number">{service.number}</span><h3>{service.name}</h3><p className="about-body">{service.description}</p><div className="about-card-bottom"><span>{service.detail}</span><ArrowUpRight size={20} aria-hidden="true" /></div></article></AboutReveal>)}
            </div>
          </div>
        </section>

        <section className="about-wrap about-space" aria-labelledby="reasons-title">
          <AboutReveal className="text-center"><p className="about-label">03 / Why clients choose us</p><h2 id="reasons-title">Care you can <em>feel.</em></h2></AboutReveal>
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map(({ icon: Icon, title, text }) => <AboutReveal key={title} className="about-reason"><Icon size={28} strokeWidth={1.25} aria-hidden="true" /><h3>{title}</h3><p>{text}</p></AboutReveal>)}
          </div>
        </section>

        <AboutReveal><section className="about-promise" aria-labelledby="promise-title"><div className="about-wrap"><p id="promise-title" className="about-label">Our promise to you</p><blockquote>“You’ll be heard, cared for,<br className="hidden sm:block" /> and never rushed.<br /><em>That’s our promise, every visit.</em>”</blockquote><span className="about-promise-signature">The Shanzo team</span></div></section></AboutReveal>

        <section className="about-wrap about-space text-center" aria-labelledby="visit-title"><AboutReveal><p className="about-label">Your next visit</p><h2 id="visit-title">Make a little room<br /><em>for yourself.</em></h2><p className="about-body mx-auto mt-6 max-w-md">We’d love to welcome you. Choose your appointment or get in touch.</p><div className="mt-9 flex flex-wrap justify-center gap-4"><a href={BOOKING_URL} className="about-button about-button-dark">Book an Appointment <ArrowUpRight size={17} aria-hidden="true" /></a><Link href="/contact" className="about-button about-button-outline">Contact Us <ArrowUpRight size={17} aria-hidden="true" /></Link></div></AboutReveal></section>

        <section className="about-location" aria-labelledby="location-title"><div className="about-wrap grid gap-10 py-14 md:grid-cols-[1fr_1.5fr] md:items-center"><div><MapPin size={23} strokeWidth={1.4} aria-hidden="true" /><p className="about-label mt-5">Find us in Chicago</p><h2 id="location-title">Come on <em>in.</em></h2><address className="mt-5 not-italic">67 W Chicago Ave<br />Chicago, IL 60654</address><a href={PHONE_HREF} className="mt-3 inline-block">{PHONE}</a><br /><a className="about-text-link mt-5" href="https://www.google.com/maps/dir/?api=1&destination=67+W+Chicago+Ave+Chicago+IL" target="_blank" rel="noopener noreferrer">Get directions <ArrowUpRight size={16} aria-hidden="true" /></a></div><iframe title="Shanzo Salon location at 67 W Chicago Ave, Chicago" src="https://maps.google.com/maps?q=67+W+Chicago+Ave+Chicago+IL&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen className="h-72 w-full rounded-2xl border-0 md:h-80" /></div></section>
      </main>
      <SiteFooter />
    </div>
  );
}
