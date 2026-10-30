import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Music2 } from "lucide-react";
import AboutNav from "@/components/about/AboutNav";
import Reveal from "@/components/about/AboutReveal";
import { ADDRESS, BOOKING_URL, PHONE, PHONE_HREF, SOCIALS } from "@/lib/site";
import type { ReactNode } from "react";

export function SocialLinks() {
  return (
    <div className="flex gap-4">
      {SOCIALS.instagram && (
        <a
          href={SOCIALS.instagram}
          aria-label="Shanzo Salon on Instagram"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r=".6" fill="currentColor" />
          </svg>
        </a>
      )}
      {SOCIALS.tiktok && (
        <a
          href={SOCIALS.tiktok}
          aria-label="Shanzo Salon on TikTok"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Music2 size={19} />
        </a>
      )}
    </div>
  );
}
export function SiteFooter() {
  return (
    <footer className="about-footer">
      <div className="about-wrap grid gap-8 py-12 md:grid-cols-[1fr_1fr_auto]">
        <Link
          href="/"
          className="about-wordmark"
          aria-label="Shanzo Salon home"
        >
          <Image
            src="/images/logo.png"
            alt="Gold Coast Beauty"
            width={4500}
            height={1425}
            sizes="240px"
            className="site-logo"
          />
        </Link>
        <div>
          <address className="not-italic">{ADDRESS}</address>
          <a href={PHONE_HREF}>{PHONE}</a>
          <p className="mt-4">© 2026 Shanzo Salon. All rights reserved.</p>
        </div>
        <div className="grid content-start gap-4">
          <SocialLinks />
          <Link href="/hours" prefetch={false}>Walk-in hours</Link>
          <Link href="/apply">
            Careers{" "}
            <ArrowUpRight className="inline" size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
export default function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="about-luxury site-page">
      <a href="#main-content" className="about-skip">
        Skip to content
      </a>
      <AboutNav />
      <main id="main-content">{children}</main>
      <SiteFooter />
    </div>
  );
}
export function PageHeading({
  label,
  title,
  accent,
  children,
}: {
  label: string;
  title: string;
  accent: string;
  children?: ReactNode;
}) {
  return (
    <section className="about-wrap site-page-heading">
      <p className="about-label">{label}</p>
      <h1>
        {title} <em>{accent}</em>
      </h1>
      {children && <div className="about-body mt-6 max-w-xl">{children}</div>}
    </section>
  );
}
export function VisitCTA() {
  return (
    <section className="site-visit-cta about-space text-center">
      <Reveal className="about-wrap">
        <p className="about-label">Your next visit</p>
        <h2>
          Make a little room
          <br />
          for <em>yourself.</em>
        </h2>
        <p className="about-body mt-6">
          Hair, nails, and waxing, with care shaped around you.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <a href={BOOKING_URL} className="about-button about-button-dark">
            Book an Appointment <ArrowUpRight size={17} aria-hidden="true" />
          </a>
          <Link href="/contact" className="about-button about-button-outline">
            Contact Us <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
export function HiringSection() {
  return (
    <section className="site-hiring">
      <div className="about-wrap flex flex-wrap items-center justify-between gap-8 py-14">
        <div>
          <p className="about-label">A place to grow</p>
          <h2>
            Good people.
            <br />
            Beautiful <em>work.</em>
          </h2>
          <p className="about-body mt-5">
            We’re hiring. Bring your skills and your care for people to Shanzo
            Salon.
          </p>
        </div>
        <Link href="/apply" className="about-button about-button-outline">
          Apply Now <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
