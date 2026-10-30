import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight, Scissors, Sparkles, Flower2 } from "lucide-react";
import SiteShell, {
  PageHeading,
  HiringSection,
} from "@/components/site/SiteShell";
import Reveal from "@/components/about/AboutReveal";
import { BOOKING_URL, SITE_NAME } from "@/lib/site";
import "./team.css";

export const metadata: Metadata = {
  title: `Our Team | ${SITE_NAME}`,
  description: `Meet the hair stylists, nail technicians, and esthetician at ${SITE_NAME} in Chicago.`,
};

type TeamMember = {
  name: string;
  initials: string;
  service: string;
  image: string | null;
  bio?: string[];
};

const team: TeamMember[] = [
  {
    name: "Violet Eliza",
    initials: "VE",
    service: "Hair Stylist",
    image: "/violet-eliza.png",
    bio: [
      "With six years behind the chair, Violet specializes in custom blonding, bridal hair and updos, special-occasion styling, and men’s precision cuts.",
      "Her approach is centered on creating effortlessly beautiful, personalized looks tailored to each client—whether that means customized blonde dimension, an elevated style for a special occasion, or a clean, precision cut.",
      "Based in Chicago’s Gold Coast, Violet brings a thoughtful, individualized approach to every appointment, helping each client leave with a look that feels polished, flattering, and uniquely their own.",
    ],
  },
  {
    name: "Ruby Smizer",
    initials: "RS",
    service: "Nail Technician",
    image: "/ruby-smizer.png",
    bio: [
      "Ruby is a talented Nail Technician at Gold Coast Beauty Salon & Spa who enjoys helping clients look and feel their best through beautiful, well-maintained nails.",
      "Offering a variety of services, including classic, gel, and Russian manicures, acrylic nail enhancements, and relaxing pedicures, Ruby is dedicated to providing a personalized experience tailored to each client's preferences.",
      "Whether you're looking for a clean, natural finish, a fresh set of acrylics, or a relaxing spa pedicure, Ruby brings care and attention to detail to every appointment. She understands that nail care is more than just a beauty service—it's an opportunity to unwind, express your personal style, and enjoy a little well-deserved self-care.",
      "Ruby looks forward to welcoming you to Gold Coast Beauty Salon & Spa and helping you leave feeling refreshed, confident, and beautifully polished.",
    ],
  },
  // {
  //   name: "Genean Michele",
  //   initials: "GD",
  //   service: "Hair Stylist",
  //   image: null,
  // },
  // {
  //   name: "Deanna Walsh",
  //   initials: "DW",
  //   service: "Hair Stylist",
  //   image: null,
  // },
  {
    name: "Nina Maney",
    initials: "NM",
    service: "Hair Stylist",
    image: "/nina-maney(Hair Stylist).png",
  },
  {
    name: "Dana Rivera",
    initials: "DR",
    service: "Nail Technician",
    image: "/dana-rivera(Nail Technician) 2026.png",
  },
  {
    name: "Marija Aleksic",
    initials: "MA",
    service: "Nail Technician",
    image: "/marija-aleksic (Nail Technician).png",
  },
  {
    name: "Melanie Ruiz",
    initials: "MR",
    service: "Esthetician",
    image: "/melanie-ruiz(Esthetician).png",
  },
];

export default function TeamPage() {
  return (
    <SiteShell>
      <div className="team-page">
      <PageHeading
        label="01 / The people behind your visit"
        title="Care comes"
        accent="naturally."
      >
        Meet the people who make your visit personal. Hair, nails, and waxing,
        with time to listen.
      </PageHeading>
      <div className="team-intro-details about-wrap">
        <span className="team-intro-note">A personal touch. A beautiful feeling.</span>
        <div className="team-specialties" aria-label="Our specialties">
          <span><Scissors size={15} aria-hidden="true" /> Hair artistry</span>
          <span><Sparkles size={15} aria-hidden="true" /> Nail care</span>
          <span><Flower2 size={15} aria-hidden="true" /> Skin & waxing</span>
        </div>
      </div>
      <Reveal>
        <section className="team about-wrap text-center" aria-label="Our team">
          <ul className="team-grid">
            {team.map((member) => (
              <li
                key={member.name}
                className={`team-member${member.bio ? " team-member-featured" : ""}`}
              >
                <div className={`team-portrait${!member.image ? " team-portrait-placeholder" : ""}`}>
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={`${member.name}, ${member.service}`}
                      fill
                      sizes={member.bio ? "(max-width: 767px) 85vw, (max-width: 1100px) 38vw, 28vw" : "(max-width: 639px) 85vw, 35vw"}
                    />
                  ) : (
                    <span className="team-avatar" aria-hidden="true">
                      {member.initials}
                    </span>
                  )}
                  <span className="team-portrait-mark" aria-hidden="true"><Sparkles size={19} /></span>
                </div>
                <div className="team-member-content">
                  {member.bio && <p className="team-featured-label">Meet your specialist</p>}
                  <h2>{member.name}</h2>
                  <p className="team-member-service">{member.service}</p>
                  {member.bio && (
                    <div className="team-member-bio">
                      {member.bio.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  )}
                  <a href={BOOKING_URL} className="team-book-link" aria-label={`Book an appointment with ${member.name}`}>
                    Book a visit <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </Reveal>
      <HiringSection />
      </div>
    </SiteShell>
  );
}
