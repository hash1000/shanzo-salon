import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import SiteShell from '@/components/site/SiteShell';
import PortfolioGallery from '@/components/site/PortfolioGallery';
import { team } from '@/data/team';
import { getPortfolioItems } from '@/lib/portfolio';
import '../team.css';
import '../../gallery/gallery.css';

type Props = { params: Promise<{ slug: string }> };
export async function generateStaticParams() {
  const members = await Promise.all(team.map(async member => (await getPortfolioItems(member)).length ? { slug: member.slug } : null));
  return members.filter(member => member !== null);
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const member = team.find(member => member.slug === slug);
  return { title: member ? `${member.name} | Gold Coast Beauty` : 'Portfolio not found' };
}
export default async function PortfolioPage({ params }: Props) {
  const { slug } = await params;
  const member = team.find(member => member.slug === slug);
  if (!member) notFound();
  const items = await getPortfolioItems(member);
  if (!items.length) notFound();
  return <SiteShell>
    <section className="about-wrap portfolio-profile">
      <Link href="/team" className="about-text-link">← Meet the team</Link>
      <div className="portfolio-profile-grid">
        <div className="portfolio-portrait">{member.image && <Image src={member.image} alt={member.name} fill sizes="(max-width:767px) 85vw, 30vw" className="object-cover object-top" />}</div>
        <div><p className="about-label">{member.service}</p><h1>{member.name}</h1>
          <div className="team-member-bio">{member.bio?.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
        </div>
      </div>
    </section>
    <section aria-labelledby="my-work-title"><div className="about-wrap"><h2 id="my-work-title" className="portfolio-work-title">My <em>Work</em></h2></div><PortfolioGallery items={items} name={member.name} /></section>
    <section className="portfolio-cta about-wrap"><p className="about-label">Your next visit</p><h2>A little time for <em>you.</em></h2><a className="member-button" href={member.bookingUrl} target="_blank" rel="noopener noreferrer">Book with {member.name.split(' ')[0]} <ArrowUpRight size={18} aria-hidden="true" /></a></section>
  </SiteShell>;
}
