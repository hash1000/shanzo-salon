import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import SiteShell, {
  VisitCTA,
  HiringSection,
} from "@/components/site/SiteShell";
import Reveal from "@/components/about/AboutReveal";
import { BOOKING_URL } from "@/lib/site";

const services = [
  {
    name: "Hair",
    text: "A thoughtful cut, a fresh shape, a style that feels like you. Hair care for every member of the family.",
    detail: "Shape. Movement. You.",
  },
  {
    name: "Nails",
    text: "Careful shaping, considered colour, and a polished finish. Personal nail care with attention to the smallest details.",
    detail: "Care in every detail.",
  },
  {
    name: "Waxing",
    text: "Attentive waxing in a calm, private space. We take time to explain the process and put your comfort first.",
    detail: "A softer kind of care.",
  },
];
export default function Home() {
  return (
    <SiteShell>
      <section className="about-hero home-screen-hero" aria-labelledby="home-title">
        <Image
          src="/images/pedicure-lounge.webp"
          alt="Tan pedicure chairs against the textured gold wall at Shanzo Salon"
          fill
          preload
          sizes="100vw"
          className="object-cover"
        />
        <div className="about-hero-shade site-bright-shade" />
        <div className="about-wrap home-hero-content relative z-10 text-center">
          <p className="about-label text-white/85">Shanzo Salon · Chicago</p>
          <h1 id="home-title" className="text-center">
            Revitalize Your <em>Beauty</em> Today
            <br />
          </h1>
          <p>
            Hair, nails, and waxing for men, women, and kids. A warm welcome,
            every visit.
          </p>
          <a
            href={BOOKING_URL}
            className="about-button about-button-light mt-9"
          >
            Book an Appointment <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
        <a href="#welcome" className="about-hero-scroll">
          Discover Shanzo <ArrowDown size={16} aria-hidden="true" />
        </a>
      </section>
      <section
        id="welcome"
        className="about-wrap about-space grid items-center gap-14 lg:grid-cols-2 lg:gap-24"
      >
        <Reveal className="about-story-photos">
          <div className="about-story-main">
            <Image
              src="/images/french-manicure.webp"
              alt="A carefully finished French manicure with white tips"
              fill
              sizes="(max-width:1023px) 85vw,40vw"
              className="object-cover object-left"
            />
          </div>
          <div className="about-story-detail">
            <Image
              src="/images/hair-care.webp"
              alt="A client enjoying a gentle hair wash"
              fill
              sizes="(max-width:1023px) 36vw,18vw"
              className="object-cover"
            />
          </div>
          <span className="about-photo-caption">A warm welcome, always.</span>
        </Reveal>
        <Reveal>
          <p className="about-label">01 / Welcome to Shanzo</p>
          <h2>
            A little time,
            <br />
            beautifully <em>yours.</em>
          </h2>
          <div className="about-rule" />
          <p className="about-body">
            Good care begins with listening. At Shanzo Salon, we make room for
            your preferences, your questions, and the way you want to feel.
          </p>
          <p className="about-body mt-5">
            Find us at 67 W Chicago Ave, Chicago. Come in for a familiar service
            or a fresh start.
          </p>
          <Link href="/about" className="about-text-link mt-7">
            Our story <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </Reveal>
      </section>
      <section className="about-services about-space">
        <div className="about-wrap">
          <Reveal>
            <p className="about-label">02 / What we do</p>
            <h2>
              Considered care.
              <br />
              Every <em>detail.</em>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.name} className="h-full">
                <article className="about-service-card h-full">
                  <span className="about-card-number">0{i + 1}</span>
                  <h3>{s.name}</h3>
                  <p className="about-body">{s.text}</p>
                  <a
                    href={BOOKING_URL}
                    className="about-card-bottom"
                    aria-label={`Book ${s.name.toLowerCase()} services`}
                  >
                    <span>{s.detail}</span>
                    <ArrowUpRight size={20} aria-hidden="true" />
                  </a>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="about-wrap about-space">
        <Reveal>
          <div className="site-highlight">
            <Image
              src="/images/salon-services.webp"
              alt="Shanzo Salon’s manicure tables, pedicure chairs, and warm wood finishes"
              fill
              sizes="(max-width:767px) 100vw,1180px"
              className="object-cover"
            />
            <div className="site-highlight-label">
              <span className="about-label">03 / Our space</span>
              <p>
                Settle in.
                <br />
                Feel at <em>home.</em>
              </p>
            </div>
          </div>
        </Reveal>
      </section>
      <VisitCTA />
      <HiringSection />
    </SiteShell>
  );
}
