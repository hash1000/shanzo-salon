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

const team = [
  {
    name: "Molly Sproles-Barbian",
    initials: "MS",
    service: "Hair Stylist",
    image: "/molly-sproles-Barbian(Hair Stylist).png",
    bio: [
      "With six years of experience as a licensed hairstylist, I’ve built my career across Las Vegas, Arizona, and now Chicago, with each experience shaping my approach behind the chair.",
      "Haircutting is where I truly shine. I love combining technical precision with creativity to create personalized cuts that complement each client’s features, style, and personality. Whether you’re looking for a fresh new look or the perfect shape to bring your current style back to life, my goal is to create hair that feels uniquely you.",
      "Most importantly, I want every client to leave my chair feeling confident and looking their best. I’m passionate about my craft and continually stay inspired by new techniques, trends, and opportunities to elevate the experience I provide.",
    ],
  },
  {
    name: "Genean Michele",
    initials: "GD",
    service: "Hair Stylist",
    image: null,
  },
  {
    name: "Deanna Walsh",
    initials: "DW",
    service: "Hair Stylist",
    image: null,
  },
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
                      loading={member.bio ? "eager" : "lazy"}
                      alt={`${member.name}, ${member.service}`}
                      fill
                      sizes="(max-width: 639px) 84vw, (max-width: 900px) 35vw, 23vw"
                    />
                  ) : (
                    <span className="team-avatar" aria-hidden="true">
                      {member.initials}
                    </span>
                  )}
                  <span className="team-portrait-mark" aria-hidden="true"><Sparkles size={19} /></span>
                </div>
                <div className="team-member-content">
                  {member.bio && <p className="team-featured-label">In the stylist’s chair</p>}
                  <h2>{member.name}</h2>
                  <p className="team-member-service">{member.service}</p>
                  {member.bio && (
                    <div className="team-member-bio">
                      <h3>Bio</h3>
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
