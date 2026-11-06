import type { Metadata } from "next";
import Link from "next/link";
import { team } from "@/data/team";
import { getPortfolioItems } from "@/lib/portfolio";
import Image from "next/image";
import { ArrowUpRight, Scissors, Sparkles, Flower2 } from "lucide-react";
import SiteShell, {
  PageHeading,
  HiringSection,
} from "@/components/site/SiteShell";
import Reveal from "@/components/about/AboutReveal";
import { SITE_NAME } from "@/lib/site";
import "./team.css";

export const metadata: Metadata = {
  title: `Our Team | ${SITE_NAME}`,
  description: `Meet the hair stylists, nail technicians, and esthetician at ${SITE_NAME} in Chicago.`,
};

export default async function TeamPage() {
  const portfolios = new Map(await Promise.all(team.map(async member => [member.slug, await getPortfolioItems(member)] as const)));
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
                  <div className="team-actions"><a href={member.bookingUrl} target="_blank" rel="noopener noreferrer" className="member-button" aria-label={`Book an appointment with ${member.name}`}>
                    Book a visit <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                  {!!portfolios.get(member.slug)?.length && <Link className="member-button member-button-outline" href={`/team/${member.slug}`}>View Portfolio</Link>}
                  </div>
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
